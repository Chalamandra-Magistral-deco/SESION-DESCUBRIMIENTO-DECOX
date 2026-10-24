import {
  ChallengeData,
  StrategicProfileData,
  ExplorationFocusType,
  EvidenceLevelType,
  DependencyScopeType,
  UrgencyLevelType,
  DiscoveryDeliverableState,
  DiscoveryTrackType
} from '../types';

/**
 * Configuración modular del flujo interactivo de la Sesión de Descubrimiento.
 * Conecta los dos recorridos (Personas y Organizaciones), las tres fases
 * (Mundo Simulado, Decodificación del sistema y Mundo Real) y los 7 hacks canónicos.
 */

export interface ConditionalQuestionDef {
  id: string;
  label: string;
  helperText: string;
  placeholder: string;
  epistemicRole: 'fact' | 'interpretation' | 'uncertainty';
  shouldDisplay: (challenge: ChallengeData, profile?: StrategicProfileData) => boolean;
}

export const DISCOVERY_TRACK_OPTIONS: {
  value: DiscoveryTrackType;
  title: string;
  subtitle: string;
  description: string;
  focusSummary: string;
}[] = [
  {
    value: 'persona',
    title: 'Recorrido Personas',
    subtitle: 'Problemas, ideas y proyectos propios',
    description:
      'Para profesionales, creadores, consultores o fundadores que necesitan destrabar una decisión, validar una idea o reconfigurar un proyecto personal.',
    focusSummary: 'Foco en claridad narrativa, recursos propios, validación rápida y autonomía de acción.'
  },
  {
    value: 'organizacion',
    title: 'Recorrido Organizaciones',
    subtitle: 'Sistema de trabajo, actores e incentivos',
    description:
      'Para direcciones, líderes de área, socios o equipos que necesitan decodificar cuellos de botella operativos, reglas formales frente a incentivos reales y coordinación.',
    focusSummary: 'Foco en arquitectura del sistema, mapa de actores, reglas explícitas e incentivos legítimos.'
  }
];

export type DiscoveryFlowPhaseGroup =
  | 'encuadre'
  | 'mundo_simulado'
  | 'decodificacion'
  | 'mundo_real';

export interface DiscoveryFlowStepDef {
  num: number;
  id: string;
  shortLabel: string;
  navLabel: string;
  phase: DiscoveryFlowPhaseGroup;
  phaseTitle: string;
  hackId?: number;
  hackCode?: string;
}

export const DISCOVERY_PHASE_GROUPS: {
  id: DiscoveryFlowPhaseGroup;
  code: string;
  title: string;
  shortTitle: string;
  startStep: number;
  endStep: number;
}[] = [
  {
    id: 'encuadre',
    code: 'Base',
    title: 'Encuadre y Epistemología',
    shortTitle: 'Encuadre',
    startStep: 1,
    endStep: 2
  },
  {
    id: 'mundo_simulado',
    code: 'Fase A',
    title: 'Fase A · Mundo Simulado',
    shortTitle: 'Mundo Simulado',
    startStep: 3,
    endStep: 6
  },
  {
    id: 'decodificacion',
    code: 'Fase B',
    title: 'Fase B · Decodificación',
    shortTitle: 'Decodificación',
    startStep: 7,
    endStep: 10
  },
  {
    id: 'mundo_real',
    code: 'Fase C',
    title: 'Fase C · Mundo Real',
    shortTitle: 'Mundo Real',
    startStep: 11,
    endStep: 13
  }
];

