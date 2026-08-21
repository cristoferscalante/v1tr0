import { db } from "@/lib/db"
import { orders } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { getWompiEventSecret, verifyWompiEventSignature, verifyWompiTransaction } from "@/lib/wompi"
import { applyTransactionToOrder, type WompiStatus } from "@/lib/orders"

export async function POST(req: Request) {
  const body = await req.json()

  // Falla cerrado: sin secreto configurado no se acepta ningún evento. Antes
  // la ausencia de la variable dejaba el webhook abierto a cualquiera, y el
  // header `x-event-secret` que se comprobaba no existe en Wompi.
  if (!getWompiEventSecret()) {
    return NextResponse.json({ error: "Webhook no configurado" }, { status: 503 })
  }
  if (!(await verifyWompiEventSignature(body))) {
    return NextResponse.json({ error: "Firma inválida" }, { status: 401 })
  }

  const { event, data } = body
  if (event !== "transaction.updated") {
    return NextResponse.json({ accepted: true })
  }

  const transaction = data?.transaction
  if (!transaction?.id) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 })
  }

  // Se consulta la transacción a la API en vez de confiar en el cuerpo.
  const verification = await verifyWompiTransaction(transaction.id)
  if (!verification) {
    return NextResponse.json({ error: "No se pudo verificar" }, { status: 500 })
  }

  const order = await db
    .select()
    .from(orders)
    .where(eq(orders.wompiReference, verification.data.reference))
    .then((r) => r[0])

  if (!order) {
    // 200 a propósito: si respondemos error, Wompi reintenta indefinidamente
    // un evento que nunca vamos a poder casar con una orden nuestra.
    return NextResponse.json({ accepted: true, matched: false })
  }

  await applyTransactionToOrder({
    orderId: order.id,
    wompiStatus: verification.data.status as WompiStatus,
    transactionId: verification.data.id,
    processorResponse: verification.data,
  })

  return NextResponse.json({ accepted: true })
}
