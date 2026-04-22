import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getUserPlan } from '@/lib/subscription'
import PerfilClient from './PerfilClient'

export default async function PerfilPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  const [
    { data: profile },
    { data: attempts },
    { data: flashcardReviews },
    { data: studyDays },
    userPlan,
    { data: subscription },
  ] = await Promise.all([
    supabase.from('user_profiles').select('*').eq('id', user.id).single(),
    supabase
      .from('user_question_attempts')
      .select('question_id, is_correct, answered_at, questions(subject)')
      .eq('user_id', user.id),
    supabase
      .from('user_flashcard_reviews')
      .select('flashcard_id, reviewed_at')
      .eq('user_id', user.id),
    supabase
      .from('user_question_attempts')
      .select('answered_at')
      .eq('user_id', user.id),
    getUserPlan(user.id),
    supabase
      .from('user_subscriptions')
      .select('plan, status, trial_ends_at, created_at')
      .eq('user_id', user.id)
      .single(),
  ])

  // Stats: unique days studied
  const uniqueDays = new Set(
    (studyDays ?? []).map(a => new Date(a.answered_at).toDateString())
  ).size

  // Streak: consecutive days up to today
  const daySet = new Set(
    (studyDays ?? []).map(a => new Date(a.answered_at).toDateString())
  )
  let streak = 0
  const check = new Date()
  // if didn't study today, start from yesterday
  if (!daySet.has(check.toDateString())) check.setDate(check.getDate() - 1)
  while (daySet.has(check.toDateString())) {
    streak++
    check.setDate(check.getDate() - 1)
  }

  // Per-subject stats
  type SubjectStat = { subject: string; total: number; correct: number }
  const subjectMap: Record<string, SubjectStat> = {}
  for (const a of attempts ?? []) {
    const subject = (a.questions as unknown as { subject: string } | null)?.subject ?? 'Outros'
    if (!subjectMap[subject]) subjectMap[subject] = { subject, total: 0, correct: 0 }
    subjectMap[subject].total++
    if (a.is_correct) subjectMap[subject].correct++
  }
  const subjectStats = Object.values(subjectMap).sort((a, b) => b.total - a.total)

  const totalAttempts = attempts?.length ?? 0
  const totalCorrect = attempts?.filter(a => a.is_correct).length ?? 0
  const totalFlashcardsReviewed = flashcardReviews?.length ?? 0

  return (
    <PerfilClient
      profile={profile ?? {
        id: user.id,
        email: user.email ?? '',
        full_name: '',
        medical_school: '',
        graduation_year: new Date().getFullYear(),
        target_match_year: new Date().getFullYear() + 2,
      }}
      stats={{
        totalAttempts,
        totalCorrect,
        totalFlashcardsReviewed,
        streak,
        uniqueDays,
      }}
      subjectStats={subjectStats}
      userPlan={userPlan}
      subscription={subscription}
    />
  )
}
