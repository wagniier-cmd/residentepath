# ResidentePath 🏥

Plataforma USMLE para médicos brasileiros que visam o Match americano. Banco de questões, flashcards com repetição espaçada (SM-2), dashboard de progresso e autenticação completa.

---

## Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend/DB**: Supabase (Auth + PostgreSQL)
- **Componentes**: shadcn/ui (Radix UI)
- **Gráficos**: Recharts
- **Algoritmo**: SM-2 (repetição espaçada)

---

## Setup em 5 passos

### 1. Clone e instale as dependências

```bash
git clone <repo>
cd residentepath
npm install
```

### 2. Crie seu projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) e crie um novo projeto
2. Anote a **URL** e a **anon key** (em Settings → API)

### 3. Configure as variáveis de ambiente

```bash
cp .env.example .env.local
```

Edite `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://SEU_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key
```

### 4. Execute as migrations no Supabase

No painel do Supabase, vá em **SQL Editor** e execute os arquivos na ordem:

1. `supabase/migrations/001_schema.sql` — Cria todas as tabelas com RLS
2. `supabase/migrations/002_seed.sql` — Insere 10 questões e 20 flashcards

> **Dica**: Copie o conteúdo de cada arquivo e cole no SQL Editor do Supabase → Run.

### 5. Rode o projeto

```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

---

## Estrutura do Projeto

```
residentepath/
├── app/
│   ├── auth/
│   │   ├── login/        → Página de login
│   │   └── signup/       → Cadastro com perfil médico
│   └── dashboard/
│       ├── page.tsx      → Dashboard com stats e gráficos
│       ├── DashboardClient.tsx
│       ├── questions/    → Banco de questões USMLE
│       └── flashcards/   → Flashcards com SM-2
├── lib/
│   ├── supabase/
│   │   ├── client.ts     → Cliente browser
│   │   ├── server.ts     → Cliente servidor (SSR)
│   │   └── middleware.ts → Auth redirect
│   └── sm2.ts            → Algoritmo SM-2
├── types/
│   └── index.ts          → Interfaces TypeScript
└── supabase/
    └── migrations/
        ├── 001_schema.sql → Schema completo com RLS
        └── 002_seed.sql   → 10 questões + 20 flashcards
```

---

## Funcionalidades

### ✅ Autenticação
- Cadastro com perfil médico (faculdade, ano de formatura, meta do Match)
- Login/logout com Supabase Auth
- Rotas protegidas via middleware

### ✅ Banco de Questões
- 10 questões USMLE (Step 1, 2CK, 3) em português
- Filtros por Step, Dificuldade e Especialidade
- Feedback imediato + explicação detalhada
- Rastreamento de tentativas por usuário

### ✅ Flashcards (SM-2)
- 20 flashcards de alta relevância clínica
- Algoritmo SM-2 completo: Again/Hard/Good/Easy
- Agendamento automático de revisões
- Visualização de todos os cards com status

### ✅ Dashboard
- Questões e flashcards respondidos hoje
- Sequência de dias estudados (streak)
- Cards devidos para revisão
- Gráfico de atividade semanal
- Progresso por especialidade

---

## Tabelas do Banco de Dados

| Tabela | Descrição |
|--------|-----------|
| `user_profiles` | Perfil médico estendido do usuário |
| `questions` | Banco de questões USMLE |
| `user_question_attempts` | Tentativas do usuário por questão |
| `flashcards` | Cards de estudo |
| `user_flashcard_state` | Estado SM-2 por usuário/card |
| `user_flashcard_reviews` | Log de todas as revisões |

Todas as tabelas possuem **Row Level Security (RLS)** habilitado.

---

## Próximos passos (roadmap)

- [ ] Modo simulado (timer, sessão de X questões)
- [ ] Sistema de notas por questão
- [ ] Criação de flashcards pelo usuário
- [ ] Analytics avançados (tempo por questão, curva de aprendizado)
- [ ] Plano de estudos personalizado com base no Match target
- [ ] Assinatura premium (Stripe)
- [ ] App móvel (React Native / Expo)

---

## Desenvolvido com ❤️ para médicos brasileiros rumo ao Match
