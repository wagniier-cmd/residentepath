'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Question, Flashcard, USMLEStep, Difficulty, QuestionSubject } from '@/types'

type Tab = 'questions' | 'flashcards' | 'stats'

const STEPS: USMLEStep[] = ['Step 1', 'Step 2CK', 'Step 3']
const DIFFICULTIES: Difficulty[] = ['Fácil', 'Médio', 'Difícil']
const SUBJECTS: QuestionSubject[] = [
  'Cardiologia', 'Neurologia', 'Gastroenterologia', 'Pneumologia', 'Nefrologia',
  'Endocrinologia', 'Hematologia', 'Infectologia', 'Reumatologia', 'Psiquiatria',
  'Pediatria', 'Ginecologia', 'Cirurgia', 'Farmacologia', 'Patologia',
  'Bioquímica', 'Microbiologia', 'Imunologia', 'Anatomia', 'Fisiologia',
]

const emptyQuestion = {
  stem: '', option_a: '', option_b: '', option_c: '', option_d: '', option_e: '',
  correct_answer: 'A' as 'A' | 'B' | 'C' | 'D' | 'E',
  explanation: '', usmle_step: 'Step 1' as USMLEStep,
  subject: 'Cardiologia' as QuestionSubject, difficulty: 'Médio' as Difficulty,
}

const emptyFlashcard = { front: '', back: '', subject: 'Cardiologia' as QuestionSubject }

