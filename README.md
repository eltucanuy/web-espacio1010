# web_espacio1010

Sitio de **Espacio 1010** — [www.espacio1010.uy](https://www.espacio1010.uy).

Edificio centenario reciclado a nuevo en **Gaboto 1010, entre Palermo y Parque Rodó (Montevideo)**, con 12 consultorios y salas boutique que se alquilan por hora. La **home (`/`) es una landing de conversión** cuyo objetivo es el pre-registro; el resto del sitio son páginas de contenido/SEO. La PWA de reservas vive aparte en [`espacio1010`](../espacio1010) y se publica en `agenda.espacio1010.uy`.

> **Lectura obligatoria antes de tocar código:**
> 1. [`docs/HANDOFF_2026_06_03.md`](./docs/HANDOFF_2026_06_03.md) — **último estado**: sesión de optimización de conversión (CRO) de la home (hero, jerarquía, seguridad, cancelación, testimonios reales, flujo del form).
> 2. [`docs/HANDOFF_2026_06_02.md`](./docs/HANDOFF_2026_06_02.md) — base: landing como home, design system, flujo de conversión.
> 3. [`docs/BACKLOG.md`](./docs/BACKLOG.md) — pendientes priorizados.

## Stack

- **Astro 6** (output static) + **Tailwind v4** (vía PostCSS) + **React 19** islas
- TypeScript estricto · Sitemap automático (`@astrojs/sitemap`)
- Hosting: **Vercel** · Backend de leads: **Supabase**
- Tipografía: **Inter** (sans + display), self-host vía `@fontsource/inter`

## Comandos

```bash
npm install
npm run dev      # localhost:4321
npm run build    # build estático a dist/
npm run preview  # preview del build
npm run check    # type-check con astro check
vercel deploy --prod --yes   # deploy a producción (alias www.espacio1010.uy)
```

## Flujo de conversión (home)

```
Form (nombre/apellido/WhatsApp) → INSERT en Supabase pre_registros
  → dataLayer event 'lead_preregistro' (Meta Pixel/Google Ads vía GTM)
  → redirect a agenda.espacio1010.uy/c/BIENVENIDA1010?nombre=&apellido=&telefono=
  → la PWA precarga el registro + cupón → cuenta creada + 1ª hora gratis
```

## Estructura

```
src/
  components/
    Analytics.astro       # Plausible + GTM (env-driven)
    Button.astro · Container.astro · SectionHeader.astro
    Nav.astro · Footer.astro · Logo.astro · FloatingWhatsApp.astro · Enhancements.astro
    EspacioCard.astro     # Card de espacio (la usa /para/[slug])
    ContactForm.tsx       # Island React del form de /contacto (abre WhatsApp)
  layouts/
    LandingLayout.astro   # HOME (/) y /privacidad — SIN menú, Inter, GTM, footer mínimo
    BaseLayout.astro      # Páginas internas — con Nav + Footer + schema LocalBusiness
  lib/
    site.ts               # Negocio: SITE, ADDRESS, CONTACT, SOCIAL, LANZAMIENTO, ESPACIOS, NICHOS…
    nichos.ts             # Contenido por nicho para /para/[slug]
    schema.ts             # Helpers Schema.org
  pages/
    index.astro           # HOME = landing de conversión
    privacidad.astro
    los-espacios/ (index + [slug])  ·  para/[slug]
    el-lugar · como-funciona · precios · contacto · preguntas-frecuentes
    alquiler-consultorio-montevideo · 404
    og/[slug].ts          # OG images dinámicas
  styles/global.css       # Tailwind v4 + tokens (Inter, blanco/gris, terracota)
public/  logo.svg · isotipo.svg · wordmark-light.svg · og-image.png · favicon.* · robots.txt · fotos/
```

## Variables de entorno

Ver `.env.example`. Copiá a `.env` para dev y configurá en Vercel para prod.

| Variable | Para qué |
|---|---|
| `PUBLIC_SUPABASE_URL` | Proyecto Supabase — **necesaria para guardar leads** del form. |
| `PUBLIC_SUPABASE_ANON_KEY` | Clave publicable de Supabase (segura para cliente). |
| `PUBLIC_GTM_ID` | Google Tag Manager (`GTM-WQT4VNXV`). La agencia inyecta GA4/Meta Pixel desde GTM. |
| `PUBLIC_PLAUSIBLE_DOMAIN` | Dominio en plausible.io. Si vacío, no carga. |

> Si faltan las de Supabase, el form de pre-registro **falla en silencio**.

## Decisiones de arquitectura

- **Astro static** (no SSR). El sitio es contenido + conversión; sin server. El form postea a Supabase desde el cliente con la clave publicable + RLS (solo INSERT).
- **Tailwind vía PostCSS** (no plugin Vite): el plugin Vite de Tailwind no es compatible con rolldown-vite de Astro 6.
- **Inter self-host** (`@fontsource/inter`) en ambos layouts — alineado a la PWA, sin Google Fonts.
- **Dos layouts**: `LandingLayout` (home, sin menú, foco conversión) vs `BaseLayout` (internas, con menú).
- **Leads en Supabase** (`pre_registros`, proyecto compartido con la PWA), RLS insert-only.

## Despliegue

`vercel deploy --prod` (alias `www.espacio1010.uy`). Las env vars ya están en Vercel producción. Rollback: revertir el commit y re-deployar.

## Pendientes

Ver `docs/HANDOFF_2026_06_03.md` §8 (lo más actual) y `docs/BACKLOG.md`. En corto: **fotos reales** de los espacios (desbloquean OG con foto + re-OK final), **medición `cuenta_creada`** en GTM/Ads (agencia), confirmar 9 vs 12 espacios, y que la fecha exacta de apertura no quede en internas.
