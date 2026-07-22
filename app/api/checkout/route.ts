import { auth } from "@/auth"
import { db } from "@/lib/db"
import { carts, cartItems, orders, orderItems, products } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { createWompiPayment } from "@/lib/wompi"

export async function POST() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const userId = session.user.id

  const cart = await db
    .select()
    .from(carts)
    .where(eq(carts.profileId, userId))
    .then((r) => r[0])

  if (!cart) {
    return NextResponse.json({ error: "Carrito vacío" }, { status: 400 })
  }

  const items = await db
    .select({
      item: cartItems,
      product: products,
    })
    .from(cartItems)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .where(eq(cartItems.cartId, cart.id))

  if (items.length === 0) {
    return NextResponse.json({ error: "Carrito vacío" }, { status: 400 })
  }

  const subtotal = items.reduce(
    (sum, { item }) => sum + Number(item.priceSnapshot) * item.quantity,
    0
  )
  const total = subtotal
  const orderNumber = `V1TR0-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`

  const [order] = await db
    .insert(orders)
    .values({
      profileId: userId,
      orderNumber,
      subtotal: String(subtotal),
      total: String(total),
      currency: "COP",
    })
    .returning()

  if (!order) {
    return NextResponse.json({ error: "Error al crear la orden" }, { status: 500 })
  }

  await db.insert(orderItems).values(
    items.map(({ item, product }) => ({
      orderId: order.id,
      productId: item.productId,
      productName: product.name,
      productSlug: product.slug,
      quantity: item.quantity,
      unitPrice: String(item.priceSnapshot),
      totalPrice: String(Number(item.priceSnapshot) * item.quantity),
    }))
  )

  const frontendUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

  try {
    const wompi = await createWompiPayment({
      amountInCents: Math.round(total * 100),
      reference: orderNumber,
      redirectUrl: `${frontendUrl}/checkout/confirmacion?order=${order.id}`,
      customerEmail: session.user.email ?? "cliente@v1tr0.com",
    })

    await db
      .update(orders)
      .set({
        wompiTransactionId: wompi.data.id,
        wompiReference: wompi.data.reference,
        wompiStatus: wompi.data.status,
      })
      .where(eq(orders.id, order.id))

    await db.delete(cartItems).where(eq(cartItems.cartId, cart.id))

    return NextResponse.json({
      orderId: order.id,
      wompiUrl: `https://checkout.wompi.co/p/${process.env.WOMPI_PUBLIC_KEY}?reference=${orderNumber}`,
      transactionId: wompi.data.id,
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Error al procesar pago"
    return NextResponse.json({ error: msg, orderId: order.id }, { status: 500 })
  }
}
