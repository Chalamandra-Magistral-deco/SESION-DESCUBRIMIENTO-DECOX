import {
  Archetype,
  ArchetypeQuestion,
  MentalHack,
  RPGItem,
  MagistralHackItem,
  DiscoveryDeliverableState,
  DiscoveryTrackType
} from '../types';
import {
  INTERACTIVE_ARCHETYPES,
  INTERACTIVE_QUIZ_QUESTIONS,
  HACKS_DATA,
  PODERES_SHEREZADE_DATA,
  inferDomainFromCategory
} from '../data/interactiveCatalog';

export { HACKS_DATA, PODERES_SHEREZADE_DATA, INTERACTIVE_QUIZ_QUESTIONS };

// Catálogo unificado de 3 arquetipos reales de Interactive DecoX
export const ARCHETYPES: Record<string, Archetype> = INTERACTIVE_ARCHETYPES;

export const QUIZ_QUESTIONS: ArchetypeQuestion[] = INTERACTIVE_QUIZ_QUESTIONS.map((q) => ({
  id: q.id,
  question: q.text,
  options: q.options.map((opt) => ({
    label: opt.text,
    archetypeId: opt.archetype,
    points: 1
  }))
}));

export const MENTAL_HACKS: MentalHack[] = [
  {
    id: 'vacío-activo',
    title: 'La Regla del Vacío Activo',
    category: 'Enfoque',
    difficulty: 'Intermedio',
    shortDesc: 'Elimina el 90% de la estimulación dopaminérgica 15 minutos antes de tomar decisiones cruciales.',
    fullDescription:
      'El Vacío Activo es una técnica de desintoxicación sensorial exprés. Al congelar las entradas de información (notificaciones, música, conversaciones), permites procesar con claridad el nodo prioritario.',
    steps: [
      'Apaga pantallas secundarias y pon dispositivos en silencio.',
      'Siéntate con postura estable sin distracciones visuales.',
      'Respira a ritmo regular durante 3 minutos.',
      'Formula la pregunta clave: "¿Qué es lo único verdaderamente vital ahora?"'
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
    shortDesc: 'Disrumpe la vacilación contando en regresiva de 5 a 1 y ejecutando el primer movimiento físico al llegar a 1.',
    fullDescription:
      'Cuando aparece resistencia a iniciar una tarea incómoda, este protocolo interrumpe el bucle de postergación antes de que escale.',
    steps: [
      'Identifica la acción concreta pendiente.',
      'Cuenta mentalmente: 5, 4, 3, 2, 1.',
      'Inicia físicamente la tarea al llegar a 1.'
    ],
    durationMinutes: 1,
    scientificBasis: 'Activa el control ejecutivo antes de que se consolide la respuesta de evitación.',
    iconName: 'Zap'
  },
  {
    id: 'anclaje-neuronal',
    title: 'Anclaje Neuronal Instantáneo',
    category: 'Mindset',
    difficulty: 'Magistral',
    shortDesc: 'Asocia un estímulo táctil específico con un estado de enfoque sereno.',
    fullDescription:
      'Consiste en asociar un gesto breve con un estado deliberado de atención plena antes de entrar en conversaciones críticas.',
    steps: [
      'Trae a la mente un momento real de claridad y eficacia.',
      'Aplica el gesto táctil elegido durante 7 segundos.',
      'Suelta y respira con calma.',
      'Repite 3 veces antes de iniciar el bloque.'
    ],
    durationMinutes: 4,
    scientificBasis: 'Asociación somática aplicada a la regulación atencional.',
    iconName: 'Anchor'
  },
  {
    id: 'cortina-humo',
    title: 'Desactivación de Cortina de Humo Emocional',
    category: 'Resiliencia',
    difficulty: 'Intermedio',
    shortDesc: 'Separa el evento objetivo de la carga interpretativa proyectada.',
    fullDescription:
      'Ante un contratiempo, disocia los hechos verificables de las suposiciones no comprobadas.',
    steps: [
      'Escribe en una columna: "Hechos verificables".',
      'Escribe en otra columna: "Suposiciones e interpretaciones".',
      'Diseña tu siguiente acción únicamente sobre la primera columna.'
    ],
    durationMinutes: 6,
    scientificBasis: 'Reestructuración cognitiva aplicada a la toma de decisiones.',
    iconName: 'ShieldCheck'
  }
];

export const RPG_ITEMS: RPGItem[] = [
  {
    id: 'item-grimorio-1',
    name: 'Grimorio de Hábitos SRAP',
    type: 'Grimoire',
    rarity: 'Común',
    description: 'Manual de arquitectura de rutinas para reducir fricción operativa.',
    effect: 'Claridad en inicio de bloques de enfoque',
    requiredLevel: 1,
    unlocked: true,
    iconName: 'BookOpen'
  },
  {
    id: 'item-lente-claridad',
    name: 'Lente de Perspectiva',
    type: 'Lens',
    rarity: 'Raro',
    description: 'Ayuda a revisar sesgos cognitivos y detectar alternativas viables.',
    effect: 'Contraste de supuestos',
    requiredLevel: 2,
    unlocked: true,
    iconName: 'Eye'
  },
  {
    id: 'item-pocion-foco',
    name: 'Bloque de Foco Profundo',
    type: 'Potion',
    rarity: 'Épico',
    description: 'Protocolo de atención sin interrupciones.',
    effect: 'Protección de agenda',
    requiredLevel: 3,
    unlocked: false,
    iconName: 'Flame'
  },
  {
    id: 'item-matriz-decision',
    name: 'Matriz de Decisión',
    type: 'Artifact',
    rarity: 'Legendario',
    description: 'Criterios explícitos para evaluar dilemas complejos.',
    effect: 'Síntesis comparativa',
    requiredLevel: 5,
    unlocked: false,
    iconName: 'Crown'
  }
];

export const FAQS = [
  {
    question: '¿Cómo se organiza la Sesión de Descubrimiento DecoX?',
    answer:
      'Se estructura en 5 fases guiadas: 1) Explorar, 2) Decodificar, 3) Aplicar un Hack central de Interactive con su plantilla metodológica, 4) Orientar con SRAP y 5) Cerrar con una Ruta Inicial exportable en PDF/A4 y JSON.'
  },
  {
    question: '¿Necesito haber completado antes el test de arquetipo en la web?',
    answer:
      'No es obligatorio. Si conoces tu resultado de Interactive (El Arquitecto, El Alquimista o El Explorador) puedes indicarlo o responder las 10 preguntas aquí mismo; siempre se utiliza como hipótesis de trabajo y nunca como etiqueta permanente.'
  },
  {
    question: '¿Qué es el protocolo SRAP en la Fase 4?',
    answer:
      'SRAP (Sincronizar, Reconocer, Activar y Pausa) aterriza lo descubierto en las fases previas a tus condiciones actuales, aislando el patrón clave, definiendo una acción inmediata proporcionada y fijando un criterio claro de pausa o revisión.'
  },
  {
    question: '¿Se requiere conexión al motor externo de IA para terminar?',
    answer:
      'No. Toda la sesión cuenta con lógica determinista local fundamentada en tus respuestas y en los catálogos reales de Interactive DecoX.'
  }
];

// Compatibilidad retroactiva para componentes heredados que lean SEVEN_MAGISTRAL_HACKS
export const SEVEN_MAGISTRAL_HACKS: MagistralHackItem[] = HACKS_DATA.slice(0, 7).map((h) => ({
  id: h.id,
  key: h.title.toLowerCase().replace(/\s+/g, '-'),
  codeNumber: String(h.id).padStart(2, '0'),
  archetypeName: h.title,
  name: `${String(h.id).padStart(2, '0')}. ${h.title} — ${h.metodo}`,
  subtitle: h.subtitle,
  phase: [1, 2, 3, 7].includes(h.id) ? 'mundo_simulado' : 'decodificacion_sistema',
  phaseLabel: h.subtitle,
  epistemicRole: [1, 3, 7].includes(h.id) ? 'Posibilidad imaginada' : 'Hipótesis',
  expectedDeliverable: h.metodo,
  coreConcept: h.description,
  guidingQuestions: h.plantillaMetodologica.map((p) => `${p.aspecto}: ${p.guia}`),
  personaQuestions: h.plantillaMetodologica.map((p) => `${p.aspecto}: ${p.guia}`),
  organizacionQuestions: h.plantillaMetodologica.map((p) => `${p.aspecto}: ${p.guia}`),
  tacticalExercise: h.ejercicio,
  templatePrompt: h.plantillaMetodologica.map((p) => `${p.aspecto}: [...]`).join(' | '),
  personaTemplate: h.plantillaMetodologica.map((p) => `${p.aspecto}: [...]`).join(' | '),
  organizacionTemplate: h.plantillaMetodologica.map((p) => `${p.aspecto}: [...]`).join(' | '),
  applicationExample: h.amplificacion,
  iconName: 'Compass',
  color: 'from-amber-500 to-yellow-600'
}));

export function generateDiscoverySessionId(prefix = 'DX'): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rnd = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${prefix}-${ts}-${rnd}`;
}

export function createBlankActionPlan(): DiscoveryDeliverableState['actionPlan'] {
  return [
    {
      weekNumber: 1,
      title: 'Tramo 1 · Acción Inmediata (24–72 h)',
      focusObjective: 'Ejecutar el movimiento inicial calibrado con SRAP dentro de tus restricciones reales.',
      tasks: []
    },
    {
      weekNumber: 2,
      title: 'Tramo 2 · Contraste y Criterio de Pausa (Días 4–14)',
      focusObjective: 'Evaluar señales observadas frente a la hipótesis de trabajo y aplicar el criterio de pausa si corresponde.',
      tasks: []
    },
    {
      weekNumber: 3,
      title: 'Tramo 3 · Consolidación o Ajuste (Días 15–30)',
      focusObjective: 'Decidir con evidencia si sostener, ajustar o llevar el siguiente paso a sesión en vivo.',
      tasks: []
    }
  ];
}

export function createBlankDiscoveryState(
  customSessionId?: string,
  track: DiscoveryTrackType = 'persona'
): DiscoveryDeliverableState {
  const isOrg = track === 'organizacion';
  const defaultCategory = isOrg ? 'Liderazgo & Dirección' : 'Escala de Negocio';
  const defaultDomain = inferDomainFromCategory(defaultCategory);

  return {
    sessionId: customSessionId || generateDiscoverySessionId('DX'),
    isDemoCase: false,
    sessionStarted: false,
    sessionCompleted: false,
    planNeedsSync: false,
    srapNeedsSync: false,
    currentModule: 1,
    challenge: {
      track,
      domain: defaultDomain,
      clientName: '',
      companyOrRole: '',
      explorationFocus: 'Problema o bloqueo',
      title: '',
      category: defaultCategory,
      currentSituation: '',
      criticalFriction: '',
      previousAttempts: '',
      constraintsSummary: '',
      expectedOutcome: '',
      primaryMetric: '',
      timeframe: 'Próximos 30 días',
      keyActorsAndIncentives: '',
      conditionalAnswers: {}
    },
    strategicProfile: {
      archetypeHypothesis: null,
      archetypeSource: 'none',
      archetypeHypothesisNotes: '',
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
    selectedHackId: null,
    hackPlantillaResponses: {},
    powerLens: {
      used: false,
      poderId: 1,
      poderTitle: 'Poder de la Palabra',
      domain: defaultDomain,
      directive: '',
      source: 'local'
    },
    srapOrientation: {
      sincronizar: '',
      reconocer: '',
      activar: '',
      pausa: '',
      immediateStep24h: '',
      nextStepAfterPause: '',
      isCustomized: false
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
      pauseCriteria: [],
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
    const base = createBlankDiscoveryState(generateDiscoverySessionId('DEMO'), 'persona');
    return {
      ...base,
      isDemoCase: true,
      sessionStarted: true,
      planNeedsSync: true,
      srapNeedsSync: false,
      currentModule: 1,
      challenge: {
        track: 'persona',
        domain: 'Negocios',
        clientName: 'Caso Demostrativo · Recorrido Personas',
        companyOrRole: 'Consultora Independiente en Transición a Oferta Propia',
        explorationFocus: 'Idea por validar',
        title: 'Validar un diagnóstico propio pagado sin comprometer mis ingresos actuales',
        category: 'Escala de Negocio',
        currentSituation:
          'Trabajo 40h semanales en proyectos para terceros y dedico 6h semanales a preparar un servicio propio de diagnóstico técnico. En 6 semanas he tenido 0 propuestas enviadas.',
        criticalFriction:
          'Reescribo una y otra vez la presentación porque siento que sin una plataforma completa nadie pagará por una sesión diagnóstica puntual.',
        previousAttempts:
          'Reescribí 4 veces el documento comercial y di 3 asesorías informales gratuitas por llamada; agradecieron la ayuda, pero ninguna se convirtió en contratación.',
        constraintsSummary:
          'Máximo 6 horas semanales disponibles fuera del trabajo actual y cero presupuesto para anuncios o equipo externo.',
        expectedOutcome:
          'Cerrar y entregar los primeros 3 diagnósticos pagados de alcance acotado en 30 días.',
        primaryMetric:
          '3 diagnósticos pagados entregados en 30 días dentro del margen de 6h semanales',
        timeframe: 'Próximos 30 días',
        keyActorsAndIncentives:
          'Exclientes y contactos directos con problemas técnicos urgentes que evitan igualas largas.',
        conditionalAnswers: {
          idea_observable_evidence:
            '3 exclientes pidieron orientación puntual en los últimos dos meses.',
          idea_critical_risk:
            'Comprobar si aceptan pagar por el diagnóstico acotado sin incluir ejecución mensual.'
        }
      },
      strategicProfile: {
        archetypeHypothesis: 'El Arquitecto',
        archetypeSource: 'manual',
        archetypeHypothesisNotes:
          'Hipótesis inicial: mi preferencia por tener toda la estructura perfecta antes de salir está operando aquí como freno comercial.',
        evidenceLevel: 'Señales parciales',
        dependencyScope: 'Clientes, mercado o terceros',
        urgencyLevel: 'Táctica (7–14 días)',
        dominantThoughtPattern:
          'Hasta que mi oferta no parezca una firma grande, presentar precio restará credibilidad.',
        underlyingAssumptions: [
          'Mis contactos solo valoran proyectos largos de implementación.',
          'Necesito automatizar la entrega antes de vender la primera sesión.'
        ],
        realConstraints: [
          'Máximo 6 horas semanales disponibles fuera del trabajo principal.',
          'Sin presupuesto para pauta pagada ni subcontratación.'
        ],
        artificialConstraints: [
          'Seguir rediseñando documentos antes de hacer las primeras 5 invitaciones directas.',
          'Atender consultas informales gratis sin encuadre ni entregable definido.'
        ],
        uncertainties: [
          '¿Cuántos de los primeros 6 contactos con dolor activo aceptarán condiciones de pago por un diagnóstico de 90 minutos?',
          '¿Qué objeción real aparecerá al presentar alcance cerrado?'
        ],
        hiddenIncentives:
          'Perfeccionar documentos en privado evita exponerse a un "no" comercial directo.',
        strategicHypothesis:
          'Si encuadro mi disponibilidad acotada como una auditoría puntual de 90 minutos con hoja de ruta en 48h ante 6 contactos reales, obtendré validación directa de pago sin construir infraestructura previa.',
        conditionalProfileAnswers: {
          evidence_gap: 'Tengo consultas informales frecuentes, pero 0 propuestas económicas enviadas.'
        }
      },
      selectedHackId: 1,
      selectedHackIds: [1],
      hackPlantillaResponses: {
        1: [
          'Ordenar y convocar claridad: pasar de "dar consejos sueltos" a ofrecer una auditoría puntual con entregable concreto.',
          '6 contactos directos y exclientes que ya me consultaron por cuellos de botella técnicos urgentes.',
          'Mensaje directo personalizado de 5 líneas seguido de invitación a revisión diagnóstica de alcance fijo.'
        ]
      },
      hackNotes: {
        1: 'Mi Intención (Verbo): Ordenar y convocar claridad. | Mi Audiencia (Receptor): 6 contactos directos con fricción activa. | Mi Vehículo (Formato): Mensaje directo personalizado de 5 líneas.'
      },
      powerLens: {
        used: true,
        poderId: 1,
        poderTitle: 'Poder de la Palabra',
        domain: 'Negocios',
        directive:
          '**Lente del Marco Rector (Negocios):** Deja de presentar tu agenda de 6h semanales como limitación; comunícala hoy ante 6 contactos como cupo focalizado de 3 diagnósticos puntuales con entrega en 48h.',
        source: 'local'
      },
      srapOrientation: {
        sincronizar:
          'Opero con 6 horas semanales reales, 0 presupuesto publicitario y una red cercana donde 3 personas ya pidieron orientación informal.',
        reconocer:
          'El patrón que bloquea el avance es sustituir conversaciones reales de venta por rediseños del documento y llamadas gratuitas sin marco.',
        activar:
          'Enviar en las próximas 48 horas el mensaje de 5 líneas (plantilla Scheherazade) a 6 contactos concretos ofreciendo 1 de los 3 cupos piloto pagados.',
        pausa:
          'Detener cualquier nuevo rediseño de página o plantilla; si tras contactar a los 6 prospectos 0 aceptan conversar condiciones, pausar y revisar la objeción textual antes de escribir a más personas.',
        immediateStep24h:
          'Seleccionar los 6 nombres reales hoy y enviar los primeros 3 mensajes directos con alcance y precio explícitos.',
        nextStepAfterPause:
          'Contrastar las respuestas reales de los 6 contactos y ajustar el alcance del diagnóstico o llevar las objeciones reales a la sesión en vivo.',
        isCustomized: true
      }
    };
  }

  const base = createBlankDiscoveryState(generateDiscoverySessionId('DEMO'), 'organizacion');
  return {
    ...base,
    isDemoCase: true,
    sessionStarted: true,
    planNeedsSync: true,
    srapNeedsSync: false,
    currentModule: 1,
    challenge: {
      track: 'organizacion',
      domain: 'Negocios',
      clientName: 'Caso Demostrativo · Recorrido Organizaciones',
      companyOrRole: 'Dirección General · Firma B2B de Servicios (18 personas)',
      explorationFocus: 'Problema o bloqueo',
      title: 'Destrabar el cuello de botella de aprobaciones comerciales y técnicas sin perder margen',
      category: 'Liderazgo & Dirección',
      currentSituation:
        'El 85% de las cotizaciones y ajustes de alcance pasan por Dirección General, demorando entre 48 y 72 horas la respuesta al cliente.',
      criticalFriction:
        'Los líderes de proyecto escalan hasta decisiones menores hacia dirección por temor a cometer errores sin respaldo explícito.',
      previousAttempts:
        'Se pidió verbalmente en dos reuniones mensuales "mayor autonomía y proactividad" a los líderes, pero a las dos semanas volvieron a consultar cada cotización por chat.',
      constraintsSummary:
        'Sin presupuesto este trimestre para contratar gerencia intermedia y exigencia innegociable de mantener margen bruto >= 45%.',
      expectedOutcome:
        'Resolver al menos el 70% de cotizaciones estándar sin escalamiento previo manteniendo margen >= 45%.',
      primaryMetric:
        'Tiempo de emisión comercial < 6h en propuestas estándar y 10h semanales liberadas en dirección',
      timeframe: 'Próximos 30 días',
      keyActorsAndIncentives:
        'Dirección General (cuida margen pero centraliza por hábito), 6 Líderes Técnicos (escalan dudas porque no existe umbral escrito que los proteja) y Clientes B2B.',
      conditionalAnswers: {
        problem_recurrence:
          'Se repite desde hace 8 meses cada vez que coinciden más de 3 entregas; los exhortos verbales no cambiaron las reglas reales.',
        org_formal_vs_informal_rules:
          'Formalmente se pide agilidad, pero informalmente escalar todo hacia dirección tiene costo cero para el líder.'
      }
    },
    strategicProfile: {
      archetypeHypothesis: 'El Explorador',
      archetypeSource: 'manual',
      archetypeHypothesisNotes:
        'Hipótesis de trabajo: facilidad para detectar el incentivo implícito del equipo, pero riesgo de improvisar excepciones caso por caso sin fijar una regla estable.',
      evidenceLevel: 'Señales parciales',
      dependencyScope: 'Equipo o socios internos',
      urgencyLevel: 'Táctica (7–14 días)',
      dominantThoughtPattern:
        'Si Dirección no revisa cada propuesta antes de salir, el equipo regalará alcance o margen.',
      underlyingAssumptions: [
        'Los líderes técnicos no pueden cuidar el margen ni siquiera con parámetros numéricos claros.',
        'Pedir proactividad sin cambiar las reglas de respaldo basta para delegar.'
      ],
      realConstraints: [
        'Equipo actual de 6 líderes sin presupuesto para nueva gerencia este trimestre.',
        'Margen bruto mínimo del 45% requerido para sostener la operación.'
      ],
      artificialConstraints: [
        'Exigir visto bueno previo en propuestas repetitivas de monto estándar.',
        'Atender dudas internas por mensajería cada 10 minutos.'
      ],
      uncertainties: [
        '¿Qué proporción de las últimas 20 revisiones cambió realmente números de margen frente a detalles menores de redacción?',
        '¿Cuántas cotizaciones saldrán autónomamente en la primera semana con una regla explícita de umbrales?'
      ],
      hiddenIncentives:
        'Escalar hacia arriba protege al líder de cualquier reproche; corregir todo refuerza en dirección la sensación de control inmediato.',
      strategicHypothesis:
        'Si explicitamos el subtexto defensivo y fijamos una regla escrita de umbrales (verde: autonomía con respaldo garantizado; rojo: revisión previa), el flujo estándar se destrabará sin perder margen.',
      conditionalProfileAnswers: {
        stakeholder_alignment:
          'Acuerdo explícito de que decidir dentro de la banda verde cuenta con respaldo total de dirección.'
      }
    },
    selectedHackId: 4,
    selectedHackIds: [4],
    hackPlantillaResponses: {
      4: [
        '"Queremos más agilidad", "consúltame rápido antes de mandar", "mejor asegurarnos".',
        'Inseguridad de los líderes ante un posible reproche si el cliente negocia alcance, y ansiedad de dirección por soltar el control.',
        '¿Qué decisiones exactas puede tomar hoy un líder sin pedir permiso y con garantía explícita de que no será penalizado si respeta el margen >= 45%?'
      ]
    },
    hackNotes: {
      4: 'La Superficie: "Consúltame rápido antes de mandar". | El Subtexto: Temor a reproche sin umbral escrito. | El Silencio: ¿Qué rango exacto tiene respaldo garantizado sin pedir permiso?'
    },
    powerLens: {
      used: false,
      poderId: 4,
      poderTitle: 'Poder del Escucha',
      domain: 'Negocios',
      directive: '',
      source: 'local'
    },
    srapOrientation: {
      sincronizar:
        'Operación activa de 18 personas con margen mínimo obligatorio del 45%, 6 líderes técnicos y demora comercial actual de 48–72h.',
      reconocer:
        'Los pedidos verbales de autonomía fallaron porque el silencio del sistema penaliza el error propio y premia escalar cualquier duda a dirección.',
      activar:
        'Publicar y probar durante 5 días hábiles una hoja única de umbrales con los 2 líderes principales: toda cotización estándar con margen >= 45% se envía directo y se audita solo el viernes.',
      pausa:
        'Detener el piloto inmediatamente si alguna propuesta emitida en banda verde baja del 45% de margen o compromete plazos fuera de capacidad; revisar el umbral el viernes antes de extenderlo a los 6 líderes.',
      immediateStep24h:
        'Clasificar las últimas 10 cotizaciones para fijar por escrito el rango exacto de banda verde y comunicarlo a los 2 líderes piloto.',
      nextStepAfterPause:
        'Auditar el viernes tiempo de respuesta y margen real de las propuestas emitidas; si cumple criterio, extender a todo el equipo o afinar bordes en la sesión en vivo.',
      isCustomized: true
    }
  };
}

export const DEMO_DISCOVERY_STATE: DiscoveryDeliverableState = createDemoDiscoveryState('organizacion');

export const DEFAULT_DISCOVERY_STATE: DiscoveryDeliverableState = BLANK_DISCOVERY_STATE;
