'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useTranslate } from '@/lib/useTranslate'
import type { Question, USMLEStep, QuestionSubject } from '@/types'

const STEPS: (USMLEStep | 'Todos')[] = ['Todos', 'Step 1', 'Step 2CK', 'Step 3']
const COUNTS = [10, 20, 40]
const SECS_PER_QUESTION = 80 // 1min 20s — USMLE standard

interface Props {
  questions: Question[]
  userId: string
  translationLanguage?: string
}

type Mode = 'config' | 'exam' | 'results'

interface Answer {
  questionId: string
  selected: string | null
  flagged: boolean
}

interface SubjectResult {
  subject: string
  correct: number
  total: number
}

const LANG_FLAG: Record<string, string> = { pt: '🇧🇷', es: '🇪🇸' }

export default function SimuladoClient({ questions, userId, translationLanguage = 'pt' }: Props) {
  const { translate, translations, loading: tlLoading, visible, reset: resetTranslations } = useTranslate(translationLanguage)
  const [mode, setMode] = useState<Mode>('config')

  // Config state
  const [cfgStep, setCfgStep] = useState<USMLEStep | 'Todos'>('Todos')
  const [cfgSubject, setCfgSubject] = useState<QuestionSubject | 'Todas'>('Todas')
  const [cfgCount, setCfgCount] = useState(20)

  // Exam state
  const [examQuestions, setExamQuestions] = useState<Question[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [timeLeft, setTimeLeft] = useState(0)
  const [totalTime, setTotalTime] = useState(0)
  const [finished, setFinished] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const subjects = ['Todas', ...Array.from(new Set(questions.map(q => q.subject))).sort()] as (QuestionSubject | 'Todas')[]

  const finish = useCallback(async (answersSnapshot: Answer[], qs: Question[]) => {
    if (timerRef.current) clearInterval(timerRef.current)
    setFinished(true)

    const supabase = createClient()
    const rows = answersSnapshot
      .filter(a => a.selected !== null)
      .map(a => {
        const q = qs.find(x => x.id === a.questionId)!
        return {
          user_id: userId,
          question_id: a.questionId,
          selected_answer: a.selected,
          is_correct: a.selected === q.correct_answer,
        }
      })

    if (rows.length > 0) {
      await supabase.from('user_question_attempts').upsert(rows, { onConflict: 'user_id,question_id' })
    }

    setMode('results')
  }, [userId])

  // Timer
  useEffect(() => {
    if (mode !== 'exam' || finished) return
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          finish(answers, examQuestions)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [mode, finished, finish, answers, examQuestions])

  function startExam() {
    let pool = questions.filter(q => {
      if (cfgStep !== 'Todos' && q.usmle_step !== cfgStep) return false
      if (cfgSubject !== 'Todas' && q.subject !== cfgSubject) return false
      return true
    })

    // Shuffle
    pool = pool.sort(() => Math.random() - 0.5).slice(0, cfgCount)

    const total = pool.length * SECS_PER_QUESTION
    setExamQuestions(pool)
    setAnswers(pool.map(q => ({ questionId: q.id, selected: null, flagged: false })))
    setCurrentIdx(0)
    setTimeLeft(total)
    setTotalTime(total)
    setFinished(false)
    setMode('exam')
  }

  function selectAnswer(key: string) {
    setAnswers(prev => prev.map((a, i) => i === currentIdx ? { ...a, selected: key } : a))
  }

  function toggleFlag() {
    setAnswers(prev => prev.map((a, i) => i === currentIdx ? { ...a, flagged: !a.flagged } : a))
  }

  function goNext() {
    resetTranslations()
    if (currentIdx < examQuestions.length - 1) {
      setCurrentIdx(i => i + 1)
    } else {
      finish(answers, examQuestions)
    }
  }

  function goPrev() {
    if (currentIdx > 0) setCurrentIdx(i => i - 1)
  }

  // ─── CONFIG SCREEN ───
  if (mode === 'config') {
    const available = questions.filter(q => {
      if (cfgStep !== 'Todos' && q.usmle_step !== cfgStep) return false
      if (cfgSubject !== 'Todas' && q.subject !== cfgSubject) return false
      return true
    }).length

    return (
      <div className="animate-fade-in max-w-xl mx-auto">
        <div className="mb-8 text-center">
          <div className="text-5xl mb-3">⏱️</div>
          <h1 className="text-3xl text-primary-700">Modo Simulado</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Condições reais do USMLE — 1 min 20 seg por questão, sem gabarito durante a prova
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-border p-6 space-y-5">
          {/* Step */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Step</label>
            <div className="flex flex-wrap gap-2">
              {STEPS.map(s => (
                <button key={s} onClick={() => setCfgStep(s)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
                    cfgStep === s
                      ? 'bg-primary-700 border-primary-700 text-white'
                      : 'border-border text-muted-foreground hover:border-primary-300 hover:text-foreground'
                  }`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Especialidade</label>
            <select value={cfgSubject}
              onChange={e => setCfgSubject(e.target.value as QuestionSubject | 'Todas')}
              className="w-full border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white">
              {subjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Count */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Número de questões</label>
            <div className="flex gap-2">
              {COUNTS.map(n => (
                <button key={n} onClick={() => setCfgCount(n)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                    cfgCount === n
                      ? 'bg-primary-700 border-primary-700 text-white'
                      : 'border-border text-muted-foreground hover:border-primary-300 hover:text-foreground'
                  }`}>
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="bg-primary-50 rounded-xl p-4 space-y-1 text-xs text-primary-700">
            <p>📋 <strong>{available}</strong> questões disponíveis com esses filtros</p>
            <p>⏱️ Tempo total: <strong>{formatTime(Math.min(cfgCount, available) * SECS_PER_QUESTION)}</strong></p>
            <p>❓ Serão sorteadas <strong>{Math.min(cfgCount, available)}</strong> questões aleatoriamente</p>
          </div>

          <button
            onClick={startExam}
            disabled={available === 0}
            className="w-full py-3 bg-primary-700 text-white rounded-xl font-medium text-sm hover:bg-primary-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Iniciar Simulado
          </button>
        </div>
      </div>
    )
  }

  // ─── EXAM SCREEN ───
  if (mode === 'exam') {
    const question = examQuestions[currentIdx]
    const answer = answers[currentIdx]
    const pct = (timeLeft / totalTime) * 100
    const timerColor = pct > 50 ? 'bg-correct' : pct > 20 ? 'bg-amber-500' : 'bg-incorrect'
    const flaggedCount = answers.filter(a => a.flagged).length
    const answeredCount = answers.filter(a => a.selected !== null).length

    const options: { key: 'A' | 'B' | 'C' | 'D' | 'E'; text: string }[] = [
      { key: 'A', text: question.option_a },
      { key: 'B', text: question.option_b },
      { key: 'C', text: question.option_c },
      { key: 'D', text: question.option_d },
      { key: 'E', text: question.option_e },
    ]

    return (
      <div className="animate-fade-in">
        {/* Header — timer + progress */}
        <div className="bg-white rounded-2xl border border-border p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className={`text-2xl font-mono font-bold ${timeLeft < 60 ? 'text-incorrect' : timeLeft < 180 ? 'text-amber-600' : 'text-primary-700'}`}>
                {formatTime(timeLeft)}
              </span>
              <span className="text-xs text-muted-foreground">
                {answeredCount}/{examQuestions.length} respondidas
                {flaggedCount > 0 && <span className="ml-2 text-amber-600">🚩 {flaggedCount} marcadas</span>}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {currentIdx + 1} / {examQuestions.length}
              </span>
              <button
                onClick={() => { if (confirm('Finalizar simulado agora?')) finish(answers, examQuestions) }}
                className="px-3 py-1.5 text-xs font-medium text-incorrect border border-incorrect/30 rounded-lg hover:bg-incorrect-light transition-colors">
                Finalizar
              </button>
            </div>
          </div>

          {/* Timer bar */}
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-2">
            <div className={`h-full rounded-full transition-all duration-1000 ${timerColor}`}
              style={{ width: `${pct}%` }} />
          </div>

          {/* Question dot nav */}
          <div className="flex flex-wrap gap-1 mt-2">
            {examQuestions.map((_, i) => {
              const a = answers[i]
              const isCurrent = i === currentIdx
              return (
                <button key={i} onClick={() => setCurrentIdx(i)}
                  className={`w-6 h-6 rounded text-xs font-medium transition-all ${
                    isCurrent
                      ? 'bg-primary-700 text-white'
                      : a.flagged
                      ? 'bg-amber-100 text-amber-700 border border-amber-300'
                      : a.selected
                      ? 'bg-primary-100 text-primary-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                  {i + 1}
                </button>
              )
            })}
          </div>
        </div>

        {/* Question card */}
        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-border flex items-center gap-2 flex-wrap">
            <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-primary-100 text-primary-700">{question.usmle_step}</span>
            <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-gray-100 text-gray-600">{question.subject}</span>
            <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-gray-100 text-gray-600">{question.difficulty}</span>
            {answer.flagged && (
              <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-amber-50 text-amber-700 border border-amber-200">
                🚩 Marcada para revisão
              </span>
            )}
          </div>

          <div className="px-6 pt-6 pb-2">
            <p className="text-foreground leading-relaxed text-base">{question.stem}</p>
          </div>

          {/* Inline translation */}
          {visible[`stem-${question.id}`] && (
            <div className="mx-6 mb-2 px-4 py-3 rounded-xl bg-blue-50 border border-blue-100">
              <p className="text-xs font-semibold text-blue-600 mb-1">{LANG_FLAG[translationLanguage] ?? '🌐'} Tradução</p>
              {tlLoading[`stem-${question.id}`]
                ? <p className="text-xs text-muted-foreground animate-pulse">Traduzindo...</p>
                : <p className="text-sm text-foreground leading-relaxed">{translations[`stem-${question.id}`]}</p>
              }
            </div>
          )}

          <div className="px-6 pb-4">
            <button
              onClick={() => translate(`stem-${question.id}`, question.stem)}
              disabled={!!tlLoading[`stem-${question.id}`]}
              className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg border border-blue-200 text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors disabled:opacity-50"
            >
              {tlLoading[`stem-${question.id}`]
                ? <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                : <span>{LANG_FLAG[translationLanguage] ?? '🌐'}</span>
              }
              {visible[`stem-${question.id}`] ? 'Ocultar' : 'Traduzir'}
            </button>
          </div>

          <div className="px-6 pb-6 space-y-3">
            {options.map(opt => (
              <button key={opt.key} onClick={() => selectAnswer(opt.key)}
                className={`w-full text-left flex gap-3 items-start px-4 py-3 rounded-xl border-2 transition-all text-sm ${
                  answer.selected === opt.key
                    ? 'border-primary-700 bg-primary-50 text-primary-900'
                    : 'border-border hover:border-primary/40 hover:bg-primary-50/30'
                }`}>
                <span className="font-bold min-w-[20px] mt-0.5">{opt.key}.</span>
                <span>{opt.text}</span>
                {answer.selected === opt.key && (
                  <svg className="ml-auto mt-0.5 w-4 h-4 text-primary-700 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>

          <div className="px-6 py-4 border-t border-border flex items-center justify-between gap-3">
            <button onClick={goPrev} disabled={currentIdx === 0}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Anterior
            </button>

            <button onClick={toggleFlag}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
                answer.flagged
                  ? 'bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100'
                  : 'border-border text-muted-foreground hover:border-amber-300 hover:text-amber-600'
              }`}>
              🚩 {answer.flagged ? 'Remover flag' : 'Marcar para revisão'}
            </button>

            <button onClick={goNext}
              className="flex items-center gap-1.5 text-sm font-medium px-5 py-2 bg-primary-700 text-white rounded-xl hover:bg-primary-800 transition-colors">
              {currentIdx === examQuestions.length - 1 ? 'Finalizar' : 'Próxima'}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ─── RESULTS SCREEN ───
  const totalAnswered = answers.filter(a => a.selected !== null).length
  const totalCorrect = answers.filter(a => {
    const q = examQuestions.find(x => x.id === a.questionId)!
    return a.selected === q?.correct_answer
  }).length
  const score = totalAnswered > 0 ? Math.round((totalCorrect / examQuestions.length) * 100) : 0

  // Per-subject breakdown
  const subjectMap: Record<string, SubjectResult> = {}
  for (const q of examQuestions) {
    if (!subjectMap[q.subject]) subjectMap[q.subject] = { subject: q.subject, correct: 0, total: 0 }
    subjectMap[q.subject].total++
    const a = answers.find(x => x.questionId === q.id)
    if (a?.selected === q.correct_answer) subjectMap[q.subject].correct++
  }
  const subjectResults = Object.values(subjectMap).sort((a, b) => b.total - a.total)

  const flaggedQuestions = answers
    .filter(a => a.flagged)
    .map(a => ({ answer: a, question: examQuestions.find(q => q.id === a.questionId)! }))
    .filter(x => x.question)

  const timeUsed = totalTime - timeLeft
  const scoreColor = score >= 70 ? 'text-correct' : score >= 50 ? 'text-amber-600' : 'text-incorrect'

  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">{score >= 70 ? '🎉' : score >= 50 ? '📊' : '💪'}</div>
        <h1 className="text-3xl text-primary-700 mb-1">Simulado Concluído</h1>
        <p className="text-muted-foreground text-sm">
          Tempo utilizado: {formatTime(timeUsed)} de {formatTime(totalTime)}
        </p>
      </div>

      {/* Score card */}
      <div className="bg-white rounded-2xl border border-border p-6 mb-6 text-center">
        <div className={`text-6xl font-bold mb-1 ${scoreColor}`}>{score}%</div>
        <p className="text-muted-foreground text-sm mb-4">
          {totalCorrect} de {examQuestions.length} questões corretas
          {totalAnswered < examQuestions.length && (
            <span className="ml-2 text-amber-600">({examQuestions.length - totalAnswered} não respondidas)</span>
          )}
        </p>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden max-w-xs mx-auto">
          <div className={`h-full rounded-full transition-all ${score >= 70 ? 'bg-correct' : score >= 50 ? 'bg-amber-500' : 'bg-incorrect'}`}
            style={{ width: `${score}%` }} />
        </div>
        <div className="flex justify-center gap-6 mt-4 text-xs text-muted-foreground">
          <span className="text-correct font-medium">✓ {totalCorrect} corretas</span>
          <span className="text-incorrect font-medium">✗ {totalAnswered - totalCorrect} erradas</span>
          {examQuestions.length - totalAnswered > 0 && (
            <span className="text-amber-600 font-medium">— {examQuestions.length - totalAnswered} em branco</span>
          )}
        </div>
      </div>

      {/* Subject breakdown */}
      <div className="bg-white rounded-2xl border border-border p-6 mb-6">
        <h2 className="text-base font-semibold text-primary-700 mb-4">Desempenho por Especialidade</h2>
        <div className="space-y-3">
          {subjectResults.map(sr => {
            const pct = sr.total > 0 ? Math.round((sr.correct / sr.total) * 100) : 0
            return (
              <div key={sr.subject}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-foreground">{sr.subject}</span>
                  <span className={`text-xs font-semibold ${pct >= 70 ? 'text-correct' : pct >= 50 ? 'text-amber-600' : 'text-incorrect'}`}>
                    {sr.correct}/{sr.total} ({pct}%)
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${pct >= 70 ? 'bg-correct' : pct >= 50 ? 'bg-amber-400' : 'bg-incorrect'}`}
                    style={{ width: `${pct}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Flagged questions */}
      {flaggedQuestions.length > 0 && (
        <div className="bg-white rounded-2xl border border-border overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-border bg-amber-50">
            <h2 className="text-base font-semibold text-amber-700">
              🚩 Questões marcadas para revisão ({flaggedQuestions.length})
            </h2>
          </div>
          <div className="divide-y divide-border">
            {flaggedQuestions.map(({ answer, question }, i) => {
              const wasCorrect = answer.selected === question.correct_answer
              return (
                <div key={question.id} className="px-6 py-4">
                  <div className="flex items-start gap-3">
                    <span className="text-xs font-bold text-muted-foreground mt-0.5 shrink-0">#{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground line-clamp-2 mb-2">{question.stem}</p>
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{question.subject}</span>
                        {answer.selected ? (
                          <span className={`px-2 py-0.5 rounded-full font-medium ${wasCorrect ? 'bg-correct-light text-correct' : 'bg-incorrect-light text-incorrect'}`}>
                            {wasCorrect ? `✓ Respondeu ${answer.selected} — Correto` : `✗ Respondeu ${answer.selected} — Correto: ${question.correct_answer}`}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">Não respondida — Correto: {question.correct_answer}</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{question.explanation}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="flex gap-3 justify-center">
        <button onClick={() => setMode('config')}
          className="px-6 py-2.5 bg-white border border-border text-primary-700 rounded-xl text-sm font-medium hover:bg-primary-50 transition-colors">
          ← Novo simulado
        </button>
      </div>
    </div>
  )
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}h ${String(m).padStart(2, '0')}m`
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}
