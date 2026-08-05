import { db } from "@/lib/db"
import { projects, projectPhases, phaseTasks, meetingRequests, projectSuggestions, bugReports, profiles } from "@/lib/db/schema"
import { eq, asc, inArray } from "drizzle-orm"
import { NextResponse } from "next/server"
import { requireAdminSession, AdminAuthError } from "@/lib/auth/require-admin"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminSession()
  } catch (e) {
    if (e instanceof AdminAuthError) {return e.response}
    throw e
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

  // Independientes entre sí (solo dependen del proyecto ya resuelto): corren
  // en paralelo en vez de una tras otra.
  const [clientProfile, phases, suggestions, bugs, meetings] = await Promise.all([
    db.select({ name: profiles.name, email: profiles.email }).from(profiles).where(eq(profiles.id, project.clientId ?? '')).then((r) => r[0] ?? null),
    db.select().from(projectPhases).where(eq(projectPhases.projectId, id)).orderBy(asc(projectPhases.order)),
    db.select().from(projectSuggestions).where(eq(projectSuggestions.projectId, id)).orderBy(asc(projectSuggestions.createdAt)),
    db.select().from(bugReports).where(eq(bugReports.projectId, id)).orderBy(asc(bugReports.createdAt)),
    db.select().from(meetingRequests).where(eq(meetingRequests.projectId, id)).orderBy(asc(meetingRequests.createdAt)),
  ])

  // 1 consulta agrupada para las tareas de todas las fases, en vez de una por fase.
  const phaseIds = phases.map((ph) => ph.id)
  const allPhaseTasks = phaseIds.length
    ? await db.select().from(phaseTasks).where(inArray(phaseTasks.phaseId, phaseIds))
    : []
  const tasksByPhase = new Map<string, typeof allPhaseTasks>()
  for (const t of allPhaseTasks) {
    const list = tasksByPhase.get(t.phaseId) ?? []
    list.push(t)
    tasksByPhase.set(t.phaseId, list)
  }
  const phasesWithTasks = phases.map((ph) => ({ ...ph, tasks: tasksByPhase.get(ph.id) ?? [] }))

  const completed = allPhaseTasks.filter((t) => t.completed).length
  const progress = allPhaseTasks.length > 0 ? Math.round((completed / allPhaseTasks.length) * 100) : 0

  return NextResponse.json({
    ...project,
    client: clientProfile,
    progress,
    phases: phasesWithTasks,
    suggestions,
    bugs,
    meetings,
  })
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminSession()
  } catch (e) {
    if (e instanceof AdminAuthError) {return e.response}
    throw e
  }

  const { id } = await params
  const body = await req.json()

  const allowed = ["name", "description", "status", "clientId", "serviceType", "images"] as const
  const updates: Record<string, unknown> = {}
  for (const key of allowed) {
    if (key in body) {updates[key] = body[key]}
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Nada para actualizar" }, { status: 400 })
  }
  updates.updatedAt = new Date()

  const updated = await db
    .update(projects)
    .set(updates)
    .where(eq(projects.id, id))
    .returning()
    .then((r) => r[0] ?? null)

  if (!updated) {return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 })}
  return NextResponse.json(updated)
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminSession()
  } catch (e) {
    if (e instanceof AdminAuthError) {return e.response}
    throw e
  }

  const { id } = await params

  const deleted = await db
    .delete(projects)
    .where(eq(projects.id, id))
    .returning()
    .then((r) => r[0] ?? null)

  if (!deleted) {return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 })}
  return NextResponse.json({ success: true })
}
