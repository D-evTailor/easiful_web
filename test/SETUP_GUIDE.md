# 🚀 Quick Setup Guide for Authentication Tests

Esta guía te ayudará a configurar y ejecutar rápidamente las pruebas de autenticación.

## ⚡ Configuración Rápida

### 1. Instalar Dependencias
```bash
# Instalar Playwright y dependencias
pnpm install
npx playwright install
```

### 2. Configurar Variables de Entorno
Copia el archivo de ejemplo y configura tus variables:
```bash
cp test/example.env .env.local
```

Edita `.env.local` con tus credenciales de Firebase y NextAuth.

### 3. Ejecutar las Pruebas

```bash
# Opción 1: Ejecutar todas las pruebas (modo headless)
pnpm test

# Opción 2: Ejecutar con interfaz visual (recomendado para primera vez)
pnpm test:ui

# Opción 3: Solo las pruebas de autenticación
pnpm test:auth

# Opción 4: Modo debug (para troubleshooting)
pnpm test:debug
```

## 🎯 Casos de Prueba Disponibles

### ✅ Funcionan sin configuración adicional:
- **Test Case 1**: Login con usuario no existente
- **Test Case 2**: Login con credenciales incorrectas  
- **Test Case 4**: Verificación de UI de registro deshabilitada
- **Test Case 5**: Redirección de página de registro

### ⚙️ Requiere configuración:
- **Test Case 3**: Login exitoso (necesita usuario de prueba en Firebase)

## 🔧 Configuración de Usuario de Prueba (Opcional)

Para habilitar Test Case 3, crea un usuario en Firebase Auth:

1. Ve a Firebase Console → Authentication → Users
2. Añadir usuario:
   - Email: `test@valid.com`
   - Password: `validpassword123`
3. Las pruebas usarán automáticamente estas credenciales

## 📊 Ver Resultados

Después de ejecutar las pruebas:

```bash
# Ver reporte HTML detallado
npx playwright show-report

# Los screenshots y videos de fallos están en:
# test-results/
```

## 🐛 Troubleshooting Rápido

### Error: "Cannot connect to localhost:3000"
```bash
# Asegúrate de que el servidor esté corriendo
pnpm dev
```

### Error: "Firebase configuration missing"
- Verifica que `.env.local` tenga las variables de Firebase configuradas
- Usa `test/example.env` como referencia

### Tests fallan en selectores
- Ejecuta `pnpm test:debug` para inspeccionar los elementos
- Verifica que los textos de botones coincidan con los idiomas

## 📋 Comandos Útiles

```bash
# Ver todos los tests disponibles
npx playwright test --list

# Ejecutar solo tests en español
npx playwright test --grep "Spanish Language Tests"

# Ejecutar solo tests en inglés  
npx playwright test --grep "English Language Tests"

# Ejecutar en un solo navegador
npx playwright test --project=chromium

# Ejecutar con modo headed (ver navegador)
pnpm test:headed
```

## 🎯 Próximos Pasos

1. Ejecuta `pnpm test:ui` para ver las pruebas en acción
2. Configura un usuario de prueba para Test Case 3
3. Personaliza las pruebas según tus necesidades
4. Añade las pruebas a tu pipeline de CI/CD

¡Listo para probar! 🚀 