import { NextRequest, NextResponse } from 'next/server'
import { generateLegalDocument } from '@/lib/gemini'
import { createServiceSupabase } from '@/lib/supabase'

// Force dynamic route
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    console.log('=== Document Generation API Called ===')
    
    const body = await request.json()
    console.log('Request body:', body)
    
    const { prompt, userId, folderId } = body

    if (!prompt || !userId) {
      console.log('Error: Missing required fields')
      return NextResponse.json(
        { error: 'Missing required fields: prompt and userId' },
        { status: 400 }
      )
    }

    console.log('Using userId:', userId)

    console.log('Generating document with Gemini...')
    // Generate document using Gemini AI
    const content = await generateLegalDocument(prompt)
    console.log('Document generated successfully, length:', content.length)

    // Extract document type from prompt (basic logic)
    const extractDocumentType = (prompt: string): string => {
      const lowerPrompt = prompt.toLowerCase()
      if (lowerPrompt.includes('nda') || lowerPrompt.includes('non-disclosure')) return 'Contract'
      if (lowerPrompt.includes('employment') || lowerPrompt.includes('job')) return 'Employment'
      if (lowerPrompt.includes('terms') || lowerPrompt.includes('service')) return 'Policy'
      if (lowerPrompt.includes('privacy')) return 'Policy'
      if (lowerPrompt.includes('contract') || lowerPrompt.includes('agreement')) return 'Contract'
      if (lowerPrompt.includes('lease') || lowerPrompt.includes('rental')) return 'Real Estate'
      return 'Legal Document'
    }

    // Generate title from prompt
    const generateTitle = (prompt: string, type: string): string => {
      const words = prompt.split(' ').slice(0, 6)
      return words.join(' ').replace(/^./, (str) => str.toUpperCase())
    }

    // Calculate word count and preview
    const wordCount = content.trim().split(/\s+/).filter(word => word.length > 0).length
    const preview = content.substring(0, 200) + (content.length > 200 ? '...' : '')
    
    const documentType = extractDocumentType(prompt)
    const title = generateTitle(prompt, documentType)

    // Save to Supabase database
    console.log('Saving to Supabase...')
    const supabase = createServiceSupabase()
    
    const documentData = {
      user_id: userId,
      folder_id: folderId || null,
      title,
      type: documentType,
      content,
      prompt,
      status: 'completed',
      is_favorite: false,
      tags: [],
      word_count: wordCount,
      preview
    }
    console.log('Document data to save:', { ...documentData, content: '[content truncated]' })
    
    const { data: document, error } = await supabase
      .from('documents')
      .insert(documentData)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      return NextResponse.json(
        { error: 'Failed to save document to database', details: error.message },
        { status: 500 }
      )
    }
    
    console.log('Document saved successfully with ID:', document.id)

    return NextResponse.json({
      success: true,
      document: {
        id: document.id,
        title: document.title,
        type: document.type,
        content: document.content,
        prompt: document.prompt,
        createdAt: document.created_at,
        lastModified: document.updated_at,
        status: document.status,
        preview: document.preview,
        wordCount: document.word_count,
        isFavorite: document.is_favorite,
        tags: document.tags,
        folderId: document.folder_id
      }
    })

  } catch (error) {
    console.error('=== Document Generation Error ===')
    console.error('Error:', error)
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    
    return NextResponse.json(
      { 
        error: 'Failed to generate document', 
        details: error instanceof Error ? error.message : 'Unknown error',
        type: error instanceof Error ? error.constructor.name : typeof error
      },
      { status: 500 }
    )
  }
}
