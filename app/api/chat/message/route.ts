import { NextRequest, NextResponse } from 'next/server'
import { generateLegalChatResponse } from '@/lib/gemini'
import { createServiceSupabase } from '@/lib/supabase'

// Force dynamic route
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    console.log('=== Chat Message API Called ===')
    
    const body = await request.json()
    console.log('Request body:', body)
    
    const { message, sessionId, userId } = body

    if (!message || !sessionId || !userId) {
      console.log('Missing required fields')
      return NextResponse.json(
        { error: 'Missing required fields: message, sessionId, and userId' },
        { status: 400 }
      )
    }

    console.log('Processing chat message for user:', userId)

    const supabase = createServiceSupabase()

    // Get recent conversation history for context
    const { data: recentMessages } = await supabase
      .from('chat_messages')
      .select('content, sender')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false })
      .limit(10)

    // Format conversation history for context
    const conversationHistory = recentMessages
      ?.reverse()
      .map(msg => `${msg.sender}: ${msg.content}`) || []

    // Save user message to database
    const { error: userMessageError } = await supabase
      .from('chat_messages')
      .insert({
        session_id: sessionId,
        content: message,
        sender: 'user'
      })

    if (userMessageError) {
      console.error('Error saving user message:', userMessageError)
      return NextResponse.json(
        { error: 'Failed to save user message' },
        { status: 500 }
      )
    }

    // Generate AI response using Gemini
    const aiResponse = await generateLegalChatResponse(message, conversationHistory)

    // Save AI response to database
    const { data: assistantMessage, error: assistantMessageError } = await supabase
      .from('chat_messages')
      .insert({
        session_id: sessionId,
        content: aiResponse,
        sender: 'assistant'
      })
      .select()
      .single()

    if (assistantMessageError) {
      console.error('Error saving assistant message:', assistantMessageError)
      return NextResponse.json(
        { error: 'Failed to save assistant message' },
        { status: 500 }
      )
    }

    // Update session's updated_at timestamp
    await supabase
      .from('chat_sessions')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', sessionId)

    return NextResponse.json({
      success: true,
      message: {
        id: assistantMessage.id,
        content: assistantMessage.content,
        sender: assistantMessage.sender,
        timestamp: assistantMessage.created_at
      }
    })

  } catch (error) {
    console.error('Chat message error:', error)
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    )
  }
}
