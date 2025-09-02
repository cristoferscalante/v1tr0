import nodemailer from 'nodemailer';
import net from 'net';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: {
      SMTP_HOST: process.env.SMTP_HOST,
      SMTP_PORT: process.env.SMTP_PORT,
      SMTP_USER: process.env.SMTP_USER,
      SMTP_SECURE: process.env.SMTP_SECURE,
      SMTP_TLS: process.env.SMTP_TLS,
      SMTP_FROM: process.env.SMTP_FROM
    },
    tests: []
  };



  // Test 1: Verificar conectividad básica al servidor
  try {

    const isConnectable = await testServerConnectivity(
      process.env.SMTP_HOST, 
      parseInt(process.env.SMTP_PORT)
    );
    
    diagnostics.tests.push({
      name: 'Conectividad del servidor',
      status: isConnectable ? 'PASS' : 'FAIL',
      details: isConnectable ? 'Servidor accesible' : 'No se puede conectar al servidor'
    });
    

  } catch (error) {

    diagnostics.tests.push({
      name: 'Conectividad del servidor',
      status: 'ERROR',
      details: error.message
    });
  }

  // Test 2: Configuración SSL/TLS para puerto 465
  try {

    const config465 = {
      host: process.env.SMTP_HOST,
      port: 465,
      secure: true, // SSL
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      debug: true,
      logger: true
    };

    const transporter465 = nodemailer.createTransport(config465);
    const verify465 = await transporter465.verify();
    
    diagnostics.tests.push({
      name: 'Configuración SSL Puerto 465',
      status: verify465 ? 'PASS' : 'FAIL',
      details: 'Autenticación SSL exitosa en puerto 465'
    });
    

  } catch (error) {

    diagnostics.tests.push({
      name: 'Configuración SSL Puerto 465',
      status: 'FAIL',
      details: `Error: ${error.message}`
    });
  }

  // Test 3: Configuración STARTTLS para puerto 587
  try {

    const config587 = {
      host: process.env.SMTP_HOST,
      port: 587,
      secure: false, // STARTTLS
      requireTLS: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      debug: true,
      logger: true
    };

    const transporter587 = nodemailer.createTransport(config587);
    const verify587 = await transporter587.verify();
    
    diagnostics.tests.push({
      name: 'Configuración STARTTLS Puerto 587',
      status: verify587 ? 'PASS' : 'FAIL',
      details: 'Autenticación STARTTLS exitosa en puerto 587'
    });
    

  } catch (error) {

    diagnostics.tests.push({
      name: 'Configuración STARTTLS Puerto 587',
      status: 'FAIL',
      details: `Error: ${error.message}`
    });
  }

  // Test 4: Configuración actual del proyecto
  try {

    const currentConfig = {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      requireTLS: process.env.SMTP_TLS === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      debug: true,
      logger: true
    };


    
    const currentTransporter = nodemailer.createTransport(currentConfig);
    const verifyCurrent = await currentTransporter.verify();
    
    diagnostics.tests.push({
      name: 'Configuración actual del proyecto',
      status: verifyCurrent ? 'PASS' : 'FAIL',
      details: 'Autenticación exitosa con configuración actual',
      config: currentConfig
    });
    

  } catch (error) {

    diagnostics.tests.push({
      name: 'Configuración actual del proyecto',
      status: 'FAIL',
      details: `Error: ${error.message}`,
      errorCode: error.code,
      errorResponse: error.response
    });
  }

  // Test 5: Envío de correo de prueba si alguna configuración funciona
  const successfulTest = diagnostics.tests.find(test => test.status === 'PASS' && test.name.includes('Configuración'));
  
  if (successfulTest) {
    try {

      
      let testConfig;
      if (successfulTest.name.includes('465')) {
        testConfig = {
          host: process.env.SMTP_HOST,
          port: 465,
          secure: true,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        };
      } else if (successfulTest.name.includes('587')) {
        testConfig = {
          host: process.env.SMTP_HOST,
          port: 587,
          secure: false,
          requireTLS: true,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        };
      } else {
        testConfig = {
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT),
          secure: process.env.SMTP_SECURE === 'true',
          requireTLS: process.env.SMTP_TLS === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        };
      }

      const testTransporter = nodemailer.createTransport(testConfig);
      
      const mailOptions = {
        from: process.env.SMTP_FROM,
        to: 'cristoferscalante@gmail.com',
        subject: '✅ Diagnóstico SMTP - Correo de Prueba Exitoso',
        html: `
          <h2>🎉 ¡Diagnóstico SMTP Exitoso!</h2>
          <p>Este correo confirma que la configuración SMTP está funcionando correctamente.</p>
          <p><strong>Configuración utilizada:</strong></p>
          <pre>${JSON.stringify(testConfig, null, 2)}</pre>
          <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
          <hr>
          <p><em>Correo enviado desde el sistema de diagnóstico V1TR0</em></p>
        `
      };

      const result = await testTransporter.sendMail(mailOptions);
      
      diagnostics.tests.push({
        name: 'Envío de correo de prueba',
        status: 'PASS',
        details: 'Correo enviado exitosamente',
        messageId: result.messageId,
        configUsed: testConfig
      });
      

    } catch (error) {

      diagnostics.tests.push({
        name: 'Envío de correo de prueba',
        status: 'FAIL',
        details: `Error: ${error.message}`
      });
    }
  } else {
    diagnostics.tests.push({
      name: 'Envío de correo de prueba',
      status: 'SKIP',
      details: 'No se pudo realizar porque ninguna configuración SMTP funcionó'
    });
  }

  // Resumen final
  const passedTests = diagnostics.tests.filter(test => test.status === 'PASS').length;
  const totalTests = diagnostics.tests.length;
  

  
  diagnostics.summary = {
    totalTests,
    passedTests,
    failedTests: diagnostics.tests.filter(test => test.status === 'FAIL').length,
    skippedTests: diagnostics.tests.filter(test => test.status === 'SKIP').length,
    overallStatus: passedTests > 0 ? 'PARTIAL_SUCCESS' : 'FAILED'
  };

  // Recomendaciones
  diagnostics.recommendations = [];
  
  if (diagnostics.tests.find(test => test.name.includes('465') && test.status === 'PASS')) {
    diagnostics.recommendations.push('✅ Usar puerto 465 con SSL (secure: true)');
  }
  
  if (diagnostics.tests.find(test => test.name.includes('587') && test.status === 'PASS')) {
    diagnostics.recommendations.push('✅ Usar puerto 587 con STARTTLS (secure: false, requireTLS: true)');
  }
  
  if (passedTests === 0) {
    diagnostics.recommendations.push('❌ Verificar credenciales SMTP con el proveedor');
    diagnostics.recommendations.push('❌ Confirmar que el dominio está configurado correctamente');
    diagnostics.recommendations.push('❌ Revisar configuración de firewall/proxy');
  }

  return res.status(200).json(diagnostics);
}

// Función auxiliar para probar conectividad básica
function testServerConnectivity(host, port) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    const timeout = 5000;

    socket.setTimeout(timeout);
    socket.on('connect', () => {
      socket.destroy();
      resolve(true);
    });

    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });

    socket.on('error', () => {
      resolve(false);
    });

    socket.connect(port, host);
  });
}