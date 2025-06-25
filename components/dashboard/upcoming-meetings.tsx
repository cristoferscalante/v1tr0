"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Video, MapPin, Users } from "lucide-react"

export function UpcomingMeetings() {
  // Datos de ejemplo para las reuniones próximas
  const meetings = [
    {
      id: "1",
      title: "Revisión de Avance",
      date: "15 Jun 2023",
      time: "15:00 - 16:30",
      type: "Presencial",
      location: "Oficina Cliente",
      attendees: [
        {
          name: "María González",
          avatar: "/team/maria.jpg",
          initials: "MG",
        },
        {
          name: "Juan Pérez",
          avatar: "/team/juan.jpg",
          initials: "JP",
        },
        {
          name: "Pedro Sánchez",
          avatar: "/team/pedro.jpg",
          initials: "PS",
        },
        {
          name: "Cliente",
          avatar: "/team/cliente.jpg",
          initials: "CL",
        },
      ],
    },
    {
      id: "2",
      title: "Seguimiento Quincenal",
      date: "20 Jun 2023",
      time: "10:00 - 11:00",
      type: "Virtual",
      location: "Microsoft Teams",
      attendees: [
        {
          name: "María González",
          avatar: "/team/maria.jpg",
          initials: "MG",
        },
        {
          name: "Juan Pérez",
          avatar: "/team/juan.jpg",
          initials: "JP",
        },
        {
          name: "Pedro Sánchez",
          avatar: "/team/pedro.jpg",
          initials: "PS",
        },
        {
          name: "Cliente",
          avatar: "/team/cliente.jpg",
          initials: "CL",
        },
      ],
    },
    {
      id: "3",
      title: "Planificación Sprint",
      date: "22 Jun 2023",
      time: "14:00 - 15:30",
      type: "Virtual",
      location: "Zoom",
      attendees: [
        {
          name: "María González",
          avatar: "/team/maria.jpg",
          initials: "MG",
        },
        {
          name: "Juan Pérez",
          avatar: "/team/juan.jpg",
          initials: "JP",
        },
        {
          name: "Pedro Sánchez",
          avatar: "/team/pedro.jpg",
          initials: "PS",
        },
        {
          name: "Ana López",
          avatar: "/team/ana.jpg",
          initials: "AL",
        },
      ],
    },
  ]

  return (
    <div className="space-y-4">
      {meetings.map((meeting) => (
        <div
          key={meeting.id}
          className="p-4 rounded-lg border border-custom-2/20 bg-custom-1/10 hover:bg-custom-1/30 transition-colors"
        >
          <h3 className="font-medium mb-2">{meeting.title}</h3>
          <div className="space-y-2 text-sm text-textMuted">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{meeting.date}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              <span>{meeting.time}</span>
            </div>
            <div className="flex items-center">
              {meeting.type === "Virtual" ? <Video className="h-4 w-4 mr-2" /> : <MapPin className="h-4 w-4 mr-2" />}
              <span>
                {meeting.type}: {meeting.location}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-custom-2/10">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2 text-textMuted" />
              <span className="text-sm text-textMuted mr-2">Asistentes:</span>
              <div className="flex -space-x-2">
                {meeting.attendees.map((attendee, index) => (
                  <Avatar key={index} className="h-6 w-6 border-2 border-backgroundSecondary">
                    <AvatarImage src={attendee.avatar || "/placeholder.svg"} alt={attendee.name} />
                    <AvatarFallback>{attendee.initials}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            {meeting.type === "Virtual" && (
              <Button size="sm">
                <Video className="h-4 w-4 mr-2" />
                Unirse
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
