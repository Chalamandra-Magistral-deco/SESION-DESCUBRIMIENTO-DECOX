import { normalizeValidSessionId, discoveryStore } from '../_shared.js';

export default function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Método no permitido' });
  }
  try {
    const clientId = normalizeValidSessionId(req.query?.clientId);
    if (!clientId) {
      return res.status(400).json({
        success: false,
        error: 'Parámetro clientId válido requerido (formato DX-... o DEMO-...).'
      });
    }
    const stored = discoveryStore.get(clientId) || null;
    const state = stored && stored.sessionId === clientId ? stored : null;
    return res.status(200).json({
      success: true,
      sessionId: clientId,
      persistenceMode: 'volatile_server_memory',
      authNotice: 'session_id_is_operational_not_authentication',
      state
    });
  } catch {
    return res.status(500).json({ success: false, error: 'Error cargando la sesión' });
  }
}
