import { auth } from "@/auth"
import { db } from "@/lib/db"
import { carts, cartItems, products } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { NextResponse } from "next/server"

async function getCartId(userId: string) {
  const cart = await db
    .select()
    .from(carts)
    .where(eq(carts.profileId, userId))
    .then((r) => r[0])
  if (cart) return cart.id
  const [newCart] = await db.insert(carts).values({ profileId: userId }).returning()
  if (!newCart) throw new Error("No se pudo crear el carrito")
  return newCart.id
}

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

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
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const { productId, quantity = 1 } = await req.json()
  if (!productId) return NextResponse.json({ error: "Falta productId" }, { status: 400 })

  const cartId = await getCartId(session.user.id)
  const product = await db
    .select()
    .from(products)
    .where(eq(products.id, productId))
    .then((r) => r[0])
  if (!product) return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 })

  const existing = await db
    .select()
    .from(cartItems)
    .where(and(eq(cartItems.cartId, cartId), eq(cartItems.productId, productId)))
    .then((r) => r[0])

  if (existing) {
    await db
      .update(cartItems)
      .set({ quantity: existing.quantity + quantity })
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
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const { itemId, quantity } = await req.json()
  if (quantity <= 0) {
    await db.delete(cartItems).where(eq(cartItems.id, itemId))
  } else {
    await db.update(cartItems).set({ quantity }).where(eq(cartItems.id, itemId))
  }
  return NextResponse.json({ success: true })
}

export async function DELETE(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const itemId = searchParams.get("itemId")
  const clear = searchParams.get("clear")

  if (clear) {
    const cartId = await getCartId(session.user.id)
    await db.delete(cartItems).where(eq(cartItems.cartId, cartId))
  } else if (itemId) {
    await db.delete(cartItems).where(eq(cartItems.id, itemId))
  }

  return NextResponse.json({ success: true })
}
