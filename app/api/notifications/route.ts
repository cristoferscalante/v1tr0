import { auth } from "@/auth"
import { db } from "@/lib/db"
import { notifications } from "@/lib/db/schema"
import { and, desc, eq, isNull, sql } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const url = new URL(req.url)
  const onlyUnread = url.searchParams.get("unread") === "1"
  const limit = Math.min(Number(url.searchParams.get("limit") ?? 20), 100)

  const where = onlyUnread
    ? and(eq(notifications.profileId, session.user.id), isNull(notifications.readAt))
    : eq(notifications.profileId, session.user.id)

  // El conteo va aparte de la lista: el badge cuenta todas las no leídas,
  // no solo las que caben en la página que se muestra.
  const [rows, unread] = await Promise.all([
    db.select().from(notifications).where(where).orderBy(desc(notifications.createdAt)).limit(limit),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(notifications)
      .where(and(eq(notifications.profileId, session.user.id), isNull(notifications.readAt)))
      .then((r) => r[0]?.count ?? 0),
  ])

  return NextResponse.json({ items: rows, unread })
}
