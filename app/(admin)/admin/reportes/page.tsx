import { auth } from "@/auth"
import { db } from "@/lib/db"
import { orders, quotes, meetingRequests, projects, profiles, products } from "@/lib/db/schema"
import { and, count, eq, ne } from "drizzle-orm"
import { redirect } from "next/navigation"
import { Panel, PanelPage, SectionHeading, StatTile } from "@/components/shared/panel-ui"

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

  // Dos métricas focales y el resto como fila secundaria. Antes eran seis
  // números del mismo tamaño: sin rango, el ojo no sabe cuál mirar primero.
  // Las dos de arriba son las que mueven el negocio; las otras son inventario.
  const focales = [
    {
      label: "Conversión de cotizaciones",
      value: `${conversionRate}%`,
      sub: `${approvedQuotes} aprobadas de ${totalQuotes}`,
      ratio: totalQuotes > 0 ? approvedQuotes / totalQuotes : 0,
    },
    {
      label: "Pedidos pagados",
      value: `${paymentRate}%`,
      sub: `${paidOrders} pagados de ${totalOrders}`,
      ratio: totalOrders > 0 ? paidOrders / totalOrders : 0,
    },
  ]

  const secundarias = [
    { label: "Proyectos en curso", value: activeProjects, sub: `${completedProjects} completados` },
    { label: "Reuniones", value: totalMeetings, sub: `${confirmedMeetings} confirmadas` },
    { label: "Clientes", value: totalClients, sub: null },
    { label: "Productos", value: totalProducts, sub: null },
  ]

  return (
    <PanelPage>
      <SectionHeading badge="Métricas" title="Reportes" subtitle="Resumen general de la operación" />

      <div className="grid gap-4 sm:grid-cols-2">
        {focales.map((m) => (
          <Panel key={m.label} className="p-6">
            <p className="font-mono text-[10px] uppercase tracking-wider text-white/35">
              {m.label}
            </p>
            <p className="mt-2 text-4xl font-bold tabular-nums text-white">{m.value}</p>
            {/* Riel de proporción: un porcentaje suelto no dice si 40% es
                bueno; la barra muestra de inmediato cuánto falta para el total. */}
            <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-[#08A696]"
                style={{ width: `${Math.round(m.ratio * 100)}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-white/45">{m.sub}</p>
          </Panel>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {secundarias.map((m) => (
          <StatTile key={m.label} label={m.label} value={m.value} />
        ))}
      </div>

      {secundarias.some((m) => m.sub) && (
        <p className="font-mono text-[10px] text-white/25">
          {secundarias.filter((m) => m.sub).map((m) => `${m.label}: ${m.sub}`).join(" · ")}
        </p>
      )}
    </PanelPage>
  )
}
