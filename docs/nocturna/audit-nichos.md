# Auditoría — /para/[slug] (6 nichos)

> Sesión nocturna 2026-06-10. Auditor: nichos.
> Archivos auditados: `src/pages/para/[slug].astro`, `src/lib/nichos.ts` (+ dependencias: `src/lib/site.ts`, `src/pages/og/[slug].ts`, `src/components/EspacioCard.astro`).
> Fuente de verdad: `docs/VERDAD_APP_2026_06_10.md`.

## Resumen ejecutivo

Las 6 landings de nicho quedaron congeladas en un sprint viejo, **anterior a la estrategia de pre-registro y anterior a los datos reales de la DB**. Hoy en producción muestran: espacios ficticios con métricas inventadas (Estudio Norte, Consulta I–VII, Salón Cobre/Roble, "sala subsuelo de 60 m² para 30 personas"), **testimonios inventados presentados como reales**, claims falsos de equipamiento (diván, armarios reservados, proyector "incluido con 4 hs", recepcionista para talleres), y un CTA primario que manda a `agenda.espacio1010.uy` en vez del pre-registro con primera hora gratis. Además, los datos falsos están inyectados en schema.org FAQPage, o sea que Google los puede mostrar como rich results.

**Dependencia estructural**: `nichos.ts` recomienda espacios por `EspacioId` de `site.ts`, y TODOS los IDs de `site.ts` son ficticios (src/lib/site.ts:63-202). Arreglar los nichos en serio implica primero reemplazar `ESPACIOS` en `site.ts` por los 8 reales (01, 02, 03, 11, 12, 13, 14, Sala Arcos). Eso excede esta página, pero abajo dejo el mapeo propuesto por nicho para cuando exista.

---

## Hallazgos

### A. Datos FALSOS o desactualizados vs la app

**1. [CRÍTICO] Espacios recomendados 100% ficticios en los 6 nichos**
- `src/lib/nichos.ts:57` (psicologos), `:107` (psiquiatras), `:152` (psicopedagogos), `:197` (nutricionistas), `:238` (meditacion-yoga), `:284` (talleres-grupos) — todos los `espaciosRecomendados` apuntan a `estudio-norte`, `consulta-1`…`consulta-7`, `salon-cobre`, `salon-roble`, `sala-subsuelo`: ninguno existe en la DB.
- La página los renderiza como cards con nombre, m², capacidad y link a `/los-espacios/[id]` ficticio (`src/pages/para/[slug].astro:113-123` + `EspacioCard.astro`).
- **Propuesta** (mapeo a espacios reales de la DB, cuando `site.ts` tenga los reales):
  - psicologos → Espacio 01 (sillón 3 cuerpos + butaca), Espacio 12 (balcón, sillón 2 cuerpos + escritorio), Espacio 11 (compacto, 2 butacas), Espacio 02 (rincón infantil, para quien atiende niños).
  - psiquiatras → Espacio 11, Espacio 12, Espacio 01.
  - psicopedagogos → Espacio 02 (rincón infantil — ES el espacio para este nicho), Espacio 03 (multiuso, juego en el piso), Espacio 01.
  - nutricionistas → Espacio 12 (escritorio), Espacio 11, Espacio 02.
  - meditacion-yoga → Espacio 03 (multiuso PB, mats y almohadones), Espacio 14 (multiuso P1), Sala Arcos.
  - talleres-grupos → Sala Arcos (protagonista), Espacio 03, Espacio 14.
- Mientras `site.ts` siga ficticio, **mitigación mínima inmediata**: ocultar la sección "Espacios pensados para tu práctica" (o reemplazarla por texto sin cards) para no publicar datos inventados.

