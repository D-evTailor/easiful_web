# ✅ Production Checklist - Easiful Web

## Pre-Deploy Verification

### 🔐 Environment Variables (Vercel)

Asegúrate de que estas variables estén configuradas en Vercel:

#### Firebase Client SDK (Frontend)
- [ ] `NEXT_PUBLIC_FIREBASE_API_KEY`
- [ ] `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- [ ] `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- [ ] `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_APP_ID`

#### Firebase Admin SDK (Backend)
- [ ] `FIREBASE_PROJECT_ID`
- [ ] `FIREBASE_PRIVATE_KEY_ID`
- [ ] `FIREBASE_PRIVATE_KEY` (⚠️ debe mantener los `\n` literales)
- [ ] `FIREBASE_CLIENT_EMAIL`
- [ ] `FIREBASE_CLIENT_ID`
- [ ] `FIREBASE_CLIENT_X509_CERT_URL`

#### NextAuth
- [ ] `NEXTAUTH_SECRET` (generado con `openssl rand -base64 32`)
- [ ] `NEXTAUTH_URL` (URL de producción, ej: `https://easiful.vercel.app`)

#### Google OAuth
- [ ] `GOOGLE_CLIENT_ID`
- [ ] `GOOGLE_CLIENT_SECRET`

#### Stripe (si aplica)
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- [ ] `STRIPE_SECRET_KEY`
- [ ] `STRIPE_WEBHOOK_SECRET`

---

## 🔥 Firebase Configuration

### Action Links (Email Templates)

Configurar en Firebase Console → Authentication → Templates:

#### Email Verification
- **URL de acción**: `https://tu-dominio.com/es/auth-action` (o `/en/auth-action`)
- Parámetros automáticos: `mode=verifyEmail&oobCode=...`

#### Password Reset
- **URL de acción**: `https://tu-dominio.com/es/auth-action`
- Parámetros automáticos: `mode=resetPassword&oobCode=...`

### Dominios autorizados
- [ ] Añadir dominio de Vercel en Firebase Console → Authentication → Settings → Authorized domains

---

## 🚀 Build Verification

### Local Build Test
```bash
# Test production build locally
pnpm build
pnpm start

# Verify no errors in console
```

### Vercel Deploy
- [ ] Build completa sin errores
- [ ] No warnings críticos (solo el de pnpm scripts está OK)
- [ ] Optimización de imágenes funcionando (sharp)

---

## 🎨 Frontend Checks

- [ ] `/es/auth-action?mode=verifyEmail&oobCode=test` → UI de error (código inválido)
- [ ] `/es/auth-action?mode=resetPassword&oobCode=test` → UI de error (código inválido)
- [ ] `/es/login` → Login flow funciona
- [ ] `/es/dashboard` → Dashboard accesible solo con auth
- [ ] `/es/pricing` → Pricing page funciona

---

## 🔒 Security Checks

- [ ] `.env.local` NO está en el repo (está en .gitignore)
- [ ] `service-account-key.json` NO está en el repo
- [ ] Logs no exponen `oobCode` completo
- [ ] Logs no exponen claves privadas
- [ ] `continueUrl` sanitización funciona (rechaza dominios externos)

---

## 📊 Performance

- [ ] Lighthouse Score > 90 (Performance)
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3.5s
- [ ] Imágenes optimizadas (WebP/AVIF)
- [ ] No console.logs en producción

---

## 🌐 i18n (Internationalization)

- [ ] `/es/...` funciona correctamente
- [ ] `/en/...` funciona correctamente
- [ ] Cambio de idioma en header funciona
- [ ] Todas las claves de traducción existen en `languages/es.ts` y `languages/en.ts`

---

## 🧪 Testing

### Auth Action Flow

#### Verify Email
1. Crear usuario en Firebase
2. Disparar email de verificación
3. Clic en enlace → debe llegar a `/auth-action?mode=verifyEmail&oobCode=...`
4. Verificar mensaje de éxito
5. CTA "Ir a iniciar sesión" funciona

#### Reset Password
1. Disparar reset desde Firebase o app
2. Clic en enlace → debe llegar a `/auth-action?mode=resetPassword&oobCode=...`
3. Formulario aparece
4. Validaciones funcionan:
   - < 6 caracteres → error
   - Contraseñas no coinciden → error
   - Contraseña débil → error específico
5. Submit exitoso → mensaje de éxito
6. CTA funciona

### Security Testing
- [ ] Probar `continueUrl` con dominio externo → debe rechazarse
- [ ] Probar `continueUrl` con dominio propio → debe redirigir
- [ ] Probar código expirado → mensaje amigable
- [ ] Probar código inválido → mensaje amigable

---

## 📝 Documentation

- [ ] README actualizado con auth-action flow
- [ ] Variables de entorno documentadas
- [ ] Instrucciones de deploy claras

---

## ✨ Post-Deploy

- [ ] Verificar todas las rutas en producción
- [ ] Verificar que emails de Firebase lleguen correctamente
- [ ] Verificar que enlaces de acción funcionen
- [ ] Monitorear logs de Vercel por errores
- [ ] Verificar Analytics (si aplica)

---

## 🐛 Common Issues

### Build Failures

**Error: Cannot find module 'next'**
- ✅ Resuelto: `next-env.d.ts` creado

**Error: pnpm scripts warning**
- ✅ Resuelto: `.npmrc` configurado para aprobar solo `sharp`

### Runtime Errors

**Firebase auth not working**
- Verificar todas las variables `NEXT_PUBLIC_FIREBASE_*`
- Verificar dominio autorizado en Firebase Console

**Action links not working**
- Verificar URL de acción en Firebase Email Templates
- Verificar que incluya `mode` y `oobCode` en URL

**Images not optimized**
- Verificar que `sharp` se instaló correctamente
- Verificar logs de Vercel para errores de sharp

---

## 🎉 Success Criteria

- ✅ Build verde en Vercel
- ✅ Todos los flujos de auth funcionan
- ✅ Action links (verify email + reset password) funcionan
- ✅ Imágenes optimizadas (WebP/AVIF)
- ✅ No errores en console de producción
- ✅ Lighthouse > 90
- ✅ i18n (ES/EN) funcionando
- ✅ No warnings críticos

---

**Última actualización**: 2026-01-28  
**Estado**: ✅ PRODUCTION READY
