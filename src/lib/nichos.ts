/**
 * Contenido SEO + ads de cada landing /para/[slug].
 *
 * Estructura pensada para:
 *   - SEO long-tail (cada página tiene H1 con keyword principal del nicho,
 *     subhead con keyword secundaria, FAQ con preguntas long-tail)
 *   - Ads landings (un único H1, CTA arriba, prueba social abajo, FAQ que
 *     destraba objeciones)
 *
 * Datos duros (espacios, precios, horarios): docs/VERDAD_APP_2026_06_10.md —
 * la app manda. Testimonios: solo los reales y aprobados de la home.
 *
 * Si querés que la landing cargue con un mensaje específico de campaña,
 * la URL admite `?utm_campaign=...` y podés agregar lógica para mostrar
 * variantes — para v1 el contenido es estático.
 */

import type { EspacioId } from './site';

export interface NichoContent {
  slug: string;
  /** H1 de la página */
  label: string;
  /** Title SEO con geo (distinto del H1) */
  titleSeo: string;
  /** Subhead descriptivo bajo el H1 */
  intro: string;
  /** Lo que buscan resolver — habla de su realidad, no de features */
  painPoints: string[];
  /** Por qué Espacio 1010 funciona para este nicho */
  solucion: string;
  /** Espacios que se ajustan al nicho — IDs de ESPACIOS (reales, ver spec-espacios) */
  espaciosRecomendados: EspacioId[];
  /** Testimonio REAL y aprobado (de la home). Si el nicho no tiene, se omite. */
  testimonial?: { texto: string; autor: string; rol: string };
  /** Fotos reales del lugar (public/fotos/) — mismas alt/caps que la home */
  fotos: { src: string; alt: string; cap: string }[];
  /** FAQ específica del nicho (sobre la práctica + sobre el espacio) */
  faq: { q: string; a: string }[];
  /** Meta description */
  meta: string;
  /** Mensaje exacto para el CTA de WhatsApp */
  whatsappIntro: string;
  /**
   * Variaciones de búsqueda long-tail que también aplican.
   * Renderizadas como chips "También conocido como" — sin diluir URLs,
   * pero sumando keywords relevantes a la página para SEO.
   */
  variantesBusqueda: string[];
}

