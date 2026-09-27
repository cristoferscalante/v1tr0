"use client";

import React from "react";
import { Check } from "lucide-react";

interface ProductUsesProps {
  uses: string[];
}

/** Usos recomendados del producto: para qué sirve en la práctica. */
export const ProductUses: React.FC<ProductUsesProps> = ({ uses }) => {
  if (uses.length === 0) {
    return null;
  }

  return (
    <div className="border-t border-primary/20 py-6">
      <h3 className="text-xl font-bold text-white">Usos recomendados</h3>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {uses.map((use) => (
          <li key={use} className="flex items-start gap-3 p-4 shop-surface rounded-xl border shop-border">
            <Check className="w-5 h-5 mt-0.5 shrink-0 text-primary" aria-hidden="true" />
            <span className="text-textSecondary leading-relaxed">{use}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
