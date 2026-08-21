import { db } from "@/lib/db"
import { carts, cartItems, orders } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export type WompiStatus = "PENDING" | "APPROVED" | "DECLINED" | "ERROR" | "VOIDED"

/** Traduce el estado de Wompi al par (paymentStatus, status) de la orden. */
export function mapWompiStatus(wompiStatus: WompiStatus) {
  const paymentStatus =
    wompiStatus === "APPROVED" ? "paid" :
    wompiStatus === "DECLINED" || wompiStatus === "ERROR" ? "failed" :
    wompiStatus === "VOIDED" ? "refunded" : "pending"

  const status =
    paymentStatus === "paid" ? "confirmed" :
    paymentStatus === "failed" ? "cancelled" : "pending"

  return { paymentStatus, status }
}

/**
 * El carrito se vacía solo cuando el pago quedó aprobado. Si se vacía al
 * iniciar el checkout, un pago abandonado o rechazado deja al cliente sin
 * su selección y sin nada que comprar.
 */
export async function clearCartForProfile(profileId: string) {
  const cart = await db
    .select()
    .from(carts)
    .where(eq(carts.profileId, profileId))
    .then((r) => r[0])
  if (!cart) {return}
  await db.delete(cartItems).where(eq(cartItems.cartId, cart.id))
}

/** Aplica el resultado de una transacción a la orden, de forma idempotente. */
export async function applyTransactionToOrder(params: {
  orderId: string
  wompiStatus: WompiStatus
  transactionId?: string
  processorResponse?: unknown
}) {
  const { paymentStatus, status } = mapWompiStatus(params.wompiStatus)

  const order = await db
    .select()
    .from(orders)
    .where(eq(orders.id, params.orderId))
    .then((r) => r[0])
  if (!order) {return null}

  // Una orden ya pagada no se vuelve a degradar por un evento tardío.
  if (order.paymentStatus === "paid" && paymentStatus !== "paid") {
    return order
  }

  await db
    .update(orders)
    .set({
      wompiStatus: params.wompiStatus,
      paymentStatus,
      status,
      ...(params.transactionId ? { wompiTransactionId: params.transactionId } : {}),
      ...(params.processorResponse ? { wompiProcessorResponse: JSON.stringify(params.processorResponse) } : {}),
    })
    .where(eq(orders.id, params.orderId))

  if (paymentStatus === "paid" && order.paymentStatus !== "paid") {
    await clearCartForProfile(order.profileId)
  }

  return { ...order, paymentStatus, status }
}
