import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check environment variables without exposing sensitive data
    const checks = {
      supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      supabaseServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      geminiApiKey: !!process.env.GEMINI_API_KEY,
      nodeEnv: process.env.NODE_ENV
    }

    return NextResponse.json({
      success: true,
      message: 'API is working',
      environmentChecks: checks,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Test route error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Test route failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
