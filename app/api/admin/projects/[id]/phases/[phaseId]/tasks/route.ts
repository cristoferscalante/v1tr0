import { db } from "@/lib/db"
import { phaseTasks, projectPhases, TASK_PRIORITIES } from "@/lib/db/schema"
import { and, eq, max } from "drizzle-orm"
import { NextResponse } from "next/server"
import { requireAdminSession, AdminAuthError } from "@/lib/auth/require-admin"
import { logActivity, notify } from "@/lib/activity"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string; phaseId: string }> }
) {
  let actorId: string
  let actorName: string
  try {
    const { profile } = await requireAdminSession()
    actorId = profile.id
    actorName = profile.name ?? profile.email ?? "El equipo"
  } catch (e) {
    if (e instanceof AdminAuthError) {return e.response}
    throw e
  }

  const { id: projectId, phaseId } = await params
  const body = await req.json()
  const { name, description, icon, assignedTo, dueDate, priority, estimatedHours } = body

  if (!name) {
    return NextResponse.json({ error: "Falta el nombre de la tarea" }, { status: 400 })
  }
  if (priority && !TASK_PRIORITIES.includes(priority)) {
    return NextResponse.json({ error: "Prioridad inválida" }, { status: 400 })
  }

  // La fase tiene que pertenecer al proyecto de la URL: sin esta comprobación
  // un id de fase de otro proyecto colgaría tareas donde no corresponde.
  const phase = await db
    .select()
    .from(projectPhases)
    .where(and(eq(projectPhases.id, phaseId), eq(projectPhases.projectId, projectId)))
    .then((r) => r[0] ?? null)
  if (!phase) {
    return NextResponse.json({ error: "Fase no encontrada en este proyecto" }, { status: 404 })
  }

  // La tarea nueva va al final de su fase.
  const lastOrder = await db
    .select({ value: max(phaseTasks.order) })
    .from(phaseTasks)
    .where(eq(phaseTasks.phaseId, phaseId))
    .then((r) => r[0]?.value ?? -1)

  const created = await db
    .insert(phaseTasks)
    .values({
      phaseId,
      name,
      description: description ?? null,
      icon: icon ?? null,
      status: "todo",
      priority: priority ?? "medium",
      order: lastOrder + 1,
      estimatedHours:
        estimatedHours === null || estimatedHours === undefined ? null : String(estimatedHours),
      completed: false,
      assignedTo: assignedTo || null,
      dueDate: dueDate ? new Date(dueDate) : null,
    })
    .returning()
    .then((r) => r[0]!)

  await logActivity({
    projectId,
    actorId,
    action: "task.created",
    entityType: "task",
    entityId: created.id,
    summary: `${actorName} creó la tarea "${created.name}" en ${phase.name}`,
    visibleToClient: true,
  })

  if (created.assignedTo) {
    await notify({
      profileIds: [created.assignedTo],
      projectId,
      title: "Te asignaron una tarea",
      body: created.name,
      href: `/admin/proyectos/${projectId}`,
    })
  }

  return NextResponse.json(created, { status: 201 })
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string; phaseId: string }> }
) {
  try {
    await requireAdminSession()
  } catch (e) {
    if (e instanceof AdminAuthError) {return e.response}
    throw e
  }

  const { phaseId } = await params
  const rows = await db
    .select()
    .from(phaseTasks)
    .where(eq(phaseTasks.phaseId, phaseId))
    .orderBy(phaseTasks.order)

  return NextResponse.json(rows)
}
