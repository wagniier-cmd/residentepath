import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { questions_goal, flashcards_goal, week_start } = await req.json()

  const { error } = await supabase.from('user_goals').upsert({
    user_id: user.id,
    questions_goal,
    flashcards_goal,
    week_start,
  }, { onConflict: 'user_id,week_start' })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
