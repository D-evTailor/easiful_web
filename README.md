# Easiful Web

Corporate web application for **Easiful** — a personal organization mobile app. This web portal provides marketing pages, user authentication (login only, registration via mobile app), subscription management through Stripe, and a user dashboard.

## Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3 + Radix UI + shadcn/ui
- **Auth**: NextAuth v4 (Google OAuth + Email/Password via Firebase Auth)
- **Payments**: Stripe Checkout (subscriptions)
- **Backend**: Firebase Admin SDK (Firestore for user/subscription data)
- **Hosting**: Firebase Hosting (static export)
- **i18n**: Spanish (default) / English via `next-intl` and custom language context
- **Package Manager**: pnpm

## Pages

| Route | Description |
|---|---|
| `/[locale]` | Landing page with hero, features, CTA |
| `/[locale]/login` | Login (email/password + Google). No registration — users register via mobile app |
| `/[locale]/dashboard` | Authenticated user dashboard with subscription status |
| `/[locale]/pricing` | Subscription plans (Free, Monthly 3.50€, Annual 12€) |
| `/[locale]/sobre-nosotros` | About us |
| `/[locale]/contacto` | Contact form |
| `/[locale]/faq` | Frequently asked questions |
| `/[locale]/legal/*` | Legal notice, privacy policy, cookie policy |

## API Routes

| Route | Method | Description |
|---|---|---|
| `/api/auth/[...nextauth]` | GET/POST | NextAuth authentication endpoints |
| `/api/auth/firebase-token` | GET | Generates Firebase custom tokens for authenticated users |
| `/api/stripe/checkout` | POST | Creates Stripe checkout sessions (validates planId against server allowlist) |

## Quick Start

```bash
# Clone and install
git clone <repo-url>
cd easiful-web
pnpm install

# Configure environment (copy and fill values)
cp .env.local.example .env.local

# Development
pnpm dev        # http://localhost:3000

# Quality checks
pnpm lint       # ESLint
pnpm test:unit  # Vitest unit tests
npx tsc --noEmit # TypeScript check

# Production build
pnpm build
```

## Environment Variables

See `.env.local.example` for the full list. Required variables:

| Variable | Required | Description |
|---|---|---|
| `NEXTAUTH_SECRET` | Yes | NextAuth encryption secret |
| `NEXTAUTH_URL` | Yes | Canonical app URL (e.g., `https://easiful.com`) |
| `GOOGLE_CLIENT_ID` | Yes | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Yes | Google OAuth client secret |
| `NEXT_PUBLIC_FIREBASE_*` | Yes | Firebase client SDK config (6 vars) |
| `FIREBASE_PROJECT_ID` | Yes | Firebase Admin project ID |
| `FIREBASE_PRIVATE_KEY` | Yes | Firebase Admin private key |
| `FIREBASE_CLIENT_EMAIL` | Yes | Firebase Admin client email |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Yes | Stripe publishable key |
| `STRIPE_SECRET_KEY` | Yes | Stripe secret key |
| `STRIPE_PRICE_MONTHLY` | No | Override monthly plan Stripe price ID |
| `STRIPE_PRICE_ANNUAL` | No | Override annual plan Stripe price ID |
| `NEXT_PUBLIC_GOOGLE_PLAY_URL` | No | Google Play store URL for download buttons |
| `NEXT_PUBLIC_APP_STORE_URL` | No | App Store URL for download buttons |

## Deployment

### Firebase Hosting (CI/CD)

The GitHub Actions workflow (`.github/workflows/firebase-deploy.yml`) handles deployment:

- **Pull requests**: Deploy to preview channel (`pr-<number>`)
- **Push to main/master**: Deploy to production

Secrets must be configured in the GitHub repository settings.

### Manual Build for Firebase

```bash
FIREBASE_BUILD=true pnpm build
# Output in /out/ directory
firebase deploy --only hosting
```

## Architecture Notes

- **Functions**: Firebase Cloud Functions are managed in a separate repository (`easiful-functions`). See [ADR-001](docs/adr/001-functions-separate-repo.md).
- **Auth flow**: Web supports login only. User registration happens exclusively via the mobile app. The web verifies users exist in Firebase Auth before allowing sign-in.
- **Checkout flow**: Client sends a `planId` (e.g., "monthly"); the server resolves it to a Stripe price ID from an internal allowlist and constructs redirect URLs server-side.
- **Subscription sync**: Stripe webhooks (in `easiful-functions`) update Firestore. The NextAuth session callback reads subscription data from Firestore on each session refresh.

## Testing

```bash
pnpm test:unit     # Unit tests (vitest) — validation, checkout route
pnpm test          # E2E tests (Playwright) — requires running dev server
```

<<<<<<< HEAD
## Known State (2026-02-18)

- Login, dashboard, pricing, and all public pages functional.
- Stripe checkout hardened with server-side plan validation.
- App store download URLs require configuration via env vars (currently default to `#`).
- Contact form is a UI mock (no backend API yet — tracked as TODO).
- E2E test suite exists for auth flows but requires test credentials to run.
=======
## 🔐 Acciones de autenticación Firebase (`/auth-action`)

