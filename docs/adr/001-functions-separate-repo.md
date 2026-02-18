# ADR-001: Firebase Functions en repositorio separado

**Estado**: Aceptado  
**Fecha**: 2026-02-18  
**Contexto**: RF-04 del SPEC de estabilización  

## Contexto

El repositorio `easiful-web` contenía un directorio `functions/` con Cloud Functions de Firebase (Stripe checkout + webhooks). Sin embargo:

- El CI workflow ya desplegaba functions desde un repositorio separado (`easiful-functions`).
- La web no invoca Firebase Functions directamente; usa Next.js API routes como backend.
- El código de functions en este repo estaba desactualizado y usaba Node 22, mientras que la web usa Node 20.
- `firebase.json` configuraba `predeploy` para functions, creando riesgo de despliegue accidental de código stale.

## Decisión

Las Firebase Functions se gestionan exclusivamente desde el repositorio `easiful-functions`.

En `easiful-web`:
- Se elimina el directorio `functions/` del control de versiones.
- Se elimina la sección `functions` de `firebase.json`.
- Se eliminan los workarounds de webpack para excluir `functions/`.
- Se añade `/functions/` a `.gitignore`.

## Consecuencias

**Positivas**:
- Ciclos de deploy independientes (web vs functions).
- Sin riesgo de despliegue accidental de código obsoleto.
- Builds más limpios (sin exclusiones webpack de functions).
- Sin conflicto de versiones Node (20 vs 22).

**Negativas**:
- Se requiere coordinación entre repos para cambios que afecten ambos (e.g., contratos de API Stripe).

**Mitigación**:
- Documentar el contrato de datos Firestore compartido entre ambos repos.
- El webhook de Stripe (en `easiful-functions`) y el checkout session (en `easiful-web` API route) comparten la estructura del campo `subscription` en Firestore.
