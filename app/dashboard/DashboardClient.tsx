'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Cell,
} from 'recharts'
import type { WeeklyGoal, DashboardStats, UserProfile } from '@/types'
import { useTranslation } from '@/lib/i18n/LanguageContext'

interface Props {
  profile: UserProfile | null
  stats: DashboardStats
  userId: string
}

function formatStudyTime(minutes: number): string {
  if (minutes === 0) return '0 min'
  if (minutes < 60) return `${minutes}min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}min` : `${h}h`
}

function barColor(pct: number) {
  if (pct >= 70) return '#22C55E'
  if (pct >= 40) return '#F59E0B'
  return '#EF4444'
}

export default function DashboardClient({ profile, stats, userId }: Props) {
  const { t, language } = useTranslation()
  const firstName = profile?.full_name?.split(' ')[0] || (language === 'en' ? 'Doctor' : 'Médico')
  const hour = new Date().getHours()
  const greeting = hour < 12 ? t.dashboard.greetingMorning : hour < 18 ? t.dashboard.greetingAfternoon : t.dashboard.greetingEvening

  const today = new Date()
  const formattedDate = today.toLocaleDateString(
    language === 'en' ? 'en-US' : language === 'es' ? 'es-ES' : 'pt-BR',
    { weekday: 'long', day: 'numeric', month: 'long' }
  )

  const deltaQ = stats.questionsToday - stats.questionsYesterday
  const deltaText = deltaQ > 0
    ? `+${deltaQ} ${t.dashboard.thanYesterday}`
    : deltaQ < 0
    ? `${deltaQ} ${t.dashboard.thanYesterday}`
    : t.dashboard.sameAsYesterday
  const deltaColor = deltaQ >= 0 ? '#22C55E' : '#EF4444'

  return (
    <div className="animate-fade-in">
      {/* ── Header ── */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary-700 mb-2">
          {greeting}, {firstName}!
        </h1>
        <div className="flex items-center gap-3 flex-wrap">
          <p className="text-muted-foreground capitalize">{formattedDate}</p>
          {stats.daysToMatch !== null && (
            <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium border border-blue-100">
              🎯 {stats.daysToMatch} {t.dashboard.daysToMatch}
            </span>
          )}
        </div>
      </div>

      {/* ── 6 Stats cards (2 × 3) ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <StatCard
          label={t.dashboard.todayQuestions}
          value={stats.questionsToday}
          icon={<IconQuestions />}
          bg="#EFF6FF" iconColor="#2563EB"
          footer={<span style={{ color: deltaColor, fontSize: 11, fontWeight: 600 }}>{deltaText}</span>}
        />
        <StatCard
          label={t.dashboard.accuracyToday}
          value={stats.questionsToday > 0 ? `${stats.accuracyToday}%` : '—'}
          icon={<IconTarget />}
          bg={stats.accuracyToday >= 70 ? '#F0FDF4' : stats.accuracyToday >= 50 ? '#FFFBEB' : '#FEF2F2'}
          iconColor={stats.accuracyToday >= 70 ? '#16A34A' : stats.accuracyToday >= 50 ? '#D97706' : '#DC2626'}
          footer={stats.questionsToday > 0
            ? <span style={{ color: '#94a3b8', fontSize: 11 }}>{stats.questionsToday} {t.questions.answeredCount}</span>
            : null}
        />
        <StatCard
          label={t.label.streak}
          value={`${stats.streak} ${language === 'pt' ? (stats.streak === 1 ? 'dia' : 'dias') : language === 'es' ? (stats.streak === 1 ? 'día' : 'días') : (stats.streak === 1 ? 'day' : 'days')}`}
          icon={<IconFlame />}
          bg="#FFF7ED" iconColor="#EA580C"
          footer={<span style={{ color: '#94a3b8', fontSize: 11 }}>{t.dashboard.consecutiveDays}</span>}
        />
        <StatCard
          label={t.dashboard.totalAnswered}
          value={stats.totalQuestionsEver.toLocaleString(language === 'en' ? 'en-US' : 'pt-BR')}
          icon={<IconBook />}
          bg="#EEF2FF" iconColor="#4F46E5"
          footer={<span style={{ color: '#94a3b8', fontSize: 11 }}>{t.dashboard.sinceBeginning}</span>}
        />
        <StatCard
          label={t.dashboard.dueFlashcards}
          value={stats.dueFlashcards}
          icon={<IconClock />}
          bg={stats.dueFlashcards > 0 ? '#FEF2F2' : '#F0FDF4'}
          iconColor={stats.dueFlashcards > 0 ? '#DC2626' : '#16A34A'}
          footer={<span style={{ color: '#94a3b8', fontSize: 11 }}>
            {stats.dueFlashcards > 0 ? t.label.dueToday.toLowerCase() : t.msg.allUpToDate.toLowerCase()}
          </span>}
        />
        <StatCard
          label={t.dashboard.weeklyTime}
          value={formatStudyTime(stats.weeklyStudyMinutes)}
          icon={<IconTimer />}
          bg="#FAF5FF" iconColor="#9333EA"
          footer={<span style={{ color: '#94a3b8', fontSize: 11 }}>{t.dashboard.estimated}</span>}
        />
      </div>

      {/* ── Continuar de onde parou ── */}
      {(stats.lastSubjectStudied || stats.weakestSubject) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {stats.lastSubjectStudied && (
            <div className="bg-white border border-blue-100 rounded-2xl p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-0.5">{t.dashboard.resumeWhere}</p>
                <p className="font-semibold text-foreground truncate">{stats.lastSubjectStudied}</p>
                <Link
                  href="/dashboard/questions"
                  className="inline-block mt-2 text-xs font-medium text-blue-600 hover:text-blue-800 underline underline-offset-2"
                >
                  {language === 'en' ? 'Continue →' : language === 'es' ? 'Continuar →' : 'Continuar →'}
                </Link>
              </div>
            </div>
          )}
          {stats.weakestSubject && (
            <div className="bg-white border border-red-100 rounded-2xl p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0 text-red-500">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-0.5">{t.dashboard.weakestSpecialty}</p>
                <p className="font-semibold text-foreground truncate">{stats.weakestSubject.subject}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {stats.weakestSubject.percentage}% {t.label.accuracy.toLowerCase()}
                  {stats.weakestSubject.remaining > 0 && ` · ${stats.weakestSubject.remaining} ${t.dashboard.availableQ}`}
                </p>
                <Link
                  href="/dashboard/questions"
                  className="inline-block mt-2 text-xs font-medium text-red-600 hover:text-red-800 underline underline-offset-2"
                >
                  {language === 'en' ? 'Practice →' : language === 'es' ? 'Practicar →' : 'Praticar →'}
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Meta da semana ── */}
      <WeeklyGoalSection goal={stats.weeklyGoal} userId={userId} />

      {/* ── Charts row ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Progresso por especialidade — horizontal bar */}
        <div className="bg-white rounded-2xl p-6 border border-border">
          <h2 className="text-base font-semibold text-primary-700 mb-4">{t.dashboard.subjectProgress}</h2>
          {stats.subjectProgress.length > 0 ? (
            <ResponsiveContainer width="100%" height={Math.max(180, stats.subjectProgress.length * 32)}>
              <BarChart
                data={stats.subjectProgress}
                layout="vertical"
                margin={{ top: 0, right: 32, left: 0, bottom: 0 }}
              >
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={v => `${v}%`}
                />
                <YAxis
                  dataKey="subject"
                  type="category"
                  width={110}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  formatter={(value: number, _name: string, props: any) =>
                    [`${value}% (${props.payload.correct}/${props.payload.total})`, t.label.accuracy]}
                />
                <Bar dataKey="percentage" radius={[0, 4, 4, 0]} maxBarSize={18}>
                  {stats.subjectProgress.map((entry, i) => (
                    <Cell key={i} fill={barColor(entry.percentage)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState text={language === 'en' ? 'Answer questions to see your progress by subject.' : language === 'es' ? 'Responde preguntas para ver tu progreso por especialidad.' : 'Responda questões para ver seu progresso por especialidade.'} />
          )}
        </div>

        {/* Desempenho recente — line chart */}
        <div className="bg-white rounded-2xl p-6 border border-border">
          <h2 className="text-base font-semibold text-primary-700 mb-4">{t.dashboard.recentPerformance}</h2>
          {stats.weeklyActivity.some(d => d.questions > 0) ? (
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={stats.weeklyActivity} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  labelStyle={{ fontWeight: 600 }}
                />
                <Line
                  type="monotone"
                  dataKey="questions"
                  name={t.label.questions}
                  stroke="#1E3A5F"
                  strokeWidth={2.5}
                  dot={{ fill: '#1E3A5F', r: 3, strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="flashcards"
                  name={t.label.flashcards}
                  stroke="#93c5fd"
                  strokeWidth={2}
                  dot={{ fill: '#93c5fd', r: 3, strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState text={language === 'en' ? 'No activity this week yet. Start studying!' : language === 'es' ? 'Sin actividad esta semana. ¡Empieza a estudiar!' : 'Nenhuma atividade esta semana ainda. Comece estudando!'} />
          )}
        </div>
      </div>

      {/* ── Quick actions ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/dashboard/questions"
          className="group flex items-center gap-4 p-5 bg-primary-700 rounded-2xl hover:bg-primary-800 transition-colors"
        >
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">📝</div>
          <div>
            <p className="text-white font-semibold text-lg">{t.dashboard.practiceQuestions}</p>
            <p className="text-white/60 text-sm">{t.dashboard.usmleBank}</p>
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
            <p className="text-primary-700 font-semibold text-lg">{t.dashboard.reviewFlashcards}</p>
            <p className="text-muted-foreground text-sm">
              {stats.dueFlashcards > 0
                ? `${stats.dueFlashcards} ${t.dashboard.cardsToReview}`
                : t.msg.allUpToDate}
            </p>
          </div>
          <svg className="ml-auto w-5 h-5 text-muted-foreground group-hover:text-primary-700 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  )
}

// ── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  label, value, icon, bg, iconColor, footer,
}: {
  label: string
  value: string | number
  icon: React.ReactNode
  bg: string
  iconColor: string
  footer?: React.ReactNode
}) {
  return (
    <div className="rounded-2xl p-4 border border-border bg-white flex flex-col gap-2">
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: bg, color: iconColor }}
      >
        {icon}
      </div>
      <p className="text-2xl font-bold text-foreground leading-none">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
      {footer && <div>{footer}</div>}
    </div>
  )
}

// ── Weekly Goal ───────────────────────────────────────────────────────────────

function WeeklyGoalSection({ goal, userId }: { goal: WeeklyGoal; userId: string }) {
  const { t } = useTranslation()
  const [editing, setEditing] = useState(false)
  const [qGoal, setQGoal] = useState(goal.questionsGoal)
  const [fGoal, setFGoal] = useState(goal.flashcardsGoal)
  const [saving, setSaving] = useState(false)

  const qPct = Math.min(100, goal.questionsGoal > 0 ? Math.round((goal.questionsThisWeek / goal.questionsGoal) * 100) : 0)
  const fPct = Math.min(100, goal.flashcardsGoal > 0 ? Math.round((goal.flashcardsThisWeek / goal.flashcardsGoal) * 100) : 0)
  const avgPct = Math.round((qPct + fPct) / 2)

  const today = new Date()
  const daysRemaining = (7 - today.getDay()) % 7

  const motivationalMsg = avgPct >= 100 ? t.dashboard.motivDone
    : avgPct >= 70 ? t.dashboard.motivAlmost
    : avgPct >= 40 ? t.dashboard.motivGoing
    : t.dashboard.motivFocus

  const daysRemainingText = daysRemaining > 0
    ? `${daysRemaining} ${t.dashboard.daysRemaining}`
    : t.dashboard.lastDayWeek

  async function saveGoal() {
    setSaving(true)
    await fetch('/api/goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questions_goal: qGoal, flashcards_goal: fGoal, week_start: goal.weekStart, user_id: userId }),
    })
    setSaving(false)
    setEditing(false)
    window.location.reload()
  }

  return (
    <div className="bg-white rounded-2xl border border-border p-6 mb-8">
      <div className="flex items-start justify-between mb-1">
        <div>
          <h2 className="text-base font-semibold text-primary-700">{t.label.weeklyGoal}</h2>
          {!editing && (
            <p className="text-xs text-muted-foreground mt-0.5">{daysRemainingText}</p>
          )}
        </div>
        <button
          onClick={() => setEditing(e => !e)}
          className="text-xs text-muted-foreground hover:text-primary-700 transition-colors border border-border px-3 py-1.5 rounded-lg hover:border-primary/40"
        >
          {editing ? t.btn.cancel : t.btn.editGoal}
        </button>
      </div>

      {!editing && (
        <p className="text-sm font-medium mb-4" style={{ color: avgPct >= 70 ? '#16A34A' : avgPct >= 40 ? '#D97706' : '#DC2626' }}>
          {motivationalMsg}
        </p>
      )}

      {editing ? (
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <label className="text-sm text-foreground w-40">📝 {t.label.questions}/{t.nav.dashboard.toLowerCase().includes('panel') ? 'semana' : 'week'}</label>
            <input
              type="number" min={1} max={500} value={qGoal}
              onChange={e => setQGoal(Number(e.target.value))}
              className="border border-border rounded-lg px-3 py-1.5 text-sm w-24 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="text-sm text-foreground w-40">🃏 {t.label.flashcards}/{t.nav.dashboard.toLowerCase().includes('panel') ? 'semana' : 'week'}</label>
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
            {saving ? t.btn.saving : t.btn.saveGoal}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <GoalBar icon="📝" label={t.label.questions} current={goal.questionsThisWeek} goal={goal.questionsGoal} pct={qPct} />
          <GoalBar icon="🃏" label={t.label.flashcards} current={goal.flashcardsThisWeek} goal={goal.flashcardsGoal} pct={fPct} />
        </div>
      )}
    </div>
  )
}

function GoalBar({ icon, label, current, goal, pct }: {
  icon: string; label: string; current: number; goal: number; pct: number
}) {
  const { t } = useTranslation()
  const done = pct >= 100
  const color = done ? '#22C55E' : pct >= 70 ? '#16A34A' : pct >= 40 ? '#F59E0B' : '#EF4444'
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm text-foreground">{icon} {label}</span>
        <span className="text-xs font-semibold" style={{ color: done ? '#16A34A' : '#64748b' }}>
          {done ? t.label.goalReached : `${current} / ${goal}`}
        </span>
      </div>
      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <p className="text-xs text-muted-foreground mt-1">{pct}% {t.label.weeklyGoal.toLowerCase()}</p>
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

// ── SVG Icons ─────────────────────────────────────────────────────────────────

function IconQuestions() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  )
}

function IconTarget() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function IconFlame() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
    </svg>
  )
}

function IconBook() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  )
}

function IconClock() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function IconTimer() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}
