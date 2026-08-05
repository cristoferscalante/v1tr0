import { db } from "@/lib/db"
import { profiles, orders, orderItems, projects, quotes, meetingRequests } from "@/lib/db/schema"
import { desc, eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { requireAdminSession, AdminAuthError } from "@/lib/auth/require-admin"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminSession()
  } catch (e) {
    if (e instanceof AdminAuthError) {return e.response}
    throw e
  }

  const { id } = await params

  const client = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, id))
    .then((r) => r[0] ?? null)

  if (!client) {
    return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 })
  }

  const [clientOrders, clientProjects, clientQuotes, clientMeetings] = await Promise.all([
    db.select().from(orders).where(eq(orders.profileId, id)).orderBy(desc(orders.createdAt)),
    db.select().from(projects).where(eq(projects.clientId, id)).orderBy(desc(projects.createdAt)),
    db.select().from(quotes).where(eq(quotes.profileId, id)).orderBy(desc(quotes.createdAt)),
    db.select().from(meetingRequests).where(eq(meetingRequests.profileId, id)).orderBy(desc(meetingRequests.createdAt)),
  ])

  const ordersWithItems = await Promise.all(
    clientOrders.map(async (o) => ({
      ...o,
      items: await db.select().from(orderItems).where(eq(orderItems.orderId, o.id)),
    }))
  )

  return NextResponse.json({
    ...client,
    orders: ordersWithItems,
    projects: clientProjects,
    quotes: clientQuotes,
    meetings: clientMeetings,
  })
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminSession()
  } catch (e) {
    if (e instanceof AdminAuthError) {return e.response}
    throw e
  }

  const { id } = await params
  const body = await req.json()

  const allowed = ["name", "phone", "role", "accountStatus", "accountType", "credits"] as const
  const updates: Record<string, unknown> = {}
  for (const key of allowed) {
    if (key in body) {updates[key] = body[key]}
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Nada para actualizar" }, { status: 400 })
  }

  updates.updatedAt = new Date()

  const updated = await db
    .update(profiles)
    .set(updates)
    .where(eq(profiles.id, id))
    .returning()
    .then((r) => r[0] ?? null)

  if (!updated) {
    return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 })
  }

  return NextResponse.json(updated)
}
