import { auth } from "@/auth"
import { db } from "@/lib/db"
import { carts, cartItems, orders, orderItems, products } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { buildWompiCheckoutUrl } from "@/lib/wompi"

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

  // El precio se recalcula contra la tabla de productos: el priceSnapshot pudo
  // quedar viejo y las cantidades se revalidan por si entraron por otra vía.
  const invalid = items.find(({ item }) => !Number.isInteger(item.quantity) || item.quantity < 1)
  if (invalid) {
    return NextResponse.json(
      { error: "Hay líneas con cantidad inválida en el carrito" },
      { status: 400 }
    )
  }

  const subtotal = items.reduce(
    (sum, { item, product }) => sum + Number(product.price) * item.quantity,
    0
  )
  const total = subtotal

  if (!(total > 0)) {
    return NextResponse.json({ error: "El total de la orden no es válido" }, { status: 400 })
  }

  const amountInCents = Math.round(total * 100)
  const currency = "COP"
  const orderNumber = `V1TR0-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
  const frontendUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

  // La URL de pago se arma ANTES de tocar la base: si Wompi no está
  // configurado no queremos dejar órdenes huérfanas en estado pending.
  let checkoutUrl: string
  try {
    checkoutUrl = await buildWompiCheckoutUrl({
      reference: orderNumber,
      amountInCents,
      currency,
      redirectUrl: `${frontendUrl}/checkout/confirmacion?order=__ORDER_ID__`,
      customerEmail: session.user.email ?? undefined,
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Pasarela de pago no disponible"
    return NextResponse.json({ error: msg }, { status: 503 })
  }

  const [order] = await db
    .insert(orders)
    .values({
      profileId: userId,
      orderNumber,
      subtotal: String(subtotal),
      total: String(total),
      currency,
      wompiReference: orderNumber,
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
      unitPrice: String(product.price),
      totalPrice: String(Number(product.price) * item.quantity),
    }))
  )

  // El carrito NO se vacía aquí: el pago todavía no ocurrió. Se vacía cuando
  // el webhook (o la verificación de retorno) confirma la transacción, para
  // que un pago abandonado no le borre la compra al cliente.
  return NextResponse.json({
    orderId: order.id,
    orderNumber,
    wompiUrl: checkoutUrl.replace("__ORDER_ID__", order.id),
  })
}
