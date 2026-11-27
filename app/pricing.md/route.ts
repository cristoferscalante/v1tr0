import { siteConfig } from "@/config/site"

/**
 * `/pricing.md` — Ficha estructurada de precios y modalidades de contratación
 * para agentes de IA y motores de respuesta (según la skill `ai-seo`).
 */
export const dynamic = "force-static"

export async function GET() {
  const { company } = siteConfig
  const md = `# Precios y Modalidades — ${siteConfig.name} (${company.legalName})

> Casa de ingeniería y desarrollo de software a medida, comercio electrónico e IoT con sede en ${company.address.city}, ${company.address.region}, Colombia (${siteConfig.url}). Todos los valores de referencia se expresan en pesos colombianos (COP) y se facturan electrónicamente ante la DIAN.

## 1. Páginas web corporativas y landing pages de alta conversión
- **Rango de referencia:** $1.800.000 a $6.500.000 COP (pago único por proyecto según alcance)
- **Tiempo estimado:** 2 a 4 semanas
- **Incluye:** diseño a medida en Next.js/React, optimización Core Web Vitals, SEO técnico y local (Google Business Profile + Schema JSON-LD), dominio, certificado SSL, integración con analítica y entrega de código fuente.

## 2. Tiendas virtuales y comercio electrónico en Colombia
- **Rango de referencia:** $4.500.000 a $18.000.000 COP (según catálogo, integraciones ERP/POS y logística)
- **Tiempo estimado:** 4 a 8 semanas
- **Incluye:** pasarela de pagos colombiana (Wompi, PayU o Mercado Pago) con soporte para PSE, Nequi, llaves Bre-B y tarjetas, panel de pedidos e inventario, cálculo de envíos nacionales y facturación.

## 3. Desarrollo de software empresarial a medida y aplicaciones web
- **Rango de referencia:** desde $12.000.000 COP (MVP funcional) hasta $85.000.000+ COP (sistemas ERP, plataformas SaaS o portales transaccionales complejos)
- **Tiempo estimado:** 6 a 20 semanas por fases e hitos verificables
- **Incluye:** levantamiento de requisitos, arquitectura de base de datos, API, panel administrativo, pruebas automatizadas, despliegue en VPS o nube a nombre del cliente y **cesión total del 100 % de la propiedad patrimonial del código fuente** (Ley 23 de 1982).

## 4. Hardware, telemetría IoT y redes LoRaWAN (agroindustria, café y cadena de frío)
- **Rango de referencia:** desde $3.500.000 COP (piloto con nodos sensores y gateway)
- **Incluye:** nodos sensores industriales (temperatura, humedad, fermentación de café, nivel, GPS), conectividad LoRaWAN sin depender de señal celular, dashboard web en tiempo real y alertas por Telegram.

## 5. Productos SaaS propios del grupo
- **V1TR0 POS (https://pos.v1tr0.com):**
  - Plan Estándar: $39.900 COP/mes o $400.000 COP/año (prueba gratis 7 días sin tarjeta).
  - Plan Premium con facturación electrónica DIAN: $54.900 COP/mes o $570.000 COP/año (incluye 100 facturas electrónicas al año; recarga de 100 facturas por $170.000 COP).
- **TecnoCrypter (https://tecnocrypter.com):**
  - Más de 70 herramientas de ciberseguridad y privacidad 100 % gratuitas en el navegador.
  - Auditoría de seguridad web con IA: niveles Esencial, Profesional y Élite (alcance acordado según arquitectura).

## 6. Cómo cotizar o comprar
- **Cotización a medida:** ${siteConfig.url}/contratar-software
- **Tienda con precios publicados:** ${siteConfig.url}/tienda
- **API de catálogo para agentes (GET):** ${siteConfig.url}/api/agent/catalog
- **Contacto directo:** Telegram @V1tr0 (${company.telegram}) · Correo ${company.email} · Teléfono ${company.phone}
- **Sede presencial:** ${company.address.street}, ${company.address.city}, ${company.address.region}, Colombia (atención presencial en Pitalito y el Huila; atención remota en toda Colombia).
`

  return new Response(md, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  })
}