**2. [CRÍTICO] Testimonios inventados presentados como personas reales**
- `src/lib/nichos.ts:58-63, 108-113, 153-158, 198-203, 239-244, 285-290` — los 6 testimonios ("Profesional fundadora — Psicóloga clínica, Parque Rodó", etc.) son placeholders (el propio comentario en `:30` lo admite) pero se renderizan como cita real en bloque destacado (`[slug].astro:126-138`).
- Regla dura del proyecto: testimonios reales y aprobados, no inventar. Además varios afirman cosas falsas ("reservo el lunes y el jueves a las 6", "vengo dos veces por semana" — el local NI ABRIÓ).
- **Propuesta**: usar los testimonios reales aprobados de la home donde calcen y borrar la sección en el resto:
  - psicologos → Claudia, 36, Psicóloga: "Es justo la vuelta que estaba buscando. Coordinar agenda con los pacientes siempre fue un ida y vuelta eterno; con esto voy a poder reservar todo desde el celular, cuando quiera, sin depender de nadie. Simple y rápido."
  - talleres-grupos → Patricia, 62, Consteladora familiar (cita real de la home).
  - meditacion-yoga → Maite, 39, Método Feldenkrais (cita real de la home).
  - psiquiatras, psicopedagogos, nutricionistas → sin testimonio propio: ocultar la sección (hacer `testimonial` opcional en la interfaz) o usar el de Gastón (Instructor del Bach Centre, genérico sobre el lugar).
  - Sumar el badge real de la home: "Ya reservó para la apertura".

**3. [CRÍTICO] talleres-grupos: Sala Arcos con datos inventados**
- `src/lib/nichos.ts:274-276` (intro): "sala subsuelo de **60 m²** … grupos de **hasta 30 personas**. **Sin columnas**…" — la DB dice: Sala Arcos, subsuelo, **40 m² (10×4), 25 sentados**. "Sin columnas" no está en ninguna fuente.
- `:310` (meta description): repite "60 m² sin columnas… hasta 30 personas".
- `:252` (FAQ de meditacion-yoga): "Sala subsuelo: 20-30 personas, sin columnas" + capacidades de salones ficticios ("Salón Cobre: 6-10… Salón Roble: 6-8").
- **Propuesta de copy** (intro talleres-grupos): "La Sala Arcos, en el subsuelo, te recibe para grupos de hasta 25 personas. 40 m² con piedra y arcos originales, sillas y mesas, proyector, parlante, kitchenette y baño independiente — para tu taller, formación o encuentro grupal."
- Meta: "Sala para talleres, formaciones y grupos en Montevideo. La Sala Arcos: 40 m² entre Palermo y Parque Rodó, hasta 25 personas, proyector y kitchenette. Consultá por WhatsApp."

**4. [CRÍTICO] talleres-grupos: condiciones de reserva y servicios inventados**
- `src/lib/nichos.ts:283`: "Reservás por bloques de **2 hs** o por **día completo**" — la app reserva en bloques de **1 hora (hasta 8 seguidas)**; "día completo" no existe como producto.
- `:294`: "Tiene **tarifa diferenciada por bloque y por día**" — falso: Sala Arcos sale **$700/h** (precio único en DB). Está bien derivar a WhatsApp (la Sala Arcos se vende por WhatsApp), pero sin inventar una estructura tarifaria.
- `:298`: "Proyector + sonido vienen incluidos **cuando reservás bloques de 4 hs o más**" — falso: proyector y parlante son equipamiento de la sala, incluidos siempre. "Pizarra y rotafolio a pedido" tampoco está en la fuente.
- `:302`: "coordinamos con un **proveedor de confianza**" (catering) — inventado.
- `:306`: "**una persona del edificio recibe** a los participantes en la entrada" — falso: no hay recepción (la home dice "sin recepción"); el acceso es con código + videoportero.
- **Propuesta de FAQ reescrita**:
  - "¿Cuánto cuesta la Sala Arcos?" → "$700 la hora. Reservás en bloques de 1 hora, hasta 8 horas seguidas si tu taller lo necesita. Escribinos por WhatsApp y lo coordinamos según fecha y duración."
  - "¿Hay proyector o sonido?" → "Sí, la sala incluye proyector y parlante, además de sillas, mesas, colchonetas y almohadones. También tiene kitchenette y baño independiente."
  - "¿Puede entrar comida?" → "Sí, podés traer lo tuyo: la sala tiene kitchenette propia para servir café y agua sin salir del subsuelo."
  - "¿Cómo accede el grupo el día del taller?" → "Vos entrás con tu código personal y recibís a tu grupo en la entrada. El edificio funciona con videoportero y acceso registrado."

