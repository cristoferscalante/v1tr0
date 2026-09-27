import { siteConfig } from "@/config/site"

/**
 * `/.well-known/agent-commerce.json` — documento de descubrimiento.
 *
 * Un agente que llega al dominio necesita saber, sin rastrear el sitio
 * completo, si aquí se puede comprar y cómo. `/.well-known/` es la convención
 * de la web para exactamente esa pregunta.
 *
 * El documento declara con todas las letras lo que NO se puede hacer. Es la
 * parte más útil: un agente que sabe de entrada que no hay pago autónomo le
 * dice la verdad a su usuario en lugar de intentarlo, fallar y reportar que el
 * sitio está roto.
 */
export const dynamic = "force-static"

export function GET() {
  const documento = {
    version: "1.0",
    vendedor: {
      nombre: siteConfig.company.legalName,
      url: siteConfig.url,
      email: siteConfig.company.email,
      telefono: siteConfig.company.phone,
      direccion: {
        calle: siteConfig.company.address.street,
        ciudad: siteConfig.company.address.city,
        region: siteConfig.company.address.region,
        pais: siteConfig.company.address.country,
      },
    },
    moneda: "COP",
    idioma: "es-CO",
    capacidades: {
      catalogo: {
        metodo: "GET",
        url: `${siteConfig.url}/api/agent/catalog`,
        autenticacion: "ninguna",
        descripcion: "Productos con precio en pesos, disponibilidad y URL canónica.",
      },
      cotizacion: {
        metodo: "POST",
        url: `${siteConfig.url}/api/agent/quote`,
        autenticacion: "ninguna",
        cuerpo: { items: [{ sku: "string", cantidad: "number" }] },
        descripcion: "Devuelve el precio total de una selección. No reserva inventario ni crea una orden.",
      },
      pagoAutonomo: {
        soportado: false,
        motivo:
          "La pasarela es Wompi (PSE, tarjetas, Nequi). Los medios de pago colombianos exigen que el titular se autentique ante su banco, así que ningún agente puede completar el pago en nombre de una persona.",
        alternativa: `Entregar al usuario la cotización y el enlace a ${siteConfig.url}/tienda para que apruebe y pague.`,
      },
    },
    limites: {
      catalogo: "60 peticiones por minuto por IP",
      cotizacion: "20 peticiones por minuto por IP",
    },
    contactoHumano: {
      email: siteConfig.company.email,
      telefono: siteConfig.company.phone,
      horario: "Lunes a viernes, 08:00-18:00 (America/Bogota)",
    },
  }

  return new Response(JSON.stringify(documento, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  })
}
