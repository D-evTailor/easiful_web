# SPEC Analisis - Estado del Proyecto y Plan de Mejora

> **Addressed by:** SPEC-0021-001 (Production Hardening) — implemented 2026-02-22.
> All critical and medium risks identified here have been resolved. See `spec-driven/SPEC-0021-001-production-hardening/IMPLEMENTATION.md` for details.

**Proyecto**: `easiful-web`
**Fecha**: 2026-02-18
**Base de analisis**: revision estatica de codigo, configuracion, CI/CD y documentacion.

## 1. Objetivo
Definir una especificación accionable para estabilizar `easiful-web`, reducir riesgo operativo y alinear arquitectura/documentación antes de nuevas evoluciones de producto.

## 2. Contexto actual
- Último commit detectado: `2025-10-30`.
- El producto real supera el alcance descrito en README: incluye auth, dashboard y Stripe.
- Existen señales de mantenimiento discontinuo: docs desactualizadas, decisiones arquitectónicas inconsistentes, logging de depuración en rutas críticas.

## 3. Alcance de este spec
### Incluye
- Seguridad y robustez de auth/pagos.
- Consistencia de arquitectura (functions dentro/fuera del repo).
- Fiabilidad de build/deploy.
- Correcciones funcionales críticas de rutas/i18n.
- Calidad mínima de pruebas y documentación.

### No incluye (por ahora)
- Rediseño visual completo.
- Replanteamiento de dominio funcional de negocio.
- Migraciones de gran escala (framework/cambio total de stack).

## 4. Hallazgos clave

### 4.1 Riesgos críticos
1. Checkout Stripe acepta parámetros controlados por cliente (`priceId`, `success_url`, `cancel_url`) sin validación estricta de allowlist/dominios.
2. URL de descarga pública apunta a URL incorrecta (YouTube) en el botón principal.
3. Exceso de logs en auth/login/checkout con potencial fuga de señales sensibles de sesión/flujo.
4. Error en CI: `FIREBASE_PRIVATE_KEY_ID` se rellena desde secreto incorrecto.
5. Inconsistencia estructural: docs/CI sugieren funciones fuera del repo, pero `firebase.json` aún configura y predeploya funciones locales.
6. Desalineación de runtime: workflow Node 20 vs functions Node 22.

### 4.2 Riesgos medios
1. NextAuth fuerza páginas de login/error en español, ignorando locale activa.
2. Ruta de login referencia `/forgot-password` inexistente.
3. Middleware de locale con matcher limitado.
4. Build permisivo (`ignoreDuringBuilds`) reduce garantía de calidad.
5. Flujo de éxito en checkout no preserva locale.
6. Uso extendido de `any` en capa auth/pagos.

### 4.3 Calidad y mantenibilidad
- Cobertura de pruebas insuficiente para rutas críticas.
- Artefactos de Playwright versionados en Git.
- Documentación principal no representa el estado real (alcance, variables, rutas, métricas).

## 5. Requisitos de mejora (especificación)

## RF-01 Seguridad Checkout
**Descripción**: El backend debe crear sesiones Stripe solo para planes permitidos por configuración interna.

**Criterios de aceptación**:
1. El backend ignora `priceId` arbitrario no permitido.
2. `success_url` y `cancel_url` solo aceptan dominios autorizados.
3. Ante input inválido, responde 400 sin filtrar detalles sensibles.
4. Existe prueba automatizada de rechazo de `priceId` y dominio inválidos.

## RF-02 Higiene de logs
**Descripción**: Eliminar logs de depuración en cliente y minimizar logs server-side sensibles.

**Criterios de aceptación**:
1. No existen `console.log` de depuración en páginas de login/header/auth provider.
2. Logs server usan formato estructurado, sin tokens ni payloads completos.
3. En error, cliente recibe mensaje genérico y trazas quedan solo en observabilidad backend.

## RF-03 Correcciones funcionales visibles
**Descripción**: Restaurar coherencia de navegación y CTA.

**Criterios de aceptación**:
1. Botones de descarga apuntan a URLs reales de negocio configurables por entorno.
2. No hay links rotos (`/forgot-password`) o se implementa la ruta.
3. Redirecciones auth respetan locale activa.

## RF-04 Consistencia arquitectónica de Functions
**Descripción**: Adoptar una sola estrategia oficial de funciones (in-repo o repo separado).

**Criterios de aceptación**:
1. `firebase.json`, workflow y docs reflejan exactamente la misma estrategia.
2. Se elimina configuración huérfana de despliegue/predeploy no usada.
3. Se documenta decisión arquitectónica (ADR corto).

