# Auditoría — /los-espacios + /los-espacios/[slug]

> Sesión nocturna 2026-06-10/11. Auditor: página de espacios.
> Archivos auditados: `src/pages/los-espacios/index.astro`, `src/pages/los-espacios/[slug].astro`,
> `src/components/EspacioCard.astro`, `src/lib/site.ts`, `src/pages/og/[slug].ts`.
> Fuente de verdad: `docs/VERDAD_APP_2026_06_10.md` (DB de producción de la app).
> Referencia de tono: `src/pages/index.astro` (NO modificarla).

## Resumen ejecutivo

La sección /los-espacios está construida 100% sobre datos **ficticios**: los 12 espacios de
`src/lib/site.ts` (Estudio Norte/Sur, Consulta I–VII, Salón Cobre/Roble) no existen. La realidad
son **7 espacios activos + la Sala Arcos** (que se vende por WhatsApp). Además, los CTAs
mandan a la PWA directo en vez del pre-registro, la ficha de cada espacio promete servicios
inexistentes (sala de espera para pacientes, música ambiente, acceso 24/7), y los datos de la
Sala Arcos están todos mal (60 m² vs 40 reales, 30 personas vs 25). Hay que reconstruir
`ESPACIOS` desde cero, reagrupar por uso (como la home), poner redirects 301 y coordinar el
cambio de slugs con `nichos.ts`, `alquiler-consultorio-montevideo.astro` y `og/[slug].ts`.

---

## Hallazgos

### CRÍTICO

**1. Los 12 espacios son ficticios — reconstruir `ESPACIOS` con los reales.**
`src/lib/site.ts:88-202`. Nombres ("Estudio Norte", "Salón Cobre"), m², capacidades, resúmenes
("divan opcional", "madera original recuperada", "foco en privacidad acústica") y tags "ideal"
("Homeopatía") son placeholders de un sprint viejo. La DB de producción tiene 10 espacios:
7 activos + Sala Arcos + 2 inactivos (04 y 15).
**Propuesta** — reemplazar el array completo (con nuevo tipo y slugs `espacio-XX` / `sala-arcos`,
mismos nombres que ve el cliente en la app):

```ts
export type EspacioId =
  | 'espacio-01' | 'espacio-02' | 'espacio-03'
  | 'espacio-11' | 'espacio-12' | 'espacio-13' | 'espacio-14'
  | 'sala-arcos';

export interface Espacio {
  id: EspacioId;
  nombre: string;          // "Espacio 01", "Sala Arcos"
  piso: 'Planta baja' | 'Piso 1' | 'Subsuelo';
  tipo: 'amueblado' | 'multiuso';
  grupo: 'individual' | 'infancias' | 'camilla' | 'grupos';
  resumen: string;         // fiel a la descripción de la DB
  capacidad: string;
  metros: number;
  precioHora: number;      // 350 | 700 — muere el hardcodeo de 'sala-subsuelo'
  reservaPorApp: boolean;  // false solo para Sala Arcos (CTA WhatsApp)
  destacado?: boolean;
}
```

Datos y copy propuestos (fieles a la DB, mejorados en redacción, rioplatense):

| id | nombre | piso | tipo | grupo | capacidad | m² | $/h | resumen propuesto |
|---|---|---|---|---|---|---|---|---|
| espacio-01 | Espacio 01 | Planta baja | amueblado | individual | Hasta 4 sentados | 13 | 350 | «A la calle y cálido. Sillón de tres cuerpos y butaca individual — ideal para sesiones individuales, entrevistas y consultas.» |
| espacio-02 | Espacio 02 | Planta baja | amueblado | infancias | 2 personas | 15 | 350 | «Versátil, con rincón infantil: mobiliario y materiales para trabajar con niños y familias, más dos butacas y escritorio.» |
| espacio-03 | Espacio 03 | Planta baja | multiuso | grupos | 8 sentados · 6 en movimiento | 19 | 350 | «Flexible y despejado, para movimiento, meditación y grupos chicos. Con almohadones y colchonetas para armarlo como necesites.» |
| espacio-11 | Espacio 11 | Piso 1 | amueblado | individual | 2 personas | 9.5 | 350 | «Compacto y luminoso, a la calle. Dos butacas individuales — perfecto para sesiones uno a uno y entrevistas breves.» |
| espacio-12 | Espacio 12 | Piso 1 | amueblado | individual | 3 personas | 14 | 350 | «Luminoso y con balcón a la calle. Sillón de dos cuerpos, butaca individual y escritorio.» |
| espacio-13 | Espacio 13 | Piso 1 | amueblado | camilla | 2 personas | 11 | 350 | «Con camilla: masajes, reflexología, tratamientos corporales y abordajes integrales. También tiene escritorio.» |
| espacio-14 | Espacio 14 | Piso 1 | multiuso | grupos | 8 sentados · 6 en movimiento | 16 | 350 | «Amplio y despejado, para movimiento, meditación y grupos chicos. Con almohadones y colchonetas.» |
| sala-arcos | Sala Arcos | Subsuelo | multiuso | grupos | Hasta 25 sentados | 40 | 700 | «La gran sala del subsuelo, para talleres, encuentros y trabajo grupal. Con proyector, parlante, kitchenette y baño propio.» (destacado: true, reservaPorApp: false) |

