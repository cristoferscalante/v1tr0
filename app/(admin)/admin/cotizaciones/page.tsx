import { auth } from "@/auth"
import { db } from "@/lib/db"
import { quotes, profiles } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import { redirect } from "next/navigation"

export default async function QuotesPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

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
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Cotizaciones</h1>
      <div className="grid gap-4">
        {allQuotes.map((q) => (
          <div key={q.id} className="bg-black/40 backdrop-blur-sm border border-[#08A696]/20 rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">{q.projectType}</h3>
                <p className="text-sm text-gray-400">{q.clientEmail ?? "—"}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                q.status === "pending" ? "bg-yellow-500/20 text-yellow-400" :
                q.status === "reviewing" ? "bg-blue-500/20 text-blue-400" :
                q.status === "approved" ? "bg-green-500/20 text-green-400" :
                "bg-red-500/20 text-red-400"
              }`}>{q.status}</span>
            </div>
            <p className="text-gray-300 text-sm mb-3 line-clamp-2">{q.description}</p>
            <div className="flex gap-4 text-xs text-gray-400">
              {q.budget && <span>Presupuesto: {q.budget}</span>}
              {q.timeline && <span>Plazo: {q.timeline}</span>}
              <span>{q.createdAt?.toLocaleDateString()}</span>
            </div>
          </div>
        ))}
        {allQuotes.length === 0 && (
          <p className="text-center text-gray-500 py-12">No hay cotizaciones aún</p>
        )}
      </div>
    </div>
  )
}