interface StatsData {
  totalUsers: number
  totalQuestions: number
  totalFlashcards: number
  attemptsToday: number
  topUsers: { email: string; count: number }[]
}

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('questions')
  const [questions, setQuestions] = useState<Question[]>([])
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  // Question form
  const [qForm, setQForm] = useState(emptyQuestion)
  const [qSaving, setQSaving] = useState(false)

  // Flashcard form
  const [fForm, setFForm] = useState(emptyFlashcard)
  const [fSaving, setFSaving] = useState(false)

  const supabase = createClient()

  const notify = (type: 'ok' | 'err', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 4000)
  }

  const loadQuestions = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('questions').select('*').order('created_at', { ascending: false })
    setQuestions(data ?? [])
    setLoading(false)
  }, [supabase])

  const loadFlashcards = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('flashcards').select('*').order('created_at', { ascending: false })
    setFlashcards(data ?? [])
    setLoading(false)
  }, [supabase])

  const loadStats = useCallback(async () => {
    setLoading(true)
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const [
      { count: totalUsers },
      { count: totalQuestions },
      { count: totalFlashcards },
      { count: attemptsToday },
      { data: topRaw },
    ] = await Promise.all([
      supabase.from('user_profiles').select('*', { count: 'exact', head: true }),
      supabase.from('questions').select('*', { count: 'exact', head: true }),
      supabase.from('flashcards').select('*', { count: 'exact', head: true }),
      supabase.from('user_question_attempts')
        .select('*', { count: 'exact', head: true })
        .gte('answered_at', todayStart.toISOString()),
      supabase.from('user_question_attempts')
        .select('user_id')
        .limit(1000),
    ])

    // Count per user_id from raw data
    const countMap: Record<string, number> = {}
    for (const r of topRaw ?? []) {
      countMap[r.user_id] = (countMap[r.user_id] ?? 0) + 1
    }
    const sorted = Object.entries(countMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)

    // Fetch emails for top users
    const topUsers: { email: string; count: number }[] = []
    for (const [userId, count] of sorted) {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('email')
        .eq('id', userId)
        .single()
      topUsers.push({ email: profile?.email ?? userId, count })
    }

    setStats({
      totalUsers: totalUsers ?? 0,
      totalQuestions: totalQuestions ?? 0,
      totalFlashcards: totalFlashcards ?? 0,
      attemptsToday: attemptsToday ?? 0,
      topUsers,
    })
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    if (tab === 'questions') loadQuestions()
    else if (tab === 'flashcards') loadFlashcards()
    else loadStats()
  }, [tab, loadQuestions, loadFlashcards, loadStats])

  async function handleAddQuestion(e: React.FormEvent) {
    e.preventDefault()
    setQSaving(true)
    const { error } = await supabase.from('questions').insert(qForm)
    if (error) {
      notify('err', error.message)
    } else {
      notify('ok', 'Questão adicionada com sucesso!')
      setQForm(emptyQuestion)
      loadQuestions()
    }
    setQSaving(false)
  }

  async function handleDeleteQuestion(id: string) {
    if (!confirm('Deletar esta questão?')) return
    const { error } = await supabase.from('questions').delete().eq('id', id)
    if (error) notify('err', error.message)
    else { notify('ok', 'Questão deletada.'); loadQuestions() }
  }

  async function handleAddFlashcard(e: React.FormEvent) {
    e.preventDefault()
    setFSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase.from('flashcards').insert({ ...fForm, created_by: user?.id })
    if (error) {
      notify('err', error.message)
    } else {
      notify('ok', 'Flashcard adicionado!')
      setFForm(emptyFlashcard)
      loadFlashcards()
    }
    setFSaving(false)
  }

  async function handleDeleteFlashcard(id: string) {
    if (!confirm('Deletar este flashcard?')) return
    const { error } = await supabase.from('flashcards').delete().eq('id', id)
    if (error) notify('err', error.message)
    else { notify('ok', 'Flashcard deletado.'); loadFlashcards() }
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-primary-700">Painel Administrativo</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Gerencie questões, flashcards e veja estatísticas</p>
        </div>
        <span className="text-xs px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-medium">
          🔒 Acesso restrito
        </span>
      </div>

      {/* Notification */}
      {message && (
        <div className={`mb-4 px-4 py-3 rounded-xl text-sm font-medium animate-fade-in ${
          message.type === 'ok' ? 'bg-correct-light text-correct border border-correct/20' : 'bg-incorrect-light text-incorrect border border-incorrect/20'
        }`}>
          {message.type === 'ok' ? '✅' : '❌'} {message.text}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 w-fit">
        {(['questions', 'flashcards', 'stats'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === t ? 'bg-white text-primary-700 shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t === 'questions' ? 'Questões' : t === 'flashcards' ? 'Flashcards' : 'Estatísticas'}
          </button>
        ))}
      </div>

      {/* ─── TAB: QUESTIONS ─── */}
      {tab === 'questions' && (
        <div className="space-y-6">
          {/* Form */}
          <div className="bg-white rounded-2xl border border-border p-6">
            <h2 className="text-lg font-semibold text-primary-700 mb-4">Nova Questão</h2>
            <form onSubmit={handleAddQuestion} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Step</label>
                  <select value={qForm.usmle_step} onChange={e => setQForm(f => ({ ...f, usmle_step: e.target.value as USMLEStep }))}
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                    {STEPS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Especialidade</label>
                  <select value={qForm.subject} onChange={e => setQForm(f => ({ ...f, subject: e.target.value as QuestionSubject }))}
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                    {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Dificuldade</label>
                  <select value={qForm.difficulty} onChange={e => setQForm(f => ({ ...f, difficulty: e.target.value as Difficulty }))}
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                    {DIFFICULTIES.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Enunciado (Stem)</label>
                <textarea required rows={4} value={qForm.stem}
                  onChange={e => setQForm(f => ({ ...f, stem: e.target.value }))}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  placeholder="Texto completo da questão..." />
              </div>

              <div className="grid grid-cols-1 gap-2">
                {(['A', 'B', 'C', 'D', 'E'] as const).map(key => (
                  <div key={key} className="flex items-center gap-2">
                    <span className="w-6 text-xs font-bold text-primary-700 shrink-0">{key}.</span>
                    <input required type="text"
                      value={qForm[`option_${key.toLowerCase()}` as keyof typeof qForm] as string}
                      onChange={e => setQForm(f => ({ ...f, [`option_${key.toLowerCase()}`]: e.target.value }))}
                      className="flex-1 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder={`Opção ${key}`} />
                    <label className="flex items-center gap-1 text-xs text-muted-foreground shrink-0 cursor-pointer">
                      <input type="radio" name="correct" value={key} checked={qForm.correct_answer === key}
                        onChange={() => setQForm(f => ({ ...f, correct_answer: key }))} />
                      Correta
                    </label>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Explicação</label>
                <textarea required rows={3} value={qForm.explanation}
                  onChange={e => setQForm(f => ({ ...f, explanation: e.target.value }))}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  placeholder="Explicação da resposta correta..." />
              </div>

              <button type="submit" disabled={qSaving}
                className="px-6 py-2.5 bg-primary-700 text-white rounded-xl text-sm font-medium hover:bg-primary-800 disabled:opacity-50 transition-colors">
                {qSaving ? 'Salvando...' : '+ Adicionar Questão'}
              </button>
            </form>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h2 className="text-base font-semibold text-primary-700">
                Questões ({questions.length})
              </h2>
              {loading && <span className="text-xs text-muted-foreground">Carregando...</span>}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-border">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Enunciado</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Step</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Especialidade</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Dificuldade</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Resp.</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {questions.map(q => (
                    <tr key={q.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 max-w-xs">
                        <p className="line-clamp-2 text-xs text-foreground">{q.stem}</p>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 font-medium">{q.usmle_step}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{q.subject}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{q.difficulty}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-bold text-primary-700">{q.correct_answer}</span>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => handleDeleteQuestion(q.id)}
                          className="text-xs text-incorrect hover:text-incorrect/70 transition-colors font-medium">
                          Deletar
                        </button>
                      </td>
                    </tr>
                  ))}
                  {questions.length === 0 && !loading && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground text-sm">
                        Nenhuma questão cadastrada ainda.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB: FLASHCARDS ─── */}
      {tab === 'flashcards' && (
        <div className="space-y-6">
          {/* Form */}
          <div className="bg-white rounded-2xl border border-border p-6">
            <h2 className="text-lg font-semibold text-primary-700 mb-4">Novo Flashcard</h2>
            <form onSubmit={handleAddFlashcard} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Especialidade</label>
                <select value={fForm.subject} onChange={e => setFForm(f => ({ ...f, subject: e.target.value as QuestionSubject }))}
                  className="w-64 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                  {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Frente (pergunta)</label>
                <textarea required rows={3} value={fForm.front}
                  onChange={e => setFForm(f => ({ ...f, front: e.target.value }))}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  placeholder="Escreva a pergunta do flashcard..." />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Verso (resposta)</label>
                <textarea required rows={3} value={fForm.back}
                  onChange={e => setFForm(f => ({ ...f, back: e.target.value }))}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  placeholder="Escreva a resposta completa..." />
              </div>
              <button type="submit" disabled={fSaving}
                className="px-6 py-2.5 bg-primary-700 text-white rounded-xl text-sm font-medium hover:bg-primary-800 disabled:opacity-50 transition-colors">
                {fSaving ? 'Salvando...' : '+ Adicionar Flashcard'}
              </button>
            </form>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h2 className="text-base font-semibold text-primary-700">
                Flashcards ({flashcards.length})
              </h2>
              {loading && <span className="text-xs text-muted-foreground">Carregando...</span>}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-border">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Frente</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Verso</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Especialidade</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {flashcards.map(fc => (
                    <tr key={fc.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 max-w-xs">
                        <p className="line-clamp-2 text-xs text-foreground">{fc.front}</p>
                      </td>
                      <td className="px-4 py-3 max-w-xs">
                        <p className="line-clamp-2 text-xs text-muted-foreground">{fc.back}</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{fc.subject}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => handleDeleteFlashcard(fc.id)}
                          className="text-xs text-incorrect hover:text-incorrect/70 transition-colors font-medium">
                          Deletar
                        </button>
                      </td>
                    </tr>
                  ))}
                  {flashcards.length === 0 && !loading && (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground text-sm">
                        Nenhum flashcard cadastrado ainda.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB: STATS ─── */}
      {tab === 'stats' && (
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-16 text-muted-foreground text-sm">Carregando estatísticas...</div>
          ) : stats ? (
            <>
              {/* Summary cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Usuários cadastrados" value={stats.totalUsers} icon="👥" />
                <StatCard label="Questões no banco" value={stats.totalQuestions} icon="📝" />
                <StatCard label="Flashcards no banco" value={stats.totalFlashcards} icon="🃏" />
                <StatCard label="Tentativas hoje" value={stats.attemptsToday} icon="⚡" />
              </div>

              {/* Top users */}
              <div className="bg-white rounded-2xl border border-border overflow-hidden">
                <div className="px-6 py-4 border-b border-border">
                  <h2 className="text-base font-semibold text-primary-700">Top 5 usuários mais ativos</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Por total de tentativas de questões</p>
                </div>
                {stats.topUsers.length === 0 ? (
                  <p className="px-6 py-8 text-center text-muted-foreground text-sm">Nenhuma tentativa registrada ainda.</p>
                ) : (
                  <div className="divide-y divide-border">
                    {stats.topUsers.map((u, i) => (
                      <div key={u.email} className="px-6 py-3.5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold ${
                            i === 0 ? 'bg-amber-100 text-amber-700' :
                            i === 1 ? 'bg-gray-100 text-gray-600' :
                            i === 2 ? 'bg-orange-50 text-orange-600' :
                            'bg-gray-50 text-gray-500'
                          }`}>
                            {i + 1}
                          </span>
                          <span className="text-sm text-foreground">{u.email}</span>
                        </div>
                        <span className="text-sm font-semibold text-primary-700">{u.count} tentativas</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : null}
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, icon }: { label: string; value: number; icon: string }) {
  return (
    <div className="bg-white rounded-2xl border border-border p-5">
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-2xl font-bold text-primary-700">{value.toLocaleString('pt-BR')}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  )
}
