"use client";

import React, { useState } from "react";
import { Search, X, ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react";

export interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface PriceRange {
  min: number;
  max: number;
}

interface ShopSidebarProps {
  // Search
  searchQuery: string;
  onSearch: (query: string) => void;
  
  // Categories
  categories: FilterOption[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
  
  // Price Range
  priceRange: PriceRange;
  onPriceRangeChange: (range: PriceRange) => void;
  minPrice: number;
  maxPrice: number;
  
  // Related Products (opcional)
  relatedProducts?: Array<{
    id: string;
    name: string;
    price: number;
    image: string;
  }>;
}

export const ShopSidebar: React.FC<ShopSidebarProps> = ({
  searchQuery,
  onSearch,
  categories,
  activeCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  minPrice,
  maxPrice,
  relatedProducts = [],
}) => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(true);
  const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(true);
  const [isPriceExpanded, setIsPriceExpanded] = useState(true);
  const [isRelatedExpanded, setIsRelatedExpanded] = useState(true);
  
  const [localMinPrice, setLocalMinPrice] = useState(priceRange.min);
  const [localMaxPrice, setLocalMaxPrice] = useState(priceRange.max);

  const handleClearSearch = () => {
    onSearch("");
  };

  const handleApplyPriceFilter = () => {
    onPriceRangeChange({
      min: localMinPrice,
      max: localMaxPrice,
    });
  };

  const handleResetPriceFilter = () => {
    setLocalMinPrice(minPrice);
    setLocalMaxPrice(maxPrice);
    onPriceRangeChange({
      min: minPrice,
      max: maxPrice,
    });
  };

  return (
    <aside className="w-full space-y-4">
      {/* Search Section */}
      <div className="bg-[#2d2640]/40 backdrop-blur-md rounded-xl border border-[#6b5b95]/20 overflow-hidden">
        <button
          onClick={() => setIsSearchExpanded(!isSearchExpanded)}
          className="w-full px-5 py-4 flex items-center justify-between text-white hover:bg-[#3a3050]/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Search className="w-5 h-5 text-[#a89dd8]" />
            <span className="font-semibold uppercase tracking-wide text-sm">Búsqueda</span>
          </div>
          {isSearchExpanded ? (
            <ChevronUp className="w-5 h-5 text-white/60" />
          ) : (
            <ChevronDown className="w-5 h-5 text-white/60" />
          )}
        </button>
        
        {isSearchExpanded && (
          <div className="px-5 pb-5">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                className="w-full px-4 py-2.5 pl-10 bg-[#1a1625]/60 border border-[#6b5b95]/30 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-[#8b7bc5]/60 transition-colors"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-[#8b7bc5]/20 rounded-md transition-colors"
                  aria-label="Limpiar búsqueda"
                >
                  <X className="w-4 h-4 text-white/60" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Categories Section */}
      <div className="bg-[#2d2640]/40 backdrop-blur-md rounded-xl border border-[#6b5b95]/20 overflow-hidden">
        <button
          onClick={() => setIsCategoriesExpanded(!isCategoriesExpanded)}
          className="w-full px-5 py-4 flex items-center justify-between text-white hover:bg-[#3a3050]/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <SlidersHorizontal className="w-5 h-5 text-[#a89dd8]" />
            <span className="font-semibold uppercase tracking-wide text-sm">Categorías</span>
          </div>
          {isCategoriesExpanded ? (
            <ChevronUp className="w-5 h-5 text-white/60" />
          ) : (
            <ChevronDown className="w-5 h-5 text-white/60" />
          )}
        </button>
        
        {isCategoriesExpanded && (
          <div className="px-5 pb-5 space-y-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`w-full text-left px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-between ${
                  activeCategory === category.id
                    ? "bg-[#8b7bc5]/20 text-white border border-[#8b7bc5]/40"
                    : "bg-transparent text-white/70 hover:bg-[#3a3050]/30 hover:text-white border border-transparent"
                }`}
              >
                <span>{category.label}</span>
                {category.count !== undefined && (
                  <span
                    className={`text-xs px-2 py-1 rounded-md ${
                      activeCategory === category.id
                        ? "bg-[#8b7bc5]/30 text-white"
                        : "bg-[#1a1625]/60 text-white/50"
                    }`}
                  >
                    {category.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Price Range Filter */}
      <div className="bg-[#2d2640]/40 backdrop-blur-md rounded-xl border border-[#6b5b95]/20 overflow-hidden">
        <button
          onClick={() => setIsPriceExpanded(!isPriceExpanded)}
          className="w-full px-5 py-4 flex items-center justify-between text-white hover:bg-[#3a3050]/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-[#a89dd8] text-xl">$</span>
            <span className="font-semibold uppercase tracking-wide text-sm">Filtrar por Precio</span>
          </div>
          {isPriceExpanded ? (
            <ChevronUp className="w-5 h-5 text-white/60" />
          ) : (
            <ChevronDown className="w-5 h-5 text-white/60" />
          )}
        </button>
        
        {isPriceExpanded && (
          <div className="px-5 pb-5 space-y-4">
            {/* Price Inputs */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-white/60 mb-1 block">Mínimo</label>
                <input
                  type="number"
                  min={minPrice}
                  max={maxPrice}
                  value={localMinPrice}
                  onChange={(e) => setLocalMinPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#1a1625]/60 border border-[#6b5b95]/30 rounded-lg text-white text-sm focus:outline-none focus:border-[#8b7bc5]/60 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-white/60 mb-1 block">Máximo</label>
                <input
                  type="number"
                  min={minPrice}
                  max={maxPrice}
                  value={localMaxPrice}
                  onChange={(e) => setLocalMaxPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#1a1625]/60 border border-[#6b5b95]/30 rounded-lg text-white text-sm focus:outline-none focus:border-[#8b7bc5]/60 transition-colors"
                />
              </div>
            </div>

            {/* Range Slider - Dual Handle */}
            <div className="space-y-2">
              <div className="relative h-2 bg-[#1a1625]/60 rounded-full">
                <div
                  className="absolute h-full bg-gradient-to-r from-[#8b7bc5] to-[#a89dd8] rounded-full"
                  style={{
                    left: `${((localMinPrice - minPrice) / (maxPrice - minPrice)) * 100}%`,
                    right: `${100 - ((localMaxPrice - minPrice) / (maxPrice - minPrice)) * 100}%`,
                  }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-white/50">
                <span>${minPrice.toLocaleString()}</span>
                <span>${maxPrice.toLocaleString()}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleApplyPriceFilter}
                className="flex-1 px-4 py-2 bg-transparent border-2 border-[#8b7bc5]/60 text-white rounded-lg font-semibold text-sm hover:bg-[#8b7bc5]/20 transition-all duration-200"
              >
                Aplicar
              </button>
              <button
                onClick={handleResetPriceFilter}
                className="px-4 py-2 bg-[#1a1625]/60 border border-[#6b5b95]/30 text-white/70 rounded-lg font-medium text-sm hover:bg-[#3a3050]/30 transition-all duration-200"
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Related Products (opcional) */}
      {relatedProducts.length > 0 && (
        <div className="bg-[#2d2640]/40 backdrop-blur-md rounded-xl border border-[#6b5b95]/20 overflow-hidden">
          <button
            onClick={() => setIsRelatedExpanded(!isRelatedExpanded)}
            className="w-full px-5 py-4 flex items-center justify-between text-white hover:bg-[#3a3050]/30 transition-colors"
          >
            <span className="font-semibold uppercase tracking-wide text-sm">Productos Destacados</span>
            {isRelatedExpanded ? (
              <ChevronUp className="w-5 h-5 text-white/60" />
            ) : (
              <ChevronDown className="w-5 h-5 text-white/60" />
            )}
          </button>
          
          {isRelatedExpanded && (
            <div className="px-5 pb-5 space-y-3">
              {relatedProducts.slice(0, 3).map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#3a3050]/30 transition-colors cursor-pointer"
                >
                  <div className="w-12 h-12 bg-[#1a1625]/60 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{product.name}</p>
                    <p className="text-[#a89dd8] text-sm font-semibold">${product.price}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </aside>
  );
};
