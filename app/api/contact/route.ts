import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { boton, caja, correoV1tr0, esc, fila } from "@/lib/email/plantilla"

// Interfaz para los datos del formulario
interface ContactFormData {
  name: string
  email: string
  serviceArea: string
  message: string
}

// Configuración del transporter de nodemailer
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true para 465, false para otros puertos
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: process.env.SMTP_TLS === 'true'
    }
  })
}

// Función para validar los datos del formulario
const validateFormData = (data: unknown): data is ContactFormData => {
  if (typeof data !== 'object' || data === null) {
    return false;
  }
  
  const obj = data as Record<string, unknown>;
  return (
    typeof obj.name === 'string' && obj.name.trim().length > 0 &&
    typeof obj.email === 'string' && obj.email.includes('@') &&
    typeof obj.serviceArea === 'string' && obj.serviceArea.trim().length > 0 &&
    typeof obj.message === 'string' && obj.message.trim().length > 0
  )
}

// Función para generar el HTML del email
const generateEmailHTML = (data: ContactFormData) => {
  const serviceAreaNames: { [key: string]: string } = {
    'datos': 'Sistemas de Información',
    'desarrollo': 'Desarrollo de Software',
    'gestion': 'Gestión de Proyectos',
    'automatizacion': 'Automatización de Tareas'
  }
  const servicio = serviceAreaNames[data.serviceArea] || data.serviceArea
  const fecha = new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota', dateStyle: 'long', timeStyle: 'short' })
  return correoV1tr0({
    preencabezado: `${data.name} · ${servicio}: ${data.message.slice(0, 90)}`,
    etiqueta: 'Nuevo contacto desde la web',
    titulo: `${data.name} quiere hablar de ${servicio}`,
    interno: true,
    cuerpo: `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
${fila('Nombre', esc(data.name))}
${fila('Correo', `<a href="mailto:${esc(data.email)}" style="color:#025159;font-weight:bold">${esc(data.email)}</a>`)}
${fila('Servicio', esc(servicio))}
${fila('Recibido', esc(fecha))}
</table>
${caja(esc(data.message))}
${boton('Responder al cliente', `mailto:${esc(data.email)}?subject=${encodeURIComponent('Re: tu mensaje a V1TR0')}`)}`,
  })
}

const generateAutoReplyHTML = (name: string) =>
  correoV1tr0({
    preencabezado: 'Recibimos tu mensaje. Te respondemos en menos de 24 horas hábiles.',
    etiqueta: 'Mensaje recibido',
    titulo: `¡Gracias, ${name}!`,
    cuerpo: `<p style="margin:0 0 12px;font:16px/1.6 Arial,sans-serif;color:#1A2324">Recibimos tu mensaje. Lo revisamos y te respondemos lo antes posible, normalmente en menos de <strong>24 horas hábiles</strong>.</p>
<p style="margin:0;font:15px/1.6 Arial,sans-serif;color:#1A2324">Mientras tanto, puedes conocer cómo trabajamos y nuestros servicios:</p>
${boton('Ver servicios de V1TR0', 'https://v1tr0.com/servicios')}`,
  })

export async function POST(request: NextRequest) {
  try {
    // Parsear los datos del formulario
    const body = await request.json()
    
    // Validar los datos
    if (!validateFormData(body)) {
      return NextResponse.json(
        { error: 'Datos del formulario inválidos' },
        { status: 400 }
      )
    }

    const formData: ContactFormData = body

    // Verificar variables de entorno
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return NextResponse.json(
        { error: 'Configuración del servidor de correo no disponible' },
        { status: 500 }
      )
    }

    // Crear el transporter
    const transporter = createTransporter()

    // Verificar la conexión SMTP
    await transporter.verify()

    // Email para el equipo de V1tr0
    const adminMailOptions = {
      from: process.env.SMTP_FROM,
      to: process.env.SMTP_TO || process.env.SMTP_FROM,
      replyTo: formData.email,
      subject: `Nuevo contacto: ${formData.name}`,
      html: generateEmailHTML(formData),
      text: `
        Nuevo mensaje de contacto:
        
        Nombre: ${formData.name}
        Email: ${formData.email}
        Área de Servicio: ${formData.serviceArea}
        Mensaje: ${formData.message}
        Fecha: ${new Date().toLocaleString('es-ES', { timeZone: 'America/Bogota' })}
      `
    }

    // Email de respuesta automática para el usuario
    const userMailOptions = {
      from: process.env.SMTP_FROM,
      to: formData.email,
      replyTo: 'buzon@v1tr0.com',
      subject: 'Recibimos tu mensaje · V1TR0',
      html: generateAutoReplyHTML(formData.name),
      text: `
        Hola ${formData.name},
        
        Hemos recibido tu mensaje y queremos agradecerte por contactar con V1tr0.
        
        Nuestro equipo revisará tu consulta y te responderemos lo antes posible, generalmente dentro de las próximas 24 horas.
        
        ¡Gracias por confiar en V1tr0!
        
        El equipo de V1tr0
        🚀 Transformando ideas en soluciones digitales
      `
    }

    // Enviar ambos emails
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(userMailOptions)
    ])

    return NextResponse.json(
      { 
        success: true, 
        message: 'Mensaje enviado correctamente' 
      },
      { status: 200 }
    )

  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Error interno del servidor al enviar el mensaje',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    )
  }
}

// Manejar método GET para verificar que la API está funcionando
export async function GET() {
  return NextResponse.json(
    { 
      message: 'API de contacto funcionando correctamente',
      timestamp: new Date().toISOString()
    },
    { status: 200 }
  )
}