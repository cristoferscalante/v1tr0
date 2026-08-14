import { db } from "@/lib/db"
import { products } from "@/lib/db/schema"
import { and, eq, inArray, notInArray } from "drizzle-orm"
import { NextResponse } from "next/server"

// Endpoint público de solo lectura para la tienda (app/(marketing)/tienda).
// Excluye paquetes (se administran/muestran aparte) y servicios: la tienda
// vende productos; los servicios viven en /servicios.
// Catálogo acotado a los dos productos en venta por ahora.
// Para reabrir el catálogo completo, borrar esta lista y su filtro.
const SLUGS_VISIBLES = ["sistema-pos", "sistema-comunicacion-descentralizado"]

export async function GET() {
  const rows = await db
    .select()
    .from(products)
    .where(
      and(
        eq(products.isActive, true),
        notInArray(products.productType, ["package", "service"]),
        inArray(products.slug, SLUGS_VISIBLES)
      )
    )

  return NextResponse.json({ products: rows })
}
