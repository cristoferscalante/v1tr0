import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()

    // Get current user session
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user profile with role
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.warn('Profile not found, using default data')
    }

    const userWithProfile = {
      id: user.id,
      email: user.email,
      full_name: profileData?.name || user.user_metadata?.full_name || '',
      is_admin: profileData?.role === 'admin',
      is_active: true,
      role: profileData?.role || 'client',
      avatar: profileData?.avatar || user.user_metadata?.avatar_url,
      created_at: user.created_at,
      updated_at: user.updated_at,
    }

    return NextResponse.json({
      user: userWithProfile,
      success: true,
    })

  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}