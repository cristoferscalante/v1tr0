'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, MessageSquare, Plus } from 'lucide-react'
import QuoteSurvey from '@/components/dashboard/QuoteSurvey'
import { Panel, PanelPage, Pill, SectionHeading, EmptyState } from '@/components/shared/panel-ui'

interface Quote {
  id: string
  projectType: string
  description: string
  budget: string | null
  timeline: string | null
  status: string
  createdAt: string
}

const statusTone: Record<string, { tone: 'success' | 'warning' | 'danger'; label: string }> = {
  pending: { tone: 'warning', label: 'Pendiente' },
  approved: { tone: 'success', label: 'Aprobada' },
  rejected: { tone: 'danger', label: 'Rechazada' },
}

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [showQuote, setShowQuote] = useState(false)

  const load = () => {
    fetch('/api/quotes')
      .then((res) => (res.ok ? res.json() : []))
      .then(setQuotes)
      .catch(() => setQuotes([]))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#26FFDF]" />
      </div>
    )
  }

  return (
    <PanelPage>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
      >
        <SectionHeading
          badge="Presupuestos"
          title="Mis Cotizaciones"
          subtitle="Solicitudes de presupuesto que has enviado"
        />
        <button
          onClick={() => setShowQuote(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#08A696]/20 border border-[#08A696]/40 text-[#26FFDF] text-sm font-medium hover:bg-[#08A696]/30 hover:border-[#26FFDF] transition-all shrink-0"
        >
          <Plus className="h-4 w-4" /> Solicitar cotización
        </button>
      </motion.div>

      {quotes.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          message="Aún no has solicitado ninguna cotización"
          hint="Cuéntanos qué necesitas y te preparamos un presupuesto"
        />
      ) : (
        <div className="space-y-4">
          {quotes.map((q, i) => {
            const s = statusTone[q.status] ?? { tone: 'default' as const, label: q.status }
            return (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Panel className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-white font-semibold">{q.projectType}</p>
                      <p className="text-textSecondary text-sm mt-1">{q.description}</p>
                      <div className="flex flex-wrap gap-4 mt-3 text-xs text-textSecondary">
                        {q.budget && <span>Presupuesto: {q.budget}</span>}
                        {q.timeline && <span>Plazo: {q.timeline}</span>}
                        <span>{new Date(q.createdAt).toLocaleDateString('es-ES')}</span>
                      </div>
                    </div>
                    <Pill tone={s.tone}>{s.label}</Pill>
                  </div>
                </Panel>
              </motion.div>
            )
          })}
        </div>
      )}

      <QuoteSurvey open={showQuote} onClose={() => { setShowQuote(false); load() }} />
    </PanelPage>
  )
}
