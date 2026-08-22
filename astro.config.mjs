// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

const SITE = 'https://www.espacio1010.uy';

// https://astro.build/config
// Nota: Tailwind v4 se carga vía PostCSS (postcss.config.mjs) — el plugin
// @tailwindcss/vite no es compatible con rolldown-vite que usa Astro 6.
export default defineConfig({
  site: SITE,
  output: 'static',
  // Vercel sirve el sitio con "trailingSlash": false (vercel.json): /guias/foo
  // responde 200 y /guias/foo/ redirige 308. Fijamos acá la misma forma para que
  // el sitemap y los <link rel="canonical"> emitan exactamente esa URL — si no,
  // Astro construye en formato directorio y publicamos URLs que redirigen con
  // canónico contradictorio (ver docs/MEDICION_SEO_2026_08_22.md).
  trailingSlash: 'never',
  integrations: [
    react(),
    sitemap({
      // Sitio completo en sitemap, excepto: mockups (lp*, /mockups), privacidad (noindex)
      // y landings de campañas pagas (/campanas/).
      // Comparamos sobre el pathname sin barra final para no depender del
      // formato de build (con trailingSlash 'never' las URLs ya vienen sin barra).
      filter: (page) => {
        const path = new URL(page).pathname.replace(/\/+$/, '');
        return (
          !path.startsWith('/campanas') &&
          path !== '/privacidad' &&
          !/^\/(lp[0-9]?|mockups)$/.test(path)
        );
      },
      // Nota: con trailingSlash 'never' la integración emite la home como origen
      // pelado (https://www.espacio1010.uy) — lo hace con un stream-replace
      // interno, no se puede cambiar desde acá. Es la misma URL que
      // "https://www.espacio1010.uy/" del canónico (RFC 3986: path vacío ≡ "/").
    }),
  ],
  build: {
    // Formato 'directory' (el default): guias/foo/index.html. NO usar 'file' —
    // con ese formato Astro.url.pathname pasa a ser "/guias/foo.html" y el
    // canónico saldría con la extensión. Vercel resuelve /guias/foo contra
    // guias/foo/index.html sin redirigir.
    //
    // Inline pequeño CSS para evitar render-blocking en above-the-fold.
    inlineStylesheets: 'auto',
  },
  prefetch: {
    // Prefetch automático de links visibles — navegación percibida instantánea.
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
});
