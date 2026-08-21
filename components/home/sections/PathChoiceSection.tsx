"use client"

import React, { useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Code2, Cpu, Radio, RadioTower, ShieldCheck, Workflow } from 'lucide-react'
import useSnapAnimations from '@/hooks/use-snap-animations'
import { accentText, eyebrow, sectionTitle, surface, surfaceInteractive, surfaceInner } from '@/components/home/shared/surface'

/**
 * Sección de bifurcación del home: software o hardware.
 *
 * Es una pregunta, no un catálogo. Cada tarjeta lleva a su página de caída
 * (/contratar-software, /hardware-iot), que es donde se explica el alcance
 * completo y donde vive el contenido pensado para buscadores.
 */

const paths = [
  {
    href: '/contratar-software',
    icon: Code2,
    eyebrowText: 'Ruta 1',
    title: 'Necesito software',
    tagline: 'Una web, una tienda, un sistema interno o automatizar algo que hoy se hace a mano.',
    bullets: [
      { icon: Workflow, text: 'Alcance, precio y fecha por escrito' },
      { icon: ShieldCheck, text: 'El repositorio queda a tu nombre' },
    ],
    cta: 'Ver cómo es contratar software',
  },
  {
    href: '/hardware-iot',
    icon: Cpu,
    eyebrowText: 'Ruta 2',
    title: 'Necesito hardware',
    tagline: 'Medir algo que pasa en campo —suelo, tanques, temperatura— donde no hay internet.',
    bullets: [
      { icon: Radio, text: 'Comunicación LoRa: kilómetros sin plan de datos' },
      { icon: RadioTower, text: 'Nodos, gateway y panel de monitoreo' },
    ],
    cta: 'Ver alcances de hardware e IoT',
  },
] as const

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function PathChoiceSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useSnapAnimations({
    sections: ['.path-choice-section'],
    duration: 0.8,
    enableCircularNavigation: false,
    singleAnimation: true,
  })

  return (
    <section
      ref={sectionRef}
      className="path-choice-section relative min-h-[100dvh] w-full flex items-center justify-center py-12 px-4"
    >
      <motion.div
        className="max-w-5xl mx-auto z-10 flex w-full flex-col items-center"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div className="mb-8 text-center md:mb-10" variants={itemVariants}>
          <p className={eyebrow}>Empecemos por lo básico</p>
          <h2 className={`mt-3 ${sectionTitle}`}>¿Lo tuyo es software o hardware?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-textMuted md:text-base">
            Elige la ruta que se parezca a tu necesidad y te explicamos, sin tecnicismos, cómo
            trabajamos, qué recibes y hasta dónde llegamos.
          </p>
        </motion.div>

        <div className="grid w-full gap-4 md:grid-cols-2 md:gap-5">
          {paths.map((path) => {
            const Icon = path.icon

            return (
              <motion.div key={path.href} variants={itemVariants} className="h-full">
                <Link
                  href={path.href}
                  className={`group flex h-full flex-col p-6 md:p-8 ${surface} ${surfaceInteractive}`}
                >
                  <span className={`flex h-12 w-12 items-center justify-center ${surfaceInner}`}>
                    <Icon className={`h-5 w-5 ${accentText}`} aria-hidden="true" />
                  </span>

                  <p className={`mt-5 ${eyebrow}`}>{path.eyebrowText}</p>
                  <h3 className="mt-2 text-xl font-bold leading-tight text-textPrimary md:text-2xl">
                    {path.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-textMuted">{path.tagline}</p>

                  <ul className="mt-5 flex flex-col gap-2.5">
                    {path.bullets.map((bullet) => {
                      const BulletIcon = bullet.icon
                      return (
                        <li key={bullet.text} className="flex items-start gap-2.5 text-sm text-textMuted">
                          <BulletIcon className={`mt-0.5 h-4 w-4 shrink-0 ${accentText}`} aria-hidden="true" />
                          <span>{bullet.text}</span>
                        </li>
                      )
                    })}
                  </ul>

                  <span className={`mt-auto flex items-center gap-1.5 pt-6 text-sm font-semibold ${accentText}`}>
                    {path.cta}
                    <ArrowRight
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </section>
  )
}
