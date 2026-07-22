import { auth } from "@/auth"
import { db } from "@/lib/db"
import { orders, orderItems } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
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

  const enriched = await Promise.all(
    raw.map(async (o) => {
      const items = await db
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, o.id))
      return { ...o, items }
    })
  )

  return NextResponse.json(enriched)
}
