"use client";

import React, { useState, useEffect } from "react";
import { heroPackages } from "@/lib/data/mockProducts";
import Link from "next/link";
import { ShoppingBag, Radio } from "lucide-react";
import { Hero3DCharacter } from "./Hero3DCharacter";
import { HeroTurntableCharacter } from "./HeroTurntableCharacter";
import { CircuitNetworkBackground } from "@/components/ui/circuit-network-background";
import { AnimatePresence, motion } from "framer-motion";

// direction: 1 = el usuario avanza (el nuevo paquete entra desde la derecha),
// -1 = retrocede (entra desde la izquierda).
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
  exit: {
    opacity: 0,
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

// Bloque de texto: sale hacia el lado contrario al que entra el siguiente.
const textVariants = {
  hidden: (direction: number) => ({ opacity: 0, x: direction * 70 }),
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction * -70,
    transition: { duration: 0.35, ease: [0.7, 0, 0.84, 0] },
  }),
};

// La imagen recorre más distancia que el texto: paralaje entre capas.
const imageVariants = {
  hidden: (direction: number) => ({ opacity: 0, x: direction * 160, scale: 0.88 }),
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction * -160,
    scale: 0.88,
    transition: { duration: 0.4, ease: [0.7, 0, 0.84, 0] },
  }),
};

