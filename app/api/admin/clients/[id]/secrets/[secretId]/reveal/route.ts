import { db } from "@/lib/db"
import { clientSecrets } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { requireAdminSession, AdminAuthError } from "@/lib/auth/require-admin"
import { decryptSecret } from "@/lib/crypto/secrets"

// Único endpoint que descifra y devuelve el valor real de una clave — cada
// vez que se llama queda registrado quién y cuándo (lastRevealedAt/By), a
// modo de bitácora mínima de acceso a la bóveda.
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string; secretId: string }> }
) {
  let session
  try {
    session = (await requireAdminSession()).session
  } catch (e) {
    if (e instanceof AdminAuthError) {return e.response}
    throw e
  }

  const { secretId } = await params

  const secret = await db
    .select()
    .from(clientSecrets)
    .where(eq(clientSecrets.id, secretId))
    .then((r) => r[0] ?? null)

  if (!secret) {return NextResponse.json({ error: "Clave no encontrada" }, { status: 404 })}

  let value: string
  try {
    value = decryptSecret({ value: secret.value, iv: secret.iv, authTag: secret.authTag })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }

  await db
    .update(clientSecrets)
    .set({ lastRevealedAt: new Date(), lastRevealedBy: session.user.id })
    .where(eq(clientSecrets.id, secretId))

  return NextResponse.json({ value })
}
