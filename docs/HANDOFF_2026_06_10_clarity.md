# Handoff · 2026-06-10 (sesión 2) · Microsoft Clarity instalado + decisión "sin cookie banner"

Sesión corta, **independiente** del otro handoff de hoy ([`HANDOFF_2026_06_10.md`](./HANDOFF_2026_06_10.md), fotos reales). Disparador: la agencia recomendó instalar **Microsoft Clarity** (heatmaps + grabaciones de sesión). Rafa lo instaló él mismo y quedó **verificado funcionando en producción**.

---

## 1 · TL;DR

- **Clarity está vivo en producción** en `www.espacio1010.uy`. Proyecto "Landing Espacio 1010", **Project ID `x54cr9uda2`**, en la cuenta Clarity de Rafa (`rafael@cernicchiaro...`).
- Instalado **vía GTM, sin tocar código del sitio** (coherente con la arquitectura de [`Analytics.astro`](../src/components/Analytics.astro): las herramientas de terceros entran por GTM). Rafa usó la **integración automática Clarity → GTM**, que creó y publicó sola el tag **"Microsoft Clarity - Official"** (activador All Pages) en el container **`GTM-WQT4VNXV`**.
- **Decisión firme de Rafa: NO se pone cookie banner** aunque GA4/Clarity usen cookies. Tampoco se gestiona enmascarado de campos en Clarity. Tema cerrado — no reabrir. El comentario de `Analytics.astro` se actualizó para reflejarlo (único cambio de código de la sesión).
- Hallazgo lateral: la agencia ya metió el **Meta Pixel** en GTM (~2026-06-05) → uno de sus pendientes ya está hecho.

---

## 2 · Qué se hizo

1. **Evaluación** — Clarity conviene: gratis, sin límite de tráfico, complementa a Plausible (Plausible dice *cuánto* convierte; Clarity muestra *por qué* abandonan: scroll, clicks, grabaciones).
2. **Instalación (la hizo Rafa)** — creó el proyecto en clarity.microsoft.com y usó la integración **"Install on Google Tag Manager"**: conectó la cuenta GTM "Espacio 1010" / container `espacio1010.uy` (= `GTM-WQT4VNXV`). La integración creó el tag y **lo publicó automáticamente** (el workspace quedó con "Cambios del espacio: 0", sin nada pendiente).
3. **También conectó** la integración Clarity ↔ **Google Ads** (cuenta 6844358491). Microsoft Ads y Google Analytics quedaron sin conectar — son opcionales, no hacen falta.
4. **Verificación en producción** (vía Chrome MCP en el sitio en vivo) — ver §4.
5. **Código** — solo se actualizó el comentario de `Analytics.astro`: antes decía "si la agencia activa GA4 con cookies, tocaría meter banner; coordinarlo"; ahora documenta la decisión de **no** poner banner.

---

## 3 · Decisiones tomadas

- **Sin cookie banner, definitivo.** Rafa lo decidió explícito ("NO PONER NADA"), aunque GA4 y Clarity seteen cookies (`_clck`, `_clsk`). En Uruguay la exigencia es laxa; es decisión consciente, no omisión. **No volver a sugerirlo.**
- **Enmascarado de campos del form en Clarity: no relevante** para Rafa. Tampoco reabrir.
- **Instalación vía GTM y no en el código** — mantiene el desacople: el sitio solo renderiza Plausible + el container GTM; todo lo demás (GA4, Meta Pixel, Clarity) vive dentro de GTM.

---

## 4 · Verificación (producción, en navegador)

`https://www.espacio1010.uy` →
- `window.clarity`: function ✅
- Scripts cargando: `https://www.clarity.ms/tag/x54cr9uda2?ref=gtm` + `https://scripts.clarity.ms/0.8.65/clarity.js` ✅
- GTM: container `GTM-WQT4VNXV` con `gtm.js → gtm.dom → gtm.load` ✅
- El `gtm.js` publicado incluye Clarity **y** Meta Pixel (verificado fetcheando el script con cache-bust).

> ⚠️ **Trampa de caché para futuras verificaciones:** `gtm.js` se cachea ~15 min en el navegador. Justo después de publicar en GTM, un chequeo en vivo puede dar **falso negativo** (acá pasó: dos chequeos dieron "Clarity no está" con el tag ya publicado). Para verificar de verdad: `fetch('https://www.googletagmanager.com/gtm.js?id=GTM-WQT4VNXV&nocache='+Date.now())` y buscar el string en el texto, o forzar `fetch(url, {cache:'reload'})` + reload.

---

## 5 · Estado del stack de medición (foto al 2026-06-10)

| Herramienta | Estado | Dónde vive |
|---|---|---|
| Plausible | ✅ activo | Código del sitio (`Analytics.astro`) |
| GTM `GTM-WQT4VNXV` | ✅ activo (fix 2026-06-05) | Código del sitio |
| Meta Pixel | ✅ tag en GTM (agencia, ~05/06) | GTM |
| Microsoft Clarity | ✅ activo (esta sesión) | GTM, project `x54cr9uda2` |
| GA4 / Google Ads tags sobre `lead_preregistro` | 🟡 pendiente | En cancha de la agencia |
| Medición `cuenta_creada` | 🟡 pendiente | Agencia / equipo PWA |
| Cookie banner | ❌ **no va** (decisión) | — |

---

## 6 · Commit

```
(esta sesión)  chore(analytics): Clarity vía GTM documentado + decisión sin cookie banner
```
Solo docs + comentario en `Analytics.astro` — **no hay cambio de comportamiento del sitio** (Clarity entró por GTM, fuera del repo). Nada que deployar con urgencia; el deploy de Vercel por push a `main` no afecta nada visible.

---

## 7 · Lo que sigue

- Dashboards de Clarity: **Grabaciones** en minutos, mapas de calor/paneles completos en ~2 hs. Revisar en unos días dónde abandona la gente antes del pre-registro.
- 🟡 Avisar a la agencia que Clarity ya está instalado y publicado en su container (lo agregó Rafa), para que no dupliquen el tag.
- Resto de pendientes sin cambios: GA4/Google Ads sobre `lead_preregistro`, `cuenta_creada`, y lo de [`HANDOFF_2026_06_10.md`](./HANDOFF_2026_06_10.md) (fotos de consultorios) / [`BACKLOG.md`](./BACKLOG.md).
