import { OGImageRoute } from 'astro-og-canvas';
import { ESPACIOS, NICHOS } from '../../lib/site';
import { NICHOS_CONTENT } from '../../lib/nichos';

/**
 * Generación on-build de OG images por página.
 *
 * Cada URL importante tiene su PNG dedicado con título + acento marca.
 * El layout es consistente: fondo crema, número 1010 grande terracota,
 * título principal en serif, subtítulo en sans, tag "Espacio 1010 · Cordón".
 */

interface OgPage {
  title: string;
  description?: string;
}

const pages: Record<string, OgPage> = {
  // Landing principal
  home: {
    title: 'Tu consultorio,\nsin complicaciones.',
    description: 'Espacios boutique por hora para profesionales · Cordón, Montevideo',
  },
  // Páginas core
  'los-espacios': {
    title: '12 espacios.\nUna sola filosofía.',
    description: 'Conocé los espacios de Espacio 1010',
  },
  'el-lugar': {
    title: 'Cien años de historia,\nreciclados a nuevo.',
    description: 'Gaboto 1010 · Cordón · Montevideo',
  },
  'como-funciona': {
    title: 'Cuatro pasos.\nEl resto es atender.',
    description: 'Reservás online, accedés 24/7, cancelás con 24 hs',
  },
  precios: {
    title: 'Sin letra chica.\nSin sorpresas.',
    description: 'Hora suelta · Pack · Fija mensual · Tarifa Fundadores',
  },
  contacto: {
    title: 'Hablamos\ncuando querés.',
    description: 'WhatsApp · Email · Visita guiada',
  },
  'preguntas-frecuentes': {
    title: 'Preguntas\nfrecuentes.',
    description: 'Todo lo que te queda por preguntar',
  },
  'alquiler-consultorio-montevideo': {
    title: 'Alquiler de consultorio\npor hora en Montevideo.',
    description: '12 espacios en Cordón · A 5 cuadras de 18 de Julio',
  },

  // Auto-generadas para cada espacio
  ...Object.fromEntries(
    ESPACIOS.map((e) => [
      `espacio-${e.id}`,
      {
        title: e.nombre,
        description: `${e.resumen} · ${e.capacidad} · ${e.metros} m²`,
      } satisfies OgPage,
    ])
  ),

  // Auto-generadas para cada nicho
  ...Object.fromEntries(
    NICHOS.map((n) => {
      const content = NICHOS_CONTENT[n.slug];
      return [
        `nicho-${n.slug}`,
        {
          title: content?.label ?? n.label,
          description: 'Espacio 1010 · Cordón · Montevideo',
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
