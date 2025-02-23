"use client";

import React from "react";
import { motion } from "framer-motion";
import DataSvg from "@/public/home/svg/data.svg";
import DevSvg from "@/public/home/svg/dev.svg";
import PmSvg from "@/public/home/svg/pm.svg";

import CardBanner from "@/src/components/home/shared/CardBanner"; 

const textVariant = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: {
      delay: i * 0.3,
      duration: 0.5,
    },
  }),
};

export default function HomeBanner() {
  const title = "Gestiona tus proyectos como nunca antes";

  return (
    <section className="h-screen w-screen px-4 py-16 flex justify-center items-center">
      <div className="max-w-6xl mx-auto text-center">
        {/* Título con animación letra por letra */}
        <motion.h1
          className="text-4xl md:text-7xl font-bold text-white mb-4 text-center"
          style={{
            wordBreak: "break-word",
            display: "inline-block",
          }}
          initial="hidden"
          animate="visible"
        >
          {title.split(" ").map((word, index) => (
            <motion.span
              key={index}
              variants={textVariant}
              custom={index}
              className="inline-block"
              style={{
                marginRight:
                  index < title.split(" ").length - 1 ? "0.25em" : "0",
              }}
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>

        {/* Descripción */}
        <p className="text-gray-400 text-lg mb-12">
          Con VITRO, tus proyectos son completamente transparentes
        </p>

        {/* Tarjetas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <CardBanner icon={DevSvg} title="Desarrollo de Software a Medida" onClick={() => {}} />
          <CardBanner
            icon={DataSvg}
            title="Procesamiento, Análisis y Visualización de Datos"
            onClick={() => {}}
          />
          <CardBanner icon={PmSvg} title="Creación y Gestión de Proyectos" onClick={() => {}} />
        </div>
      </div>
    </section>
  );
}
