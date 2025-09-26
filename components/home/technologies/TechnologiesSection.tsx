"use client";

import React, { useRef } from 'react';
import { TechCarousel } from '@/components/ui/tech-carousel';
import { SiReact, SiNextdotjs, SiTypescript, SiTailwindcss, SiNodedotjs, SiMongodb, SiPostgresql, SiSupabase, SiGit, SiGithub } from "react-icons/si";
import useSnapAnimations from '@/hooks/use-snap-animations';

const techLogos = [
  { name: "React", icon: <SiReact className="text-[#61DAFB]" /> },
  { name: "Next.js", icon: <SiNextdotjs className="text-foreground" /> },
  { name: "TypeScript", icon: <SiTypescript className="text-[#3178C6]" /> },
  { name: "Tailwind CSS", icon: <SiTailwindcss className="text-[#06B6D4]" /> },
  { name: "Node.js", icon: <SiNodedotjs className="text-[#339933]" /> },
  { name: "MongoDB", icon: <SiMongodb className="text-[#47A248]" /> },
  { name: "PostgreSQL", icon: <SiPostgresql className="text-[#336791]" /> },
  { name: "Supabase", icon: <SiSupabase className="text-[#3ECF8E]" /> },
  { name: "Git", icon: <SiGit className="text-[#F05032]" /> },
  { name: "GitHub", icon: <SiGithub className="text-foreground" /> },
];

const TechnologiesSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  
  // Configurar animaciones de entrada para esta sección
  useSnapAnimations({
    sections: ['.technologies-section'],
    duration: 0.8,
    enableCircularNavigation: false,
    singleAnimation: true,
    onSnapComplete: () => {
      // Technologies section animation completed
    }
  });

  return (
    <section ref={sectionRef} className="technologies-section py-16 bg-transparent">
      <div className="w-full px-4">
        {/* TechCarousel Component - Organic scroll-based velocity */}
        <div className="tech-carousel-container animate-element bg-transparent w-full">
          <TechCarousel 
            technologies={techLogos}
            speed={8}
            className="w-full"
            showGradients={true}
          />
        </div>
      </div>
    </section>
  );
};

export default TechnologiesSection;