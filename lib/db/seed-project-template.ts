import { db } from "@/lib/db"
import { projectPhases, phaseTasks } from "@/lib/db/schema"
import { PROJECT_TEMPLATES } from "@/lib/data/project-templates"
import type { ServiceType } from "@/components/shared/service-type"

/** Siembra fases+tareas de plantilla para un proyecto recién creado. */
export async function seedProjectTemplate(projectId: string, serviceType: ServiceType) {
  const template = PROJECT_TEMPLATES[serviceType] ?? PROJECT_TEMPLATES.other

  for (const phase of template) {
    const [createdPhase] = await db
      .insert(projectPhases)
      .values({
        projectId,
        name: phase.name,
        track: phase.track,
        order: phase.order,
        status: "pending",
      })
      .returning()

    if (!createdPhase) {continue}

    if (phase.tasks.length > 0) {
      await db.insert(phaseTasks).values(
        phase.tasks.map((t) => ({
          phaseId: createdPhase.id,
          name: t.name,
          icon: t.icon,
        })),
      )
    }
  }
}
