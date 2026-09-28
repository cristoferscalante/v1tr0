"use client"

import { motion } from "framer-motion"
import { usePathname } from "next/navigation"
import { useIntroActive } from "@/lib/intro-store"
import { SOUND_CONTROL_ATTR, useSound } from "./SoundProvider"

/** Alturas de reposo de las barras: el ecualizador apagado dibuja una línea casi plana. */
const BARS = [0.45, 0.8, 0.6, 1, 0.5]

/**
 * Control flotante de la música, abajo a la derecha. Círculo sobrio, sin brillos.
 */
export default function SoundToggle() {
  const { status, toggle, preload } = useSound()
  const on = status === "on"
  const introActive = useIntroActive(usePathname())

  return (
    // Vive en la esquina derecha: entra desde ese borde, tras la intro del home
    <motion.button
      type="button"
      initial={{ opacity: 0, x: 120 }}
      animate={introActive ? { opacity: 0, x: 120 } : { opacity: 1, x: 0 }}
      transition={{ duration: 1, delay: introActive ? 0 : 0.8, ease: [0.16, 1, 0.3, 1] }}
      {...{ [SOUND_CONTROL_ATTR]: "" }}
      onClick={toggle}
      onPointerEnter={preload}
      aria-pressed={on}
      aria-label={on ? "Silenciar música" : "Activar música"}
      title={on ? "Silenciar música" : "Activar música"}
      className="group fixed z-50 right-4 md:right-12 bottom-[calc(1.5rem+env(safe-area-inset-bottom))] md:bottom-12 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-[#0c0f10]/80 backdrop-blur-sm transition-colors duration-300 hover:border-[#26FFDF]/40 focus:outline-none focus-visible:border-[#26FFDF]"
    >
      <span aria-hidden="true" className="flex h-4 items-center gap-[3px]">
        {BARS.map((height, i) => (
          <span
            key={i}
            className={`sound-bar block w-[2px] origin-center rounded-full transition-colors duration-300 ${
              on ? "bg-[#26FFDF]" : "bg-white/40 group-hover:bg-white/70"
            } ${status === "loading" ? "animate-pulse" : ""}`}
            style={{
              height: `${height * 100}%`,
              transform: on ? undefined : "scaleY(0.18)",
              animation: on ? `sound-bar ${0.9 + i * 0.17}s ease-in-out ${i * -0.23}s infinite alternate` : undefined,
            }}
          />
        ))}
      </span>
    </motion.button>
  )
}
