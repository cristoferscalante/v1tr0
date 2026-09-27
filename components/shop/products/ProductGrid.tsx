"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import type { Product } from "./ProductCard";
import { ProductBrowser } from "./ProductBrowser";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  clearShopSearch,
  setShopSearchProducts,
  setShopSearchQuery,
  useShopSearch,
} from "../search/shopSearchStore";
import { motion } from "framer-motion";
import { pill, pillActive, surfaceInner, surfaceInnerActive } from "@/components/home/shared/surface";
import { SHOP_CATEGORIES, categoryLabel } from "@/lib/data/shopCatalog";
import { ShopSearchTrigger } from "../search/ShopSearchTrigger";

interface ProductGridProps {
  products: Product[];
  onAddToCart?: (product: Product) => void;
}

const PRODUCTS_PER_PAGE = 12;

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onAddToCart,
}) => {
  const [activeCategory, setActiveCategory] = useState("all");
  // La búsqueda se controla desde la lupa del header (store compartido).
  const { query: searchQuery } = useShopSearch();
  const setSearchQuery = setShopSearchQuery;
  const [activeSort, setActiveSort] = useState("featured");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const gridRef = useRef<HTMLDivElement>(null);

  // Publica el catálogo para el buscador del header mientras la tienda esté montada.
  useEffect(() => {
    setShopSearchProducts(products);
    return () => { clearShopSearch() };
  }, [products]);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (activeCategory !== "all") {
      filtered = filtered.filter((p) => p.category === activeCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    switch (activeSort) {
      case "featured":
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return filtered;
  }, [products, activeCategory, searchQuery, activeSort]);

  // Categorías presentes en el catálogo, en el orden definido para la tienda.
  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    products.forEach((p) => counts.set(p.category, (counts.get(p.category) ?? 0) + 1));
    const order = SHOP_CATEGORIES.map((c) => c.id);
    return [...counts.entries()]
      .sort(([a], [b]) => {
        const ia = order.indexOf(a);
        const ib = order.indexOf(b);
        return (ia === -1 ? order.length : ia) - (ib === -1 ? order.length : ib);
      })
      .map(([id, count]) => ({ id, label: categoryLabel(id), count }));
  }, [products]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery, activeSort]);

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const renderPaginationButtons = () => {
    if (totalPages <= 1) { return null }

    const buttons: React.ReactNode[] = [];
    const maxVisibleButtons = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2));
    const endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);

    if (endPage - startPage < maxVisibleButtons - 1) {
      startPage = Math.max(1, endPage - maxVisibleButtons + 1);
    }

    // Área táctil mínima de 44px en todos los botones de paginación.
    const btnSize = "min-w-[44px] min-h-[44px] inline-flex items-center justify-center"
    const baseBtnClass = `${btnSize} ${surfaceInner} text-textMuted hover:text-textPrimary hover:border-[#08A696]/50`
    const activeBtnClass = `${btnSize} ${surfaceInnerActive}`

    buttons.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-2 font-medium ${baseBtnClass} disabled:opacity-30 disabled:cursor-not-allowed`}
        aria-label="Página anterior"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
    );

    if (startPage > 1) {
      buttons.push(
        <button key={1} onClick={() => handlePageChange(1)} className={`px-4 py-2 font-medium ${baseBtnClass}`}>1</button>
      );
      if (startPage > 2) {
        buttons.push(<span key="ellipsis1" className={`px-2 font-medium text-[#a0a0a0]`}>...</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 font-medium ${i === currentPage ? activeBtnClass : baseBtnClass}`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(<span key="ellipsis2" className={`px-2 font-medium text-[#a0a0a0]`}>...</span>);
      }
      buttons.push(
        <button key={totalPages} onClick={() => handlePageChange(totalPages)} className={`px-4 py-2 font-medium ${baseBtnClass}`}>{totalPages}</button>
      );
    }

    buttons.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-2 font-medium ${baseBtnClass} disabled:opacity-30 disabled:cursor-not-allowed`}
        aria-label="Página siguiente"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    );

    return buttons;
  };

  const textSecondary = "text-[#a0a0a0]"

  return (
    <section id="productos" className="relative w-full scroll-mt-[60px]">
      {/* Barra de corte entre el hero y el catálogo: título + buscador */}
      <motion.div
        className="relative w-full border-y border-[#08A696]/25 bg-[#f4faf9]/85 dark:bg-[#202325]/95 backdrop-blur-md z-30"
        initial={{ opacity: 0, y: -12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Textura: hilos diagonales finos + velo de color hacia los bordes */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.35] dark:opacity-[0.22]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, rgba(8,166,150,0.16) 0px, rgba(8,166,150,0.16) 1px, transparent 1px, transparent 7px)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#08A696]/10 via-transparent to-[#08A696]/10 dark:from-[#08A696]/5 dark:to-[#08A696]/5"
        />
        {/* Filo luminoso superior, el corte real con el hero */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#26FFDF]/50 to-transparent"
        />

        <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-center gap-3 sm:gap-4">
          <h2 className="text-base sm:text-xl lg:text-2xl font-bold tracking-tight text-textPrimary text-center">
            Encuentra tu Producto Ideal
          </h2>
          <ShopSearchTrigger />
        </div>
      </motion.div>

      {/* Products Grid */}
      <div ref={gridRef} className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12 pb-24 md:pb-32 scroll-mt-28">
        {/* Barra de catálogo: categorías, conteo y orden */}
        {products.length > 0 && (
          <div className="mb-8 md:mb-10 flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
            <div
              className="-mx-4 px-4 sm:mx-0 sm:px-0 flex gap-2 overflow-x-auto sm:flex-wrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              role="tablist"
              aria-label="Categorías"
            >
              {[{ id: "all", label: "Todo", count: products.length }, ...categories].map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`${isActive ? pillActive : pill} shrink-0 whitespace-nowrap`}
                  >
                    {cat.label}
                    <span className={`text-[11px] tabular-nums ${isActive ? "opacity-80" : "opacity-50"}`}>{cat.count}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between lg:justify-end gap-4 lg:ml-auto shrink-0">
              <p className="text-xs text-textMuted tabular-nums" aria-live="polite">
                {filteredProducts.length} {filteredProducts.length === 1 ? "producto" : "productos"}
              </p>
              <label className="flex items-center gap-2 text-xs text-textMuted">
                <span className="sr-only sm:not-sr-only">Ordenar por</span>
                <select
                  value={activeSort}
                  onChange={(e) => setActiveSort(e.target.value)}
                  className={`${surfaceInner} px-3 py-2 text-sm text-textPrimary bg-[#16191b] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#26FFDF]/60 cursor-pointer`}
                >
                  <option value="featured">Destacados</option>
                  <option value="price-asc">Precio: menor a mayor</option>
                  <option value="price-desc">Precio: mayor a menor</option>
                  <option value="name">Nombre</option>
                </select>
              </label>
            </div>
          </div>
        )}

        {paginatedProducts.length > 0 ? (
          <>
            <ProductBrowser
              products={paginatedProducts}
              {...(onAddToCart && { onAddToCart })}
              onToggleFavorite={toggleFavorite}
              favorites={favorites}
            />

            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-2 pt-10">
                {renderPaginationButtons()}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 shop-panel">
            <p className={`text-lg font-medium mb-6 ${textSecondary}`}>
              No se encontraron productos
              {searchQuery && ` para "${searchQuery}"`}
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
              }}
              className="px-8 py-3 bg-transparent border-2 border-primary rounded-xl text-primary font-semibold transition-all duration-300 hover:bg-primary/20 hover:shadow-[0_0_20px_rgba(8,166,150,0.3)]"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>

    </section>
  );
};
