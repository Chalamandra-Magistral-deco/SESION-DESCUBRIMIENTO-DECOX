import {
  DiscoveryDeliverableState,
  StrategicMapData,
  ActionPlanWeek,
  LabExperimentItem,
  HackDeliverableSummary,
  RealWorldOptionComparison,
  LiveSessionBrief,
  SrapOrientationState
} from '../types';
import {
  HACKS_DATA,
  getPoderForHack,
  INTERACTIVE_ARCHETYPES
} from '../data/interactiveCatalog';
import {
  STEP1_CONDITIONAL_QUESTIONS,
  STEP2_CONDITIONAL_QUESTIONS,
  recommendSingleHackForCase,
  deriveGroundedPowersForCase
} from '../data/discoveryFlowConfig';

/**
 * Motor determinista local para la Sesión de Descubrimiento DecoX (5 Fases).
 * - Fundamenta todas las orientaciones en las respuestas reales del usuario y en el catálogo de Interactive.
 * - Interpreta el arquetipo exclusivamente como hipótesis de trabajo (jamás etiqueta fija).
 * - Conecta las respuestas de `plantillaMetodologica` del Hack elegido y el Lente de Poder (si se usó)
 *   con la orientación SRAP y la Ruta Inicial del informe ejecutivo.
 */

export function formatHackPlantillaSummary(
  hackId: number | null,
  hackPlantillaResponses: Record<number, string[]>
): { aspecto: string; guia: string; respuesta: string }[] {
  if (!hackId) return [];
  const hack = HACKS_DATA.find((h) => h.id === hackId);
  if (!hack) return [];
  const raw = hackPlantillaResponses?.[hackId] || [];
  return hack.plantillaMetodologica.map((item, idx) => ({
    aspecto: item.aspecto,
    guia: item.guia,
    respuesta: (raw[idx] || '').trim()
  }));
}

