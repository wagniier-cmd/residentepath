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
    filter: string
    allSteps: string
    allSubjects: string
    allDifficulties: string
    unanswered: string
    answered: string
    answeredCount: string
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
  }
  dashboard: {
    greeting: string
    todayQuestions: string
    todayFlashcards: string
    weeklyActivity: string
    subjectProgress: string
    practiceQuestions: string
    reviewFlashcards: string
    dueFlashcards: string
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
    filter: 'Filtrar',
    allSteps: 'Todos os steps',
    allSubjects: 'Todas especialidades',
    allDifficulties: 'Todas dificuldades',
    unanswered: 'Não respondidas',
    answered: 'Respondidas',
    answeredCount: 'respondidas',
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
  },
  dashboard: {
    greeting: 'Bom dia',
    todayQuestions: 'Questões hoje',
    todayFlashcards: 'Flashcards hoje',
    weeklyActivity: 'Atividade Semanal',
    subjectProgress: 'Progresso por Especialidade',
    practiceQuestions: 'Praticar Questões',
    reviewFlashcards: 'Revisar Flashcards',
    dueFlashcards: 'Flashcards devidos',
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
    filter: 'Filter',
    allSteps: 'All steps',
    allSubjects: 'All subjects',
    allDifficulties: 'All difficulties',
    unanswered: 'Unanswered',
    answered: 'Answered',
    answeredCount: 'answered',
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
  },
  dashboard: {
    greeting: 'Good morning',
    todayQuestions: "Today's questions",
    todayFlashcards: "Today's flashcards",
    weeklyActivity: 'Weekly Activity',
    subjectProgress: 'Progress by Subject',
    practiceQuestions: 'Practice Questions',
    reviewFlashcards: 'Review Flashcards',
    dueFlashcards: 'Flashcards due',
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
    filter: 'Filtrar',
    allSteps: 'Todos los steps',
    allSubjects: 'Todas las especialidades',
    allDifficulties: 'Todas las dificultades',
    unanswered: 'Sin responder',
    answered: 'Respondidas',
    answeredCount: 'respondidas',
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
  },
  dashboard: {
    greeting: 'Buenos días',
    todayQuestions: 'Preguntas hoy',
    todayFlashcards: 'Flashcards hoy',
    weeklyActivity: 'Actividad Semanal',
    subjectProgress: 'Progreso por Especialidad',
    practiceQuestions: 'Practicar Preguntas',
    reviewFlashcards: 'Revisar Flashcards',
    dueFlashcards: 'Flashcards pendientes',
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
