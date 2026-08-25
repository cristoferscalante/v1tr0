import { db } from "@/lib/db"
import { phaseTasks, projectPhases, projects } from "@/lib/db/schema"
import { and, asc, eq, ne } from "drizzle-orm"
import { NextResponse } from "next/server"
import { requireAdminSession, AdminAuthError } from "@/lib/auth/require-admin"

/**
 * Bandeja personal de quien está en sesión: todas sus tareas abiertas, de
 * todos los proyectos. Es la vista que faltaba para que `assignedTo` sirviera
 * de algo más que una etiqueta en una tarjeta.
 */
export async function GET() {
  let profileId: string
  try {
    const { profile } = await requireAdminSession()
    profileId = profile.id
  } catch (e) {
    if (e instanceof AdminAuthError) {return e.response}
    throw e
  }

  const rows = await db
    .select({
      id: phaseTasks.id,
      name: phaseTasks.name,
      status: phaseTasks.status,
      priority: phaseTasks.priority,
      dueDate: phaseTasks.dueDate,
      phaseId: phaseTasks.phaseId,
      phaseName: projectPhases.name,
      projectId: projects.id,
      projectName: projects.name,
    })
    .from(phaseTasks)
    .innerJoin(projectPhases, eq(phaseTasks.phaseId, projectPhases.id))
    .innerJoin(projects, eq(projectPhases.projectId, projects.id))
    // Se filtra en SQL, no después: una persona con años de tareas cerradas
    // no tiene por qué traerlas todas para descartarlas en memoria.
    .where(and(eq(phaseTasks.assignedTo, profileId), ne(phaseTasks.status, "done")))
    .orderBy(asc(phaseTasks.dueDate), asc(phaseTasks.priority))

  return NextResponse.json(rows)
}
