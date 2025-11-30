'use client';

import { ProjectTasks } from './project-tasks';

interface ProjectTasksWrapperProps {
  projectId: string;
}

export function ProjectTasksWrapper({ projectId }: ProjectTasksWrapperProps) {
  return <ProjectTasks projectId={projectId} />;
}
