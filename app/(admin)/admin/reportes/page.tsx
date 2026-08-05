import { auth } from "@/auth"
import { db } from "@/lib/db"
import { orders, quotes, meetingRequests, projects, profiles, products } from "@/lib/db/schema"
import { and, count, eq, ne } from "drizzle-orm"
import { redirect } from "next/navigation"
import { PanelPage, SectionHeading } from "@/components/shared/panel-ui"

export default async function ReportsPage() {
  const session = await auth()
  if (!session?.user) {redirect("/login")}

  const [
    totalOrders, paidOrders,
    totalQuotes, approvedQuotes,
    totalMeetings, confirmedMeetings,
    activeProjects, completedProjects,
    totalClients, totalProducts
  ] = await Promise.all([
    db.select({ v: count() }).from(orders).then(r => Number(r[0]?.v ?? 0)),
    db.select({ v: count() }).from(orders).where(eq(orders.paymentStatus, "paid")).then(r => Number(r[0]?.v ?? 0)),
    db.select({ v: count() }).from(quotes).then(r => Number(r[0]?.v ?? 0)),
    db.select({ v: count() }).from(quotes).where(eq(quotes.status, "approved")).then(r => Number(r[0]?.v ?? 0)),
    db.select({ v: count() }).from(meetingRequests).then(r => Number(r[0]?.v ?? 0)),
    db.select({ v: count() }).from(meetingRequests).where(eq(meetingRequests.status, "confirmed")).then(r => Number(r[0]?.v ?? 0)),
    // "active" nunca existió como valor real de projects.status (era el
    // default legacy de antes de la migración a planning/design/.../maintenance);
    // este conteo daba 0 en silencio. Mismo criterio de "en curso" que el
    // dashboard y las estadísticas del cliente.
    db.select({ v: count() }).from(projects).where(
      and(ne(projects.status, "completed"), ne(projects.status, "cancelled"), ne(projects.status, "paused"))
    ).then(r => Number(r[0]?.v ?? 0)),
    db.select({ v: count() }).from(projects).where(eq(projects.status, "completed")).then(r => Number(r[0]?.v ?? 0)),
    db.select({ v: count() }).from(profiles).where(eq(profiles.role, "client")).then(r => Number(r[0]?.v ?? 0)),
    db.select({ v: count() }).from(products).then(r => Number(r[0]?.v ?? 0)),
  ])

  const conversionRate = totalQuotes > 0 ? ((approvedQuotes / totalQuotes) * 100).toFixed(1) : "0"
  const paymentRate = totalOrders > 0 ? ((paidOrders / totalOrders) * 100).toFixed(1) : "0"

  const metrics = [
    { label: "Total Pedidos", value: totalOrders, sub: `${paidOrders} pagados (${paymentRate}%)` },
    { label: "Cotizaciones", value: totalQuotes, sub: `${approvedQuotes} aprobadas (${conversionRate}%)` },
    { label: "Reuniones", value: totalMeetings, sub: `${confirmedMeetings} confirmadas` },
    { label: "Proyectos", value: activeProjects, sub: `${completedProjects} completados` },
    { label: "Clientes Registrados", value: totalClients, sub: null },
    { label: "Productos", value: totalProducts, sub: null },
  ]

  return (
    <PanelPage>
      <SectionHeading badge="Métricas" title="Reportes" subtitle="Resumen general de la operación" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((m) => (
          <div key={m.label} className="bg-[#02505931] backdrop-blur-sm border border-[#08A696]/20 rounded-2xl p-6">
            <p className="text-3xl font-bold text-white mb-1">{m.value}</p>
            <p className="text-sm text-textSecondary">{m.label}</p>
            {m.sub && <p className="text-xs text-textSecondary/60 mt-1">{m.sub}</p>}
          </div>
        ))}
      </div>
    </PanelPage>
  )
}
