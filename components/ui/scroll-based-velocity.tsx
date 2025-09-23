"use client";

import React, { useRef, useEffect, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ScrollVelocityContainerProps {
  children: ReactNode;
  className?: string;
}

interface ScrollVelocityRowProps {
  children: ReactNode;
  baseVelocity: number;
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
  className 
}: ScrollVelocityRowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const positionRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    
    if (!container || !content) {
      return;
    }

    // Calcular el ancho del contenido una sola vez (ahora con 3 copias)
    const contentWidth = content.scrollWidth / 3;
    
    const animate = (currentTime: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = currentTime;
      }

      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      // Calcular nueva posición basada en velocidad y tiempo
      const pixelsPerSecond = baseVelocity * 15;
      const deltaPosition = (pixelsPerSecond * deltaTime) / 1000;
      
      positionRef.current += deltaPosition;

      // Smooth infinite loop - reset position seamlessly when one full section has passed
      if (positionRef.current >= contentWidth) {
        positionRef.current -= contentWidth;
      } else if (positionRef.current <= -contentWidth) {
        positionRef.current += contentWidth;
      }

      // Apply transform using GPU acceleration
      content.style.transform = `translate3d(${-positionRef.current}px, 0, 0)`;
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      lastTimeRef.current = 0;
      positionRef.current = 0;
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
        {/* Triple content for seamless loop */}
        <div className="flex shrink-0">
          {children}
        </div>
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