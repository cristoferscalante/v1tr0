import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { boton, caja, correoV1tr0, esc, fila } from "@/lib/email/plantilla"

interface ContactFormData {
  name: string
  email: string
  message: string
  serviceArea: string
}

const serviceAreaNames: { [key: string]: string } = {
  desarrollo: 'Desarrollo de Software',
  sistemas: 'Sistemas de Información',
  automatizacion: 'Automatización de Tareas',
  gestion: 'Gestión de Proyectos',
  datos: 'Ciencia de Datos y Análisis Avanzado',
  general: 'Consulta general'
}

const createEmailTemplate = (data: ContactFormData, isClientEmail: boolean = false) => {
  const servicio = serviceAreaNames[data.serviceArea] || data.serviceArea
  const fecha = new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota', dateStyle: 'long', timeStyle: 'short' })
  if (isClientEmail) {
    return correoV1tr0({
      preencabezado: `Recibimos tu consulta sobre ${servicio}. Te respondemos en 24-48 horas hábiles.`,
      etiqueta: 'Consulta recibida',
      titulo: `¡Gracias, ${data.name}!`,
      cuerpo: `<p style="margin:0 0 12px;font:16px/1.6 Arial,sans-serif;color:#1A2324">Recibimos tu consulta sobre <strong>${esc(servicio)}</strong>. Nuestro equipo la revisará y te responderá en un plazo de <strong>24 a 48 horas hábiles</strong> con los siguientes pasos.</p>
${caja(esc(data.message))}
<p style="margin:0;font:15px/1.6 Arial,sans-serif;color:#1A2324">Si necesitas agregar algo, responde a este correo o escríbenos por Telegram con el mensaje ya listo:</p>
${boton('Escribir por Telegram', 'https://t.me/V1tr0?text=' + encodeURIComponent(`Hola V1TR0, soy ${data.name}. Les escribí por el formulario sobre ${servicio}.`), '#229ED9', '#FFFFFF')}`,
    })
  }
  return correoV1tr0({
    preencabezado: `${data.name} · ${servicio}: ${data.message.slice(0, 90)}`,
    etiqueta: 'Nueva consulta desde la web',
    titulo: `${data.name} quiere hablar de ${servicio}`,
    interno: true,
    cuerpo: `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
${fila('Nombre', esc(data.name))}
${fila('Correo', `<a href="mailto:${esc(data.email)}" style="color:#025159;font-weight:bold">${esc(data.email)}</a>`)}
${fila('Servicio', esc(servicio))}
${fila('Recibido', esc(fecha))}
</table>
${caja(esc(data.message))}
${boton('Responder al cliente', `mailto:${esc(data.email)}?subject=${encodeURIComponent('Re: tu consulta sobre ' + servicio)}`)}`,
  })
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json()
    const { name, email, message, serviceArea } = body

    // Validar datos requeridos
    if (!name || !email || !message || !serviceArea) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      )
    }
    
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return NextResponse.json(
        { error: 'Configuración SMTP incompleta' },
        { status: 500 }
      )
    }

    // Configurar transporter de nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: process.env.SMTP_TLS === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      }
    })
    
    // Verificar conexión SMTP
    try {
      await transporter.verify()
    } catch (verifyError) {
      return NextResponse.json(
        { error: 'Error de conexión SMTP: ' + (verifyError as Error).message },
        { status: 500 }
      )
    }

    const serviceName = serviceAreaNames[serviceArea] || serviceArea

    // Enviar notificación interna
    try {
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: 'buzon@v1tr0.com', // Enviar específicamente a buzon@v1tr0.com
        replyTo: email,
        subject: `Nueva consulta: ${serviceName} · ${name}`,
        html: createEmailTemplate(body, false),
      })
    } catch (internalError) {
      throw internalError
    }

    // Enviar respuesta automática al cliente
    try {
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        replyTo: 'buzon@v1tr0.com',
        subject: 'Recibimos tu consulta · V1TR0',
        html: createEmailTemplate(body, true),
      })
    } catch (clientError) {
      throw clientError
    }
    return NextResponse.json(
      { message: 'Consulta enviada exitosamente' },
      { status: 200 }
    )
  } catch (error) {
    // Proporcionar más detalles del error
    let errorMessage = 'Error interno del servidor'
    if (error instanceof Error) {
      errorMessage = error.message
    }
    
    return NextResponse.json(
      { 
        error: 'Error al enviar consulta: ' + errorMessage,
        details: process.env.NODE_ENV === 'development' ? (error as Error).stack : undefined
      },
      { status: 500 }
    )
  }
}