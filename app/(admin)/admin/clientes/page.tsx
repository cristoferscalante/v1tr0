import { db } from "@/lib/db"
import { profiles } from "@/lib/db/schema"
import { desc, eq } from "drizzle-orm"
import Link from "next/link"
import { Users, Search } from "lucide-react"
import { Panel, PanelPage, Pill, SectionHeading, EmptyState } from "@/components/shared/panel-ui"

export default async function ClientesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>
}) {
  const { q, status } = await searchParams

  const clients = await db
    .select()
    .from(profiles)
    .where(eq(profiles.role, "client"))
    .orderBy(desc(profiles.createdAt))

  const filtered = clients.filter((c) => {
    if (status && c.accountStatus !== status) {return false}
    if (q) {
      const needle = q.toLowerCase()
      return (c.name ?? "").toLowerCase().includes(needle) || (c.email ?? "").toLowerCase().includes(needle)
    }
    return true
  })

  return (
    <PanelPage>
      <SectionHeading
        badge="Clientes"
        title="Clientes"
        subtitle={`${clients.length} ${clients.length === 1 ? "cliente registrado" : "clientes registrados"}`}
      />

      <Panel className="p-4">
        <form className="flex flex-wrap gap-3">
          <div className="w-full sm:flex-1 sm:min-w-[220px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textSecondary" />
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Buscar por nombre o email..."
              className="w-full bg-[#02505950] border border-[#08A696]/20 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder:text-textSecondary/60 focus:outline-none focus:border-[#26FFDF] transition-colors"
            />
          </div>
          <select
            name="status"
            defaultValue={status ?? ""}
            className="w-full sm:w-auto bg-[#02505950] border border-[#08A696]/20 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#26FFDF] transition-colors"
          >
            <option value="">Todos los estados</option>
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
          </select>
          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#08A696]/20 text-[#26FFDF] border border-[#08A696]/40 text-sm font-medium hover:bg-[#08A696]/30 hover:border-[#26FFDF] transition-all"
          >
            Filtrar
          </button>
        </form>
      </Panel>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          message="No hay clientes que coincidan con el filtro"
          hint="Los clientes aparecen automáticamente al iniciar sesión por primera vez"
        />
      ) : (
        <Panel className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] md:min-w-0 text-sm">
              <thead>
                <tr className="border-b border-[#08A696]/20 text-textSecondary">
                  <th className="text-left p-4 font-medium">Nombre</th>
                  <th className="text-left p-4 font-medium">Email</th>
                  <th className="text-left p-4 font-medium">Teléfono</th>
                  <th className="text-left p-4 font-medium">Estado</th>
                  <th className="text-left p-4 font-medium">Créditos</th>
                  <th className="text-left p-4 font-medium">Registrado</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-[#08A696]/10 last:border-0 hover:bg-[#02505950] transition-colors"
                  >
                    <td className="p-4">
                      <Link
                        href={`/admin/clientes/${c.id}`}
                        className="text-white hover:text-[#26FFDF] font-medium transition-colors"
                      >
                        {c.name ?? "Sin nombre"}
                      </Link>
                    </td>
                    <td className="p-4 text-textSecondary">{c.email ?? "—"}</td>
                    <td className="p-4 text-textSecondary">{c.phone ?? "—"}</td>
                    <td className="p-4">
                      <Pill tone={c.accountStatus === "active" ? "success" : "muted"}>
                        {c.accountStatus === "active" ? "Activo" : "Inactivo"}
                      </Pill>
                    </td>
                    <td className="p-4 text-white">{c.credits}</td>
                    <td className="p-4 text-textSecondary text-xs">
                      {c.createdAt?.toLocaleDateString("es-ES")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}
    </PanelPage>
  )
}