export function deriveSrapFromCase(state: DiscoveryDeliverableState): SrapOrientationState {
  const { challenge, strategicProfile, selectedHackId, hackPlantillaResponses, powerLens } = state;
  const recommendation = recommendSingleHackForCase(challenge, strategicProfile);
  const effectiveHack =
    (selectedHackId ? HACKS_DATA.find((h) => h.id === selectedHackId) : null) ||
    recommendation.recommendedHack;

  const plantillaPairs = formatHackPlantillaSummary(effectiveHack.id, hackPlantillaResponses);
  const answeredPairs = plantillaPairs.filter((p) => p.respuesta.length > 0);
  const linkedPower = getPoderForHack(effectiveHack);

  // S — SINCRONIZAR: situar la acción en las condiciones reales actuales
  const constraintParts: string[] = [];
  if (challenge.constraintsSummary?.trim()) {
    constraintParts.push(challenge.constraintsSummary.trim());
  }
  strategicProfile.realConstraints.forEach((rc) => {
    if (rc.trim() && !constraintParts.includes(rc.trim())) {
      constraintParts.push(rc.trim());
    }
  });

  const baseCondition =
    challenge.currentSituation.trim() ||
    challenge.title.trim() ||
    'Situación actual pendiente de detallar en Fase 1';

  const sincronizar = [
    `Condición actual: ${baseCondition}.`,
    constraintParts.length > 0
      ? `Restricciones reales a respetar: ${constraintParts.slice(0, 2).join('; ')}.`
      : 'Sin restricciones duras declaradas aún; operar con alcance mínimo y controlado.',
    `Horizonte y nivel de evidencia: ${challenge.timeframe || 'Próximos 30 días'} (${strategicProfile.evidenceLevel || 'Señales parciales'}).`
  ].join(' ');

  // R — RECONOCER: identificar el patrón que importa
  const frictionPart =
    challenge.criticalFriction.trim() ||
    strategicProfile.dominantThoughtPattern.trim() ||
    'Fricción central pendiente de precisar';

  const attemptsPart = challenge.previousAttempts?.trim()
    ? ` Intentos previos observados: "${challenge.previousAttempts.trim()}".`
    : '';

  const archetypePart = strategicProfile.archetypeHypothesis
    ? ` Como hipótesis revisable (${strategicProfile.archetypeHypothesis}), vigilar el punto ciego: ${
        INTERACTIVE_ARCHETYPES[strategicProfile.archetypeHypothesis]?.blindspots[0]?.toLowerCase() ||
        'repetir la misma táctica sin contraste'
      }.`
    : '';

  const plantillaInsightPart =
    answeredPairs.length > 0
      ? ` Desde la plantilla de ${effectiveHack.title} (${answeredPairs[0].aspecto}): "${answeredPairs[0].respuesta}".`
      : '';

  const reconocer = `Fricción prioritaria: ${frictionPart}.${attemptsPart}${plantillaInsightPart}${archetypePart}`;

  // A — ACTIVAR: acción inmediata, concreta y proporcionada
  const thirdFieldAnswer = answeredPairs[2]?.respuesta || answeredPairs[answeredPairs.length - 1]?.respuesta;
  const lensSnippet =
    powerLens?.used && powerLens.directive.trim()
      ? ` Apoyado en Lente de Poder (${powerLens.poderTitle} · ${powerLens.domain}).`
      : linkedPower
      ? ` Asociado a ${linkedPower.title} (${linkedPower.proposito.toLowerCase()}).`
      : '';

  const activar = thirdFieldAnswer
    ? `Aplicar de forma acotada y proporcionada el cierre de tu plantilla ${effectiveHack.title} (${answeredPairs[answeredPairs.length - 1].aspecto}): "${thirdFieldAnswer}". Medir avance con: ${
        challenge.primaryMetric.trim() || 'registro directo del resultado observado'
      }.${lensSnippet}`
    : `Ejecutar una prueba pequeña y reversible aplicando "${effectiveHack.title}" (${effectiveHack.metodo}) sobre "${
        challenge.criticalFriction.trim() || challenge.expectedOutcome.trim() || 'el frente prioritario'
      }", midiendo ${challenge.primaryMetric.trim() || 'la primera respuesta observable'}.${lensSnippet}`;

  // P — PAUSA: cuándo detenerse, revisar o no continuar
  const topUncertainty =
    strategicProfile.uncertainties?.[0]?.trim() ||
    strategicProfile.conditionalProfileAnswers?.evidence_gap?.trim() ||
    challenge.conditionalAnswers?.idea_critical_risk?.trim();

  const artificialStop = strategicProfile.artificialConstraints[0]?.trim()
    ? `No retomar la inercia de "${strategicProfile.artificialConstraints[0].trim()}". `
    : '';

  const pausa = `${artificialStop}Detenerse y revisar antes de escalar recursos si al cierre de las primeras 48–72 horas no se observa señal verificable en "${
    challenge.primaryMetric.trim() || 'el criterio esperado'
  }"${
    topUncertainty
      ? `, o mientras no quede despejada la incertidumbre: "${topUncertainty}".`
      : ', o si la acción excede las restricciones reales declaradas.'
  }`;

  const immediateStep24h = thirdFieldAnswer
    ? `En las próximas 24–72 h: ejecutar "${thirdFieldAnswer}" y anotar el hecho observado.`
    : `En las próximas 24–72 h: completar los 3 campos de la plantilla de ${effectiveHack.title} y ejecutar una primera acción mínima verificable.`;

  const nextStepAfterPause = challenge.expectedOutcome.trim()
    ? `Tras revisar el punto de pausa: decidir con evidencia si consolidar la ruta hacia "${challenge.expectedOutcome.trim()}" o llevar las incógnitas abiertas a la sesión en vivo.`
    : 'Tras revisar el punto de pausa: contrastar qué funcionó realmente y ajustar el siguiente ciclo o profundizarlo en la sesión en vivo.';

  return {
    sincronizar,
    reconocer,
    activar,
    pausa,
    immediateStep24h,
    nextStepAfterPause,
    metronomeUsedBpm: state.srapOrientation?.metronomeUsedBpm,
    isCustomized: false
  };
}