export const DISCOVERY_FLOW_STEPS: DiscoveryFlowStepDef[] = [
  {
    num: 1,
    id: 'contexto',
    shortLabel: 'Contexto',
    navLabel: '01. Contexto',
    phase: 'encuadre',
    phaseTitle: 'Encuadre Inicial · Explorar'
  },
  {
    num: 2,
    id: 'epistemologia',
    shortLabel: 'Epistemología',
    navLabel: '02. Epistemología',
    phase: 'encuadre',
    phaseTitle: 'Encuadre Inicial · Calibración Epistémica'
  },
  {
    num: 3,
    id: 'scheherazade',
    shortLabel: 'Scheherazade',
    navLabel: '03. Scheherazade',
    phase: 'mundo_simulado',
    phaseTitle: 'Fase A · Mundo Simulado · Hack 01',
    hackId: 1,
    hackCode: '01'
  },
  {
    num: 4,
    id: 'hermes',
    shortLabel: 'Hermes',
    navLabel: '04. Hermes',
    phase: 'mundo_simulado',
    phaseTitle: 'Fase A · Mundo Simulado · Hack 02',
    hackId: 2,
    hackCode: '02'
  },
  {
    num: 5,
    id: 'carroll',
    shortLabel: 'Carroll',
    navLabel: '05. Carroll',
    phase: 'mundo_simulado',
    phaseTitle: 'Fase A · Mundo Simulado · Hack 03',
    hackId: 3,
    hackCode: '03'
  },
  {
    num: 6,
    id: 'nino-8-anos',
    shortLabel: 'Niño de 8 años',
    navLabel: '06. Niño de 8 años',
    phase: 'mundo_simulado',
    phaseTitle: 'Fase A · Mundo Simulado · Hack 07',
    hackId: 7,
    hackCode: '07'
  },
  {
    num: 7,
    id: 'hacker',
    shortLabel: 'Hacker',
    navLabel: '07. Hacker',
    phase: 'decodificacion',
    phaseTitle: 'Fase B · Decodificación · Hack 04',
    hackId: 4,
    hackCode: '04'
  },
  {
    num: 8,
    id: 'trickster',
    shortLabel: 'Trickster',
    navLabel: '08. Trickster',
    phase: 'decodificacion',
    phaseTitle: 'Fase B · Decodificación · Hack 05',
    hackId: 5,
    hackCode: '05'
  },
  {
    num: 9,
    id: 'data',
    shortLabel: 'Data',
    navLabel: '09. Data',
    phase: 'decodificacion',
    phaseTitle: 'Fase B · Decodificación · Hack 06',
    hackId: 6,
    hackCode: '06'
  },
  {
    num: 10,
    id: 'experimentos',
    shortLabel: 'Experimentos',
    navLabel: '10. Experimentos',
    phase: 'decodificacion',
    phaseTitle: 'Fase B · Decodificación · Laboratorio Reversible'
  },
  {
    num: 11,
    id: 'mundo-real',
    shortLabel: 'Síntesis Mundo Real',
    navLabel: '11. Mundo Real',
    phase: 'mundo_real',
    phaseTitle: 'Fase C · Mundo Real y Sesión en Vivo'
  },
  {
    num: 12,
    id: 'ruta-30d',
    shortLabel: 'Ruta 30D',
    navLabel: '12. Ruta 30D',
    phase: 'mundo_real',
    phaseTitle: 'Fase C · Mundo Real · Ruta de 30 Días'
  },
  {
    num: 13,
    id: 'informe-pdf',
    shortLabel: 'Informe PDF',
    navLabel: '13. Informe PDF',
    phase: 'mundo_real',
    phaseTitle: 'Fase C · Mundo Real · Informe Ejecutivo'
  }
];

export const STEP_NUM_BY_HACK_ID: Record<number, number> = {
  1: 3, // Scheherazade
  2: 4, // Hermes
  3: 5, // Carroll
  7: 6, // Niño de 8 años
  4: 7, // Hacker
  5: 8, // Trickster
  6: 9  // Data
};

export const DISCOVERY_EXPERIMENTS_STEP = 10;
export const DISCOVERY_SYNTHESIS_STEP = 11;
export const DISCOVERY_PLAN_STEP = 12;
export const DISCOVERY_REPORT_STEP = 13;
export const TOTAL_DISCOVERY_STEPS = DISCOVERY_FLOW_STEPS.length;

