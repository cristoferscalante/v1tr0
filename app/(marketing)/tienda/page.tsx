"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShopHeroCarousel } from "@/components/shop/hero/ShopHeroCarousel";
import { ProductGrid } from "@/components/shop/products/ProductGrid";
import { CartDrawer } from "@/components/shop/cart/CartDrawer";
import { FloatingCartTab } from "@/components/shop/cart/FloatingCartTab";
import type { Product } from "@/components/shop/products/ProductCard";
import BackgroundAnimation from "@/components/home/animations/BackgroundAnimation";
import { resolveProductImage } from "@/lib/data/productImages";
import { useCart } from "@/lib/context/CartContext";

interface ProductRow {
  id: string; name: string; slug: string; description: string | null
  price: string; originalPrice: string | null; category: string
  stock: number; images: string[]; isFeatured: boolean; badge: string | null
}

function rowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? "",
    price: Number(row.price),
    ...(row.originalPrice ? { originalPrice: Number(row.originalPrice) } : {}),
    image: resolveProductImage({ image: row.images?.[0] ?? null, slug: row.slug, category: row.category }),
    category: row.category,
    stock: row.stock,
    featured: row.isFeatured,
    ...(row.badge ? { badge: row.badge } : {}),
  };
}

export default function TiendaPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([]);
  const [showCartNotification, setShowCartNotification] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false)

  // Carrito compartido (persistido en el servidor): mismo que usa la ficha
  // de producto y el que lee /api/checkout.
  const { cart, addToCart, updateQuantity, removeItem, totalItems, isCartOpen, openCart, closeCart } = useCart()

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts((data.products as ProductRow[]).map(rowToProduct)))
      .catch(() => setProducts([]));
  }, []);

  const handleAddToCart = async (product: { id: string }) => {
    await addToCart(product.id)
    setShowCartNotification(true);
    setTimeout(() => setShowCartNotification(false), 2000);
  };

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

  const flatCartItems = cart.map((item) => ({
    id: item.id,
    name: item.name ?? "Producto",
    quantity: item.quantity,
    price: Number(item.priceSnapshot) || 0,
    image: resolveProductImage({
      image: item.image?.[0] ?? null,
      slug: item.slug ?? undefined,
    }),
  }))

  // Recomendados: productos del catálogo que aún no están en el carrito
  const recommendedProducts = products
    .filter((product) => !cart.some((item) => item.productId === product.id))
    .slice(0, 3);

  return (
    <>
      {/* Fondo animado del home reutilizable */}
      <BackgroundAnimation />
      
      <div className="min-h-screen relative">
        {/* Hero Section with Carousel */}
        <ShopHeroCarousel />

      {/* Transición suave - el gradiente del hero ya cubre la degradación */}
      <div className="h-4 bg-background" />

      {/* Products Grid Section */}
      <ProductGrid products={products} onAddToCart={handleAddToCart} />

      {/* Footer viene del layout, no duplicarlo aquí */}

      {/* Floating Cart Tab - Botón desplegable desde la derecha */}
      <FloatingCartTab
        onToggle={(open) => (open ? openCart() : closeCart())}
        cartCount={totalItems}
        isCartOpen={isCartOpen}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={closeCart}
        cartItems={flatCartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        recommendedProducts={recommendedProducts}
        onAddRecommended={handleAddToCart}
        onCheckout={handleCheckout}
        checkoutLoading={checkingOut}
      />

      {/* Cart Notification Toast */}
      {showCartNotification && (
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
  );
}
