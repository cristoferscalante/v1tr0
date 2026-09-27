"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "../products/ProductCard";

interface SmartSearchBarProps {
  products: Product[];
  onSearch: (query: string) => void;
  searchQuery: string;
  /** Versión discreta para convivir con los filtros en una misma barra. */
  compact?: boolean;
  /** Despliega las sugerencias hacia arriba (barra anclada al pie). */
  openUpward?: boolean;
  /** Enfoca el campo al montar (buscador desplegado desde la lupa del header). */
  autoFocus?: boolean;
}

export const SmartSearchBar: React.FC<SmartSearchBarProps> = ({
  products,
  onSearch,
  searchQuery,
  compact = false,
  openUpward = false,
  autoFocus = false,
}) => {
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

  const inputBg = "bg-[#232629]"
  const inputBorder = "border-[#08A696]/20"
  const inputFocusBorder = "focus:border-[#08A696]"
  const inputText = "text-white"
  const inputPlaceholder = "placeholder:text-white/40"
  const dropdownBg = "bg-[#1e2123]"
  const dropdownBorder = "border-[#08A696]/20"
  const suggestionBg = "hover:bg-[#08A696]/10"
  const suggestionBorder = "hover:border-[#08A696]/30"
  const textMuted = "text-white/50"
  const textMuted2 = "text-white/30"
  const footerBg = "bg-[#08A696]/5"
  const footerBorder = "border-[#08A696]/20"

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="relative group">
        <Search
          className={`pointer-events-none absolute z-10 top-1/2 -translate-y-1/2 transition-all duration-300 group-focus-within:scale-110 ${
            compact ? "left-3 w-4 h-4" : "left-5 w-6 h-6"
          } text-[#26FFDF]`}
        />
        <input
          type="text"
          placeholder={compact ? "Buscar productos..." : "Buscar productos por nombre, categoría..."}
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          onFocus={() => setIsFocused(true)}
          autoFocus={autoFocus}
          className={`w-full ${inputBg} ${inputFocusBorder} ${inputText} ${inputPlaceholder} focus:outline-none transition-all duration-300 font-medium ${
            compact
              ? `pl-9 pr-9 py-2 border ${inputBorder} rounded-xl text-sm`
              : `pl-12 sm:pl-16 pr-12 sm:pr-14 py-3.5 sm:py-5 border-2 ${inputBorder} rounded-2xl text-base shadow-lg shadow-[#08A696]/5 focus:shadow-xl focus:shadow-[#08A696]/10`
          }`}
        />
        {searchQuery && (
          <button
            onClick={handleClear}
            className={`absolute z-10 top-1/2 -translate-y-1/2 rounded-lg transition-all duration-200 hover:scale-110 ${
              compact ? "right-2 p-1" : "right-5 p-2.5"
            } hover:bg-[#08A696]/10`}
            aria-label="Limpiar búsqueda"
          >
            <X className={`${compact ? "w-4 h-4" : "w-5 h-5"} text-white/60 hover:text-white`} />
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
                <div className={`relative w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden border bg-[#232629] border-[#08A696]/15 group-hover:border-[#08A696]/50 transition-all duration-300`}>
                  <Image
                    src={product.image || "/imagenes/placeholders/placeholder.jpg"}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className={`font-semibold text-base truncate transition-colors text-white group-hover:text-[#26FFDF]`}>
                    {product.name}
                  </h4>
                  <p className={`text-sm truncate mt-1 ${textMuted}`}>
                    {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                  </p>
                  {product.stock > 0 ? (
                    <p className={`text-xs mt-1 text-[#26FFDF]/70`}>
                      {product.stock} en stock
                    </p>
                  ) : (
                    <p className="text-red-400/70 text-xs mt-1">Sin stock</p>
                  )}
                </div>

                <div className="text-right flex-shrink-0">
                  <p className={`font-bold text-lg text-[#26FFDF]`}>
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
            <p className={`text-sm text-center font-medium text-white/70`}>
              {suggestions.length} {suggestions.length === 1 ? "resultado encontrado" : "resultados encontrados"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
