"use client"

import { use, useState, useEffect } from "react"
import { notFound, useRouter } from "next/navigation"
import BackgroundAnimation from "@/components/home/animations/BackgroundAnimation"
import { getProductBySlug, getRelatedProducts } from "@/lib/data/mockProducts"
import type { ProductDetailed } from "@/lib/data/mockProducts"
import { ProductGallery } from "@/components/shop/product-detail/ProductGallery"
import { resolveProductImage } from "@/lib/data/productImages"
import { ProductInfo } from "@/components/shop/product-detail/ProductInfo"
import { ProductSpecifications } from "@/components/shop/product-detail/ProductSpecifications"
import { RelatedProducts } from "@/components/shop/product-detail/RelatedProducts"
import { CartDrawer } from "@/components/shop/cart/CartDrawer"
import { FloatingCartTab } from "@/components/shop/cart/FloatingCartTab"
import { useCart } from "@/lib/context/CartContext"
import { PackagePromotion } from "@/components/shop/packages/PackagePromotion"
import type { FolioRecharge, Plan, Product as PackageProduct } from "@/components/shop/packages/PackagePromotion"
import { posPlans, posProducts, folioRecharges } from "@/lib/data/posPackageData"
import { hardwarePlans, hardwareProducts } from "@/lib/data/hardwarePackageData"
import { iotPlans, iotProducts } from "@/lib/data/iotPackageData"

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

/** Promociones de paquete servidas por slug (no viven en la tabla products). */
const PACKAGE_PROMOTIONS: Record<
  string,
  {
    title: string
    subtitle: string
    heroImage: string
    plans: Plan[]
    products: PackageProduct[]
    folioRecharges?: FolioRecharge[]
  }
> = {
  "sistema-pos-gestion-negocio": {
    title: "Sistema POS para tu Negocio",
    subtitle: "Planes flexibles adaptados a tus necesidades, desde pruebas gratuitas hasta facturación electrónica completa",
    heroImage: "/imagenes/tienda/pos.png",
    plans: posPlans,
    products: posProducts,
    folioRecharges: folioRecharges,
  },
  "hardware-v1tr0-pro": {
    title: "Hardware V1TR0 Profesional",
    subtitle: "Kits especializados para desarrollo IoT, ciberseguridad y proyectos avanzados",
    heroImage: "/imagenes/home/carrusel/desarrollo_web_end_backup.webp",
    plans: hardwarePlans,
    products: hardwareProducts,
  },
  "sistemas-comunicacion-iot": {
    title: "Sistemas de Comunicación IoT",
    subtitle: "Soluciones de conectividad de largo alcance con LoRa, WiFi y redes mesh",
    heroImage: "/imagenes/tienda/heltec-duo-con-efecto.png",
    plans: iotPlans,
    products: iotProducts,
  },
}

/** Fila pública de la tabla products (misma forma que usa /tienda). */
interface ProductRow {
  id: string; name: string; slug: string; description: string | null
  price: string; originalPrice: string | null; category: string
  stock: number; images: string[] | null; isFeatured: boolean; badge: string | null
}

function rowToDetailedProduct(row: ProductRow): ProductDetailed {
  const images = (row.images ?? []).filter(Boolean)
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? "",
    price: Number(row.price),
    ...(row.originalPrice ? { originalPrice: Number(row.originalPrice) } : {}),
    image: resolveProductImage({ image: images[0] ?? null, slug: row.slug, category: row.category }),
    category: row.category,
    stock: row.stock,
    featured: row.isFeatured,
    ...(row.badge ? { badge: row.badge } : {}),
    ...(images.length ? { images } : {}),
  }
}

