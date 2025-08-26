// Test específico para getAvailableTimeSlots
const { createClient } = require('@supabase/supabase-js');
const dateFnsTz = require('date-fns-tz');
const { parseISO } = require('date-fns');

const { fromZonedTime, toZonedTime, format } = dateFnsTz;

// Configuración de Supabase
const supabaseUrl = 'https://ykrsxgpaxhtjsuebadnj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrcnN4Z3BheGh0anN1ZWJhZG5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzMzM5MTgsImV4cCI6MjA2MDkwOTkxOH0.QtXlQ8Ikc7s7SzGbW0KJxJEP9Jz_cHMyp6SYw7lSG0E';

const supabase = createClient(supabaseUrl, supabaseKey);

// Función isTimePast copiada de supabase-meetings-db.ts
function isTimePast(date, time) {
  const timeZone = 'America/Bogota';
  const dateTimeString = `${date}T${time}:00`;
  const dateTime = parseISO(dateTimeString);
  const zonedDateTime = toZonedTime(dateTime, timeZone);
  const now = new Date();
  const zonedNow = toZonedTime(now, timeZone);
  return zonedDateTime < zonedNow;
}

// Función getAvailableTimeSlots simplificada
async function getAvailableTimeSlots(date) {
  console.log(`🔍 Procesando fecha: ${date}`);
  
  try {
    // Validar formato de fecha
    if (!date || typeof date !== 'string') {
      throw new Error(`Fecha inválida: ${date}`);
    }
    
    // Verificar que la fecha tenga el formato correcto (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      throw new Error(`Formato de fecha inválido: ${date}. Esperado: YYYY-MM-DD`);
    }
    
    // Verificar que sea una fecha válida
    const parsedDate = new Date(date + 'T00:00:00');
    if (isNaN(parsedDate.getTime())) {
      throw new Error(`Fecha no válida: ${date}`);
    }
    
    // Verificar si es fin de semana
    const dayOfWeek = parsedDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      console.log(`⚠️ ${date} es fin de semana, no hay horarios disponibles`);
      return [];
    }
    
    // Obtener reuniones existentes para esta fecha
    const { data: existingMeetings, error } = await supabase
      .from('meetings')
      .select('time')
      .eq('date', date);
    
    if (error) {
      console.error(`❌ Error consultando reuniones para ${date}:`, error);
      throw error;
    }
    
    console.log(`📅 Reuniones existentes para ${date}:`, existingMeetings?.length || 0);
    
    // Generar horarios disponibles (14:00 a 18:00)
    const availableSlots = [];
    const occupiedTimes = new Set(existingMeetings?.map(m => m.time) || []);
    
    for (let hour = 14; hour < 18; hour++) {
      const time = `${hour.toString().padStart(2, '0')}:00`;
      
      if (!occupiedTimes.has(time) && !isTimePast(date, time)) {
        availableSlots.push({
          time,
          available: true
        });
      }
    }
    
    console.log(`✅ Horarios disponibles para ${date}:`, availableSlots.length);
    return availableSlots;
    
  } catch (error) {
    console.error(`❌ Error procesando fecha ${date}:`, error.message);
    throw error;
  }
}

async function testAvailableSlots() {
  console.log('🔍 Probando getAvailableTimeSlots...');
  
  // Fechas de prueba (las mismas que usa el frontend)
  const testDates = [
    '2025-01-16',
    '2025-01-17',
    '2025-01-20',
    '2025-01-21',
    '2025-01-22'
  ];
  
  try {
    console.log('📋 Fechas a procesar:', testDates);
    
    // Procesar cada fecha individualmente
    for (const date of testDates) {
      try {
        const slots = await getAvailableTimeSlots(date);
        console.log(`✅ ${date}: ${slots.length} horarios disponibles`);
      } catch (error) {
        console.error(`❌ Error en fecha ${date}:`, error.message);
        return false;
      }
    }
    
    // Procesar todas las fechas en paralelo (como hace la API)
    console.log('\n🔄 Procesando todas las fechas en paralelo...');
    const results = await Promise.all(
      testDates.map(date => getAvailableTimeSlots(date))
    );
    
    console.log('✅ Procesamiento en paralelo exitoso');
    results.forEach((slots, index) => {
      console.log(`📅 ${testDates[index]}: ${slots.length} horarios`);
    });
    
    return true;
    
  } catch (error) {
    console.error('❌ Error en testAvailableSlots:', error);
    return false;
  }
}

// Ejecutar el test
testAvailableSlots()
  .then(success => {
    if (success) {
      console.log('\n🎉 Test de getAvailableTimeSlots exitoso');
    } else {
      console.log('\n💥 Falló el test de getAvailableTimeSlots');
    }
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('💥 Error ejecutando test:', error);
    process.exit(1);
  });