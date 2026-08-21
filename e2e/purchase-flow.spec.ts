import { test, expect } from "./fixtures"
import { test as base, type Page } from "@playwright/test"

const ADD_TO_CART = { name: "Agregar al carrito", exact: true } as const

/**
 * Abre la tienda y espera a que el catálogo esté pintado.
 *
 * La grilla se llena con un fetch a /api/products en el cliente; sin esperarlo
 * el test compite con la carga y ve el estado vacío ("Limpiar filtros").
 */
async function abrirTienda(page: Page) {
  const productos = page.waitForResponse(
    (r) => r.url().includes("/api/products") && r.request().method() === "GET",
    { timeout: 60_000 }
  )
  await page.goto("/tienda", { waitUntil: "domcontentloaded" })
  const res = await productos
  expect(res.status(), "el catálogo debe responder 200").toBe(200)
  await expect(page.getByRole("button", ADD_TO_CART).first()).toBeVisible({ timeout: 30_000 })
}

base.describe("Tienda (visitante anónimo)", () => {
  base("el catálogo carga y lista productos", async ({ page }) => {
    await abrirTienda(page)
    expect(await page.locator('a[href^="/tienda/"]').count()).toBeGreaterThan(0)
  })

  base("agregar al carrito sin sesión manda al login", async ({ page }) => {
    await abrirTienda(page)
    await page.getByRole("button", ADD_TO_CART).first().click()
    await page.waitForURL(/\/login/, { timeout: 30_000 })
  })

  base("la ficha de producto abre y ofrece comprar", async ({ page }) => {
    await abrirTienda(page)
    const href = await page.locator('a[href^="/tienda/"]').first().getAttribute("href")
    await page.goto(href!, { waitUntil: "domcontentloaded" })
    // Hay dos tipos de ficha: producto suelto ("Agregar al Carrito") y
    // promoción de paquete ("Probar Gratis" / "Comenzar Ahora").
    await expect(
      page
        .getByRole("button", { name: /agregar al carrito|comenzar ahora|probar gratis/i })
        .first()
    ).toBeVisible({ timeout: 30_000 })
  })
})

test.describe("Flujo de compra (con sesión)", () => {
  test("agregar, ver en el drawer, cambiar cantidad y eliminar", async ({ authedContext }) => {
    const page = await authedContext.newPage()
    await abrirTienda(page)

    await page.getByRole("button", ADD_TO_CART).first().click()
    await expect.poll(async () => {
      const { items } = await (await page.request.get("/api/cart")).json()
      return items.length
    }, { timeout: 30_000 }).toBe(1)

    await page.evaluate(() => window.dispatchEvent(new Event("toggleCart")))
    await expect(page.getByRole("heading", { name: /carrito/i })).toBeVisible()

    await page.getByRole("button", { name: /aumentar cantidad/i }).first().click()
    await expect.poll(async () => {
      const { items } = await (await page.request.get("/api/cart")).json()
      return items[0]?.quantity
    }, { timeout: 30_000 }).toBe(2)

    await page.getByRole("button", { name: /eliminar producto/i }).first().click()
    await expect.poll(async () => {
      const { items } = await (await page.request.get("/api/cart")).json()
      return items.length
    }, { timeout: 30_000 }).toBe(0)
  })

  test("un fallo de la pasarela se muestra al usuario", async ({ authedContext }) => {
    const page = await authedContext.newPage()

    // Se fuerza el fallo para no depender de si Wompi está configurado.
    await page.route("**/api/checkout", (route) =>
      route.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({ error: "Pasarela caída" }),
      })
    )

    await abrirTienda(page)
    await page.getByRole("button", ADD_TO_CART).first().click()
    await expect.poll(async () => {
      const { items } = await (await page.request.get("/api/cart")).json()
      return items.length
    }, { timeout: 30_000 }).toBe(1)

    await page.evaluate(() => window.dispatchEvent(new Event("toggleCart")))
    await page.getByRole("button", { name: /finalizar compra/i }).click()

    // Antes el botón volvía a su estado normal sin decir nada.
    // getByRole("alert") también capta el anunciador de rutas de Next.
    await expect(page.getByRole("alert").filter({ hasText: /pasarela/i })).toBeVisible()
  })
})
