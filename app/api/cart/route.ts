import { auth } from "@/auth"
import { db } from "@/lib/db"
import { carts, cartItems, products } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { NextResponse } from "next/server"

/** Tope por línea: evita pedidos absurdos por un error de UI o un script. */
const MAX_QUANTITY = 99

/** Normaliza la cantidad recibida del cliente. Devuelve null si no es válida. */
function parseQuantity(raw: unknown, { allowZero = false } = {}): number | null {
  const value = typeof raw === "number" ? raw : Number(raw)
  if (!Number.isInteger(value)) {return null}
  if (value > MAX_QUANTITY) {return null}
  if (allowZero ? value < 0 : value < 1) {return null}
  return value
}

/**
 * Devuelve el carrito del usuario, creándolo si hace falta.
 *
 * profile_id es único, y la página dispara varias peticiones a la vez: un
 * simple "consultar y si no existe insertar" hace que la segunda reviente con
 * violación de unicidad (500). Por eso el insert ignora el conflicto y se
 * vuelve a leer.
 */
async function getCartId(userId: string) {
  const existing = await db
    .select()
    .from(carts)
    .where(eq(carts.profileId, userId))
    .then((r) => r[0])
  if (existing) {return existing.id}

  const [created] = await db
    .insert(carts)
    .values({ profileId: userId })
    .onConflictDoNothing({ target: carts.profileId })
    .returning()
  if (created) {return created.id}

  // Otra petición ganó la carrera y ya lo creó.
  const winner = await db
    .select()
    .from(carts)
    .where(eq(carts.profileId, userId))
    .then((r) => r[0])
  if (!winner) {throw new Error("No se pudo crear el carrito")}
  return winner.id
}

/**
 * Confirma que la línea pertenece al carrito de quien llama.
 * Sin esto, cualquier usuario autenticado puede modificar o borrar líneas
 * del carrito de otro con solo conocer (o adivinar) su id.
 */
async function getOwnedItem(itemId: string, userId: string) {
  if (typeof itemId !== "string" || itemId.length === 0) {return null}
  const cartId = await getCartId(userId)
  return db
    .select()
    .from(cartItems)
    .where(and(eq(cartItems.id, itemId), eq(cartItems.cartId, cartId)))
    .then((r) => r[0] ?? null)
    // Un id con formato no-UUID hace fallar la consulta en Postgres.
    .catch(() => null)
}

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {return NextResponse.json({ error: "No autorizado" }, { status: 401 })}

  const cartId = await getCartId(session.user.id)
  const items = await db
    .select({
      id: cartItems.id,
      productId: cartItems.productId,
      quantity: cartItems.quantity,
      priceSnapshot: cartItems.priceSnapshot,
      name: products.name,
      slug: products.slug,
      image: products.images,
      productType: products.productType,
    })
    .from(cartItems)
    .leftJoin(products, eq(cartItems.productId, products.id))
    .where(eq(cartItems.cartId, cartId))

  return NextResponse.json({ items, cartId })
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {return NextResponse.json({ error: "No autorizado" }, { status: 401 })}

  const { productId, quantity: rawQuantity = 1 } = await req.json()
  if (!productId) {return NextResponse.json({ error: "Falta productId" }, { status: 400 })}

  const quantity = parseQuantity(rawQuantity)
  if (quantity === null) {
    return NextResponse.json(
      { error: `La cantidad debe ser un entero entre 1 y ${MAX_QUANTITY}` },
      { status: 400 }
    )
  }

  const cartId = await getCartId(session.user.id)
  const product = await db
    .select()
    .from(products)
    .where(eq(products.id, productId))
    .then((r) => r[0])
    .catch(() => undefined)
  if (!product) {return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 })}

  const existing = await db
    .select()
    .from(cartItems)
    .where(and(eq(cartItems.cartId, cartId), eq(cartItems.productId, productId)))
    .then((r) => r[0])

  if (existing) {
    await db
      .update(cartItems)
      .set({ quantity: Math.min(existing.quantity + quantity, MAX_QUANTITY) })
      .where(eq(cartItems.id, existing.id))
  } else {
    await db.insert(cartItems).values({
      cartId,
      productId,
      quantity,
      priceSnapshot: product.price as unknown as string,
    })
  }

  await db.update(carts).set({ updatedAt: new Date() }).where(eq(carts.id, cartId))
  return NextResponse.json({ success: true })
}

export async function PATCH(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {return NextResponse.json({ error: "No autorizado" }, { status: 401 })}

  const { itemId, quantity: rawQuantity } = await req.json()

  // quantity 0 es la forma que usa la UI para eliminar la línea.
  const quantity = parseQuantity(rawQuantity, { allowZero: true })
  if (quantity === null) {
    return NextResponse.json(
      { error: `La cantidad debe ser un entero entre 0 y ${MAX_QUANTITY}` },
      { status: 400 }
    )
  }

  const item = await getOwnedItem(itemId, session.user.id)
  if (!item) {return NextResponse.json({ error: "Línea no encontrada" }, { status: 404 })}

  if (quantity === 0) {
    await db.delete(cartItems).where(eq(cartItems.id, item.id))
  } else {
    await db.update(cartItems).set({ quantity }).where(eq(cartItems.id, item.id))
  }
  return NextResponse.json({ success: true })
}

export async function DELETE(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {return NextResponse.json({ error: "No autorizado" }, { status: 401 })}

  const { searchParams } = new URL(req.url)
  const itemId = searchParams.get("itemId")
  const clear = searchParams.get("clear")

  if (clear) {
    const cartId = await getCartId(session.user.id)
    await db.delete(cartItems).where(eq(cartItems.cartId, cartId))
  } else if (itemId) {
    const item = await getOwnedItem(itemId, session.user.id)
    if (!item) {return NextResponse.json({ error: "Línea no encontrada" }, { status: 404 })}
    await db.delete(cartItems).where(eq(cartItems.id, item.id))
  } else {
    return NextResponse.json({ error: "Falta itemId o clear" }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}
