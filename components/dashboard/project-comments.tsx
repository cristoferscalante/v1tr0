'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { 
  MessageSquare, 
  Reply, 
  Heart,
  Pin,
  Flag,
  MoreHorizontal,
  Send,
  Paperclip,
  Smile,
  AtSign,
  Hash,
  Filter,
  Search
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Comment {
  id: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
    role: string;
  };
  createdAt: string;
  updatedAt?: string;
  category: 'general' | 'bug' | 'feature' | 'design' | 'technical' | 'feedback';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'resolved' | 'in_progress' | 'closed';
  isPinned: boolean;
  likes: number;
  isLiked: boolean;
  replies: Reply[];
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];
  mentions?: string[];
  tags?: string[];
}

interface Reply {
  id: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
    role: string;
  };
  createdAt: string;
  likes: number;
  isLiked: boolean;
}

interface ProjectCommentsProps {
  projectId?: string;
}

export function ProjectComments({}: ProjectCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      content: 'El diseño de la página principal se ve excelente. Me gusta mucho la paleta de colores elegida y la disposición de los elementos. ¿Podríamos considerar agregar una sección de testimonios?',
      author: {
        name: 'Ana García',
        role: 'Project Manager'
      },
      createdAt: '2024-03-15T10:30:00',
      category: 'design',
      priority: 'medium',
      status: 'open',
      isPinned: true,
      likes: 5,
      isLiked: true,
      replies: [
        {
          id: '1-1',
          content: 'Totalmente de acuerdo con Ana. La sección de testimonios sería una gran adición. Podríamos ubicarla justo antes del footer.',
          author: {
            name: 'Carlos López',
            role: 'UI/UX Designer'
          },
          createdAt: '2024-03-15T11:15:00',
          likes: 2,
          isLiked: false
        },
        {
          id: '1-2',
          content: 'Perfecto, ya tengo algunos testimonios de clientes anteriores que podríamos usar. Los preparo para la próxima iteración.',
          author: {
            name: 'María Rodríguez',
            role: 'Content Manager'
          },
          createdAt: '2024-03-15T14:20:00',
          likes: 3,
          isLiked: true
        }
      ],
      tags: ['diseño', 'homepage', 'testimonios']
    },
    {
      id: '2',
      content: 'He encontrado un bug en el formulario de contacto. Cuando se envía sin completar el campo de email, no se muestra ningún mensaje de error. Esto puede confundir a los usuarios.',
      author: {
        name: 'Juan Pérez',
        role: 'QA Tester'
      },
      createdAt: '2024-03-16T09:45:00',
      category: 'bug',
      priority: 'high',
      status: 'in_progress',
      isPinned: false,
      likes: 3,
      isLiked: false,
      replies: [
        {
          id: '2-1',
          content: 'Gracias por reportar esto, Juan. Ya estoy trabajando en la validación del formulario. Debería estar listo para mañana.',
          author: {
            name: 'Roberto Silva',
            role: 'Frontend Developer'
          },
          createdAt: '2024-03-16T10:30:00',
          likes: 1,
          isLiked: false
        }
      ],
      tags: ['bug', 'formulario', 'validación']
    },
    {
      id: '3',
      content: 'Propongo implementar un sistema de notificaciones push para mantener a los usuarios informados sobre actualizaciones importantes del proyecto.',
      author: {
        name: 'Elena Sánchez',
        role: 'Product Owner'
      },
      createdAt: '2024-03-17T16:20:00',
      category: 'feature',
      priority: 'medium',
      status: 'open',
      isPinned: false,
      likes: 7,
      isLiked: true,
      replies: [],
      tags: ['feature', 'notificaciones', 'ux']
    },
    {
      id: '4',
      content: 'El rendimiento de la aplicación ha mejorado significativamente después de las optimizaciones. Los tiempos de carga se redujeron en un 40%. ¡Excelente trabajo equipo!',
      author: {
        name: 'Pedro Martín',
        role: 'Cliente'
      },
      createdAt: '2024-03-18T11:10:00',
      category: 'feedback',
      priority: 'low',
      status: 'resolved',
      isPinned: false,
      likes: 12,
      isLiked: true,
      replies: [
        {
          id: '4-1',
          content: '¡Gracias Pedro! El equipo de desarrollo trabajó muy duro en esas optimizaciones. Me alegra saber que se nota la diferencia.',
          author: {
            name: 'Ana García',
            role: 'Project Manager'
          },
          createdAt: '2024-03-18T11:45:00',
          likes: 4,
          isLiked: true
        }
      ],
      tags: ['performance', 'optimización', 'feedback']
    }
  ]);

  const [newComment, setNewComment] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('general');
  const [selectedPriority, setSelectedPriority] = useState<string>('medium');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const getCategoryColor = (category: Comment['category']) => {
    switch (category) {
      case 'general': return 'bg-gray-100 text-gray-800';
      case 'bug': return 'bg-red-100 text-red-800';
      case 'feature': return 'bg-blue-100 text-blue-800';
      case 'design': return 'bg-purple-100 text-purple-800';
      case 'technical': return 'bg-green-100 text-green-800';
      case 'feedback': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryText = (category: Comment['category']) => {
    switch (category) {
      case 'general': return 'General';
      case 'bug': return 'Bug';
      case 'feature': return 'Feature';
      case 'design': return 'Diseño';
      case 'technical': return 'Técnico';
      case 'feedback': return 'Feedback';
      default: return 'General';
    }
  };

  const getPriorityColor = (priority: Comment['priority']) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority: Comment['priority']) => {
    switch (priority) {
      case 'low': return 'Baja';
      case 'medium': return 'Media';
      case 'high': return 'Alta';
      case 'urgent': return 'Urgente';
      default: return 'Media';
    }
  };

  const getStatusColor = (status: Comment['status']) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Comment['status']) => {
    switch (status) {
      case 'open': return 'Abierto';
      case 'in_progress': return 'En Progreso';
      case 'resolved': return 'Resuelto';
      case 'closed': return 'Cerrado';
      default: return 'Abierto';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Hace unos minutos';
    } else if (diffInHours < 24) {
      return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) {
        return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
      } else {
        return date.toLocaleDateString('es-ES', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        });
      }
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleLike = (commentId: string, isReply: boolean = false, replyId?: string) => {
    setComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        if (isReply && replyId) {
          return {
            ...comment,
            replies: comment.replies.map(reply => 
              reply.id === replyId 
                ? { ...reply, likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1, isLiked: !reply.isLiked }
                : reply
            )
          };
        } else {
          return {
            ...comment,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
            isLiked: !comment.isLiked
          };
        }
      }
      return comment;
    }));
  };

  const handlePin = (commentId: string) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { ...comment, isPinned: !comment.isPinned }
        : comment
    ));
  };

  const handleAddComment = () => {
    if (!newComment.trim()) {
      return;
    }
    
    const comment: Comment = {
      id: Date.now().toString(),
      content: newComment,
      author: {
        name: 'Usuario Actual',
        role: 'Developer'
      },
      createdAt: new Date().toISOString(),
      category: selectedCategory as Comment['category'],
      priority: selectedPriority as Comment['priority'],
      status: 'open',
      isPinned: false,
      likes: 0,
      isLiked: false,
      replies: []
    };
    
    setComments(prev => [comment, ...prev]);
    setNewComment('');
  };

  const handleAddReply = (commentId: string) => {
    if (!replyContent.trim()) {
      return;
    }
    
    const reply: Reply = {
      id: `${commentId}-${Date.now()}`,
      content: replyContent,
      author: {
        name: 'Usuario Actual',
        role: 'Developer'
      },
      createdAt: new Date().toISOString(),
      likes: 0,
      isLiked: false
    };
    
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { ...comment, replies: [...comment.replies, reply] }
        : comment
    ));
    
    setReplyContent('');
    setReplyingTo(null);
  };

  const filteredComments = comments.filter(comment => {
    const matchesCategory = filterCategory === 'all' || comment.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || comment.status === filterStatus;
    const matchesSearch = searchTerm === '' || 
      comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.author.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const pinnedComments = filteredComments.filter(c => c.isPinned);
  const regularComments = filteredComments.filter(c => !c.isPinned);
  const sortedComments = [...pinnedComments, ...regularComments];

  const totalComments = comments.length;
  const totalReplies = comments.reduce((acc, comment) => acc + comment.replies.length, 0);
  const openComments = comments.filter(c => c.status === 'open').length;
  const resolvedComments = comments.filter(c => c.status === 'resolved').length;

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-center">
            <MessageSquare className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">{totalComments}</p>
            <p className="text-sm text-gray-600">Comentarios</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <Reply className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{totalReplies}</p>
            <p className="text-sm text-gray-600">Respuestas</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <Flag className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-orange-600">{openComments}</p>
            <p className="text-sm text-gray-600">Abiertos</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <Heart className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-600">{resolvedComments}</p>
            <p className="text-sm text-gray-600">Resueltos</p>
          </div>
        </Card>
      </div>

      {/* Nuevo comentario */}
      <Card>
        <CardHeader>
          <CardTitle>Agregar Comentario</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="bug">Bug</SelectItem>
                  <SelectItem value="feature">Feature</SelectItem>
                  <SelectItem value="design">Diseño</SelectItem>
                  <SelectItem value="technical">Técnico</SelectItem>
                  <SelectItem value="feedback">Feedback</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="Prioridad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baja</SelectItem>
                  <SelectItem value="medium">Media</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Textarea
              placeholder="Escribe tu comentario aquí..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={4}
            />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline">
                  <Paperclip className="h-4 w-4 mr-2" />
                  Adjuntar
                </Button>
                <Button size="sm" variant="outline">
                  <Smile className="h-4 w-4 mr-2" />
                  Emoji
                </Button>
                <Button size="sm" variant="outline">
                  <AtSign className="h-4 w-4 mr-2" />
                  Mencionar
                </Button>
              </div>
              
              <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                <Send className="h-4 w-4 mr-2" />
                Publicar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filtros y búsqueda */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar comentarios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="bug">Bug</SelectItem>
                  <SelectItem value="feature">Feature</SelectItem>
                  <SelectItem value="design">Diseño</SelectItem>
                  <SelectItem value="technical">Técnico</SelectItem>
                  <SelectItem value="feedback">Feedback</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="open">Abiertos</SelectItem>
                  <SelectItem value="in_progress">En Progreso</SelectItem>
                  <SelectItem value="resolved">Resueltos</SelectItem>
                  <SelectItem value="closed">Cerrados</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de comentarios */}
      <div className="space-y-4">
        {sortedComments.map((comment) => (
          <Card key={comment.id} className={`${comment.isPinned ? 'border-l-4 border-l-yellow-500' : ''}`}>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* Header del comentario */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                      <AvatarFallback>{getInitials(comment.author.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{comment.author.name}</h4>
                        <Badge variant="outline" className="text-xs">{comment.author.role}</Badge>
                        {comment.isPinned && <Pin className="h-4 w-4 text-yellow-600" />}
                      </div>
                      <p className="text-sm text-gray-500">{formatDate(comment.createdAt)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={getCategoryColor(comment.category)}>
                      {getCategoryText(comment.category)}
                    </Badge>
                    <Badge className={getPriorityColor(comment.priority)}>
                      {getPriorityText(comment.priority)}
                    </Badge>
                    <Badge className={getStatusColor(comment.status)}>
                      {getStatusText(comment.status)}
                    </Badge>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handlePin(comment.id)}>
                          {comment.isPinned ? 'Desfijar' : 'Fijar'}
                        </DropdownMenuItem>
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                        <DropdownMenuItem>Reportar</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Eliminar</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                
                {/* Contenido del comentario */}
                <div className="ml-13">
                  <p className="text-gray-700 mb-3">{comment.content}</p>
                  
                  {/* Tags */}
                  {comment.tags && comment.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {comment.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          <Hash className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {/* Acciones */}
                  <div className="flex items-center gap-4">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => handleLike(comment.id)}
                      className={comment.isLiked ? 'text-red-600' : ''}
                    >
                      <Heart className={`h-4 w-4 mr-1 ${comment.isLiked ? 'fill-current' : ''}`} />
                      {comment.likes}
                    </Button>
                    
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                    >
                      <Reply className="h-4 w-4 mr-1" />
                      Responder
                    </Button>
                    
                    {comment.replies.length > 0 && (
                      <span className="text-sm text-gray-500">
                        {comment.replies.length} respuesta{comment.replies.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  
                  {/* Formulario de respuesta */}
                  {replyingTo === comment.id && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <Textarea
                        placeholder="Escribe tu respuesta..."
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        rows={3}
                        className="mb-3"
                      />
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setReplyingTo(null)}
                        >
                          Cancelar
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleAddReply(comment.id)}
                          disabled={!replyContent.trim()}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Responder
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {/* Respuestas */}
                  {comment.replies.length > 0 && (
                    <div className="mt-4 space-y-3">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={reply.author.avatar} alt={reply.author.name} />
                            <AvatarFallback className="text-xs">
                              {getInitials(reply.author.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h5 className="font-medium text-sm">{reply.author.name}</h5>
                              <Badge variant="outline" className="text-xs">{reply.author.role}</Badge>
                              <span className="text-xs text-gray-500">{formatDate(reply.createdAt)}</span>
                            </div>
                            <p className="text-sm text-gray-700 mb-2">{reply.content}</p>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => handleLike(comment.id, true, reply.id)}
                              className={`text-xs ${reply.isLiked ? 'text-red-600' : ''}`}
                            >
                              <Heart className={`h-3 w-3 mr-1 ${reply.isLiked ? 'fill-current' : ''}`} />
                              {reply.likes}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {sortedComments.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay comentarios</h3>
                <p className="text-gray-500">Sé el primero en comentar en este proyecto.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}