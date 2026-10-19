import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

// Suscripción al newsletter de V1TR0 (Blogs & Investigación). No hay tabla de
// suscriptores todavía: se notifica al equipo por correo, igual que el
// formulario de contacto. Cuando exista un proveedor de email marketing o una
// tabla propia, este endpoint es el único punto a cambiar.

interface NewsletterData {
  email: string
  // Trampa anti-spam: un campo oculto que un humano nunca llena.
  website?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const isValid = (data: unknown): data is NewsletterData => {
  if (typeof data !== "object" || data === null) {
    return false
  }
  const obj = data as Record<string, unknown>
  return typeof obj.email === "string" && EMAIL_RE.test(obj.email.trim())
}

const createTransporter = () =>
  nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: process.env.SMTP_TLS === "true",
    },
  })

export async function POST(request: NextRequest) {
  let data: unknown
  try {
    data = await request.json()
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 })
  }

  if (!isValid(data)) {
    return NextResponse.json(
      { error: "Ingresa un correo electrónico válido." },
      { status: 400 },
    )
  }

  // Campo trampa lleno: lo tratamos como éxito silencioso para no dar pistas al bot.
  if (data.website && data.website.trim().length > 0) {
    return NextResponse.json({ ok: true })
  }

  const email = data.email.trim().toLowerCase()

  // Sin SMTP configurado (p. ej. en desarrollo) aceptamos la suscripción sin
  // enviar nada: la UX funciona y no se pierde el correo en un error 500.
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    console.warn("[newsletter] SMTP no configurado; suscripción recibida:", email)
    return NextResponse.json({ ok: true })
  }

  try {
    const transporter = createTransporter()
    const to = process.env.NEWSLETTER_TO || process.env.SMTP_USER
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject: "Nueva suscripción · Blogs & Investigación",
      text: `Nuevo suscriptor al newsletter de V1TR0: ${email}`,
      html: `<p>Nuevo suscriptor al newsletter <strong>Blogs &amp; Investigación</strong>:</p><p><a href="mailto:${email}">${email}</a></p>`,
    })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("[newsletter] error al notificar:", error)
    return NextResponse.json(
      { error: "No pudimos registrar tu correo. Intenta de nuevo." },
      { status: 500 },
    )
  }
}
