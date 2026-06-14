/**
 * Datos centrales del negocio. Todo lo que cambia con frecuencia o se reutiliza
 * en varias páginas vive acá — un solo lugar para editar.
 *
 * Fuente de verdad de datos duros: docs/VERDAD_APP_2026_06_10.md (la app manda).
 */

export const SITE = {
  name: 'Espacio 1010',
  shortName: '1010',
  url: 'https://www.espacio1010.uy',
  tagline: 'Tu consultorio sin complicaciones',
  description:
    '12 consultorios y salas por hora para profesionales de la salud y el bienestar. Edificio centenario reciclado a nuevo entre Palermo y Parque Rodó, Montevideo. Reservás online y entrás con tu código — acceso 24/7.',
  locale: 'es_UY',
  // Subdominio operativo de la PWA de reservas. NO usarlo como CTA primario
  // durante el pre-lanzamiento: el CTA primario de todas las páginas es
  // /#registro (cupón). Excepción permitida: el enlace SECUNDARIO "Ya tengo
  // cuenta" (loginUrl), para quien ya tiene cuenta — nunca compite con el CTA.
  agendaUrl: 'https://agenda.espacio1010.uy',
  // Login de la PWA para clientes existentes. Enlace secundario, nunca primario.
  loginUrl: 'https://agenda.espacio1010.uy/login',
} as const;

export const ADDRESS = {
  street: 'Gaboto 1010',
  betweenStreets: 'entre Isla de Flores y San Salvador',
  neighborhood: 'Parque Rodó',
  city: 'Montevideo',
  country: 'Uruguay',
  postalCode: '11200', // límite Palermo / Parque Rodó aprox
  // Coordenadas exactas del pin oficial "Espacio 1010" en Google Maps
  // (link compartido por Rafa 2026-06-11: maps.app.goo.gl/fn3y6k5ujuxt56jn7).
  lat: -34.9111051,
  lng: -56.1769524,
  mapsUrl: 'https://maps.app.goo.gl/fn3y6k5ujuxt56jn7',
} as const;

export const CONTACT = {
  // WhatsApp real de atención / leads.
  whatsappLeads: '+59899001303',
  whatsappLeadsDisplay: '099 001 303',
  // Email de contacto general.
  email: 'hola@espacio1010.uy',
  // Pre-construido el link wa.me — sumamos texto base.
  whatsappLink: (msg = 'Hola, quiero saber más sobre Espacio 1010.') =>
    `https://wa.me/59899001303?text=${encodeURIComponent(msg)}`,
} as const;

export const SOCIAL = {
  instagram: 'https://www.instagram.com/espacio1010.uy/',
  instagramHandle: '@espacio1010.uy',
} as const;

export const HOURS = {
  // Comunicación oficial (decisión Rafa 2026-06-11): el edificio es 24/7.
  // La app reserva de 07:00 a 24:00; los horarios de madrugada se coordinan
  // por WhatsApp (no son de libre reserva por la app).
  openingHours: 'Abierto 24/7',
  appBooking: 'Por la app reservás de 7 a 24; la madrugada se coordina por WhatsApp',
  // Sin horario de atención publicado (decisión Rafa 2026-06-11: atención
  // familiar, "cuando podemos" — no comprometer un rango).
} as const;

/**
 * Los espacios cara al cliente — datos REALES de la DB de producción de la app
 * (tabla `consultorios`, ver docs/VERDAD_APP_2026_06_10.md). Mismos nombres que
 * ve el cliente en la PWA. Slug = URL para /los-espacios/[slug].
 *
 * Espacios 04 (PB) y 15 (P1) existen pero están inactivos en la app (placeholders
 * sin terminar) — sumarlos acá cuando Rafa los termine.
 */
export type EspacioId =
  | 'espacio-01'
  | 'espacio-02'
  | 'espacio-03'
  | 'espacio-11'
  | 'espacio-12'
  | 'espacio-13'
  | 'espacio-14'
  | 'sala-arcos';

export type GrupoEspacio = 'individual' | 'infancias' | 'camilla' | 'grupos';

export interface Espacio {
  id: EspacioId;
  nombre: string; // tal cual lo ve el cliente en la app
  piso: 'Planta baja' | 'Piso 1' | 'Subsuelo';
  tipo: 'amueblado' | 'multiuso';
  grupo: GrupoEspacio; // misma agrupación por uso que la home
  resumen: string; // fiel a la descripción de la DB
  capacidad: string; // detalle completo (ficha)
  capacidadBreve: string; // versión corta (cards)
  metros: number; // m² aprox (DB)
  precioHora: number; // 350 | 700 — único lugar donde vive el precio
  reservaPorApp: boolean; // false solo para Sala Arcos (CTA WhatsApp)
  ideal: string[]; // derivado de la descripción DB + profesiones_lista de la app
  foto?: string; // ruta en /public — solo Sala Arcos tiene foto real hoy
  fotoAlt?: string;
  destacado?: boolean; // los 3 que muestra /alquiler-consultorio-montevideo
}