**5. [CRÍTICO] CTA primario va a la PWA directo, no al pre-registro**
- `src/pages/para/[slug].astro:72-74` ("Crear cuenta gratis" → `SITE.agendaUrl`) y `:194-196` ("Crear mi cuenta" → `SITE.agendaUrl`).
- Viola la estrategia de CTAs vigente: mientras dure el pre-lanzamiento, el CTA primario de TODAS las páginas es `/#registro` con primera hora gratis.
- Además el copy del CTA final (`:191`) promete "Después ves la disponibilidad real y reservás cuando quieras" — modo "ya abrimos", incoherente con la pre-apertura.
- **Propuesta**:
  - Hero: botón primario "Quiero mi primera hora gratis" → `/#registro`; secundario puede quedar "Ver los espacios".
  - CTA final: H2 "Tu primera hora, gratis." / texto "Pre-registrate gratis, sin tarjeta y sin compromiso. Te guardamos tu primera hora para usarla cuando quieras durante 2026, en el espacio que elijas." / primario → `/#registro` / secundario WhatsApp (queda bien como está).
  - En talleres-grupos el CTA primario debería ser **WhatsApp** (la Sala Arcos no se reserva por la app): "Consultar por la Sala Arcos" → wa.me.

**6. [ALTO] psicologos: "¿Hay divan para psicoanálisis?" — "Sí, algunos espacios cuentan con divan"**
- `src/lib/nichos.ts:70-72`. En la DB ningún espacio tiene diván: hay sillones (3 cuerpos en 01, 2 cuerpos en 12), butacas y una camilla (13). El diván venía del ficticio "Consulta V" (`site.ts:149`).
- **Propuesta**: cambiar la pregunta a algo verificable: "¿Cómo están equipados los espacios?" → "Cada consultorio amueblado tiene sillón o butacas cómodas y escritorio en varios de ellos. El Espacio 01, por ejemplo, tiene un sillón de tres cuerpos más butaca individual. Si necesitás algo puntual para tu práctica, consultanos por WhatsApp." (O directamente eliminar la FAQ.)

**7. [ALTO] "Armario reservado" prometido en 3 nichos**
- `src/lib/nichos.ts:79` (psicologos: "hay opción de armario reservado"), `:207` (nutricionistas: "lo dejan en armario reservado"), `:248` (meditacion-yoga: "guardarlos en armario si tenés serie fija").
- No existe en la fuente de verdad ni en la app ningún armario/locker. Promesa de servicio inexistente.
- **Propuesta**: psicologos → "Los espacios se comparten entre profesionales, así que cada quien lleva sus materiales. Si tenés una necesidad puntual, escribinos por WhatsApp y lo conversamos." Nutricionistas → "Si tenés balanza o equipo propio, lo traés con vos." Meditacion-yoga → "Hay mats/colchonetas y almohadones en los espacios multiuso; bloques o correas específicas las traés vos."

