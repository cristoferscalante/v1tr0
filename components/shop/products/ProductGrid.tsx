"use client";

import React, { useState, useMemo } from "react";
import { ProductCard, type Product } from "./ProductCard";
import { FilterBar, type FilterOption } from "../filters/FilterBar";

interface ProductGridProps {
  products: Product[];
  onAddToCart?: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onAddToCart,
}) => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSort, setActiveSort] = useState("featured");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

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

  return (
    <section className="w-full py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
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
          <p className="text-textSecondary">
            Mostrando <span className="text-white font-semibold">{filteredProducts.length}</span> productos
            {searchQuery && (
              <span> para &quot;<span className="text-primary">{searchQuery}</span>&quot;</span>
            )}
          </p>
        </div>

        {/* Products Grid - 3 columnas */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                {...(onAddToCart && { onAddToCart })}
                onToggleFavorite={toggleFavorite}
                isFavorite={favorites.has(product.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-textSecondary text-lg">
              No se encontraron productos
              {searchQuery && ` para "${searchQuery}"`}
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
              }}
              className="mt-4 px-6 py-2 bg-primary/20 text-primary border border-primary/30 rounded-xl font-semibold transition-all duration-300 hover:bg-primary hover:text-background hover:shadow-glow"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
