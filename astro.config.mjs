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
  integrations: [
    react(),
    sitemap({
      // Excluir landings de ads del sitemap (se sirven solo desde campañas pagas).
      filter: (page) => !page.includes('/campanas/'),
    }),
  ],
  build: {
    // Inline pequeño CSS para evitar render-blocking en above-the-fold.
    inlineStylesheets: 'auto',
  },
  prefetch: {
    // Prefetch automático de links visibles — navegación percibida instantánea.
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
});
