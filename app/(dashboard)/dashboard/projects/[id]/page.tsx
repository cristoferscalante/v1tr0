import { notFound } from "next/navigation"
import Link from "next/link"
import { ProjectTasksWrapper } from "@/components/dashboard/project-tasks-wrapper"
import { BarChart3 } from "lucide-react"

interface ProjectPageProps {
  params: Promise<{ id: string }>
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id: projectId } = await params

  if (projectId === "invalid") {
    notFound()
  }

  return (
    <div className="flex-1 p-4 md:p-8 pt-6 min-h-screen">
      <div className="max-w-7xl mx-auto mb-4 flex justify-end">
        <Link
          href={`/dashboard/projects/${projectId}/reporte`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#08A696] to-[#26FFDF] text-black font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          <BarChart3 className="h-4 w-4" />
          Reporte del Proyecto
        </Link>
      </div>
      <ProjectTasksWrapper projectId={projectId} />
    </div>
  )
}
