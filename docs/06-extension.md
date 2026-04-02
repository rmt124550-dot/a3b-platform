# 06 — Extensión de Navegador

## Versión actual: 3.0.0

## Archivos

| Archivo | Función |
|---------|---------|
| `manifest.json` | Configuración MV3 — permisos, host permissions, content scripts |
| `compat.js` | Polyfill `chrome.*` ↔ `browser.*` para Firefox/Chrome |
| `background.js` | Service Worker — JWT refresh automático, relay de mensajes |
| `content.js` | Motor principal — detección subtítulos + traducción + TTS + historial |
| `popup.html` | UI del popup — tabs: Narrador / Ajustes / Cuenta / Android |
| `popup.js` | Lógica del popup — auth, toggle, settings, sync con backend |

## Flujo de content.js

```
Página carga en plataforma soportada
        │
        ▼
loadConfig() → chrome.storage.local
        ├── settings (velocidad, voz, idioma...)
        ├── user (plan, nombre)
        └── accessToken
                │
                ▼
        startObserver()
        MutationObserver sobre document.body
                │
                │  Subtítulo detectado (debounce 180ms)
                ▼
        processSubtitle(text)
                │
                ├── ¿Está en cache local? → usar directamente
                │
                ├── ¿PRO/Team + autenticado?
                │   └── sendToBackground('API_CALL', POST /api/translate)
                │       └── background.js lo ejecuta con JWT
                │
                └── ¿Free o fallo?
                    └── Google Translate API pública (fallback)
                            │
                            ▼
                    speak(translated)  → SpeechSynthesisUtterance
                    updateOverlay(original, translated)
                    saveHistory(original, translated) → si PRO/Team
```

## Selectores de subtítulos por plataforma

```javascript
coursera:  '.rc-SubtitleText', '[class*="SubtitleText"]', '.vjs-text-track-cue', ...
youtube:   '.ytp-caption-segment', '.captions-text'
udemy:     '[class*="captions--container"]', '[class*="CaptionDisplayArea"]'
edx:       '.subtitles-menu li.current', '.subtitles span'
linkedin:  '.captions__caption-text', '[data-test-caption]'
```

## Mensajes entre popup y content script

| Tipo | Dirección | Payload | Descripción |
|------|----------|---------|-------------|
| `TOGGLE` | popup → content | `{ value: bool }` | Activar/desactivar narrador |
| `STOP` | popup → content | — | Detener narración actual |
| `UPDATE_SETTINGS` | popup → content | `{ settings }` | Actualizar configuración en vivo |
| `GET_STATUS` | popup → content | — | Obtener estado actual |
| `TEST_VOICE` | popup → content | `{ text? }` | Probar voz |
| `AUTH_UPDATED` | popup → content | `{ user }` | Notificar cambio de auth |
| `API_CALL` | content → background | `{ path, options }` | Llamada autenticada a la API |
| `GET_AUTH` | content → background | — | Obtener user y token del storage |
| `LOGOUT` | popup → background | — | Limpiar tokens del storage |

## Autenticación en la extensión

El popup permite login directamente (sin abrir el navegador). Al autenticarse:

1. `accessToken` y `refreshToken` se guardan en `chrome.storage.local`
2. `background.js` renueva el `accessToken` cada 10 minutos via alarm
3. Todas las llamadas al backend pasan por `background.js` que agrega el header JWT
4. Al expirar ambos tokens, se limpia el storage y el popup pide login de nuevo

## Configuración disponible (settings)

| Setting | Rango | Default | Plan |
|---------|-------|---------|------|
| voiceSpeed | 0.5 – 2.0 | 1.0 | Todos |
| voiceVolume | 0 – 1.0 | 1.0 | Todos |
| voicePitch | 0.5 – 2.0 | 1.0 | Todos |
| voiceName | Lista del sistema | Automática | Todos |
| targetLang | es, pt, fr, de, it, ja, ko, zh, ar, ru | es | PRO+ para ≠ es |
| showOverlay | true/false | true | Todos |
| translator | google / deepl | google | PRO+ para deepl |

Al guardar en el popup, los settings se sincronizan con el backend (`PATCH /api/user/settings`) si el usuario está autenticado.

## Compatibilidad

| Navegador | Cómo instalar | Notas |
|-----------|--------------|-------|
| Chrome desktop | `chrome://extensions` → Cargar descomprimida | Requiere modo desarrollador |
| Edge desktop | `edge://extensions` → Cargar descomprimida | Igual que Chrome |
| Firefox desktop | `about:debugging` → Cargar extensión temporal | O firmar para distribución |
| Kiwi Browser (Android) | `kiwi://extensions` → Load extension (.zip) | Mismo ZIP que Chrome |
| Firefox Nightly (Android) | Colección AMO | Requiere cuenta AMO |
| Chrome/Samsung Android | Bookmarklet en `a3bhub.cloud/docs` | Sin extensión, funcionalidad básica |
