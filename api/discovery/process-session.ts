import { Type } from '@google/genai';
import { getGenAIClient, classifyUpstreamError } from '../_shared.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Método no permitido' });
  }
  try {
    const { challenge, strategicProfile, selectedHacks, hackNotes, experiments } = req.body || {};

    if (
      !challenge ||
      (!challenge.title?.trim() &&
        !challenge.currentSituation?.trim() &&
        !challenge.criticalFriction?.trim())
    ) {
      return res.status(400).json({
        success: false,
        error: 'Completa al menos la descripción de tu situación o fricción en el Paso 01 antes de procesar.'
      });
    }

    const ai = getGenAIClient();
    if (!ai) {
      return res.status(503).json({
        success: false,
        code: 'AI_KEY_UNAVAILABLE',
        error:
          'El motor de IA en servidor no tiene clave activa en este momento. Puedes generar de inmediato tu síntesis personalizada con el procesador analítico local basado en tus respuestas.'
      });
    }

    const trackLabel = challenge.track === 'organizacion' ? 'Organizaciones' : 'Personas';
    const systemInstruction = `Eres el motor metodológico de CHALAMANDRA MAGISTRAL · INTERACTIVE DECOX para la Sesión de Descubrimiento (Recorrido: ${trackLabel}).
Analiza rigurosamente las respuestas reales del usuario integrando los 7 hacks originales de Chalamandra (01. Scheherazade, 02. Hermes, 03. Carroll, 04. Hacker, 05. Trickster, 06. Inteligencia basada en datos y correlaciones, 07. El niño de 8 años) en tres fases (Mundo Simulado, Decodificación del sistema y Mundo Real).
REGLAS ESTRICTAS EPISTÉMICAS Y ÉTICAS:
1. Deriva cada punto exclusivamente de la información proporcionada; no inventes métricas ni hagas promesas infundadas.
2. Separa con rigor:
   - "facts": hechos observables y restricciones reales declaradas.
   - "hypotheses" (y "interpretations" equivalente): hipótesis medibles, lecturas del sistema y correlaciones a verificar. NUNCA presentes una correlación como causalidad probada.
   - "imaginedPossibilities": posibilidades imaginadas, narrativas alternativas o futuros pre-lógicos generados en el Mundo Simulado.
   - "uncertainties": incógnitas abiertas y datos aún no observados.
3. REGLA ÉTICA OBLIGATORIA: "Hackear el sistema" (04. Hacker) significa encontrar ventajas legítimas y transparentes dentro de las reglas existentes, nunca engañar personas ni usar prácticas ilegales.
4. En Fase C (Mundo Real), contrasta alternativas en "realWorldOptions" frente a recursos, riesgos y resultado esperado, y construye "liveSessionBrief" para preparar la sesión en vivo y definir un siguiente paso defendible en 24-72h.`;

    const userPayload = JSON.stringify(
      {
        challenge,
        strategicProfile,
        selectedHacks,
        hackNotes,
        experiments
      },
      null,
      2
    );

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Respuestas registradas en la Sesión de Descubrimiento:\n${userPayload}`,
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
            interpretations: {
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
            },
            realWorldOptions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  optionTitle: { type: Type.STRING },
                  originPhase: { type: Type.STRING },
                  resourcesRequired: { type: Type.STRING },
                  keyRisk: { type: Type.STRING },
                  expectedOutcome: { type: Type.STRING },
                  recommended: { type: Type.BOOLEAN }
                },
                required: [
                  'optionTitle',
                  'originPhase',
                  'resourcesRequired',
                  'keyRisk',
                  'expectedOutcome'
                ]
              }
            },
            liveSessionBrief: {
              type: Type.OBJECT,
              properties: {
                criticalNode: { type: Type.STRING },
                defensibleNextStep: { type: Type.STRING },
                questionsForLiveSession: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                preparationChecklist: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: [
                'criticalNode',
                'defensibleNextStep',
                'questionsForLiveSession',
                'preparationChecklist'
              ]
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
            'interpretations',
            'imaginedPossibilities',
            'uncertainties',
            'criticalPoints',
            'nextSteps',
            'realWorldOptions',
            'liveSessionBrief'
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
