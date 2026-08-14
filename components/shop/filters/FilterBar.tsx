"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface FilterBarProps {
  /** La barra puede vivir al pie: entonces las listas se abren hacia arriba. */
  openUpward?: boolean;
  categories: FilterOption[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
  sortOptions: FilterOption[];
  activeSort: string;
  onSortChange: (sortId: string) => void;
}

/** Lista desplegable de selección única, con el lenguaje visual del home. */
function FilterSelect({
  label,
  options,
  value,
  onChange,
  openUpward = false,
}: {
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (id: string) => void;
  openUpward?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selected = options.find((option) => option.id === value) ?? options[0];

  // Cerrar al hacer click fuera o con Escape
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

  return (
    <div className="relative flex items-center gap-2 min-w-0" ref={containerRef}>
      <span className="text-xs font-semibold uppercase tracking-wider text-textMuted whitespace-nowrap">
        {label}
      </span>

      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="inline-flex items-center justify-between gap-2 min-w-[11rem] rounded-xl border px-3 py-2 text-sm font-medium transition-all duration-300 bg-[#f4faf9] border-[#08A696]/25 text-[#08A696] hover:border-[#08A696]/50 dark:bg-[#052a30] dark:border-[#08A696]/25 dark:text-[#26FFDF] dark:hover:border-[#26FFDF]/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#26FFDF]/60"
      >
        <span className="truncate">
          {selected?.label}
          {selected?.count !== undefined && (
            <span className="ml-1.5 opacity-60">({selected.count})</span>
          )}
        </span>
        <ChevronDown
          className={`w-4 h-4 flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            role="listbox"
            aria-label={label}
            initial={{ opacity: 0, y: openUpward ? 6 : -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: openUpward ? 6 : -6 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            // Panel sólido: sobre la cuadrícula de productos, un fondo
            // translúcido dejaba ver las tarjetas y se volvía ilegible.
            className={`absolute left-auto right-0 ${openUpward ? "bottom-full mb-2" : "top-full mt-2"} z-[60] w-60 max-h-72 overflow-y-auto p-1.5 rounded-2xl border shadow-xl bg-[#f4faf9] border-[#08A696]/25 dark:bg-[#052a30] dark:border-[#08A696]/30`}
          >
            {options.map((option) => {
              const isSelected = option.id === value;
              return (
                <li key={option.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onChange(option.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm text-left transition-colors duration-200 ${
                      isSelected
                        ? "bg-[#c5ebe7] text-[#08A696] dark:bg-[#0d5d5d]/60 dark:text-[#26FFDF]"
                        : "text-textMuted hover:bg-[#08A696]/10 hover:text-textPrimary"
                    }`}
                  >
                    <span className="truncate">
                      {option.label}
                      {option.count !== undefined && (
                        <span className="ml-1.5 opacity-60">({option.count})</span>
                      )}
                    </span>
                    {isSelected && <Check className="w-4 h-4 flex-shrink-0" />}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export const FilterBar: React.FC<FilterBarProps> = ({
  openUpward = false,
  categories,
  activeCategory,
  onCategoryChange,
  sortOptions,
  activeSort,
  onSortChange,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
      <FilterSelect
        label="Categorías:"
        options={categories}
        value={activeCategory}
        onChange={onCategoryChange}
        openUpward={openUpward}
      />
      <FilterSelect
        label="Ordenar:"
        options={sortOptions}
        value={activeSort}
        onChange={onSortChange}
        openUpward={openUpward}
      />
    </div>
  );
};
