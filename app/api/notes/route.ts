import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const questionId = req.nextUrl.searchParams.get('question_id')
  if (!questionId) return NextResponse.json({ error: 'Missing question_id' }, { status: 400 })

  const { data } = await supabase
    .from('question_notes')
    .select('note, updated_at')
    .eq('user_id', user.id)
    .eq('question_id', questionId)
    .single()

  return NextResponse.json({ note: data?.note ?? '' })
}

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { question_id, note } = await req.json()
  if (!question_id) return NextResponse.json({ error: 'Missing question_id' }, { status: 400 })

  const { error } = await supabase.from('question_notes').upsert({
    user_id: user.id,
    question_id,
    note: note ?? '',
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id,question_id' })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
