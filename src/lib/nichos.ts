/**
 * Contenido SEO + ads de cada landing /para/[slug].
 *
 * Estructura pensada para:
 *   - SEO long-tail (cada página tiene H1 con keyword principal del nicho,
 *     subhead con keyword secundaria, FAQ con preguntas long-tail)
 *   - Ads landings (un único H1, CTA arriba, prueba social abajo, FAQ que
 *     destraba objeciones)
 *
 * Si querés que la landing cargue con un mensaje específico de campaña,
 * la URL admite `?utm_campaign=...` y podés agregar lógica para mostrar
 * variantes — para v1 el contenido es estático.
 */

import type { EspacioId } from './site';

export interface NichoContent {
  slug: string;
  /** H1 / title para SEO */
  label: string;
  /** Subhead descriptivo bajo el H1 */
  intro: string;
  /** Lo que buscan resolver — habla de su realidad, no de features */
  painPoints: string[];
  /** Por qué Espacio 1010 funciona para este nicho */
  solucion: string;
  /** Espacios que se ajustan al nicho — IDs de ESPACIOS */
  espaciosRecomendados: EspacioId[];
  /** Quote testimonial (placeholder hasta tener reales) */
  testimonial: { texto: string; autor: string; rol: string };
  /** FAQ específica del nicho (sobre la práctica + sobre el espacio) */
  faq: { q: string; a: string }[];
  /** Keywords para meta description */
  meta: string;
}

