import { NextRequest, NextResponse } from 'next/server'
import { createServiceSupabase } from '@/lib/supabase'

// Force dynamic route
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// GET /api/folders - Get all folders for authenticated user
export async function GET(request: NextRequest) {
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
    
    const { data: folders, error } = await supabase
      .from('folders')
      .select(`
        id,
        name,
        color,
        created_at,
        updated_at,
        documents(id)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching folders:', error)
      return NextResponse.json(
        { error: 'Failed to fetch folders' },
        { status: 500 }
      )
    }

    // Add document count to each folder
    const foldersWithCount = folders?.map(folder => ({
      ...folder,
      documentCount: folder.documents?.length || 0,
      documents: undefined // Remove the documents array to keep response clean
    })) || []

    return NextResponse.json({
      success: true,
      folders: foldersWithCount
    })

  } catch (error) {
    console.error('Folders API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/folders - Create new folder
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, color, userId } = body

    if (!name || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: name and userId' },
        { status: 400 }
      )
    }

    const supabase = createServiceSupabase()
    
    const { data: folder, error } = await supabase
      .from('folders')
      .insert({
        user_id: userId,
        name: name.trim(),
        color: color || '#8B5CF6'
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating folder:', error)
      return NextResponse.json(
        { error: 'Failed to create folder' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      folder: {
        ...folder,
        documentCount: 0
      }
    })

  } catch (error) {
    console.error('Folder creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
