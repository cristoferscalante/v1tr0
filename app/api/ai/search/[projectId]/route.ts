import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET - Search through project memory/content
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params
    const projectIdNum = parseInt(projectId)
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query')
    const limit = parseInt(searchParams.get('limit') || '20')

    if (isNaN(projectIdNum)) {
      return NextResponse.json(
        { error: 'Invalid project ID' },
        { status: 400 }
      )
    }

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Search query is required' },
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

    // Check access to project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id, client_id, title, description')
      .eq('id', projectIdNum)
      .single()

    if (projectError || !project) {
      return NextResponse.json(
        { error: 'Project not found' },
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
    const isClient = project.client_id === user.id

    if (!isAdmin && !isClient) {
      return NextResponse.json(
        { error: 'Access denied to project' },
        { status: 403 }
      )
    }

    // Get all searchable content for the project
    const searchResults = await searchProjectContent(supabase, projectIdNum, query, limit)

    // Log the search query
    await supabase
      .from('search_queries')
      .insert({
        project_id: projectIdNum,
        user_id: user.id,
        query: query.trim(),
        results_count: searchResults.length,
      })

    return NextResponse.json({
      query: query.trim(),
      results: searchResults,
      total_results: searchResults.length,
      project_id: projectIdNum,
    })

  } catch (error) {
    console.error('Search memory error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function searchProjectContent(supabase: any, projectId: number, query: string, limit: number): Promise<any[]> {
  const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 2)
  const results: any[] = []

  // Search in project basic info
  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single()

  if (project) {
    const projectText = `${project.title} ${project.description}`.toLowerCase()
    const relevanceScore = calculateRelevance(projectText, searchTerms)
    
    if (relevanceScore > 0) {
      results.push({
        type: 'project',
        title: `Project: ${project.title}`,
        content: project.description,
        relevance_score: relevanceScore,
        metadata: {
          project_id: project.id,
          created_at: project.created_at,
        },
        source: 'project_description'
      })
    }
  }

  // Search in meetings
  const { data: meetings } = await supabase
    .from('meetings')
    .select('*')
    .eq('project_id', projectId)

  if (meetings) {
    for (const meeting of meetings) {
      const meetingText = `${meeting.title} ${meeting.description || ''}`.toLowerCase()
      const relevanceScore = calculateRelevance(meetingText, searchTerms)
      
      if (relevanceScore > 0) {
        results.push({
          type: 'meeting',
          title: `Meeting: ${meeting.title}`,
          content: meeting.description || 'No description available',
          relevance_score: relevanceScore,
          metadata: {
            meeting_id: meeting.id,
            start_time: meeting.start_time,
            created_at: meeting.created_at,
          },
          source: 'meeting'
        })
      }
    }
  }

  // Search in transcriptions
  const { data: transcriptions } = await supabase
    .from('transcriptions')
    .select(`
      *,
      meeting:meeting_id(id, title)
    `)
    .in('meeting_id', meetings?.map(m => m.id) || [])
    .eq('status', 'completed')

  if (transcriptions) {
    for (const transcription of transcriptions) {
      const transcriptText = [
        transcription.transcript_text || '',
        transcription.summary || '',
        (transcription.key_points || []).join(' '),
        (transcription.commitments || []).join(' '),
        (transcription.next_steps || []).join(' ')
      ].join(' ').toLowerCase()
      
      const relevanceScore = calculateRelevance(transcriptText, searchTerms)
      
      if (relevanceScore > 0) {
        const preview = generatePreview(transcriptText, searchTerms)
        results.push({
          type: 'transcription',
          title: `Transcription: ${transcription.meeting?.title || 'Meeting'}`,
          content: preview,
          relevance_score: relevanceScore,
          metadata: {
            transcription_id: transcription.id,
            meeting_id: transcription.meeting_id,
            created_at: transcription.created_at,
            duration: transcription.duration,
          },
          source: 'meeting_transcription'
        })
      }
    }
  }

  // Search in chat messages
  const { data: chatMessages } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })
    .limit(100) // Search in recent messages only

  if (chatMessages) {
    for (const message of chatMessages) {
      const messageText = `${message.message} ${message.ai_response || ''}`.toLowerCase()
      const relevanceScore = calculateRelevance(messageText, searchTerms)
      
      if (relevanceScore > 0) {
        const preview = generatePreview(messageText, searchTerms)
        results.push({
          type: 'chat',
          title: `Chat: ${message.message.substring(0, 50)}...`,
          content: preview,
          relevance_score: relevanceScore,
          metadata: {
            message_id: message.id,
            user_id: message.user_id,
            created_at: message.created_at,
          },
          source: 'ai_chat'
        })
      }
    }
  }

  // Sort by relevance score and limit results
  return results
    .sort((a, b) => b.relevance_score - a.relevance_score)
    .slice(0, limit)
}

function calculateRelevance(text: string, searchTerms: string[]): number {
  let score = 0
  
  for (const term of searchTerms) {
    const regex = new RegExp(term, 'gi')
    const matches = text.match(regex)
    if (matches) {
      score += matches.length
    }
  }
  
  return score
}

function generatePreview(text: string, searchTerms: string[]): string {
  // Find the first occurrence of any search term
  let firstMatch = -1
  let matchingTerm = ''
  
  for (const term of searchTerms) {
    const index = text.toLowerCase().indexOf(term)
    if (index !== -1 && (firstMatch === -1 || index < firstMatch)) {
      firstMatch = index
      matchingTerm = term
    }
  }
  
  if (firstMatch === -1) {
    return text.substring(0, 150) + (text.length > 150 ? '...' : '')
  }
  
  // Extract text around the match
  const start = Math.max(0, firstMatch - 75)
  const end = Math.min(text.length, firstMatch + 75)
  let preview = text.substring(start, end)
  
  if (start > 0) {
    preview = '...' + preview
  }
  if (end < text.length) {
    preview = preview + '...'
  }
  
  // Highlight the matching term (basic highlighting for demonstration)
  const regex = new RegExp(`(${matchingTerm})`, 'gi')
  preview = preview.replace(regex, '**$1**')
  
  return preview
}