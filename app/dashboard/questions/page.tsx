import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import QuestionsClient from './QuestionsClient'
import { getUserPlan } from '@/lib/subscription'

export default async function QuestionsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [
    { data: questions },
    { data: attempts },
    userPlan,
    { data: profile },
  ] = await Promise.all([
    supabase.from('questions').select('*').order('created_at', { ascending: true }),
    supabase
      .from('user_question_attempts')
      .select('question_id, is_correct, selected_answer, answered_at')
      .eq('user_id', user.id),
    getUserPlan(user.id),
    supabase.from('user_profiles').select('translation_language').eq('id', user.id).single(),
  ])

  // Count questions answered today for limited plans
  let answeredToday = 0
  if (!userPlan.canAccessUnlimited) {
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    answeredToday = (attempts ?? []).filter(
      a => new Date(a.answered_at) >= todayStart
    ).length
  }

  const isBlocked = !userPlan.canAccessUnlimited && answeredToday >= userPlan.dailyLimit

  if (isBlocked) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}>
        <div style={{
          background: '#fff',
          borderRadius: '20px',
          padding: '48px 40px',
          maxWidth: '480px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 8px 32px rgba(30,58,95,0.1)',
          border: '1px solid #e2e8f0',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#1E3A5F', marginBottom: '8px' }}>
            Limite diário atingido
          </h2>
          <p style={{ fontSize: '15px', color: '#64748b', lineHeight: 1.7, marginBottom: '8px' }}>
            Você respondeu <strong>{answeredToday}</strong> questões hoje.
          </p>
          <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.7, marginBottom: '32px' }}>
            {userPlan.plan === 'free'
              ? 'O plano gratuito permite até 5 questões por dia.'
              : 'O plano Starter permite até 30 questões por dia.'}
            {' '}Faça upgrade para acesso ilimitado.
          </p>
          <Link href="/#planos" style={{
            display: 'inline-block',
            padding: '14px 32px',
            background: '#1E3A5F',
            color: '#fff',
            borderRadius: '12px',
            fontSize: '15px',
            fontWeight: 600,
            textDecoration: 'none',
          }}>
            Fazer upgrade →
          </Link>
          <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '16px' }}>
            Limite reinicia à meia-noite
          </p>
        </div>
      </div>
    )
  }

  return (
    <QuestionsClient
      questions={questions || []}
      attempts={attempts || []}
      userId={user.id}
      userPlan={userPlan}
      answeredToday={answeredToday}
      translationLanguage={profile?.translation_language ?? 'pt'}
    />
  )
}
