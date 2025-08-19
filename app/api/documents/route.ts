import { NextRequest, NextResponse } from 'next/server'
import { createServiceSupabase } from '@/lib/supabase'

// Force dynamic route
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// GET /api/documents - Get all documents for authenticated user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const folderId = searchParams.get('folderId')

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId parameter' },
        { status: 400 }
      )
    }

    const supabase = createServiceSupabase()
    
    let query = supabase
      .from('documents')
      .select(`
        id,
        title,
        type,
        content,
        prompt,
        status,
        is_favorite,
        tags,
        word_count,
        preview,
        created_at,
        updated_at,
        folder_id,
        folders(id, name, color)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    // Filter by folder if specified
    if (folderId) {
      if (folderId === 'null' || folderId === 'undefined') {
        query = query.is('folder_id', null)
      } else {
        query = query.eq('folder_id', folderId)
      }
    }

    const { data: documents, error } = await query

    if (error) {
      console.error('Error fetching documents:', error)
      return NextResponse.json(
        { error: 'Failed to fetch documents' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      documents: documents || []
    })

  } catch (error) {
    console.error('Documents API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
