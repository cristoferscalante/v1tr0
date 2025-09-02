import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

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
  datos: 'Ciencia de Datos y Análisis Avanzado'
}

const createEmailTemplate = (data: ContactFormData, isClientEmail: boolean = false) => {
  const serviceName = serviceAreaNames[data.serviceArea] || data.serviceArea
  
  if (isClientEmail) {
    // Plantilla para el cliente
    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmación de Consulta - V1tr0</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #0a1a1f 0%, #1a2f35 100%); color: #ffffff;">
        <div style="max-width: 600px; margin: 0 auto; background: #0f1f24; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.3);">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #025059 0%, #08A696 100%); padding: 40px 30px; text-align: center; position: relative;">
                <div style="background: rgba(255,255,255,0.1); border-radius: 50%; width: 80px; height: 80px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                    <svg width="50" height="50" viewBox="0 0 1400 1200" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M1149.65 851.764C1149.65 851.764 1150.51 345.064 1149.54 346.144C1146.15 312.431 1136.62 289.18 1100.25 289.18H1030.27C960.297 289.18 960.297 289.18 960.297 222.706V216.475C960.297 179.762 928.968 150 890.321 150H820.346C781.7 150 750.371 179.762 750.371 216.475V292.296C750.371 329.009 781.7 358.771 820.346 358.771L926.68 361.886C946.909 361.886 959.821 375.907 959.821 395.123C959.821 414.34 946.909 428.361 926.68 428.361L784.859 425.246C645.422 425.246 647.415 425.246 645.422 358.771V352.54C645.422 315.827 614.093 286.065 575.447 286.065H505.472C466.826 286.065 435.497 315.827 435.497 352.54V428.361C435.497 465.074 466.826 494.836 505.472 494.836H824.554C844.782 494.836 861.181 510.414 861.181 529.631C861.181 548.848 844.782 564.426 824.554 564.426H319.975C281.329 564.426 250 594.188 250 630.901V706.722C250 743.435 281.329 773.197 319.975 773.197H389.95C428.597 773.197 459.925 743.435 459.925 706.722V700.491C459.925 634.016 459.925 634.016 529.9 634.016H824.554C844.782 634.016 861.181 649.595 861.181 668.811C861.181 688.028 844.782 703.607 824.554 703.607H585.154C546.507 703.607 515.179 733.368 515.179 770.081V845.902C515.179 882.615 546.507 912.377 585.154 912.377H655.129C693.775 912.377 725.104 882.615 725.104 845.902V839.672C725.104 773.197 725.104 773.197 784.859 773.197L994.785 770.081C1015.01 770.081 1031.41 785.659 1031.41 804.876C1031.41 824.093 1015.01 839.671 994.785 839.671L854.835 841.229C816.188 841.229 784.859 870.991 784.859 907.704V983.525C784.859 1020.24 816.188 1050 854.835 1050H924.81C963.456 1050 994.785 1020.24 994.785 983.525V977.294C994.785 912.377 994.785 912.377 1079.88 912.377C1149.65 912.377 1149.65 851.764 1149.65 851.764Z" fill="#26FFDF" fill-opacity="0.8"/>
                    </svg>
                </div>
                <h1 style="margin: 0; font-size: 28px; font-weight: bold; color: #26FFDF; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">¡Gracias por contactarnos!</h1>
                <p style="margin: 10px 0 0; font-size: 16px; color: rgba(255,255,255,0.9); opacity: 0.9;">Hemos recibido tu consulta</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
                <div style="background: rgba(8, 166, 150, 0.1); border-left: 4px solid #26FFDF; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                    <h2 style="margin: 0 0 15px; font-size: 20px; color: #26FFDF;">Detalles de tu consulta:</h2>
                    <div style="color: rgba(255,255,255,0.8); line-height: 1.6;">
                        <p style="margin: 8px 0;"><strong style="color: #26FFDF;">Servicio:</strong> ${serviceName}</p>
                        <p style="margin: 8px 0;"><strong style="color: #26FFDF;">Nombre:</strong> ${data.name}</p>
                        <p style="margin: 8px 0;"><strong style="color: #26FFDF;">Email:</strong> ${data.email}</p>
                    </div>
                </div>
                
                <div style="background: rgba(2, 80, 89, 0.3); padding: 25px; border-radius: 12px; margin-bottom: 30px;">
                    <h3 style="margin: 0 0 15px; font-size: 18px; color: #26FFDF;">Tu mensaje:</h3>
                    <p style="margin: 0; color: rgba(255,255,255,0.9); line-height: 1.6; font-style: italic;">
                        "${data.message}"
                    </p>
                </div>
                
                <div style="text-align: center; padding: 20px 0;">
                    <div style="background: linear-gradient(135deg, #025059 0%, #08A696 100%); display: inline-block; padding: 15px 30px; border-radius: 25px; margin-bottom: 20px;">
                        <p style="margin: 0; color: #26FFDF; font-weight: bold; font-size: 16px;">⏱️ Tiempo de respuesta: 24-48 horas</p>
                    </div>
                    <p style="margin: 15px 0; color: rgba(255,255,255,0.8); line-height: 1.6;">
                        Nuestro equipo de expertos revisará tu consulta y te contactará pronto con una propuesta personalizada.
                    </p>
                </div>
            </div>
            
            <!-- Footer -->
            <div style="background: rgba(2, 80, 89, 0.5); padding: 30px; text-align: center; border-top: 1px solid rgba(38, 255, 223, 0.2);">
                <p style="margin: 0 0 10px; color: #26FFDF; font-weight: bold; font-size: 18px;">V1tr0 - Transformando Ideas en Realidad</p>
                <p style="margin: 0; color: rgba(255,255,255,0.7); font-size: 14px;">
                    Desarrollo de Software | Sistemas de Información | Automatización | Gestión de Proyectos
                </p>
                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(38, 255, 223, 0.1);">
                    <p style="margin: 0; color: rgba(255,255,255,0.6); font-size: 12px;">
                        Este es un mensaje automático. Por favor, no respondas a este correo.
                    </p>
                </div>
            </div>
        </div>
    </body>
    </html>
    `
  } else {
    // Plantilla para notificación interna
    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nueva Consulta - V1tr0</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #0a1a1f 0%, #1a2f35 100%); color: #ffffff;">
        <div style="max-width: 600px; margin: 0 auto; background: #0f1f24; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.3);">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #025059 0%, #08A696 100%); padding: 40px 30px; text-align: center;">
                <div style="background: rgba(255,255,255,0.1); border-radius: 50%; width: 80px; height: 80px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                    <svg width="50" height="50" viewBox="0 0 1400 1200" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M1149.65 851.764C1149.65 851.764 1150.51 345.064 1149.54 346.144C1146.15 312.431 1136.62 289.18 1100.25 289.18H1030.27C960.297 289.18 960.297 289.18 960.297 222.706V216.475C960.297 179.762 928.968 150 890.321 150H820.346C781.7 150 750.371 179.762 750.371 216.475V292.296C750.371 329.009 781.7 358.771 820.346 358.771L926.68 361.886C946.909 361.886 959.821 375.907 959.821 395.123C959.821 414.34 946.909 428.361 926.68 428.361L784.859 425.246C645.422 425.246 647.415 425.246 645.422 358.771V352.54C645.422 315.827 614.093 286.065 575.447 286.065H505.472C466.826 286.065 435.497 315.827 435.497 352.54V428.361C435.497 465.074 466.826 494.836 505.472 494.836H824.554C844.782 494.836 861.181 510.414 861.181 529.631C861.181 548.848 844.782 564.426 824.554 564.426H319.975C281.329 564.426 250 594.188 250 630.901V706.722C250 743.435 281.329 773.197 319.975 773.197H389.95C428.597 773.197 459.925 743.435 459.925 706.722V700.491C459.925 634.016 459.925 634.016 529.9 634.016H824.554C844.782 634.016 861.181 649.595 861.181 668.811C861.181 688.028 844.782 703.607 824.554 703.607H585.154C546.507 703.607 515.179 733.368 515.179 770.081V845.902C515.179 882.615 546.507 912.377 585.154 912.377H655.129C693.775 912.377 725.104 882.615 725.104 845.902V839.672C725.104 773.197 725.104 773.197 784.859 773.197L994.785 770.081C1015.01 770.081 1031.41 785.659 1031.41 804.876C1031.41 824.093 1015.01 839.671 994.785 839.671L854.835 841.229C816.188 841.229 784.859 870.991 784.859 907.704V983.525C784.859 1020.24 816.188 1050 854.835 1050H924.81C963.456 1050 994.785 1020.24 994.785 983.525V977.294C994.785 912.377 994.785 912.377 1079.88 912.377C1149.65 912.377 1149.65 851.764 1149.65 851.764Z" fill="#26FFDF" fill-opacity="0.8"/>
                    </svg>
                </div>
                <h1 style="margin: 0; font-size: 28px; font-weight: bold; color: #26FFDF;">🚨 Nueva Consulta Recibida</h1>
                <p style="margin: 10px 0 0; font-size: 16px; color: rgba(255,255,255,0.9);">Formulario Unificado de Contacto</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
                <div style="background: rgba(8, 166, 150, 0.1); border-left: 4px solid #26FFDF; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                    <h2 style="margin: 0 0 20px; font-size: 20px; color: #26FFDF;">📋 Información del Cliente:</h2>
                    <div style="color: rgba(255,255,255,0.9); line-height: 1.8;">
                        <p style="margin: 10px 0; padding: 8px 0; border-bottom: 1px solid rgba(38, 255, 223, 0.1);"><strong style="color: #26FFDF;">👤 Nombre:</strong> ${data.name}</p>
                        <p style="margin: 10px 0; padding: 8px 0; border-bottom: 1px solid rgba(38, 255, 223, 0.1);"><strong style="color: #26FFDF;">📧 Email:</strong> ${data.email}</p>
                        <p style="margin: 10px 0; padding: 8px 0;"><strong style="color: #26FFDF;">🎯 Servicio:</strong> ${serviceName}</p>
                    </div>
                </div>
                
                <div style="background: rgba(2, 80, 89, 0.3); padding: 25px; border-radius: 12px; margin-bottom: 30px;">
                    <h3 style="margin: 0 0 15px; font-size: 18px; color: #26FFDF;">💬 Mensaje del Cliente:</h3>
                    <div style="background: rgba(0,0,0,0.2); padding: 15px; border-radius: 8px; border-left: 3px solid #26FFDF;">
                        <p style="margin: 0; color: rgba(255,255,255,0.9); line-height: 1.6; font-family: monospace;">
                            ${data.message}
                        </p>
                    </div>
                </div>
                
                <div style="background: linear-gradient(135deg, rgba(255, 193, 7, 0.1) 0%, rgba(255, 152, 0, 0.1) 100%); border: 1px solid rgba(255, 193, 7, 0.3); padding: 20px; border-radius: 12px; text-align: center;">
                    <p style="margin: 0; color: #FFC107; font-weight: bold; font-size: 16px;">⚡ Acción Requerida</p>
                    <p style="margin: 10px 0 0; color: rgba(255,255,255,0.8); font-size: 14px;">
                        Responder al cliente en un plazo máximo de 24-48 horas
                    </p>
                </div>
            </div>
            
            <!-- Footer -->
            <div style="background: rgba(2, 80, 89, 0.5); padding: 30px; text-align: center; border-top: 1px solid rgba(38, 255, 223, 0.2);">
                <p style="margin: 0 0 10px; color: #26FFDF; font-weight: bold; font-size: 18px;">V1tr0 - Sistema de Gestión de Consultas</p>
                <p style="margin: 0; color: rgba(255,255,255,0.7); font-size: 14px;">
                    Fecha: ${new Date().toLocaleString('es-ES', { timeZone: 'America/Bogota' })}
                </p>
            </div>
        </div>
    </body>
    </html>
    `
  }
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
        subject: `🚨 Nueva Consulta: ${serviceName} - ${name}`,
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
        subject: '✅ Consulta Recibida - V1tr0 | Nos pondremos en contacto contigo pronto',
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