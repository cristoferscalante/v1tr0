'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Loader2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabaseProjectsDB, Project } from '@/lib/supabase-projects-db';

interface ProjectHeaderProps {
  projectId: string;
}

interface ProjectWithStats extends Project {
  totalTasks?: number;
  completedTasks?: number;
  inProgressTasks?: number;
  pendingTasks?: number;
}

export function ProjectHeader({ projectId }: ProjectHeaderProps) {
  const router = useRouter();
  const [project, setProject] = useState<ProjectWithStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectData = async () => {
      setLoading(true);
      const [projectData, stats] = await Promise.all([
        supabaseProjectsDB.getProjectById(projectId),
        supabaseProjectsDB.getProjectStats(projectId)
      ]);

      if (projectData) {
        setProject({
          ...projectData,
          ...stats
        });
      }
      setLoading(false);
    };

    fetchProjectData();
  }, [projectId]);

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'active': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'paused': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-700/50 text-slate-400 border-slate-600/30';
    }
  };

  const getStatusText = (status: Project['status']) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'completed': return 'Completado';
      case 'paused': return 'Pausado';
      case 'cancelled': return 'Cancelado';
      default: return 'Desconocido';
    }
  };

  const calculateProgress = () => {
    if (!project || !project.totalTasks) { return 0; }
    return Math.round((project.completedTasks || 0) / project.totalTasks * 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#26FFDF]" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Proyecto no encontrado</p>
      </div>
    );
  }

  const progress = calculateProgress();

  return (
    <div className="space-y-4">
      {/* Navegación */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="text-[#26FFDF] hover:bg-[#08A696]/20"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
      </div>

      {/* Header principal */}
      <Card className="bg-[#02505931] backdrop-blur-sm border-[#08A696]/20 rounded-2xl">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <CardTitle className="text-2xl text-white">{project.name}</CardTitle>
              </div>
              {project.description && (
                <p className="text-slate-400 mb-4">{project.description}</p>
              )}

              <div className="flex flex-wrap gap-2">
                <Badge className={`${getStatusColor(project.status)} border rounded-lg px-3 py-1`}>
                  {getStatusText(project.status)}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Métricas del proyecto */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-[#025059]/50 backdrop-blur-sm border border-[#08A696]/20 rounded-lg">
              <CheckCircle className="h-6 w-6 mx-auto mb-2 text-green-400" />
              <p className="text-sm text-slate-400">Completadas</p>
              <p className="text-xl font-bold text-white">{project.completedTasks || 0}</p>
            </div>
            <div className="text-center p-4 bg-[#025059]/50 backdrop-blur-sm border border-[#08A696]/20 rounded-lg">
              <Clock className="h-6 w-6 mx-auto mb-2 text-blue-400" />
              <p className="text-sm text-slate-400">En Progreso</p>
              <p className="text-xl font-bold text-white">{project.inProgressTasks || 0}</p>
            </div>
            <div className="text-center p-4 bg-[#025059]/50 backdrop-blur-sm border border-[#08A696]/20 rounded-lg">
              <Clock className="h-6 w-6 mx-auto mb-2 text-slate-400" />
              <p className="text-sm text-slate-400">Pendientes</p>
              <p className="text-xl font-bold text-white">{project.pendingTasks || 0}</p>
            </div>
          </div>

          {/* Progreso del proyecto */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#26FFDF]">Progreso del Proyecto</span>
              <span className="text-sm text-slate-400">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2 bg-slate-800">
              <div
                className="h-full bg-gradient-to-r from-[#08A696] to-[#26FFDF] rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </Progress>
          </div>

          {/* Fechas */}
          {project.created_at && (
            <div className="flex justify-between text-sm text-slate-500 mt-4">
              <span>Creado: {new Date(project.created_at).toLocaleDateString('es-ES')}</span>
              {project.updated_at && project.updated_at !== project.created_at && (
                <span>Actualizado: {new Date(project.updated_at).toLocaleDateString('es-ES')}</span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
