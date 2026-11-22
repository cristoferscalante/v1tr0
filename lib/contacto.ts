import { siteConfig } from "@/config/site"

/**
 * Contacto directo con contexto.
 *
 * Como no todo se puede pagar en línea, cada página ofrece escribirnos por Telegram con el
 * mensaje ya redactado según lo que la persona está viendo (solo tiene que tocar "Enviar"),
 * o por correo con el asunto listo. Telegram documenta `t.me/<usuario>?text=` para precargar
 * el borrador: https://core.telegram.org/api/links#public-username-links
 */
export const TELEGRAM_USUARIO = "V1tr0"
export const CORREO = siteConfig.company.email // buzon@v1tr0.com, el mismo de TecnoCrypter

export function mensajeInteres(interes?: string) {
  return interes
    ? `Hola V1TR0, me interesa: ${interes}. ¿Me pueden dar más información?`
    : "Hola V1TR0, quiero más información sobre sus servicios."
}

export function telegramLink(interes?: string) {
  return `https://t.me/${TELEGRAM_USUARIO}?text=${encodeURIComponent(mensajeInteres(interes))}`
}

export function correoLink(interes?: string) {
  const asunto = interes ? `Me interesa: ${interes}` : "Quiero más información"
  return `mailto:${CORREO}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(mensajeInteres(interes) + "\n\nMi nombre:\nMi empresa y ciudad:\nTeléfono:\n")}`
}
