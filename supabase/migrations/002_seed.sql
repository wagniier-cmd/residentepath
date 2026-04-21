-- ============================================================
-- ResidentePath — Seed Data
-- 10 USMLE Questions + 20 Flashcards (em português)
-- ============================================================

-- ============================================================
-- QUESTIONS
-- ============================================================

INSERT INTO public.questions (stem, option_a, option_b, option_c, option_d, option_e, correct_answer, explanation, usmle_step, subject, difficulty) VALUES

-- 1. Cardiology Step 1
(
  'Um homem de 55 anos com histórico de hipertensão e tabagismo chega ao pronto-socorro com dor torácica em opressão irradiando para o braço esquerdo há 2 horas. O ECG mostra supradesnivelamento do segmento ST em V1-V4. Qual é o mecanismo fisiopatológico mais provável desse quadro?',
  'Espasmo coronariano focal sem ruptura de placa',
  'Ruptura de placa aterosclerótica com formação de trombo oclusivo',
  'Dissecção espontânea da artéria coronária',
  'Embolia pulmonar maciça com cor pulmonale agudo',
  'Miocardite viral aguda com depressão da função ventricular',
  'B',
  'O IAMCSST (Infarto Agudo do Miocárdio com Supradesnivelamento do ST) resulta tipicamente da ruptura ou erosão de uma placa aterosclerótica vulnerável, com subsequente formação de trombo plaquetário oclusivo. O trombo bloqueia completamente o fluxo coronariano, levando à necrose transmural. Fatores de risco como hipertensão e tabagismo aceleram a progressão da aterosclerose e aumentam a instabilidade das placas.',
  'Step 1',
  'Cardiologia',
  'Médio'
),

-- 2. Neurology Step 1
(
  'Uma mulher de 35 anos apresenta episódios de fraqueza nas pernas que pioram com o calor e exercício. Ela também relata visão turva no olho direito há 3 semanas que melhorou espontaneamente. A RM de crânio mostra lesões hipointensas em T1 e hiperintensas em T2 na substância branca periventricular. Qual é o diagnóstico mais provável?',
  'Acidente vascular cerebral isquêmico em território da artéria cerebral anterior',
  'Esclerose lateral amiotrófica',
  'Esclerose múltipla forma remitente-recorrente',
  'Neuromielite óptica (Doença de Devic)',
  'Síndrome de Guillain-Barré',
  'C',
  'A Esclerose Múltipla (EM) forma remitente-recorrente é a apresentação mais comum, especialmente em mulheres jovens. Os critérios de McDonald exigem demonstração de disseminação no espaço (múltiplas lesões) e no tempo (episódios diferentes). A neurite óptica (visão turva com melhora) e a fraqueza em membros inferiores que piora com calor (sinal de Uhthoff) são clássicos da EM. As lesões periventriculares em T2 são típicas. A NMO afeta principalmente nervo óptico e medula.',
  'Step 1',
  'Neurologia',
  'Difícil'
),

-- 3. Gastroenterology Step 2CK
(
  'Um homem de 48 anos com histórico de etilismo crônico apresenta hematêmese volumosa. Ao exame: eritema palmar, aranhas vasculares, ascite e esplenomegalia. A endoscopia digestiva alta mostra varizes esofágicas com sinais vermelhos. Qual é a conduta imediata mais importante após estabilização hemodinâmica?',
  'Iniciar diuréticos para redução da ascite',
  'Administrar octreotida intravenosa e antibióticos profiláticos',
  'Realizar hepatectomia parcial de emergência',
  'Iniciar anticoagulação plena com heparina',
  'Solicitar tomografia de abdome para avaliar o parênquima hepático',
  'B',
  'No sangramento por varizes esofágicas, após ressuscitação volêmica, a octreotida (análogo da somatostatina) reduz o fluxo portal e a pressão nas varizes. Antibióticos profiláticos (ceftriaxona ou norfloxacino) são obrigatórios pois pacientes cirróticos têm alto risco de infecção bacteriana (peritonite bacteriana espontânea) que piora o prognóstico. A bandagem elástica endoscópica é o tratamento definitivo das varizes. Beta-bloqueadores são para profilaxia secundária, não aguda.',
  'Step 2CK',
  'Gastroenterologia',
  'Difícil'
),

