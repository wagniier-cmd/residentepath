import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import QuestionsClient from './QuestionsClient'

export default async function QuestionsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // Fetch all questions
  const { data: questions } = await supabase
    .from('questions')
    .select('*')
    .order('created_at', { ascending: true })

  // Fetch user attempts
  const { data: attempts } = await supabase
    .from('user_question_attempts')
    .select('question_id, is_correct, selected_answer, answered_at')
    .eq('user_id', user.id)

  return <QuestionsClient questions={questions || []} attempts={attempts || []} userId={user.id} />
}
