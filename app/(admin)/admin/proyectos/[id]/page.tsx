import { db } from "@/lib/db"
import { projects, projectPhases, phaseTasks, phaseTaskSubtasks, profiles } from "@/lib/db/schema"
import { eq, asc, inArray } from "drizzle-orm"
import { notFound } from "next/navigation"
import AdminTaskTreeBoard from "@/components/admin/AdminTaskTreeBoard"

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

  // Solo el tablero: nombre, cliente, estado, progreso y gestión de fases
  // viven todos dentro del propio panel (ver AdminTaskTreeBoard).
  return (
    <AdminTaskTreeBoard
      projectId={project.id}
      projectName={project.name}
      phases={phasesWithTasks}
      progress={progress}
      statusLabel={project.status ?? undefined}
      clientLabel={project.clientName ?? project.clientEmail ?? undefined}
      clientHref={project.clientId ? `/admin/clientes/${project.clientId}` : undefined}
    />
  )
}
