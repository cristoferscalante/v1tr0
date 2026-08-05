import { db } from "@/lib/db"
import { phaseTaskSubtasks } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { requireAdminSession, AdminAuthError } from "@/lib/auth/require-admin"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string; phaseId: string; taskId: string; subtaskId: string }> }
) {
  try {
    await requireAdminSession()
  } catch (e) {
    if (e instanceof AdminAuthError) {return e.response}
    throw e
  }

  const { subtaskId } = await params
  const body = await req.json()

  const allowed = ["name", "completed", "order"] as const
  const updates: Record<string, unknown> = {}
  for (const key of allowed) {
    if (key in body) {updates[key] = body[key]}
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Nada para actualizar" }, { status: 400 })
  }

  const updated = await db
    .update(phaseTaskSubtasks)
    .set(updates)
    .where(eq(phaseTaskSubtasks.id, subtaskId))
    .returning()
    .then((r) => r[0] ?? null)

  if (!updated) {return NextResponse.json({ error: "Subtarea no encontrada" }, { status: 404 })}
  return NextResponse.json(updated)
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string; phaseId: string; taskId: string; subtaskId: string }> }
) {
  try {
    await requireAdminSession()
  } catch (e) {
    if (e instanceof AdminAuthError) {return e.response}
    throw e
  }

  const { subtaskId } = await params

  const deleted = await db
    .delete(phaseTaskSubtasks)
    .where(eq(phaseTaskSubtasks.id, subtaskId))
    .returning()
    .then((r) => r[0] ?? null)

  if (!deleted) {return NextResponse.json({ error: "Subtarea no encontrada" }, { status: 404 })}
  return NextResponse.json({ success: true })
}