export const MUNDO_PHASES_OVERVIEW = [
  {
    id: 'mundo_simulado' as const,
    code: 'Fase A',
    title: 'Fase A · Mundo Simulado',
    subtitle: 'Imaginar, cuestionar y rediseñar el tablero',
    hacksSummary: 'Scheherazade · Hermes · Carroll · Niño de 8 años',
    description:
      'Cambia la perspectiva sin falsear hechos, reconoce patrones transferibles de otros sectores, rompe falsos dilemas e imagina posibilidades sin limitaciones heredadas.'
  },
  {
    id: 'decodificacion_sistema' as const,
    code: 'Fase B',
    title: 'Fase B · Decodificación',
    subtitle: 'Descubrir cómo funciona realmente el tablero',
    hacksSummary: 'Hacker · Trickster · Data · Experimentos controlados',
    description:
      'Distingue reglas declaradas de incentivos reales con ventajas legítimas, introduce variaciones pequeñas y reversibles y contrasta hipótesis con datos observados.'
  },
  {
    id: 'mundo_real' as const,
    code: 'Fase C',
    title: 'Fase C · Mundo Real',
    subtitle: 'Convertir posibilidades en acción defendible',
    hacksSummary: 'Síntesis del caso · Sesión en Vivo · Ruta 30D · Informe PDF',
    description:
      'Compara alternativas frente a recursos, riesgos y resultados esperados; entrega una síntesis rigurosa del caso y un siguiente paso defendible para trabajar en la sesión en vivo.'
  }
] as const;

export const EXPLORATION_FOCUS_OPTIONS: {
  value: ExplorationFocusType;
  title: string;
  description: string;
}[] = [
  {
    value: 'Situación actual',
    title: 'Situación actual',
    description: 'Ordenar variables presentes, clarificar dónde estás parado y definir dirección.'
  },
  {
    value: 'Idea por validar',
    title: 'Idea por validar',
    description: 'Contrastar una propuesta o iniciativa antes de comprometer tiempo o recursos.'
  },
  {
    value: 'Problema o bloqueo',
    title: 'Problema o bloqueo',
    description: 'Aislar la causa raíz de una fricción recurrente que frena decisiones o resultados.'
  },
  {
    value: 'Proyecto en ejecución',
    title: 'Proyecto en ejecución',
    description: 'Destrabar un frente activo, corregir desvíos y recuperar tracción medible.'
  }
];

export const EVIDENCE_LEVEL_OPTIONS: {
  value: EvidenceLevelType;
  title: string;
  description: string;
}[] = [
  {
    value: 'Datos verificados',
    title: 'Datos verificados (Hechos)',
    description: 'Cuento con registros, métricas o hechos observables recientes.'
  },
  {
    value: 'Señales parciales',
    title: 'Señales parciales (Correlaciones iniciales)',
    description: 'Mezclo algunos indicadores reales con hipótesis aún no comprobadas.'
  },
  {
    value: 'Intuición no verificada',
    title: 'Intuición / Hipótesis abierta',
    description: 'Todavía no he medido objetivamente el fenómeno; parto de una lectura inicial.'
  }
];

export const DEPENDENCY_SCOPE_OPTIONS: {
  value: DependencyScopeType;
  title: string;
  description: string;
}[] = [
  {
    value: 'Control propio directo',
    title: 'Control propio directo',
    description: 'La ejecución depende principalmente de mis decisiones, agenda y enfoque.'
  },
  {
    value: 'Equipo o socios internos',
    title: 'Equipo o socios internos',
    description: 'Requiere coordinación, reglas explícitas o acuerdos con colaboradores o socios.'
  },
  {
    value: 'Clientes, mercado o terceros',
    title: 'Clientes, mercado o terceros',
    description: 'Involucra respuesta comercial, validación externa o actores fuera de mi control directo.'
  }
];