export const ShopHeroCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) {
      return;
    }

    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % heroPackages.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    if (index === currentIndex) {
      return;
    }
    setIsAutoPlaying(false);
    // La dirección la marca la posición del paquete destino respecto al actual.
    setDirection(index > currentIndex ? 1 : -1);
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

  // Giro del personaje del POS: fotogramas de la mesa giratoria, de mirar a un
  // lado al otro pasando por el frente en el 40. Solo el primer paquete tiene
  // secuencia; el resto usa imagen fija.
  const POS_FRONT_FRAME = 40;
  const posTurnFrames = Array.from(
    { length: 68 },
    (_, i) => `/imagenes/tienda/pos-turn/pos-${String(i).padStart(2, "0")}.webp`,
  );

  // Mapeo de imágenes disponibles
  const carouselImages = [
    "/imagenes/tienda/pos.png", // Sistema POS
    "/imagenes/tienda/heltec-duo-con-efecto.png" // Sistemas de Comunicación IoT - con efecto
  ];

  // Colores dinámicos según el paquete
  const colorSchemes: Array<{ primary: string; secondary: string }> = [
    { primary: "#08A696", secondary: "#26FFDF" }, // Verde/turquesa para POS (Paquete 1)
    { primary: "#08A696", secondary: "#26FFDF" }, // Verde/turquesa para Comunicación IoT (Paquete 2)
  ];

  const safeIndex = Math.max(0, Math.min(currentIndex, colorSchemes.length - 1));
  const currentColorScheme = colorSchemes[safeIndex]!;

  return (
    <section className="relative min-h-[calc(100dvh-80px)] flex items-center pt-[calc(var(--header-safe)+2.75rem)] sm:pt-32 md:pt-48 pb-10 md:pb-16 overflow-hidden">
      {/* Circuit Network Background - trazas PCB con pulsos de datos */}
      <div className="absolute inset-0 z-0">
        <CircuitNetworkBackground
          primaryColor={currentColorScheme.primary}
          secondaryColor={currentColorScheme.secondary}
        />
        
        {/* Máscara de estabilización de color - mantiene un tono uniforme
            aunque el esquema de color del carrusel cambie entre slides */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {/* Blur general para difuminar el fondo */}
          <div className="absolute inset-0 backdrop-blur-[2px]" />

          {/* Capa base gris: unifica el tono de todos los slides */}
          <div className="absolute inset-0 bg-[#1e2123]/40" />

          {/* Desaturación suave para que ningún esquema domine */}
          <div className="absolute inset-0 backdrop-saturate-[0.75] backdrop-brightness-[0.9]" />

          {/* Gradiente radial para crear foco central */}
          <div className="absolute inset-0 bg-gradient-radial from-transparent from-20% via-black/20 via-60% to-black/40" />

          {/* Vignette en los bordes para profundidad */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/40" />
        </div>
      </div>
      
      {/* Gradiente inferior: 100% opaco → transparente */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-background to-transparent z-[30] pointer-events-none" />

      {/* Grid Container - respeta el header */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Alto reservado: evita que la navegación salte mientras un slide
            sale y el siguiente todavía no entró. */}
        <div className="min-h-[26rem] sm:min-h-[30rem] lg:min-h-[34rem] flex items-center">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
        <motion.div
          key={currentIndex}
          className="w-full grid lg:grid-cols-2 gap-10 sm:gap-8 md:gap-12 lg:gap-16 items-center"
          custom={direction}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          
          {/* Left Side - Content Minimalista */}
          <div className="space-y-6 md:space-y-8 order-2 lg:order-1">
            {/* Title - Solo título y tagline */}
            <motion.div className="space-y-3 md:space-y-4" custom={direction} variants={textVariants}>
              <h1 className="text-2xl xs:text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-balance text-white drop-shadow-2xl">
                {currentPackage.name}
              </h1>
              <p className="text-primary text-lg sm:text-xl md:text-2xl font-medium drop-shadow-lg">
                {currentPackage.tagline}
              </p>
            </motion.div>

            {/* Description - Corta y puntual */}
            <motion.p className="text-base md:text-lg text-gray-200 leading-relaxed max-w-xl" custom={direction} variants={textVariants}>
              {currentPackage.description}
            </motion.p>

            {/* CTA - Minimalista */}
            <motion.div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6 pt-2 md:pt-4" custom={direction} variants={textVariants}>
              <Link
                href={`/tienda/${currentPackage.slug}`}
                className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-white/90 dark:bg-[#02505931] backdrop-blur-sm border border-[#08A696]/60 dark:border-[#08A696]/30 rounded-2xl text-[#08A696] dark:text-[#26FFDF] font-semibold text-base md:text-lg transition-all duration-300 hover:border-[#08A696] hover:bg-[#08A696]/10 dark:hover:bg-[#02505950] hover:shadow-xl hover:shadow-[#08A696]/10 hover:scale-105 inline-flex items-center justify-center gap-2"
              >
                Ver Paquete
                <ShoppingBag className="w-4 h-4 md:w-5 md:h-5" />
              </Link>
            </motion.div>
          </div>

          {/* Right Side - Solo imagen, sin stats */}
          <motion.div className="relative order-1 lg:order-2" custom={direction} variants={imageVariants}>
            <div className="relative w-full aspect-square max-w-sm sm:max-w-md mx-auto mt-2 sm:mt-0 lg:max-w-none">
              {/* Imagen principal con máscara de desvanecimiento */}
              <div 
                className="relative w-full h-full"
                style={{
                  maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)'
                }}
              >
                {currentIndex === 0 ? (
                  <HeroTurntableCharacter
                    frames={posTurnFrames}
                    frontIndex={POS_FRONT_FRAME}
                    alt={currentPackage.name}
                    className="h-full w-full"
                  />
                ) : (
                  <Hero3DCharacter
                    src={carouselImages[currentIndex] || "/imagenes/home/carrusel/sistemas_de_informacion.webp"}
                    alt={currentPackage.name}
                    className={`h-full w-full ${currentIndex === 1 ? 'animate-float-iot' : ''}`}
                    priority
                  />
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
        </AnimatePresence>
        </div>

        {/* Navigation - Iconos minimalistas */}
        <motion.div
          className="mt-12 md:mt-16 flex items-center justify-center gap-2 md:gap-3"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
        >
          {heroPackages.map((pkg, index) => {
            const Icon = index === 0 ? ShoppingBag : Radio;
            return (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`group relative transition-all duration-300 hover:opacity-100 ${
                  index === currentIndex ? "opacity-90" : "opacity-55"
                }`}
                aria-label={`Ir a ${pkg.name}`}
              >
                {/* Icono */}
                <div
                  className={`p-2 md:p-2.5 rounded-lg md:rounded-xl border bg-backgroundSecondary/50 border-primary/30 transition-all duration-300 ${
                    index === currentIndex
                      ? "brightness-150 shadow-lg shadow-primary/30"
                      : "hover:brightness-125"
                  }`}
                >
                  <Icon
                    className="w-4 h-4 md:w-[18px] md:h-[18px] text-primary transition-colors"
                  />
                </div>
              </button>
            );
          })}
        </motion.div>

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