export default function TiendaSlugPage({ params }: PageProps) {
  const { slug } = use(params)
  const { cart, addToCart, updateQuantity, removeItem, totalItems, isCartOpen, openCart, closeCart } = useCart()
  const [showNotification, setShowNotification] = useState(false)

  // El catálogo real (/api/products) y el catálogo mock conviven: primero se
  // busca en el mock y, si no está, se pide la ficha a la base de datos.
  const mockProduct = getProductBySlug(slug)
  const isPackageSlug = slug in PACKAGE_PROMOTIONS
  const [dbProduct, setDbProduct] = useState<ProductDetailed | null>(null)
  const [dbState, setDbState] = useState<"idle" | "loading" | "missing">(
    mockProduct || isPackageSlug ? "idle" : "loading"
  )

  useEffect(() => {
    if (mockProduct || isPackageSlug) { return undefined }

    let cancelled = false
    setDbState("loading")

    fetch(`/api/products/${slug}`)
      .then(async (res) => {
        if (!res.ok) { throw new Error("not found") }
        const data = await res.json()
        if (cancelled) { return }
        setDbProduct(rowToDetailedProduct(data.product as ProductRow))
        setDbState("idle")
      })
      .catch(() => {
        if (!cancelled) { setDbState("missing") }
      })

    return () => { cancelled = true }
  }, [slug, mockProduct, isPackageSlug])

  const product = mockProduct ?? dbProduct

  const handleAddToCart = () => {
    if (!product) {return}
    addToCart(product.id)
    setShowNotification(true)
  }

  useEffect(() => {
    if (!showNotification) {return}
    const t = setTimeout(() => setShowNotification(false), 2000)
    return () => clearTimeout(t)
  }, [showNotification])

  const flatCartItems = cart.map(item => ({
    id: item.id,
    name: item.name ?? "Producto",
    quantity: item.quantity,
    price: Number(item.priceSnapshot) || 0,
    image: item.image?.[0] ?? "/imagenes/placeholders/placeholder.jpg",
  }))

  const router = useRouter()
  const [checkingOut, setCheckingOut] = useState(false)

  const handleCheckout = async () => {
    setCheckingOut(true)
    try {
      const res = await fetch("/api/checkout", { method: "POST" })
      if (res.status === 401) { router.push("/login"); return }
      if (!res.ok) {return}
      const data = await res.json()
      if (data.wompiUrl) {window.location.href = data.wompiUrl}
    } catch {
      // silent
    } finally {
      setCheckingOut(false)
    }
  }

  // Ficha del catálogo real todavía en vuelo: nada que decidir aún.
  if (dbState === "loading") {
    return (
      <>
        <BackgroundAnimation />
        <div className="min-h-screen relative flex items-center justify-center">
          <p className="text-textMuted text-sm">Cargando producto…</p>
        </div>
      </>
    )
  }

  if (product) {
    // Los relacionados sólo existen en el catálogo mock.
    const related = mockProduct ? getRelatedProducts(product.id) : []

    return (
      <>
        <BackgroundAnimation />
        <div className="min-h-screen relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-8 lg:mb-16">
              <ProductGallery
                images={
                  product.images?.length
                    ? product.images
                    : [resolveProductImage({ image: product.image, slug: product.slug, category: product.category })]
                }
                productName={product.name}
              />
              <ProductInfo product={product} onAddToCart={handleAddToCart} />
            </div>
            {product.specifications && <ProductSpecifications specifications={product.specifications} />}
            {related.length > 0 && (
              <RelatedProducts products={related} onAddToCart={(p) => { addToCart(p.id); setShowNotification(true) }} />
            )}
          </div>

          <FloatingCartTab onToggle={(open) => open ? openCart() : closeCart()} cartCount={totalItems} isCartOpen={isCartOpen} />
          <CartDrawer
            isOpen={isCartOpen}
            onClose={closeCart}
            cartItems={flatCartItems}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeItem}
            onCheckout={handleCheckout}
            checkoutLoading={checkingOut}
          />

          {showNotification && (
            <div className="fixed top-20 inset-x-4 sm:inset-x-auto sm:right-8 sm:top-24 max-w-sm z-50 animate-slide-in-down">
              <div className="bg-primary text-background px-6 py-4 rounded-xl shadow-glow flex items-center gap-3">
                <div className="w-10 h-10 bg-background/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl">✓</span>
                </div>
                <div>
                  <p className="font-semibold">Agregado al carrito</p>
                  <p className="text-sm opacity-90">
                    {totalItems} {totalItems === 1 ? "producto" : "productos"} en total
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </>
    )
  }

  const promotion = PACKAGE_PROMOTIONS[slug]
  if (!promotion) { notFound() }

  return (
    <>
      <BackgroundAnimation />
      <div className="min-h-screen relative">
        <PackagePromotion
          title={promotion.title}
          subtitle={promotion.subtitle}
          heroImage={promotion.heroImage}
          plans={promotion.plans}
          products={promotion.products}
          {...(promotion.folioRecharges && { folioRecharges: promotion.folioRecharges })}
        />
        <FloatingCartTab onToggle={openCart} cartCount={totalItems} isCartOpen={isCartOpen} />
        <CartDrawer
            isOpen={isCartOpen}
            onClose={closeCart}
            cartItems={flatCartItems}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeItem}
            onCheckout={handleCheckout}
            checkoutLoading={checkingOut}
          />
      </div>
    </>
  )
}