export function deriveSynthesisFromResponses(state: DiscoveryDeliverableState): {
  strategicMap: StrategicMapData;
  recommendedPlan: ActionPlanWeek[];
} {
  const {
    challenge,
    strategicProfile,
    selectedHackId,
    hackPlantillaResponses,
    powerLens
  } = state;

  const track = challenge.track || 'persona';
  const isOrg = track === 'organizacion';
  const trackLabel = isOrg ? 'Recorrido Organizaciones' : 'Recorrido Personas';

  const recommendation = recommendSingleHackForCase(challenge, strategicProfile);
  const chosenHack =
    (selectedHackId ? HACKS_DATA.find((h) => h.id === selectedHackId) : null) ||
    recommendation.recommendedHack;

  const linkedPower = getPoderForHack(chosenHack);
  const plantillaItems = formatHackPlantillaSummary(chosenHack.id, hackPlantillaResponses);
  const groundedPowers = deriveGroundedPowersForCase(challenge, strategicProfile);

  const effectiveSrap: SrapOrientationState =
    state.srapOrientation?.sincronizar?.trim() &&
    state.srapOrientation?.reconocer?.trim() &&
    state.srapOrientation?.activar?.trim() &&
    state.srapOrientation?.pausa?.trim() &&
    !state.srapNeedsSync
      ? state.srapOrientation
      : deriveSrapFromCase(state);

  const focusLabel =
    challenge.title.trim() ||
    challenge.expectedOutcome.trim() ||
    `${challenge.explorationFocus || 'Caso'} en ${challenge.category}`;

  // 1. HECHOS Y RESTRICCIONES DECLARADAS (sin inventar datos)
  const facts: string[] = [];
  if (challenge.currentSituation.trim()) {
    facts.push(`Situación actual declarada: ${challenge.currentSituation.trim()}`);
  }
  if (challenge.criticalFriction.trim()) {
    facts.push(`Fricción prioritaria: ${challenge.criticalFriction.trim()}`);
  }
  if (challenge.previousAttempts?.trim()) {
    facts.push(`Intentos previos y resultado: ${challenge.previousAttempts.trim()}`);
  }
  if (challenge.constraintsSummary?.trim()) {
    facts.push(`Restricciones iniciales relevantes: ${challenge.constraintsSummary.trim()}`);
  }
  strategicProfile.realConstraints.forEach((rc) => {
    if (rc.trim()) facts.push(`Restricción real verificada: ${rc.trim()}`);
  });
  if (challenge.primaryMetric.trim()) {
    facts.push(
      `Criterio observable de avance: ${challenge.primaryMetric.trim()} (${challenge.timeframe || 'Plazo por definir'}).`
    );
  }
  STEP1_CONDITIONAL_QUESTIONS.forEach((q) => {
    if (q.epistemicRole === 'fact' && q.shouldDisplay(challenge, strategicProfile)) {
      const ans = challenge.conditionalAnswers?.[q.id]?.trim();
      if (ans) facts.push(ans);
    }
  });
  if (facts.length === 0) {
    facts.push(
      `Caso iniciado en ${trackLabel} (${challenge.domain || 'Negocios'}). Aún faltan hechos observables detallados en la Fase 1.`
    );
  }

  // 2. HIPÓTESIS DE TRABAJO (incluyendo arquetipo como hipótesis si existe)
  const hypotheses: string[] = [];
  if (strategicProfile.strategicHypothesis.trim()) {
    hypotheses.push(`Hipótesis central de trabajo: ${strategicProfile.strategicHypothesis.trim()}`);
  }
  if (strategicProfile.archetypeHypothesis) {
    const sourceLabel =
      strategicProfile.archetypeSource === 'quiz'
        ? 'obtenido en test de 10 preguntas'
        : 'indicado voluntariamente';
    hypotheses.push(
      `Hipótesis de arquetipo Interactive (${strategicProfile.archetypeHypothesis}, ${sourceLabel} — hipótesis revisable, no diagnóstico definitivo): ${
        strategicProfile.archetypeHypothesisNotes?.trim() ||
        INTERACTIVE_ARCHETYPES[strategicProfile.archetypeHypothesis]?.tagline ||
        ''
      }`
    );
  }
  if (strategicProfile.dominantThoughtPattern.trim()) {
    hypotheses.push(
      `Patrón o relato actual a contrastar: "${strategicProfile.dominantThoughtPattern.trim()}"`
    );
  }
  if (strategicProfile.hiddenIncentives.trim()) {
    hypotheses.push(
      `Lectura sobre incentivos o subtexto del entorno: ${strategicProfile.hiddenIncentives.trim()}`
    );
  }
  strategicProfile.underlyingAssumptions.forEach((a) => {
    if (a.trim()) hypotheses.push(`Supuesto pendiente de contraste: "${a.trim()}"`);
  });
  if (groundedPowers.length > 0) {
    groundedPowers.forEach((gp) => {
      hypotheses.push(`Relación fundamentada con ${gp.poder.title}: ${gp.foundation}`);
    });
  }
  if (hypotheses.length === 0) {
    hypotheses.push(
      'Hipótesis preliminar pendiente de formular explícitamente en la Fase 2 (Decodificar).'
    );
  }

  // 3. APLICACIÓN DE HERRAMIENTAS DE INTERACTIVE (Hack + Plantilla + Lente opcional)
  const imaginedPossibilities: string[] = [];
  plantillaItems.forEach((item) => {
    if (item.respuesta) {
      imaginedPossibilities.push(
        `[${chosenHack.title} · ${item.aspecto}]: ${item.respuesta}`
      );
    }
  });
  if (powerLens?.used && powerLens.directive.trim()) {
    imaginedPossibilities.push(
      `Lente de Poder aplicado (${powerLens.poderTitle} en ${powerLens.domain}): ${powerLens.directive.trim()}`
    );
  }
  if (imaginedPossibilities.length === 0) {
    imaginedPossibilities.push(
      `Hack seleccionado: ${chosenHack.title} (${chosenHack.metodo}). Completa los 3 campos de su plantilla metodológica en la Fase 3 para registrar tu aplicación concreta.`
    );
  }

  // 4. INCERTIDUMBRES ABIERTAS
  const uncertainties: string[] = [];
  (strategicProfile.uncertainties || []).forEach((u) => {
    if (u.trim()) uncertainties.push(u.trim());
  });
  [...STEP1_CONDITIONAL_QUESTIONS, ...STEP2_CONDITIONAL_QUESTIONS].forEach((q) => {
    if (q.epistemicRole === 'uncertainty' && q.shouldDisplay(challenge, strategicProfile)) {
      const ans =
        challenge.conditionalAnswers?.[q.id]?.trim() ||
        strategicProfile.conditionalProfileAnswers?.[q.id]?.trim();
      if (ans) uncertainties.push(ans);
    }
  });
  if (strategicProfile.evidenceLevel && strategicProfile.evidenceLevel !== 'Datos verificados') {
    uncertainties.push(
      `Nivel de evidencia actual ("${strategicProfile.evidenceLevel}"): requiere verificación práctica antes de asumir conclusiones definitivas.`
    );
  }
  if (uncertainties.length === 0) {
    uncertainties.push(
      'Verificar la respuesta real del entorno al ejecutar la acción inmediata definida en SRAP.'
    );
  }

  // 5. RESUMEN DEL HACK CENTRAL SELECCIONADO
  const filledPlantillaText = plantillaItems
    .filter((p) => p.respuesta)
    .map((p) => `${p.aspecto}: ${p.respuesta}`)
    .join(' | ');

  const hackDeliverables: HackDeliverableSummary[] = [
    {
      hackId: chosenHack.id,
      hackName: `${chosenHack.title} (${chosenHack.metodo})`,
      phaseLabel: linkedPower
        ? `Poder asociado: ${linkedPower.title}`
        : 'Sin poderDeSherezadeId asignado en catálogo',
      deliverableTitle: chosenHack.subtitle,
      content:
        filledPlantillaText ||
        'Plantilla metodológica pendiente de completar por el participante en la Fase 3.',
      epistemicTag: 'Hipótesis'
    }
  ];

  // 6. ORIENTACIÓN SRAP Y RUTA INICIAL
  const nextSteps: string[] = [
    `Acción inmediata (SRAP · Activar): ${effectiveSrap.activar}`,
    `Paso concreto en 24–72 h: ${effectiveSrap.immediateStep24h}`,
    `Siguiente paso tras revisión: ${effectiveSrap.nextStepAfterPause}`
  ];

  const pauseCriteria: string[] = [effectiveSrap.pausa];

  const criticalPoints: string[] = [
    `Sincronización real: ${effectiveSrap.sincronizar}`,
    `Patrón reconocido: ${effectiveSrap.reconocer}`
  ];

  const primaryConstraint =
    challenge.constraintsSummary?.trim() ||
    strategicProfile.realConstraints[0] ||
    'Tiempo y capacidad disponibles actualmente';

  const realWorldOptions: RealWorldOptionComparison[] = [
    {
      optionTitle: 'Continuar con el enfoque previo sin cambios',
      originPhase: 'Inercia previa observada',
      resourcesRequired: `Consume recursos actuales sobre: ${primaryConstraint}.`,
      keyRisk:
        challenge.previousAttempts?.trim()
          ? `Repetir el mismo resultado de intentos previos ("${challenge.previousAttempts.trim().slice(0, 80)}…").`
          : `Mantener activa la fricción "${challenge.criticalFriction.trim() || focusLabel}".`,
      expectedOutcome: 'Sin evidencia nueva para destrabar el objetivo deseado.',
      recommended: false
    },
    {
      optionTitle: `Ruta Inicial con ${chosenHack.title} + Protocolo SRAP (Recomendada)`,
      originPhase: `Fase 3 (${chosenHack.title}) → Fase 4 (SRAP)`,
      resourcesRequired: `Acción proporcionada dentro de: ${primaryConstraint}.`,
      keyRisk: `Acotado mediante el criterio explícito de pausa: ${effectiveSrap.pausa.slice(0, 95)}…`,
      expectedOutcome:
        challenge.expectedOutcome.trim() ||
        'Obtener una señal verificable que valide o corrija la hipótesis de trabajo.',
      recommended: true
    }
  ];

  const liveSessionBrief: LiveSessionBrief = {
    criticalNode:
      challenge.criticalFriction.trim() ||
      `Fricción principal hacia "${challenge.expectedOutcome.trim() || focusLabel}"`,
    defensibleNextStep: effectiveSrap.immediateStep24h,
    pauseCriterion: effectiveSrap.pausa,
    questionsForLiveSession: [
      uncertainties[0] || '¿Qué evidencia real arrojó la primera acción activada con SRAP?',
      `¿Cómo profundizar la plantilla de "${chosenHack.title}" a partir de la respuesta observada?`,
      '¿Qué restricción o acuerdo clave debe ajustarse antes de dar el siguiente paso?'
    ],
    preparationChecklist: [
      `Traer completados los 3 campos de la plantilla de ${chosenHack.title}.`,
      `Registrar qué ocurrió al ejecutar: "${effectiveSrap.immediateStep24h.slice(0, 80)}".`,
      `Verificar si se activó o no el criterio de pausa definido en SRAP.`
    ]
  };

  const summaryChallenge = challenge.expectedOutcome.trim()
    ? `[${trackLabel} · ${challenge.domain || 'Negocios'}] Superar "${
        challenge.criticalFriction.trim() || focusLabel
      }" para alcanzar "${challenge.expectedOutcome.trim()}", medido mediante: ${
        challenge.primaryMetric.trim() || 'criterio observable por precisar'
      }.`
    : `[${trackLabel}] Exploración y decodificación de "${focusLabel}" aplicando ${chosenHack.title} y orientación SRAP.`;

  const keyInsight = strategicProfile.strategicHypothesis.trim()
    ? strategicProfile.strategicHypothesis.trim()
    : `Al aplicar "${chosenHack.title}" (${chosenHack.metodo}) y aterrizarlo con SRAP, el caso pasa de repetir intentos previos a ejecutar una acción proporcionada con criterio explícito de pausa.`;

  const tacticalMantra = effectiveSrap.immediateStep24h;

  const defensiveMoat = linkedPower
    ? `Aplicación focalizada de 1 Hack central (${chosenHack.title} ↔ ${linkedPower.title}) calibrada con SRAP sobre restricciones reales.`
    : `Aplicación focalizada de 1 Hack central (${chosenHack.title}) calibrada con SRAP sobre restricciones reales.`;

  const nonNegotiables: string[] = [
    `Respetar las condiciones reales sincronizadas: ${primaryConstraint}.`,
    `Criterio de pausa obligatorio (SRAP): ${effectiveSrap.pausa}`,
    'Tratar hipótesis y arquetipos como lecturas sujetas a evidencia, nunca como conclusiones cerradas sin datos.'
  ];

  const strategicMap: StrategicMapData = {
    summaryChallenge,
    keyInsight,
    prioritizedHackKeys: [chosenHack.title.toLowerCase().replace(/\s+/g, '-')],
    tacticalMantra,
    defensiveMoat,
    nonNegotiables,
    facts,
    interpretations: hypotheses,
    hypotheses,
    imaginedPossibilities,
    uncertainties,
    criticalPoints,
    nextSteps,
    pauseCriteria,
    hackDeliverables,
    realWorldOptions,
    liveSessionBrief,
    synthesisSource: 'local',
    isSynthesized: true,
    generatedAt: new Date().toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  };

  const recommendedPlan: ActionPlanWeek[] = [
    {
      weekNumber: 1,
      title: '1. Acción Inmediata (SRAP · Activar · 24–72 h)',
      focusObjective: 'Ejecutar el primer movimiento concreto y proporcionado derivado del Hack aplicado.',
      tasks: [
        {
          id: `r1-${Date.now()}-1`,
          label: effectiveSrap.immediateStep24h,
          completed: false,
          targetDay: '24–72 h',
          kpi: challenge.primaryMetric.trim() || 'Acción ejecutada y observada'
        },
        ...(plantillaItems[0]?.respuesta
          ? [
              {
                id: `r1-${Date.now()}-2`,
                label: `Sostener encuadre de ${chosenHack.title} (${plantillaItems[0].aspecto}): ${plantillaItems[0].respuesta}`,
                completed: false,
                targetDay: 'Durante la prueba',
                kpi: 'Aplicación fiel de la plantilla'
              }
            ]
          : [])
      ]
    },
    {
      weekNumber: 2,
      title: '2. Revisión y Criterio de Pausa (SRAP · Pausa · Días 4–10)',
      focusObjective: 'Evaluar datos reales frente a las incertidumbres y detener o corregir si se activa la condición de pausa.',
      tasks: [
        {
          id: `r2-${Date.now()}-1`,
          label: `Evaluar criterio de pausa: ${effectiveSrap.pausa}`,
          completed: false,
          targetDay: 'Día 4–7',
          kpi: 'Revisión objetiva completada'
        },
        {
          id: `r2-${Date.now()}-2`,
          label: `Contrastar incertidumbre prioritaria: ${uncertainties[0]}`,
          completed: false,
          targetDay: 'Día 7–10',
          kpi: 'Evidencia registrada'
        }
      ]
    },
    {
      weekNumber: 3,
      title: '3. Siguiente Paso de la Ruta Inicial (Días 11–30)',
      focusObjective: 'Consolidar lo validado o llevar los hallazgos concretos a la sesión de trabajo en vivo.',
      tasks: [
        {
          id: `r3-${Date.now()}-1`,
          label: effectiveSrap.nextStepAfterPause,
          completed: false,
          targetDay: 'Días 11–30',
          kpi: challenge.expectedOutcome.trim() || 'Siguiente tramo decidido con evidencia'
        }
      ]
    }
  ];

  return { strategicMap, recommendedPlan };
}

