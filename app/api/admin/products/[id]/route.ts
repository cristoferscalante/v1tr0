import { db } from "@/lib/db"
import { products } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { requireAdminSession, AdminAuthError } from "@/lib/auth/require-admin"

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

  const allowed = [
    "name", "slug", "description", "shortDescription", "category", "subcategory",
    "stock", "images", "tags", "isFeatured", "isActive", "badge",
  ] as const
  const updates: Record<string, unknown> = {}
  for (const key of allowed) {
    if (key in body) {updates[key] = body[key]}
  }
  if ("price" in body) {updates.price = String(body.price)}
  if ("originalPrice" in body) {updates.originalPrice = body.originalPrice ? String(body.originalPrice) : null}

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Nada para actualizar" }, { status: 400 })
  }
  updates.updatedAt = new Date()

  const updated = await db
    .update(products)
    .set(updates)
    .where(eq(products.id, id))
    .returning()
    .then((r) => r[0] ?? null)

  if (!updated) {return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 })}
  return NextResponse.json(updated)
}

// Baja lógica: orderItems/cartItems referencian productId, no se puede borrar en duro.
export async function DELETE(
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

  const updated = await db
    .update(products)
    .set({ isActive: false, updatedAt: new Date() })
    .where(eq(products.id, id))
    .returning()
    .then((r) => r[0] ?? null)

  if (!updated) {return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 })}
  return NextResponse.json({ success: true })
}
