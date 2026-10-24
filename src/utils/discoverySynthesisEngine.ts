import {
  DiscoveryDeliverableState,
  StrategicMapData,
  ActionPlanWeek,
  LabExperimentItem,
  HackDeliverableSummary,
  RealWorldOptionComparison,
  LiveSessionBrief
} from '../types';
import { SEVEN_MAGISTRAL_HACKS } from './constants';
import {
  STEP1_CONDITIONAL_QUESTIONS,
  STEP2_CONDITIONAL_QUESTIONS,
  computeRecommendedHacks
} from '../data/discoveryFlowConfig';

/**
 * Motor determinista de procesamiento para la Sesión de Descubrimiento (Interactive DecoX).
 * Conecta Fase A (Mundo Simulado), Fase B (Decodificación del sistema) y Fase C (Mundo Real),
 * separando explícitamente Hechos, Hipótesis y Posibilidades imaginadas sin presentar
 * correlaciones como causalidad demostrada ni sugerir prácticas engañosas.
 */

export function deriveSynthesisFromResponses(state: DiscoveryDeliverableState): {
  strategicMap: StrategicMapData;
  recommendedPlan: ActionPlanWeek[];
} {
  const { challenge, strategicProfile, selectedHackIds, hackNotes, experiments } = state;
  const track = challenge.track || 'persona';
  const isOrg = track === 'organizacion';
  const trackLabel = isOrg ? 'Recorrido Organizaciones' : 'Recorrido Personas';

  const notedHackIds = Object.entries(hackNotes || {})
    .filter(([, text]) => Boolean(text && text.trim()))
    .map(([id]) => Number(id));

  const combinedHackIds = Array.from(new Set([...selectedHackIds, ...notedHackIds]));
  const activeHackIds =
    combinedHackIds.length > 0
      ? combinedHackIds
      : computeRecommendedHacks(challenge, strategicProfile).map((m) => m.hackId);

  const selectedHacks = SEVEN_MAGISTRAL_HACKS.filter((h) => activeHackIds.includes(h.id));
  const focusLabel =
    challenge.title.trim() || `${challenge.explorationFocus || 'Exploración'} en ${challenge.category}`;

  // 1. HECHOS OBSERVADOS Y RESTRICCIONES REALES
  const facts: string[] = [];
  if (challenge.currentSituation.trim()) {
    facts.push(
      `Hecho observado (${trackLabel} · ${challenge.explorationFocus || 'Exploración'}): ${challenge.currentSituation.trim()}`
    );
  }
  if (challenge.primaryMetric.trim()) {
    facts.push(
      `Criterio / métrica declarada: ${challenge.primaryMetric.trim()} (${challenge.timeframe || 'Plazo por confirmar'}).`
    );
  }
  if (challenge.keyActorsAndIncentives?.trim()) {
    facts.push(
      `${isOrg ? 'Mapa de actores e incentivos declarados' : 'Entorno e interlocutores clave'}: ${challenge.keyActorsAndIncentives.trim()}`
    );
  }
  strategicProfile.realConstraints.forEach((rc) => {
    if (rc.trim()) facts.push(`Restricción objetiva del Mundo Real: ${rc.trim()}`);
  });

  STEP1_CONDITIONAL_QUESTIONS.forEach((q) => {
    if (q.epistemicRole === 'fact' && q.shouldDisplay(challenge, strategicProfile)) {
      const ans = challenge.conditionalAnswers?.[q.id]?.trim();
      if (ans) facts.push(ans);
    }
  });

  if (facts.length === 0) {
    facts.push(
      `Ámbito seleccionado (${trackLabel}): ${challenge.category} con horizonte "${challenge.timeframe || 'Próximos 30 días'}". Aún faltan hechos cuantificados en el Paso 01.`
    );
  }

  // 2. HIPÓTESIS MEDIBLES Y LECTURAS DEL SISTEMA (Correlaciones != Causalidad demostrada)
  const hypotheses: string[] = [];
  if (strategicProfile.strategicHypothesis.trim()) {
    hypotheses.push(
      `Hipótesis central sujeta a verificación: ${strategicProfile.strategicHypothesis.trim()}`
    );
  }
  if (strategicProfile.dominantThoughtPattern.trim()) {
    hypotheses.push(
      `Relato / supuesto dominante a contrastar: "${strategicProfile.dominantThoughtPattern.trim()}"`
    );
  }
  strategicProfile.underlyingAssumptions.forEach((assumption) => {
    if (assumption.trim()) {
      hypotheses.push(`Supuesto tratado como hipótesis (no hecho demostrado): "${assumption.trim()}"`);
    }
  });
  if (strategicProfile.hiddenIncentives.trim()) {
    hypotheses.push(
      `Hipótesis sobre incentivos reales del sistema (Hacker · 04): ${strategicProfile.hiddenIncentives.trim()}`
    );
  }
  if (hackNotes[2]?.trim()) {
    hypotheses.push(`Patrón transferible detectado (Hermes · 02): ${hackNotes[2].trim()}`);
  }
  if (hackNotes[4]?.trim()) {
    hypotheses.push(`Punto de influencia legítimo (Hacker · 04): ${hackNotes[4].trim()}`);
  }
  if (hackNotes[6]?.trim()) {
    hypotheses.push(
      `Hipótesis medible y criterio de decisión (Datos · 06, sin asumir causalidad previa): ${hackNotes[6].trim()}`
    );
  }

  [...STEP1_CONDITIONAL_QUESTIONS, ...STEP2_CONDITIONAL_QUESTIONS].forEach((q) => {
    if (q.epistemicRole === 'interpretation' && q.shouldDisplay(challenge, strategicProfile)) {
      const ans =
        challenge.conditionalAnswers?.[q.id]?.trim() ||
        strategicProfile.conditionalProfileAnswers?.[q.id]?.trim();
      if (ans) hypotheses.push(ans);
    }
  });

  experiments.forEach((exp) => {
    if (exp.hypothesis.trim()) {
      hypotheses.push(
        `Hipótesis experimental (${exp.executionWindow}): ${exp.hypothesis.trim()} — Criterio: ${exp.successIndicator}`
      );
    }
  });

  if (hypotheses.length === 0) {
    hypotheses.push(
      isOrg
        ? 'Hipótesis base: el bloqueo proviene de reglas implícitas e incentivos defensivos entre actores más que de falta de capacidad técnica (pendiente de comprobar con una prueba controlada).'
        : 'Hipótesis base: modificar una barrera autoimpuesta y validar en formato mínimo moverá el indicador principal sin requerir más recursos (pendiente de verificación empírica).'
    );
  }

  // 3. POSIBILIDADES IMAGINADAS (Fase A · Mundo Simulado, pendientes de contraste con el Mundo Real)
  const imaginedPossibilities: string[] = [];
  if (hackNotes[1]?.trim()) {
    imaginedPossibilities.push(
      `Scheherazade (Reencuadre narrativo sin falsear hechos): ${hackNotes[1].trim()}`
    );
  }
  if (hackNotes[3]?.trim()) {
    imaginedPossibilities.push(`Carroll (Alternativa no obvia / paradoja): ${hackNotes[3].trim()}`);
  }
  if (hackNotes[7]?.trim()) {
    imaginedPossibilities.push(
      `El niño de 8 años (Posibilidad radical para poner a prueba): ${hackNotes[7].trim()}`
    );
  }
  strategicProfile.artificialConstraints.forEach((ac) => {
    if (ac.trim()) {
      imaginedPossibilities.push(
        `Escenario de Mundo Simulado sin la barrera autoimpuesta: "¿Qué se habilita si suspendemos '${ac.trim()}'?"`
      );
    }
  });

  if (imaginedPossibilities.length === 0) {
    imaginedPossibilities.push(
      isOrg
        ? `Posibilidad en Mundo Simulado: rediseñar "${focusLabel}" eliminando aprobaciones intermedias redundantes y operando con umbrales explícitos de autonomía.`
        : `Posibilidad en Mundo Simulado: poner a prueba una versión radicalmente simple de "${focusLabel}" en 48–72 horas antes de construir infraestructura completa.`
    );
  }

  // 4. INCERTIDUMBRES ABIERTAS Y VACÍOS DE DATOS
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
      `Nivel de evidencia reportado como "${strategicProfile.evidenceLevel}": las correlaciones percibidas requieren medición directa antes de tratarse como causas probadas.`
    );
  }

  if (strategicProfile.dependencyScope && strategicProfile.dependencyScope !== 'Control propio directo') {
    uncertainties.push(
      `Respuesta real de actores involucrados (${strategicProfile.dependencyScope}) ante el ajuste legítimo de reglas o condiciones.`
    );
  }

  if (uncertainties.length === 0) {
    uncertainties.push(
      'Comprobar en las próximas 48–72 horas cómo responde el indicador objetivo ante el primer experimento reversible.'
    );
  }

  // 5. COSECHA DE LOS HACKS APLICADOS (Deliverables de Fase A y Fase B)
  const hackDeliverables: HackDeliverableSummary[] = selectedHacks.map((hack) => {
    const userNote = hackNotes[hack.id]?.trim();
    let fallbackSynthesis = '';
    switch (hack.id) {
      case 1:
        fallbackSynthesis = `Reencuadrar "${focusLabel}" apoyándose estrictamente en hechos reales para comunicar su valor verdadero sin exageraciones.`;
        break;
      case 2:
        fallbackSynthesis = `Aislar la secuencia repetitiva detrás de "${challenge.criticalFriction.trim() || focusLabel}" y traducir un protocolo probado de otro sector.`;
        break;
      case 3:
        fallbackSynthesis = `Cuestionar la premisa fija del caso e integrar exigencias opuestas en una alternativa no obvia.`;
        break;
      case 4:
        fallbackSynthesis = isOrg
          ? 'Alinear reglas formales con incentivos reales de los actores mediante criterios explícitos y ventajas 100% legítimas.'
          : 'Aprovechar márgenes legítimos dentro de las reglas actuales para operar con menor fricción y acuerdos transparentes.';
        break;
      case 5:
        fallbackSynthesis =
          experiments[0]?.concreteAction ||
          'Introducir una variación pequeña y reversible durante 48h–7 días para observar rigideces y posibilidades reales.';
        break;
      case 6:
        fallbackSynthesis = `Medir "${challenge.primaryMetric.trim() || 'el indicador objetivo'}" separando suposición de observación sin confundir correlación con causalidad.`;
        break;
      case 7:
        fallbackSynthesis = `Explorar una versión sin limitaciones heredadas en el Mundo Simulado y extraer un prototipo seguro para el Mundo Real.`;
        break;
      default:
        fallbackSynthesis = hack.expectedDeliverable;
    }

    return {
      hackId: hack.id,
      hackName: hack.name,
      phaseLabel: hack.phaseLabel,
      deliverableTitle: hack.expectedDeliverable,
      content: userNote || fallbackSynthesis,
      epistemicTag: hack.epistemicRole
    };
  });

  // 6. PUNTOS CRÍTICOS DEL NODO CENTRAL
  const criticalPoints: string[] = [];
  if (challenge.criticalFriction.trim()) {
    criticalPoints.push(`Nodo crítico declarado: ${challenge.criticalFriction.trim()}`);
  }
  if (
    strategicProfile.evidenceLevel === 'Intuición no verificada' ||
    strategicProfile.evidenceLevel === 'Señales parciales'
  ) {
    criticalPoints.push(
      'Riesgo epistémico: tomar señales parciales o correlaciones como causalidad demostrada antes de correr un experimento controlado.'
    );
  }
  if (strategicProfile.artificialConstraints.length > 0) {
    criticalPoints.push(
      `Fricción autoimpuesta: ${strategicProfile.artificialConstraints.length} regla(s) asumida(s) limitan innecesariamente el margen de acción.`
    );
  }
  if (isOrg || (strategicProfile.dependencyScope && strategicProfile.dependencyScope !== 'Control propio directo')) {
    criticalPoints.push(
      `Desalineación potencial de incentivos en "${strategicProfile.dependencyScope || 'sistema de trabajo'}": sin reglas legítimas explícitas, el bloqueo tiende a repetirse.`
    );
  }

  // 7. FASE C · MUNDO REAL — COMPARATIVA DE ALTERNATIVAS, RECURSOS Y RIESGOS
  const primaryConstraint =
    strategicProfile.realConstraints[0] ||
    (isOrg ? 'Capacidad actual del equipo y margen operativo' : 'Tiempo y recursos propios actuales');

  const realWorldOptions: RealWorldOptionComparison[] = [
    {
      optionTitle: 'Opción 1 · Continuar con la inercia actual',
      originPhase: 'Línea base sin reconfiguración',
      resourcesRequired: `Mantiene el desgaste actual sobre: ${primaryConstraint}.`,
      keyRisk:
        challenge.conditionalAnswers?.problem_inaction_cost?.trim() ||
        `Persistencia de "${challenge.criticalFriction.trim() || 'la fricción central'}" sin nueva evidencia.`,
      expectedOutcome: 'Estancamiento del indicador principal y repetición del mismo patrón en 30 días.',
      recommended: false
    },
    {
      optionTitle: 'Opción 2 · Experimento controlado + Ajuste legítimo de reglas (Recomendada)',
      originPhase: 'Fase B · Decodificación → Fase C · Mundo Real',
      resourcesRequired: `Bajo costo y reversible dentro de: ${primaryConstraint}.`,
      keyRisk:
        'Riesgo acotado y reversible en 48h–7 días; exige disciplina para medir datos reales sin sesgo.',
      expectedOutcome:
        experiments[0]?.successIndicator ||
        `Evidencia verificable sobre "${challenge.primaryMetric.trim() || 'el indicador objetivo'}" antes de escalar.`,
      recommended: true
    },
    {
      optionTitle: 'Opción 3 · Prototipo acotado de posibilidad radical (Mundo Simulado)',
      originPhase: 'Fase A · Mundo Simulado (Carroll / Niño de 8 años)',
      resourcesRequired:
        '10% de recursos en un frente aislado (piloto con 1 flujo o 3 casos reales) antes de comprometer estructura.',
      keyRisk:
        'Resistencia inicial por romper convenciones habituales si no se acompaña de la narrativa de Scheherazade.',
      expectedOutcome:
        hackNotes[7]?.trim() ||
        hackNotes[3]?.trim() ||
        `Descubrir una vía asimétrica y legalmente viable hacia "${challenge.expectedOutcome.trim() || 'el resultado buscado'}".`,
      recommended: false
    }
  ];

  // 8. PRÓXIMOS PASOS DEFENDIBLES Y PUENTE A LA SESIÓN EN VIVO
  const defensibleNextStep =
    experiments[0]
      ? `Ejecutar en ${experiments[0].executionWindow} la prueba controlada "${experiments[0].concreteAction}" midiendo "${experiments[0].successIndicator}" bajo condición reversible.`
      : `Ejecutar en las próximas 48–72 horas una variación mínima y reversible sobre "${
          challenge.criticalFriction.trim() || focusLabel
        }" registrando el dato base de "${challenge.primaryMetric.trim() || 'tu indicador principal'}".`;

  const nextSteps: string[] = [defensibleNextStep];
  if (experiments[1]) {
    nextSteps.push(
      `Segunda verificación (${experiments[1].executionWindow}): ${experiments[1].concreteAction} (Criterio: ${experiments[1].successIndicator}).`
    );
  } else if (uncertainties[0]) {
    nextSteps.push(`Capturar un hecho observable para despejar la incertidumbre prioritaria: ${uncertainties[0]}`);
  }

  if (selectedHacks[0]) {
    const customNote = hackNotes[selectedHacks[0].id]?.trim();
    nextSteps.push(
      customNote
        ? `Consolidar ${selectedHacks[0].archetypeName}: ${customNote}`
        : `Aplicar ${selectedHacks[0].name} para producir: ${selectedHacks[0].expectedDeliverable}.`
    );
  }

  const liveSessionBrief: LiveSessionBrief = {
    criticalNode:
      challenge.criticalFriction.trim() ||
      `Tensión entre el estado actual y "${challenge.expectedOutcome.trim() || focusLabel}"`,
    defensibleNextStep,
    questionsForLiveSession: [
      uncertainties[0] ||
        '¿Qué variable crítica falta medir para confirmar la hipótesis principal sin asumir causalidad?',
      isOrg
        ? '¿Qué regla explícita e incentivo legítimo destraba a los actores clave sin aumentar burocracia?'
        : '¿Cómo convertir la posibilidad más potente del Mundo Simulado en un primer acuerdo o validación real esta semana?',
      '¿Qué frente secundario descartaremos durante los próximos 30 días para proteger la ejecución?'
    ],
    preparationChecklist: [
      `Llevar cuantificada la línea base de: ${challenge.primaryMetric.trim() || 'indicador objetivo'}.`,
      'Revisar la separación entre Hechos, Hipótesis y Posibilidades imaginadas de este informe.',
      experiments.length > 0
        ? `Traer las primeras señales observadas del experimento "${experiments[0].concreteAction.slice(0, 70)}...".`
        : 'Seleccionar cuál de las 3 opciones del Mundo Real pondremos a prueba primero.'
    ]
  };

  const summaryChallenge = challenge.expectedOutcome.trim()
    ? `[${trackLabel}] Resolver "${challenge.criticalFriction.trim() || focusLabel}" para lograr "${challenge.expectedOutcome.trim()}", verificado mediante: ${challenge.primaryMetric.trim() || 'indicador objetivo por confirmar'}.`
    : `[${trackLabel}] Decodificar y reconfigurar "${focusLabel}" separando hechos observados, hipótesis del sistema y posibilidades imaginadas.`;

  const keyInsight = strategicProfile.strategicHypothesis.trim()
    ? `Hipótesis rectora de reconfiguración: ${strategicProfile.strategicHypothesis.trim()}`
    : isOrg
    ? `En "${focusLabel}", el desbloqueo real exige alinear reglas declaradas con incentivos legítimos (Hacker) y validar con variaciones reversibles (Trickster) antes de reestructurar todo el sistema.`
    : `En "${focusLabel}", la tracción aparece al reencuadrar el valor real sin falsear hechos (Scheherazade) y someter el supuesto principal a una prueba pequeña y medible en el Mundo Real.`;

  const hackNamesShort = selectedHacks.map((h) => h.archetypeName).join(' · ');
  const tacticalMantra =
    challenge.explorationFocus === 'Idea por validar'
      ? 'IMAGINA SIN LÍMITES EN SIMULACIÓN; VALIDA EN PEQUEÑO CON HECHOS REALES.'
      : isOrg
      ? 'ALINEA INCENTIVOS LEGÍTIMOS Y REGLAS CLARAS EN LUGAR DE MULTIPLICAR CONTROLES.'
      : 'CAMBIA EL ENCUADRE SIN FALSEAR HECHOS Y PRUEBA CON RIESGO REVERSIBLE.';

  const defensiveMoat =
    selectedHacks.length > 0
      ? `Arquitectura combinada (${hackNamesShort}) que conecta Mundo Simulado y Decodificación del Sistema para sostener: ${
          challenge.primaryMetric.trim() || 'el criterio de éxito definido'
        }.`
      : 'Rigor metodológico: distinción estricta entre hechos, hipótesis y posibilidades con validación reversible.';

  const nonNegotiables: string[] = [
    'Ética y legalidad estricta: buscar ventajas legítimas dentro de las reglas; jamás engañar personas ni falsear hechos.',
    'Rigor epistémico: no tratar correlaciones ni intuiciones como causalidad demostrada sin verificación controlada.',
    challenge.primaryMetric.trim()
      ? `Evaluar decisiones con base en el criterio observable: ${challenge.primaryMetric.trim()}.`
      : 'Definir un umbral numérico claro antes de escalar tiempo o presupuesto.'
  ];

  const strategicMap: StrategicMapData = {
    summaryChallenge,
    keyInsight,
    prioritizedHackKeys: selectedHacks.map((h) => h.key),
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
      title: 'Semana 1: Línea Base de Hechos y Reencuadre (Fase A → Fase B)',
      focusObjective: `Ordenar hechos reales sobre "${focusLabel}", activar narrativa honesta y alinear la sesión en vivo.`,
      tasks: [
        {
          id: `w1-${Date.now()}-1`,
          label: `Registrar dato base verificable de: ${
            challenge.primaryMetric.trim() || 'tu indicador primario'
          }.`,
          completed: false,
          targetDay: 'Días 1–2',
          kpi: 'Hecho base documentado'
        },
        {
          id: `w1-${Date.now()}-2`,
          label: hackNotes[1]?.trim()
            ? `Aplicar narrativa estratégica (Scheherazade): ${hackNotes[1].trim()}`
            : strategicProfile.artificialConstraints[0]
            ? `Suspender de forma controlada la barrera autoimpuesta: "${strategicProfile.artificialConstraints[0]}".`
            : `Aislar el nodo crítico para la sesión en vivo: "${liveSessionBrief.criticalNode}".`,
          completed: false,
          targetDay: 'Días 3–5',
          kpi: 'Encuadre validado'
        }
      ]
    },
    {
      weekNumber: 2,
      title: 'Semana 2: Experimentos Controlados y Reversibles (Trickster + Datos)',
      focusObjective:
        'Contrastar hipótesis en terreno con variaciones pequeñas y reversibles sin asumir causalidad previa.',
      tasks:
        experiments.length > 0
          ? experiments.map((exp, idx) => ({
              id: `w2-${Date.now()}-${idx}`,
              label: `[${exp.hackName}] ${exp.concreteAction}`,
              completed: exp.status === 'Validado',
              targetDay: exp.executionWindow,
              kpi: exp.successIndicator
            }))
          : [
              {
                id: `w2-${Date.now()}-1`,
                label: `Ejecutar prueba reversible para despejar: "${uncertainties[0]}".`,
                completed: false,
                targetDay: 'Días 8–12',
                kpi: 'Señal observada registrada'
              }
            ]
    },
    {
      weekNumber: 3,
      title: 'Semana 3: Reconfiguración Legítima de Reglas e Incentivos (Hacker)',
      focusObjective: `Convertir lo aprendido en reglas explícitas usando ${
        hackNamesShort || 'los hacks priorizados'
      }.`,
      tasks: [
        {
          id: `w3-${Date.now()}-1`,
          label: hackNotes[4]?.trim()
            ? `Implementar punto de influencia legítimo (Hacker): ${hackNotes[4].trim()}`
            : `Establecer regla operativa explícita basada en: "${nonNegotiables[2]}".`,
          completed: false,
          targetDay: 'Días 15–18',
          kpi: 'Regla activa y transparente'
        },
        {
          id: `w3-${Date.now()}-2`,
          label: isOrg
            ? `Formalizar acuerdo de umbrales e incentivos con ${
                strategicProfile.dependencyScope?.toLowerCase() || 'los actores del sistema'
              }.`
            : 'Proteger bloques de ejecución enfocada eliminando frentes que no mueven la métrica.',
          completed: false,
          targetDay: 'Días 19–21',
          kpi: 'Acuerdo / bloque cumplido'
        }
      ]
    },
    {
      weekNumber: 4,
      title: 'Semana 4: Contraste en Mundo Real y Decisión Basada en Evidencia',
      focusObjective: `Evaluar resultados reales hacia "${
        challenge.expectedOutcome.trim() || 'el objetivo esperado'
      }" y decidir escalado o ajuste.`,
      tasks: [
        {
          id: `w4-${Date.now()}-1`,
          label: `Comparar dato final observado contra línea base en: ${
            challenge.primaryMetric.trim() || 'indicador principal'
          }.`,
          completed: false,
          targetDay: 'Días 24–28',
          kpi: 'Hipótesis confirmada o refutada'
        },
        {
          id: `w4-${Date.now()}-2`,
          label:
            'Actualizar el Informe Ejecutivo de Sesión con hechos validados y definir siguiente ciclo.',
          completed: false,
          targetDay: 'Día 30',
          kpi: 'Informe PDF actualizado'
        }
      ]
    }
  ];

  return { strategicMap, recommendedPlan };
}

