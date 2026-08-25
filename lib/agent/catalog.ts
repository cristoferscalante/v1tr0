import { db } from "@/lib/db"
import { products } from "@/lib/db/schema"
import { and, eq, inArray, notInArray } from "drizzle-orm"

import { siteConfig } from "@/config/site"

/**
 * Catálogo en la forma que consume un agente.
 *
 * Es el mismo recorte que ve la tienda (`app/api/products`), reexpresado para
 * una máquina: precio numérico y moneda separados en vez de una cadena
 * formateada, disponibilidad como vocabulario de schema.org, y una URL
 * canónica por producto. Un agente que lee esto puede responder "cuánto vale"
 * sin interpretar HTML ni adivinar si "1.200.000" son pesos o dólares.
 */

/** Mismo recorte que la tienda pública: lo que no está en venta no se anuncia. */
const SLUGS_VISIBLES = ["sistema-pos", "sistema-comunicacion-descentralizado"]

/** Los precios de la tabla están en pesos colombianos, igual que en el checkout. */
export const MONEDA = "COP"

export interface ProductoParaAgente {
  sku: string
  nombre: string
  descripcion: string
  precio: number
  moneda: string
  /** El IVA colombiano ya viene incluido en el precio publicado. */
  impuestoIncluido: boolean
  disponibilidad: "InStock" | "OutOfStock"
  categoria: string
  url: string
  imagen: string | null
}

export async function obtenerCatalogoParaAgente(): Promise<ProductoParaAgente[]> {
  const filas = await db
    .select()
    .from(products)
    .where(
      and(
        eq(products.isActive, true),
        notInArray(products.productType, ["package", "service"]),
        inArray(products.slug, SLUGS_VISIBLES)
      )
    )

  return filas.map((fila) => ({
    sku: fila.slug,
    nombre: fila.name,
    descripcion: fila.shortDescription ?? fila.description ?? "",
    precio: Number(fila.price),
    moneda: MONEDA,
    impuestoIncluido: true,
    // `stock` en -1 significa "sin control de inventario", no "agotado".
    disponibilidad: fila.stock === null || fila.stock === -1 || fila.stock > 0 ? "InStock" : "OutOfStock",
    categoria: fila.category,
    url: `${siteConfig.url}/tienda/${fila.slug}`,
    imagen: fila.images?.[0] ? `${siteConfig.url}${fila.images[0]}` : null,
  }))
}

/**
 * El catálogo como `ItemList` de schema.org.
 *
 * Se sirve junto al JSON propio porque son dos audiencias distintas: el JSON
 * lo lee un agente que ya decidió consultarnos, y el `Offer` con `price` y
 * `availability` es lo que un motor de respuesta necesita para incluirnos en
 * una comparación de precios que nadie nos pidió pero de la que queremos ser
 * parte.
 */
export function catalogoComoSchema(items: ProductoParaAgente[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Catálogo de ${siteConfig.name}`,
    numberOfItems: items.length,
    itemListElement: items.map((item, indice) => ({
      "@type": "ListItem",
      position: indice + 1,
      item: {
        "@type": "Product",
        name: item.nombre,
        description: item.descripcion,
        sku: item.sku,
        category: item.categoria,
        url: item.url,
        ...(item.imagen ? { image: item.imagen } : {}),
        offers: {
          "@type": "Offer",
          price: item.precio,
          priceCurrency: item.moneda,
          availability: `https://schema.org/${item.disponibilidad}`,
          url: item.url,
          seller: { "@id": `${siteConfig.url}/#organization` },
          eligibleRegion: { "@type": "Country", name: "Colombia" },
        },
      },
    })),
  }
}
