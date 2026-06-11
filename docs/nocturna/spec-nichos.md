# SPEC FINAL — `/para/[slug]` (6 nichos)

**Fecha:** 2026-06-10 (sesión nocturna) · **Sintetizador:** subagente `nichos`
**Archivos a tocar:** `src/lib/nichos.ts` y `src/pages/para/[slug].astro` (nada más).
**Insumos:** `docs/nocturna/audit-nichos.md` + `docs/VERDAD_APP_2026_06_10.md`.

**⚠️ Nota de proceso:** el JSON con los veredictos del panel de 3 lentes llegó VACÍO
(placeholder `${JSON}` sin sustituir en el prompt del orquestador — mismo problema que
en las otras specs de la noche). Esta spec se sintetizó solo con el informe del auditor
contrastado contra la fuente de verdad. Si el panel objetó algo, NO está incorporado.

**Criterio aplicado:** usuario real > SEO > estética; la fuente de verdad gana siempre.
Vos rioplatense, sin "boutique/insonorizado/Cordón", "sin compromiso" (no "sin
permanencia"), sin "12 espacios" en subpáginas, CTA primario `/#registro`, Sala Arcos
por WhatsApp, testimonios solo los reales de la home.

---

## ⚠️ DEPENDENCIA DURA — leer antes de implementar

El cambio 2 (espacios recomendados reales) usa los IDs nuevos `espacio-01…espacio-14` /
`sala-arcos` que propone `docs/nocturna/audit-espacios.md` para reemplazar `ESPACIOS` en
`src/lib/site.ts`. **`nichos.ts` está tipado con `EspacioId`: si la spec de espacios no
se implementa en el MISMO commit, el build rompe.**

- **Si spec-espacios se implementa junto con esta** → aplicar el cambio 2 tal cual.
- **Si NO** (fallback) → en `[slug].astro` eliminar la sección "Espacios pensados para tu
  práctica" completa (líneas 112-123), el import de `EspacioCard` y `ESPACIOS`, y la
  constante `espaciosDelNicho`; en `nichos.ts` eliminar el campo `espaciosRecomendados`
  de la interfaz y de los 6 nichos (y el `import type { EspacioId }`). Nunca dejar las
  cards ficticias publicadas.

---

# PARTE 1 — `src/lib/nichos.ts`

## Cambio 1 — Interfaz `NichoContent`

- `testimonial` pasa a ser **opcional** (solo 3 nichos tienen testimonio real).
- Nuevos campos: `titleSeo` (title con geo, distinto del H1), `whatsappIntro` (mensaje
  exacto de WhatsApp — hoy se autogenera roto: "Hola, soy meditación y yoga"), y
  `fotos` (banda de fotos reales, assets que ya existen en `public/fotos/`).
- Actualizar el comentario de `testimonial` (ya no es "placeholder hasta tener reales").

```ts
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
  /** Variaciones de búsqueda long-tail (chips "También conocido como") */
  variantesBusqueda: string[];
}
```

## Cambio 2 — Contenido de los 6 nichos (reemplazo COMPLETO de `NICHOS_CONTENT`)

`variantesBusqueda` se mantiene tal cual está hoy en los 6 nichos (no se lista de nuevo).
Todo lo demás queda EXACTAMENTE así:

### 2a. psicologos

```ts
psicologos: {
  slug: 'psicologos',
  label: 'Espacios para psicólogas y psicólogos',
  titleSeo: 'Consultorio por hora para psicólogos en Montevideo',
  intro:
    'Consultorios por hora pensados para la práctica clínica, entre Palermo y Parque Rodó. Agenda online, espacios pensados para trabajar con privacidad y la flexibilidad de armar tu semana como vos quieras. Abrimos en junio 2026.',
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
      a: 'Sí. Para sesiones con niños y familias está el Espacio 02, con rincón infantil: mobiliario y materiales pensados para niños, además de butacas y escritorio. Para adultos, cualquiera de los consultorios amueblados.',
    },
    {
      q: '¿Cómo están equipados los consultorios?',
      a: 'Cada consultorio amueblado tiene sillón o butacas cómodas, y varios suman escritorio. El Espacio 01, por ejemplo, tiene un sillón de tres cuerpos más una butaca individual. Si necesitás algo puntual para tu práctica, escribinos por WhatsApp y lo conversamos.',
    },
    {
      q: '¿Cómo se cuida la privacidad de las sesiones?',
      a: 'Los espacios están pensados para conversaciones privadas y el edificio es de uso exclusivo de profesionales: nada de público de paso. Las cámaras están solo en la entrada y zonas comunes, nunca en los espacios de atención.',
    },
    {
      q: '¿Puedo dejar mis libros o materiales entre sesiones?',
      a: 'Los espacios se comparten entre profesionales, así que cada quien lleva sus materiales. Si tenés una necesidad puntual, escribinos por WhatsApp y lo conversamos.',
    },
  ],
  meta:
    'Alquilá consultorio por hora para psicólogos entre Palermo y Parque Rodó, Montevideo. Consultorios amueblados, reserva online, cancelación gratis con 24 h. Pre-registrate y tu primera hora es gratis.',
  whatsappIntro: 'Hola, soy psicóloga/o y quería más info sobre Espacio 1010.',
  variantesBusqueda: [/* sin cambios */],
},
```

### 2b. psiquiatras

```ts
psiquiatras: {
  slug: 'psiquiatras',
  label: 'Consultorios para psiquiatras',
  titleSeo: 'Consultorio para psiquiatras por hora en Montevideo',
  intro:
    'Consultorios sobrios y profesionales para tu consulta privada, entre Palermo y Parque Rodó. Reservás por hora, sin costos fijos y sin compromiso. Abrimos en junio 2026.',
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
      a: 'Sí. Los consultorios son sobrios, amoblados y climatizados, en un edificio reciclado a nuevo y de uso exclusivo de profesionales. Recibís a las personas que atendés con la presencia que tu práctica requiere.',
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
    'Consultorio para psiquiatras en alquiler por hora entre Palermo y Parque Rodó, Montevideo. Espacios sobrios, agenda online, sin contrato ni costos fijos. Pre-registrate y tu primera hora es gratis.',
  whatsappIntro: 'Hola, soy psiquiatra y quería más info sobre Espacio 1010.',
  variantesBusqueda: [/* sin cambios */],
},
```

### 2c. psicopedagogos

```ts
psicopedagogos: {
  slug: 'psicopedagogos',
  label: 'Espacios para psicopedagogía',
  titleSeo: 'Consultorio por hora para psicopedagogía en Montevideo',
  intro:
    'Consultorios con lugar para materiales, juego y trabajo con familias. Pensados para sesiones con niños, adolescentes y adultos, entre Palermo y Parque Rodó. Abrimos en junio 2026.',
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
      a: 'Los espacios multiuso tienen colchonetas y almohadones, y los pisos son aptos para trabajar en el suelo. Podés armar y desarmar el espacio según cada sesión.',
    },
  ],
  meta:
    'Espacios para psicopedagogía por hora en Montevideo, entre Palermo y Parque Rodó. Consultorio con rincón infantil para sesiones con niños y familias. Pre-registrate y tu primera hora es gratis.',
  whatsappIntro: 'Hola, soy psicopedagoga/o y quería más info sobre Espacio 1010.',
  variantesBusqueda: [/* sin cambios */],
},
```

### 2d. nutricionistas

```ts
nutricionistas: {
  slug: 'nutricionistas',
  label: 'Consultorios para nutricionistas',
  titleSeo: 'Consultorio para nutricionistas por hora en Montevideo',
  intro:
    'Consultorios cómodos para consulta nutricional individual o con familias, entre Palermo y Parque Rodó. Ambiente cálido y profesional, sin costos fijos. Abrimos en junio 2026.',
  painPoints: [
    'Encadenás consultas cortas y largas — necesitás un espacio que se adapte a tu agenda, no al revés',
    'Necesitás un espacio que invite a la conversación abierta, no a la formalidad fría',
    'Querés hacer crecer tu práctica sin asumir costos fijos altos',
    'A veces atendés a deportistas, otras a familias enteras — querés flexibilidad',
  ],
  solucion:
    'Los consultorios tienen escritorio y butacas cómodas para conversaciones largas. Reservás por hora y la usás como quieras: una consulta larga o varias cortas. Crecés sin contrato ni alquiler fijo, y entre consulta y consulta tenés cocina y sala de estar para profesionales en el piso 1, sin cargo.',
  espaciosRecomendados: ['espacio-12', 'espacio-11', 'espacio-01'],
  // SIN testimonial
  fotos: [
    { src: '/fotos/lugar-fachada.webp', alt: 'Fachada reciclada del edificio de Espacio 1010, iluminada de noche, una casa de principios de siglo XX entre Palermo y Parque Rodó', cap: 'La fachada, de noche' },
    { src: '/fotos/lugar-pasillo.webp', alt: 'Pasillo de Espacio 1010 con muro de ladrillo original a la vista, lámparas circulares y claraboya', cap: 'Pasillo · ladrillo a la vista' },
  ],
  faq: [
    {
      q: '¿Hay balanza o equipamiento específico?',
      a: 'No proveemos equipamiento clínico: sí escritorio, butacas cómodas y buena iluminación. Si tenés balanza o equipo propio, lo traés con vos.',
    },
    {
      q: '¿Puedo dar charlas o talleres de alimentación?',
      a: 'Sí. Los espacios multiuso reciben hasta 8 personas sentadas, y para grupos más grandes está la Sala Arcos, con capacidad para 25 personas sentadas (se coordina por WhatsApp).',
    },
  ],
  meta:
    'Consultorio para nutricionistas por hora entre Palermo y Parque Rodó, Montevideo. Espacios cómodos con escritorio, agenda online, sin costos fijos. Pre-registrate y tu primera hora es gratis.',
  whatsappIntro: 'Hola, soy nutricionista y quería más info sobre Espacio 1010.',
  variantesBusqueda: [/* sin cambios */],
},
```

### 2e. meditacion-yoga

```ts
'meditacion-yoga': {
  slug: 'meditacion-yoga',
  label: 'Espacios para meditación y yoga',
  titleSeo: 'Sala por hora para yoga y meditación en Montevideo',
  intro:
    'Espacios multiuso despejados, con mats y almohadones, para clases reducidas, sesiones individuales o talleres — y la Sala Arcos para grupos más grandes. Entre Palermo y Parque Rodó. Abrimos en junio 2026.',
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
      a: 'Todos los días, de 7 a 24 h. Podés reservar una hora suelta para probar un horario, o fijar tu día y hora todas las semanas hasta que vos la liberes.',
    },
  ],
  meta:
    'Espacios por hora para clases de yoga y meditación en Montevideo, entre Palermo y Parque Rodó. Multiuso con mats y almohadones, y sala para 25 personas. Pre-registrate y tu primera hora es gratis.',
  whatsappIntro: 'Hola, doy clases de yoga/meditación y quería más info sobre Espacio 1010.',
  variantesBusqueda: [/* sin cambios */],
},
```

### 2f. talleres-grupos

```ts
'talleres-grupos': {
  slug: 'talleres-grupos',
  label: 'Sala para talleres y trabajo grupal',
  titleSeo: 'Sala para talleres y grupos en Montevideo — Sala Arcos',
  intro:
    'La Sala Arcos, en el subsuelo, te recibe para grupos de hasta 25 personas: 40 m² con piedra y arcos originales, sillas y mesas, proyector, parlante, kitchenette y baño independiente. Para tu taller, formación o encuentro grupal. Abrimos en junio 2026.',
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
      a: 'Sí, podés traer lo tuyo: la sala tiene kitchenette propia para servir café y agua sin salir del subsuelo.',
    },
    {
      q: '¿Cómo accede el grupo el día del taller?',
      a: 'Vos entrás con tu código personal y recibís a tu grupo en la entrada. El edificio funciona con videoportero y acceso registrado.',
    },
  ],
  meta:
    'Sala para talleres, formaciones y grupos en Montevideo. La Sala Arcos: 40 m² entre Palermo y Parque Rodó, hasta 25 personas, proyector y kitchenette. Consultá por WhatsApp.',
  whatsappIntro: 'Hola, quería info sobre la Sala Arcos para un taller.',
  variantesBusqueda: [/* sin cambios */],
},
```

---

# PARTE 2 — `src/pages/para/[slug].astro`

## Cambio 3 — Frontmatter: title y flag de Sala Arcos

Después de `const { nicho } = Astro.props;` agregar:

```ts
// La Sala Arcos no se reserva por la app: en talleres-grupos el CTA primario es WhatsApp.
const esTalleres = nicho.slug === 'talleres-grupos';
```

Y en el `<BaseLayout>` usar el title nuevo: `title={nicho.titleSeo}` (description y
ogSlug quedan como están).

## Cambio 4 — Schema: Service con url y breadcrumb arreglado

- En `schemaService`, el `provider` pasa a:
  `provider: { '@type': 'LocalBusiness', name: 'Espacio 1010', url: SITE.url },`
- En `schemaBreadcrumb` (línea 48), el nivel intermedio
  `{ name: 'Para profesionales', url: '/#para-profesionales' }` (ancla inexistente) pasa a:
  `{ name: 'Los espacios', url: '/los-espacios' }`
- El `schemaFAQ` no se toca: queda correcto solo, porque las respuestas falsas
  desaparecen con el cambio 2.

## Cambio 5 — Hero: badge, CTAs y línea de precio

- Badge (líneas 63-65): `Para profesionales` →
  - 5 nichos: `Pre-lanzamiento · tu primera hora gratis`
  - talleres-grupos: `Pre-lanzamiento · abrimos en junio 2026`
  - Implementación: `{esTalleres ? 'Pre-lanzamiento · abrimos en junio 2026' : 'Pre-lanzamiento · tu primera hora gratis'}`
- Botones (líneas 71-78):
  - 5 nichos — primario: `Quiero mi primera hora gratis` → `href="/#registro"`;
    secundario queda `Ver los espacios` → `/los-espacios` (sin cambios).
  - talleres-grupos — primario: `Consultar por la Sala Arcos` →
    `href={CONTACT.whatsappLink(nicho.whatsappIntro)}` con `target="_blank"`;
    secundario: `Quiero mi primera hora gratis` → `href="/#registro"` (variant ghost).
- Línea de precio NUEVA debajo de los botones (`<p class="mt-4 text-sm text-ink-soft">`):
  - 5 nichos: `$350 la hora, todo incluido · sin costos fijos ni compromiso — y tu primera hora es gratis.`
  - talleres-grupos: `Sala Arcos: $700 la hora · espacios multiuso para grupos chicos: $350 — y tu primera hora es gratis al pre-registrarte.`

## Cambio 6 — Banda de fotos reales (sección NUEVA)

Entre la sección "Pain points + solución" y "Espacios recomendados", agregar:

```astro
<!-- Fotos reales del lugar -->
<section class="py-16">
  <Container>
    <div class="grid gap-4 sm:grid-cols-2">
      {nicho.fotos.map((f) => (
        <figure class="group overflow-hidden rounded-[var(--radius-xl)] border border-hairline shadow-[var(--shadow-md)]">
          <div class="relative aspect-[3/2] overflow-hidden">
            <img src={f.src} alt={f.alt} loading="lazy" decoding="async"
              class="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-105" />
            <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 via-ink/30 to-transparent p-4 pt-12">
              <p class="text-sm font-medium text-white">{f.cap}</p>
            </div>
          </div>
        </figure>
      ))}
    </div>
    <p class="mt-6 text-center text-sm text-ink-muted">Fotos reales de cada espacio, muy pronto.</p>
  </Container>
</section>
```

## Cambio 7 — Espacios recomendados: copy + datos reales

- La bajada (línea 117) `Estos son los que mejor se ajustan a la forma de trabajo de
  quien hace lo tuyo.` → `Los que mejor se ajustan a tu forma de trabajar.`
- Las cards se alimentan de los `espaciosRecomendados` nuevos (cambio 2) + el `ESPACIOS`
  real de spec-espacios. **Ver la DEPENDENCIA DURA arriba**: si site.ts no se reemplaza
  en el mismo commit, esta sección se ELIMINA (fallback), nunca se publica ficticia.

## Cambio 8 — Testimonial condicional + badge real

Envolver la sección (líneas 125-138) en `{nicho.testimonial && ( ... )}` y dentro,
antes del `<blockquote>`, agregar el badge real de la home:

```astro
<span class="mb-5 inline-flex w-fit items-center gap-1.5 rounded-full bg-terracota/20 px-3 py-1 text-[11px] font-medium text-terracota-light">
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
  Ya reservó para la apertura
</span>
```

El footer de la cita queda `— {nicho.testimonial.autor}, {nicho.testimonial.rol}` (el
autor ya incluye la edad: "Claudia, 36 años"). Con `testimonial` ausente (psiquiatras,
psicopedagogos, nutricionistas) la sección no se renderiza.

## Cambio 9 — CTA final (líneas 185-209)

Reemplazar el contenido del bloque degradado:

**5 nichos:**
- H2: `Tu primera hora, gratis.`
- Texto: `Pre-registrate gratis, sin tarjeta y sin compromiso. Te guardamos tu primera hora para usarla cuando quieras durante 2026, en el espacio que elijas.`
- Botón primario: `Quiero mi primera hora gratis` → `href="/#registro"` (estilos del botón blanco actuales).
- Botón secundario: `Hablar por WhatsApp` → `href={CONTACT.whatsappLink(nicho.whatsappIntro)}`, `target="_blank"` (estilos actuales). Esto ELIMINA el `.toLowerCase().replace(...)` roto de la línea 198.

**talleres-grupos:**
- H2: `¿Armamos tu taller?`
- Texto: `Contanos fecha, duración y cuántas personas vienen, y lo coordinamos por WhatsApp. Y si también atendés individual, pre-registrate: tu primera hora en los consultorios es gratis.`
- Botón primario: `Consultar por la Sala Arcos` → `href={CONTACT.whatsappLink(nicho.whatsappIntro)}`, `target="_blank"`.
- Botón secundario: `Quiero mi primera hora gratis` → `href="/#registro"`.

PROHIBIDO conservar: `¿Probamos?`, `Crear cuenta es gratis. Después ves la
disponibilidad real…`, `Crear mi cuenta`, y cualquier `href={SITE.agendaUrl}`.

## Cambio 10 — Limpieza final (verificación)

Al terminar, grep sobre `src/lib/nichos.ts` + `src/pages/para/[slug].astro`: NO debe
quedar ninguna ocurrencia de: `agendaUrl`, `divan`, `armario`, `serie fija`,
`insonoriz`, `garantizada`, `60 m²`, `30 personas`, `sin columnas`, `12 espacios`,
`premium`, `recepcion`, `proveedor de confianza`, `música ambiente`, `luz regulable`,
`ventilación cruzada`, `día completo`, `tarifa diferenciada`, `Salón Cobre`,
`Salón Roble`, `sala subsuelo`, `Profesional fundador`, `sala de espera`, `wifi`,
`Parque Rodó` como barrio a secas en metas viejas (las nuevas ya dicen "entre Palermo
y Parque Rodó"). Actualizar el comentario de cabecera del archivo `nichos.ts` si
menciona placeholders.

---

## Propuestas DESCARTADAS (y por qué)

1. **Mitigación "ocultar la grilla de espacios" como camino principal (hallazgo 1):** se baja a fallback — spec-espacios se implementa esta misma noche y el mapeo real es mejor para el usuario que una página sin espacios.
2. **Usar el testimonio de Gastón como genérico en psiquiatras/psicopedagogos/nutricionistas (hallazgo 2):** descartado — un instructor del Bach Centre como "prueba social" de psiquiatras resta credibilidad; mejor ocultar la sección.
3. **Eliminar la FAQ del diván sin reemplazo (hallazgo 6, opción B):** descartado — se reemplaza por la FAQ de equipamiento verificable, que responde la misma intención de búsqueda.
4. **`address` completo en el schema Service (hallazgo 22):** parcial — solo se agrega `url`; duplicar la dirección del LocalBusiness del BaseLayout no aporta y arriesga divergencia.
5. **Links internos desde /los-espacios y /como-funciona hacia los nichos (hallazgo 20):** fuera del alcance de esta spec (son otros archivos/otras specs) — va al backlog.
6. **Crear el nicho `/para/terapias-corporales` (hallazgo 26):** descartado para esta nocturna — página nueva con contenido nuevo excede el alcance; queda flaggeado abajo para Rafa (el Espacio 13 con camilla lo amerita).
7. **"sin costos fijos ni permanencia" literal del auditor (hallazgo 25):** ajustado a "sin compromiso" — "permanencia" está vetado por las reglas de copy.
8. **Veredictos del panel:** no se pudo aceptar ni descartar ninguno — el JSON llegó vacío (ver contradicción 1).

---

## Contradicciones / pendientes para Rafa (revisar mañana, NO bloquean la spec)

1. **El JSON del panel de 3 lentes llegó sin sustituir (`${JSON}` literal).** Las objeciones del panel NO están reflejadas. Revisar el orquestador y, si el panel objetó algo material, segunda pasada sobre esta spec.
2. **Dependencia de build:** los `espaciosRecomendados` nuevos requieren el `ESPACIOS` real en `site.ts` (spec-espacios) **en el mismo commit** — el tipado `EspacioId` rompe el build si se aplican por separado. Si spec-espacios no se implementa, usar el fallback (eliminar la sección).
3. **Mapeo de espacios por nicho — desacuerdo menor entre auditores, resuelto así:** psicologos incluye `espacio-02` (4ª card, para quien atiende niños — el auditor de espacios proponía solo 3); nutricionistas lleva `espacio-01` y no `espacio-02` (una familia entera entra mejor en el 01, de 4 sentados, que en el rincón infantil). Cross-checkear con lo que haya quedado en spec-espacios.
4. **Wifi de fibra:** se ELIMINÓ de la FAQ de psiquiatras (no está en la fuente de verdad; spec-precios tomó la misma decisión). Si Rafa confirma que hay wifi, es un claim fuerte para recetar/teleconsulta — re-agregar.
5. **"Sala de espera":** se eliminó de la solución de psiquiatras (no confirmada en la fuente de verdad). Confirmar si existe como tal.
6. **Música ambiente / tratamiento acústico:** todos los claims se bajaron a "pensados para trabajar con privacidad" (fórmula de la home). Si hay tratamiento acústico real demostrable, se puede re-subir el tono con cuidado (nunca "insonorizado"/"garantizada").
7. **Nicho faltante con mejor fit de todos: terapias corporales** (Espacio 13 con camilla, y la lista de profesiones de la app incluye masajistas, osteópatas, kinesiólogos, acupunturistas). Decidir si se crea `/para/terapias-corporales` en el próximo sprint.
8. **Teleconsulta en painPoints de psiquiatras** ("combinar presencial con teleconsulta"): se mantuvo porque es un dolor del nicho, no una promesa nuestra — pero si se quiere vender teleconsulta desde el espacio haría falta confirmar wifi (punto 4).
