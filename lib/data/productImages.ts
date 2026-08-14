/**
 * Imágenes de respaldo del catálogo.
 *
 * Los productos de la base todavía no traen imágenes propias, así que aquí
 * resolvemos una pertinente: primero por slug y, si no hay, por categoría.
 * En cuanto un producto tenga su propia imagen, esta tabla deja de aplicarse.
 */

const BY_SLUG: Record<string, string> = {
  // Piezas de marca ya existentes en el proyecto
  "sistema-pos": "/imagenes/tienda/pos.png",
  "sistema-comunicacion-descentralizado": "/imagenes/tienda/heltec-duo-con-efecto.png",
  "kit-hardware-basico": "/imagenes/tienda/hardware-pos.jpg",
  "app-mobile-pos": "/imagenes/tienda/mobilepos.jpg",
}

const BY_CATEGORY: Record<string, string> = {
  ciberseguridad: "/imagenes/tienda/ciberseguridad.jpg",
  facturacion: "/imagenes/tienda/pos.png",
  hardware: "/imagenes/tienda/hardware-pos.jpg",
  iot: "/imagenes/tienda/iot.jpg",
  desarrollo: "/imagenes/tienda/desarrollo.jpg",
  comunicacion: "/imagenes/tienda/heltec-duo-con-efecto.png",
  consultoria: "/imagenes/tienda/consultoria.jpg",
}

const FALLBACK = "/imagenes/tienda/desarrollo.jpg"

export function resolveProductImage(
  { image, slug, category }: { image?: string | null; slug?: string; category?: string }
): string {
  if (image) { return image }
  if (slug && BY_SLUG[slug]) { return BY_SLUG[slug]! }
  if (category && BY_CATEGORY[category]) { return BY_CATEGORY[category]! }
  return FALLBACK
}
