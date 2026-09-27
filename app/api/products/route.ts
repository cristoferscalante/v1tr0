import { db } from "@/lib/db"
import { products } from "@/lib/db/schema"
import { and, eq, notInArray, sql } from "drizzle-orm"
import { NextResponse } from "next/server"

// Endpoint público de solo lectura para la tienda (app/(marketing)/tienda).
// La sección de productos solo lista la colección de hardware
// (metadata.coleccion = "hardware", sembrada por scripts/seed-hardware.mjs).
// Los paquetes (POS, comunicación) se muestran en el hero y en /tienda/[slug];
// los servicios viven en /servicios.
export async function GET() {
  const rows = await db
    .select()
    .from(products)
    .where(
      and(
        eq(products.isActive, true),
        notInArray(products.productType, ["package", "service"]),
        sql`${products.metadata}->>'coleccion' = 'hardware'`
      )
    )

  return NextResponse.json({ products: rows })
}