-- 4. Pulmonology Step 2CK
(
  'Uma mulher de 28 anos, fumante há 10 anos, apresenta tosse produtiva com expectoração purulenta, febre (38.8°C), taquicardia e crepitações à ausculta em base direita. A radiografia de tórax mostra consolidação lobar no lobo inferior direito. Qual é o agente etiológico mais provável?',
  'Mycobacterium tuberculosis',
  'Staphylococcus aureus',
  'Streptococcus pneumoniae',
  'Pneumocystis jirovecii',
  'Klebsiella pneumoniae',
  'C',
  'O Streptococcus pneumoniae é o agente mais comum de pneumonia adquirida na comunidade (PAC) em adultos imunocompetentes, respondendo por 30-50% dos casos. Classicamente causa pneumonia lobar com consolidação, febre alta, calafrios e expectoração purulenta ou ferruginosa. S. aureus causa pneumonia necrotizante geralmente pós-influenza. Klebsiella afeta mais alcoólatras e imunossuprimidos. PCP ocorre em HIV/AIDS. TB tem apresentação subaguda com hemoptise e infiltrado apical.',
  'Step 2CK',
  'Pneumologia',
  'Fácil'
),

-- 5. Nephrology Step 1
(
  'Uma mulher de 32 anos grávida (28 semanas) apresenta proteinúria 3+ na urinálise de rotina, pressão arterial 158/102 mmHg, edema de membros inferiores e cefaleia intensa. O exame laboratorial mostra creatinina 1.3 mg/dL, plaquetas 90.000/mm³ e elevação de enzimas hepáticas. Qual é o diagnóstico?',
  'Nefropatia diabética gestacional',
  'Síndrome nefrótica idiopática',
  'Síndrome HELLP',
  'Pré-eclâmpsia leve',
  'Pielonefrite aguda gestacional',
  'C',
  'A Síndrome HELLP (Hemolysis, Elevated Liver enzymes, Low Platelets) é uma complicação grave da pré-eclâmpsia. Critérios: hemólise (LDH elevada, esquizócitos), elevação de AST/ALT e plaquetopenia (<100.000/mm³). Ocorre geralmente após 20 semanas. O único tratamento definitivo é o parto. A distinção da pré-eclâmpsia leve é importante: HELLP tem trombocitopenia e hepatotoxicidade que caracterizam a gravidade.',
  'Step 1',
  'Nefrologia',
  'Difícil'
),

-- 6. Endocrinology Step 2CK
(
  'Um homem de 45 anos obeso (IMC 34) apresenta polidipsia, poliúria e emagrecimento de 5kg no último mês. A glicemia de jejum é 287 mg/dL e HbA1c 10.2%. Ele não tem cetose. Qual é a terapia farmacológica inicial mais adequada?',
  'Insulina basal glargina + metformina',
  'Apenas mudança de estilo de vida por 3 meses',
  'Sulfonilureia isolada (glibenclamida)',
  'Apenas metformina em monoterapia',
  'Inibidor de SGLT-2 isolado',
  'A',
  'Com HbA1c ≥10% e sintomas de hiperglicemia, as diretrizes ADA/SBEM recomendam início com insulina basal (glargina, detemir) associada à metformina. A metformina reduz a resistência insulínica hepática e é segura em DM2 sem contraindicações. Somente dieta com HbA1c tão alta seria insuficiente. Sulfonilureias aumentam risco de hipoglicemia. SGLT-2 não é suficiente como monoterapia nesse caso. A combinação insulina+metformina permite redução mais rápida da glicotoxicidade.',
  'Step 2CK',
  'Endocrinologia',
  'Médio'
),

