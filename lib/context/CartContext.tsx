"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useSession } from "next-auth/react";

interface CartItem {
  id: string;
  productId: string;
  name: string | null;
  slug: string | null;
  quantity: number;
  priceSnapshot: string;
  image: string[] | null;
  productType: string | null;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (productId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  loading: boolean;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!session?.user) {
      setCart([]);
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/cart");
      if (res.ok) {
        const data = await res.json();
        setCart(data.items ?? []);
      }
    } catch {
      setCart([]);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId: string) => {
    await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });
    await fetchCart();
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    await fetch("/api/cart", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId, quantity }),
    });
    await fetchCart();
  };

  const removeItem = async (itemId: string) => {
    await fetch(`/api/cart?itemId=${itemId}`, { method: "DELETE" });
    await fetchCart();
  };

  const clearCart = async () => {
    await fetch("/api/cart?clear=true", { method: "DELETE" });
    setCart([]);
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  useEffect(() => {
    const handleToggleCart = () => toggleCart();
    window.addEventListener("toggleCart", handleToggleCart);
    return () => window.removeEventListener("toggleCart", handleToggleCart);
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart, addToCart, updateQuantity, removeItem, clearCart,
        totalItems, loading, isCartOpen, openCart, closeCart, toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
