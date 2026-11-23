/**
 * Plantilla de correo de V1TR0 (identidad de marca: negro verdoso #030707, turquesa neón #26FFDF,
 * petróleo #025159). Tablas y estilos en línea para que se vea igual en Gmail, Outlook y móviles.
 * Encabezado oscuro con el logo (PNG alojado en v1tr0.com, porque los correos no muestran SVG),
 * cuerpo blanco para leer cómodo y pie con Telegram, correo y web.
 */
const SITIO = "https://v1tr0.com"
const LOGO = `${SITIO}/email/v1tr0-logo.png`
const TELEGRAM = "https://t.me/V1tr0"
const CORREO = "buzon@v1tr0.com"

export const C = {
  negro: "#030707",
  neon: "#26FFDF",
  petroleo: "#025159",
  tinta: "#1A2324",
  gris: "#5D6B6C",
  linea: "#D5DFDF",
  bruma: "#EEF7F6",
}

export const esc = (s: unknown) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

/** Fila "Etiqueta: valor" para tablas de datos. */
export function fila(etiqueta: string, valor: string) {
  return `<tr><td style="padding:10px 0;border-bottom:1px solid ${C.linea};font:600 12px Arial,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:${C.petroleo};width:34%;vertical-align:top">${esc(etiqueta)}</td>
<td style="padding:10px 0 10px 12px;border-bottom:1px solid ${C.linea};font:15px/1.5 Arial,sans-serif;color:${C.tinta};vertical-align:top">${valor}</td></tr>`
}

/** Caja destacada (mensaje del cliente, avisos). */
export function caja(html: string) {
  return `<div style="background:${C.bruma};border-left:4px solid ${C.petroleo};border-radius:8px;padding:16px 18px;margin:18px 0;font:15px/1.6 Arial,sans-serif;color:${C.tinta};white-space:pre-line">${html}</div>`
}

/** Botón principal. */
export function boton(texto: string, url: string, fondo = C.negro, color = C.neon) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:22px 0 6px"><tr><td style="border-radius:10px;background:${fondo}">
<a href="${url}" style="display:inline-block;padding:13px 24px;font:700 15px Arial,sans-serif;color:${color};text-decoration:none;border-radius:10px">${texto}</a></td></tr></table>`
}

interface Opciones {
  /** Texto corto que se ve en la bandeja antes de abrir. */
  preencabezado: string
  /** Etiqueta pequeña sobre el título (p. ej. "Nueva consulta"). */
  etiqueta?: string
  titulo: string
  cuerpo: string
  /** Para correos internos (al equipo) el pie es más breve. */
  interno?: boolean
}

export function correoV1tr0({ preencabezado, etiqueta, titulo, cuerpo, interno = false }: Opciones) {
  const pie = interno
    ? `Notificación automática de ${SITIO.replace("https://", "")} · Responde directamente a este correo para contestar al cliente.`
    : `¿Prefieres hablar ya? Escríbenos por <a href="${TELEGRAM}" style="color:${C.neon};font-weight:bold;text-decoration:none">Telegram @V1tr0</a> o a <a href="mailto:${CORREO}" style="color:${C.neon};text-decoration:none">${CORREO}</a>.`
  return `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only"><title>${esc(titulo)}</title></head>
<body style="margin:0;padding:0;background:#E9EFEF">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(preencabezado)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#E9EFEF;padding:28px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#FFFFFF;border-radius:16px;overflow:hidden;box-shadow:0 6px 24px rgba(3,7,7,.12)">
  <tr><td style="background:${C.negro};background-image:linear-gradient(135deg,#0B302D,#030707 60%);padding:26px 32px;border-bottom:4px solid ${C.neon}">
    <a href="${SITIO}" style="text-decoration:none"><img src="${LOGO}" width="180" height="61" alt="V1TR0" style="display:block;border:0;width:180px;height:auto"></a>
  </td></tr>
  <tr><td style="padding:32px 32px 8px">
    ${etiqueta ? `<div style="font:700 11px Arial,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:${C.petroleo};margin-bottom:8px">${esc(etiqueta)}</div>` : ""}
    <h1 style="margin:0 0 14px;font:700 24px/1.25 Arial,sans-serif;color:${C.negro}">${esc(titulo)}</h1>
    ${cuerpo}
  </td></tr>
  <tr><td style="padding:24px 32px 30px">
    <div style="height:1px;background:${C.linea};margin-bottom:18px"></div>
    <p style="margin:0;font:13px/1.6 Arial,sans-serif;color:${C.gris}">${interno ? pie : `Equipo V1TR0 · Desarrollo de software, web, e-commerce e IoT`}</p>
  </td></tr>
  <tr><td style="background:${C.negro};padding:18px 32px;font:13px/1.6 Arial,sans-serif;color:#B9C9C8">
    ${interno ? `<a href="${SITIO}" style="color:${C.neon};text-decoration:none;font-weight:bold">v1tr0.com</a>` : `${pie}<br><a href="${SITIO}" style="color:${C.neon};text-decoration:none;font-weight:bold">v1tr0.com</a>`}
  </td></tr>
</table>
</td></tr></table>
</body></html>`
}
