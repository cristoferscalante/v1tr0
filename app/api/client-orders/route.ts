import { auth } from "@/auth"
import { db } from "@/lib/db"
import { orders, orderItems } from "@/lib/db/schema"
import { eq, desc, inArray } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const userId = session.user.id

  const raw = await db
    .select()
    .from(orders)
    .where(eq(orders.profileId, userId))
    .orderBy(desc(orders.createdAt))

  // 1 consulta agrupada para los ítems de todos los pedidos, en vez de una
  // consulta de orderItems por cada pedido.
  const orderIds = raw.map((o) => o.id)
  const allItems = orderIds.length
    ? await db.select().from(orderItems).where(inArray(orderItems.orderId, orderIds))
    : []

  const itemsByOrder = new Map<string, typeof allItems>()
  for (const item of allItems) {
    const list = itemsByOrder.get(item.orderId) ?? []
    list.push(item)
    itemsByOrder.set(item.orderId, list)
  }

  const enriched = raw.map((o) => ({ ...o, items: itemsByOrder.get(o.id) ?? [] }))

  return NextResponse.json(enriched)
}
