"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, ThumbsUp, MessageSquare, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ProjectCommentsProps {
  projectId?: string
}

export function ProjectComments({ projectId }: ProjectCommentsProps) {
  const [newComment, setNewComment] = useState("")
  const [comments, setComments] = useState([
    {
      id: "1",
      text: "Acabo de revisar los wireframes y me parecen muy buenos. Creo que podríamos añadir una sección de testimonios en la página de inicio.",
      author: {
        name: "María González",
        avatar: "/team/maria.jpg",
        initials: "MG",
        role: "Project Manager",
      },
      date: "15 Abr 2023",
      time: "10:23",
      likes: 3,
      replies: [
        {
          id: "1-1",
          text: "Estoy de acuerdo, los testimonios darían más credibilidad al sitio.",
          author: {
            name: "Ana López",
            avatar: "/team/ana.jpg",
            initials: "AL",
            role: "Diseñadora UI/UX",
          },
          date: "15 Abr 2023",
          time: "11:05",
          likes: 2,
        },
        {
          id: "1-2",
          text: "Podríamos incluir un carrusel de testimonios con fotos de los clientes.",
          author: {
            name: "Juan Pérez",
            avatar: "/team/juan.jpg",
            initials: "JP",
            role: "Desarrollador Frontend",
          },
          date: "15 Abr 2023",
          time: "11:30",
          likes: 1,
        },
      ],
    },
    {
      id: "2",
      text: "He detectado un problema con la integración de la API de pagos. Parece que hay un error en la respuesta cuando se procesa un pago con tarjeta de crédito.",
      author: {
        name: "Pedro Sánchez",
        avatar: "/team/pedro.jpg",
        initials: "PS",
        role: "Desarrollador Backend",
      },
      date: "20 Abr 2023",
      time: "15:47",
      likes: 0,
      replies: [
        {
          id: "2-1",
          text: "¿Puedes compartir el log de errores para poder analizarlo?",
          author: {
            name: "María González",
            avatar: "/team/maria.jpg",
            initials: "MG",
            role: "Project Manager",
          },
          date: "20 Abr 2023",
          time: "16:10",
          likes: 0,
        },
      ],
    },
    {
      id: "3",
      text: "Acabo de terminar las pruebas del módulo de usuarios y todo funciona correctamente. He documentado los casos de prueba en el repositorio.",
      author: {
        name: "Laura Martínez",
        avatar: "/team/laura.jpg",
        initials: "LM",
        role: "QA Tester",
      },
      date: "25 Abr 2023",
      time: "09:15",
      likes: 4,
      replies: [],
    },
    {
      id: "4",
      text: "El cliente ha solicitado un cambio en el diseño del logo. Quieren que sea más minimalista y con colores más vivos.",
      author: {
        name: "María González",
        avatar: "/team/maria.jpg",
        initials: "MG",
        role: "Project Manager",
      },
      date: "02 May 2023",
      time: "14:30",
      likes: 1,
      replies: [
        {
          id: "4-1",
          text: "Prepararé algunas propuestas para mañana.",
          author: {
            name: "Ana López",
            avatar: "/team/ana.jpg",
            initials: "AL",
            role: "Diseñadora UI/UX",
          },
          date: "02 May 2023",
          time: "15:05",
          likes: 2,
        },
      ],
    },
  ])

  const handleSubmitComment = () => {
    if (!newComment.trim()) return

    const newCommentObj = {
      id: `${comments.length + 1}`,
      text: newComment,
      author: {
        name: "María González",
        avatar: "/team/maria.jpg",
        initials: "MG",
        role: "Project Manager",
      },
      date: new Date()
        .toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" })
        .replace(".", ""),
      time: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", timeZone: "America/Bogota" }),
      likes: 0,
      replies: [],
    }

    setComments([newCommentObj, ...comments])
    setNewComment("")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <Textarea
          placeholder="Escribe un comentario..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[100px]"
        />
        <div className="flex justify-end">
          <Button onClick={handleSubmitComment} disabled={!newComment.trim()}>
            <Send className="h-4 w-4 mr-2" />
            Enviar Comentario
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="space-y-4">
            <div className="p-4 rounded-lg border border-custom-2/20 bg-custom-1/10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={comment.author.avatar || "/placeholder.svg"} alt={comment.author.name} />
                    <AvatarFallback>{comment.author.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{comment.author.name}</h4>
                    <p className="text-xs text-textMuted">{comment.author.role}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-textMuted">
                    {comment.date} a las {comment.time}
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                      <DropdownMenuItem>Eliminar</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <p className="text-sm mb-4">{comment.text}</p>

              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  <span>{comment.likes}</span>
                </Button>
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  <span>{comment.replies.length}</span>
                </Button>
              </div>
            </div>

            {comment.replies.length > 0 && (
              <div className="ml-12 space-y-4">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="p-4 rounded-lg border border-custom-2/20 bg-custom-1/10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={reply.author.avatar || "/placeholder.svg"} alt={reply.author.name} />
                          <AvatarFallback>{reply.author.initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium text-sm">{reply.author.name}</h4>
                          <p className="text-xs text-textMuted">{reply.author.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-textMuted">
                          {reply.date} a las {reply.time}
                        </span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Editar</DropdownMenuItem>
                            <DropdownMenuItem>Eliminar</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    <p className="text-sm mb-4">{reply.text}</p>

                    <div className="flex items-center space-x-4">
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        <span>{reply.likes}</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
