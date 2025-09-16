import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET - Get all projects for current user
export async function GET() {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user role
    const { data: profileData } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const isAdmin = profileData?.role === 'admin'

    // Build query based on user role
    let query = supabase
      .from('projects')
      .select(`
        *,
        client:client_id(id, name, email),
        meetings(count)
      `)

    // If not admin, only show projects where user is the client
    if (!isAdmin) {
      query = query.eq('client_id', user.id)
    }

    const { data: projects, error } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch projects' },
        { status: 500 }
      )
    }

    return NextResponse.json(projects || [])

  } catch (error) {
    console.error('Get projects error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create new project
export async function POST(request: NextRequest) {
  try {
    const { title, description, client_id } = await request.json()

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user role
    const { data: profileData } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const isAdmin = profileData?.role === 'admin'

    // Determine client_id
    let finalClientId = client_id
    if (!isAdmin) {
      // Non-admin users can only create projects for themselves
      finalClientId = user.id
    } else if (!client_id) {
      return NextResponse.json(
        { error: 'Client ID is required for admin users' },
        { status: 400 }
      )
    }

    // Create project
    const { data: project, error } = await supabase
      .from('projects')
      .insert({
        title,
        description,
        client_id: finalClientId,
        created_by: user.id,
        status: 'active',
      })
      .select(`
        *,
        client:client_id(id, name, email)
      `)
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to create project' },
        { status: 500 }
      )
    }

    return NextResponse.json(project, { status: 201 })

  } catch (error) {
    console.error('Create project error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}