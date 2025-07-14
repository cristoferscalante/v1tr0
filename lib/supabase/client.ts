import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Only create client if we have the environment variables
// This prevents build errors when variables are not available
let supabaseClient: ReturnType<typeof createClient> | null = null

if (supabaseUrl && supabaseAnonKey) {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  })
}

// Export the client, throw error if not initialized when used
export const supabase = supabaseClient!

// Utility function to get client safely
export const getSupabaseClient = () => {
  if (!supabaseClient) {
    throw new Error('Supabase client not initialized. Make sure environment variables are set.')
  }
  return supabaseClient
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
