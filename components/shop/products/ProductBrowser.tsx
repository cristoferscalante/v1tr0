"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Heart, ShoppingCart } from "lucide-react";
import type { Product } from "./ProductCard";
import { accentText } from "@/components/home/shared/surface";

interface ProductBrowserProps {
  products: Product[];
  onAddToCart?: (product: Product) => void;
  onToggleFavorite?: (productId: string) => void;
  favorites: Set<string>;
}

const currency = (value: number) => `$${value.toLocaleString()}`;

/**
 * Navegación de catálogo maestro–detalle: cuadrícula compacta a la izquierda
 * para recorrer productos y una vista previa grande a la derecha que se queda
 * fija mientras se navega. Evita ir y volver a la ficha por cada producto.
 */
export const ProductBrowser: React.FC<ProductBrowserProps> = ({
  products,
  onAddToCart,
  onToggleFavorite,
  favorites,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(products[0]?.id ?? null);
  const previewRef = useRef<HTMLDivElement>(null);

  // Si cambian los filtros, la vista previa salta al primer resultado
  useEffect(() => {
    setSelectedId((current) =>
      current && products.some((p) => p.id === current) ? current : products[0]?.id ?? null
    );
  }, [products]);

  const selected = products.find((p) => p.id === selectedId) ?? products[0];

  const handleSelect = (product: Product) => {
    setSelectedId(product.id);
    // En móvil la vista previa vive arriba de la cuadrícula
    if (window.matchMedia("(max-width: 1023px)").matches) {
      previewRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  if (!selected) { return null }

  const discount =
    selected.originalPrice && selected.originalPrice > selected.price
      ? Math.round((1 - selected.price / selected.originalPrice) * 100)
      : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
      {/* Vista previa: fija en escritorio, arriba de todo en móvil */}
      <div className="order-1 lg:order-2 lg:col-span-4 lg:sticky lg:top-28" ref={previewRef}>
        <motion.div
          key={selected.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="p-6 sm:p-8 shop-panel"
        >
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shop-inset">
            <Image
              src={selected.image}
              alt={selected.name}
              fill
              sizes="(max-width: 1024px) 90vw, 360px"
              className="object-cover"
              priority
            />
            {selected.badge && (
              <span className="absolute top-3 left-3 rounded-full px-3 py-1 text-[11px] font-semibold bg-[#c5ebe7] text-[#08A696] dark:bg-[#2b2e31] dark:text-[#26FFDF]">
                {selected.badge}
              </span>
            )}
            {onToggleFavorite && (
              <button
                type="button"
                onClick={() => onToggleFavorite(selected.id)}
                aria-label={favorites.has(selected.id) ? "Quitar de favoritos" : "Guardar en favoritos"}
                aria-pressed={favorites.has(selected.id)}
                className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-sm bg-white/70 dark:bg-black/40 border border-[#08A696]/20 transition-colors hover:border-[#08A696]/60"
              >
                <Heart
                  className={`w-4 h-4 ${
                    favorites.has(selected.id) ? "fill-[#08A696] text-[#08A696]" : "text-[#08A696] dark:text-[#26FFDF]"
                  }`}
                />
              </button>
            )}
          </div>

          <p className="mt-4 text-[10px] uppercase tracking-[0.22em] text-[#08A696]/80 dark:text-[#26FFDF]/80">
            {selected.category}
          </p>
          <h3 className={`mt-1 text-lg sm:text-xl font-bold leading-tight ${accentText}`}>
            {selected.name}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-textMuted line-clamp-3">
            {selected.description}
          </p>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-xl font-bold text-textPrimary">{currency(selected.price)}</span>
            {selected.originalPrice && selected.originalPrice > selected.price && (
              <>
                <span className="text-sm line-through text-textMuted">
                  {currency(selected.originalPrice)}
                </span>
                {discount && (
                  <span className="text-xs font-semibold text-[#08A696] dark:text-[#26FFDF]">
                    -{discount}%
                  </span>
                )}
              </>
            )}
          </div>

          <p className="mt-1 text-xs text-textMuted">
            {selected.stock > 0 ? `${selected.stock} disponibles` : "Sin stock"}
          </p>

          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            {onAddToCart && (
              <button
                type="button"
                onClick={() => onAddToCart(selected)}
                disabled={selected.stock === 0}
                className="shop-btn flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm"
              >
                <ShoppingCart className="w-4 h-4" />
                {selected.stock === 0 ? "Sin stock" : "Agregar al carrito"}
              </button>
            )}
            <Link
              href={`/tienda/${selected.slug}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300 border border-[#08A696]/20 text-textMuted hover:text-textPrimary hover:border-[#08A696]/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#26FFDF]/60"
            >
              Ver detalle
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Cuadrícula compacta de selección */}
      <div
        className="order-2 lg:order-1 lg:col-span-8 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5"
        role="listbox"
        aria-label="Productos"
      >
        {products.map((product, index) => {
          const isSelected = product.id === selected.id;
          return (
            <motion.button
              key={product.id}
              type="button"
              role="option"
              aria-selected={isSelected}
              onClick={() => handleSelect(product)}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: (index % 3) * 0.06 }}
              className={`group text-left rounded-2xl border p-3 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#26FFDF]/60 ${
                isSelected
                  ? "bg-[#c5ebe7] border-[#08A696]/50 dark:bg-[#232629] dark:border-[#26FFDF]/60"
                  : "shop-surface shop-border shop-border-hover"
              }`}
            >
              <div className="relative w-full aspect-square rounded-xl overflow-hidden shop-inset">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 45vw, 200px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {product.stock === 0 && (
                  <span className="absolute inset-x-0 bottom-0 bg-black/70 text-[10px] text-white text-center py-1">
                    Sin stock
                  </span>
                )}
              </div>
              <p className="mt-2 text-[11px] font-semibold leading-tight line-clamp-2 text-textPrimary">
                {product.name}
              </p>
              <p className={`mt-0.5 text-[11px] font-bold ${accentText}`}>{currency(product.price)}</p>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