export const ESPACIOS: Espacio[] = [
  {
    id: 'espacio-01',
    nombre: 'Espacio 01',
    piso: 'Planta baja',
    tipo: 'amueblado',
    grupo: 'individual',
    resumen:
      'A la calle y cálido. Sillón de tres cuerpos y butaca individual — ideal para sesiones individuales, entrevistas y consultas.',
    capacidad: 'Hasta 4 sentados',
    capacidadBreve: 'Hasta 4',
    metros: 13,
    precioHora: 350,
    reservaPorApp: true,
    ideal: ['Psicología', 'Psiquiatría', 'Coaching', 'Nutrición'],
    destacado: true,
  },
  {
    id: 'espacio-02',
    nombre: 'Espacio 02',
    piso: 'Planta baja',
    tipo: 'amueblado',
    grupo: 'infancias',
    resumen:
      'Versátil, con rincón infantil: mobiliario y materiales para trabajar con niños y familias, más dos butacas y escritorio.',
    capacidad: '2 personas',
    capacidadBreve: '2 personas',
    metros: 15,
    precioHora: 350,
    reservaPorApp: true,
    ideal: ['Psicopedagogía', 'Psicología infantil', 'Fonoaudiología', 'Psicomotricidad'],
  },
  {
    id: 'espacio-03',
    nombre: 'Espacio 03',
    piso: 'Planta baja',
    tipo: 'multiuso',
    grupo: 'grupos',
    resumen:
      'Flexible y despejado, para movimiento, meditación y grupos chicos. Con almohadones y colchonetas para armarlo como necesites.',
    capacidad: '8 sentados · 6 en movimiento',
    capacidadBreve: 'Hasta 8',
    metros: 19,
    precioHora: 350,
    reservaPorApp: true,
    ideal: ['Meditación', 'Yoga', 'Grupos chicos', 'Movimiento'],
  },
  {
    id: 'espacio-11',
    nombre: 'Espacio 11',
    piso: 'Piso 1',
    tipo: 'amueblado',
    grupo: 'individual',
    resumen:
      'Compacto y luminoso, a la calle. Dos butacas individuales — perfecto para sesiones uno a uno y entrevistas breves.',
    capacidad: '2 personas',
    capacidadBreve: '2 personas',
    metros: 9.5,
    precioHora: 350,
    reservaPorApp: true,
    ideal: ['Psicología', 'Psiquiatría', 'Coaching', 'Nutrición'],
  },
  {
    id: 'espacio-12',
    nombre: 'Espacio 12',
    piso: 'Piso 1',
    tipo: 'amueblado',
    grupo: 'individual',
    resumen:
      'Luminoso y con balcón a la calle. Sillón de dos cuerpos, butaca individual y escritorio.',
    capacidad: '3 personas',
    capacidadBreve: '3 personas',
    metros: 14,
    precioHora: 350,
    reservaPorApp: true,
    ideal: ['Psicología', 'Psiquiatría', 'Coaching', 'Nutrición'],
  },
  {
    id: 'espacio-13',
    nombre: 'Espacio 13',
    piso: 'Piso 1',
    tipo: 'amueblado',
    grupo: 'camilla',
    resumen:
      'Con camilla: masajes, reflexología, tratamientos corporales y abordajes integrales. También tiene escritorio.',
    capacidad: '2 personas',
    capacidadBreve: '2 personas',
    metros: 11,
    precioHora: 350,
    reservaPorApp: true,
    ideal: ['Masajes', 'Reflexología', 'Osteopatía', 'Terapias corporales'],
    destacado: true,
  },
  {
    id: 'espacio-14',
    nombre: 'Espacio 14',
    piso: 'Piso 1',
    tipo: 'multiuso',
    grupo: 'grupos',
    resumen:
      'Amplio y despejado, para movimiento, meditación y grupos chicos. Con almohadones y colchonetas.',
    capacidad: '8 sentados · 6 en movimiento',
    capacidadBreve: 'Hasta 8',
    metros: 16,
    precioHora: 350,
    reservaPorApp: true,
    ideal: ['Meditación', 'Yoga', 'Grupos chicos', 'Movimiento'],
    destacado: true,
  },
  {
    id: 'sala-arcos',
    nombre: 'Sala Arcos',
    piso: 'Subsuelo',
    tipo: 'multiuso',
    grupo: 'grupos',
    resumen:
      'La gran sala del subsuelo, para talleres, encuentros y trabajo grupal. Con proyector, parlante, kitchenette y baño propio.',
    capacidad: 'Hasta 25 sentados',
    capacidadBreve: 'Hasta 25',
    metros: 40,
    precioHora: 700,
    reservaPorApp: false,
    ideal: ['Talleres', 'Formaciones', 'Constelaciones', 'Encuentros grupales'],
    foto: '/fotos/lugar-sala-subsuelo.webp',
    fotoAlt:
      'Sala Arcos en el subsuelo de Espacio 1010, con muro de piedra, arco original y piso de madera',
  },
];

