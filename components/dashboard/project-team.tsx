'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Mail, 
  Phone, 
  MapPin,
  Calendar,
  Clock,
  Star,
  Plus,
  MoreHorizontal,
  User,
  Users
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone?: string;
  location: string;
  joinedAt: string;
  status: 'active' | 'inactive' | 'vacation';
  avatar?: string;
  skills: string[];
  workload: number; // Porcentaje de carga de trabajo
  rating: number; // Calificación de 1 a 5
}

interface ProjectTeamProps {
  projectId?: string;
}

export function ProjectTeam({}: ProjectTeamProps) {
  // En un entorno real, estos datos vendrían de una API
  const [teamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'Ana García',
      role: 'Project Manager',
      department: 'Gestión de Proyectos',
      email: 'ana.garcia@empresa.com',
      phone: '+34 600 123 456',
      location: 'Madrid, España',
      joinedAt: '2024-01-15',
      status: 'active',
      skills: ['Gestión de Proyectos', 'Scrum', 'Liderazgo'],
      workload: 85,
      rating: 4.8
    },
    {
      id: '2',
      name: 'Carlos López',
      role: 'UI/UX Designer',
      department: 'Diseño',
      email: 'carlos.lopez@empresa.com',
      phone: '+34 600 234 567',
      location: 'Barcelona, España',
      joinedAt: '2024-02-01',
      status: 'active',
      skills: ['Figma', 'Adobe XD', 'Prototipado', 'Design Systems'],
      workload: 70,
      rating: 4.9
    },
    {
      id: '3',
      name: 'María Rodríguez',
      role: 'Backend Developer',
      department: 'Desarrollo',
      email: 'maria.rodriguez@empresa.com',
      location: 'Valencia, España',
      joinedAt: '2024-02-15',
      status: 'active',
      skills: ['Node.js', 'Python', 'PostgreSQL', 'AWS'],
      workload: 90,
      rating: 4.7
    },
    {
      id: '4',
      name: 'Juan Pérez',
      role: 'Frontend Developer',
      department: 'Desarrollo',
      email: 'juan.perez@empresa.com',
      phone: '+34 600 456 789',
      location: 'Sevilla, España',
      joinedAt: '2024-03-01',
      status: 'active',
      skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
      workload: 75,
      rating: 4.6
    },
    {
      id: '5',
      name: 'Elena Sánchez',
      role: 'QA Engineer',
      department: 'Calidad',
      email: 'elena.sanchez@empresa.com',
      location: 'Bilbao, España',
      joinedAt: '2024-04-01',
      status: 'vacation',
      skills: ['Testing', 'Selenium', 'Jest', 'Cypress'],
      workload: 60,
      rating: 4.5
    },
    {
      id: '6',
      name: 'Roberto Silva',
      role: 'DevOps Engineer',
      department: 'Infraestructura',
      email: 'roberto.silva@empresa.com',
      phone: '+34 600 678 901',
      location: 'Zaragoza, España',
      joinedAt: '2024-04-15',
      status: 'active',
      skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
      workload: 80,
      rating: 4.8
    }
  ]);

  const getStatusColor = (status: TeamMember['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'vacation': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: TeamMember['status']) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'vacation': return 'Vacaciones';
      case 'inactive': return 'Inactivo';
      default: return 'Desconocido';
    }
  };

  const getWorkloadColor = (workload: number) => {
    if (workload >= 90) {
      return 'text-red-600';
    }
    if (workload >= 75) {
      return 'text-yellow-600';
    }
    return 'text-green-600';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const activeMembers = teamMembers.filter(member => member.status === 'active');
  const averageWorkload = teamMembers.reduce((acc, member) => acc + member.workload, 0) / teamMembers.length;
  const averageRating = teamMembers.reduce((acc, member) => acc + member.rating, 0) / teamMembers.length;

  return (
    <div className="space-y-6">
      {/* Estadísticas del equipo */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-center">
            <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">{teamMembers.length}</p>
            <p className="text-sm text-gray-600">Total Miembros</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <User className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{activeMembers.length}</p>
            <p className="text-sm text-gray-600">Activos</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-orange-600">{Math.round(averageWorkload)}%</p>
            <p className="text-sm text-gray-600">Carga Promedio</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-yellow-600">{averageRating.toFixed(1)}</p>
            <p className="text-sm text-gray-600">Rating Promedio</p>
          </div>
        </Card>
      </div>

      {/* Lista de miembros del equipo */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Miembros del Equipo</CardTitle>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Miembro
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamMembers.map((member) => (
              <Card key={member.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{member.name}</h3>
                        <Badge className={getStatusColor(member.status)}>
                          {getStatusText(member.status)}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-gray-900">{member.role}</p>
                          <p className="text-gray-600">{member.department}</p>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">{member.email}</span>
                          </div>
                          {member.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600">{member.phone}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">{member.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">Desde {formatDate(member.joinedAt)}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Habilidades */}
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">Habilidades:</p>
                        <div className="flex flex-wrap gap-1">
                          {member.skills.map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      {/* Métricas */}
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Carga de Trabajo</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${member.workload}%` }}
                              />
                            </div>
                            <span className={`text-sm font-medium ${getWorkloadColor(member.workload)}`}>
                              {member.workload}%
                            </span>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-700">Calificación</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex">
                              {renderStars(member.rating)}
                            </div>
                            <span className="text-sm font-medium text-gray-600">
                              {member.rating.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Ver Perfil</DropdownMenuItem>
                      <DropdownMenuItem>Enviar Mensaje</DropdownMenuItem>
                      <DropdownMenuItem>Asignar Tarea</DropdownMenuItem>
                      <DropdownMenuItem>Editar Rol</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Remover del Proyecto</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}