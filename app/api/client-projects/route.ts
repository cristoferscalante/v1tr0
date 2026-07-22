import { auth } from "@/auth"
import { db } from "@/lib/db"
import { projects, projectPhases, phaseTasks } from "@/lib/db/schema"
import { eq, asc } from "drizzle-orm"
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

  const enriched = await Promise.all(
    raw.map(async (p) => {
      const phases = await db
        .select()
        .from(projectPhases)
        .where(eq(projectPhases.projectId, p.id))
        .orderBy(asc(projectPhases.order))

      const phasesWithTasks = await Promise.all(
        phases.map(async (ph) => {
          const tasks = await db
            .select()
            .from(phaseTasks)
            .where(eq(phaseTasks.phaseId, ph.id))
          return { ...ph, tasks }
        })
      )

      const allTasks = phasesWithTasks.flatMap((ph) => ph.tasks)
      const completed = allTasks.filter((t) => t.completed).length
      const progress = allTasks.length > 0 ? Math.round((completed / allTasks.length) * 100) : 0

      const startDates = phasesWithTasks.map((ph) => ph.startDate).filter((d): d is Date => d !== null)
      const endDates = phasesWithTasks.map((ph) => ph.endDate).filter((d): d is Date => d !== null)
      const startDate: Date = startDates.length > 0 ? startDates.sort()[0]! : (p.createdAt ?? new Date())
      const endDate: Date = endDates.length > 0 ? endDates.sort().reverse()[0]! : new Date()

      return {
        id: p.id,
        name: p.name,
        description: p.description ?? "",
        status: p.status,
        images: p.images ?? [],
        progress,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        phases: phasesWithTasks,
      }
    })
  )

  return NextResponse.json(enriched)
}
