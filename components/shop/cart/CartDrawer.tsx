"use client";

import React from "react";
import Image from "next/image";
import { X, Minus, Plus, ShoppingCart } from "lucide-react";
interface FlatCartItem {
  id: string;
  name: string | null;
  quantity: number;
  price: number;
  image: string;
  category?: string;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: FlatCartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  recommendedProducts?: { id: string; name: string; image: string }[];
  onAddRecommended?: (product: { id: string }) => void;
  onCheckout?: () => void;
  checkoutLoading?: boolean;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  recommendedProducts,
  onAddRecommended,
  onCheckout,
  checkoutLoading,
}) => {
  // Calcular total
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const freeShippingThreshold = 100000; // $100,000 para envío gratis
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercentage = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[70] transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[480px] bg-[#e6f7f6] dark:bg-[#02505931] backdrop-blur-sm border-l border-[#08A696]/60 dark:border-[#08A696]/20 z-[80] transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#08A696]/60 dark:border-[#08A696]/20">
            <h2 className="text-2xl font-bold text-[#04423c] dark:text-[#26FFDF] flex items-center gap-2">
              CARRITO
              <span className="text-[#085c54] dark:text-[#b2fff6] text-lg">({cartItems.length} {cartItems.length !== 1 ? 'ARTÍCULOS' : 'ARTÍCULO'})</span>
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#08A696]/10 dark:hover:bg-[#02505950] rounded-lg transition-colors"
              aria-label="Cerrar carrito"
            >
              <X className="w-6 h-6 text-[#085c54] dark:text-[#b2fff6]" />
            </button>
          </div>

          {/* Free Shipping Progress */}
          {remainingForFreeShipping > 0 && (
            <div className="px-6 py-4 bg-[#c5ebe7] dark:bg-[#02505950] border-b border-[#08A696]/40 dark:border-[#08A696]/20">
              <p className="text-sm text-[#04423c] dark:text-[#b2fff6] text-center mb-2">
                ¡Solo <span className="font-bold text-[#08A696] dark:text-[#26FFDF]">${remainingForFreeShipping.toLocaleString()} COP</span> para envío gratis!
              </p>
              <div className="w-full h-2 bg-white/50 dark:bg-[#025159]/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#08A696] to-[#26FFDF] transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart Items - Scrollable */}
          <div className="flex-1 overflow-y-auto scrollbar-thin px-6 py-4 space-y-4">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <ShoppingCart className="w-20 h-20 text-[#085c54]/50 dark:text-[#b2fff6]/50" />
                <p className="text-[#085c54] dark:text-[#b2fff6] text-lg">Tu carrito está vacío</p>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-[#08A696] text-white rounded-xl font-semibold hover:scale-105 transition-transform hover:shadow-lg hover:shadow-[#08A696]/20"
                >
                  Continuar comprando
                </button>
              </div>
            ) : (
              <>
                {/* Cart Items List */}
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 bg-white/70 dark:bg-[#02505950] backdrop-blur-sm rounded-2xl border border-[#08A696]/60 dark:border-[#08A696]/30 hover:border-[#08A696] dark:hover:border-[#26FFDF] transition-colors"
                  >
                    {/* Product Image */}
                    <div className="relative w-24 h-24 flex-shrink-0 bg-white/50 dark:bg-[#025159]/30 rounded-lg overflow-hidden">
                      <Image
                        src={item.image || "/imagenes/placeholders/placeholder.jpg"}
                        alt={item.name ?? "Producto"}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-[#04423c] dark:text-[#26FFDF] font-semibold text-sm line-clamp-2">
                          {item.name}
                        </h3>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-[#085c54] dark:text-[#b2fff6] hover:text-red-500 dark:hover:text-red-400 transition-colors flex-shrink-0"
                          aria-label="Eliminar producto"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Category */}
                      <p className="text-[#085c54] dark:text-[#b2fff6] text-xs mb-3">
                        {item.category ?? "Producto"}
                      </p>

                      {/* Price & Quantity */}
                      <div className="flex items-center justify-between">
                        <span className="text-[#04423c] dark:text-[#26FFDF] font-bold text-lg">
                          ${item.price.toLocaleString()} COP
                        </span>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 bg-white/50 dark:bg-[#025159]/30 rounded-lg p-1">
                          <button
                            onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="p-1.5 hover:bg-[#08A696]/20 dark:hover:bg-[#08A696]/30 rounded transition-colors"
                            aria-label="Disminuir cantidad"
                          >
                            <Minus className="w-4 h-4 text-[#08A696] dark:text-[#26FFDF]" />
                          </button>
                          <span className="text-[#04423c] dark:text-[#26FFDF] font-semibold min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="p-1.5 hover:bg-[#08A696]/20 dark:hover:bg-[#08A696]/30 rounded transition-colors"
                            aria-label="Aumentar cantidad"
                          >
                            <Plus className="w-4 h-4 text-[#08A696] dark:text-[#26FFDF]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Recommended Products */}
                {recommendedProducts && recommendedProducts.length > 0 && (
                  <div className="pt-6 border-t border-[#08A696]/60 dark:border-[#08A696]/20">
                    <h3 className="text-[#04423c] dark:text-[#26FFDF] font-semibold mb-4">También te puede gustar:</h3>
                    <div className="space-y-3">
                      {recommendedProducts.slice(0, 2).map((product) => (
                        <div
                          key={product.id}
                          className="flex gap-3 p-3 bg-white/50 dark:bg-[#02505950] rounded-lg border border-[#08A696]/40 dark:border-[#08A696]/20 hover:border-[#08A696] dark:hover:border-[#26FFDF] transition-colors"
                        >
                          <div className="relative w-20 h-20 flex-shrink-0 bg-white/50 dark:bg-[#025159]/30 rounded-lg overflow-hidden">
                            <Image
                              src={product.image || "/imagenes/placeholders/placeholder.jpg"}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-[#04423c] dark:text-[#26FFDF] font-medium text-sm line-clamp-2 mb-2">
                              {product.name}
                            </h4>
                            <div className="flex items-center justify-between">
                              <span className="text-[#08A696] dark:text-[#26FFDF] font-bold">
                                {"price" in product ? `$${Number(product.price).toLocaleString()} COP` : ""}
                              </span>
                              <button
                                  onClick={() => onAddRecommended?.(product)}
                                className="px-3 py-1.5 bg-[#08A696] text-white text-xs font-semibold rounded-lg hover:scale-105 transition-transform hover:shadow-lg hover:shadow-[#08A696]/20"
                              >
                                Agregar
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer - Totals & Checkout */}
          {cartItems.length > 0 && (
            <div className="border-t border-[#08A696]/60 dark:border-[#08A696]/20 p-6 space-y-4 bg-[#c5ebe7] dark:bg-[#02505950]">
              {/* Total */}
              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-xl font-bold text-[#04423c] dark:text-[#26FFDF]">Total</span>
                  <span className="text-3xl font-bold text-[#04423c] dark:text-[#26FFDF]">
                    ${subtotal.toLocaleString()} COP
                  </span>
                </div>
                <p className="text-[#085c54] dark:text-[#b2fff6] text-xs">
                  Impuestos y envío calculados al finalizar la compra
                </p>
              </div>

              {/* Checkout Button */}
              <button
                onClick={onCheckout}
                disabled={checkoutLoading}
                className="w-full py-4 bg-[#08A696] text-white rounded-2xl font-bold text-lg hover:scale-[1.02] hover:shadow-xl hover:shadow-[#08A696]/30 transition-all duration-300 border-2 border-[#08A696] hover:border-[#26FFDF] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {checkoutLoading ? "Procesando..." : "Finalizar compra"}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
