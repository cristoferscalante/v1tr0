import { auth } from "@/auth"
import { db } from "@/lib/db"
import { activityLog, projects } from "@/lib/db/schema"
import { and, desc, eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const { id: projectId } = await params

  // Mismo patrón que /api/projects/[id]/details: el proyecto tiene que ser
  // del cliente de la sesión.
  const owned = await db
    .select({ id: projects.id })
    .from(projects)
    .where(and(eq(projects.id, projectId), eq(projects.clientId, session.user.id)))
    .then((r) => r[0] ?? null)
  if (!owned) {
    return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 })
  }

  const limit = Math.min(Number(new URL(req.url).searchParams.get("limit") ?? 30), 100)

  // El cliente solo ve lo marcado como visible: las notas internas del equipo
  // (asignaciones, reordenamientos) quedan fuera.
  const rows = await db
    .select({
      id: activityLog.id,
      action: activityLog.action,
      summary: activityLog.summary,
      createdAt: activityLog.createdAt,
    })
    .from(activityLog)
    .where(and(eq(activityLog.projectId, projectId), eq(activityLog.visibleToClient, true)))
    .orderBy(desc(activityLog.createdAt))
    .limit(limit)

  return NextResponse.json(rows)
}
