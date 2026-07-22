import { auth } from "@/auth"
import { db } from "@/lib/db"
import { orders, quotes, meetingRequests, projects, profiles, products } from "@/lib/db/schema"
import { count, eq } from "drizzle-orm"
import { redirect } from "next/navigation"

export default async function ReportsPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

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
    db.select({ v: count() }).from(projects).where(eq(projects.status, "active")).then(r => Number(r[0]?.v ?? 0)),
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
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Reportes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((m) => (
          <div key={m.label} className="bg-black/40 backdrop-blur-sm border border-[#08A696]/20 rounded-xl p-6">
            <p className="text-3xl font-bold text-white mb-1">{m.value}</p>
            <p className="text-sm text-gray-400">{m.label}</p>
            {m.sub && <p className="text-xs text-gray-500 mt-1">{m.sub}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}
