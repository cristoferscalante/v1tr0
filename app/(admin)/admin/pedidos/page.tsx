import { auth } from "@/auth"
import { db } from "@/lib/db"
import { orders, profiles } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import { redirect } from "next/navigation"
import { PanelPage, SectionHeading } from "@/components/shared/panel-ui"

export default async function OrdersPage() {
  const session = await auth()
  if (!session?.user) {redirect("/login")}

  const allOrders = await db
    .select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      status: orders.status,
      total: orders.total,
      currency: orders.currency,
      paymentStatus: orders.paymentStatus,
      wompiStatus: orders.wompiStatus,
      createdAt: orders.createdAt,
      clientEmail: profiles.email,
      clientName: profiles.phone,
    })
    .from(orders)
    .leftJoin(profiles, eq(orders.profileId, profiles.id))
    .orderBy(desc(orders.createdAt))

  return (
    <PanelPage>
      <SectionHeading badge="Tienda" title="Pedidos" subtitle="Compras realizadas en la tienda" />
      <div className="bg-[#02505931] backdrop-blur-sm border border-[#08A696]/20 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#08A696]/20 text-textSecondary">
              <th className="text-left p-4">#</th>
              <th className="text-left p-4">Cliente</th>
              <th className="text-left p-4">Total</th>
              <th className="text-left p-4">Estado</th>
              <th className="text-left p-4">Pago</th>
              <th className="text-left p-4">Wompi</th>
              <th className="text-left p-4">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {allOrders.map((o) => (
              <tr key={o.id} className="border-b border-[#08A696]/10 hover:bg-[#02505950]">
                <td className="p-4 text-white font-mono text-xs">{o.orderNumber}</td>
                <td className="p-4 text-textSecondary">{o.clientEmail ?? "—"}</td>
                <td className="p-4 text-white">${o.total} {o.currency}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    o.status === "delivered" ? "bg-green-500/20 text-green-400" :
                    o.status === "cancelled" ? "bg-red-500/20 text-red-400" :
                    "bg-yellow-500/20 text-yellow-400"
                  }`}>{o.status}</span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    o.paymentStatus === "paid" ? "bg-green-500/20 text-green-400" :
                    o.paymentStatus === "failed" ? "bg-red-500/20 text-red-400" :
                    "bg-yellow-500/20 text-yellow-400"
                  }`}>{o.paymentStatus}</span>
                </td>
                <td className="p-4 text-textSecondary text-xs">{o.wompiStatus ?? "—"}</td>
                <td className="p-4 text-textSecondary text-xs">{o.createdAt?.toLocaleDateString()}</td>
              </tr>
            ))}
            {allOrders.length === 0 && (
              <tr><td colSpan={7} className="p-8 text-center text-textSecondary/60">No hay pedidos aún</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </PanelPage>
  )
}
