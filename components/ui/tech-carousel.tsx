"use client";

import React from "react";
import { 
  ScrollVelocityContainer, 
  ScrollVelocityRow 
} from "./scroll-based-velocity";
import { cn } from "@/lib/utils";

interface TechItem {
  name: string;
  icon: React.ReactNode;
  color?: string;
}

interface TechCarouselProps {
  technologies: TechItem[];
  className?: string;
  speed?: number;
  showGradients?: boolean;
}

export function TechCarousel({ 
  technologies, 
  speed = 20, 
  className,
  showGradients = true 
}: TechCarouselProps) {
  return (
    <div className={cn("relative w-full h-24 overflow-hidden", className)}>
      <ScrollVelocityContainer className="h-full flex items-center">
        <ScrollVelocityRow baseVelocity={speed} direction={1} className="flex items-center">
          <div className="flex items-center gap-20">
            {/* Primera copia de los iconos */}
            {technologies.map((tech, index) => (
              <div
                key={`${tech.name}-${index}-first`}
                className="group relative flex items-center justify-center w-24 h-24 rounded-full bg-card/20 backdrop-blur-sm hover:bg-card/40 transition-all duration-700 cursor-pointer animate-pulse hover:animate-none hover:scale-105"
                style={{ 
                  contain: 'layout style paint',
                  willChange: 'transform',
                  animationDelay: '0s',
                  animationDuration: '2s'
                }}
              >
                <div className="text-6xl transform hover:rotate-6 transition-transform duration-500">
                  {tech.icon}
                </div>
                <span className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-sm font-medium text-muted-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-background/95 px-3 py-2 rounded-lg shadow-lg">
                  {tech.name}
                </span>
              </div>
            ))}
            {/* Segunda copia para el efecto infinito */}
            {technologies.map((tech, index) => (
              <div
                key={`${tech.name}-${index}-second`}
                className="group relative flex items-center justify-center w-24 h-24 rounded-full bg-card/20 backdrop-blur-sm hover:bg-card/40 transition-all duration-700 cursor-pointer animate-pulse hover:animate-none hover:scale-105"
                style={{ 
                  contain: 'layout style paint',
                  willChange: 'transform',
                  animationDelay: '0s',
                  animationDuration: '2s'
                }}
              >
                <div className="text-6xl transform hover:rotate-6 transition-transform duration-500">
                  {tech.icon}
                </div>
                <span className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-sm font-medium text-muted-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-background/95 px-3 py-2 rounded-lg shadow-lg">
                  {tech.name}
                </span>
              </div>
            ))}
          </div>
        </ScrollVelocityRow>
      </ScrollVelocityContainer>
      
      {showGradients && (
        <>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background via-background/80 to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background via-background/80 to-transparent z-10" />
        </>
      )}
    </div>
  );
}

// Demo component with sample technologies
export function TechCarouselDemo() {
  const sampleTechnologies: TechItem[] = [
    {
      name: "React",
      icon: (
        <svg viewBox="0 0 24 24" className="w-full h-full fill-[#61DAFB]">
          <path d="M12 10.11c1.03 0 1.87.84 1.87 1.89s-.84 1.89-1.87 1.89c-1.03 0-1.87-.84-1.87-1.89s.84-1.89 1.87-1.89M7.37 20c.63.38 2.01-.2 3.6-1.7-.52-.59-1.03-1.23-1.51-1.9a22.7 22.7 0 0 1-2.4-.36c-.51 2.14-.32 3.61.31 3.96m.71-5.74l-.29-.51c-.11.29-.22.58-.29.86.27.06.57.11.88.16l-.3-.51m6.54-.76l.81-1.5-.81-1.5c-.3-.53-.62-1-.91-1.47C13.17 9 12.6 9 12 9s-1.17 0-1.71.03c-.29.47-.61.94-.91 1.47L8.57 12l.81 1.5c.3.53.62 1 .91 1.47.54.03 1.11.03 1.71.03s1.17 0 1.71-.03c.29-.47.61-.94.91-1.47M12 6.78c-.19.22-.39.45-.59.72h1.18c-.2-.27-.4-.5-.59-.72m0 10.44c.19-.22.39-.45.59-.72h-1.18c.2.27.4.5.59.72M16.62 4c-.62-.38-2 .2-3.59 1.7.52.59 1.03 1.23 1.51 1.9.82.08 1.63.2 2.4.36.51-2.14.32-3.61-.32-3.96m-.7 5.74l.29.51c.11-.29.22-.58.29-.86-.27-.06-.57-.11-.88-.16l.3.51m1.45-7.05c1.47.84 1.63 3.05 1.01 5.63 2.54.75 4.37 1.99 4.37 3.68s-1.83 2.93-4.37 3.68c.62 2.58.46 4.79-1.01 5.63-1.46.84-3.45-.12-5.37-1.95-1.92 1.83-3.91 2.79-5.37 1.95-1.47-.84-1.63-3.05-1.01-5.63-2.54-.75-4.37-1.99-4.37-3.68s1.83-2.93 4.37-3.68c-.62-2.58-.46-4.79 1.01-5.63 1.46-.84 3.45.12 5.37 1.95 1.92-1.83 3.91-2.79 5.37-1.95z"/>
        </svg>
      )
    },
    {
      name: "Next.js",
      icon: (
        <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
          <path d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 0 1-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 0 0-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 0 0-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 0 1-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 0 1-.157-.171l-.05-.106.006-4.703.007-4.705.072-.092a.645.645 0 0 1 .174-.143c.096-.047.134-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 1.999 2.895 4.361a10760.433 10760.433 0 0 0 4.735 7.17l1.9 2.879.096-.063a12.317 12.317 0 0 0 2.466-2.163 11.944 11.944 0 0 0 2.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747C19.146 4.318 16.06.905 11.572 0z"/>
        </svg>
      )
    },
    {
      name: "TypeScript",
      icon: (
        <svg viewBox="0 0 24 24" className="w-full h-full fill-[#3178C6]">
          <path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z"/>
        </svg>
      )
    },
    {
      name: "Tailwind CSS",
      icon: (
        <svg viewBox="0 0 24 24" className="w-full h-full fill-[#06B6D4]">
          <path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z"/>
        </svg>
      )
    },
    {
      name: "GSAP",
      icon: (
        <svg viewBox="0 0 24 24" className="w-full h-full fill-[#88CE02]">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 17.568c-.88.88-2.04 1.216-3.216 1.216-1.176 0-2.336-.336-3.216-1.216-.88-.88-1.216-2.04-1.216-3.216 0-1.176.336-2.336 1.216-3.216.88-.88 2.04-1.216 3.216-1.216 1.176 0 2.336.336 3.216 1.216.88.88 1.216 2.04 1.216 3.216 0 1.176-.336 2.336-1.216 3.216z"/>
        </svg>
      )
    },
    {
      name: "Three.js",
      icon: (
        <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
          <path d="M.38 0L.128 23.85l11.872-11.925L.38 0zm23.24 23.85L11.748 11.925 23.62 0l.001 23.85z"/>
        </svg>
      )
    }
  ];

  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden py-8">
      <TechCarousel 
        technologies={sampleTechnologies}
        speed={15}
        className="w-full max-w-6xl"
      />
    </div>
  );
}