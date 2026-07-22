import { auth } from "@/auth"
import { db } from "@/lib/db"
import { orders, quotes, meetingRequests, projects, products, profiles } from "@/lib/db/schema"
import { count, eq } from "drizzle-orm"
import { redirect } from "next/navigation"
import {
  Package, ShoppingBag, MessageSquare, CalendarClock, FolderKanban, Users
} from "lucide-react"

async function getStats() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const [[o], [q], [m], [p], [pr], [clients]] = await Promise.all([
    db.select({ total: count() }).from(orders),
    db.select({ total: count() }).from(quotes).where(eq(quotes.status, "pending")),
    db.select({ total: count() }).from(meetingRequests).where(eq(meetingRequests.status, "pending")),
    db.select({ total: count() }).from(projects).where(eq(projects.status, "active")),
    db.select({ total: count() }).from(products).where(eq(products.isActive, true)),
    db.select({ total: count() }).from(profiles).where(eq(profiles.role, "client")),
  ])

  return {
    totalOrders: Number(o?.total ?? 0),
    pendingQuotes: Number(q?.total ?? 0),
    pendingMeetings: Number(m?.total ?? 0),
    activeProjects: Number(p?.total ?? 0),
    activeProducts: Number(pr?.total ?? 0),
    totalClients: Number(clients?.total ?? 0),
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  const cards = [
    { label: "Pedidos", value: stats.totalOrders, icon: ShoppingBag, color: "from-blue-500 to-cyan-500" },
    { label: "Cotizaciones Pendientes", value: stats.pendingQuotes, icon: MessageSquare, color: "from-amber-500 to-orange-500" },
    { label: "Reuniones Pendientes", value: stats.pendingMeetings, icon: CalendarClock, color: "from-purple-500 to-pink-500" },
    { label: "Proyectos Activos", value: stats.activeProjects, icon: FolderKanban, color: "from-emerald-500 to-teal-500" },
    { label: "Productos Activos", value: stats.activeProducts, icon: Package, color: "from-green-500 to-emerald-500" },
    { label: "Clientes", value: stats.totalClients, icon: Users, color: "from-sky-500 to-blue-500" },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Panel de Administración</h1>
        <p className="text-gray-400">Bienvenido al sistema de gestión V1TR0</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.label}
              className="bg-black/40 backdrop-blur-sm border border-[#08A696]/20 rounded-xl p-6 hover:border-[#08A696]/40 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${card.color} bg-opacity-20`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <p className="text-3xl font-bold text-white mb-1">{card.value}</p>
              <p className="text-sm text-gray-400">{card.label}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
