import type { FlashcardRating } from '@/types'

export interface SM2Result {
  interval: number
  easeFactor: number
  nextDue: Date
}

/**
 * SM-2 Spaced Repetition Algorithm
 * Based on the original algorithm by Piotr Wozniak
 */
export function calculateSM2(
  rating: FlashcardRating,
  currentInterval: number,
  currentEaseFactor: number,
  repetitions: number
): SM2Result {
  // Convert rating to SM-2 quality (0-5)
  const qualityMap: Record<FlashcardRating, number> = {
    again: 0,
    hard: 2,
    good: 4,
    easy: 5,
  }
  const quality = qualityMap[rating]

  let newInterval: number
  let newEaseFactor: number
  let newRepetitions: number

  // If quality < 3, restart repetitions
  if (quality < 3) {
    newRepetitions = 0
    newInterval = 1
  } else {
    newRepetitions = repetitions + 1

    if (newRepetitions === 1) {
      newInterval = 1
    } else if (newRepetitions === 2) {
      newInterval = 6
    } else {
      newInterval = Math.round(currentInterval * currentEaseFactor)
    }
  }

  // Update ease factor
  newEaseFactor = currentEaseFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  newEaseFactor = Math.max(1.3, newEaseFactor)

  // Calculate next due date
  const nextDue = new Date()
  nextDue.setDate(nextDue.getDate() + newInterval)
  nextDue.setHours(0, 0, 0, 0)

  return {
    interval: newInterval,
    easeFactor: Math.round(newEaseFactor * 100) / 100,
    nextDue,
  }
}

export function getInitialSM2(): Pick<SM2Result, 'interval' | 'easeFactor'> {
  return {
    interval: 1,
    easeFactor: 2.5,
  }
}

export function isDueForReview(dueDateStr: string): boolean {
  const dueDate = new Date(dueDateStr)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return dueDate <= today
}