export const URGENCY_LEVEL_OPTIONS: {
  value: UrgencyLevelType;
  title: string;
}[] = [
  { value: 'Inmediata (24–72h)', title: 'Inmediata (24–72h)' },
  { value: 'Táctica (7–14 días)', title: 'Táctica (7–14 días)' },
  { value: 'Estructural (30–90 días)', title: 'Estructural (30–90 días)' }
];

export const STEP1_CONDITIONAL_QUESTIONS: ConditionalQuestionDef[] = [
  {
    id: 'idea_observable_evidence',
    label: 'Condicional (Idea por validar) · ¿Qué hecho observable tienes hoy de esta necesidad?',
    helperText:
      'Separa el entusiasmo por la idea de los hechos concretos que ya observaste en usuarios, clientes o entorno.',
    placeholder:
      'Ej: 4 clientes actuales pidieron esta solución en el último mes, pero aún no hemos cobrado por ella...',
    epistemicRole: 'fact',
    shouldDisplay: (c) => c.explorationFocus === 'Idea por validar'
  },
  {
    id: 'idea_critical_risk',
    label: 'Condicional (Idea por validar) · ¿Qué hipótesis haría inviable la idea si resulta falsa?',
    helperText: 'Identifica la incertidumbre más crítica que debe ponerse a prueba primero.',
    placeholder:
      'Ej: Hipótesis crítica: comprobar si el decisor cambiará su forma actual de resolverlo en menos de 30 días...',
    epistemicRole: 'uncertainty',
    shouldDisplay: (c) => c.explorationFocus === 'Idea por validar'
  },
  {
    id: 'problem_recurrence',
    label: 'Condicional (Problema o bloqueo) · ¿Desde cuándo ocurre y qué intento previo no funcionó?',
    helperText: 'Permite a Hermes (Hack 02) distinguir un evento aislado de un patrón estructural repetido.',
    placeholder:
      'Ej: Lleva 6 meses repitiéndose al cierre de cada mes; intentamos añadir más horas de revisión y empeoró el cuello de botella...',
    epistemicRole: 'fact',
    shouldDisplay: (c) => (c.explorationFocus || 'Problema o bloqueo') === 'Problema o bloqueo'
  },
  {
    id: 'problem_inaction_cost',
    label: 'Condicional (Problema o bloqueo) · ¿Qué consecuencia medible tendrá no resolverlo en 30 días?',
    helperText: 'Aterriza el costo tangible en tiempo, desgaste, margen o pérdida de oportunidad.',
    placeholder:
      'Ej: Seguir perdiendo 10 horas semanales operativas y posponer el lanzamiento principal del trimestre...',
    epistemicRole: 'fact',
    shouldDisplay: (c) => (c.explorationFocus || 'Problema o bloqueo') === 'Problema o bloqueo'
  },
  {
    id: 'project_stalled_milestone',
    label: 'Condicional (Proyecto en ejecución) · ¿Qué entregable o hito exacto está detenido hoy?',
    helperText: 'Especifica el punto preciso donde se interrumpió el flujo de avance.',
    placeholder:
      'Ej: La validación del piloto con los primeros 5 usuarios lleva 3 semanas sin cerrarse...',
    epistemicRole: 'fact',
    shouldDisplay: (c) => c.explorationFocus === 'Proyecto en ejecución'
  },
  {
    id: 'project_unknown_blocker',
    label: 'Condicional (Proyecto en ejecución) · ¿Qué información aún desconoces para destrabar el siguiente hito?',
    helperText: 'Aísla la incógnita técnica, comercial u operativa que frena la decisión.',
    placeholder:
      'Ej: Desconocemos si el retraso se debe a fricción de uso o a falta de prioridad del cliente...',
    epistemicRole: 'uncertainty',
    shouldDisplay: (c) => c.explorationFocus === 'Proyecto en ejecución'
  },
  {
    id: 'situation_recent_shift',
    label: 'Condicional (Situación actual) · ¿Qué hecho reciente detonó la necesidad de replantear el tablero?',
    helperText: 'Ubica el hecho detonante frente a la interpretación subjetiva del momento.',
    placeholder:
      'Ej: Creció el volumen de solicitudes un 40% pero la estructura operativa sigue siendo la misma...',
    epistemicRole: 'fact',
    shouldDisplay: (c) => c.explorationFocus === 'Situación actual'
  },
  {
    id: 'situation_postponed_decision',
    label: 'Condicional (Situación actual) · ¿Qué decisión concreta llevas posponiendo y bajo qué supuesto?',
    helperText: 'Explicita el dilema central que requiere definición.',
    placeholder:
      'Ej: Definir qué línea secundaria cerrar para concentrar recursos en la principal...',
    epistemicRole: 'interpretation',
    shouldDisplay: (c) => c.explorationFocus === 'Situación actual'
  },
  {
    id: 'org_formal_vs_informal_rules',
    label: 'Condicional (Organizaciones) · ¿Qué regla formal existe hoy frente a lo que realmente premia el sistema?',
    helperText:
      'Alimenta directamente a Hacker (Hack 04): distingue discurso oficial de incentivos reales entre actores.',
    placeholder:
      'Ej: Formalmente pedimos autonomía por área, pero en la práctica cualquier error menor recibe reproche público y nadie decide sin permiso...',
    epistemicRole: 'interpretation',
    shouldDisplay: (c) => c.track === 'organizacion'
  },
  {
    id: 'persona_autonomy_margin',
    label: 'Condicional (Personas) · ¿Qué margen de maniobra depende 100% de ti esta semana sin pedir permiso?',
    helperText:
      'Ubica el espacio real de acción inmediata sobre tu problema, idea o proyecto personal.',
    placeholder:
      'Ej: Puedo definir el alcance del piloto y contactar directamente a 5 prospectos en mis bloques de martes y jueves...',
    epistemicRole: 'fact',
    shouldDisplay: (c) => (c.track || 'persona') === 'persona'
  }
];

