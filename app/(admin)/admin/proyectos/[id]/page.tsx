import { db } from "@/lib/db"
import { projects, projectPhases, phaseTasks, phaseTaskSubtasks, profiles } from "@/lib/db/schema"
import { eq, asc, inArray } from "drizzle-orm"
import { notFound } from "next/navigation"
import ProjectWorkspace from "@/components/tasks/ProjectWorkspace"
import type { BoardTask } from "@/components/tasks/types"
import type { TaskPriority, TaskStatus } from "@/components/shared/task-status"

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
      status: projects.status,
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

  // Una sola consulta agrupada para las tareas de todas las fases: antes se
  // lanzaba un SELECT por fase (Promise.all sobre `phases`), que en un
  // proyecto con 12 fases eran 12 viajes a la base por carga de página.
  const phaseIds = phases.map((ph) => ph.id)
  const allTasks = phaseIds.length
    ? await db
        .select()
        .from(phaseTasks)
        .where(inArray(phaseTasks.phaseId, phaseIds))
        .orderBy(asc(phaseTasks.order))
    : []

  const allTaskIds = allTasks.map((t) => t.id)
  const allSubtasks = allTaskIds.length
    ? await db
        .select()
        .from(phaseTaskSubtasks)
        .where(inArray(phaseTaskSubtasks.taskId, allTaskIds))
        .orderBy(asc(phaseTaskSubtasks.order))
    : []

  const subtasksByTask = new Map<string, typeof allSubtasks>()
  for (const s of allSubtasks) {
    const list = subtasksByTask.get(s.taskId) ?? []
    list.push(s)
    subtasksByTask.set(s.taskId, list)
  }

  const tasksByPhase = new Map<string, typeof allTasks>()
  for (const t of allTasks) {
    const list = tasksByPhase.get(t.phaseId) ?? []
    list.push(t)
    tasksByPhase.set(t.phaseId, list)
  }

  const phasesWithTasks = phases.map((ph) => ({
    ...ph,
    tasks: (tasksByPhase.get(ph.id) ?? []).map((t) => ({
      ...t,
      subtasks: subtasksByTask.get(t.id) ?? [],
    })),
  }))

  const completed = allTasks.filter((t) => t.completed).length
  const progress = allTasks.length > 0 ? Math.round((completed / allTasks.length) * 100) : 0

  // El tablero consume una forma plana y serializable; las fechas viajan como
  // ISO porque cruzan el límite servidor → cliente.
  const boardTasks: BoardTask[] = allTasks.map((t) => ({
    id: t.id,
    phaseId: t.phaseId,
    name: t.name,
    description: t.description,
    icon: t.icon,
    status: t.status as TaskStatus,
    priority: t.priority as TaskPriority,
    order: t.order,
    assignedTo: t.assignedTo,
    dueDate: t.dueDate ? t.dueDate.toISOString() : null,
  }))

  return (
    <ProjectWorkspace
      projectId={project.id}
      initialTasks={boardTasks}
      phases={phases.map((ph) => ({ id: ph.id, name: ph.name }))}
      treeProps={{
        projectId: project.id,
        projectName: project.name,
        phases: phasesWithTasks,
        progress,
        statusLabel: project.status ?? undefined,
        clientLabel: project.clientName ?? project.clientEmail ?? undefined,
        clientHref: project.clientId ? `/admin/clientes/${project.clientId}` : undefined,
      }}
    />
  )
}