-- 7. Hematology Step 1
(
  'Um menino de 8 anos de origem africana apresenta dor óssea intensa, febre e anemia. O hemograma mostra hemoglobina 7.2 g/dL, leucocitose e reticulocitose. O esfregaço de sangue periférico revela eritrócitos em forma de foice (drepanócitos). Qual é a base molecular dessa doença?',
  'Deleção dos genes de alfa-globina no cromossomo 16',
  'Substituição do glutamato por valina na posição 6 da cadeia beta-globina',
  'Deficiência de glicose-6-fosfato desidrogenase (G6PD)',
  'Mutação no gene da espectrina causando esferocitose',
  'Defeito na síntese de porfirinas levando a hemoglobina instável',
  'B',
  'A doença falciforme (HbSS) é causada por mutação pontual no gene HBB: substituição do ácido glutâmico (GAG) por valina (GTG) na posição 6 da cadeia beta-globina. A HbS polimeriza quando desoxigenada, formando os drepanócitos que causam vaso-oclusão, hemólise e crise álgica. É uma herança autossômica recessiva. A alfa-talassemia envolve deleção de alfa-globina. G6PD é doença ligada ao X com hemólise episódica. Esferocitose é defeito de membrana.',
  'Step 1',
  'Hematologia',
  'Médio'
),

-- 8. Infectious Disease Step 2CK
(
  'Uma mulher de 26 anos HIV positivo (CD4 85 células/mm³, carga viral detectável) apresenta febre, cefaleia e rigidez de nuca há 5 dias. A punção lombar mostra abertura sob pressão de 280 mmH₂O, glicorraquia baixa, proteína elevada e tinta da China positiva. Qual é o tratamento de escolha?',
  'Ceftriaxona + vancomicina intravenosa',
  'Anfotericina B lipossomal + flucitosina por 2 semanas, seguido de fluconazol',
  'Aciclovir intravenoso',
  'Fluconazol isolado por 6 semanas',
  'Trimetoprim-sulfametoxazol intravenoso',
  'B',
  'Meningite por Cryptococcus neoformans é a causa mais comum de meningite fúngica em pacientes com HIV/AIDS com CD4 <100. O diagnóstico é confirmado pela tinta da China (detecta a cápsula polissacarídica) e pelo antígeno criptocócico. O protocolo padrão (IDSA) é: Indução: Anfotericina B lipossomal 3-4 mg/kg/dia + flucitosina 100 mg/kg/dia por 14 dias. Consolidação: Fluconazol 400 mg/dia por 8 semanas. Manutenção: Fluconazol 200 mg/dia até reconstituição imune.',
  'Step 2CK',
  'Infectologia',
  'Difícil'
),

-- 9. Psychiatry Step 2CK
(
  'Um homem de 22 anos é trazido pela família por comportamento bizarro progressivo há 8 meses. Ele acredita que sua mente está sendo controlada por aliens, ouve vozes que comentam suas ações e passou a se isolar socialmente. Não há uso de substâncias. Qual é o diagnóstico mais provável e a farmacoterapia de primeira linha?',
  'Transtorno bipolar tipo I com psicose — iniciar lítio',
  'Depressão maior com características psicóticas — iniciar sertralina',
  'Esquizofrenia — iniciar antipsicótico de segunda geração (risperidona)',
  'Transtorno esquizoafetivo — iniciar haloperidol',
  'Uso de substâncias — aguardar abstinência antes de tratar',
  'C',
  'O quadro clássico de esquizofrenia inclui: sintomas positivos (alucinações auditivas comentadoras, delírios de controle), sintomas negativos (isolamento social, abulia) com duração >6 meses. A idade de início típica é 15-25 anos em homens. Antipsicóticos atípicos (2ª geração) como risperidona, olanzapina ou aripiprazol são primeira linha por terem melhor perfil de efeitos colaterais que os típicos (haloperidol). Lítio é para bipolar. ISRS não tratam psicose primária.',
  'Step 2CK',
  'Psiquiatria',
  'Médio'
),

