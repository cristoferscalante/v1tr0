"use client";

import React, { useEffect, useRef } from "react";

interface CircuitNetworkBackgroundProps {
  primaryColor?: string;
  secondaryColor?: string;
  /** Separación de la retícula en px. Menor = más densa. */
  cellSize?: number;
  /** Pulsos de datos simultáneos recorriendo las trazas. */
  pulseCount?: number;
}

type Point = { x: number; y: number };

type Trace = {
  points: Point[];
  /** Longitud acumulada en cada vértice, para interpolar el pulso. */
  lengths: number[];
  total: number;
};

type Pulse = {
  trace: number;
  progress: number;
  speed: number;
  tail: number;
};

const hexToRgb = (hex: string): [number, number, number] => {
  const h = hex.replace("#", "");
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
};

const rgba = (rgb: [number, number, number], alpha: number) =>
  `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;

/**
 * Fondo de circuito animado: trazas ortogonales estilo PCB con pulsos de datos
 * recorriéndolas y nodos que se encienden al paso del pulso.
 */
export const CircuitNetworkBackground: React.FC<CircuitNetworkBackgroundProps> = ({
  primaryColor = "#08A696",
  secondaryColor = "#26FFDF",
  cellSize = 56,
  pulseCount = 14,
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

    const primary = hexToRgb(primaryColor);
    const secondary = hexToRgb(secondaryColor);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let traces: Trace[] = [];
    let pulses: Pulse[] = [];
    let nodes: Point[] = [];
    let frame = 0;
    let width = 0;
    let height = 0;

    /** Genera una traza ortogonal (solo giros de 90°) desde un borde hacia dentro. */
    const buildTrace = (): Trace => {
      const cols = Math.ceil(width / cellSize);
      const rows = Math.ceil(height / cellSize);

      let cx = Math.floor(Math.random() * cols);
      let cy = Math.floor(Math.random() * rows);
      const points: Point[] = [{ x: cx * cellSize, y: cy * cellSize }];

      const segments = 3 + Math.floor(Math.random() * 5);
      let horizontal = Math.random() < 0.5;

      for (let i = 0; i < segments; i++) {
        const step = (1 + Math.floor(Math.random() * 4)) * (Math.random() < 0.5 ? -1 : 1);
        if (horizontal) {
          cx = Math.max(0, Math.min(cols, cx + step));
        } else {
          cy = Math.max(0, Math.min(rows, cy + step));
        }
        points.push({ x: cx * cellSize, y: cy * cellSize });
        horizontal = !horizontal;
      }

      const lengths: number[] = [0];
      let total = 0;
      for (let i = 1; i < points.length; i++) {
        const a = points[i - 1]!;
        const b = points[i]!;
        total += Math.hypot(b.x - a.x, b.y - a.y);
        lengths.push(total);
      }

      return { points, lengths, total };
    };

    /** Posición del pulso a lo largo de la traza, en px recorridos. */
    const pointAt = (trace: Trace, distance: number): Point => {
      const { points, lengths, total } = trace;
      const d = Math.max(0, Math.min(distance, total));
      for (let i = 1; i < points.length; i++) {
        if (lengths[i]! >= d) {
          const a = points[i - 1]!;
          const b = points[i]!;
          const segLen = lengths[i]! - lengths[i - 1]!;
          const t = segLen === 0 ? 0 : (d - lengths[i - 1]!) / segLen;
          return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
        }
      }
      return points[points.length - 1]!;
    };

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const traceCount = Math.max(10, Math.round((width * height) / 55000));
      traces = Array.from({ length: traceCount }, buildTrace);

      // Nodos = vértices de las trazas (los puntos de soldadura del "PCB").
      nodes = traces.flatMap((t) => t.points);

      pulses = Array.from({ length: pulseCount }, () => {
        const trace = Math.floor(Math.random() * traces.length);
        return {
          trace,
          progress: Math.random() * (traces[trace]?.total ?? 1),
          speed: 0.6 + Math.random() * 1.4,
          tail: 90 + Math.random() * 110,
        };
      });
    };

    const drawStatic = () => {
      ctx.lineWidth = 1;
      ctx.strokeStyle = rgba(primary, 0.12);
      for (const trace of traces) {
        ctx.beginPath();
        const first = trace.points[0]!;
        ctx.moveTo(first.x, first.y);
        for (let i = 1; i < trace.points.length; i++) {
          const p = trace.points[i]!;
          ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
      }

      ctx.fillStyle = rgba(primary, 0.22);
      for (const node of nodes) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const drawPulses = () => {
      ctx.lineCap = "round";
      for (const pulse of pulses) {
        const trace = traces[pulse.trace];
        if (!trace) {
          continue;
        }

        const head = pointAt(trace, pulse.progress);
        const tailStart = Math.max(0, pulse.progress - pulse.tail);
        const tail = pointAt(trace, tailStart);

        const gradient = ctx.createLinearGradient(tail.x, tail.y, head.x, head.y);
        gradient.addColorStop(0, rgba(secondary, 0));
        gradient.addColorStop(1, rgba(secondary, 0.9));

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        // Redibuja solo el tramo cubierto por la cola, siguiendo los vértices.
        ctx.moveTo(tail.x, tail.y);
        for (let i = 1; i < trace.points.length; i++) {
          const l = trace.lengths[i]!;
          if (l > tailStart && l < pulse.progress) {
            const p = trace.points[i]!;
            ctx.lineTo(p.x, p.y);
          }
        }
        ctx.lineTo(head.x, head.y);
        ctx.stroke();

        // Glow en la cabeza del pulso.
        ctx.shadowBlur = 12;
        ctx.shadowColor = rgba(secondary, 0.8);
        ctx.fillStyle = rgba(secondary, 0.95);
        ctx.beginPath();
        ctx.arc(head.x, head.y, 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        pulse.progress += pulse.speed;
        if (pulse.progress - pulse.tail > trace.total) {
          pulse.trace = Math.floor(Math.random() * traces.length);
          pulse.progress = 0;
          pulse.speed = 0.6 + Math.random() * 1.4;
        }
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      drawStatic();
      drawPulses();
      frame = requestAnimationFrame(render);
    };

    build();

    if (reduceMotion) {
      ctx.clearRect(0, 0, width, height);
      drawStatic();
    } else {
      frame = requestAnimationFrame(render);
    }

    const onResize = () => {
      build();
      if (reduceMotion) {
        ctx.clearRect(0, 0, width, height);
        drawStatic();
      }
    };

    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
    };
  }, [primaryColor, secondaryColor, cellSize, pulseCount]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {/* Base del PCB: el mismo gris neutro que usan las superficies de la
          tienda (.shop-surface), para que el hero no rompa con el resto. */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1c1e] via-[#1e2123] to-[#17191b]" />

      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
};
