export type USMLEStep = 'Step 1' | 'Step 2CK' | 'Step 3'
export type Difficulty = 'Fácil' | 'Médio' | 'Difícil'
export type QuestionSubject =
  | 'Cardiologia'
  | 'Neurologia'
  | 'Gastroenterologia'
  | 'Pneumologia'
  | 'Nefrologia'
  | 'Endocrinologia'
  | 'Hematologia'
  | 'Infectologia'
  | 'Reumatologia'
  | 'Psiquiatria'
  | 'Pediatria'
  | 'Ginecologia'
  | 'Cirurgia'
  | 'Farmacologia'
  | 'Patologia'
  | 'Bioquímica'
  | 'Microbiologia'
  | 'Imunologia'
  | 'Anatomia'
  | 'Fisiologia'

export type FlashcardRating = 'again' | 'hard' | 'good' | 'easy'

export interface UserProfile {
  id: string
  email: string
  full_name: string
  medical_school: string
  graduation_year: number
  target_match_year: number
  created_at: string
}

export interface Question {
  id: string
  stem: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  option_e: string
  correct_answer: 'A' | 'B' | 'C' | 'D' | 'E'
  explanation: string
  usmle_step: USMLEStep
  subject: QuestionSubject
  difficulty: Difficulty
  created_at: string
}

export interface UserQuestionAttempt {
  id: string
  user_id: string
  question_id: string
  selected_answer: 'A' | 'B' | 'C' | 'D' | 'E'
  is_correct: boolean
  answered_at: string
}

export interface Flashcard {
  id: string
  front: string
  back: string
  subject: QuestionSubject
  due_date: string
  interval: number
  ease_factor: number
  created_at: string
}

export interface UserFlashcardReview {
  id: string
  user_id: string
  flashcard_id: string
  rating: FlashcardRating
  reviewed_at: string
  next_due: string
  interval: number
  ease_factor: number
}

export interface UserFlashcardState {
  flashcard_id: string
  next_due: string
  interval: number
  ease_factor: number
  last_rating: FlashcardRating | null
}

export interface DashboardStats {
  questionsToday: number
  flashcardsToday: number
  streak: number
  dueFlashcards: number
  subjectProgress: SubjectProgress[]
  weeklyActivity: WeeklyActivity[]
}

export interface SubjectProgress {
  subject: string
  total: number
  correct: number
  percentage: number
}

export interface WeeklyActivity {
  date: string
  questions: number
  flashcards: number
}
