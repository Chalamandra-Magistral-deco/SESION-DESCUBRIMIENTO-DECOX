import { getGenAIClient, classifyUpstreamError } from '../_shared.js';
import { buildLocalPowerLensDirective } from '../../src/data/interactiveCatalog.js';
import { PowerLensDomain } from '../../src/types.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Método no permitido' });
  }

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
    return res.status(200).json({
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
      return res.status(200).json({
        success: true,
        source: 'local',
        directive: localFallback
      });
    }

    return res.status(200).json({
      success: true,
      source: 'ai',
      directive: text
    });
  } catch (err: any) {
    const classified = classifyUpstreamError(err);
    return res.status(200).json({
      success: true,
      source: 'local',
      directive: localFallback,
      code: classified.code,
      engineNotice: classified.userMessage
    });
  }
}
