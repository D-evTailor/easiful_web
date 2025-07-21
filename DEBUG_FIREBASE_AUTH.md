# 🔍 Debugging Firebase Authentication Issues

## 🚨 **Problema Identificado:**

El error principal es: **`Firebase: Error (auth/api-key-not-valid.-please-pass-a-valid-api-key.)`**

## 📋 **Pasos de Debugging:**

### 1. **Verificar las Variables de Entorno del Cliente**

**Abre la consola del navegador (F12) y busca estos logs:**

```
Firebase Client Config: {
  apiKey: "AIzaSyC123...",
  authDomain: "easifull-1f9e0.firebaseapp.com",
  projectId: "easifull-1f9e0",
  ...
}
```

**Si ves `MISSING` en algún campo, significa que esa variable no está configurada.**

### 2. **Verificar tu archivo `.env.local`**

Confirma que estas variables estén correctamente configuradas:

```env
# OBLIGATORIAS para el cliente Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=easifull-1f9e0.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=easifull-1f9e0
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=easifull-1f9e0.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

**⚠️ IMPORTANTE:** Las variables del cliente DEBEN empezar con `NEXT_PUBLIC_`

### 3. **Verificar la Secuencia de Logs**

Cuando hagas login, deberías ver esta secuencia en la consola:

```
✅ Firebase Client inicializado correctamente
✅ Sincronizando autenticación con Firebase...
✅ Usuario de NextAuth: [el UID del usuario]
✅ Obteniendo token personalizado...
✅ 🔑 API route /api/auth/firebase-token llamada
✅ Sesión obtenida: { hasSession: true, hasUser: true, userId: "..." }
✅ Firebase UID: [el mismo UID]
✅ 🔥 Inicializando Firebase Admin...
✅ 🎫 Creando token personalizado...
✅ ✅ Token personalizado creado exitosamente
✅ Respuesta de API: { token: "..." }
✅ Autenticando con token personalizado...
✅ Usuario autenticado en Firebase correctamente
```

### 4. **Posibles Errores y Soluciones**

#### **Error A: Variables del cliente faltantes**
```
Variables de entorno faltantes: ["NEXT_PUBLIC_FIREBASE_API_KEY", ...]
```
**Solución:** Agregar las variables faltantes a `.env.local`

#### **Error B: Variables del servidor faltantes**
```
❌ Error creating Firebase custom token: Error: Faltan variables de entorno de Firebase Admin SDK
```
**Solución:** Verificar las variables individuales de Firebase Admin:
```env
FIREBASE_PROJECT_ID=easifull-1f9e0
FIREBASE_PRIVATE_KEY_ID=abc123...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xyz@easifull-1f9e0.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=123456789
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/...
```

#### **Error C: Conflicto entre Project IDs**
Si el `projectId` del cliente no coincide con el del servidor.

**Solución:** Verificar que ambos apunten al mismo proyecto: `easifull-1f9e0`

### 5. **Pasos para Resolver**

1. **Reinicia el servidor** si acabas de cambiar variables de entorno:
   ```bash
   # Ctrl+C para detener
   npm run dev
   ```

2. **Verifica los logs en orden:**
   - Abre F12 > Console
   - Haz login
   - Sigue la secuencia de logs paso a paso

3. **Si persiste el error:**
   - Copia todos los logs de la consola
   - Revisa qué paso específico está fallando
   - Verifica las variables correspondientes

## 🎯 **Prueba Rápida**

Ejecuta este código en la consola del navegador para verificar la configuración:

```javascript
console.log("Verificación rápida:", {
  nextPublicApiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.substring(0, 10) + "...",
  nextPublicProjectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  firebaseConfigured: !!window.firebase || "Unknown"
});
```

## 📞 **Siguiente Paso**

Después de seguir estos pasos, comparte:
1. Los logs que ves en la consola
2. Si alguna variable aparece como `MISSING`
3. En qué paso específico se produce el error

¡Con esta información podremos resolverlo rápidamente! 🚀 