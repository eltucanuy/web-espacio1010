/**
 * Content collections del sitio.
 *
 * `guias` — la sección editorial (/guias): artículos pilar de SEO/AEO en
 * markdown. Datos duros (precios, horarios, espacios): docs/VERDAD_APP_2026_06_10.md
 * y src/lib/site.ts mandan — si cambia un precio, actualizar también acá.
 */
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const guias = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/guias' }),
  schema: z.object({
    /** H1 del artículo */
    title: z.string(),
    /** Title SEO (si difiere del H1) */
    titleSeo: z.string().optional(),
    /** Meta description */
    description: z.string(),
    /** Bajada corta para las cards del índice /guias */
    resumen: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    /** Orden en el índice (menor = primero) */
    orden: z.number().default(99),
    /** FAQ del artículo — se renderiza al final y alimenta el schema FAQPage */
    faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
    /** Slugs de otras guías relacionadas (links internos al pie) */
    relacionadas: z.array(z.string()).default([]),
  }),
});

export const collections = { guias };
