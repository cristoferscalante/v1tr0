import { NextResponse } from "next/server"

import { catalogoComoSchema, obtenerCatalogoParaAgente } from "@/lib/agent/catalog"
import { cabecerasDeLimite, ipDePeticion, limitarPorIp } from "@/lib/agent/rate-limit"
import { siteConfig } from "@/config/site"

/**
 * `GET /api/agent/catalog` — catálogo legible por máquina.
 *
 * Deliberadamente público y sin autenticación: el objetivo es justo el
 * contrario de proteger. Un catálogo que exige credenciales es un catálogo que
 * ningún rastreador de IA va a leer, y entonces no existe para las respuestas
 * que dan los asistentes.
 *
 * Solo lee. No crea nada, no cobra nada y no acepta datos, así que el límite
 * de tasa está para cuidar la base de datos, no para cuidar el negocio.
 */

export const dynamic = "force-dynamic"

const LIMITE = 60
const VENTANA_MS = 60_000

export async function GET(request: Request) {
  const limite = limitarPorIp(ipDePeticion(request), { limite: LIMITE, ventanaMs: VENTANA_MS })

  if (!limite.permitido) {
    return NextResponse.json(
      { error: "Demasiadas peticiones", reintentarEn: limite.reintentarEn },
      { status: 429, headers: cabecerasDeLimite(limite, LIMITE) }
    )
  }

  const items = await obtenerCatalogoParaAgente()

  return NextResponse.json(
    {
      vendedor: {
        nombre: siteConfig.company.legalName,
        url: siteConfig.url,
        email: siteConfig.company.email,
        telefono: siteConfig.company.phone,
        ciudad: `${siteConfig.company.address.city}, ${siteConfig.company.address.region}, ${siteConfig.company.address.country}`,
      },
      moneda: "COP",
      // El agente no debe deducir el flujo leyendo el JSON: se le dice.
      flujoDePago: {
        modelo: "cotizacion-con-aprobacion-humana",
        descripcion:
          "Un agente puede cotizar sin autenticarse en /api/agent/quote. El pago lo completa una persona en el sitio, porque las pasarelas colombianas (PSE, Nequi) exigen autenticación bancaria del titular. No existe un endpoint que permita a un agente pagar por su cuenta.",
        cotizar: `${siteConfig.url}/api/agent/quote`,
      },
      items,
      schema: catalogoComoSchema(items),
    },
    {
      headers: {
        ...cabecerasDeLimite(limite, LIMITE),
        // Cacheable: el catálogo cambia poco y los rastreadores insisten.
        "Cache-Control": "public, max-age=300, s-maxage=1800, stale-while-revalidate=86400",
      },
    }
  )
}
