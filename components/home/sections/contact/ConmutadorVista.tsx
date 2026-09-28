"use client"

import { motion } from "framer-motion"

/**
 * Conmutador entre las dos caras del asistente: la conversación y los datos
 * que ha ido recogiendo. Al terminar el guion el chat ya no tiene nada que
 * preguntar, así que la vista salta sola a los datos y esto queda como la
 * forma de volver.
 *
 * Los dos iconos son SVG animados —las burbujas laten, el visto se dibuja—
 * para que se vea de un golpe en cuál de las dos está.
 */

export type Vista = "chat" | "datos"

const OPCIONES: Array<{ id: Vista; etiqueta: string }> = [
  { id: "chat", etiqueta: "Conversación" },
  { id: "datos", etiqueta: "Datos" },
]

/** Burbujas de la conversación: los puntos laten cuando es la vista activa. */
function IconoChat({ activo }: { activo: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
      <path
        d="M3.5 6.5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-6l-4 3v-3h-0a2 2 0 0 1-2-2v-5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {[7.5, 10.5, 13.5].map((cx, indice) => (
        <motion.circle
          key={cx}
          cx={cx}
          cy={9}
          r={1.1}
          fill="currentColor"
          animate={activo ? { opacity: [0.35, 1, 0.35] } : { opacity: 0.5 }}
          transition={
            activo
              ? { duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: indice * 0.18 }
              : { duration: 0.2 }
          }
        />
      ))}
    </svg>
  )
}

/** Ficha de datos: las líneas entran escalonadas y el visto se dibuja al final. */
function IconoDatos({ activo, completo }: { activo: boolean; completo: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
      <rect x="4" y="3.5" width="16" height="17" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
      {[8, 11.5, 15].map((y, indice) => (
        <motion.line
          key={y}
          x1={7.5}
          y1={y}
          x2={indice === 2 ? 13 : 16.5}
          y2={y}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={false}
          animate={activo ? { pathLength: 1, opacity: 1 } : { pathLength: 0.55, opacity: 0.5 }}
          transition={{ duration: 0.35, delay: activo ? indice * 0.08 : 0 }}
        />
      ))}
      {completo && (
        <motion.path
          d="M8.5 15.5l2.6 2.6 5-5.4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      )}
    </svg>
  )
}

export default function ConmutadorVista({
  vista,
  onCambiar,
  completo = false,
}: {
  vista: Vista
  onCambiar: (vista: Vista) => void
  /** Brief con lo mínimo necesario: el icono de datos se marca con un visto. */
  completo?: boolean
}) {
  return (
    <div
      role="tablist"
      aria-label="Vista del asistente"
      className="relative inline-flex shrink-0 self-start rounded-full border border-white/10 bg-[#0b1414]/70 p-1 backdrop-blur-sm"
    >
      {OPCIONES.map((opcion) => {
        const activo = vista === opcion.id

        return (
          <button
            key={opcion.id}
            type="button"
            role="tab"
            aria-selected={activo}
            onClick={() => onCambiar(opcion.id)}
            className={`relative z-10 flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs transition-colors duration-300 ${
              activo ? "text-[#0b1414]" : "text-textMuted hover:text-[#26ffdf]"
            }`}
          >
            {/* La pastilla viaja de una opción a otra en vez de aparecer. */}
            {activo && (
              <motion.span
                layoutId="conmutador-activo"
                className="absolute inset-0 -z-10 rounded-full bg-[#26ffdf]"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            {opcion.id === "chat" ? (
              <IconoChat activo={activo} />
            ) : (
              <IconoDatos activo={activo} completo={completo} />
            )}
            {opcion.etiqueta}
          </button>
        )
      })}
    </div>
  )
}
