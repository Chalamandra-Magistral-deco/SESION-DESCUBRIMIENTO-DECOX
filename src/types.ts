export type ActiveView =
  | 'discovery'
  | 'home'
  | 'ritual-srap'
  | 'metronome'
  | 'oraculo'
  | 'quiz'
  | 'kit-rpg'
  | 'power-lens'
  | 'codex'
  | 'dashboard'
  | 'matrix-3d'
  | 'image-studio';

// Catálogo real de Interactive DecoX: exactamente tres arquetipos
export type InteractiveArchetype = 'El Arquitecto' | 'El Alquimista' | 'El Explorador';

export type ArchetypeSourceType = 'none' | 'manual' | 'quiz';

export interface PlantillaAspecto {
  aspecto: string;
  guia: string;
}

export interface AmplificacionProfunda {
  datoOculto: string;
  miAmplificacion: string;
  ejercicios: {
    titulo: string;
    descripcion: string;
  }[];
}

export interface PoderDeSherezade {
  id: number;
  title: string;
  icon: string;
  clave: string;
  proposito: string;
  poder: string;
  ejemploDeUso: string;
  plantilla: PlantillaAspecto[];
  miniReto: string;
}

export interface InteractiveHack {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  metodo: string;
  archetype: InteractiveArchetype;
  archetypeIcon: string;
  amplificacion: string;
  ejercicio: string;
  colorClass: string;
  icon: string;
  amplificacionProfunda: AmplificacionProfunda;
  poderDeSherezadeId?: number;
  miniReto: string;
  plantillaMetodologica: PlantillaAspecto[];
}

export interface InteractiveQuizOption {
  text: string;
  archetype: InteractiveArchetype;
}

export interface InteractiveQuizQuestion {
  id: number;
  text: string;
  options: InteractiveQuizOption[];
}

export type PowerLensDomain =
  | 'Negocios'
  | 'Relaciones'
  | 'Salud'
  | 'Finanzas'
  | 'Creatividad';

export interface Archetype {
  id: InteractiveArchetype;
  name: InteractiveArchetype;
  tagline: string;
  description: string;
  strengths: string[];
  blindspots: string[];
  recommendedHack: string;
  iconName: string;
  color: string;
}

export interface ArchetypeQuestion {
  id: number;
  question: string;
  options: {
    label: string;
    archetypeId: InteractiveArchetype;
    points: number;
  }[];
}

export interface MentalHack {
  id: string;
  title: string;
  category: 'Mindset' | 'Productividad' | 'Liderazgo' | 'Resiliencia' | 'Enfoque';
  difficulty: 'Básico' | 'Intermedio' | 'Magistral';
  shortDesc: string;
  fullDescription: string;
  steps: string[];
  durationMinutes: number;
  scientificBasis: string;
  iconName: string;
}

export interface OracleResponse {
  mantra: string;
  diagnostico: string;
  protocolo24h: string[];
  preguntaReflexion: string;
}

export interface UserStats {
  xp: number;
  level: number;
  streakDays: number;
  ritualsCompleted: number;
  unlockedItemIds: string[];
  primaryArchetype: string | null;
  savedWisdom: OracleResponse[];
  dailyFocusMinutes: number;
}

export interface RPGItem {
  id: string;
  name: string;
  type: 'Artifact' | 'Grimoire' | 'Lens' | 'Potion';
  rarity: 'Común' | 'Raro' | 'Épico' | 'Legendario';
  description: string;
  effect: string;
  requiredLevel: number;
  unlocked: boolean;
  iconName: string;
}

// ==========================================
// SESIÓN DE DESCUBRIMIENTO DECOX (5 FASES)
// ==========================================

export type DiscoveryTrackType = 'persona' | 'organizacion';

export type MethodPhaseType =
  | 'mundo_simulado'
  | 'decodificacion_sistema'
  | 'mundo_real';

export type EpistemicCategoryType =
  | 'Hecho'
  | 'Hipótesis'
  | 'Posibilidad imaginada';

export type ExplorationFocusType =
  | 'Situación actual'
  | 'Idea por validar'
  | 'Problema o bloqueo'
  | 'Proyecto en ejecución';

export type EvidenceLevelType =
  | 'Datos verificados'
  | 'Señales parciales'
  | 'Intuición no verificada';

export type DependencyScopeType =
  | 'Control propio directo'
  | 'Equipo o socios internos'
  | 'Clientes, mercado o terceros';

export type UrgencyLevelType =
  | 'Inmediata (24–72h)'
  | 'Táctica (7–14 días)'
  | 'Estructural (30–90 días)';

export interface ChallengeData {
  track?: DiscoveryTrackType;
  domain?: PowerLensDomain;
  clientName: string;
  companyOrRole: string;
  explorationFocus?: ExplorationFocusType;
  title: string;
  category:
    | 'Escala de Negocio'
    | 'Liderazgo & Dirección'
    | 'Foco & Sobrecarga'
    | 'Disrupción e Innovación';
  currentSituation: string;
  criticalFriction: string;
  previousAttempts?: string;
  constraintsSummary?: string;
  expectedOutcome: string;
  primaryMetric: string;
  timeframe: string;
  keyActorsAndIncentives?: string;
  conditionalAnswers?: Record<string, string>;
}

