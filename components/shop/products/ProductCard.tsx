"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";

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
  likes?: number; // Número de likes/favoritos
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
  const [localFavorite, setLocalFavorite] = useState(isFavorite);
  
  // Usar imagen del producto o fallback a placeholder
  const productImage = product.image || "/imagenes/placeholders/placeholder.jpg";

  // Formatear número de likes (54.8k, 32.4k, etc)
  const formatLikes = (num: number = 0) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  // Usar likes del producto o 0 si no está definido (evita hydration mismatch)
  const productLikes = product.likes || 0;

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLocalFavorite(!localFavorite);
    if (onToggleFavorite) {
      onToggleFavorite(product.id);
    }
  };

  return (
    <div className="group relative bg-[#0b0b0c]/80 backdrop-blur-sm rounded-2xl md:rounded-3xl border-2 border-primary/30 overflow-hidden transition-all duration-500 hover:border-primary hover:shadow-[0_0_30px_rgba(8,166,150,0.4)] hover:scale-[1.02]">
      
      {/* Badge opcional (Featured, Nuevo, etc) */}
      {product.badge && (
        <div className="absolute top-2 left-2 md:top-4 md:left-4 z-10 bg-primary/90 backdrop-blur-sm px-2 py-1 md:px-4 md:py-1.5 rounded-full">
          <span className="text-white text-[10px] md:text-xs font-bold uppercase tracking-wide">
            {product.badge}
          </span>
        </div>
      )}

      {/* Favorite Button - Siempre visible en esquina superior derecha */}
      <button
        onClick={handleToggleFavorite}
        className="absolute top-2 right-2 md:top-4 md:right-4 z-10 p-1.5 md:p-2.5 rounded-full bg-[#0b0b0c]/80 backdrop-blur-md border border-primary/30 transition-all duration-300 hover:scale-110 hover:bg-[#0b0b0c]/90 hover:border-primary"
        aria-label={localFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
      >
        <Heart 
          className={`w-4 h-4 md:w-5 md:h-5 transition-all duration-300 ${
            localFavorite 
              ? "fill-primary text-primary" 
              : "text-white/60 hover:text-primary"
          }`} 
        />
      </button>

      {/* Link wrapper */}
      <Link href={`/tienda/${product.slug}`} className="block relative z-[1]">
        {/* Image Container - Bordes redondeados con padding */}
        <div className="p-2 pb-0 md:p-4 md:pb-0">
          <div className="relative aspect-square overflow-hidden rounded-xl md:rounded-2xl bg-[#0b0b0c] border border-primary/20">
            <Image
              src={productImage}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        </div>

        {/* Content - Info del producto */}
        <div className="p-3 pt-2 md:p-6 md:pt-5 space-y-2 md:space-y-4">
          {/* Product Name + Likes */}
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-white font-semibold text-sm md:text-xl line-clamp-1 flex-1">
              {product.name}
            </h3>
            
            {/* Likes Counter */}
            <div className="flex items-center gap-1 md:gap-1.5 text-white/70">
              <span className="text-xs md:text-sm font-medium">
                {formatLikes(productLikes)}
              </span>
              <Heart className="w-3 h-3 md:w-4 md:h-4" />
            </div>
          </div>

          {/* Add to Cart Button - Estilo "Place Bid" */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!isOutOfStock && onAddToCart) {
                onAddToCart(product);
              }
            }}
            disabled={isOutOfStock}
            className={`w-full py-2 md:py-3.5 rounded-lg md:rounded-xl font-semibold text-xs md:text-base transition-all duration-300 ${
              isOutOfStock
                ? "bg-[#0b0b0c]/50 text-white/30 cursor-not-allowed border-2 border-primary/20"
                : "bg-transparent text-primary border-2 border-primary/60 hover:bg-primary/20 hover:border-primary hover:shadow-[0_0_20px_rgba(8,166,150,0.3)]"
            }`}
          >
            {isOutOfStock ? "Sin Stock" : "Agregar al Carrito"}
          </button>
        </div>
      </Link>

      {/* Out of Stock Overlay */}
      {isOutOfStock && (
        <div className="absolute inset-0 bg-[#0b0b0c]/95 backdrop-blur-md rounded-2xl md:rounded-3xl flex items-center justify-center z-20">
          <div className="text-center space-y-1 md:space-y-2">
            <span className="text-white/80 font-bold text-lg md:text-2xl uppercase tracking-wider">
              Agotado
            </span>
            <p className="text-primary/70 text-xs md:text-sm">Próximamente disponible</p>
          </div>
        </div>
      )}
    </div>
  );
};
