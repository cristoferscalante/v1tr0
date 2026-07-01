"use client";

import React, { useEffect, useRef, useState } from 'react';

interface BeamsProps {
  beamWidth?: number;
  beamHeight?: number;
  beamNumber?: number;
  lightColor?: string;
  speed?: number;
  noiseIntensity?: number;
  scale?: number;
  rotation?: number;
}

// Helper function to interpolate between two colors
const interpolateColor = (color1: string, color2: string, factor: number): string => {
  const hex1 = color1.replace('#', '');
  const hex2 = color2.replace('#', '');
  
  const r1 = parseInt(hex1.substring(0, 2), 16);
  const g1 = parseInt(hex1.substring(2, 4), 16);
  const b1 = parseInt(hex1.substring(4, 6), 16);
  
  const r2 = parseInt(hex2.substring(0, 2), 16);
  const g2 = parseInt(hex2.substring(2, 4), 16);
  const b2 = parseInt(hex2.substring(4, 6), 16);
  
  const r = Math.round(r1 + (r2 - r1) * factor);
  const g = Math.round(g1 + (g2 - g1) * factor);
  const b = Math.round(b1 + (b2 - b1) * factor);
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

export const Beams: React.FC<BeamsProps> = ({
  beamWidth = 1,
  beamHeight = 13,
  beamNumber = 27,
  lightColor = '#ffffff',
  speed = 5.6,
  noiseIntensity = 0.5,
  scale = 0.15,
  rotation = -180,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const [currentColor, setCurrentColor] = useState(lightColor);
  const [targetColor, setTargetColor] = useState(lightColor);
  const [colorTransition, setColorTransition] = useState(1);

  // Handle color changes with smooth transition
  useEffect(() => {
    if (lightColor !== targetColor) {
      setTargetColor(lightColor);
      setColorTransition(0);
    }
  }, [lightColor, targetColor]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    // Set canvas size
    canvas.width = 1080;
    canvas.height = 1080;

    let time = 0;

    const animate = () => {
      // Smooth color transition
      if (colorTransition < 1) {
        setColorTransition(prev => Math.min(prev + 0.02, 1));
        const interpolatedColor = interpolateColor(currentColor, targetColor, colorTransition);
        setCurrentColor(interpolatedColor);
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Save context state
      ctx.save();
      
      // Apply rotation from center
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);

      // Draw beams
      for (let i = 0; i < beamNumber; i++) {
        const x = (canvas.width / beamNumber) * i;
        const noise = Math.sin(time * speed + i * noiseIntensity) * 50;
        const height = beamHeight * canvas.height * scale + noise;
        
        // Create gradient for each beam
        const gradient = ctx.createLinearGradient(x, 0, x, height);
        gradient.addColorStop(0, currentColor);
        gradient.addColorStop(0.5, `${currentColor}99`);
        gradient.addColorStop(1, `${currentColor}00`);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height / 2 - height / 2, beamWidth, height);
      }

      // Restore context state
      ctx.restore();

      time += 0.01;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [beamWidth, beamHeight, beamNumber, currentColor, speed, noiseIntensity, scale, rotation, colorTransition, targetColor]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ width: '100%', height: '100%' }}
    />
  );
};