export function buildDraftExperimentFromState(
  state: DiscoveryDeliverableState
): Omit<LabExperimentItem, 'id'> {
  const srap = deriveSrapFromCase(state);
  const chosenHack =
    (state.selectedHackId ? HACKS_DATA.find((h) => h.id === state.selectedHackId) : null) ||
    HACKS_DATA[0];

  return {
    hackId: chosenHack.id,
    hackName: `${chosenHack.title} — ${chosenHack.metodo}`,
    hypothesis:
      state.strategicProfile.strategicHypothesis.trim() ||
      `Hipótesis de trabajo aplicada con ${chosenHack.title}`,
    concreteAction: srap.immediateStep24h,
    executionWindow: '48 Horas',
    successIndicator:
      state.challenge.primaryMetric.trim() || 'Evidencia observable registrada',
    reversibilityNote: srap.pausa,
    status: 'Propuesto'
  };
}

export function mergeActionPlanPreservingCustomTasks(
  recommendedPlan: ActionPlanWeek[],
  existingPlan: ActionPlanWeek[]
): ActionPlanWeek[] {
  // Recolectar todas las tareas personalizadas existentes por número de tramo; si estaban en semana 4 (legado), conservarlas en el último tramo
  const allExistingCustomByWeek = new Map<number, ActionPlanWeek['tasks']>();
  const maxRecWeek = recommendedPlan.length;

  (existingPlan || []).forEach((prevWeek) => {
    const customTasks = (prevWeek.tasks || []).filter((t) => t.isCustom);
    if (customTasks.length === 0) return;
    const targetBucket = Math.min(Math.max(1, prevWeek.weekNumber), maxRecWeek);
    const current = allExistingCustomByWeek.get(targetBucket) || [];
    allExistingCustomByWeek.set(targetBucket, [...current, ...customTasks]);
  });

  return recommendedPlan.map((recWeek) => {
    const customTasks = allExistingCustomByWeek.get(recWeek.weekNumber) || [];
    return {
      ...recWeek,
      tasks: [...recWeek.tasks, ...customTasks]
    };
  });
}

