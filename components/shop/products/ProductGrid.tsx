"use client";

import React, { useState, useMemo, useRef } from "react";
import type { Product } from "./ProductCard";
import { ProductBrowser } from "./ProductBrowser";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SmartSearchBar } from "../search/SmartSearchBar";
import { FilterBar, type FilterOption } from "../filters/FilterBar";
import { useTheme } from "@/components/theme-provider";
import { motion } from "framer-motion";
import { sectionTitle, surface, surfaceInner, surfaceInnerActive } from "@/components/home/shared/surface";

interface ProductGridProps {
  products: Product[];
  onAddToCart?: (product: Product) => void;
}

const PRODUCTS_PER_PAGE = 12;

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onAddToCart,
}) => {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSort, setActiveSort] = useState("featured");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const gridRef = useRef<HTMLDivElement>(null);

  const categories: FilterOption[] = useMemo(() => {
    const categoryMap = new Map<string, number>();
    categoryMap.set("all", products.length);

    products.forEach((product) => {
      const count = categoryMap.get(product.category) || 0;
      categoryMap.set(product.category, count + 1);
    });

    return [
      { id: "all", label: "Todos", count: products.length },
      ...Array.from(categoryMap.entries())
        .filter(([cat]) => cat !== "all")
        .map(([cat, count]) => ({
          id: cat,
          label: cat.charAt(0).toUpperCase() + cat.slice(1),
          count,
        })),
    ];
  }, [products]);

  const sortOptions: FilterOption[] = [
    { id: "featured", label: "Destacados" },
    { id: "price-asc", label: "Menor precio" },
    { id: "price-desc", label: "Mayor precio" },
    { id: "name", label: "Nombre" },
  ];

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

    const baseBtnClass = `${surfaceInner} text-textMuted hover:text-textPrimary hover:border-[#08A696]/50`
    const activeBtnClass = surfaceInnerActive

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
        buttons.push(<span key="ellipsis1" className={`px-2 font-medium ${isDark ? "text-[#a0a0a0]" : "text-[#666666]"}`}>...</span>);
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
        buttons.push(<span key="ellipsis2" className={`px-2 font-medium ${isDark ? "text-[#a0a0a0]" : "text-[#666666]"}`}>...</span>);
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

  const textSecondary = isDark ? "text-[#a0a0a0]" : "text-[#666666]"
  const textWhite = isDark ? "text-white" : "text-[#011c26]"

  return (
    <section className="relative w-full">
      {/* Search Section */}
      <div className="w-full px-4 sm:px-6 lg:px-8 pt-8 md:pt-12 pb-4">
        <motion.div
          className="max-w-[1400px] mx-auto space-y-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className={`${sectionTitle} text-center`}>Encuentra tu Producto Ideal</h2>
        </motion.div>
      </div>

      {/* Products Grid */}
      <div ref={gridRef} className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-8 scroll-mt-28">
        {paginatedProducts.length > 0 ? (
          <>
            <ProductBrowser
              products={paginatedProducts}
              {...(onAddToCart && { onAddToCart })}
              onToggleFavorite={toggleFavorite}
              favorites={favorites}
            />

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-10">
                {renderPaginationButtons()}
              </div>
            )}
          </>
        ) : (
          <div className={`text-center py-20 ${surface}`}>
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
      {/* Barra de filtros y búsqueda: al pie de la sección, sin seguir el scroll */}
      <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between mb-3">
        <p className={`font-medium text-sm ${textSecondary}`}>
          Mostrando <span className={`font-semibold ${textWhite}`}>{paginatedProducts.length}</span> de{" "}
          <span className={`font-semibold ${textWhite}`}>{filteredProducts.length}</span> productos
          {searchQuery && (
            <span> para &quot;<span className="text-primary">{searchQuery}</span>&quot;</span>
          )}
        </p>
        {totalPages > 1 && (
          <p className={`text-sm font-medium hidden sm:block ${textSecondary}`}>
            Página <span className={textWhite}>{currentPage}</span> de{" "}
            <span className={textWhite}>{totalPages}</span>
          </p>
        )}
      </div>
      </div>

      <div
        className="relative z-40 w-full px-4 sm:px-6 lg:px-8 pb-16"
      >
        <div className="max-w-[1400px] mx-auto px-5 py-3 flex flex-wrap items-center gap-x-6 gap-y-3 rounded-2xl border shadow-lg bg-[#f4faf9] border-[#08A696]/25 dark:bg-[#052a30] dark:border-[#08A696]/25">
          <FilterBar
            openUpward
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            sortOptions={sortOptions}
            activeSort={activeSort}
            onSortChange={setActiveSort}
          />

          {/* Buscador discreto, alineado a la derecha de los filtros */}
          <div className="ml-auto w-full sm:w-80 lg:w-96">
            <SmartSearchBar
              products={products}
              onSearch={setSearchQuery}
              searchQuery={searchQuery}
              compact
              openUpward
            />
          </div>
        </div>
      </div>

    </section>
  );
};
