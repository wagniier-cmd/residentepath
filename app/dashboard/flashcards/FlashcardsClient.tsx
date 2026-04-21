'use client'

import { useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { calculateSM2, isDueForReview, getInitialSM2 } from '@/lib/sm2'
import type { Flashcard, FlashcardRating } from '@/types'

interface UserState {
  flashcard_id: string
  next_due: string
  interval: number
  ease_factor: number
  repetitions?: number
}

interface Props {
  flashcards: Flashcard[]
  userStates: UserState[]
  userId: string
}

type Mode = 'browse' | 'review'

export default function FlashcardsClient({ flashcards, userStates: initialStates, userId }: Props) {
  const [userStates, setUserStates] = useState<UserState[]>(initialStates)
  const [mode, setMode] = useState<Mode>('browse')
  const [flipped, setFlipped] = useState(false)
  const [reviewIndex, setReviewIndex] = useState(0)
  const [sessionDone, setSessionDone] = useState(false)
  const [sessionCount, setSessionCount] = useState(0)
  const [filterSubject, setFilterSubject] = useState('Todas')

  const subjects = useMemo(() => {
    const s = new Set(flashcards.map(f => f.subject))
    return ['Todas', ...Array.from(s).sort()]
  }, [flashcards])

  function getState(id: string): UserState | undefined {
    return userStates.find(s => s.flashcard_id === id)
  }

  function isDue(card: Flashcard): boolean {
    const state = getState(card.id)
    if (!state) return true // never reviewed = due
    return isDueForReview(state.next_due)
  }

  const dueCards = useMemo(() => {
    return flashcards.filter(f => {
      if (filterSubject !== 'Todas' && f.subject !== filterSubject) return false
      return isDue(f)
    })
  }, [flashcards, userStates, filterSubject])

  const allCards = useMemo(() => {
    return flashcards.filter(f => filterSubject === 'Todas' || f.subject === filterSubject)
  }, [flashcards, filterSubject])

  const reviewCard = dueCards[reviewIndex]

  function startReview() {
    setReviewIndex(0)
    setFlipped(false)
    setSessionDone(false)
    setSessionCount(0)
    setMode('review')
  }

  async function handleRate(rating: FlashcardRating) {
    if (!reviewCard) return

    const state = getState(reviewCard.id)
    const currentInterval = state?.interval || 1
    const currentEaseFactor = state?.ease_factor || 2.5
    const repetitions = (state as any)?.repetitions || 0

    const result = calculateSM2(rating, currentInterval, currentEaseFactor, repetitions)

    const newState = {
      user_id: userId,
      flashcard_id: reviewCard.id,
      next_due: result.nextDue.toISOString(),
      interval: result.interval,
      ease_factor: result.easeFactor,
      repetitions: rating === 'again' ? 0 : repetitions + 1,
    }

    const supabase = createClient()

    // Upsert state
    await supabase.from('user_flashcard_state').upsert(newState)

    // Insert review log
    await supabase.from('user_flashcard_reviews').insert({
      user_id: userId,
      flashcard_id: reviewCard.id,
      rating,
      next_due: result.nextDue.toISOString(),
      interval: result.interval,
      ease_factor: result.easeFactor,
    })

    // Update local state
    setUserStates(prev => {
      const filtered = prev.filter(s => s.flashcard_id !== reviewCard.id)
      return [...filtered, { flashcard_id: reviewCard.id, next_due: result.nextDue.toISOString(), interval: result.interval, ease_factor: result.easeFactor }]
    })

    setSessionCount(c => c + 1)
    setFlipped(false)

    if (reviewIndex >= dueCards.length - 1) {
      setSessionDone(true)
    } else {
      setReviewIndex(i => i + 1)
    }
  }

  if (mode === 'review') {
    if (sessionDone || dueCards.length === 0) {
      return (
        <div className="animate-fade-in">
          <div className="max-w-2xl mx-auto text-center py-16">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-primary-700 mb-2">Sessão concluída!</h2>
            <p className="text-muted-foreground mb-2">Você revisou <strong>{sessionCount}</strong> flashcard{sessionCount !== 1 ? 's' : ''}.</p>
            <p className="text-muted-foreground text-sm mb-8">O algoritmo SM-2 já agendou as próximas revisões para você.</p>
            <button
              onClick={() => setMode('browse')}
              className="px-6 py-2.5 bg-primary-700 text-white rounded-xl text-sm font-medium hover:bg-primary-800 transition-colors"
            >
              Voltar ao painel de flashcards
            </button>
          </div>
        </div>
      )
    }

    return (
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl text-primary-700">Revisando Flashcards</h1>
            <p className="text-muted-foreground text-sm">{reviewIndex + 1} de {dueCards.length} cards para hoje</p>
          </div>
          <button
            onClick={() => setMode('browse')}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Sair da revisão
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-gray-100 rounded-full mb-8 overflow-hidden">
          <div
            className="h-full bg-primary-700 rounded-full transition-all duration-500"
            style={{ width: `${((reviewIndex) / dueCards.length) * 100}%` }}
          />
        </div>

        {/* Card */}
        <div className="max-w-2xl mx-auto">
          <div
            className={`bg-white rounded-2xl border-2 border-border p-8 min-h-[280px] flex flex-col cursor-pointer transition-all duration-200 ${!flipped ? 'hover:border-primary/30 hover:shadow-md' : ''}`}
            onClick={() => !flipped && setFlipped(true)}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-medium bg-primary-50 text-primary-700 px-2.5 py-1 rounded-full">{reviewCard?.subject}</span>
              {!flipped && (
                <span className="text-xs text-muted-foreground">Clique para revelar</span>
              )}
            </div>

            <div className="flex-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                {!flipped ? 'FRENTE' : 'VERSO'}
              </p>
              <p className="text-foreground text-base leading-relaxed">
                {!flipped ? reviewCard?.front : reviewCard?.back}
              </p>
            </div>

            {!flipped && (
              <div className="mt-6 flex items-center justify-center gap-2 text-muted-foreground text-sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Clique para ver o verso
              </div>
            )}
          </div>

          {/* Rating buttons */}
          {flipped && (
            <div className="mt-6 animate-fade-in">
              <p className="text-center text-sm text-muted-foreground mb-4">Como você se saiu?</p>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { rating: 'again' as FlashcardRating, label: 'De Novo', sub: '< 1 min', color: 'bg-red-50 hover:bg-red-100 text-red-700 border-red-200' },
                  { rating: 'hard' as FlashcardRating, label: 'Difícil', sub: '< 6 min', color: 'bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200' },
                  { rating: 'good' as FlashcardRating, label: 'Bom', sub: '4 dias', color: 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200' },
                  { rating: 'easy' as FlashcardRating, label: 'Fácil', sub: '7 dias', color: 'bg-green-50 hover:bg-green-100 text-green-700 border-green-200' },
                ].map(btn => (
                  <button
                    key={btn.rating}
                    onClick={() => handleRate(btn.rating)}
                    className={`flex flex-col items-center py-3 px-2 rounded-xl border-2 transition-all font-medium ${btn.color}`}
                  >
                    <span className="text-sm font-semibold">{btn.label}</span>
                    <span className="text-xs opacity-70 mt-0.5">{btn.sub}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Browse mode
  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl text-primary-700 mb-1">Flashcards</h1>
          <p className="text-muted-foreground text-sm">
            {flashcards.length} cards no total · {dueCards.length} para revisar hoje
          </p>
        </div>
        {dueCards.length > 0 && (
          <button
            onClick={startReview}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary-700 text-white rounded-xl text-sm font-medium hover:bg-primary-800 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Iniciar revisão ({dueCards.length})
          </button>
        )}
      </div>

      {/* Filter */}
      <div className="bg-white rounded-2xl border border-border p-4 mb-6 flex items-center gap-3 flex-wrap">
        <span className="text-xs text-muted-foreground font-medium">Especialidade:</span>
        {subjects.map(s => (
          <button
            key={s}
            onClick={() => setFilterSubject(s)}
            className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
              filterSubject === s
                ? 'bg-primary-700 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {allCards.map(card => {
          const state = getState(card.id)
          const due = isDue(card)
          return (
            <div
              key={card.id}
              className="bg-white rounded-2xl border border-border p-5 hover:border-primary/30 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="text-xs font-medium bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full">{card.subject}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${due ? 'bg-amber-50 text-amber-700' : 'bg-correct-light text-correct'}`}>
                  {due ? '⏰ Para revisar' : '✓ Em dia'}
                </span>
              </div>
              <p className="text-sm font-medium text-foreground mb-2 line-clamp-2">{card.front}</p>
              <p className="text-xs text-muted-foreground line-clamp-2">{card.back}</p>
              {state && (
                <div className="mt-3 pt-3 border-t border-border flex items-center gap-3 text-xs text-muted-foreground">
                  <span>Intervalo: {state.interval}d</span>
                  <span>Facilidade: {state.ease_factor.toFixed(1)}</span>
                  {!due && <span>Próxima: {new Date(state.next_due).toLocaleDateString('pt-BR')}</span>}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {allCards.length === 0 && (
        <div className="bg-white rounded-2xl border border-border p-12 text-center">
          <p className="text-4xl mb-3">🃏</p>
          <p className="text-muted-foreground">Nenhum flashcard encontrado para esta especialidade.</p>
        </div>
      )}
    </div>
  )
}
