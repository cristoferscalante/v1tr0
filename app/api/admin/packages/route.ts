import { db } from "@/lib/db"
import { products } from "@/lib/db/schema"
import { and, desc, eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { requireAdminSession, AdminAuthError } from "@/lib/auth/require-admin"

// Los "paquetes" son productos reales (tabla products) con productType='package';
// mismo modelo de datos que Productos pero ruta/UI separada a pedido del negocio
// (un paquete combina varios servicios a un precio especial, no es solo una categoría).

export async function GET() {
  try {
    await requireAdminSession()
  } catch (e) {
    if (e instanceof AdminAuthError) {return e.response}
    throw e
  }

  const rows = await db
    .select()
    .from(products)
    .where(and(eq(products.productType, "package"), eq(products.isActive, true)))
    .orderBy(desc(products.createdAt))

  return NextResponse.json({ packages: rows })
}

export async function POST(req: Request) {
  try {
    await requireAdminSession()
  } catch (e) {
    if (e instanceof AdminAuthError) {return e.response}
    throw e
  }

  const body = await req.json()
  const { name, price, billingPeriod, features, folios, isPopular, cta, packageType } = body

  if (!name || price === undefined || !packageType) {
    return NextResponse.json({ error: "Faltan campos requeridos (name, price, packageType)" }, { status: 400 })
  }

  const slug = `${packageType}-${name}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .concat(`-${Date.now()}`)

  const created = await db
    .insert(products)
    .values({
      name,
      slug,
      description: cta ?? "",
      price: String(price),
      productType: "package",
      category: packageType,
      subcategory: billingPeriod ?? null,
      features: features ?? [],
      isFeatured: isPopular ?? false,
      metadata: { folios: folios ?? null, cta: cta ?? null },
    })
    .returning()
    .then((r) => r[0])

  return NextResponse.json(created, { status: 201 })
}
