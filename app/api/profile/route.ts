import { auth } from "@/auth"
import { db } from "@/lib/db"
import { profiles } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function PATCH(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const { name, phone } = await req.json()

  await db
    .update(profiles)
    .set({
      ...(name !== undefined && { name }),
      ...(phone !== undefined && { phone }),
      updatedAt: new Date(),
    })
    .where(eq(profiles.id, session.user.id))

  return NextResponse.json({ success: true })
}
