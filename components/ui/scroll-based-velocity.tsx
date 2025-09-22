"use client";

import React, { useRef, useEffect, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollVelocityContainerProps {
  children: ReactNode;
  className?: string;
}

interface ScrollVelocityRowProps {
  children: ReactNode;
  baseVelocity: number;
  direction: 1 | -1;
  className?: string;
}

export function ScrollVelocityContainer({ 
  children, 
  className 
}: ScrollVelocityContainerProps) {
  return (
    <div className={cn("relative w-full overflow-hidden", className)}>
      {children}
    </div>
  );
}

export function ScrollVelocityRow({ 
  children, 
  baseVelocity, 
  direction, 
  className 
}: ScrollVelocityRowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const velocityRef = useRef(baseVelocity);
  const animationRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    
    if (!container || !content) {
      return;
    }

    // Crear animación infinita con GSAP
    const tl = gsap.timeline({ repeat: -1 });
    
    // Obtener el ancho del contenido para calcular la distancia
    const contentWidth = content.scrollWidth / 2; // Dividir por 2 porque tenemos contenido duplicado
    
    // Configurar la animación para mover exactamente la mitad del contenido
    tl.set(content, { x: 0 })
      .to(content, {
        x: -contentWidth,
        duration: contentWidth / Math.abs(baseVelocity * 15), // Ajustar velocidad
        ease: "none",
        immediateRender: false
      });

    return () => {
      tl.kill();
    };
  }, [baseVelocity]);

  return (
    <div 
      ref={containerRef}
      className={cn("relative w-full overflow-hidden", className)}
    >
      <div 
        ref={contentRef}
        className="flex whitespace-nowrap will-change-transform"
        style={{ 
          transform: "translate3d(0, 0, 0)",
          backfaceVisibility: "hidden"
        }}
      >
        {/* Duplicate content for seamless loop */}
        <div className="flex shrink-0">
          {children}
        </div>
        <div className="flex shrink-0">
          {children}
        </div>
      </div>
    </div>
  );
}