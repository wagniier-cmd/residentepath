import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const LANGUAGE_NAMES: Record<string, string> = {
  pt: 'português',
  es: 'espanhol',
}

export async function POST(req: NextRequest) {
  try {
    const { text, targetLanguage = 'pt' } = await req.json()

    if (!text?.trim()) {
      return NextResponse.json({ error: 'Texto não pode estar vazio' }, { status: 400 })
    }

    const langName = LANGUAGE_NAMES[targetLanguage] ?? 'português'

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      messages: [{
        role: 'user',
        content: `Traduza o seguinte texto médico do inglês para o ${langName}. Mantenha os termos técnicos corretos. Retorne APENAS a tradução, sem comentários:\n\n${text}`,
      }],
    })

    const content = message.content[0]
    if (content.type !== 'text') throw new Error('Resposta inesperada da IA')

    return NextResponse.json({ translation: content.text.trim() })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erro interno'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
