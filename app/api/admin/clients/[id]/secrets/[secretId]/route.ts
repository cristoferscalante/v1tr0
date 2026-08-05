import { db } from "@/lib/db"
import { clientSecrets } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { requireAdminSession, AdminAuthError } from "@/lib/auth/require-admin"

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string; secretId: string }> }
) {
  try {
    await requireAdminSession()
  } catch (e) {
    if (e instanceof AdminAuthError) {return e.response}
    throw e
  }

  const { secretId } = await params

  const deleted = await db
    .delete(clientSecrets)
    .where(eq(clientSecrets.id, secretId))
    .returning()
    .then((r) => r[0] ?? null)

  if (!deleted) {return NextResponse.json({ error: "Clave no encontrada" }, { status: 404 })}
  return NextResponse.json({ success: true })
}
