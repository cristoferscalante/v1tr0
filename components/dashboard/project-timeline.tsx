"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays, CheckCircle, Clock, FileText, Users } from "lucide-react"

interface ProjectTimelineProps {
  projectId?: string
}

export function ProjectTimeline({ projectId }: ProjectTimelineProps) {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})

  const toggleItem = (id: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  // Datos de ejemplo para la línea de tiempo
  const timelineItems = [
    {
      id: "1",
      date: "15 Mar 2023",
      title: "Inicio del Proyecto",
      description: "Reunión inicial con el cliente para definir los objetivos y alcance del proyecto.",
      type: "milestone",
      status: "completed",
      assignee: {
        name: "María González",
        avatar: "/team/maria.jpg",
        initials: "MG",
      },
      icon: <FileText className="h-5 w-5" />,
    },
    {
      id: "2",
      date: "22 Mar 2023",
      title: "Análisis de Requisitos",
      description:
        "Recopilación y análisis de los requisitos funcionales y no funcionales del sistema. Definición de historias de usuario y casos de uso.",
      type: "phase",
      status: "completed",
      assignee: {
        name: "Carlos Rodríguez",
        avatar: "/team/carlos.jpg",
        initials: "CR",
      },
      icon: <FileText className="h-5 w-5" />,
    },
    {
      id: "3",
      date: "10 Abr 2023",
      title: "Diseño de UI/UX",
      description:
        "Creación de wireframes, mockups y prototipos interactivos. Validación del diseño con el cliente y ajustes según feedback.",
      type: "phase",
      status: "completed",
      assignee: {
        name: "Ana López",
        avatar: "/team/ana.jpg",
        initials: "AL",
      },
      icon: <FileText className="h-5 w-5" />,
    },
    {
      id: "4",
      date: "05 May 2023",
      title: "Desarrollo Frontend",
      description:
        "Implementación de la interfaz de usuario utilizando React y Next.js. Desarrollo de componentes reutilizables y responsive.",
      type: "phase",
      status: "in-progress",
      assignee: {
        name: "Juan Pérez",
        avatar: "/team/juan.jpg",
        initials: "JP",
      },
      icon: <Clock className="h-5 w-5" />,
    },
    {
      id: "5",
      date: "20 May 2023",
      title: "Desarrollo Backend",
      description:
        "Implementación de la API REST, modelos de datos y lógica de negocio. Integración con bases de datos y servicios externos.",
      type: "phase",
      status: "in-progress",
      assignee: {
        name: "Pedro Sánchez",
        avatar: "/team/pedro.jpg",
        initials: "PS",
      },
      icon: <Clock className="h-5 w-5" />,
    },
    {
      id: "6",
      date: "15 Jun 2023",
      title: "Reunión de Seguimiento",
      description: "Presentación del avance del proyecto al cliente. Revisión de objetivos y ajustes de planificación.",
      type: "meeting",
      status: "scheduled",
      assignee: {
        name: "María González",
        avatar: "/team/maria.jpg",
        initials: "MG",
      },
      icon: <CalendarDays className="h-5 w-5" />,
    },
    {
      id: "7",
      date: "10 Jul 2023",
      title: "Pruebas de Integración",
      description:
        "Realización de pruebas de integración entre los diferentes módulos del sistema. Identificación y corrección de errores.",
      type: "phase",
      status: "pending",
      assignee: {
        name: "Laura Martínez",
        avatar: "/team/laura.jpg",
        initials: "LM",
      },
      icon: <Clock className="h-5 w-5" />,
    },
    {
      id: "8",
      date: "25 Jul 2023",
      title: "Pruebas de Usuario",
      description:
        "Realización de pruebas con usuarios finales para validar la usabilidad y funcionalidad del sistema. Recopilación de feedback.",
      type: "phase",
      status: "pending",
      assignee: {
        name: "Ana López",
        avatar: "/team/ana.jpg",
        initials: "AL",
      },
      icon: <Users className="h-5 w-5" />,
    },
    {
      id: "9",
      date: "15 Ago 2023",
      title: "Implementación",
      description:
        "Despliegue del sistema en el entorno de producción. Configuración de servidores, bases de datos y servicios.",
      type: "phase",
      status: "pending",
      assignee: {
        name: "Pedro Sánchez",
        avatar: "/team/pedro.jpg",
        initials: "PS",
      },
      icon: <Clock className="h-5 w-5" />,
    },
    {
      id: "10",
      date: "30 Ago 2023",
      title: "Capacitación",
      description:
        "Capacitación a los usuarios finales sobre el uso del sistema. Elaboración de manuales y documentación técnica.",
      type: "phase",
      status: "pending",
      assignee: {
        name: "Laura Martínez",
        avatar: "/team/laura.jpg",
        initials: "LM",
      },
      icon: <Users className="h-5 w-5" />,
    },
    {
      id: "11",
      date: "15 Sep 2023",
      title: "Entrega Final",
      description: "Entrega final del proyecto al cliente. Firma de acta de aceptación y cierre del proyecto.",
      type: "milestone",
      status: "pending",
      assignee: {
        name: "María González",
        avatar: "/team/maria.jpg",
        initials: "MG",
      },
      icon: <CheckCircle className="h-5 w-5" />,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500 text-white"
      case "in-progress":
        return "bg-highlight text-white"
      case "scheduled":
        return "bg-amber-500 text-white"
      case "pending":
        return "bg-gray-400 text-white"
      default:
        return "bg-gray-400 text-white"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "milestone":
        return <div className="h-3 w-3 rounded-full bg-red-500"></div>
      case "phase":
        return <div className="h-3 w-3 rounded-full bg-highlight"></div>
      case "meeting":
        return <div className="h-3 w-3 rounded-full bg-amber-500"></div>
      default:
        return <div className="h-3 w-3 rounded-full bg-gray-400"></div>
    }
  }

  return (
    <div className="space-y-6 p-4">
      {timelineItems.map((item, index) => (
        <div key={item.id} className="relative">
          {/* Línea vertical conectora */}
          {index < timelineItems.length - 1 && (
            <div className="absolute left-6 top-10 bottom-0 w-0.5 bg-custom-2/30"></div>
          )}

          <div className="flex gap-4">
            {/* Icono y línea */}
            <div className="flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-custom-1/50 text-highlight">
                {item.icon}
              </div>
            </div>

            {/* Contenido */}
            <Card className="flex-1 border border-custom-2/20">
              <CardContent className="p-4">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(item.type)}
                      <span className="font-medium">{item.title}</span>
                    </div>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status === "completed"
                        ? "Completado"
                        : item.status === "in-progress"
                          ? "En Progreso"
                          : item.status === "scheduled"
                            ? "Programado"
                            : "Pendiente"}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-sm text-textMuted">
                    <span>{item.date}</span>
                    <div className="flex items-center gap-2">
                      <span>Responsable:</span>
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={item.assignee.avatar || "/placeholder.svg"} alt={item.assignee.name} />
                        <AvatarFallback>{item.assignee.initials}</AvatarFallback>
                      </Avatar>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleItem(item.id)}
                    className="text-left text-sm text-highlight hover:underline focus:outline-none"
                  >
                    {expandedItems[item.id] ? "Ver menos" : "Ver detalles"}
                  </button>

                  {expandedItems[item.id] && (
                    <div className="mt-2 text-sm text-textMuted">
                      <p>{item.description}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ))}
    </div>
  )
}
