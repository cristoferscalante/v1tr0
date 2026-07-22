import { auth } from "@/auth"
import { db } from "@/lib/db"
import { projects, bugReports } from "@/lib/db/schema"
import { eq, and, asc } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const { id } = await params

  const project = await db
    .select({ id: projects.id })
    .from(projects)
    .where(and(eq(projects.id, id), eq(projects.clientId, session.user.id)))
    .then((r) => r[0] ?? null)

  if (!project) {
    return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 })
  }

  const bugs = await db
    .select()
    .from(bugReports)
    .where(eq(bugReports.projectId, id))
    .orderBy(asc(bugReports.createdAt))

  return NextResponse.json(bugs)
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const { id } = await params

  const project = await db
    .select({ id: projects.id })
    .from(projects)
    .where(and(eq(projects.id, id), eq(projects.clientId, session.user.id)))
    .then((r) => r[0] ?? null)

  if (!project) {
    return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 })
  }

  const body = await req.json()

  const [bug] = await db
    .insert(bugReports)
    .values({
      projectId: id,
      profileId: session.user.id,
      title: body.title,
      description: body.description,
      severity: body.severity ?? "medium",
    })
    .returning()

  return NextResponse.json(bug, { status: 201 })
}
