import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SimuladoClient from './SimuladoClient'
import type { Question } from '@/types'

export default async function SimuladoPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: questions } = await supabase
    .from('questions')
    .select('*')
    .order('created_at', { ascending: true })

  return (
    <SimuladoClient
      questions={(questions ?? []) as Question[]}
      userId={user.id}
    />
  )
}
