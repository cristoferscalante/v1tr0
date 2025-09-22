"use client";

import React from 'react';
import { TechCarousel } from '@/components/ui/tech-carousel';
import { SiReact, SiNextdotjs, SiTypescript, SiTailwindcss, SiNodedotjs, SiPython, SiMongodb, SiPostgresql, SiSupabase, SiDocker, SiAmazonwebservices, SiGit, SiGithub } from "react-icons/si";

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

interface TechItem {
  name: string;
  category: string;
  initials: string;
  color: string;
}

const TechnologiesSection: React.FC = () => {
  const techStack: TechItem[] = [
    // Frontend
    { name: "React", category: "Frontend", initials: "R", color: "bg-blue-500" },
    { name: "Next.js", category: "Frontend", initials: "N", color: "bg-black" },
    { name: "TypeScript", category: "Frontend", initials: "TS", color: "bg-blue-600" },
    { name: "Tailwind CSS", category: "Frontend", initials: "TW", color: "bg-cyan-500" },
    
    // Backend
    { name: "Node.js", category: "Backend", initials: "N", color: "bg-green-600" },
    { name: "Python", category: "Backend", initials: "P", color: "bg-yellow-500" },
    { name: "PostgreSQL", category: "Backend", initials: "PG", color: "bg-blue-700" },
    
    // DevOps
    { name: "Docker", category: "DevOps", initials: "D", color: "bg-blue-400" },
    { name: "AWS", category: "DevOps", initials: "AWS", color: "bg-orange-500" },
    { name: "Git", category: "DevOps", initials: "G", color: "bg-red-500" }
  ];

  const categoryList = ["Frontend", "Backend", "DevOps"];

  return (
    <section className="py-16 bg-transparent">
      <div className="w-full px-4">
        {/* Título de la sección */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Nuestras Tecnologías
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Utilizamos las mejores herramientas y tecnologías para crear soluciones innovadoras
          </p>
        </div>
        
        {/* TechCarousel Component - Organic scroll-based velocity */}
        <div className="bg-transparent w-full">
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