-- 10. Pharmacology Step 1
(
  'Uma paciente de 68 anos em uso de varfarina para fibrilação atrial inicia tratamento com amoxicilina-clavulanato para infecção respiratória. Após 5 dias, o INR sobe de 2.4 para 4.8. Qual é o mecanismo mais provável dessa interação medicamentosa?',
  'A amoxicilina inibe a CYP2C9, reduzindo o metabolismo da varfarina',
  'O antibiótico reduz a flora intestinal produtora de vitamina K, potencializando a anticoagulação',
  'A amoxicilina desloca a varfarina de sua ligação à albumina plasmática',
  'O ácido clavulânico inibe a vitamina K epóxido redutase',
  'A amoxicilina aumenta a absorção intestinal da varfarina',
  'B',
  'Antibióticos de amplo espectro (especialmente beta-lactâmicos, fluoroquinolonas, metronidazol) potencializam a anticoagulação com varfarina principalmente por eliminar a flora intestinal bacteriana (especialmente Bacteroides spp.) que sintetiza vitamina K2 (menaquinona). Com menos vitamina K disponível, os fatores de coagulação dependentes (II, VII, IX, X, proteínas C e S) ficam mais reduzidos, aumentando o INR. Metronidazol e fluconazol TAMBÉM inibem CYP2C9. Amoxicilina sozinha não inibe CYP2C9 significativamente.',
  'Step 1',
  'Farmacologia',
  'Difícil'
);

-- ============================================================
-- FLASHCARDS (20 cards)
-- ============================================================

INSERT INTO public.flashcards (front, back, subject) VALUES

('Quais são os critérios de Framingham para insuficiência cardíaca?',
'Critérios MAIORES: dispneia paroxística noturna, turgência jugular, crepitações pulmonares, cardiomegalia, EAP agudo, S3, PVJ >16 cmH₂O, refluxo hepatojugular, perda de >4,5kg com diuréticos. Critérios MENORES: edema bilateral de tornozelos, tosse noturna, dispneia aos esforços, hepatomegalia, derrame pleural, FC>120bpm, perda de 4,5kg sem diuréticos. Diagnóstico: 2 maiores OU 1 maior + 2 menores.',
'Cardiologia'),

('Qual é o mecanismo de ação da digoxina e suas principais indicações?',
'Mecanismo: Inibe a Na+/K+ ATPase → ↑Na+ intracelular → troca com Ca²+ → ↑contratilidade (efeito inotrópico positivo). Bloqueia o nó AV (efeito cronotrópico negativo). Indicações: IC com FE reduzida sintomática (refratária), fibrilação atrial para controle de frequência ventricular. Janela terapêutica estreita: nível sérico alvo 0.5-0.9 ng/mL. Toxicidade: bloqueios, taquiarritmias, visão amarelada, náuseas.',
'Cardiologia'),

('Descreva os critérios diagnósticos para Síndrome Metabólica (IDF/AHA 2009)',
'Requer 3 de 5 critérios: 1) Circunferência abdominal ≥102cm (H) ou ≥88cm (M); 2) Triglicerídeos ≥150 mg/dL ou tratamento farmacológico; 3) HDL <40 mg/dL (H) ou <50 mg/dL (M); 4) PA ≥130/85 mmHg ou tratamento; 5) Glicemia de jejum ≥100 mg/dL ou DM2 diagnosticado. A síndrome aumenta risco cardiovascular e de DM2.',
'Endocrinologia'),

('Quais são os achados laboratoriais no hipotireoidismo primário vs. secundário?',
'Primário (falência tireoidiana): TSH ↑↑, T4 livre ↓. Ex: Tireoidite de Hashimoto, pós-radioiodo. Secundário (falência hipofisária): TSH ↓ ou inapropriadamente normal, T4 livre ↓. Ex: adenoma hipofisário. Terciário (hipotalâmico): TRH ↓, TSH ↓, T4↓. Ponto-chave: TSH é o melhor triador para hipotireoidismo primário. Anticorpos anti-TPO e anti-Tg positivos → Hashimoto.',
'Endocrinologia'),

