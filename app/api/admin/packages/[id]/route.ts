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
  const { name, price, billingPeriod, features, folios, isPopular, cta, packageType } = body

  const updates: Record<string, unknown> = { updatedAt: new Date() }
  if (name !== undefined) {updates.name = name}
  if (price !== undefined) {updates.price = String(price)}
  if (billingPeriod !== undefined) {updates.subcategory = billingPeriod}
  if (features !== undefined) {updates.features = features}
  if (isPopular !== undefined) {updates.isFeatured = isPopular}
  if (packageType !== undefined) {updates.category = packageType}
  if (cta !== undefined) {updates.description = cta}
  if (folios !== undefined || cta !== undefined) {
    updates.metadata = { folios: folios ?? null, cta: cta ?? null }
  }

  const updated = await db
    .update(products)
    .set(updates)
    .where(eq(products.id, id))
    .returning()
    .then((r) => r[0] ?? null)

  if (!updated) {return NextResponse.json({ error: "Paquete no encontrado" }, { status: 404 })}
  return NextResponse.json(updated)
}

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

  if (!updated) {return NextResponse.json({ error: "Paquete no encontrado" }, { status: 404 })}
  return NextResponse.json({ success: true })
}
