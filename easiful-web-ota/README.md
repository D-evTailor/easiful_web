# Copiar a easiful-web (OTA iOS)

Esta carpeta contiene **todo** lo necesario para que **easiful-web** (React) sirva la instalación OTA de la app iOS en easiful.es.

## Qué copiar al proyecto easiful-web

1. **Copia toda esta carpeta** (o su contenido) al repo **easiful-web**.
2. **En easiful-web:** coloca `manifest.plist`, `install.html` y **`easiful.ipa`** en la ruta que se sirva como **/ios/** (por ejemplo `public/ios/` en Create React App). Los tres deben quedar accesibles como `https://easiful.es/ios/manifest.plist`, `https://easiful.es/ios/install.html` y `https://easiful.es/ios/easiful.ipa`.
3. **Abre en Cursor el proyecto easiful-web** y usa **SPEC_PROMPT_OTA.md** como spec-prompt para que implemente las rutas y el Content-Type del plist.

## Contenido de esta carpeta

| Archivo | Uso |
|--------|-----|
| **easiful.ipa** | IPA Ad-Hoc; subir a `/ios/easiful.ipa` en el servidor. |
| **manifest.plist** | Subir a `/ios/manifest.plist`; servirlo con Content-Type: application/xml. |
| **install.html** | Subir a `/ios/install.html` (o ruta React equivalente). |
| **SPEC_PROMPT_OTA.md** | Spec-prompt para Cursor en easiful-web. |
| **ExportOptions.plist** | Referencia de la exportación Xcode (no subir al servidor). |
| **DistributionSummary.plist** | Referencia de la exportación Xcode (no subir al servidor). |
| **README.md** | Este archivo. |

## Enlace OTA (para compartir con testers)

```
itms-services://?action=download-manifest&url=https://easiful.es/ios/manifest.plist
```

O la página: **https://easiful.es/ios/install.html** (abrir en Safari en iPhone/iPad).
