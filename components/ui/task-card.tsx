'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  Calendar, 
  Clock, 
  User, 
  AlertCircle, 
  CheckCircle, 
  Circle, 
  XCircle,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Send
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface TaskCardProps {
  task: {
    id: string
    title: string
    description: string
    status: 'pending' | 'in_progress' | 'completed' | 'blocked'
    priority: 'low' | 'medium' | 'high'
    stage: 'planning' | 'design' | 'development' | 'testing' | 'deployment'
    assigned_to?: string
    due_date: string
    progress?: number
    created_at: string
    updated_at: string
  }
  className?: string
  showProgress?: boolean
  compact?: boolean
}

const statusConfig = {
  pending: {
    label: 'Pendiente',
    color: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    icon: Circle,
    iconColor: 'text-slate-400'
  },
  in_progress: {
    label: 'En Progreso',
    color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    icon: Clock,
    iconColor: 'text-blue-400'
  },
  completed: {
    label: 'Completada',
    color: 'bg-green-500/20 text-green-400 border-green-500/30',
    icon: CheckCircle,
    iconColor: 'text-green-400'
  },
  blocked: {
    label: 'Bloqueada',
    color: 'bg-red-500/20 text-red-400 border-red-500/30',
    icon: XCircle,
    iconColor: 'text-red-400'
  }
}

const priorityConfig = {
  low: {
    label: 'Baja',
    color: 'bg-slate-500/20 text-slate-400 border-slate-500/30'
  },
  medium: {
    label: 'Media',
    color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
  },
  high: {
    label: 'Alta',
    color: 'bg-red-500/20 text-red-400 border-red-500/30'
  }
}

const stageConfig = {
  planning: {
    label: 'Planeación',
    color: 'bg-blue-500/10 text-blue-300'
  },
  design: {
    label: 'Diseño',
    color: 'bg-purple-500/10 text-purple-300'
  },
  development: {
    label: 'Desarrollo',
    color: 'bg-orange-500/10 text-orange-300'
  },
  testing: {
    label: 'Testing',
    color: 'bg-yellow-500/10 text-yellow-300'
  },
  deployment: {
    label: 'Despliegue',
    color: 'bg-green-500/10 text-green-300'
  }
}

