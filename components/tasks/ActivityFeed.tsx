"use client"

import { useEffect, useState } from "react"
import { Activity, Loader2 } from "lucide-react"

interface Entry {
  id: string
  action: string
  summary: string
  createdAt: string
  actorName?: string | null
  actorEmail?: string | null
}

function relative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const min = Math.round(diff / 60000)
  if (min < 1) {return "recién"}
  if (min < 60) {return `hace ${min} min`}
  const h = Math.round(min / 60)
  if (h < 24) {return `hace ${h} h`}
  const d = Math.round(h / 24)
  if (d < 30) {return `hace ${d} d`}
  return new Date(iso).toLocaleDateString("es-CO", { day: "2-digit", month: "short" })
}

/**
 * Bitácora del proyecto. `scope` decide de qué endpoint lee: el del equipo
 * trae todo, el del cliente solo lo marcado como visible.
 */
export default function ActivityFeed({
  projectId,
  scope = "admin",
  limit = 40,
}: {
  projectId: string
  scope?: "admin" | "client"
  limit?: number
}) {
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const url =
      scope === "admin"
        ? `/api/admin/projects/${projectId}/activity?limit=${limit}`
        : `/api/projects/${projectId}/activity?limit=${limit}`

    let cancelled = false
    fetch(url)
      .then(async (r) => {
        if (!r.ok) {throw new Error("No se pudo cargar la actividad")}
        return r.json()
      })
      .then((data) => {
        if (!cancelled) {setEntries(data)}
      })
      .catch((e) => {
        if (!cancelled) {setError(e.message)}
      })
      .finally(() => {
        if (!cancelled) {setLoading(false)}
      })

    return () => {
      cancelled = true
    }
  }, [projectId, scope, limit])

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-8 text-white/40">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-xs">Cargando actividad…</span>
      </div>
    )
  }

  if (error) {
    return <p className="py-8 text-center text-xs text-amber-300">{error}</p>
  }

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-10 text-white/30">
        <Activity className="h-5 w-5" />
        <p className="font-mono text-[10px]">todavía no hay movimientos</p>
      </div>
    )
  }

  return (
    <ol className="relative space-y-0">
      {entries.map((e, i) => (
        <li key={e.id} className="relative flex gap-3 pb-4 pl-1">
          {/* Línea vertical continua salvo en la última entrada */}
          {i < entries.length - 1 && (
            <span className="absolute left-[6px] top-3 h-full w-px bg-white/10" aria-hidden />
          )}
          <span className="relative z-10 mt-1.5 h-[7px] w-[7px] shrink-0 rounded-full bg-[#08A696]" />
          <div className="min-w-0">
            <p className="text-[13px] leading-snug text-white/80">{e.summary}</p>
            <p className="mt-0.5 font-mono text-[10px] text-white/30">
              {relative(e.createdAt)}
              {e.actorName || e.actorEmail ? ` · ${e.actorName ?? e.actorEmail}` : ""}
            </p>
          </div>
        </li>
      ))}
    </ol>
  )
}
