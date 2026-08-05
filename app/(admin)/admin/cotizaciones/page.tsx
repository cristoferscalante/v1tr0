import { auth } from "@/auth"
import { db } from "@/lib/db"
import { quotes, profiles } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import { redirect } from "next/navigation"
import { PanelPage, SectionHeading } from "@/components/shared/panel-ui"

export default async function QuotesPage() {
  const session = await auth()
  if (!session?.user) {redirect("/login")}

  const allQuotes = await db
    .select({
      id: quotes.id,
      projectType: quotes.projectType,
      description: quotes.description,
      budget: quotes.budget,
      timeline: quotes.timeline,
      status: quotes.status,
      createdAt: quotes.createdAt,
      clientEmail: profiles.email,
    })
    .from(quotes)
    .leftJoin(profiles, eq(quotes.profileId, profiles.id))
    .orderBy(desc(quotes.createdAt))

  return (
    <PanelPage>
      <SectionHeading badge="Ventas" title="Cotizaciones" subtitle="Solicitudes de presupuesto recibidas de tus clientes" />
      <div className="grid gap-4">
        {allQuotes.map((q) => (
          <div key={q.id} className="bg-[#02505931] backdrop-blur-sm border border-[#08A696]/20 rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">{q.projectType}</h3>
                <p className="text-sm text-textSecondary">{q.clientEmail ?? "—"}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                q.status === "pending" ? "bg-yellow-500/20 text-yellow-400" :
                q.status === "reviewing" ? "bg-blue-500/20 text-blue-400" :
                q.status === "approved" ? "bg-green-500/20 text-green-400" :
                "bg-red-500/20 text-red-400"
              }`}>{q.status}</span>
            </div>
            <p className="text-textSecondary text-sm mb-3 line-clamp-2">{q.description}</p>
            <div className="flex gap-4 text-xs text-textSecondary">
              {q.budget && <span>Presupuesto: {q.budget}</span>}
              {q.timeline && <span>Plazo: {q.timeline}</span>}
              <span>{q.createdAt?.toLocaleDateString()}</span>
            </div>
          </div>
        ))}
        {allQuotes.length === 0 && (
          <p className="text-center text-textSecondary/60 py-12">No hay cotizaciones aún</p>
        )}
      </div>
    </PanelPage>
  )
}
