import { db } from "@/lib/db"
import { profiles, orders, projects, quotes, meetingRequests } from "@/lib/db/schema"
import { desc, eq } from "drizzle-orm"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import ClientEditDialog from "@/components/admin/ClientEditDialog"
import { Panel, PanelPage, PanelRow, Pill, StatTile } from "@/components/shared/panel-ui"
import { resolveProjectIconMeta, projectCardTone } from "@/components/shared/service-type"
import ClientSecretsVault from "@/components/admin/ClientSecretsVault"

export default async function ClienteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const client = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, id))
    .then((r) => r[0] ?? null)

  if (!client) {notFound()}

  const [clientOrders, clientProjects, clientQuotes, clientMeetings] = await Promise.all([
    db.select().from(orders).where(eq(orders.profileId, id)).orderBy(desc(orders.createdAt)),
    db.select().from(projects).where(eq(projects.clientId, id)).orderBy(desc(projects.createdAt)),
    db.select().from(quotes).where(eq(quotes.profileId, id)).orderBy(desc(quotes.createdAt)),
    db.select().from(meetingRequests).where(eq(meetingRequests.profileId, id)).orderBy(desc(meetingRequests.createdAt)),
  ])

  return (
    <PanelPage>
      <Link
        href="/admin/clientes"
        className="inline-flex items-center gap-2 text-sm text-textSecondary hover:text-[#26FFDF] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Volver a clientes
      </Link>

      {/* Ficha */}
      <Panel className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="w-16 h-16 shrink-0 rounded-full bg-gradient-to-br from-[#08A696] to-[#26FFDF] flex items-center justify-center text-2xl font-bold text-black">
            {(client.name ?? client.email ?? "?").charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-white truncate">{client.name ?? "Sin nombre"}</h1>
            <p className="text-textSecondary text-sm mt-0.5">{client.email}</p>
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <Pill tone={client.accountStatus === "active" ? "success" : "muted"}>
                {client.accountStatus === "active" ? "Activo" : "Inactivo"}
              </Pill>
              <Pill>{client.role}</Pill>
              {client.phone && <Pill tone="muted">{client.phone}</Pill>}
            </div>
          </div>
          <ClientEditDialog client={client} />
        </div>
      </Panel>

      {/* Indicadores */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile label="Proyectos" value={clientProjects.length} />
        <StatTile label="Pedidos" value={clientOrders.length} />
        <StatTile label="Cotizaciones" value={clientQuotes.length} />
        <StatTile label="Créditos" value={client.credits} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section title="Proyectos" empty={clientProjects.length === 0} emptyLabel="Sin proyectos">
          {clientProjects.map((p) => (
            <PanelRow key={p.id} href={`/admin/proyectos/${p.id}`}>
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-white text-sm font-medium truncate">{p.name}</p>
                  <p className="text-textSecondary text-xs">
                    {resolveProjectIconMeta(p).label}
                  </p>
                </div>
                <Pill tone={projectCardTone(p.status ?? "planning")}>{p.status}</Pill>
              </div>
            </PanelRow>
          ))}
        </Section>

        <Section title="Pedidos" empty={clientOrders.length === 0} emptyLabel="Sin pedidos">
          {clientOrders.map((o) => (
            <PanelRow key={o.id}>
              <div className="flex items-center justify-between gap-3">
                <p className="text-white text-sm font-mono truncate">{o.orderNumber}</p>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-textSecondary text-sm">
                    ${o.total} {o.currency}
                  </span>
                  <Pill tone={o.paymentStatus === "paid" ? "success" : "warning"}>{o.status}</Pill>
                </div>
              </div>
            </PanelRow>
          ))}
        </Section>

        <Section title="Cotizaciones" empty={clientQuotes.length === 0} emptyLabel="Sin cotizaciones">
          {clientQuotes.map((q) => (
            <PanelRow key={q.id}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-white text-sm">{q.projectType}</p>
                  <p className="text-textSecondary text-xs line-clamp-1">{q.description}</p>
                </div>
                <Pill tone={q.status === "approved" ? "success" : "warning"}>{q.status}</Pill>
              </div>
            </PanelRow>
          ))}
        </Section>

        <Section title="Reuniones" empty={clientMeetings.length === 0} emptyLabel="Sin reuniones">
          {clientMeetings.map((m) => (
            <PanelRow key={m.id}>
              <div className="flex items-center justify-between gap-3">
                <p className="text-white text-sm truncate">{m.title}</p>
                <Pill tone={m.status === "approved" ? "success" : "warning"}>{m.status}</Pill>
              </div>
            </PanelRow>
          ))}
        </Section>
      </div>

      <ClientSecretsVault clientId={client.id} />
    </PanelPage>
  )
}

function Section({
  title,
  children,
  empty,
  emptyLabel,
}: {
  title: string
  children: React.ReactNode
  empty: boolean
  emptyLabel: string
}) {
  return (
    <Panel className="p-5">
      <h2 className="text-white font-semibold mb-3">{title}</h2>
      {empty ? (
        <p className="text-textSecondary text-sm py-6 text-center">{emptyLabel}</p>
      ) : (
        <div className="space-y-1">{children}</div>
      )}
    </Panel>
  )
}
