"use client";
import React from "react";
import { useHeroTextAnimation } from "./useHeroTextAnimation";
import clsx from "clsx";

// Color principal: tailwind 'text-primary' o variable CSS
const primaryClass = "text-primary";

export const HeroAnimated: React.FC = () => {
  const {
    line1,
    line2,
    effect,
    typewriterText,
    animRef,
    currentMessage,
  } = useHeroTextAnimation();

  // Render para typewriter
  if (effect === "typewriter") {
    const [l1, l2] = typewriterText.split("\n");
    return (
      <div className="flex flex-col items-center select-none" ref={animRef}>
        <span className="text-3xl md:text-5xl font-bold text-white leading-tight min-h-[2.5em]">
          {l1 || "\u00A0"}
        </span>
        <span className={clsx("text-3xl md:text-5xl font-bold leading-tight", primaryClass, "min-h-[2.5em]")}
        >
          {l2 || "\u00A0"}
        </span>
      </div>
    );
  }

  // Render normal con animaciones GSAP
  return (
    <div className="flex flex-col items-center select-none" ref={animRef}>
      <span className="text-3xl md:text-5xl font-bold text-white leading-tight min-h-[2.5em]">
        {line1}
      </span>
      <span className={clsx("text-3xl md:text-5xl font-bold leading-tight", primaryClass, "min-h-[2.5em]")}
      >
        {line2}
      </span>
      {/* Mensaje actual para debug/SEO, oculto visualmente */}
      <span className="sr-only">{currentMessage}</span>
    </div>
  );
};
