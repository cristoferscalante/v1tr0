export function getWompiApiUrl() {
  return process.env.WOMPI_ENVIRONMENT === "production"
    ? "https://api.wompi.co/v1"
    : "https://sandbox.wompi.co/v1"
}

export function getWompiIntegrityKey() {
  return process.env.WOMPI_INTEGRITY_KEY ?? ""
}

export function getWompiPublicKey() {
  return process.env.WOMPI_PUBLIC_KEY ?? ""
}

export function getWompiPrivateKey() {
  return process.env.WOMPI_PRIVATE_KEY ?? ""
}

export function getWompiEventSecret() {
  return process.env.WOMPI_EVENT_SECRET ?? ""
}

interface WompiTransactionResponse {
  data: {
    id: string
    reference: string
    status: "PENDING" | "APPROVED" | "DECLINED" | "ERROR" | "VOIDED"
    amount_in_cents: number
    currency: string
    payment_method_type: string
    redirect_url: string
    created_at: string
  }
}

export async function createWompiPayment(params: {
  amountInCents: number
  reference: string
  currency?: string
  redirectUrl: string
  customerEmail: string
}) {
  const privateKey = getWompiPrivateKey()
  if (!privateKey) {
    throw new Error("Wompi no configurado")
  }

  const res = await fetch(`${getWompiApiUrl()}/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${privateKey}`,
    },
    body: JSON.stringify({
      amount_in_cents: params.amountInCents,
      reference: params.reference,
      currency: params.currency ?? "COP",
      redirect_url: params.redirectUrl,
      customer_email: params.customerEmail,
      payment_method: null,
    }),
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(`Wompi error: ${error}`)
  }

  return res.json() as Promise<WompiTransactionResponse>
}

export async function verifyWompiTransaction(transactionId: string) {
  const privateKey = getWompiPrivateKey()
  if (!privateKey) return null

  const res = await fetch(`${getWompiApiUrl()}/transactions/${transactionId}`, {
    headers: { Authorization: `Bearer ${privateKey}` },
  })

  if (!res.ok) return null
  return res.json() as Promise<WompiTransactionResponse>
}
