import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST - Leave meeting
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

    // Get user profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('role, name')
      .eq('id', user.id)
      .single()

    // Update participant status to left
    const { error: participantError } = await supabase
      .from('meeting_participants')
      .update({
        left_at: new Date().toISOString(),
        status: 'left',
        updated_at: new Date().toISOString(),
      })
      .eq('meeting_id', meetingId)
      .eq('user_id', user.id)

    if (participantError) {
      console.error('Failed to update participant status:', participantError)
      // Don't fail the request if participant tracking fails
    }

    // Check if this was the last active participant
    const { data: activeParticipants } = await supabase
      .from('meeting_participants')
      .select('id')
      .eq('meeting_id', meetingId)
      .eq('status', 'active')

    // If no active participants left, consider ending the meeting
    if (!activeParticipants || activeParticipants.length === 0) {
      await supabase
        .from('meetings')
        .update({ 
          status: 'completed',
          end_time: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', meetingId)
    }

    // TODO: Here you would integrate with video conferencing service to remove participant
    // For now, return success

    return NextResponse.json({
      success: true,
      message: 'Successfully left meeting',
      meeting: {
        id: meeting.id,
        title: meeting.title,
        project: meeting.project,
      },
      user_name: profileData?.name || user.email,
    })

  } catch (error) {
    console.error('Leave meeting error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}