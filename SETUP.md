# Configuración del Proyecto

## Errores Solucionados

### 1. Error de Firebase Admin SDK
**Problema**: `Error: 2 UNKNOWN: Getting metadata from plugin failed with error: error:1E08010C:DECODER routines::unsupported`

**Causa**: Formato incorrecto de la clave privada de Firebase en las variables de entorno.

**Solución**: 
- Se mejoró el manejo de la clave privada en `lib/env.ts`
- Se agregó mejor manejo de errores en `lib/firebase-admin.ts`
- Se creó automáticamente el archivo `.env.local` con las variables correctas

### 2. Warnings de Source Maps
**Problema**: Warnings sobre source maps inválidos en node_modules.

**Solución**: 
- Se configuró webpack en `next.config.mjs` para ignorar estos warnings
- Se deshabilitaron source maps en producción

### 3. Error de Traducciones
**Problema**: `TypeError: Cannot read properties of undefined (reading 'nav.home')`

**Causa**: El contexto de idioma no estaba validando correctamente el idioma.

**Solución**:
- Se mejoró la validación en `lib/language-context.tsx`
- Se agregó validación de locale en `app/[locale]/layout.tsx`

### 4. Error de OAuth
**Problema**: `invalid_client (Unauthorized)` en login con Google

**Causa**: Variables de entorno vacías o incorrectas.

**Solución**:
- Se generó automáticamente el archivo `.env.local` con valores placeholder
- Se agregaron instrucciones claras para configurar las variables

## Variables de Entorno Requeridas

El archivo `.env.local` se ha generado automáticamente. **IMPORTANTE**: Actualiza las siguientes variables con tus valores reales:

### Variables que necesitas configurar:

1. **GOOGLE_CLIENT_SECRET**: Obtén esto desde Google Cloud Console
2. **NEXT_PUBLIC_FIREBASE_API_KEY**: Desde Firebase Console
3. **NEXT_PUBLIC_FIREBASE_APP_ID**: Desde Firebase Console
4. **NEXTAUTH_SECRET**: Ya generado automáticamente

### Variables ya configuradas:
- Todas las variables de Firebase Admin SDK (desde tu service-account-key.json)
- GOOGLE_CLIENT_ID (ya estaba en tu código)
- NEXTAUTH_SECRET (generado automáticamente)

## Pasos para Completar la Configuración

1. **Obtener Google Client Secret**:
   - Ve a [Google Cloud Console](https://console.cloud.google.com/)
   - Navega a APIs & Services > Credentials
   - Encuentra tu OAuth 2.0 Client ID
   - Descarga el JSON o copia el Client Secret

2. **Obtener Firebase Config**:
   - Ve a [Firebase Console](https://console.firebase.google.com/)
   - Selecciona tu proyecto
   - Ve a Project Settings > General
   - En "Your apps", encuentra tu app web
   - Copia API Key y App ID

3. **Generar NEXTAUTH_SECRET**:
   ```bash
   openssl rand -base64 32
   ```

4. **Actualizar .env.local**:
   Reemplaza los valores placeholder con tus valores reales.

## Verificación

Después de configurar las variables, ejecuta:

```bash
pnpm dev
```

La aplicación debería iniciar sin errores de Firebase Admin SDK.

## Troubleshooting

### Si sigues viendo errores de Firebase:

1. Verifica que el archivo `.env.local` existe
2. Asegúrate de que todas las variables están configuradas
3. Reinicia el servidor de desarrollo
4. Verifica que el `service-account-key.json` es válido

### Si hay problemas con Google OAuth:

1. Verifica que el GOOGLE_CLIENT_ID y GOOGLE_CLIENT_SECRET son correctos
2. Asegúrate de que el dominio localhost:3000 está autorizado en Google Cloud Console

## Estructura de Archivos Modificados

- `lib/env.ts`: Mejorado el manejo de la clave privada
- `lib/firebase-admin.ts`: Mejorado el manejo de errores
- `app/api/auth/[...nextauth]/route.ts`: Mejorado el manejo de errores
- `next.config.mjs`: Configurado para evitar warnings de source maps
- `.env.local`: Generado automáticamente (necesita configuración manual) 