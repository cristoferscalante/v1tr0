import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Create standard Supabase client for better session persistence
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined
  }
})

// Utility function to get client safely
export const getSupabaseClient = () => {
  return supabase
}

// Types for authentication
export interface User {
  id: string
  email: string
  name?: string
  avatar?: string
  role: 'admin' | 'user'
  created_at: string
  updated_at: string
}

export interface AuthUser {
  id: string
  email: string
  name?: string
  avatar?: string
  role: 'admin' | 'user'
}
