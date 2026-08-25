import { db } from "@/lib/db"
import { profiles, taskComments } from "@/lib/db/schema"
import { and, asc, eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { resolveTaskAccess } from "@/lib/auth/task-access"
import { logActivity, notify, projectAudience } from "@/lib/activity"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const { taskId } = await params
  const access = await resolveTaskAccess(taskId)
  if (!access) {return NextResponse.json({ error: "No autorizado" }, { status: 403 })}

  const rows = await db
    .select({
      id: taskComments.id,
      body: taskComments.body,
      visibleToClient: taskComments.visibleToClient,
      createdAt: taskComments.createdAt,
      authorId: taskComments.authorId,
      authorName: profiles.name,
      authorEmail: profiles.email,
    })
    .from(taskComments)
    .innerJoin(profiles, eq(taskComments.authorId, profiles.id))
    .where(
      access.isStaff
        ? eq(taskComments.taskId, taskId)
        // El cliente nunca recibe las notas internas: se filtran en la
        // consulta, no en el render, para que no viajen al navegador.
        : and(eq(taskComments.taskId, taskId), eq(taskComments.visibleToClient, true)),
    )
    .orderBy(asc(taskComments.createdAt))

  return NextResponse.json(rows)
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const { taskId } = await params
  const access = await resolveTaskAccess(taskId)
  if (!access) {return NextResponse.json({ error: "No autorizado" }, { status: 403 })}

  const { body, visibleToClient } = await req.json()
  const text = typeof body === "string" ? body.trim() : ""
  if (!text) {return NextResponse.json({ error: "El comentario está vacío" }, { status: 400 })}
  if (text.length > 5000) {
    return NextResponse.json({ error: "El comentario es demasiado largo" }, { status: 400 })
  }

  // Un comentario del cliente siempre es público: marcarlo como interno lo
  // escondería de su propio autor.
  const internal = access.isStaff ? visibleToClient === false : false

  const created = await db
    .insert(taskComments)
    .values({ taskId, authorId: access.profile.id, body: text, visibleToClient: !internal })
    .returning()
    .then((r) => r[0]!)

  const authorName = access.profile.name ?? access.profile.email ?? "Alguien"

  await logActivity({
    projectId: access.projectId,
    actorId: access.profile.id,
    action: "task.commented",
    entityType: "task",
    entityId: taskId,
    summary: `${authorName} comentó en "${access.task.name}"`,
    visibleToClient: !internal,
  })

  await notify({
    profileIds: await projectAudience(access.projectId, {
      includeClient: !internal,
      exclude: access.profile.id,
    }),
    projectId: access.projectId,
    title: `Nuevo comentario en "${access.task.name}"`,
    body: text.slice(0, 140),
  })

  return NextResponse.json(created, { status: 201 })
}
