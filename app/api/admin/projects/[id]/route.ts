import { auth } from "@/auth"
import { db } from "@/lib/db"
import { projects, projectPhases, phaseTasks, tasks, meetingRequests, projectSuggestions, bugReports, profiles } from "@/lib/db/schema"
import { eq, asc } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const profile = await db
    .select({ role: profiles.role })
    .from(profiles)
    .where(eq(profiles.id, session.user.id))
    .then((r) => r[0] ?? null)

  if (!profile || !['admin', 'team'].includes(profile.role)) {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 })
  }

  const { id } = await params

  const project = await db
    .select()
    .from(projects)
    .where(eq(projects.id, id))
    .then((r) => r[0] ?? null)

  if (!project) {
    return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 })
  }

  const clientProfile = await db
    .select({ name: profiles.name, email: profiles.email })
    .from(profiles)
    .where(eq(profiles.id, project.clientId ?? ''))
    .then((r) => r[0] ?? null)

  const phases = await db
    .select()
    .from(projectPhases)
    .where(eq(projectPhases.projectId, id))
    .orderBy(asc(projectPhases.order))

  const phasesWithTasks = await Promise.all(
    phases.map(async (ph) => {
      const pts = await db
        .select()
        .from(phaseTasks)
        .where(eq(phaseTasks.phaseId, ph.id))
      return { ...ph, tasks: pts }
    })
  )

  const allPhaseTasks = phasesWithTasks.flatMap((ph) => ph.tasks)
  const completed = allPhaseTasks.filter((t) => t.completed).length
  const progress = allPhaseTasks.length > 0 ? Math.round((completed / allPhaseTasks.length) * 100) : 0

  const projectTasks = await db
    .select()
    .from(tasks)
    .where(eq(tasks.projectId, id))

  const suggestions = await db
    .select()
    .from(projectSuggestions)
    .where(eq(projectSuggestions.projectId, id))
    .orderBy(asc(projectSuggestions.createdAt))

  const bugs = await db
    .select()
    .from(bugReports)
    .where(eq(bugReports.projectId, id))
    .orderBy(asc(bugReports.createdAt))

  const meetings = await db
    .select()
    .from(meetingRequests)
    .where(eq(meetingRequests.projectId, id))
    .orderBy(asc(meetingRequests.createdAt))

  return NextResponse.json({
    ...project,
    client: clientProfile,
    progress,
    phases: phasesWithTasks,
    tasks: projectTasks,
    suggestions,
    bugs,
    meetings,
  })
}
