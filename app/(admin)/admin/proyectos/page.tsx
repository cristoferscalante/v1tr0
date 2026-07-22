import { auth } from "@/auth"
import { db } from "@/lib/db"
import { projects, projectPhases, phaseTasks, profiles } from "@/lib/db/schema"
import { eq, desc, asc } from "drizzle-orm"
import { redirect } from "next/navigation"
import { CheckCircle2, Circle, Clock } from "lucide-react"
import type { ReactNode } from "react"

const phaseColors: Record<string, string> = {
  pending: "border-gray-700 bg-gray-900/50",
  active: "border-[#26FFDF] bg-[#26FFDF]/5",
  completed: "border-green-500 bg-green-500/5",
  cancelled: "border-red-500 bg-red-500/5",
}

const phaseIcons: Record<string, ReactNode> = {
  pending: <Circle className="h-5 w-5 text-gray-500" />,
  active: <Clock className="h-5 w-5 text-[#26FFDF]" />,
  completed: <CheckCircle2 className="h-5 w-5 text-green-400" />,
  cancelled: <Circle className="h-5 w-5 text-red-400" />,
}

export default async function ProjectsPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const allProjects = await db
    .select({
      id: projects.id,
      name: projects.name,
      description: projects.description,
      status: projects.status,
      createdAt: projects.createdAt,
      clientEmail: profiles.email,
    })
    .from(projects)
    .leftJoin(profiles, eq(projects.clientId, profiles.id))
    .orderBy(desc(projects.createdAt))

  const projectsWithPhases = await Promise.all(
    allProjects.map(async (p) => {
      const phases = await db
        .select()
        .from(projectPhases)
        .where(eq(projectPhases.projectId, p.id))
        .orderBy(asc(projectPhases.order))

      const phasesWithTasks = await Promise.all(
        phases.map(async (ph) => {
          const tasks = await db
            .select()
            .from(phaseTasks)
            .where(eq(phaseTasks.phaseId, ph.id))
          return { ...ph, tasks }
        })
      )

      return { ...p, phases: phasesWithTasks }
    })
  )

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Proyectos</h1>
      <div className="grid gap-8">
        {projectsWithPhases.map((p) => (
          <div key={p.id} className="bg-black/40 backdrop-blur-sm border border-[#08A696]/20 rounded-xl p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white">{p.name}</h3>
                <p className="text-sm text-gray-400">{p.clientEmail}</p>
                {p.description && <p className="text-gray-300 text-sm mt-1">{p.description}</p>}
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                p.status === "active" ? "bg-green-500/20 text-green-400" :
                p.status === "completed" ? "bg-blue-500/20 text-blue-400" :
                "bg-yellow-500/20 text-yellow-400"
              }`}>{p.status}</span>
            </div>

            {/* Timeline */}
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-800" />
              <div className="space-y-6">
                {p.phases.map((ph, i) => (
                  <div key={ph.id} className="relative pl-10">
                    <div className="absolute left-2.5 top-1">
                      {phaseIcons[ph.status] ?? <Circle className="h-5 w-5 text-gray-500" />}
                    </div>
                    <div className={`p-4 rounded-xl border ${phaseColors[ph.status] ?? "border-gray-700 bg-gray-900/50"}`}>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-semibold">
                          {i + 1}. {ph.name}
                        </h4>
                        <span className="text-xs text-gray-400">
                          {ph.startDate ? ph.startDate.toLocaleDateString() : "—"}
                        </span>
                      </div>
                      {ph.description && <p className="text-gray-400 text-sm mb-2">{ph.description}</p>}
                      {ph.tasks.length > 0 && (
                        <div className="space-y-1 mt-2">
                          {ph.tasks.map((t) => (
                            <div key={t.id} className="flex items-center gap-2 text-sm">
                              <div className={`w-2 h-2 rounded-full ${t.completed ? "bg-green-400" : "bg-gray-600"}`} />
                              <span className={t.completed ? "text-green-400 line-through" : "text-gray-300"}>{t.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
        {projectsWithPhases.length === 0 && (
          <p className="text-center text-gray-500 py-12">No hay proyectos aún</p>
        )}
      </div>
    </div>
  )
}
