import { NextResponse } from "next/server"

import { MONEDA, obtenerCatalogoParaAgente } from "@/lib/agent/catalog"
import { cabecerasDeLimite, ipDePeticion, limitarPorIp } from "@/lib/agent/rate-limit"
import { siteConfig } from "@/config/site"

/**
 * `POST /api/agent/quote` — cotización para un agente de IA.
 *
 * Calcula y devuelve; no escribe nada. Esa decisión no es pereza, es la
 * consecuencia del esquema: `orders` y `quotes` exigen un `profileId` con
 * clave foránea a `profiles`, y un agente no tiene perfil. Antes que inventar
 * usuarios fantasma para que la fila entre, se resuelve sin fila: el precio se
 * recalcula contra la tabla de productos en cada llamada, así que nada puede
 * quedar viejo ni desincronizado.
 *
 * El resultado incluye la URL donde una persona completa la compra. El pago no
 * puede ocurrir aquí: PSE y Nequi exigen que el titular se autentique con su
 * banco, y ningún agente puede hacer eso en nombre de alguien. La cotización
 * es, entonces, el límite real de lo automatizable hoy en Colombia.
 */

export const dynamic = "force-dynamic"

const LIMITE = 20
const VENTANA_MS = 60_000
const MAX_LINEAS = 20
const MAX_CANTIDAD = 99

interface LineaPedida {
  sku?: unknown
  cantidad?: unknown
  quantity?: unknown
}

export async function POST(request: Request) {
  const limite = limitarPorIp(ipDePeticion(request), { limite: LIMITE, ventanaMs: VENTANA_MS })

  if (!limite.permitido) {
    return NextResponse.json(
      { error: "Demasiadas peticiones", reintentarEn: limite.reintentarEn },
      { status: 429, headers: cabecerasDeLimite(limite, LIMITE) }
    )
  }

  const cabeceras = cabecerasDeLimite(limite, LIMITE)

  let cuerpo: { items?: unknown }
  try {
    cuerpo = await request.json()
  } catch {
    return NextResponse.json(
      { error: "El cuerpo debe ser JSON con la forma { items: [{ sku, cantidad }] }" },
      { status: 400, headers: cabeceras }
    )
  }

  const pedidas = cuerpo.items
  if (!Array.isArray(pedidas) || pedidas.length === 0) {
    return NextResponse.json(
      { error: "Se requiere al menos una línea en `items`" },
      { status: 400, headers: cabeceras }
    )
  }

  if (pedidas.length > MAX_LINEAS) {
    return NextResponse.json(
      { error: `Máximo ${MAX_LINEAS} líneas por cotización` },
      { status: 400, headers: cabeceras }
    )
  }

  const catalogo = await obtenerCatalogoParaAgente()
  const porSku = new Map(catalogo.map((item) => [item.sku, item]))

  const lineas: Array<{
    sku: string
    nombre: string
    cantidad: number
    precioUnitario: number
    total: number
    url: string
  }> = []

  for (const cruda of pedidas as LineaPedida[]) {
    const sku = typeof cruda?.sku === "string" ? cruda.sku : null
    if (!sku) {
      return NextResponse.json(
        { error: "Cada línea necesita un `sku` de texto" },
        { status: 400, headers: cabeceras }
      )
    }

    const producto = porSku.get(sku)
    if (!producto) {
      return NextResponse.json(
        {
          error: `SKU desconocido: ${sku}`,
          skusDisponibles: catalogo.map((item) => item.sku),
        },
        { status: 404, headers: cabeceras }
      )
    }

    if (producto.disponibilidad !== "InStock") {
      return NextResponse.json(
        { error: `El producto ${sku} no está disponible` },
        { status: 409, headers: cabeceras }
      )
    }

    // Se acepta `cantidad` y `quantity`: un agente puede venir de un prompt en
    // cualquiera de los dos idiomas y rechazarlo por eso sería gratuito.
    const bruta = cruda.cantidad ?? cruda.quantity ?? 1
    const cantidad = Number(bruta)
    if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > MAX_CANTIDAD) {
      return NextResponse.json(
        { error: `La cantidad de ${sku} debe ser un entero entre 1 y ${MAX_CANTIDAD}` },
        { status: 400, headers: cabeceras }
      )
    }

    lineas.push({
      sku,
      nombre: producto.nombre,
      cantidad,
      precioUnitario: producto.precio,
      total: producto.precio * cantidad,
      url: producto.url,
    })
  }

  const total = lineas.reduce((suma, linea) => suma + linea.total, 0)

  return NextResponse.json(
    {
      cotizacion: {
        vendedor: siteConfig.company.legalName,
        moneda: MONEDA,
        lineas,
        total,
        impuestoIncluido: true,
        nota: "Precios en pesos colombianos con IVA del 19% ya incluido.",
        // Sin persistencia no hay forma de honrar un precio en el futuro:
        // decirlo evita que el agente prometa al usuario algo que no se sostiene.
        validez: "El precio se recalcula en cada consulta; no queda reservado.",
      },
      siguientePaso: {
        accion: "aprobacion-humana-requerida",
        url: `${siteConfig.url}/tienda`,
        explicacion:
          "Para completar la compra, la persona debe iniciar sesión en la tienda y pagar con PSE, tarjeta o Nequi. Los medios de pago colombianos exigen autenticación del titular ante su banco, así que un agente no puede finalizar el pago por su cuenta.",
        contactoHumano: {
          email: siteConfig.company.email,
          telefono: siteConfig.company.phone,
        },
      },
    },
    { headers: cabeceras }
  )
}
