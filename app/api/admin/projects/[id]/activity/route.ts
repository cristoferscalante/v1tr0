import { db } from "@/lib/db"
import { activityLog, profiles } from "@/lib/db/schema"
import { desc, eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { requireAdminSession, AdminAuthError } from "@/lib/auth/require-admin"

export async function GET(
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
  // El feed es un panel lateral, no un archivo histórico: se acota para que
  // un proyecto de un año no traiga miles de filas a cada carga.
  const limit = Math.min(Number(new URL(req.url).searchParams.get("limit") ?? 50), 200)

  const rows = await db
    .select({
      id: activityLog.id,
      action: activityLog.action,
      summary: activityLog.summary,
      meta: activityLog.meta,
      entityType: activityLog.entityType,
      entityId: activityLog.entityId,
      createdAt: activityLog.createdAt,
      actorName: profiles.name,
      actorEmail: profiles.email,
    })
    .from(activityLog)
    .leftJoin(profiles, eq(activityLog.actorId, profiles.id))
    .where(eq(activityLog.projectId, projectId))
    .orderBy(desc(activityLog.createdAt))
    .limit(limit)

  return NextResponse.json(rows)
}
