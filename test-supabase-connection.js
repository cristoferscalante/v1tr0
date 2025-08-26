// Test de conexión a Supabase
const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase (mismas variables que en el .env.local)
const supabaseUrl = 'https://ykrsxgpaxhtjsuebadnj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrcnN4Z3BheGh0anN1ZWJhZG5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzMzM5MTgsImV4cCI6MjA2MDkwOTkxOH0.QtXlQ8Ikc7s7SzGbW0KJxJEP9Jz_cHMyp6SYw7lSG0E';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabaseConnection() {
  console.log('🔍 Probando conexión a Supabase...');
  
  try {
    // Test 1: Verificar conexión básica
    const { data, error } = await supabase
      .from('meetings')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Error de conexión a Supabase:', error);
      return false;
    }
    
    console.log('✅ Conexión a Supabase exitosa');
    console.log('📊 Número de reuniones en la base de datos:', data);
    
    // Test 2: Verificar estructura de tabla meetings
    const { data: meetings, error: meetingsError } = await supabase
      .from('meetings')
      .select('*')
      .limit(1);
    
    if (meetingsError) {
      console.error('❌ Error consultando tabla meetings:', meetingsError);
      return false;
    }
    
    console.log('✅ Tabla meetings accesible');
    if (meetings && meetings.length > 0) {
      console.log('📋 Estructura de una reunión:', Object.keys(meetings[0]));
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Error inesperado:', error);
    return false;
  }
}

// Ejecutar el test
testSupabaseConnection()
  .then(success => {
    if (success) {
      console.log('🎉 Todos los tests de Supabase pasaron');
    } else {
      console.log('💥 Falló el test de Supabase');
    }
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('💥 Error ejecutando test:', error);
    process.exit(1);
  });