'use client'

import { useCallback, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  FolderOpen, ShoppingBag, HelpCircle, LogOut,
  Loader2, ChevronRight, Camera, Pencil, Check, X, Package,
} from 'lucide-react'
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart,
  Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts'
import { toast } from 'sonner'
import { UploadButton } from '@uploadthing/react'
import type { OurFileRouter } from '@/lib/uploadthing'
import QuoteSurvey from '@/components/dashboard/QuoteSurvey'

interface DashboardData {
  activeProjects: number; totalProjects: number; pendingTasks: number
  overallProgress: number; upcomingDeadlines: number; totalOrders: number
  pendingQuotes: number; cartItems: number; recentOrders: number
  orderByMonth: { month: string; orders: number }[]
  projectImages: string[]; orderImages: string[]
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
}

function GlassCard({ children, className = '', onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  return (
    <div className={`relative group h-full ${onClick ? 'cursor-pointer' : ''}`} onClick={onClick}>
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#08a6961e] to-[#26ffde23] rounded-2xl blur opacity-30 group-hover:opacity-60 transition-all duration-300" />
      <div className={`relative bg-[#02505931] backdrop-blur-sm rounded-2xl border border-[#08A696]/20 transition-all duration-300 h-full ${className}`}>
        {children}
      </div>
    </div>
  )
}

export default function ClientDashboard() {
  const { data: session, update } = useSession()
  const { signOut } = useAuth()
  const router = useRouter()
  const [data, setData] = useState<DashboardData>({
    activeProjects: 0, totalProjects: 0, pendingTasks: 0, overallProgress: 0,
    upcomingDeadlines: 0, totalOrders: 0, pendingQuotes: 0, cartItems: 0,
    recentOrders: 0, orderByMonth: [],
    projectImages: [], orderImages: [],
  })
  const [loading, setLoading] = useState(true)
  const [showQuote, setShowQuote] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState(session?.user?.name ?? '')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  useEffect(() => { if (session?.user) fetchStats() }, [session])
  useEffect(() => { setEditName(session?.user?.name ?? '') }, [session?.user?.name])

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/dashboard/stats')
      if (res.ok) setData(await res.json())
    } catch { /* silent */ }
    finally { setLoading(false) }
  }, [])

  const handleSaveName = async () => {
    try {
      const res = await fetch('/api/profile', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: editName }) })
      if (res.ok) { await update({ name: editName }); toast.success('Nombre actualizado'); setEditing(false) }
    } catch { toast.error('Error al guardar') }
  }

  const radarData = [
    { metric: 'Proyectos', value: Math.min(data.activeProjects, 10) },
    { metric: 'Compras', value: Math.min(data.totalOrders, 10) },
    { metric: 'Cotizaciones', value: Math.min(data.pendingQuotes, 10) },
    { metric: 'Tareas', value: Math.min(data.pendingTasks, 10) },
    { metric: 'Carrito', value: Math.min(data.cartItems, 10) },
  ]

  const metricsBar = [
    { name: 'Proyectos', value: data.activeProjects, color: '#26FFDF' },
    { name: 'Compras', value: data.totalOrders, color: '#08A696' },
    { name: 'Cotizaciones', value: data.pendingQuotes, color: '#FFB800' },
    { name: 'Carrito', value: data.cartItems, color: '#FF6B6B' },
  ]

  const quickStats = [
    { label: 'Proyectos', value: data.activeProjects, icon: FolderOpen },
    { label: 'Compras', value: data.totalOrders, icon: ShoppingBag },
    { label: 'Cotizaciones', value: data.pendingQuotes, icon: HelpCircle },
    { label: 'Carrito', value: data.cartItems, icon: Package },
  ]

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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen p-4 sm:p-6 lg:p-8 font-bricolage max-w-7xl mx-auto space-y-6 sm:space-y-8"
    >
      {/* ─── Profile Hero ─── */}
      <motion.div variants={itemVariants}>
        <GlassCard>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 sm:p-8">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-[#08A696] to-[#26FFDF] rounded-full blur-sm opacity-50" />
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-[#08A696]/40 bg-[#02505960]">
                {avatarUrl || session?.user?.image ? (
                  <img src={avatarUrl ?? session?.user?.image ?? ''} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-[#26FFDF]">
                    {session?.user?.name?.charAt(0)?.toUpperCase() ?? session?.user?.email?.charAt(0)?.toUpperCase() ?? '?'}
                  </div>
                )}
              </div>
              <UploadButton<OurFileRouter, "imageUploader">
                endpoint="imageUploader"
                onClientUploadComplete={(res) => { if (res?.[0]) setAvatarUrl(res[0].url); toast.success('Foto actualizada') }}
                onUploadError={(e) => { toast.error(e.message) }}
                appearance={{
                  button: 'absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-gradient-to-r from-[#08A696] to-[#26FFDF] flex items-center justify-center border-2 border-[#025059] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer',
                  allowedContent: 'hidden',
                }}
                content={{ button: <Camera className="w-4 h-4 text-black" /> }}
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 w-full">
              {editing ? (
                <div className="flex items-center gap-2 w-full max-w-xs">
                  <input value={editName} onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 bg-black/40 border border-[#08A696]/30 rounded-xl px-4 py-2 text-white text-xl font-bold focus:outline-none focus:border-[#26FFDF]" autoFocus />
                  <button onClick={handleSaveName} className="p-2 bg-[#00D084]/20 rounded-xl hover:bg-[#00D084]/30 transition-colors"><Check className="w-4 h-4 text-[#00D084]" /></button>
                  <button onClick={() => { setEditing(false); setEditName(session?.user?.name ?? '') }} className="p-2 bg-[#FF6B6B]/20 rounded-xl hover:bg-[#FF6B6B]/30 transition-colors"><X className="w-4 h-4 text-[#FF6B6B]" /></button>
                </div>
              ) : (
                <div className="flex items-center gap-3 group/edit">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white truncate">{session?.user?.name ?? 'Usuario'}</h1>
                  <button onClick={() => setEditing(true)} className="opacity-0 group-hover/edit:opacity-100 transition-opacity p-1.5 rounded-lg bg-[#08A696]/20 hover:bg-[#08A696]/30">
                    <Pencil className="w-4 h-4 text-[#26FFDF]" />
                  </button>
                </div>
              )}
              <p className="text-textSecondary text-sm mt-1">{session?.user?.email}</p>
              <div className="flex items-center gap-3 mt-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold bg-[#08A696]/10 border border-[#08A696]/30 text-[#26FFDF]">
                  Cliente
                </span>
                <span className="text-textSecondary text-xs">Miembro desde {new Date().getFullYear()}</span>
              </div>
            </div>

            <button onClick={() => signOut()}
              className="flex-shrink-0 p-3 rounded-xl bg-[#FF6B6B]/10 border border-[#FF6B6B]/20 text-[#FF6B6B] hover:bg-[#FF6B6B]/20 transition-all duration-300"
              title="Cerrar sesión">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </GlassCard>
      </motion.div>

      {/* ─── Section Header ─── */}
      <motion.div variants={itemVariants} className="flex flex-col items-center text-center mb-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold tracking-[0.22em] uppercase bg-[#08A696]/10 border border-[#08A696]/30 text-[#26FFDF] mb-3">
          Analytics
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-white">Rendimiento General</h2>
        <p className="text-textSecondary text-sm mt-1 max-w-xl">Métricas clave y actividad reciente de tu cuenta</p>
        <div className="w-20 h-1 bg-gradient-to-r from-[#08A696] to-[#26FFDF] rounded-full mt-4" />
      </motion.div>

      {/* ─── Charts Row ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Radar */}
        <motion.div variants={itemVariants}>
          <GlassCard>
            <div className="p-5 flex flex-col">
              <h3 className="text-white font-semibold text-sm mb-1">Radar de Actividad</h3>
              <p className="text-textSecondary text-xs mb-4">Distribución por categoría</p>
              <ResponsiveContainer width="100%" height={260} className="flex-1">
                <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                  <PolarGrid stroke="#08A69630" />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: '#a0a0a0', fontSize: 11 }} />
                  <PolarRadiusAxis tick={false} axisLine={false} domain={[0, 10]} />
                  <Radar name="Cliente" dataKey="value" fill="#26FFDF" fillOpacity={0.12} stroke="#26FFDF" strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </motion.div>

        {/* Bar */}
        <motion.div variants={itemVariants}>
          <GlassCard>
            <div className="p-5 flex flex-col">
              <h3 className="text-white font-semibold text-sm mb-1">Órdenes Mensuales</h3>
              <p className="text-textSecondary text-xs mb-4">Últimos 6 meses</p>
              <ResponsiveContainer width="100%" height={260} className="flex-1">
                <BarChart data={data.orderByMonth.length > 0 ? data.orderByMonth : [{ month: 'Ene', orders: 0 }, { month: 'Feb', orders: 0 }, { month: 'Mar', orders: 0 }, { month: 'Abr', orders: 0 }, { month: 'May', orders: 0 }, { month: 'Jun', orders: 0 }]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#08A69610" />
                  <XAxis dataKey="month" tick={{ fill: '#a0a0a0', fontSize: 11 }} axisLine={false} />
                  <YAxis tick={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: '#0A1A1A', border: '1px solid #08A69630', borderRadius: 12, color: '#fff' }} labelStyle={{ color: '#26FFDF' }} />
                  <defs>
                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#26FFDF" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#08A696" stopOpacity={0.3} />
                    </linearGradient>
                  </defs>
                  <Bar dataKey="orders" fill="url(#barGrad)" radius={[6, 6, 0, 0]} maxBarSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </motion.div>

        {/* Pie Chart 4 niveles */}
        <motion.div variants={itemVariants}>
          <GlassCard>
            <div className="p-5 flex flex-col">
              <h3 className="text-white font-semibold text-sm mb-1">Distribución</h3>
              <p className="text-textSecondary text-xs mb-4">Cada anillo es una métrica</p>
              <ResponsiveContainer width="100%" height={260} className="flex-1">
                <PieChart>
                  {metricsBar.map((m, i) => {
                    const maxVal = Math.max(...metricsBar.map(x => x.value), 1)
                    const inner = 30 + i * 25
                    const outer = inner + 22
                    const data = [
                      { name: m.name, value: Math.max(m.value, 0.1) },
                      { name: 'rest', value: Math.max(maxVal - m.value, 0.1) },
                    ]
                    return (
                      <Pie
                        key={m.name}
                        data={data}
                        innerRadius={inner}
                        outerRadius={outer}
                        startAngle={90}
                        endAngle={-270}
                        dataKey="value"
                        stroke="none"
                      >
                        <Cell fill={m.color} fillOpacity={0.6} />
                        <Cell fill="#08A69610" />
                      </Pie>
                    )
                  })}
                  <Tooltip
                    contentStyle={{ background: '#0A1A1A', border: '1px solid #08A69630', borderRadius: 12, color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-3 mt-3 justify-center">
                {metricsBar.map((m) => (
                  <div key={m.name} className="flex items-center gap-1.5 text-xs text-textSecondary">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: m.color, opacity: 0.6 }} />
                    {m.name} <span className="text-white font-semibold">{m.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* ─── Quick Stats ─── */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat) => (
          <GlassCard key={stat.label}>
            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="text-textSecondary text-[10px] font-semibold uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#08A696]/20 to-[#26FFDF]/20">
                <stat.icon className="h-5 w-5 text-[#26FFDF]" />
              </div>
            </div>
          </GlassCard>
        ))}
      </motion.div>

      {/* ─── Navigation Cards ─── */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[

          { title: 'Proyectos', desc: 'Ver mis proyectos activos', badge: `${data.activeProjects} activos`, href: '/client-dashboard/projects',
            images: data.projectImages.length > 0 ? data.projectImages : ['/imagenes/placeholders/placeholder.jpg'] },
          { title: 'Mis Compras', desc: 'Productos y servicios adquiridos', badge: `${data.totalOrders} compras`, href: '/client-dashboard/orders',
            images: data.orderImages.length > 0 ? data.orderImages : ['/imagenes/placeholders/placeholder.jpg'] },
          { title: 'Cotizar', desc: 'Solicita un presupuesto', badge: `${data.pendingQuotes} pendientes`, href: null, onClick: () => setShowQuote(true),
            images: ['/imagenes/placeholders/placeholder.jpg', '/imagenes/tienda/pos.png', '/imagenes/tienda/heltec-duo-con-efecto.png', '/imagenes/placeholders/placeholder.jpg'] },
          { title: 'Perfil', desc: 'Gestionar mi información', badge: null, href: '/client-dashboard/profile',
            images: ['/imagenes/placeholders/placeholder-user.jpg', '/imagenes/placeholders/placeholder.jpg', '/imagenes/placeholders/placeholder-user.jpg', '/imagenes/placeholders/placeholder.jpg'] },
        ].map((card) => (
          <motion.div key={card.title} variants={itemVariants} className="h-full">
            <div className="relative group cursor-pointer h-full" onClick={() => (card as any).onClick ? (card as any).onClick() : router.push(card.href!)}>
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#08a6961e] to-[#26ffde23] rounded-2xl blur opacity-30 group-hover:opacity-60 transition-all duration-300" />
              <div className="relative bg-[#02505931] backdrop-blur-sm rounded-2xl border border-[#08A696]/20 transition-all duration-300 group-hover:bg-[#02505950] group-hover:border-[#08A696] scale-95 group-hover:scale-100 shadow-lg group-hover:shadow-xl group-hover:shadow-[#08A696]/10 h-full flex flex-col min-h-[200px]">
                {/* Image carousel */}
                <div className="overflow-x-auto snap-x snap-mandatory scrollbar-none flex -mx-0.5 rounded-t-2xl">
                  <div className="flex">
                    {(card as any).images.map((src: string, i: number) => (
                      <div key={i} className="snap-start shrink-0 w-full">
                        <img src={src} alt="" className="w-full h-28 sm:h-32 object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-4 flex flex-col gap-1.5 text-center">
                  <p className="text-white font-semibold group-hover:text-[#26FFDF] transition-colors text-sm sm:text-base">{card.title}</p>
                  <p className="text-textSecondary text-xs">{card.desc}</p>
                  {card.badge && (
                    <span className="self-center inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#08A696]/10 text-[#26FFDF] border border-[#08A696]/30">
                      {card.badge}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ─── Cart Summary ─── */}
      <motion.div variants={itemVariants}>
        <div className="relative group cursor-pointer" onClick={() => router.push('/client-dashboard/orders')}>
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#08a6961e] to-[#26ffde23] rounded-2xl blur opacity-30 group-hover:opacity-60 transition-all duration-300" />
          <div className="relative bg-[#02505931] backdrop-blur-sm rounded-2xl border border-[#08A696]/20 p-5 transition-all duration-300 group-hover:bg-[#02505950] group-hover:border-[#08A696] scale-95 group-hover:scale-100 shadow-lg group-hover:shadow-xl group-hover:shadow-[#08A696]/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-[#08A696]/20 to-[#26FFDF]/20">
                  <Package className="h-6 w-6 text-[#26FFDF]" />
                </div>
                <div>
                  <p className="text-white font-semibold group-hover:text-[#26FFDF] transition-colors">Carrito de Compras</p>
                  <p className="text-textSecondary text-xs mt-0.5">{data.cartItems > 0 ? `${data.cartItems} artículo${data.cartItems !== 1 ? 's' : ''} pendiente${data.cartItems !== 1 ? 's' : ''}` : 'Sin artículos'}</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-textSecondary group-hover:text-[#26FFDF] transition-colors" />
            </div>
          </div>
        </div>
      </motion.div>

      <QuoteSurvey open={showQuote} onClose={() => setShowQuote(false)} />
    </motion.div>
  )
}
