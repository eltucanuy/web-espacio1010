/**
 * Helpers para generar schemas Schema.org consistentes a través del sitio.
 * Centralizar acá evita drift entre páginas.
 */

import { SITE, ADDRESS, CONTACT, SOCIAL } from './site';

/**
 * BreadcrumbList — para páginas con breadcrumbs visibles.
 * Pasar la lista en orden (de raíz a página actual).
 */
export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE.url}${item.url}`,
    })),
  };
}

/**
 * LocalBusiness refinado con OpeningHoursSpecification dual:
 *   - Horario reservable real: todos los días de 07:00 a 24:00 (auto-acceso con código)
 *   - La atención humana tiene horario comercial
 * Google entiende ambos y muestra el correcto según el query.
 */
export function localBusinessSchema(imageUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE.url}/#business`,
    name: SITE.name,
    alternateName: 'Espacio 1010 Montevideo',
    description: SITE.description,
    slogan: SITE.tagline,
    url: SITE.url,
    telephone: CONTACT.whatsappLeads,
    email: CONTACT.email,
    image: imageUrl,
    // Raster ≥112x112 (guideline de Google para logo en structured data; el SVG no alcanza)
    logo: `${SITE.url}/apple-touch-icon.png`,
    priceRange: '$$$',
    currenciesAccepted: 'UYU',
    paymentAccepted: 'Cash, Bank Transfer',
    address: {
      '@type': 'PostalAddress',
      streetAddress: ADDRESS.street,
      addressLocality: ADDRESS.city,
      addressRegion: ADDRESS.neighborhood,
      postalCode: ADDRESS.postalCode,
      addressCountry: 'UY',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: ADDRESS.lat,
      longitude: ADDRESS.lng,
    },
    // El edificio funciona 24/7 (comunicación oficial, decisión Rafa 2026-06-11).
    // La app reserva de 7 a 24; la madrugada se coordina por WhatsApp.
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '00:00',
        closes: '23:59',
      },
    ],
    // Sin hoursAvailable: no se publica horario de atención humana
    // (decisión Rafa 2026-06-11 — atención familiar, sin rango comprometido).
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: CONTACT.whatsappLeads,
      email: CONTACT.email,
      contactType: 'customer service',
      availableLanguage: 'es',
    },
    areaServed: { '@type': 'City', name: ADDRESS.city },
    hasMap: ADDRESS.mapsUrl,
    // Oferta citeable: precio por hora explícito para buscadores y asistentes de IA.
    makesOffer: [
      {
        '@type': 'Offer',
        name: 'Consultorios y salas por hora',
        price: '350',
        priceCurrency: 'UYU',
        description:
          'Alquiler por hora de consultorios amueblados y salas multiuso, todo incluido. Descuentos automáticos: 10% desde 20 horas al mes, 20% desde 40.',
      },
      {
        '@type': 'Offer',
        name: 'Sala Arcos (grupos y talleres, hasta 25 personas)',
        price: '700',
        priceCurrency: 'UYU',
        description:
          'Sala de 40 m² con proyector, parlante, kitchenette y baño propio. Se coordina por WhatsApp.',
      },
    ],
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: 'Wifi', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Aire acondicionado', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Acceso 24/7 con código personal', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Salas de espera', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Estacionamiento no tarifado en la zona', value: true },
    ],
    sameAs: [SOCIAL.instagram],
  };
}
