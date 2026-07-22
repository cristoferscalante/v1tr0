// Edge Function: create-user-profile
// Descripción: Se ejecuta automáticamente cuando un usuario se registra en auth.users
// Crea el perfil en la tabla profiles con role='client' y email

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WebhookPayload {
  type: 'INSERT' | 'UPDATE' | 'DELETE'
  table: string
  record: {
    id: string
    email: string
    raw_user_meta_data?: {
      name?: string
      full_name?: string
      avatar_url?: string
    }
  }
  schema: string
  old_record: null | Record<string, unknown>
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Verificar que es un POST request
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Parsear el payload del webhook
    const payload: WebhookPayload = await req.json()
    
    console.log('📥 Webhook recibido:', {
      type: payload.type,
      table: payload.table,
      userId: payload.record?.id,
      email: payload.record?.email
    })

    // Solo procesar eventos INSERT en auth.users
    if (payload.type !== 'INSERT' || payload.table !== 'users') {
      console.log('⚠️ Evento ignorado (no es INSERT en users)')
      return new Response(
        JSON.stringify({ message: 'Event ignored' }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const { id, email, raw_user_meta_data } = payload.record

    // Validar datos requeridos
    if (!id || !email) {
      console.error('❌ Faltan datos requeridos:', { id, email })
      return new Response(
        JSON.stringify({ error: 'Missing required fields: id or email' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Extraer nombre del usuario
    const userName = 
      raw_user_meta_data?.name ||
      raw_user_meta_data?.full_name ||
      email.split('@')[0] ||
      'Usuario'

    const avatarUrl = raw_user_meta_data?.avatar_url || null

    console.log('👤 Creando perfil para:', {
      id,
      email,
      name: userName,
      role: 'client'
    })

    // Crear cliente de Supabase con credenciales de servicio
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Insertar perfil en la tabla profiles
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: id,
        email: email,
        name: userName,
        role: 'client',
        avatar: avatarUrl,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      // Si el error es porque ya existe (por ejemplo, creado por login fallback), ignorarlo
      if (error.code === '23505') {
        console.log('✅ Perfil ya existe, actualizando...')
        
        const { error: updateError } = await supabaseAdmin
          .from('profiles')
          .update({
            email: email,
            name: userName,
            avatar: avatarUrl,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)

        if (updateError) {
          console.error('❌ Error al actualizar perfil:', updateError)
          throw updateError
        }

        return new Response(
          JSON.stringify({ 
            message: 'Profile updated successfully',
            userId: id 
          }),
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      console.error('❌ Error al crear perfil:', error)
      throw error
    }

    console.log('✅ Perfil creado exitosamente:', data)

    return new Response(
      JSON.stringify({ 
        message: 'Profile created successfully',
        profile: data 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('💥 Error en webhook:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        details: error.toString()
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
