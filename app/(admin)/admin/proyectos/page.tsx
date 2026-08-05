import { db } from "@/lib/db"
import { projects, projectPhases, phaseTasks, profiles } from "@/lib/db/schema"
import { eq, desc, inArray } from "drizzle-orm"
import KanbanBoard from "@/components/admin/KanbanBoard"
import ProjectEditDialog from "@/components/admin/ProjectEditDialog"
import { PanelPage, SectionHeading, EmptyState } from "@/components/shared/panel-ui"
import { FolderKanban } from "lucide-react"

export default async function ProjectsPage() {
  const allProjects = await db
    .select({
      id: projects.id,
      name: projects.name,
      status: projects.status,
      serviceType: projects.serviceType,
      icon: projects.icon,
      clientName: profiles.name,
      clientEmail: profiles.email,
    })
    .from(projects)
    .leftJoin(profiles, eq(projects.clientId, profiles.id))
    .orderBy(desc(projects.updatedAt))

  // 2 consultas agrupadas (fases de todos los proyectos, tareas de todas esas
  // fases) en vez de una por proyecto + una por fase — antes eran decenas de
  // idas a la base de datos con muchos proyectos, ahora son siempre 2.
  const projectIds = allProjects.map((p) => p.id)
  const phases = projectIds.length
    ? await db
        .select({ id: projectPhases.id, projectId: projectPhases.projectId })
        .from(projectPhases)
        .where(inArray(projectPhases.projectId, projectIds))
    : []
  const phaseIds = phases.map((ph) => ph.id)
  const tasks = phaseIds.length
    ? await db
        .select({ phaseId: phaseTasks.phaseId, completed: phaseTasks.completed })
        .from(phaseTasks)
        .where(inArray(phaseTasks.phaseId, phaseIds))
    : []

  const phaseToProject = new Map(phases.map((ph) => [ph.id, ph.projectId]))
  const statsByProject = new Map<string, { completed: number; total: number }>()
  for (const t of tasks) {
    const projectId = phaseToProject.get(t.phaseId)
    if (!projectId) {continue}
    const entry = statsByProject.get(projectId) ?? { completed: 0, total: 0 }
    entry.total += 1
    if (t.completed) {entry.completed += 1}
    statsByProject.set(projectId, entry)
  }

  const withProgress = allProjects.map((p) => {
    const stat = statsByProject.get(p.id)
    const progress = stat && stat.total > 0 ? Math.round((stat.completed / stat.total) * 100) : 0
    return { ...p, status: p.status ?? "planning", progress }
  })

  return (
    <PanelPage>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <SectionHeading
          badge="Seguimiento"
          title="Proyectos"
          subtitle="Arrastra las tarjetas entre columnas para cambiar la etapa del proyecto"
        />
        <ProjectEditDialog />
      </div>

      {withProgress.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          message="No hay proyectos aún"
          hint="Crea el primero con el botón «Nuevo proyecto»"
        />
      ) : (
        <KanbanBoard initialProjects={withProgress} />
      )}
    </PanelPage>
  )
}
