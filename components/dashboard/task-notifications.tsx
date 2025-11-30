'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, FolderOpen, Clock, AlertCircle, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabaseProjectsDB, MeetingTask, Project } from '@/lib/supabase-projects-db';

interface TaskNotificationsProps {
  onTaskAssigned?: () => void;
}

export function TaskNotifications({ onTaskAssigned }: TaskNotificationsProps) {
  const [unassignedTasks, setUnassignedTasks] = useState<MeetingTask[]>([]);
  const [activeProjects, setActiveProjects] = useState<Project[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    const [tasks, projects] = await Promise.all([
      supabaseProjectsDB.getUnassignedMeetingTasks(),
      supabaseProjectsDB.getActiveProjects()
    ]);
    setUnassignedTasks(tasks);
    setActiveProjects(projects);
  }, []);

  useEffect(() => {
    fetchData();

    // Suscribirse a cambios en tiempo real
    const subscription = supabaseProjectsDB.subscribeToMeetingTasks(() => {
      fetchData();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchData]);

  const handleAssignTask = async (taskId: string) => {
    const projectId = selectedProject[taskId];
    if (!projectId) {
      return;
    }

    setLoading(true);
    const result = await supabaseProjectsDB.assignMeetingTaskToProject(taskId, projectId);
    
    if (result) {
      setUnassignedTasks(prev => prev.filter(t => t.id !== taskId));
      setSelectedProject(prev => {
        const newState = { ...prev };
        delete newState[taskId];
        return newState;
      });
      onTaskAssigned?.();
    }
    setLoading(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Media';
      case 'low': return 'Baja';
      default: return priority;
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative bg-[#02505931] backdrop-blur-sm border border-[#08A696]/30 rounded-2xl hover:bg-background/20 hover:border-[#08A696] transition-all duration-300"
        >
          <Bell className="h-5 w-5 text-[#26FFDF]" />
          <AnimatePresence>
            {unassignedTasks.length > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold"
              >
                {unassignedTasks.length > 9 ? '9+' : unassignedTasks.length}
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        align="end" 
        className="w-[420px] p-0 bg-background/95 backdrop-blur-xl border-[#08A696]/30 rounded-2xl shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#08A696]/20">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-[#26FFDF]" />
            <h3 className="font-semibold text-white">Tareas Nuevas de Reuniones</h3>
          </div>
          <Badge variant="outline" className="border-[#08A696]/50 text-[#26FFDF]">
            {unassignedTasks.length} sin asignar
          </Badge>
        </div>

        {/* Lista de tareas */}
        <div className="max-h-[400px] overflow-y-auto">
          {unassignedTasks.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No hay tareas nuevas pendientes de asignar</p>
            </div>
          ) : (
            <div className="p-2 space-y-2">
              {unassignedTasks.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  layout
                >
                  <Card className="p-4 bg-background/50 border-[#08A696]/20 rounded-xl hover:bg-background/70 transition-all">
                    <div className="space-y-3">
                      {/* Título y prioridad */}
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-medium text-white text-sm line-clamp-2">
                          {task.title}
                        </h4>
                        <Badge className={`shrink-0 ${getPriorityColor(task.priority)}`}>
                          {getPriorityText(task.priority)}
                        </Badge>
                      </div>

                      {/* Descripción */}
                      {task.description && (
                        <p className="text-xs text-slate-400 line-clamp-2">
                          {task.description}
                        </p>
                      )}

                      {/* Metadata */}
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        {task.due_date && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(task.due_date).toLocaleDateString('es-ES')}
                          </span>
                        )}
                        {task.assigned_to && (
                          <span>Asignado a: {task.assigned_to}</span>
                        )}
                      </div>

                      {/* Selector de proyecto */}
                      <div className="flex items-center gap-2 pt-2 border-t border-[#08A696]/10">
                        <FolderOpen className="h-4 w-4 text-slate-400 shrink-0" />
                        <Select
                          value={selectedProject[task.id] || ''}
                          onValueChange={(value) => 
                            setSelectedProject(prev => ({ ...prev, [task.id]: value }))
                          }
                        >
                          <SelectTrigger className="flex-1 h-8 text-xs bg-background/50 border-[#08A696]/30 rounded-lg">
                            <SelectValue placeholder="Seleccionar proyecto..." />
                          </SelectTrigger>
                          <SelectContent className="bg-background/95 backdrop-blur-xl border-[#08A696]/30">
                            {activeProjects.map((project) => (
                              <SelectItem 
                                key={project.id} 
                                value={project.id}
                                className="text-xs"
                              >
                                {project.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          size="sm"
                          disabled={!selectedProject[task.id] || loading}
                          onClick={() => handleAssignTask(task.id)}
                          className="h-8 px-3 bg-gradient-to-r from-[#08A696] to-[#26FFDF] text-slate-900 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {unassignedTasks.length > 0 && (
          <div className="p-3 border-t border-[#08A696]/20">
            <Button
              variant="ghost"
              className="w-full text-[#26FFDF] hover:bg-[#08A696]/10 rounded-xl"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4 mr-2" />
              Cerrar
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