('Quais são as quatro fases do potencial de ação cardíaco ventricular?',
'Fase 0 — Despolarização rápida: abertura de canais rápidos de Na+ (corrente INa). Fase 1 — Repolarização precoce: inativação de Na+, abertura de Ito (K+ transiente). Fase 2 — Platô: entrada de Ca²+ (ICa-L) equilibra saída de K+; crucial para contração. Fase 3 — Repolarização rápida: correntes IKr e IKs (K+ retificador). Fase 4 — Repouso: potencial de repouso (-90mV), atividade da Na+/K+ ATPase. Nódulo SA não tem fase 0 rápida — depende de Ca²+.',
'Cardiologia'),

('Quais são os sinais e sintomas da síndrome de Horner e qual é sua localização anatômica?',
'Tríade clássica: Ptose (M. Tarsal superior — simpático), Miose (M. Dilatador da pupila), Anidrose (glândulas sudoríparas faciais). Pode incluir enoftalmia aparente. Via simpática ocular: Neurônio 1º (hipotálamo → C8-T2), Neurônio 2º (cadeia simpática cervical — apex pulmonar, artéria subclávia), Neurônio 3º (artéria carótida interna → olho). Causas: Pancoast (2º), dissecção carotídea (3º), AVC lateral de bulbo (1º — Wallenberg).',
'Neurologia'),

('Quais são os critérios diagnósticos para Diabetes Mellitus tipo 2?',
'Qualquer um dos seguintes: 1) Glicemia de jejum (≥8h) ≥126 mg/dL em 2 ocasiões; 2) TOTG 2h ≥200 mg/dL com 75g glicose; 3) HbA1c ≥6.5% (método certificado NGSP/DCCT); 4) Glicemia aleatória ≥200 mg/dL + sintomas clássicos (poliúria, polidipsia, emagrecimento). Pré-diabetes: GJ 100-125, TOTG 140-199, HbA1c 5.7-6.4%.',
'Endocrinologia'),

('Explique o mecanismo da lesão de reperfusão miocárdica',
'Após restauração do fluxo coronariano (trombólise ou ICP), paradoxalmente ocorre lesão adicional por: 1) Sobrecarga de Ca²+ (disfunção da NCX e mitocôndrias); 2) Produção de espécies reativas de oxigênio (EROs) pelos neutrófilos e mitocôndrias; 3) Abertura do mPTP (poro de transição mitocondrial) levando a apoptose; 4) Inflamação com infiltrado neutrofílico. A reperfusão é obrigatória (benefício supera o risco), mas estratégias como pós-condicionamento isquêmico tentam mitigar essa lesão.',
'Cardiologia'),

('Quais são as diferenças entre meningite bacteriana, viral e tuberculosa no LCR?',
'Bacteriana: aspecto turvo, células 1.000-10.000 (PMN), glicose <45mg/dL (ou <50% da glicemia), proteína >100mg/dL, Gram positivo em 60-80%. Viral: aspecto límpido, células 10-500 (linfócitos), glicose normal, proteína levemente elevada. Tuberculosa: aspecto límpido ou xantocrômico, células 100-500 (linfócitos), glicose muito baixa (<45), proteína muito elevada (>100), BAAR raramente positivo, ADA elevado. Fúngica: similar à TB + tinta da China positiva.',
'Infectologia'),

('Descreva a fisiopatologia da cetoacidose diabética (CAD)',
'CAD ocorre com deficiência absoluta ou relativa de insulina + excesso de hormônios contrarregulatórios (glucagon, cortisol, catecolaminas). Mecanismo: 1) ↓Insulina → ↑Lipólise → ↑AGL → ↑Cetogênese hepática (acetoacetato, β-hidroxibutirato); 2) ↓Glicose celular → ↑Glicogenólise e ↑Gliconeogênese → hiperglicemia; 3) Glicosúria → diurese osmótica → desidratação + perda de K+/Na+/fosfato; 4) Acidose metabólica com AG aumentado (>12). Tratamento: hidratação vigorosa, insulinoterapia, reposição de K+.',
'Endocrinologia'),

