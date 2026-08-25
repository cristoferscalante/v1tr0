import { db } from "@/lib/db"
import {
  activityLog,
  notifications,
  projects,
  projectMembers,
  type ActivityAction,
} from "@/lib/db/schema"
import { eq } from "drizzle-orm"

type LogInput = {
  projectId: string | null
  actorId: string | null
  action: ActivityAction
  entityType?: "task" | "phase" | "project" | "member"
  entityId?: string | null
  summary: string
  meta?: Record<string, unknown>
  /** El cliente dueño del proyecto verá esta entrada en su feed. */
  visibleToClient?: boolean
}

/**
 * Escribe una entrada en la bitácora. Nunca lanza: una falla al registrar
 * actividad no debe tumbar la mutación que la originó (mover una tarjeta del
 * kanban tiene que funcionar aunque el log falle).
 */
export async function logActivity(input: LogInput) {
  try {
    await db.insert(activityLog).values({
      projectId: input.projectId,
      actorId: input.actorId,
      action: input.action,
      entityType: input.entityType ?? null,
      entityId: input.entityId ?? null,
      summary: input.summary,
      meta: input.meta ?? {},
      visibleToClient: input.visibleToClient ?? false,
    })
  } catch (e) {
    console.error("[activity] no se pudo registrar la actividad:", e)
  }
}

type NotifyInput = {
  profileIds: string[]
  projectId?: string | null
  title: string
  body?: string | null
  href?: string | null
}

/** Igual que logActivity: best-effort, no interrumpe la mutación. */
export async function notify({ profileIds, projectId, title, body, href }: NotifyInput) {
  const targets = [...new Set(profileIds.filter(Boolean))]
  if (targets.length === 0) {return}

  try {
    await db.insert(notifications).values(
      targets.map((profileId) => ({
        profileId,
        projectId: projectId ?? null,
        title,
        body: body ?? null,
        href: href ?? null,
      })),
    )
  } catch (e) {
    console.error("[activity] no se pudieron crear notificaciones:", e)
  }
}

/**
 * Destinatarios naturales de un evento de proyecto: el equipo asignado más,
 * opcionalmente, el cliente dueño. `exclude` saca al autor de la acción para
 * que nadie se notifique a sí mismo.
 */
export async function projectAudience(
  projectId: string,
  { includeClient = false, exclude }: { includeClient?: boolean; exclude?: string | null } = {},
) {
  const [members, project] = await Promise.all([
    db.select({ profileId: projectMembers.profileId }).from(projectMembers).where(eq(projectMembers.projectId, projectId)),
    includeClient
      ? db.select({ clientId: projects.clientId }).from(projects).where(eq(projects.id, projectId)).then((r) => r[0] ?? null)
      : Promise.resolve(null),
  ])

  const ids = members.map((m) => m.profileId)
  if (project?.clientId) {ids.push(project.clientId)}
  return ids.filter((id) => id !== exclude)
}
