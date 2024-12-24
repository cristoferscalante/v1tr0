'use client';

import React from 'react';
import { motion } from 'framer-motion';
import DataSvg from '@/public/home/svg/data.svg';
import DevSvg from '@/public/home/svg/dev.svg';
import PmSvg from '@/public/home/svg/pm.svg';

import CardBanner from '@/src/components/CardBanner';

const textVariant = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: {
      delay: i * 0.05, // Controla el tiempo entre letras
    },
  }),
};

export default function HomeBanner() {
  const title = 'Gestiona tus proyectos como nunca antes';

  return (
    <section className="h-screen w-screen px-4 py-16 flex justify-center items-center">
      <div className="max-w-6xl mx-auto text-center">
        {/* Título con animación letra por letra */}
        <motion.h1
          className="text-4xl md:text-7xl font-bold text-white mb-4"
          initial="hidden"
          animate="visible"
        >
          {title.split('').map((char, index) => (
            <motion.span
              key={index}
              variants={textVariant}
              custom={index}
              className="inline-block"
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </motion.h1>

        {/* Descripción */}
        <p className="text-gray-400 text-lg mb-12">
          Con VITRO, tus proyectos son completamente transparentes
        </p>

        {/* Tarjetas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <CardBanner Icon={DevSvg} title="Desarrollo de Software a Medida" />
          <CardBanner Icon={DataSvg} title="Procesamiento, Análisis y Visualización de Datos" />
          <CardBanner Icon={PmSvg} title="Creación y Gestión de Proyectos" />
        </div>
      </div>
    </section>
  );
}



