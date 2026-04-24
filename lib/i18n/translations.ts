export type Language = 'pt' | 'en' | 'es'

export const LANGUAGE_OPTIONS: { value: Language; flag: string; label: string }[] = [
  { value: 'pt', flag: '🇧🇷', label: 'Português' },
  { value: 'en', flag: '🇺🇸', label: 'English' },
  { value: 'es', flag: '🇪🇸', label: 'Español' },
]

// targetLanguage for the translate API — 'en' means no translation needed (questions are in English)
export const TRANSLATE_TARGET: Record<Language, string | null> = {
  pt: 'pt',
  en: null,
  es: 'es',
}

export interface T {
  nav: {
    dashboard: string
    questions: string
    flashcards: string
    simulado: string
    ranking: string
    perfil: string
    admin: string
    logout: string
  }
  btn: {
    confirm: string
    next: string
    prev: string
    save: string
    saving: string
    saveChanges: string
    edit: string
    cancel: string
    createFlashcard: string
    upgrade: string
    editGoal: string
    saveGoal: string
  }
  label: {
    weeklyGoal: string
    goalReached: string
    dueToday: string
    streak: string
    correct: string
    incorrect: string
    loading: string
    questionsAnswered: string
    accuracy: string
    studiedDays: string
    flashcardsReviewed: string
    sequence: string
    questions: string
    flashcards: string
  }
  translate: {
    translateTo: string
    hide: string
    translating: string
    translateQuestion: string
    translateExplanation: string
    translationLabel: string
    translationOf: string
  }
  msg: {
    flashcardSaved: string
    noteSaved: string
    saveError: string
    dataSaved: string
    noQuestions: string
    allUpToDate: string
    limitReached: string
    nothingToReview: string
  }
  questions: {
    title: string
    myNotes: string
    notePlaceholder: string
    confirmAnswer: string
    yourAnswer: string
    correctAnswer: string
    explanation: string
    generateFlashcard: string
    prevQuestion: string
    nextQuestion: string
    nextQuestionBtn: string
    filter: string
    allSteps: string
    allSubjects: string
    allDifficulties: string
    unanswered: string
    answered: string
    answeredCount: string
    difficulty: string
    specialtyFilter: string
    questionsFound: string
    answeredCorrectly: string
    answeredIncorrectly: string
    autoFlashcard: string
    verifying: string
    saveNote: string
  }
  flashcards: {
    title: string
    dueToday: string
    again: string
    hard: string
    good: string
    easy: string
    front: string
    back: string
    subject: string
    create: string
    generating: string
    noCards: string
    allDone: string
    sessionDone: string
    reviewedCount: string
    sm2Note: string
    backToBrowse: string
    reviewing: string
    cardsForToday: string
    exitReview: string
    clickReveal: string
    clickForBack: string
    howDidYouDo: string
    generateAI: string
    startReview: string
    totalCards: string
    dueReviewBadge: string
    upToDateBadge: string
    interval: string
    ease: string
    nextReview: string
    noCardsSubject: string
    allSubjects: string
  }
  simulado: {
    title: string
    start: string
    step: string
    specialty: string
    questionCount: string
    timeEstimate: string
    flagQuestion: string
    unflagQuestion: string
    finishExam: string
    results: string
    score: string
    flagged: string
    correctAnswer: string
    yourAnswer: string
    reviewFlagged: string
    allQuestions: string
    configSubtitle: string
    numQuestions: string
    totalTime: string
    available: string
    willDraw: string
    willDrawSuffix: string
    finishConfirm: string
    flaggedForReview: string
    removeFlag: string
    completed: string
    timeUsedOf: string
    of: string
    perSubject: string
    flaggedSection: string
    newExam: string
    answeredLabel: string
    flaggedLabel: string
    notAnswered: string
    blank: string
  }
  dashboard: {
    greeting: string
    greetingMorning: string
    greetingAfternoon: string
    greetingEvening: string
    todayQuestions: string
    accuracyToday: string
    todayFlashcards: string
    totalAnswered: string
    weeklyTime: string
    weeklyActivity: string
    subjectProgress: string
    recentPerformance: string
    practiceQuestions: string
    reviewFlashcards: string
    dueFlashcards: string
    daysToMatch: string
    consecutiveDays: string
    sinceBeginning: string
    estimated: string
    resumeWhere: string
    weakestSpecialty: string
    availableQ: string
    daysRemaining: string
    lastDayWeek: string
    usmleBank: string
    cardsToReview: string
    motivDone: string
    motivAlmost: string
    motivGoing: string
    motivFocus: string
    thanYesterday: string
    sameAsYesterday: string
  }
  perfil: {
    title: string
    subtitle: string
    personalData: string
    fullName: string
    email: string
    medicalSchool: string
    graduationYear: string
    matchGoal: string
    translationLanguage: string
    translationLanguageHint: string
    generalProgress: string
    subjectProgress: string
    currentPlan: string
    active: string
    inactive: string
    trialUntil: string
    dailyLimit: string
    unlimited: string
    makeUpgrade: string
    savedData: string
    saveErrorMsg: string
  }
  ranking: {
    title: string
    subtitle: string
    user: string
    questions: string
    accuracy: string
    sequence: string
    you: string
    empty: string
  }
}

