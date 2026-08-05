import { auth } from "@/auth"
import { db } from "@/lib/db"
import { orders, quotes, projects, cartItems, carts } from "@/lib/db/schema"
import { eq, and, count, ne, gte, sql } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const userId = session.user.id

  const [[ordersResult], [quotesResult], [activeProjectsResult], [cartResult]] = await Promise.all([
    db.select({ total: count() }).from(orders).where(eq(orders.profileId, userId)),
    db.select({ total: count() }).from(quotes).where(and(eq(quotes.profileId, userId), eq(quotes.status, "pending"))),
    // Mismo criterio de "activo" que el dashboard de admin: ni entregado, ni
    // pausado, ni cancelado. Mantenimiento sí cuenta como activo.
    db
      .select({ total: count() })
      .from(projects)
      .where(and(
        eq(projects.clientId, userId),
        ne(projects.status, "completed"),
        ne(projects.status, "cancelled"),
        ne(projects.status, "paused"),
      )),
    db.select({ total: count() }).from(cartItems).innerJoin(carts, eq(cartItems.cartId, carts.id)).where(eq(carts.profileId, userId)),
  ])

  // Pedidos por mes (últimos 6 meses) para el gráfico de barras en el tiempo.
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5)
  sixMonthsAgo.setDate(1)

  const monthlyOrders = await db
    .select({
      month: sql<string>`to_char(${orders.createdAt}, 'YYYY-MM')`,
      count: count(),
    })
    .from(orders)
    .where(and(eq(orders.profileId, userId), gte(orders.createdAt, sixMonthsAgo)))
    .groupBy(sql`to_char(${orders.createdAt}, 'YYYY-MM')`)

  const monthLabels = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
  const orderByMonth = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(sixMonthsAgo)
    d.setMonth(d.getMonth() + i)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    return {
      month: monthLabels[d.getMonth()],
      orders: monthlyOrders.find((r) => r.month === key)?.count ?? 0,
    }
  })

  return NextResponse.json({
    activeProjects: Number(activeProjectsResult?.total ?? 0),
    totalOrders: Number(ordersResult?.total ?? 0),
    pendingQuotes: Number(quotesResult?.total ?? 0),
    cartItems: Number(cartResult?.total ?? 0),
    orderByMonth,
  })
}
