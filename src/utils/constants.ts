import {
  Archetype,
  ArchetypeQuestion,
  MentalHack,
  RPGItem,
  MagistralHackItem,
  DiscoveryDeliverableState,
  DiscoveryTrackType
} from '../types';

export const ARCHETYPES: Record<string, Archetype> = {
  arquitecto: {
    id: 'arquitecto',
    name: 'El Arquitecto Silencioso',
    tagline: 'Maestro de la Estrategia Pura y los Sistemas Exponenciales',
    description: 'Ves patrones donde otros ven caos. Tu fuerza radica en construir estructuras inquebrantables y prever el tablero 5 jugadas adelante.',
    strengths: ['Planificación sistémica', 'Análisis frío bajo presión', 'Diseño de procesos de alta eficiencia'],
    blindspots: ['Parálisis por análisis', 'Perfeccionismo rígido', 'Desconexión emocional momentánea'],
    recommendedHack: 'La Regla del Vacío Activo',
    iconName: 'Compass',
    color: 'from-amber-500 to-yellow-600'
  },
  alquimista: {
    id: 'alquimista',
    name: 'El Alquimista Radical',
    tagline: 'Transmutador de Crisis en Oportunidades de Alto Volumen',
    description: 'Prosperas en la ambigüedad y el cambio constante. Tienes la habilidad única de convertir fricciones y fracasos en combustible creativo.',
    strengths: ['Adaptabilidad extrema', 'Creatividad disruptiva', 'Intuición de alto impacto'],
    blindspots: ['Falta de seguimiento a largo plazo', 'Impulsividad estratégica', 'Dispersión de foco'],
    recommendedHack: 'Anclaje Neuronal Instantáneo',
    iconName: 'Zap',
    color: 'from-violet-500 to-purple-600'
  },
  comandante: {
    id: 'comandante',
    name: 'El Comandante Implacable',
    tagline: 'Ejecutor Metódico de Disciplina y Velocidad Táctica',
    description: 'Tu lema es la acción inmediata. No te detienes ante dudas; avanzas con fuerza, determinación y tracción tangible.',
    strengths: ['Alta velocidad de ejecución', 'Liderazgo decisivo', 'Resistencia a la incomodidad'],
    blindspots: ['Impaciencia con el proceso', 'Agotamiento acelerado (burnout)', 'Exigencia excesiva'],
    recommendedHack: 'Hack de los 5 Segundos de Choque',
    iconName: 'ShieldAlert',
    color: 'from-emerald-500 to-teal-600'
  },
  sabio: {
    id: 'sabio',
    name: 'El Sabio Chalamandra',
    tagline: 'Guardián del Dominio Emocional y la Presencia Magnética',
    description: 'Mantienes un centro inamovible. Tu poder proviene de la claridad interna, la autorregulación y la maestría sobre los estados mentales.',
    strengths: ['Autorregulación fisiológica', 'Claridad de visión', 'Influencia serena'],
    blindspots: ['Exceso de desapego', 'Lentitud para confrontar', 'Refugio en la teoría'],
    recommendedHack: 'Ritual Metronómico SRAP',
    iconName: 'Eye',
    color: 'from-cyan-500 to-blue-600'
  }
};

export const QUIZ_QUESTIONS: ArchetypeQuestion[] = [
  {
    id: 1,
    question: 'Cuando un proyecto importante sufre un cambio drástico e inesperado, ¿cuál es tu reacción primaria?',
    options: [
      { label: 'Detengo la ejecución, analizo las variables y diseño una nueva estructura lógica.', archetypeId: 'arquitecto', points: 3 },
      { label: 'Abrazo el caos, aprovecho la incertidumbre para crear una solución completamente nueva.', archetypeId: 'alquimista', points: 3 },
      { label: 'Tomo el control inmediato, priorizo tareas críticas y exijo resultados inmediatos.', archetypeId: 'comandante', points: 3 },
      { label: 'Hago una pausa fisiológica, mantengo la calma interna y evalúo el impacto con serenidad.', archetypeId: 'sabio', points: 3 }
    ]
  },
  {
    id: 2,
    question: '¿Qué hábito o factor consideras tu mayor trampa actual para el alto rendimiento?',
    options: [
      { label: 'Gastar semanas refinando el plan antes de lanzar (parálisis por análisis).', archetypeId: 'arquitecto', points: 3 },
      { label: 'Iniciar 5 ideas brillantes a la vez y dejar varias a mitad de camino.', archetypeId: 'alquimista', points: 3 },
      { label: 'Trabajar a marcha forzada sin descansar hasta caer exhausto.', archetypeId: 'comandante', points: 3 },
      { label: 'Evitar confrontaciones incómodas por mantener un estado de paz relativa.', archetypeId: 'sabio', points: 3 }
    ]
  },
  {
    id: 3,
    question: '¿Cómo defines el éxito personal en tu día a día?',
    options: [
      { label: 'Que todo el sistema que diseñé funcione con precisión matemática y autonomía.', archetypeId: 'arquitecto', points: 3 },
      { label: 'Que haya descubierto o creado algo único y romper barreras convencionales.', archetypeId: 'alquimista', points: 3 },
      { label: 'Haber dominado la agenda y aplastado los objetivos del día.', archetypeId: 'comandante', points: 3 },
      { label: 'Haber actuado alineado a mis valores centrales sin perder la serenidad.', archetypeId: 'sabio', points: 3 }
    ]
  },
  {
    id: 4,
    question: '¿Cuál es tu herramienta mental favorita al momentos de decidir?',
    options: [
      { label: 'Modelos mentales, matrices de riesgo y diagramas de flujo.', archetypeId: 'arquitecto', points: 3 },
      { label: 'Pensamiento lateral, reencuadre de problemas y mapas de empatía.', archetypeId: 'alquimista', points: 3 },
      { label: 'Listas de verificación implacables, límites de tiempo y acción en frío.', archetypeId: 'comandante', points: 3 },
      { label: 'Meditación activa, intuición refinada y respiración consciente.', archetypeId: 'sabio', points: 3 }
    ]
  },
  {
    id: 5,
    question: '¿Qué tipo de energía proyectas en un equipo o grupo de trabajo?',
    options: [
      { label: 'Claridad estratégica, lógica estructurada y sobriedad.', archetypeId: 'arquitecto', points: 3 },
      { label: 'Chispa inspiradora, innovación contagiosa y disrupción.', archetypeId: 'alquimista', points: 3 },
      { label: 'Tracción imparable, estándar de exigencia y ritmo acelerado.', archetypeId: 'comandante', points: 3 },
      { label: 'Equilibrio, contención emocional y perspicacia profunda.', archetypeId: 'sabio', points: 3 }
    ]
  }
];

