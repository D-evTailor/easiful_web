# Authentication Flow Tests

Este directorio contiene las pruebas end-to-end (E2E) para el flujo de autenticación de la aplicación Easiful utilizando Playwright.

## 📋 Casos de Prueba Implementados

### Test Case 1: Intento de login de usuario no registrado
- **Objetivo**: Verificar que un usuario no registrado en Firebase no puede iniciar sesión
- **Comportamiento esperado**: 
  - Permanece en la página de login
  - Muestra mensaje "No eres parte de la familia Easiful" (ES) / "You are not part of the Easiful family" (EN)
  - No redirige al dashboard

### Test Case 2: Intento de login con credenciales incorrectas
- **Objetivo**: Verificar que un usuario existente con contraseña incorrecta no puede iniciar sesión
- **Comportamiento esperado**:
  - Permanece en la página de login
  - Muestra mensaje "Las credenciales son incorrectas" (ES) / "Invalid credentials" (EN)

### Test Case 3: Login exitoso
- **Objetivo**: Verificar que un usuario registrado puede iniciar sesión exitosamente
- **Comportamiento esperado**:
  - Redirige al dashboard
  - URL contiene `/dashboard`
- **Nota**: Requiere configurar datos de prueba en Firebase

### Test Case 4: Verificación de UI de registro deshabilitada
- **Objetivo**: Verificar que la funcionalidad de registro está deshabilitada
- **Comportamiento esperado**:
  - No hay enlaces a `/register` en la página de login
  - Existe botón "Descarga la App para registrarte" (ES) / "Download the App to Sign up" (EN)
  - Al hacer clic abre nueva pestaña a `https://easiful.vercel.app/`

### Test Case 5: Redirección de página de registro
- **Objetivo**: Verificar que el acceso directo a `/register` redirige al login
- **Comportamiento esperado**:
  - Redirige inmediatamente a la página de login
  - URL final es `/login`

## 🚀 Configuración y Ejecución

### Prerequisitos
```bash
# Instalar dependencias
pnpm install

# Instalar navegadores de Playwright
npx playwright install
```

### Variables de Entorno
Asegúrate de tener configuradas las siguientes variables de entorno en tu archivo `.env.local`:

```env
# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email

# NextAuth Configuration
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (si se usan las pruebas de Google)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Ejecutar las Pruebas

```bash
# Ejecutar todas las pruebas
npx playwright test

# Ejecutar pruebas en modo UI (recomendado para desarrollo)
npx playwright test --ui

# Ejecutar solo las pruebas de autenticación
npx playwright test auth-flow

# Ejecutar pruebas con reporte HTML
npx playwright test --reporter=html

# Ejecutar pruebas en modo debug
npx playwright test --debug

# Ejecutar pruebas para un idioma específico
npx playwright test --grep "Spanish Language Tests"
npx playwright test --grep "English Language Tests"
```

### Ejecutar con el Servidor de Desarrollo
Las pruebas están configuradas para iniciar automáticamente el servidor de desarrollo. Si quieres ejecutarlas manualmente:

```bash
# Terminal 1: Iniciar el servidor
pnpm dev

# Terminal 2: Ejecutar pruebas
npx playwright test
```

## 🗂️ Estructura de Archivos

```
test/
├── auth-flow.spec.ts          # Pruebas principales del flujo de autenticación
├── utils/
│   └── test-helpers.ts        # Utilidades y helpers para las pruebas
└── README.md                  # Esta documentación
```

## 🛠️ Configuración de Datos de Prueba

### Para Test Case 3 (Login Exitoso)
Para que el Test Case 3 funcione completamente, necesitas crear un usuario de prueba en Firebase:

1. **Crear usuario en Firebase Auth Console**:
   - Email: `test@valid.com`
   - Password: `validpassword123`

2. **Crear documento en Firestore** (opcional para datos de suscripción):
   ```javascript
   // Colección: users
   // Documento ID: [uid del usuario]
   {
     email: "test@valid.com",
     subscription: {
       status: "active",
       plan: "premium"
     }
   }
   ```

3. **Actualizar constantes en test-helpers.ts**:
   ```typescript
   VALID_TEST_USER: {
     email: 'test@valid.com',
     password: 'validpassword123'
   }
   ```

### Datos de Prueba Automática
Los tests utilizan emails aleatorios para casos de usuarios no existentes, por lo que no requieren configuración manual para la mayoría de casos.

## 🐛 Debugging y Troubleshooting

### Problemas Comunes

1. **Error de conexión con Firebase**:
   - Verifica las variables de entorno
   - Asegúrate de que el servicio account key es válido

2. **Timeouts en las pruebas**:
   - Asegúrate de que el servidor de desarrollo esté corriendo
   - Verifica que el puerto 3000 esté disponible

3. **Selectores no encontrados**:
   - Usa `--debug` para inspeccionar los elementos
   - Verifica que los textos de botones coincidan con los idiomas

### Generar Reporte de Pruebas
```bash
# Generar reporte HTML
npx playwright test --reporter=html

# Abrir reporte
npx playwright show-report
```

### Capturas y Videos
Las pruebas están configuradas para:
- Tomar capturas solo en caso de fallo
- Grabar videos solo en caso de fallo
- Generar trazas en reintentos

Los archivos se guardan en `test-results/`.

## 📊 CI/CD Integration

### GitHub Actions (Ejemplo)
```yaml
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: 18
    - name: Install dependencies
      run: pnpm install
    - name: Install Playwright
      run: npx playwright install --with-deps
    - name: Run Playwright tests
      run: npx playwright test
    - uses: actions/upload-artifact@v3
      if: always()
      with:
        name: playwright-report
        path: playwright-report/
```

## 🔧 Personalización

### Añadir Nuevos Tests
1. Crea un nuevo archivo `.spec.ts` en el directorio `test/`
2. Importa los helpers desde `utils/test-helpers.ts`
3. Sigue la estructura de los tests existentes

### Modificar Configuración
- Edita `playwright.config.ts` para cambiar configuraciones globales
- Modifica `test-helpers.ts` para añadir nuevas utilidades

### Soporte Multi-idioma
Los tests están preparados para ambos idiomas (ES/EN). Para añadir más idiomas:
1. Actualiza las constantes en `test-helpers.ts`
2. Añade los nuevos casos en `auth-flow.spec.ts`

## 📝 Mejores Prácticas

1. **Aislamiento**: Cada test debe ser independiente
2. **Datos de prueba**: Usa datos aleatorios cuando sea posible
3. **Esperas**: Siempre espera a que los elementos estén visibles antes de interactuar
4. **Limpieza**: Limpia los datos de prueba después de cada test
5. **Descripciones**: Usa descripciones claras en formato Given-When-Then

## 🤝 Contribución

Al añadir nuevos tests:
1. Sigue el patrón Given-When-Then en los comentarios
2. Usa los helpers existentes cuando sea posible
3. Añade documentación para nuevos casos de prueba
4. Asegúrate de que funcionen en ambos idiomas 