import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

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
const validateFormData = (data: any): data is ContactFormData => {
  return (
    typeof data.name === 'string' && data.name.trim().length > 0 &&
    typeof data.email === 'string' && data.email.includes('@') &&
    typeof data.serviceArea === 'string' && data.serviceArea.trim().length > 0 &&
    typeof data.message === 'string' && data.message.trim().length > 0
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

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Nuevo mensaje de contacto - V1tr0</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #555; }
        .value { margin-top: 5px; padding: 10px; background: white; border-radius: 4px; border-left: 4px solid #667eea; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚀 Nuevo mensaje de contacto</h1>
          <p>Has recibido un nuevo mensaje desde el formulario de contacto de V1tr0</p>
        </div>
        <div class="content">
          <div class="field">
            <div class="label">👤 Nombre:</div>
            <div class="value">${data.name}</div>
          </div>
          <div class="field">
            <div class="label">📧 Email:</div>
            <div class="value">${data.email}</div>
          </div>
          <div class="field">
            <div class="label">🎯 Área de Servicio:</div>
            <div class="value">${serviceAreaNames[data.serviceArea] || data.serviceArea}</div>
          </div>
          <div class="field">
            <div class="label">💬 Mensaje:</div>
            <div class="value">${data.message.replace(/\n/g, '<br>')}</div>
          </div>
          <div class="field">
            <div class="label">🕒 Fecha:</div>
            <div class="value">${new Date().toLocaleString('es-ES')}</div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}

// Función para generar el email de respuesta automática
const generateAutoReplyHTML = (name: string) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Gracias por contactarnos - V1tr0</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
        .message { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">V1tr0</div>
          <h1>¡Gracias por contactarnos!</h1>
        </div>
        <div class="content">
          <p>Hola <strong>${name}</strong>,</p>
          
          <div class="message">
            <p>Hemos recibido tu mensaje y queremos agradecerte por contactar con V1tr0.</p>
            
            <p>Nuestro equipo revisará tu consulta y te responderemos lo antes posible, generalmente dentro de las próximas 24 horas.</p>
            
            <p>Mientras tanto, te invitamos a:</p>
            <ul>
              <li>🌐 Explorar nuestros servicios en <a href="https://v1tr0.com">v1tr0.com</a></li>
              <li>📱 Seguirnos en nuestras redes sociales</li>
              <li>📖 Leer nuestro blog para conocer las últimas tendencias tecnológicas</li>
            </ul>
          </div>
          
          <p>Si tienes alguna pregunta urgente, no dudes en contactarnos directamente.</p>
          
          <p>¡Gracias por confiar en V1tr0!</p>
          
          <p><strong>El equipo de V1tr0</strong><br>
          🚀 Transformando ideas en soluciones digitales</p>
        </div>
      </div>
    </body>
    </html>
  `
}

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
      console.error('Variables de entorno SMTP no configuradas')
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
      subject: `🚀 Nuevo contacto desde V1tr0 - ${formData.name}`,
      html: generateEmailHTML(formData),
      text: `
        Nuevo mensaje de contacto:
        
        Nombre: ${formData.name}
        Email: ${formData.email}
        Área de Servicio: ${formData.serviceArea}
        Mensaje: ${formData.message}
        Fecha: ${new Date().toLocaleString('es-ES')}
      `
    }

    // Email de respuesta automática para el usuario
    const userMailOptions = {
      from: process.env.SMTP_FROM,
      to: formData.email,
      subject: '✅ Hemos recibido tu mensaje - V1tr0',
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
    console.error('Error al enviar el email:', error)
    
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