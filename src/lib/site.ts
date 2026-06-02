/**
 * Datos centrales del negocio. Todo lo que cambia con frecuencia o se reutiliza
 * en varias páginas vive acá — un solo lugar para editar.
 *
 * Convención: cualquier "TBD" debe quedar visible y resolverse antes del launch.
 */

export const SITE = {
  name: 'Espacio 1010',
  shortName: '1010',
  url: 'https://www.espacio1010.uy',
  tagline: 'Tu consultorio sin complicaciones',
  description:
    'Espacios boutique por hora para profesionales de la salud y el bienestar. Edificio centenario reciclado a nuevo entre Palermo y Parque Rodó, Montevideo. Reservá online, autogestión total, 24/7.',
  locale: 'es_UY',
  // Subdominio operativo de la PWA de reservas — el "Reservar ahora" apunta acá.
  agendaUrl: 'https://agenda.espacio1010.uy',
} as const;

export const ADDRESS = {
  street: 'Gaboto 1010',
  betweenStreets: 'entre Isla de Flores y San Salvador',
  neighborhood: 'Parque Rodó',
  city: 'Montevideo',
  country: 'Uruguay',
  postalCode: '11200', // límite Palermo / Parque Rodó aprox — confirmar con Rafa
  // Coordenadas aproximadas Gaboto 1010 — verificar con Google Maps real antes del launch.
  lat: -34.9094,
  lng: -56.1834,
  mapsUrl: 'https://maps.google.com/?q=Gaboto+1010+Montevideo+Uruguay',
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
  // El edificio opera 24/7 (auto-acceso). Esto es lo que entra en Schema.org.
  // Para Google Business Profile probablemente convenga acotar atención humana.
  openingHours: '24/7',
  humanSupport: 'Lunes a sábado, 9 a 20 hs',
} as const;

/**
 * Los 12 espacios cara al cliente. Centralizado acá para que el sitio refleje
 * exactamente lo que vende la PWA. Slug = URL friendly para /los-espacios/[slug].
 *
 * Nota interna: la PWA tiene 9 consultorios en DB. Discrepancia pendiente con Rafa.
 * Cuando se aclare, este array es la fuente de verdad del sitio institucional.
 */
export type EspacioId =
  | 'estudio-norte'
  | 'estudio-sur'
  | 'consulta-1'
  | 'consulta-2'
  | 'consulta-3'
  | 'consulta-4'
  | 'consulta-5'
  | 'consulta-6'
  | 'consulta-7'
  | 'salon-cobre'
  | 'salon-roble'
  | 'sala-subsuelo';

export interface Espacio {
  id: EspacioId;
  nombre: string;
  resumen: string;
  capacidad: string;
  amueblado: 'completo' | 'versatil' | 'mixto';
  metros: number; // m² aprox
  destacado?: boolean;
  ideal: string[]; // segmentos / usos sugeridos
}

