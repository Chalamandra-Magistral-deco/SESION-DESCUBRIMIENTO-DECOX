import {
  ChallengeData,
  StrategicProfileData,
  ExplorationFocusType,
  EvidenceLevelType,
  DependencyScopeType,
  UrgencyLevelType,
  DiscoveryDeliverableState,
  DiscoveryTrackType,
  InteractiveHack,
  PoderDeSherezade
} from '../types';
import {
  HACKS_DATA,
  PODERES_SHEREZADE_DATA,
  getPoderForHack
} from './interactiveCatalog';

/**
 * Arquitectura funcional de cinco fases para la Sesión de Descubrimiento DecoX:
 * 01. EXPLORAR -> 02. DECODIFICAR -> 03. APLICAR UN HACK -> 04. ORIENTAR CON SRAP -> 05. CERRAR CON UNA RUTA INICIAL
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
    subtitle: 'Objetivos, ideas y decisiones propias',
    description:
      'Para profesionales, creadores, consultores o fundadores que necesitan destrabar un problema, validar una iniciativa o definir una ruta propia.',
    focusSummary: 'Adapta las guías a autonomía personal, foco, validación directa y restricciones propias.'
  },
  {
    value: 'organizacion',
    title: 'Recorrido Organizaciones',
    subtitle: 'Equipos, coordinación, reglas e incentivos',
    description:
      'Para direcciones, líderes de área, socios o equipos que abordan fricciones operativas, subtexto entre actores o toma de decisiones compartida.',
    focusSummary: 'Adapta las guías a dinámicas de equipo, acuerdos explícitos, márgenes y criterios operativos.'
  }
];

export type DiscoveryFlowPhaseGroup =
  | 'explorar'
  | 'decodificar'
  | 'aplicar_hack'
  | 'orientar_srap'
  | 'ruta_inicial';

export interface DiscoveryFlowStepDef {
  num: number;
  id: string;
  code: string;
  shortLabel: string;
  navLabel: string;
  phase: DiscoveryFlowPhaseGroup;
  phaseTitle: string;
  purpose: string;
}

export const DISCOVERY_FIVE_PHASES: DiscoveryFlowStepDef[] = [
  {
    num: 1,
    id: 'explorar',
    code: '01',
    shortLabel: 'Explorar',
    navLabel: '01. Explorar',
    phase: 'explorar',
    phaseTitle: 'Fase 1 · Explorar el Caso',
    purpose: 'Definir objetivo, fricción actual, qué se ha intentado y restricciones reales.'
  },
  {
    num: 2,
    id: 'decodificar',
    code: '02',
    shortLabel: 'Decodificar',
    navLabel: '02. Decodificar',
    phase: 'decodificar',
    phaseTitle: 'Fase 2 · Decodificar Patrones e Hipótesis',
    purpose: 'Incorporar arquetipo como hipótesis opcional, aislar evidencias e incertidumbres y detectar poderes con fundamento.'
  },
  {
    num: 3,
    id: 'aplicar-hack',
    code: '03',
    shortLabel: 'Aplicar un Hack',
    navLabel: '03. Aplicar un Hack',
    phase: 'aplicar_hack',
    phaseTitle: 'Fase 3 · Aplicar un Hack Central',
    purpose: 'Elegir un solo Hack de Interactive, completar su plantilla metodológica real y usar opcionalmente el Lente de Poder.'
  },
  {
    num: 4,
    id: 'orientar-srap',
    code: '04',
    shortLabel: 'Orientar con SRAP',
    navLabel: '04. Orientar con SRAP',
    phase: 'orientar_srap',
    phaseTitle: 'Fase 4 · Orientar con Protocolo SRAP',
    purpose: 'Sincronizar condiciones actuales, reconocer el patrón clave, activar una acción proporcionada y fijar criterio de pausa.'
  },
  {
    num: 5,
    id: 'ruta-inicial',
    code: '05',
    shortLabel: 'Cerrar con Ruta Inicial',
    navLabel: '05. Ruta Inicial',
    phase: 'ruta_inicial',
    phaseTitle: 'Fase 5 · Cerrar con una Ruta Inicial',
    purpose: 'Consolidar síntesis fundamentada, acción inmediata, criterio de pausa e informe ejecutivo PDF/A4 y JSON.'
  }
];

export const DISCOVERY_FLOW_STEPS = DISCOVERY_FIVE_PHASES;

export const DISCOVERY_PHASE_GROUPS = DISCOVERY_FIVE_PHASES.map((step) => ({
  id: step.phase,
  code: `Fase ${step.num}`,
  title: step.phaseTitle,
  shortTitle: step.shortLabel,
  startStep: step.num,
  endStep: step.num,
  purpose: step.purpose
}));

export const DISCOVERY_EXPLORE_STEP = 1;
export const DISCOVERY_DECODE_STEP = 2;
export const DISCOVERY_HACK_STEP = 3;
export const DISCOVERY_SRAP_STEP = 4;
export const DISCOVERY_EXPERIMENTS_STEP = 4;
export const DISCOVERY_PLAN_STEP = 4;
export const DISCOVERY_REPORT_STEP = 5;
export const DISCOVERY_SYNTHESIS_STEP = 5;
export const TOTAL_DISCOVERY_STEPS = 5;
export const STEP_NUM_BY_HACK_ID: Record<number, number> = {
  1: 3,
  2: 3,
  3: 3,
  4: 3,
  5: 3,
  6: 3,
  7: 3,
  8: 3
};

export const EXPLORATION_FOCUS_OPTIONS: {
  value: ExplorationFocusType;
  title: string;
  description: string;
}[] = [
  {
    value: 'Problema o bloqueo',
    title: 'Problema o bloqueo',
    description: 'Destrabar una fricción recurrente que detiene decisiones o resultados.'
  },
  {
    value: 'Idea por validar',
    title: 'Idea por validar',
    description: 'Contrastar una propuesta antes de comprometer más tiempo o presupuesto.'
  },
  {
    value: 'Proyecto en ejecución',
    title: 'Proyecto en ejecución',
    description: 'Corregir un desvío operativo y recuperar tracción verificable.'
  },
  {
    value: 'Situación actual',
    title: 'Situación actual',
    description: 'Ordenar variables presentes y definir prioridad con claridad.'
  }
];

export const EVIDENCE_LEVEL_OPTIONS: {
  value: EvidenceLevelType;
  title: string;
  description: string;
}[] = [
  {
    value: 'Datos verificados',
    title: 'Datos verificados',
    description: 'Cuento con registros, métricas o hechos observables recientes.'
  },
  {
    value: 'Señales parciales',
    title: 'Señales parciales',
    description: 'Combino algunas observaciones reales con supuestos aún no comprobados.'
  },
  {
    value: 'Intuición no verificada',
    title: 'Intuición / Hipótesis inicial',
    description: 'Aún no tengo medición directa; parto de una lectura preliminar.'
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
    description: 'La ejecución depende principalmente de mis decisiones y agenda.'
  },
  {
    value: 'Equipo o socios internos',
    title: 'Equipo o socios internos',
    description: 'Requiere acuerdos explícitos o coordinación con socios o equipo.'
  },
  {
    value: 'Clientes, mercado o terceros',
    title: 'Clientes, mercado o terceros',
    description: 'Depende de respuesta externa, clientes o interlocutores fuera de mi control.'
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
    label: 'Señal real observada hasta hoy (Idea por validar)',
    helperText: '¿Qué hecho concreto indica que esta necesidad existe más allá de tu entusiasmo?',
    placeholder: 'Ej: 3 clientes actuales preguntaron por esta solución en el último mes...',
    epistemicRole: 'fact',
    shouldDisplay: (c) => c.explorationFocus === 'Idea por validar'
  },
  {
    id: 'idea_critical_risk',
    label: 'Supuesto crítico a verificar primero (Idea por validar)',
    helperText: '¿Qué condición haría inviable la idea si resulta falsa?',
    placeholder: 'Ej: Comprobar si aceptan pagar por el diagnóstico sin requerir meses de soporte...',
    epistemicRole: 'uncertainty',
    shouldDisplay: (c) => c.explorationFocus === 'Idea por validar'
  },
  {
    id: 'problem_inaction_cost',
    label: 'Consecuencia concreta de no resolverlo en 30 días (Problema o bloqueo)',
    helperText: 'Aterriza el costo observable en tiempo, margen, desgaste o foco.',
    placeholder: 'Ej: Seguir perdiendo 10h semanales operativas y retrasar entregas clave...',
    epistemicRole: 'fact',
    shouldDisplay: (c) => (c.explorationFocus || 'Problema o bloqueo') === 'Problema o bloqueo'
  },
  {
    id: 'project_stalled_milestone',
    label: 'Hito o entregable exacto detenido hoy (Proyecto en ejecución)',
    helperText: 'Indica el punto exacto donde se detuvo el avance del proyecto.',
    placeholder: 'Ej: El cierre del piloto con los primeros 5 usuarios lleva 3 semanas detenido...',
    epistemicRole: 'fact',
    shouldDisplay: (c) => c.explorationFocus === 'Proyecto en ejecución'
  },
  {
    id: 'situation_postponed_decision',
    label: 'Decisión concreta pospuesta hoy (Situación actual)',
    helperText: '¿Qué elección específica vienes postergando y por qué?',
    placeholder: 'Ej: Decidir qué frente secundario pausar este mes para concentrar recursos...',
    epistemicRole: 'interpretation',
    shouldDisplay: (c) => c.explorationFocus === 'Situación actual'
  },
  {
    id: 'org_formal_vs_informal_rules',
    label: 'Discurso formal vs. lo que ocurre en la práctica (Organizaciones)',
    helperText: '¿Qué pide formalmente la organización frente a lo que los actores hacen por seguridad o hábito?',
    placeholder: 'Ej: Se pide autonomía, pero ante cualquier duda todos escalan hacia arriba para evitar errores...',
    epistemicRole: 'interpretation',
    shouldDisplay: (c) => c.track === 'organizacion'
  }
];

export const STEP2_CONDITIONAL_QUESTIONS: ConditionalQuestionDef[] = [
  {
    id: 'evidence_gap',
    label: 'Vacío de evidencia actual',
    helperText: 'Como aún no cuentas con datos verificados completos, ¿qué dato concreto te falta observar?',
    placeholder: 'Ej: No he medido cuántas horas o solicitudes reales caen en cada categoría...',
    epistemicRole: 'uncertainty',
    shouldDisplay: (_c, p) => (p?.evidenceLevel || 'Señales parciales') !== 'Datos verificados'
  },
  {
    id: 'stakeholder_alignment',
    label: 'Acuerdo o condición pendiente con terceros',
    helperText: 'Como el caso involucra a otras personas, ¿qué pregunta o regla aún no se ha puesto en palabras?',
    placeholder: 'Ej: Falta definir qué margen de decisión tienen sin pedir autorización previa...',
    epistemicRole: 'interpretation',
    shouldDisplay: (_c, p) => (p?.dependencyScope || 'Control propio directo') !== 'Control propio directo'
  }
];

export interface GroundedPowerMatch {
  poder: PoderDeSherezade;
  foundation: string;
}

/**
 * Relaciona el caso con `PODERES_SHEREZADE_DATA` únicamente cuando existe
 * fundamento explícito en las respuestas registradas por el usuario.
 */
