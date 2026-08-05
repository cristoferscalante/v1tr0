'use client'

import { useCallback, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  HelpCircle, Loader2, ArrowRight, ShoppingCart,
} from 'lucide-react'
import {
  RadialBarChart, RadialBar, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import QuoteSurvey from '@/components/dashboard/QuoteSurvey'
import { Panel, Pill } from '@/components/shared/panel-ui'
import ProjectPipeline, { type PipelinePhase } from '@/components/client/ProjectPipeline'
import { AnimatedIcon } from '@/components/home/sections/AnimatedIcon'
import { resolveProjectIconMeta, projectCardTone, PROJECT_CARD_TONE_CLASSES } from '@/components/shared/service-type'

interface DashboardStats {
  activeProjects: number
  totalOrders: number
  pendingQuotes: number
  cartItems: number
  orderByMonth: { month: string; orders: number }[]
}

interface FeaturedProject {
  id: string
  name: string
  description: string
  status: string
  serviceType: string
  icon?: string | null
  progress: number
  phases: PipelinePhase[]
}

type Tone = 'default' | 'success' | 'warning' | 'danger'

const statusTone: Record<string, { tone: Tone; label: string }> = {
  planning: { tone: 'danger', label: 'Cotizado' },
  design: { tone: 'default', label: 'Diseño' },
  development: { tone: 'default', label: 'Desarrollo' },
  testing: { tone: 'warning', label: 'Revisión' },
  completed: { tone: 'success', label: 'Entregado' },
  maintenance: { tone: 'warning', label: 'Mantenimiento' },
  paused: { tone: 'warning', label: 'Pausado' },
  cancelled: { tone: 'danger', label: 'Cancelado' },
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
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

export default function ClientDashboard() {
  const { data: session } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    activeProjects: 0, totalOrders: 0, pendingQuotes: 0, cartItems: 0, orderByMonth: [],
  })
  const [featuredProject, setFeaturedProject] = useState<FeaturedProject | null>(null)
  const [loading, setLoading] = useState(true)
  const [showQuote, setShowQuote] = useState(false)

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true)
      const [statsRes, projectsRes] = await Promise.all([
        fetch('/api/dashboard/stats'),
        fetch('/api/client-projects'),
      ])
      if (statsRes.ok) {setStats(await statsRes.json())}
      if (projectsRes.ok) {
        const projects: FeaturedProject[] = await projectsRes.json()
        // El proyecto que más importa mostrar: el primero que siga en curso;
        // si todos están cerrados, se muestra el más reciente igual.
        const active = projects.find((p) => !['completed', 'cancelled'].includes(p.status))
        setFeaturedProject(active ?? projects[projects.length - 1] ?? null)
      }
    } catch { /* silent */ }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { if (session?.user) {fetchDashboard()} }, [session, fetchDashboard])

  // Gráfico radial: un solo anillo tipo gauge con el total de "cosas en
  // curso ahora mismo" (proyectos + cotizaciones) y el número grande al
  // centro — dos anillos casi del mismo color eran indistinguibles entre
  // sí y no se leían como un gráfico radial real.
  // Mientras no haya actividad real, se muestra un patrón de ejemplo en baja
  // opacidad —solo para ilustrar el gráfico— que desaparece en cuanto el
  // cliente tiene su primer proyecto o cotización.
  const hasRadialData = stats.activeProjects > 0 || stats.pendingQuotes > 0
  const radialTotal = stats.activeProjects + stats.pendingQuotes
  const radialMax = hasRadialData ? Math.max(radialTotal, 4) : 4
  const radialValue = hasRadialData ? radialTotal : 3
  const radialData = [{ name: 'En curso', value: radialValue, fill: '#26FFDF' }]

  // Igual para las barras: si nunca ha habido pedidos, se dibuja una curva
  // de ejemplo tenue en vez de una cuadrícula completamente vacía.
  const hasOrderData = stats.orderByMonth.some((m) => m.orders > 0)
  const exampleOrderByMonth = stats.orderByMonth.map((m, i) => ({
    ...m,
    orders: [1, 3, 2, 4, 2, 3][i] ?? 2,
  }))
  const orderChartData = hasOrderData ? stats.orderByMonth : exampleOrderByMonth

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#08A696] to-[#26FFDF] rounded-full blur-xl opacity-30 animate-pulse" />
            <Loader2 className="h-10 w-10 animate-spin text-[#26FFDF] relative" />
          </div>
          <p className="text-textSecondary font-bricolage text-sm">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  const featuredMeta = featuredProject ? resolveProjectIconMeta(featuredProject) : null
  const featuredStatus = featuredProject
    ? statusTone[featuredProject.status] ?? { tone: 'default' as Tone, label: featuredProject.status }
    : null

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen p-4 sm:p-6 lg:p-8 font-bricolage max-w-7xl mx-auto space-y-6 sm:space-y-8"
    >
      {/* ─── Proyecto destacado: lo primero que un cliente quiere saber al
           entrar es "¿en qué va lo que contraté?", así que ese estado va
           al frente en vez de repartirse entre tres gráficos genéricos. ─── */}
      <motion.div variants={itemVariants}>
        {featuredProject && featuredMeta && featuredStatus ? (
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#08a6961e] to-[#26ffde23] rounded-2xl blur opacity-30" />
            <div className={`relative bg-[#02505931] backdrop-blur-sm rounded-2xl border ${PROJECT_CARD_TONE_CLASSES[projectCardTone(featuredProject.status)]} p-6 sm:p-8`}>
              <div className="flex flex-col sm:flex-row sm:items-start gap-6">
                <div className="shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-[#08A696]/20 to-[#26FFDF]/10 border border-[#08A696]/30 flex items-center justify-center">
                  <AnimatedIcon kind={featuredMeta.kind} icon={featuredMeta.icon} active size={30} className="text-[#26FFDF]" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#26FFDF]/70">
                        Tu proyecto
                      </p>
                      <h2 className="text-xl sm:text-2xl font-bold text-white mt-0.5">{featuredProject.name}</h2>
                    </div>
                    <Pill tone={featuredStatus.tone}>{featuredStatus.label}</Pill>
                  </div>
                  {featuredProject.description && (
                    <p className="text-textSecondary text-sm mt-2 line-clamp-2">{featuredProject.description}</p>
                  )}

                  <div className="mt-6">
                    <ProjectPipeline phases={featuredProject.phases} />
                  </div>

                  <div className="mt-6 flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-textSecondary">Progreso</span>
                        <span className="text-[#26FFDF] font-medium">{featuredProject.progress}%</span>
                      </div>
                      <div className="w-full bg-[#02505960] rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-[#08A696] to-[#26FFDF] h-2 rounded-full transition-all duration-500"
                          style={{ width: `${featuredProject.progress}%` }}
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => router.push(`/client-dashboard/projects/${featuredProject.id}`)}
                      className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#08A696]/20 border border-[#08A696]/40 text-[#26FFDF] text-sm font-medium hover:bg-[#08A696]/30 hover:border-[#26FFDF] transition-all"
                    >
                      Ver proyecto <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Panel className="p-6 sm:p-8 text-center">
            <HelpCircle className="h-9 w-9 text-[#08A696]/50 mx-auto mb-3" />
            <h2 className="text-white font-bold text-lg">Aún no tienes proyectos activos</h2>
            <p className="text-textSecondary text-sm mt-1 max-w-md mx-auto">
              Cuéntanos qué necesitas —landing page, e-commerce o aplicación web— y te preparamos una cotización.
            </p>
            <button
              onClick={() => setShowQuote(true)}
              className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#08A696] to-[#26FFDF] text-black font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Solicitar cotización
            </button>
          </Panel>
        )}
      </motion.div>

      {/* ─── Actividad: cada indicador en el formato que mejor lo explica,
           sin repetir el mismo número en tres formatos distintos ─── */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Radial: cosas en curso ahora mismo */}
        <GlassCard>
          <div className="p-5 flex flex-col h-full">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-white font-semibold text-sm">En curso</h3>
              {!hasRadialData && (
                <span className="text-[9px] font-semibold uppercase tracking-wider text-textSecondary/50 border border-white/10 rounded-full px-2 py-0.5">
                  Vista previa
                </span>
              )}
            </div>
            <p className="text-textSecondary text-xs mb-2">Proyectos y cotizaciones activas</p>
            <div className={`relative flex-1 transition-opacity ${hasRadialData ? '' : 'opacity-30'}`}>
              <ResponsiveContainer width="100%" height={160}>
                <RadialBarChart
                  data={radialData}
                  innerRadius="70%"
                  outerRadius="100%"
                  startAngle={90}
                  endAngle={-270}
                  barSize={14}
                >
                  <PolarRadiusAxis type="number" domain={[0, radialMax]} tick={false} axisLine={false} />
                  <RadialBar dataKey="value" background={{ fill: '#02505960' }} cornerRadius={7} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 top-0 flex flex-col items-center justify-center pointer-events-none" style={{ height: 160 }}>
                <span className="text-3xl font-bold text-white">{radialValue}</span>
                <span className="text-[10px] text-textSecondary uppercase tracking-wider">En curso</span>
              </div>
            </div>
            <div className="space-y-1.5 mt-3 pt-3 border-t border-[#08A696]/15">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-textSecondary">
                  <span className="w-2 h-2 rounded-full bg-[#26FFDF]" /> Proyectos activos
                </span>
                <span className="text-white font-semibold">{stats.activeProjects}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-textSecondary">
                  <span className="w-2 h-2 rounded-full bg-[#08A696]" /> Cotizaciones pendientes
                </span>
                <span className="text-white font-semibold">{stats.pendingQuotes}</span>
              </div>
            </div>
            {!hasRadialData && (
              <p className="text-textSecondary/50 text-[11px] text-center mt-2">
                Aún no tienes proyectos ni cotizaciones activas
              </p>
            )}
          </div>
        </GlassCard>

        {/* Barras: pedidos en el tiempo */}
        <GlassCard>
          <div className="p-5 flex flex-col h-full">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-white font-semibold text-sm">Pedidos</h3>
              {!hasOrderData && (
                <span className="text-[9px] font-semibold uppercase tracking-wider text-textSecondary/50 border border-white/10 rounded-full px-2 py-0.5">
                  Vista previa
                </span>
              )}
            </div>
            <p className="text-textSecondary text-xs mb-2">Últimos 6 meses</p>
            <ResponsiveContainer width="100%" height={200} className={`flex-1 transition-opacity ${hasOrderData ? '' : 'opacity-30'}`}>
              <BarChart data={orderChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#08A69615" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: '#a0a0a0', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={false} axisLine={false} width={0} allowDecimals={false} />
                {hasOrderData && (
                  <Tooltip
                    cursor={{ fill: '#08A69610' }}
                    contentStyle={{ background: '#0A1A1A', border: '1px solid #08A69630', borderRadius: 12, color: '#fff' }}
                    labelStyle={{ color: '#26FFDF' }}
                  />
                )}
                <defs>
                  <linearGradient id="ordersBarGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#26FFDF" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#08A696" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
                <Bar dataKey="orders" name="Pedidos" fill="url(#ordersBarGrad)" radius={[6, 6, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Carrito: ícono grande animado en vez de una cifra suelta */}
        <GlassCard>
          <div className="p-5 flex flex-col items-center justify-center h-full text-center min-h-[240px]">
            <AnimatedIcon
              kind="cart-bounce"
              icon={ShoppingCart}
              active
              size={64}
              className="text-[#26FFDF]"
            />
            <p className="text-4xl font-bold text-white mt-4">{stats.cartItems}</p>
            <p className="text-textSecondary text-xs font-medium uppercase tracking-wider mt-1.5">
              En el carrito
            </p>
          </div>
        </GlassCard>
      </motion.div>

      <QuoteSurvey open={showQuote} onClose={() => { setShowQuote(false); fetchDashboard() }} />
    </motion.div>
  )
}
