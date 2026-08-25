"use client"

import { useCallback, useMemo, useState } from "react"
import { Activity, GitBranch, LayoutGrid, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import AdminTaskTreeBoard from "@/components/admin/AdminTaskTreeBoard"
import ActivityFeed from "./ActivityFeed"
import ProjectTeamPanel from "./ProjectTeamPanel"
import TaskDetailDrawer from "./TaskDetailDrawer"
import TaskKanban from "./TaskKanban"
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
      <div className="flex flex-wrap gap-1 border-b border-white/10 px-4 pt-4 lg:px-8">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={cn(
              "flex items-center gap-1.5 rounded-t-lg px-3 py-2 text-xs font-semibold transition-colors",
              tab === key
                ? "border-b-2 border-[#08A696] text-white"
                : "border-b-2 border-transparent text-white/40 hover:text-white/70",
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* El árbol se monta siempre y solo se oculta: remontarlo al cambiar de
          pestaña reinicia el zoom y la posición del lienzo de React Flow. */}
      <div className={tab === "arbol" ? "block" : "hidden"}>
        <AdminTaskTreeBoard {...treeProps} />
      </div>

      {tab === "tablero" && (
        <div className="px-4 pb-8 lg:px-8">
          <TaskKanban
            projectId={projectId}
            initialTasks={tasks}
            phases={phases}
            members={members}
            onOpenTask={setOpenTask}
          />
        </div>
      )}

      {/* El panel de equipo se mantiene montado aunque no sea la pestaña
          activa: es quien alimenta la lista de responsables del tablero. */}
      <div className={cn("px-4 pb-8 lg:px-8", tab === "equipo" ? "block" : "hidden")}>
        <ProjectTeamPanel projectId={projectId} onMembersChange={handleMembers} />
      </div>

      {tab === "actividad" && (
        <div className="max-w-2xl px-4 pb-8 lg:px-8">
          <ActivityFeed projectId={projectId} scope="admin" />
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
