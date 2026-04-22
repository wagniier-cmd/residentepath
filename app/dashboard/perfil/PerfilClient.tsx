'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { UserPlan } from '@/lib/subscription'

interface Profile {
  id: string
  email: string
  full_name: string
  medical_school: string
  graduation_year: number
  target_match_year: number
}

interface Stats {
  totalAttempts: number
  totalCorrect: number
  totalFlashcardsReviewed: number
  streak: number
  uniqueDays: number
}

interface SubjectStat {
  subject: string
  total: number
  correct: number
}

type Subscription = {
  plan: string
  status: string
  trial_ends_at: string | null
  created_at: string
} | null

interface Props {
  profile: Profile
  stats: Stats
  subjectStats: SubjectStat[]
  userPlan: UserPlan
  subscription: Subscription
}

const PLAN_LABELS: Record<string, string> = {
  free: 'Free',
  starter: 'Starter',
  pro: 'Pro',
  elite: 'Elite',
}

const PLAN_COLORS: Record<string, string> = {
  free: 'bg-gray-100 text-gray-600',
  starter: 'bg-blue-50 text-blue-700',
  pro: 'bg-primary-100 text-primary-700',
  elite: 'bg-amber-50 text-amber-700',
}

const currentYear = new Date().getFullYear()
const gradYears = Array.from({ length: 15 }, (_, i) => currentYear - 7 + i)
const matchYears = Array.from({ length: 12 }, (_, i) => currentYear + i)

