"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export interface ShopHeroAnimationState {
  title: {
    line1: string;
    line2: string;
  };
  subtitle: string;
  animRef: React.RefObject<HTMLDivElement | null>;
}

export function useShopHeroAnimation(): ShopHeroAnimationState {
  const animRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  const title = {
    line1: "Bienvenido a la",
    line2: "Tienda V1TR0",
  };

  const subtitle = "Descubre nuestros productos de hardware IoT, sistemas digitales y servicios de desarrollo personalizados. Tecnología de vanguardia para tus proyectos.";

  useEffect(() => {
    setMounted(true);
    
    if (!animRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      // Animación de entrada con fade y slide
      gsap.from(animRef.current, {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: "power3.out",
        delay: 0.2,
      });
    }, animRef);

    return () => ctx.revert();
  }, [mounted]);

  return {
    title,
    subtitle,
    animRef,
  };
}
