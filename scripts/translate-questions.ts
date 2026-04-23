import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

// service_role key bypasses RLS — required for server-side scripts
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

interface Question {
  id: string
  stem: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  option_e: string
  explanation: string
}

interface Translated {
  stem: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  option_e: string
  explanation: string
}

async function translateQuestion(q: Question): Promise<Translated> {
  const payload = {
    stem: q.stem,
    option_a: q.option_a,
    option_b: q.option_b,
    option_c: q.option_c,
    option_d: q.option_d,
    option_e: q.option_e,
    explanation: q.explanation,
  }

  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 2048,
    messages: [
      {
        role: 'user',
        content: `Translate the following USMLE-style medical question from Portuguese to English. Keep all medical terminology accurate. Return ONLY a JSON object with these exact keys: stem, option_a, option_b, option_c, option_d, option_e, explanation. No other text.\n\n${JSON.stringify(payload, null, 2)}`,
      },
    ],
  })

  const raw = message.content[0].type === 'text' ? message.content[0].text.trim() : ''
  const jsonText = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim()
  return JSON.parse(jsonText) as Translated
}

async function translateSingle(id: string) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ SUPABASE_SERVICE_ROLE_KEY is not set in .env.local')
    process.exit(1)
  }

  const { data: q, error } = await supabase
    .from('questions')
    .select('id, stem, option_a, option_b, option_c, option_d, option_e, explanation')
    .eq('id', id)
    .single()

  if (error || !q) {
    console.error(`❌ Question ${id} not found:`, error?.message)
    process.exit(1)
  }

  console.log(`Translating question ${q.id.slice(0, 8)}...`)
  try {
    const result = await translateQuestion(q)
    const { error: updateError } = await supabase
      .from('questions')
      .update({
        stem: result.stem,
        option_a: result.option_a,
        option_b: result.option_b,
        option_c: result.option_c,
        option_d: result.option_d,
        option_e: result.option_e,
        explanation: result.explanation,
      })
      .eq('id', q.id)

    if (updateError) throw new Error(updateError.message)
    console.log(`✓ Done — ${result.stem.slice(0, 80)}...`)
  } catch (err) {
    console.error(`✗ Failed — ${(err as Error).message}`)
    process.exit(1)
  }
}

async function main() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ SUPABASE_SERVICE_ROLE_KEY is not set in .env.local')
    console.error('   Get it from: Supabase Dashboard → Settings → API → service_role key')
    process.exit(1)
  }

  console.log('Fetching all questions from Supabase...')
  const { data: questions, error } = await supabase
    .from('questions')
    .select('id, stem, option_a, option_b, option_c, option_d, option_e, explanation')
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Failed to fetch questions:', error.message)
    process.exit(1)
  }

  const total = questions?.length ?? 0
  console.log(`Total questions to translate: ${total}`)
  console.log('─'.repeat(50))

  if (total === 0) {
    console.log('No questions found.')
    return
  }

  const BATCH_SIZE = 5
  let translated = 0
  let failed = 0

  for (let i = 0; i < questions!.length; i += BATCH_SIZE) {
    const batch = questions!.slice(i, i + BATCH_SIZE)

    await Promise.all(
      batch.map(async (q) => {
        try {
          const result = await translateQuestion(q)

          const { error: updateError } = await supabase
            .from('questions')
            .update({
              stem: result.stem,
              option_a: result.option_a,
              option_b: result.option_b,
              option_c: result.option_c,
              option_d: result.option_d,
              option_e: result.option_e,
              explanation: result.explanation,
            })
            .eq('id', q.id)

          if (updateError) throw new Error(updateError.message)

          translated++
          console.log(`[${translated + failed}/${total}] ✓ ${q.id.slice(0, 8)}... — ${result.stem.slice(0, 60)}...`)
        } catch (err) {
          failed++
          console.error(`[${translated + failed}/${total}] ✗ ${q.id.slice(0, 8)}... — ${(err as Error).message}`)
        }
      })
    )

    if (i + BATCH_SIZE < questions!.length) {
      await new Promise((res) => setTimeout(res, 1000))
    }
  }

  console.log('─'.repeat(50))
  console.log(`Done. Translated: ${translated} | Failed: ${failed}`)
}

const singleId = process.argv[2]
if (singleId) {
  translateSingle(singleId)
} else {
  main()
}
