import { db } from "@/lib/db"
import { orders } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { getWompiEventSecret, verifyWompiTransaction } from "@/lib/wompi"

export async function POST(req: Request) {
  const body = await req.json()
  const eventSecret = getWompiEventSecret()

  if (eventSecret && req.headers.get("x-event-secret") !== eventSecret) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const { event, data } = body
  if (event !== "transaction.updated") {
    return NextResponse.json({ accepted: true })
  }

  const transaction = data?.transaction
  if (!transaction?.id) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 })
  }

  const verification = await verifyWompiTransaction(transaction.id)
  if (!verification) {
    return NextResponse.json({ error: "No se pudo verificar" }, { status: 500 })
  }

  const wompiStatus = verification.data.status
  const reference = verification.data.reference

  const paymentStatus =
    wompiStatus === "APPROVED" ? "paid" :
    wompiStatus === "DECLINED" || wompiStatus === "ERROR" ? "failed" :
    wompiStatus === "VOIDED" ? "refunded" : "pending"

  const orderStatus =
    paymentStatus === "paid" ? "confirmed" :
    paymentStatus === "failed" ? "cancelled" : "pending"

  await db
    .update(orders)
    .set({
      wompiStatus,
      paymentStatus,
      status: orderStatus,
      wompiProcessorResponse: JSON.stringify(verification.data),
    })
    .where(eq(orders.wompiReference, reference))

  return NextResponse.json({ accepted: true })
}
