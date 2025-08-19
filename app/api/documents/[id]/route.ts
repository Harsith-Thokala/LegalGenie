import { NextRequest, NextResponse } from 'next/server'
import { createServiceSupabase } from '@/lib/supabase'

// Force dynamic route
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// GET /api/documents/[id] - Get specific document
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId parameter' },
        { status: 400 }
      )
    }

    const supabase = createServiceSupabase()
    
    const { data: document, error } = await supabase
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
      .eq('id', params.id)
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('Error fetching document:', error)
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      document
    })

  } catch (error) {
    console.error('Document fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/documents/[id] - Update document
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    console.log('Update document request body:', body)
    console.log('Document ID from params:', params.id)
    
    const { 
      title, 
      content, 
      status, 
      is_favorite, 
      tags, 
      folder_id,
      userId 
    } = body

    if (!userId) {
      console.error('Missing userId in request')
      return NextResponse.json(
        { error: 'Missing userId' },
        { status: 400 }
      )
    }

    const supabase = createServiceSupabase()
    
    // Calculate updated word count and preview if content changed
    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    if (title !== undefined) updateData.title = title
    if (content !== undefined) {
      updateData.content = content
      updateData.word_count = content.trim().split(/\s+/).filter((word: string) => word.length > 0).length
      updateData.preview = content.substring(0, 200) + (content.length > 200 ? '...' : '')
    }
    if (status !== undefined) updateData.status = status
    if (is_favorite !== undefined) updateData.is_favorite = is_favorite
    if (tags !== undefined) updateData.tags = tags
    if (folder_id !== undefined) updateData.folder_id = folder_id

    console.log('Update data:', updateData)
    console.log('Updating document with ID:', params.id, 'for user:', userId)

    const { data: document, error } = await supabase
      .from('documents')
      .update(updateData)
      .eq('id', params.id)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error updating document:', error)
      return NextResponse.json(
        { error: 'Failed to update document: ' + error.message },
        { status: 500 }
      )
    }

    console.log('Document updated successfully:', document)

    return NextResponse.json({
      success: true,
      document
    })

  } catch (error) {
    console.error('Document update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/documents/[id] - Delete document
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId parameter' },
        { status: 400 }
      )
    }

    const supabase = createServiceSupabase()
    
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', params.id)
      .eq('user_id', userId)

    if (error) {
      console.error('Error deleting document:', error)
      return NextResponse.json(
        { error: 'Failed to delete document' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Document deleted successfully'
    })

  } catch (error) {
    console.error('Document delete error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
