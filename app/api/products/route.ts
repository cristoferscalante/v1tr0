import { db } from "@/lib/db"
import { products } from "@/lib/db/schema"
import { and, eq, ne } from "drizzle-orm"
import { NextResponse } from "next/server"

// Endpoint público de solo lectura para la tienda (app/(marketing)/tienda).
// Excluye paquetes (productType='package'), que se administran/muestran aparte.
export async function GET() {
  const rows = await db
    .select()
    .from(products)
    .where(and(eq(products.isActive, true), ne(products.productType, "package")))

  return NextResponse.json({ products: rows })
}
