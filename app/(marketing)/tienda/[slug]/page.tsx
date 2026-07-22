"use client"

import { use, useState, useEffect } from "react"
import { notFound, useRouter } from "next/navigation"
import BackgroundAnimation from "@/components/home/animations/BackgroundAnimation"
import { getProductBySlug, getRelatedProducts } from "@/lib/data/mockProducts"
import { ProductGallery } from "@/components/shop/product-detail/ProductGallery"
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

export default function TiendaSlugPage({ params }: PageProps) {
  const { slug } = use(params)
  const { cart, addToCart, updateQuantity, removeItem, totalItems, isCartOpen, openCart, closeCart } = useCart()
  const [showNotification, setShowNotification] = useState(false)

  const product = getProductBySlug(slug)

  const handleAddToCart = () => {
    if (!product) return
    addToCart(product.id)
    setShowNotification(true)
  }

  useEffect(() => {
    if (!showNotification) return
    const t = setTimeout(() => setShowNotification(false), 2000)
    return () => clearTimeout(t)
  }, [showNotification])

  const flatCartItems = cart.map(item => ({
    id: item.productId,
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
      if (!res.ok) return
      const data = await res.json()
      if (data.wompiUrl) window.location.href = data.wompiUrl
    } catch {
      // silent
    } finally {
      setCheckingOut(false)
    }
  }

  if (product) {
    const related = getRelatedProducts(product.id)

    return (
      <>
        <BackgroundAnimation />
        <div className="min-h-screen relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
              <ProductGallery images={product.images || [product.image]} productName={product.name} />
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
            onUpdateQuantity={(productId, qty) => updateQuantity(productId, qty)}
            onRemoveItem={removeItem}
            onCheckout={handleCheckout}
            checkoutLoading={checkingOut}
          />

          {showNotification && (
            <div className="fixed top-24 right-8 z-50 animate-slide-in-down">
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

  let title = ""
  let subtitle = ""
  let heroImage = ""
  let plans: Plan[] = []
  let pkgProducts: PackageProduct[] = []
  let folios: FolioRecharge[] | undefined = undefined

  switch (slug) {
    case "sistema-pos-gestion-negocio":
      title = "Sistema POS para tu Negocio"
      subtitle = "Planes flexibles adaptados a tus necesidades, desde pruebas gratuitas hasta facturación electrónica completa"
      heroImage = "/imagenes/tienda/pos.png"
      plans = posPlans
      pkgProducts = posProducts
      folios = folioRecharges
      break

    case "hardware-v1tr0-pro":
      title = "Hardware V1TR0 Profesional"
      subtitle = "Kits especializados para desarrollo IoT, ciberseguridad y proyectos avanzados"
      heroImage = "/imagenes/home/carrusel/desarrollo_web_end_backup.webp"
      plans = hardwarePlans
      pkgProducts = hardwareProducts
      break

    case "sistemas-comunicacion-iot":
      title = "Sistemas de Comunicación IoT"
      subtitle = "Soluciones de conectividad de largo alcance con LoRa, WiFi y redes mesh"
      heroImage = "/imagenes/tienda/heltec-duo-con-efecto.png"
      plans = iotPlans
      pkgProducts = iotProducts
      break

    default:
      notFound()
  }

  return (
    <>
      <BackgroundAnimation />
      <div className="min-h-screen relative">
        <PackagePromotion
          title={title}
          subtitle={subtitle}
          heroImage={heroImage}
          plans={plans}
          products={pkgProducts}
          {...(folios && { folioRecharges: folios })}
        />
        <FloatingCartTab onToggle={openCart} cartCount={totalItems} isCartOpen={isCartOpen} />
        <CartDrawer
            isOpen={isCartOpen}
            onClose={closeCart}
            cartItems={flatCartItems}
            onUpdateQuantity={(productId, qty) => updateQuantity(productId, qty)}
            onRemoveItem={removeItem}
            onCheckout={handleCheckout}
            checkoutLoading={checkingOut}
          />
      </div>
    </>
  )
}
