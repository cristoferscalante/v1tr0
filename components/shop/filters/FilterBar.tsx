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
    <div className="w-full space-y-4">
      {/* Search Bar & Filter Toggle */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-textSecondary" />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-12 pr-12 py-3 bg-backgroundSecondary/50 backdrop-blur-sm border border-primary/20 rounded-xl text-white placeholder:text-textSecondary focus:outline-none focus:border-primary focus:shadow-glow transition-all duration-300"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-primary/20 rounded-full transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4 text-textSecondary" />
            </button>
          )}
        </div>

        {/* Filter Toggle (Mobile) */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="sm:hidden flex items-center justify-center gap-2 px-6 py-3 bg-backgroundSecondary/50 backdrop-blur-sm border border-primary/20 rounded-xl text-white font-semibold transition-all duration-300 hover:border-primary hover:shadow-glow"
        >
          <SlidersHorizontal className="w-5 h-5" />
          Filtros
        </button>
      </div>

      {/* Filters Container */}
      <div className={`space-y-4 ${showFilters ? "block" : "hidden sm:block"}`}>
        {/* Category Filters */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-textSecondary uppercase tracking-wide">
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
          <div className="space-y-2">
            <label className="text-sm font-semibold text-textSecondary uppercase tracking-wide">
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
      className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 ${
        isActive
          ? "bg-primary text-background shadow-glow scale-105"
          : "bg-backgroundSecondary/50 text-white border border-primary/20 hover:border-primary hover:bg-primary/10"
      }`}
    >
      {label}
      {count !== undefined && (
        <span className={`ml-2 ${isActive ? "text-background/70" : "text-textSecondary"}`}>
          ({count})
        </span>
      )}
    </button>
  );
};