La web implementa una ruta dedicada para procesar **Action Links de Firebase Auth** (enlaces enviados por email desde Firebase):

- `mode=verifyEmail&oobCode=...` → Verificación de correo
- `mode=resetPassword&oobCode=...` → Restablecimiento de contraseña

### Ruta

- **Path web**: `/{locale}/auth-action`
  - Ejemplos: `/es/auth-action`, `/en/auth-action`
- La ruta se encarga de:
  - Leer `mode` y `oobCode` desde la URL usando `URLSearchParams`
  - Llamar al **Firebase Web SDK** en el cliente:
    - `applyActionCode(auth, oobCode)` para `verifyEmail`
    - `verifyPasswordResetCode(auth, oobCode)` + formulario de nueva contraseña + `confirmPasswordReset(auth, oobCode, newPassword)` para `resetPassword`

### Estados de UI

La pantalla muestra una UI consistente con el branding existente (shadcn/ui + Tailwind):

- **Loading**: mientras se valida el enlace de Firebase
- **Formulario de nueva contraseña** (solo para `resetPassword`)
- **Success**:
  - Mensaje de éxito localizado (ES/EN)
  - CTA `Ir a iniciar sesión` → `/{locale}/login`
  - CTA `Abrir la web de Easiful` → `/{locale}`
- **Error**:
  - Manejo específico de:
    - `auth/expired-action-code`
    - `auth/invalid-action-code`
  - Mensaje genérico para otros errores

### Seguridad

- La configuración de Firebase ya está externalizada mediante variables `NEXT_PUBLIC_FIREBASE_*` (ver `.env.local.example`).
- En la ruta `/auth-action`:
  - **No se loguea nunca el `oobCode` completo**.
  - Los logs de error solo incluyen `error.code` y mensajes genéricos.

### Cómo probar los Action Links en local

1. Configura las variables de entorno en `.env.local` usando como referencia `.env.local.example`:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`

2. Lanza el entorno de desarrollo:

```bash
pnpm dev
```

3. En la **Consola de Firebase**:
   - Ve a **Authentication → Plantillas de correo**.
   - Asegúrate de que la URL de continuación / enlace de acción apunte a tu dominio:
     - Para local: `http://localhost:3000/es/auth-action` (o `/en/auth-action`).
     - Para producción (Vercel): `https://tu-dominio/es/auth-action`.

4. Dispara una acción desde Firebase:
   - **Verificar email**:
     - Crea un usuario nuevo o dispara un nuevo email de verificación.
     - Haz clic en el enlace recibido → aterrizará en `/es/auth-action?mode=verifyEmail&oobCode=...`.
   - **Reset password**:
     - Usa la opción de restablecer contraseña en Firebase Auth o desde la app móvil.
     - El enlace debería apuntar a `/es/auth-action?mode=resetPassword&oobCode=...`.

5. Verifica el comportamiento:
   - Enlace válido:
     - Verificación de email → mensaje de éxito + CTAs.
     - Reset password → formulario de nueva contraseña → éxito + CTAs.
   - Enlace expirado o inválido:
     - Se muestra un mensaje de error amigable y localizado.

### Notas de despliegue (Vercel)

- No se requiere configuración adicional de Vercel más allá de:
  - Definir las variables `NEXT_PUBLIC_FIREBASE_*` en **Project Settings → Environment Variables**.
  - Asegurarse de que la URL configurada en los correos de Firebase apunte al dominio de Vercel (`https://...vercel.app/{locale}/auth-action` o dominio propio).

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📋 TODO

- [ ] Actualizar dependencias
- [ ] Implementar tests
- [ ] Añadir más idiomas
- [ ] Optimizar SEO
- [ ] Configurar analytics

## ⚙️ Configuración de Producción

### pnpm Scripts Policy

El proyecto usa `.npmrc` para controlar qué dependencias pueden ejecutar scripts durante la instalación:

- ✅ **sharp**: Aprobado (necesario para optimización de imágenes de Next.js)
- ❌ Resto de dependencias: Scripts deshabilitados por seguridad

Esta configuración elimina el warning de pnpm en Vercel y asegura que solo las dependencias críticas ejecuten código durante el build.

### Image Optimization

Next.js está configurado para usar **sharp** en producción (Vercel):
- Formatos: AVIF y WebP
- Tamaños optimizados automáticamente
- Cache TTL: 60 segundos
- SVG soportado con CSP restrictivo

## 📋 Production Checklist

Antes de desplegar a producción, revisa `PRODUCTION_CHECKLIST.md` para verificar:
- ✅ Variables de entorno configuradas
- ✅ Firebase Action Links configurados
- ✅ Build local exitoso
- ✅ Tests de auth-action funcionando
- ✅ Seguridad verificada

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Contacto

- **Proyecto**: [Easiful Web](https://github.com/Maybe-Sama/easiful_web)
- **Documentación**: Ver carpeta `docs/`

---

**Hecho con ❤️ usando Next.js y Tailwind CSS** 
>>>>>>> 4b46a85038023a568ce4736e70d476adff8f4cbc
