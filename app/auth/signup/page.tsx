'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState({
    email: '',
    password: '',
    full_name: '',
    medical_school: '',
    graduation_year: new Date().getFullYear(),
    target_match_year: new Date().getFullYear() + 2,
  })

  function update(field: string, value: string | number) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.full_name,
          medical_school: form.medical_school,
          graduation_year: form.graduation_year,
          target_match_year: form.target_match_year,
        }
      }
    })

    if (signUpError) {
      setError('Erro ao criar conta: ' + signUpError.message)
      setLoading(false)
      return
    }

    if (data.user) {
      // Insert profile
      await supabase.from('user_profiles').upsert({
        id: data.user.id,
        email: form.email,
        full_name: form.full_name,
        medical_school: form.medical_school,
        graduation_year: form.graduation_year,
        target_match_year: form.target_match_year,
      })
      setSuccess(true)
      setTimeout(() => router.push('/dashboard'), 1500)
    }

    setLoading(false)
  }

  if (success) {
    return (
      <div className="text-center py-4">
        <div className="w-16 h-16 bg-correct-light rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-correct" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Conta criada!</h3>
        <p className="text-muted-foreground text-sm">Redirecionando para o painel...</p>
      </div>
    )
  }

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i)

  return (
    <>
      <h2 className="text-2xl font-semibold text-primary-700 mb-1">Criar conta</h2>
      <p className="text-muted-foreground text-sm mb-6">Comece sua jornada para o Match.</p>

      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">Nome completo</label>
          <input
            type="text"
            value={form.full_name}
            onChange={e => update('full_name', e.target.value)}
            placeholder="Dr. João Silva"
            required
            className="w-full px-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={e => update('email', e.target.value)}
            placeholder="seu@email.com"
            required
            className="w-full px-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Senha</label>
          <input
            type="password"
            value={form.password}
            onChange={e => update('password', e.target.value)}
            placeholder="Mínimo 8 caracteres"
            minLength={8}
            required
            className="w-full px-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Faculdade de Medicina</label>
          <input
            type="text"
            value={form.medical_school}
            onChange={e => update('medical_school', e.target.value)}
            placeholder="USP, UNICAMP, FMUSP..."
            required
            className="w-full px-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1.5">Ano de formatura</label>
            <select
              value={form.graduation_year}
              onChange={e => update('graduation_year', parseInt(e.target.value))}
              className="w-full px-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all bg-white"
            >
              {Array.from({ length: 10 }, (_, i) => currentYear - 5 + i).map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Meta do Match</label>
            <select
              value={form.target_match_year}
              onChange={e => update('target_match_year', parseInt(e.target.value))}
              className="w-full px-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all bg-white"
            >
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="bg-incorrect-light text-incorrect text-sm px-4 py-3 rounded-xl border border-incorrect/20">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary-700 hover:bg-primary-800 text-white font-medium py-2.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Criando conta...' : 'Criar conta gratuita'}
        </button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Já tem uma conta?{' '}
        <Link href="/auth/login" className="text-primary-700 font-medium hover:underline">
          Entrar
        </Link>
      </p>
    </>
  )
}
