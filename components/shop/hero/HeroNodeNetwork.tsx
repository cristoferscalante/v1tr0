"use client";

import React, { useEffect, useRef } from "react";

interface HeroNodeNetworkProps {
  /** Color de los nodos destacados. */
  accentColor?: string;
  /** Radio de la esfera en px. */
  radius?: number;
  /** Solo se activa cuando el cursor está dentro de este elemento. */
  activeAreaRef: React.RefObject<HTMLElement | null>;
}

/** Punto en la superficie de la esfera, en coordenadas locales. */
type Vertex = { x: number; y: number; z: number };

const hexToRgb = (hex: string): [number, number, number] => {
  const h = hex.replace("#", "");
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
};

/**
 * Red esférica anclada al cursor.
 *
 * Los vértices se reparten sobre una esfera con la espiral de Fibonacci y solo
 * rotan muy despacio: la figura es la misma siempre, se traslada con el ratón.
 * Se dibuja a opacidad plena, sin desvanecerse hacia los bordes, y únicamente
 * mientras el cursor está sobre el área de texto.
 */
export const HeroNodeNetwork: React.FC<HeroNodeNetworkProps> = ({
  accentColor = "#26FFDF",
  radius = 130,
  activeAreaRef,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    const accent = hexToRgb(accentColor);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Espiral de Fibonacci: reparto uniforme sobre la esfera, sin polos densos.
    const COUNT = 42;
    const golden = Math.PI * (3 - Math.sqrt(5));
    const vertices: Vertex[] = Array.from({ length: COUNT }, (_, i) => {
      const y = 1 - (i / (COUNT - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = golden * i;
      return { x: Math.cos(theta) * r, y, z: Math.sin(theta) * r };
    });

    // Aristas fijas: se calculan una vez, no en cada frame.
    const edges: Array<[number, number]> = [];
    for (let i = 0; i < COUNT; i++) {
      for (let j = i + 1; j < COUNT; j++) {
        const a = vertices[i]!;
        const b = vertices[j]!;
        const d = Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
        if (d < 0.62) {
          edges.push([i, j]);
        }
      }
    }

    // Los nodos que se pintan en color de acento, siempre los mismos.
    const highlighted = new Set([3, 9, 16, 24, 31, 38]);

    let width = 0;
    let height = 0;
    let frame = 0;
    let angle = 0;
    const pointer = { x: 0, y: 0, active: false };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      if (!pointer.active) {
        frame = requestAnimationFrame(render);
        return;
      }

      // Rotación lenta: la esfera se lee como volumen sin llegar a girar.
      angle += 0.0025;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);

      // Proyección: giro sobre Y, ligera inclinación y perspectiva suave.
      const projected = vertices.map((v) => {
        const rx = v.x * cos - v.z * sin;
        const rz = v.x * sin + v.z * cos;
        const ry = v.y * 0.92 - rz * 0.08;
        const scale = 1 / (1.6 - rz * 0.35);
        return {
          x: pointer.x + rx * radius * scale,
          y: pointer.y + ry * radius * scale,
          scale,
        };
      });

      ctx.lineWidth = 0.7;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.55)";
      ctx.beginPath();
      for (const [i, j] of edges) {
        const a = projected[i]!;
        const b = projected[j]!;
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
      }
      ctx.stroke();

      projected.forEach((p, i) => {
        const isAccent = highlighted.has(i);
        ctx.fillStyle = isAccent
          ? `rgba(${accent[0]}, ${accent[1]}, ${accent[2]}, 1)`
          : "rgba(255, 255, 255, 0.95)";
        ctx.beginPath();
        // El tamaño sigue la perspectiva: los de delante, algo mayores.
        ctx.arc(p.x, p.y, (isAccent ? 2.6 : 1.7) * p.scale * 1.5, 0, Math.PI * 2);
        ctx.fill();
      });

      frame = requestAnimationFrame(render);
    };

    const onPointerMove = (event: PointerEvent) => {
      const area = activeAreaRef.current;
      const rect = canvas.getBoundingClientRect();
      if (!area) {
        pointer.active = false;
        return;
      }
      const areaRect = area.getBoundingClientRect();
      pointer.active =
        event.clientX >= areaRect.left &&
        event.clientX <= areaRect.right &&
        event.clientY >= areaRect.top &&
        event.clientY <= areaRect.bottom;
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
    };

    const onPointerLeave = () => {
      pointer.active = false;
    };

    resize();
    if (!reduceMotion) {
      frame = requestAnimationFrame(render);
    }

    // El canvas no recibe eventos (pointer-events:none): se escucha en window.
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", resize);
    };
  }, [accentColor, radius, activeAreaRef]);

  return (
    <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />
  );
};
