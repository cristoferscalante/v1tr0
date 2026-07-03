"use client";

import React, { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";

export interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface FilterBarProps {
  categories: FilterOption[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
  onSearch?: (query: string) => void;
  sortOptions?: FilterOption[];
  activeSort?: string;
  onSortChange?: (sortId: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  categories,
  activeCategory,
  onCategoryChange,
  onSearch,
  sortOptions = [],
  activeSort = "",
  onSortChange,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch?.(query);
  };

  const clearSearch = () => {
    setSearchQuery("");
    onSearch?.("");
  };

  return (
    <div className="w-full space-y-5">
      {/* Search Bar & Filter Toggle */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input - Diseño limpio y sobrio */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#26FFDF]/40" />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-12 pr-12 py-3 bg-[#0f0f10]/60 backdrop-blur-sm border border-[#08A696]/20 text-[#e0e0e0] placeholder:text-[#808080] focus:outline-none focus:border-[#08A696]/50 transition-colors duration-200 font-medium"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-[#08A696]/10 transition-colors"
              aria-label="Limpiar búsqueda"
            >
              <X className="w-4 h-4 text-[#808080]" />
            </button>
          )}
        </div>

        {/* Filter Toggle (Mobile) */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="sm:hidden flex items-center justify-center gap-2 px-6 py-3 bg-[#0f0f10]/60 backdrop-blur-sm border border-[#08A696]/20 text-[#e0e0e0] font-medium transition-colors duration-200 hover:border-[#08A696]/40"
        >
          <SlidersHorizontal className="w-5 h-5" />
          Filtros
        </button>
      </div>

      {/* Filters Container */}
      <div className={`space-y-5 ${showFilters ? "block" : "hidden sm:block"}`}>
        {/* Category Filters */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-[#808080] uppercase tracking-wider">
            Categorías
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <FilterButton
                key={category.id}
                label={category.label}
                count={category.count ?? 0}
                isActive={activeCategory === category.id}
                onClick={() => onCategoryChange(category.id)}
              />
            ))}
          </div>
        </div>

        {/* Sort Options */}
        {sortOptions.length > 0 && onSortChange && (
          <div className="space-y-3">
            <label className="text-xs font-bold text-[#808080] uppercase tracking-wider">
              Ordenar por
            </label>
            <div className="flex flex-wrap gap-2">
              {sortOptions.map((option) => (
                <FilterButton
                  key={option.id}
                  label={option.label}
                  count={0}
                  isActive={activeSort === option.id}
                  onClick={() => onSortChange(option.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface FilterButtonProps {
  label: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({
  label,
  count,
  isActive,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 font-medium text-sm transition-all duration-200 ${
        isActive
          ? "bg-[#08A696]/15 border border-[#08A696]/60 text-[#26FFDF]"
          : "bg-[#0f0f10]/40 border border-[#08A696]/10 text-[#b0b0b0] hover:border-[#08A696]/30 hover:text-[#e0e0e0]"
      }`}
    >
      {label}
      {count > 0 && (
        <span className={`ml-2 ${isActive ? "text-[#26FFDF]/60" : "text-[#808080]"}`}>
          ({count})
        </span>
      )}
    </button>
  );
};
