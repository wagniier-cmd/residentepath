'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const SUBJECTS = [
  'Cardiologia',
  'Pneumologia',
  'Gastroenterologia',
  'Nefrologia',
  'Neurologia',
  'Endocrinologia',
  'Hematologia',
  'Infectologia',
  'Reumatologia',
  'Oncologia',
  'Ginecologia',
  'Pediatria',
  'Psiquiatria',
  'Cirurgia',
  'Farmacologia',
  'Anatomia',
  'Fisiologia',
  'Bioquímica',
  'Microbiologia',
  'Imunologia',
  'Patologia',
]

interface Flashcard {
  front: string
  back: string
}

export default function GenerateFlashcardsPage() {
  const router = useRouter()
  const [text, setText] = useState('')
  const [subject, setSubject] = useState(SUBJECTS[0])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [saved, setSaved] = useState(false)

  async function handleGenerate() {
    if (!text.trim()) {
      setError('Cole um texto antes de gerar os flashcards.')
      return
    }
    setLoading(true)
    setError('')
    setFlashcards([])
    setSaved(false)

    try {
      const res = await fetch('/api/generate-flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, subject }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error)
      setFlashcards(data.flashcards)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao gerar flashcards')
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    setError('')
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Não autenticado')

      const rows = flashcards.map(fc => ({
        front: fc.front,
        back: fc.back,
        subject,
        created_by: user.id,
      }))

      const { error: dbError } = await supabase.from('flashcards').insert(rows)
      if (dbError) throw new Error(dbError.message)

      setSaved(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Voltar
        </button>
        <div>
          <h1 className="text-2xl text-primary-700">Gerar Flashcards com IA ✨</h1>
          <p className="text-muted-foreground text-sm">Cole um texto e a IA gera 10 flashcards USMLE automaticamente</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border p-6 mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-foreground mb-2">Especialidade</label>
          <select
            value={subject}
            onChange={e => setSubject(e.target.value)}
            className="w-full border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-700/20 focus:border-primary-700"
          >
            {SUBJECTS.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-foreground mb-2">
            Texto fonte
            <span className="ml-2 text-xs text-muted-foreground font-normal">
              (resumo de aula, capítulo de livro, anotações)
            </span>
          </label>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Cole aqui o texto que deseja transformar em flashcards..."
            rows={10}
            className="w-full border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-700/20 focus:border-primary-700 resize-none font-mono"
          />
          <p className="text-xs text-muted-foreground mt-1">{text.length} caracteres</p>
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-4 p-3 bg-red-50 rounded-xl">{error}</p>
        )}

        <button
          onClick={handleGenerate}
          disabled={loading || !text.trim()}
          className="w-full py-3 bg-primary-700 text-white rounded-xl text-sm font-medium hover:bg-primary-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Gerando flashcards...
            </>
          ) : (
            '✨ Gerar 10 Flashcards com IA'
          )}
        </button>
      </div>

      {flashcards.length > 0 && (
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-primary-700">
              {flashcards.length} flashcards gerados
            </h2>
            {!saved ? (
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {saving ? 'Salvando...' : '💾 Salvar todos no banco'}
              </button>
            ) : (
              <span className="flex items-center gap-2 px-5 py-2.5 bg-green-50 text-green-700 rounded-xl text-sm font-medium border border-green-200">
                ✓ Salvos com sucesso!
              </span>
            )}
          </div>

          <div className="flex flex-col gap-4">
            {flashcards.map((fc, i) => (
              <div key={i} className="bg-white rounded-2xl border border-border p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold text-primary-700 bg-primary-50 px-2 py-0.5 rounded-full">
                    #{i + 1}
                  </span>
                  <span className="text-xs text-muted-foreground">{subject}</span>
                </div>
                <div className="mb-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">FRENTE</p>
                  <p className="text-sm text-foreground leading-relaxed">{fc.front}</p>
                </div>
                <div className="pt-3 border-t border-border">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">VERSO</p>
                  <p className="text-sm text-foreground leading-relaxed">{fc.back}</p>
                </div>
              </div>
            ))}
          </div>

          {saved && (
            <div className="mt-6 text-center">
              <button
                onClick={() => router.push('/dashboard/flashcards')}
                className="px-6 py-2.5 bg-primary-700 text-white rounded-xl text-sm font-medium hover:bg-primary-800 transition-colors"
              >
                Ver meus flashcards →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
