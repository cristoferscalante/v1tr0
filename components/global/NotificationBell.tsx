"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Bell, Check, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface Item {
  id: string
  title: string
  body: string | null
  href: string | null
  readAt: string | null
  createdAt: string
}

const POLL_MS = 60_000

/**
 * Campana compartida por la barra del equipo y la del cliente. Sondea cada
 * minuto: no hay canal en tiempo real en el proyecto y una notificación de
 * proyecto no necesita llegar antes que eso.
 */
export default function NotificationBell({ className }: { className?: string }) {
  const [items, setItems] = useState<Item[]>([])
  const [unread, setUnread] = useState(0)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const boxRef = useRef<HTMLDivElement>(null)

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications?limit=15")
      if (!res.ok) {return}
      const data = await res.json()
      setItems(data.items ?? [])
      setUnread(data.unread ?? 0)
    } catch {
      // La campana es accesoria: si falla el sondeo no se molesta a nadie.
    }
  }, [])

  useEffect(() => {
    void load()
    const t = setInterval(load, POLL_MS)
    return () => clearInterval(t)
  }, [load])

  // Cerrar al hacer clic fuera.
  useEffect(() => {
    if (!open) {return}
    const onDown = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {setOpen(false)}
    }
    document.addEventListener("mousedown", onDown)
    return () => document.removeEventListener("mousedown", onDown)
  }, [open])

  async function markAll() {
    setLoading(true)
    // Optimista: la lista se marca de inmediato y se recarga al terminar.
    setItems((c) => c.map((i) => ({ ...i, readAt: i.readAt ?? new Date().toISOString() })))
    setUnread(0)
    await fetch("/api/notifications/read-all", { method: "POST" }).catch(() => {})
    await load()
    setLoading(false)
  }

  async function markOne(item: Item) {
    if (item.readAt) {return}
    setItems((c) => c.map((i) => (i.id === item.id ? { ...i, readAt: new Date().toISOString() } : i)))
    setUnread((n) => Math.max(0, n - 1))
    await fetch(`/api/notifications/${item.id}`, { method: "PATCH" }).catch(() => {})
  }

  return (
    <div ref={boxRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={unread > 0 ? `Notificaciones (${unread} sin leer)` : "Notificaciones"}
        className="relative rounded-lg p-2 text-white/60 transition-colors hover:bg-white/5 hover:text-white"
      >
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#08A696] px-1 font-mono text-[9px] font-semibold text-black">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 rounded-xl border border-[#08A696]/20 bg-[#031f24f2] p-2 backdrop-blur-md">
          <div className="flex items-center justify-between px-2 py-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-white/60">
              Notificaciones
            </span>
            {unread > 0 && (
              <button
                type="button"
                onClick={markAll}
                className="flex items-center gap-1 font-mono text-[10px] text-[#26FFDF] hover:underline"
              >
                {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                marcar todas
              </button>
            )}
          </div>

          <div className="mt-1 max-h-80 space-y-1 overflow-y-auto">
            {items.length === 0 && (
              <p className="py-6 text-center font-mono text-[10px] text-white/25">sin novedades</p>
            )}
            {items.map((item) => {
              const inner = (
                <div
                  className={cn(
                    "rounded-lg px-2.5 py-2 transition-colors hover:bg-white/[0.04]",
                    !item.readAt && "bg-[#08A696]/[0.07]",
                  )}
                >
                  <p className="flex items-start gap-1.5 text-[13px] leading-snug text-white/85">
                    {!item.readAt && (
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#08A696]" />
                    )}
                    {item.title}
                  </p>
                  {item.body && (
                    <p className="mt-0.5 line-clamp-2 text-[11px] text-white/45">{item.body}</p>
                  )}
                  <p className="mt-0.5 font-mono text-[10px] text-white/25">
                    {new Date(item.createdAt).toLocaleString("es-CO", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              )

              return item.href ? (
                <Link key={item.id} href={item.href} onClick={() => markOne(item)} className="block">
                  {inner}
                </Link>
              ) : (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => markOne(item)}
                  className="block w-full text-left"
                >
                  {inner}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