export const MENTAL_HACKS: MentalHack[] = [
  {
    id: 'vacío-activo',
    title: 'La Regla del Vacío Activo',
    category: 'Enfoque',
    difficulty: 'Intermedio',
    shortDesc: 'Elimina el 90% de la estimulación dopaminérgica 15 minutos antes de tomar decisiones cruciales.',
    fullDescription: 'El Vacío Activo es una técnica de desintoxicación sensorial exprés. Al congelar las entradas de información (notificaciones, música, conversaciones), le permites a la corteza prefrontal procesar los datos subconscientes.',
    steps: [
      'Apaga todas las pantallas y pon dispositivos en silencio total.',
      'Siéntate con la espalda erguida sin cruzar brazos ni piernas.',
      'Respira a ritmo regular fijando la mirada en un punto neutro durante 3 minutos.',
      'Haz la pregunta clave: "¿Qué es lo único verdaderamente vital ahora?"'
    ],
    durationMinutes: 5,
    scientificBasis: 'Reduce la sobrecarga cognitiva en la red neuronal por defecto (DMN), restaurando la atención ejecutiva.',
    iconName: 'Maximize2'
  },
  {
    id: 'choque-5s',
    title: 'Hack de los 5 Segundos de Choque',
    category: 'Productividad',
    difficulty: 'Básico',
    shortDesc: 'Disrumpe la vacilación fisiológica contando en regresiva de 5 a 1 y actuando físicamente al llegar a 1.',
    fullDescription: 'Cuando sientes la resistencia a iniciar una tarea incómoda (hacer una llamada, entrenar, escribir), tu cerebro genera dudas en 5 segundos. Este hack interrumpe el circuito de duda antes de que se instale.',
    steps: [
      'Identifica el impulso o la tarea pendiente.',
      'Cuenta en voz alta o mentalmente: 5, 4, 3, 2, 1.',
      'Muévete físicamente al número 1 sin dudar ni un milisegundo.'
    ],
    durationMinutes: 1,
    scientificBasis: 'Activa el córtex cingulado anterior antes de que la amígdala despache señales de aversión al riesgo.',
    iconName: 'Zap'
  },
  {
    id: 'anclaje-neuronal',
    title: 'Anclaje Neuronal Instantáneo',
    category: 'Mindset',
    difficulty: 'Magistral',
    shortDesc: 'Asocia un estímulo táctil específico con un estado de enfoque máximo y serenidad inquebrantable.',
    fullDescription: 'Consiste en programar un gatillo kinestésico (presionar el nudillo o juntar pulgar e índice) mientras revives fisiológicamente un momento de triunfo absoluto.',
    steps: [
      'Recuerda con máximo detalle visual y kinestésico un momento de flujo total.',
      'En el pico de esa sensación, presiona firmemente el ancla kinestésica durante 7 segundos.',
      'Suelta y respira profundamente.',
      'Repite 5 veces para sellar el circuito neurológico.'
    ],
    durationMinutes: 4,
    scientificBasis: 'Condicionamiento pavloviano de alta fidelidad aplicado a la modulación somática.',
    iconName: 'Anchor'
  },
  {
    id: 'cortina-humo',
    title: 'Desactivación de Cortina de Humo Emocional',
    category: 'Resiliencia',
    difficulty: 'Intermedio',
    shortDesc: 'Separa el evento objetivo de la carga dramática proyectada por la mente.',
    fullDescription: 'Ante una crítica o contratiempo, tendemos a sumar historias catastróficas. Este protocolo disocia los hechos fríos de las suposiciones emotivas.',
    steps: [
      'Escribe en una columna: "LO QUE PASÓ REALMENTE" (solo hechos verificables).',
      'Escribe en otra columna: "LA PELÍCULA QUE MI MENTE CREÓ" (juicios, temores).',
      'Tacha la segunda columna y construye la acción sobre la primera.'
    ],
    durationMinutes: 6,
    scientificBasis: 'Reestructuración cognitiva basada en la TCC y el estoicismo práctico.',
    iconName: 'ShieldCheck'
  }
];

export const RPG_ITEMS: RPGItem[] = [
  {
    id: 'item-grimorio-1',
    name: 'Grimorio de Hábitos Atómicos SRAP',
    type: 'Grimoire',
    rarity: 'Común',
    description: 'Manual de arquitectura de rutinas para eliminar fricción operacional.',
    effect: '+15% Velocidad de Inicio de Tareas',
    requiredLevel: 1,
    unlocked: true,
    iconName: 'BookOpen'
  },
  {
    id: 'item-lente-claridad',
    name: 'Lente de Visión Cuántica',
    type: 'Lens',
    rarity: 'Raro',
    description: 'Permite refrenar sesgos cognitivos y ver oportunidades en crisis.',
    effect: '+20% Claridad Estratégica',
    requiredLevel: 2,
    unlocked: true,
    iconName: 'Eye'
  },
  {
    id: 'item-pocion-foco',
    name: 'Elixir de Foco Profundo',
    type: 'Potion',
    rarity: 'Épico',
    description: 'Suplementación ritual de atención ininterrumpida por 90 minutos.',
    effect: '+30% Resistencia a Distracciones Digitales',
    requiredLevel: 3,
    unlocked: false,
    iconName: 'Flame'
  },
  {
    id: 'item-matriz-decision',
    name: 'Matriz de Decisión Exponencial',
    type: 'Artifact',
    rarity: 'Legendario',
    description: 'Artefacto táctico para evaluar dilemas complejos de alta escala.',
    effect: 'Desbloquea Diagnósticos Avanzados del Oráculo',
    requiredLevel: 5,
    unlocked: false,
    iconName: 'Crown'
  }
];

export const FAQS = [
  {
    question: '¿Qué es el Sistema de Reconfiguración de Alto Rendimiento (SRAP)?',
    answer: 'El SRAP es una metodología integral desarrollada por Decox que combina principios de neurociencia aplicada, modulación somática (respiración y frecuencia auditiva) y arquitectura mental para erradicar la procrastinación, la sobrecarga cognitiva y la falta de dirección.'
  },
  {
    question: '¿Cómo funciona el Oráculo Chalamandra?',
    answer: 'El Oráculo es un motor de inteligencia artificial alimentado por modelos avanzados de lenguaje (Gemini API) configurados con los principios estratégicos de Decox. Analiza tu consulta y te entrega un mantra instantáneo, diagnóstico psicológico y protocolo accionable en 24 horas.'
  },
  {
    question: '¿Necesito experiencia previa en meditación o biohacking?',
    answer: 'En absoluto. Todos los módulos y metrónomos están diseñados con instrucciones paso a paso, retroalimentación táctil/visual y ritmos accesibles desde el primer día.'
  },
  {
    question: '¿Cómo aprovecho este Portal de Sesión de Descubrimiento?',
    answer: 'Recorre los 7 módulos del Mapa Estratégico en orden para documentar tu desafío, auditar tus supuestos, activar tus 3 hacks prioritarios, diseñar tus micro-experimentos y exportar tu Plan Ejecutable a 30 Días en PDF.'
  }
];

