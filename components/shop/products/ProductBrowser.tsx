"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check, Heart, ShoppingCart } from "lucide-react";
import type { Product } from "./ProductCard";
import { accentText, eyebrow } from "@/components/home/shared/surface";
import { availability, categoryLabel, formatPrice } from "@/lib/data/shopCatalog";

interface ProductBrowserProps {
  products: Product[];
  onAddToCart?: (product: Product) => void;
  onToggleFavorite?: (productId: string) => void;
  favorites: Set<string>;
}

/** Punto de color según disponibilidad. */
const TONE_DOT = {
  in: "bg-[#26FFDF]",
  order: "bg-[#f5c451]",
  out: "bg-[#ff6b6b]",
} as const;

/**
 * Escenario de la foto. Las fotos del catálogo de hardware vienen recortadas
 * sin fondo: se muestran completas, flotando sobre un halo teal tenue.
 */
function ProductPhoto({
  product,
  src,
  sizes,
  priority = false,
  hoverZoom = false,
}: {
  product: Product;
  src: string;
  sizes: string;
  priority?: boolean;
  hoverZoom?: boolean;
}) {
  const zoom = hoverZoom ? "transition-transform duration-500 group-hover:scale-105" : "";
  return product.cutout ? (
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_55%,rgba(38,255,223,0.10),transparent_65%)]">
      <Image
        src={src}
        alt={product.name}
        fill
        sizes={sizes}
        priority={priority}
        className={`object-contain p-[6%] drop-shadow-[0_14px_22px_rgba(0,0,0,0.55)] ${zoom}`}
      />
    </div>
  ) : (
    <Image src={src} alt={product.name} fill sizes={sizes} priority={priority} className={`object-cover ${zoom}`} />
  );
}

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
  const [photoIndex, setPhotoIndex] = useState(0);
  const previewRef = useRef<HTMLDivElement>(null);

  // Si cambian los filtros, la vista previa salta al primer resultado
  useEffect(() => {
    setSelectedId((current) =>
      current && products.some((p) => p.id === current) ? current : products[0]?.id ?? null
    );
  }, [products]);

  // Cada producto abre en su foto principal
  useEffect(() => {
    setPhotoIndex(0);
  }, [selectedId]);

  const selected = products.find((p) => p.id === selectedId) ?? products[0];

  const handleSelect = (product: Product) => {
    setSelectedId(product.id);
    // En móvil la vista previa vive arriba de la cuadrícula
    if (window.matchMedia("(max-width: 1023px)").matches) {
      previewRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  if (!selected) { return null }

  const gallery = selected.images?.length ? selected.images : [selected.image];
  const photo = gallery[Math.min(photoIndex, gallery.length - 1)] ?? selected.image;
  const stockInfo = availability(selected.stock, selected.delivery);
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
          className="p-5 sm:p-7 shop-panel"
        >
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shop-inset">
            <ProductPhoto product={selected} src={photo} sizes="(max-width: 1024px) 90vw, 400px" priority />
            {selected.badge && (
              <span className="absolute top-3 left-3 rounded-full px-3 py-1 text-[11px] font-semibold bg-[#1e2123]/90 text-[#26FFDF] border border-[#26FFDF]/30">
                {selected.badge}
              </span>
            )}
            {onToggleFavorite && (
              <button
                type="button"
                onClick={() => onToggleFavorite(selected.id)}
                aria-label={favorites.has(selected.id) ? "Quitar de favoritos" : "Guardar en favoritos"}
                aria-pressed={favorites.has(selected.id)}
                className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-sm bg-[#1e2123]/80 border border-[#08A696]/30 transition-colors hover:border-[#26FFDF]/60"
              >
                <Heart
                  className={`w-4 h-4 ${favorites.has(selected.id) ? "fill-[#26FFDF] text-[#26FFDF]" : "text-[#26FFDF]"}`}
                />
              </button>
            )}
          </div>

          {/* Miniaturas de la galería */}
          {gallery.length > 1 && (
            <div className="mt-3 grid grid-cols-5 gap-2" role="tablist" aria-label="Fotos del producto">
              {gallery.slice(0, 5).map((src, i) => (
                <button
                  key={src}
                  type="button"
                  role="tab"
                  aria-selected={i === photoIndex}
                  aria-label={`Foto ${i + 1}`}
                  onClick={() => setPhotoIndex(i)}
                  className={`relative aspect-square rounded-lg overflow-hidden border transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#26FFDF]/60 ${
                    i === photoIndex ? "border-[#26FFDF]/70" : "border-[#08A696]/15 opacity-60 hover:opacity-100"
                  }`}
                >
                  <ProductPhoto product={selected} src={src} sizes="72px" />
                </button>
              ))}
            </div>
          )}

          <p className={`mt-5 ${eyebrow}`}>
            {[selected.brand, categoryLabel(selected.category)].filter(Boolean).join(" · ")}
          </p>
          <h3 className={`mt-1 text-xl sm:text-2xl font-bold leading-tight ${accentText}`}>
            {selected.name}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-textMuted line-clamp-3">
            {selected.description}
          </p>

          {selected.highlights && selected.highlights.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Características destacadas">
              {selected.highlights.map((h) => (
                <li
                  key={h}
                  className="rounded-md border border-[#08A696]/25 bg-[#08A696]/10 px-2 py-1 text-[11px] font-medium text-[#26FFDF]/90"
                >
                  {h}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-2xl font-bold text-textPrimary tabular-nums">{formatPrice(selected.price)}</span>
            {selected.originalPrice && selected.originalPrice > selected.price && (
              <>
                <span className="text-sm line-through text-textMuted tabular-nums">
                  {formatPrice(selected.originalPrice)}
                </span>
                {discount && (
                  <span className="text-xs font-semibold text-[#26FFDF]">-{discount}%</span>
                )}
              </>
            )}
          </div>

          <p className="mt-1.5 flex items-center gap-2 text-xs text-textMuted">
            <span className={`h-1.5 w-1.5 rounded-full ${TONE_DOT[stockInfo.tone]}`} aria-hidden="true" />
            <span className="font-medium text-textPrimary/90">{stockInfo.label}</span>
            <span aria-hidden="true">·</span>
            <span>{stockInfo.detail}</span>
          </p>

          {selected.uses && selected.uses.length > 0 && (
            <div className="mt-5 pt-4 border-t border-[#08A696]/15">
              <p className={eyebrow}>Ideal para</p>
              <ul className="mt-2.5 space-y-1.5">
                {selected.uses.slice(0, 3).map((use) => (
                  <li key={use} className="flex items-start gap-2 text-[13px] leading-snug text-textMuted">
                    <Check className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#26FFDF]" aria-hidden="true" />
                    {use}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
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
              Ficha técnica
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Cuadrícula compacta de selección */}
      <div
        className="order-2 lg:order-1 lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5"
        role="listbox"
        aria-label="Productos"
      >
        {products.map((product, index) => {
          const isSelected = product.id === selected.id;
          const info = availability(product.stock, product.delivery);
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
              transition={{ duration: 0.4, ease: "easeOut", delay: (index % 4) * 0.05 }}
              className={`group flex flex-col text-left rounded-2xl border p-2.5 sm:p-3 transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#26FFDF]/60 ${
                isSelected ? "bg-[#232629] border-[#26FFDF]/60" : "shop-surface shop-border shop-border-hover"
              }`}
            >
              <div className="relative w-full aspect-square rounded-xl overflow-hidden shop-inset">
                <ProductPhoto product={product} src={product.image} sizes="(max-width: 640px) 45vw, 220px" hoverZoom />
                {product.badge && (
                  <span className="absolute top-2 left-2 rounded-full px-2 py-0.5 text-[10px] font-semibold bg-[#1e2123]/90 text-[#26FFDF] border border-[#26FFDF]/30">
                    {product.badge}
                  </span>
                )}
                {product.stock === 0 && (
                  <span className="absolute inset-x-0 bottom-0 bg-black/70 text-[10px] text-white text-center py-1">
                    Sin stock
                  </span>
                )}
              </div>
              <p className="mt-2.5 text-[10px] uppercase tracking-[0.16em] text-textMuted truncate">
                {product.brand ?? categoryLabel(product.category)}
              </p>
              <p className="mt-0.5 text-[13px] font-semibold leading-snug line-clamp-2 text-textPrimary min-h-[2.4em]">
                {product.name}
              </p>
              <div className="mt-auto pt-1.5 flex items-center justify-between gap-2">
                <span className={`text-[13px] font-bold tabular-nums ${accentText}`}>{formatPrice(product.price)}</span>
                <span
                  className={`h-1.5 w-1.5 rounded-full shrink-0 ${TONE_DOT[info.tone]}`}
                  title={info.label}
                  aria-label={info.label}
                />
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
