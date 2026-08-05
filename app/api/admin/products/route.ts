import { db } from "@/lib/db"
import { products } from "@/lib/db/schema"
import { and, desc, eq, ilike } from "drizzle-orm"
import { NextResponse } from "next/server"
import { requireAdminSession, AdminAuthError } from "@/lib/auth/require-admin"

export async function GET(req: Request) {
  try {
    await requireAdminSession()
  } catch (e) {
    if (e instanceof AdminAuthError) {return e.response}
    throw e
  }

  const { searchParams } = new URL(req.url)
  const q = searchParams.get("q")?.trim()
  const category = searchParams.get("category")
  const includeInactive = searchParams.get("includeInactive") === "true"

  const conditions = []
  if (!includeInactive) {conditions.push(eq(products.isActive, true))}
  if (category && category !== "all") {conditions.push(eq(products.category, category))}
  if (q) {conditions.push(ilike(products.name, `%${q}%`))}

  const rows = await db
    .select()
    .from(products)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(products.createdAt))

  return NextResponse.json({ products: rows })
}

export async function POST(req: Request) {
  try {
    await requireAdminSession()
  } catch (e) {
    if (e instanceof AdminAuthError) {return e.response}
    throw e
  }

  const body = await req.json()
  const { name, slug, description, shortDescription, price, originalPrice, category, subcategory, stock, images, tags, isFeatured, badge } = body

  if (!name || !slug || !price || !category) {
    return NextResponse.json({ error: "Faltan campos requeridos (name, slug, price, category)" }, { status: 400 })
  }

  const created = await db
    .insert(products)
    .values({
      name,
      slug,
      description: description ?? null,
      shortDescription: shortDescription ?? null,
      price: String(price),
      originalPrice: originalPrice ? String(originalPrice) : null,
      category,
      subcategory: subcategory ?? null,
      stock: stock ?? -1,
      images: images ?? [],
      tags: tags ?? [],
      isFeatured: isFeatured ?? false,
      badge: badge ?? null,
    })
    .returning()
    .then((r) => r[0])

  return NextResponse.json(created, { status: 201 })
}
