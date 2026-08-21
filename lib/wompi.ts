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

/**
 * Firma de integridad del Widget/Web Checkout.
 *
 * Wompi la exige para aceptar el link: es SHA256 de
 * `<referencia><monto en centavos><moneda><secreto de integridad>`.
 * Sin ella el checkout rechaza la transacción.
 * https://docs.wompi.co/docs/colombia/widget-checkout-web/
 */
export async function buildWompiIntegritySignature(params: {
  reference: string
  amountInCents: number
  currency: string
}) {
  const secret = getWompiIntegrityKey()
  if (!secret) {throw new Error("WOMPI_INTEGRITY_KEY no configurada")}
  const payload = `${params.reference}${params.amountInCents}${params.currency}${secret}`
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(payload))
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

/**
 * URL del Web Checkout alojado por Wompi.
 *
 * Requiere llave pública, monto, moneda y firma; con solo la referencia
 * el checkout abre vacío y no se puede pagar.
 */
export async function buildWompiCheckoutUrl(params: {
  reference: string
  amountInCents: number
  currency: string
  redirectUrl: string
  customerEmail?: string
}) {
  const publicKey = getWompiPublicKey()
  if (!publicKey) {throw new Error("WOMPI_PUBLIC_KEY no configurada")}

  const signature = await buildWompiIntegritySignature(params)
  const query = new URLSearchParams({
    "public-key": publicKey,
    currency: params.currency,
    "amount-in-cents": String(params.amountInCents),
    reference: params.reference,
    "signature:integrity": signature,
    "redirect-url": params.redirectUrl,
  })
  if (params.customerEmail) {
    query.set("customer-data:email", params.customerEmail)
  }
  return `https://checkout.wompi.co/p/?${query.toString()}`
}

/**
 * Verifica el evento del webhook.
 *
 * Wompi no manda un header con el secreto: firma el cuerpo con SHA256 sobre
 * los valores de `signature.properties` + timestamp + secreto de eventos.
 */
export async function verifyWompiEventSignature(
  body: {
    signature?: { checksum?: string; properties?: string[] }
    timestamp?: number
    data?: unknown
  },
  // Wompi publica el mismo checksum en el cuerpo y en esta cabecera.
  headerChecksum?: string | null
) {
  const secret = getWompiEventSecret()
  if (!secret) {return false}

  const checksum = body.signature?.checksum ?? headerChecksum
  const properties = body.signature?.properties
  if (!checksum || !Array.isArray(properties) || body.timestamp === undefined) {return false}

  const concatenated = properties
    .map((path) =>
      path.split(".").reduce<unknown>(
        (acc, key) => (acc && typeof acc === "object" ? (acc as Record<string, unknown>)[key] : undefined),
        body.data
      )
    )
    .map((value) => (value === undefined || value === null ? "" : String(value)))
    .join("")

  const payload = `${concatenated}${body.timestamp}${secret}`
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(payload))
  const computed = Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")

  return computed.toLowerCase() === checksum.toLowerCase()
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

/**
 * Consulta el estado real de una transacción.
 *
 * La documentación indica que GET /v1/transactions/{id} se autentica con la
 * llave PÚBLICA, no la privada. Usar la privada además hacía que la función
 * devolviera null cuando solo estaba configurada la pública, y entonces el
 * webhook rechazaba eventos legítimos con un 500.
 */
export async function verifyWompiTransaction(transactionId: string) {
  const publicKey = getWompiPublicKey()
  if (!publicKey) {return null}

  const res = await fetch(`${getWompiApiUrl()}/transactions/${transactionId}`, {
    headers: { Authorization: `Bearer ${publicKey}` },
  })

  if (!res.ok) {return null}
  return res.json() as Promise<WompiTransactionResponse>
}
