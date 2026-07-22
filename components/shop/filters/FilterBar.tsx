"use client";

import React from "react";
import { useTheme } from "@/components/theme-provider";

export interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface FilterBarProps {
  categories: FilterOption[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
  sortOptions: FilterOption[];
  activeSort: string;
  onSortChange: (sortId: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  categories,
  activeCategory,
  onCategoryChange,
  sortOptions,
  activeSort,
  onSortChange,
}) => {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const chipBase = isDark
    ? "bg-[#02505931] border-[#08A696]/20 text-[#a0a0a0] hover:border-[#08A696] hover:text-[#26FFDF]"
    : "bg-[#e6f7f6] border-[#08A696]/30 text-[#666666] hover:border-[#08A696] hover:text-[#08A696]"

  const chipActive = isDark
    ? "bg-[#08A696]/10 border-[#08A696] text-[#26FFDF]"
    : "bg-[#08A696]/10 border-[#08A696] text-[#08A696]"

  return (
    <div className="space-y-4">
      {/* Categories */}
      <div className="flex flex-wrap items-center gap-2">
        <span className={`text-xs font-semibold uppercase tracking-wider mr-1 ${isDark ? "text-[#a0a0a0]" : "text-[#666666]"}`}>
          Categorías:
        </span>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
              activeCategory === cat.id ? chipActive : chipBase
            }`}
          >
            {cat.label}
            {cat.count !== undefined && (
              <span className={`ml-1.5 opacity-60`}>({cat.count})</span>
            )}
          </button>
        ))}
      </div>

      {/* Sort */}
      <div className="flex flex-wrap items-center gap-2">
        <span className={`text-xs font-semibold uppercase tracking-wider mr-1 ${isDark ? "text-[#a0a0a0]" : "text-[#666666]"}`}>
          Ordenar:
        </span>
        {sortOptions.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onSortChange(opt.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
              activeSort === opt.id ? chipActive : chipBase
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
