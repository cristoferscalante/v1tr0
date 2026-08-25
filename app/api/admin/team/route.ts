import { db } from "@/lib/db"
import { profiles } from "@/lib/db/schema"
import { asc, inArray } from "drizzle-orm"
import { NextResponse } from "next/server"
import { requireAdminSession, AdminAuthError } from "@/lib/auth/require-admin"

/** Padrón de personal interno: alimenta los selectores de responsable y de
 *  miembros de proyecto. Nunca devuelve clientes. */
export async function GET() {
  try {
    await requireAdminSession()
  } catch (e) {
    if (e instanceof AdminAuthError) {return e.response}
    throw e
  }

  const rows = await db
    .select({
      id: profiles.id,
      name: profiles.name,
      email: profiles.email,
      role: profiles.role,
      accountStatus: profiles.accountStatus,
    })
    .from(profiles)
    .where(inArray(profiles.role, ["admin", "team"]))
    .orderBy(asc(profiles.name))

  return NextResponse.json(rows)
}
