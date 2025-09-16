import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { email, full_name, password, is_admin = false } = await request.json()

    if (!email || !full_name || !password) {
      return NextResponse.json(
        { error: 'Email, full name, and password are required' },
        { status: 400 }
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Basic password validation
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Create user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
        }
      }
    })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    // If user was created, create profile
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          name: full_name,
          email: email,
          role: is_admin ? 'admin' : 'client',
          avatar: data.user.user_metadata?.avatar_url || null,
        })

      if (profileError) {
        console.error('Profile creation error:', profileError)
        // Don't fail the registration if profile creation fails
      }
    }

    const userResponse = {
      id: data.user?.id,
      email: data.user?.email,
      full_name,
      is_admin,
      is_active: true,
      role: is_admin ? 'admin' : 'client',
      created_at: data.user?.created_at,
    }

    return NextResponse.json({
      user: userResponse,
      session: data.session,
      success: true,
      message: 'User registered successfully. Please check your email for verification.',
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}