const pt: T = {
  nav: {
    dashboard: 'Painel',
    questions: 'Questões',
    flashcards: 'Flashcards',
    simulado: 'Simulado',
    ranking: 'Ranking',
    perfil: 'Perfil',
    admin: 'Admin',
    logout: 'Sair',
  },
  btn: {
    confirm: 'Confirmar resposta',
    next: 'Próxima',
    prev: 'Anterior',
    save: 'Salvar',
    saving: 'Salvando...',
    saveChanges: 'Salvar alterações',
    edit: 'Editar',
    cancel: 'Cancelar',
    createFlashcard: 'Criar flashcard',
    upgrade: 'Fazer upgrade',
    editGoal: '✏️ Editar meta',
    saveGoal: 'Salvar meta',
  },
  label: {
    weeklyGoal: 'Meta da semana',
    goalReached: '✓ Meta atingida!',
    dueToday: 'Para revisar hoje',
    streak: 'Sequência',
    correct: 'Corretas',
    incorrect: 'Incorretas',
    loading: 'Carregando...',
    questionsAnswered: 'Questões respondidas',
    accuracy: 'Acerto geral',
    studiedDays: 'Dias estudados',
    flashcardsReviewed: 'Flashcards revisados',
    sequence: 'Sequência atual',
    questions: 'Questões',
    flashcards: 'Flashcards',
  },
  translate: {
    translateTo: '🌐 Traduzir para Português',
    hide: 'Ocultar tradução',
    translating: 'Traduzindo...',
    translateQuestion: 'Traduzir questão',
    translateExplanation: 'Traduzir explicação',
    translationLabel: '🇧🇷 Tradução em Português',
    translationOf: 'Tradução da explicação',
  },
  msg: {
    flashcardSaved: '✓ Flashcard salvo!',
    noteSaved: '✓ Nota salva!',
    saveError: '✗ Erro ao salvar',
    dataSaved: '✓ Dados salvos!',
    noQuestions: 'Nenhuma questão encontrada.',
    allUpToDate: 'Tudo em dia!',
    limitReached: 'Limite diário atingido',
    nothingToReview: 'Nenhum flashcard para revisar agora.',
  },
  questions: {
    title: 'Banco de Questões',
    myNotes: '📝 Minhas anotações',
    notePlaceholder: 'Escreva suas anotações sobre esta questão...',
    confirmAnswer: 'Confirmar resposta',
    yourAnswer: 'Sua resposta',
    correctAnswer: 'Resposta correta',
    explanation: 'Explicação',
    generateFlashcard: '🃏 Criar flashcard desta questão',
    prevQuestion: '← Anterior',
    nextQuestion: 'Próxima →',
    nextQuestionBtn: 'Próxima questão →',
    filter: 'Filtrar',
    allSteps: 'Todos os steps',
    allSubjects: 'Todas especialidades',
    allDifficulties: 'Todas dificuldades',
    unanswered: 'Não respondidas',
    answered: 'Respondidas',
    answeredCount: 'respondidas',
    difficulty: 'Dificuldade',
    specialtyFilter: 'Especialidade',
    questionsFound: 'questões encontradas',
    answeredCorrectly: '✓ Respondida corretamente',
    answeredIncorrectly: '✗ Respondida incorretamente',
    autoFlashcard: '📚 Flashcard criado automaticamente para revisão',
    verifying: 'Verificando...',
    saveNote: 'Salvar nota',
  },
  flashcards: {
    title: 'Flashcards',
    dueToday: 'para revisar hoje',
    again: 'De novo',
    hard: 'Difícil',
    good: 'Bom',
    easy: 'Fácil',
    front: 'Frente',
    back: 'Verso',
    subject: 'Especialidade',
    create: 'Criar flashcard',
    generating: 'Gerando...',
    noCards: 'Nenhum flashcard ainda.',
    allDone: 'Todos revisados!',
    sessionDone: 'Sessão concluída!',
    reviewedCount: 'Você revisou',
    sm2Note: 'O algoritmo SM-2 agendou as próximas revisões para você.',
    backToBrowse: 'Voltar ao painel de flashcards',
    reviewing: 'Revisando Flashcards',
    cardsForToday: 'cards para hoje',
    exitReview: '← Sair da revisão',
    clickReveal: 'Clique para revelar',
    clickForBack: 'Clique para ver o verso',
    howDidYouDo: 'Como você se saiu?',
    generateAI: '✨ Gerar com IA',
    startReview: 'Iniciar revisão',
    totalCards: 'cards no total',
    dueReviewBadge: '⏰ Para revisar',
    upToDateBadge: '✓ Em dia',
    interval: 'Intervalo',
    ease: 'Facilidade',
    nextReview: 'Próxima',
    noCardsSubject: 'Nenhum flashcard encontrado para esta especialidade.',
    allSubjects: 'Todas',
  },
  simulado: {
    title: 'Simulado USMLE',
    start: 'Iniciar simulado',
    step: 'Step',
    specialty: 'Especialidade',
    questionCount: 'Questões',
    timeEstimate: 'Tempo estimado',
    flagQuestion: 'Marcar questão',
    unflagQuestion: 'Desmarcar',
    finishExam: 'Finalizar simulado',
    results: 'Resultado',
    score: 'Pontuação',
    flagged: 'Marcadas',
    correctAnswer: 'Resposta correta',
    yourAnswer: 'Sua resposta',
    reviewFlagged: 'Revisar marcadas',
    allQuestions: 'Todas as questões',
    configSubtitle: 'Condições reais do USMLE — 1 min 20 seg por questão, sem gabarito durante a prova',
    numQuestions: 'Número de questões',
    totalTime: 'Tempo total',
    available: 'questões disponíveis com esses filtros',
    willDraw: 'Serão sorteadas',
    willDrawSuffix: 'questões aleatoriamente',
    finishConfirm: 'Finalizar simulado agora?',
    flaggedForReview: 'Marcada para revisão',
    removeFlag: 'Remover flag',
    completed: 'Simulado Concluído',
    timeUsedOf: 'Tempo utilizado',
    of: 'de',
    perSubject: 'Desempenho por Especialidade',
    flaggedSection: 'Questões marcadas para revisão',
    newExam: '← Novo simulado',
    answeredLabel: 'respondidas',
    flaggedLabel: 'marcadas',
    notAnswered: 'Não respondida',
    blank: 'em branco',
  },
  dashboard: {
    greeting: 'Bom dia',
    greetingMorning: 'Bom dia',
    greetingAfternoon: 'Boa tarde',
    greetingEvening: 'Boa noite',
    todayQuestions: 'Questões hoje',
    accuracyToday: '% Acerto hoje',
    todayFlashcards: 'Flashcards hoje',
    totalAnswered: 'Total respondidas',
    weeklyTime: 'Tempo esta semana',
    weeklyActivity: 'Atividade Semanal',
    subjectProgress: 'Progresso por Especialidade',
    recentPerformance: 'Desempenho Recente (7 dias)',
    practiceQuestions: 'Praticar Questões',
    reviewFlashcards: 'Revisar Flashcards',
    dueFlashcards: 'Flashcards devidos',
    daysToMatch: 'dias para o seu Match',
    consecutiveDays: 'dias consecutivos',
    sinceBeginning: 'desde o início',
    estimated: 'estimado',
    resumeWhere: 'Continuar de onde parou',
    weakestSpecialty: 'Especialidade mais fraca',
    availableQ: 'questões disponíveis',
    daysRemaining: 'dias restantes',
    lastDayWeek: 'Último dia da semana',
    usmleBank: 'Banco USMLE Step 1, 2CK e 3',
    cardsToReview: 'cards para revisar',
    motivDone: '🏆 Meta da semana atingida! Excelente desempenho!',
    motivAlmost: '💪 Ótimo progresso! Você está quase lá.',
    motivGoing: '📈 Bom início! Mantenha o ritmo.',
    motivFocus: '🎯 Foco! Você ainda tem tempo para atingir a meta.',
    thanYesterday: 'que ontem',
    sameAsYesterday: 'igual a ontem',
  },
  perfil: {
    title: 'Meu Perfil',
    subtitle: 'Gerencie seus dados e acompanhe seu progresso',
    personalData: 'Dados Pessoais',
    fullName: 'Nome completo',
    email: 'Email',
    medicalSchool: 'Faculdade de Medicina',
    graduationYear: 'Ano de formatura',
    matchGoal: 'Meta do Match',
    translationLanguage: '🌐 Idioma de tradução preferido',
    translationLanguageHint: 'Usado nos botões de tradução das questões e simulados',
    generalProgress: 'Progresso Geral',
    subjectProgress: 'Progresso por Especialidade',
    currentPlan: 'Plano Atual',
    active: '✓ Ativo',
    inactive: '✗ Inativo',
    trialUntil: 'Trial até',
    dailyLimit: 'Limite diário',
    unlimited: '✓ Questões ilimitadas',
    makeUpgrade: 'Fazer upgrade',
    savedData: '✓ Dados salvos!',
    saveErrorMsg: '✗ Erro ao salvar',
  },
  ranking: {
    title: 'Ranking',
    subtitle: 'Top 20 usuários por questões respondidas',
    user: 'Usuário',
    questions: 'Questões',
    accuracy: 'Acerto',
    sequence: 'Sequência',
    you: 'você',
    empty: 'Nenhum dado disponível ainda. Responda questões para aparecer no ranking!',
  },
}

