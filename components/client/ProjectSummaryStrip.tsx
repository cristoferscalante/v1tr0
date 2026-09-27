"use client"

import { useEffect, useState } from "react"
import { Activity, CircleDot, ListTodo } from "lucide-react"

interface Phase {
  id: string
  name: string
  status: string
  order: number
  tasks: { id: string; completed: boolean }[]
}

/**
 * Franja de resumen sobre el árbol del proyecto.
 *
 * El árbol responde "cómo va todo" de un vistazo, pero no "qué pasó desde la
 * última vez que entré" ni "qué sigue" — para saberlo había que recorrer las
 * ramas nodo por nodo. Estas tres celdas contestan esas preguntas antes de
 * que el cliente tenga que preguntarlas por correo.
 */
export default function ProjectSummaryStrip({
  projectId,
  phases,
  progress,
}: {
  projectId: string
  phases: Phase[]
  progress: number
}) {
  const [ultimo, setUltimo] = useState<string | null>(null)

  useEffect(() => {
    let cancelado = false
    fetch(`/api/projects/${projectId}/activity?limit=1`)
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => {
        if (!cancelado && Array.isArray(d) && d[0]) {setUltimo(d[0].summary)}
      })
      .catch(() => {
        // La franja es informativa: si la bitácora falla, se muestra el resto.
      })
    return () => {
      cancelado = true
    }
  }, [projectId])

  const ordenadas = [...phases].sort((a, b) => a.order - b.order)
  // Fase actual = la primera sin terminar. Si están todas hechas, la última.
  const actual =
    ordenadas.find((p) => p.status !== "completed" && p.tasks.some((t) => !t.completed)) ??
    ordenadas[ordenadas.length - 1] ??
    null

  const pendientes = actual ? actual.tasks.filter((t) => !t.completed).length : 0

  // Posición de la fase actual dentro de la secuencia: "3 de 7" contesta
  // "¿cuánto falta?" mejor que el nombre de la fase por sí solo.
  const posicion = actual ? ordenadas.findIndex((p) => p.id === actual.id) + 1 : 0

  const celdas = [
    {
      icono: <CircleDot className="h-3.5 w-3.5" />,
      etiqueta: posicion ? `Fase actual · ${posicion} de ${ordenadas.length}` : "Fase actual",
      valor: actual?.name ?? "Sin fases todavía",
    },
    {
      icono: <ListTodo className="h-3.5 w-3.5" />,
      etiqueta: "Qué sigue",
      valor: actual
        ? pendientes > 0
          ? `${pendientes} tarea${pendientes === 1 ? "" : "s"} en curso`
          : "Fase lista para cerrar"
        : "—",
    },
    {
      icono: <Activity className="h-3.5 w-3.5" />,
      etiqueta: "Último movimiento",
      valor: ultimo ?? "Sin movimientos aún",
    },
  ]

  return (
    <div className="shrink-0 border-b border-white/5">
      <div className="grid gap-px bg-white/5 sm:grid-cols-3">
        {celdas.map((c) => (
          <div key={c.etiqueta} className="bg-[#1e2123] px-4 py-3">
            <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-white/30">
              {c.icono}
              {c.etiqueta}
            </p>
            <p className="mt-1 truncate text-[13px] text-white/80" title={c.valor}>
              {c.valor}
            </p>
          </div>
        ))}
      </div>

      {/* Progreso general: el mismo dato que el árbol calcula, pero legible
          sin interpretar el dibujo. */}
      <div className="flex items-center gap-3 px-4 py-2">
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-[#08A696] transition-[width] duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="font-mono text-[10px] tabular-nums text-white/40">{progress}%</span>
      </div>
    </div>
  )
}
