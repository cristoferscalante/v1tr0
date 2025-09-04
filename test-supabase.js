// Test de conexión a Supabase
// Ejecutar: node test-supabase.js

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🔍 Probando conexión a Supabase...')
console.log('URL:', supabaseUrl)
console.log('Anon Key existe:', !!supabaseAnonKey)

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variables de entorno de Supabase no encontradas')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  try {
    // Test 1: Verificar conexión básica
    console.log('\n📡 Test 1: Verificando conexión básica...')
    const { data, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('❌ Error en getSession:', error.message)
    } else {
      console.log('✅ Conexión establecida')
      console.log('Sesión actual:', data.session ? 'Existe' : 'No existe')
    }

    // Test 2: Verificar tabla profiles
    console.log('\n🗄️  Test 2: Verificando acceso a tabla profiles...')
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email, role')
      .limit(5)

    if (profilesError) {
      console.error('❌ Error accediendo a profiles:', profilesError.message)
    } else {
      console.log('✅ Tabla profiles accesible')
      console.log('Usuarios encontrados:', profiles.length)
      if (profiles.length > 0) {
        console.log('Primeros usuarios:', profiles.map(p => ({ id: p.id, email: p.email, role: p.role })))
      }
    }

    // Test 3: Verificar tabla auth.users (solo lectura con service role)
    console.log('\n👥 Test 3: Verificando usuarios en auth...')
    // Este test requiere service role key, que no deberíamos usar desde el cliente
    console.log('⚠️  Para verificar usuarios en auth.users se necesita service role key (solo servidor)')

  } catch (error) {
    console.error('❌ Error general:', error.message)
  }
}

testConnection()
