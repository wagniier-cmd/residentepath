-- Add translation language preference to user_profiles
ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS translation_language TEXT NOT NULL DEFAULT 'pt';
