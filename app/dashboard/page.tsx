import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // Fetch profile
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayStr = today.toISOString()

  // Questions today
  const { data: questionsToday } = await supabase
    .from('user_question_attempts')
    .select('id')
    .eq('user_id', user.id)
    .gte('answered_at', todayStr)

  // Flashcards today
  const { data: flashcardsToday } = await supabase
    .from('user_flashcard_reviews')
    .select('id')
    .eq('user_id', user.id)
    .gte('reviewed_at', todayStr)

  // Due flashcards
  const { data: dueFlashcards } = await supabase
    .from('user_flashcard_state')
    .select('id')
    .eq('user_id', user.id)
    .lte('next_due', todayStr)

  // Subject progress
  const { data: attempts } = await supabase
    .from('user_question_attempts')
    .select('is_correct, questions(subject)')
    .eq('user_id', user.id)

  // Weekly activity (last 7 days)
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 6)
  weekAgo.setHours(0, 0, 0, 0)

  const { data: weeklyQuestions } = await supabase
    .from('user_question_attempts')
    .select('answered_at')
    .eq('user_id', user.id)
    .gte('answered_at', weekAgo.toISOString())

  const { data: weeklyFlashcards } = await supabase
    .from('user_flashcard_reviews')
    .select('reviewed_at')
    .eq('user_id', user.id)
    .gte('reviewed_at', weekAgo.toISOString())

  // Calculate streak
  const { data: allAttempts } = await supabase
    .from('user_question_attempts')
    .select('answered_at')
    .eq('user_id', user.id)
    .order('answered_at', { ascending: false })

  let streak = 0
  if (allAttempts && allAttempts.length > 0) {
    const days = new Set(allAttempts.map(a => a.answered_at.split('T')[0]))
    const check = new Date()
    while (days.has(check.toISOString().split('T')[0])) {
      streak++
      check.setDate(check.getDate() - 1)
    }
  }

  // Process subject progress
  const subjectMap: Record<string, { total: number; correct: number }> = {}
  if (attempts) {
    for (const attempt of attempts) {
      const q = attempt.questions as any
      const subject = q?.subject || 'Outros'
      if (!subjectMap[subject]) subjectMap[subject] = { total: 0, correct: 0 }
      subjectMap[subject].total++
      if (attempt.is_correct) subjectMap[subject].correct++
    }
  }

  const subjectProgress = Object.entries(subjectMap).map(([subject, data]) => ({
    subject,
    total: data.total,
    correct: data.correct,
    percentage: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
  })).sort((a, b) => b.total - a.total).slice(0, 6)

  // Build weekly activity
  const weeklyActivity = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    const label = d.toLocaleDateString('pt-BR', { weekday: 'short' })
    const qCount = weeklyQuestions?.filter(q => q.answered_at.startsWith(dateStr)).length || 0
    const fCount = weeklyFlashcards?.filter(f => f.reviewed_at.startsWith(dateStr)).length || 0
    weeklyActivity.push({ date: label, questions: qCount, flashcards: fCount })
  }

  // Weekly goals — week starts on Monday
  const weekStart = new Date()
  weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7))
  weekStart.setHours(0, 0, 0, 0)
  const weekStartStr = weekStart.toISOString().split('T')[0]

  const { data: goalData } = await supabase
    .from('user_goals')
    .select('questions_goal, flashcards_goal')
    .eq('user_id', user.id)
    .eq('week_start', weekStartStr)
    .single()

  const questionsThisWeek = weeklyQuestions?.length || 0
  const flashcardsThisWeek = weeklyFlashcards?.length || 0

  const stats = {
    questionsToday: questionsToday?.length || 0,
    flashcardsToday: flashcardsToday?.length || 0,
    streak,
    dueFlashcards: dueFlashcards?.length || 0,
    subjectProgress,
    weeklyActivity,
    weeklyGoal: {
      questionsGoal: goalData?.questions_goal ?? 50,
      flashcardsGoal: goalData?.flashcards_goal ?? 30,
      questionsThisWeek,
      flashcardsThisWeek,
      weekStart: weekStartStr,
    },
  }

  return <DashboardClient profile={profile} stats={stats} userId={user.id} />
}
