import { auth } from "@/auth"
import { db } from "@/lib/db"
import { notifications } from "@/lib/db/schema"
import { and, eq } from "drizzle-orm"
import { NextResponse } from "next/server"

/** Marca una notificación como leída. Solo su destinatario puede hacerlo. */
export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ notificationId: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const { notificationId } = await params
  const updated = await db
    .update(notifications)
    .set({ readAt: new Date() })
    .where(and(eq(notifications.id, notificationId), eq(notifications.profileId, session.user.id)))
    .returning()
    .then((r) => r[0] ?? null)

  if (!updated) {return NextResponse.json({ error: "No encontrada" }, { status: 404 })}
  return NextResponse.json(updated)
}
