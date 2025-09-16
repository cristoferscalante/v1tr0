import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST - Ask AI a question about the project
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params
    const projectIdNum = parseInt(projectId)
    const { searchParams } = new URL(request.url)
    const question = searchParams.get('question')

    if (isNaN(projectIdNum)) {
      return NextResponse.json(
        { error: 'Invalid project ID' },
        { status: 400 }
      )
    }

    if (!question || question.trim().length === 0) {
      return NextResponse.json(
        { error: 'Question is required' },
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
      .select(`
        *,
        meetings(*),
        transcriptions:meetings(transcriptions(*))
      `)
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

    // TODO: Integrate with AI service to analyze project data and answer question
    // For now, we'll create a mock response based on available project information
    
    const answer = generateProjectAnswer(question, project)
    const contextUsed = getContextForAnswer(question, project)

    // Log the question/answer for analytics
    await supabase
      .from('ai_queries')
      .insert({
        project_id: projectIdNum,
        user_id: user.id,
        question: question.trim(),
        answer: answer,
        context_used: contextUsed,
      })
      .select('id')
      .single()

    return NextResponse.json({
      answer,
      context_used: contextUsed,
      project_id: projectIdNum,
      question: question.trim(),
    })

  } catch (error) {
    console.error('Ask AI question error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function generateProjectAnswer(question: string, project: any): string {
  const lowerQuestion = question.toLowerCase()
  
  if (lowerQuestion.includes('what') && (lowerQuestion.includes('project') || lowerQuestion.includes('about'))) {
    return `The project "${project.title}" is ${project.description}. Current status: ${project.status || 'active'}.`
  }
  
  if (lowerQuestion.includes('meeting') || lowerQuestion.includes('reunion')) {
    const meetingCount = project.meetings?.length || 0
    return `This project has ${meetingCount} meeting(s) recorded. ${meetingCount > 0 ? 'You can access meeting details and transcriptions through the meetings section.' : 'No meetings have been scheduled yet.'}`
  }
  
  if (lowerQuestion.includes('status') || lowerQuestion.includes('progress')) {
    return `Project "${project.title}" is currently marked as ${project.status || 'active'}. Created on ${new Date(project.created_at).toLocaleDateString()}.`
  }
  
  if (lowerQuestion.includes('when') || lowerQuestion.includes('date')) {
    return `Project "${project.title}" was created on ${new Date(project.created_at).toLocaleDateString()}. Last updated: ${new Date(project.updated_at || project.created_at).toLocaleDateString()}.`
  }
  
  if (lowerQuestion.includes('client') || lowerQuestion.includes('who')) {
    return `This project belongs to client ID ${project.client_id}. For specific client details, please contact your project manager.`
  }
  
  if (lowerQuestion.includes('transcription') || lowerQuestion.includes('transcript')) {
    const transcriptionCount = project.transcriptions?.length || 0
    return `There are ${transcriptionCount} transcription(s) available for this project. ${transcriptionCount > 0 ? 'These contain meeting summaries and key insights.' : 'No transcriptions are available yet.'}`
  }
  
  return `I understand you're asking about "${question}" regarding project "${project.title}". Based on available information: ${project.description}. For more specific details, please contact your project team or ask a more specific question.`
}

function getContextForAnswer(question: string, project: any): any[] {
  const context = [
    {
      type: 'project_basic_info',
      title: project.title,
      description: project.description,
      status: project.status,
      created_at: project.created_at,
    }
  ]
  
  const lowerQuestion = question.toLowerCase()
  
  if (lowerQuestion.includes('meeting') && project.meetings?.length > 0) {
    context.push({
      type: 'meetings_summary',
      count: project.meetings.length,
      meetings: project.meetings.slice(0, 5) // Include up to 5 recent meetings
    })
  }
  
  if (lowerQuestion.includes('transcription') && project.transcriptions?.length > 0) {
    context.push({
      type: 'transcriptions_summary',
      count: project.transcriptions.length,
    })
  }
  
  return context
}