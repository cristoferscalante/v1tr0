import { db } from "@/lib/db"
import {
  phaseTasks,
  projectPhases,
  TASK_PRIORITIES,
  TASK_STATUSES,
  type TaskStatus,
} from "@/lib/db/schema"
import { and, eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { requireAdminSession, AdminAuthError } from "@/lib/auth/require-admin"
import { logActivity, notify, projectAudience } from "@/lib/activity"

const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "Por hacer",
  in_progress: "En progreso",
  blocked: "Bloqueada",
  done: "Terminada",
}

/**
 * Carga la tarea comprobando de paso que su fase pertenece al proyecto de la
 * URL. Sin este join, un taskId de otro proyecto se editaba igual.
 */
async function loadScopedTask(projectId: string, phaseId: string, taskId: string) {
  return db
    .select({ task: phaseTasks, phase: projectPhases })
    .from(phaseTasks)
    .innerJoin(projectPhases, eq(phaseTasks.phaseId, projectPhases.id))
    .where(
      and(
        eq(phaseTasks.id, taskId),
        eq(phaseTasks.phaseId, phaseId),
        eq(projectPhases.projectId, projectId),
      ),
    )
    .then((r) => r[0] ?? null)
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string; phaseId: string; taskId: string }> }
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

  const { id: projectId, phaseId, taskId } = await params
  const body = await req.json()

  const found = await loadScopedTask(projectId, phaseId, taskId)
  if (!found) {return NextResponse.json({ error: "Tarea no encontrada" }, { status: 404 })}
  const { task: before, phase } = found

  const updates: Record<string, unknown> = {}

  for (const key of ["name", "description", "icon"] as const) {
    if (key in body) {updates[key] = body[key]}
  }
  if ("dueDate" in body) {updates.dueDate = body.dueDate ? new Date(body.dueDate) : null}
  if ("assignedTo" in body) {updates.assignedTo = body.assignedTo || null}
  if ("order" in body) {updates.order = Number(body.order) || 0}
  if ("estimatedHours" in body) {
    updates.estimatedHours =
      body.estimatedHours === null || body.estimatedHours === undefined
        ? null
        : String(body.estimatedHours)
  }

  if ("priority" in body) {
    if (!TASK_PRIORITIES.includes(body.priority)) {
      return NextResponse.json({ error: "Prioridad inválida" }, { status: 400 })
    }
    updates.priority = body.priority
  }

  // `status` es la fuente de verdad y `completed` su espejo. Se aceptan ambas
  // entradas porque el árbol del cliente todavía manda el booleano; se
  // normalizan aquí para que nunca queden en desacuerdo en la base.
  let nextStatus: TaskStatus | null = null
  if ("status" in body) {
    if (!TASK_STATUSES.includes(body.status)) {
      return NextResponse.json({ error: "Estado inválido" }, { status: 400 })
    }
    nextStatus = body.status
  } else if ("completed" in body) {
    nextStatus = body.completed ? "done" : "todo"
  }

  if (nextStatus) {
    updates.status = nextStatus
    updates.completed = nextStatus === "done"
    updates.completedAt = nextStatus === "done" ? (before.completedAt ?? new Date()) : null
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Nada para actualizar" }, { status: 400 })
  }
  updates.updatedAt = new Date()

  const updated = await db
    .update(phaseTasks)
    .set(updates)
    .where(eq(phaseTasks.id, taskId))
    .returning()
    .then((r) => r[0]!)

  // --- Bitácora y avisos -------------------------------------------------
  if (nextStatus && nextStatus !== before.status) {
    await logActivity({
      projectId,
      actorId,
      action: "task.status_changed",
      entityType: "task",
      entityId: taskId,
      summary: `${actorName} movió "${updated.name}" a ${STATUS_LABELS[nextStatus]}`,
      meta: { from: before.status, to: nextStatus, phase: phase.name },
      visibleToClient: true,
    })

    if (nextStatus === "blocked" || nextStatus === "done") {
      const audience = await projectAudience(projectId, { includeClient: nextStatus === "done", exclude: actorId })
      await notify({
        profileIds: audience,
        projectId,
        title: nextStatus === "blocked" ? "Una tarea quedó bloqueada" : "Tarea terminada",
        body: updated.name,
        href: `/admin/proyectos/${projectId}`,
      })
    }
  }

  if ("assignedTo" in body && updated.assignedTo !== before.assignedTo) {
    await logActivity({
      projectId,
      actorId,
      action: "task.assigned",
      entityType: "task",
      entityId: taskId,
      summary: updated.assignedTo
        ? `${actorName} asignó "${updated.name}"`
        : `${actorName} quitó el responsable de "${updated.name}"`,
      meta: { from: before.assignedTo, to: updated.assignedTo },
    })

    if (updated.assignedTo && updated.assignedTo !== actorId) {
      await notify({
        profileIds: [updated.assignedTo],
        projectId,
        title: "Te asignaron una tarea",
        body: updated.name,
        href: `/admin/proyectos/${projectId}`,
      })
    }
  }

  return NextResponse.json(updated)
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string; phaseId: string; taskId: string }> }
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

  const { id: projectId, phaseId, taskId } = await params

  const found = await loadScopedTask(projectId, phaseId, taskId)
  if (!found) {return NextResponse.json({ error: "Tarea no encontrada" }, { status: 404 })}

  await db.delete(phaseTasks).where(eq(phaseTasks.id, taskId))

  await logActivity({
    projectId,
    actorId,
    action: "task.deleted",
    entityType: "task",
    entityId: taskId,
    summary: `${actorName} eliminó la tarea "${found.task.name}"`,
  })

  return NextResponse.json({ success: true })
}
