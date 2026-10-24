import { GoogleGenAI } from '@google/genai';

export function getGenAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

export function classifyUpstreamError(err: any): { code: string; userMessage: string } {
  const raw = typeof err?.message === 'string' ? err.message.trim() : '';
  if (raw.includes('ACCOUNT_STATE_INVALID') || raw.includes('bound service account')) {
    return {
      code: 'AI_SERVICE_ACCOUNT_INACTIVE',
      userMessage:
        'El motor externo de IA no está disponible porque la credencial del entorno tiene su cuenta de servicio asociada inactiva (401 UNAUTHENTICATED). Tu síntesis personalizada sigue operativa al 100% mediante el Motor Analítico Local basado directamente en tus respuestas.'
    };
  }
  if (
    raw.includes('API_KEY_INVALID') ||
    raw.includes('UNAUTHENTICATED') ||
    err?.status === 401
  ) {
    return {
      code: 'AI_AUTH_UNAVAILABLE',
      userMessage:
        'El motor externo de IA rechazó la autenticación del entorno (401 UNAUTHENTICATED). Puedes continuar sin interrupción utilizando el Motor Analítico Local sobre tus respuestas reales.'
    };
  }
  if (raw.startsWith('{') || raw.includes('generativelanguage.googleapis.com')) {
    return {
      code: 'AI_UPSTREAM_UNAVAILABLE',
      userMessage:
        'El servicio externo de IA no está disponible temporalmente. Puedes reintentar o utilizar de inmediato el Motor Analítico Local con tus respuestas.'
    };
  }
  return {
    code: 'AI_REQUEST_FAILED',
    userMessage:
      raw ||
      'No fue posible completar el procesamiento externo en este intento. Utiliza el Motor Analítico Local.'
  };
}

export const VALID_SESSION_ID_REGEX = /^(DX|DEMO)-[A-Z0-9]{4,20}-[A-Z0-9]{4,20}$/;

export function normalizeValidSessionId(candidate: unknown): string | null {
  if (typeof candidate !== 'string') return null;
  const trimmed = candidate.trim();
  if (!VALID_SESSION_ID_REGEX.test(trimmed)) return null;
  return trimmed;
}

const MAX_STORED_SESSIONS = 200;
const globalRef = globalThis as unknown as { __decoxDiscoveryStore?: Map<string, any> };
if (!globalRef.__decoxDiscoveryStore) {
  globalRef.__decoxDiscoveryStore = new Map<string, any>();
}

export const discoveryStore: Map<string, any> = globalRef.__decoxDiscoveryStore;

export function saveSessionInVolatileStore(effectiveId: string, deliverableState: Record<string, any>): string {
  if (!discoveryStore.has(effectiveId) && discoveryStore.size >= MAX_STORED_SESSIONS) {
    const oldestKey = discoveryStore.keys().next().value;
    if (oldestKey) discoveryStore.delete(oldestKey);
  }
  const savedAt = new Date().toISOString();
  discoveryStore.set(effectiveId, {
    ...deliverableState,
    sessionId: effectiveId,
    serverSavedAt: savedAt
  });
  return savedAt;
}
