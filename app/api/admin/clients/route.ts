import { db } from "@/lib/db"
import { profiles } from "@/lib/db/schema"
import { and, desc, eq, ilike, or } from "drizzle-orm"
import { NextResponse } from "next/server"
import { requireAdminSession, AdminAuthError } from "@/lib/auth/require-admin"

export async function GET(req: Request) {
  try {
    await requireAdminSession()
  } catch (e) {
    if (e instanceof AdminAuthError) {return e.response}
    throw e
  }

  const { searchParams } = new URL(req.url)
  const q = searchParams.get("q")?.trim()
  const status = searchParams.get("status")
  const role = searchParams.get("role") ?? "client"
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"))
  const pageSize = Math.min(100, Math.max(1, Number(searchParams.get("pageSize") ?? "25")))

  const conditions = [eq(profiles.role, role)]
  if (status) {conditions.push(eq(profiles.accountStatus, status))}
  if (q) {
    conditions.push(
      or(ilike(profiles.name, `%${q}%`), ilike(profiles.email, `%${q}%`))!
    )
  }

  const clients = await db
    .select()
    .from(profiles)
    .where(and(...conditions))
    .orderBy(desc(profiles.createdAt))
    .limit(pageSize)
    .offset((page - 1) * pageSize)

  return NextResponse.json({ clients, page, pageSize })
}