// =========================================================================
// MOTOR METODOLÓGICO CANÓNICO: LOS 7 HACKS ORIGINALES DE CHALAMANDRA DECOX
// Fase A · Mundo Simulado (01, 02, 03, 07)
// Fase B · Decodificación del Sistema (04, 05, 06)
// =========================================================================
export const SEVEN_MAGISTRAL_HACKS: MagistralHackItem[] = [
  {
    id: 1,
    key: 'scheherazade',
    codeNumber: '01',
    archetypeName: 'Scheherazade',
    name: '01. Scheherazade — Ingeniería de la percepción',
    subtitle: 'Cambiar el relato sin falsear los hechos',
    phase: 'mundo_simulado',
    phaseLabel: 'Fase A · Mundo Simulado',
    epistemicRole: 'Posibilidad imaginada',
    expectedDeliverable: 'Narrativa estratégica del proyecto',
    coreConcept:
      'Cambiar el relato sin falsear los hechos. Identificar qué historia cuentas hoy sobre tu situación y cómo reencuadrar y comunicar el valor real de tu idea, proyecto o posición sin inventar logros ni maquillar la realidad.',
    ethicalGuardrail:
      'Regla epistémica: Reencuadrar la percepción exige fidelidad estricta a los hechos observables; jamás falsear datos, exagerar capacidades ni engañar a terceros.',
    guidingQuestions: [
      '¿Qué historia estás contando hoy sobre este desafío que te resta claridad o poder de negociación?',
      'Manteniendo exactamente los mismos hechos verificables, ¿qué relato comunica el valor real de lo que propones?',
      '¿Qué percibe hoy la otra parte como costo o fricción que en realidad demuestra rigor o foco?'
    ],
    personaQuestions: [
      '¿Qué relato interno repites hoy sobre tu proyecto o bloqueo que hace que parezca más confuso o pequeño de lo que realmente es?',
      'Con los hechos reales que ya tienes hoy, ¿cómo explicarías el valor concreto de tu idea en dos frases claras sin exagerar nada?',
      '¿Qué rasgo de tu situación actual (escala pequeña, etapa inicial, restricción) puede presentarse honestamente como una ventaja de agilidad o cercanía?'
    ],
    organizacionQuestions: [
      '¿Cómo interpreta hoy cada área o actor clave este problema y por qué el relato actual genera resistencia o parálisis?',
      'Sin alterar ni un solo hecho operativo, ¿cómo reformularías esta iniciativa para que conecte con lo que realmente importa a decisores y equipos?',
      '¿Qué narrativa estratégica compartida alinea al sistema de trabajo sin ocultar las restricciones reales?'
    ],
    tacticalExercise:
      'Contrasta en dos bloques: (1) Relato actual que diluye valor o instala desgaste; (2) Nueva narrativa estratégica anclada 100% en hechos reales que clarifica el valor ante ti y ante terceros.',
    templatePrompt:
      'Narrativa estratégica: Hoy describo el caso como [relato actual], pero manteniendo los hechos reales el valor verdadero es [nuevo encuadre estratégico].',
    personaTemplate:
      'Narrativa estratégica personal/proyecto: Dejo de presentar mi situación como [relato defensivo o disperso] y comunico con hechos reales que [propuesta de valor clara y honesta].',
    organizacionTemplate:
      'Narrativa estratégica organizacional: Pasamos de encuadrar el frente como [fricción departamental o carga] a comunicarlo con hechos verificables como [prioridad compartida con beneficio claro para los actores].',
    applicationExample:
      'De: "Somos un estudio pequeño intentando competir contra agencias grandes" → A: "Operamos con intervención directa de socios senior sin capas intermedias, reduciendo el ciclo de entrega de 4 semanas a 5 días."',
    iconName: 'PenTool',
    color: 'from-amber-500 to-yellow-600'
  },
  {
    id: 2,
    key: 'hermes',
    codeNumber: '02',
    archetypeName: 'Hermes',
    name: '02. Hermes — Reconocimiento de patrones',
    subtitle: 'Estructuras repetidas y traducción entre dominios',
    phase: 'mundo_simulado',
    phaseLabel: 'Fase A · Mundo Simulado',
    epistemicRole: 'Hipótesis',
    expectedDeliverable: 'Patrones transferibles y oportunidades',
    coreConcept:
      'Detectar estructuras que se repiten dentro de tu propio historial y adaptar principios o soluciones probadas en otros sectores o disciplinas, traduciéndolos a tu contexto sin copiar ciegamente.',
    guidingQuestions: [
      '¿Qué estructura o cuello de botella se repite aquí igual que en momentos anteriores?',
      '¿Qué otro sector, oficio o industria ya resolvió un problema estructuralmente idéntico al tuyo?',
      '¿Qué principio de esa solución externa puedes adaptar a tu realidad sin copiar su forma superficial?'
    ],
    personaQuestions: [
      '¿En qué otros proyectos o decisiones personales apareció antes exactamente esta misma secuencia de bloqueo?',
      '¿Qué modelo de otro campo (ej. entrenamiento deportivo, edición editorial, diseño industrial, aviación) resuelve este mismo tipo de fricción?',
      '¿Qué mecanismo concreto puedes traducir hoy a tu rutina o proyecto respetando tus recursos actuales?'
    ],
    organizacionQuestions: [
      '¿Qué patrón sistémico se repite entre equipos cada vez que sube la carga operativa o cambia una prioridad?',
      '¿Cómo resuelven este mismo cuello de botella sectores de alta confiabilidad (logística, triaje clínico, software crítico, hospitalidad)?',
      '¿Qué regla estructural es transferible a tu organización sin importar modas ajenas que no encajan con tu cultura o escala?'
    ],
    tacticalExercise:
      'Identifica el bucle interno que se repite (Gatillo → Reacción → Cuello de botella) y extrae un mecanismo probado en otro dominio para adaptarlo como hipótesis de diseño.',
    templatePrompt:
      'Patrón transferible: Detecto que se repite [estructura]; adapto el principio de [otro sector/referencia] aplicando [mecanismo concreto adaptado].',
    personaTemplate:
      'Patrón transferible: Se repite el bucle [secuencia personal detectada]. Tomo prestado de [sector externo] el principio de [mecanismo] adaptado a mi escala actual.',
    organizacionTemplate:
      'Patrón transferible: El sistema repite [patrón entre áreas/actores]. Adaptamos del sector [dominio externo] el mecanismo de [protocolo/estructura] ajustado a nuestra operación.',
    applicationExample:
      'Adaptar el sistema de "triaje por gravedad" de urgencias médicas para clasificar solicitudes entrantes de clientes en 3 niveles claros en lugar de atender por orden de llegada.',
    iconName: 'Layers',
    color: 'from-purple-500 to-indigo-600'
  },
  {
    id: 3,
    key: 'carroll',
    codeNumber: '03',
    archetypeName: 'Carroll',
    name: '03. Carroll — Paradoja y pregunta absurda',
    subtitle: 'Ruptura de premisas y síntesis de opuestos',
    phase: 'mundo_simulado',
    phaseLabel: 'Fase A · Mundo Simulado',
    epistemicRole: 'Posibilidad imaginada',
    expectedDeliverable: 'Alternativas no obvias',
    coreConcept:
      'Cuestionar las premisas invisibles del problema, sostener dos ideas aparentemente incompatibles al mismo tiempo y formular preguntas deliberadamente absurdas o inversas para descubrir soluciones que el planteamiento original excluía.',
    guidingQuestions: [
      '¿Qué dos condiciones parecen hoy mutuamente excluyentes en tu caso y cómo podrían cumplirse ambas a la vez?',
      'Pregunta inversa: ¿qué tendrías que hacer si quisieras garantizar que este problema empeore el doble en 7 días?',
      '¿Qué premisa que todos dan por obligatoria dejaría de existir si inviertes el orden habitual del proceso?'
    ],
    personaQuestions: [
      '¿Qué falso dilema te tiene atrapado hoy (ej. ingresos inmediatos vs. proyecto propio, rigor vs. velocidad) y qué tercera vía sostiene ambos extremos?',
      'Si estuviera prohibido resolver tu problema de la forma convencional en que lo intentas, ¿qué alternativa no obvia aparecería?',
      '¿Qué pasaría si el paso que hoy dejas para el final (validar cobro, publicar, pedir decisión) fuera literalmente el paso número uno?'
    ],
    organizacionQuestions: [
      '¿Qué tensión organizacional tratas como suma cero (ej. autonomía de equipos vs. control de calidad, estandarización vs. trato a medida)?',
      '¿Qué ritual, reunión o entregable seguiría produciéndose por inercia aunque mañana nadie lo leyera, y qué revela esa pregunta absurda?',
      '¿Cómo rediseñar el proceso para lograr simultáneamente menor intervención directiva y mayor estándar técnico?'
    ],
    tacticalExercise:
      'Formula la paradoja central ("¿Cómo lograr A y B simultáneamente sin sacrificar ninguno?") e invierte una premisa fija del proceso para extraer al menos una alternativa no obvia.',
    templatePrompt:
      'Alternativa no obvia: En lugar de elegir entre [Polo A] y [Polo B], cuestiono la premisa de [supuesto fijo] y diseño [solución paradójica].',
    personaTemplate:
      'Alternativa no obvia: Rompo el falso dilema entre [opción A] y [opción B] invirtiendo la premisa [supuesto] mediante [alternativa no obvia].',
    organizacionTemplate:
      'Alternativa no obvia: Integramos [exigencia A] con [exigencia B] cuestionando el supuesto organizacional de [regla asumida] y habilitando [diseño no obvio].',
    applicationExample:
      'Cobrar un diagnóstico breve y pagado antes de construir una propuesta comercial compleja: filtra curiosos, financia el análisis real y eleva la confianza del cliente.',
    iconName: 'Compass',
    color: 'from-cyan-500 to-blue-600'
  },
  {
    id: 4,
    key: 'hacker',
    codeNumber: '04',
    archetypeName: 'Hacker',
    name: '04. Hacker — Decodificación de reglas e incentivos',
    subtitle: 'Reglas declaradas vs. incentivos reales y ventajas legítimas',
    phase: 'decodificacion_sistema',
    phaseLabel: 'Fase B · Decodificación del sistema',
    epistemicRole: 'Hipótesis',
    expectedDeliverable: 'Puntos de influencia y opciones viables',
    coreConcept:
      'Distinguir las reglas declaradas de los incentivos reales que mueven a las personas o instituciones, separar restricciones duras de convenciones blandas y detectar oportunidades 100% legales y éticas dentro del sistema.',
    ethicalGuardrail:
      'Regla ética innegociable: "Hackear el sistema" significa encontrar ventajas legítimas, transparentes y éticas dentro de las reglas vigentes; nunca engañar personas, manipular información ni usar prácticas ilegales.',
    guidingQuestions: [
      '¿Cuál es la diferencia entre lo que el sistema dice que premia (regla declarada) y lo que realmente recompensa o castiga en la práctica (incentivo real)?',
      '¿Qué restricciones son leyes o límites físicos inamovibles y cuáles son solo usos y costumbres negociables?',
      '¿Dónde existe un punto de apalancamiento legítimo y ético donde un cambio pequeño de reglas alinee los incentivos de todos?'
    ],
    personaQuestions: [
      'En tu entorno actual (clientes, mercado, agenda personal), ¿qué comportamiento improductivo está siendo premiado con alivio inmediato?',
      '¿Qué regla del mercado o de tu sector asumes como obligatoria cuando en realidad es solo una costumbre que puedes hacer diferente de forma legítima?',
      '¿Qué cambio transparente en tus condiciones, tiempos o formato de entrega te da una ventaja legítima sin desgastarte?'
    ],
    organizacionQuestions: [
      '¿Qué dicen valorar formalmente los indicadores de tu organización frente a lo que realmente protege o premia a cada actor cuando hay presión?',
      '¿Por qué para un colaborador o área hoy resulta más seguro escalar el problema hacia arriba que resolverlo autónomamente?',
      '¿Qué ajuste legítimo de reglas de decisión, umbrales o incentivos haría que la conducta deseada sea también la más conveniente para cada actor?'
    ],
    tacticalExercise:
      'Mapea: Regla declarada → Incentivo real oculto → Punto de influencia legítimo. Define una opción viable que reordene incentivos con total transparencia y legalidad.',
    templatePrompt:
      'Puntos de influencia legítimos: Aunque la regla declarada es [regla formal], el incentivo real hoy es [incentivo real]. Intervendremos legítimamente en [punto de influencia] mediante [opción viable].',
    personaTemplate:
      'Punto de influencia viable: Hoy el entorno premia [inercia actual]; aprovecharé legítimamente [margen dentro de las reglas] para establecer [nueva condición o palanca].',
    organizacionTemplate:
      'Punto de influencia organizacional: Aunque formalmente pedimos [regla declarada], el sistema incentiva [conducta actual]. Ajustaremos legítimamente [regla/incentivo] para habilitar [opción viable].',
    applicationExample:
      'Establecer una matriz explícita de autonomía (verde/amarillo/rojo) donde el equipo gana respaldo formal al decidir dentro del rango verde, eliminando el incentivo defensivo de consultar todo.',
    iconName: 'Cpu',
    color: 'from-emerald-500 to-teal-600'
  },
  {
    id: 5,
    key: 'trickster',
    codeNumber: '05',
    archetypeName: 'Trickster',
    name: '05. Trickster — Inyección estratégica de caos',
    subtitle: 'Variaciones pequeñas y reversibles para revelar el sistema',
    phase: 'decodificacion_sistema',
    phaseLabel: 'Fase B · Decodificación del sistema',
    epistemicRole: 'Hipótesis',
    expectedDeliverable: 'Experimentos controlados',
    coreConcept:
      'Introducir variaciones pequeñas, acotadas y totalmente reversibles en la rutina o en el sistema de trabajo para observar qué ocurre de verdad: dónde aparecen rigideces reales, qué dependencias eran ilusorias y qué posibilidades ocultas emergen.',
    ethicalGuardrail:
      'Criterio de seguridad operativa: Toda perturbación estratégica debe tener costo acotado, ser reversible y no poner en riesgo compromisos críticos, seguridad ni confianza de clientes.',
    guidingQuestions: [
      '¿Qué pequeña variación reversible puedes introducir durante 48 horas o 7 días para ver cómo reacciona realmente el sistema?',
      'Si suspendes temporalmente un paso, reunión o aprobación habitual, ¿qué se rompe de verdad y qué sigue funcionando mejor sin él?',
      '¿Cuál es el límite máximo de riesgo permitido para que la prueba sea segura aunque la hipótesis falle?'
    ],
    personaQuestions: [
      '¿Qué micro-variación reversible puedes probar esta misma semana (cambiar formato, lanzar una versión mínima, alterar un bloque horario) sin arriesgar tu estabilidad?',
      'Si durante 3 días dejas de hacer la tarea que absorbe tu energía pero no mueve tu indicador principal, ¿qué ocurre realmente?',
      '¿Cómo diseñas la prueba para que incluso un "no" o fallo rápido te entregue información valiosa en menos de 72 horas?'
    ],
    organizacionQuestions: [
      '¿Qué prueba piloto en un solo equipo, cliente o flujo durante 5 días revelaría las verdaderas dependencias del sistema sin afectar toda la operación?',
      'Si congelas durante una semana una instancia burocrática o reporte intermedio, ¿qué fricción real sale a la luz?',
      '¿Qué condición de reversibilidad inmediata deja tranquilo al equipo para ejecutar el experimento sin miedo?'
    ],
    tacticalExercise:
      'Diseña una perturbación controlada y reversible (48h–7d): define qué variable alteras, cuál es la red de seguridad y qué reacción del sistema observarás.',
    templatePrompt:
      'Experimento controlado (reversible): Introduciré durante [ventana corta] la variación [cambio pequeño] con límite de seguridad [reversibilidad] para comprobar qué ocurre con [dependencia o respuesta].',
    personaTemplate:
      'Experimento controlado personal: Durante [48h / 7 días] probaré la variación reversible [cambio acotado] para observar cómo responde [resultado real] sin comprometer [límite seguro].',
    organizacionTemplate:
      'Experimento controlado en el sistema: En [alcance acotado/piloto] aplicaremos por [ventana] la variación reversible [ajuste] con cláusula de retorno si [umbral de seguridad].',
    applicationExample:
      'Suspender durante 5 días las aprobaciones previas en propuestas menores a cierto monto con revisión post-envío: revela de inmediato si el cuello de botella era técnico o solo costumbre de control.',
    iconName: 'Flame',
    color: 'from-rose-500 to-red-600'
  },
  {
    id: 6,
    key: 'datos',
    codeNumber: '06',
    archetypeName: 'Inteligencia de Datos',
    name: '06. Inteligencia basada en datos y correlaciones',
    subtitle: 'Separar suposición de observación sin confundir correlación con causa',
    phase: 'decodificacion_sistema',
    phaseLabel: 'Fase B · Decodificación del sistema',
    epistemicRole: 'Hipótesis',
    expectedDeliverable: 'Hipótesis medibles y criterios de decisión',
    coreConcept:
      'Separar rigurosamente lo que se supone de lo que se observa; identificar señales cuantificables útiles, detectar correlaciones como pistas de investigación (nunca como causalidad demostrada por sí solas) y fijar criterios objetivos para decidir qué funciona.',
    ethicalGuardrail:
      'Rigor epistemológico: Nunca presentar una correlación o coincidencia temporal como causalidad demostrada. Toda señal observada debe formularse como hipótesis medible sujeta a verificación.',
    guidingQuestions: [
      '¿Qué parte de tu diagnóstico actual es un hecho medido y qué parte es una suposición vestida de certeza?',
      '¿Qué correlación o señal repetida estás observando y cómo puedes comprobar si realmente impulsa el resultado o es solo coincidencia?',
      '¿Qué umbral numérico concreto definirá en 7 o 30 días mantener, ajustar o descartar la decisión?'
    ],
    personaQuestions: [
      'Sin usar adjetivos subjetivos ("mucho", "lento", "difícil"), ¿qué número exacto describe hoy tu punto de partida?',
      '¿Qué relación crees que existe entre tu esfuerzo actual y tus resultados, y qué dato sencillo necesitas registrar 7 días para verificar si es real?',
      '¿Cuál será tu criterio objetivo de decisión (sí/no) tras ejecutar la primera prueba?'
    ],
    organizacionQuestions: [
      '¿Qué datos reales tienes hoy sobre tiempos de ciclo, retrabajo o conversión frente a las opiniones dominantes en las reuniones?',
      '¿Qué dos variables parecen moverse juntas en tu operación y qué prueba controlada necesitas para no confundir correlación con causalidad?',
      '¿Qué tablero mínimo de 1 a 3 indicadores permitirá a los actores evaluar la decisión sin debates subjetivos?'
    ],
    tacticalExercise:
      'Separa Observación actual (Hecho) vs. Correlación sospechada (Hipótesis) y redacta la regla de decisión: "Si el indicador X alcanza Y en Z días, escalamos; de lo contrario, descartamos o iteramos".',
    templatePrompt:
      'Hipótesis medible y criterio: Hoy observo [dato base]; planteo como hipótesis (no causalidad asumida) que [variable A] influye en [indicador B]. Criterio de decisión en [plazo]: [umbral verificable].',
    personaTemplate:
      'Hipótesis medible personal: Dato observado hoy: [línea base]. Hipótesis a verificar: si ajusto [variable], el indicador [métrica] pasará a [umbral] en [plazo].',
    organizacionTemplate:
      'Hipótesis medible del sistema: Hecho medido hoy: [dato base]. Verificaremos si [cambio operativo] mueve realmente [KPI] sin asumir causalidad previa. Umbral de decisión: [criterio].',
    applicationExample:
      'Observar que los proyectos cerrados en menos de 7 días coincidieron con una sesión diagnóstica previa; tratarlo como hipótesis medible y probarlo en los próximos 5 prospectos antes de rediseñar toda el área comercial.',
    iconName: 'BarChart3',
    color: 'from-amber-400 to-orange-500'
  },
  {
    id: 7,
    key: 'nino8',
    codeNumber: '07',
    archetypeName: 'El niño de 8 años',
    name: '07. El niño de 8 años — Imaginación pre-lógica',
    subtitle: 'Explorar sin límites asumidos y luego aterrizar en la realidad',
    phase: 'mundo_simulado',
    phaseLabel: 'Fase A · Mundo Simulado',
    epistemicRole: 'Posibilidad imaginada',
    expectedDeliverable: 'Una posibilidad radical que pueda ponerse a prueba',
    coreConcept:
      'Suspender temporalmente la autocensura experta para preguntar qué se intentaría si no existieran las limitaciones asumidas ("así se hace siempre"), imaginar futuros radicalmente simples o nuevos en el Mundo Simulado y después bajarlos a una versión contrastable en el Mundo Real.',
    guidingQuestions: [
      'Si alguien inteligente pero totalmente ajeno a las "reglas de tu industria" mirara esto con curiosidad pura, ¿qué preguntaría de inmediato: "¿por qué hacen todo ese rodeo?"?',
      'Si pudieras diseñar la solución desde una hoja en blanco sin heredar inercias pasadas, ¿cómo se vería la versión más directa e imaginativa?',
      '¿Cómo traduces esa posibilidad radical en un prototipo pequeño y legalmente viable que puedas poner a prueba en el Mundo Real esta semana?'
    ],
    personaQuestions: [
      'Si no tuvieras que justificar tus decisiones pasadas ni seguir el camino estándar de tu profesión, ¿qué intentarías primero por pura lógica directa?',
      '¿Qué futuro nuevo para tu idea o carrera descartaste demasiado rápido diciendo "eso no es realista" antes de pensar una versión en miniatura?',
      '¿Cuál es la versión mínima y contrastable de esa posibilidad radical que sí puedes probar en 7 días con tus recursos actuales?'
    ],
    organizacionQuestions: [
      'Si un recién llegado sin miedo político preguntara "¿por qué existen estos 5 pasos antes de entregar valor al cliente?", ¿qué parte del proceso quedaría desnuda como pura inercia?',
      'Si diseñaras hoy tu sistema de trabajo desde cero sabiendo lo que ya sabes, ¿qué estructura radicalmente más simple construirías?',
      '¿Qué versión acotada (10% del alcance) de esa posibilidad radical puede probarse de forma segura en el Mundo Real antes de la sesión en vivo?'
    ],
    tacticalExercise:
      'Paso 1 (Mundo Simulado): Escribe sin filtro la posibilidad más directa y libre de inercias. Paso 2 (Puente al Mundo Real): Extrae un núcleo pequeño y verificable que puedas probar sin riesgo desproporcionado.',
    templatePrompt:
      'Posibilidad radical contrastable: Sin las limitaciones heredadas, intentaríamos [idea radical en Mundo Simulado]. Su versión mínima contrastable hoy en el Mundo Real es [prototipo verificable].',
    personaTemplate:
      'Posibilidad radical contrastable: Si partiera de cero sin inercias, haría [posibilidad imaginada]. Para ponerla a prueba en el Mundo Real esta semana ejecutaré [versión mínima verificable].',
    organizacionTemplate:
      'Posibilidad radical contrastable: Sin la burocracia heredada, el sistema funcionaría como [futuro imaginado]. Lo contrastaremos con la realidad mediante un piloto acotado de [prueba real].',
    applicationExample:
      'Imaginación pre-lógica: "¿Y si el cliente viera y probara el diagnóstico en vivo en vez de leer un PDF de 30 páginas después de tres reuniones?". Prueba real: sesión interactiva guiada con el próximo cliente.',
    iconName: 'Sparkles',
    color: 'from-yellow-400 to-amber-500'
  }
];

