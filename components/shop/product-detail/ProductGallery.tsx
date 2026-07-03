"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images, productName }) => {
  const [selectedImage, setSelectedImage] = useState(0);

  const goToNext = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const goToPrev = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  // Si no hay imágenes, mostrar placeholder
  if (!images || images.length === 0) {
    return (
      <div className="w-full space-y-4">
        {/* Main Image Placeholder */}
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-32 h-32 mx-auto bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30">
                <span className="text-6xl">📦</span>
              </div>
              <p className="text-textSecondary">Imagen del producto</p>
            </div>
          </div>
        </div>

        {/* Thumbnails Placeholder */}
        <div className="grid grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="aspect-square rounded-xl bg-backgroundSecondary/50 border border-primary/20"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-backgroundSecondary border border-primary/20 group cursor-zoom-in">
        <div className="relative w-full h-full overflow-hidden">
          <Image
            src={images[selectedImage] || "/imagenes/placeholder.jpg"}
            alt={`${productName} - imagen ${selectedImage + 1}`}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            priority={selectedImage === 0}
          />
        </div>

        {/* Navigation Arrows (only show if multiple images) */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-background/80 backdrop-blur-sm border border-primary/30 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:border-primary z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-background/80 backdrop-blur-sm border border-primary/30 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:border-primary z-10"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-background/80 backdrop-blur-sm border border-primary/30 rounded-full text-white text-sm font-semibold z-10">
            {selectedImage + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                index === selectedImage
                  ? "border-primary scale-95"
                  : "border-primary/20 hover:border-primary/50"
              }`}
            >
              <Image
                src={image}
                alt={`${productName} - thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
