/**
 * Calienta las rutas antes de la primera prueba.
 *
 * El dev server de Next compila bajo demanda: sobre un .next recién borrado,
 * la primera visita a /tienda puede tardar más que el timeout de un test y
 * hace fallar la corrida por algo que no es un defecto del producto.
 */
const RUTAS = ["/tienda", "/login", "/api/products"]

export default async function globalSetup() {
  const base = process.env.E2E_BASE_URL ?? `http://localhost:${process.env.E2E_PORT ?? "3000"}`

  for (const ruta of RUTAS) {
    try {
      await fetch(`${base}${ruta}`, { signal: AbortSignal.timeout(180_000) })
    } catch {
      // Si el servidor no responde, los propios tests lo reportarán con
      // mucho mejor contexto que un fallo aquí.
    }
  }

  // La ficha de producto se compila aparte: se calienta con un slug real.
  try {
    const res = await fetch(`${base}/api/products`, { signal: AbortSignal.timeout(60_000) })
    const { products } = await res.json()
    if (products?.[0]?.slug) {
      await fetch(`${base}/tienda/${products[0].slug}`, { signal: AbortSignal.timeout(180_000) })
    }
  } catch {
    // Igual que arriba.
  }
}
