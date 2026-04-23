import { useState, useCallback } from 'react'

export function useTranslate(targetLanguage: string = 'pt') {
  const [translations, setTranslations] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [visible, setVisible] = useState<Record<string, boolean>>({})

  const translate = useCallback(async (key: string, text: string) => {
    if (translations[key]) {
      setVisible(v => ({ ...v, [key]: !v[key] }))
      return
    }
    setLoading(l => ({ ...l, [key]: true }))
    setVisible(v => ({ ...v, [key]: true }))
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, targetLanguage }),
      })
      const data = await res.json()
      if (data.translation) {
        setTranslations(t => ({ ...t, [key]: data.translation }))
      }
    } catch {
      // silently fail
    } finally {
      setLoading(l => ({ ...l, [key]: false }))
    }
  }, [translations, targetLanguage])

  function reset() {
    setTranslations({})
    setVisible({})
    setLoading({})
  }

  return { translate, translations, loading, visible, reset }
}
