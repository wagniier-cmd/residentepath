'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import type { WeeklyGoal } from '@/types'
import type { DashboardStats, UserProfile } from '@/types'

interface Props {
  profile: UserProfile | null
  stats: DashboardStats
  userId: string
}

export default function DashboardClient({ profile, stats, userId }: Props) {
  const firstName = profile?.full_name?.split(' ')[0] || 'Médico'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite'

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl text-primary-700 mb-1">{greeting}, {firstName}!</h1>
        <p className="text-muted-foreground">
          {profile?.target_match_year
            ? `Match ${profile.target_match_year} — continue firme nos estudos.`
            : 'Continue firme nos estudos.'}
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Questões hoje"
          value={stats.questionsToday}
          icon="📝"
          color="blue"
        />
        <StatCard
          label="Flashcards hoje"
          value={stats.flashcardsToday}
          icon="🃏"
          color="purple"
        />
        <StatCard
          label="Sequência"
          value={`${stats.streak} ${stats.streak === 1 ? 'dia' : 'dias'}`}
          icon="🔥"
          color="orange"
        />
        <StatCard
          label="Flashcards devidos"
          value={stats.dueFlashcards}
          icon="⏰"
          color={stats.dueFlashcards > 0 ? 'red' : 'green'}
        />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Link
          href="/dashboard/questions"
          className="group flex items-center gap-4 p-5 bg-primary-700 rounded-2xl hover:bg-primary-800 transition-colors"
        >
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">📝</div>
          <div>
            <p className="text-white font-semibold text-lg">Praticar Questões</p>
            <p className="text-white/60 text-sm">Banco USMLE Step 1, 2CK e 3</p>
          </div>
          <svg className="ml-auto w-5 h-5 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>

        <Link
          href="/dashboard/flashcards"
          className="group flex items-center gap-4 p-5 bg-white border border-border rounded-2xl hover:border-primary/30 hover:shadow-md transition-all"
        >
          <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">🃏</div>
          <div>
            <p className="text-primary-700 font-semibold text-lg">Revisar Flashcards</p>
            <p className="text-muted-foreground text-sm">
              {stats.dueFlashcards > 0
                ? `${stats.dueFlashcards} cards para revisar`
                : 'Tudo em dia!'}
            </p>
          </div>
          <svg className="ml-auto w-5 h-5 text-muted-foreground group-hover:text-primary-700 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Weekly goals */}
      <WeeklyGoalSection goal={stats.weeklyGoal} userId={userId} />

      {/* Charts row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weekly activity */}
        <div className="bg-white rounded-2xl p-6 border border-border">
          <h2 className="text-lg font-semibold text-primary-700 mb-4">Atividade Semanal</h2>
          {stats.weeklyActivity.some(d => d.questions > 0 || d.flashcards > 0) ? (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={stats.weeklyActivity} barGap={2}>
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  labelStyle={{ fontWeight: 600 }}
                />
                <Bar dataKey="questions" name="Questões" fill="#1E3A5F" radius={[4, 4, 0, 0]} />
                <Bar dataKey="flashcards" name="Flashcards" fill="#93c5fd" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState text="Nenhuma atividade esta semana ainda. Comece estudando!" />
          )}
        </div>

        {/* Subject progress */}
        <div className="bg-white rounded-2xl p-6 border border-border">
          <h2 className="text-lg font-semibold text-primary-700 mb-4">Progresso por Especialidade</h2>
          {stats.subjectProgress.length > 0 ? (
            <div className="space-y-3">
              {stats.subjectProgress.map(sp => (
                <div key={sp.subject}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-foreground font-medium">{sp.subject}</span>
                    <span className="text-muted-foreground">{sp.percentage}% ({sp.correct}/{sp.total})</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${sp.percentage}%`,
                        backgroundColor: sp.percentage >= 70 ? '#22C55E' : sp.percentage >= 50 ? '#f59e0b' : '#EF4444'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState text="Responda questões para ver seu progresso por especialidade." />
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon }: { label: string; value: string | number; icon: string; color?: string }) {
  return (
    <div className="rounded-2xl p-4 border border-border bg-white">
      <div className="text-2xl mb-2">{icon}</div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
    </div>
  )
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-32 text-center">
      <p className="text-muted-foreground text-sm">{text}</p>
    </div>
  )
}

function WeeklyGoalSection({ goal, userId }: { goal: WeeklyGoal; userId: string }) {
  const [editing, setEditing] = useState(false)
  const [qGoal, setQGoal] = useState(goal.questionsGoal)
  const [fGoal, setFGoal] = useState(goal.flashcardsGoal)
  const [saving, setSaving] = useState(false)

  const qPct = Math.min(100, goal.questionsGoal > 0 ? Math.round((goal.questionsThisWeek / goal.questionsGoal) * 100) : 0)
  const fPct = Math.min(100, goal.flashcardsGoal > 0 ? Math.round((goal.flashcardsThisWeek / goal.flashcardsGoal) * 100) : 0)

  async function saveGoal() {
    setSaving(true)
    await fetch('/api/goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questions_goal: qGoal, flashcards_goal: fGoal, week_start: goal.weekStart, user_id: userId }),
    })
    setSaving(false)
    setEditing(false)
    // Refresh to show new goals
    window.location.reload()
  }

  return (
    <div className="bg-white rounded-2xl border border-border p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-primary-700">Meta da semana</h2>
        <button
          onClick={() => setEditing(e => !e)}
          className="text-xs text-muted-foreground hover:text-primary-700 transition-colors border border-border px-3 py-1.5 rounded-lg hover:border-primary/40"
        >
          {editing ? 'Cancelar' : '✏️ Editar meta'}
        </button>
      </div>

      {editing ? (
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <label className="text-sm text-foreground w-40">📝 Questões/semana</label>
            <input
              type="number" min={1} max={500} value={qGoal}
              onChange={e => setQGoal(Number(e.target.value))}
              className="border border-border rounded-lg px-3 py-1.5 text-sm w-24 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="text-sm text-foreground w-40">🃏 Flashcards/semana</label>
            <input
              type="number" min={1} max={500} value={fGoal}
              onChange={e => setFGoal(Number(e.target.value))}
              className="border border-border rounded-lg px-3 py-1.5 text-sm w-24 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <button
            onClick={saveGoal} disabled={saving}
            className="px-5 py-2 bg-primary-700 text-white rounded-xl text-sm font-medium hover:bg-primary-800 disabled:opacity-50 transition-colors"
          >
            {saving ? 'Salvando...' : 'Salvar meta'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <GoalBar
            icon="📝" label="Questões"
            current={goal.questionsThisWeek} goal={goal.questionsGoal} pct={qPct}
          />
          <GoalBar
            icon="🃏" label="Flashcards"
            current={goal.flashcardsThisWeek} goal={goal.flashcardsGoal} pct={fPct}
          />
        </div>
      )}
    </div>
  )
}

function GoalBar({ icon, label, current, goal, pct }: { icon: string; label: string; current: number; goal: number; pct: number }) {
  const done = pct >= 100
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm text-foreground">{icon} {label}</span>
        <span className={`text-xs font-semibold ${done ? 'text-correct' : 'text-muted-foreground'}`}>
          {done ? '✓ Meta atingida!' : `${current} / ${goal}`}
        </span>
      </div>
      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${done ? 'bg-correct' : pct >= 60 ? 'bg-primary-700' : 'bg-amber-400'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground mt-1">{pct}% da meta semanal</p>
    </div>
  )
}