const en: T = {
  nav: {
    dashboard: 'Dashboard',
    questions: 'Questions',
    flashcards: 'Flashcards',
    simulado: 'Exam Mode',
    ranking: 'Ranking',
    perfil: 'Profile',
    admin: 'Admin',
    logout: 'Logout',
  },
  btn: {
    confirm: 'Confirm answer',
    next: 'Next',
    prev: 'Previous',
    save: 'Save',
    saving: 'Saving...',
    saveChanges: 'Save changes',
    edit: 'Edit',
    cancel: 'Cancel',
    createFlashcard: 'Create flashcard',
    upgrade: 'Upgrade plan',
    editGoal: '✏️ Edit goal',
    saveGoal: 'Save goal',
  },
  label: {
    weeklyGoal: 'Weekly goal',
    goalReached: '✓ Goal reached!',
    dueToday: 'Due for review today',
    streak: 'Streak',
    correct: 'Correct',
    incorrect: 'Incorrect',
    loading: 'Loading...',
    questionsAnswered: 'Questions answered',
    accuracy: 'Overall accuracy',
    studiedDays: 'Days studied',
    flashcardsReviewed: 'Flashcards reviewed',
    sequence: 'Current streak',
    questions: 'Questions',
    flashcards: 'Flashcards',
  },
  translate: {
    translateTo: '🌐 Translate to Portuguese',
    hide: 'Hide translation',
    translating: 'Translating...',
    translateQuestion: 'Translate question',
    translateExplanation: 'Translate explanation',
    translationLabel: 'Translation',
    translationOf: 'Explanation translation',
  },
  msg: {
    flashcardSaved: '✓ Flashcard saved!',
    noteSaved: '✓ Note saved!',
    saveError: '✗ Error saving',
    dataSaved: '✓ Data saved!',
    noQuestions: 'No questions found.',
    allUpToDate: 'All up to date!',
    limitReached: 'Daily limit reached',
    nothingToReview: 'No flashcards to review right now.',
  },
  questions: {
    title: 'Question Bank',
    myNotes: '📝 My notes',
    notePlaceholder: 'Write your notes about this question...',
    confirmAnswer: 'Confirm answer',
    yourAnswer: 'Your answer',
    correctAnswer: 'Correct answer',
    explanation: 'Explanation',
    generateFlashcard: '🃏 Create flashcard from this question',
    prevQuestion: '← Previous',
    nextQuestion: 'Next →',
    nextQuestionBtn: 'Next question →',
    filter: 'Filter',
    allSteps: 'All steps',
    allSubjects: 'All subjects',
    allDifficulties: 'All difficulties',
    unanswered: 'Unanswered',
    answered: 'Answered',
    answeredCount: 'answered',
    difficulty: 'Difficulty',
    specialtyFilter: 'Subject',
    questionsFound: 'questions found',
    answeredCorrectly: '✓ Answered correctly',
    answeredIncorrectly: '✗ Answered incorrectly',
    autoFlashcard: '📚 Flashcard automatically created for review',
    verifying: 'Verifying...',
    saveNote: 'Save note',
  },
  flashcards: {
    title: 'Flashcards',
    dueToday: 'due today',
    again: 'Again',
    hard: 'Hard',
    good: 'Good',
    easy: 'Easy',
    front: 'Front',
    back: 'Back',
    subject: 'Subject',
    create: 'Create flashcard',
    generating: 'Generating...',
    noCards: 'No flashcards yet.',
    allDone: 'All done!',
    sessionDone: 'Session complete!',
    reviewedCount: 'You reviewed',
    sm2Note: 'The SM-2 algorithm has scheduled the next reviews.',
    backToBrowse: 'Back to flashcards',
    reviewing: 'Reviewing Flashcards',
    cardsForToday: 'cards for today',
    exitReview: '← Exit review',
    clickReveal: 'Click to reveal',
    clickForBack: 'Click to see back',
    howDidYouDo: 'How did you do?',
    generateAI: '✨ Generate with AI',
    startReview: 'Start review',
    totalCards: 'cards total',
    dueReviewBadge: '⏰ Due for review',
    upToDateBadge: '✓ Up to date',
    interval: 'Interval',
    ease: 'Ease',
    nextReview: 'Next',
    noCardsSubject: 'No flashcards found for this subject.',
    allSubjects: 'All',
  },
  simulado: {
    title: 'USMLE Exam Mode',
    start: 'Start exam',
    step: 'Step',
    specialty: 'Specialty',
    questionCount: 'Questions',
    timeEstimate: 'Estimated time',
    flagQuestion: 'Flag question',
    unflagQuestion: 'Unflag',
    finishExam: 'Finish exam',
    results: 'Results',
    score: 'Score',
    flagged: 'Flagged',
    correctAnswer: 'Correct answer',
    yourAnswer: 'Your answer',
    reviewFlagged: 'Review flagged',
    allQuestions: 'All questions',
    configSubtitle: 'Real USMLE conditions — 1 min 20 sec per question, no answer key during the exam',
    numQuestions: 'Number of questions',
    totalTime: 'Total time',
    available: 'questions available with these filters',
    willDraw: 'Will draw',
    willDrawSuffix: 'questions randomly',
    finishConfirm: 'Finish exam now?',
    flaggedForReview: 'Flagged for review',
    removeFlag: 'Remove flag',
    completed: 'Exam Complete',
    timeUsedOf: 'Time used',
    of: 'of',
    perSubject: 'Performance by Subject',
    flaggedSection: 'Questions flagged for review',
    newExam: '← New exam',
    answeredLabel: 'answered',
    flaggedLabel: 'flagged',
    notAnswered: 'Not answered',
    blank: 'blank',
  },
  dashboard: {
    greeting: 'Good morning',
    greetingMorning: 'Good morning',
    greetingAfternoon: 'Good afternoon',
    greetingEvening: 'Good evening',
    todayQuestions: "Today's questions",
    accuracyToday: "Today's accuracy",
    todayFlashcards: "Today's flashcards",
    totalAnswered: 'Total answered',
    weeklyTime: 'Time this week',
    weeklyActivity: 'Weekly Activity',
    subjectProgress: 'Progress by Subject',
    recentPerformance: 'Recent Performance (7 days)',
    practiceQuestions: 'Practice Questions',
    reviewFlashcards: 'Review Flashcards',
    dueFlashcards: 'Flashcards due',
    daysToMatch: 'days to your Match',
    consecutiveDays: 'consecutive days',
    sinceBeginning: 'since the beginning',
    estimated: 'estimated',
    resumeWhere: 'Continue where you left off',
    weakestSpecialty: 'Weakest subject',
    availableQ: 'questions available',
    daysRemaining: 'days remaining',
    lastDayWeek: 'Last day of the week',
    usmleBank: 'USMLE Step 1, 2CK & 3 bank',
    cardsToReview: 'cards to review',
    motivDone: '🏆 Weekly goal reached! Excellent performance!',
    motivAlmost: "💪 Great progress! You're almost there.",
    motivGoing: '📈 Good start! Keep the pace.',
    motivFocus: '🎯 Focus! You still have time to reach your goal.',
    thanYesterday: 'than yesterday',
    sameAsYesterday: 'same as yesterday',
  },
  perfil: {
    title: 'My Profile',
    subtitle: 'Manage your data and track your progress',
    personalData: 'Personal Data',
    fullName: 'Full name',
    email: 'Email',
    medicalSchool: 'Medical School',
    graduationYear: 'Graduation year',
    matchGoal: 'Match goal',
    translationLanguage: '🌐 Preferred translation language',
    translationLanguageHint: 'Used in question and exam translation buttons',
    generalProgress: 'General Progress',
    subjectProgress: 'Progress by Subject',
    currentPlan: 'Current Plan',
    active: '✓ Active',
    inactive: '✗ Inactive',
    trialUntil: 'Trial until',
    dailyLimit: 'Daily limit',
    unlimited: '✓ Unlimited questions',
    makeUpgrade: 'Upgrade plan',
    savedData: '✓ Data saved!',
    saveErrorMsg: '✗ Error saving',
  },
  ranking: {
    title: 'Ranking',
    subtitle: 'Top 20 users by questions answered',
    user: 'User',
    questions: 'Questions',
    accuracy: 'Accuracy',
    sequence: 'Streak',
    you: 'you',
    empty: 'No data yet. Answer questions to appear on the leaderboard!',
  },
}

