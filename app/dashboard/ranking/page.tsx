import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

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

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl text-primary-700 mb-1">Ranking</h1>
        <p className="text-muted-foreground text-sm">Top 20 usuários por questões respondidas</p>
      </div>

      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground w-12">#</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Usuário</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">Questões</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">Acerto</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">Sequência</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {ranked.map((u, i) => {
                const isMe = u.userId === user.id
                const initials = u.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
                const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : null

                return (
                  <tr key={u.userId} className={`transition-colors ${isMe ? 'bg-primary-50 border-l-4 border-l-primary-700' : 'hover:bg-gray-50'}`}>
                    <td className="px-4 py-3.5 text-center">
                      {medal
                        ? <span className="text-lg">{medal}</span>
                        : <span className="text-xs font-semibold text-muted-foreground">{i + 1}</span>
                      }
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${isMe ? 'bg-primary-700 text-white' : 'bg-primary-100 text-primary-700'}`}>
                          {initials}
                        </div>
                        <div>
                          <p className={`font-medium ${isMe ? 'text-primary-700' : 'text-foreground'}`}>
                            {u.name}
                            {isMe && <span className="ml-1.5 text-xs bg-primary-700 text-white px-1.5 py-0.5 rounded-full">você</span>}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <span className="font-semibold text-foreground">{u.total.toLocaleString('pt-BR')}</span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <span className={`font-semibold ${u.pct >= 70 ? 'text-correct' : u.pct >= 50 ? 'text-amber-600' : 'text-incorrect'}`}>
                        {u.pct}%
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <span className="text-muted-foreground">
                        {u.streak > 0 ? `🔥 ${u.streak}d` : '—'}
                      </span>
                    </td>
                  </tr>
                )
              })}
              {ranked.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground text-sm">
                    Nenhum dado disponível ainda. Responda questões para aparecer no ranking!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
