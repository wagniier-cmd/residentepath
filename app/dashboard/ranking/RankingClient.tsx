'use client'

import { useTranslation } from '@/lib/i18n/LanguageContext'

interface RankUser {
  userId: string
  name: string
  total: number
  correct: number
  streak: number
  pct: number
}

interface Props {
  ranked: RankUser[]
  currentUserId: string
}

export default function RankingClient({ ranked, currentUserId }: Props) {
  const { t } = useTranslation()

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl text-primary-700 mb-1">{t.ranking.title}</h1>
        <p className="text-muted-foreground text-sm">{t.ranking.subtitle}</p>
      </div>

      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground w-12">#</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">{t.ranking.user}</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">{t.ranking.questions}</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">{t.ranking.accuracy}</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">{t.ranking.sequence}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {ranked.map((u, i) => {
                const isMe = u.userId === currentUserId
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
                            {isMe && <span className="ml-1.5 text-xs bg-primary-700 text-white px-1.5 py-0.5 rounded-full">{t.ranking.you}</span>}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <span className="font-semibold text-foreground">{u.total.toLocaleString()}</span>
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
                    {t.ranking.empty}
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
