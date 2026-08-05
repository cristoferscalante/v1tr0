import { auth } from "@/auth"
import { db } from "@/lib/db"
import { orders, quotes, meetingRequests, projects, products, profiles } from "@/lib/db/schema"
import { and, count, eq, ne } from "drizzle-orm"
import { redirect } from "next/navigation"
import { ShoppingBag, FolderKanban, Users } from "lucide-react"
import { GlowCard, PanelPage, SectionHeading } from "@/components/shared/panel-ui"

async function getStats() {
  const session = await auth()
  if (!session?.user) {redirect("/login")}

  const [[o], [q], [m], [p], [pr], [clients]] = await Promise.all([
    db.select({ total: count() }).from(orders),
    db.select({ total: count() }).from(quotes).where(eq(quotes.status, "pending")),
    db.select({ total: count() }).from(meetingRequests).where(eq(meetingRequests.status, "pending")),
    // "En curso" = ni entregado, ni pausado, ni cancelado (mantenimiento sí
    // cuenta: sigue siendo trabajo activo del equipo con ese cliente).
    db.select({ total: count() }).from(projects).where(
      and(ne(projects.status, "completed"), ne(projects.status, "cancelled"), ne(projects.status, "paused"))
    ),
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

  const sections = [
    {
      href: "/admin/clientes",
      title: "Clientes",
      description: "Gestiona tus clientes, cotizaciones y reuniones",
      icon: Users,
      stats: [
        { label: "Clientes", value: stats.totalClients },
        { label: "Cotizaciones pendientes", value: stats.pendingQuotes },
        { label: "Reuniones pendientes", value: stats.pendingMeetings },
      ],
    },
    {
      href: "/admin/productos",
      title: "Tienda",
      description: "Administra productos, paquetes y pedidos",
      icon: ShoppingBag,
      stats: [
        { label: "Productos activos", value: stats.activeProducts },
        { label: "Pedidos totales", value: stats.totalOrders },
      ],
    },
    {
      href: "/admin/proyectos",
      title: "Proyectos",
      description: "Sigue el ciclo de vida de cada proyecto en el tablero",
      icon: FolderKanban,
      stats: [{ label: "Proyectos en curso", value: stats.activeProjects }],
    },
  ]

  return (
    <PanelPage>
      <SectionHeading
        badge="Panel"
        title="Panel de Administración"
        subtitle="Bienvenido al sistema de gestión V1TR0"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sections.map((section) => {
          const Icon = section.icon
          return (
            <GlowCard key={section.href} href={section.href} className="p-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#08A696]/20 to-[#26FFDF]/20 w-fit mb-4">
                <Icon className="h-6 w-6 text-[#26FFDF]" />
              </div>
              <h2 className="text-xl font-bold text-white">{section.title}</h2>
              <p className="text-textSecondary text-xs mt-1 mb-4">{section.description}</p>
              <div className="mt-auto space-y-1.5">
                {section.stats.map((s) => (
                  <div key={s.label} className="flex items-center justify-between text-sm">
                    <span className="text-textSecondary">{s.label}</span>
                    <span className="text-white font-semibold">{s.value}</span>
                  </div>
                ))}
              </div>
            </GlowCard>
          )
        })}
      </div>
    </PanelPage>
  )
}
