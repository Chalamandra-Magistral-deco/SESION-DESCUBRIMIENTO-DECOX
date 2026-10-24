import { Type } from '@google/genai';
import { getGenAIClient, classifyUpstreamError } from './_shared.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Método no permitido' });
  }
  try {
    const { prompt, category } = req.body || {};

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
      return res.status(200).json({ success: true, data: parsed });
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

    return res.status(200).json({ success: true, data: defaultData });
  } catch (err: any) {
    const classified = classifyUpstreamError(err);
    return res.status(502).json({
      success: false,
      code: classified.code,
      error: classified.userMessage
    });
  }
}
