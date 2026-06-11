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
    logo: `${SITE.url}/favicon.svg`,
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
    // Horario reservable real (auto-acceso con código): 7 a 24, todos los días.
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '07:00',
        closes: '23:59',
      },
    ],
    // Atención humana en horario comercial (hoursAvailable solo es válido en ContactPoint/Service).
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: CONTACT.whatsappLeads,
      email: CONTACT.email,
      contactType: 'customer service',
      availableLanguage: 'es',
      hoursAvailable: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '20:00',
      },
    },
    areaServed: { '@type': 'City', name: ADDRESS.city },
    sameAs: [SOCIAL.instagram],
  };
}
