"use client";

import React, { useState, useMemo } from "react";
import { ProductCard, type Product } from "./ProductCard";
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import { SmartSearchBar } from "../search/SmartSearchBar";

export interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

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
  const [showMobileFilters, setShowMobileFilters] = useState(false);

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
        className="px-3 py-2 bg-[#0b0b0c]/60 border border-primary/30 rounded-lg font-medium transition-colors duration-200 hover:border-primary disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-primary/30"
        aria-label="Página anterior"
      >
        <ChevronLeft className="w-5 h-5 text-white/70" />
      </button>
    );

    // First page + ellipsis
    if (startPage > 1) {
      buttons.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="px-4 py-2 bg-[#0b0b0c]/60 border border-primary/30 rounded-lg font-medium transition-colors duration-200 hover:border-primary text-white/70 hover:text-white"
        >
          1
        </button>
      );
      if (startPage > 2) {
        buttons.push(
          <span key="ellipsis1" className="px-2 text-white/40 font-medium">
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
          className={`px-4 py-2 border rounded-lg font-medium transition-colors duration-200 ${
            i === currentPage
              ? "bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(8,166,150,0.3)]"
              : "bg-[#0b0b0c]/60 border-primary/30 text-white/70 hover:border-primary hover:text-white"
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
          <span key="ellipsis2" className="px-2 text-white/40 font-medium">
            ...
          </span>
        );
      }
      buttons.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="px-4 py-2 bg-[#0b0b0c]/60 border border-primary/30 rounded-lg font-medium transition-colors duration-200 hover:border-primary text-white/70 hover:text-white"
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
        className="px-3 py-2 bg-[#0b0b0c]/60 border border-primary/30 rounded-lg font-medium transition-colors duration-200 hover:border-primary disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-primary/30"
        aria-label="Página siguiente"
      >
        <ChevronRight className="w-5 h-5 text-white/70" />
      </button>
    );

    return buttons;
  };

  return (
    <section className="relative w-full">
      {/* Search Section - Simplificada sin fondo */}
      <div className="w-full py-8 md:py-12 px-4 sm:px-6 lg:px-8 mb-8">
        <div className="max-w-[1400px] mx-auto space-y-4 md:space-y-6">
          {/* Título */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center leading-tight">
            Encuentra tu{" "}
            <span className="text-primary">Producto Ideal</span>
          </h2>

          {/* Subtítulo */}
          <p className="text-white/60 text-center text-sm md:text-base">
            Explora nuestro catálogo de ciberseguridad, hardware, comunicación descentralizada y facturación
          </p>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto">
            <SmartSearchBar
              products={products}
              onSearch={setSearchQuery}
              searchQuery={searchQuery}
            />
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Mobile Filter Toggle */}
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="lg:hidden w-full mb-6 flex items-center justify-center gap-2 px-6 py-3 bg-[#0f0f10]/80 backdrop-blur-md border-2 border-primary/30 text-white font-semibold rounded-xl transition-all duration-200 hover:border-primary"
        >
          <SlidersHorizontal className="w-5 h-5" />
          {showMobileFilters ? "Ocultar Filtros" : "Mostrar Filtros"}
        </button>

        {/* Main Layout: Sidebar + Products */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT SIDEBAR - Filters & Categories */}
          <aside className={`lg:w-72 flex-shrink-0 ${showMobileFilters ? "block" : "hidden lg:block"}`}>
            <div className="sticky top-24 space-y-6">
              {/* Categories Section */}
              <div className="bg-[#0f0f10]/80 backdrop-blur-md border-2 border-primary/20 rounded-2xl p-6">
                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-primary rounded-full"></span>
                  Categorías
                </h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        setActiveCategory(category.id);
                        setCurrentPage(1);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 flex items-center justify-between group ${
                        activeCategory === category.id
                          ? "bg-primary/20 text-primary border-2 border-primary shadow-lg"
                          : "bg-transparent text-white/70 hover:bg-primary/5 hover:text-white border-2 border-transparent"
                      }`}
                    >
                      <span>{category.label}</span>
                      {category.count !== undefined && (
                        <span
                          className={`text-xs px-2.5 py-1 rounded-lg font-semibold ${
                            activeCategory === category.id
                              ? "bg-primary/30 text-white"
                              : "bg-[#0b0b0c]/60 text-white/50 group-hover:bg-primary/10"
                          }`}
                        >
                          {category.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort Options Section */}
              <div className="bg-[#0f0f10]/80 backdrop-blur-md border-2 border-primary/20 rounded-2xl p-6">
                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-primary rounded-full"></span>
                  Ordenar por
                </h3>
                <div className="space-y-2">
                  {sortOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        setActiveSort(option.id);
                        setCurrentPage(1);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                        activeSort === option.id
                          ? "bg-primary/20 text-primary border-2 border-primary shadow-lg"
                          : "bg-transparent text-white/70 hover:bg-primary/5 hover:text-white border-2 border-transparent"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* RIGHT CONTENT - Products Grid */}
          <div className="flex-1 min-w-0">
            {/* Results Count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-white/70 font-medium text-sm">
                Mostrando <span className="text-white font-semibold">{paginatedProducts.length}</span> de{" "}
                <span className="text-white font-semibold">{filteredProducts.length}</span> productos
                {searchQuery && (
                  <span> para &quot;<span className="text-primary">{searchQuery}</span>&quot;</span>
                )}
              </p>
              {totalPages > 1 && (
                <p className="text-white/70 text-sm font-medium hidden sm:block">
                  Página <span className="text-white">{currentPage}</span> de{" "}
                  <span className="text-white">{totalPages}</span>
                </p>
              )}
            </div>

            {/* Products Grid - Responsive */}
            {paginatedProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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
                  <div className="flex items-center justify-center gap-2 pt-10">
                    {renderPaginationButtons()}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 bg-[#0f0f10]/40 backdrop-blur-md border-2 border-primary/20 rounded-2xl">
                <p className="text-white/70 text-lg font-medium mb-6">
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
        </div>
      </div>
    </section>
  );
};
