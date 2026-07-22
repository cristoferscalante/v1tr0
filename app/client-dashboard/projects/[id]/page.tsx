'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Clock, CheckCircle2, Circle, Bug, Lightbulb,
  CalendarPlus, ClipboardList, Loader2, Send,
} from 'lucide-react'
import { toast } from 'sonner'

interface Phase {
  id: string; name: string; description: string | null
  order: number; status: string; startDate: string | null; endDate: string | null
  tasks: { id: string; name: string; completed: boolean }[]
}

interface Suggestion {
  id: string; title: string; description: string | null
  status: string; createdAt: string
}

interface BugReport {
  id: string; title: string; description: string | null
  severity: string; status: string; createdAt: string
}

interface MeetingRequest {
  id: string; title: string; description: string | null
  preferredDate: string | null; status: string; createdAt: string
}

interface ProjectTask {
  id: string; nombre: string; descripcion: string | null
  estado: string; prioridad: string; categoria: string
  finalizada: boolean; createdAt: string
}

interface ProjectDetail {
  id: string; name: string; description: string | null
  status: string; images: string[]; progress: number
  phases: Phase[]; tasks: ProjectTask[]
  suggestions: Suggestion[]; bugs: BugReport[]
  meetings: MeetingRequest[]
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
}

function GlassCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className="relative group h-full">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#08a6961e] to-[#26ffde23] rounded-2xl blur opacity-30 group-hover:opacity-60 transition-all duration-300" />
      <div className={`relative bg-[#02505931] backdrop-blur-sm rounded-2xl border border-[#08A696]/20 transition-all duration-300 h-full ${className}`}>
        {children}
      </div>
    </div>
  )
}

function SectionBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold tracking-[0.22em] uppercase bg-[#08A696]/10 border border-[#08A696]/30 text-[#26FFDF] mb-3">
      {label}
    </span>
  )
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  planning: { label: 'Planeación', color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/30' },
  design: { label: 'Diseño', color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/30' },
  development: { label: 'Desarrollo', color: 'text-[#26FFDF]', bg: 'bg-[#08A696]/10 border-[#08A696]/30' },
  testing: { label: 'Pruebas', color: 'text-purple-400', bg: 'bg-purple-400/10 border-purple-400/30' },
  active: { label: 'Activo', color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/30' },
  completed: { label: 'Completado', color: 'text-[#26FFDF]', bg: 'bg-[#08A696]/10 border-[#08A696]/30' },
  cancelled: { label: 'Cancelado', color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/30' },
}

const severityConfig: Record<string, { label: string; color: string }> = {
  low: { label: 'Baja', color: 'text-green-400' },
  medium: { label: 'Media', color: 'text-yellow-400' },
  high: { label: 'Alta', color: 'text-orange-400' },
  critical: { label: 'Crítica', color: 'text-red-400' },
}

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [project, setProject] = useState<ProjectDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'timeline' | 'suggestions' | 'bugs' | 'meetings' | 'tasks'>('timeline')
  const [newSuggestion, setNewSuggestion] = useState('')
  const [newBugTitle, setNewBugTitle] = useState('')
  const [newBugDesc, setNewBugDesc] = useState('')
  const [newBugSeverity, setNewBugSeverity] = useState('medium')
  const [meetingTitle, setMeetingTitle] = useState('')
  const [meetingDesc, setMeetingDesc] = useState('')
  const [meetingDate, setMeetingDate] = useState('')

  const fetchProject = useCallback(async () => {
    const { id } = await params
    try {
      setLoading(true)
      const res = await fetch(`/api/projects/${id}/details`)
      if (!res.ok) { router.push('/client-dashboard/projects'); return }
      setProject(await res.json())
    } catch { router.push('/client-dashboard/projects') }
    finally { setLoading(false) }
  }, [params, router])

  useEffect(() => { fetchProject() }, [fetchProject])

  const addSuggestion = async () => {
    if (!newSuggestion.trim()) return
    const { id } = await params
    const res = await fetch(`/api/projects/${id}/suggestions`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newSuggestion, description: newSuggestion }),
    })
    if (res.ok) { setNewSuggestion(''); fetchProject(); toast.success('Sugerencia enviada') }
    else toast.error('Error al enviar sugerencia')
  }

  const addBug = async () => {
    if (!newBugTitle.trim()) return
    const { id } = await params
    const res = await fetch(`/api/projects/${id}/bugs`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newBugTitle, description: newBugDesc, severity: newBugSeverity }),
    })
    if (res.ok) { setNewBugTitle(''); setNewBugDesc(''); fetchProject(); toast.success('Reporte enviado') }
    else toast.error('Error al enviar reporte')
  }

  const requestMeeting = async () => {
    if (!meetingTitle.trim()) return
    const { id } = await params
    const res = await fetch(`/api/meetings`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId: id, title: meetingTitle, description: meetingDesc, preferredDate: meetingDate || null }),
    })
    if (res.ok) { setMeetingTitle(''); setMeetingDesc(''); setMeetingDate(''); fetchProject(); toast.success('Solicitud enviada') }
    else toast.error('Error al solicitar reunión')
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="absolute inset-0 bg-gradient-to-r from-[#08A696] to-[#26FFDF] rounded-full blur-xl opacity-30 animate-pulse" />
        <Loader2 className="h-10 w-10 animate-spin text-[#26FFDF]" />
        <p className="text-textSecondary font-bricolage text-sm">Cargando proyecto...</p>
      </div>
    </div>
  )

  if (!project) return null

  const tabs = [
    { key: 'timeline' as const, label: 'Línea de Tiempo', icon: Clock },
    { key: 'suggestions' as const, label: 'Sugerencias', icon: Lightbulb },
    { key: 'bugs' as const, label: 'Reporte de Fallos', icon: Bug },
    { key: 'meetings' as const, label: 'Agendar', icon: CalendarPlus },
    { key: 'tasks' as const, label: 'Tareas', icon: ClipboardList },
  ]

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible"
      className="min-h-screen p-4 sm:p-6 lg:p-8 font-bricolage max-w-7xl mx-auto space-y-6"
    >
      {/* Back */}
      <button onClick={() => router.push('/client-dashboard/projects')}
        className="flex items-center gap-2 text-textSecondary hover:text-[#26FFDF] transition-colors text-sm"
      ><ArrowLeft className="h-4 w-4" /> Volver a proyectos</button>

      {/* Header */}
      <motion.div variants={itemVariants}>
        <GlassCard>
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">{project.name}</h1>
                {project.description && (
                  <p className="text-textSecondary text-sm mt-1">{project.description}</p>
                )}
              </div>
              <span className={`self-start px-3 py-1 rounded-full text-xs font-medium border ${statusConfig[project.status]?.bg ?? 'bg-[#08A696]/10 border-[#08A696]/30'} ${statusConfig[project.status]?.color ?? 'text-[#26FFDF]'}`}>
                {statusConfig[project.status]?.label ?? project.status}
              </span>
            </div>
            {/* Progress bar */}
            <div className="mt-6">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-textSecondary">Progreso general</span>
                <span className="text-white font-semibold">{project.progress}%</span>
              </div>
              <div className="w-full h-2 bg-[#02505960] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#08A696] to-[#26FFDF] rounded-full transition-all duration-500"
                  style={{ width: `${project.progress}%` }} />
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants}
        className="flex overflow-x-auto gap-2 pb-2 scrollbar-none"
      >
        {tabs.map((t) => {
          const Icon = t.icon
          const isActive = activeTab === t.key
          return (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 ${isActive ? 'bg-[#08A696]/20 text-[#26FFDF] border border-[#08A696]/30' : 'bg-[#02505931] text-textSecondary border border-transparent hover:border-[#08A696]/20'}`}
            ><Icon className="h-4 w-4" /> {t.label}</button>
          )
        })}
      </motion.div>

      {/* Tab Content */}
      <motion.div variants={itemVariants}>
        <GlassCard>
          <div className="p-6">

            {/* TIMELINE */}
            {activeTab === 'timeline' && (
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <SectionBadge label="Etapas" />
                </div>
                {project.phases.length === 0 ? (
                  <p className="text-textSecondary text-sm text-center py-8">No hay etapas definidas aún</p>
                ) : (
                  <div className="space-y-0">
                    {project.phases.map((phase, idx) => (
                      <div key={phase.id} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${phase.status === 'completed' ? 'bg-[#08A696] border-[#08A696] text-white' : phase.status === 'in_progress' ? 'bg-[#08A696]/20 border-[#26FFDF] text-[#26FFDF]' : 'bg-[#02505960] border-[#08A696]/30 text-textSecondary'}`}>
                            {phase.status === 'completed' ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
                          </div>
                          {idx < project.phases.length - 1 && (
                            <div className="w-0.5 flex-1 min-h-[40px] bg-gradient-to-b from-[#08A696]/40 to-transparent" />
                          )}
                        </div>
                        <div className="pb-8 flex-1">
                          <h3 className="text-white font-semibold">{phase.name}</h3>
                          {phase.description && <p className="text-textSecondary text-xs mt-0.5">{phase.description}</p>}
                          <div className="flex flex-wrap gap-2 mt-2">
                            {phase.tasks.map((t) => (
                              <span key={t.id} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] ${t.completed ? 'bg-[#08A696]/10 text-[#26FFDF]' : 'bg-[#02505960] text-textSecondary'}`}>
                                {t.completed ? <CheckCircle2 className="h-3 w-3" /> : <Circle className="h-3 w-3" />}
                                {t.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SUGGESTIONS */}
            {activeTab === 'suggestions' && (
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <SectionBadge label="Sugerencias" />
                </div>
                <div className="flex gap-2 mb-6">
                  <input value={newSuggestion} onChange={(e) => setNewSuggestion(e.target.value)}
                    placeholder="Escribe tu sugerencia..."
                    className="flex-1 bg-[#02505960] border border-[#08A696]/20 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-textSecondary/50 focus:outline-none focus:border-[#26FFDF] transition-colors"
                    onKeyDown={(e) => e.key === 'Enter' && addSuggestion()}
                  />
                  <button onClick={addSuggestion}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#08A696] to-[#26FFDF] text-black font-semibold text-sm hover:opacity-90 transition-opacity"
                  ><Send className="h-4 w-4" /></button>
                </div>
                <div className="space-y-3">
                  {project.suggestions.length === 0 ? (
                    <p className="text-textSecondary text-sm text-center py-6">No hay sugerencias aún</p>
                  ) : project.suggestions.map((s) => (
                    <div key={s.id} className="bg-[#02505940] rounded-xl p-4 border border-[#08A696]/10">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <Lightbulb className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-white text-sm font-medium">{s.title}</p>
                            {s.description && <p className="text-textSecondary text-xs mt-0.5">{s.description}</p>}
                          </div>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${s.status === 'approved' ? 'bg-green-400/10 text-green-400 border-green-400/30' : s.status === 'rejected' ? 'bg-red-400/10 text-red-400 border-red-400/30' : 'bg-yellow-400/10 text-yellow-400 border-yellow-400/30'}`}>
                          {s.status === 'approved' ? 'Aprobada' : s.status === 'rejected' ? 'Rechazada' : 'Pendiente'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* BUGS */}
            {activeTab === 'bugs' && (
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <SectionBadge label="Reporte de Fallos" />
                </div>
                <div className="bg-[#02505940] rounded-xl p-4 border border-[#08A696]/10 mb-6">
                  <h3 className="text-white text-sm font-semibold mb-3">Nuevo Reporte</h3>
                  <div className="space-y-3">
                    <input value={newBugTitle} onChange={(e) => setNewBugTitle(e.target.value)}
                      placeholder="Título del fallo..."
                      className="w-full bg-[#02505960] border border-[#08A696]/20 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-textSecondary/50 focus:outline-none focus:border-[#26FFDF] transition-colors"
                    />
                    <textarea value={newBugDesc} onChange={(e) => setNewBugDesc(e.target.value)}
                      placeholder="Describe el fallo (opcional)..."
                      rows={2}
                      className="w-full bg-[#02505960] border border-[#08A696]/20 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-textSecondary/50 focus:outline-none focus:border-[#26FFDF] transition-colors resize-none"
                    />
                    <div className="flex gap-3 items-center">
                      <select value={newBugSeverity} onChange={(e) => setNewBugSeverity(e.target.value)}
                        className="bg-[#02505960] border border-[#08A696]/20 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#26FFDF]"
                      >
                        <option value="low">Baja</option>
                        <option value="medium">Media</option>
                        <option value="high">Alta</option>
                        <option value="critical">Crítica</option>
                      </select>
                      <button onClick={addBug}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#08A696] to-[#26FFDF] text-black font-semibold text-sm hover:opacity-90 transition-opacity"
                      >Enviar Reporte</button>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  {project.bugs.length === 0 ? (
                    <p className="text-textSecondary text-sm text-center py-4">No hay reportes de fallos</p>
                  ) : project.bugs.map((b) => (
                    <div key={b.id} className="bg-[#02505940] rounded-xl p-4 border border-[#08A696]/10">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <Bug className={`h-5 w-5 mt-0.5 flex-shrink-0 ${b.severity === 'critical' ? 'text-red-400' : b.severity === 'high' ? 'text-orange-400' : b.severity === 'medium' ? 'text-yellow-400' : 'text-green-400'}`} />
                          <div>
                            <p className="text-white text-sm font-medium">{b.title}</p>
                            {b.description && <p className="text-textSecondary text-xs mt-0.5">{b.description}</p>}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${severityConfig[b.severity]?.color ?? 'text-textSecondary'} bg-[#02505960]`}>
                            {severityConfig[b.severity]?.label ?? b.severity}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${b.status === 'resolved' ? 'bg-green-400/10 text-green-400 border-green-400/30' : b.status === 'in_progress' ? 'bg-blue-400/10 text-blue-400 border-blue-400/30' : 'bg-red-400/10 text-red-400 border-red-400/30'}`}>
                            {b.status === 'resolved' ? 'Resuelto' : b.status === 'in_progress' ? 'En progreso' : 'Abierto'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MEETINGS */}
            {activeTab === 'meetings' && (
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <SectionBadge label="Agendar Reunión" />
                </div>
                <div className="bg-[#02505940] rounded-xl p-4 border border-[#08A696]/10 mb-6">
                  <h3 className="text-white text-sm font-semibold mb-3">Solicitar Reunión</h3>
                  <div className="space-y-3">
                    <input value={meetingTitle} onChange={(e) => setMeetingTitle(e.target.value)}
                      placeholder="Motivo de la reunión..."
                      className="w-full bg-[#02505960] border border-[#08A696]/20 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-textSecondary/50 focus:outline-none focus:border-[#26FFDF] transition-colors"
                    />
                    <textarea value={meetingDesc} onChange={(e) => setMeetingDesc(e.target.value)}
                      placeholder="Descripción (opcional)..."
                      rows={2}
                      className="w-full bg-[#02505960] border border-[#08A696]/20 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-textSecondary/50 focus:outline-none focus:border-[#26FFDF] transition-colors resize-none"
                    />
                    <div className="flex gap-3 items-center">
                      <input type="datetime-local" value={meetingDate} onChange={(e) => setMeetingDate(e.target.value)}
                        className="bg-[#02505960] border border-[#08A696]/20 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#26FFDF] [color-scheme:dark]"
                      />
                      <button onClick={requestMeeting}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#08A696] to-[#26FFDF] text-black font-semibold text-sm hover:opacity-90 transition-opacity"
                      >Solicitar</button>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  {project.meetings.length === 0 ? (
                    <p className="text-textSecondary text-sm text-center py-4">No hay solicitudes de reunión</p>
                  ) : project.meetings.map((m) => (
                    <div key={m.id} className="bg-[#02505940] rounded-xl p-4 border border-[#08A696]/10">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <CalendarPlus className="h-5 w-5 text-[#26FFDF] mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-white text-sm font-medium">{m.title}</p>
                            {m.description && <p className="text-textSecondary text-xs mt-0.5">{m.description}</p>}
                            {m.preferredDate && <p className="text-textSecondary text-xs mt-1">{new Date(m.preferredDate).toLocaleDateString('es-CO', { dateStyle: 'long', timeStyle: 'short' })}</p>}
                          </div>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${m.status === 'approved' ? 'bg-green-400/10 text-green-400 border-green-400/30' : m.status === 'rejected' ? 'bg-red-400/10 text-red-400 border-red-400/30' : 'bg-yellow-400/10 text-yellow-400 border-yellow-400/30'}`}>
                          {m.status === 'approved' ? 'Aprobada' : m.status === 'rejected' ? 'Rechazada' : 'Pendiente'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TASKS */}
            {activeTab === 'tasks' && (
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <SectionBadge label="Tareas del Proyecto" />
                </div>
                {project.tasks.length === 0 ? (
                  <p className="text-textSecondary text-sm text-center py-8">No hay tareas asignadas aún</p>
                ) : (
                  <div className="space-y-2">
                    {project.tasks.map((t) => (
                      <div key={t.id} className="bg-[#02505940] rounded-xl p-4 border border-[#08A696]/10">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1">
                            {t.finalizada ? (
                              <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                            ) : (
                              <Circle className="h-5 w-5 text-textSecondary mt-0.5 flex-shrink-0" />
                            )}
                            <div>
                              <p className={`text-sm font-medium ${t.finalizada ? 'text-textSecondary line-through' : 'text-white'}`}>{t.nombre}</p>
                              {t.descripcion && <p className="text-textSecondary text-xs mt-0.5">{t.descripcion}</p>}
                              {t.categoria && <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] bg-[#02505960] text-textSecondary">{t.categoria}</span>}
                            </div>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${t.prioridad === 'alta' ? 'bg-red-400/10 text-red-400' : t.prioridad === 'media' ? 'bg-yellow-400/10 text-yellow-400' : 'bg-green-400/10 text-green-400'}`}>
                            {t.prioridad}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  )
}
