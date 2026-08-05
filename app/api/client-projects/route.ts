import { auth } from "@/auth"
import { db } from "@/lib/db"
import { projects, projectPhases, phaseTasks } from "@/lib/db/schema"
import { eq, asc, inArray } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const userId = session.user.id

  const raw = await db
    .select()
    .from(projects)
    .where(eq(projects.clientId, userId))
    .orderBy(asc(projects.createdAt))

  // 2 consultas agrupadas (fases de todos los proyectos del cliente, tareas
  // de todas esas fases) en vez de una por proyecto + una por fase.
  const projectIds = raw.map((p) => p.id)
  const allPhases = projectIds.length
    ? await db
        .select()
        .from(projectPhases)
        .where(inArray(projectPhases.projectId, projectIds))
        .orderBy(asc(projectPhases.order))
    : []
  const phaseIds = allPhases.map((ph) => ph.id)
  const allTasks = phaseIds.length
    ? await db.select().from(phaseTasks).where(inArray(phaseTasks.phaseId, phaseIds))
    : []

  const tasksByPhase = new Map<string, typeof allTasks>()
  for (const t of allTasks) {
    const list = tasksByPhase.get(t.phaseId) ?? []
    list.push(t)
    tasksByPhase.set(t.phaseId, list)
  }

  const phasesByProject = new Map<string, (typeof allPhases[number] & { tasks: typeof allTasks })[]>()
  for (const ph of allPhases) {
    const list = phasesByProject.get(ph.projectId) ?? []
    list.push({ ...ph, tasks: tasksByPhase.get(ph.id) ?? [] })
    phasesByProject.set(ph.projectId, list)
  }

  const enriched = raw.map((p) => {
    const phasesWithTasks = phasesByProject.get(p.id) ?? []

    const projectTasks = phasesWithTasks.flatMap((ph) => ph.tasks)
    const completed = projectTasks.filter((t) => t.completed).length
    const progress = projectTasks.length > 0 ? Math.round((completed / projectTasks.length) * 100) : 0

    const startDates = phasesWithTasks.map((ph) => ph.startDate).filter((d): d is Date => d !== null)
    const endDates = phasesWithTasks.map((ph) => ph.endDate).filter((d): d is Date => d !== null)
    const startDate: Date = startDates.length > 0 ? startDates.sort()[0]! : (p.createdAt ?? new Date())
    const endDate: Date = endDates.length > 0 ? endDates.sort().reverse()[0]! : new Date()

    return {
      id: p.id,
      name: p.name,
      description: p.description ?? "",
      status: p.status,
      serviceType: p.serviceType,
      icon: p.icon,
      images: p.images ?? [],
      progress,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      phases: phasesWithTasks,
    }
  })

  return NextResponse.json(enriched)
}
