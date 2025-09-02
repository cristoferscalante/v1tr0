"use client";

import React from "react";
import Image from "next/image";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";

export default function AppleCardsCarouselDemo() {
  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (
    <div className="w-full h-full py-20">
      <h2 className="max-w-7xl pl-4 mx-auto text-xl md:text-5xl font-bold text-text-primary font-sans">
        Nuestros Proyectos de Sistemas de Información
      </h2>
      <Carousel items={cards} />
    </div>
  );
}

const DummyContent = () => {
  return (
    <>
      {[...new Array(3).fill(1)].map((_, index) => {
        return (
          <div
            key={"dummy-content" + index}
            className="bg-custom-1 p-8 md:p-14 rounded-3xl mb-4"
          >
            <p className="text-text-primary text-base md:text-2xl font-sans max-w-3xl mx-auto">
              <span className="font-bold text-primary">
                Implementación exitosa de sistema empresarial.
              </span>{" "}
              Este proyecto transformó completamente los procesos de la empresa, 
              automatizando tareas críticas y mejorando la eficiencia operativa. 
              Los resultados superaron las expectativas iniciales.
            </p>
            <Image
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=500&auto=format&fit=crop"
              alt="Sistema de gestión empresarial"
              height={500}
              width={500}
              className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain rounded-xl mt-6"
            />
          </div>
        );
      })}
    </>
  );
};

const data = [
  {
    category: "Sistema ERP",
    title: "Gestión Empresarial Integral",
    description: "Sistema completo para la gestión de recursos empresariales",
    technologies: ["React", "Node.js", "PostgreSQL"],
    src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop&ixlib=rb-4.0.3",
    content: <DummyContent />,
  },
  {
    category: "E-Learning",
    title: "Plataforma Educativa",
    description: "Sistema de gestión de aprendizaje moderno",
    technologies: ["Next.js", "TypeScript", "Prisma"],
    src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2671&auto=format&fit=crop&ixlib=rb-4.0.3",
    content: <DummyContent />,
  },
  {
    category: "Fintech",
    title: "Sistema de Pagos",
    description: "Plataforma segura para procesamiento de pagos",
    technologies: ["Angular", "Java", "MongoDB"],
    src: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3",
    content: <DummyContent />,
  },
];
