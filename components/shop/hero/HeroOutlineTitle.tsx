"use client";

import React, { useCallback, useEffect, useRef } from "react";

interface HeroOutlineTitleProps {
  children: string;
  className?: string;
  /** Radio de la zona donde el título se vacía, en px. */
  radius?: number;
}

/**
 * Título que pasa de macizo a contorno allí donde está el cursor.
 *
 * Son dos copias del mismo texto superpuestas: la rellena se recorta con un
 * agujero circular bajo el cursor y la de solo contorno se revela justo en ese
 * hueco. La posición se escribe como custom properties, sin estado de React.
 */
export const HeroOutlineTitle: React.FC<HeroOutlineTitleProps> = ({
  children,
  className = "",
  radius = 130,
}) => {
  const ref = useRef<HTMLHeadingElement>(null);
  const frameRef = useRef<number | null>(null);
  const targetRef = useRef({ x: -9999, y: -9999 });
  const enabledRef = useRef(false);

  useEffect(() => {
    enabledRef.current =
      window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const apply = () => {
      frameRef.current = null;
      const el = ref.current;
      if (!el) {
        return;
      }
      el.style.setProperty("--tx", `${targetRef.current.x}px`);
      el.style.setProperty("--ty", `${targetRef.current.y}px`);
    };

    const onMove = (event: PointerEvent) => {
      if (!enabledRef.current || !ref.current) {
        return;
      }
      const rect = ref.current.getBoundingClientRect();
      targetRef.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
      if (frameRef.current === null) {
        frameRef.current = requestAnimationFrame(apply);
      }
    };

    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  // Corte limpio, sin degradé: dentro del círculo el texto es contorno, fuera
  // es macizo. El 1% de margen solo evita el borde dentado.
  const hole =
    "radial-gradient(circle var(--tr) at var(--tx) var(--ty), transparent 99%, #000 100%)";
  const disc =
    "radial-gradient(circle var(--tr) at var(--tx) var(--ty), #000 99%, transparent 100%)";

  const layer = useCallback(
    (mask: string): React.CSSProperties => ({
      maskImage: mask,
      WebkitMaskImage: mask,
    }),
    [],
  );

  return (
    <h1
      ref={ref}
      className={`relative ${className}`}
      style={{ "--tr": `${radius}px`, "--tx": "-9999px", "--ty": "-9999px" } as React.CSSProperties}
    >
      {/* Copia maciza, con un hueco bajo el cursor */}
      <span className="block" style={layer(hole)}>
        {children}
      </span>

      {/* Copia en contorno, visible solo dentro de ese hueco */}
      <span
        aria-hidden
        className="absolute inset-0 block"
        style={{
          ...layer(disc),
          color: "transparent",
          WebkitTextStrokeWidth: "1px",
          WebkitTextStrokeColor: "rgba(255,255,255,0.85)",
        }}
      >
        {children}
      </span>
    </h1>
  );
};
