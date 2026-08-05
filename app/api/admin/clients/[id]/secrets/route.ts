import { db } from "@/lib/db"
import { clientSecrets } from "@/lib/db/schema"
import { desc, eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { requireAdminSession, AdminAuthError } from "@/lib/auth/require-admin"
import { encryptSecret } from "@/lib/crypto/secrets"

// Lista de claves: NUNCA devuelve el valor descifrado, solo metadatos.
// Para leer el valor real hay que llamar explícitamente al endpoint /reveal.
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminSession()
  } catch (e) {
    if (e instanceof AdminAuthError) {return e.response}
    throw e
  }

  const { id } = await params

  const rows = await db
    .select({
      id: clientSecrets.id,
      label: clientSecrets.label,
      notes: clientSecrets.notes,
      projectId: clientSecrets.projectId,
      lastRevealedAt: clientSecrets.lastRevealedAt,
      createdAt: clientSecrets.createdAt,
    })
    .from(clientSecrets)
    .where(eq(clientSecrets.clientId, id))
    .orderBy(desc(clientSecrets.createdAt))

  return NextResponse.json({ secrets: rows })
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  let session
  try {
    session = (await requireAdminSession()).session
  } catch (e) {
    if (e instanceof AdminAuthError) {return e.response}
    throw e
  }

  const { id } = await params
  const body = await req.json()
  const { label, value, notes, projectId } = body

  if (!label || !value) {
    return NextResponse.json({ error: "Faltan campos requeridos (label, value)" }, { status: 400 })
  }

  let encrypted
  try {
    encrypted = encryptSecret(value)
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }

  const created = await db
    .insert(clientSecrets)
    .values({
      clientId: id,
      projectId: projectId || null,
      label,
      value: encrypted.value,
      iv: encrypted.iv,
      authTag: encrypted.authTag,
      notes: notes || null,
      createdBy: session.user.id,
    })
    .returning({
      id: clientSecrets.id,
      label: clientSecrets.label,
      notes: clientSecrets.notes,
      projectId: clientSecrets.projectId,
      lastRevealedAt: clientSecrets.lastRevealedAt,
      createdAt: clientSecrets.createdAt,
    })
    .then((r) => r[0])

  return NextResponse.json(created, { status: 201 })
}
