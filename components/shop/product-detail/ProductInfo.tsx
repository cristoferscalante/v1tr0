"use client";

import React, { useState } from "react";
import { ShoppingCart, Heart, Package, Truck, Shield } from "lucide-react";
import { formatCurrency } from "@/config/site";
import type { ProductDetailed, ProductVariant } from "@/lib/data/mockProducts";

interface ProductInfoProps {
  product: ProductDetailed;
  onAddToCart?: () => void;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({ product, onAddToCart }) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants?.[0] || null
  );
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const currentPrice = selectedVariant?.price || product.price;
  const currentStock = selectedVariant?.stock || product.stock;
  const isOutOfStock = currentStock === 0;

  const handleAddToCart = () => {
    if (!isOutOfStock) {
      onAddToCart?.();
    }
  };

  return (
    <div className="space-y-8">
      {/* Category & Badge */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="px-3 py-1 shop-inset border shop-border rounded-full text-primary text-xs font-semibold uppercase tracking-wide">
          {product.category}
        </span>
        {product.badge && (
          <span className="px-3 py-1 bg-primary text-background rounded-full text-xs font-bold uppercase">
            {product.badge}
          </span>
        )}
      </div>

      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white leading-tight mb-4">
          {product.name}
        </h1>
        <p className="text-lg text-textSecondary leading-relaxed">
          {product.description}
        </p>
      </div>

      {/* Price */}
      <div className="py-6 border-y border-primary/20">
        <div className="flex flex-wrap items-baseline gap-2 sm:gap-4">
          <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            {formatCurrency(currentPrice)}
          </span>
          {product.originalPrice && (
            <span className="text-2xl text-textSecondary line-through">
              {formatCurrency(product.originalPrice)}
            </span>
          )}
        </div>
        {product.originalPrice && (
          <p className="text-green-500 font-semibold mt-2">
            Ahorra {formatCurrency(product.originalPrice - currentPrice)} (
            {Math.round(((product.originalPrice - currentPrice) / product.originalPrice) * 100)}% OFF)
          </p>
        )}
      </div>

      {/* Variants */}
      {product.variants && product.variants.length > 0 && (
        <div className="space-y-3">
          <label className="text-white font-semibold">Selecciona Plan:</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {product.variants.map((variant) => (
              <button
                key={variant.id}
                onClick={() => setSelectedVariant(variant)}
                className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                  selectedVariant?.id === variant.id
                    ? "border-primary bg-primary/10 scale-95"
                    : "border-primary/20 shop-inset shop-border-hover"
                }`}
              >
                <p className="text-white font-semibold">{variant.name}</p>
                <p className="text-primary text-lg font-bold mt-1">
                  {formatCurrency(variant.price)}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div className="space-y-3">
        <label className="text-white font-semibold">Cantidad:</label>
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <div className="flex items-center border border-primary/30 rounded-xl overflow-hidden">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-4 py-3 shop-inset hover:bg-[#08A696]/10 text-white transition-colors"
              disabled={isOutOfStock}
            >
              −
            </button>
            <span className="px-6 py-3 shop-inset text-white font-semibold min-w-[60px] text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
              className="px-4 py-3 shop-inset hover:bg-[#08A696]/10 text-white transition-colors"
              disabled={isOutOfStock}
            >
              +
            </button>
          </div>

          {/* Stock indicator */}
          {currentStock > 0 && currentStock <= 10 && (
            <p className="text-yellow-500 text-sm">
              Solo quedan {currentStock} unidades
            </p>
          )}
          {isOutOfStock && (
            <p className="text-red-500 text-sm font-semibold">
              Agotado
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="sticky bottom-0 z-40 -mx-4 px-4 py-3 bg-background/90 backdrop-blur border-t border-primary/20 pb-[calc(0.75rem+env(safe-area-inset-bottom))] flex flex-col sm:flex-row gap-3 sm:gap-4 md:static md:mx-0 md:p-0 md:bg-transparent md:border-0 md:backdrop-blur-none">
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`flex-1 flex items-center justify-center gap-3 px-4 sm:px-8 py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 ${
            isOutOfStock
              ? "bg-gray-600 cursor-not-allowed opacity-50"
              : "bg-primary text-background hover:scale-105 hover:shadow-glow"
          }`}
        >
          <ShoppingCart className="w-6 h-6" />
          {isOutOfStock ? "Agotado" : "Agregar al Carrito"}
        </button>

        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="flex items-center justify-center p-4 rounded-xl border-2 border-primary/30 hover:border-primary transition-all duration-300"
          aria-label="Add to favorites"
        >
          <Heart
            className={`w-6 h-6 transition-colors ${
              isFavorite ? "fill-primary text-primary" : "text-white"
            }`}
          />
        </button>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
        <div className="flex items-start gap-3 p-4 shop-surface rounded-xl border shop-border">
          <Package className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
          <div>
            <p className="text-white font-semibold text-sm">En Stock</p>
            <p className="text-textSecondary text-xs mt-1">Listo para enviar</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 shop-surface rounded-xl border shop-border">
          <Truck className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
          <div>
            <p className="text-white font-semibold text-sm">Envío Gratis</p>
            <p className="text-textSecondary text-xs mt-1">En compras +$100</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 shop-surface rounded-xl border shop-border">
          <Shield className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
          <div>
            <p className="text-white font-semibold text-sm">Garantía</p>
            <p className="text-textSecondary text-xs mt-1">1 año incluido</p>
          </div>
        </div>
      </div>
    </div>
  );
};
