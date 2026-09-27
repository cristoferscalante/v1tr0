"use client"

import { useCallback, useMemo, useState } from "react"
import { Activity, GitBranch, LayoutGrid, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import AdminTaskTreeBoard from "@/components/admin/AdminTaskTreeBoard"
import ActivityFeed from "./ActivityFeed"
import ProjectTeamPanel from "./ProjectTeamPanel"
import TaskDetailDrawer from "./TaskDetailDrawer"
import TaskKanban from "./TaskKanban"
import { Panel } from "@/components/shared/panel-ui"
import type { BoardMember, BoardPhase, BoardTask } from "./types"

type Tab = "arbol" | "tablero" | "equipo" | "actividad"

const TABS: { key: Tab; label: string; icon: typeof GitBranch }[] = [
  { key: "arbol", label: "Árbol", icon: GitBranch },
  { key: "tablero", label: "Tablero", icon: LayoutGrid },
  { key: "equipo", label: "Equipo", icon: Users },
  { key: "actividad", label: "Actividad", icon: Activity },
]

/**
 * Contenedor del detalle de proyecto para el equipo. El árbol de habilidades
 * (la vista que ya existía) convive con el tablero kanban: el árbol cuenta la
 * historia del proyecto al cliente, el tablero es la herramienta diaria de
 * quien ejecuta. Son la misma data vista de dos maneras.
 */
export default function ProjectWorkspace({
  projectId,
  treeProps,
  initialTasks,
  phases,
}: {
  projectId: string
  // Se pasa tal cual al árbol, que conserva su propio contrato de props.
  treeProps: React.ComponentProps<typeof AdminTaskTreeBoard>
  initialTasks: BoardTask[]
  phases: BoardPhase[]
}) {
  const [tab, setTab] = useState<Tab>("arbol")
  const [tasks, setTasks] = useState(initialTasks)
  const [members, setMembers] = useState<BoardMember[]>([])
  const [openTask, setOpenTask] = useState<BoardTask | null>(null)

  const handleMembers = useCallback(
    (list: { profileId: string; name: string | null; email: string | null }[]) =>
      setMembers(list.map(({ profileId, name, email }) => ({ profileId, name, email }))),
    [],
  )

  const currentOpen = useMemo(
    () => (openTask ? tasks.find((t) => t.id === openTask.id) ?? openTask : null),
    [openTask, tasks],
  )

  return (
    <div className="space-y-5">
      {/* Riel de secciones en mono, con un cuadrito marcando la activa. Un
          subrayado dice "pestaña de navegador"; el cuadrito dice "índice de
          lámina", que es el registro de las referencias. */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-white/10 px-4 pt-5 pb-3 lg:px-8">
        {TABS.map(({ key, label, icon: Icon }, i) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={cn(
              "group flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors",
              tab === key ? "text-white" : "text-white/30 hover:text-white/60",
            )}
          >
            <span
              className={cn(
                "rail-mark transition-colors",
                tab === key ? "bg-[#08A696]" : "bg-transparent",
              )}
            />
            <span className="tabular-nums text-white/25">{String(i + 1).padStart(2, "0")}</span>
            <Icon className="h-3 w-3" />
            {label}
          </button>
        ))}
      </div>

      {/* El árbol se monta siempre y solo se oculta: remontarlo al cambiar de
          pestaña reinicia el zoom y la posición del lienzo de React Flow. */}
      <div className={tab === "arbol" ? "block" : "hidden"}>
        <AdminTaskTreeBoard {...treeProps} />
      </div>

      {/* El árbol va a sangre porque es un lienzo de React Flow y necesita
          todo el ancho; las demás pestañas sí viven dentro de una superficie,
          como el resto de páginas del panel. */}
      {tab === "tablero" && (
        <div className="px-4 pb-8 lg:px-8">
          <Panel label="Tablero" className="p-4 pt-5">
          <TaskKanban
            projectId={projectId}
            initialTasks={tasks}
            phases={phases}
            members={members}
            onOpenTask={setOpenTask}
          />
          </Panel>
        </div>
      )}

      {/* El panel de equipo se mantiene montado aunque no sea la pestaña
          activa: es quien alimenta la lista de responsables del tablero. */}
      <div className={cn("px-4 pb-8 lg:px-8", tab === "equipo" ? "block" : "hidden")}>
        <Panel label="Equipo" className="p-5 pt-6">
          <ProjectTeamPanel projectId={projectId} onMembersChange={handleMembers} />
        </Panel>
      </div>

      {tab === "actividad" && (
        <div className="max-w-2xl px-4 pb-8 lg:px-8">
          <Panel label="Bitácora" className="p-5 pt-6">
            <ActivityFeed projectId={projectId} scope="admin" />
          </Panel>
        </div>
      )}

      {currentOpen && (
        <TaskDetailDrawer
          projectId={projectId}
          task={currentOpen}
          phases={phases}
          members={members}
          onClose={() => setOpenTask(null)}
          onSaved={(updated) => {
            setTasks((c) => c.map((t) => (t.id === updated.id ? updated : t)))
            setOpenTask(updated)
          }}
        />
      )}
    </div>
  )
}
