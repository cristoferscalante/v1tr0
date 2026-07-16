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
}

export const SmartSearchBar: React.FC<SmartSearchBarProps> = ({
  products,
  onSearch,
  searchQuery,
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
        .slice(0, 5); // Máximo 5 sugerencias
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery, products]);

  // Cerrar sugerencias al hacer clic fuera
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

  return (
    <div ref={searchRef} className="relative w-full">
      {/* Search Input */}
      <div className="relative group">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-primary transition-all duration-300 group-focus-within:text-primary group-focus-within:scale-110" />
        <input
          type="text"
          placeholder="Buscar productos por nombre, categoría..."
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          onFocus={() => setIsFocused(true)}
          className="w-full pl-16 pr-14 py-5 bg-[#0b0b0c]/60 backdrop-blur-xl border-2 border-primary/40 rounded-2xl text-white placeholder:text-white/40 focus:outline-none focus:border-primary focus:bg-[#0b0b0c]/80 transition-all duration-300 font-medium text-base shadow-[0_4px_20px_rgba(8,166,150,0.15)] focus:shadow-[0_8px_30px_rgba(8,166,150,0.25)]"
        />
        {searchQuery && (
          <button
            onClick={handleClear}
            className="absolute right-5 top-1/2 -translate-y-1/2 p-2.5 hover:bg-primary/10 rounded-lg transition-all duration-200 hover:scale-110"
            aria-label="Limpiar búsqueda"
          >
            <X className="w-5 h-5 text-white/60 hover:text-white" />
          </button>
        )}
      </div>

      {/* Search Suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-[#0b0b0c]/98 backdrop-blur-xl border-2 border-primary/40 rounded-2xl shadow-[0_8px_40px_rgba(8,166,150,0.2)] overflow-hidden z-50 animate-slide-in-down">
          <div className="p-2 space-y-1 max-h-[420px] overflow-y-auto custom-scrollbar">
            {suggestions.map((product) => (
              <Link
                key={product.id}
                href={`/tienda/${product.slug}`}
                onClick={() => {
                  setIsFocused(false);
                  onSearch("");
                }}
                className="flex items-center gap-4 p-4 rounded-xl hover:bg-primary/10 transition-all duration-200 group border border-transparent hover:border-primary/30"
              >
                {/* Product Image */}
                <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-[#0b0b0c] border-2 border-primary/20 group-hover:border-primary/50 transition-all duration-300">
                  <Image
                    src={product.image || "/imagenes/placeholders/placeholder.jpg"}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-semibold text-base truncate group-hover:text-primary transition-colors">
                    {product.name}
                  </h4>
                  <p className="text-white/50 text-sm truncate mt-1">
                    {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                  </p>
                  {product.stock > 0 ? (
                    <p className="text-primary/70 text-xs mt-1">
                      {product.stock} en stock
                    </p>
                  ) : (
                    <p className="text-red-400/70 text-xs mt-1">
                      Sin stock
                    </p>
                  )}
                </div>

                {/* Price */}
                <div className="text-right flex-shrink-0">
                  <p className="text-primary font-bold text-lg">
                    ${product.price.toLocaleString()}
                  </p>
                  {product.originalPrice && (
                    <p className="text-white/30 text-sm line-through">
                      ${product.originalPrice.toLocaleString()}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {/* Footer */}
          <div className="px-5 py-3 bg-primary/5 border-t-2 border-primary/20 backdrop-blur-sm">
            <p className="text-white/70 text-sm text-center font-medium">
              {suggestions.length} {suggestions.length === 1 ? "resultado encontrado" : "resultados encontrados"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
