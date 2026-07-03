"use client";

import React, { useEffect, useRef } from "react";

export const TechGridBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Caracteres estilo Matrix - solo letras, números y símbolos básicos
    const matrixChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,.<>?/~";
    
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    
    // Array para trackear la posición Y de cada columna
    const drops: number[] = [];
    
    // Inicializar drops con posiciones aleatorias escalonadas
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * -50) - (i % 10) * 5; // Más orgánico
    }

    const draw = () => {
      // Fondo oscuro con trail effect suave
      ctx.fillStyle = "rgba(11, 11, 12, 0.05)"; // Trail muy sutil para efecto más suave
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Configurar fuente y color
      ctx.fillStyle = "#08A696";
      ctx.font = `${fontSize}px 'Courier New', monospace`;
      ctx.textBaseline = 'top'; // Alinear al top para evitar deformaciones

      // Dibujar caracteres cayendo
      for (let i = 0; i < drops.length; i++) {
        // Seleccionar carácter aleatorio
        const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        
        // Opacidad variable pero consistente
        const opacity = Math.random() * 0.3 + 0.15; // Entre 0.15 y 0.45
        ctx.globalAlpha = opacity;
        
        // Dibujar el carácter en posición fija (sin escala ni transformaciones)
        ctx.fillText(char || "A", i * fontSize, drops[i]! * fontSize);

        // Caída orgánica: velocidad variable por columna
        // Algunas columnas caen más rápido que otras
        if (drops[i]! * fontSize > canvas.height && Math.random() > 0.975) {
          // Resetear con variación natural
          drops[i] = Math.floor(Math.random() * -20);
        } else {
          // Incremento variable para movimiento orgánico
          drops[i] = drops[i]! + (0.5 + (i % 3) * 0.2); // Velocidades: 0.5, 0.7, 0.9
        }
      }

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};
