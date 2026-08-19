"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface ProductSpecificationsProps {
  specifications?: Record<string, string>;
}

export const ProductSpecifications: React.FC<ProductSpecificationsProps> = ({ specifications }) => {
  const [isOpen, setIsOpen] = useState(true);

  if (!specifications || Object.keys(specifications).length === 0) {
    return null;
  }

  return (
    <div className="border-t border-primary/20 py-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left group"
      >
        <h3 className="text-xl font-bold text-white">Especificaciones Técnicas</h3>
        <ChevronDown
          className={`w-6 h-6 text-primary transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`grid gap-3 transition-all duration-300 overflow-hidden ${
          isOpen ? "mt-6 max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {Object.entries(specifications).map(([key, value]) => (
          <div
            key={key}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-4 p-4 shop-surface rounded-xl border shop-border"
          >
            <dt className="text-textSecondary font-semibold w-full sm:w-auto sm:min-w-[150px]">{key}:</dt>
            <dd className="text-white break-words min-w-0">{value}</dd>
          </div>
        ))}
      </div>
    </div>
  );
};
