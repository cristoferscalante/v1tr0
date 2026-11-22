import { telegramLink } from "@/lib/contacto"

export interface DatosContacto {
  name: string
  email: string
  message: string
  /** Opcional: algunos formularios no lo piden; se envía "general". */
  serviceArea?: string
}

/**
 * Envía un formulario de contacto a /api/unified-contact (correo a buzon@v1tr0.com y acuse al cliente).
 *
 * Antes varios formularios solo simulaban el envío con un setTimeout: mostraban "enviado" y el
 * mensaje no llegaba a nadie. Si el servidor falla (SMTP caído, sin red), no se pierde el contacto:
 * se abre Telegram con el mensaje ya escrito para que la persona lo envíe con un toque.
 *
 * Devuelve "correo" si se envió por correo y "telegram" si se usó el respaldo.
 */
export async function enviarContacto(datos: DatosContacto): Promise<"correo" | "telegram"> {
  const completos = {
    ...datos,
    // El endpoint exige serviceArea; algunos formularios no lo piden.
    serviceArea: datos.serviceArea || "general",
  }
  try {
    const r = await fetch("/api/unified-contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(completos),
    })
    if (r.ok) return "correo"
    throw new Error(`HTTP ${r.status}`)
  } catch (error) {
    console.error("No se pudo enviar el formulario por correo; se abre Telegram:", error)
    const resumen = `${completos.serviceArea !== "general" ? completos.serviceArea + ". " : ""}Soy ${completos.name} (${completos.email}). ${completos.message}`
    window.open(telegramLink(resumen.slice(0, 1500)), "_blank", "noopener,noreferrer")
    return "telegram"
  }
}
