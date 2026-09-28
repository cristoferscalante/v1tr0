"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

interface HeroTurntableCharacterProps {
  /** Fotogramas del giro, en orden: mirando a un lado -> frente -> al otro. */
  frames: string[];
  /** Índice del fotograma frontal, el que se muestra en reposo. */
  frontIndex: number;
  alt: string;
  className?: string;
  /** `sizes` de cada fotograma; el default es el del hero de la tienda. */
  sizes?: string;
  /**
   * Selector (para `closest`) del área que manda sobre el giro. Si se pasa, el
   * personaje solo sigue al cursor dentro de ella y vuelve al frente al salir.
   * Sin él, se mide contra la `section` que lo contiene.
   */
  area?: string;
}

/**
 * Personaje que gira siguiendo al cursor.
 *
 * El giro horizontal no es un efecto CSS: son fotogramas reales de un video de
 * mesa giratoria. La posición horizontal del cursor elige cuál se muestra, así
 * que el modelo gira de verdad en vez de deformarse.
 *
 * El mapeo es de dos tramos y no lineal a propósito: el fotograma frontal casi
 * nunca cae justo en la mitad de la secuencia, así que cada mitad del hero se
 * reparte su propio tramo. Con un mapeo lineal, el personaje quedaría de tres
 * cuartos con el cursor en el centro.
 *
 * Solo reacciona al eje horizontal. El vertical se probó con una inclinación
 * 3D, pero deformaba la figura: al no haber fotogramas para ese eje, lo único
 * que se puede hacer es estirarla, y se nota.
 */
export const HeroTurntableCharacter: React.FC<HeroTurntableCharacterProps> = ({
  frames,
  frontIndex,
  alt,
  className = "",
  sizes = "(max-width: 1024px) 90vw, 45vw",
  area,
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [frame, setFrame] = useState(frontIndex);

  useEffect(() => {
    if (frames.length === 0) {
      return;
    }

    const enabled =
      window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!enabled) {
      return;
    }

    // target: a dónde apunta el cursor. current: dónde está el modelo ahora.
    const target = { x: 0.5 };
    const current = { x: 0.5 };
    let raf = 0;

    const tick = () => {
      current.x += (target.x - current.x) * 0.12;

      const index =
        current.x <= 0.5
          ? Math.round((current.x / 0.5) * frontIndex)
          : Math.round(frontIndex + ((current.x - 0.5) / 0.5) * (frames.length - 1 - frontIndex));
      setFrame((prev) => (prev === index ? prev : index));

      raf = requestAnimationFrame(tick);
    };

    const onPointerMove = (event: PointerEvent) => {
      const host = rootRef.current;
      if (!host) {
        return;
      }
      // Se mide contra toda la sección del hero, no contra la imagen: así el
      // personaje reacciona aunque el cursor esté sobre el texto.
      const rect = (host.closest(area ?? "section") ?? host).getBoundingClientRect();
      if (
        area &&
        (event.clientX < rect.left ||
          event.clientX > rect.right ||
          event.clientY < rect.top ||
          event.clientY > rect.bottom)
      ) {
        target.x = 0.5;
        return;
      }
      target.x = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    };

    const onPointerLeave = () => {
      target.x = 0.5;
    };

    raf = requestAnimationFrame(tick);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerleave", onPointerLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [frames.length, frontIndex, area]);

  if (frames.length === 0) {
    return null;
  }

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <div className="relative h-full w-full">
        {frames.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt={i === frontIndex ? alt : ""}
            aria-hidden={i !== frontIndex}
            fill
            sizes={sizes}
            // Todos los fotogramas quedan montados y solo cambia cuál es
            // visible: alternar el `src` provocaría un parpadeo en cada paso.
            className={`object-contain drop-shadow-2xl ${i === frame ? "opacity-100" : "opacity-0"}`}
            priority={i === frontIndex}
          />
        ))}
      </div>
    </div>
  );
};
