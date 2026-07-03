"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Heart } from "lucide-react";

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  stock: number;
  featured?: boolean;
  badge?: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onToggleFavorite?: (productId: string) => void;
  isFavorite?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onToggleFavorite,
  isFavorite = false,
}) => {
  const isOutOfStock = product.stock === 0;
  
  // Usar imagen del producto o fallback a placeholder
  const productImage = product.image || "/imagenes/placeholders/placeholder.jpg";

  return (
    <div className="group relative bg-[#0f0f10]/60 backdrop-blur-sm border border-[#08A696]/20 overflow-hidden transition-all duration-300 hover:border-[#08A696]/50">
      {/* Link wrapper */}
      <Link href={`/tienda/${product.slug}`} className="block">
        {/* Image Container - Minimalista */}
        <div className="relative aspect-square overflow-hidden bg-background/50">
          <Image
            src={productImage}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Content - Solo info esencial */}
        <div className="p-4 space-y-3">
          {/* Product Name */}
          <h3 className="text-white font-semibold text-base line-clamp-2 min-h-[3rem]">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-primary">
              ${product.price.toLocaleString()}
            </span>
          </div>
        </div>
      </Link>

      {/* Action Buttons - Overlay en hover */}
      <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {/* Favorite Button */}
        {onToggleFavorite && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFavorite(product.id);
            }}
            className={`p-2.5 rounded-full backdrop-blur-md transition-all duration-300 ${
              isFavorite
                ? "bg-red-500 text-white"
                : "bg-background/80 text-textSecondary hover:text-red-500"
            }`}
            aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? "fill-white" : ""}`} />
          </button>
        )}

        {/* Add to Cart Button */}
        {onAddToCart && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!isOutOfStock) {
                onAddToCart(product);
              }
            }}
            disabled={isOutOfStock}
            className={`p-2.5 rounded-full backdrop-blur-md transition-all duration-300 ${
              isOutOfStock
                ? "bg-background/50 text-textSecondary/50 cursor-not-allowed"
                : "bg-primary text-background hover:scale-110 hover:shadow-glow"
            }`}
            aria-label={isOutOfStock ? "Sin stock" : "Agregar al carrito"}
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Out of Stock Overlay */}
      {isOutOfStock && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <span className="text-white font-bold text-lg uppercase tracking-wide">
            Sin Stock
          </span>
        </div>
      )}
    </div>
  );
};
