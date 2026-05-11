/**
 * PostCSS config — Tailwind v4 vía plugin PostCSS oficial.
 * Necesario porque Astro 6 (rolldown-vite) tiene incompatibilidad con
 * @tailwindcss/vite. La forma PostCSS está soportada y estable.
 */
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
