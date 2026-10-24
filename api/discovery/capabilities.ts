import { getGenAIClient } from '../_shared.js';

export default function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Método no permitido' });
  }
  const ai = getGenAIClient();
  return res.status(200).json({
    success: true,
    aiConfigured: Boolean(ai),
    persistenceMode: 'volatile_server_memory',
    clientStorage: 'browser_localStorage'
  });
}