export const STEP2_CONDITIONAL_QUESTIONS: ConditionalQuestionDef[] = [
  {
    id: 'evidence_gap',
    label: 'Condicional (Inteligencia de Datos) · ¿Qué dato observado te falta hoy y estás supliendo con suposiciones?',
    helperText:
      'Se activa cuando el nivel de evidencia no está respaldado al 100% por datos verificados; evita confundir correlación o intuición con causalidad.',
    placeholder:
      'Ej: Asumo cuál es la causa de caída sin haber medido tiempos reales por etapa en las últimas 2 semanas...',
    epistemicRole: 'uncertainty',
    shouldDisplay: (_c, p) => (p?.evidenceLevel || 'Señales parciales') !== 'Datos verificados'
  },
  {
    id: 'stakeholder_alignment',
    label: 'Condicional (Reglas e Incentivos con Terceros) · ¿Qué acuerdo o regla legítima falta explicitar con los involucrados?',
    helperText:
      'Se activa cuando el avance involucra equipo, socios, clientes o terceros.',
    placeholder:
      'Ej: No existe un criterio escrito de qué decisiones toman solos con respaldo garantizado y cuáles requieren escalamiento...',
    epistemicRole: 'interpretation',
    shouldDisplay: (_c, p) => (p?.dependencyScope || 'Equipo o socios internos') !== 'Control propio directo'
  }
];

export interface RecommendedHackMatch {
  hackId: number;
  reason: string;
}

