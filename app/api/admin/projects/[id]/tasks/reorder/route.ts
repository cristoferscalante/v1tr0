import { db } from "@/lib/db"
import { phaseTasks, projectPhases, TASK_STATUSES, type TaskStatus } from "@/lib/db/schema"
import { and, eq, inArray } from "drizzle-orm"
import { NextResponse } from "next/server"
import { requireAdminSession, AdminAuthError } from "@/lib/auth/require-admin"
import { logActivity } from "@/lib/activity"

type Move = { taskId: string; phaseId: string; status: TaskStatus; order: number }

/**
 * Reordenamiento masivo del kanban. Arrastrar una tarjeta reacomoda a todas
 * sus vecinas, así que mandarlo como N PATCH sueltos deja el tablero en
 * estados intermedios visibles si alguno falla. Aquí llega el arreglo
 * completo y se aplica en una sola transacción.
 */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  let actorId: string
  try {
    const { profile } = await requireAdminSession()
    actorId = profile.id
  } catch (e) {
    if (e instanceof AdminAuthError) {return e.response}
    throw e
  }

  const { id: projectId } = await params
  const body = await req.json()
  const moves: Move[] = Array.isArray(body?.moves) ? body.moves : []

  if (moves.length === 0) {
    return NextResponse.json({ error: "No se recibió ningún movimiento" }, { status: 400 })
  }
  if (moves.some((m) => !m.taskId || !m.phaseId || !TASK_STATUSES.includes(m.status))) {
    return NextResponse.json({ error: "Movimiento inválido" }, { status: 400 })
  }

  // Todas las fases mencionadas tienen que ser de este proyecto, y todas las
  // tareas tienen que vivir hoy en fases de este proyecto.
  const phaseIds = [...new Set(moves.map((m) => m.phaseId))]
  const validPhases = await db
    .select({ id: projectPhases.id })
    .from(projectPhases)
    .where(and(eq(projectPhases.projectId, projectId), inArray(projectPhases.id, phaseIds)))
  if (validPhases.length !== phaseIds.length) {
    return NextResponse.json({ error: "Fase ajena al proyecto" }, { status: 403 })
  }

  const taskIds = moves.map((m) => m.taskId)
  const owned = await db
    .select({ id: phaseTasks.id })
    .from(phaseTasks)
    .innerJoin(projectPhases, eq(phaseTasks.phaseId, projectPhases.id))
    .where(and(eq(projectPhases.projectId, projectId), inArray(phaseTasks.id, taskIds)))
  if (owned.length !== new Set(taskIds).size) {
    return NextResponse.json({ error: "Tarea ajena al proyecto" }, { status: 403 })
  }

  await db.transaction(async (tx) => {
    for (const m of moves) {
      await tx
        .update(phaseTasks)
        .set({
          phaseId: m.phaseId,
          status: m.status,
          order: m.order,
          completed: m.status === "done",
          completedAt: m.status === "done" ? new Date() : null,
          updatedAt: new Date(),
        })
        .where(eq(phaseTasks.id, m.taskId))
    }
  })

  await logActivity({
    projectId,
    actorId,
    action: "task.status_changed",
    entityType: "project",
    entityId: projectId,
    summary: `Se reordenaron ${moves.length} tarea(s) en el tablero`,
    meta: { moves: moves.length },
  })

  return NextResponse.json({ success: true, updated: moves.length })
}
