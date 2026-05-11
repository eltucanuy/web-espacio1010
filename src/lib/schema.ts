/**
 * Helpers para generar schemas Schema.org consistentes a través del sitio.
 * Centralizar acá evita drift entre páginas.
 */

import { SITE, ADDRESS, CONTACT } from './site';

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
 *   - El edificio opera 24/7 (auto-acceso con código personal)
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
    logo: `${SITE.url}/favicon.svg`,
    priceRange: '$$$',
    currenciesAccepted: 'UYU',
    paymentAccepted: 'Cash, Credit Card, Bank Transfer',
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
    // Edificio operativo 24/7 (auto-acceso con código).
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '00:00',
        closes: '23:59',
      },
    ],
    // Atención humana en horario comercial.
    hoursAvailable: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '20:00',
      description: 'Atención humana por WhatsApp y visitas guiadas',
    },
    areaServed: { '@type': 'City', name: ADDRESS.city },
    sameAs: [
      // Cuando exista IG real, agregarlo.
    ],
  };
}
