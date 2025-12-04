'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  Calendar, 
  MessageSquare, 
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Circle,
  Loader2,
  Send,
  Edit2,
  Save,
  X,
  Plus
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { supabaseProjectsDB, Task, MeetingTask } from '@/lib/supabase-projects-db';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';

// ============================================================
// TIPOS
// ============================================================

type TaskStatus = 'pendiente' | 'en progreso' | 'completada';
type MeetingTaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

interface TaskComment {
  id: string;
  task_id: string;
  content: string;
  user_id: string;
  user_name: string;
  user_role?: string;
  created_at: string;
}

interface ProjectTasksProps {
  projectId: string;
  onTaskUpdate?: () => void;
}

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================

export function ProjectTasks({ projectId, onTaskUpdate }: ProjectTasksProps) {
  const { userRole } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [meetingTasks, setMeetingTasks] = useState<MeetingTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | TaskStatus>('all');
  
  // Solo admin puede editar tareas
  const canEdit = userRole === 'admin';
  
  // Estado para crear nueva tarea
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [newTask, setNewTask] = useState({
    nombre: '',
    descripcion: '',
    prioridad: 'media' as 'alta' | 'media' | 'baja',
    categoria: '',
    estado: 'pendiente' as TaskStatus,
    fecha_inicio: '',
    fecha_final: '',
    observaciones: ''
  });

  const fetchTasks = useCallback(async () => {
    console.log('[ProjectTasks] 🔄 fetchTasks called for projectId:', projectId);
    if (!projectId) {
      console.error('[ProjectTasks] ⚠️ No projectId provided!');
      setLoading(false);
      return;
    }
    setLoading(true);
    const [projectTasks, projectMeetingTasks] = await Promise.all([
      supabaseProjectsDB.getTasksByProject(projectId),
      supabaseProjectsDB.getMeetingTasksByProject(projectId)
    ]);
    console.log('[ProjectTasks] ✅ fetchTasks received:', projectTasks.length, 'tasks', projectMeetingTasks.length, 'meeting tasks');
    console.log('[ProjectTasks] Tasks:', projectTasks);
    console.log('[ProjectTasks] Meeting tasks:', projectMeetingTasks);
    setTasks(projectTasks);
    setMeetingTasks(projectMeetingTasks);
    setLoading(false);
  }, [projectId]);

  useEffect(() => {
    fetchTasks();

    const subscription = supabaseProjectsDB.subscribeToTasks(projectId, () => {
      fetchTasks();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [projectId, fetchTasks]);

  const handleTaskStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    const result = await supabaseProjectsDB.updateTask(taskId, {
      estado: newStatus,
      finalizada: newStatus === 'completada'
    });
    if (result) {
      toast.success('Estado actualizado');
      fetchTasks();
      onTaskUpdate?.();
    } else {
      toast.error('Error al actualizar estado');
    }
  };

  const handleMeetingTaskStatusChange = async (taskId: string, newStatus: MeetingTaskStatus) => {
    const result = await supabaseProjectsDB.updateMeetingTask(taskId, {
      status: newStatus
    });
    if (result) {
      toast.success('Estado actualizado');
      fetchTasks();
      onTaskUpdate?.();
    } else {
      toast.error('Error al actualizar estado');
    }
  };

  const handleCreateTask = async () => {
    if (!newTask.nombre.trim()) {
      toast.error('El nombre de la tarea es obligatorio');
      return;
    }

    const taskData: any = {
      project_id: projectId,
      nombre: newTask.nombre,
      estado: newTask.estado,
      prioridad: newTask.prioridad,
      finalizada: false
    };

    if (newTask.descripcion.trim()) taskData.descripcion = newTask.descripcion;
    if (newTask.categoria.trim()) taskData.categoria = newTask.categoria;
    if (newTask.fecha_inicio) taskData.fecha_inicio = newTask.fecha_inicio;
    if (newTask.fecha_final) taskData.fecha_final = newTask.fecha_final;
    if (newTask.observaciones.trim()) taskData.observaciones = newTask.observaciones;

    const result = await supabaseProjectsDB.createTask(taskData);
    if (result) {
      toast.success('Tarea creada exitosamente');
      setIsCreatingTask(false);
      setNewTask({
        nombre: '',
        descripcion: '',
        prioridad: 'media',
        categoria: '',
        estado: 'pendiente',
        fecha_inicio: '',
        fecha_final: '',
        observaciones: ''
      });
      fetchTasks();
      onTaskUpdate?.();
    } else {
      toast.error('Error al crear la tarea');
    }
  };

  const filteredTasks = filter === 'all' 
    ? tasks 
    : tasks.filter(t => t.estado === filter);

  const filteredMeetingTasks = filter === 'all'
    ? meetingTasks
    : meetingTasks.filter(t => {
        const statusMap: Record<TaskStatus, MeetingTaskStatus> = {
          'pendiente': 'pending',
          'en progreso': 'in_progress',
          'completada': 'completed'
        };
        return t.status === statusMap[filter];
      });

  const stats = {
    total: tasks.length + meetingTasks.length,
    completed: tasks.filter(t => t.estado === 'completada').length + 
               meetingTasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.estado === 'en progreso').length + 
                meetingTasks.filter(t => t.status === 'in_progress').length,
    pending: tasks.filter(t => t.estado === 'pendiente').length + 
             meetingTasks.filter(t => t.status === 'pending').length
  };

  const progressPercentage = stats.total > 0 
    ? Math.round((stats.completed / stats.total) * 100) 
    : 0;

  // Debug: verificar datos después de calcular filteredTasks
  useEffect(() => {
    console.log('[ProjectTasks] 🔍 userRole:', userRole, 'canEdit:', canEdit);
    console.log('[ProjectTasks] 📊 tasks.length:', tasks.length, 'filteredTasks.length:', filteredTasks.length);
    if (filteredTasks.length > 0) {
      console.log('[ProjectTasks] 📋 First task:', filteredTasks[0]?.nombre);
    } else {
      console.log('[ProjectTasks] ⚠️ NO HAY TAREAS FILTRADAS');
    }
  }, [userRole, canEdit, tasks.length, filteredTasks.length, filteredTasks]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#26FFDF]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      {/* Banner de permisos para admin con botón crear */}
      {canEdit && (
        <div className="mb-4 p-3 bg-gradient-to-r from-[#08A696]/20 to-[#26FFDF]/20 border border-[#08A696]/40 rounded-lg">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#08A696]/30 border border-[#08A696]">
                <Edit2 className="h-4 w-4 text-[#26FFDF]" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">Modo Administrador Activo</p>
                <p className="text-xs text-slate-300">Puedes editar todas las propiedades de las tareas y asignar usuarios del equipo</p>
              </div>
            </div>
            <Button
              onClick={() => setIsCreatingTask(true)}
              className="bg-gradient-to-r from-[#08A696] to-[#26FFDF] hover:from-[#0a9b8a] hover:to-[#20e6c7] text-white shadow-[0_0_20px_rgba(8,166,150,0.3)] hover:shadow-[0_0_30px_rgba(8,166,150,0.5)] flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Crear Tarea
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="col-span-2 p-4 bg-[#02505931] backdrop-blur-sm border-[#08A696]/20 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Progreso General</span>
            <span className="text-2xl font-bold text-[#26FFDF]">{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2 bg-slate-800">
            <div 
              className="h-full bg-gradient-to-r from-[#08A696] to-[#26FFDF] rounded-full transition-all" 
              style={{ width: `${progressPercentage}%` }}
            />
          </Progress>
          <div className="mt-2 text-xs text-slate-500">
            {stats.completed} de {stats.total} tareas completadas
          </div>
        </Card>

        <Card className="p-4 bg-[#02505931] backdrop-blur-sm border-[#08A696]/20 rounded-xl">
          <div className="text-xs text-slate-400 mb-1">Pendientes</div>
          <div className="text-2xl font-bold text-slate-300">{stats.pending}</div>
        </Card>

        <Card className="p-4 bg-[#02505931] backdrop-blur-sm border-[#08A696]/20 rounded-xl">
          <div className="text-xs text-slate-400 mb-1">En Progreso</div>
          <div className="text-2xl font-bold text-blue-400">{stats.inProgress}</div>
        </Card>

        <Card className="p-4 bg-[#02505931] backdrop-blur-sm border-[#08A696]/20 rounded-xl">
          <div className="text-xs text-slate-400 mb-1">Completadas</div>
          <div className="text-2xl font-bold text-green-400">{stats.completed}</div>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-400">Filtrar:</span>
        <Select value={filter} onValueChange={(value) => setFilter(value as typeof filter)}>
          <SelectTrigger className="w-48 bg-[#02505931] border-[#08A696]/30 text-[#26FFDF]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-background/95 backdrop-blur-md border-[#08A696]/30">
            <SelectItem value="all" className="text-[#26FFDF]">Todas</SelectItem>
            <SelectItem value="pendiente" className="text-slate-300">Pendientes</SelectItem>
            <SelectItem value="en progreso" className="text-blue-400">En Progreso</SelectItem>
            <SelectItem value="completada" className="text-green-400">Completadas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lista de Tareas */}
      <div className="space-y-6">
        {filteredMeetingTasks.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-[#26FFDF] flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Tareas de Reuniones ({filteredMeetingTasks.length})
            </h3>
            <AnimatePresence>
              {filteredMeetingTasks.map((task) => (
                <MeetingTaskCard
                  key={`${task.id}-${canEdit}-${userRole}`}
                  task={task}
                  onStatusChange={handleMeetingTaskStatusChange}
                  canEdit={canEdit}
                  onTaskUpdate={() => {
                    fetchTasks();
                    onTaskUpdate?.();
                  }}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {filteredTasks.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-[#26FFDF] flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Tareas del Proyecto ({filteredTasks.length})
            </h3>
            <AnimatePresence>
              {filteredTasks.map((task) => (
                <TaskCard
                  key={`${task.id}-${canEdit}-${userRole}`}
                  task={task}
                  onStatusChange={handleTaskStatusChange}
                  canEdit={canEdit}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {filteredTasks.length === 0 && filteredMeetingTasks.length === 0 && (
          <div className="text-center py-12">
            <Circle className="h-12 w-12 mx-auto mb-3 opacity-30 text-slate-600" />
            <p className="text-slate-500">
              No hay tareas {filter !== 'all' ? `con estado "${filter}"` : ''}
            </p>
          </div>
        )}
      </div>

      {/* Dialog para crear nueva tarea */}
      <Dialog open={isCreatingTask} onOpenChange={setIsCreatingTask}>
        <DialogContent className="bg-[#02505931] backdrop-blur-md border-[#08A696]/30 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#26FFDF]">
              Crear Nueva Tarea
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Completa los campos para crear una nueva tarea del proyecto
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Nombre */}
              <div className="col-span-2">
                <label className="text-sm font-medium text-slate-300 mb-2 block">
                  Nombre de la Tarea *
                </label>
                <input
                  type="text"
                  value={newTask.nombre}
                  onChange={(e) => setNewTask({...newTask, nombre: e.target.value})}
                  className="w-full px-3 py-2 bg-[#025059]/50 border border-[#08A696]/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#26FFDF]"
                  placeholder="Ej: Implementar sistema de autenticación"
                />
              </div>

              {/* Descripción */}
              <div className="col-span-2">
                <label className="text-sm font-medium text-slate-300 mb-2 block">
                  Descripción
                </label>
                <textarea
                  value={newTask.descripcion}
                  onChange={(e) => setNewTask({...newTask, descripcion: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 bg-[#025059]/50 border border-[#08A696]/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#26FFDF] resize-none"
                  placeholder="Descripción detallada de la tarea..."
                />
              </div>

              {/* Prioridad */}
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">
                  Prioridad
                </label>
                <Select value={newTask.prioridad} onValueChange={(value) => setNewTask({...newTask, prioridad: value as 'alta' | 'media' | 'baja'})}>
                  <SelectTrigger className="bg-[#025059]/50 border-[#08A696]/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background/95 backdrop-blur-md border-[#08A696]/30">
                    <SelectItem value="alta" className="text-red-400">Alta</SelectItem>
                    <SelectItem value="media" className="text-yellow-400">Media</SelectItem>
                    <SelectItem value="baja" className="text-green-400">Baja</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Estado */}
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">
                  Estado
                </label>
                <Select value={newTask.estado} onValueChange={(value) => setNewTask({...newTask, estado: value as TaskStatus})}>
                  <SelectTrigger className="bg-[#025059]/50 border-[#08A696]/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background/95 backdrop-blur-md border-[#08A696]/30">
                    <SelectItem value="pendiente" className="text-slate-300">Pendiente</SelectItem>
                    <SelectItem value="en progreso" className="text-blue-400">En Progreso</SelectItem>
                    <SelectItem value="completada" className="text-green-400">Completada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Categoría */}
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">
                  Categoría
                </label>
                <input
                  type="text"
                  value={newTask.categoria}
                  onChange={(e) => setNewTask({...newTask, categoria: e.target.value})}
                  className="w-full px-3 py-2 bg-[#025059]/50 border border-[#08A696]/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#26FFDF]"
                  placeholder="Ej: Backend, Frontend, Database"
                />
              </div>

              {/* Fecha Inicio */}
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">
                  Fecha Inicio
                </label>
                <input
                  type="date"
                  value={newTask.fecha_inicio}
                  onChange={(e) => setNewTask({...newTask, fecha_inicio: e.target.value})}
                  className="w-full px-3 py-2 bg-[#025059]/50 border border-[#08A696]/30 rounded-lg text-white focus:outline-none focus:border-[#26FFDF]"
                />
              </div>

              {/* Fecha Final */}
              <div className="col-span-2">
                <label className="text-sm font-medium text-slate-300 mb-2 block">
                  Fecha Final
                </label>
                <input
                  type="date"
                  value={newTask.fecha_final}
                  onChange={(e) => setNewTask({...newTask, fecha_final: e.target.value})}
                  className="w-full px-3 py-2 bg-[#025059]/50 border border-[#08A696]/30 rounded-lg text-white focus:outline-none focus:border-[#26FFDF]"
                />
              </div>

              {/* Observaciones */}
              <div className="col-span-2">
                <label className="text-sm font-medium text-slate-300 mb-2 block">
                  Observaciones
                </label>
                <textarea
                  value={newTask.observaciones}
                  onChange={(e) => setNewTask({...newTask, observaciones: e.target.value})}
                  rows={2}
                  className="w-full px-3 py-2 bg-[#025059]/50 border border-[#08A696]/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#26FFDF] resize-none"
                  placeholder="Notas adicionales..."
                />
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                onClick={() => setIsCreatingTask(false)}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-800"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleCreateTask}
                className="bg-gradient-to-r from-[#08A696] to-[#26FFDF] hover:from-[#0a9b8a] hover:to-[#20e6c7] text-white shadow-[0_0_20px_rgba(8,166,150,0.3)] hover:shadow-[0_0_30px_rgba(8,166,150,0.5)]"
              >
                Crear Tarea
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ============================================================
// CARD DE TAREA DE PROYECTO
// ============================================================

interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  canEdit: boolean;
}

function TaskCard({ task, onStatusChange, canEdit }: TaskCardProps) {
  console.log('🎯 [TaskCard] MONTADO -', task.nombre, '- canEdit:', canEdit);
  
  const { user, userRole, userProfile } = useAuth();
  const [expanded, setExpanded] = useState(true);
  const [comments, setComments] = useState<TaskComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComment, setLoadingComment] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Debug: Log cuando cambia isEditing
  useEffect(() => {
    console.log('[TaskCard] isEditing cambió a:', isEditing, 'para tarea:', task.nombre);
  }, [isEditing, task.nombre]);

  // Debug: verificar el valor de canEdit
  useEffect(() => {
    console.log('[TaskCard] 🔍 canEdit:', canEdit, 'userRole:', userRole, 'tarea:', task.nombre);
  }, [canEdit, userRole]);
  const [editedTask, setEditedTask] = useState({
    nombre: task.nombre,
    descripcion: task.descripcion || '',
    prioridad: task.prioridad,
    categoria: task.categoria,
    estado: task.estado,
    fecha_inicio: task.fecha_inicio || '',
    fecha_final: task.fecha_final || '',
    observaciones: task.observaciones || ''
  });

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'completada': return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'en progreso': return <Clock className="h-5 w-5 text-blue-400" />;
      default: return <Circle className="h-5 w-5 text-slate-500" />;
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'completada': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'en progreso': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-slate-700/50 text-slate-400 border-slate-600/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'media': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-slate-700/50 text-slate-400 border-slate-600/30';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'planeacion': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'diseño': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
      'desarrollo': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'testing': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      'despliegue': 'bg-green-500/20 text-green-400 border-green-500/30'
    };
    return colors[category] || 'bg-slate-700/50 text-slate-400 border-slate-600/30';
  };

  // Cargar comentarios cuando se expande o al montar el componente
  useEffect(() => {
    if (expanded) {
      loadComments();
    }
  }, [expanded]);
  
  // Cargar comentarios al montar si expanded es true por defecto
  useEffect(() => {
    loadComments();
  }, []);

  const loadComments = async () => {
    console.log('[TaskCard] Cargando comentarios para task_id:', task.id);
    try {
      const { data: commentsData, error } = await supabase
        .from('task_comments')
        .select('id, task_id, meeting_task_id, content, user_id, created_at')
        .eq('task_id', task.id)
        .is('meeting_task_id', null)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('[TaskCard] Error al cargar comentarios:', error);
        throw error;
      }
      
      console.log('[TaskCard] Comentarios cargados:', commentsData?.length || 0);

      // Obtener perfiles de los usuarios
      const userIds = [...new Set((commentsData || []).map(c => c.user_id))];
      console.log('[TaskCard] Cargando perfiles para user_ids:', userIds);
      
      const { data: profilesData, error: profileError } = await supabase
        .from('profiles')
        .select('id, email, name, role')
        .in('id', userIds);
      
      if (profileError) {
        console.error('[TaskCard] Error al cargar perfiles:', profileError);
      }
      
      console.log('[TaskCard] Perfiles obtenidos:', profilesData);

      const profilesMap = new Map(profilesData?.map(p => [p.id, p]) || []);

      const formattedComments: TaskComment[] = (commentsData || []).map((comment: any) => {
        const profile = profilesMap.get(comment.user_id);
        const userName = profile?.name || profile?.email?.split('@')[0] || 'Usuario';
        console.log('[TaskCard] Comentario user_id:', comment.user_id, 'perfil:', profile, 'nombre final:', userName);
        return {
          id: comment.id,
          task_id: comment.task_id,
          content: comment.content,
          user_id: comment.user_id,
          user_name: userName,
          user_role: profile?.role,
          created_at: comment.created_at
        };
      });

      setComments(formattedComments);
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      toast.error('El comentario no puede estar vacío');
      return;
    }
    if (!user) {
      toast.error('Debes iniciar sesión');
      return;
    }
    
    console.log('[TaskCard] Agregando comentario:', { task_id: task.id, user_id: user.id, content: newComment });
    setLoadingComment(true);
    
    try {
      const { data: newCommentData, error } = await supabase
        .from('task_comments')
        .insert([{
          task_id: task.id,
          meeting_task_id: null,
          content: newComment,
          user_id: user.id
        }])
        .select('id, task_id, content, user_id, created_at')
        .single();

      if (error) {
        console.error('[TaskCard] Error al insertar comentario:', error);
        throw error;
      }
      
      console.log('[TaskCard] Comentario insertado exitosamente:', newCommentData);
      console.log('[TaskCard] Perfil del usuario que comenta:', userProfile);
      
      // Usar el perfil del hook useAuth
      const userName = userProfile?.name || userProfile?.email?.split('@')[0] || user.email?.split('@')[0] || 'Usuario';
      console.log('[TaskCard] Nombre final para comentario:', userName);

      const formattedComment: TaskComment = {
        id: newCommentData!.id,
        task_id: newCommentData!.task_id,
        content: newCommentData!.content,
        user_id: newCommentData!.user_id,
        user_name: userName,
        user_role: userProfile?.role,
        created_at: newCommentData!.created_at
      };      setComments([...comments, formattedComment]);
      setNewComment('');
      toast.success('Comentario agregado');
      console.log('[TaskCard] Comentario agregado al estado, total:', comments.length + 1);
    } catch (error: any) {
      console.error('[TaskCard] Error completo al agregar comentario:', error);
      console.error('[TaskCard] Detalles del error:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      toast.error(`Error al agregar comentario: ${error.message || 'Error desconocido'}`);
    } finally {
      setLoadingComment(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editedTask.nombre.trim()) {
      toast.error('El nombre no puede estar vacío');
      return;
    }

    const updateData: any = {
      nombre: editedTask.nombre,
      descripcion: editedTask.descripcion,
      prioridad: editedTask.prioridad,
      categoria: editedTask.categoria,
      estado: editedTask.estado,
      finalizada: editedTask.estado === 'completada'
    };
    
    if (editedTask.fecha_inicio) updateData.fecha_inicio = editedTask.fecha_inicio;
    if (editedTask.fecha_final) updateData.fecha_final = editedTask.fecha_final;
    if (editedTask.observaciones) updateData.observaciones = editedTask.observaciones;

    console.log('[TaskCard] Guardando cambios:', updateData);
    const result = await supabaseProjectsDB.updateTask(task.id, updateData);

    if (result) {
      toast.success('Tarea actualizada correctamente');
      setIsEditing(false);
      // Actualizar la tarea localmente
      Object.assign(task, editedTask);
    } else {
      toast.error('Error al actualizar tarea');
    }
  };

  const handleCancelEdit = () => {
    setEditedTask({
      nombre: task.nombre,
      descripcion: task.descripcion || '',
      prioridad: task.prioridad,
      categoria: task.categoria,
      estado: task.estado,
      fecha_inicio: task.fecha_inicio || '',
      fecha_final: task.fecha_final || '',
      observaciones: task.observaciones || ''
    });
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="group"
    >
      <Card className="bg-[#02505931] backdrop-blur-sm border-[#08A696]/20 rounded-xl overflow-hidden hover:border-[#08A696]/40 transition-all">
        <div className="p-4">
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1 space-y-3 min-w-0 pr-4">
              {/* Título */}
              <div className="flex items-center gap-3">
                {!isEditing && getStatusIcon(task.estado)}
                {isEditing ? (
                  <div className="flex-1">
                    <label className="text-xs text-slate-400 mb-1 block">Nombre de la tarea *</label>
                    <input
                      type="text"
                      value={editedTask.nombre}
                      onChange={(e) => setEditedTask({...editedTask, nombre: e.target.value})}
                      className="w-full bg-slate-900/50 border border-[#08A696]/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#08A696]"
                      placeholder="Nombre de la tarea"
                    />
                  </div>
                ) : (
                  <h4 className="font-semibold text-white group-hover:text-[#26FFDF] transition-colors">
                    {task.nombre}
                  </h4>
                )}
              </div>

              {/* Descripción */}
              {isEditing ? (
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Descripción</label>
                  <Textarea
                    value={editedTask.descripcion}
                    onChange={(e) => setEditedTask({...editedTask, descripcion: e.target.value})}
                    className="bg-slate-900/50 border border-[#08A696]/30 text-slate-200 focus:border-[#08A696] resize-none"
                    rows={3}
                    placeholder="Descripción de la tarea"
                  />
                </div>
              ) : (
                <p className="text-sm text-slate-400 leading-relaxed">
                  {task.descripcion}
                </p>
              )}

              {isEditing ? (
                /* MODO EDICIÓN - Formulario completo */
                <div className="space-y-3 p-4 bg-slate-900/30 rounded-lg border border-[#08A696]/20">
                  {/* Fila 1: Estado, Prioridad, Categoría */}
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs text-slate-400 mb-1.5 block font-medium">Estado *</label>
                      <Select
                        value={editedTask.estado}
                        onValueChange={(value) => setEditedTask({...editedTask, estado: value as Task['estado']})}
                      >
                        <SelectTrigger className="w-full bg-slate-900/50 border-[#08A696]/30 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900/95 backdrop-blur-md border-[#08A696]/30">
                          <SelectItem value="pendiente">Pendiente</SelectItem>
                          <SelectItem value="en progreso">En Progreso</SelectItem>
                          <SelectItem value="completada">Completada</SelectItem>
                          <SelectItem value="bloqueada">Bloqueada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-xs text-slate-400 mb-1.5 block font-medium">Prioridad *</label>
                      <Select
                        value={editedTask.prioridad}
                        onValueChange={(value) => setEditedTask({...editedTask, prioridad: value as Task['prioridad']})}
                      >
                        <SelectTrigger className="w-full bg-slate-900/50 border-[#08A696]/30 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900/95 backdrop-blur-md border-[#08A696]/30">
                          <SelectItem value="alta" className="text-red-400">🔴 Alta</SelectItem>
                          <SelectItem value="media" className="text-yellow-400">🟡 Media</SelectItem>
                          <SelectItem value="baja" className="text-slate-400">⚪ Baja</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-xs text-slate-400 mb-1.5 block font-medium">Categoría</label>
                      <Select
                        value={editedTask.categoria || ''}
                        onValueChange={(value) => setEditedTask({...editedTask, categoria: value as Task['categoria']})}
                      >
                        <SelectTrigger className="w-full bg-slate-900/50 border-[#08A696]/30 text-sm">
                          <SelectValue placeholder="Sin categoría" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900/95 backdrop-blur-md border-[#08A696]/30">
                          <SelectItem value="planeacion">Planeación</SelectItem>
                          <SelectItem value="diseño">Diseño</SelectItem>
                          <SelectItem value="desarrollo">Desarrollo</SelectItem>
                          <SelectItem value="testing">Testing</SelectItem>
                          <SelectItem value="despliegue">Despliegue</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {/* Fila 2: Fechas */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-400 mb-1.5 block font-medium">📅 Fecha Inicio</label>
                      <input
                        type="date"
                        value={editedTask.fecha_inicio || ''}
                        onChange={(e) => setEditedTask({...editedTask, fecha_inicio: e.target.value})}
                        className="w-full bg-slate-900/50 border border-[#08A696]/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#08A696]"
                      />
                    </div>
                    
                    <div>
                      <label className="text-xs text-slate-400 mb-1.5 block font-medium">🏁 Fecha Final</label>
                      <input
                        type="date"
                        value={editedTask.fecha_final || ''}
                        onChange={(e) => setEditedTask({...editedTask, fecha_final: e.target.value})}
                        className="w-full bg-slate-900/50 border border-[#08A696]/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#08A696]"
                      />
                    </div>
                  </div>
                  
                  {/* Fila 3: Observaciones */}
                  <div>
                    <label className="text-xs text-slate-400 mb-1.5 block font-medium">📝 Observaciones</label>
                    <Textarea
                      value={editedTask.observaciones || ''}
                      onChange={(e) => setEditedTask({...editedTask, observaciones: e.target.value})}
                      className="bg-slate-900/50 border border-[#08A696]/30 text-slate-200 focus:border-[#08A696] resize-none text-sm"
                      rows={2}
                      placeholder="Notas adicionales, bloqueos, dependencias..."
                    />
                  </div>
                </div>
              ) : (
                /* MODO VISUALIZACIÓN - Badges y datos */
                <>
                  <div className="flex flex-wrap gap-2">
                    <Badge className={`${getStatusColor(task.estado)} border rounded-lg px-3 py-1 text-xs`}>
                      {task.estado}
                    </Badge>
                    {task.prioridad && (
                      <Badge className={`${getPriorityColor(task.prioridad)} border rounded-lg px-3 py-1 text-xs`}>
                        {task.prioridad}
                      </Badge>
                    )}
                    {task.categoria && (
                      <Badge className={`${getCategoryColor(task.categoria)} border rounded-lg px-3 py-1 text-xs`}>
                        {task.categoria}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {task.created_at && new Date(task.created_at).toLocaleDateString('es-ES')}
                    </div>
                    {task.fecha_inicio && (
                      <div className="flex items-center gap-1 text-blue-400">
                        <span>📅</span>
                        <span>{new Date(task.fecha_inicio).toLocaleDateString('es-ES')}</span>
                        {task.fecha_final && (
                          <>
                            <span className="mx-1">→</span>
                            <span>{new Date(task.fecha_final).toLocaleDateString('es-ES')}</span>
                          </>
                        )}
                      </div>
                    )}
                    {task.assigned_to && (
                      <div className="flex items-center gap-1">
                        <span>Asignado a: </span>
                        <span className="text-[#26FFDF]">{task.assigned_to}</span>
                      </div>
                    )}
                  </div>
                  
                  {task.observaciones && (
                    <div className="mt-2 p-2.5 bg-slate-900/30 rounded-lg border border-slate-700/40">
                      <p className="text-xs text-slate-400 leading-relaxed">
                        <span className="font-medium text-slate-300">📝 Observaciones: </span>
                        {task.observaciones}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="flex flex-col gap-3 shrink-0 min-w-[140px]">
              {/* BOTONES PRINCIPALES: Editar/Asignar o Guardar/Cancelar */}
              {canEdit && (
                <div className="flex flex-col gap-2">
                  {isEditing ? (
                    <>
                      <Button
                        onClick={handleSaveEdit}
                        className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-600 text-white py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-[1.02] shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] w-full h-11"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        <span>Guardar</span>
                      </Button>
                      <Button
                        onClick={handleCancelEdit}
                        variant="ghost"
                        className="text-red-400 hover:bg-red-500/30 hover:text-red-300 py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-[1.02] border-2 border-red-500/60 bg-red-500/10 w-full h-11"
                      >
                        <X className="h-4 w-4 mr-2" />
                        <span>Cancelar</span>
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="default"
                        onClick={() => {
                          console.log('[TaskCard] Activando modo edición para tarea:', task.id);
                          setIsEditing(true);
                        }}
                        className="bg-gradient-to-r from-[#08A696] to-[#26FFDF] hover:from-[#0a9b8a] hover:to-[#20e6c7] text-white py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-[1.02] shadow-[0_0_20px_rgba(8,166,150,0.3)] hover:shadow-[0_0_30px_rgba(8,166,150,0.5)] border-0 w-full h-11"
                        title="Editar tarea"
                      >
                        <Edit2 className="h-4 w-4 mr-2" />
                        <span>Editar</span>
                      </Button>
                    </>
                  )}
                </div>
              )}

              {/* SELECT DE ESTADO (solo si NO está editando) */}
              {!isEditing && (
                <>
                  <Select
                    value={task.estado}
                    onValueChange={(value) => onStatusChange(task.id, value as TaskStatus)}
                    disabled={!canEdit}
                  >
                    <SelectTrigger className="w-full bg-[#025059]/50 border-[#08A696]/30 text-[#26FFDF] h-8 text-xs disabled:opacity-50 disabled:cursor-not-allowed">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background/95 backdrop-blur-md border-[#08A696]/30">
                      <SelectItem value="pendiente" className="text-slate-300">Pendiente</SelectItem>
                      <SelectItem value="en progreso" className="text-blue-400">En Progreso</SelectItem>
                      <SelectItem value="completada" className="text-green-400">Completada</SelectItem>
                    </SelectContent>
                  </Select>
                  {!canEdit && (
                    <p className="text-[10px] text-slate-500 text-center">Solo lectura</p>
                  )}
                </>
              )}

              {/* BOTÓN DE COMENTARIOS */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setExpanded(!expanded)}
                className="text-[#26FFDF] hover:bg-[#08A696]/20 w-full border-[#08A696]/40 bg-[#08A696]/10"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                <span className="text-xs">Comentarios ({comments.length})</span>
                {expanded ? <ChevronUp className="h-4 w-4 ml-auto" /> : <ChevronDown className="h-4 w-4 ml-auto" />}
              </Button>
            </div>
          </div>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-4 pt-4 border-t border-[#08A696]/20"
              >
                <h5 className="text-sm font-semibold text-[#26FFDF] mb-3">Comentarios</h5>

                <div className="space-y-3 mb-4">
                  {comments.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">No hay comentarios aún</p>
                  ) : (
                    comments.map((comment) => (
                      <div key={comment.id} className="bg-slate-900/50 rounded-lg p-3 border border-slate-800">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-[#26FFDF]">{comment.user_name}</span>
                          {comment.user_role === 'admin' && (
                            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-[10px] px-2 py-0">
                              Admin
                            </Badge>
                          )}
                          <span className="text-[10px] text-slate-600">
                            {new Date(comment.created_at).toLocaleString('es-ES')}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">{comment.content}</p>
                      </div>
                    ))
                  )}
                </div>

                <div className="flex gap-2">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Escribe un comentario..."
                    className="bg-slate-900/50 border-[#08A696]/30 text-slate-200 placeholder:text-slate-600 focus:border-[#08A696] resize-none h-20"
                  />
                  <Button
                    onClick={handleAddComment}
                    disabled={loadingComment || !newComment.trim()}
                    className="bg-gradient-to-r from-[#08A696] to-[#26FFDF] hover:from-[#0a9b8a] hover:to-[#20e6c7] text-white shadow-[0_0_20px_rgba(8,166,150,0.3)] hover:shadow-[0_0_30px_rgba(8,166,150,0.5)] self-end"
                  >
                    {loadingComment ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </motion.div>
  );
}

// ============================================================
// CARD DE TAREA DE REUNIÓN (CON EDICIÓN)
// ============================================================

interface MeetingTaskCardProps {
  task: MeetingTask;
  onStatusChange: (taskId: string, status: MeetingTaskStatus) => void;
  canEdit: boolean;
  onTaskUpdate?: () => void;
}

function MeetingTaskCard({ task, onStatusChange, canEdit, onTaskUpdate }: MeetingTaskCardProps) {
  const { user, userRole, userProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showComments, setShowComments] = useState(true);
  const [comments, setComments] = useState<TaskComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComment, setLoadingComment] = useState(false);
  const [editedTask, setEditedTask] = useState({
    title: task.title,
    description: task.description || '',
    priority: task.priority || 'medium',
    category: task.category || '',
    due_date: task.due_date || '',
    assigned_to: task.assigned_to || ''
  });

  // Cargar comentarios cuando se expande
  const loadComments = async () => {
    console.log('[MeetingTaskCard] Cargando comentarios para meeting_task_id:', task.id);
    try {
      const { data: commentsData, error } = await supabase
        .from('task_comments')
        .select('id, task_id, meeting_task_id, content, user_id, created_at')
        .eq('meeting_task_id', task.id)
        .is('task_id', null)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('[MeetingTaskCard] Error al cargar comentarios:', error);
        return;
      }
      
      console.log('[MeetingTaskCard] Comentarios cargados:', commentsData?.length || 0);
      
      if (commentsData) {
      // Obtener perfiles de los usuarios
      const userIds = [...new Set(commentsData.map(c => c.user_id))];
      console.log('[MeetingTaskCard] Cargando perfiles para user_ids:', userIds);
      
      const { data: profilesData, error: profileError } = await supabase
        .from('profiles')
        .select('id, email, name, role')
        .in('id', userIds);
      
      if (profileError) {
        console.error('[MeetingTaskCard] Error al cargar perfiles:', profileError);
      }
      
      console.log('[MeetingTaskCard] Perfiles obtenidos:', profilesData);

      const profilesMap = new Map(profilesData?.map(p => [p.id, p]) || []);

      const formattedComments = commentsData.map((comment: any) => {
        const profile = profilesMap.get(comment.user_id);
        const userName = profile?.name || profile?.email?.split('@')[0] || 'Usuario';
        console.log('[MeetingTaskCard] Comentario user_id:', comment.user_id, 'perfil:', profile, 'nombre final:', userName);
        return {
          id: comment.id,
          meeting_task_id: comment.meeting_task_id,
          content: comment.content,
          user_id: comment.user_id,
          user_name: userName,
          user_role: profile?.role,
          created_at: comment.created_at
        };
      });
      setComments(formattedComments);
      }
    } catch (error) {
      console.error('[MeetingTaskCard] Error completo al cargar comentarios:', error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      toast.error('El comentario no puede estar vacío');
      return;
    }
    if (!user) {
      toast.error('Debes iniciar sesión');
      return;
    }
    
    console.log('[MeetingTaskCard] Agregando comentario:', { meeting_task_id: task.id, user_id: user.id, content: newComment });
    setLoadingComment(true);
    
    try {
      const { data: newCommentData, error } = await supabase
        .from('task_comments')
        .insert({
          task_id: null,
          meeting_task_id: task.id,
          content: newComment.trim(),
          user_id: user.id
        })
        .select('id, meeting_task_id, content, user_id, created_at')
        .single();

      if (error) {
        console.error('[MeetingTaskCard] Error al insertar comentario:', error);
        throw error;
      }
      
      console.log('[MeetingTaskCard] Comentario insertado exitosamente:', newCommentData);
      
      if (newCommentData) {
      console.log('[MeetingTaskCard] Perfil del usuario que comenta:', userProfile);
      
      // Usar el perfil del hook useAuth
      const userName = userProfile?.name || userProfile?.email?.split('@')[0] || user.email?.split('@')[0] || 'Usuario';
      console.log('[MeetingTaskCard] Nombre final para comentario:', userName);

      const formattedComment = {
        id: newCommentData.id,
        meeting_task_id: newCommentData.meeting_task_id,
        content: newCommentData.content,
        user_id: newCommentData.user_id,
        user_name: userName,
        user_role: userProfile?.role,
        created_at: newCommentData.created_at
      };
      setComments([formattedComment, ...comments]);
      setNewComment('');
      toast.success('Comentario agregado');
      console.log('[MeetingTaskCard] Comentario agregado al estado, total:', comments.length + 1);
      }
    } catch (error: any) {
      console.error('[MeetingTaskCard] Error completo al agregar comentario:', error);
      console.error('[MeetingTaskCard] Detalles del error:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      toast.error(`Error al agregar comentario: ${error.message || 'Error desconocido'}`);
    } finally {
      setLoadingComment(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editedTask.title.trim()) {
      toast.error('El título es obligatorio');
      return;
    }

    const updateData: any = {
      title: editedTask.title.trim(),
      priority: editedTask.priority,
      category: editedTask.category.trim()
    };

    if (editedTask.description.trim()) {
      updateData.description = editedTask.description.trim();
    }
    if (editedTask.due_date) {
      updateData.due_date = editedTask.due_date;
    }
    if (editedTask.assigned_to.trim()) {
      updateData.assigned_to = editedTask.assigned_to.trim();
    }

    console.log('[MeetingTaskCard] Guardando cambios:', updateData);
    const result = await supabaseProjectsDB.updateMeetingTask(task.id, updateData);
    
    if (result) {
      toast.success('Tarea actualizada correctamente');
      setIsEditing(false);
      // Actualizar tarea localmente
      Object.assign(task, result);
      // Notificar al componente padre para recargar datos
      if (onTaskUpdate) {
        onTaskUpdate();
      }
    } else {
      toast.error('Error al actualizar la tarea');
    }
  };

  // Cargar comentarios al montar si showComments es true por defecto
  useEffect(() => {
    if (showComments) {
      loadComments();
    }
  }, []);

  const getStatusIcon = (status: MeetingTaskStatus) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'in_progress': return <Clock className="h-5 w-5 text-blue-400" />;
      case 'cancelled': return <Circle className="h-5 w-5 text-red-400" />;
      default: return <Circle className="h-5 w-5 text-slate-500" />;
    }
  };

  const getStatusColor = (status: MeetingTaskStatus) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'in_progress': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-700/50 text-slate-400 border-slate-600/30';
    }
  };

  const statusLabels: Record<MeetingTaskStatus, string> = {
    'pending': 'Pendiente',
    'in_progress': 'En Progreso',
    'completed': 'Completada',
    'cancelled': 'Cancelada'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="group"
    >
      <Card className="bg-[#02505931] backdrop-blur-sm border-[#08A696]/20 rounded-xl overflow-hidden hover:border-[#08A696]/40 transition-all">
        <div className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-3">
              {/* TÍTULO Y DESCRIPCIÓN - EDITABLES */}
              {isEditing ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Título</label>
                    <input
                      type="text"
                      value={editedTask.title}
                      onChange={(e) => setEditedTask({...editedTask, title: e.target.value})}
                      className="w-full px-3 py-2 bg-[#025059]/50 border border-[#08A696]/30 rounded-lg text-white text-sm focus:outline-none focus:border-[#26FFDF]"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Descripción</label>
                    <textarea
                      value={editedTask.description}
                      onChange={(e) => setEditedTask({...editedTask, description: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 bg-[#025059]/50 border border-[#08A696]/30 rounded-lg text-white text-sm focus:outline-none focus:border-[#26FFDF] resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">Prioridad</label>
                      <Select value={editedTask.priority} onValueChange={(value) => setEditedTask({...editedTask, priority: value as 'high' | 'medium' | 'low'})}>
                        <SelectTrigger className="bg-[#025059]/50 border-[#08A696]/30 text-white h-9 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-background/95 backdrop-blur-md border-[#08A696]/30">
                          <SelectItem value="high" className="text-red-400">Alta</SelectItem>
                          <SelectItem value="medium" className="text-yellow-400">Media</SelectItem>
                          <SelectItem value="low" className="text-green-400">Baja</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">Categoría</label>
                      <input
                        type="text"
                        value={editedTask.category}
                        onChange={(e) => setEditedTask({...editedTask, category: e.target.value})}
                        className="w-full px-3 py-2 bg-[#025059]/50 border border-[#08A696]/30 rounded-lg text-white text-sm focus:outline-none focus:border-[#26FFDF]"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs text-slate-400 mb-1 block">Fecha de Vencimiento</label>
                      <input
                        type="date"
                        value={editedTask.due_date}
                        onChange={(e) => setEditedTask({...editedTask, due_date: e.target.value})}
                        className="w-full px-3 py-2 bg-[#025059]/50 border border-[#08A696]/30 rounded-lg text-white text-sm focus:outline-none focus:border-[#26FFDF]"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    {getStatusIcon(task.status)}
                    <h4 className="font-semibold text-white group-hover:text-[#26FFDF] transition-colors">
                      {task.title}
                    </h4>
                  </div>

                  {task.description && (
                    <p className="text-sm text-slate-400 leading-relaxed">{task.description}</p>
                  )}

                  <div className="flex flex-wrap gap-2">
                    <Badge className={`${getStatusColor(task.status)} border rounded-lg px-3 py-1 text-xs`}>
                      {statusLabels[task.status]}
                    </Badge>
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 border rounded-lg px-3 py-1 text-xs">
                      De Reunión
                    </Badge>
                    {task.priority && (
                      <Badge className={`border rounded-lg px-3 py-1 text-xs ${
                        task.priority === 'high' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                        task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                        'bg-green-500/20 text-green-400 border-green-500/30'
                      }`}>
                        {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Media' : 'Baja'}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {task.created_at && new Date(task.created_at).toLocaleDateString('es-ES')}
                    </div>
                    {task.assigned_to && (
                      <div className="flex items-center gap-1">
                        <span>Asignado a: </span>
                        <span className="text-[#26FFDF]">{task.assigned_to}</span>
                      </div>
                    )}
                    {task.due_date && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Vence: {new Date(task.due_date).toLocaleDateString('es-ES')}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* COLUMNA DERECHA: Selector de Estado + Botones */}
            <div className="flex flex-col gap-3 shrink-0 min-w-[140px]">
              {/* Selector de Estado */}
              <Select
                value={task.status}
                onValueChange={(value) => onStatusChange(task.id, value as MeetingTaskStatus)}
                disabled={!canEdit}
              >
                <SelectTrigger className="w-full bg-[#025059]/50 border-[#08A696]/30 text-[#26FFDF] h-8 text-xs disabled:opacity-50 disabled:cursor-not-allowed">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background/95 backdrop-blur-md border-[#08A696]/30">
                  <SelectItem value="pending" className="text-slate-300">Pendiente</SelectItem>
                  <SelectItem value="in_progress" className="text-blue-400">En Progreso</SelectItem>
                  <SelectItem value="completed" className="text-green-400">Completada</SelectItem>
                  <SelectItem value="cancelled" className="text-red-400">Cancelada</SelectItem>
                </SelectContent>
              </Select>

              {/* BOTONES DE ACCIÓN */}
              {canEdit && (
                <div className="flex flex-col gap-2">
                  {isEditing ? (
                    <>
                      <Button
                        onClick={handleSaveEdit}
                        className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-600 text-white py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-[1.02] shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] border-0 w-full h-11"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        <span>Guardar</span>
                      </Button>
                      <Button
                        onClick={() => setIsEditing(false)}
                        variant="ghost"
                        className="text-red-400 hover:bg-red-500/30 hover:text-red-300 py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-[1.02] border-2 border-red-500/60 bg-red-500/10 w-full h-11"
                      >
                        <X className="h-4 w-4 mr-2" />
                        <span>Cancelar</span>
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="default"
                        onClick={() => setIsEditing(true)}
                        className="bg-gradient-to-r from-[#08A696] to-[#26FFDF] hover:from-[#0a9b8a] hover:to-[#20e6c7] text-white py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-[1.02] shadow-[0_0_20px_rgba(8,166,150,0.3)] hover:shadow-[0_0_30px_rgba(8,166,150,0.5)] border-0 w-full h-11"
                        title="Editar tarea de reunión"
                      >
                        <Edit2 className="h-4 w-4 mr-2" />
                        <span>Editar</span>
                      </Button>
                    </>
                  )}
                </div>
              )}

              {/* BOTÓN DE COMENTARIOS - SIEMPRE VISIBLE */}
              <Button
                onClick={() => {
                  setShowComments(!showComments);
                  if (!showComments) loadComments();
                }}
                variant="outline"
                className="border-2 border-[#08A696]/40 text-[#26FFDF] hover:bg-[#08A696]/20 hover:border-[#08A696] py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-[1.02] w-full h-11 bg-[#08A696]/5"
                title="Ver y agregar comentarios"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                <span>Comentarios ({comments.length})</span>
              </Button>

              {!canEdit && (
                <p className="text-[10px] text-slate-500 text-center mt-2">Solo lectura</p>
              )}
            </div>
          </div>

          {/* SECCIÓN DE COMENTARIOS */}
          <AnimatePresence>
            {showComments && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-4 pt-4 border-t border-[#08A696]/20 space-y-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="h-4 w-4 text-[#26FFDF]" />
                  <h5 className="text-sm font-semibold text-white">Comentarios ({comments.length})</h5>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                  {comments.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">No hay comentarios aún</p>
                  ) : (
                    comments.map((comment) => (
                      <div key={comment.id} className="bg-slate-900/50 rounded-lg p-3 border border-slate-800">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-[#26FFDF]">{comment.user_name}</span>
                          {comment.user_role === 'admin' && (
                            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-[10px] px-2 py-0">
                              Admin
                            </Badge>
                          )}
                          <span className="text-[10px] text-slate-600">
                            {new Date(comment.created_at).toLocaleString('es-ES')}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">{comment.content}</p>
                      </div>
                    ))
                  )}
                </div>

                <div className="flex gap-2">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Escribe un comentario..."
                    className="bg-slate-900/50 border-[#08A696]/30 text-slate-200 placeholder:text-slate-600 focus:border-[#08A696] resize-none h-20"
                  />
                  <Button
                    onClick={handleAddComment}
                    disabled={loadingComment || !newComment.trim()}
                    className="bg-gradient-to-r from-[#08A696] to-[#26FFDF] hover:from-[#0a9b8a] hover:to-[#20e6c7] text-white shadow-[0_0_20px_rgba(8,166,150,0.3)] hover:shadow-[0_0_30px_rgba(8,166,150,0.5)] self-end"
                  >
                    {loadingComment ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>

    </motion.div>
  );
}
