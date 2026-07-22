import { auth } from "@/auth"
import { db } from "@/lib/db"
import { orders, quotes, projects, cartItems, carts, products, orderItems } from "@/lib/db/schema"
import { eq, and, count, gte, sql, desc } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const userId = session.user.id

  const [[ordersResult], [quotesResult], [projectsResult], [cartResult]] =
    await Promise.all([
      db.select({ total: count() }).from(orders).where(eq(orders.profileId, userId)),
      db.select({ total: count() }).from(quotes).where(and(eq(quotes.profileId, userId), eq(quotes.status, "pending"))),
      db.select({ total: count() }).from(projects).where(eq(projects.clientId, userId)),
      db.select({ total: count() }).from(cartItems).innerJoin(carts, eq(cartItems.cartId, carts.id)).where(eq(carts.profileId, userId)),
    ])

  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

  const recentOrders = ordersResult?.total ?? 0

  const monthlyOrders = await db
    .select({
      month: sql<string>`to_char(${orders.createdAt}, 'Mon')`,
      count: count(),
    })
    .from(orders)
    .where(and(eq(orders.profileId, userId), gte(orders.createdAt, sixMonthsAgo)))
    .groupBy(sql`to_char(${orders.createdAt}, 'Mon')`)
    .orderBy(sql`min(${orders.createdAt})`)

  const allMonths = ["Ene", "Feb", "Mar", "Abr", "May", "Jun"]
  const orderByMonth = allMonths.map((m) => ({
    month: m,
    orders: monthlyOrders.find((r) => r.month === m)?.count ?? 0,
  }))

  const userProjects = await db
    .select({ images: projects.images })
    .from(projects)
    .where(eq(projects.clientId, userId))

  const projectImages = userProjects
    .flatMap((p) => p.images ?? [])
    .filter(Boolean)

  const userOrders = await db
    .select({ productId: orderItems.productId })
    .from(orders)
    .innerJoin(orderItems, eq(orderItems.orderId, orders.id))
    .where(eq(orders.profileId, userId))
    .orderBy(desc(orders.createdAt))
    .limit(20)

  const orderProductIds = [...new Set(userOrders.map((o) => o.productId).filter(Boolean))]
  let orderImages: string[] = []
  if (orderProductIds.length > 0) {
    const prods = await Promise.all(
      orderProductIds.map((pid) =>
        db
          .select({ images: products.images })
          .from(products)
          .where(eq(products.id, pid))
          .then((r) => r[0])
      )
    )
    orderImages = prods
      .flatMap((p) => p?.images ?? [])
      .filter(Boolean)
  }

  return NextResponse.json({
    activeProjects: Number(projectsResult?.total ?? 0),
    totalProjects: Number(projectsResult?.total ?? 0),
    pendingTasks: Number(quotesResult?.total ?? 0),
    overallProgress: 0,
    upcomingDeadlines: 0,
    totalOrders: Number(ordersResult?.total ?? 0),
    pendingQuotes: Number(quotesResult?.total ?? 0),
    cartItems: Number(cartResult?.total ?? 0),
    recentOrders,
    orderByMonth,
    projectImages,
    orderImages,
  })
}
