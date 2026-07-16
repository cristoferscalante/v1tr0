"use client";

import React, { useState } from "react";
import { ShopHeroCarousel } from "@/components/shop/hero/ShopHeroCarousel";
import { ProductGrid } from "@/components/shop/products/ProductGrid";
import { CartDrawer } from "@/components/shop/cart/CartDrawer";
import { FloatingCartTab } from "@/components/shop/cart/FloatingCartTab";
import { mockProducts } from "@/lib/data/mockProducts";
import type { Product } from "@/components/shop/products/ProductCard";
import BackgroundAnimation from "@/components/home/animations/BackgroundAnimation";

interface CartItem extends Product {
  quantity: number;
}

export default function TiendaPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showCartNotification, setShowCartNotification] = useState(false);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      
      if (existingItem) {
        // Incrementar cantidad
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Agregar nuevo producto
        return [...prev, { ...product, quantity: 1 }];
      }
    });

    setShowCartNotification(true);
    setTimeout(() => {
      setShowCartNotification(false);
    }, 2000);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity === 0) {
      handleRemoveItem(productId);
      return;
    }

    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  // Productos recomendados (aleatorios que no están en el carrito)
  const recommendedProducts = mockProducts
    .filter((product) => !cart.find((item) => item.id === product.id))
    .slice(0, 3);

  return (
    <>
      {/* Fondo animado del home reutilizable */}
      <BackgroundAnimation />
      
      <div className="min-h-screen relative">
        {/* Hero Section with Carousel */}
        <ShopHeroCarousel />

      {/* Transición suave y minimalista */}
      <div className="h-16 bg-gradient-to-b from-transparent to-[#0b0b0c]/50" />

      {/* Products Grid Section */}
      <ProductGrid products={mockProducts} onAddToCart={handleAddToCart} />

      {/* Footer viene del layout, no duplicarlo aquí */}

      {/* Floating Cart Tab - Botón desplegable desde la derecha */}
      <FloatingCartTab 
        onToggle={setIsCartOpen}
        cartCount={totalItems}
        isCartOpen={isCartOpen}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        recommendedProducts={recommendedProducts}
        onAddRecommended={handleAddToCart}
      />

      {/* Cart Notification Toast */}
      {showCartNotification && (
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
  );
}