export function buildDraftExperimentFromState(
  state: DiscoveryDeliverableState
): Omit<LabExperimentItem, 'id'> {
  const { challenge, strategicProfile, selectedHackIds } = state;
  const isOrg = challenge.track === 'organizacion';
  const recommended = computeRecommendedHacks(challenge, strategicProfile);
  const chosenHackId =
    selectedHackIds.find((id) => id === 5 || id === 6 || id === 4) ||
    selectedHackIds[0] ||
    recommended[0]?.hackId ||
    5;
  const hackObj =
    SEVEN_MAGISTRAL_HACKS.find((h) => h.id === chosenHackId) || SEVEN_MAGISTRAL_HACKS[4];

  const targetUncertainty =
    strategicProfile.uncertainties?.[0] ||
    strategicProfile.conditionalProfileAnswers?.evidence_gap ||
    strategicProfile.underlyingAssumptions?.[0] ||
    challenge.criticalFriction ||
    'la fricción principal';

  return {
    hackId: hackObj.id,
    hackName: `${hackObj.archetypeName} — ${hackObj.subtitle}`,
    hypothesis: `Hipótesis medible: Si introducimos una variación pequeña y reversible con "${hackObj.archetypeName}" sobre "${targetUncertainty.slice(
      0,
      100
    )}", obtendremos datos observados sin asumir causalidad previa.`,
    concreteAction: isOrg
      ? `Aplicar piloto acotado en un solo flujo o equipo orientado a "${
          challenge.expectedOutcome.trim().slice(0, 85) || 'destrabar el nodo crítico'
        }" midiendo antes y después.`
      : `Ejecutar prueba mínima reversible orientada a "${
          challenge.expectedOutcome.trim().slice(0, 85) || 'validar respuesta real'
        }" y registrar datos observados.`,
    executionWindow:
      strategicProfile.urgencyLevel === 'Inmediata (24–72h)' ? '24 Horas' : '48 Horas',
    successIndicator:
      challenge.primaryMetric.trim() || 'Dato observable registrado al cierre de la ventana',
    reversibilityNote:
      'Variación acotada y 100% reversible si no se cumple el umbral esperado.',
    status: 'Propuesto'
  };
}

export function mergeActionPlanPreservingCustomTasks(
  recommendedPlan: ActionPlanWeek[],
  existingPlan: ActionPlanWeek[]
): ActionPlanWeek[] {
  return recommendedPlan.map((recWeek) => {
    const prevWeek = existingPlan.find((w) => w.weekNumber === recWeek.weekNumber);
    const customTasks = (prevWeek?.tasks || []).filter((t) => t.isCustom);
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

  return {
    challenge: {
      ...challenge,
      track: challenge.track || 'persona',
      conditionalAnswers: activeStep1Answers
    },
    strategicProfile: {
      ...strategicProfile,
      conditionalProfileAnswers: activeStep2Answers
    }
  };
}


