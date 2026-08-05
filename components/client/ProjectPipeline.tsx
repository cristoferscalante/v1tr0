"use client"

import { useLayoutEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Lock } from "lucide-react"
import { AnimatedIcon } from "@/components/home/sections/AnimatedIcon"
import { taskIcon } from "@/components/shared/task-icons"
import {
  resolveGlobalUnlock,
  TRACK_LABELS,
  type PipelinePhase,
  type ResolvedTask,
} from "@/components/shared/project-tree"

export type { PipelinePhase, PipelineTask } from "@/components/shared/project-tree"

// Izquierda / centro / derecha, como el árbol de habilidades de referencia.
// El tronco común nace abajo y las 3 ramas se abren hacia arriba. Vista
// compacta y no interactiva — el tablero completo vive en TaskTreeBoard.
const BRANCHES: { track: string; d: string }[] = [
  { track: "planning", d: "M150,196 Q58,150 34,16" },
  { track: "development", d: "M150,196 Q150,108 150,10" },
  { track: "quality", d: "M150,196 Q242,150 266,16" },
]

interface NodePoint extends ResolvedTask {
  x: number
  y: number
}

function useBranchPoints(resolved: ResolvedTask[]) {
  const pathRefs = useRef<Record<string, SVGPathElement | null>>({})
  const [points, setPoints] = useState<Record<string, NodePoint[]>>({})

  useLayoutEffect(() => {
    const byTrack: Record<string, ResolvedTask[]> = { planning: [], development: [], quality: [] }
    for (const entry of resolved) {
      byTrack[entry.track] = [...(byTrack[entry.track] ?? []), entry]
    }

    const next: Record<string, NodePoint[]> = {}
    for (const branch of BRANCHES) {
      const path = pathRefs.current[branch.track]
      const tasks = byTrack[branch.track] ?? []
      if (!path || tasks.length === 0) {
        next[branch.track] = []
        continue
      }
      const total = path.getTotalLength()
      next[branch.track] = tasks.map((entry, i) => {
        const t = (i + 1) / (tasks.length + 1)
        const { x, y } = path.getPointAtLength(t * total)
        return { ...entry, x, y }
      })
    }
    setPoints(next)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(resolved.map((r) => [r.task.id, r.unlocked, r.isCurrent]))])

  return { pathRefs, points }
}

export default function ProjectPipeline({
  phases,
  compact = false,
}: {
  phases: PipelinePhase[]
  compact?: boolean
}) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const resolved = resolveGlobalUnlock(phases)
  const { pathRefs, points } = useBranchPoints(resolved)

  if (resolved.length === 0) {
    return <p className="text-textSecondary text-xs">Sin tareas registradas aún</p>
  }

  const height = compact ? 100 : 170
  const nodeSize = compact ? 16 : 22

  return (
    <div className="relative w-full" style={{ height }}>
      <svg viewBox="0 0 300 200" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet" aria-hidden>
        {BRANCHES.map((branch) => (
          <path
            key={branch.track}
            ref={(el) => { pathRefs.current[branch.track] = el }}
            d={branch.d}
            fill="none"
            stroke="#08A696"
            strokeOpacity={0.25}
            strokeWidth={1.5}
          />
        ))}
      </svg>

      {BRANCHES.map((branch) =>
        (points[branch.track] ?? []).map((node) => {
          const meta = taskIcon(node.task.icon)
          const isOpen = hoveredId === node.task.id
          return (
            <div
              key={node.task.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${(node.x / 300) * 100}%`, top: `${(node.y / 200) * 100}%` }}
            >
              <button
                type="button"
                onMouseEnter={() => setHoveredId(node.task.id)}
                onMouseLeave={() => setHoveredId((prev) => (prev === node.task.id ? null : prev))}
                onClick={() => setHoveredId((prev) => (prev === node.task.id ? null : node.task.id))}
                className="relative flex items-center justify-center rounded-full border transition-all duration-300"
                style={{
                  width: nodeSize,
                  height: nodeSize,
                  background: node.isCurrent
                    ? "rgba(13,93,93,0.8)"
                    : node.task.completed
                    ? "rgba(8,166,150,0.28)"
                    : "rgba(0,0,0,0.4)",
                  borderColor: node.isCurrent ? "#26FFDF" : node.task.completed ? "rgba(38,255,223,0.6)" : "rgba(255,255,255,0.12)",
                  boxShadow: node.isCurrent
                    ? "0 0 10px -1px rgba(38,255,223,0.6)"
                    : node.task.completed
                    ? "0 0 6px -2px rgba(38,255,223,0.4)"
                    : undefined,
                }}
              >
                {node.isCurrent && (
                  <motion.span
                    className="absolute inset-0 rounded-full border border-[#26FFDF]/60"
                    animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
                  />
                )}
                {/* El ícono real siempre se ve; solo cambia cuánto "se alumbra". */}
                <AnimatedIcon
                  kind={meta.kind}
                  icon={meta.icon}
                  active={node.isCurrent || Boolean(node.task.completed)}
                  size={compact ? 9 : 12}
                  className={node.isCurrent ? "text-[#26FFDF]" : node.task.completed ? "text-[#26FFDF]/90" : "text-white/35"}
                />
                {!node.unlocked && (
                  <Lock
                    className="absolute -bottom-0.5 -right-0.5 text-white/40 bg-black/70 rounded-full p-[1px] border border-white/10"
                    style={{ width: nodeSize * 0.35, height: nodeSize * 0.35 }}
                  />
                )}
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-20 w-max max-w-[170px] px-2.5 py-1.5 rounded-lg bg-black/90 border border-[#26FFDF]/20 backdrop-blur-sm shadow-xl pointer-events-none"
                  >
                    <p className="text-[9px] uppercase tracking-wider text-[#26FFDF]/70">
                      {TRACK_LABELS[node.track] ?? node.track}
                    </p>
                    <p className="text-[11px] font-medium text-white text-center">{node.task.name}</p>
                    {!node.unlocked && (
                      <p className="text-[9px] text-textSecondary text-center mt-0.5">
                        Pendiente · se activa al completar la anterior
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        }),
      )}
    </div>
  )
}
