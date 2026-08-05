import { db } from "@/lib/db"
import { phaseTaskSubtasks } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { requireAdminSession, AdminAuthError } from "@/lib/auth/require-admin"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string; phaseId: string; taskId: string }> }
) {
  try {
    await requireAdminSession()
  } catch (e) {
    if (e instanceof AdminAuthError) {return e.response}
    throw e
  }

  const { taskId } = await params
  const body = await req.json()
  const { name } = body

  if (!name) {
    return NextResponse.json({ error: "Falta el nombre de la subtarea" }, { status: 400 })
  }

  const existing = await db
    .select({ order: phaseTaskSubtasks.order })
    .from(phaseTaskSubtasks)
    .where(eq(phaseTaskSubtasks.taskId, taskId))

  const nextOrder = existing.reduce((max, s) => Math.max(max, s.order), -1) + 1

  const created = await db
    .insert(phaseTaskSubtasks)
    .values({ taskId, name, order: nextOrder })
    .returning()
    .then((r) => r[0])

  return NextResponse.json(created, { status: 201 })
}
