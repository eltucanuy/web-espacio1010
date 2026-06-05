# Handoff · 2026-06-05 (sesión 2) · Fix de GTM — no ejecutaba en producción

Sesión corta y quirúrgica, **independiente** del otro handoff de hoy ([`HANDOFF_2026_06_05.md`](./HANDOFF_2026_06_05.md), feedback de pareja/amigos). Disparador: **la agencia reportó que "el GTM reporta NO estar instalado en la web"** y Tag Assistant daba timeout al conectar.

Resultado: era un **bug real del sitio**. GTM estaba en el HTML pero **nunca ejecutaba** — roto **desde el lanzamiento**. Corregido, deployado y **verificado en producción en el navegador**. Todo en `main`.

---

## 1 · TL;DR

- El snippet de GTM en [`src/components/Analytics.astro`](../src/components/Analytics.astro) estaba **mal escrito**: el código quedaba **atrapado dentro de un template literal que JavaScript evaluaba como string y descartaba**. El `<script>` "corría" sin error pero **no creaba `dataLayer` ni cargaba `gtm.js`**.
- Síntomas: `google_tag_manager` → `undefined` en el navegador; Tag Assistant no conectaba; la agencia veía "no instalado". El `curl` **sí** veía el tag (el texto estaba en el HTML), lo que despistaba.
- **Fix:** rearmar el snippet como string en el frontmatter e inyectarlo con **`set:html`** (patrón correcto de Astro para scripts inline con valores dinámicos).
- Commit `44c818c`, deployado. Verificado en `www.espacio1010.uy`: container **`GTM-WQT4VNXV`** carga solo.

---

## 2 · La causa raíz (para no repetirla)

El componente mezclaba **dos mecanismos de Astro incompatibles** en el mismo `<script>`:

```astro
<!-- ❌ ROTO -->
<script is:inline define:vars={{ gtmId }}>
  {`
    (function(w,d,s,l,i){ ...código de GTM... })(window,document,'script','dataLayer','${gtmId}');
  `}
</script>
```

- Dentro de un `<script>` con directiva (`is:inline` o `define:vars`), **el contenido es texto crudo**: Astro **NO evalúa** la expresión JSX `{`...`}`.
- Por eso el `{` y los backticks salían **literales** al HTML. El navegador interpretaba eso como un bloque `{ }` con un **template literal suelto** → JS lo evalúa como un string y lo tira. El código de GTM nunca se ejecutaba.
- Como era JS sintácticamente válido, **no había error en consola** (y aparecía `data-astro-exec`, que es solo la marca normal del ClientRouter — despista, pero no era la causa).

```astro
<!-- ✅ CORRECTO -->
---
const gtmSnippet = `(function(w,d,s,l,i){ ...código de GTM... })(window,document,'script','dataLayer','${gtmId}');`;
---
<script is:inline set:html={gtmSnippet} />
```

`set:html` **sí** evalúa la expresión (el string armado en el frontmatter, con `${gtmId}` ya interpolado) y mete JS ejecutable de verdad.

> **Regla para el futuro:** dentro de un `<script>` con directiva, nunca uses `{`...`}`. Si necesitás interpolar un valor, armá el string en el frontmatter y usá `set:html={...}`.

---

## 3 · Cómo se diagnosticó (método)

1. `curl` a prod → el tag `GTM-WQT4VNXV` y `gtm.js` **estaban** en el HTML, y el container estaba **publicado** (v4, con tags). Descartado: "sin instalar" / "sin publicar" / "container equivocado".
2. Se descartó el host: el apex `espacio1010.uy` hace **307 → `www`**; ambos terminan en el mismo HTML con el snippet.
3. **Chrome DevTools / MCP en el sitio en vivo:** `dataLayer` y `google_tag_manager` **undefined**, y el `<script src=gtm.js>` **nunca se inyectó** → el snippet inline **no ejecutaba** (no era una extensión bloqueando, eso habría dejado `dataLayer` definido).
4. Inyectando el snippet **a mano** en la consola → container cargó (`container_loaded: true`). Confirmado: el contenido era correcto, el problema era que Astro no lo ejecutaba.
5. **`curl` del tag exacto renderizado** → se vio el código atrapado en `{`...`}`. Causa raíz encontrada.
6. Fix → `npm run build` + `astro preview` + chequeo en navegador (localhost) → OK. Deploy → re-chequeo en `www` → OK.

> Aprendizajes de proceso: **un `curl` que ve el tag NO prueba que ejecute** (hay que mirar el DOM/JS en el navegador). Y el primer intento de fix (solo quitar `define:vars`) **no alcanzó** porque `is:inline` igual deja el `{`...`}` literal — recién `set:html` lo resolvió. Verificar siempre el HTML **buildeado**, no asumir.

---

## 4 · Verificación (producción, en navegador)

`https://www.espacio1010.uy` →
- `dataLayer`: object (3 eventos) ✅
- `google_tag_manager`: object ✅
- `gtm.js` inyectado: 1 ✅
- `google_tag_manager['GTM-WQT4VNXV']`: definido ✅

---

## 5 · Mensaje para la agencia

> Era un bug del sitio: GTM estaba en el HTML pero no ejecutaba. Ya está corregido y deployado en producción. Reintenten Tag Assistant usando la URL **`https://www.espacio1010.uy`** (con `www`) y van a ver el container **`GTM-WQT4VNXV`** cargando. Si prueban con un navegador con bloqueador de ads/rastreadores, `googletagmanager.com` puede aparecer bloqueado igual → verificar en ventana limpia/incógnito.

---

## 6 · Commit

```
44c818c  fix(analytics): GTM no ejecutaba en prod (snippet atrapado en template literal)
```
Deploy: automático por push a `main` (Vercel). Rollback: revertir el commit y re-deployar.

---

## 7 · Lo que sigue (sin cambios respecto al otro handoff)

- 🟡 **Tags dentro de GTM** (Meta Pixel + Google Ads sobre `lead_preregistro`) — ahora **desbloqueado** (GTM por fin ejecuta). En cancha de la agencia.
- 🟡 **Medición `cuenta_creada`** en GTM/Ads — en cancha de la agencia / equipo PWA.
- Resto de pendientes: ver [`HANDOFF_2026_06_05.md`](./HANDOFF_2026_06_05.md) §8 y [`BACKLOG.md`](./BACKLOG.md).
