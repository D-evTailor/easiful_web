# Easiful Web Corporativa

## 🌟 Descripción

**Easiful** es una aplicación web corporativa moderna que promociona una app móvil de organización personal. Su objetivo es ayudar a las personas a organizar su vida diaria con paz, claridad y motivación.

### 🎯 Características Principales

- **🌍 Multiidioma**: Soporte para Español e Inglés
- **📱 Responsive**: Diseño adaptativo para todos los dispositivos
- **🎨 Animaciones**: Transiciones suaves y efectos visuales atractivos
- **🎥 Contenido Multimedia**: Imágenes y videos promocionales
- **⚡ Performance**: Optimizado para carga rápida
- **♿ Accesibilidad**: Navegación por teclado y focus styles

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 15.2.4 (App Router)
- **Lenguaje**: TypeScript 5.8.3
- **Estilos**: Tailwind CSS 3.4.17
- **Componentes UI**: Radix UI + shadcn/ui
- **Gestor de paquetes**: pnpm
- **Fuente**: Google Fonts (Quicksand)

## 🚀 Instalación Rápida

```bash
# Clonar el repositorio
git clone https://github.com/Maybe-Sama/easiful_web.git
cd easiful_web

# Instalar dependencias
pnpm install

# Ejecutar en modo desarrollo
pnpm dev
```

El proyecto estará disponible en `http://localhost:3000`

## 📁 Estructura del Proyecto

```
easiful_web/
├── app/                    # App Router de Next.js
│   ├── contacto/          # Página de contacto
│   ├── sobre-nosotros/    # Página sobre nosotros
│   ├── globals.css        # Estilos globales
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página de inicio
├── components/            # Componentes reutilizables
│   ├── ui/               # Componentes UI (shadcn/ui)
│   ├── header.tsx        # Componente header
│   └── footer.tsx        # Componente footer
├── lib/                  # Utilidades y contextos
│   ├── language-context.tsx  # Contexto de idiomas
│   └── utils.ts          # Funciones utilitarias
├── public/               # Assets estáticos
│   ├── movil_inicio.png  # Imagen promocional
│   └── family.mp4        # Video promocional
├── docs/                 # Documentación
│   ├── estado-del-proyecto.md
│   └── como-lanzar.md
└── README.md
```

## 🎨 Características de Diseño

### Paleta de Colores
- **Primarios**: Stone (grises cálidos)
- **Acentos**: Emerald (verde) y Amber (naranja)
- **Fondo**: Gradiente sutil de colores cálidos

### Tipografía
- **Fuente**: Quicksand (Google Fonts)
- **Pesos**: 300, 400, 500, 600, 700

### Animaciones
- **Fade In**: Aparición suave de elementos
- **Slide Up**: Deslizamiento desde abajo
- **Float**: Animación flotante para móviles
- **Hover Effects**: Efectos de hover en cards y botones

## 🌐 Páginas Disponibles

1. **Inicio** (`/`)
   - Hero section con imágenes y video
   - Botón de descarga de Google Play
   - Características principales
   - Casos de uso

2. **Sobre Nosotros** (`/sobre-nosotros`)
   - Historia y misión de Easiful
   - Filosofía de la empresa

3. **Contacto** (`/contacto`)
   - Formulario de contacto
   - Información de contacto

## 🔧 Scripts Disponibles

```bash
# Desarrollo
pnpm dev

# Build de producción
pnpm build

# Iniciar servidor de producción
pnpm start

# Linting
pnpm lint
```

## 📱 Responsive Design

El diseño está optimizado para:
- **Desktop**: 1024px+
- **Tablet**: 768px - 1023px
- **Mobile**: 320px - 767px

## 🌍 Internacionalización

El proyecto soporta dos idiomas:
- **Español** (por defecto)
- **Inglés**

El cambio de idioma se realiza mediante un selector en el header.

## 🚀 Despliegue

### Vercel (Recomendado)
```bash
# Instalar Vercel CLI
npm install -g vercel

# Desplegar
vercel
```

### Build Manual
```bash
# Generar build
pnpm build

# El build estará en la carpeta .next/
```

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

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Contacto

- **Proyecto**: [Easiful Web](https://github.com/Maybe-Sama/easiful_web)
- **Documentación**: Ver carpeta `docs/`

---

**Hecho con ❤️ usando Next.js y Tailwind CSS** 