export interface StrategicProfileData {
  archetypeHypothesis?: InteractiveArchetype | null;
  archetypeSource?: ArchetypeSourceType;
  archetypeHypothesisNotes?: string;
  evidenceLevel?: EvidenceLevelType;
  dependencyScope?: DependencyScopeType;
  urgencyLevel?: UrgencyLevelType;
  dominantThoughtPattern: string;
  underlyingAssumptions: string[];
  realConstraints: string[];
  artificialConstraints: string[];
  uncertainties?: string[];
  hiddenIncentives: string;
  strategicHypothesis: string;
  conditionalProfileAnswers?: Record<string, string>;
}

export interface PowerLensApplicationState {
  used: boolean;
  poderId: number;
  poderTitle: string;
  domain: PowerLensDomain;
  directive: string;
  source: 'ai' | 'local' | 'manual';
  generatedAt?: string;
}

export interface SrapOrientationState {
  sincronizar: string;
  reconocer: string;
  activar: string;
  pausa: string;
  immediateStep24h: string;
  nextStepAfterPause: string;
  metronomeUsedBpm?: number;
  isCustomized?: boolean;
}

export interface MagistralHackItem {
  id: number;
  key: string;
  codeNumber: string;
  archetypeName: string;
  name: string;
  subtitle: string;
  phase: 'mundo_simulado' | 'decodificacion_sistema';
  phaseLabel: string;
  epistemicRole: EpistemicCategoryType;
  expectedDeliverable: string;
  coreConcept: string;
  ethicalGuardrail?: string;
  guidingQuestions: string[];
  personaQuestions: string[];
  organizacionQuestions: string[];
  tacticalExercise: string;
  templatePrompt: string;
  personaTemplate: string;
  organizacionTemplate: string;
  applicationExample: string;
  iconName: string;
  color: string;
}

export interface LabExperimentItem {
  id: string;
  hackId: number;
  hackName: string;
  hypothesis: string;
  concreteAction: string;
  executionWindow: '24 Horas' | '48 Horas' | '7 Días';
  successIndicator: string;
  reversibilityNote?: string;
  status: 'Propuesto' | 'En Progreso' | 'Validado';
}

export interface HackDeliverableSummary {
  hackId: number;
  hackName: string;
  phaseLabel: string;
  deliverableTitle: string;
  content: string;
  epistemicTag: EpistemicCategoryType;
}

export interface RealWorldOptionComparison {
  optionTitle: string;
  originPhase: string;
  resourcesRequired: string;
  keyRisk: string;
  expectedOutcome: string;
  recommended?: boolean;
}

export interface LiveSessionBrief {
  criticalNode: string;
  defensibleNextStep: string;
  pauseCriterion?: string;
  questionsForLiveSession: string[];
  preparationChecklist: string[];
}

export interface StrategicMapData {
  summaryChallenge: string;
  keyInsight: string;
  prioritizedHackKeys: string[];
  tacticalMantra: string;
  defensiveMoat: string;
  nonNegotiables: string[];
  facts?: string[];
  interpretations?: string[];
  hypotheses?: string[];
  imaginedPossibilities?: string[];
  uncertainties?: string[];
  criticalPoints?: string[];
  nextSteps?: string[];
  pauseCriteria?: string[];
  hackDeliverables?: HackDeliverableSummary[];
  realWorldOptions?: RealWorldOptionComparison[];
  liveSessionBrief?: LiveSessionBrief;
  synthesisSource?: 'ai' | 'local' | 'manual';
  isSynthesized?: boolean;
  generatedAt: string;
}

export interface ActionPlanTask {
  id: string;
  label: string;
  completed: boolean;
  targetDay: string;
  kpi: string;
  isCustom?: boolean;
}

export interface ActionPlanWeek {
  weekNumber: number;
  title: string;
  focusObjective: string;
  tasks: ActionPlanTask[];
}

export interface DiscoveryDeliverableState {
  sessionId: string;
  isDemoCase?: boolean;
  sessionStarted?: boolean;
  sessionCompleted?: boolean;
  planNeedsSync?: boolean;
  srapNeedsSync?: boolean;
  currentModule: number; // 1 to 5 (Explorar, Decodificar, Aplicar un Hack, Orientar con SRAP, Cerrar con Ruta Inicial)
  challenge: ChallengeData;
  strategicProfile: StrategicProfileData;
  selectedHackId: number | null;
  hackPlantillaResponses: Record<number, string[]>;
  powerLens: PowerLensApplicationState;
  srapOrientation: SrapOrientationState;
  // Backwards-compatible fields preserved for custom tasks & JSON exports
  selectedHackIds: number[];
  hackNotes: Record<number, string>;
  experiments: LabExperimentItem[];
  strategicMap: StrategicMapData;
  actionPlan: ActionPlanWeek[];
  lastSavedTimestamp: string;
}
