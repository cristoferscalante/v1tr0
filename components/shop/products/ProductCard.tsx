"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

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
  likes?: number;
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
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const isOutOfStock = product.stock === 0;
  const [localFavorite, setLocalFavorite] = useState(isFavorite);

  const productImage = product.image || "/imagenes/placeholders/placeholder.jpg";

  const formatLikes = (num: number = 0) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

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
    <div className="relative group w-full h-full text-left focus:outline-none focus:ring-2 focus:ring-[#08A696] focus:ring-opacity-50 focus:ring-offset-2 rounded-2xl block transition-all duration-300 hover:transform hover:-translate-y-1">
      {/* Gradiente exterior - mismo estilo que BlogCard */}
      <div
        className={`absolute -inset-0.5 bg-gradient-to-r ${isDark ? "from-[#08a6961e] to-[#26ffde23]" : "from-[#08a69630] to-[#08a69620]"} rounded-2xl blur opacity-30 group-hover:opacity-60 transition-all duration-300`}
      ></div>

      {/* Card principal con mismo estilo que BlogCard */}
      <article
        className={`relative h-full flex flex-col ${isDark ? "bg-[#02505931] backdrop-blur-sm" : "bg-[#e6f7f6] backdrop-blur-sm"} rounded-2xl border ${isDark ? "border-[#08A696]/20" : "border-[#08A696]/30"} transition-all duration-300 transform scale-95 group-hover:scale-100 group-hover:border-[#08A696] ${isDark ? "group-hover:bg-[#02505950]" : "group-hover:bg-[#c5ebe7]"} shadow-lg group-hover:shadow-xl group-hover:shadow-[#08A696]/10 overflow-hidden`}
      >
        {/* Badge opcional (Featured, Nuevo, etc) */}
        {product.badge && (
          <div className="absolute top-2 left-2 md:top-4 md:left-4 z-10">
            <span className={`text-xs font-medium px-3 py-1 rounded-full backdrop-blur-sm transition-all duration-300 ${isDark ? "bg-[#08A696]/10 text-[#26FFDF] border-[#08a696]/50" : "bg-[#08A696]/5 text-[#08a696] border-[#08a696]/30"} border`}>
              {product.badge}
            </span>
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={handleToggleFavorite}
          className={`absolute top-2 right-2 md:top-4 md:right-4 z-10 p-1.5 md:p-2.5 rounded-full backdrop-blur-sm border transition-all duration-300 hover:scale-110 ${isDark ? "bg-[#02505931] border-[#08A696]/20 hover:bg-[#02505950] hover:border-[#08A696]" : "bg-[#e6f7f6] border-[#08A696]/30 hover:bg-[#c5ebe7] hover:border-[#08A696]"}`}
          aria-label={localFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
        >
          <Heart
            className={`w-4 h-4 md:w-5 md:h-5 transition-all duration-300 ${
              localFavorite
                ? "fill-primary text-primary"
                : isDark ? "text-[#a0a0a0] hover:text-[#26FFDF]" : "text-[#666666] hover:text-[#08A696]"
            }`}
          />
        </button>

        {/* Link wrapper */}
        <Link href={`/tienda/${product.slug}`} className="block relative z-[1]">
          {/* Image Container */}
          <div className="relative aspect-square w-full overflow-hidden">
            <Image
              src={productImage}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>

          {/* Content - Info del producto */}
          <div className="flex-1 flex flex-col p-4 md:p-6">
            {/* Product Name + Likes */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <h3 className={`text-lg md:text-xl font-bold line-clamp-1 transition-colors duration-300 ${isDark ? "text-[#26FFDF]" : "text-[#08A696]"}`}>
                {product.name}
              </h3>
              <div className={`flex items-center gap-1 text-xs ${isDark ? "text-[#a0a0a0]" : "text-[#666666]"}`}>
                <Heart className={`w-3 h-3 ${localFavorite ? "fill-primary text-primary" : ""}`} />
                <span className="font-medium">{formatLikes(productLikes)}</span>
              </div>
            </div>

            {/* Description */}
            <p
              className={`text-sm mb-4 flex-1 ${isDark ? "text-[#a0a0a0]" : "text-[#666666]"}`}
              style={{
                lineHeight: '1.5rem',
                minHeight: '3rem',
                maxHeight: '3rem',
                overflow: 'hidden',
              }}
            >
              {product.description}
            </p>

            {/* Price and Add to Cart */}
            <div className={`flex items-center justify-between pt-4 border-t mt-auto ${isDark ? "border-[#08A696]/20" : "border-[#08A696]/30"}`}>
              <div className="flex items-baseline gap-2">
                <span className={`text-xl font-bold ${isDark ? "text-[#26FFDF]" : "text-[#08A696]"}`}>
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className={`text-sm line-through ${isDark ? "text-[#a0a0a0]" : "text-[#666666]"}`}>
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!isOutOfStock && onAddToCart) {
                    onAddToCart(product);
                  }
                }}
                disabled={isOutOfStock}
                className={`text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm border transition-all duration-300 ${
                  isOutOfStock
                    ? `${isDark ? "bg-[#02505931] text-[#a0a0a0] border-[#08A696]/20" : "bg-[#e6f7f6] text-[#666666] border-[#08A696]/30"} cursor-not-allowed`
                    : `${isDark ? "bg-[#08A696]/10 text-[#26FFDF] border-[#08a696]/50 hover:bg-[#08A696]/20" : "bg-[#08A696]/5 text-[#08a696] border-[#08a696]/30 hover:bg-[#08A696]/10"}`
                }`}
              >
                {isOutOfStock ? "Sin Stock" : "Agregar"}
              </button>
            </div>
          </div>
        </Link>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className={`absolute inset-0 backdrop-blur-md rounded-2xl flex items-center justify-center z-20 ${isDark ? "bg-[#02505980]" : "bg-[#e6f7f680]"}`}>
            <div className="text-center space-y-1 md:space-y-2">
              <span className={`font-bold text-lg md:text-2xl uppercase tracking-wider ${isDark ? "text-[#26FFDF]" : "text-[#08A696]"}`}>
                Agotado
              </span>
              <p className={`text-xs md:text-sm ${isDark ? "text-[#a0a0a0]" : "text-[#666666]"}`}>Próximamente disponible</p>
            </div>
          </div>
        )}
      </article>
    </div>
  );
};
