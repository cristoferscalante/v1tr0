import { db } from "@/lib/db"
import { profiles, projectMembers, PROJECT_MEMBER_ROLES } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { requireAdminSession, AdminAuthError } from "@/lib/auth/require-admin"
import { logActivity, notify } from "@/lib/activity"

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

  const { id: projectId } = await params
  const rows = await db
    .select({
      id: projectMembers.id,
      profileId: projectMembers.profileId,
      role: projectMembers.role,
      createdAt: projectMembers.createdAt,
      name: profiles.name,
      email: profiles.email,
    })
    .from(projectMembers)
    .innerJoin(profiles, eq(projectMembers.profileId, profiles.id))
    .where(eq(projectMembers.projectId, projectId))

  return NextResponse.json(rows)
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  let actorId: string
  let actorName: string
  try {
    const { profile } = await requireAdminSession()
    actorId = profile.id
    actorName = profile.name ?? profile.email ?? "El equipo"
  } catch (e) {
    if (e instanceof AdminAuthError) {return e.response}
    throw e
  }

  const { id: projectId } = await params
  const { profileId, role } = await req.json()

  if (!profileId) {
    return NextResponse.json({ error: "Falta el perfil" }, { status: 400 })
  }
  if (role && !PROJECT_MEMBER_ROLES.includes(role)) {
    return NextResponse.json({ error: "Rol inválido" }, { status: 400 })
  }

  // Solo personal interno entra al equipo de un proyecto; el cliente ya está
  // vinculado por projects.clientId y no debe aparecer como miembro.
  const target = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, profileId))
    .then((r) => r[0] ?? null)
  if (!target) {
    return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 })
  }
  if (!["admin", "team"].includes(target.role)) {
    return NextResponse.json({ error: "Solo admin o team pueden ser miembros" }, { status: 400 })
  }

  const created = await db
    .insert(projectMembers)
    .values({ projectId, profileId, role: role ?? "developer" })
    .onConflictDoNothing()
    .returning()
    .then((r) => r[0] ?? null)

  if (!created) {
    return NextResponse.json({ error: "Esa persona ya está en el proyecto" }, { status: 409 })
  }

  await logActivity({
    projectId,
    actorId,
    action: "member.added",
    entityType: "member",
    entityId: created.id,
    summary: `${actorName} agregó a ${target.name ?? target.email} al equipo`,
  })

  if (profileId !== actorId) {
    await notify({
      profileIds: [profileId],
      projectId,
      title: "Te sumaron a un proyecto",
      href: `/admin/proyectos/${projectId}`,
    })
  }

  return NextResponse.json(created, { status: 201 })
}