**8. [ALTO] Claims acústicos demasiado fuertes / no verificables**
- `src/lib/nichos.ts:48` ("Privacidad acústica" en intro psicologos), `:56` ("privacidad sonora real"), `:75` ("Es muy difícil escuchar de un espacio a otro" + "sumamos música ambiente en pasillos"), `:98` ("privacidad acústica **garantizada**" — psiquiatras), `:170` ("La acústica entre espacios está trabajada"), `:237` ("La acústica está trabajada… la música ambiente la silenciás cuando entrás a dar clase").
- La fuente de verdad no confirma tratamiento acústico ni música ambiente controlable por sala (la regla del proyecto ya prohíbe "insonorizado" justamente por esto). El único dato real relacionado: la app pide considerar el sonido hacia espacios contiguos en prácticas corporales (Ayuda.jsx:529) — o sea que la web NO debería garantizar privacidad sonora.
- **Propuesta**: bajar a lo demostrable: "espacios pensados para trabajar con privacidad" (fórmula que ya usa la home) y eliminar "garantizada", "muy difícil escuchar de un espacio a otro" y el control de música por sala. La FAQ de confidencialidad de psicologos puede ser: "Los espacios están pensados para conversaciones privadas y el edificio es de uso exclusivo de profesionales: nada de público de paso. Las cámaras están solo en la entrada y zonas comunes, nunca en los espacios de atención." (Este último dato SÍ está en la fuente de verdad y vende confianza.)

**9. [ALTO] psicologos meta description: "12 espacios premium"**
- `src/lib/nichos.ts:83`. Doble infracción: el total "12 espacios" está vetado en subpáginas (discrepancia abierta) y "premium" no es el tono.
- **Propuesta**: "Alquilá consultorio por hora para psicólogos entre Palermo y Parque Rodó, Montevideo. Consultorios amueblados, reserva online, cancelación gratis con 24 h. Pre-registrate y tu primera hora es gratis."

**10. [MEDIO] "Serie fija" no es el lenguaje de la app**
- `src/lib/nichos.ts:79, 125, 207, 211, 248` — la app llama a esto reserva "**Todas las semanas**" (fija). "Serie fija" es término inventado del sprint viejo.
- **Propuesta**: "reserva fija semanal" / "tu horario fijo todas las semanas" (como la FAQ de la home: "si querés un horario fijo todas las semanas, también podés").
- En `:125` además dice "Es lo que la mayoría de los psiquiatras eligen" — no hay ningún dato que lo respalde (no abrió). Cambiar a: "Sí. La reserva fija te garantiza día, hora y espacio todas las semanas, hasta que vos la liberes."

**11. [MEDIO] Cocina/sala de estar mal contada**
- `src/lib/nichos.ts:196` (nutricionistas): "la **cocina común** te permite mostrar opciones de hidratación" — la cocina/sala de estar es **exclusiva para profesionales** (piso 1, sin cargo), no un recurso para atender pacientes. Además es un claim rebuscado.
- **Propuesta**: "Entre consulta y consulta tenés cocina y sala de estar para profesionales en el piso 1, sin cargo."

**12. [MEDIO] psicopedagogos: mobiliario que no coincide con la DB**
- `src/lib/nichos.ts:162`: "El espacio te provee mobiliario (mesa, sillas, **alfombra**)" — la DB del Espacio 02 dice: butacas + **rincón infantil con mobiliario y materiales para niños** + escritorio. La alfombra es inventada; y lo MEJOR que tiene este nicho (el rincón infantil real) no se menciona en ningún lado.
- **Propuesta**: "El Espacio 02 tiene un rincón infantil con mobiliario y materiales pensados para niños, además de butacas y escritorio. Tus materiales especializados los traés vos; el espacio te da la base para armar la sesión como necesites."
- `:170`: "Algunas consultas tienen colchonetas disponibles" → precisar: "Los espacios multiuso tienen colchonetas y almohadones, y los pisos son aptos para trabajar en el suelo."

**13. [MEDIO] meditacion-yoga: features inventadas de los salones**
- `src/lib/nichos.ts:229` ("piso noble, **luz regulable**"), `:237` ("colchonetas, **soportes** y mobiliario móvil… reservás 1 o 2 horas… **o un día entero**"), `:256` ("**ventanas que se abren**… **ventilación cruzada**").
- Nada de eso está en la fuente de verdad. Lo real: Espacios 03 y 14 son multiuso con almohadones y mats/colchonetas, 8 sentados / 6 en movimiento libre; Sala Arcos para escala mayor.
- **Propuesta intro**: "Espacios multiuso despejados, con mats y almohadones, para clases reducidas, sesiones individuales o talleres. Y la Sala Arcos para grupos más grandes."
- **Propuesta FAQ capacidades**: "Los espacios multiuso reciben hasta 8 personas sentadas o 6 en movimiento libre. Para grupos más grandes está la Sala Arcos, con capacidad para 25 personas sentadas (se coordina por WhatsApp)."

