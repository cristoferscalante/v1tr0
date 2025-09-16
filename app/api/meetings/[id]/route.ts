import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET - Get meeting by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const meetingId = parseInt(id)

    if (isNaN(meetingId)) {
      return NextResponse.json(
        { error: 'Invalid meeting ID' },
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

    // Get meeting with project info for access control
    const { data: meeting, error } = await supabase
      .from('meetings')
      .select(`
        *,
        project:project_id(id, client_id, title),
        transcriptions(*)
      `)
      .eq('id', meetingId)
      .single()

    if (error || !meeting) {
      return NextResponse.json(
        { error: 'Meeting not found' },
        { status: 404 }
      )
    }

    // Check access rights
    const { data: profileData } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const isAdmin = profileData?.role === 'admin'
    const isClient = meeting.project?.client_id === user.id

    if (!isAdmin && !isClient) {
      return NextResponse.json(
        { error: 'Access denied to meeting' },
        { status: 403 }
      )
    }

    return NextResponse.json(meeting)

  } catch (error) {
    console.error('Get meeting error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Update meeting
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const meetingId = parseInt(id)
    const updates = await request.json()

    if (isNaN(meetingId)) {
      return NextResponse.json(
        { error: 'Invalid meeting ID' },
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

    // Check meeting exists and user has access
    const { data: meeting, error: meetingError } = await supabase
      .from('meetings')
      .select(`
        id,
        project:project_id(client_id)
      `)
      .eq('id', meetingId)
      .single()

    if (meetingError || !meeting) {
      return NextResponse.json(
        { error: 'Meeting not found' },
        { status: 404 }
      )
    }

    // Get user role
    const { data: profileData } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const isAdmin = profileData?.role === 'admin'
    const isClient = meeting.project?.client_id === user.id

    if (!isAdmin && !isClient) {
      return NextResponse.json(
        { error: 'Access denied to meeting' },
        { status: 403 }
      )
    }

    // Filter allowed fields
    const allowedFields = ['title', 'description', 'start_time', 'end_time', 'status']
    const filteredUpdates = Object.keys(updates)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key]
        return obj
      }, {} as any)

    if (Object.keys(filteredUpdates).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      )
    }

    // Update meeting
    const { data: updatedMeeting, error: updateError } = await supabase
      .from('meetings')
      .update({
        ...filteredUpdates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', meetingId)
      .select(`
        *,
        project:project_id(id, client_id, title)
      `)
      .single()

    if (updateError) {
      console.error('Database error:', updateError)
      return NextResponse.json(
        { error: 'Failed to update meeting' },
        { status: 500 }
      )
    }

    return NextResponse.json(updatedMeeting)

  } catch (error) {
    console.error('Update meeting error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}