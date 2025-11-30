/**
 * Script para actualizar tokens de Google desde OAuth Playground
 * 
 * Copia los tokens del OAuth Playground y pégalos aquí
 */

// Load environment variables
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');

// Pega aquí los tokens del OAuth Playground
// IMPORTANTE: No commitear tokens reales - usar solo localmente
const NEW_ACCESS_TOKEN = process.env.GOOGLE_ACCESS_TOKEN || "PASTE_ACCESS_TOKEN_HERE";
const NEW_REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN || "PASTE_REFRESH_TOKEN_HERE";

// Función para actualizar .env.local
function updateEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local');
  
  try {
    let envContent = fs.readFileSync(envPath, 'utf-8');
    
    // Actualizar access token
    envContent = envContent.replace(
      /GOOGLE_ACCESS_TOKEN=.*/,
      `GOOGLE_ACCESS_TOKEN=${NEW_ACCESS_TOKEN}`
    );
    
    // Actualizar refresh token  
    envContent = envContent.replace(
      /GOOGLE_REFRESH_TOKEN=.*/,
      `GOOGLE_REFRESH_TOKEN=${NEW_REFRESH_TOKEN}`
    );
    
    // Escribir archivo actualizado
    fs.writeFileSync(envPath, envContent);
    
    console.log('✅ Tokens actualizados en .env.local');
    console.log('📋 Nuevos tokens:');
    console.log(`   ACCESS_TOKEN: ${NEW_ACCESS_TOKEN.substring(0, 50)}...`);
    console.log(`   REFRESH_TOKEN: ${NEW_REFRESH_TOKEN.substring(0, 50)}...`);
    console.log('\n🔄 Reinicia el servidor para que los cambios tomen efecto:');
    console.log('   npm run dev');
    
  } catch (error) {
    console.error('❌ Error actualizando tokens:', error.message);
  }
}

// Verificar que los tokens no estén vacíos
if (!NEW_ACCESS_TOKEN || NEW_ACCESS_TOKEN === "PASTE_ACCESS_TOKEN_HERE") {
  console.error('❌ Por favor, actualiza NEW_ACCESS_TOKEN con el token del OAuth Playground');
  process.exit(1);
}

if (!NEW_REFRESH_TOKEN || NEW_REFRESH_TOKEN === "PASTE_REFRESH_TOKEN_HERE") {
  console.error('❌ Por favor, actualiza NEW_REFRESH_TOKEN con el token del OAuth Playground');
  process.exit(1);
}

console.log('🔧 Actualizando tokens de Google...\n');
updateEnvFile();
