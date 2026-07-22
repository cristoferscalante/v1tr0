import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

function createSupabaseClient() {
  if (typeof window !== 'undefined' && (!supabaseUrl || !supabaseAnonKey)) {
    console.warn('[Supabase] Variables de entorno faltantes')
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signOut: async () => {},
        signInWithOAuth: async () => ({ data: null, error: new Error('Supabase no configurado') }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({ data: null, error: null }),
            order: () => ({ data: [], error: null }),
          }),
          order: () => ({ data: [], error: null }),
        }),
        insert: async () => ({ data: null, error: new Error('Supabase no configurado') }),
        update: async () => ({ data: null, error: new Error('Supabase no configurado') }),
        delete: async () => ({ data: null, error: new Error('Supabase no configurado') }),
      }),
      channel: () => ({
        on: () => ({ subscribe: () => {} }),
        subscribe: () => {},
      }),
    } as any
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storage: typeof window !== 'undefined' ? window.localStorage : undefined
    }
  })
}

export const supabase = createSupabaseClient()

export type ProfileRole = 'client' | 'admin' | 'team'

export interface User {
  id: string
  email: string
  name?: string
  avatar?: string
  role: ProfileRole
  created_at: string
  updated_at: string
}

export interface AuthUser {
  id: string
  email: string
  name?: string
  avatar?: string
  role: ProfileRole
}
