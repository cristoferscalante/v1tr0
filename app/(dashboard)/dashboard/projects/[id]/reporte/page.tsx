'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Clock, CheckCircle2, Circle, Bug, Lightbulb,
  CalendarPlus, ClipboardList, AlertTriangle, Loader2,
  ThumbsUp, ThumbsDown, CheckCircle, XCircle,
  User, Mail, BarChart3,
} from 'lucide-react'
import { toast } from 'sonner'

interface Phase {
  id: string; name: string; description: string | null
  order: number; status: string; startDate: string | null; endDate: string | null
  tasks: { id: string; name: string; completed: boolean }[]
}

interface Suggestion {
  id: string; title: string; description: string | null
  status: string; createdAt: string; profileId: string
}

interface BugReport {
  id: string; title: string; description: string | null
  severity: string; status: string; createdAt: string; profileId: string
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
  status: string; images: string[]; clientId: string | null
  client: { name: string | null; email: string | null } | null
  progress: number; phases: Phase[]; tasks: ProjectTask[]
  suggestions: Suggestion[]; bugs: BugReport[]; meetings: MeetingRequest[]
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

function Badge({ label, color }: { label: string; color?: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase border ${color ?? 'bg-[#08A696]/10 border-[#08A696]/30 text-[#26FFDF]'}`}>
      {label}
    </span>
  )
}

const statusConfig: Record<string, { label: string; color: string }> = {
  planning: { label: 'Planeación', color: 'bg-yellow-400/10 border-yellow-400/30 text-yellow-400' },
  design: { label: 'Diseño', color: 'bg-blue-400/10 border-blue-400/30 text-blue-400' },
  development: { label: 'Desarrollo', color: 'bg-[#08A696]/10 border-[#08A696]/30 text-[#26FFDF]' },
  testing: { label: 'Pruebas', color: 'bg-purple-400/10 border-purple-400/30 text-purple-400' },
  active: { label: 'Activo', color: 'bg-green-400/10 border-green-400/30 text-green-400' },
  completed: { label: 'Completado', color: 'bg-[#08A696]/10 border-[#08A696]/30 text-[#26FFDF]' },
  cancelled: { label: 'Cancelado', color: 'bg-red-400/10 border-red-400/30 text-red-400' },
}

export default function AdminProjectReportPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [project, setProject] = useState<ProjectDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'suggestions' | 'bugs' | 'meetings'>('overview')

  const fetchProject = useCallback(async () => {
    const { id } = await params
    try {
      setLoading(true)
      const res = await fetch(`/api/admin/projects/${id}`)
      if (!res.ok) { router.push('/dashboard/projects'); return }
      setProject(await res.json())
    } catch { router.push('/dashboard/projects') }
    finally { setLoading(false) }
  }, [params, router])

  useEffect(() => { fetchProject() }, [fetchProject])

  const updateSuggestion = async (id: string, status: string) => {
    const res = await fetch(`/api/admin/projects/${project?.id}/suggestions`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    if (res.ok) { fetchProject(); toast.success('Sugerencia actualizada') }
    else toast.error('Error al actualizar')
  }

  const updateBug = async (id: string, status: string) => {
    const res = await fetch(`/api/admin/projects/${project?.id}/bugs`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    if (res.ok) { fetchProject(); toast.success('Reporte actualizado') }
    else toast.error('Error al actualizar')
  }

  const updateMeeting = async (id: string, status: string) => {
    const res = await fetch(`/api/admin/projects/${project?.id}/meetings`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    if (res.ok) { fetchProject(); toast.success('Reunión actualizada') }
    else toast.error('Error al actualizar')
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-[#26FFDF]" />
    </div>
  )

  if (!project) return null

  const statsCards = [
    { label: 'Etapas', value: project.phases.length, icon: Clock, color: 'from-[#08A696] to-[#26FFDF]' },
    { label: 'Sugerencias', value: project.suggestions.length, icon: Lightbulb, color: 'from-yellow-400 to-orange-400' },
    { label: 'Reportes', value: project.bugs.length, icon: Bug, color: 'from-red-400 to-pink-400' },
    { label: 'Reuniones', value: project.meetings.length, icon: CalendarPlus, color: 'from-blue-400 to-purple-400' },
  ]

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible"
      className="min-h-screen p-4 md:p-8 font-bricolage max-w-7xl mx-auto space-y-6"
    >
      <button onClick={() => router.push('/dashboard/projects')}
        className="flex items-center gap-2 text-textSecondary hover:text-[#26FFDF] transition-colors text-sm mb-2"
      ><ArrowLeft className="h-4 w-4" /> Volver a proyectos</button>

      {/* Header */}
      <motion.div variants={itemVariants}>
        <GlassCard>
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-[#08A696] to-[#26FFDF]">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">{project.name}</h1>
                  <p className="text-textSecondary text-sm mt-0.5 flex items-center gap-2">
                    {project.description}
                  </p>
                </div>
              </div>
              <Badge label={statusConfig[project.status]?.label ?? project.status} color={statusConfig[project.status]?.color} />
            </div>
            {project.client && (
              <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-[#08A696]/10">
                <span className="flex items-center gap-1.5 text-xs text-textSecondary">
                  <User className="h-3.5 w-3.5" /> {project.client.name ?? 'Sin nombre'}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-textSecondary">
                  <Mail className="h-3.5 w-3.5" /> {project.client.email ?? 'Sin email'}
                </span>
              </div>
            )}
            <div className="mt-5">
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

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statsCards.map((s) => {
          const Icon = s.icon
          return (
            <GlassCard key={s.label}>
              <div className="p-5 flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${s.color}`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{s.value}</p>
                  <p className="text-textSecondary text-xs">{s.label}</p>
                </div>
              </div>
            </GlassCard>
          )
        })}
      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants} className="flex overflow-x-auto gap-2 pb-2 scrollbar-none">
        {[
          { key: 'overview' as const, label: 'Etapas', icon: Clock },
          { key: 'suggestions' as const, label: 'Sugerencias', icon: Lightbulb },
          { key: 'bugs' as const, label: 'Reportes', icon: Bug },
          { key: 'meetings' as const, label: 'Reuniones', icon: CalendarPlus },
        ].map((t) => {
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

            {/* OVERVIEW - Phases/Timeline */}
            {activeTab === 'overview' && (
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <span className="px-3 py-1 rounded-full text-[10px] font-semibold tracking-[0.22em] uppercase bg-[#08A696]/10 border border-[#08A696]/30 text-[#26FFDF]">
                    Línea de Tiempo Iterativa
                  </span>
                </div>
                {project.phases.length === 0 ? (
                  <p className="text-textSecondary text-sm text-center py-8">No hay etapas definidas</p>
                ) : (
                  <div className="space-y-0">
                    {project.phases.map((phase, idx) => (
                      <div key={phase.id} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 ${phase.status === 'completed' ? 'bg-[#08A696] border-[#08A696] text-white' : phase.status === 'in_progress' ? 'bg-[#08A696]/20 border-[#26FFDF] text-[#26FFDF]' : 'bg-[#02505960] border-[#08A696]/30 text-textSecondary'}`}>
                            {phase.status === 'completed' ? <CheckCircle2 className="h-5 w-5" /> : idx + 1}
                          </div>
                          {idx < project.phases.length - 1 && (
                            <div className="w-0.5 flex-1 min-h-[32px] bg-gradient-to-b from-[#08A696]/30 to-transparent" />
                          )}
                        </div>
                        <div className="pb-6 flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="text-white font-semibold">{phase.name}</h3>
                            <Badge label={phase.status === 'completed' ? 'Completada' : phase.status === 'in_progress' ? 'En Progreso' : 'Pendiente'}
                              color={phase.status === 'completed' ? 'bg-green-400/10 border-green-400/30 text-green-400' : phase.status === 'in_progress' ? 'bg-blue-400/10 border-blue-400/30 text-blue-400' : 'bg-yellow-400/10 border-yellow-400/30 text-yellow-400'} />
                          </div>
                          {phase.description && <p className="text-textSecondary text-xs mt-0.5">{phase.description}</p>}
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {phase.tasks.length === 0 ? (
                              <span className="text-textSecondary text-[10px]">Sin tareas</span>
                            ) : phase.tasks.map((t) => (
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

            {/* SUGGESTIONS - Admin can approve/reject */}
            {activeTab === 'suggestions' && (
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <span className="px-3 py-1 rounded-full text-[10px] font-semibold tracking-[0.22em] uppercase bg-[#08A696]/10 border border-[#08A696]/30 text-[#26FFDF]">
                    Sugerencias del Cliente
                  </span>
                </div>
                {project.suggestions.length === 0 ? (
                  <p className="text-textSecondary text-sm text-center py-8">No hay sugerencias del cliente</p>
                ) : (
                  <div className="space-y-3">
                    {project.suggestions.map((s) => (
                      <div key={s.id} className="bg-[#02505940] rounded-xl p-4 border border-[#08A696]/10">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <Lightbulb className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-white text-sm font-medium">{s.title}</p>
                              {s.description && <p className="text-textSecondary text-xs mt-0.5">{s.description}</p>}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Badge label={s.status === 'approved' ? 'Aprobada' : s.status === 'rejected' ? 'Rechazada' : 'Pendiente'}
                              color={s.status === 'approved' ? 'bg-green-400/10 border-green-400/30 text-green-400' : s.status === 'rejected' ? 'bg-red-400/10 border-red-400/30 text-red-400' : 'bg-yellow-400/10 border-yellow-400/30 text-yellow-400'} />
                            {s.status === 'pending' && (
                              <div className="flex gap-1">
                                <button onClick={() => updateSuggestion(s.id, 'approved')}
                                  className="p-1.5 rounded-lg bg-green-400/10 hover:bg-green-400/20 text-green-400 transition-colors"
                                  title="Aprobar"><ThumbsUp className="h-3.5 w-3.5" /></button>
                                <button onClick={() => updateSuggestion(s.id, 'rejected')}
                                  className="p-1.5 rounded-lg bg-red-400/10 hover:bg-red-400/20 text-red-400 transition-colors"
                                  title="Rechazar"><ThumbsDown className="h-3.5 w-3.5" /></button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* BUGS - Admin can change status */}
            {activeTab === 'bugs' && (
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <span className="px-3 py-1 rounded-full text-[10px] font-semibold tracking-[0.22em] uppercase bg-[#08A696]/10 border border-[#08A696]/30 text-[#26FFDF]">
                    Reporte de Fallos
                  </span>
                </div>
                {project.bugs.length === 0 ? (
                  <p className="text-textSecondary text-sm text-center py-8">No hay reportes de fallos</p>
                ) : (
                  <div className="space-y-3">
                    {project.bugs.map((b) => (
                      <div key={b.id} className="bg-[#02505940] rounded-xl p-4 border border-[#08A696]/10">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <Bug className={`h-5 w-5 mt-0.5 flex-shrink-0 ${b.severity === 'critical' ? 'text-red-400' : b.severity === 'high' ? 'text-orange-400' : b.severity === 'medium' ? 'text-yellow-400' : 'text-green-400'}`} />
                            <div>
                              <p className="text-white text-sm font-medium">{b.title}</p>
                              {b.description && <p className="text-textSecondary text-xs mt-0.5">{b.description}</p>}
                              <Badge label={b.severity}
                                color={b.severity === 'critical' ? 'bg-red-400/10 border-red-400/30 text-red-400' : b.severity === 'high' ? 'bg-orange-400/10 border-orange-400/30 text-orange-400' : b.severity === 'medium' ? 'bg-yellow-400/10 border-yellow-400/30 text-yellow-400' : 'bg-green-400/10 border-green-400/30 text-green-400'} />
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Badge label={b.status === 'resolved' ? 'Resuelto' : b.status === 'in_progress' ? 'En Progreso' : 'Abierto'}
                              color={b.status === 'resolved' ? 'bg-green-400/10 border-green-400/30 text-green-400' : b.status === 'in_progress' ? 'bg-blue-400/10 border-blue-400/30 text-blue-400' : 'bg-red-400/10 border-red-400/30 text-red-400'} />
                            {b.status !== 'resolved' && (
                              <div className="flex gap-1">
                                {b.status === 'open' && (
                                  <button onClick={() => updateBug(b.id, 'in_progress')}
                                    className="p-1.5 rounded-lg bg-blue-400/10 hover:bg-blue-400/20 text-blue-400 transition-colors"
                                    title="En progreso"><CheckCircle className="h-3.5 w-3.5" /></button>
                                )}
                                {b.status === 'in_progress' && (
                                  <button onClick={() => updateBug(b.id, 'resolved')}
                                    className="p-1.5 rounded-lg bg-green-400/10 hover:bg-green-400/20 text-green-400 transition-colors"
                                    title="Resolver"><CheckCircle2 className="h-3.5 w-3.5" /></button>
                                )}
                                <button onClick={() => updateBug(b.id, 'open')}
                                  className="p-1.5 rounded-lg bg-red-400/10 hover:bg-red-400/20 text-red-400 transition-colors"
                                  title="Reabrir"><XCircle className="h-3.5 w-3.5" /></button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* MEETINGS - Admin can approve/reject */}
            {activeTab === 'meetings' && (
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <span className="px-3 py-1 rounded-full text-[10px] font-semibold tracking-[0.22em] uppercase bg-[#08A696]/10 border border-[#08A696]/30 text-[#26FFDF]">
                    Solicitudes de Reunión
                  </span>
                </div>
                {project.meetings.length === 0 ? (
                  <p className="text-textSecondary text-sm text-center py-8">No hay solicitudes de reunión</p>
                ) : (
                  <div className="space-y-3">
                    {project.meetings.map((m) => (
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
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Badge label={m.status === 'approved' ? 'Aprobada' : m.status === 'rejected' ? 'Rechazada' : 'Pendiente'}
                              color={m.status === 'approved' ? 'bg-green-400/10 border-green-400/30 text-green-400' : m.status === 'rejected' ? 'bg-red-400/10 border-red-400/30 text-red-400' : 'bg-yellow-400/10 border-yellow-400/30 text-yellow-400'} />
                            {m.status === 'pending' && (
                              <div className="flex gap-1">
                                <button onClick={() => updateMeeting(m.id, 'approved')}
                                  className="p-1.5 rounded-lg bg-green-400/10 hover:bg-green-400/20 text-green-400 transition-colors"
                                  title="Aprobar"><ThumbsUp className="h-3.5 w-3.5" /></button>
                                <button onClick={() => updateMeeting(m.id, 'rejected')}
                                  className="p-1.5 rounded-lg bg-red-400/10 hover:bg-red-400/20 text-red-400 transition-colors"
                                  title="Rechazar"><ThumbsDown className="h-3.5 w-3.5" /></button>
                              </div>
                            )}
                          </div>
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
