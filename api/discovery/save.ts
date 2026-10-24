import { normalizeValidSessionId, saveSessionInVolatileStore } from '../_shared.js';

export default function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Método no permitido' });
  }
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
    const savedAt = saveSessionInVolatileStore(effectiveId, deliverableState);
    return res.status(200).json({
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
}
