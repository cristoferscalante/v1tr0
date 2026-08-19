"use client";

import Image from "next/image";
import React, { useCallback, useEffect, useRef } from "react";

interface TechLensImageProps {
  src: string;
  alt: string;
  /** Color del tinte del lente. */
  accentColor?: string;
  /** Radio del lente en px. */
  radius?: number;
  className?: string;
  priority?: boolean;
}

/**
 * Imagen con un "lente tecnológico" que sigue al cursor: dentro del círculo el
 * cursor el personaje se revela: sube la luz, el contraste y el color, con un
 * matiz frío del acento. Sin aro, sin miras y sin tinte plano, y recortado a la
 * silueta: el efecto nunca toca el fondo.
 *
 * La posición se escribe como custom properties sobre el contenedor en vez de
 * estado de React, para no re-renderizar en cada mousemove.
 */
export const TechLensImage: React.FC<TechLensImageProps> = ({
  src,
  alt,
  accentColor = "#26FFDF",
  radius = 130,
  className = "",
  priority = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const enabledRef = useRef(false);

  useEffect(() => {
    // Sin cursor fino (táctil) o con motion reducido el lente no aporta nada.
    enabledRef.current =
      window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const apply = useCallback(() => {
    frameRef.current = null;
    const el = containerRef.current;
    if (!el) {
      return;
    }
    el.style.setProperty("--lens-x", `${targetRef.current.x}px`);
    el.style.setProperty("--lens-y", `${targetRef.current.y}px`);
  }, []);

  const handleMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!enabledRef.current) {
        return;
      }
      const rect = event.currentTarget.getBoundingClientRect();
      targetRef.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
      if (frameRef.current === null) {
        frameRef.current = requestAnimationFrame(apply);
      }
    },
    [apply],
  );

  const setActive = useCallback((active: boolean) => {
    if (!enabledRef.current) {
      return;
    }
    containerRef.current?.style.setProperty("--lens-on", active ? "1" : "0");
  }, []);

  // Máscara circular que sigue al cursor.
  const lensMask =
    "radial-gradient(circle var(--lens-r) at var(--lens-x) var(--lens-y), #000 62%, rgba(0,0,0,0.35) 82%, transparent 100%)";

  // Máscara con el alfa del propio PNG: recorta cualquier capa a la silueta
  // del personaje, para que el efecto nunca pinte el fondo vacío.
  const silhouetteMask: React.CSSProperties = {
    maskImage: `url(${src})`,
    WebkitMaskImage: `url(${src})`,
    maskSize: "contain",
    WebkitMaskSize: "contain",
    maskPosition: "center",
    WebkitMaskPosition: "center",
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
  };

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={
        {
          "--lens-r": `${radius}px`,
          "--lens-x": "-9999px",
          "--lens-y": "-9999px",
          "--lens-on": "0",
        } as React.CSSProperties
      }
      onMouseMove={handleMove}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
    >
      {/* Imagen base */}
      <Image src={src} alt={alt} fill className="object-contain drop-shadow-2xl" priority={priority} />

      {/* Capa revelada: solo visible dentro del lente */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          maskImage: lensMask,
          WebkitMaskImage: lensMask,
          opacity: "var(--lens-on)",
          transition: "opacity 260ms ease-out",
        }}
      >
        {/* 1. La misma imagen, revelada: más luz, más contraste y más color.
               No se invierte ni se pinta encima; se ve lo que ya estaba,
               como si el lente levantara la penumbra del hero. */}
        <div className="absolute inset-0" style={silhouetteMask}>
          <Image
            src={src}
            alt=""
            fill
            aria-hidden
            className="object-contain"
            style={{ filter: "brightness(1.28) contrast(1.12) saturate(1.3)" }}
          />
        </div>

        {/* 2. Luz fría del acento, en soft-light: matiza el reflejo sin teñir. */}
        <div
          className="absolute inset-0 mix-blend-soft-light"
          style={{ ...silhouetteMask, backgroundColor: accentColor, opacity: 0.35 }}
        />
      </div>

      {/* 3. Halo del propio lente: un borde de luz muy leve que se apaga hacia
             el centro, para que se lea el gesto sin dibujar un aro. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: "var(--lens-on)",
          transition: "opacity 260ms ease-out",
          background: `radial-gradient(circle var(--lens-r) at var(--lens-x) var(--lens-y), transparent 55%, ${accentColor}14 78%, transparent 100%)`,
        }}
      />

    </div>
  );
};
