import { db } from "@/lib/db"
import { orders } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { verifyWompiTransaction } from "@/lib/wompi"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params
  const { searchParams } = new URL(req.url)
  const transactionId = searchParams.get("transaction_id")

  const order = await db
    .select()
    .from(orders)
    .where(eq(orders.id, orderId))
    .then((r) => r[0])

  if (!order) {
    return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 })
  }

  if (order.paymentStatus === "paid") {
    return NextResponse.json({ status: "paid" })
  }

  if (transactionId) {
    const verification = await verifyWompiTransaction(transactionId)
    if (verification && verification.data.status === "APPROVED") {
      await db
        .update(orders)
        .set({
          wompiStatus: verification.data.status,
          paymentStatus: "paid",
          status: "confirmed",
        })
        .where(eq(orders.id, orderId))
      return NextResponse.json({ status: "paid" })
    }
  }

  return NextResponse.json({ status: order.paymentStatus })
}