**2. Sala Arcos: todos los datos duros están mal.**
`src/lib/site.ts:193-201` (capacidad "20 a 30", 60 m²), `los-espacios/index.astro:57-58`
("Sala Arcos de 60 m²"), `index.astro:103` ("cuando 30 personas se juntan"), `index.astro:107`
("Reservala por bloques o por día completo"). Real (DB): **25 sentados, 40 m² (10×4), $700/h**,
equipada con proyector, parlante, kitchenette y baño independiente. "Sin columnas" y "acústica
trabajada" no están en la DB — no afirmarlos. "Por día completo" tampoco existe (reservas de
hasta 8 h, y Arcos ni siquiera se reserva por la app).
**Propuesta** (bloque destacado del índice): título «Para cuando 25 personas se juntan a
aprender, moverse o trabajar en grupo.» y cuerpo: «40 m² en el subsuelo, con proyector,
parlante, kitchenette y baño propio. Ideal para talleres, formaciones, prácticas grupales o
encuentros. Se coordina directo con nosotros: escribinos por WhatsApp y la armamos juntos.
$700 la hora.» CTA: WhatsApp con mensaje precargado
`CONTACT.whatsappLink('Hola! Quiero consultar por la Sala Arcos para un taller/encuentro.')`.

**3. CTA primario equivocado: manda a la PWA en vez del pre-registro.**
`los-espacios/index.astro:212-224` («¿Listo para reservar?» → `SITE.agendaUrl`, "Crear cuenta y
reservar") y `los-espacios/[slug].astro:168-170` («Reservar este espacio» → `SITE.agendaUrl`).
Contradice la estrategia de CTAs de la fuente de verdad (pre-registro `/#registro` con primera
hora gratis mientras dure el pre-lanzamiento).
**Propuesta** — CTA final del índice: H2 «Tu primera hora acá adentro es gratis.» + texto
«Pre-registrate hoy y te guardamos una hora gratis para usarla cuando quieras durante 2026,
en el espacio que elijas.» + botón primario «Quiero mi primera hora gratis» → `/#registro` +
secundario «Escribinos por WhatsApp». En la ficha: primario «Quiero mi primera hora gratis» →
`/#registro` (y para `sala-arcos`, primario = WhatsApp); secundario «Ver los otros espacios» →
`/los-espacios`.

**4. La ficha promete servicios inexistentes ("Qué viene incluido").**
`los-espacios/[slug].astro:67-74`:
- «Sala de espera — cómoda y privada para tus pacientes»: **FALSO**. No hay sala de espera para
  pacientes; según la app (`Ayuda.jsx`), las personas que atendés ingresan recién a la hora de
  la reserva, y el comedor del piso 1 es exclusivo de profesionales.
- «Acceso 24/7»: falso — horario reservable 7 a 24, todos los días.
- «Música ambiente — suma privacidad acústica»: no consta en la app ni en la DB. Eliminar.
- «Cocina común — café, té y agua disponibles»: reencuadrar como comedor exclusivo de
  profesionales (con heladera y café), no como servicio para pacientes.
**Propuesta** — nuevo array `incluye`:
```
Wifi de fibra — conexión estable en todo el edificio.
Aire acondicionado — frío y calor, individual en cada espacio.
Comedor y sala de estar — en el piso 1, exclusivo para profesionales, sin cargo.
Acceso con código personal — todos los días, de 7 a 24 h, sin coordinar con nadie.
Limpieza y mantenimiento — el espacio listo cuando llegás.* 
Estacionamiento NO tarifado — y bien conectado en bus.
```
(*) "Limpieza" verificar antes con Rafa — si no está confirmado, reemplazar por «Reservas desde
1 hora — sin mínimo ni compromiso».

**5. Totales "12 espacios / 12 ambientes" por todos lados (discrepancia abierta).**
`los-espacios/index.astro:37` (title "Los 12 espacios"), `:38` (meta description "los 12
espacios"), `:54` (H1 "12 ambientes, una sola filosofía"), `:214` ("disponibilidad real de los
12 espacios"), `og/[slug].ts:26` (OG "12 espacios.\nUna sola filosofía.") y `:51` (OG de
alquiler-consultorio: "12 espacios en Parque Rodó"). La regla de la sesión es EVITAR el total en
subpáginas.
**Propuesta**: title «Consultorios y salas por hora»; H1 «Consultorios y salas,
<span>una sola filosofía</span>.»; meta description «Conocé los consultorios y salas por hora de
Espacio 1010: espacios amueblados para atención individual, un espacio con camilla, salas para
movimiento y grupos, y la Sala Arcos para hasta 25 personas. Entre Palermo y Parque Rodó,
Montevideo.»; CTA final sin el número («la disponibilidad real de todos los espacios»). OG
'los-espacios': «Consultorios y salas.\nUna sola filosofía.». OG 'alquiler-consultorio-montevideo':
«Consultorios y salas en Parque Rodó · A 5 cuadras de 18 de Julio».

**6. Slugs nuevos sin redirects 301 = 12 URLs rotas en producción.**
`vercel.json:31-36` no tiene redirects para los slugs viejos, que ya están indexables (sitemap
los publica). Al renombrar, agregar en `vercel.json`:
```json
{ "source": "/los-espacios/sala-subsuelo", "destination": "/los-espacios/sala-arcos", "permanent": true },
{ "source": "/los-espacios/salon-cobre",   "destination": "/los-espacios/espacio-03", "permanent": true },
{ "source": "/los-espacios/salon-roble",   "destination": "/los-espacios/espacio-14", "permanent": true },
{ "source": "/los-espacios/estudio-norte", "destination": "/los-espacios/espacio-01", "permanent": true },
{ "source": "/los-espacios/estudio-sur",   "destination": "/los-espacios/espacio-12", "permanent": true },
{ "source": "/los-espacios/consulta-1",    "destination": "/los-espacios", "permanent": true },
{ "source": "/los-espacios/consulta-2",    "destination": "/los-espacios", "permanent": true },
{ "source": "/los-espacios/consulta-3",    "destination": "/los-espacios", "permanent": true },
{ "source": "/los-espacios/consulta-4",    "destination": "/los-espacios", "permanent": true },
{ "source": "/los-espacios/consulta-5",    "destination": "/los-espacios", "permanent": true },
{ "source": "/los-espacios/consulta-6",    "destination": "/los-espacios", "permanent": true },
{ "source": "/los-espacios/consulta-7",    "destination": "/los-espacios", "permanent": true }
```
Criterio: 1:1 cuando hay equivalente real claro (la sala del subsuelo ES la Sala Arcos; los
"salones" eran los multiuso; los "estudios" mapean a los amueblados más parecidos), y al índice
cuando no lo hay (las 7 "consultas" inventadas no mapean a nada concreto). El sitemap se
regenera solo desde `getStaticPaths` — no requiere acción extra.

**7. El cambio de slugs ROMPE el build de otras dos páginas — coordinar en el mismo commit.**
`src/lib/nichos.ts:57,107,152,197,238,284` (`espaciosRecomendados` tipados con `EspacioId`
viejos) y `src/pages/alquiler-consultorio-montevideo.astro:10` (`ESPACIOS.filter(destacado)`).
TypeScript va a fallar en `nichos.ts` apenas cambie el tipo. Mapeo propuesto para
`espaciosRecomendados`: psicologos → `['espacio-01','espacio-11','espacio-12']`; psiquiatras →
`['espacio-11','espacio-12','espacio-01']`; psicopedagogos → `['espacio-02','espacio-03']`;
nutricionistas → `['espacio-12','espacio-11','espacio-01']`; meditacion-yoga →
`['espacio-03','espacio-14','sala-arcos']`; talleres-grupos →
`['sala-arcos','espacio-03','espacio-14']`. Marcar `destacado: true` en `espacio-01`,
`espacio-13` (diferencial camilla) y `sala-arcos` para que la página de alquiler siga teniendo 3
destacados. (El resto del copy de nichos lo audita otro — acá solo lo necesario para no romper.)

### ALTO

**8. Espacios 04 y 15 inactivos: OMITIR (no publicar "próximamente").**
Justificación: (a) en la DB son placeholders sin descripción ni equipamiento real — una ficha
"próximamente" vacía no convierte y daña confianza; (b) publicarlos reabre la discusión del
total ("¿cuántos son?") que justamente queremos evitar; (c) cuando estén terminados, agregarlos
es sumar 2 entradas al array + deploy (15 minutos). Dejar comentario en `site.ts`:
`// Espacios 04 (PB) y 15 (P1) existen pero están inactivos en la app — sumarlos acá cuando Rafa los termine.`

**9. Agrupación del índice basada en prefijos de slugs ficticios — reagrupar por uso, como la home.**
`los-espacios/index.astro:9-12` agrupa por `startsWith('consulta'|'estudio'|'salon')` y las
secciones (`:123` "Estudios premium", `:152` "Consultas individuales", `:181` "Salones grupales")
describen categorías inexistentes. La agrupación real y verificable (fuente de verdad) es la de
la home.
**Propuesta** de secciones (filtrando por el campo `grupo` del nuevo tipo):
1. *Sala Arcos* — bloque destacado arriba (ya existe, corregir datos — ver #2).
2. **Atención individual** (01, 11, 12): «Para sesiones uno a uno, entrevistas, orientación o consulta clínica.»
3. **Para infancias** (02): «Con rincón infantil y butacas, para trabajar con niños y familias.»
4. **Con camilla** (13): «Para masajes, reflexología y terapias corporales.»
5. **Grupos, movimiento y talleres** (03, 14): «Despejados y con colchonetas, para grupos chicos, meditación o movimiento.»
Las secciones de 1 solo espacio (infancias, camilla) pueden compartir fila en desktop
(grid de 2 columnas) para no quedar raquíticas.

**10. Taxonomía "Amueblado / Mixto / Versátil" inventada — la real es amueblado / multiuso.**
`src/lib/site.ts:82` (`amueblado: 'completo' | 'versatil' | 'mixto'`), leyenda en
`los-espacios/index.astro:63-77`, labels en `EspacioCard.astro:12-15` y
`los-espacios/[slug].astro:51-55`. La DB distingue solo `amueblado` y `multiuso`.
**Propuesta**: campo `tipo: 'amueblado' | 'multiuso'` con labels «Amueblado» («sillón, butacas
y/o escritorio — llegás y atendés») y «Multiuso» («despejado, con almohadones y colchonetas —
lo armás como necesites»). Leyenda del índice reducida a esos 2 ítems.

**11. Tags "Ideal para" inventados por espacio.**
`src/lib/site.ts` campo `ideal` ("Homeopatía", "Psicoanálisis" con "divan opcional",
"Yoga reducido"…) y render en `[slug].astro:155-165`. No hay divan en la DB y "Homeopatía" no
está en la lista de profesiones de la app.
**Propuesta** — derivar de la descripción DB + lista `profesiones_lista` real:
01/11/12 → `['Psicología', 'Psiquiatría', 'Coaching', 'Nutrición']`;
02 → `['Psicopedagogía', 'Psicología infantil', 'Fonoaudiología', 'Psicomotricidad']`;
13 → `['Masajes', 'Reflexología', 'Osteopatía', 'Terapias corporales']`;
03/14 → `['Meditación', 'Yoga', 'Grupos chicos', 'Movimiento']`;
sala-arcos → `['Talleres', 'Formaciones', 'Constelaciones', 'Encuentros grupales']`.

**12. Schema.org Product hereda los datos falsos y promete reserva online de la Sala Arcos.**
`los-espacios/[slug].astro:33-49`: `description: espacio.resumen` (ficticio) y
`availability: InStock` con URL propia para todos, incluida Sala Arcos (que no tiene flujo de
reserva pública). Con los datos nuevos se corrige solo la description; para `sala-arcos`
mantener el Offer con `price: 700` (es real) — correcto.
Además `priceValidUntil: '2026-12-31'` está bien hoy pero es una bomba de tiempo: dejar TODO
comentado para revisarlo antes de 2027.

**13. Meta description de la ficha dice "24/7".**
`los-espacios/[slug].astro:79`: «Reservá por hora online, 24/7, en Gaboto 1010…». Horario real:
7 a 24.
**Propuesta**: «{nombre} en Espacio 1010 — {resumen} Capacidad: {capacidad}. Reservá por hora
desde la app, todos los días de 7 a 24, en Gaboto 1010, entre Palermo y Parque Rodó, Montevideo.»

**14. `site.ts`: AMENITIES y DIFERENCIALES con datos falsos (afectan a otras páginas).**
`src/lib/site.ts:208-219` (AMENITIES, usado por `/el-lugar`): «Acceso 24/7 con código personal»
(es 7–24), «Música ambiente para mayor privacidad» (no consta), «Cocina y sala de estar para
tus pacientes» (**es exclusiva de profesionales** — error grave de expectativa), «Sala de espera
compartida» (no existe), «Sala de cowork incluida sin cargo» ("cowork" no existe como concepto
en la app — unificar como comedor/sala de estar). `src/lib/site.ts:224-250` (DIFERENCIALES:
"12 espacios", "Acceso 24/7", "privacidad acústica", "Cowork incluido") hoy no se renderiza en
ninguna página — **eliminar el array** o corregirlo si el auditor de /el-lugar lo necesita.
También `SITE.description` (`site.ts:14`) y `HOURS.openingHours: '24/7'` (`site.ts:52`) arrastran
el "24/7" al meta default y al schema LocalBusiness (`schema.ts:62-69`) — corregir a
«todos los días de 7 a 24» / `opens: '07:00', closes: '00:00'`. Coordinar con el auditor general.

### MEDIO

**15. Oportunidad: la Sala Arcos tiene fotos reales sin usar.**
`public/fotos/lugar-subsuelo.webp` y `lugar-sala-subsuelo.webp` son fotos reales del subsuelo
(la home las usa en la galería). La ficha y la card de Sala Arcos hoy muestran un ícono
genérico. **Propuesta**: usar `lugar-sala-subsuelo.webp` como imagen de la card destacada del
índice y como visual del hero de `/los-espacios/sala-arcos` (alt: «Sala Arcos en el subsuelo de
Espacio 1010, con muro de piedra y arco original, piso de madera»), manteniendo el tratamiento
tipográfico para los consultorios (que aún no tienen fotos). Es el único espacio que puede
mostrar foto real hoy — y es el más caro.

**16. "Fotos reales de cada espacio, muy pronto" escondido al final de la última sección.**
`los-espacios/index.astro:204` (solo bajo "Salones grupales"). En la home esta aclaración cierra
la sección de espacios completa y maneja expectativas. **Propuesta**: moverla a una sola
aparición, debajo del header (después de la leyenda, `:77`), y agregar en la ficha de cada
consultorio, bajo el visual tipográfico: «Fotos reales de este espacio, muy pronto.»

**17. Íconos por prefijo de slug se rompen con los slugs nuevos.**
`los-espacios/index.astro:21-27`, `los-espacios/[slug].astro:58-65`:
`iconPaths[e.id.split('-')[0]]` — con `espacio-01` el prefijo es "espacio" → todos caen al
fallback. **Propuesta**: mapear por `grupo` (individual → sofá, infancias → niño, camilla →
camilla, grupos → grupo) reutilizando los paths que ya existen en la home
(`index.astro:122-142`: `sofa`, `child`, `massage`, `group`). Centralizar el mapa en un solo
lugar (p. ej. `src/lib/site.ts` o un helper) — hoy está duplicado en 2 archivos.

**18. Lógica de precio duplicada y hardcodeada en 3 archivos.**
`los-espacios/index.astro:14-18`, `los-espacios/[slug].astro:19-24`, `EspacioCard.astro:17-18`
repiten `e.id === 'sala-subsuelo' ? 700 : 350`. Si mañana cambia un precio, hay que tocar 3
lugares (y el slug viejo quedaría hardcodeado). **Propuesta**: campo `precioHora` en el dato
(ver #1) y borrar las 3 constantes locales.

**19. "Otros espacios que podrían servirte" sugiere 3 arbitrarios.**
`los-espacios/[slug].astro:17`: `filter(...).slice(0, 3)` — desde cualquier ficha sugiere
siempre los 3 primeros del array. **Propuesta**: priorizar los del mismo `grupo` y completar con
el resto: `[...mismos del grupo, ...otros].slice(0, 3)`.

**20. Doble prefijo en el slug OG de las fichas.**
`los-espacios/[slug].astro:80`: `ogSlug={'espacio-' + espacio.id}` → con los slugs nuevos genera
`espacio-espacio-01.png`. Consistente con `og/[slug].ts:55-63` (genera las mismas keys), así que
no rompe, pero es feo y confunde. **Propuesta**: en ambos archivos usar la key
`og-${e.id}` o directamente `e.id` (cuidando que no choque con las keys de páginas:
`espacio-01` no choca con nada). Para la OG de cada espacio, description sin datos ficticios:
`${e.resumen} · ${e.capacidad} · ${e.metros} m² · $${e.precioHora}/h`.

**21. Copy del índice con claims no verificables o tono off.**
`los-espacios/index.astro:57-60`: «consultas íntimas», «mismo estándar de detalle» — vago; y
«Desde consultas íntimas… hasta la Sala Arcos de 60 m²» (dato falso, ver #2).
**Propuesta** de intro bajo el H1: «Espacios amueblados para atender uno a uno, un espacio con
camilla, salas despejadas para grupos y movimiento, y la Sala Arcos para encuentros más
grandes. Todos se reservan por hora, todos a $350 — entre Palermo y Parque Rodó.» (La Sala
Arcos a $700 queda aclarada en su bloque destacado; si se prefiere precisión total, cerrar con
«— y la Sala Arcos a $700».)

**22. Falta el BreadcrumbList schema en el índice.**
`los-espacios/index.astro` tiene breadcrumb visible (`:44-48`) pero no emite el schema (la ficha
sí, `[slug].astro:26-30`). **Propuesta**: agregar `breadcrumbSchema([{Inicio},{Los espacios}])`
en un `<Fragment slot="head">`, igual que la ficha.

**23. Ficha: la "capacidad" de los multiuso pierde el matiz sentados/movimiento.**
La DB distingue "8 sentados / 6 en movimiento" para 03 y 14. Si se guarda como string (como
propone #1) no hay problema; evitar reducirlo a un número único. En la card del índice puede
abreviarse «Hasta 8» y en la ficha mostrar el detalle completo.

### BAJO

**24. `index.astro:8` comentario del archivo de espacios menciona "el grid cuente una historia" sobre grupos falsos** — actualizar comentarios internos al reconstruir (también `site.ts:56-62`, nota interna "la PWA tiene 9 consultorios" ya desactualizada: son 10 con 7 activos).

**25. Botón "Tengo una consulta" del CTA final del índice** (`los-espacios/index.astro:221-223`) va a `/contacto`; como secundario es más consistente con la estrategia llevarlo directo a WhatsApp con mensaje precargado («Hola! Quiero saber más sobre los espacios de Espacio 1010.») — decisión menor, cualquiera de las dos es defendible.

**26. `EspacioCard.astro` solo se usa en `/para/[slug]`** — al reconstruir el dato, actualizar también su label de tipo (#10) y precio (#18) para que las landings de nicho no muestren la taxonomía vieja. Considerar usarla también en el índice de /los-espacios para des-duplicar el markup de cards (hoy el índice tiene 3 copias inline del mismo card).

---

## Orden de implementación sugerido (un solo commit/deploy)

1. `src/lib/site.ts`: nuevo tipo + array `ESPACIOS` real (#1, #10, #18), limpiar AMENITIES/DIFERENCIALES (#14).
2. `src/lib/nichos.ts`: remapear `espaciosRecomendados` (#7).
3. `src/pages/los-espacios/index.astro`: reagrupar por uso, H1/title/meta, Sala Arcos real con foto, CTA pre-registro (#2, #3, #5, #9, #15, #16, #21, #22).
4. `src/pages/los-espacios/[slug].astro`: ficha con datos reales, "qué incluye" verdadero, CTA pre-registro / WhatsApp para Arcos, schema y meta (#3, #4, #11, #12, #13, #17, #19, #20).
5. `src/components/EspacioCard.astro`: tipo y precio del dato (#26).
6. `src/pages/og/[slug].ts`: keys nuevas + OG sin "12 espacios" (#5, #20).
7. `vercel.json`: redirects 301 (#6).
8. `npm run build` para validar tipos y rutas antes de pushear (el sitio está en producción).
