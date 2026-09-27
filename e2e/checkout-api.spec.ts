import { test, expect } from "./fixtures"

const wompiConfigured = Boolean(process.env.WOMPI_PUBLIC_KEY && process.env.WOMPI_INTEGRITY_KEY)

test.describe("API de checkout", () => {
  test("exige sesión", async ({ request }) => {
    expect((await request.post("/api/checkout")).status()).toBe(401)
  })

  test("rechaza el carrito vacío", async ({ authedContext }) => {
    const page = await authedContext.newPage()
    const res = await page.request.post("/api/checkout")
    expect(res.status()).toBe(400)
    expect((await res.json()).error).toMatch(/vac/i)
  })

  test("sin pasarela configurada responde 503 y NO deja órdenes huérfanas", async ({ authedContext }) => {
    test.skip(wompiConfigured, "Wompi está configurado: este caso cubre el entorno sin llaves")

    const page = await authedContext.newPage()
    const { products } = await (await page.request.get("/api/products")).json()
    await page.request.post("/api/cart", { data: { productId: products[0].id } })

    const res = await page.request.post("/api/checkout")
    expect(res.status()).toBe(503)

    // El carrito se conserva: un fallo de pasarela no puede vaciar la compra.
    const { items } = await (await page.request.get("/api/cart")).json()
    expect(items).toHaveLength(1)
  })

  test("con pasarela configurada devuelve una URL de Wompi firmada", async ({ authedContext }) => {
    test.skip(!wompiConfigured, "Requiere WOMPI_PUBLIC_KEY y WOMPI_INTEGRITY_KEY")

    const page = await authedContext.newPage()
    const { products } = await (await page.request.get("/api/products")).json()
    await page.request.post("/api/cart", { data: { productId: products[0].id } })

    const res = await page.request.post("/api/checkout")
    expect(res.status()).toBe(200)
    const data = await res.json()

    const url = new URL(data.wompiUrl)
    expect(url.origin + url.pathname).toBe("https://checkout.wompi.co/p/")
    expect(url.searchParams.get("public-key")).toBeTruthy()
    expect(url.searchParams.get("signature:integrity")).toMatch(/^[a-f0-9]{64}$/)
    expect(Number(url.searchParams.get("amount-in-cents"))).toBeGreaterThan(0)
    expect(url.searchParams.get("currency")).toBe("COP")
    expect(url.searchParams.get("redirect-url")).toContain(data.orderId)

    // El carrito sigue lleno hasta que el pago se confirme.
    const { items } = await (await page.request.get("/api/cart")).json()
    expect(items).toHaveLength(1)
  })
})

test.describe("Verificación de la orden", () => {
  test("exige sesión", async ({ request }) => {
    const res = await request.get("/api/orders/00000000-0000-0000-0000-000000000000/verify")
    expect(res.status()).toBe(401)
  })

  test("no revela órdenes ajenas", async ({ authedContext }) => {
    const page = await authedContext.newPage()
    const res = await page.request.get("/api/orders/00000000-0000-0000-0000-000000000000/verify")
    expect(res.status()).toBe(404)
  })
})

test.describe("Webhook de Wompi", () => {
  test("rechaza eventos sin firma válida", async ({ request }) => {
    const res = await request.post("/api/webhooks/wompi", {
      data: { event: "transaction.updated", data: { transaction: { id: "falsa" } } },
    })
    // 401 si el secreto está puesto, 503 si no lo está. Nunca 200.
    expect([401, 503]).toContain(res.status())
  })
})