export function sanitizeActivePayloadForProcessing(state: DiscoveryDeliverableState) {
  const { challenge, strategicProfile } = state;

  const activeStep1Answers: Record<string, string> = {};
  STEP1_CONDITIONAL_QUESTIONS.forEach((q) => {
    if (q.shouldDisplay(challenge, strategicProfile)) {
      const val = challenge.conditionalAnswers?.[q.id]?.trim();
      if (val) activeStep1Answers[q.id] = val;
    }
  });

  const activeStep2Answers: Record<string, string> = {};
  STEP2_CONDITIONAL_QUESTIONS.forEach((q) => {
    if (q.shouldDisplay(challenge, strategicProfile)) {
      const val = strategicProfile.conditionalProfileAnswers?.[q.id]?.trim();
      if (val) activeStep2Answers[q.id] = val;
    }
  });

  const chosenHack = state.selectedHackId
    ? HACKS_DATA.find((h) => h.id === state.selectedHackId) || null
    : null;
  const linkedPower = chosenHack ? getPoderForHack(chosenHack) : null;
  const plantillaAnswered = formatHackPlantillaSummary(
    state.selectedHackId,
    state.hackPlantillaResponses
  );

  return {
    challenge: {
      ...challenge,
      track: challenge.track || 'persona',
      conditionalAnswers: activeStep1Answers
    },
    strategicProfile: {
      ...strategicProfile,
      conditionalProfileAnswers: activeStep2Answers
    },
    selectedHack: chosenHack
      ? {
          id: chosenHack.id,
          title: chosenHack.title,
          metodo: chosenHack.metodo,
          linkedPower: linkedPower ? linkedPower.title : null,
          plantillaResponses: plantillaAnswered
        }
      : null,
    powerLens: state.powerLens?.used ? state.powerLens : null,
    srapOrientation: state.srapOrientation
  };
}
