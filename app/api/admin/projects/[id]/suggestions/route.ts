import { auth } from "@/auth"
import { db } from "@/lib/db"
import { projectSuggestions, profiles } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function PATCH(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const profile = await db
    .select({ role: profiles.role })
    .from(profiles)
    .where(eq(profiles.id, session.user.id))
    .then((r) => r[0] ?? null)

  if (!profile || !['admin', 'team'].includes(profile.role)) {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 })
  }

  const body = await req.json()
  const { id, status } = body

  if (!id || !status) {
    return NextResponse.json({ error: "id y status requeridos" }, { status: 400 })
  }

  const [updated] = await db
    .update(projectSuggestions)
    .set({ status, updatedAt: new Date() })
    .where(eq(projectSuggestions.id, id))
    .returning()

  return NextResponse.json(updated)
}
