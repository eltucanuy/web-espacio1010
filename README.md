# web_espacio1010

Sitio institucional de **Espacio 1010** — [www.espacio1010.uy](https://www.espacio1010.uy).

Edificio centenario reciclado a nuevo en Gaboto 1010 (Cordón sur, Montevideo) con 12 espacios boutique por hora para profesionales de la salud y el bienestar. Este repo es la landing pública. La PWA de reservas vive aparte en [`espacio1010`](../espacio1010) y se publica en `agenda.espacio1010.uy`.

> **Lectura obligatoria antes de tocar código:**
> 1. [`docs/HANDOFF_2026_05_10.md`](./docs/HANDOFF_2026_05_10.md) — qué se hizo hoy, decisiones y estado actual.
> 2. [`docs/BACKLOG.md`](./docs/BACKLOG.md) — sección 🔥 al inicio con lo que toca charlar primero.

## Stack

- **Astro 6** (output static) + **Tailwind v4** (via PostCSS) + **React 19** islas
- TypeScript estricto
- Sitemap automático (`@astrojs/sitemap`)
- Hosting: Vercel
- Tipografías: Josefin Sans + Cormorant Garamond (placeholder por Belgiano Serif)

## Comandos

```bash
npm install
npm run dev      # localhost:4321
npm run build    # build estático a dist/
npm run preview  # preview del build
npm run check    # type-check con astro check
```

## Estructura

```
src/
  components/
    sections/        # Secciones grandes (Hero, Diferenciales, etc.)
    Analytics.astro  # Plausible + GTM stub (env-driven)
    Button.astro
    Container.astro
    ContactForm.tsx  # Island React — form que abre WhatsApp pre-rellenado
    EspacioCard.astro
    Footer.astro
    Logo.astro
    Nav.astro
    SectionHeader.astro
  layouts/
    BaseLayout.astro # Head + meta + schema LocalBusiness + Analytics + Nav + Footer
  lib/
    site.ts          # Constantes del negocio: ADDRESS, CONTACT, ESPACIOS, NICHOS, etc.
    nichos.ts        # Contenido por nicho para /para/[slug]
  pages/
    index.astro
    como-funciona.astro
    contacto.astro
    el-lugar.astro
    precios.astro
    preguntas-frecuentes.astro
    los-espacios/
      index.astro    # Grid de los 12 espacios
      [slug].astro   # Detalle de cada espacio (12 páginas generadas)
    para/
      [slug].astro   # Landings de nicho (6 páginas generadas)
  styles/
    global.css       # Tailwind v4 + tokens del brandboard
public/
  favicon.svg
  og-default.svg     # Imagen OpenGraph default — exportar a PNG para cobertura full
  robots.txt
```

## Variables de entorno

Ver `.env.example`. Copiá a `.env` para dev y configurá en Vercel para prod.

| Variable | Para qué |
|---|---|
| `PUBLIC_PLAUSIBLE_DOMAIN` | Dominio configurado en plausible.io. Si vacío, no carga. |
| `PUBLIC_GTM_ID` | Google Tag Manager container. La agencia de ads inyecta GA4 / Meta Pixel desde GTM. Si vacío, no carga. |

## Decisiones de arquitectura

- **Astro static** (no SSR). El sitio es contenido + conversión, no app — SSR no aporta.
- **Tailwind via PostCSS** (no via Vite plugin). El plugin Vite de Tailwind no es compatible con rolldown-vite de Astro 6. PostCSS sí.
- **Override de Vite a v7** en `package.json`. Algunas deps tiran Vite 8 y Astro 6 pide Vite 7.
- **Form de contacto** abre WhatsApp con mensaje pre-rellenado en vez de postear a backend. v1 sin infra. Cuando haga falta, swap-eás el handler de `ContactForm.tsx` por un fetch a Supabase / API endpoint.
- **Belgiano Serif (paga)** reemplazado por Cormorant Garamond (Google Fonts) hasta licenciar. Sustituir en `src/styles/global.css` (`--font-display`) y en el `<link>` de fonts en `BaseLayout.astro`.
- **Sin cookie banner**: Plausible no usa cookies. Cuando la agencia active GA4 vía GTM, evaluar si necesita banner según jurisdicción.

## Pendientes hasta el launch

Bloqueantes para producción definitiva:

- [ ] **Confirmar 9 o 12 espacios** (CLAUDE.md de la PWA dice 9, acá decimos 12). Editar `ESPACIOS` en `src/lib/site.ts` cuando se resuelva.
- [ ] **Precios reales** en `src/pages/precios.astro` (placeholders `TBD`).
- [ ] **Números de WhatsApp reales** en `src/lib/site.ts` (`CONTACT.whatsappLeads`).
- [ ] **Instagram real** en `src/lib/site.ts` (`SOCIAL.instagram`).
- [ ] **Fotos profesionales** del edificio — reemplazar placeholders SVG en hero, espacios, el-lugar.
- [ ] **Testimoniales reales** — placeholders en `src/lib/nichos.ts` y en `Hero.astro`.
- [ ] **OG image PNG 1200×630** (`public/og-default.png`) — el SVG actual funciona en mayoría de scrapers pero Twitter/LinkedIn legacy piden PNG.
- [ ] **Favicons completos** (apple-touch-icon, manifest, etc.) — generar set con realfavicongenerator.
- [ ] **Licenciar Belgiano Serif** o decidir definitivamente Cormorant.

No bloqueantes pero importantes:

- [ ] **Coordenadas exactas** del edificio en `src/lib/site.ts` (`ADDRESS.lat/lng`) — verificar en Google Maps.
- [ ] **Código postal exacto** del Cordón sur.
- [ ] **Mapa real**: hoy usamos OpenStreetMap embed básico. Considerar Google Maps embed para mejor UX si la agencia lo pide.
- [ ] **Form a Supabase**: si querés persistir leads aunque el usuario no termine de mandar el WhatsApp, conectar `ContactForm.tsx` a un endpoint que postee a la tabla `leads` de Supabase.

## Despliegue

Push a `main` → Vercel deploya automáticamente.

Setear en Vercel:
- Production domain: `www.espacio1010.uy` + redirect de `espacio1010.uy` → `www.espacio1010.uy`
- Variables de entorno (las del `.env.example`)
