import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import RankingClient from './RankingClient'

interface RankUser {
  userId: string
  name: string
  total: number
  correct: number
  streak: number
  pct: number
}

export default async function RankingPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // Fetch all attempts + profiles in parallel
  const [{ data: attempts }, { data: profiles }, { data: allAttemptDays }] = await Promise.all([
    supabase
      .from('user_question_attempts')
      .select('user_id, is_correct'),
    supabase
      .from('user_profiles')
      .select('id, full_name, email'),
    supabase
      .from('user_question_attempts')
      .select('user_id, answered_at'),
  ])

  // Aggregate per user
  const aggMap: Record<string, { total: number; correct: number }> = {}
  for (const a of attempts ?? []) {
    if (!aggMap[a.user_id]) aggMap[a.user_id] = { total: 0, correct: 0 }
    aggMap[a.user_id].total++
    if (a.is_correct) aggMap[a.user_id].correct++
  }

  // Compute streak per user
  const streakMap: Record<string, number> = {}
  const daysByUser: Record<string, Set<string>> = {}
  for (const a of allAttemptDays ?? []) {
    if (!daysByUser[a.user_id]) daysByUser[a.user_id] = new Set()
    daysByUser[a.user_id].add(a.answered_at.split('T')[0])
  }
  for (const [uid, days] of Object.entries(daysByUser)) {
    let s = 0
    const check = new Date()
    if (!days.has(check.toISOString().split('T')[0])) check.setDate(check.getDate() - 1)
    while (days.has(check.toISOString().split('T')[0])) {
      s++
      check.setDate(check.getDate() - 1)
    }
    streakMap[uid] = s
  }

  const profileMap: Record<string, { full_name: string; email: string }> = {}
  for (const p of profiles ?? []) {
    profileMap[p.id] = { full_name: p.full_name, email: p.email }
  }

  const ranked: RankUser[] = Object.entries(aggMap)
    .map(([userId, { total, correct }]) => ({
      userId,
      name: profileMap[userId]?.full_name || profileMap[userId]?.email || 'Usuário',
      total,
      correct,
      streak: streakMap[userId] ?? 0,
      pct: total > 0 ? Math.round((correct / total) * 100) : 0,
    }))
    .sort((a, b) => b.total - a.total || b.pct - a.pct)
    .slice(0, 20)

  return <RankingClient ranked={ranked} currentUserId={user.id} />
}