export function computeRecommendedHacks(
  challenge: ChallengeData,
  profile: StrategicProfileData
): RecommendedHackMatch[] {
  const matches: RecommendedHackMatch[] = [];
  const addMatch = (hackId: number, reason: string) => {
    if (!matches.some((m) => m.hackId === hackId) && matches.length < 4) {
      matches.push({ hackId, reason });
    }
  };

  const isOrg = challenge.track === 'organizacion';

  // Fase A · Mundo Simulado triggers
  if (profile.dominantThoughtPattern.trim().length > 10 || profile.artificialConstraints.length > 0) {
    addMatch(
      1,
      isOrg
        ? 'Scheherazade permite cambiar el relato interno entre actores sin falsear hechos, alineando cómo se percibe el valor del cambio.'
        : 'Scheherazade te permite reencuadrar la narrativa de tu proyecto sin falsear hechos para comunicar su valor real.'
    );
  }

  if (challenge.explorationFocus === 'Problema o bloqueo') {
    addMatch(
      2,
      'Hermes detecta la estructura repetitiva detrás del bloqueo y adapta soluciones probadas en otros sectores sin copiarlas ciegamente.'
    );
  }

  if (challenge.category === 'Disrupción e Innovación' || challenge.explorationFocus === 'Idea por validar') {
    addMatch(
      7,
      'El niño de 8 años abre una posibilidad radical sin limitaciones heredadas que luego puedes bajar a una prueba real.'
    );
  }

  // Fase B · Decodificación del sistema triggers
  if (isOrg || profile.dependencyScope === 'Equipo o socios internos' || profile.hiddenIncentives.trim().length > 5) {
    addMatch(
      4,
      'Hacker decodifica la brecha entre reglas declaradas e incentivos reales para activar puntos de influencia 100% legítimos.'
    );
  }

  if (challenge.explorationFocus === 'Idea por validar' || profile.dependencyScope === 'Clientes, mercado o terceros') {
    addMatch(
      5,
      'Trickster introduce variaciones pequeñas y reversibles para revelar dependencias reales sin comprometer el proyecto.'
    );
  }

  if (profile.evidenceLevel !== 'Datos verificados') {
    addMatch(
      6,
      'Inteligencia basada en datos separa lo supuesto de lo observado y traduce señales en hipótesis medibles sin asumir causalidad.'
    );
  }

  // Ensure balanced coverage across Mundo Simulado & Decodificación if fewer than 4
  addMatch(
    3,
    'Carroll cuestiona premisas ocultas y sostiene dos exigencias aparentemente opuestas para generar alternativas no obvias.'
  );
  addMatch(
    4,
    'Hacker identifica oportunidades legítimas dentro de las reglas actuales del sistema.'
  );
  addMatch(
    6,
    'Inteligencia basada en datos establece criterios objetivos de decisión para el Mundo Real.'
  );

  return matches.slice(0, 4);
}

export function calculateDiscoveryCompletion(state: DiscoveryDeliverableState): {
  percentage: number;
  completedChecks: number;
  totalChecks: number;
} {
  const checks = [
    Boolean(state.challenge.track),
    Boolean(state.challenge.title.trim()),
    Boolean(state.challenge.currentSituation.trim()),
    Boolean(state.challenge.criticalFriction.trim()),
    Boolean(state.challenge.expectedOutcome.trim()),
    Boolean(state.challenge.primaryMetric.trim()),
    Boolean(state.strategicProfile.dominantThoughtPattern.trim()),
    state.strategicProfile.underlyingAssumptions.length > 0 ||
      state.strategicProfile.realConstraints.length > 0,
    (state.strategicProfile.uncertainties?.length || 0) > 0 ||
      Object.values(state.strategicProfile.conditionalProfileAnswers || {}).some(
        (v) => v.trim().length > 0
      ),
    state.selectedHackIds.length > 0 ||
      Object.values(state.hackNotes || {}).some((v) => v.trim().length > 0),
    state.experiments.length > 0,
    Boolean(state.strategicMap.isSynthesized || state.strategicMap.summaryChallenge.trim())
  ];

  const completedChecks = checks.filter(Boolean).length;
  return {
    percentage: Math.round((completedChecks / checks.length) * 100),
    completedChecks,
    totalChecks: checks.length
  };
}

