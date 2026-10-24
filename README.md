# Sesión de Descubrimiento — Interactive DecoX

Aplicación autónoma de Chalamandra Magistral DecoX que convierte un caso real en una Ruta Inicial verificable. Es el **entregable interactivo** del producto comercial “Sesión Descubrimiento”; no es la página de marketing ni el checkout.

## Qué entrega

La experiencia completa tiene cinco fases conectadas:

1. **Explorar:** objetivo, situación observable, fricción, intentos y restricciones.
2. **Decodificar:** patrones, hipótesis, incentivos, incertidumbres y restricciones reales.
3. **Aplicar un Hack:** un Hack oficial y su plantilla metodológica.
4. **Orientar con SRAP:** Sincronizar, Reconocer, Activar y Pausa.
5. **Cerrar:** Ruta Inicial e Informe Ejecutivo exportable en PDF/A4 y JSON.

Soporta recorridos Personas y Organizaciones. La síntesis local funciona sin una API de IA; los servicios de IA son complementarios.

## Relación con INTERACTIVE-DECOX

Hay dos aplicaciones con responsabilidades distintas:

| Sistema | Responsabilidad |
|---|---|
| [INTERACTIVE-DECOX](https://github.com/Chalamandra-Magistral-deco/INTERACTIVE-DECOX) | Sitio comercial, educación de Hacks/Poderes, catálogo público, link de pago y verificación del pago. |
| Este repositorio | Aplicación de diagnóstico de cinco fases, estado del caso y entrega del informe. |

No se debe duplicar la aplicación completa dentro del modal comercial. La integración recomendada es una transferencia explícita después de que INTERACTIVE-DECOX verifique el pago.

### Flujo previsto de cliente

INTERACTIVE-DECOX — Sesión Descubrimiento (USD 27) → Stripe Payment Link → regreso con session_id → /api/verify-payment valida la sesión pagada en el servidor → página de pago verificado → VITE_DISCOVERY_APP_URL → esta aplicación: cinco fases, PDF/A4 y JSON.

La URL pública de esta aplicación aún debe configurarse en el sitio comercial cuando se haya elegido y probado el despliegue. No inventar una URL ni activar un enlace ficticio. El handoff comercial usa la variable pública VITE_DISCOVERY_APP_URL; no es un secreto.

## Alineación de metodología y catálogo oficial

La fuente canónica del catálogo comercial está en INTERACTIVE-DECOX/src/utils/constants.ts. Este repositorio incluye una **copia versionada para ejecutar la experiencia autónoma** en src/data/interactiveCatalog.ts, que debe tratarse como espejo de compatibilidad, no como un catálogo independiente.

El contrato revisado incluye:
- 8 Hacks oficiales y sus plantillas metodológicas.
- 7 Poderes de Sherezade.
- 10 preguntas del test cognitivo y 3 arquetipos (El Arquitecto, El Alquimista, El Explorador).
- Las relaciones Hack–Poder explícitas en la fuente. Si el Hack 8 no tiene una relación explícita en el catálogo canónico, no se debe inventar una para la sesión.

Cuando se modifique el catálogo en INTERACTIVE-DECOX, revisar y sincronizar la copia de src/data/interactiveCatalog.ts en el mismo cambio o en una actualización de catálogo claramente vinculada. No cambiar silenciosamente nombres, plantillas, cantidades ni asociaciones.

## Arquitectura y estado de persistencia

- React + Vite para la interfaz.
- Express para /api/discovery/* y servicios complementarios.
- El cliente guarda el borrador en localStorage; los casos demostrativos tienen almacenamiento separado del borrador real.
- En producción, el servidor guarda las sesiones en Firestore y vincula cada documento a la sesión de compra de Stripe que obtuvo acceso. En desarrollo local utiliza memoria volátil. **La persistencia de producción requiere conceder al service account de Cloud Run el rol `roles/datastore.user`.**
- El identificador de sesión no es un mecanismo de autenticación.
- En producción, el acceso requiere una Checkout Session pagada de Stripe que coincida con el precio configurado. El servidor emite una cookie HttpOnly, Secure y firmada con caducidad de siete días; los endpoints de la sesión quedan protegidos. El handoff desde Interactive debe enviar `session_id` a la URL de esta aplicación.

Antes de producción, ejecutar pruebas de aislamiento de sesiones y una compra de prueba completa. La verificación de Stripe y la cookie firmada están implementadas en el servidor; las credenciales y permisos de Google Cloud aún deben configurarse.

## Despliegue en contenedor (Cloud Run)

El repositorio incluye un `Dockerfile` multi-stage para construir la interfaz y ejecutar Express en producción. El servidor escucha `process.env.PORT` (Cloud Run inyecta ese puerto) y expone `/healthz` para comprobaciones de salud.

Validación local antes de desplegar:

```bash
bun install --frozen-lockfile
bun run lint
INTERACTIVE_DECOX_PATH=/ruta/a/INTERACTIVE-DECOX bun run catalog:check
bun run build
PORT=8080 NODE_ENV=production bun run start
```

**Bloqueos conocidos antes de producción:** el proyecto Google Cloud de destino debe tener facturación habilitada, Cloud Run configurado y el service account con `roles/datastore.user`. Configura `STRIPE_SECRET_KEY`, `STRIPE_DISCOVERY_PRICE_ID` y un `SESSION_TOKEN_SECRET` aleatorio mediante Secret Manager. La aplicación se despliega exclusivamente como contenedor Cloud Run; los handlers duplicados de Vercel se retiraron para que no exista una ruta de API alternativa sin las mismas protecciones.

## Desarrollo y validación

Requisitos: Node.js 20+ y Bun (el lockfile del repositorio es bun.lock).

    bun install --frozen-lockfile
    npm run lint
    npm run build
    npm start

Para verificar que el espejo metodológico coincide con la fuente canónica, clona también INTERACTIVE-DECOX y ejecuta:

    npm run catalog:check -- /ruta/a/INTERACTIVE-DECOX

El servidor compilado arranca con npm start. Para desarrollo usa npm run dev.

Validación manual mínima:
1. Crear una sesión Personas y otra Organizaciones.
2. Comprobar que los botones de avance exigen los datos mínimos de cada fase y que el riel no permite saltar fases pendientes.
3. Abrir un caso demostrativo y volver al borrador real: ninguno debe sobrescribir al otro.
4. Sellar una sesión y comprobar que el JSON incluye el caso y la Ruta Inicial.
5. Imprimir a PDF, confirmar tamaño A4 y comprobar que se incluyen el caso, el Hack aplicado y SRAP.
6. Revisar la portada y la sesión a 390 px sin desplazamiento horizontal.

## Integración comercial: checklist de liberación

- [ ] Desplegar esta aplicación de forma independiente y probar / y /api/discovery/capabilities.
- [ ] Configurar `VITE_DISCOVERY_APP_URL` en INTERACTIVE-DECOX con la URL real ya verificada.
- [ ] Confirmar que VITE_STRIPE_DISCOVERY_URL lleva al producto correcto de USD 27.
- [ ] Completar una compra de prueba de Stripe y comprobar que sólo tras la verificación server-side aparece el enlace de entrega.
- [ ] Probar que una sesión pagada accede y que una sesión no pagada o de otra compra no puede leer ni sobrescribir los datos.
- [ ] Mantener INTERACTIVE-DECOX como responsable del checkout y esta aplicación como responsable del diagnóstico y sus entregables.
