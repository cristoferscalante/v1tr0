'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CalendarClock, Loader2 } from 'lucide-react'
import { Panel, PanelPage, Pill, SectionHeading, EmptyState } from '@/components/shared/panel-ui'

interface Meeting {
  id: string
  title: string
  description: string | null
  preferredDate: string | null
  status: string
  adminNotes: string | null
  createdAt: string
}

const statusTone: Record<string, { tone: 'success' | 'warning' | 'danger'; label: string }> = {
  pending: { tone: 'warning', label: 'Pendiente' },
  approved: { tone: 'success', label: 'Confirmada' },
  confirmed: { tone: 'success', label: 'Confirmada' },
  rejected: { tone: 'danger', label: 'Rechazada' },
}

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/meetings')
      .then((res) => (res.ok ? res.json() : []))
      .then(setMeetings)
      .catch(() => setMeetings([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#26FFDF]" />
      </div>
    )
  }

  return (
    <PanelPage>
      <SectionHeading
        badge="Agenda"
        title="Mis Reuniones"
        subtitle="Solicitudes de reunión con el equipo. Puedes agendar nuevas desde cada proyecto."
      />

      {meetings.length === 0 ? (
        <EmptyState
          icon={CalendarClock}
          message="Aún no has solicitado ninguna reunión"
          hint="Entra a un proyecto y usa la pestaña «Agendar»"
        />
      ) : (
        <div className="space-y-4">
          {meetings.map((m, i) => {
            const s = statusTone[m.status] ?? { tone: 'default' as const, label: m.status }
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Panel className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-white font-semibold">{m.title}</p>
                      {m.description && (
                        <p className="text-textSecondary text-sm mt-1">{m.description}</p>
                      )}
                      <div className="flex flex-wrap gap-4 mt-3 text-xs text-textSecondary">
                        {m.preferredDate && (
                          <span>
                            Fecha propuesta:{' '}
                            {new Date(m.preferredDate).toLocaleDateString('es-ES', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        )}
                        <span>Solicitada el {new Date(m.createdAt).toLocaleDateString('es-ES')}</span>
                      </div>
                      {m.adminNotes && (
                        <p className="text-[#26FFDF] text-xs mt-3 p-3 rounded-xl bg-[#08A696]/10 border border-[#08A696]/20">
                          Respuesta del equipo: {m.adminNotes}
                        </p>
                      )}
                    </div>
                    <Pill tone={s.tone}>{s.label}</Pill>
                  </div>
                </Panel>
              </motion.div>
            )
          })}
        </div>
      )}
    </PanelPage>
  )
}
