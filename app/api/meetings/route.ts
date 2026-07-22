import { auth } from "@/auth"
import { db } from "@/lib/db"
import { meetingRequests, projects } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const body = await req.json()
  const { projectId, title, description, preferredDate } = body

  if (!projectId || !title) {
    return NextResponse.json({ error: "projectId y title son requeridos" }, { status: 400 })
  }

  const project = await db
    .select({ id: projects.id })
    .from(projects)
    .where(and(eq(projects.id, projectId), eq(projects.clientId, session.user.id)))
    .then((r) => r[0] ?? null)

  if (!project) {
    return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 })
  }

  const [meeting] = await db
    .insert(meetingRequests)
    .values({
      profileId: session.user.id,
      projectId,
      title,
      description,
      preferredDate: preferredDate ? new Date(preferredDate) : null,
      status: "pending",
    })
    .returning()

  return NextResponse.json(meeting, { status: 201 })
}
