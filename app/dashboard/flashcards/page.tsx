import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import FlashcardsClient from './FlashcardsClient'

export default async function FlashcardsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const today = new Date()
  today.setHours(23, 59, 59, 999)

  // Fetch all flashcards
  const { data: flashcards } = await supabase
    .from('flashcards')
    .select('*')
    .order('subject', { ascending: true })

  // Fetch user states for flashcards
  const { data: userStates } = await supabase
    .from('user_flashcard_state')
    .select('*')
    .eq('user_id', user.id)

  return (
    <FlashcardsClient
      flashcards={flashcards || []}
      userStates={userStates || []}
      userId={user.id}
    />
  )
}
