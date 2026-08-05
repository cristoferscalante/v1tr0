import { auth } from "@/auth"
import { db } from "@/lib/db"
import { projects, projectPhases, phaseTasks, phaseTaskSubtasks, meetingRequests, projectSuggestions, bugReports } from "@/lib/db/schema"
import { eq, asc, and, inArray } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const { id } = await params

  const project = await db
    .select()
    .from(projects)
    .where(and(eq(projects.id, id), eq(projects.clientId, session.user.id)))
    .then((r) => r[0] ?? null)

  if (!project) {
    return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 })
  }

  // Las 4 consultas de abajo son independientes entre sí (solo dependen del
  // id del proyecto ya resuelto), así que corren en paralelo en vez de una
  // tras otra.
  const [phases, suggestions, bugs, meetings] = await Promise.all([
    db.select().from(projectPhases).where(eq(projectPhases.projectId, id)).orderBy(asc(projectPhases.order)),
    db.select().from(projectSuggestions).where(eq(projectSuggestions.projectId, id)).orderBy(asc(projectSuggestions.createdAt)),
    db.select().from(bugReports).where(eq(bugReports.projectId, id)).orderBy(asc(bugReports.createdAt)),
    db.select().from(meetingRequests).where(eq(meetingRequests.projectId, id)).orderBy(asc(meetingRequests.createdAt)),
  ])

  // 1 consulta agrupada para las tareas de todas las fases, en vez de una por fase.
  const phaseIds = phases.map((ph) => ph.id)
  const allTasks = phaseIds.length
    ? await db.select().from(phaseTasks).where(inArray(phaseTasks.phaseId, phaseIds))
    : []

  const taskIds = allTasks.map((t) => t.id)
  const allSubtasks = taskIds.length
    ? await db.select().from(phaseTaskSubtasks).where(inArray(phaseTaskSubtasks.taskId, taskIds)).orderBy(asc(phaseTaskSubtasks.order))
    : []
  const subtasksByTask = new Map<string, typeof allSubtasks>()
  for (const s of allSubtasks) {
    const list = subtasksByTask.get(s.taskId) ?? []
    list.push(s)
    subtasksByTask.set(s.taskId, list)
  }
  const tasksWithSubtasks = allTasks.map((t) => ({ ...t, subtasks: subtasksByTask.get(t.id) ?? [] }))

  const tasksByPhase = new Map<string, typeof tasksWithSubtasks>()
  for (const t of tasksWithSubtasks) {
    const list = tasksByPhase.get(t.phaseId) ?? []
    list.push(t)
    tasksByPhase.set(t.phaseId, list)
  }
  const phasesWithTasks = phases.map((ph) => ({ ...ph, tasks: tasksByPhase.get(ph.id) ?? [] }))

  const completed = allTasks.filter((t) => t.completed).length
  const progress = allTasks.length > 0 ? Math.round((completed / allTasks.length) * 100) : 0

  return NextResponse.json({
    ...project,
    progress,
    phases: phasesWithTasks,
    suggestions,
    bugs,
    meetings,
  })
}
