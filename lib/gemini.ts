import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = process.env.GEMINI_API_KEY!

if (!apiKey) {
  console.error('Missing GEMINI_API_KEY environment variable')
  throw new Error('Missing GEMINI_API_KEY environment variable')
}

export const genAI = new GoogleGenerativeAI(apiKey)

// Get the Gemini Flash model for text generation (higher rate limits)
export const getGeminiModel = () => {
  return genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash", // Flash has higher rate limits than Pro
    generationConfig: {
      temperature: 0.3, // Lower temperature for more consistent legal documents
      topP: 0.8,
      topK: 40,
      maxOutputTokens: 8192, // Enough for long legal documents
    },
  })
}

// Helper function to generate legal documents
export async function generateLegalDocument(prompt: string): Promise<string> {
  try {
    console.log('Generating document with prompt:', prompt)
    const model = getGeminiModel()
    
    // Add delay to avoid rate limiting (for free tier)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const enhancedPrompt = `You are a professional legal document generator. Create a comprehensive, legally sound document based on the following request:

${prompt}

Requirements:
- Use formal legal language and structure
- Include all necessary sections and clauses
- Add placeholder fields for customization (e.g., [Company Name], [Date], etc.)
- Ensure the document follows standard legal formatting
- Include appropriate disclaimers and signature sections
- Make it professionally formatted and ready to use

Generate the complete legal document:`

    const result = await model.generateContent(enhancedPrompt)
    const response = await result.response
    const text = response.text()
    
    console.log('Generated document length:', text.length)
    return text
  } catch (error) {
    console.error('Error generating legal document:', error)
    console.error('Error details:', error)
    throw new Error(`Failed to generate legal document: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Helper function for legal chat responses
export async function generateLegalChatResponse(message: string, conversationHistory?: string[]): Promise<string> {
  try {
    const model = getGeminiModel()
    
    let contextPrompt = `You are a knowledgeable legal AI assistant. Provide helpful, accurate legal information while emphasizing that this is general guidance only and not a substitute for professional legal advice.

Guidelines:
- Be informative and helpful
- Use clear, understandable language
- Always include appropriate disclaimers
- Cite relevant legal concepts when applicable
- Recommend consulting with qualified attorneys for specific situations

`

    if (conversationHistory && conversationHistory.length > 0) {
      contextPrompt += `Previous conversation context:\n${conversationHistory.join('\n')}\n\n`
    }

    contextPrompt += `User question: ${message}\n\nProvide a helpful legal information response:`

    const result = await model.generateContent(contextPrompt)
    const response = await result.response
    const text = response.text()
    
    return text
  } catch (error) {
    console.error('Error generating chat response:', error)
    throw new Error('Failed to generate chat response')
  }
}