export function TaskCard({ 
  task, 
  className, 
  showProgress = true, 
  compact = false 
}: TaskCardProps) {
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [comments, setComments] = useState([
    {
      id: '1',
      content: '¿Podrías revisar los requisitos de esta tarea?',
      author: 'Cliente',
      timestamp: new Date().toISOString(),
      isClient: true
    },
    {
      id: '2', 
      content: 'Por supuesto, revisaré los detalles y te mantendré informado del progreso.',
      author: 'V1tr0',
      timestamp: new Date().toISOString(),
      isClient: false
    }
  ])
  const statusInfo = statusConfig[task.status]
  const priorityInfo = priorityConfig[task.priority]
  const stageInfo = stageConfig[task.stage]
  const StatusIcon = statusInfo.icon

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const isOverdue = new Date(task.due_date) < new Date() && task.status !== 'completed'
  const progress = task.progress || 0

  const handleSendComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now().toString(),
        content: newComment,
        author: 'Cliente',
        timestamp: new Date().toISOString(),
        isClient: true
      }
      setComments([...comments, comment])
      setNewComment('')
    }
  }

  return (
    <Card className={cn(
      "border-slate-700 backdrop-blur-sm transition-all duration-200 hover:bg-[#0f0f0f]/90 rounded-2xl",
      "bg-[#0f0f0f]",
      isOverdue && task.status !== 'completed' && "border-red-500/50",
      compact && "p-2 sm:p-3",
      className
    )}>
      <CardHeader className={cn("pb-3", compact && "pb-2")}>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start space-x-3 flex-1 min-w-0">
            <StatusIcon className={cn("h-5 w-5 mt-0.5 flex-shrink-0", statusInfo.iconColor)} />
            <div className="flex-1 min-w-0">
              <CardTitle className={cn(
                "text-white leading-tight",
                compact ? "text-sm" : "text-base sm:text-base"
              )}>
                {task.title}
              </CardTitle>
              {!compact && (
                <CardDescription className="text-slate-400 mt-1 line-clamp-2 text-xs sm:text-sm">
                  {task.description}
                </CardDescription>
              )}
            </div>
          </div>
          
          {/* Priority Badge */}
          <Badge className={cn("ml-2 flex-shrink-0 text-xs", priorityInfo.color)}>
            <span className="hidden sm:inline">{priorityInfo.label}</span>
            <span className="sm:hidden">{priorityInfo.label.slice(0, 1)}</span>
          </Badge>
        </div>

        {/* Status and Stage Badges */}
        <div className="flex items-center gap-2 mt-3">
          <Badge className={statusInfo.color}>
            {statusInfo.label}
          </Badge>
          <Badge variant="outline" className={stageInfo.color}>
            {stageInfo.label}
          </Badge>
          {isOverdue && (
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
              <AlertCircle className="h-3 w-3 mr-1" />
              Vencida
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className={cn("space-y-3", compact && "space-y-2")}>
        {/* Progress Bar */}
        {showProgress && task.status === 'in_progress' && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-slate-400">Progreso</span>
              <span className="text-[#26FFDF] font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-1.5 sm:h-2" />
          </div>
        )}

        {/* Task Details */}
        <div className={cn(
          "grid gap-2 sm:gap-3 text-xs sm:text-sm",
          compact ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"
        )}>
          {/* Due Date */}
          <div className={cn(
            "flex items-center",
            isOverdue && "text-red-400",
            !isOverdue && "text-slate-400"
          )}>
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
            <span className="truncate">
              <span className="hidden sm:inline">Vence: </span>{formatDate(task.due_date)}
            </span>
          </div>

          {/* Assigned To */}
          {task.assigned_to && (
            <div className="flex items-center text-slate-400">
              <User className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
              <span className="truncate">
                <span className="hidden sm:inline">Asignado a: </span>{task.assigned_to}
              </span>
            </div>
          )}
        </div>

        {/* Timestamps */}
        {!compact && (
          <div className="pt-2 border-t border-slate-700">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-500">
              <div>
                Creado: {formatDate(task.created_at)}
              </div>
              <div>
                Actualizado: {formatDate(task.updated_at)}
              </div>
            </div>
          </div>
        )}

        {/* Comments Toggle Button */}
        <div className="pt-2 border-t border-slate-700">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="w-full text-[#26FFDF] hover:text-[#26FFDF]/80 hover:bg-[#26FFDF]/10 transition-colors"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            {showComments ? (
              <>
                Ocultar Comentarios
                <ChevronUp className="h-4 w-4 ml-2" />
              </>
            ) : (
              <>
                Ver Comentarios ({comments.length})
                <ChevronDown className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>

        {/* Expandable Comments Panel */}
        {showComments && (
          <div className="mt-4 pt-4 border-t border-slate-700 space-y-4">
            {/* Comments List */}
            <div className="max-h-60 overflow-y-auto space-y-3">
              {comments.map((comment) => (
                <div key={comment.id} className={`flex space-x-3 ${comment.isClient ? 'justify-end' : 'justify-start'}`}>
                  {!comment.isClient && (
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className="bg-[#08A696]/20 text-[#26FFDF] text-xs">
                        V1
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className={`max-w-xs ${comment.isClient ? 'order-first' : ''}`}>
                    <div className={`rounded-2xl px-4 py-3 ${
                      comment.isClient 
                        ? 'bg-[#08A696] text-white' 
                        : 'bg-slate-700 text-white'
                    }`}>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 px-2">
                      {comment.author} • {new Date(comment.timestamp).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>

                  {comment.isClient && (
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className="bg-[#26FFDF]/20 text-[#08A696] text-xs">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </div>

            {/* New Comment Input */}
            <div className="flex space-x-2">
              <Input
                placeholder="Escribe tu comentario..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendComment()}
                className="flex-1 bg-slate-800 border-slate-600 text-white placeholder-slate-400"
              />
              <Button
                onClick={handleSendComment}
                size="sm"
                className="bg-[#08A696] hover:bg-[#08A696]/80 text-white"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default TaskCard