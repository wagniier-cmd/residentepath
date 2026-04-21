-- ============================================================
-- ResidentePath — Database Schema
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. USER PROFILES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL DEFAULT '',
  medical_school TEXT NOT NULL DEFAULT '',
  graduation_year INT NOT NULL DEFAULT 2024,
  target_match_year INT NOT NULL DEFAULT 2026,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- ============================================================
-- 2. QUESTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  stem TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  option_e TEXT NOT NULL,
  correct_answer CHAR(1) NOT NULL CHECK (correct_answer IN ('A','B','C','D','E')),
  explanation TEXT NOT NULL,
  usmle_step TEXT NOT NULL CHECK (usmle_step IN ('Step 1','Step 2CK','Step 3')),
  subject TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Fácil','Médio','Difícil')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read questions"
  ON public.questions FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================
-- 3. USER QUESTION ATTEMPTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_question_attempts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE NOT NULL,
  selected_answer CHAR(1) NOT NULL CHECK (selected_answer IN ('A','B','C','D','E')),
  is_correct BOOLEAN NOT NULL,
  answered_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.user_question_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own attempts"
  ON public.user_question_attempts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own attempts"
  ON public.user_question_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_user_question_attempts_user_id ON public.user_question_attempts(user_id);
CREATE INDEX idx_user_question_attempts_answered_at ON public.user_question_attempts(answered_at);

-- ============================================================
-- 4. FLASHCARDS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.flashcards (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  front TEXT NOT NULL,
  back TEXT NOT NULL,
  subject TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read flashcards"
  ON public.flashcards FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================
-- 5. USER FLASHCARD STATE (SM-2 per user per card)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_flashcard_state (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  flashcard_id UUID REFERENCES public.flashcards(id) ON DELETE CASCADE NOT NULL,
  next_due TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  interval INT NOT NULL DEFAULT 1,
  ease_factor FLOAT NOT NULL DEFAULT 2.5,
  repetitions INT NOT NULL DEFAULT 0,
  UNIQUE(user_id, flashcard_id)
);

ALTER TABLE public.user_flashcard_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own flashcard state"
  ON public.user_flashcard_state FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_user_flashcard_state_user_id ON public.user_flashcard_state(user_id);
CREATE INDEX idx_user_flashcard_state_next_due ON public.user_flashcard_state(next_due);

-- ============================================================
-- 6. USER FLASHCARD REVIEWS (log)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_flashcard_reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  flashcard_id UUID REFERENCES public.flashcards(id) ON DELETE CASCADE NOT NULL,
  rating TEXT NOT NULL CHECK (rating IN ('again','hard','good','easy')),
  reviewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  next_due TIMESTAMPTZ NOT NULL,
  interval INT NOT NULL,
  ease_factor FLOAT NOT NULL
);

ALTER TABLE public.user_flashcard_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own reviews"
  ON public.user_flashcard_reviews FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reviews"
  ON public.user_flashcard_reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_user_flashcard_reviews_user_id ON public.user_flashcard_reviews(user_id);
CREATE INDEX idx_user_flashcard_reviews_reviewed_at ON public.user_flashcard_reviews(reviewed_at);
