'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  Settings, 
  Share2, 
  Star, 
  Calendar,
  DollarSign,
  Users,
  Clock
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ProjectHeaderProps {
  projectId: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'in_progress' | 'review' | 'completed' | 'on_hold';
  progress: number;
  client: string;
  startDate: string;
  endDate: string;
  budget: number;
  teamSize: number;
  priority: 'low' | 'medium' | 'high';
  isFavorite: boolean;
}

export function ProjectHeader({ projectId }: ProjectHeaderProps) {
  const router = useRouter();
  
  // En un entorno real, estos datos vendrían de una API
  const [project] = useState<Project>({
    id: projectId,
    name: 'Desarrollo Web V1TR0',
    description: 'Plataforma web completa para V1TR0 con dashboard interactivo, gestión de proyectos y sistema de autenticación avanzado.',
    status: 'in_progress',
    progress: 45,
    client: 'V1TR0 Technologies',
    startDate: '2024-12-01',
    endDate: '2025-03-15',
    budget: 75000,
    teamSize: 8,
    priority: 'high',
    isFavorite: false
  });

  const [isFavorite, setIsFavorite] = useState(project.isFavorite);

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'planning': return 'bg-gray-500';
      case 'in_progress': return 'bg-blue-500';
      case 'review': return 'bg-yellow-500';
      case 'completed': return 'bg-green-500';
      case 'on_hold': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: Project['status']) => {
    switch (status) {
      case 'planning': return 'Planificación';
      case 'in_progress': return 'En Progreso';
      case 'review': return 'En Revisión';
      case 'completed': return 'Completado';
      case 'on_hold': return 'En Pausa';
      default: return 'Desconocido';
    }
  };

  const getPriorityColor = (priority: Project['priority']) => {
    switch (priority) {
      case 'low': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'high': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200';
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // En un entorno real, aquí haríamos una llamada a la API
  };

  const calculateDaysRemaining = () => {
    const endDate = new Date(project.endDate);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = calculateDaysRemaining();

  return (
    <div className="space-y-4">
      {/* Navegación */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <div className="flex-1" />
        <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4 mr-2" />
          Compartir
        </Button>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Configurar
        </Button>
      </div>

      {/* Header principal */}
      <Card className="bg-white/80 dark:bg-background/10 rounded-2xl">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <CardTitle className="text-2xl">{project.name}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleFavorite}
                  className="p-1"
                >
                  <Star 
                    className={`h-5 w-5 ${
                      isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'
                    }`} 
                  />
                </Button>
              </div>
              <p className="text-gray-600 mb-4">{project.description}</p>
              
              <div className="flex flex-wrap gap-2">
                <Badge className={getStatusColor(project.status)}>
                  {getStatusText(project.status)}
                </Badge>
                <Badge variant="outline" className={getPriorityColor(project.priority)}>
                  Prioridad {project.priority === 'high' ? 'Alta' : project.priority === 'medium' ? 'Media' : 'Baja'}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Métricas del proyecto */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-gray-50 dark:bg-background/20 rounded-lg">
              <Calendar className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <p className="text-sm text-gray-600">Días restantes</p>
              <p className="text-xl font-bold">
                {daysRemaining > 0 ? daysRemaining : 'Vencido'}
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-background/20 rounded-lg">
              <DollarSign className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <p className="text-sm text-gray-600">Presupuesto</p>
              <p className="text-xl font-bold">${project.budget.toLocaleString()}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-background/20 rounded-lg">
              <Users className="h-6 w-6 mx-auto mb-2 text-purple-600" />
              <p className="text-sm text-gray-600">Equipo</p>
              <p className="text-xl font-bold">{project.teamSize} miembros</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-background/20 rounded-lg">
              <Clock className="h-6 w-6 mx-auto mb-2 text-orange-600" />
              <p className="text-sm text-gray-600">Cliente</p>
              <p className="text-lg font-bold text-sm">{project.client}</p>
            </div>
          </div>

          {/* Progreso del proyecto */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Progreso del Proyecto</span>
              <span className="text-sm text-gray-600">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-2" />
          </div>

          {/* Fechas */}
          <div className="flex justify-between text-sm text-gray-600 mt-4">
            <span>Inicio: {new Date(project.startDate).toLocaleDateString()}</span>
            <span>Fin: {new Date(project.endDate).toLocaleDateString()}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}