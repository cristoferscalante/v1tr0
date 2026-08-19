import { db } from "@/lib/db"
import { products } from "@/lib/db/schema"
import { and, eq, notInArray } from "drizzle-orm"
import { NextResponse } from "next/server"

// Ficha pública de un producto por slug: la usa /tienda/[slug] cuando el
// producto viene del catálogo real (la tienda lista /api/products) y no del
// catálogo mock. Excluye servicios, que viven en /servicios.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  const [row] = await db
    .select()
    .from(products)
    .where(
      and(
        eq(products.isActive, true),
        eq(products.slug, slug),
        notInArray(products.productType, ["service"])
      )
    )
    .limit(1)

  if (!row) {
    return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 })
  }

  return NextResponse.json({ product: row })
}
