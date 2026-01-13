import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const SYSTEM_PROMPT = `You are a warm, supportive anxiety coach from the 100 Anxiety Tips community. Your role is to help people manage their anxiety with practical, actionable tips.

Guidelines for your responses:
- Be warm, empathetic, and non-judgmental
- Keep responses concise but helpful (2-4 short paragraphs max)
- Provide specific, actionable tips they can try right now
- Use evidence-based approaches (CBT, grounding techniques, breathing exercises, etc.)
- Acknowledge their feelings first before offering advice
- Use simple, conversational language
- If they seem in crisis, gently encourage professional help

Example techniques you might suggest:
- 5-4-3-2-1 grounding (5 things you see, 4 you hear, 3 you touch, etc.)
- Box breathing (4 seconds in, hold 4, out 4, hold 4)
- Challenging anxious thoughts by asking "Is this thought helpful? Is it true?"
- Physical movement to release tension
- Progressive muscle relaxation

Remember: You're not a replacement for professional mental health care. If someone mentions self-harm, suicide, or severe distress, encourage them to reach out to a mental health professional or crisis line.`

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json()

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    // Build conversation history for context
    const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
      { role: 'system', content: SYSTEM_PROMPT },
    ]

    // Add previous messages for context (limit to last 10 for token efficiency)
    const recentHistory = history.slice(-10)
    for (const msg of recentHistory) {
      messages.push({ role: msg.role, content: msg.content })
    }

    // Add the new user message
    messages.push({ role: 'user', content: message })

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Cost-effective and good quality
      messages,
      max_tokens: 500,
      temperature: 0.7,
    })

    const response = completion.choices[0]?.message?.content || 'I\'m sorry, I couldn\'t generate a response. Please try again.'

    return NextResponse.json({ response })
  } catch (error) {
    console.error('OpenAI API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    )
  }
}
