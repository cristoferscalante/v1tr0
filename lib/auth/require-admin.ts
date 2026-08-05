import { auth } from "@/auth"
import { db } from "@/lib/db"
import { profiles } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export class AdminAuthError extends Error {
  constructor(public response: NextResponse) {
    super("AdminAuthError")
  }
}

/**
 * Valida que la sesión actual pertenezca a un usuario con role 'admin' o 'team'.
 * Lanza AdminAuthError (401/403) si no; las rutas deben capturarlo y devolver
 * error.response.
 */
export async function requireAdminSession() {
  const session = await auth()
  if (!session?.user?.id) {
    throw new AdminAuthError(NextResponse.json({ error: "No autorizado" }, { status: 401 }))
  }

  const profile = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, session.user.id))
    .then((r) => r[0] ?? null)

  if (!profile || !["admin", "team"].includes(profile.role)) {
    throw new AdminAuthError(NextResponse.json({ error: "Acceso denegado" }, { status: 403 }))
  }

  return { session, profile }
}
