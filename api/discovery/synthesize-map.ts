import { Type } from '@google/genai';
import { getGenAIClient, classifyUpstreamError } from '../_shared.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Método no permitido' });
  }
  try {
    const ai = getGenAIClient();
    if (!ai) {
      return res.status(503).json({
        success: false,
        code: 'AI_KEY_UNAVAILABLE',
        error: 'Motor IA no disponible; utiliza el procesador analítico local.'
      });
    }
    const { challenge, strategicProfile, selectedHacks, experiments } = req.body || {};
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
    return res.status(200).json({ success: true, data: JSON.parse(response.text || '{}') });
  } catch (err: any) {
    const classified = classifyUpstreamError(err);
    return res.status(502).json({
      success: false,
      code: classified.code,
      error: classified.userMessage
    });
  }
}
