"use client"

import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { Loader2, Lock, Send } from "lucide-react"
import { cn } from "@/lib/utils"

interface Comment {
  id: string
  body: string
  visibleToClient: boolean
  createdAt: string
  authorId: string
  authorName: string | null
  authorEmail: string | null
}

/**
 * Hilo de una tarea, compartido por el panel del equipo y el portal del
 * cliente. La API ya filtra las notas internas para el cliente, así que aquí
 * no hace falta volver a decidir qué se muestra.
 */
export default function TaskComments({
  taskId,
  canWriteInternal = false,
}: {
  taskId: string
  /** admin/team pueden marcar un comentario como nota interna. */
  canWriteInternal?: boolean
}) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [draft, setDraft] = useState("")
  const [internal, setInternal] = useState(false)
  const [sending, setSending] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetch(`/api/tasks/${taskId}/comments`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("No se pudo cargar el hilo"))))
      .then((data) => {
        if (!cancelled) {setComments(data)}
      })
      .catch(() => {
        if (!cancelled) {toast.error("No se pudo cargar el hilo")}
      })
      .finally(() => {
        if (!cancelled) {setLoading(false)}
      })
    return () => {
      cancelled = true
    }
  }, [taskId])

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "nearest" })
  }, [comments.length])

  async function send() {
    const text = draft.trim()
    if (!text || sending) {return}

    setSending(true)
    try {
      const res = await fetch(`/api/tasks/${taskId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: text, visibleToClient: !internal }),
      })
      const data = await res.json()
      if (!res.ok) {throw new Error(data.error ?? "No se pudo publicar")}
      setComments((c) => [...c, data])
      setDraft("")
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo publicar")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
        {loading && (
          <div className="flex items-center gap-2 py-4 text-white/40">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-xs">Cargando…</span>
          </div>
        )}
        {!loading && comments.length === 0 && (
          <p className="py-4 text-center font-mono text-[10px] text-white/25">sin comentarios</p>
        )}
        {comments.map((c) => (
          <div
            key={c.id}
            className={cn(
              "rounded-md border px-3 py-2",
              c.visibleToClient
                ? "border-white/10 bg-white/[0.02]"
                // Nota interna: relleno distinto para que nadie la confunda
                // con algo que el cliente está viendo.
                : "border-dashed border-amber-400/40 bg-amber-400/[0.04]",
            )}
          >
            <p className="whitespace-pre-wrap text-[13px] leading-snug text-white/85">{c.body}</p>
            <p className="mt-1 flex items-center gap-1.5 font-mono text-[10px] text-white/30">
              {!c.visibleToClient && <Lock className="h-2.5 w-2.5 text-amber-300" />}
              {c.authorName ?? c.authorEmail} ·{" "}
              {new Date(c.createdAt).toLocaleString("es-CO", {
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
              {!c.visibleToClient && " · nota interna"}
            </p>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="space-y-2">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            // Enter envía; Shift+Enter hace salto de línea.
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              void send()
            }
          }}
          rows={2}
          placeholder="Escribe un comentario…"
          className="w-full resize-none rounded-lg border border-[#08A696]/20 bg-[#232629] px-3 py-2 text-[13px] text-white placeholder:text-white/25 focus:border-[#26FFDF] focus:outline-none"
        />
        <div className="flex items-center gap-3">
          {canWriteInternal && (
            <label className="flex cursor-pointer items-center gap-1.5 font-mono text-[10px] text-white/40">
              <input
                type="checkbox"
                checked={internal}
                onChange={(e) => setInternal(e.target.checked)}
                className="accent-amber-400"
              />
              nota interna (el cliente no la ve)
            </label>
          )}
          <button
            type="button"
            onClick={send}
            disabled={!draft.trim() || sending}
            className="ml-auto flex items-center gap-1.5 rounded-lg border border-[#08A696]/40 bg-[#232629] px-3 py-1.5 text-xs text-[#26FFDF] transition-colors hover:border-[#26FFDF] disabled:opacity-40"
          >
            {sending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
            Enviar
          </button>
        </div>
      </div>
    </div>
  )
}
