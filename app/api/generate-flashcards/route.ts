import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const { text, subject, count = 10 } = await req.json()

    if (!text?.trim()) {
      return NextResponse.json({ success: false, error: 'Texto não pode estar vazio' }, { status: 400 })
    }

    const isSingle = count === 1

    const prompt = isSingle
      ? `Você é um especialista em criar flashcards para estudos médicos USMLE.

A partir da explicação abaixo, extraia O conceito principal e gere EXATAMENTE 1 flashcard no formato JSON.
Especialidade: ${subject}

Regras:
- Identifique o conceito-chave mais importante da explicação
- A frente (front) deve ser uma pergunta clínica direta
- O verso (back) deve conter a resposta objetiva e completa
- Responda APENAS com o JSON, sem texto adicional

Formato obrigatório:
[{ "front": "pergunta aqui", "back": "resposta completa aqui" }]

Explicação da questão:
${text}`
      : `Você é um especialista em criar flashcards para estudos médicos USMLE.

A partir do texto abaixo, gere exatamente ${count} flashcards no formato JSON.
Especialidade: ${subject}

Regras:
- Cada flashcard deve ter uma pergunta objetiva na frente (front) e uma resposta completa no verso (back)
- Foque nos conceitos mais importantes para o USMLE
- As perguntas devem ser no estilo do exame (clínico, com raciocínio)
- Responda APENAS com o JSON, sem texto adicional

Formato obrigatório:
[
  { "front": "pergunta aqui", "back": "resposta completa aqui" },
  ...
]

Texto para analisar:
${text}`

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: isSingle ? 512 : 4096,
      messages: [{ role: 'user', content: prompt }],
    })

    const content = message.content[0]
    if (content.type !== 'text') {
      throw new Error('Resposta inesperada da IA')
    }

    const jsonMatch = content.text.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      throw new Error('Não foi possível extrair os flashcards da resposta')
    }

    const flashcards: { front: string; back: string }[] = JSON.parse(jsonMatch[0])

    if (!Array.isArray(flashcards) || flashcards.length === 0) {
      throw new Error('Formato de flashcards inválido')
    }

    return NextResponse.json({ success: true, flashcards })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro interno'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
