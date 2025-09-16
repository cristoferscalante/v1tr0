import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST - Upload audio file for transcription
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ meetingId: string }> }
) {
  try {
    const { meetingId } = await params
    const meetingIdNum = parseInt(meetingId)

    if (isNaN(meetingIdNum)) {
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

    // Check if user has access to the meeting
    const { data: meeting, error: meetingError } = await supabase
      .from('meetings')
      .select('id, project_id, projects(client_id)')
      .eq('id', meetingIdNum)
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
    const isClient = meeting.projects?.client_id === user.id

    if (!isAdmin && !isClient) {
      return NextResponse.json(
        { error: 'Access denied to meeting' },
        { status: 403 }
      )
    }

    // Parse form data
    const formData = await request.formData()
    const audioFile = formData.get('audio_file') as File

    if (!audioFile) {
      return NextResponse.json(
        { error: 'Audio file is required' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = [
      'audio/wav',
      'audio/mp3',
      'audio/mpeg',
      'audio/mp4',
      'audio/m4a',
      'audio/webm',
      'audio/ogg'
    ]

    if (!allowedTypes.includes(audioFile.type)) {
      return NextResponse.json(
        { error: 'Invalid audio file type' },
        { status: 400 }
      )
    }

    // Check file size (50MB limit)
    const maxSize = 50 * 1024 * 1024 // 50MB
    if (audioFile.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum 50MB allowed.' },
        { status: 400 }
      )
    }

    // Generate unique filename
    const timestamp = Date.now()
    const fileExtension = audioFile.name.split('.').pop() || 'wav'
    const filename = `meeting-${meetingIdNum}-${timestamp}.${fileExtension}`

    // Convert file to buffer
    const bytes = await audioFile.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('audio-files')
      .upload(filename, buffer, {
        contentType: audioFile.type,
      })

    if (uploadError) {
      console.error('File upload error:', uploadError)
      return NextResponse.json(
        { error: 'Failed to upload audio file' },
        { status: 500 }
      )
    }

    // Create transcription record
    const { data: transcription, error: transcriptionError } = await supabase
      .from('transcriptions')
      .insert({
        meeting_id: meetingIdNum,
        filename: filename,
        file_path: uploadData.path,
        file_size: audioFile.size,
        file_type: audioFile.type,
        status: 'pending',
        uploaded_by: user.id,
      })
      .select('*')
      .single()

    if (transcriptionError) {
      console.error('Database error:', transcriptionError)
      // Try to clean up uploaded file
      await supabase.storage.from('audio-files').remove([filename])
      return NextResponse.json(
        { error: 'Failed to create transcription record' },
        { status: 500 }
      )
    }

    // TODO: Here you would trigger the actual transcription service
    // For now, we'll just return success with pending status

    return NextResponse.json({
      success: true,
      transcription,
      message: 'Audio file uploaded successfully. Transcription will begin processing.',
    }, { status: 201 })

  } catch (error) {
    console.error('Upload audio error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}