## RF-05 Hardening CI/CD
**Descripción**: Endurecer pipeline para prevenir regresiones.

**Criterios de aceptación**:
1. Secret mapping corregido (`FIREBASE_PRIVATE_KEY_ID`).
2. Versiones Node/pnpm alineadas entre repositorio y workflows.
3. Build falla en errores reales (linter/types críticos definidos por política).

## RF-06 Base mínima de calidad automatizada
**Descripción**: Garantizar pruebas mínimas de rutas críticas.

**Criterios de aceptación**:
1. Smoke E2E de login fallido/login exitoso (con usuario de test controlado).
2. Tests de API route de checkout con casos inválidos/válidos.
3. Artefactos de test no quedan versionados en Git.

## RF-07 Documentación viva
**Descripción**: Actualizar docs para operación real.

**Criterios de aceptación**:
1. README refleja páginas y capacidades actuales.
2. Guía de lanzamiento lista variables de entorno reales requeridas.
3. Se añade sección "estado conocido" y runbook básico de despliegue.

## 6. Requisitos no funcionales
1. **Seguridad**: no exponer datos sensibles en respuestas o logs.
2. **Trazabilidad**: errores críticos con identificador de correlación.
3. **Operabilidad**: pipeline reproducible local/CI.
4. **Mantenibilidad**: tipado explícito en auth/pagos.
5. **Compatibilidad**: comportamiento coherente en `es` y `en`.

## 7. Plan por fases (30/60/90)

### Fase 1 (0-30 días) - Estabilización crítica
- Corregir checkout validation + allowlists.
- Arreglar CTA de descarga y links rotos.
- Limpiar logs sensibles de cliente/server.
- Corregir secret mapping en CI.

**Salida esperada**: riesgo alto de seguridad/operación reducido.

### Fase 2 (31-60 días) - Consistencia de plataforma
- Decisión y ejecución de estrategia functions (unificar config).
- Alinear versions Node/pnpm.
- Endurecer política de build/lint.
- Corregir i18n redirect/auth.

**Salida esperada**: despliegue predecible y arquitectura coherente.

### Fase 3 (61-90 días) - Calidad sostenible
- Cobertura de pruebas críticas (API + E2E smoke).
- Limpieza de artefactos en control de versiones.
- Reescritura de docs operativas.

**Salida esperada**: base mantenible para nuevas features.

## 8. Backlog priorizado (impacto/esfuerzo)
1. Validación backend checkout (`alto/medio`).
2. Corregir URLs públicas y rutas rotas (`alto/bajo`).
3. Limpiar logging sensible (`alto/bajo`).
4. Arreglar CI secrets y versión Node (`alto/bajo`).
5. Unificar estrategia functions (`alto/medio`).
6. Locale-aware auth redirects (`medio/bajo`).
7. Quitar artefactos de test de Git + `.gitignore` (`medio/bajo`).
8. Tipado `any` en auth/pagos (`medio/medio`).
9. Actualización integral docs (`medio/medio`).
10. Pruebas automáticas críticas (`alto/medio`).

## 9. Dependencias y decisiones pendientes
1. Confirmar estrategia oficial de `functions` (mono-repo vs repo separado).
2. Confirmar URLs productivas de App Store / Google Play.
3. Definir política de severidad de lint/types que bloquea CI.
4. Definir entorno de testing con credenciales seguras para E2E.

## 10. Riesgos de no actuar
1. Cobros/suscripciones manipulables por entrada cliente.
2. Fallos de deploy por configuración contradictoria.
3. Incidencias difíciles de diagnosticar por ruido de logs.
4. Onboarding lento por documentación no fiable.

## 11. Métricas de éxito
1. 0 fallos por secret/config mismatch en CI durante 30 días.
2. 100% de rechazos correctos en tests de checkout inválido.
3. 0 enlaces rotos en rutas públicas críticas.
4. Pipeline verde con smoke tests críticos en PR principal.
5. Reducción de incidencias de autenticación/redirect por locale.

## 12. Entregables
1. Cambios de código en auth/checkout/logging.
2. CI actualizado y consistente.
3. Documento ADR de estrategia functions.
4. Suite mínima de pruebas críticas.
5. README + guía de lanzamiento actualizados.

---

## Anexo A - Estado verificado durante el análisis
- Páginas detectadas: 10 (`app/[locale]/**/page.tsx`).
- API routes detectadas: 3 (`app/api/**/route.ts`).
- Tests detectados: 2 (`test/**/*.ts`).
- Hallazgos de desalineación documental confirmados.
