"use client";

import React, { useState, useMemo, useRef } from "react";
import { ProductCard, type Product } from "./ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SmartSearchBar } from "../search/SmartSearchBar";
import { FilterBar, type FilterOption } from "../filters/FilterBar";
import { useTheme } from "@/components/theme-provider";

interface ProductGridProps {
  products: Product[];
  onAddToCart?: (product: Product) => void;
}

const PRODUCTS_PER_PAGE = 9;

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
  const filtersRef = useRef<HTMLDivElement>(null);

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
    filtersRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const renderPaginationButtons = () => {
    if (totalPages <= 1) { return null }

    const buttons = [];
    const maxVisibleButtons = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2));
    const endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);

    if (endPage - startPage < maxVisibleButtons - 1) {
      startPage = Math.max(1, endPage - maxVisibleButtons + 1);
    }

    const baseBtnClass = isDark
      ? "bg-[#02505931] border-[#08A696]/20 text-[#a0a0a0] hover:border-[#08A696] hover:text-[#26FFDF]"
      : "bg-[#e6f7f6] border-[#08A696]/30 text-[#666666] hover:border-[#08A696] hover:text-[#08A696]"

    const activeBtnClass = isDark
      ? "bg-[#08A696]/10 border-[#08A696] text-[#26FFDF] shadow-[0_0_15px_rgba(8,166,150,0.3)]"
      : "bg-[#08A696]/10 border-[#08A696] text-[#08A696] shadow-[0_0_15px_rgba(8,166,150,0.3)]"

    buttons.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-2 rounded-lg font-medium transition-colors duration-200 border ${baseBtnClass} disabled:opacity-30 disabled:cursor-not-allowed`}
        aria-label="Página anterior"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
    );

    if (startPage > 1) {
      buttons.push(
        <button key={1} onClick={() => handlePageChange(1)} className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 border ${baseBtnClass}`}>1</button>
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
          className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 border ${i === currentPage ? activeBtnClass : baseBtnClass}`}
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
        <button key={totalPages} onClick={() => handlePageChange(totalPages)} className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 border ${baseBtnClass}`}>{totalPages}</button>
      );
    }

    buttons.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-2 rounded-lg font-medium transition-colors duration-200 border ${baseBtnClass} disabled:opacity-30 disabled:cursor-not-allowed`}
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
        <div className="max-w-[1400px] mx-auto space-y-4">
          <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold text-center leading-tight ${textWhite}`}>
            Encuentra tu{" "}
            <span className="text-primary">Producto Ideal</span>
          </h2>
          <p className={`text-center text-sm md:text-base ${textSecondary} max-w-2xl mx-auto`}>
            Explora nuestro catálogo de ciberseguridad, hardware, comunicación descentralizada y facturación
          </p>
          <div className="max-w-3xl mx-auto">
            <SmartSearchBar
              products={products}
              onSearch={setSearchQuery}
              searchQuery={searchQuery}
            />
          </div>
        </div>
      </div>

      {/* Semifloating Filter Bar */}
      <div
        ref={filtersRef}
        className="sticky top-20 z-30 w-full px-4 sm:px-6 lg:px-8 pb-4"
      >
        <div className={`max-w-[1400px] mx-auto ${isDark ? "bg-[#0f0f10]/70" : "bg-[#faf9f7]/70"} backdrop-blur-xl border ${isDark ? "border-[#08A696]/15" : "border-[#08A696]/20"} rounded-2xl px-5 py-4 shadow-lg ${isDark ? "shadow-[#08A696]/5" : "shadow-[#08A696]/5"}`}>
          <FilterBar
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            sortOptions={sortOptions}
            activeSort={activeSort}
            onSortChange={setActiveSort}
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-6">
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

        {paginatedProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              {paginatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  {...(onAddToCart && { onAddToCart })}
                  onToggleFavorite={toggleFavorite}
                  isFavorite={favorites.has(product.id)}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-10">
                {renderPaginationButtons()}
              </div>
            )}
          </>
        ) : (
          <div className={`text-center py-20 ${isDark ? "bg-[#02505931]" : "bg-[#e6f7f6]"} backdrop-blur-sm border ${isDark ? "border-[#08A696]/20" : "border-[#08A696]/30"} rounded-2xl`}>
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
