'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Calendar, 
  Clock, 
  Video,

  MapPin,
  Plus,
  Play,
  FileText,

  MoreHorizontal,
  CalendarDays
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Meeting {
  id: string;
  title: string;
  description: string;
  type: 'planning' | 'review' | 'standup' | 'demo' | 'retrospective';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  startTime: string;
  endTime: string;
  duration: number; // en minutos
  location?: string;
  meetingUrl?: string;
  organizer: {
    name: string;
    avatar?: string;
  };
  attendees: {
    name: string;
    avatar?: string;
    status: 'accepted' | 'declined' | 'pending';
  }[];
  agenda?: string[];
  recording?: {
    url: string;
    duration: string;
  };
  notes?: string;
}

interface ProjectMeetingsProps {
  projectId?: string;
}

export function ProjectMeetings({}: ProjectMeetingsProps) {
  // En un entorno real, estos datos vendrían de una API
  const [meetings] = useState<Meeting[]>([
    {
      id: '1',
      title: 'Kickoff del Proyecto',
      description: 'Reunión inicial para definir objetivos y alcance del proyecto',
      type: 'planning',
      status: 'completed',
      startTime: '2024-01-15T09:00:00',
      endTime: '2024-01-15T10:30:00',
      duration: 90,
      location: 'Sala de Conferencias A',
      organizer: {
        name: 'Ana García'
      },
      attendees: [
        { name: 'Carlos López', status: 'accepted' },
        { name: 'María Rodríguez', status: 'accepted' },
        { name: 'Juan Pérez', status: 'accepted' },
        { name: 'Elena Sánchez', status: 'accepted' }
      ],
      agenda: [
        'Presentación del equipo',
        'Revisión de objetivos',
        'Definición de metodología',
        'Planificación inicial'
      ],
      recording: {
        url: '#',
        duration: '1h 25m'
      },
      notes: 'Se definieron los objetivos principales y se estableció la metodología Scrum para el desarrollo.'
    },
    {
      id: '2',
      title: 'Revisión de Diseños UI/UX',
      description: 'Presentación y feedback de los mockups iniciales',
      type: 'review',
      status: 'completed',
      startTime: '2024-02-05T14:00:00',
      endTime: '2024-02-05T15:00:00',
      duration: 60,
      meetingUrl: 'https://meet.google.com/abc-defg-hij',
      organizer: {
        name: 'Carlos López'
      },
      attendees: [
        { name: 'Ana García', status: 'accepted' },
        { name: 'Juan Pérez', status: 'accepted' },
        { name: 'Cliente - Pedro Martín', status: 'accepted' }
      ],
      agenda: [
        'Presentación de wireframes',
        'Revisión de flujos de usuario',
        'Feedback del cliente',
        'Próximos pasos'
      ],
      recording: {
        url: '#',
        duration: '58m'
      }
    },
    {
      id: '3',
      title: 'Daily Standup',
      description: 'Reunión diaria de seguimiento del equipo de desarrollo',
      type: 'standup',
      status: 'completed',
      startTime: '2024-03-15T09:00:00',
      endTime: '2024-03-15T09:15:00',
      duration: 15,
      meetingUrl: 'https://meet.google.com/daily-standup',
      organizer: {
        name: 'Ana García'
      },
      attendees: [
        { name: 'María Rodríguez', status: 'accepted' },
        { name: 'Juan Pérez', status: 'accepted' },
        { name: 'Roberto Silva', status: 'accepted' }
      ],
      agenda: [
        'Qué hice ayer',
        'Qué haré hoy',
        'Impedimentos'
      ]
    },
    {
      id: '4',
      title: 'Demo Sprint 2',
      description: 'Demostración de funcionalidades desarrolladas en el Sprint 2',
      type: 'demo',
      status: 'scheduled',
      startTime: '2024-04-20T16:00:00',
      endTime: '2024-04-20T17:00:00',
      duration: 60,
      meetingUrl: 'https://meet.google.com/demo-sprint2',
      organizer: {
        name: 'Ana García'
      },
      attendees: [
        { name: 'Carlos López', status: 'accepted' },
        { name: 'María Rodríguez', status: 'accepted' },
        { name: 'Juan Pérez', status: 'accepted' },
        { name: 'Cliente - Pedro Martín', status: 'pending' },
        { name: 'Elena Sánchez', status: 'accepted' }
      ],
      agenda: [
        'Demo de nuevas funcionalidades',
        'Feedback del cliente',
        'Planificación Sprint 3'
      ]
    },
    {
      id: '5',
      title: 'Retrospectiva Sprint 2',
      description: 'Análisis del sprint completado y mejoras para el siguiente',
      type: 'retrospective',
      status: 'scheduled',
      startTime: '2024-04-21T10:00:00',
      endTime: '2024-04-21T11:30:00',
      duration: 90,
      location: 'Sala de Conferencias B',
      organizer: {
        name: 'Ana García'
      },
      attendees: [
        { name: 'Carlos López', status: 'accepted' },
        { name: 'María Rodríguez', status: 'accepted' },
        { name: 'Juan Pérez', status: 'accepted' },
        { name: 'Roberto Silva', status: 'accepted' },
        { name: 'Elena Sánchez', status: 'pending' }
      ],
      agenda: [
        'Qué funcionó bien',
        'Qué se puede mejorar',
        'Acciones para el próximo sprint'
      ]
    }
  ]);

  const getMeetingTypeColor = (type: Meeting['type']) => {
    switch (type) {
      case 'planning': return 'bg-blue-100 text-blue-800';
      case 'review': return 'bg-purple-100 text-purple-800';
      case 'standup': return 'bg-green-100 text-green-800';
      case 'demo': return 'bg-orange-100 text-orange-800';
      case 'retrospective': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMeetingTypeText = (type: Meeting['type']) => {
    switch (type) {
      case 'planning': return 'Planificación';
      case 'review': return 'Revisión';
      case 'standup': return 'Daily';
      case 'demo': return 'Demo';
      case 'retrospective': return 'Retrospectiva';
      default: return 'Reunión';
    }
  };

  const getStatusColor = (status: Meeting['status']) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Meeting['status']) => {
    switch (status) {
      case 'scheduled': return 'Programada';
      case 'in_progress': return 'En Curso';
      case 'completed': return 'Completada';
      case 'cancelled': return 'Cancelada';
      default: return 'Desconocido';
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getAttendeeStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'text-green-600';
      case 'declined': return 'text-red-600';
      case 'pending': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const upcomingMeetings = meetings.filter(m => m.status === 'scheduled');
  const completedMeetings = meetings.filter(m => m.status === 'completed');
  const totalDuration = meetings.reduce((acc, meeting) => acc + meeting.duration, 0);

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-center">
            <CalendarDays className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">{meetings.length}</p>
            <p className="text-sm text-gray-600">Total Reuniones</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <Calendar className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{upcomingMeetings.length}</p>
            <p className="text-sm text-gray-600">Próximas</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-600">{Math.round(totalDuration / 60)}h</p>
            <p className="text-sm text-gray-600">Tiempo Total</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <Video className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-orange-600">
              {meetings.filter(m => m.recording).length}
            </p>
            <p className="text-sm text-gray-600">Grabaciones</p>
          </div>
        </Card>
      </div>

      {/* Próximas reuniones */}
      {upcomingMeetings.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Próximas Reuniones</CardTitle>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nueva Reunión
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingMeetings.map((meeting) => {
                const startDateTime = formatDateTime(meeting.startTime);
                const endDateTime = formatDateTime(meeting.endTime);
                
                return (
                  <Card key={meeting.id} className="p-4 border-l-4 border-l-blue-500">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{meeting.title}</h3>
                          <Badge className={getMeetingTypeColor(meeting.type)}>
                            {getMeetingTypeText(meeting.type)}
                          </Badge>
                          <Badge className={getStatusColor(meeting.status)}>
                            {getStatusText(meeting.status)}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600 mb-3">{meeting.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span>{startDateTime.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span>{startDateTime.time} - {endDateTime.time}</span>
                            </div>
                            {meeting.location && (
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-gray-400" />
                                <span>{meeting.location}</span>
                              </div>
                            )}
                            {meeting.meetingUrl && (
                              <div className="flex items-center gap-2">
                                <Video className="h-4 w-4 text-gray-400" />
                                <a href={meeting.meetingUrl} className="text-blue-600 hover:underline">
                                  Unirse a la reunión
                                </a>
                              </div>
                            )}
                          </div>
                          
                          <div>
                            <p className="font-medium mb-2">Asistentes ({meeting.attendees.length})</p>
                            <div className="flex flex-wrap gap-1">
                              {meeting.attendees.slice(0, 5).map((attendee, index) => (
                                <div key={index} className="flex items-center gap-1">
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage src={attendee.avatar} alt={attendee.name} />
                                    <AvatarFallback className="text-xs">
                                      {getInitials(attendee.name)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className={`text-xs ${getAttendeeStatusColor(attendee.status)}`}>
                                    {attendee.name.split(' ')[0]}
                                  </span>
                                </div>
                              ))}
                              {meeting.attendees.length > 5 && (
                                <span className="text-xs text-gray-500">
                                  +{meeting.attendees.length - 5} más
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {meeting.agenda && (
                          <div>
                            <p className="font-medium text-sm mb-2">Agenda:</p>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {meeting.agenda.map((item, index) => (
                                <li key={index} className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {meeting.meetingUrl && (
                          <Button size="sm">
                            <Play className="h-4 w-4 mr-2" />
                            Unirse
                          </Button>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>Editar</DropdownMenuItem>
                            <DropdownMenuItem>Duplicar</DropdownMenuItem>
                            <DropdownMenuItem>Exportar</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Cancelar</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Historial de reuniones */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Reuniones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {completedMeetings.map((meeting) => {
              const startDateTime = formatDateTime(meeting.startTime);
              
              return (
                <Card key={meeting.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{meeting.title}</h3>
                        <Badge className={getMeetingTypeColor(meeting.type)}>
                          {getMeetingTypeText(meeting.type)}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <span>{startDateTime.date}</span>
                        <span>•</span>
                        <span>{meeting.duration} min</span>
                        <span>•</span>
                        <span>{meeting.attendees.length} asistentes</span>
                      </div>
                      
                      {meeting.notes && (
                        <p className="text-sm text-gray-600 mb-2">{meeting.notes}</p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {meeting.recording && (
                        <Button size="sm" variant="outline">
                          <Play className="h-4 w-4 mr-2" />
                          Ver Grabación
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <FileText className="h-4 w-4 mr-2" />
                        Notas
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>Ver Detalles</DropdownMenuItem>
                          <DropdownMenuItem>Descargar Grabación</DropdownMenuItem>
                          <DropdownMenuItem>Exportar Notas</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}