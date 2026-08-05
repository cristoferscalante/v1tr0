import { db } from "@/lib/db"
import { projectPhases } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { requireAdminSession, AdminAuthError } from "@/lib/auth/require-admin"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminSession()
  } catch (e) {
    if (e instanceof AdminAuthError) {return e.response}
    throw e
  }

  const { id: projectId } = await params
  const body = await req.json()
  const { name, description, order, status, track, startDate, endDate } = body

  if (!name) {
    return NextResponse.json({ error: "Falta el nombre de la fase" }, { status: 400 })
  }

  const existing = await db
    .select({ order: projectPhases.order })
    .from(projectPhases)
    .where(eq(projectPhases.projectId, projectId))

  const nextOrder = order ?? existing.length

  const created = await db
    .insert(projectPhases)
    .values({
      projectId,
      name,
      description: description ?? null,
      order: nextOrder,
      status: status ?? "pending",
      track: track ?? "development",
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
    })
    .returning()
    .then((r) => r[0])

  return NextResponse.json(created, { status: 201 })
}
