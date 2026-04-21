'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Email ou senha incorretos. Tente novamente.')
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <>
      <h2 className="text-2xl font-semibold text-primary-700 mb-1">Entrar</h2>
      <p className="text-muted-foreground text-sm mb-6">Bem-vindo de volta! Continue seus estudos.</p>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            required
            className="w-full px-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full px-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
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
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Não tem uma conta?{' '}
        <Link href="/auth/signup" className="text-primary-700 font-medium hover:underline">
          Criar conta
        </Link>
      </p>
    </>
  )
}
