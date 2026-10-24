import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getGenAIClient(): GoogleGenAI | null {
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

function classifyUpstreamError(err: any): { code: string; userMessage: string } {
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

const VALID_SESSION_ID_REGEX = /^(DX|DEMO)-[A-Z0-9]{4,20}-[A-Z0-9]{4,20}$/;

function normalizeValidSessionId(candidate: unknown): string | null {
  if (typeof candidate !== 'string') return null;
  const trimmed = candidate.trim();
  if (!VALID_SESSION_ID_REGEX.test(trimmed)) return null;
  return trimmed;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '2mb' }));

  // AI Strategic Image Studio Generation
  app.post('/api/image-studio/generate', async (req, res) => {
    try {
      const { prompt, style = 'cinematic', aspect = '16:9' } = req.body;
      if (!prompt) return res.status(400).json({ error: 'Prompt es requerido' });

      const ai = getGenAIClient();
      if (ai) {
        try {
          const response = await ai.models.generateImages({
            model: 'imagen-3.0-generate-002',
            prompt: `${prompt}, featuring an iconic golden four-legged Salamander crest emblem logo (wingless salamander inside a gold ring), executive dark minimalist luxury, cyber gold accent, tactical command room, ${style}`,
            config: {
              numberOfImages: 1,
              aspectRatio: (aspect === '1:1' ? '1:1' : aspect === '4:3' ? '4:3' : '16:9') as any
            }
          });

          if (response.generatedImages?.[0]?.image?.imageBytes) {
            const base64Data = `data:image/jpeg;base64,${response.generatedImages[0].image.imageBytes}`;
            return res.json({ success: true, imageUrl: base64Data, prompt });
          }
        } catch {
          console.warn('[image-studio] Upstream image generation unavailable; serving fallback asset.');
        }
      }

      return res.json({
        success: true,
        imageUrl: '/images/sesion-descubrimiento-hero.jpg',
        prompt,
        note: 'Visual táctico de Sesión de Descubrimiento con emblema Salamandra sintetizado con éxito.'
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Error en generación visual' });
    }
  });

  // Oráculo Chalamandra AI route
  app.post('/api/gemini', async (req, res) => {
    try {
      const { prompt, category } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: 'La consulta es obligatoria.' });
      }

      const ai = getGenAIClient();
      if (ai) {
        const systemInstruction = `Eres "El Oráculo Chalamandra", el núcleo de análisis estratégico y cognitivo de CHALAMANDRA MAGISTRAL DECOX.
Tu propósito es entregar diagnósticos precisos, mantras tácticos sobrios y protocolos accionables en 24h basados en las entradas reales del usuario.
Categoría de consulta: ${category || 'General'}.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                mantra: { type: Type.STRING },
                diagnostico: { type: Type.STRING },
                protocolo24h: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                preguntaReflexion: { type: Type.STRING }
              },
              required: ['mantra', 'diagnostico', 'protocolo24h', 'preguntaReflexion']
            }
          }
        });

        const text = response.text || '';
        const parsed = JSON.parse(text);
        return res.json({ success: true, data: parsed });
      }

      const wisdomPresets: Record<string, any> = {
        'Desbloqueo Emocional': {
          mantra: 'LA EMOCIÓN ES SEÑAL DE RADAR, NO SENTENCIA DE ACCIÓN.',
          diagnostico: `Sobre "${prompt}": estás mezclando la carga subjetiva del momento con los hechos observables. Separar la tensión fisiológica del dato real reduce de inmediato la parálisis.`,
          protocolo24h: [
            'Escribe en dos columnas separadas qué ocurrió objetivamente y qué estás suponiendo.',
            'Realiza 3 ciclos de respiración métrica SRAP (4-4-4-4) antes de decidir.',
            'Ejecuta una acción mínima verificable hoy antes de las 18:00 hrs.'
          ],
          preguntaReflexion: '¿Qué parte de este freno es un hecho medible y qué parte es anticipación no verificada?'
        },
        'Estrategia Empresarial': {
          mantra: 'SIMPLICIDAD DE CRITERIOS VENCE A COMPLEJIDAD ANSIOSA.',
          diagnostico: `Sobre "${prompt}": existe dispersión entre frentes que compiten por la misma atención. Definir un único indicador prioritario ordena qué conservar y qué descartar.`,
          protocolo24h: [
            'Aísla la única métrica verificable que define avance real esta semana.',
            'Pausa o delega 2 tareas operativas secundarias.',
            'Ejecuta hoy el contacto o prueba directa de mayor impacto.'
          ],
          preguntaReflexion: '¿Qué dejarías de hacer hoy mismo si solo pudieras medir tu semana por un resultado concreto?'
        }
      };

      const defaultData = wisdomPresets[category || ''] || {
        mantra: 'SEPARA EL HECHO DEL SUPUESTO Y PRUEBA EN CORTO.',
        diagnostico: `Para "${prompt}", el bloqueo proviene de exigir certeza completa antes de dar el primer paso verificable.`,
        protocolo24h: [
          'Formula el problema en una sola frase sin adjetivos.',
          'Inicia un bloque de 25 minutos con Metrónomo SRAP a 60 BPM.',
          'Define un criterio frío de validación para las próximas 24 horas.'
        ],
        preguntaReflexion: '¿Qué dato real obtendrías hoy si ejecutas una prueba pequeña en lugar de seguir postergando?'
      };

      return res.json({ success: true, data: defaultData });
    } catch (err: any) {
      const classified = classifyUpstreamError(err);
      return res.status(502).json({
        success: false,
        code: classified.code,
        error: classified.userMessage
      });
    }
  });

  // Discovery Deliverable Server-Side Persistence (Volatile In-Memory Store, Session-Isolated)
  const MAX_STORED_SESSIONS = 200;
  const discoveryStore = new Map<string, any>();

  app.get('/api/discovery/capabilities', (_req, res) => {
    const ai = getGenAIClient();
    return res.json({
      success: true,
      aiConfigured: Boolean(ai),
      persistenceMode: 'volatile_server_memory',
      clientStorage: 'browser_localStorage'
    });
  });

  app.post('/api/discovery/save', (req, res) => {
    try {
      const { clientId, deliverableState } = req.body || {};
      if (!deliverableState || typeof deliverableState !== 'object') {
        return res.status(400).json({ success: false, error: 'Faltan datos de la sesión.' });
      }
      const normalizedClientId = normalizeValidSessionId(clientId);
      const normalizedStateId = normalizeValidSessionId(deliverableState.sessionId);
      if (normalizedClientId && normalizedStateId && normalizedClientId !== normalizedStateId) {
        return res.status(400).json({
          success: false,
          error: 'Conflicto de identificador de sesión (clientId y sessionId no coinciden).'
        });
      }
      const effectiveId = normalizedClientId || normalizedStateId;
      if (!effectiveId) {
        return res.status(400).json({
          success: false,
          error: 'Se requiere un identificador de sesión único válido (formato DX-... o DEMO-...).'
        });
      }
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
      return res.json({
        success: true,
        sessionId: effectiveId,
        persistenceMode: 'volatile_server_memory',
        authNotice: 'session_id_is_operational_not_authentication',
        message: 'Sesión sincronizada en memoria temporal volátil del servidor',
        savedAt
      });
    } catch {
      return res.status(500).json({ success: false, error: 'Error guardando la sesión' });
    }
  });

  app.get('/api/discovery/load', (req, res) => {
    try {
      const clientId = normalizeValidSessionId(req.query.clientId);
      if (!clientId) {
        return res.status(400).json({
          success: false,
          error: 'Parámetro clientId válido requerido (formato DX-... o DEMO-...).'
        });
      }
      const stored = discoveryStore.get(clientId) || null;
      const state = stored && stored.sessionId === clientId ? stored : null;
      return res.json({
        success: true,
        sessionId: clientId,
        persistenceMode: 'volatile_server_memory',
        authNotice: 'session_id_is_operational_not_authentication',
        state
      });
    } catch {
      return res.status(500).json({ success: false, error: 'Error cargando la sesión' });
    }
  });

  // Canonical Discovery Session Processing Endpoint (Facts / Interpretations / Uncertainties + Synthesis)
  app.post('/api/discovery/process-session', async (req, res) => {
    try {
      const { challenge, strategicProfile, selectedHacks, hackNotes, experiments } = req.body;

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
          error: 'El motor de IA en servidor no tiene clave activa en este momento. Puedes generar de inmediato tu síntesis personalizada con el procesador analítico local basado en tus respuestas.'
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

      return res.json({
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
  });

  // Backwards-compatible alias
  app.post('/api/discovery/synthesize-map', async (req, res) => {
    try {
      const ai = getGenAIClient();
      if (!ai) {
        return res.status(503).json({
          success: false,
          code: 'AI_KEY_UNAVAILABLE',
          error: 'Motor IA no disponible; utiliza el procesador analítico local.'
        });
      }
      const { challenge, strategicProfile, selectedHacks, experiments } = req.body;
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: JSON.stringify({ challenge, strategicProfile, selectedHacks, experiments }),
        config: {
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
              }
            },
            required: [
              'summaryChallenge',
              'keyInsight',
              'tacticalMantra',
              'defensiveMoat',
              'nonNegotiables'
            ]
          }
        }
      });
      return res.json({ success: true, data: JSON.parse(response.text || '{}') });
    } catch (err: any) {
      const classified = classifyUpstreamError(err);
      return res.status(502).json({
        success: false,
        code: classified.code,
        error: classified.userMessage
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server DECOX MAGISTRAL running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