('Quais são os mecanismos de resistência bacteriana aos beta-lactâmicos?',
'1) Produção de beta-lactamases (ESBL, carbapenemases como KPC, NDM-1, OXA): hidrolisam o anel beta-lactâmico — mecanismo mais comum. 2) Alteração das PBPs (Proteínas Ligadoras de Penicilina): MRSA (mecA → PBP2a com baixa afinidade), S. pneumoniae resistente. 3) Bombas de efluxo: expulsão ativa do antibiótico. 4) Redução da permeabilidade da membrana externa: gram-negativos com porina OmpF/OmpC reduzida. Inibidores de beta-lactamases: ácido clavulânico, tazobactam, avibactam.',
'Microbiologia'),

('Qual é a cascata de coagulação e como cada via é testada laboratorialmente?',
'Via Extrínseca: Fator tecidual (III) + FVIIa → ativa FX. Testada pelo TP/INR (tempo de protrombina). Via Intrínseca: FXII → FXI → FIX → FVIIIa → ativa FX. Testada pelo TTPA (tempo de tromboplastina parcial ativada). Via Comum: FXa + FVa (protrombinase) → protrombina → trombina → fibrinogênio → fibrina → polimerização (FXIII). Varfarina: inibe fatores II, VII, IX, X (vitamina K-dependentes). Heparina: potencializa antitrombina III → inibe IIa e Xa.',
'Hematologia'),

('Quais são as indicações de transfusão de hemácias e como calcular a dose?',
'Indicações gerais: Hb <7 g/dL em pacientes estáveis; Hb <8 g/dL em pós-operatório ou DCV; Hb <10 g/dL em IAM agudo ou angina instável. Sintomáticos independente do valor (taquicardia, dispneia, hipotensão refratária). Cálculo da dose: Cada unidade de concentrado de hemácias (CH) eleva Hb em ~1 g/dL ou Ht em ~3% em adulto de 70kg. Fórmula: CHs necessários = (Hb desejada - Hb atual) × Peso(kg) × 0.3 / volume por CH. Sempre transfundir o mínimo necessário.',
'Hematologia'),

('Explique o sistema renina-angiotensina-aldosterona (SRAA) e seu papel na hipertensão',
'Sequência: Queda de PA/Na+ ou ativação simpática → Células justaglomerulares liberam RENINA → converte Angiotensinogênio (fígado) em Angiotensina I → ECA (pulmão) converte em Angiotensina II → (1) Vasoconstrição direta (receptor AT1); (2) Aldosterona (córtex adrenal) → retenção de Na+/H₂O; (3) ADH (sete neurose); (4) Hipertrofia cardíaca e vascular. Fármacos: IECA (captopril) bloqueia ECA; BRA (losartana) bloqueia AT1; Espironolactona bloqueia aldosterona; Alisquireno bloqueia renina.',
'Cardiologia'),

('Quais são os critérios de Duke modificados para endocardite infecciosa?',
'MAIORES: 1) Hemocultura positiva (2 coletas com microrganismo típico OU 3+ coletas persistentemente positivas); 2) Evidência de envolvimento endocárdico (ecocardiograma: vegetação, abscesso, perfuração, nova regurgitação valvar). MENORES: 1) Predisposição (valvopatia, uso de drogas IV); 2) Febre ≥38°C; 3) Fenômenos vasculares (êmbolos, aneurisma micótico, hemorragia conjuntival); 4) Fenômenos imunológicos (nódulos de Osler, manchas de Roth, FR+); 5) Hemocultura positiva não-critério maior. Definitivo: 2 maiores OU 1 maior+3 menores OU 5 menores.',
'Cardiologia'),

