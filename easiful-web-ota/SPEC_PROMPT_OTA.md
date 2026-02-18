# Spec-prompt: OTA iOS para Easiful (easiful-web)

**Objetivo:** Que el proyecto **easiful-web** (React) sirva la instalación OTA de la app iOS Easiful (IPA Ad-Hoc) en el dominio de producción (https://easiful.es).

---

## Contexto (hechos)

- La app móvil **Easiful** se distribuye en iOS como **IPA Ad-Hoc** (no App Store).
- Para instalar sin cable, iOS usa el esquema **itms-services** con un **manifest.plist** en HTTPS.
- El dominio de la web es **easiful.es** (HTTPS).
- Los archivos necesarios son:
  - **easiful.ipa** (binario; se sube manualmente tras cada export desde Xcode).
  - **manifest.plist** (XML en formato plist; debe servirse con `Content-Type: application/xml` o `text/xml`).
  - **install.html** (página con un botón/enlace para abrir el itms-services; opcional pero recomendada).

---

## Requisitos funcionales (contrato)

1. **URLs públicas (HTTPS, sin autenticación para estos recursos):**
   - `GET /ios/easiful.ipa` → devuelve el archivo binario IPA.
   - `GET /ios/manifest.plist` → devuelve el plist con cabecera **Content-Type: application/xml** (o text/xml).
   - `GET /ios/install.html` (o ruta equivalente, p. ej. `/ios` o `/install-ios`) → página con el enlace de instalación OTA.

2. **Enlace OTA (invariable):**
   ```
   itms-services://?action=download-manifest&url=https://easiful.es/ios/manifest.plist
   ```
   - El `install.html` debe usar exactamente esta URL en el href del botón/enlace.

3. **Contenido del manifest.plist:**
   - Ya proporcionado en la carpeta que copiaste desde el repo Easiful; la URL del IPA dentro del plist debe ser: `https://easiful.es/ios/easiful.ipa`.
   - No cambiar `bundle-identifier` (com.devtailor.easiful); si en el futuro cambia el build number, actualizar solo la clave `bundle-version` en el plist.

4. **No exigir login/cookie** para acceder a `/ios/*` (ni al .ipa ni al .plist ni a install.html), para que Safari en iOS pueda descargar sin intervención.

---

## Implementación esperada en easiful-web (React)

- **Opción A (recomendada si hay carpeta `public/`):**
  - En `public/ios/` colocar: `manifest.plist`, `install.html`, y (en deploy) el archivo `easiful.ipa`.
  - Configurar el servidor (o el host: Vercel/Netlify/Node) para que las peticiones a `*.plist` devuelvan `Content-Type: application/xml`.
  - Si el host no permite configurar tipos MIME para `public/`, implementar un endpoint o rewrite que sirva `manifest.plist` con la cabecera correcta.

- **Opción B (React + Node/Express):**
  - Ruta estática (p. ej. `express.static('public/ios')`) para `/ios` con los tres archivos.
  - Middleware o ruta específica para `GET /ios/manifest.plist` que envíe `Content-Type: application/xml`.

- **Página de instalación:** Puede ser el `install.html` estático en `public/ios/install.html`, o una ruta React (p. ej. `/install-ios`) que renderice el mismo contenido: título "Instalar Easiful", párrafo explicando "Abrir en Safari en iPhone/iPad", y enlace:
  ```html
  <a href="itms-services://?action=download-manifest&url=https://easiful.es/ios/manifest.plist">Instalar Easiful</a>
  ```

---

## Criterios de aceptación (verificables)

1. `https://easiful.es/ios/manifest.plist` responde 200 y con `Content-Type: application/xml` (o text/xml).
2. `https://easiful.es/ios/install.html` (o la ruta elegida) muestra la página con el enlace OTA y el href es el itms-services indicado.
3. Cuando exista `easiful.ipa` en el servidor, `https://easiful.es/ios/easiful.ipa` devuelve el archivo (200, tipo binario).
4. No se exige autenticación para ninguna de estas tres URLs.

---

## Archivos proporcionados (en esta carpeta)

- **manifest.plist** → colocar en la ruta que se sirva como `/ios/manifest.plist`.
- **install.html** → colocar en la ruta que se sirva como `/ios/install.html` (o integrar su contenido en una vista React).
- **easiful.ipa** → no se incluye aquí; se sube manualmente tras exportar desde Xcode (Archive → Ad Hoc). Debe estar accesible como `/ios/easiful.ipa`.

---

## Resumen para Cursor (en el repo easiful-web)

1. Asegurar que exista la ruta `/ios/` en el sitio (public o estática).
2. Servir `manifest.plist` e `install.html` desde esa ruta; garantizar **Content-Type: application/xml** para el .plist.
3. Documentar en el repo que el archivo `easiful.ipa` debe colocarse en el mismo lugar para que `/ios/easiful.ipa` esté disponible.
4. El enlace OTA que compartir con testers es: `itms-services://?action=download-manifest&url=https://easiful.es/ios/manifest.plist`, o la página `https://easiful.es/ios/install.html` para abrir en Safari.