export default function PerfilClient({ profile: initialProfile, stats, subjectStats, userPlan, subscription }: Props) {
  const [profile, setProfile] = useState<Profile>(initialProfile)
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState<'ok' | 'err' | null>(null)

  const globalPct = stats.totalAttempts > 0
    ? Math.round((stats.totalCorrect / stats.totalAttempts) * 100)
    : 0

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSaveMsg(null)
    const supabase = createClient()
    const { error } = await supabase.from('user_profiles').update({
      full_name: profile.full_name,
      medical_school: profile.medical_school,
      graduation_year: profile.graduation_year,
      target_match_year: profile.target_match_year,
    }).eq('id', profile.id)
    setSaveMsg(error ? 'err' : 'ok')
    setTimeout(() => setSaveMsg(null), 3000)
    setSaving(false)
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-3xl text-primary-700 mb-1">Meu Perfil</h1>
        <p className="text-muted-foreground text-sm">Gerencie seus dados e acompanhe seu progresso</p>
      </div>

      {/* ─── DADOS PESSOAIS ─── */}
      <section className="bg-white rounded-2xl border border-border p-6">
        <h2 className="text-base font-semibold text-primary-700 mb-4 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Dados Pessoais
        </h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Nome completo</label>
              <input type="text" required value={profile.full_name}
                onChange={e => setProfile(p => ({ ...p, full_name: e.target.value }))}
                className="w-full border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Email</label>
              <input type="email" disabled value={profile.email}
                className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-gray-50 text-muted-foreground cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Faculdade de Medicina</label>
              <input type="text" value={profile.medical_school}
                onChange={e => setProfile(p => ({ ...p, medical_school: e.target.value }))}
                className="w-full border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Ano de formatura</label>
                <select value={profile.graduation_year}
                  onChange={e => setProfile(p => ({ ...p, graduation_year: parseInt(e.target.value) }))}
                  className="w-full border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white">
                  {gradYears.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Meta do Match</label>
                <select value={profile.target_match_year}
                  onChange={e => setProfile(p => ({ ...p, target_match_year: parseInt(e.target.value) }))}
                  className="w-full border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white">
                  {matchYears.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button type="submit" disabled={saving}
              className="px-5 py-2.5 bg-primary-700 text-white rounded-xl text-sm font-medium hover:bg-primary-800 disabled:opacity-50 transition-colors">
              {saving ? 'Salvando...' : 'Salvar alterações'}
            </button>
            {saveMsg === 'ok' && (
              <span className="text-sm text-correct font-medium animate-fade-in">✓ Dados salvos!</span>
            )}
            {saveMsg === 'err' && (
              <span className="text-sm text-incorrect font-medium animate-fade-in">✗ Erro ao salvar</span>
            )}
          </div>
        </form>
      </section>

      {/* ─── PROGRESSO GERAL ─── */}
      <section className="bg-white rounded-2xl border border-border p-6">
        <h2 className="text-base font-semibold text-primary-700 mb-4 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Progresso Geral
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatTile
            value={stats.totalAttempts.toLocaleString('pt-BR')}
            label="Questões respondidas"
            icon="📝"
          />
          <StatTile
            value={`${globalPct}%`}
            label="Acerto geral"
            icon="🎯"
            color={globalPct >= 70 ? 'text-correct' : globalPct >= 50 ? 'text-amber-600' : 'text-incorrect'}
          />
          <StatTile
            value={stats.totalFlashcardsReviewed.toLocaleString('pt-BR')}
            label="Flashcards revisados"
            icon="🃏"
          />
          <StatTile
            value={`${stats.streak}d`}
            label="Sequência atual"
            icon="🔥"
            color={stats.streak >= 7 ? 'text-amber-600' : undefined}
          />
          <StatTile
            value={stats.uniqueDays.toLocaleString('pt-BR')}
            label="Dias estudados"
            icon="📅"
          />
        </div>
      </section>

      {/* ─── PROGRESSO POR ESPECIALIDADE ─── */}
      {subjectStats.length > 0 && (
        <section className="bg-white rounded-2xl border border-border p-6">
          <h2 className="text-base font-semibold text-primary-700 mb-4 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Progresso por Especialidade
          </h2>
          <div className="space-y-3">
            {subjectStats.map(s => {
              const pct = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0
              return (
                <div key={s.subject}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-foreground">{s.subject}</span>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{s.total} questão{s.total !== 1 ? 'ões' : ''}</span>
                      <span className={`font-semibold ${pct >= 70 ? 'text-correct' : pct >= 50 ? 'text-amber-600' : 'text-incorrect'}`}>
                        {pct}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${pct >= 70 ? 'bg-correct' : pct >= 50 ? 'bg-amber-400' : 'bg-incorrect'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* ─── PLANO ATUAL ─── */}
      <section className="bg-white rounded-2xl border border-border p-6">
        <h2 className="text-base font-semibold text-primary-700 mb-4 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          Plano Atual
        </h2>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={`text-sm px-3 py-1 rounded-full font-semibold ${PLAN_COLORS[userPlan.plan] ?? PLAN_COLORS.free}`}>
                {PLAN_LABELS[userPlan.plan] ?? userPlan.plan}
              </span>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                userPlan.isActive ? 'bg-correct-light text-correct' : 'bg-incorrect-light text-incorrect'
              }`}>
                {userPlan.isActive ? '✓ Ativo' : '✗ Inativo'}
              </span>
            </div>

            {subscription?.status === 'trial' && subscription.trial_ends_at && (
              <p className="text-sm text-muted-foreground">
                Trial até{' '}
                <span className="font-medium text-foreground">
                  {new Date(subscription.trial_ends_at).toLocaleDateString('pt-BR')}
                </span>
              </p>
            )}

            {!userPlan.canAccessUnlimited && (
              <p className="text-xs text-muted-foreground">
                Limite diário: <span className="font-medium text-foreground">{userPlan.dailyLimit} questões</span>
              </p>
            )}

            {userPlan.canAccessUnlimited && (
              <p className="text-xs text-correct font-medium">✓ Questões ilimitadas</p>
            )}
          </div>

          {userPlan.plan !== 'elite' && (
            <Link
              href="/#planos"
              className="px-5 py-2.5 bg-primary-700 text-white rounded-xl text-sm font-medium hover:bg-primary-800 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              Fazer upgrade
            </Link>
          )}
        </div>
      </section>
    </div>
  )
}

function StatTile({ value, label, icon, color }: { value: string; label: string; icon: string; color?: string }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 text-center">
      <div className="text-xl mb-1">{icon}</div>
      <div className={`text-xl font-bold ${color ?? 'text-primary-700'}`}>{value}</div>
      <div className="text-xs text-muted-foreground mt-0.5 leading-tight">{label}</div>
    </div>
  )
}
