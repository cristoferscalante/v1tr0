import { db } from "@/lib/db"
import { projects, profiles } from "@/lib/db/schema"
import { desc, eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { requireAdminSession, AdminAuthError } from "@/lib/auth/require-admin"
import { seedProjectTemplate } from "@/lib/db/seed-project-template"
import type { ServiceType } from "@/components/shared/service-type"

export async function GET() {
  try {
    await requireAdminSession()
  } catch (e) {
    if (e instanceof AdminAuthError) {return e.response}
    throw e
  }

  const rows = await db
    .select({
      id: projects.id,
      name: projects.name,
      description: projects.description,
      status: projects.status,
      serviceType: projects.serviceType,
      clientId: projects.clientId,
      clientName: profiles.name,
      clientEmail: profiles.email,
      createdAt: projects.createdAt,
      updatedAt: projects.updatedAt,
    })
    .from(projects)
    .leftJoin(profiles, eq(projects.clientId, profiles.id))
    .orderBy(desc(projects.updatedAt))

  return NextResponse.json({ projects: rows })
}

export async function POST(req: Request) {
  try {
    await requireAdminSession()
  } catch (e) {
    if (e instanceof AdminAuthError) {return e.response}
    throw e
  }

  const body = await req.json()
  const { name, description, clientId, serviceType, status, images } = body

  if (!name || !clientId) {
    return NextResponse.json({ error: "Faltan campos requeridos (name, clientId)" }, { status: 400 })
  }

  const resolvedServiceType: ServiceType = serviceType ?? "other"

  const created = await db
    .insert(projects)
    .values({
      name,
      description: description ?? null,
      clientId,
      serviceType: resolvedServiceType,
      status: status ?? "planning",
      images: Array.isArray(images) ? images : [],
    })
    .returning()
    .then((r) => r[0])

  if (created) {
    await seedProjectTemplate(created.id, resolvedServiceType)
  }

  return NextResponse.json(created, { status: 201 })
}
