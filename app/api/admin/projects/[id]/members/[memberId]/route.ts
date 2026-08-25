import { db } from "@/lib/db"
import { phaseTasks, profiles, projectMembers, projectPhases, PROJECT_MEMBER_ROLES } from "@/lib/db/schema"
import { and, eq, sql } from "drizzle-orm"
import { NextResponse } from "next/server"
import { requireAdminSession, AdminAuthError } from "@/lib/auth/require-admin"
import { logActivity } from "@/lib/activity"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string; memberId: string }> }
) {
  try {
    await requireAdminSession()
  } catch (e) {
    if (e instanceof AdminAuthError) {return e.response}
    throw e
  }

  const { id: projectId, memberId } = await params
  const { role } = await req.json()

  if (!PROJECT_MEMBER_ROLES.includes(role)) {
    return NextResponse.json({ error: "Rol inválido" }, { status: 400 })
  }

  const updated = await db
    .update(projectMembers)
    .set({ role })
    .where(and(eq(projectMembers.id, memberId), eq(projectMembers.projectId, projectId)))
    .returning()
    .then((r) => r[0] ?? null)

  if (!updated) {return NextResponse.json({ error: "Miembro no encontrado" }, { status: 404 })}
  return NextResponse.json(updated)
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string; memberId: string }> }
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

  const { id: projectId, memberId } = await params

  const member = await db
    .select({ m: projectMembers, p: profiles })
    .from(projectMembers)
    .innerJoin(profiles, eq(projectMembers.profileId, profiles.id))
    .where(and(eq(projectMembers.id, memberId), eq(projectMembers.projectId, projectId)))
    .then((r) => r[0] ?? null)

  if (!member) {return NextResponse.json({ error: "Miembro no encontrado" }, { status: 404 })}

  // Sacar a alguien del equipo sin soltar sus tareas las dejaba asignadas a
  // quien ya no puede verlas. Se liberan para que vuelvan a la bandeja común.
  const phaseIds = await db
    .select({ id: projectPhases.id })
    .from(projectPhases)
    .where(eq(projectPhases.projectId, projectId))
    .then((r) => r.map((x) => x.id))

  // Liberar tareas y quitar al miembro tienen que pasar juntos: si solo se
  // borra la fila, sus tareas quedan asignadas a alguien que ya no las ve.
  // El driver neon-http no soporta transacciones, así que van en una sola
  // sentencia con un CTE que modifica datos — atómica igual.
  if (phaseIds.length > 0) {
    // `ARRAY[...]` construido a mano: pasar el arreglo de JS como un solo
    // parámetro lo expande como `record` y Postgres no lo puede convertir a
    // uuid[].
    const idsFases = sql.join(
      phaseIds.map((id) => sql`${id}::uuid`),
      sql`, `,
    )
    await db.execute(sql`
      WITH liberadas AS (
        UPDATE ${phaseTasks}
           SET assigned_to = NULL, updated_at = now()
         WHERE assigned_to = ${member.m.profileId}
           AND phase_id = ANY(ARRAY[${idsFases}])
        RETURNING 1
      )
      DELETE FROM ${projectMembers} WHERE id = ${memberId}::uuid
    `)
  } else {
    await db.delete(projectMembers).where(eq(projectMembers.id, memberId))
  }

  await logActivity({
    projectId,
    actorId,
    action: "member.removed",
    entityType: "member",
    entityId: memberId,
    summary: `${actorName} quitó a ${member.p.name ?? member.p.email} del equipo`,
  })

  return NextResponse.json({ success: true })
}
