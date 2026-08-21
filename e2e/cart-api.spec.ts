import { test, expect } from "./fixtures"

/**
 * Contrato del carrito. Cada caso corresponde a un fallo real encontrado
 * navegando el flujo de compra.
 */
test.describe("API del carrito", () => {
  test("rechaza operaciones sin sesión", async ({ request }) => {
    expect((await request.get("/api/cart")).status()).toBe(401)
    expect((await request.post("/api/cart", { data: { productId: "x" } })).status()).toBe(401)
  })

  test("agrega un producto y lo devuelve en el carrito", async ({ authedContext }) => {
    const page = await authedContext.newPage()
    const { products } = await (await page.request.get("/api/products")).json()
    const product = products[0]

    const res = await page.request.post("/api/cart", { data: { productId: product.id, quantity: 2 } })
    expect(res.status()).toBe(200)

    const { items } = await (await page.request.get("/api/cart")).json()
    expect(items).toHaveLength(1)
    expect(items[0].productId).toBe(product.id)
    expect(items[0].quantity).toBe(2)
  })

  test("rechaza cantidades negativas, cero y no enteras", async ({ authedContext }) => {
    const page = await authedContext.newPage()
    const { products } = await (await page.request.get("/api/products")).json()
    const product = products[0]

    for (const quantity of [-5, 0, 1.5, 1000, "muchos"]) {
      const res = await page.request.post("/api/cart", { data: { productId: product.id, quantity } })
      expect(res.status(), `quantity=${quantity} debería rechazarse`).toBe(400)
    }

    const { items } = await (await page.request.get("/api/cart")).json()
    expect(items).toHaveLength(0)
  })

  test("no deja modificar la línea de otro carrito", async ({ authedContext }) => {
    const page = await authedContext.newPage()

    const patch = await page.request.patch("/api/cart", {
      data: { itemId: "00000000-0000-0000-0000-000000000000", quantity: 99 },
    })
    expect(patch.status()).toBe(404)

    const del = await page.request.delete("/api/cart?itemId=00000000-0000-0000-0000-000000000000")
    expect(del.status()).toBe(404)
  })

  test("cantidad 0 en PATCH elimina la línea propia", async ({ authedContext }) => {
    const page = await authedContext.newPage()
    const { products } = await (await page.request.get("/api/products")).json()
    await page.request.post("/api/cart", { data: { productId: products[0].id } })

    const { items } = await (await page.request.get("/api/cart")).json()
    const res = await page.request.patch("/api/cart", { data: { itemId: items[0].id, quantity: 0 } })
    expect(res.status()).toBe(200)

    const after = await (await page.request.get("/api/cart")).json()
    expect(after.items).toHaveLength(0)
  })
})
