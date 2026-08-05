import { db } from "@/lib/db"
import { phaseTasks } from "@/lib/db/schema"
import { NextResponse } from "next/server"
import { requireAdminSession, AdminAuthError } from "@/lib/auth/require-admin"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string; phaseId: string }> }
) {
  try {
    await requireAdminSession()
  } catch (e) {
    if (e instanceof AdminAuthError) {return e.response}
    throw e
  }

  const { phaseId } = await params
  const body = await req.json()
  const { name, description, icon, assignedTo, dueDate } = body

  if (!name) {
    return NextResponse.json({ error: "Falta el nombre de la tarea" }, { status: 400 })
  }

  const created = await db
    .insert(phaseTasks)
    .values({
      phaseId,
      name,
      description: description ?? null,
      icon: icon ?? null,
      assignedTo: assignedTo || null,
      dueDate: dueDate ? new Date(dueDate) : null,
    })
    .returning()
    .then((r) => r[0])

  return NextResponse.json(created, { status: 201 })
}
