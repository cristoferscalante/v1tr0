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
  /** Versión discreta para convivir con los filtros en una misma barra. */
  compact?: boolean;
  /** Despliega las sugerencias hacia arriba (barra anclada al pie). */
  openUpward?: boolean;
}

export const SmartSearchBar: React.FC<SmartSearchBarProps> = ({
  products,
  onSearch,
  searchQuery,
  compact = false,
  openUpward = false,
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

  const inputBg = isDark ? "bg-[#052a30]" : "bg-[#f4faf9]"
  const inputBorder = isDark ? "border-[#08A696]/20" : "border-[#08A696]/30"
  const inputFocusBorder = "focus:border-[#08A696]"
  const inputText = isDark ? "text-white" : "text-[#011c26]"
  const inputPlaceholder = isDark ? "placeholder:text-white/40" : "placeholder:text-[#08A696]/40"
  const dropdownBg = isDark ? "bg-[#052a30]" : "bg-[#f4faf9]"
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
        <Search
          className={`pointer-events-none absolute z-10 top-1/2 -translate-y-1/2 transition-all duration-300 group-focus-within:scale-110 ${
            compact ? "left-3 w-4 h-4" : "left-5 w-6 h-6"
          } ${isDark ? "text-[#26FFDF]" : "text-[#08A696]"}`}
        />
        <input
          type="text"
          placeholder={compact ? "Buscar productos..." : "Buscar productos por nombre, categoría..."}
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          onFocus={() => setIsFocused(true)}
          className={`w-full ${inputBg} ${inputFocusBorder} ${inputText} ${inputPlaceholder} focus:outline-none transition-all duration-300 font-medium ${
            compact
              ? `pl-9 pr-9 py-2 border ${inputBorder} rounded-xl text-sm`
              : `pl-16 pr-14 py-5 border-2 ${inputBorder} rounded-2xl text-base shadow-lg ${isDark ? "shadow-[#08A696]/5" : "shadow-[#08A696]/10"} focus:shadow-xl focus:shadow-[#08A696]/10`
          }`}
        />
        {searchQuery && (
          <button
            onClick={handleClear}
            className={`absolute z-10 top-1/2 -translate-y-1/2 rounded-lg transition-all duration-200 hover:scale-110 ${
              compact ? "right-2 p-1" : "right-5 p-2.5"
            } ${isDark ? "hover:bg-[#08A696]/10" : "hover:bg-[#08A696]/10"}`}
            aria-label="Limpiar búsqueda"
          >
            <X className={`${compact ? "w-4 h-4" : "w-5 h-5"} ${isDark ? "text-white/60 hover:text-white" : "text-[#666666] hover:text-[#08A696]"}`} />
          </button>
        )}
      </div>

      {showSuggestions && (
        <div className={`absolute ${openUpward ? "bottom-full mb-3" : "top-full mt-3"} ${compact ? "right-0 w-[26rem] max-w-[85vw]" : "left-0 right-0"} ${dropdownBg} border ${dropdownBorder} rounded-2xl shadow-2xl overflow-hidden z-[60] animate-slide-in-down`}>
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
                <div className={`relative w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden border ${isDark ? "bg-[#02505931] border-[#08A696]/20" : "bg-[#e6f7f6] border-[#08A696]/30"} group-hover:border-[#08A696]/50 transition-all duration-300`}>
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

          <div className={`px-5 py-3 ${footerBg} border-t ${footerBorder}`}>
            <p className={`text-sm text-center font-medium ${isDark ? "text-white/70" : "text-[#666666]"}`}>
              {suggestions.length} {suggestions.length === 1 ? "resultado encontrado" : "resultados encontrados"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