**14. [BAJO] nutricionistas painPoint: "Tu consulta puede durar 30 minutos o una hora"**
- `src/lib/nichos.ts:190`. No es falso, pero como la reserva mínima es 1 hora puede generar expectativa de pagar medias horas. Sugerencia: "Encadenás consultas cortas o largas en tu bloque — reservás por hora y la usás como quieras."

### B. Inconsistencias con la home

**15. [ALTO] Ningún nicho menciona el pre-registro ni la primera hora gratis**
- Toda la home gira alrededor de "tu primera hora gratis" y los nichos (la puerta de entrada de Ads/SEO long-tail) no lo dicen NI UNA vez. El visitante que aterriza acá nunca se entera de la oferta.
- **Propuesta**: badge arriba del H1 (donde hoy dice "Para profesionales", `[slug].astro:63-65`) → "Pre-lanzamiento · tu primera hora gratis", y los CTAs del hallazgo 5.

**16. [MEDIO] Tono "ya estamos operando" vs pre-apertura**
- Frases como "Vengo dos veces por semana" (`nichos.ts:110`), "Es lo que la mayoría… eligen" (`:125`), "Mis pacientes vienen relajados" (`:200`) chocan con la home, que es honesta sobre la pre-apertura ("Así está quedando", "Nos eligieron antes de abrir").
- **Propuesta**: adoptar el encuadre de la home: hablar en futuro/apertura ("abrimos en junio 2026", "asegurá tu horario para la apertura").

**17. [BAJO] "Cancelás con 24 hs y no pagás nada" (`nichos.ts:56`) es correcto pero incompleto**
- La home vende también el tramo 50% hasta 1 h antes — es un diferencial fuerte. Sumar donde se hable de cancelación: "Cancelás gratis hasta 24 h antes, y hasta 1 h antes pagás solo la mitad."

### C. SEO

**18. [ALTO] FAQPage schema con respuestas falsas**
- `src/pages/para/[slug].astro:36-44` inyecta TODA la FAQ de `nichos.ts` como `FAQPage`. Mientras las respuestas tengan datos falsos (diván, armarios, 60 m², proyector condicionado), Google puede mostrarlos como rich snippets. Se arregla solo arreglando el contenido (hallazgos 3, 4, 6, 7), pero lo elevo porque amplifica el daño.

**19. [MEDIO] Breadcrumb schema apunta a un ancla inexistente**
- `src/pages/para/[slug].astro:48`: `{ name: 'Para profesionales', url: '/#para-profesionales' }` — la home no tiene `id="para-profesionales"` (verificado con grep: única aparición en el repo es esta línea).
- **Propuesta**: cambiar el nivel intermedio a `/los-espacios` ("Los espacios") o dejar el breadcrumb de 2 niveles (Inicio → nicho).

**20. [MEDIO] Internal linking débil hacia los nichos**
- Las únicas entradas a `/para/*` son el Footer, el 404 y `/alquiler-consultorio-montevideo`. La home no linkea (y no se toca), pero `/los-espacios` y `/como-funciona` podrían cruzar links contextuales ("¿Sos psicóloga/o? Mirá tu página"). Oportunidad de SEO interno barato — para el backlog de las otras páginas.

**21. [BAJO] Title/H1 correctos pero sin localidad en el title**
- `[slug].astro:53` usa `nicho.label` como title ("Espacios para psicólogas y psicólogos — Espacio 1010"). Para long-tail conviene la geo: p.ej. "Consultorio por hora para psicólogos en Montevideo". H1 puede quedar como está; el title puede diferenciarse agregando un campo `titleSeo` opcional en `NichoContent`.

