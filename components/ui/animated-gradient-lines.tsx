"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedGradientLinesProps {
  primaryColor?: string;
  secondaryColor?: string;
}

export const AnimatedGradientLines: React.FC<AnimatedGradientLinesProps> = ({
  primaryColor = '#08A696',
  secondaryColor = '#26FFDF',
}) => {
  // Generate multiple lines with different delays
  const lines = Array.from({ length: 30 }, (_, i) => i);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {/* Dark base background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
      
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ mixBlendMode: 'lighten' }}
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Main gradient for lines */}
          <linearGradient id={`grad-${primaryColor}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: primaryColor, stopOpacity: 0 }} />
            <stop offset="20%" style={{ stopColor: secondaryColor, stopOpacity: 0.6 }} />
            <stop offset="40%" style={{ stopColor: primaryColor, stopOpacity: 1 }} />
            <stop offset="60%" style={{ stopColor: secondaryColor, stopOpacity: 1 }} />
            <stop offset="80%" style={{ stopColor: primaryColor, stopOpacity: 0.6 }} />
            <stop offset="100%" style={{ stopColor: secondaryColor, stopOpacity: 0 }} />
          </linearGradient>

          {/* Glow filter */}
          <filter id="lineGlow">
            <feGaussianBlur stdDeviation="5" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Main diagonal lines */}
        <g transform="rotate(-30 720 405)">
          {lines.map((i) => {
            const x = -300 + i * 45;
            const width = i % 3 === 0 ? 6 : i % 2 === 0 ? 4 : 2;
            const delay = i * 0.1;
            
            return (
              <motion.rect
                key={i}
                x={x}
                y="-200"
                width={width}
                height="1400"
                fill={`url(#grad-${primaryColor})`}
                filter="url(#lineGlow)"
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: [0, 0.5, 1, 0.5, 0],
                  y: [-200, -200, -200, -100]
                }}
                transition={{
                  duration: 5,
                  delay: delay,
                  repeat: Infinity,
                  repeatDelay: 0.3,
                  ease: "easeInOut"
                }}
              />
            );
          })}
        </g>

        {/* Secondary thinner lines */}
        <g transform="rotate(-30 720 405)" opacity="0.4">
          {lines.filter((_, i) => i % 2 === 0).map((i) => {
            const x = -250 + i * 90;
            const delay = i * 0.15 + 2;
            
            return (
              <motion.rect
                key={`thin-${i}`}
                x={x}
                y="-200"
                width="1"
                height="1400"
                fill={`url(#grad-${primaryColor})`}
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: [0, 0.6, 0],
                }}
                transition={{
                  duration: 4,
                  delay: delay,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            );
          })}
        </g>
      </svg>

      {/* Noise texture */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
};
