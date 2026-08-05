import { db } from "@/lib/db"
import { projects, projectPhases, phaseTasks, phaseTaskSubtasks, profiles } from "@/lib/db/schema"
import { eq, asc, inArray } from "drizzle-orm"
import { notFound } from "next/navigation"
import Link from "next/link"
import { CheckCircle2, Circle, Clock } from "lucide-react"
import type { ReactNode } from "react"
import { AnimatedIcon } from "@/components/home/sections/AnimatedIcon"
import { resolveProjectIconMeta, projectCardTone, PROJECT_CARD_TONE_CLASSES } from "@/components/shared/service-type"
import ProjectTaskManager from "@/components/admin/ProjectTaskManager"

const TRACK_LABELS: Record<string, string> = {
  planning: "Planeación",
  development: "Desarrollo",
  quality: "Calidad",
}

const phaseColors: Record<string, string> = {
  pending: "border-gray-700 bg-gray-900/50",
  active: "border-[#26FFDF] bg-[#26FFDF]/5",
  in_progress: "border-[#26FFDF] bg-[#26FFDF]/5",
  completed: "border-green-500 bg-green-500/5",
  cancelled: "border-red-500 bg-red-500/5",
}

const phaseIcons: Record<string, ReactNode> = {
  pending: <Circle className="h-5 w-5 text-textSecondary/60" />,
  active: <Clock className="h-5 w-5 text-[#26FFDF]" />,
  in_progress: <Clock className="h-5 w-5 text-[#26FFDF]" />,
  completed: <CheckCircle2 className="h-5 w-5 text-green-400" />,
  cancelled: <Circle className="h-5 w-5 text-red-400" />,
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const project = await db
    .select({
      id: projects.id,
      name: projects.name,
      description: projects.description,
      status: projects.status,
      serviceType: projects.serviceType,
      icon: projects.icon,
      clientId: projects.clientId,
      clientName: profiles.name,
      clientEmail: profiles.email,
    })
    .from(projects)
    .leftJoin(profiles, eq(projects.clientId, profiles.id))
    .where(eq(projects.id, id))
    .then((r) => r[0] ?? null)

  if (!project) {notFound()}

  const phases = await db
    .select()
    .from(projectPhases)
    .where(eq(projectPhases.projectId, id))
    .orderBy(asc(projectPhases.order))

  const phasesWithTasksRaw = await Promise.all(
    phases.map(async (ph) => ({
      ...ph,
      tasks: await db.select().from(phaseTasks).where(eq(phaseTasks.phaseId, ph.id)),
    }))
  )

  const allTaskIds = phasesWithTasksRaw.flatMap((ph) => ph.tasks.map((t) => t.id))
  const allSubtasks = allTaskIds.length
    ? await db.select().from(phaseTaskSubtasks).where(inArray(phaseTaskSubtasks.taskId, allTaskIds)).orderBy(asc(phaseTaskSubtasks.order))
    : []
  const subtasksByTask = new Map<string, typeof allSubtasks>()
  for (const s of allSubtasks) {
    const list = subtasksByTask.get(s.taskId) ?? []
    list.push(s)
    subtasksByTask.set(s.taskId, list)
  }

  const phasesWithTasks = phasesWithTasksRaw.map((ph) => ({
    ...ph,
    tasks: ph.tasks.map((t) => ({ ...t, subtasks: subtasksByTask.get(t.id) ?? [] })),
  }))

  const allTasks = phasesWithTasks.flatMap((ph) => ph.tasks)
  const completed = allTasks.filter((t) => t.completed).length
  const progress = allTasks.length > 0 ? Math.round((completed / allTasks.length) * 100) : 0

  return (
    <div className="space-y-6">
      <Link href="/admin/proyectos" className="text-sm text-textSecondary hover:text-[#26FFDF] transition-colors">
        ← Volver a proyectos
      </Link>

      <div className={`bg-[#02505931] backdrop-blur-sm border rounded-2xl p-6 ${PROJECT_CARD_TONE_CLASSES[projectCardTone(project.status ?? "planning")]}`}>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">{project.name}</h1>
            {project.clientId && (
              <Link
                href={`/admin/clientes/${project.clientId}`}
                className="text-sm text-textSecondary hover:text-[#26FFDF] transition-colors"
              >
                {project.clientName ?? project.clientEmail}
              </Link>
            )}
            {project.description && <p className="text-textSecondary text-sm mt-2">{project.description}</p>}
          </div>
          <div className="flex flex-col items-start sm:items-end gap-2">
            <span className="px-3 py-1 rounded-full text-xs bg-[#08A696]/20 text-[#26FFDF]">{project.status}</span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-[#02505950] border border-[#08A696]/20 text-textSecondary">
              <AnimatedIcon
                kind={resolveProjectIconMeta(project).kind}
                icon={resolveProjectIconMeta(project).icon}
                active
                size={13}
              />
              {resolveProjectIconMeta(project).label}
            </span>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-textSecondary">Progreso general</span>
            <span className="text-white font-semibold">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#08A696] to-[#26FFDF] rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="bg-[#02505931] backdrop-blur-sm border border-[#08A696]/20 rounded-2xl p-6">
        <h2 className="text-white font-semibold mb-6">Fases</h2>
        {phasesWithTasks.length === 0 ? (
          <p className="text-textSecondary/60 text-sm text-center py-6">No hay fases definidas aún</p>
        ) : (
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-800" />
            <div className="space-y-6">
              {phasesWithTasks.map((ph, i) => (
                <div key={ph.id} className="relative pl-10">
                  <div className="absolute left-2.5 top-1">
                    {phaseIcons[ph.status] ?? <Circle className="h-5 w-5 text-textSecondary/60" />}
                  </div>
                  <div className={`p-4 rounded-xl border ${phaseColors[ph.status] ?? "border-gray-700 bg-gray-900/50"}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h4 className="text-white font-semibold">
                          {i + 1}. {ph.name}
                        </h4>
                        <span className="text-[10px] uppercase tracking-wider text-[#26FFDF]/70 bg-[#08A696]/10 border border-[#08A696]/20 rounded-full px-2 py-0.5">
                          {TRACK_LABELS[ph.track] ?? ph.track}
                        </span>
                      </div>
                      <span className="text-xs text-textSecondary">
                        {ph.startDate ? ph.startDate.toLocaleDateString() : "—"}
                      </span>
                    </div>
                    {ph.description && <p className="text-textSecondary text-sm mb-2">{ph.description}</p>}
                    <ProjectTaskManager projectId={project.id} phaseId={ph.id} tasks={ph.tasks} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
