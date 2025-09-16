import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET - Get AI insights for a project
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params
    const projectIdNum = parseInt(projectId)

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

    // Check access to project and get comprehensive data
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select(`
        *,
        meetings(*),
        client:client_id(id, name, email)
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

    // Get transcriptions for deeper insights
    const { data: transcriptions } = await supabase
      .from('transcriptions')
      .select('*')
      .in('meeting_id', project.meetings.map((m: any) => m.id))
      .eq('status', 'completed')

    // Get chat history for interaction insights
    const { data: chatMessages } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('project_id', projectIdNum)
      .order('created_at', { ascending: false })
      .limit(50)

    // Generate insights based on available data
    const insights = generateProjectInsights(project, transcriptions || [], chatMessages || [])

    return NextResponse.json(insights)

  } catch (error) {
    console.error('Get insights error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function generateProjectInsights(project: any, transcriptions: any[], chatMessages: any[]): any {
  const now = new Date()
  const createdDate = new Date(project.created_at)
  const daysSinceCreated = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24))
  
  const insights = {
    project_summary: {
      title: project.title,
      status: project.status,
      days_active: daysSinceCreated,
      total_meetings: project.meetings.length,
      completed_transcriptions: transcriptions.length,
      chat_interactions: chatMessages.length,
    },
    activity_insights: [],
    communication_patterns: [],
    content_insights: [],
    recommendations: [],
    metrics: {
      engagement_score: 0,
      completion_rate: 0,
      response_time: 'N/A',
      satisfaction_indicator: 'Good'
    }
  }

  // Activity insights
  if (project.meetings.length === 0) {
    insights.activity_insights.push({
      type: 'warning',
      title: 'No Meetings Scheduled',
      description: 'Consider scheduling initial project meetings to establish communication.'
    })
  } else if (project.meetings.length > 0) {
    const recentMeetings = project.meetings.filter((m: any) => {
      const meetingDate = new Date(m.created_at)
      const daysAgo = Math.floor((now.getTime() - meetingDate.getTime()) / (1000 * 60 * 60 * 24))
      return daysAgo <= 7
    })
    
    if (recentMeetings.length > 0) {
      insights.activity_insights.push({
        type: 'positive',
        title: 'Active Communication',
        description: `${recentMeetings.length} meeting(s) in the last week shows active engagement.`
      })
    }
  }

  // Communication patterns
  if (chatMessages.length > 0) {
    const recentChats = chatMessages.filter((m: any) => {
      const chatDate = new Date(m.created_at)
      const daysAgo = Math.floor((now.getTime() - chatDate.getTime()) / (1000 * 60 * 60 * 24))
      return daysAgo <= 7
    })
    
    insights.communication_patterns.push({
      type: 'info',
      title: 'AI Chat Usage',
      description: `${recentChats.length} AI interactions in the last week. Total: ${chatMessages.length} conversations.`
    })

    // Analyze common topics in chat
    const allMessages = chatMessages.map(m => m.message.toLowerCase()).join(' ')
    const commonTopics = []
    
    if (allMessages.includes('status') || allMessages.includes('progress')) {
      commonTopics.push('project status')
    }
    if (allMessages.includes('timeline') || allMessages.includes('deadline')) {
      commonTopics.push('timelines')
    }
    if (allMessages.includes('budget') || allMessages.includes('cost')) {
      commonTopics.push('budget concerns')
    }
    
    if (commonTopics.length > 0) {
      insights.communication_patterns.push({
        type: 'info',
        title: 'Common Discussion Topics',
        description: `Frequently discussed: ${commonTopics.join(', ')}`
      })
    }
  }

  // Content insights from transcriptions
  if (transcriptions.length > 0) {
    const totalKeyPoints = transcriptions.reduce((sum, t) => sum + (t.key_points?.length || 0), 0)
    const totalCommitments = transcriptions.reduce((sum, t) => sum + (t.commitments?.length || 0), 0)
    
    insights.content_insights.push({
      type: 'info',
      title: 'Meeting Content Analysis',
      description: `${totalKeyPoints} key points and ${totalCommitments} commitments tracked across meetings.`
    })

    // Check for recent transcriptions
    const recentTranscriptions = transcriptions.filter(t => {
      const transcriptDate = new Date(t.created_at)
      const daysAgo = Math.floor((now.getTime() - transcriptDate.getTime()) / (1000 * 60 * 60 * 24))
      return daysAgo <= 14
    })
    
    if (recentTranscriptions.length > 0) {
      insights.content_insights.push({
        type: 'positive',
        title: 'Recent Documentation',
        description: `${recentTranscriptions.length} meeting(s) transcribed in the last two weeks.`
      })
    }
  }

  // Generate recommendations
  if (project.meetings.length === 0) {
    insights.recommendations.push({
      priority: 'high',
      title: 'Schedule Initial Meeting',
      description: 'Start with a project kickoff meeting to align expectations and goals.',
      action: 'Schedule Meeting'
    })
  }

  if (transcriptions.length < project.meetings.length && project.meetings.length > 0) {
    insights.recommendations.push({
      priority: 'medium',
      title: 'Improve Meeting Documentation',
      description: 'Consider recording and transcribing meetings for better project tracking.',
      action: 'Upload Audio'
    })
  }

  if (chatMessages.length === 0) {
    insights.recommendations.push({
      priority: 'low',
      title: 'Try AI Assistant',
      description: 'Use the AI chat feature to get quick answers about your project.',
      action: 'Start Chat'
    })
  }

  // Calculate metrics
  insights.metrics.engagement_score = Math.min(100, 
    (project.meetings.length * 20) + 
    (transcriptions.length * 15) + 
    (chatMessages.length * 2)
  )
  
  insights.metrics.completion_rate = project.meetings.length > 0 ? 
    Math.round((transcriptions.length / project.meetings.length) * 100) : 0

  if (chatMessages.length > 0) {
    insights.metrics.response_time = 'Immediate (AI Chat)'
  }

  return insights
}