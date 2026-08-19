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
        className={`fixed top-0 right-0 h-[100dvh] w-full sm:w-[480px] bg-[#f4faf9] dark:bg-[#17191b] border-l border-[#08A696]/25 dark:border-[#08A696]/25 z-[80] transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#08A696]/20">
            <h2 className="text-xl font-bold text-[#08A696] dark:text-[#26FFDF] flex items-center gap-2">
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
            <div className="px-6 py-4 bg-[#08A696]/5 dark:bg-[#202325] border-b border-[#08A696]/20">
              <p className="text-sm text-[#04423c] dark:text-[#b2fff6] text-center mb-2">
                ¡Solo <span className="font-bold text-[#08A696] dark:text-[#26FFDF]">${remainingForFreeShipping.toLocaleString()} COP</span> para envío gratis!
              </p>
              <div className="w-full h-2 bg-white/50 dark:bg-[#2b2e31] rounded-full overflow-hidden">
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
                  className="shop-btn inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm"
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
                    className="flex gap-4 p-4 rounded-2xl border transition-all duration-300 bg-white/60 border-[#08A696]/20 hover:border-[#08A696]/60 dark:bg-[#1e2123] dark:border-[#08A696]/15 dark:hover:border-[#26FFDF]/60"
                  >
                    {/* Product Image */}
                    <div className="relative w-16 h-16 sm:w-24 sm:h-24 flex-shrink-0 bg-white/50 dark:bg-[#232629] rounded-lg overflow-hidden">
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
                          className="p-2.5 -m-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#085c54] dark:text-[#b2fff6] hover:text-red-500 dark:hover:text-red-400 transition-colors flex-shrink-0"
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
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <span className="text-[#04423c] dark:text-[#26FFDF] font-bold text-base sm:text-lg">
                          ${item.price.toLocaleString()} COP
                        </span>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 self-start sm:self-auto bg-white/50 dark:bg-[#232629] rounded-lg p-1">
                          <button
                            onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-[#08A696]/20 dark:hover:bg-[#08A696]/30 rounded transition-colors"
                            aria-label="Disminuir cantidad"
                          >
                            <Minus className="w-4 h-4 text-[#08A696] dark:text-[#26FFDF]" />
                          </button>
                          <span className="text-[#04423c] dark:text-[#26FFDF] font-semibold min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-[#08A696]/20 dark:hover:bg-[#08A696]/30 rounded transition-colors"
                            aria-label="Aumentar cantidad"
                          >
                            <Plus className="w-4 h-4 text-[#08A696] dark:text-[#26FFDF]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

              </>
            )}
          </div>

            {/* Recomendados: bloque secundario, con textura rayada para
                diferenciarlo de los artículos que sí están en el carrito */}
            {cartItems.length > 0 && recommendedProducts && recommendedProducts.length > 0 && (
              <div
                className="mx-6 mb-4 rounded-2xl border border-[#08A696]/20 p-3.5"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(135deg, rgba(8,166,150,0.07) 0px, rgba(8,166,150,0.07) 2px, transparent 2px, transparent 9px)",
                }}
              >
                <h3 className="text-[11px] uppercase tracking-[0.18em] text-[#08A696]/80 dark:text-[#26FFDF]/80 mb-3">
                  También te puede gustar
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {recommendedProducts.slice(0, 3).map((product) => (
                    <div
                      key={product.id}
                      className="flex flex-col rounded-xl border p-1.5 transition-all duration-300 bg-white/70 border-[#08A696]/20 hover:border-[#08A696]/60 dark:bg-[#1e2123] dark:border-[#08A696]/15 dark:hover:border-[#26FFDF]/60"
                    >
                      <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-[#08A696]/5">
                        <Image
                          src={product.image || "/imagenes/placeholders/placeholder.jpg"}
                          alt={product.name}
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      </div>
                      <h4 className="mt-1.5 text-[10px] font-semibold leading-tight line-clamp-2 text-[#04423c] dark:text-[#26FFDF]">
                        {product.name}
                      </h4>
                      <div className="mt-auto pt-1.5 flex items-center justify-between gap-1">
                        <span className="text-[10px] font-bold text-[#08A696] dark:text-[#26FFDF] truncate">
                          {"price" in product ? `$${Number(product.price).toLocaleString()}` : ""}
                        </span>
                        <button
                          onClick={() => onAddRecommended?.(product)}
                          aria-label={`Agregar ${product.name} al carrito`}
                          className="w-5 h-5 flex-shrink-0 inline-flex items-center justify-center rounded-md border text-xs font-bold transition-all duration-300 bg-[#c5ebe7] text-[#08A696] border-[#08A696]/50 hover:bg-[#b3e4df] dark:bg-[#0d5d5d]/60 dark:text-[#26FFDF] dark:border-[#26FFDF]/40 dark:hover:bg-[#0d5d5d]/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#26FFDF]/60"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Footer - Totals & Checkout */}
          {cartItems.length > 0 && (
            <div className="border-t border-[#08A696]/20 p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] space-y-4 bg-[#08A696]/5 dark:bg-[#202325]">
              {/* Total */}
              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-xl font-bold text-[#04423c] dark:text-[#26FFDF]">Total</span>
                  <span className="text-2xl font-bold text-[#08A696] dark:text-[#26FFDF]">
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
                className="shop-btn w-full py-3.5 rounded-2xl text-base font-bold"
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
