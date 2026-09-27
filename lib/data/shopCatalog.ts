/**
 * Piezas compartidas del catálogo de la tienda: nombres de categoría, formato
 * de precio y disponibilidad. Las usan la grilla, la vista previa y la ficha.
 */

/** Orden y nombre visible de las categorías. Las que no estén aquí se muestran tal cual. */
export const SHOP_CATEGORIES: { id: string; label: string }[] = [
  { id: "lora-meshtastic", label: "LoRa y Meshtastic" },
  { id: "esp32", label: "ESP32-S3" },
  { id: "computadoras", label: "Computadoras y SBC" },
  { id: "handhelds", label: "Handhelds Linux" },
  { id: "comunicacion", label: "Sistemas de comunicación" },
  { id: "facturacion", label: "Software POS" },
]

export function categoryLabel(id: string): string {
  return SHOP_CATEGORIES.find((c) => c.id === id)?.label ?? id
}

/** Precio en pesos colombianos, sin decimales: $204.065 */
export function formatPrice(value: number): string {
  return `$${Math.round(value).toLocaleString("es-CO")}`
}

/**
 * Disponibilidad a partir del stock: -1 es "sin límite", que en hardware
 * importado significa bajo pedido.
 */
export function availability(stock: number, delivery?: string) {
  if (stock < 0) {
    return { tone: "order" as const, label: "Bajo pedido", detail: delivery ?? "Entrega según disponibilidad" }
  }
  if (stock === 0) {
    return { tone: "out" as const, label: "Sin stock", detail: "Próximamente disponible" }
  }
  return { tone: "in" as const, label: "En stock", detail: `${stock} disponibles · listo para enviar` }
}
