"use client";

import React from "react";
import { useShopHeroAnimation } from "./useShopHeroAnimation";
import clsx from "clsx";

const primaryClass = "text-primary";

export const ShopHero: React.FC = () => {
  const { title, subtitle, animRef } = useShopHeroAnimation();

  return (
    <section className="relative min-h-[60vh] flex flex-col items-center justify-center px-4 py-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6" ref={animRef}>
        {/* Title */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold">
          <span className="text-white leading-tight block mb-2">
            {title.line1}
          </span>
          <span className={clsx("leading-tight block", primaryClass)}>
            {title.line2}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-textSecondary text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
          {subtitle}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
          <button className="btn-primary px-8 py-3 rounded-xl font-semibold text-base transition-all duration-300 hover:scale-105 hover:shadow-glow">
            Ver Productos
          </button>
          <button className="btn-secondary px-8 py-3 rounded-xl font-semibold text-base transition-all duration-300 hover:scale-105">
            Conocer Proyectos
          </button>
        </div>

        {/* Featured Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 max-w-4xl mx-auto">
          <CategoryCard 
            title="Cyber Decks" 
            icon="🔐"
            description="Hardware IoT para seguridad"
          />
          <CategoryCard 
            title="Sistemas POS" 
            icon="💳"
            description="Soluciones digitales de venta"
          />
          <CategoryCard 
            title="ESP32 & IoT" 
            icon="📡"
            description="Dispositivos inteligentes"
          />
          <CategoryCard 
            title="Servicios" 
            icon="⚙️"
            description="Desarrollo personalizado"
          />
        </div>
      </div>
    </section>
  );
};

interface CategoryCardProps {
  title: string;
  icon: string;
  description: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, icon, description }) => {
  return (
    <div className="group relative bg-backgroundSecondary/50 backdrop-blur-sm border border-primary/20 rounded-2xl p-6 transition-all duration-300 hover:border-primary hover:bg-backgroundSecondary/80 hover:shadow-glow cursor-pointer">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-white font-semibold text-lg mb-1">{title}</h3>
      <p className="text-textSecondary text-sm">{description}</p>
    </div>
  );
};
