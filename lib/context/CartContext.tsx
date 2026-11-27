"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useSession } from "next-auth/react";
import { telegramLink } from "@/lib/contacto";

/**
 * Mientras el login no funcione bien, la tienda no usa carrito ni pasarela:
 * "Agregar" y "Pagar" abren Telegram con el producto ya escrito en el mensaje.
 * Para volver al carrito con sesión y Wompi, pasar a `false`.
 */
export const TIENDA_POR_TELEGRAM = true;

/** Abre el chat de Telegram con el interés ya redactado (pestaña nueva). */
export function pedirPorTelegram(interes: string) {
  window.open(telegramLink(`${interes} (tienda v1tr0.com)`), "_blank", "noopener,noreferrer");
}

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
  /** Devuelve `true` si quedó en el carrito (para mostrar el aviso de "agregado"). */
  addToCart: (productId: string, productName?: string) => Promise<boolean>;
  checkout: () => Promise<void>;
  checkingOut: boolean;
  checkoutError: string | null;
  dismissCheckoutError: () => void;
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
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

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

  const addToCart = async (productId: string, productName?: string) => {
    // Sin await antes de abrir: si no, el navegador lo trata como popup y lo bloquea.
    if (TIENDA_POR_TELEGRAM) {
      pedirPorTelegram(productName ?? "un producto de la tienda");
      return false;
    }
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });
    // Sin sesión el carrito vive en el servidor: mandamos a iniciar sesión
    // en lugar de dejar que el clic no haga nada.
    if (res.status === 401) {
      window.location.href = "/login";
      return false;
    }
    await fetchCart();
    return res.ok;
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

  /**
   * Checkout centralizado: antes vivía duplicado en las dos páginas de tienda
   * y descartaba los errores en silencio, así que un fallo de la pasarela
   * dejaba el botón "Procesando..." sin decirle nada al usuario.
   */
  const checkout = async () => {
    if (TIENDA_POR_TELEGRAM) {
      const items = cart.map((item) => `${item.quantity} × ${item.name ?? "producto"}`).join(", ");
      pedirPorTelegram(items || "comprar en la tienda");
      return;
    }
    setCheckingOut(true);
    setCheckoutError(null);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      if (res.status === 401) {
        window.location.href = "/login";
        return;
      }

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setCheckoutError(data.error ?? "No pudimos iniciar el pago. Intenta de nuevo.");
        return;
      }
      if (!data.wompiUrl) {
        setCheckoutError("La pasarela de pago no está disponible en este momento.");
        return;
      }

      window.location.href = data.wompiUrl;
    } catch {
      setCheckoutError("No pudimos conectar con la pasarela de pago. Revisa tu conexión.");
    } finally {
      setCheckingOut(false);
    }
  };

  const dismissCheckoutError = () => setCheckoutError(null);

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
        checkout, checkingOut, checkoutError, dismissCheckoutError,
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
