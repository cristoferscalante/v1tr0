import { auth } from "@/auth"
import { db } from "@/lib/db"
import { projects, projectSuggestions } from "@/lib/db/schema"
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

  const suggestions = await db
    .select()
    .from(projectSuggestions)
    .where(eq(projectSuggestions.projectId, id))
    .orderBy(asc(projectSuggestions.createdAt))

  return NextResponse.json(suggestions)
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

  const [suggestion] = await db
    .insert(projectSuggestions)
    .values({
      projectId: id,
      profileId: session.user.id,
      title: body.title,
      description: body.description,
    })
    .returning()

  return NextResponse.json(suggestion, { status: 201 })
}
