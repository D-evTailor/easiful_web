# Cómo Lanzar - Easiful Web Corporativa

## 🚀 Guía de Instalación y Despliegue

Esta guía te ayudará a configurar y lanzar el proyecto Easiful Web Corporativa en tu entorno local y en producción.

## 📋 Requisitos Previos

### Software Necesario
- **Node.js**: Versión 18.0 o superior (recomendado: 20.x LTS)
- **pnpm**: Gestor de paquetes (versión 8.0 o superior)
- **Git**: Para clonar el repositorio

### Verificar Instalaciones
```bash
# Verificar Node.js
node --version

# Verificar pnpm (instalar si no está disponible)
pnpm --version

# Instalar pnpm si no está disponible
npm install -g pnpm
```

### Variables de Entorno
Actualmente el proyecto no requiere variables de entorno específicas, pero se recomienda crear un archivo `.env.local` para futuras configuraciones:

```bash
# .env.local (opcional)
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_PLAY_URL=https://play.google.com/store/apps/details?id=com.easiful.app
```

## 🛠️ Instalación Local

### 1. Clonar el Repositorio
```bash
git clone [URL_DEL_REPOSITORIO]
cd web_coorporativa
```

### 2. Instalar Dependencias
```bash
# Instalar todas las dependencias
pnpm install

# Si hay advertencias de peer dependencies, son normales y no afectan la funcionalidad
```

### 3. Lanzar en Modo Desarrollo
```bash
# Iniciar servidor de desarrollo
pnpm dev

# El proyecto estará disponible en:
# http://localhost:3000
```

### 4. Verificar Funcionamiento
- Abrir navegador en `http://localhost:3000`
- Verificar que la página carga correctamente
- Probar navegación entre páginas (Inicio, Sobre Nosotros, Contacto)
- Verificar cambio de idioma (Español/Inglés)
- Probar responsividad en diferentes tamaños de pantalla

## 📦 Build de Producción

### 1. Generar Build
```bash
# Crear build optimizado para producción
pnpm build

# Verificar que el build se complete sin errores
```

### 2. Probar Build Localmente
```bash
# Iniciar servidor de producción local
pnpm start

# Verificar en http://localhost:3000
```

### 3. Analizar Bundle (Opcional)
```bash
# Instalar herramienta de análisis
pnpm add --dev @next/bundle-analyzer

# Analizar tamaño del bundle
ANALYZE=true pnpm build
```

## 🌐 Despliegue en Vercel

### Opción 1: Despliegue Automático (Recomendado)
1. Conectar repositorio a Vercel
2. Configurar proyecto en dashboard de Vercel
3. Despliegue automático en cada push a main

### Opción 2: Despliegue Manual
```bash
# Instalar Vercel CLI
npm install -g vercel

# Autenticar
vercel login

# Desplegar
vercel

# Desplegar a producción
vercel --prod
```

### Configuración en Vercel
```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": ".next",
  "installCommand": "pnpm install",
  "framework": "nextjs"
}
```

## 🐳 Despliegue con Docker (Opcional)

### Crear Dockerfile
```dockerfile
FROM node:20-alpine AS base
WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm

# Copiar archivos de configuración
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copiar código fuente
COPY . .

# Build
RUN pnpm build

# Exponer puerto
EXPOSE 3000

# Comando de inicio
CMD ["pnpm", "start"]
```

### Comandos Docker
```bash
# Construir imagen
docker build -t easiful-web .

# Ejecutar contenedor
docker run -p 3000:3000 easiful-web
```

## 🔧 Scripts Disponibles

| Script | Comando | Descripción |
|--------|---------|-------------|
| Desarrollo | `pnpm dev` | Inicia servidor de desarrollo |
| Build | `pnpm build` | Genera build de producción |
| Inicio | `pnpm start` | Inicia servidor de producción |
| Lint | `pnpm lint` | Ejecuta linter (ESLint) |

## 🚨 Troubleshooting

### Problemas Comunes

#### 1. Error de Peer Dependencies
```bash
# Síntoma: Advertencias sobre peer dependencies
# Solución: Estas advertencias son normales y no afectan la funcionalidad
# Si causan problemas, instalar versiones específicas:
pnpm add react@^18.0.0 react-dom@^18.0.0
```

#### 2. Puerto 3000 en Uso
```bash
# Síntoma: Error "Port 3000 is already in use"
# Solución: Usar puerto diferente
pnpm dev -- --port 3001
```

#### 3. Problemas de Memoria
```bash
# Síntoma: Out of memory durante build
# Solución: Aumentar memoria para Node.js
NODE_OPTIONS="--max-old-space-size=4096" pnpm build
```

#### 4. Imágenes No Cargan
```bash
# Síntoma: Imágenes placeholder no se muestran
# Solución: Reemplazar URLs placeholder con imágenes reales
# Ubicación: app/page.tsx líneas 47-56
```

#### 5. Errores de TypeScript
```bash
# Síntoma: Errores de tipo durante desarrollo
# Solución temporal: Los errores están configurados para ser ignorados
# Solución permanente: Revisar y corregir tipos en el código
```

### Comandos de Diagnóstico
```bash
# Verificar estado del proyecto
pnpm run build

# Limpiar caché de Next.js
rm -rf .next

# Limpiar node_modules y reinstalar
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Verificar configuración
pnpm run lint
```

## 📊 Métricas de Performance

### Tiempos Esperados
- **Instalación**: 10-30 segundos
- **Inicio dev**: 3-5 segundos
- **Build**: 15-30 segundos
- **Tiempo de carga**: < 2 segundos

### Optimizaciones Recomendadas
1. **Imágenes**: Usar formato WebP y optimización automática
2. **Fonts**: Precargar fuentes críticas
3. **Bundle**: Implementar code splitting
4. **Cache**: Configurar headers de cache apropiados

## 🔐 Consideraciones de Seguridad

### Checklist de Seguridad
- [ ] Variables de entorno no expuestas en cliente
- [ ] Headers de seguridad configurados
- [ ] Dependencias actualizadas y sin vulnerabilidades
- [ ] HTTPS habilitado en producción
- [ ] CSP (Content Security Policy) configurado

### Comandos de Auditoría
```bash
# Auditar dependencias
pnpm audit

# Actualizar dependencias con vulnerabilidades
pnpm audit --fix
```

## 📞 Soporte

### Recursos Útiles
- **Documentación Next.js**: https://nextjs.org/docs
- **Documentación Tailwind**: https://tailwindcss.com/docs
- **Documentación Radix UI**: https://www.radix-ui.com/docs

### Contacto
Si encuentras problemas no cubiertos en esta guía, contacta al equipo de desarrollo.

---

**Última actualización**: 6 de Enero, 2025  
**Versión de la guía**: 1.0  
**Compatibilidad**: Node.js 18+, pnpm 8+ 