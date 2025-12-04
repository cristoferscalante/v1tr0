import { notFound } from "next/navigation"
import { ProjectTasksWrapper } from "@/components/dashboard/project-tasks-wrapper"

interface ProjectPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id: projectId } = await params

  if (projectId === "invalid") {
    notFound()
  }

  return (
    <div className="flex-1 p-4 md:p-8 pt-6 min-h-screen">
      <ProjectTasksWrapper projectId={projectId} />
    </div>
  )

}

