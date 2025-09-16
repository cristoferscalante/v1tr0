import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET - Get chat history for project
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params
    const projectIdNum = parseInt(projectId)
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')

    if (isNaN(projectIdNum)) {
      return NextResponse.json(
        { error: 'Invalid project ID' },
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
      .select('id, client_id')
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

    // Get chat messages for the project
    const { data: messages, error } = await supabase
      .from('chat_messages')
      .select(`
        *,
        user:user_id(id, name, email)
      `)
      .eq('project_id', projectIdNum)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch chat history' },
        { status: 500 }
      )
    }

    // Add user_name for backwards compatibility
    const messagesWithUserName = (messages || []).map(msg => ({
      ...msg,
      user_name: msg.user?.name || msg.user?.email || 'Unknown User'
    }))

    return NextResponse.json(messagesWithUserName.reverse()) // Return in chronological order

  } catch (error) {
    console.error('Get chat history error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Send message to AI chat
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params
    const projectIdNum = parseInt(projectId)
    const { message } = await request.json()

    if (isNaN(projectIdNum)) {
      return NextResponse.json(
        { error: 'Invalid project ID' },
        { status: 400 }
      )
    }

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required' },
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

    // Get user role and profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('role, name')
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

    // TODO: Integrate with AI service here
    // For now, we'll create a simple mock response
    const mockAiResponse = generateMockAIResponse(message, project)

    // Save chat message
    const { data: chatMessage, error: saveError } = await supabase
      .from('chat_messages')
      .insert({
        project_id: projectIdNum,
        user_id: user.id,
        message: message.trim(),
        ai_response: mockAiResponse,
        context_used: [
          {
            type: 'project_info',
            project_title: project.title,
            project_description: project.description
          }
        ]
      })
      .select(`
        *,
        user:user_id(id, name, email)
      `)
      .single()

    if (saveError) {
      console.error('Database error:', saveError)
      return NextResponse.json(
        { error: 'Failed to save chat message' },
        { status: 500 }
      )
    }

    // Add user_name for backwards compatibility
    const responseMessage = {
      ...chatMessage,
      user_name: profileData?.name || user.email || 'Unknown User'
    }

    return NextResponse.json(responseMessage, { status: 201 })

  } catch (error) {
    console.error('Send chat message error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Mock AI response generator
function generateMockAIResponse(message: string, project: any): string {
  const lowerMessage = message.toLowerCase()
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return `Hello! I'm here to help you with the "${project.title}" project. What would you like to know?`
  }
  
  if (lowerMessage.includes('status') || lowerMessage.includes('progress')) {
    return `Based on the project information, "${project.title}" is currently in progress. I can help you track specific milestones or answer questions about the project status.`
  }
  
  if (lowerMessage.includes('timeline') || lowerMessage.includes('deadline')) {
    return `For timeline questions about "${project.title}", I'd recommend checking with your project team for the most current schedule information.`
  }
  
  if (lowerMessage.includes('cost') || lowerMessage.includes('budget')) {
    return `Budget and cost information for "${project.title}" would be handled by your account manager. I can help with project-related questions.`
  }
  
  if (lowerMessage.includes('help') || lowerMessage.includes('?')) {
    return `I can help you with questions about "${project.title}". You can ask me about project status, requirements, or general information. What specific aspect would you like to explore?`
  }
  
  return `Thank you for your message about "${project.title}". I understand you're asking about: "${message}". Could you provide more specific details so I can better assist you with this project?`
}