export function deriveGroundedPowersForCase(
  challenge: ChallengeData,
  profile: StrategicProfileData
): GroundedPowerMatch[] {
  const matches: GroundedPowerMatch[] = [];
  const hasCaseContent =
    Boolean(challenge.currentSituation.trim()) ||
    Boolean(challenge.criticalFriction.trim()) ||
    Boolean(challenge.expectedOutcome.trim()) ||
    Boolean(profile.dominantThoughtPattern.trim());

  if (!hasCaseContent) {
    return [];
  }

  const combinedText = [
    challenge.title,
    challenge.currentSituation,
    challenge.criticalFriction,
    challenge.previousAttempts,
    challenge.expectedOutcome,
    profile.dominantThoughtPattern,
    profile.hiddenIncentives,
    profile.strategicHypothesis
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  const addPower = (id: number, foundation: string) => {
    const poder = PODERES_SHEREZADE_DATA.find((p) => p.id === id);
    if (poder && !matches.some((m) => m.poder.id === id)) {
      matches.push({ poder, foundation });
    }
  };

  // Poder 1: Poder de la Palabra — cuando existe relato limitante o necesidad de comunicar propuesta/encuadre
  if (
    profile.dominantThoughtPattern.trim().length > 8 ||
    /comunicar|mensaje|propuesta|oferta|presentar|vender|explicar|relato|precio/.test(combinedText)
  ) {
    addPower(
      1,
      profile.dominantThoughtPattern.trim()
        ? `Fundamentado en el relato actual registrado ("${profile.dominantThoughtPattern.trim().slice(0, 90)}${profile.dominantThoughtPattern.trim().length > 90 ? '…' : ''}"), donde el lenguaje está condicionando cómo se percibe el caso.`
        : 'Fundamentado en la necesidad declarada de clarificar y comunicar el valor o encuadre del objetivo ante terceros.'
    );
  }

  // Poder 4: Poder del Escucha — cuando hay actores externos/internos, incentivos implícitos o subtexto
  if (
    profile.dependencyScope !== 'Control propio directo' ||
    profile.hiddenIncentives.trim().length > 8 ||
    Boolean(challenge.keyActorsAndIncentives?.trim())
  ) {
    addPower(
      4,
      profile.hiddenIncentives.trim()
        ? `Fundamentado en las dinámicas e incentivos implícitos descritos ("${profile.hiddenIncentives.trim().slice(0, 90)}${profile.hiddenIncentives.trim().length > 90 ? '…' : ''}").`
        : `Fundamentado en que el avance involucra a "${profile.dependencyScope || 'otros actores'}" y exige captar qué preguntas o temores se están omitiendo.`
    );
  }

  // Poder 3: Poder del Relato — cuando hay intentos previos fallidos o patrones que se repiten
  if ((challenge.previousAttempts || '').trim().length > 10) {
    addPower(
      3,
      `Fundamentado en los intentos previos declarados ("${(challenge.previousAttempts || '').trim().slice(0, 90)}${(challenge.previousAttempts || '').trim().length > 90 ? '…' : ''}"), que requieren ordenar qué funcionó y qué patrón no debe repetirse.`
    );
  }

  // Poder 6: Poder del Equilibrio — cuando hay tensión entre restricciones reales y objetivo deseado
  if (
    (profile.realConstraints.length > 0 && Boolean(challenge.expectedOutcome.trim())) ||
    /sin perder|al mismo tiempo|pero|versus|vs|equilibr|margen/.test(combinedText)
  ) {
    addPower(
      6,
      'Fundamentado en la tensión explícita entre lograr el cambio deseado y respetar las restricciones reales declaradas sin caer en un falso dilema.'
    );
  }

  // Poder 7: Poder de la Metamorfosis — cuando hay restricciones autoimpuestas o hábitos heredados que cortar
  if (profile.artificialConstraints.length > 0) {
    addPower(
      7,
      `Fundamentado en la presencia de barreras o inercias autoimpuestas (${profile.artificialConstraints.length} registrada(s)) que conviene cerrar conscientemente.`
    );
  }

  // Poder 5: Poder del Reflejo — cuando la evidencia aún es intuitiva/parcial y hay supuestos no verificados
  if (
    profile.evidenceLevel !== 'Datos verificados' &&
    profile.underlyingAssumptions.length > 0
  ) {
    addPower(
      5,
      'Fundamentado en que existen supuestos aún no verificados con datos directos, haciendo necesario separar reacción subjetiva de observación.'
    );
  }

  // Poder 2: Poder del Deseo — cuando predomina sobrecarga, postergación o urgencia inmediata bajo control propio
  if (
    challenge.category === 'Foco & Sobrecarga' ||
    (profile.dependencyScope === 'Control propio directo' &&
      profile.urgencyLevel === 'Inmediata (24–72h)')
  ) {
    addPower(
      2,
      'Fundamentado en que el desbloqueo inmediato depende de tu control directo y requiere pasar de la postergación a una primera ignición concreta hoy.'
    );
  }

  return matches.slice(0, 3);
}

export interface SingleHackRecommendation {
  recommendedHack: InteractiveHack;
  justification: string;
  groundedSignals: string[];
  linkedPower: PoderDeSherezade | null;
  alternatives: {
    hack: InteractiveHack;
    reason: string;
  }[];
}

/**
 * Recomienda UN SOLO Hack central del catálogo real `HACKS_DATA` (1..8),
 * fundamentando explícitamente por qué aplica según las respuestas de Fase 1 y Fase 2.
 */
export function recommendSingleHackForCase(
  challenge: ChallengeData,
  profile: StrategicProfileData
): SingleHackRecommendation {
  const scores: Record<number, { score: number; signals: string[] }> = {};
  HACKS_DATA.forEach((h) => {
    scores[h.id] = { score: 0, signals: [] };
  });

  const addScore = (hackId: number, pts: number, signal?: string) => {
    if (!scores[hackId]) return;
    scores[hackId].score += pts;
    if (signal && !scores[hackId].signals.includes(signal)) {
      scores[hackId].signals.push(signal);
    }
  };

  const combinedText = [
    challenge.title,
    challenge.currentSituation,
    challenge.criticalFriction,
    challenge.previousAttempts,
    challenge.constraintsSummary,
    challenge.expectedOutcome,
    profile.dominantThoughtPattern,
    profile.hiddenIncentives,
    profile.strategicHypothesis
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  // 1. Señales de actores, reglas e incentivos implícitos -> Hack 4 (Hacker Anónima)
  if (
    challenge.track === 'organizacion' ||
    profile.dependencyScope === 'Equipo o socios internos'
  ) {
    addScore(
      4,
      4,
      'El caso involucra coordinación interna o sistema organizacional donde pesan reglas implícitas y silencios.'
    );
  }
  if (profile.hiddenIncentives.trim().length > 10) {
    addScore(
      4,
      4,
      `Registraste incentivos o frenos implícitos ("${profile.hiddenIncentives.trim().slice(0, 75)}${profile.hiddenIncentives.trim().length > 75 ? '…' : ''}").`
    );
  }
  if (/permiso|aprobaci|escalar|equipo|cliente|negociaci|objeci|silencio/.test(combinedText)) {
    addScore(4, 2, 'La fricción menciona aprobaciones, negociación o silencios entre actores.');
  }

  // 2. Señales de narrativa, comunicación de valor o posicionamiento -> Hack 1 (Scheherazade)
  if (profile.dominantThoughtPattern.trim().length > 12) {
    addScore(
      1,
      3,
      `Identificaste un relato dominante que enmarca el problema ("${profile.dominantThoughtPattern.trim().slice(0, 75)}${profile.dominantThoughtPattern.trim().length > 75 ? '…' : ''}").`
    );
  }
  if (
    challenge.explorationFocus === 'Idea por validar' ||
    /oferta|vender|mensaje|propuesta|comunicar|marca|presenta|cliente/.test(combinedText)
  ) {
    addScore(
      1,
      4,
      'El objetivo requiere construir el contexto adecuado y comunicar valor claro a una audiencia específica.'
    );
  }

  // 3. Señales de intentos previos fallidos o bucles repetidos -> Hack 2 (Hermes Trismegisto)
  if ((challenge.previousAttempts || '').trim().length > 20) {
    addScore(
      2,
      3,
      'Ya realizaste intentos previos que no resolvieron la fricción y conviene reordenar el patrón en lugar de repetir más de lo mismo.'
    );
  }
  if (
    challenge.explorationFocus === 'Problema o bloqueo' &&
    /repite|meses|siempre|vez|bucle|otra vez/.test(combinedText)
  ) {
    addScore(2, 3, 'El bloqueo muestra recurrencia estructural en el tiempo.');
  }

  // 4. Señales de tensión entre dos polos opuestos -> Hack 3 (Lewis Carroll)
  if (
    (profile.realConstraints.length > 0 && Boolean(challenge.expectedOutcome.trim())) ||
    /sin perder|sin abandonar|pero|versus|vs|ambos|calidad|margen|tiempo/.test(combinedText)
  ) {
    addScore(
      3,
      3,
      'Tu objetivo exige sostener dos condiciones aparentemente opuestas al mismo tiempo (avance deseado frente a restricciones reales).'
    );
  }

  // 5. Señales de hábitos/creencias caducas o exceso de rigidez -> Hack 5 (El Trickster)
  if (profile.artificialConstraints.length >= 1) {
    addScore(
      5,
      4,
      `Detectaste ${profile.artificialConstraints.length} restricción(es) autoimpuesta(s) o inercia(s) que frenan el movimiento.`
    );
  }
  if (challenge.explorationFocus === 'Proyecto en ejecución') {
    addScore(
      5,
      2,
      'El proyecto ya está en marcha y necesita cortar una inercia específica mediante una variación controlada.'
    );
  }

  // 6. Señales de falta de evidencia verificada o sesgo subjetivo -> Hack 6 (Inteligencia Artificial)
  if (profile.evidenceLevel === 'Intuición no verificada') {
    addScore(
      6,
      5,
      'Declaraste partir de intuición aún no verificada, por lo que conviene contrastar supuestos con un espejo objetivo antes de escalar.'
    );
  } else if (
    profile.evidenceLevel === 'Señales parciales' &&
    profile.underlyingAssumptions.length >= 2
  ) {
    addScore(
      6,
      3,
      `Acumulas ${profile.underlyingAssumptions.length} supuestos sin evidencia completa verificada.`
    );
  }

  // 7. Señales de bloqueo por sobrecarga / "debería" / acción personal inmediata -> Hack 7 (Tu Yo de 8 Años)
  if (
    challenge.category === 'Foco & Sobrecarga' ||
    (profile.dependencyScope === 'Control propio directo' &&
      profile.urgencyLevel === 'Inmediata (24–72h)')
  ) {
    addScore(
      7,
      4,
      'El freno recae en tu ejecución directa e inmediata y pide reconectar con una ignición simple hoy sin sobreanálisis.'
    );
  }

  // 8. Señales de horizonte estructural / anticipación -> Hack 8 (Visión Predictiva)
  if (
    profile.urgencyLevel === 'Estructural (30–90 días)' &&
    challenge.category === 'Disrupción e Innovación'
  ) {
    addScore(
      8,
      5,
      'Abordas un frente de innovación con horizonte estructural (30–90 días), ideal para anticipar tendencias e impactos.'
    );
  }

  // Ponderación suave (+1) si el usuario aportó su resultado del test de arquetipo (como hipótesis, nunca imposición)
  if (profile.archetypeHypothesis) {
    HACKS_DATA.forEach((h) => {
      if (h.archetype === profile.archetypeHypothesis) {
        addScore(
          h.id,
          1,
          `Afinidad complementaria con la hipótesis de arquetipo "${profile.archetypeHypothesis}" (tratada solo como punto de partida revisable).`
        );
      }
    });
  }

  // Orden determinista
  const ranked = [...HACKS_DATA].sort((a, b) => {
    const diff = (scores[b.id]?.score || 0) - (scores[a.id]?.score || 0);
    if (diff !== 0) return diff;
    return a.id - b.id;
  });

  const winner = ranked[0] || HACKS_DATA[0];
  const winnerSignals = scores[winner.id]?.signals || [];
  const linkedPower = getPoderForHack(winner);

  const justification =
    winnerSignals.length > 0
      ? `Se recomienda "${winner.title}" (${winner.metodo}) como único Hack central porque en tu caso convergen estas señales: ${winnerSignals.join(' ')}`
      : `Se sugiere "${winner.title}" (${winner.metodo}) como punto de entrada para estructurar tu caso con su plantilla de tres pasos; puedes cambiarlo libremente si otro enfoque representa mejor tu fricción.`;

  const alternatives = ranked.slice(1).map((hack) => ({
    hack,
    reason:
      scores[hack.id]?.signals[0] ||
      `${hack.metodo}: útil si prefieres abordar el caso desde "${hack.plantillaMetodologica.map((p) => p.aspecto).join(' → ')}".`
  }));

  return {
    recommendedHack: winner,
    justification,
    groundedSignals: winnerSignals,
    linkedPower,
    alternatives
  };
}

export interface RecommendedHackMatch {
  hackId: number;
  reason: string;
}

export function computeRecommendedHacks(
  challenge: ChallengeData,
  profile: StrategicProfileData
): RecommendedHackMatch[] {
  const single = recommendSingleHackForCase(challenge, profile);
  return [
    { hackId: single.recommendedHack.id, reason: single.justification },
    ...single.alternatives.slice(0, 2).map((a) => ({ hackId: a.hack.id, reason: a.reason }))
  ];
}

export function calculateDiscoveryCompletion(state: DiscoveryDeliverableState): {
  percentage: number;
  completedChecks: number;
  totalChecks: number;
} {
  const activeHackId = state.selectedHackId;
  const activeHack = activeHackId ? HACKS_DATA.find((h) => h.id === activeHackId) : null;
  const activeResponses = activeHackId ? state.hackPlantillaResponses?.[activeHackId] || [] : [];
  const plantillaCompleted = Boolean(
    activeHack &&
      activeHack.plantillaMetodologica.every(
        (_, idx) => (activeResponses[idx] || '').trim().length > 0
      )
  );

  const srapCompleted = Boolean(
    state.srapOrientation?.sincronizar?.trim() &&
      state.srapOrientation?.reconocer?.trim() &&
      state.srapOrientation?.activar?.trim() &&
      state.srapOrientation?.pausa?.trim()
  );

  const checks = [
    // Fase 1: Explorar
    Boolean(state.challenge.expectedOutcome.trim()),
    Boolean(state.challenge.currentSituation.trim() || state.challenge.criticalFriction.trim()),
    Boolean((state.challenge.previousAttempts || '').trim() || (state.challenge.constraintsSummary || '').trim()),
    // Fase 2: Decodificar
    Boolean(
      state.strategicProfile.dominantThoughtPattern.trim() ||
        state.strategicProfile.strategicHypothesis.trim()
    ),
    Boolean(
      state.strategicProfile.realConstraints.length > 0 ||
        (state.strategicProfile.uncertainties?.length || 0) > 0 ||
        state.strategicProfile.underlyingAssumptions.length > 0
    ),
    // Fase 3: Aplicar un Hack
    Boolean(activeHackId),
    plantillaCompleted,
    // Fase 4: Orientar con SRAP
    srapCompleted
  ];

  const completedChecks = checks.filter(Boolean).length;
  return {
    percentage: Math.round((completedChecks / checks.length) * 100),
    completedChecks,
    totalChecks: checks.length
  };
}
