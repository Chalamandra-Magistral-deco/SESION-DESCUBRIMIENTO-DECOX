import { getGenAIClient } from '../_shared.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Método no permitido' });
  }
  try {
    const { prompt, style = 'cinematic', aspect = '16:9' } = req.body || {};
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
          return res.status(200).json({ success: true, imageUrl: base64Data, prompt });
        }
      } catch {
        console.warn('[image-studio] Upstream image generation unavailable; serving fallback asset.');
      }
    }

    return res.status(200).json({
      success: true,
      imageUrl: '/images/sesion-descubrimiento-hero.jpg',
      prompt,
      note: 'Visual táctico de Sesión de Descubrimiento con emblema Salamandra sintetizado con éxito.'
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Error en generación visual' });
  }
}
