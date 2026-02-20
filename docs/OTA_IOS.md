# OTA iOS (Ad-Hoc) en easiful-web

Este proyecto publica la instalacion OTA de iOS bajo `/ios/*`.

## URLs publicas

- `/ios/install.html`
- `/ios/manifest.plist`
- `/ios/easiful.ipa`

En produccion, el enlace OTA para testers es:

`itms-services://?action=download-manifest&url=https://easiful.es/ios/manifest.plist`

## Archivos y ubicacion

Los archivos deben vivir en `public/ios/`:

- `install.html`
- `manifest.plist`
- `easiful.ipa`

## Nota operativa

Cuando se genere un nuevo build Ad-Hoc desde Xcode, reemplazar `public/ios/easiful.ipa`.
Si cambia la version del build, actualizar solo `bundle-version` en `public/ios/manifest.plist`.

