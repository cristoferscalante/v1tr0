import { auth } from "@/auth"
import { db } from "@/lib/db"
import { orders } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { verifyWompiTransaction } from "@/lib/wompi"
import { applyTransactionToOrder, type WompiStatus } from "@/lib/orders"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  // La ruta expone el estado de pago de una orden: exige sesión y que la
  // orden sea de quien pregunta.
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const { orderId } = await params
  const { searchParams } = new URL(req.url)
  const transactionId = searchParams.get("transaction_id")

  const order = await db
    .select()
    .from(orders)
    .where(eq(orders.id, orderId))
    .then((r) => r[0])
    .catch(() => undefined)

  if (!order || order.profileId !== session.user.id) {
    return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 })
  }

  if (order.paymentStatus === "paid") {
    return NextResponse.json({ status: "paid", orderNumber: order.orderNumber })
  }

  if (transactionId) {
    const verification = await verifyWompiTransaction(transactionId)
    // Solo se acepta la transacción si su referencia es la de esta orden:
    // si no, cualquiera podría marcar su orden con el id de un pago ajeno.
    if (verification && verification.data.reference === order.wompiReference) {
      const updated = await applyTransactionToOrder({
        orderId: order.id,
        wompiStatus: verification.data.status as WompiStatus,
        transactionId: verification.data.id,
        processorResponse: verification.data,
      })
      return NextResponse.json({
        status: updated?.paymentStatus ?? order.paymentStatus,
        orderNumber: order.orderNumber,
      })
    }
  }

  return NextResponse.json({ status: order.paymentStatus, orderNumber: order.orderNumber })
}
