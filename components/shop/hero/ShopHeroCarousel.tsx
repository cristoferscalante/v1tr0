"use client";

import React, { useState, useEffect } from "react";
import { heroPackages } from "@/lib/data/mockProducts";
import Link from "next/link";
import Image from "next/image";
import { Package, ShoppingBag, Radio } from "lucide-react";
import { AnimatedGradientLines } from "@/components/ui/animated-gradient-lines";

export const ShopHeroCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroPackages.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  // Guard: Si no hay paquetes disponibles
  if (heroPackages.length === 0) {
    return null;
  }

  const currentPackage = heroPackages[currentIndex];
  
  // Safety check
  if (!currentPackage) {
    return null;
  }

  // Mapeo de imágenes disponibles
  const carouselImages = [
    "/imagenes/tienda/pos.png", // Sistema POS
    "/imagenes/home/carrusel/desarrollo_web_end_backup.webp", // Hardware V1TR0
    "/imagenes/tienda/heltec-duo-con-efecto.png" // Sistemas de Comunicación IoT - con efecto
  ];

  // Colores dinámicos según el paquete
  const colorSchemes: Array<{ primary: string; secondary: string }> = [
    { primary: "#08A696", secondary: "#26FFDF" }, // Verde/turquesa para POS (Paquete 1)
    { primary: "#F5F5DC", secondary: "#FFFAF0" }, // Blanco hueso para Hardware (Paquete 2)
    { primary: "#08A696", secondary: "#26FFDF" }, // Verde/turquesa para Comunicación IoT (Paquete 3) - igual que Paquete 1
  ];

  const safeIndex = Math.max(0, Math.min(currentIndex, colorSchemes.length - 1));
  const currentColorScheme = colorSchemes[safeIndex]!;

  return (
    <section className="relative min-h-[calc(100vh-80px)] flex items-center pt-40 pb-12 md:pt-48 md:pb-16 overflow-hidden">
      {/* Animated Gradient Lines Background */}
      <div className="absolute inset-0 z-0">
        <AnimatedGradientLines
          primaryColor={currentColorScheme.primary}
          secondaryColor={currentColorScheme.secondary}
        />
        
        {/* Blur Mask Layer sobre el fondo - Profundidad */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {/* Blur general para difuminar el fondo */}
          <div className="absolute inset-0 backdrop-blur-[8px]" />
          
          {/* Gradiente radial para crear foco central */}
          <div className="absolute inset-0 bg-gradient-radial from-transparent from-20% via-black/20 via-60% to-black/40" />
          
          {/* Vignette en los bordes para profundidad */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/40" />
          
          {/* Overlay sutil para mejor contraste del texto */}
          <div className="absolute inset-0 bg-black/10" />
        </div>
      </div>
      
      {/* Grid Container - respeta el header */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          
          {/* Left Side - Content Minimalista */}
          <div className="space-y-6 md:space-y-8 order-2 lg:order-1">
            {/* Title - Solo título y tagline */}
            <div className="space-y-3 md:space-y-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-white drop-shadow-2xl">
                {currentPackage.name}
              </h1>
              <p className="text-primary text-lg sm:text-xl md:text-2xl font-medium drop-shadow-lg">
                {currentPackage.tagline}
              </p>
            </div>

            {/* Description - Corta y puntual */}
            <p className="text-base md:text-lg text-gray-200 leading-relaxed max-w-xl">
              {currentPackage.description}
            </p>

            {/* CTA + Price - Minimalista */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6 pt-2 md:pt-4">
              <Link
                href={`/tienda/${currentPackage.slug}`}
                className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-white/90 dark:bg-[#02505931] backdrop-blur-sm border border-[#08A696]/60 dark:border-[#08A696]/30 rounded-2xl text-[#08A696] dark:text-[#26FFDF] font-semibold text-base md:text-lg transition-all duration-300 hover:border-[#08A696] hover:bg-[#08A696]/10 dark:hover:bg-[#02505950] hover:shadow-xl hover:shadow-[#08A696]/10 hover:scale-105 inline-flex items-center justify-center gap-2"
              >
                Ver Paquete
                <ShoppingBag className="w-4 h-4 md:w-5 md:h-5" />
              </Link>

              <div>
                <span className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                  ${currentPackage.price.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Right Side - Solo imagen, sin stats */}
          <div className="relative order-1 lg:order-2">
            <div className="relative w-full aspect-square max-w-md mx-auto lg:max-w-none">
              {/* Imagen principal con máscara de desvanecimiento */}
              <div 
                className="relative w-full h-full"
                style={{
                  maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)'
                }}
              >
                <Image
                  src={carouselImages[currentIndex] || "/imagenes/home/carrusel/sistemas_de_informacion.webp"}
                  alt={currentPackage.name}
                  fill
                  className={`object-contain drop-shadow-2xl ${
                    currentIndex === 2 ? 'animate-float-iot' : ''
                  }`}
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation - Iconos minimalistas */}
        <div className="mt-12 md:mt-16 flex items-center justify-center gap-3 md:gap-4">
          {heroPackages.map((pkg, index) => {
            const Icon = index === 0 ? ShoppingBag : index === 1 ? Package : Radio;
            return (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className="group relative transition-all duration-300"
                aria-label={`Ir a ${pkg.name}`}
              >
                {/* Icono */}
                <div
                  className={`p-3 md:p-4 rounded-xl md:rounded-2xl border-2 bg-backgroundSecondary/50 border-primary/30 transition-all duration-300 ${
                    index === currentIndex
                      ? "brightness-150 shadow-lg shadow-primary/30"
                      : "hover:brightness-125"
                  }`}
                >
                  <Icon
                    className="w-5 h-5 md:w-6 md:h-6 text-primary transition-colors"
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Auto-play indicator - minimalista */}
        <div className="mt-8 sm:mt-12 text-center">
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="text-xs text-textSecondary hover:text-primary transition-colors px-4 py-2"
          >
            {isAutoPlaying ? "⏸" : "▶"} {isAutoPlaying ? "Pausar" : "Reproducir"}
          </button>
        </div>
      </div>
    </section>
  );
};
