import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Authenticate user
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      )
    }

    // Get user profile with role
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single()

    if (profileError) {
      console.warn('Profile not found, using default role')
    }

    const userWithProfile = {
      id: data.user.id,
      email: data.user.email,
      full_name: profileData?.name || data.user.user_metadata?.full_name || '',
      is_admin: profileData?.role === 'admin',
      is_active: true,
      role: profileData?.role || 'client',
      avatar: profileData?.avatar || data.user.user_metadata?.avatar_url,
      created_at: data.user.created_at,
    }

    return NextResponse.json({
      user: userWithProfile,
      session: data.session,
      success: true,
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}