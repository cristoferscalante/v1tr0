import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST() {
  try {
    // Configuración SMTP cargada desde variables de entorno

    // Configurar el transportador SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true para SSL (465), false para TLS (587)
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false // Permitir certificados auto-firmados
      },
      debug: true, // Habilitar debug
      logger: true // Habilitar logging
    })

    // Verificar la conexión SMTP
    await transporter.verify()
    // Conexión SMTP verificada exitosamente

    // Configurar el correo de prueba
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: 'cristoferscalante@gmail.com',
      subject: 'Prueba de Sistema SMTP - V1tr0',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Prueba SMTP V1tr0</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: #f9f9f9;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .test-info {
              background: #e8f5e8;
              border-left: 4px solid #4caf50;
              padding: 15px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              color: #666;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🚀 V1tr0 - Prueba de Sistema SMTP</h1>
          </div>
          
          <div class="content">
            <h2>¡Prueba Exitosa!</h2>
            
            <p>Hola,</p>
            
            <p>Este es un correo de prueba del sistema SMTP de <strong>V1tr0</strong>. Si estás recibiendo este mensaje, significa que:</p>
            
            <div class="test-info">
              <h3>✅ Sistema Funcionando Correctamente</h3>
              <ul>
                <li>Configuración SMTP establecida</li>
                <li>Conexión al servidor de correo exitosa</li>
                <li>Envío de correos operativo</li>
                <li>Plantillas HTML funcionando</li>
              </ul>
            </div>
            
            <p><strong>Detalles de la prueba:</strong></p>
            <ul>
              <li><strong>Fecha:</strong> ${new Date().toLocaleString('es-ES', { timeZone: 'America/Bogota' })}</li>
              <li><strong>Sistema:</strong> V1tr0 Contact System</li>
              <li><strong>Método:</strong> SMTP via Nodemailer</li>
              <li><strong>Estado:</strong> Operativo</li>
            </ul>
            
            <p>El sistema de contacto está listo para recibir y procesar formularios de los usuarios.</p>
          </div>
          
          <div class="footer">
            <p>Este es un correo automático generado por el sistema V1tr0</p>
            <p>© 2025 V1tr0 - Todos los derechos reservados</p>
          </div>
        </body>
        </html>
      `,
      text: `
        V1tr0 - Prueba de Sistema SMTP
        
        ¡Prueba Exitosa!
        
        Este es un correo de prueba del sistema SMTP de V1tr0.
        
        Sistema Funcionando Correctamente:
        - Configuración SMTP establecida
        - Conexión al servidor de correo exitosa
        - Envío de correos operativo
        - Plantillas HTML funcionando
        
        Detalles de la prueba:
        - Fecha: ${new Date().toLocaleString('es-ES', { timeZone: 'America/Bogota' })}
        - Sistema: V1tr0 Contact System
        - Método: SMTP via Nodemailer
        - Estado: Operativo
        
        El sistema de contacto está listo para recibir y procesar formularios de los usuarios.
        
        © 2025 V1tr0 - Todos los derechos reservados
      `
    }

    // Enviar el correo
    const info = await transporter.sendMail(mailOptions)

    return NextResponse.json({
      success: true,
      message: 'Correo de prueba enviado exitosamente',
      details: {
        messageId: info.messageId,
        to: 'cristoferscalante@gmail.com',
        subject: 'Prueba de Sistema SMTP - V1tr0',
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Error al enviar correo de prueba:', error)
    
    return NextResponse.json(
      {
        success: false,
        message: 'Error al enviar el correo de prueba',
        error: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}

// También permitir GET para pruebas rápidas desde el navegador
export async function GET() {
  return POST()
}