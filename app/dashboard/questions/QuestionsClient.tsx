'use client'

import { useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Question } from '@/types'
import type { UserPlan } from '@/lib/subscription'

interface Attempt {
  question_id: string
  is_correct: boolean
  selected_answer: string
  answered_at: string
}

interface Props {
  questions: Question[]
  attempts: Attempt[]
  userId: string
  userPlan: UserPlan
  answeredToday: number
}

const STEPS = ['Todos', 'Step 1', 'Step 2CK', 'Step 3']
const DIFFICULTIES = ['Todas', 'Fácil', 'Médio', 'Difícil']

export default function QuestionsClient({ questions, attempts: initialAttempts, userId }: Props) {
  const [attempts, setAttempts] = useState<Attempt[]>(initialAttempts)
  const [filterStep, setFilterStep] = useState('Todos')
  const [filterDifficulty, setFilterDifficulty] = useState('Todas')
  const [filterSubject, setFilterSubject] = useState('Todas')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const subjects = useMemo(() => {
    const s = new Set(questions.map(q => q.subject))
    return ['Todas', ...Array.from(s).sort()]
  }, [questions])

  const filtered = useMemo(() => {
    return questions.filter(q => {
      if (filterStep !== 'Todos' && q.usmle_step !== filterStep) return false
      if (filterDifficulty !== 'Todas' && q.difficulty !== filterDifficulty) return false
      if (filterSubject !== 'Todas' && q.subject !== filterSubject) return false
      return true
    })
  }, [questions, filterStep, filterDifficulty, filterSubject])

  const question = filtered[currentIndex]
  const answeredIds = new Set(attempts.map(a => a.question_id))
  const totalAnswered = attempts.length
  const totalCorrect = attempts.filter(a => a.is_correct).length

  const previousAttempt = question ? attempts.find(a => a.question_id === question.id) : null

  function nextQuestion() {
    setSelectedAnswer(null)
    setSubmitted(false)
    if (currentIndex < filtered.length - 1) {
      setCurrentIndex(i => i + 1)
    }
  }

  function prevQuestion() {
    setSelectedAnswer(null)
    setSubmitted(false)
    if (currentIndex > 0) {
      setCurrentIndex(i => i - 1)
    }
  }

  async function handleSubmit() {
    if (!selectedAnswer || !question) return
    setLoading(true)
    const is_correct = selectedAnswer === question.correct_answer

    const supabase = createClient()
    const { data } = await supabase
      .from('user_question_attempts')
      .insert({
        user_id: userId,
        question_id: question.id,
        selected_answer: selectedAnswer,
        is_correct,
      })
      .select()
      .single()

    if (data) {
      setAttempts(prev => [...prev.filter(a => a.question_id !== question.id), data])
    }
    setSubmitted(true)
    setLoading(false)
  }

  const options: { key: 'A' | 'B' | 'C' | 'D' | 'E'; text: string }[] = question
    ? [
        { key: 'A', text: question.option_a },
        { key: 'B', text: question.option_b },
        { key: 'C', text: question.option_c },
        { key: 'D', text: question.option_d },
        { key: 'E', text: question.option_e },
      ]
    : []

  function getOptionStyle(key: string) {
    if (!submitted && selectedAnswer !== key) return 'border-border hover:border-primary/40 hover:bg-primary-50/30'
    if (!submitted && selectedAnswer === key) return 'border-primary-700 bg-primary-50'
    // submitted
    if (key === question?.correct_answer) return 'border-correct bg-correct-light text-correct'
    if (key === selectedAnswer && key !== question?.correct_answer) return 'border-incorrect bg-incorrect-light text-incorrect'
    return 'border-border opacity-50'
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl text-primary-700 mb-1">Banco de Questões</h1>
        <p className="text-muted-foreground text-sm">
          {totalAnswered} respondidas · {totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0}% de acerto global
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-border p-4 mb-6 flex flex-wrap gap-3">
        <FilterSelect label="Step" value={filterStep} options={STEPS} onChange={v => { setFilterStep(v); setCurrentIndex(0); setSelectedAnswer(null); setSubmitted(false) }} />
        <FilterSelect label="Dificuldade" value={filterDifficulty} options={DIFFICULTIES} onChange={v => { setFilterDifficulty(v); setCurrentIndex(0); setSelectedAnswer(null); setSubmitted(false) }} />
        <FilterSelect label="Especialidade" value={filterSubject} options={subjects} onChange={v => { setFilterSubject(v); setCurrentIndex(0); setSelectedAnswer(null); setSubmitted(false) }} />
        <div className="ml-auto text-sm text-muted-foreground self-center">
          {filtered.length} questão{filtered.length !== 1 ? 'ões' : ''} encontrada{filtered.length !== 1 ? 's' : ''}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border p-12 text-center">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-muted-foreground">Nenhuma questão encontrada com esses filtros.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          {/* Question header */}
          <div className="px-6 py-4 bg-gray-50 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge>{question.usmle_step}</Badge>
              <Badge variant="outline">{question.subject}</Badge>
              <DifficultyBadge difficulty={question.difficulty} />
              {answeredIds.has(question.id) && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  attempts.find(a => a.question_id === question.id)?.is_correct
                    ? 'bg-correct-light text-correct'
                    : 'bg-incorrect-light text-incorrect'
                }`}>
                  {attempts.find(a => a.question_id === question.id)?.is_correct ? '✓ Respondida corretamente' : '✗ Respondida incorretamente'}
                </span>
              )}
            </div>
            <span className="text-sm text-muted-foreground whitespace-nowrap ml-2">
              {currentIndex + 1} / {filtered.length}
            </span>
          </div>

          {/* Question stem */}
          <div className="px-6 py-6">
            <p className="text-foreground leading-relaxed text-base">{question.stem}</p>
          </div>

          {/* Options */}
          <div className="px-6 pb-6 space-y-3">
            {options.map(opt => (
              <button
                key={opt.key}
                onClick={() => !submitted && setSelectedAnswer(opt.key)}
                disabled={submitted}
                className={`w-full text-left flex gap-3 items-start px-4 py-3 rounded-xl border-2 transition-all text-sm ${getOptionStyle(opt.key)}`}
              >
                <span className="font-bold min-w-[20px] mt-0.5">{opt.key}.</span>
                <span>{opt.text}</span>
                {submitted && opt.key === question.correct_answer && (
                  <svg className="ml-auto mt-0.5 w-5 h-5 text-correct flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {submitted && opt.key === selectedAnswer && opt.key !== question.correct_answer && (
                  <svg className="ml-auto mt-0.5 w-5 h-5 text-incorrect flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            ))}
          </div>

          {/* Explanation */}
          {submitted && (
            <div className={`mx-6 mb-6 p-5 rounded-xl border-2 ${
              selectedAnswer === question.correct_answer
                ? 'bg-correct-light border-correct/30'
                : 'bg-incorrect-light border-incorrect/30'
            }`}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{selectedAnswer === question.correct_answer ? '✅' : '❌'}</span>
                <span className={`font-semibold text-sm ${selectedAnswer === question.correct_answer ? 'text-correct' : 'text-incorrect'}`}>
                  {selectedAnswer === question.correct_answer ? 'Correto! Resposta: ' : 'Incorreto. Resposta correta: '}
                  {question.correct_answer}
                </span>
              </div>
              <p className="text-sm text-foreground leading-relaxed">{question.explanation}</p>
            </div>
          )}

          {/* Actions */}
          <div className="px-6 py-4 border-t border-border flex items-center justify-between gap-3">
            <button
              onClick={prevQuestion}
              disabled={currentIndex === 0}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Anterior
            </button>

            {!submitted ? (
              <button
                onClick={handleSubmit}
                disabled={!selectedAnswer || loading}
                className="px-6 py-2 bg-primary-700 text-white rounded-xl text-sm font-medium hover:bg-primary-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Verificando...' : 'Confirmar resposta'}
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                disabled={currentIndex === filtered.length - 1}
                className="px-6 py-2 bg-primary-700 text-white rounded-xl text-sm font-medium hover:bg-primary-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Próxima questão →
              </button>
            )}

            <button
              onClick={nextQuestion}
              disabled={currentIndex === filtered.length - 1}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
            >
              Próxima
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function Badge({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'outline' }) {
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
      variant === 'default'
        ? 'bg-primary-100 text-primary-700'
        : 'bg-gray-100 text-gray-600'
    }`}>
      {children}
    </span>
  )
}

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const styles: Record<string, string> = {
    'Fácil': 'bg-correct-light text-correct',
    'Médio': 'bg-amber-50 text-amber-700',
    'Difícil': 'bg-incorrect-light text-incorrect',
  }
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${styles[difficulty] || 'bg-gray-100 text-gray-600'}`}>
      {difficulty}
    </span>
  )
}

function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-xs text-muted-foreground font-medium">{label}:</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="text-sm border border-border rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}