('Quais são os principais mecanismos de ação dos antidepressivos?',
'ISRS (fluoxetina, sertralina): bloqueiam recaptação de serotonina (5-HT) → 1ª linha para depressão e ansiedade. ISRSN (venlafaxina, duloxetina): bloqueiam 5-HT + noradrenalina → eficazes em dor crônica. ADT (amitriptilina): bloqueiam 5-HT + NA + muscarínicos + histaminérgicos → efeitos colaterais anticolinérgicos; úteis em dor neuropática. IMAO (fenelzina): inibem MAO A/B → interação alimentar (tiramina) e medicamentosa grave. Bupropiona: inibe recaptação de DA + NA → sem disfunção sexual, útil para cessação do tabagismo.',
'Psiquiatria'),

('Qual é a fisiopatologia e o tratamento da sepse/choque séptico segundo o Sepsis-3?',
'Sepse: disfunção orgânica ameaçadora à vida causada por resposta desregulada do hospedeiro à infecção (SOFA ≥2). Choque séptico: sepse + hipotensão refratária a fluidos + lactato >2 mmol/L. Fisiopatologia: ativação macrófagos → TNF-α, IL-1, IL-6 → NO → vasodilatação → hipotensão; disfunção endotelial → extravasamento; disfunção mitocondrial. Bundle 1 hora: 1) Hemoculturas (antes ATB); 2) Antibiótico de amplo espectro; 3) Cristalóides 30mL/kg se hipotensão/lactato>4; 4) Vasopressor (norepinefrina) se necessário; 5) Monitorar lactato.',
'Infectologia'),

('Descreva as fases do ciclo celular e os principais checkpoints',
'G1 (crescimento celular, síntese proteica) → S (síntese de DNA — duplicação cromossômica) → G2 (crescimento e preparação para mitose) → M (mitose: prófase, metáfase, anáfase, telófase) → citocinese. G0: quiescência. Checkpoints: G1/S: p53 ativa p21 (inibe CDK4/6-Ciclina D) → bloqueia progressão se dano ao DNA; Rb é fosforilado por CDK4/6 para liberar E2F. G2/M: inibição de CDK1-CiclinaB (MPF). Spindle checkpoint: garante separação correta dos cromossomos. Mutações em p53 e Rb são as mais comuns no câncer humano.',
'Patologia'),

('Quais são as complicações do diabetes mellitus e seus mecanismos?',
'Microvasculares (hiperglicemia crônica): 1) Retinopatia: não-proliferativa (microaneurismas, exsudatos) → proliferativa (neovascularização); 2) Nefropatia: espessamento MBG → microalbuminúria → macroalbuminúria → IRC; 3) Neuropatia: glicosilação de proteínas, sorbitol, estresse oxidativo. Macrovasculares: DAC, AVC, DAP (aterosclerose acelerada). Mecanismos: via do poliol (sorbitol), glicosilação avançada (AGEs), ativação PKC, estresse oxidativo. HbA1c <7% reduz complicações micro em 25-75% (DCCT/UKPDS).',
'Endocrinologia'),

('Quais são as etapas da cascata inflamatória e os mediadores envolvidos?',
'1) Lesão tecidual → mastócitos liberam histamina e TNF-α → vasodilatação e aumento de permeabilidade. 2) Complemento ativado (C3a, C5a = anafilotoxinas) → recrutamento de neutrófilos. 3) Macrófagos liberam IL-1, IL-6, TNF-α → febre (PGE2 no hipotálamo), fase aguda (PCR, fibrinogênio). 4) Neutrófilos → fagocitose via EROs e enzimas lisossômicas. 5) Linfócitos T e B → imunidade adaptativa. Mediadores lipídicos: PGs (COX-1/2), leucotrienos (5-LOX). AINEs inibem COX. Corticóides inibem fosfolipase A2 (lipocortina).',
'Patologia');