**22. [BAJO] Schema Service mínimo**
- `[slug].astro:26-34`: el `provider` es solo `{ name: 'Espacio 1010' }`. Sumar `url: SITE.url` y `address` (o referenciar el `@id` del LocalBusiness del BaseLayout) lo haría más consistente. Menor.

### D. UX / copy / conversión

**23. [ALTO] Mensaje de WhatsApp roto/raro en varios nichos**
- `src/pages/para/[slug].astro:198`: el mensaje se arma con `nicho.label.toLowerCase().replace(...)`. Resultado real:
  - meditacion-yoga → "Hola, soy **meditación y yoga** y quería más info."
  - talleres-grupos → "Hola, soy **talleres y trabajo grupal** y quería más info."
  - psicologos → "Hola, soy **psicólogas y psicólogos**…" (plural raro).
- **Propuesta**: agregar campo `whatsappIntro` a `NichoContent` con el mensaje exacto por nicho, p.ej.: psicologos → "Hola, soy psicóloga/o y quería más info sobre Espacio 1010."; meditacion-yoga → "Hola, doy clases de yoga/meditación y quería más info."; talleres-grupos → "Hola, quería info sobre la Sala Arcos para un taller."

**24. [MEDIO] Cero fotos reales en páginas que venden un lugar**
- La página es 100% tipográfica y hay 7 fotos reales en `public/fotos/lugar-*.webp`. En particular `lugar-sala-subsuelo.webp` y `lugar-subsuelo.webp` SON la Sala Arcos (talleres-grupos y meditacion-yoga) y `lugar-pasillo.webp` / `lugar-marmol.webp` venden el edificio para psicólogos/psiquiatras.
- **Propuesta**: banda de 2-3 fotos (con los mismos captions/alt de la home) entre "Cómo lo resolvemos" y los espacios recomendados, + nota "Fotos reales de cada espacio, muy pronto".

**25. [MEDIO] Falta el precio — el dato que más destraba**
- Ningún nicho dice "$350/h" en el cuerpo (solo aparecía en las cards ficticias). Para una landing de Ads es EL dato de confianza.
- **Propuesta**: línea bajo el CTA del hero: "$350 la hora, todo incluido · sin costos fijos ni permanencia — y tu primera hora es gratis." (talleres-grupos: "Sala Arcos: $700/h").

**26. [BAJO] Nicho faltante con espacio real dedicado: terapias corporales/masajistas**
- La lista real de profesiones de la app incluye Kinesiólogo/a-Fisioterapeuta, Osteópata, Masajista/Terapeuta corporal, Acupunturista… y la DB tiene el **Espacio 13 con camilla** hecho a medida. No existe `/para/terapias-corporales`. Es el nicho con mejor fit producto-página de todos los que faltan. (También faltan fonoaudiólogos/psicomotricistas, hoy apenas mencionados como variante de búsqueda en psicopedagogos — aceptable.)
- **Propuesta**: crear el séptimo nicho cuando se haga el rediseño del contenido (slug `terapias-corporales`, H1 "Consultorio con camilla por hora", espacio recomendado: Espacio 13).

**27. [BAJO] "Estos son los que mejor se ajustan a la forma de trabajo de quien hace lo tuyo" (`[slug].astro:117`)**
- Frase enredada. Propuesta: "Los que mejor se ajustan a tu forma de trabajar."

---

## Orden de ataque sugerido

1. **Hoy mismo (no requiere tocar site.ts)**: hallazgos 5 y 15 (CTAs a `/#registro` + oferta), 2 (testimonios), 3-4 (Sala Arcos), 6-8 (claims falsos), 9 (meta), 23 (WhatsApp).
2. **Cuando se reemplace `ESPACIOS` en site.ts por los reales**: hallazgo 1 (mapeo de espacios por nicho) — hasta entonces, ocultar la grilla de espacios recomendados.
3. **Backlog**: 19-22 (SEO fino), 24-26 (fotos, precio, nicho terapias corporales).
