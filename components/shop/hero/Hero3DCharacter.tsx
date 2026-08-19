"use client";

import Image from "next/image";
import React, { useEffect, useRef } from "react";

interface Hero3DCharacterProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  /** Inclinación máxima en grados. */
  maxTilt?: number;
}

/**
 * Personaje que reacciona al cursor simulando volumen.
 *
 * El contenedor inclina la figura en X/Y según dónde esté el ratón dentro del
 * hero, con perspectiva CSS. La imagen y su sombra se desplazan en sentidos
 * distintos (paralaje), que es lo que da la sensación de que el personaje está
 * separado del fondo en vez de pegado a él.
 *
 * El seguimiento va con interpolación en rAF: el objetivo salta con el ratón,
 * pero la figura llega a él de forma suave y con inercia.
 */
export const Hero3DCharacter: React.FC<Hero3DCharacterProps> = ({
  src,
  alt,
  className = "",
  priority = false,
  maxTilt = 12,
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const figureRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const figure = figureRef.current;
    const shadow = shadowRef.current;
    if (!stage || !figure || !shadow) {
      return;
    }

    const enabled =
      window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!enabled) {
      return;
    }

    // target = a dónde queremos llegar; current = dónde estamos ahora.
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let frame = 0;

    const tick = () => {
      // Interpolación: acerca current a target un 8% por frame.
      current.x += (target.x - current.x) * 0.08;
      current.y += (target.y - current.y) * 0.08;

      const rotateY = current.x * maxTilt;
      const rotateX = -current.y * maxTilt;

      stage.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      // La figura se adelanta al giro: sale un poco del plano del contenedor.
      figure.style.transform = `translate3d(${current.x * 18}px, ${current.y * 12}px, 60px)`;
      // La sombra va al revés y más lejos: separa al personaje del fondo.
      shadow.style.transform = `translate3d(${current.x * -34}px, ${current.y * -20}px, -60px)`;

      frame = requestAnimationFrame(tick);
    };

    const onPointerMove = (event: PointerEvent) => {
      const host = rootRef.current;
      if (!host) {
        return;
      }
      // Normaliza la posición del cursor respecto al centro del hero: -1 a 1.
      const rect = host.getBoundingClientRect();
      const section = host.closest("section") ?? host;
      const area = section.getBoundingClientRect();
      target.x = ((event.clientX - area.left) / area.width) * 2 - 1;
      target.y = ((event.clientY - area.top) / area.height) * 2 - 1;
      void rect;
    };

    const onPointerLeave = () => {
      target.x = 0;
      target.y = 0;
    };

    frame = requestAnimationFrame(tick);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerleave", onPointerLeave);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [maxTilt]);

  return (
    <div ref={rootRef} className={`relative ${className}`} style={{ perspective: "1100px" }}>
      <div
        ref={stageRef}
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d", willChange: "transform" }}
      >
        {/* Sombra proyectada: sin ella la inclinación se lee como un dibujo
            que gira, no como un cuerpo con volumen. */}
        <div
          ref={shadowRef}
          aria-hidden
          className="absolute inset-0 opacity-40"
          style={{ willChange: "transform" }}
        >
          <Image
            src={src}
            alt=""
            fill
            aria-hidden
            className="object-contain"
            style={{ filter: "brightness(0) blur(18px)" }}
          />
        </div>

        {/* Personaje */}
        <div ref={figureRef} className="absolute inset-0" style={{ willChange: "transform" }}>
          <Image src={src} alt={alt} fill className="object-contain drop-shadow-2xl" priority={priority} />
        </div>
      </div>
    </div>
  );
};