/** Labels de tipo — un solo lugar (los usan índice, ficha y EspacioCard). */
export const TIPO_LABEL: Record<Espacio['tipo'], string> = {
  amueblado: 'Amueblado',
  multiuso: 'Multiuso',
};

/** Explicación corta de cada tipo (leyenda del índice). */
export const TIPO_DESC: Record<Espacio['tipo'], string> = {
  amueblado: 'sillón, butacas y/o escritorio — llegás y atendés',
  multiuso: 'despejado, con almohadones y colchonetas — lo armás como necesites',
};

/** Íconos por grupo de uso — mismos paths que usa la home (index.astro). */
export const ICONOS_GRUPO: Record<GrupoEspacio, string> = {
  individual:
    '<path d="M4 11V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3"/><path d="M2 13a2 2 0 0 1 4 0v3h12v-3a2 2 0 0 1 4 0v5H2z"/>',
  infancias:
    '<circle cx="12" cy="4.5" r="2"/><path d="M12 9v6M9 21l1.2-6M15 21l-1.2-6M8 10.5l4 1 4-1"/>',
  camilla:
    '<circle cx="6" cy="10" r="1.6"/><path d="M8 11h9a3 3 0 0 1 3 3M3 11h3"/><path d="M3 11v7M20 14v4"/>',
  grupos:
    '<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2"/><path d="M3 20a6 6 0 0 1 12 0M15 20a5 5 0 0 1 6-3.5"/>',
};

/**
 * Amenities transversales del edificio — los renderiza /el-lugar.
 * Confirmados por Rafa el 2026-06-11: salas de espera (2, una por piso, con
 * sillones/agua/wifi/aire), música ambiente (pasillos y salas de espera) y
 * café/té/agua en la cocina de profesionales. Quedaron AFUERA por decisión:
 * "fibra" (todo Uruguay tiene), limpieza, "LED regulable" y "cowork".
 */
export const AMENITIES = [
  { icon: 'wifi', label: 'Wifi en todo el edificio' },
  { icon: 'air-conditioner', label: 'Aire acondicionado en cada espacio' },
  { icon: 'lock', label: 'Acceso 24/7 con código personal' },
  { icon: 'sofa', label: 'Dos salas de espera para quienes atendés — una por piso, con sillones y agua' },
  { icon: 'sound', label: 'Música ambiente en pasillos y salas de espera' },
  { icon: 'coffee', label: 'Cocina y sala de estar para profesionales, con café, té y agua sin cargo' },
  { icon: 'parking', label: 'Estacionamiento no tarifado en la zona' },
  { icon: 'bus', label: 'Bien conectado en bus' },
] as const;

/**
 * Tipos de profesional que admite el espacio.
 * Cada uno tiene su /para/[slug] landing para SEO + Ads.
 */
export const NICHOS = [
  { slug: 'psicologos', label: 'Psicólogos', short: 'psicología' },
  { slug: 'psiquiatras', label: 'Psiquiatras', short: 'psiquiatría' },
  { slug: 'psicopedagogos', label: 'Psicopedagogos', short: 'psicopedagogía' },
  { slug: 'nutricionistas', label: 'Nutricionistas', short: 'nutrición' },
  { slug: 'meditacion-yoga', label: 'Meditación y yoga', short: 'meditación' },
  { slug: 'talleres-grupos', label: 'Talleres y grupos', short: 'talleres' },
] as const;

export type NichoSlug = (typeof NICHOS)[number]['slug'];

/**
 * Navegación principal — orden visible.
 */
export const NAV = [
  { href: '/los-espacios', label: 'Los espacios' },
  { href: '/el-lugar', label: 'El lugar' },
  { href: '/como-funciona', label: 'Cómo funciona' },
  { href: '/precios', label: 'Precios' },
  { href: '/contacto', label: 'Contacto' },
] as const;
