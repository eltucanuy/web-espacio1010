import { OGImageRoute } from 'astro-og-canvas';
import { getCollection } from 'astro:content';
import { ESPACIOS, NICHOS } from '../../lib/site';
import { NICHOS_CONTENT } from '../../lib/nichos';

const guias = await getCollection('guias');

/**
 * Generación on-build de OG images por página.
 *
 * Cada URL importante tiene su PNG dedicado con título + acento marca.
 * El layout es consistente: fondo crema, número 1010 grande terracota,
 * título principal en serif, subtítulo en sans, tag "Espacio 1010 · Parque Rodó".
 */

interface OgPage {
  title: string;
  description?: string;
}

const pages: Record<string, OgPage> = {
  // Landing principal
  home: {
    title: 'Tu consultorio,\nsin complicaciones.',
    description: 'Espacios cuidados por hora para profesionales · Parque Rodó, Montevideo',
  },
  // Páginas core
  'los-espacios': {
    title: 'Consultorios y salas.\nUna sola filosofía.',
    description: 'Conocé los espacios de Espacio 1010',
  },
  'el-lugar': {
    title: 'Cien años de historia,\nreciclados a nuevo.',
    description: 'Gaboto 1010 · entre Palermo y Parque Rodó · Montevideo',
  },
  'como-funciona': {
    title: 'Cinco pasos.\nEl resto es atender.',
    description: 'Reservás online y entrás con tu código — acceso 24/7',
  },
  precios: {
    title: 'Sin letra chica.\nSin sorpresas.',
    description: 'Hora suelta o fija semanal · $350/h · Tu primera hora gratis',
  },
  contacto: {
    title: 'Hablamos\ncuando querés.',
    description: 'WhatsApp · Email · Visita',
  },
  'preguntas-frecuentes': {
    title: 'Preguntas\nfrecuentes.',
    description: 'Todo lo que te queda por preguntar',
  },
  'alquiler-consultorio-montevideo': {
    title: 'Alquiler de consultorio\npor hora en Montevideo.',
    description: 'Consultorios y salas por hora · Palermo / Parque Rodó · Desde $350',
  },

  // Auto-generadas para cada espacio (key = id del espacio, ver los-espacios/[slug].astro)
  ...Object.fromEntries(
    ESPACIOS.map((e) => [
      e.id,
      {
        title: e.nombre,
        description: `${e.resumen} · ${e.capacidad} · ${e.metros} m² · $${e.precioHora}/h`,
      } satisfies OgPage,
    ])
  ),

  // Auto-generadas para cada guía (key = `guia-<id>`, ver guias/[slug].astro)
  ...Object.fromEntries(
    guias.map((g) => [
      `guia-${g.id}`,
      {
        title: g.data.title,
        description: 'Guías de Espacio 1010 · Parque Rodó · Montevideo',
      } satisfies OgPage,
    ])
  ),

  // Índice de guías
  guias: {
    title: 'Guías para\ntu consulta.',
    description: 'Precios, comparativas y consejos para atender en Montevideo',
  },

  // Auto-generadas para cada nicho
  ...Object.fromEntries(
    NICHOS.map((n) => {
      const content = NICHOS_CONTENT[n.slug];
      return [
        `nicho-${n.slug}`,
        {
          title: content?.label ?? n.label,
          description: 'Espacio 1010 · Parque Rodó · Montevideo',
        } satisfies OgPage,
      ];
    })
  ),
};

export const { getStaticPaths, GET } = await OGImageRoute({
  param: 'slug',
  pages,
  getImageOptions: (_slug, page) => ({
    title: page.title,
    description: page.description,
    bgGradient: [
      [248, 247, 245], // crema
      [239, 236, 230], // crema-warm
    ],
    border: { color: [158, 78, 66], width: 10, side: 'inline-start' },
    padding: 80,
    font: {
      title: {
        families: ['Cormorant Garamond', 'Georgia', 'serif'],
        weight: 'Medium',
        size: 88,
        color: [26, 21, 24], // ink
        lineHeight: 1.05,
      },
      description: {
        families: ['Josefin Sans', 'sans-serif'],
        weight: 'Normal',
        size: 28,
        color: [86, 81, 83], // ink-soft
        lineHeight: 1.4,
      },
    },
    logo: undefined,
    // Marca de agua "ESPACIO 1010" en esquina (lo dibuja la lib a partir del título)
  }),
});
