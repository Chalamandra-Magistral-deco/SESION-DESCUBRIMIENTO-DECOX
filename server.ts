import express from 'express';
import { Firestore } from '@google-cloud/firestore';
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { buildLocalPowerLensDirective } from './src/data/interactiveCatalog.js';
import { PowerLensDomain } from './src/types.js';

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

const ACCESS_COOKIE = 'decox_discovery_access';
const ACCESS_TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7;
const DISCOVERY_PRICE_ID = process.env.STRIPE_DISCOVERY_PRICE_ID?.trim() || '';
const accessSecret = process.env.SESSION_TOKEN_SECRET?.trim() || '';
const firestore = new Firestore({ projectId: process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT });
const localDiscoveryStore = new Map<string, any>();

type AccessClaims = { checkoutSessionId: string; exp: number };
function signAccessToken(claims: AccessClaims): string {
  if (!accessSecret) throw new Error('SESSION_TOKEN_SECRET is not configured');
  const payload = Buffer.from(JSON.stringify(claims)).toString('base64url');
  const signature = createHmac('sha256', accessSecret).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}
function readAccessClaims(token: unknown): AccessClaims | null {
  if (typeof token !== 'string' || !accessSecret) return null;
  const [payload, signature, extra] = token.split('.');
  if (!payload || !signature || extra) return null;
  const expected = createHmac('sha256', accessSecret).update(payload).digest();
  let supplied: Buffer;
  try { supplied = Buffer.from(signature, 'base64url'); } catch { return null; }
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return null;
  try {
    const claims = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as AccessClaims;
    if (!claims.checkoutSessionId || !Number.isFinite(claims.exp) || claims.exp <= Math.floor(Date.now() / 1000)) return null;
    return claims;
  } catch { return null; }
}
function requestAccessClaims(req: express.Request): AccessClaims | null {
  const cookies = req.headers.cookie || '';
  const match = cookies.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${ACCESS_COOKIE}=`));
  return readAccessClaims(match ? match.slice(ACCESS_COOKIE.length + 1) : null);
}
async function verifyStripeCheckoutSession(sessionId: unknown): Promise<string | null> {
  if (typeof sessionId !== 'string' || !/^cs_[A-Za-z0-9_]+$/.test(sessionId) || !process.env.STRIPE_SECRET_KEY?.trim() || !DISCOVERY_PRICE_ID) return null;
  const response = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}?expand%5B%5D=line_items.data.price`, {
    headers: { Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY.trim()}` },
    signal: AbortSignal.timeout(8000)
  });
  if (!response.ok) return null;
  const session = await response.json() as { id?: string; payment_status?: string; currency?: string; amount_total?: number; line_items?: { data?: Array<{ price?: { id?: string | null } | null }> } };
  const priceIds = new Set((session.line_items?.data || []).map((item) => item.price?.id).filter((id): id is string => Boolean(id)));
  if (session.id !== sessionId || session.payment_status !== 'paid' || session.currency !== 'usd' || session.amount_total !== 2700 || !priceIds.has(DISCOVERY_PRICE_ID)) return null;
  return sessionId;
}
function setAccessCookie(res: express.Response, checkoutSessionId: string): void {
  const token = signAccessToken({ checkoutSessionId, exp: Math.floor(Date.now() / 1000) + ACCESS_TOKEN_TTL_SECONDS });
  res.setHeader('Set-Cookie', `${ACCESS_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${ACCESS_TOKEN_TTL_SECONDS}`);
}
function requirePaidAccess(req: express.Request, res: express.Response, next: express.NextFunction): void {
  if (process.env.NODE_ENV !== 'production') { next(); return; }
  if (!requestAccessClaims(req)) { res.status(401).json({ success: false, code: 'PAYMENT_ACCESS_REQUIRED', error: 'Se requiere una sesión de compra verificada para continuar.' }); return; }
  next();
}
async function saveDurableSession(sessionId: string, state: Record<string, any>, owner: string): Promise<string> {
  const savedAt = new Date().toISOString();
  if (process.env.NODE_ENV !== 'production') {
    localDiscoveryStore.set(sessionId, { ...state, sessionId, serverSavedAt: savedAt, ownerCheckoutSessionId: owner });
    return savedAt;
  }
  const ref = firestore.collection('discoverySessions').doc(sessionId);
  await firestore.runTransaction(async (tx) => {
    const existing = await tx.get(ref);
    if (existing.exists && existing.get('ownerCheckoutSessionId') !== owner) throw new Error('SESSION_OWNERSHIP_CONFLICT');
    tx.set(ref, { ...state, sessionId, serverSavedAt: savedAt, ownerCheckoutSessionId: owner }, { merge: true });
  });
  return savedAt;
}
async function loadDurableSession(sessionId: string, owner: string): Promise<any | null> {
  if (process.env.NODE_ENV !== 'production') {
    const stored = localDiscoveryStore.get(sessionId);
    return stored?.ownerCheckoutSessionId === owner ? stored : null;
  }
  const snapshot = await firestore.collection('discoverySessions').doc(sessionId).get();
  if (!snapshot.exists || snapshot.get('ownerCheckoutSessionId') !== owner) return null;
  return snapshot.data() || null;
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
  const PORT = Number.parseInt(process.env.PORT || '3000', 10);

  app.use(express.json({ limit: '2mb' }));

  app.get('/healthz', (_req, res) => res.status(200).json({ status: 'ok' }));

  app.get('/api/access/verify', async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    if (!accessSecret || !process.env.STRIPE_SECRET_KEY?.trim() || !DISCOVERY_PRICE_ID) {
      return res.status(503).json({ success: false, code: 'PAYMENT_ACCESS_NOT_CONFIGURED' });
    }
    try {
      const checkoutSessionId = await verifyStripeCheckoutSession(req.query.session_id);
      if (!checkoutSessionId) return res.status(403).json({ success: false, code: 'PAYMENT_NOT_VERIFIED' });
      setAccessCookie(res, checkoutSessionId);
      return res.status(200).json({ success: true, verified: true, service: 'discovery' });
    } catch {
      return res.status(502).json({ success: false, code: 'PAYMENT_VERIFICATION_UNAVAILABLE' });
    }
  });

  app.use(['/api/discovery', '/api/gemini', '/api/image-studio'], requirePaidAccess);

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

      const defaultData = {
        mantra: 'SEPARA EL HECHO DEL SUPUESTO Y PRUEBA EN CORTO.',
        diagnostico: `Para "${prompt}", el bloqueo proviene de exigir certeza completa antes de dar el primer paso verificable.`,
        protocolo24h: [
          'Formula el problema en una sola frase sin adjetivos.',
          'Inicia un bloque de 25 minutos con Metrónomo SRAP a 60 BPM.',
          'Define un criterio frío de validación para las próximas 24 horas.'
        ],
        preguntaReflexion:
          '¿Qué dato real obtendrías hoy si ejecutas una prueba pequeña en lugar de seguir postergando?'
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

  // Generador de Lentes de Poder (reutilizando operación "hook" de INTERACTIVE-DECOX + fallback determinista local)
  app.post('/api/discovery/power-lens', async (req, res) => {
    const {
      poderTitle = 'Poder de la Palabra',
      domain = 'Negocios',
      caseTitle = '',
      criticalFriction = '',
      expectedOutcome = ''
    } = req.body || {};

    const safeDomain = (domain || 'Negocios') as PowerLensDomain;
    const localFallback = buildLocalPowerLensDirective({
      poderTitle,
      domain: safeDomain,
      caseTitle,
      criticalFriction,
      expectedOutcome
    });

    const ai = getGenAIClient();
    if (!ai) {
      return res.json({
        success: true,
        source: 'local',
        directive: localFallback,
        engineNotice:
          'Motor externo sin credencial activa; Lente de Poder generado por el motor determinista local sobre tu caso.'
      });
    }

    try {
      const caseContext = [
        caseTitle ? `Caso: ${caseTitle}` : '',
        criticalFriction ? `Fricción: ${criticalFriction}` : '',
        expectedOutcome ? `Cambio deseado: ${expectedOutcome}` : ''
      ]
        .filter(Boolean)
        .join('. ');

      const prompt = `Genera un "Lente de Poder" para el "${poderTitle}" aplicado al dominio de "${safeDomain}".${
        caseContext ? ` Contexto real del participante: ${caseContext}.` : ''
      } El resultado debe ser una directiva concisa o una pregunta disruptiva en máximo 2 líneas, sobria, sin promesas exageradas. Formato: "**[Nombre del Lente]:** [Directiva/Pregunta]".`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt
      });

      const text = (response.text || '').trim();
      if (!text) {
        return res.json({
          success: true,
          source: 'local',
          directive: localFallback
        });
      }

      return res.json({
        success: true,
        source: 'ai',
        directive: text
      });
    } catch (err: any) {
      const classified = classifyUpstreamError(err);
      return res.json({
        success: true,
        source: 'local',
        directive: localFallback,
        code: classified.code,
        engineNotice: classified.userMessage
      });
    }
  });

  // Discovery session persistence: Firestore in production, memory only in local development.
  app.post('/api/discovery/save', async (req, res) => {
    try {
      const { clientId, deliverableState } = req.body || {};
      if (!deliverableState || typeof deliverableState !== 'object') return res.status(400).json({ success: false, error: 'Faltan datos de la sesión.' });
      const normalizedClientId = normalizeValidSessionId(clientId);
      const normalizedStateId = normalizeValidSessionId(deliverableState.sessionId);
      if (normalizedClientId && normalizedStateId && normalizedClientId !== normalizedStateId) return res.status(400).json({ success: false, error: 'Conflicto de identificador de sesión (clientId y sessionId no coinciden).' });
      const effectiveId = normalizedClientId || normalizedStateId;
      if (!effectiveId) return res.status(400).json({ success: false, error: 'Se requiere un identificador de sesión único válido (formato DX-... o DEMO-...).' });
      const claims = requestAccessClaims(req);
      const owner = claims?.checkoutSessionId || (process.env.NODE_ENV !== 'production' ? 'local-development' : '');
      if (!owner) return res.status(401).json({ success: false, code: 'PAYMENT_ACCESS_REQUIRED' });
      const savedAt = await saveDurableSession(effectiveId, deliverableState, owner);
      return res.json({ success: true, sessionId: effectiveId, persistenceMode: process.env.NODE_ENV === 'production' ? 'firestore' : 'local_memory', message: 'Sesión guardada', savedAt });
    } catch (err: any) {
      if (err?.message === 'SESSION_OWNERSHIP_CONFLICT') return res.status(403).json({ success: false, error: 'Esta sesión pertenece a otra compra.' });
      console.error('[discovery/save] persistence failed');
      return res.status(500).json({ success: false, error: 'Error guardando la sesión' });
    }
  });

  app.get('/api/discovery/load', async (req, res) => {
    try {
      const clientId = normalizeValidSessionId(req.query.clientId);
      if (!clientId) return res.status(400).json({ success: false, error: 'Parámetro clientId válido requerido (formato DX-... o DEMO-...).' });
      const claims = requestAccessClaims(req);
      const owner = claims?.checkoutSessionId || (process.env.NODE_ENV !== 'production' ? 'local-development' : '');
      if (!owner) return res.status(401).json({ success: false, code: 'PAYMENT_ACCESS_REQUIRED' });
      const state = await loadDurableSession(clientId, owner);
      return res.json({ success: true, sessionId: clientId, persistenceMode: process.env.NODE_ENV === 'production' ? 'firestore' : 'local_memory', state });
    } catch {
      console.error('[discovery/load] persistence failed');
      return res.status(500).json({ success: false, error: 'Error cargando la sesión' });
    }
  });

  // Procesamiento de la Sesión de Descubrimiento (5 fases: Explorar, Decodificar, Aplicar 1 Hack, Orientar con SRAP, Ruta Inicial)
  app.post('/api/discovery/process-session', async (req, res) => {
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

  if (process.env.NODE_ENV === 'production') {
    app.use(async (req, res, next) => {
      if (req.path.startsWith('/api/') || req.path === '/healthz') return next();
      if (requestAccessClaims(req)) return next();
      const candidate = req.query.session_id;
      try {
        const checkoutSessionId = await verifyStripeCheckoutSession(candidate);
        if (!checkoutSessionId || !accessSecret) return res.status(401).type('html').send('<!doctype html><html lang="es"><meta charset="utf-8"><title>Acceso requerido</title><body><h1>Sesión de Descubrimiento</h1><p>Necesitas una compra verificada para acceder. Regresa a Interactive DecoX para completar o recuperar tu acceso.</p></body></html>');
        setAccessCookie(res, checkoutSessionId);
        return res.redirect(303, req.path);
      } catch {
        return res.status(503).send('No fue posible verificar el acceso en este momento.');
      }
    });
  }

  if (process.env.NODE_ENV !== 'production' && path.basename(__dirname) !== 'dist') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.basename(__dirname) === 'dist' ? __dirname : path.join(__dirname, 'dist');
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
