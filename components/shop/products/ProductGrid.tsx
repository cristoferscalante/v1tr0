"use client";

import React, { useState, useMemo } from "react";
import { ProductCard, type Product } from "./ProductCard";
import { FilterBar, type FilterOption } from "../filters/FilterBar";
import { TechGridBackground } from "../background/TechGridBackground";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductGridProps {
  products: Product[];
  onAddToCart?: (product: Product) => void;
}

const PRODUCTS_PER_PAGE = 9; // 3x3 grid

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onAddToCart,
}) => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSort, setActiveSort] = useState("featured");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);

  // Get unique categories with counts
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

  // Sort options
  const sortOptions: FilterOption[] = [
    { id: "featured", label: "Destacados" },
    { id: "price-asc", label: "Menor precio" },
    { id: "price-desc", label: "Mayor precio" },
    { id: "name", label: "Nombre" },
  ];

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Filter by category
    if (activeCategory !== "all") {
      filtered = filtered.filter((p) => p.category === activeCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    // Sort
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

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage]);

  // Reset to page 1 when filters change
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
    // Scroll to top of products section
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPaginationButtons = () => {
    if (totalPages <= 1) {
      return null;
    }

    const buttons = [];
    const maxVisibleButtons = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2));
    const endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);
    
    if (endPage - startPage < maxVisibleButtons - 1) {
      startPage = Math.max(1, endPage - maxVisibleButtons + 1);
    }

    // Previous button - Diseño limpio
    buttons.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 bg-[#0f0f10]/40 border border-[#08A696]/20  font-medium transition-colors duration-200 hover:border-[#08A696]/40 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-[#08A696]/20"
        aria-label="Página anterior"
      >
        <ChevronLeft className="w-5 h-5 text-[#b0b0b0]" />
      </button>
    );

    // First page + ellipsis
    if (startPage > 1) {
      buttons.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="px-4 py-2 bg-[#0f0f10]/40 border border-[#08A696]/20  font-medium transition-colors duration-200 hover:border-[#08A696]/40 text-[#b0b0b0] hover:text-[#e0e0e0]"
        >
          1
        </button>
      );
      if (startPage > 2) {
        buttons.push(
          <span key="ellipsis1" className="px-2 text-[#808080] font-medium">
            ...
          </span>
        );
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 border  font-medium transition-colors duration-200 ${
            i === currentPage
              ? "bg-[#08A696]/15 border-[#08A696]/60 text-[#26FFDF]"
              : "bg-[#0f0f10]/40 border-[#08A696]/20 text-[#b0b0b0] hover:border-[#08A696]/40 hover:text-[#e0e0e0]"
          }`}
        >
          {i}
        </button>
      );
    }

    // Last page + ellipsis
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(
          <span key="ellipsis2" className="px-2 text-[#808080] font-medium">
            ...
          </span>
        );
      }
      buttons.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="px-4 py-2 bg-[#0f0f10]/40 border border-[#08A696]/20  font-medium transition-colors duration-200 hover:border-[#08A696]/40 text-[#b0b0b0] hover:text-[#e0e0e0]"
        >
          {totalPages}
        </button>
      );
    }

    // Next button
    buttons.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 bg-[#0f0f10]/40 border border-[#08A696]/20  font-medium transition-colors duration-200 hover:border-[#08A696]/40 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-[#08A696]/20"
        aria-label="Página siguiente"
      >
        <ChevronRight className="w-5 h-5 text-[#b0b0b0]" />
      </button>
    );

    return buttons;
  };

  return (
    <section className="relative w-full pt-0 pb-16 px-4 overflow-hidden">
      {/* Tech Grid Background - Iconos sutiles estilo Matrix */}
      <div className="absolute inset-0 z-0">
        <TechGridBackground />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto space-y-6 pt-8">
        {/* Filter Bar */}
        <FilterBar
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          onSearch={setSearchQuery}
          sortOptions={sortOptions}
          activeSort={activeSort}
          onSortChange={setActiveSort}
        />

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-[#b0b0b0] font-medium text-sm">
            Mostrando <span className="text-[#e0e0e0] font-semibold">{paginatedProducts.length}</span> de <span className="text-[#e0e0e0] font-semibold">{filteredProducts.length}</span> productos
            {searchQuery && (
              <span> para &quot;<span className="text-[#26FFDF]">{searchQuery}</span>&quot;</span>
            )}
          </p>
          {totalPages > 1 && (
            <p className="text-[#b0b0b0] text-sm font-medium">
              Página <span className="text-[#e0e0e0]">{currentPage}</span> de <span className="text-[#e0e0e0]">{totalPages}</span>
            </p>
          )}
        </div>

        {/* Products Grid - 3 columnas */}
        {paginatedProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-8">
                {renderPaginationButtons()}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-[#b0b0b0] text-lg font-medium mb-6">
              No se encontraron productos
              {searchQuery && ` para "${searchQuery}"`}
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
              }}
              className="px-6 py-3 bg-[#08A696]/15 border border-[#08A696]/40  text-[#26FFDF] font-medium transition-colors duration-200 hover:bg-[#08A696]/25 hover:border-[#08A696]/60"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
