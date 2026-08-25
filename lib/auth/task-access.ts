import { auth } from "@/auth"
import { db } from "@/lib/db"
import { phaseTasks, profiles, projectPhases, projects } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export type TaskAccess = {
  profile: typeof profiles.$inferSelect
  task: typeof phaseTasks.$inferSelect
  projectId: string
  /** admin/team ven las notas internas; el cliente dueño solo las públicas. */
  isStaff: boolean
}

/**
 * Resuelve el acceso a una tarea para las rutas que comparten cliente y
 * equipo (comentarios). Devuelve null si no hay sesión, si la tarea no existe
 * o si quien pregunta no tiene nada que ver con el proyecto.
 */
export async function resolveTaskAccess(taskId: string): Promise<TaskAccess | null> {
  const session = await auth()
  if (!session?.user?.id) {return null}

  const profile = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, session.user.id))
    .then((r) => r[0] ?? null)
  if (!profile) {return null}

  const row = await db
    .select({ task: phaseTasks, projectId: projects.id, clientId: projects.clientId })
    .from(phaseTasks)
    .innerJoin(projectPhases, eq(phaseTasks.phaseId, projectPhases.id))
    .innerJoin(projects, eq(projectPhases.projectId, projects.id))
    .where(eq(phaseTasks.id, taskId))
    .then((r) => r[0] ?? null)
  if (!row) {return null}

  const isStaff = ["admin", "team"].includes(profile.role)
  if (!isStaff && row.clientId !== profile.id) {return null}

  return { profile, task: row.task, projectId: row.projectId, isStaff }
}
