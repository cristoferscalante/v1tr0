import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST - Join meeting
export async function POST(
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
        project:project_id(id, client_id, title)
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
      .select('role, name')
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

    // Check if meeting is in the future or currently active
    const now = new Date()
    const meetingStart = new Date(meeting.start_time)
    const meetingEnd = meeting.end_time ? new Date(meeting.end_time) : new Date(meetingStart.getTime() + 60 * 60 * 1000) // Default 1 hour

    if (now < meetingStart) {
      return NextResponse.json(
        { error: 'Meeting has not started yet' },
        { status: 400 }
      )
    }

    if (now > meetingEnd) {
      return NextResponse.json(
        { error: 'Meeting has already ended' },
        { status: 400 }
      )
    }

    // Check if user is already in the meeting
    const { data: existingParticipant } = await supabase
      .from('meeting_participants')
      .select('id')
      .eq('meeting_id', meetingId)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single()

    if (existingParticipant) {
      return NextResponse.json({
        success: true,
        message: 'Already joined meeting',
        meeting_url: meeting.meeting_url || `/meetings/${meetingId}`,
      })
    }

    // Add user as participant
    const { error: participantError } = await supabase
      .from('meeting_participants')
      .insert({
        meeting_id: meetingId,
        user_id: user.id,
        joined_at: new Date().toISOString(),
        status: 'active',
      })

    if (participantError) {
      console.error('Failed to add participant:', participantError)
      // Don't fail the request if participant tracking fails
    }

    // Update meeting status to active if not already
    if (meeting.status !== 'active') {
      await supabase
        .from('meetings')
        .update({ 
          status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('id', meetingId)
    }

    // TODO: Here you would integrate with video conferencing service (Jitsi, Zoom, etc.)
    // For now, return success with meeting information

    return NextResponse.json({
      success: true,
      message: 'Successfully joined meeting',
      meeting: {
        id: meeting.id,
        title: meeting.title,
        project: meeting.project,
        start_time: meeting.start_time,
        meeting_url: meeting.meeting_url || `/meetings/${meetingId}`,
      },
      user_name: profileData?.name || user.email,
    })

  } catch (error) {
    console.error('Join meeting error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}