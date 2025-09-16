import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST - Regenerate summary for transcription
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const transcriptionId = parseInt(id)

    if (isNaN(transcriptionId)) {
      return NextResponse.json(
        { error: 'Invalid transcription ID' },
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

    // Get transcription with meeting and project info for access control
    const { data: transcription, error } = await supabase
      .from('transcriptions')
      .select(`
        *,
        meeting:meeting_id(
          id,
          project_id,
          project:project_id(client_id)
        )
      `)
      .eq('id', transcriptionId)
      .single()

    if (error || !transcription) {
      return NextResponse.json(
        { error: 'Transcription not found' },
        { status: 404 }
      )
    }

    // Check if transcription is completed
    if (transcription.status !== 'completed') {
      return NextResponse.json(
        { error: 'Transcription must be completed before regenerating summary' },
        { status: 400 }
      )
    }

    // Check if transcript text exists
    if (!transcription.transcript_text) {
      return NextResponse.json(
        { error: 'No transcript text available for summary generation' },
        { status: 400 }
      )
    }

    // Check access rights
    const { data: profileData } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const isAdmin = profileData?.role === 'admin'
    const isClient = transcription.meeting?.project?.client_id === user.id

    if (!isAdmin && !isClient) {
      return NextResponse.json(
        { error: 'Access denied to transcription' },
        { status: 403 }
      )
    }

    // Update status to processing
    await supabase
      .from('transcriptions')
      .update({ 
        summary_status: 'processing',
        updated_at: new Date().toISOString()
      })
      .eq('id', transcriptionId)

    // TODO: Here you would integrate with an AI service to generate summary
    // For now, we'll create a simple mock summary based on the transcript
    
    // Mock summary generation (replace with actual AI service)
    const mockSummary = generateMockSummary(transcript)
    const mockKeyPoints = extractMockKeyPoints(transcript)
    const mockCommitments = extractMockCommitments(transcript)
    const mockNextSteps = extractMockNextSteps(transcript)

    // Update transcription with new summary
    const { data: updatedTranscription, error: updateError } = await supabase
      .from('transcriptions')
      .update({
        summary: mockSummary,
        key_points: mockKeyPoints,
        commitments: mockCommitments,
        next_steps: mockNextSteps,
        summary_status: 'completed',
        summary_generated_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', transcriptionId)
      .select('*')
      .single()

    if (updateError) {
      console.error('Update error:', updateError)
      return NextResponse.json(
        { error: 'Failed to update transcription with new summary' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      transcription: updatedTranscription,
      message: 'Summary regenerated successfully',
    })

  } catch (error) {
    console.error('Regenerate summary error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper functions for mock summary generation
function generateMockSummary(transcript: string): string {
  const sentences = transcript.split('.').filter(s => s.trim().length > 0)
  const firstThird = sentences.slice(0, Math.ceil(sentences.length / 3))
  return firstThird.slice(0, 3).join('.') + '.'
}

function extractMockKeyPoints(transcript: string): string[] {
  const words = transcript.toLowerCase()
  const keyPoints = []
  
  if (words.includes('important') || words.includes('key')) {
    keyPoints.push('Important discussion points were covered')
  }
  if (words.includes('decision') || words.includes('decide')) {
    keyPoints.push('Key decisions were made during the meeting')
  }
  if (words.includes('timeline') || words.includes('deadline')) {
    keyPoints.push('Timeline and deadlines were discussed')
  }
  if (words.includes('budget') || words.includes('cost')) {
    keyPoints.push('Budget and cost considerations were reviewed')
  }
  
  return keyPoints.length > 0 ? keyPoints : ['Meeting summary available']
}

function extractMockCommitments(transcript: string): string[] {
  const words = transcript.toLowerCase()
  const commitments = []
  
  if (words.includes('will') || words.includes('commit')) {
    commitments.push('Team commitments were made')
  }
  if (words.includes('follow up') || words.includes('action')) {
    commitments.push('Follow-up actions were assigned')
  }
  
  return commitments
}

function extractMockNextSteps(transcript: string): string[] {
  const words = transcript.toLowerCase()
  const nextSteps = []
  
  if (words.includes('next') || words.includes('follow')) {
    nextSteps.push('Next meeting to be scheduled')
  }
  if (words.includes('review') || words.includes('check')) {
    nextSteps.push('Review progress before next meeting')
  }
  
  return nextSteps
}