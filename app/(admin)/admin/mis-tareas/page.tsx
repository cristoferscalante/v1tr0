"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { CalendarClock, Inbox, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { TASK_PRIORITY_META, TASK_STATUS_META, taskRef, type TaskPriority, type TaskStatus } from "@/components/shared/task-status"
import { EmptyState, PanelPage, Pill, SectionHeading } from "@/components/shared/panel-ui"

interface MyTask {
  id: string
  name: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: string | null
  phaseName: string
  projectId: string
  projectName: string
}

export default function MyTasksPage() {
  const [tasks, setTasks] = useState<MyTask[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/me/tasks")
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => setTasks(Array.isArray(d) ? d : []))
      .catch(() => setTasks([]))
      .finally(() => setLoading(false))
  }, [])

  // Agrupadas por proyecto: la pregunta real al abrir esta pantalla es "¿qué
  // me toca hoy y de qué proyecto es?", no "¿cuántas tengo en total?".
  const byProject = tasks.reduce<Record<string, MyTask[]>>((acc, t) => {
    ;(acc[t.projectId] ??= []).push(t)
    return acc
  }, {})

  return (
    <PanelPage className="max-w-3xl">
      <SectionHeading
        badge="Equipo"
        title="Mis tareas"
        subtitle="Todo lo que tienes asignado y sigue abierto, de todos los proyectos."
      />

      {loading && (
        <div className="flex items-center gap-2 py-12 text-white/40">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-xs">Cargando…</span>
        </div>
      )}

      {!loading && tasks.length === 0 && (
        <EmptyState
          icon={<Inbox />}
          message="No tienes tareas abiertas asignadas"
          hint="Aparecerán aquí en cuanto alguien del equipo te asigne una"
        />
      )}

      <div className="space-y-6">
        {Object.entries(byProject).map(([projectId, list]) => (
          <section key={projectId}>
            <Link
              href={`/admin/proyectos/${projectId}`}
              className="text-xs font-semibold uppercase tracking-wide text-[#26FFDE] hover:underline"
            >
              {list[0]!.projectName}
            </Link>
            <ul className="mt-2 space-y-2">
              {list.map((t) => {
                const overdue = t.dueDate && new Date(t.dueDate).getTime() < Date.now()
                return (
                  <li
                    key={t.id}
                    className={cn(
                      "rounded-md border px-3 py-2.5",
                      TASK_STATUS_META[t.status].card,
                      t.status === "blocked" && "border-l-4 border-l-amber-400",
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[13px] font-semibold leading-snug text-white/90">{t.name}</p>
                      <Pill className={cn("shrink-0", TASK_PRIORITY_META[t.priority].chip)}>
                        {TASK_PRIORITY_META[t.priority].label}
                      </Pill>
                    </div>
                    <p className="mt-1.5 flex flex-wrap items-center gap-x-2 font-mono text-[10px] text-white/35">
                      <span>{taskRef(t.id)} · {t.phaseName.toLowerCase()}</span>
                      <span>· {TASK_STATUS_META[t.status].label.toLowerCase()}</span>
                      {t.dueDate && (
                        <span className={cn("flex items-center gap-1", overdue && "text-amber-300")}>
                          <CalendarClock className="h-3 w-3" />
                          {new Date(t.dueDate).toLocaleDateString("es-CO", { day: "2-digit", month: "short" })}
                          {overdue ? " · vencida" : ""}
                        </span>
                      )}
                    </p>
                  </li>
                )
              })}
            </ul>
          </section>
        ))}
      </div>
    </PanelPage>
  )
}
