// Script para verificar si el usuario existe en Supabase auth.users
const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase con service role key para acceso administrativo
const supabaseUrl = 'https://ykrsxgpaxhtjsuebadnj.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrcnN4Z3BheGh0anN1ZWJhZG5qIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTMzMzkxOCwiZXhwIjoyMDYwOTA5OTE4fQ.Cjrz0MzqbE8WMRyAjDRcx7N3FILeF8wKzJhL-SwLN1k';

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function checkUserExists() {
  console.log('🔍 VERIFICANDO USUARIO: cristoferescalante@gmail.com');
  
  try {
    // Verificar si el usuario existe en auth.users
    const { data: users, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      console.error('❌ ERROR al obtener usuarios:', error.message);
      return false;
    }
    
    console.log(`📊 TOTAL DE USUARIOS ENCONTRADOS: ${users.users.length}`);
    
    // Buscar el usuario específico
    const targetUser = users.users.find(user => user.email === 'cristoferescalante@gmail.com');
    
    if (targetUser) {
      console.log('✅ USUARIO ENCONTRADO:');
      console.log('   - ID:', targetUser.id);
      console.log('   - Email:', targetUser.email);
      console.log('   - Confirmado:', targetUser.email_confirmed_at ? 'SÍ' : 'NO');
      console.log('   - Creado:', targetUser.created_at);
      console.log('   - Último login:', targetUser.last_sign_in_at || 'NUNCA');
      return true;
    } else {
      console.log('❌ USUARIO NO ENCONTRADO en la base de datos');
      console.log('📋 USUARIOS EXISTENTES:');
      users.users.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.email} (ID: ${user.id})`);
      });
      return false;
    }
    
  } catch (err) {
    console.error('💥 ERROR INESPERADO:', err.message);
    return false;
  }
}

async function createUser() {
  console.log('\n🔧 CREANDO USUARIO: cristoferescalante@gmail.com');
  
  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email: 'cristoferescalante@gmail.com',
      password: 'Xpcnt7938',
      email_confirm: true
    });
    
    if (error) {
      console.error('❌ ERROR al crear usuario:', error.message);
      return false;
    }
    
    console.log('✅ USUARIO CREADO EXITOSAMENTE:');
    console.log('   - ID:', data.user.id);
    console.log('   - Email:', data.user.email);
    return true;
    
  } catch (err) {
    console.error('💥 ERROR INESPERADO al crear usuario:', err.message);
    return false;
  }
}

async function main() {
  console.log('🚀 INICIANDO VERIFICACIÓN DE USUARIO...\n');
  
  const userExists = await checkUserExists();
  
  if (!userExists) {
    console.log('\n🔄 El usuario no existe, procediendo a crearlo...');
    const created = await createUser();
    
    if (created) {
      console.log('\n🔍 VERIFICANDO USUARIO RECIÉN CREADO...');
      await checkUserExists();
    }
  }
  
  console.log('\n✨ VERIFICACIÓN COMPLETADA');
}

main().catch(console.error);