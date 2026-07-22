"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "../products/ProductCard";
import { useTheme } from "@/components/theme-provider";

interface SmartSearchBarProps {
  products: Product[];
  onSearch: (query: string) => void;
  searchQuery: string;
}

export const SmartSearchBar: React.FC<SmartSearchBarProps> = ({
  products,
  onSearch,
  searchQuery,
}) => {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      const filtered = products
        .filter((product) => {
          const query = searchQuery.toLowerCase();
          return (
            product.name.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query)
          );
        })
        .slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery, products]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClear = () => {
    onSearch("");
    setSuggestions([]);
  };

  const showSuggestions = isFocused && suggestions.length > 0;

  const inputBg = isDark ? "bg-[#02505931] backdrop-blur-sm" : "bg-[#e6f7f6] backdrop-blur-sm"
  const inputBorder = isDark ? "border-[#08A696]/20" : "border-[#08A696]/30"
  const inputFocusBorder = "focus:border-[#08A696]"
  const inputText = isDark ? "text-white" : "text-[#011c26]"
  const inputPlaceholder = isDark ? "placeholder:text-white/40" : "placeholder:text-[#08A696]/40"
  const dropdownBg = isDark ? "bg-[#0f0f10]/98" : "bg-[#faf9f7]/98"
  const dropdownBorder = isDark ? "border-[#08A696]/20" : "border-[#08A696]/30"
  const suggestionBg = isDark ? "hover:bg-[#08A696]/10" : "hover:bg-[#08A696]/5"
  const suggestionBorder = isDark ? "hover:border-[#08A696]/30" : "hover:border-[#08A696]/20"
  const textMuted = isDark ? "text-white/50" : "text-[#666666]"
  const textMuted2 = isDark ? "text-white/30" : "text-[#666666]/60"
  const footerBg = isDark ? "bg-[#08A696]/5" : "bg-[#08A696]/5"
  const footerBorder = isDark ? "border-[#08A696]/20" : "border-[#08A696]/30"

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="relative group">
        <Search className={`absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 transition-all duration-300 group-focus-within:scale-110 ${isDark ? "text-[#26FFDF]" : "text-[#08A696]"}`} />
        <input
          type="text"
          placeholder="Buscar productos por nombre, categoría..."
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          onFocus={() => setIsFocused(true)}
          className={`w-full pl-16 pr-14 py-5 ${inputBg} border-2 ${inputBorder} ${inputFocusBorder} rounded-2xl ${inputText} ${inputPlaceholder} focus:outline-none transition-all duration-300 font-medium text-base shadow-lg ${isDark ? "shadow-[#08A696]/5" : "shadow-[#08A696]/10"} focus:shadow-xl focus:shadow-[#08A696]/10`}
        />
        {searchQuery && (
          <button
            onClick={handleClear}
            className={`absolute right-5 top-1/2 -translate-y-1/2 p-2.5 rounded-lg transition-all duration-200 hover:scale-110 ${isDark ? "hover:bg-[#08A696]/10" : "hover:bg-[#08A696]/10"}`}
            aria-label="Limpiar búsqueda"
          >
            <X className={`w-5 h-5 ${isDark ? "text-white/60 hover:text-white" : "text-[#666666] hover:text-[#08A696]"}`} />
          </button>
        )}
      </div>

      {showSuggestions && (
        <div className={`absolute top-full left-0 right-0 mt-3 ${dropdownBg} backdrop-blur-xl border-2 ${dropdownBorder} rounded-2xl shadow-xl overflow-hidden z-50 animate-slide-in-down`}>
          <div className="p-2 space-y-1 max-h-[420px] overflow-y-auto custom-scrollbar">
            {suggestions.map((product) => (
              <Link
                key={product.id}
                href={`/tienda/${product.slug}`}
                onClick={() => {
                  setIsFocused(false);
                  onSearch("");
                }}
                className={`flex items-center gap-4 p-4 rounded-xl ${suggestionBg} transition-all duration-200 group border border-transparent ${suggestionBorder}`}
              >
                <div className={`relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 ${isDark ? "bg-[#02505931] border-[#08A696]/20" : "bg-[#e6f7f6] border-[#08A696]/30"} group-hover:border-[#08A696]/50 transition-all duration-300`}>
                  <Image
                    src={product.image || "/imagenes/placeholders/placeholder.jpg"}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className={`font-semibold text-base truncate transition-colors ${isDark ? "text-white group-hover:text-[#26FFDF]" : "text-[#011c26] group-hover:text-[#08A696]"}`}>
                    {product.name}
                  </h4>
                  <p className={`text-sm truncate mt-1 ${textMuted}`}>
                    {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                  </p>
                  {product.stock > 0 ? (
                    <p className={`text-xs mt-1 ${isDark ? "text-[#26FFDF]/70" : "text-[#08A696]/70"}`}>
                      {product.stock} en stock
                    </p>
                  ) : (
                    <p className="text-red-400/70 text-xs mt-1">Sin stock</p>
                  )}
                </div>

                <div className="text-right flex-shrink-0">
                  <p className={`font-bold text-lg ${isDark ? "text-[#26FFDF]" : "text-[#08A696]"}`}>
                    ${product.price.toLocaleString()}
                  </p>
                  {product.originalPrice && (
                    <p className={`text-sm line-through ${textMuted2}`}>
                      ${product.originalPrice.toLocaleString()}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>

          <div className={`px-5 py-3 ${footerBg} border-t-2 ${footerBorder} backdrop-blur-sm`}>
            <p className={`text-sm text-center font-medium ${isDark ? "text-white/70" : "text-[#666666]"}`}>
              {suggestions.length} {suggestions.length === 1 ? "resultado encontrado" : "resultados encontrados"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
