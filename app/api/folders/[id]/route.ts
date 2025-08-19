import { NextRequest, NextResponse } from 'next/server'
import { createServiceSupabase } from '@/lib/supabase'

// Force dynamic route
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// DELETE /api/folders/[id] - Delete folder
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
    
    // First, move all documents in this folder to no folder (null)
    await supabase
      .from('documents')
      .update({ folder_id: null })
      .eq('folder_id', params.id)
      .eq('user_id', userId)

    // Then delete the folder
    const { error } = await supabase
      .from('folders')
      .delete()
      .eq('id', params.id)
      .eq('user_id', userId)

    if (error) {
      console.error('Error deleting folder:', error)
      return NextResponse.json(
        { error: 'Failed to delete folder' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Folder deleted successfully'
    })

  } catch (error) {
    console.error('Folder delete error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
