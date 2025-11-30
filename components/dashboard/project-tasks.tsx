'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  User, 
  Calendar, 
  MessageSquare, 
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle,
  Circle,
  Loader2,
  Send
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
import { supabaseProjectsDB, Task, MeetingTask } from '@/lib/supabase-projects-db';

// ============================================================
// TIPOS
// ============================================================

type TaskStatus = 'pendiente' | 'en progreso' | 'completada';
type MeetingTaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

interface TaskComment {
  id: string;
  content: string;
  user_name: string;
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
  const [tasks, setTasks] = useState<Task[]>([]);
  const [meetingTasks, setMeetingTasks] = useState<MeetingTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | TaskStatus>('all');

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    const [projectTasks, projectMeetingTasks] = await Promise.all([
      supabaseProjectsDB.getTasksByProject(projectId),
      supabaseProjectsDB.getMeetingTasksByProject(projectId)
    ]);
    setTasks(projectTasks);
    setMeetingTasks(projectMeetingTasks);
    setLoading(false);
  }, [projectId]);

  useEffect(() => {
    fetchTasks();

    // Suscribirse a cambios en tiempo real
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
      fetchTasks();
      onTaskUpdate?.();
    }
  };

  const handleMeetingTaskStatusChange = async (taskId: string, newStatus: MeetingTaskStatus) => {
    const result = await supabaseProjectsDB.updateMeetingTask(taskId, {
      status: newStatus
    });
    if (result) {
      fetchTasks();
      onTaskUpdate?.();
    }
  };

  // Filtrar tareas
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

  // Estadísticas
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
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="col-span-2 p-4 bg-background/10 border-[#08A696]/20 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Progreso General</span>
            <span className="text-lg font-bold text-[#26FFDF]">{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </Card>

        <Card className="p-4 bg-background/10 border-[#08A696]/20 rounded-2xl text-center">
          <p className="text-2xl font-bold text-[#26FFDF]">{stats.completed}</p>
          <p className="text-xs text-slate-400">Completadas</p>
        </Card>

        <Card className="p-4 bg-background/10 border-[#08A696]/20 rounded-2xl text-center">
          <p className="text-2xl font-bold text-blue-400">{stats.inProgress}</p>
          <p className="text-xs text-slate-400">En Progreso</p>
        </Card>

        <Card className="p-4 bg-background/10 border-[#08A696]/20 rounded-2xl text-center">
          <p className="text-2xl font-bold text-slate-400">{stats.pending}</p>
          <p className="text-xs text-slate-400">Pendientes</p>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-400">Filtrar:</span>
        {(['all', 'pendiente', 'en progreso', 'completada'] as const).map((status) => (
          <Button
            key={status}
            size="sm"
            variant={filter === status ? 'default' : 'outline'}
            onClick={() => setFilter(status)}
            className={`rounded-xl transition-all ${
              filter === status
                ? 'bg-gradient-to-r from-[#08A696] to-[#26FFDF] text-slate-900'
                : 'bg-background/10 border-[#08A696]/30 text-[#26FFDF] hover:bg-background/20'
            }`}
          >
            {status === 'all' ? 'Todas' : status.charAt(0).toUpperCase() + status.slice(1)}
          </Button>
        ))}
      </div>

      {/* Lista de tareas */}
      <div className="space-y-4">
        {/* Tareas de reuniones */}
        {filteredMeetingTasks.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-400 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Tareas de Reuniones ({filteredMeetingTasks.length})
            </h3>
            <AnimatePresence>
              {filteredMeetingTasks.map((task) => (
                <MeetingTaskCard
                  key={task.id}
                  task={task}
                  onStatusChange={handleMeetingTaskStatusChange}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Tareas del proyecto */}
        {filteredTasks.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-400 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Tareas del Proyecto ({filteredTasks.length})
            </h3>
            <AnimatePresence>
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onStatusChange={handleTaskStatusChange}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Sin tareas */}
        {filteredTasks.length === 0 && filteredMeetingTasks.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <Circle className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No hay tareas {filter !== 'all' ? `con estado "${filter}"` : ''}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// CARD DE TAREA DE PROYECTO
// ============================================================

interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
}

function TaskCard({ task, onStatusChange }: TaskCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [comments, setComments] = useState<TaskComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComment, setLoadingComment] = useState(false);

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'completada': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'en progreso': return <Clock className="h-5 w-5 text-blue-500" />;
      default: return <Circle className="h-5 w-5 text-slate-400" />;
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'completada': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'en progreso': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'media': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'planeacion': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      'diseño': 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
      'desarrollo': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'testing': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
      'despliegue': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      return;
    }
    setLoadingComment(true);
    // Simular agregar comentario (en producción conectar a Supabase)
    const comment: TaskComment = {
      id: Date.now().toString(),
      content: newComment,
      user_name: 'Usuario',
      created_at: new Date().toISOString()
    };
    setComments(prev => [...prev, comment]);
    setNewComment('');
    setLoadingComment(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
    >
      <Card className={`p-4 bg-background/10 border-[#08A696]/20 rounded-2xl transition-all hover:bg-background/20 ${
        task.estado === 'completada' ? 'opacity-70' : ''
      }`}>
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1">
              {getStatusIcon(task.estado)}
              <div className="flex-1 min-w-0">
                <h4 className={`font-semibold text-white ${
                  task.estado === 'completada' ? 'line-through opacity-70' : ''
                }`}>
                  {task.nombre}
                </h4>
                {task.descripcion && (
                  <p className="text-sm text-slate-400 mt-1 line-clamp-2">
                    {task.descripcion}
                  </p>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              className="shrink-0 text-slate-400 hover:text-[#26FFDF]"
            >
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge className={getStatusColor(task.estado)}>
              {task.estado}
            </Badge>
            <Badge className={getPriorityColor(task.prioridad)}>
              {task.prioridad}
            </Badge>
            <Badge className={getCategoryColor(task.categoria)}>
              {task.categoria}
            </Badge>
          </div>

          {/* Metadata */}
          <div className="flex items-center gap-4 text-xs text-slate-500">
            {task.fecha_inicio && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(task.fecha_inicio).toLocaleDateString('es-ES')}
              </span>
            )}
            {task.fecha_final && (
              <span className="flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Vence: {new Date(task.fecha_final).toLocaleDateString('es-ES')}
              </span>
            )}
          </div>

          {/* Contenido expandido */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4 border-t border-[#08A696]/20 space-y-4">
                  {/* Cambiar estado */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-400">Cambiar estado:</span>
                    <Select
                      value={task.estado}
                      onValueChange={(value) => onStatusChange(task.id, value as TaskStatus)}
                    >
                      <SelectTrigger className="w-40 h-8 text-xs bg-background/50 border-[#08A696]/30 rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background/95 backdrop-blur-xl border-[#08A696]/30">
                        <SelectItem value="pendiente">Pendiente</SelectItem>
                        <SelectItem value="en progreso">En Progreso</SelectItem>
                        <SelectItem value="completada">Completada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Observaciones */}
                  {task.observaciones && (
                    <div>
                      <span className="text-sm font-medium text-slate-400">Observaciones:</span>
                      <p className="text-sm text-slate-300 mt-1">{task.observaciones}</p>
                    </div>
                  )}

                  {/* Comentarios */}
                  <div className="space-y-3">
                    <span className="text-sm font-medium text-slate-400 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Comentarios ({comments.length})
                    </span>
                    
                    {comments.map((comment) => (
                      <div key={comment.id} className="pl-4 border-l-2 border-[#08A696]/30">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <User className="h-3 w-3" />
                          <span>{comment.user_name}</span>
                          <span>•</span>
                          <span>{new Date(comment.created_at).toLocaleString('es-ES')}</span>
                        </div>
                        <p className="text-sm text-slate-300 mt-1">{comment.content}</p>
                      </div>
                    ))}

                    {/* Agregar comentario */}
                    <div className="flex gap-2">
                      <Textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Agregar comentario..."
                        className="min-h-[60px] text-sm bg-background/50 border-[#08A696]/30 rounded-lg resize-none"
                      />
                      <Button
                        size="sm"
                        onClick={handleAddComment}
                        disabled={!newComment.trim() || loadingComment}
                        className="h-auto bg-gradient-to-r from-[#08A696] to-[#26FFDF] text-slate-900 rounded-lg"
                      >
                        {loadingComment ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
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
// CARD DE TAREA DE REUNIÓN
// ============================================================

interface MeetingTaskCardProps {
  task: MeetingTask;
  onStatusChange: (taskId: string, status: MeetingTaskStatus) => void;
}

function MeetingTaskCard({ task, onStatusChange }: MeetingTaskCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [comments, setComments] = useState<TaskComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComment, setLoadingComment] = useState(false);

  const getStatusIcon = (status: MeetingTaskStatus) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in_progress': return <Clock className="h-5 w-5 text-blue-500" />;
      case 'cancelled': return <AlertCircle className="h-5 w-5 text-red-500" />;
      default: return <Circle className="h-5 w-5 text-slate-400" />;
    }
  };

  const getStatusColor = (status: MeetingTaskStatus) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getStatusText = (status: MeetingTaskStatus) => {
    switch (status) {
      case 'completed': return 'Completada';
      case 'in_progress': return 'En Progreso';
      case 'cancelled': return 'Cancelada';
      default: return 'Pendiente';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
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

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      return;
    }
    setLoadingComment(true);
    const comment: TaskComment = {
      id: Date.now().toString(),
      content: newComment,
      user_name: 'Usuario',
      created_at: new Date().toISOString()
    };
    setComments(prev => [...prev, comment]);
    setNewComment('');
    setLoadingComment(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
    >
      <Card className={`p-4 bg-background/10 border-[#08A696]/20 rounded-2xl transition-all hover:bg-background/20 border-l-4 border-l-[#26FFDF] ${
        task.status === 'completed' ? 'opacity-70' : ''
      }`}>
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1">
              {getStatusIcon(task.status)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs border-[#26FFDF]/50 text-[#26FFDF]">
                    De Reunión
                  </Badge>
                </div>
                <h4 className={`font-semibold text-white mt-1 ${
                  task.status === 'completed' ? 'line-through opacity-70' : ''
                }`}>
                  {task.title}
                </h4>
                {task.description && (
                  <p className="text-sm text-slate-400 mt-1 line-clamp-2">
                    {task.description}
                  </p>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              className="shrink-0 text-slate-400 hover:text-[#26FFDF]"
            >
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge className={getStatusColor(task.status)}>
              {getStatusText(task.status)}
            </Badge>
            <Badge className={getPriorityColor(task.priority)}>
              {getPriorityText(task.priority)}
            </Badge>
            {task.category && (
              <Badge variant="outline" className="border-slate-500 text-slate-400">
                {task.category}
              </Badge>
            )}
          </div>

          {/* Metadata */}
          <div className="flex items-center gap-4 text-xs text-slate-500">
            {task.due_date && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Vence: {new Date(task.due_date).toLocaleDateString('es-ES')}
              </span>
            )}
            {task.assigned_to && (
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {task.assigned_to}
              </span>
            )}
            {task.estimated_hours && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {task.estimated_hours}h estimadas
              </span>
            )}
          </div>

          {/* Contenido expandido */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4 border-t border-[#08A696]/20 space-y-4">
                  {/* Cambiar estado */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-400">Cambiar estado:</span>
                    <Select
                      value={task.status}
                      onValueChange={(value) => onStatusChange(task.id, value as MeetingTaskStatus)}
                    >
                      <SelectTrigger className="w-40 h-8 text-xs bg-background/50 border-[#08A696]/30 rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background/95 backdrop-blur-xl border-[#08A696]/30">
                        <SelectItem value="pending">Pendiente</SelectItem>
                        <SelectItem value="in_progress">En Progreso</SelectItem>
                        <SelectItem value="completed">Completada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Tags */}
                  {task.tags && task.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {task.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs border-[#08A696]/30 text-slate-400">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Comentarios */}
                  <div className="space-y-3">
                    <span className="text-sm font-medium text-slate-400 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Comentarios ({comments.length})
                    </span>
                    
                    {comments.map((comment) => (
                      <div key={comment.id} className="pl-4 border-l-2 border-[#08A696]/30">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <User className="h-3 w-3" />
                          <span>{comment.user_name}</span>
                          <span>•</span>
                          <span>{new Date(comment.created_at).toLocaleString('es-ES')}</span>
                        </div>
                        <p className="text-sm text-slate-300 mt-1">{comment.content}</p>
                      </div>
                    ))}

                    {/* Agregar comentario */}
                    <div className="flex gap-2">
                      <Textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Agregar comentario..."
                        className="min-h-[60px] text-sm bg-background/50 border-[#08A696]/30 rounded-lg resize-none"
                      />
                      <Button
                        size="sm"
                        onClick={handleAddComment}
                        disabled={!newComment.trim() || loadingComment}
                        className="h-auto bg-gradient-to-r from-[#08A696] to-[#26FFDF] text-slate-900 rounded-lg"
                      >
                        {loadingComment ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </motion.div>
  );
}