export const NICHOS_CONTENT: Record<string, NichoContent> = {
  psicologos: {
    slug: 'psicologos',
    label: 'Espacios para psicólogas y psicólogos',
    titleSeo: 'Consultorio por hora para psicólogos en Montevideo',
    intro:
      'Consultorios por hora pensados para la práctica clínica, entre Palermo y Parque Rodó. Agenda online, espacios pensados para trabajar con privacidad y la flexibilidad de armar tu semana como vos quieras.',
    painPoints: [
      'Alquilar un consultorio propio cuesta lo que cuesta — y tenés que llenarlo solo',
      'Compartir mal con colegas termina en conflictos por turnos',
      'Las salas por hora suelen ser frías, mal equipadas o difíciles de reservar',
      'Coordinar por WhatsApp con un encargado te hace perder tiempo todas las semanas',
    ],
    solucion:
      'Cada espacio está pensado para la sesión: sillón o butacas cómodas, escritorio en varios, todo amoblado y climatizado. La agenda online te muestra la disponibilidad real y reservás sin pasar por nadie. Y si tu agenda cambia, cancelás gratis hasta 24 h antes — y hasta 1 h antes pagás solo la mitad.',
    espaciosRecomendados: ['espacio-01', 'espacio-12', 'espacio-11', 'espacio-02'],
    testimonial: {
      texto:
        'Es justo la vuelta que estaba buscando. Coordinar agenda con los pacientes siempre fue un ida y vuelta eterno; con esto voy a poder reservar todo desde el celular, cuando quiera, sin depender de nadie. Simple y rápido.',
      autor: 'Claudia, 36 años',
      rol: 'Psicóloga',
    },
    fotos: [
      { src: '/fotos/lugar-pasillo.webp', alt: 'Pasillo de Espacio 1010 con muro de ladrillo original a la vista, lámparas circulares y claraboya', cap: 'Pasillo · ladrillo a la vista' },
      { src: '/fotos/lugar-marmol.webp', alt: 'Escalera de mármol original de Espacio 1010 junto a un muro de ladrillo a la vista', cap: 'Escalera de mármol original' },
    ],
    faq: [
      {
        q: '¿Puedo atender adultos y también niños?',
        a: 'Sí. Para sesiones con niños está el Espacio 02, con rincón infantil: mobiliario y materiales pensados para niños, además de butacas y escritorio. Si viene la familia completa, el Espacio 01 recibe hasta 4 personas sentadas. Para adultos, cualquiera de los consultorios amueblados.',
      },
      {
        q: '¿Cómo están equipados los consultorios?',
        a: 'Cada consultorio amueblado tiene sillón o butacas cómodas, y varios suman escritorio. El Espacio 01, por ejemplo, tiene un sillón de tres cuerpos más una butaca individual. Si necesitás algo puntual para tu práctica, escribinos por WhatsApp y lo conversamos.',
      },
      {
        q: '¿Cómo se cuida la privacidad de las sesiones?',
        a: 'Los espacios están pensados para conversaciones privadas y el edificio está dedicado por completo a consultorios: se entra con código personal y videoportero, sin público de paso. Las cámaras están solo en la entrada y zonas comunes, nunca en los espacios de atención.',
      },
      {
        q: '¿Puedo dejar mis libros o materiales entre sesiones?',
        a: 'Los espacios se comparten entre profesionales, así que cada quien lleva sus materiales. Si tenés una necesidad puntual, escribinos por WhatsApp y lo conversamos.',
      },
    ],
    meta:
      'Consultorio por hora para psicólogos entre Palermo y Parque Rodó, Montevideo. Reserva online, cancelación gratis con 24 h. Tu primera hora es gratis.',
    whatsappIntro: 'Hola, soy psicóloga/o y quería más info sobre Espacio 1010.',
    variantesBusqueda: [
      'consultorio psicología por hora',
      'alquiler espacio psicólogo Montevideo',
      'consultorio psicoanálisis Parque Rodó',
      'sala terapia individual',
      'consultorio para terapia de pareja',
      'espacio profesional psicología',
    ],
  },

  psiquiatras: {
    slug: 'psiquiatras',
    label: 'Consultorios para psiquiatras',
    titleSeo: 'Consultorio para psiquiatras por hora en Montevideo',
    intro:
      'Consultorios sobrios y profesionales para tu consulta privada, entre Palermo y Parque Rodó. Reservás por hora, sin costos fijos y sin compromiso.',
    painPoints: [
      'Necesitás un entorno serio que respalde tu práctica',
      'No querés depender de un sanatorio o policlínica con horarios fijos',
      'Querés mantener consulta privada sin invertir en consultorio propio',
      'Buscás flexibilidad para combinar consulta presencial con teleconsulta',
    ],
    solucion:
      'El edificio —una casa de principios del siglo XX reciclada a nuevo— está pensado para profesionales de la salud, con consultorios amoblados y climatizados que respaldan una práctica clínica formal. Reservás los días y horarios que se ajustan a tu agenda hospitalaria y mantenés consulta privada sin alquiler mensual: pagás solo las horas que usás, a mes vencido.',
    espaciosRecomendados: ['espacio-11', 'espacio-12', 'espacio-01'],
    // SIN testimonial (no hay psiquiatra real aprobado — la sección no se renderiza)
    fotos: [
      { src: '/fotos/lugar-marmol.webp', alt: 'Escalera de mármol original de Espacio 1010 junto a un muro de ladrillo a la vista', cap: 'Escalera de mármol original' },
      { src: '/fotos/lugar-fachada.webp', alt: 'Fachada reciclada del edificio de Espacio 1010, iluminada de noche, una casa de principios de siglo XX entre Palermo y Parque Rodó', cap: 'La fachada, de noche' },
    ],
    faq: [
      {
        q: '¿El espacio tiene la formalidad que necesita la consulta psiquiátrica?',
        a: 'Sí. Los consultorios son sobrios, amoblados y climatizados, en un edificio reciclado a nuevo y dedicado por completo a consultorios profesionales. Recibís a las personas que atendés con la presencia que tu práctica requiere.',
      },
      {
        q: '¿Puedo recetar y emitir documentación profesional desde el espacio?',
        a: 'Por supuesto: mientras lo tenés reservado, es tu consulta privada. Varios consultorios tienen escritorio para trabajar con tu sistema de historias clínicas habitual.',
      },
      {
        q: '¿Hay opción de horario fijo semanal?',
        a: 'Sí. La reserva fija te garantiza día, hora y espacio todas las semanas, hasta que vos la liberes. Ideal para construir tu agenda de consulta privada.',
      },
    ],
    meta:
      'Consultorio para psiquiatras por hora entre Palermo y Parque Rodó, Montevideo. Sin contrato ni costos fijos, agenda online. Tu primera hora es gratis.',
    whatsappIntro: 'Hola, soy psiquiatra y quería más info sobre Espacio 1010.',
    variantesBusqueda: [
      'consultorio psiquiátrico Montevideo',
      'alquiler consulta clínica',
      'sala médica privada',
      'consultorio para consulta privada',
      'espacio para psiquiatría',
    ],
  },

  psicopedagogos: {
    slug: 'psicopedagogos',
    label: 'Espacios para psicopedagogía',
    titleSeo: 'Consultorio por hora para psicopedagogía en Montevideo',
    intro:
      'Consultorios con lugar para materiales, juego y trabajo con familias. Pensados para sesiones con niños, adolescentes y adultos, entre Palermo y Parque Rodó.',
    painPoints: [
      'Necesitás espacio físico para desplegar materiales',
      'A veces atendés con la familia, a veces solo con el niño',
      'Querés un lugar donde el niño se sienta cómodo, no en una sala estéril',
      'Tus sesiones pueden ser más largas y necesitás flexibilidad horaria',
    ],
    solucion:
      'El Espacio 02 tiene un rincón infantil con mobiliario y materiales pensados para niños, además de butacas y escritorio. Y si necesitás trabajar en el piso o con movimiento, los espacios multiuso tienen colchonetas y almohadones. Reservás por hora, las que necesites, y armás cada sesión como te sirva.',
    espaciosRecomendados: ['espacio-02', 'espacio-03', 'espacio-01'],
    // SIN testimonial
    fotos: [
      { src: '/fotos/lugar-circulacion.webp', alt: 'Circulación de Espacio 1010 con lámparas circulares colgantes y luz natural al fondo', cap: 'Circulación con luz natural' },
      { src: '/fotos/lugar-pasillo.webp', alt: 'Pasillo de Espacio 1010 con muro de ladrillo original a la vista, lámparas circulares y claraboya', cap: 'Pasillo · ladrillo a la vista' },
    ],
    faq: [
      {
        q: '¿Hay materiales disponibles o llevo los míos?',
        a: 'El Espacio 02 tiene un rincón infantil con mobiliario y materiales para niños, más butacas y escritorio. Tus materiales especializados los traés vos: el espacio te da la base para armar la sesión como necesites.',
      },
      {
        q: '¿Puedo recibir al niño con la familia?',
        a: 'Sí. El Espacio 01, por ejemplo, recibe hasta 4 personas sentadas, y el Espacio 02 está pensado para trabajar con niños y familias. Si la dinámica lo pide, también podés reservar un espacio multiuso.',
      },
      {
        q: '¿Y si el niño necesita moverse?',
        a: 'Los espacios multiuso tienen colchonetas y almohadones, pensados para trabajar en el suelo y con movimiento. Podés armar y desarmar el espacio según cada sesión.',
      },
    ],
    meta:
      'Espacios para psicopedagogía por hora en Montevideo, con rincón infantil para sesiones con niños y familias. Tu primera hora es gratis.',
    whatsappIntro: 'Hola, soy psicopedagoga/o y quería más info sobre Espacio 1010.',
    variantesBusqueda: [
      'consultorio psicopedagogía',
      'espacio terapia infantil',
      'sala para sesiones con niños',
      'consultorio para fonoaudiología',
      'espacio para terapia ocupacional',
    ],
  },

  nutricionistas: {
    slug: 'nutricionistas',
    label: 'Consultorios para nutricionistas',
    titleSeo: 'Consultorio para nutricionistas por hora en Montevideo',
    intro:
      'Consultorios cómodos para consulta nutricional individual o con familias, entre Palermo y Parque Rodó. Ambiente cálido y profesional, sin costos fijos.',
    painPoints: [
      'Encadenás consultas cortas y largas — necesitás un espacio que se adapte a tu agenda, no al revés',
      'Necesitás un espacio que invite a la conversación abierta, no a la formalidad fría',
      'Querés hacer crecer tu práctica sin asumir costos fijos altos',
      'A veces atendés a deportistas, otras a familias enteras — querés flexibilidad',
    ],
    solucion:
      'El Espacio 12 suma escritorio al sillón y la butaca; todos los consultorios tienen butacas cómodas para conversaciones largas. Reservás por hora y la usás como quieras: una consulta larga o varias cortas. Crecés sin contrato ni alquiler fijo, y entre consulta y consulta tenés cocina y sala de estar para profesionales en el piso 1, sin cargo.',
    espaciosRecomendados: ['espacio-12', 'espacio-11', 'espacio-01'],
    // SIN testimonial
    fotos: [
      { src: '/fotos/lugar-fachada.webp', alt: 'Fachada reciclada del edificio de Espacio 1010, iluminada de noche, una casa de principios de siglo XX entre Palermo y Parque Rodó', cap: 'La fachada, de noche' },
      { src: '/fotos/lugar-pasillo.webp', alt: 'Pasillo de Espacio 1010 con muro de ladrillo original a la vista, lámparas circulares y claraboya', cap: 'Pasillo · ladrillo a la vista' },
    ],
    faq: [
      {
        q: '¿Hay balanza o equipamiento específico?',
        a: 'No proveemos equipamiento clínico: sí butacas cómodas, buena iluminación y, en varios consultorios, escritorio (el Espacio 12, por ejemplo). Si tenés balanza o equipo propio, lo traés con vos.',
      },
      {
        q: '¿Puedo dar charlas o talleres de alimentación?',
        a: 'Sí. Los espacios multiuso reciben hasta 8 personas sentadas, y para grupos más grandes está la Sala Arcos, con capacidad para 25 personas sentadas (se coordina por WhatsApp).',
      },
    ],
    meta:
      'Consultorio para nutricionistas por hora entre Palermo y Parque Rodó, Montevideo. Butacas cómodas, agenda online, sin costos fijos. Tu primera hora es gratis.',
    whatsappIntro: 'Hola, soy nutricionista y quería más info sobre Espacio 1010.',
    variantesBusqueda: [
      'consultorio nutrición Montevideo',
      'alquiler sala nutricionista',
      'consultorio dietista',
      'espacio para consulta deportiva',
      'sala para asesoramiento alimentario',
    ],
  },

  'meditacion-yoga': {
    slug: 'meditacion-yoga',
    label: 'Espacios para meditación y yoga',
    titleSeo: 'Sala por hora para yoga y meditación en Montevideo',
    intro:
      'Espacios multiuso despejados, con mats y almohadones, para clases reducidas, sesiones individuales o talleres — y la Sala Arcos para grupos más grandes. Entre Palermo y Parque Rodó.',
    painPoints: [
      'Los gimnasios y estudios grandes te imponen horarios y reparten alumnos',
      'Querés cuidar la experiencia desde el espacio físico, no solo desde tu práctica',
      'Necesitás flexibilidad para probar horarios sin compromiso',
      'Buscás un lugar que respire calma desde que se entra',
    ],
    solucion:
      'Los espacios multiuso vienen despejados, con colchonetas y almohadones, listos para que armes tu práctica: reciben hasta 8 personas sentadas o 6 en movimiento libre. Para grupos más grandes está la Sala Arcos, en el subsuelo, con capacidad para 25 personas. Reservás por hora —desde 1 y hasta 8 seguidas— y probás horarios sin compromiso.',
    espaciosRecomendados: ['espacio-03', 'espacio-14', 'sala-arcos'],
    testimonial: {
      texto:
        'Trabajo con grupos chicos, y acá voy a poder armar el espacio como quiera, con colchonetas y todo, pagando como un individual y no como un salón. Eso para mí es un montón. Y encima el edificio es divino, toda esa madera original tiene una historia.',
      autor: 'Maite, 39 años',
      rol: 'Método Feldenkrais',
    },
    fotos: [
      { src: '/fotos/lugar-subsuelo.webp', alt: 'Subsuelo de Espacio 1010 con muro de piedra y arco original iluminado, piso de madera', cap: 'Subsuelo · piedra y arco originales' },
      { src: '/fotos/lugar-sala-subsuelo.webp', alt: 'Sala amplia del subsuelo de Espacio 1010 con muro de piedra, piso de madera y escalera metálica', cap: 'Sala del subsuelo' },
    ],
    faq: [
      {
        q: '¿Hay colchonetas y materiales disponibles?',
        a: 'Sí: los espacios multiuso tienen mats, colchonetas y almohadones. Bloques, correas u otros elementos específicos de tu práctica los traés vos.',
      },
      {
        q: '¿Cuántas personas entran?',
        a: 'Los espacios multiuso reciben hasta 8 personas sentadas o 6 en movimiento libre. Para grupos más grandes está la Sala Arcos, con capacidad para 25 personas sentadas — se coordina por WhatsApp.',
      },
      {
        q: '¿En qué horarios puedo dar clase?',
        a: 'El edificio funciona 24/7: por la app reservás de 7 a 24, y los horarios de madrugada se coordinan por WhatsApp. Podés reservar una hora suelta para probar un horario, o fijar tu día y hora todas las semanas hasta que vos la liberes.',
      },
    ],
    meta:
      'Salas por hora para yoga y meditación entre Palermo y Parque Rodó, Montevideo. Mats y almohadones, y sala para 25 personas. Tu primera hora es gratis.',
    whatsappIntro: 'Hola, doy clases de yoga/meditación y quería más info sobre Espacio 1010.',
    variantesBusqueda: [
      'salón yoga alquiler hora',
      'sala meditación grupal',
      'espacio para clase de yoga',
      'sala mindfulness Montevideo',
      'espacio para práctica corporal',
      'estudio yoga reducido',
    ],
  },

  'talleres-grupos': {
    slug: 'talleres-grupos',
    label: 'Sala para talleres y trabajo grupal',
    titleSeo: 'Sala Arcos: talleres y grupos en Montevideo',
    intro:
      'La Sala Arcos, en el subsuelo, te recibe para grupos de hasta 25 personas: 40 m² con piedra y arcos originales, sillas y mesas, proyector, parlante, kitchenette y baño independiente. Para tu taller, formación o encuentro grupal.',
    painPoints: [
      'Las salas de eventos son frías y caras, las casas privadas son pequeñas y poco profesionales',
      'Necesitás flexibilidad para configurar el espacio según la dinámica',
      'Querés un lugar que comunique cuidado, no solo metros cuadrados',
      'Tu taller puede durar 2 horas u 8 — necesitás reservar todo el bloque junto',
    ],
    solucion:
      'La Sala Arcos está pensada justamente para esto: sillas y mesas para armar círculo o filas, proyector y parlante incluidos, kitchenette y baño independiente. Reservás por hora —hasta 8 seguidas si tu taller lo necesita— y lo coordinamos por WhatsApp según fecha y duración. Ideal para constelaciones, formaciones, presentaciones o grupos terapéuticos. Para grupos chicos también están los espacios multiuso, que pagás como un consultorio.',
    espaciosRecomendados: ['sala-arcos', 'espacio-03', 'espacio-14'],
    testimonial: {
      texto:
        'Para lo que hago necesito de todo: a veces un grupo grande, a veces algo más chico, a veces una consulta sola. Tener todo en un mismo lugar me va a resolver la vida. Y poder trabajar un fin de semana o bien temprano a la mañana, para mí no tiene precio.',
      autor: 'Patricia, 62 años',
      rol: 'Consteladora familiar',
    },
    fotos: [
      { src: '/fotos/lugar-sala-subsuelo.webp', alt: 'Sala amplia del subsuelo de Espacio 1010 con muro de piedra, piso de madera y escalera metálica', cap: 'Sala del subsuelo' },
      { src: '/fotos/lugar-subsuelo.webp', alt: 'Subsuelo de Espacio 1010 con muro de piedra y arco original iluminado, piso de madera', cap: 'Subsuelo · piedra y arco originales' },
    ],
    faq: [
      {
        q: '¿Cuánto cuesta la Sala Arcos?',
        a: '$700 la hora. Reservás en bloques de 1 hora, hasta 8 horas seguidas si tu taller lo necesita. Escribinos por WhatsApp y lo coordinamos según fecha y duración.',
      },
      {
        q: '¿Hay proyector o sonido?',
        a: 'Sí: la sala incluye proyector y parlante, además de sillas, mesas, colchonetas y almohadones. También tiene kitchenette y baño independiente.',
      },
      {
        q: '¿Puede entrar comida?',
        a: 'La sala tiene kitchenette propia para servir café y agua sin salir del subsuelo. Si tu taller incluye comida, contanos por WhatsApp y lo coordinamos.',
      },
      {
        q: '¿Cómo accede el grupo el día del taller?',
        a: 'Vos entrás con tu código personal y recibís a tu grupo en la entrada. El edificio funciona con videoportero y acceso registrado.',
      },
    ],
    meta:
      'Sala Arcos: sala para talleres y grupos en Montevideo. 40 m², hasta 25 personas, proyector y kitchenette. Consultá por WhatsApp.',
    whatsappIntro: 'Hola, quería info sobre la Sala Arcos para un taller.',
    variantesBusqueda: [
      'sala talleres Montevideo',
      'espacio para formación profesional',
      'sala constelaciones familiares',
      'sala para grupo terapéutico',
      'salón para presentación de libro',
      'sala alquiler por día',
      'espacio para retiro corto',
    ],
  },
};

export function getNichoContent(slug: string): NichoContent | undefined {
  return NICHOS_CONTENT[slug];
}
