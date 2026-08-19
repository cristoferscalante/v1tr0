"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { SmartSearchBar } from "./SmartSearchBar";
import { setShopSearchQuery, useShopSearch } from "./shopSearchStore";

/**
 * Lupa del header: sólo aparece cuando la tienda registró sus productos.
 * Al abrirse despliega el buscador inteligente que antes vivía en la barra de
 * filtros del catálogo.
 */
export const ShopSearchTrigger: React.FC = () => {
  const { products, query } = useShopSearch();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) { return undefined }

    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) { setIsOpen(false) }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setIsOpen(false) }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  if (products.length === 0) { return null }

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? "Cerrar búsqueda" : "Buscar productos"}
        aria-expanded={isOpen}
        className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[#02505931] backdrop-blur-sm border border-[#08A696]/30 text-[#26FFDF] transition-all duration-300 hover:scale-105 hover:border-[#08A696] hover:bg-[#02505950] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#26FFDF]/60"
      >
        {isOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 top-full mt-3 z-[70] w-[24rem] max-w-[85vw]"
          >
            <SmartSearchBar
              products={products}
              onSearch={setShopSearchQuery}
              searchQuery={query}
              compact
              autoFocus
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
