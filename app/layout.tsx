import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ResidentePath — USMLE para Médicos Brasileiros',
  description: 'Plataforma de estudos USMLE focada na comunidade médica brasileira. Questões, flashcards e acompanhamento de progresso para o Match.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
