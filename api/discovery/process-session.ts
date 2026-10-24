import { Type } from '@google/genai';
import { getGenAIClient, classifyUpstreamError } from '../_shared.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Método no permitido' });
  }
  try {
    const {
      challenge,
      strategicProfile,
      selectedHack,
      powerLens,
      srapOrientation
    } = req.body || {};

    if (
      !challenge ||
      (!challenge.title?.trim() &&
        !challenge.currentSituation?.trim() &&
        !challenge.criticalFriction?.trim() &&
        !challenge.expectedOutcome?.trim())
    ) {
      return res.status(400).json({
        success: false,
        error:
          'Completa al menos el objetivo o la fricción actual en la Fase 1 (Explorar) antes de procesar.'
      });
    }

    const ai = getGenAIClient();
    if (!ai) {
      return res.status(503).json({
        success: false,
        code: 'AI_KEY_UNAVAILABLE',
        error:
          'El motor de IA en servidor no tiene clave activa en este momento. Tu Ruta Inicial está generada con el Motor Analítico Local basado directamente en tus respuestas.'
      });
    }

    const trackLabel = challenge.track === 'organizacion' ? 'Organizaciones' : 'Personas';
    const systemInstruction = `Eres el motor metodológico de CHALAMANDRA MAGISTRAL · INTERACTIVE DECOX para la Sesión de Descubrimiento de 5 fases (Recorrido: ${trackLabel}).
REGLAS ESTRICTAS:
1. Fundamenta cada salida exclusivamente en las respuestas reales del usuario (Fase 1 Explorar, Fase 2 Decodificar, Fase 3 Hack único + plantillaMetodologica + Lente de Poder opcional, Fase 4 Orientación SRAP).
2. Si existe un arquetipo en strategicProfile.archetypeHypothesis, trátalo SIEMPRE como hipótesis de trabajo revisable, nunca como diagnóstico definitivo ni etiqueta fija.
3. No inventes métricas ni hagas promesas grandilocuentes; mantén lenguaje sobrio, ejecutivo y verificable.`;

    const userPayload = JSON.stringify(
      {
        challenge,
        strategicProfile,
        selectedHack,
        powerLens,
        srapOrientation
      },
      null,
      2
    );

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Respuestas registradas en las 5 fases de la Sesión de Descubrimiento:\n${userPayload}`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summaryChallenge: { type: Type.STRING },
            keyInsight: { type: Type.STRING },
            tacticalMantra: { type: Type.STRING },
            defensiveMoat: { type: Type.STRING },
            nonNegotiables: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            facts: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            hypotheses: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            imaginedPossibilities: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            uncertainties: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            criticalPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            nextSteps: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: [
            'summaryChallenge',
            'keyInsight',
            'tacticalMantra',
            'defensiveMoat',
            'nonNegotiables',
            'facts',
            'hypotheses',
            'imaginedPossibilities',
            'uncertainties',
            'criticalPoints',
            'nextSteps'
          ]
        }
      }
    });

    const text = response.text || '';
    const parsed = JSON.parse(text);

    return res.status(200).json({
      success: true,
      source: 'ai',
      data: parsed
    });
  } catch (err: any) {
    const classified = classifyUpstreamError(err);
    const statusHint = err?.status || err?.code || 'UPSTREAM_ERR';
    console.error(`[discovery/process-session] Processing failed (${statusHint}:${classified.code})`);
    return res.status(502).json({
      success: false,
      code: classified.code,
      fallbackEngine: 'local_analytical_engine',
      error: classified.userMessage
    });
  }
}
