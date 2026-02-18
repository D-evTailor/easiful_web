# 🚀 Verificación Rápida de Producción

## ⚡ Quick Check (30 segundos)

### 1. Build Local
```bash
pnpm build
```

**Esperado:**
- ✅ Build completa sin errores
- ⚠️ Warning de pnpm scripts: **NORMAL** (solo sharp se aprueba)
- ✅ No errors de TypeScript
- ✅ Optimización de imágenes activa

---

### 2. Verificar Archivos Críticos

```bash
# Verificar que existan los archivos clave
ls .npmrc                    # ✅ Debe existir
ls next-env.d.ts            # ✅ Debe existir  
ls PRODUCTION_CHECKLIST.md  # ✅ Debe existir
ls .env.local               # ✅ Debe existir (local)
```

---

### 3. Verificar Git Status

```bash
git status
```

**Archivos nuevos que DEBEN commitarse:**
- ✅ `.npmrc`
- ✅ `next-env.d.ts`
- ✅ `PRODUCTION_CHECKLIST.md`
- ✅ `verify-production.md`
- ✅ `app/[locale]/auth-action/page.tsx`
- ✅ Cambios en `languages/es.ts` y `languages/en.ts`
- ✅ Cambios en `next.config.mjs`
- ✅ Cambios en `README.md`

**Archivos que NO deben estar:**
- ❌ `.env.local` (debe estar en .gitignore)
- ❌ `service-account-key.json`
- ❌ `node_modules/`

---

## 🎯 Tests de Funcionalidad

### Test 1: Rutas Básicas
```bash
# Iniciar servidor local
pnpm dev

# Abrir en navegador:
# - http://localhost:3000/es
# - http://localhost:3000/en
# - http://localhost:3000/es/login
# - http://localhost:3000/es/auth-action (debe dar error de params faltantes - OK)
```

### Test 2: Auth Action UI
Navega a: `http://localhost:3000/es/auth-action?mode=verifyEmail&oobCode=test`

**Esperado:**
- ✅ UI de error amigable
- ✅ Mensaje: "El enlace no es válido o ya ha sido utilizado"
- ✅ Botones: "Ir a iniciar sesión" y "Abrir la web de Easiful"

Navega a: `http://localhost:3000/es/auth-action?mode=resetPassword&oobCode=test`

**Esperado:**
- ✅ UI de error amigable (código inválido)
- ✅ NO debe mostrar el formulario de contraseña (porque el código es inválido)

---

## 🔍 Verificación de Seguridad

### Test 1: continueUrl Sanitization
```bash
# Abrir en navegador (reemplazar TEST con un código real si tienes):
http://localhost:3000/es/auth-action?mode=verifyEmail&oobCode=TEST&continueUrl=https://evil.com
```

**Esperado:**
- ✅ Botón muestra "Ir a iniciar sesión" (NO "Continuar")
- ✅ Hace push a /es/login (NO a evil.com)
- ✅ Console log (dev only): "Ignoring continueUrl from different origin"

### Test 2: No Logs Sensibles
```bash
# Buscar en código que no se loguee oobCode
grep -r "console.log.*oobCode" app/
```

**Esperado:**
- ❌ No debe encontrar nada (0 resultados)

---

## 📊 Verificación de Performance

### Lighthouse (Chrome DevTools)

1. Build de producción: `pnpm build && pnpm start`
2. Abrir Chrome DevTools → Lighthouse
3. Ejecutar audit en modo "Desktop"

**Mínimos esperados:**
- ✅ Performance: > 90
- ✅ Accessibility: > 90
- ✅ Best Practices: > 90
- ✅ SEO: > 90

---

## 🌐 Verificación de i18n

### Español
- ✅ `/es/auth-action` → Textos en español
- ✅ Cambiar a inglés en header funciona

### Inglés
- ✅ `/en/auth-action` → Textos en inglés
- ✅ Cambiar a español en header funciona

---

## ✅ Checklist Final Pre-Push

- [ ] `pnpm build` exitoso
- [ ] No errores de TypeScript
- [ ] No errores de ESLint críticos
- [ ] Tests de UI funcionan
- [ ] Tests de seguridad pasan
- [ ] `.env.local` NO está en git
- [ ] `.npmrc` SÍ está en git
- [ ] README actualizado
- [ ] PRODUCTION_CHECKLIST.md creado

---

## 🚢 Deploy a Vercel

### Paso 1: Push a Git
```bash
git add .
git commit -m "feat: add Firebase auth-action route with production config

- Add /auth-action route for verifyEmail and resetPassword
- Configure pnpm to approve only sharp for image optimization
- Add comprehensive production checklist
- Improve Next.js config for image optimization
- Add security: continueUrl sanitization, no oobCode logging
- Add i18n support (ES/EN) for auth actions
- Add accessibility: ARIA labels, focus management"

git push origin develop
```

### Paso 2: Verificar Build en Vercel

1. Ir a Vercel Dashboard
2. Verificar que el build sea exitoso
3. Verificar warning de pnpm: **ES NORMAL** (solo dice que scripts están controlados)

### Paso 3: Verificar en Producción

- ✅ `https://tu-dominio.vercel.app/es/auth-action?mode=verifyEmail&oobCode=invalid`
  - Debe mostrar error amigable
- ✅ Firebase Action Links configurados apuntando a `https://tu-dominio.vercel.app/es/auth-action`

---

## 🎉 Success!

Si todos los checks pasan:

```
███████╗██╗   ██╗ ██████╗ ██████╗███████╗███████╗███████╗
██╔════╝██║   ██║██╔════╝██╔════╝██╔════╝██╔════╝██╔════╝
███████╗██║   ██║██║     ██║     █████╗  ███████╗███████╗
╚════██║██║   ██║██║     ██║     ██╔══╝  ╚════██║╚════██║
███████║╚██████╔╝╚██████╗╚██████╗███████╗███████║███████║
╚══════╝ ╚═════╝  ╚═════╝ ╚═════╝╚══════╝╚══════╝╚══════╝

🚀 Tu app está lista para producción!
```

---

**Tiempo estimado**: 5-10 minutos  
**Última actualización**: 2026-01-28