const es: T = {
  nav: {
    dashboard: 'Panel',
    questions: 'Preguntas',
    flashcards: 'Flashcards',
    simulado: 'Simulacro',
    ranking: 'Ranking',
    perfil: 'Perfil',
    admin: 'Admin',
    logout: 'Salir',
  },
  btn: {
    confirm: 'Confirmar respuesta',
    next: 'Siguiente',
    prev: 'Anterior',
    save: 'Guardar',
    saving: 'Guardando...',
    saveChanges: 'Guardar cambios',
    edit: 'Editar',
    cancel: 'Cancelar',
    createFlashcard: 'Crear flashcard',
    upgrade: 'Mejorar plan',
    editGoal: '✏️ Editar meta',
    saveGoal: 'Guardar meta',
  },
  label: {
    weeklyGoal: 'Meta semanal',
    goalReached: '✓ ¡Meta alcanzada!',
    dueToday: 'Para revisar hoy',
    streak: 'Racha',
    correct: 'Correctas',
    incorrect: 'Incorrectas',
    loading: 'Cargando...',
    questionsAnswered: 'Preguntas respondidas',
    accuracy: 'Precisión general',
    studiedDays: 'Días estudiados',
    flashcardsReviewed: 'Flashcards revisados',
    sequence: 'Racha actual',
    questions: 'Preguntas',
    flashcards: 'Flashcards',
  },
  translate: {
    translateTo: '🌐 Traducir al Español',
    hide: 'Ocultar traducción',
    translating: 'Traduciendo...',
    translateQuestion: 'Traducir pregunta',
    translateExplanation: 'Traducir explicación',
    translationLabel: '🇪🇸 Traducción en Español',
    translationOf: 'Traducción de la explicación',
  },
  msg: {
    flashcardSaved: '✓ ¡Flashcard guardado!',
    noteSaved: '✓ ¡Nota guardada!',
    saveError: '✗ Error al guardar',
    dataSaved: '✓ ¡Datos guardados!',
    noQuestions: 'No se encontraron preguntas.',
    allUpToDate: '¡Todo al día!',
    limitReached: 'Límite diario alcanzado',
    nothingToReview: 'No hay flashcards para revisar ahora.',
  },
  questions: {
    title: 'Banco de Preguntas',
    myNotes: '📝 Mis anotaciones',
    notePlaceholder: 'Escribe tus anotaciones sobre esta pregunta...',
    confirmAnswer: 'Confirmar respuesta',
    yourAnswer: 'Tu respuesta',
    correctAnswer: 'Respuesta correcta',
    explanation: 'Explicación',
    generateFlashcard: '🃏 Crear flashcard de esta pregunta',
    prevQuestion: '← Anterior',
    nextQuestion: 'Siguiente →',
    nextQuestionBtn: 'Siguiente pregunta →',
    filter: 'Filtrar',
    allSteps: 'Todos los steps',
    allSubjects: 'Todas las especialidades',
    allDifficulties: 'Todas las dificultades',
    unanswered: 'Sin responder',
    answered: 'Respondidas',
    answeredCount: 'respondidas',
    difficulty: 'Dificultad',
    specialtyFilter: 'Especialidad',
    questionsFound: 'preguntas encontradas',
    answeredCorrectly: '✓ Respondida correctamente',
    answeredIncorrectly: '✗ Respondida incorrectamente',
    autoFlashcard: '📚 Flashcard creado automáticamente para revisión',
    verifying: 'Verificando...',
    saveNote: 'Guardar nota',
  },
  flashcards: {
    title: 'Flashcards',
    dueToday: 'para revisar hoy',
    again: 'Otra vez',
    hard: 'Difícil',
    good: 'Bien',
    easy: 'Fácil',
    front: 'Frente',
    back: 'Reverso',
    subject: 'Especialidad',
    create: 'Crear flashcard',
    generating: 'Generando...',
    noCards: 'Sin flashcards todavía.',
    allDone: '¡Todo completado!',
    sessionDone: '¡Sesión completada!',
    reviewedCount: 'Revisaste',
    sm2Note: 'El algoritmo SM-2 ha programado las próximas revisiones.',
    backToBrowse: 'Volver a flashcards',
    reviewing: 'Revisando Flashcards',
    cardsForToday: 'tarjetas para hoy',
    exitReview: '← Salir de la revisión',
    clickReveal: 'Haz clic para revelar',
    clickForBack: 'Haz clic para ver el reverso',
    howDidYouDo: '¿Cómo te fue?',
    generateAI: '✨ Generar con IA',
    startReview: 'Iniciar revisión',
    totalCards: 'tarjetas en total',
    dueReviewBadge: '⏰ Para revisar',
    upToDateBadge: '✓ Al día',
    interval: 'Intervalo',
    ease: 'Facilidad',
    nextReview: 'Próxima',
    noCardsSubject: 'No se encontraron flashcards para esta especialidad.',
    allSubjects: 'Todas',
  },
  simulado: {
    title: 'Simulacro USMLE',
    start: 'Iniciar simulacro',
    step: 'Step',
    specialty: 'Especialidad',
    questionCount: 'Preguntas',
    timeEstimate: 'Tiempo estimado',
    flagQuestion: 'Marcar pregunta',
    unflagQuestion: 'Desmarcar',
    finishExam: 'Finalizar simulacro',
    results: 'Resultado',
    score: 'Puntuación',
    flagged: 'Marcadas',
    correctAnswer: 'Respuesta correcta',
    yourAnswer: 'Tu respuesta',
    reviewFlagged: 'Revisar marcadas',
    allQuestions: 'Todas las preguntas',
    configSubtitle: 'Condiciones reales del USMLE — 1 min 20 seg por pregunta, sin respuestas durante el examen',
    numQuestions: 'Número de preguntas',
    totalTime: 'Tiempo total',
    available: 'preguntas disponibles con estos filtros',
    willDraw: 'Se seleccionarán',
    willDrawSuffix: 'preguntas aleatoriamente',
    finishConfirm: '¿Finalizar simulacro ahora?',
    flaggedForReview: 'Marcada para revisión',
    removeFlag: 'Quitar marca',
    completed: 'Simulacro Completado',
    timeUsedOf: 'Tiempo utilizado',
    of: 'de',
    perSubject: 'Rendimiento por Especialidad',
    flaggedSection: 'Preguntas marcadas para revisión',
    newExam: '← Nuevo simulacro',
    answeredLabel: 'respondidas',
    flaggedLabel: 'marcadas',
    notAnswered: 'Sin responder',
    blank: 'en blanco',
  },
  dashboard: {
    greeting: 'Buenos días',
    greetingMorning: 'Buenos días',
    greetingAfternoon: 'Buenas tardes',
    greetingEvening: 'Buenas noches',
    todayQuestions: 'Preguntas hoy',
    accuracyToday: 'Precisión hoy',
    todayFlashcards: 'Flashcards hoy',
    totalAnswered: 'Total respondidas',
    weeklyTime: 'Tiempo esta semana',
    weeklyActivity: 'Actividad Semanal',
    subjectProgress: 'Progreso por Especialidad',
    recentPerformance: 'Rendimiento Reciente (7 días)',
    practiceQuestions: 'Practicar Preguntas',
    reviewFlashcards: 'Revisar Flashcards',
    dueFlashcards: 'Flashcards pendientes',
    daysToMatch: 'días para tu Match',
    consecutiveDays: 'días consecutivos',
    sinceBeginning: 'desde el inicio',
    estimated: 'estimado',
    resumeWhere: 'Continuar desde donde lo dejó',
    weakestSpecialty: 'Especialidad más débil',
    availableQ: 'preguntas disponibles',
    daysRemaining: 'días restantes',
    lastDayWeek: 'Último día de la semana',
    usmleBank: 'Banco USMLE Step 1, 2CK y 3',
    cardsToReview: 'tarjetas para revisar',
    motivDone: '🏆 ¡Meta semanal alcanzada! ¡Excelente desempeño!',
    motivAlmost: '💪 ¡Gran progreso! Estás casi ahí.',
    motivGoing: '📈 ¡Buen comienzo! Mantén el ritmo.',
    motivFocus: '🎯 ¡Enfócate! Todavía tienes tiempo para alcanzar tu meta.',
    thanYesterday: 'que ayer',
    sameAsYesterday: 'igual que ayer',
  },
  perfil: {
    title: 'Mi Perfil',
    subtitle: 'Administra tus datos y sigue tu progreso',
    personalData: 'Datos Personales',
    fullName: 'Nombre completo',
    email: 'Correo electrónico',
    medicalSchool: 'Facultad de Medicina',
    graduationYear: 'Año de graduación',
    matchGoal: 'Meta del Match',
    translationLanguage: '🌐 Idioma de traducción preferido',
    translationLanguageHint: 'Usado en los botones de traducción de preguntas y simulacros',
    generalProgress: 'Progreso General',
    subjectProgress: 'Progreso por Especialidad',
    currentPlan: 'Plan Actual',
    active: '✓ Activo',
    inactive: '✗ Inactivo',
    trialUntil: 'Prueba hasta',
    dailyLimit: 'Límite diario',
    unlimited: '✓ Preguntas ilimitadas',
    makeUpgrade: 'Mejorar plan',
    savedData: '✓ ¡Datos guardados!',
    saveErrorMsg: '✗ Error al guardar',
  },
  ranking: {
    title: 'Ranking',
    subtitle: 'Top 20 usuarios por preguntas respondidas',
    user: 'Usuario',
    questions: 'Preguntas',
    accuracy: 'Precisión',
    sequence: 'Racha',
    you: 'tú',
    empty: 'Sin datos todavía. ¡Responde preguntas para aparecer en el ranking!',
  },
}

export const translations: Record<Language, T> = { pt, en, es }