export const NICHOS_CONTENT: Record<string, NichoContent> = {
  psicologos: {
    slug: 'psicologos',
    label: 'Espacios para psicólogas y psicólogos',
    intro:
      'Consultorios por hora pensados para la práctica clínica. Privacidad acústica, agenda online y la flexibilidad que te permite armar tu semana como vos querés.',
    painPoints: [
      'Alquilar un consultorio propio cuesta lo que cuesta — y tenés que llenarlo solo',
      'Compartir mal con colegas termina en conflictos por turnos',
      'Las salas comerciales por hora son frías, mal equipadas o difíciles de reservar',
      'Coordinar por WhatsApp con un encargado te hace perder tiempo todas las semanas',
    ],
    solucion:
      'Diseñamos cada espacio pensando en la sesión. Sillón cómodo, escritorio si lo necesitás, privacidad sonora real y aire acondicionado individual. La agenda online te deja ver disponibilidad y reservar en tiempo real, sin pasar por nadie. Si tu agenda cambia, cancelás con 24 hs y no pagás nada.',
    espaciosRecomendados: ['estudio-norte', 'estudio-sur', 'consulta-1', 'consulta-2', 'consulta-7'],
    testimonial: {
      texto:
        'Tener la agenda abierta cuando atiendo me cambió la semana. Reservo el lunes y el jueves a las 6, y si una vez no puedo, cancelo desde el celular. Listo.',
      autor: 'Profesional fundadora',
      rol: 'Psicóloga clínica, Cordón',
    },
    faq: [
      {
        q: '¿Puedo recibir pacientes adultos y niños en el mismo espacio?',
        a: 'Sí, varios de nuestros espacios están equipados para ambos. Si trabajás regularmente con niños, te recomendamos las consultas con más metros y materiales versátiles.',
      },
      {
        q: '¿Hay divan para psicoanálisis?',
        a: 'Sí, algunos espacios cuentan con divan. Especificá en la reserva o consultanos para que te orientemos al espacio adecuado.',
      },
      {
        q: '¿Cómo manejo la confidencialidad entre sesiones?',
        a: 'La privacidad acústica es prioridad. Trabajamos especialmente la insonorización y sumamos música ambiente en pasillos. Es muy difícil escuchar de un espacio a otro.',
      },
      {
        q: '¿Puedo dejar mis libros o materiales entre sesiones?',
        a: 'Si tenés serie fija con espacio asignado, hay opción de armario reservado. En reservas eventuales el espacio queda disponible para otros profesionales.',
      },
    ],
    meta:
      'Alquilá consultorio por hora para psicólogos en Cordón, Montevideo. 12 espacios premium, reservas online, cancelación flexible. Para sesiones individuales, pareja o grupales.',
  },

  psiquiatras: {
    slug: 'psiquiatras',
    label: 'Consultorios para psiquiatras',
    intro:
      'Espacios sobrios y profesionales para consulta clínica. Ubicación céntrica, privacidad acústica garantizada y la posibilidad de armar tu propia agenda sin ataduras.',
    painPoints: [
      'Necesitás un entorno serio que respalde tu práctica',
      'No querés depender de un sanatorio o policlínica con horarios fijos',
      'Querés mantener consulta privada sin invertir en consultorio propio',
      'Buscás flexibilidad para combinar consulta presencial con teleconsulta',
    ],
    solucion:
      'El edificio fue pensado para profesionales de la salud — la sala de espera, los pasillos, el detalle del mobiliario están al nivel de una clínica boutique. Reservás los días y horarios que se ajustan a tu agenda hospitalaria, y mantenés consulta privada sin costos fijos altos.',
    espaciosRecomendados: ['consulta-1', 'consulta-2', 'consulta-7', 'estudio-norte'],
    testimonial: {
      texto:
        'Vengo dos veces por semana después del hospital. Es el lugar que necesitaba para tener consulta privada sin atarme a un alquiler mensual.',
      autor: 'Profesional fundador',
      rol: 'Psiquiatra, Montevideo',
    },
    faq: [
      {
        q: '¿El espacio tiene la formalidad que necesita la consulta psiquiátrica?',
        a: 'Sí. El mobiliario, la sala de espera y la atención de detalle están pensados para una práctica clínica formal. Recibí a tus pacientes con la presencia que tu profesión requiere.',
      },
      {
        q: '¿Puedo recetar y emitir documentación profesional desde el espacio?',
        a: 'Por supuesto. Es tu consulta privada cuando estás acá. Wifi de fibra y todo lo que necesites para trabajar con tu sistema de historias clínicas habitual.',
      },
      {
        q: '¿Hay opción de bloqueo de horario fijo semanal?',
        a: 'Sí. La serie fija te garantiza día, hora y espacio todas las semanas. Es lo que la mayoría de los psiquiatras eligen para construir su agenda privada.',
      },
    ],
    meta:
      'Consultorio para psiquiatra en alquiler por hora en Montevideo. Espacios sobrios y profesionales en Cordón, agenda online flexible, sin contrato anual.',
  },

  psicopedagogos: {
    slug: 'psicopedagogos',
    label: 'Espacios para psicopedagogía',
    intro:
      'Consultorios con espacio para materiales, juego y trabajo individual o con familias. Pensados para sesiones con niños, adolescentes y adultos.',
    painPoints: [
      'Necesitás espacio físico para desplegar materiales',
      'A veces atendés con la familia, a veces solo con el niño',
      'Querés un lugar donde el niño se sienta cómodo, no en una sala estéril',
      'Tus sesiones pueden ser más largas y necesitás flexibilidad horaria',
    ],
    solucion:
      'Los espacios mixtos y versátiles te permiten configurar cada sesión: mesa de trabajo, alfombra, materiales móviles. Las consultas más amplias dan margen para que el niño se mueva y la familia pueda participar cuando hace falta. Reservás bloques de 1 hora o más según necesites.',
    espaciosRecomendados: ['consulta-4', 'estudio-norte', 'estudio-sur', 'salon-cobre'],
    testimonial: {
      texto:
        'Atender psicopedagogía es atender un montón de cosas al mismo tiempo. Acá puedo armar el espacio como lo necesito para cada paciente.',
      autor: 'Profesional fundadora',
      rol: 'Psicopedagoga, Cordón',
    },
    faq: [
      {
        q: '¿Hay materiales disponibles o tengo que llevar los míos?',
        a: 'Los materiales especializados son tuyos. El espacio te provee mobiliario (mesa, sillas, alfombra) y la versatilidad para armar la sesión como necesites.',
      },
      {
        q: '¿Puedo recibir al niño con la familia?',
        a: 'Sí. Los espacios más amplios tienen lugar para sesiones con 3 a 4 personas cómodas. Si planeás trabajar regularmente con familias, sumamos esa info al reservar.',
      },
      {
        q: '¿Cómo manejan los espacios con niños inquietos?',
        a: 'Los pisos son aptos para juego en el suelo. Algunas consultas tienen colchonetas disponibles. La acústica entre espacios está trabajada para que no moleste a tus colegas.',
      },
    ],
    meta:
      'Espacios para psicopedagogía en Montevideo. Consultorios versátiles con material para juego y trabajo, ideales para sesiones con niños y adolescentes.',
  },

  nutricionistas: {
    slug: 'nutricionistas',
    label: 'Consultorios para nutricionistas',
    intro:
      'Espacios cómodos para consulta nutricional individual o de pareja. Privacidad para hablar de hábitos sin interrupciones, ambiente cálido y profesional.',
    painPoints: [
      'Tu consulta puede durar 30 minutos o una hora completa según el tipo de seguimiento',
      'Necesitás un espacio que invite a la conversación abierta, no a la formalidad fría',
      'Querés crecer tu práctica sin asumir costos fijos altos',
      'A veces atendés a deportistas, otras a familias enteras — querés flexibilidad',
    ],
    solucion:
      'Los espacios cuentan con escritorio y sillas cómodas para consultas largas. La sala de espera es agradable y la cocina común te permite mostrar opciones de hidratación si lo necesitás. Reservás bloques de 1 hora y crecés tu agenda sin contrato.',
    espaciosRecomendados: ['consulta-3', 'consulta-1', 'estudio-sur'],
    testimonial: {
      texto:
        'Mis pacientes vienen relajados. El edificio se siente como un consultorio premium pero la conversación fluye porque no es un hospital.',
      autor: 'Profesional fundador',
      rol: 'Nutricionista, Cordón',
    },
    faq: [
      {
        q: '¿Hay balanza o equipamiento específico?',
        a: 'No proveemos equipamiento clínico especializado — sí escritorio, sillas, buena iluminación. Si tenés balanza o equipo, lo traés contigo. Algunos profesionales con serie fija lo dejan en armario reservado.',
      },
      {
        q: '¿Puedo dar charlas grupales o talleres de alimentación?',
        a: 'Sí, en los salones grupales o en la sala subsuelo. Para talleres regulares te recomendamos serie fija con horario garantizado.',
      },
    ],
    meta:
      'Consultorio para nutricionista en Montevideo, alquiler por hora en Cordón. Espacios cómodos para consulta individual y de pareja, agenda online flexible.',
  },

  'meditacion-yoga': {
    slug: 'meditacion-yoga',
    label: 'Salones para meditación y yoga',
    intro:
      'Salones versátiles con piso noble, luz regulable y colchonetas. Para clases reducidas, sesiones individuales o talleres de fin de semana.',
    painPoints: [
      'Los gimnasios y estudios grandes te imponen horarios y reparten alumnos',
      'Querés cuidar la experiencia desde el espacio físico, no solo desde tu práctica',
      'Necesitás flexibilidad para probar horarios sin compromiso',
      'Buscás un lugar que respire calma desde que se entra',
    ],
    solucion:
      'Los salones versátiles vienen con colchonetas, soportes y mobiliario móvil. La acústica está trabajada, la luz se regula, la música ambiente la silenciás cuando entrás a dar clase. Reservás 1 o 2 horas para una clase reducida, o un día entero para taller.',
    espaciosRecomendados: ['salon-cobre', 'salon-roble', 'sala-subsuelo'],
    testimonial: {
      texto:
        'Probé varios espacios antes de quedarme acá. La diferencia se nota cuando los alumnos entran y se quedan en silencio sin que se los pidas.',
      autor: 'Profesional fundadora',
      rol: 'Instructora de yoga, Cordón',
    },
    faq: [
      {
        q: '¿Hay colchonetas y materiales disponibles?',
        a: 'Sí, colchonetas básicas. Si querés mats específicos, bloques o correas profesionales, te recomendamos traer los propios o evaluar guardarlos en armario si tenés serie fija.',
      },
      {
        q: '¿Cuántas personas entran en cada salón?',
        a: 'Salón Cobre: 6-10 personas cómodas. Salón Roble: 6-8 personas. Sala subsuelo: 20-30 personas, sin columnas. Los tamaños se pueden ajustar según tipo de práctica.',
      },
      {
        q: '¿Cómo es la ventilación?',
        a: 'Cada salón tiene aire acondicionado individual y ventanas que se abren. El edificio tiene buena ventilación cruzada — pensado para mantener el aire renovado.',
      },
    ],
    meta:
      'Salones para clases de yoga y meditación en Montevideo, Cordón. Espacios versátiles con colchonetas, alquiler por hora o día, sin contrato.',
  },

  'talleres-grupos': {
    slug: 'talleres-grupos',
    label: 'Sala para talleres y trabajo grupal',
    intro:
      'La sala subsuelo de 60 m² te recibe para grupos de hasta 30 personas. Sin columnas, mobiliario versátil, acústica trabajada — para tu taller, formación o presentación.',
    painPoints: [
      'Las salas de eventos son frías y caras, las casas privadas son pequeñas y poco profesionales',
      'Necesitás flexibilidad para configurar el espacio según la dinámica',
      'Querés un lugar que comunique cuidado, no solo metros cuadrados',
      'Tu taller puede durar 2 horas o 8 — necesitás reservar en bloque',
    ],
    solucion:
      'La sala subsuelo está pensada justamente para esto: sin columnas, sillas apilables, posibilidad de armar círculo o filas, acceso a baño y cocina. Reservás por bloques de 2 hs o por día completo. Ideal para constelaciones, formaciones, presentaciones o grupos terapéuticos.',
    espaciosRecomendados: ['sala-subsuelo', 'salon-cobre', 'salon-roble'],
    testimonial: {
      texto:
        'Hago constelaciones cada dos meses. Tener la sala lista, sin tener que armar y desarmar, vale oro. Llego y empiezo.',
      autor: 'Profesional fundadora',
      rol: 'Consteladora familiar, Cordón',
    },
    faq: [
      {
        q: '¿Cuánto cuesta reservar la sala por un día completo?',
        a: 'Tiene tarifa diferenciada por bloque y por día. Consultanos por WhatsApp y te pasamos el detalle según fecha y duración.',
      },
      {
        q: '¿Hay proyector, sonido o pizarra?',
        a: 'Proyector + sonido vienen incluidos cuando reservás bloques de 4 hs o más. Pizarra y rotafolio disponibles a pedido. Lo coordinamos al reservar.',
      },
      {
        q: '¿Puede entrar comida o catering?',
        a: 'Sí, podés traer catering propio. La cocina común del edificio se puede usar para servir café y agua. Para catering completo coordinamos con un proveedor de confianza.',
      },
      {
        q: '¿Cómo accede el grupo el día del taller?',
        a: 'Coordinamos un horario de apertura y una persona del edificio recibe a los participantes en la entrada. Vos te concentrás en armar el espacio.',
      },
    ],
    meta:
      'Sala para talleres, formaciones y grupos en Montevideo. 60 m² sin columnas en Cordón, hasta 30 personas, reservás por bloques o día completo.',
  },
};

export function getNichoContent(slug: string): NichoContent | undefined {
  return NICHOS_CONTENT[slug];
}
