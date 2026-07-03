"use client";

import React from "react";
import Link from "next/link";
import { ProductCard, type Product } from "../products/ProductCard";

interface RelatedProductsProps {
  products: Product[];
  onAddToCart?: (product: Product) => void;
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({ products, onAddToCart }) => {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="py-12 border-t border-primary/20">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-white">También te puede interesar</h2>
        <Link href="/tienda" className="text-primary hover:text-primary/80 font-semibold transition-colors">
          Ver todos →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.slice(0, 4).map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            {...(onAddToCart && { onAddToCart })}
          />
        ))}
      </div>
    </section>
  );
};