export const ESPACIOS: Espacio[] = [
  // TODO: confirmar nombres reales con Rafa. Estos son placeholders cohesivos
  // con el tono editorial premium del brandboard.
  {
    id: 'estudio-norte',
    nombre: 'Estudio Norte',
    resumen: 'Luz natural de mañana, sillón de terapia, escritorio macizo.',
    capacidad: '2 a 3 personas',
    amueblado: 'completo',
    metros: 14,
    destacado: true,
    ideal: ['Psicología', 'Psiquiatría', 'Psicopedagogía'],
  },
  {
    id: 'estudio-sur',
    nombre: 'Estudio Sur',
    resumen: 'Cálido y sereno, ideal para sesiones largas y trabajo individual.',
    capacidad: '2 a 3 personas',
    amueblado: 'completo',
    metros: 13,
    ideal: ['Psicología', 'Coaching', 'Constelaciones individuales'],
  },
  {
    id: 'consulta-1',
    nombre: 'Consulta I',
    resumen: 'Sobria, mobiliario clásico, perfecta para consulta clínica.',
    capacidad: '2 personas',
    amueblado: 'completo',
    metros: 11,
    ideal: ['Psiquiatría', 'Nutrición', 'Homeopatía'],
  },
  {
    id: 'consulta-2',
    nombre: 'Consulta II',
    resumen: 'Compacta y silenciosa, con foco en privacidad acústica.',
    capacidad: '2 personas',
    amueblado: 'completo',
    metros: 10,
    ideal: ['Psicología', 'Psicoanálisis'],
  },
  {
    id: 'consulta-3',
    nombre: 'Consulta III',
    resumen: 'Vista interior, diseño contemporáneo, escritorio plegable.',
    capacidad: '2 personas',
    amueblado: 'completo',
    metros: 11,
    ideal: ['Psicología', 'Nutrición'],
  },
  {
    id: 'consulta-4',
    nombre: 'Consulta IV',
    resumen: 'Espacio amplio para terapias con materiales o juego.',
    capacidad: '3 personas',
    amueblado: 'mixto',
    metros: 14,
    ideal: ['Psicopedagogía', 'Psicología infantil', 'Fonoaudiología'],
  },
  {
    id: 'consulta-5',
    nombre: 'Consulta V',
    resumen: 'Versátil, con divan opcional y zona de escritorio.',
    capacidad: '2 personas',
    amueblado: 'mixto',
    metros: 12,
    ideal: ['Psicoanálisis', 'Psicología'],
  },
  {
    id: 'consulta-6',
    nombre: 'Consulta VI',
    resumen: 'Pequeña, recogida, perfecta para sesiones de 50 minutos.',
    capacidad: '2 personas',
    amueblado: 'completo',
    metros: 9,
    ideal: ['Psicología', 'Coaching'],
  },
  {
    id: 'consulta-7',
    nombre: 'Consulta VII',
    resumen: 'Ambiente luminoso con detalles de madera original recuperada.',
    capacidad: '2 personas',
    amueblado: 'completo',
    metros: 11,
    ideal: ['Psiquiatría', 'Psicología'],
  },
  {
    id: 'salon-cobre',
    nombre: 'Salón Cobre',
    resumen: 'Sillas apilables y colchonetas — montás el espacio como lo necesites.',
    capacidad: '6 a 10 personas',
    amueblado: 'versatil',
    metros: 22,
    destacado: true,
    ideal: ['Terapia grupal', 'Mindfulness', 'Yoga reducido'],
  },
  {
    id: 'salon-roble',
    nombre: 'Salón Roble',
    resumen: 'Mobiliario versátil para grupos chicos o talleres de medio día.',
    capacidad: '6 a 8 personas',
    amueblado: 'versatil',
    metros: 20,
    ideal: ['Talleres', 'Terapia grupal', 'Constelaciones familiares'],
  },
  {
    id: 'sala-subsuelo',
    nombre: 'Sala Arcos',
    resumen: 'La gran sala del edificio, en el subsuelo. Sin columnas, configuración libre.',
    capacidad: '20 a 30 personas',
    amueblado: 'versatil',
    metros: 60,
    destacado: true,
    ideal: ['Talleres', 'Presentaciones', 'Yoga', 'Meditación grupal'],
  },
];

/**
 * Amenities transversales del edificio — sirven para landing principal,
 * /el-lugar y schema.org.
 */
export const AMENITIES = [
  { icon: 'wifi', label: 'Wifi de fibra en todo el edificio' },
  { icon: 'air-conditioner', label: 'Aire acondicionado en cada espacio' },
  { icon: 'led', label: 'Iluminación LED regulable' },
  { icon: 'lock', label: 'Acceso 24/7 con código personal' },
  { icon: 'sound', label: 'Música ambiente para mayor privacidad' },
  { icon: 'coffee', label: 'Cocina y sala de estar para tus pacientes' },
  { icon: 'sofa', label: 'Sala de espera compartida' },
  { icon: 'cowork', label: 'Sala de cowork incluida sin cargo' },
  { icon: 'parking', label: 'Estacionamiento gratuito en la zona' },
  { icon: 'bus', label: 'A 2 cuadras de líneas troncales' },
] as const;

/**
 * Diferenciales pesados — orden importa, es el orden en que se muestran.
 */
export const DIFERENCIALES = [
  {
    titulo: 'Reservás vos, en tiempo real',
    descripcion:
      'Entrás, ves la disponibilidad real de los 12 espacios y reservás en menos de un minuto. Sin esperar respuesta de nadie.',
  },
  {
    titulo: 'Acceso 24/7',
    descripcion:
      'Tu código personal abre las puertas cualquier día, a cualquier hora. Atendés cuando tus pacientes te necesitan.',
  },
  {
    titulo: 'Cancelaciones flexibles',
    descripcion:
      'Cancelás con 24 horas de aviso y no pagás nada. La política más favorable del mercado.',
  },
  {
    titulo: 'Edificio centenario, todo nuevo',
    descripcion:
      '100 años de historia, reciclado a cero. Domótica, climatización, insonorización y materiales premium.',
  },
  {
    titulo: 'Cowork incluido sin cargo',
    descripcion:
      'Llegás antes o te queda un hueco entre pacientes. Trabajás en la sala compartida sin pagar extra.',
  },
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
