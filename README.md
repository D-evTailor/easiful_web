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