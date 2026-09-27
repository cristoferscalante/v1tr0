"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Loader2, Trash2, UserPlus } from "lucide-react"
import { PROJECT_MEMBER_ROLES, type ProjectMemberRole } from "@/lib/db/schema"

const ROLE_LABELS: Record<ProjectMemberRole, string> = {
  lead: "Responsable",
  developer: "Desarrollo",
  designer: "Diseño",
  qa: "Calidad",
  observer: "Observador",
}

interface Member {
  id: string
  profileId: string
  role: ProjectMemberRole
  name: string | null
  email: string | null
}

interface StaffProfile {
  id: string
  name: string | null
  email: string | null
  role: string
}

const controlClass =
  "bg-[#232629] border border-[#08A696]/20 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-[#26FFDF] transition-colors"

export default function ProjectTeamPanel({
  projectId,
  onMembersChange,
}: {
  projectId: string
  onMembersChange?: (members: Member[]) => void
}) {
  const [members, setMembers] = useState<Member[]>([])
  const [staff, setStaff] = useState<StaffProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [pick, setPick] = useState("")
  const [role, setRole] = useState<ProjectMemberRole>("developer")
  const [busy, setBusy] = useState(false)

  function publish(next: Member[]) {
    setMembers(next)
    onMembersChange?.(next)
  }

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/projects/${projectId}/members`).then((r) => r.json()),
      fetch("/api/admin/team").then((r) => r.json()),
    ])
      .then(([m, s]) => {
        publish(Array.isArray(m) ? m : [])
        setStaff(Array.isArray(s) ? s : [])
      })
      .catch(() => toast.error("No se pudo cargar el equipo"))
      .finally(() => setLoading(false))
    // publish depende de onMembersChange, que el padre recrea en cada render;
    // el efecto solo debe correr al cambiar de proyecto.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId])

  // Quien ya está en el proyecto no debe volver a aparecer en el selector.
  const available = staff.filter((s) => !members.some((m) => m.profileId === s.id))

  async function add() {
    if (!pick) {return}
    setBusy(true)
    try {
      const res = await fetch(`/api/admin/projects/${projectId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId: pick, role }),
      })
      const data = await res.json()
      if (!res.ok) {throw new Error(data.error ?? "No se pudo agregar")}

      const person = staff.find((s) => s.id === pick)
      publish([...members, { ...data, name: person?.name ?? null, email: person?.email ?? null }])
      setPick("")
      toast.success("Persona agregada al proyecto")
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo agregar")
    } finally {
      setBusy(false)
    }
  }

  async function changeRole(member: Member, next: ProjectMemberRole) {
    const previous = members
    publish(members.map((m) => (m.id === member.id ? { ...m, role: next } : m)))
    const res = await fetch(`/api/admin/projects/${projectId}/members/${member.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: next }),
    })
    if (!res.ok) {
      publish(previous)
      toast.error("No se pudo cambiar el rol")
    }
  }

  async function remove(member: Member) {
    // Se avisa porque el servidor además libera las tareas que tuviera
    // asignadas en este proyecto.
    if (!confirm(`¿Quitar a ${member.name ?? member.email}? Sus tareas de este proyecto quedarán sin responsable.`)) {
      return
    }
    const previous = members
    publish(members.filter((m) => m.id !== member.id))
    const res = await fetch(`/api/admin/projects/${projectId}/members/${member.id}`, { method: "DELETE" })
    if (!res.ok) {
      publish(previous)
      toast.error("No se pudo quitar del equipo")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-8 text-white/40">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-xs">Cargando equipo…</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <select value={pick} onChange={(e) => setPick(e.target.value)} className={controlClass}>
          <option value="">Agregar a alguien…</option>
          {available.map((s) => (
            <option key={s.id} value={s.id}>{s.name ?? s.email}</option>
          ))}
        </select>
        <select value={role} onChange={(e) => setRole(e.target.value as ProjectMemberRole)} className={controlClass}>
          {PROJECT_MEMBER_ROLES.map((r) => (
            <option key={r} value={r}>{ROLE_LABELS[r]}</option>
          ))}
        </select>
        <button
          type="button"
          onClick={add}
          disabled={!pick || busy}
          className="flex items-center gap-1.5 rounded-lg border border-[#08A696]/40 bg-[#232629] px-3 py-1.5 text-xs text-[#26FFDF] transition-colors hover:border-[#26FFDF] disabled:opacity-40"
        >
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UserPlus className="h-3.5 w-3.5" />}
          Agregar
        </button>
      </div>

      {members.length === 0 ? (
        <p className="py-8 text-center font-mono text-[10px] text-white/30">
          nadie asignado a este proyecto todavía
        </p>
      ) : (
        <ul className="divide-y divide-white/[0.06]">
          {members.map((m) => (
            <li key={m.id} className="flex items-center gap-3 py-2.5">
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold text-white/85">{m.name ?? m.email}</p>
                {m.name && <p className="truncate font-mono text-[10px] text-white/30">{m.email}</p>}
              </div>
              <select
                value={m.role}
                onChange={(e) => changeRole(m, e.target.value as ProjectMemberRole)}
                className={controlClass}
              >
                {PROJECT_MEMBER_ROLES.map((r) => (
                  <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => remove(m)}
                aria-label={`Quitar a ${m.name ?? m.email}`}
                className="rounded p-1.5 text-white/30 transition-colors hover:bg-amber-400/10 hover:text-amber-300"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
