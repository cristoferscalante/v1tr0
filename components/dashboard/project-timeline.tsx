'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  Circle, 
  Clock, 
  AlertCircle,
  Calendar,
  User,
  Plus
} from 'lucide-react';

interface TimelineItem {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in_progress' | 'pending' | 'overdue';
  startDate: string;
  endDate: string;
  assignee: string;
  progress: number;
  dependencies?: string[];
}

interface ProjectTimelineProps {
  projectId?: string;
}

export function ProjectTimeline({}: ProjectTimelineProps) {
  // En un entorno real, estos datos vendrían de una API
  const [timelineItems] = useState<TimelineItem[]>([
    {
      id: '1',
      title: 'Análisis y Planificación',
      description: 'Definición de requisitos, análisis de mercado y planificación del proyecto',
      status: 'completed',
      startDate: '2024-01-15',
      endDate: '2024-02-01',
      assignee: 'Ana García',
      progress: 100
    },
    {
      id: '2',
      title: 'Diseño de UI/UX',
      description: 'Creación de wireframes, mockups y prototipo interactivo',
      status: 'completed',
      startDate: '2024-02-01',
      endDate: '2024-02-20',
      assignee: 'Carlos López',
      progress: 100
    },
    {
      id: '3',
      title: 'Desarrollo del Backend',
      description: 'API REST, base de datos y lógica de negocio',
      status: 'in_progress',
      startDate: '2024-02-15',
      endDate: '2024-04-15',
      assignee: 'María Rodríguez',
      progress: 75
    },
    {
      id: '4',
      title: 'Desarrollo del Frontend',
      description: 'Interfaz de usuario, integración con API y responsive design',
      status: 'in_progress',
      startDate: '2024-03-01',
      endDate: '2024-05-01',
      assignee: 'Juan Pérez',
      progress: 60,
      dependencies: ['2']
    },
    {
      id: '5',
      title: 'Integración de Pagos',
      description: 'Implementación de pasarelas de pago y procesamiento de transacciones',
      status: 'pending',
      startDate: '2024-04-01',
      endDate: '2024-04-20',
      assignee: 'Luis Martín',
      progress: 0,
      dependencies: ['3']
    },
    {
      id: '6',
      title: 'Pruebas y QA',
      description: 'Testing funcional, pruebas de rendimiento y corrección de bugs',
      status: 'pending',
      startDate: '2024-05-01',
      endDate: '2024-05-20',
      assignee: 'Elena Sánchez',
      progress: 0,
      dependencies: ['4', '5']
    },
    {
      id: '7',
      title: 'Despliegue y Lanzamiento',
      description: 'Configuración de servidores, despliegue y puesta en producción',
      status: 'pending',
      startDate: '2024-05-20',
      endDate: '2024-06-01',
      assignee: 'Roberto Silva',
      progress: 0,
      dependencies: ['6']
    }
  ]);

  const getStatusIcon = (status: TimelineItem['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'overdue':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: TimelineItem['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'in_progress': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case 'overdue': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200';
    }
  };

  const getStatusText = (status: TimelineItem['status']) => {
    switch (status) {
      case 'completed': return 'Completado';
      case 'in_progress': return 'En Progreso';
      case 'overdue': return 'Atrasado';
      default: return 'Pendiente';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Card className="h-full bg-white/80 dark:bg-background/10 rounded-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Línea de Tiempo del Proyecto</CardTitle>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Agregar Fase
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {timelineItems.map((item, index) => (
            <div key={item.id} className="relative">
              {/* Línea conectora */}
              {index < timelineItems.length - 1 && (
                <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200" />
              )}
              
              <div className="flex gap-4">
                {/* Icono de estado */}
                <div className="flex-shrink-0 mt-1">
                  {getStatusIcon(item.status)}
                </div>
                
                {/* Contenido */}
                <div className="flex-1 min-w-0">
                  <Card className="p-4 bg-white/80 dark:bg-background/10 rounded-2xl">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{item.title}</h3>
                        <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                      </div>
                      <Badge className={getStatusColor(item.status)}>
                        {getStatusText(item.status)}
                      </Badge>
                    </div>
                    
                    {/* Progreso */}
                    {item.status === 'in_progress' && (
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">Progreso</span>
                          <span className="text-sm text-gray-600">{item.progress}%</span>
                        </div>
                        <Progress value={item.progress} className="h-2" />
                      </div>
                    )}
                    
                    {/* Información adicional */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">
                          {formatDate(item.startDate)} - {formatDate(item.endDate)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">{item.assignee}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">
                          {calculateDuration(item.startDate, item.endDate)} días
                        </span>
                      </div>
                    </div>
                    
                    {/* Dependencias */}
                    {item.dependencies && item.dependencies.length > 0 && (
                      <div className="mt-3 pt-3 border-t">
                        <span className="text-sm text-gray-600">Depende de: </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.dependencies.map((depId) => {
                            const depItem = timelineItems.find(t => t.id === depId);
                            return depItem ? (
                              <Badge key={depId} variant="outline" className="text-xs">
                                {depItem.title}
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}
                  </Card>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Resumen del progreso */}
        <div className="mt-8 p-4 bg-gray-50 dark:bg-background/20 rounded-lg">
          <h4 className="font-semibold mb-3">Resumen del Progreso</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-600">
                {timelineItems.filter(item => item.status === 'completed').length}
              </p>
              <p className="text-sm text-gray-600">Completadas</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {timelineItems.filter(item => item.status === 'in_progress').length}
              </p>
              <p className="text-sm text-gray-600">En Progreso</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-600">
                {timelineItems.filter(item => item.status === 'pending').length}
              </p>
              <p className="text-sm text-gray-600">Pendientes</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">
                {timelineItems.filter(item => item.status === 'overdue').length}
              </p>
              <p className="text-sm text-gray-600">Atrasadas</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}