// ============================================================
// ESTADO LIMPIO INICIAL Y CASOS DEMOSTRATIVOS POR RECORRIDO
// ============================================================
export function generateDiscoverySessionId(prefix = 'DX'): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rnd = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${prefix}-${ts}-${rnd}`;
}

export function createBlankActionPlan(): DiscoveryDeliverableState['actionPlan'] {
  return [
    {
      weekNumber: 1,
      title: 'Semana 1: Clarificación de Hechos y Narrativa Base',
      focusObjective:
        'Separar hechos observados de supuestos, activar el reencuadre del caso y proteger el foco inicial.',
      tasks: []
    },
    {
      weekNumber: 2,
      title: 'Semana 2: Experimentos Controlados (Decodificación)',
      focusObjective:
        'Ejecutar variaciones pequeñas y reversibles (Trickster + Datos) para contrastar hipótesis en terreno.',
      tasks: []
    },
    {
      weekNumber: 3,
      title: 'Semana 3: Reconfiguración de Reglas e Incentivos',
      focusObjective:
        'Consolidar puntos de influencia legítimos y acuerdos operativos derivados de las pruebas.',
      tasks: []
    },
    {
      weekNumber: 4,
      title: 'Semana 4: Evaluación en Mundo Real y Siguiente Paso',
      focusObjective:
        'Comparar resultados medidos frente al criterio de decisión y consolidar la ruta tras la sesión en vivo.',
      tasks: []
    }
  ];
}

export function createBlankDiscoveryState(
  customSessionId?: string,
  track: DiscoveryTrackType = 'persona'
): DiscoveryDeliverableState {
  const isOrg = track === 'organizacion';
  return {
    sessionId: customSessionId || generateDiscoverySessionId('DX'),
    isDemoCase: false,
    sessionStarted: false,
    sessionCompleted: false,
    planNeedsSync: false,
    currentModule: 1,
    challenge: {
      track,
      clientName: '',
      companyOrRole: '',
      explorationFocus: 'Problema o bloqueo',
      title: '',
      category: isOrg ? 'Liderazgo & Dirección' : 'Escala de Negocio',
      currentSituation: '',
      criticalFriction: '',
      expectedOutcome: '',
      primaryMetric: '',
      timeframe: 'Próximos 30 días',
      keyActorsAndIncentives: '',
      conditionalAnswers: {}
    },
    strategicProfile: {
      evidenceLevel: 'Señales parciales',
      dependencyScope: isOrg ? 'Equipo o socios internos' : 'Control propio directo',
      urgencyLevel: 'Táctica (7–14 días)',
      dominantThoughtPattern: '',
      underlyingAssumptions: [],
      realConstraints: [],
      artificialConstraints: [],
      uncertainties: [],
      hiddenIncentives: '',
      strategicHypothesis: '',
      conditionalProfileAnswers: {}
    },
    selectedHackIds: [],
    hackNotes: {},
    experiments: [],
    strategicMap: {
      summaryChallenge: '',
      keyInsight: '',
      prioritizedHackKeys: [],
      tacticalMantra: '',
      defensiveMoat: '',
      nonNegotiables: [],
      facts: [],
      interpretations: [],
      hypotheses: [],
      imaginedPossibilities: [],
      uncertainties: [],
      criticalPoints: [],
      nextSteps: [],
      hackDeliverables: [],
      realWorldOptions: [],
      synthesisSource: 'local',
      isSynthesized: false,
      generatedAt: ''
    },
    actionPlan: createBlankActionPlan(),
    lastSavedTimestamp: new Date().toISOString()
  };
}

export const BLANK_DISCOVERY_STATE: DiscoveryDeliverableState = createBlankDiscoveryState();

export function createDemoDiscoveryState(
  track: DiscoveryTrackType = 'organizacion'
): DiscoveryDeliverableState {
  if (track === 'persona') {
    return {
      sessionId: generateDiscoverySessionId('DEMO'),
      isDemoCase: true,
      sessionStarted: true,
      sessionCompleted: false,
      planNeedsSync: true,
      currentModule: 1,
      challenge: {
        track: 'persona',
        clientName: 'Caso de Referencia · Recorrido Personas (Demostración)',
        companyOrRole: 'Especialista Senior en Transición a Oferta Propia',
        explorationFocus: 'Idea por validar',
        title: 'Validar oferta propia de diagnóstico especializado sin abandonar ingresos actuales',
        category: 'Disrupción e Innovación',
        currentSituation:
          'Trabajo 40h semanales en consultoría tradicional y dedico 8h semanales dispersas a diseñar un servicio propio de auditoría técnica. En 6 semanas he reescrito 4 veces la página de presentación, pero he tenido 0 conversaciones de venta reales.',
        criticalFriction:
          'Postergo salir a ofrecer el diagnóstico porque asumo que primero necesito una plataforma completa, casos públicos y meses libres.',
        expectedOutcome:
          'Cerrar y entregar los primeros 3 diagnósticos pagados en formato ligero manteniendo mi estabilidad actual.',
        primaryMetric:
          '3 diagnósticos pagados entregados en 30 días dedicando máximo 6 horas semanales enfocadas',
        timeframe: 'Próximos 30 días',
        keyActorsAndIncentives:
          'Contactos directos de mi red profesional que hoy pierden semanas diagnosticando fallos internos, pero desconfían de proyectos largos y costosos.',
        conditionalAnswers: {
          idea_observable_evidence:
            '3 exclientes me pidieron orientación puntual en los últimos dos meses de manera informal y gratuita.',
          idea_critical_risk:
            'Hipótesis crítica: comprobar si están dispuestos a pagar por una sesión diagnóstica acotada sin implementación completa incluida.'
        }
      },
      strategicProfile: {
        evidenceLevel: 'Señales parciales',
        dependencyScope: 'Clientes, mercado o terceros',
        urgencyLevel: 'Táctica (7–14 días)',
        dominantThoughtPattern:
          'Hasta que el producto no se vea como una firma consolidada, cobrar por él restará credibilidad a mi perfil.',
        underlyingAssumptions: [
          'Mis contactos esperan un paquete largo de varios meses y no una intervención diagnóstica breve.',
          'Necesito construir automatizaciones antes de validar si existe disposición real de pago.'
        ],
        realConstraints: [
          'Máximo 6 a 8 horas semanales disponibles fuera del compromiso laboral principal.',
          'Sin presupuesto para pauta publicitaria ni equipo de soporte externo.'
        ],
        artificialConstraints: [
          'Seguir rediseñando documentos internos antes de conversar con los primeros 5 prospectos reales.',
          'Regalar diagnósticos informales por llamada sin estructura ni contraprestación.'
        ],
        uncertainties: [
          '¿Qué formato exacto de entregable de 90 minutos resuelve suficiente valor para justificar pago inmediato?',
          '¿Cuál de los dos perfiles de cliente en mi red decide más rápido sin burocracia de compras?'
        ],
        hiddenIncentives:
          'Refugiarse en el perfeccionamiento técnico evita exponerse a un posible rechazo comercial directo.',
        strategicHypothesis:
          'Si presento el servicio como una sesión diagnóstica acotada con entregable claro en 48h a 5 contactos con dolor activo, al menos 2 aceptarán una prueba pagada sin requerir plataforma previa.',
        conditionalProfileAnswers: {
          evidence_gap:
            'Tengo consultas informales frecuentes, pero 0 propuestas económicas presentadas hasta hoy.',
          stakeholder_alignment:
            'Definir con total transparencia qué incluye y qué no incluye el diagnóstico inicial para proteger mi agenda.'
        }
      },
      selectedHackIds: [1, 3, 5, 6, 7],
      hackNotes: {
        1: 'Scheherazade: Presentar honestamente la intervención como "diagnóstico quirúrgico de 90 minutos sin compromiso de iguala mensual", convirtiendo mi agenda acotada en garantía de foco y precisión.',
        3: 'Carroll: Invertir el orden asumido — primero acordar y cobrar el diagnóstico con alcance explícito, y solo estandarizar herramientas después de entregar los primeros 3 casos reales.',
        5: 'Trickster: Durante 7 días, sustituir cualquier llamada informal de "consejo rápido" por una invitación clara a una sesión estructurada de diagnóstico con cupo de 3 espacios piloto.',
        6: 'Inteligencia de datos: Registrar de 10 contactos directos cuántos responden, cuántos agendan y cuántos aceptan condiciones reales (sin confundir amabilidad en redes con intención real de compra).',
        7: 'El niño de 8 años: En vez de construir un portal complejo, trabajar en vivo sobre un lienzo compartido de una sola página y entregar la hoja de ruta al terminar la llamada.'
      },
      experiments: [
        {
          id: 'exp-demo-p1',
          hackId: 5,
          hackName: 'Trickster — Inyección estratégica de caos',
          hypothesis:
            'Si escribo directamente a 6 contactos que ya me consultaron antes ofreciéndoles un piloto diagnóstico pagado de alcance fijo, obtendré evidencia real de disposición de pago en 48 horas.',
          concreteAction:
            'Enviar 6 mensajes personalizados con alcance honesto de 1 página y agenda acotada a dos bloques esta semana.',
          executionWindow: '48 Horas',
          successIndicator:
            'Al menos 2 respuestas interesadas en condiciones concretas y 1 sesión confirmada.',
          reversibilityNote:
            '100% reversible: si ningún contacto acepta el encuadre, ajusto el alcance con su feedback directo sin haber invertido en software ni anuncios.',
          status: 'Propuesto'
        },
        {
          id: 'exp-demo-p2',
          hackId: 6,
          hackName: 'Inteligencia basada en datos y correlaciones',
          hypothesis:
            'Si comparo la respuesta de fundadores directos frente a gerentes intermedios, identificaré dónde el ciclo de decisión es menor a 7 días.',
          concreteAction:
            'Dividir los 6 contactos en 3 fundadores y 3 gerentes de área y medir tiempo real de respuesta y objeciones.',
          executionWindow: '7 Días',
          successIndicator:
            'Tabla comparativa con tasa de respuesta real y motivo exacto de aceptación o freno.',
          reversibilityNote:
            'Sin costo financiero; evita asumir causalidad antes de contrastar ambos perfiles.',
          status: 'Propuesto'
        }
      ],
      strategicMap: {
        summaryChallenge: '',
        keyInsight: '',
        prioritizedHackKeys: ['scheherazade', 'carroll', 'trickster', 'datos', 'nino8'],
        tacticalMantra: '',
        defensiveMoat: '',
        nonNegotiables: [],
        facts: [],
        interpretations: [],
        hypotheses: [],
        imaginedPossibilities: [],
        uncertainties: [],
        criticalPoints: [],
        nextSteps: [],
        hackDeliverables: [],
        realWorldOptions: [],
        synthesisSource: 'local',
        isSynthesized: false,
        generatedAt: ''
      },
      actionPlan: createBlankActionPlan(),
      lastSavedTimestamp: new Date().toISOString()
    };
  }

  return {
    sessionId: generateDiscoverySessionId('DEMO'),
    isDemoCase: true,
    sessionStarted: true,
    sessionCompleted: false,
    planNeedsSync: true,
    currentModule: 1,
    challenge: {
      track: 'organizacion',
      clientName: 'Caso de Referencia · Recorrido Organizaciones (Demostración)',
      companyOrRole: 'Dirección General · Firma de Servicios B2B (18 personas)',
      explorationFocus: 'Problema o bloqueo',
      title: 'Desbloquear el sistema de aprobaciones comerciales y técnicas sin perder margen ni calidad',
      category: 'Liderazgo & Dirección',
      currentSituation:
        'Operación rentable con facturación estable, pero el 85% de las cotizaciones y ajustes de alcance pasan por Dirección General (11–12 horas diarias operativas y demora de 48–72h al cliente).',
      criticalFriction:
        'Cada líder de célula escala decisiones menores hacia arriba por temor a equivocarse, saturando dirección y frenando cierres comerciales.',
      expectedOutcome:
        'Reconfigurar reglas e incentivos del sistema de trabajo para que el 70% de solicitudes estándar se resuelvan con autonomía auditada y liberar 12h semanales directivas.',
      primaryMetric:
        'Tiempo de respuesta comercial menor a 6 horas + 12 horas semanales liberadas en calendario directivo',
      timeframe: 'Próximos 30 días',
      keyActorsAndIncentives:
        'Dirección General (busca control de margen pero centraliza por hábito), Líderes Técnicos (prefieren pedir permiso porque hoy no existe umbral escrito que respalde su decisión) y Clientes B2B (valoran velocidad y certeza de entrega).',
      conditionalAnswers: {
        problem_recurrence:
          'Se repite desde hace 8 meses cada vez que entran más de 3 proyectos simultáneos; se intentó pedir "más proactividad" verbalmente sin cambiar las reglas del sistema y el cuello de botella regresó en 2 semanas.',
        problem_inaction_cost:
          'Pérdida reciente de 2 contratos renovables por demora en cotización y agotamiento del equipo senior.'
      }
    },
    strategicProfile: {
      evidenceLevel: 'Señales parciales',
      dependencyScope: 'Equipo o socios internos',
      urgencyLevel: 'Táctica (7–14 días)',
      dominantThoughtPattern:
        'Si no reviso personalmente cada propuesta antes de enviarla, el equipo cederá margen o prometerá alcances imposibles.',
      underlyingAssumptions: [
        'Los líderes de proyecto no pueden evaluar riesgos comerciales aunque cuenten con rangos y criterios explícitos.',
        'Los clientes actuales exigen la presencia de Dirección General en todas las llamadas operativas.'
      ],
      realConstraints: [
        'Plantilla actual de 6 líderes operativos sin presupuesto este trimestre para contratar una gerencia intermedia.',
        'Margen bruto mínimo requerido del 45% por proyecto para sostener la estructura.'
      ],
      artificialConstraints: [
        'Exigir visto bueno previo en cotizaciones estándar repetitivas de monto menor.',
        'Responder consultas internas por chat en menos de 10 minutos interrumpiendo bloques estratégicos.'
      ],
      uncertainties: [
        '¿Qué porcentaje real de las revisiones de dirección en el último mes cambió números de fondo frente a meros cambios de estilo?',
        '¿Cómo responderán los líderes técnicos cuando tengan una regla explícita de autonomía con revisión semanal post-envío?'
      ],
      hiddenIncentives:
        'Para el equipo, escalar la decisión transfiere el riesgo cero hacia arriba; para dirección, corregir todo refuerza la sensación subjetiva de ser indispensable.',
      strategicHypothesis:
        'Si reemplazamos la aprobación caso por caso por una regla legítima de tres umbrales (verde: autonomía directa, amarillo: aviso asíncrono, rojo: comité), al menos el 70% del flujo saldrá en menos de 6 horas manteniendo el margen.',
      conditionalProfileAnswers: {
        evidence_gap:
          'No hemos clasificado las últimas 20 aprobaciones para medir cuántas requerían realmente criterio directivo.',
        stakeholder_alignment:
          'Falta un acuerdo escrito donde decidir dentro del rango verde garantice respaldo explícito sin reproches retrospectivos.'
      }
    },
    selectedHackIds: [1, 2, 4, 5, 6],
    hackNotes: {
      1: 'Scheherazade: Cambiar el relato interno de "delegar es soltar el control" a "diseñar criterios claros protege mejor la calidad que revisar con cansancio a última hora".',
      2: 'Hermes: Adaptar el protocolo de triaje en tres niveles (verde/amarillo/rojo) usado en operaciones críticas para clasificar cotizaciones en 3 minutos.',
      4: 'Hacker: Decodificar el incentivo defensivo del equipo — garantizar por escrito que toda decisión tomada dentro de los parámetros del nivel verde cuenta con respaldo total de dirección.',
      5: 'Trickster: Ejecutar una semana reversible sin visto bueno previo para propuestas estándar menores al umbral definido, auditando solo al cierre del viernes.',
      6: 'Inteligencia de datos: Auditar las últimas 15 propuestas y las próximas 10 midiendo tiempo de emisión, margen real y número de ajustes sustantivos (sin confundir volumen de mensajes con control real).'
    },
    experiments: [
      {
        id: 'exp-demo-1',
        hackId: 4,
        hackName: 'Hacker — Decodificación de reglas e incentivos',
        hypothesis:
          'Si publicamos una hoja única de umbrales comerciales (margen >= 45% y alcance modular) con respaldo explícito al líder técnico, al menos 4 de las próximas 5 cotizaciones saldrán sin escalamiento previo.',
        concreteAction:
          'Activar matriz de 1 página con los 2 líderes principales y auditar resultados el viernes a las 16:00h.',
        executionWindow: '7 Días',
        successIndicator:
          '4 de 5 propuestas emitidas en menos de 6h respetando el margen >= 45%.',
        reversibilityNote:
          'Totalmente reversible: cualquier caso fuera de rango estándar cae automáticamente en nivel rojo con revisión previa.',
        status: 'Propuesto'
      },
      {
        id: 'exp-demo-2',
        hackId: 5,
        hackName: 'Trickster — Inyección estratégica de caos',
        hypothesis:
          'Si bloqueamos de 9:00 a 11:30 AM sin mensajería interna de lunes a jueves dejando una única ventana de consultas a las 12:00 PM, los líderes resolverán dudas menores usando el criterio escrito.',
        concreteAction:
          'Establecer ventana única de consultas operativas a las 12:00 PM durante 48 horas y registrar cuántas urgencias reales ocurren.',
        executionWindow: '48 Horas',
        successIndicator:
          '2 bloques matutinos completos respetados y 0 incidentes críticos con clientes.',
        reversibilityNote:
          'Canal telefónico directo disponible exclusivamente para emergencias de nivel rojo con clientes activos.',
        status: 'Propuesto'
      }
    ],
    strategicMap: {
      summaryChallenge: '',
      keyInsight: '',
      prioritizedHackKeys: ['scheherazade', 'hermes', 'hacker', 'trickster', 'datos'],
      tacticalMantra: '',
      defensiveMoat: '',
      nonNegotiables: [],
      facts: [],
      interpretations: [],
      hypotheses: [],
      imaginedPossibilities: [],
      uncertainties: [],
      criticalPoints: [],
      nextSteps: [],
      hackDeliverables: [],
      realWorldOptions: [],
      synthesisSource: 'local',
      isSynthesized: false,
      generatedAt: ''
    },
    actionPlan: createBlankActionPlan(),
    lastSavedTimestamp: new Date().toISOString()
  };
}

export const DEMO_DISCOVERY_STATE: DiscoveryDeliverableState = createDemoDiscoveryState('organizacion');

export const DEFAULT_DISCOVERY_STATE: DiscoveryDeliverableState = BLANK_DISCOVERY_STATE;
