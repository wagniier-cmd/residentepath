import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayStr = today.toISOString()

  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString()

  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 6)
  weekAgo.setHours(0, 0, 0, 0)
  const weekAgoStr = weekAgo.toISOString()

  const weekStart = new Date()
  weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7))
  weekStart.setHours(0, 0, 0, 0)
  const weekStartStr = weekStart.toISOString().split('T')[0]

  const [
    { data: profile },
    { data: questionsTodayData },
    { data: questionsYesterdayData },
    { count: totalCount },
    { data: flashcardsToday },
    { data: dueFlashcards },
    { data: allAttemptsRaw },
    { data: weeklyQuestions },
    { data: weeklyFlashcards },
    { data: lastAttemptArr },
    { data: allQuestionsData },
    { data: goalData },
  ] = await Promise.all([
    supabase.from('user_profiles').select('*').eq('id', user.id).single(),
    supabase.from('user_question_attempts').select('is_correct').eq('user_id', user.id).gte('answered_at', todayStr),
    supabase.from('user_question_attempts').select('id').eq('user_id', user.id).gte('answered_at', yesterdayStr).lt('answered_at', todayStr),
    supabase.from('user_question_attempts').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
    supabase.from('user_flashcard_reviews').select('id').eq('user_id', user.id).gte('reviewed_at', todayStr),
    supabase.from('user_flashcard_state').select('id').eq('user_id', user.id).lte('next_due', todayStr),
    supabase.from('user_question_attempts').select('is_correct, answered_at, questions(subject)').eq('user_id', user.id).order('answered_at', { ascending: false }),
    supabase.from('user_question_attempts').select('answered_at').eq('user_id', user.id).gte('answered_at', weekAgoStr),
    supabase.from('user_flashcard_reviews').select('reviewed_at').eq('user_id', user.id).gte('reviewed_at', weekAgoStr),
    supabase.from('user_question_attempts').select('questions(subject)').eq('user_id', user.id).order('answered_at', { ascending: false }).limit(1),
    supabase.from('questions').select('subject'),
    supabase.from('user_goals').select('questions_goal, flashcards_goal').eq('user_id', user.id).eq('week_start', weekStartStr).single(),
  ])

  // Today stats
  const questionsToday = questionsTodayData?.length || 0
  const correctToday = questionsTodayData?.filter(q => q.is_correct).length || 0
  const accuracyToday = questionsToday > 0 ? Math.round((correctToday / questionsToday) * 100) : 0
  const questionsYesterday = questionsYesterdayData?.length || 0
  const totalQuestionsEver = totalCount || 0

  // Weekly study time estimate: questions × 2min + flashcards × 0.5min
  const questionsThisWeek = weeklyQuestions?.length || 0
  const flashcardsThisWeek = weeklyFlashcards?.length || 0
  const weeklyStudyMinutes = questionsThisWeek * 2 + Math.round(flashcardsThisWeek * 0.5)

  // Streak calculation
  let streak = 0
  if (allAttemptsRaw && allAttemptsRaw.length > 0) {
    const days = new Set(allAttemptsRaw.map(a => a.answered_at.split('T')[0]))
    const check = new Date()
    while (days.has(check.toISOString().split('T')[0])) {
      streak++
      check.setDate(check.getDate() - 1)
    }
  }

  // Subject progress (sorted ascending for chart — weakest first)
  const subjectMap: Record<string, { total: number; correct: number }> = {}
  if (allAttemptsRaw) {
    for (const attempt of allAttemptsRaw) {
      const q = attempt.questions as any
      const subject = q?.subject || 'Outros'
      if (!subjectMap[subject]) subjectMap[subject] = { total: 0, correct: 0 }
      subjectMap[subject].total++
      if (attempt.is_correct) subjectMap[subject].correct++
    }
  }

  const subjectProgress = Object.entries(subjectMap)
    .map(([subject, data]) => ({
      subject,
      total: data.total,
      correct: data.correct,
      percentage: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
    }))
    .sort((a, b) => a.percentage - b.percentage)
    .slice(0, 10)

  // Total questions available per subject
  const totalQuestionsPerSubject: Record<string, number> = {}
  for (const q of allQuestionsData || []) {
    const s = (q as any).subject as string
    totalQuestionsPerSubject[s] = (totalQuestionsPerSubject[s] || 0) + 1
  }

  // Weakest subject (min 3 attempts)
  const weakestEntry = subjectProgress.find(sp => sp.total >= 3)
  const weakestSubject = weakestEntry
    ? {
        subject: weakestEntry.subject,
        percentage: weakestEntry.percentage,
        total: weakestEntry.total,
        remaining: Math.max(0, (totalQuestionsPerSubject[weakestEntry.subject] || 0) - weakestEntry.total),
      }
    : null

  // Last subject studied
  const lastSubjectStudied: string | null = (() => {
    const last = lastAttemptArr?.[0]
    if (!last) return null
    return (last.questions as any)?.subject || null
  })()

  // Days to Match (March 15 of target year)
  let daysToMatch: number | null = null
  if (profile?.target_match_year) {
    const matchDate = new Date(profile.target_match_year, 2, 15)
    const diff = Math.ceil((matchDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    if (diff > 0) daysToMatch = diff
  }

  // Weekly activity chart data
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

  const stats = {
    questionsToday,
    accuracyToday,
    questionsYesterday,
    flashcardsToday: flashcardsToday?.length || 0,
    streak,
    dueFlashcards: dueFlashcards?.length || 0,
    totalQuestionsEver,
    weeklyStudyMinutes,
    lastSubjectStudied,
    weakestSubject,
    daysToMatch,
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
