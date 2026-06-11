# SPEC GLOBAL — Árbitro entre páginas (sesión nocturna 2026-06-10/11)

> Rol: detectar y resolver conflictos ENTRE las 9 specs de página antes de implementar.
> Insumos: las 9 specs de `docs/nocturna/spec-*.md` + `docs/VERDAD_APP_2026_06_10.md` +
> código real verificado (`src/lib/site.ts`, `src/lib/schema.ts`, `src/lib/nichos.ts`,
> `vercel.json`, `Nav.astro`, `Footer.astro`, `Button.astro`, `BaseLayout.astro`,
> `LandingLayout.astro`, `og/[slug].ts`, `index.astro`).
>
> **Regla de oro:** este documento MANDA sobre las specs de página en (a) archivos
> compartidos y (b) los conflictos listados abajo. En todo lo demás, cada spec de página
> manda en su página.

---

## 0. Verificaciones hechas (para que nadie las repita)

- **`Button.astro` SÍ acepta `target` y `rel`** (Props tipadas, líneas 10-11) y agrega
  `noopener noreferrer` automático cuando `target="_blank"` (línea 49). Todas las dudas
  "si Button no acepta target…" de las specs quedan resueltas: usar `<Button target="_blank">`
  tal cual, sin fallback a `<a>`.
- **La home usa `LandingLayout`** (nav y footer propios, mínimos); las subpáginas usan
  `BaseLayout` → `Nav.astro` + `Footer.astro`. Tocar `Nav.astro`/`Footer.astro` **NO cambia
  la home**. La home además pasa su propia `description` a `LandingLayout`, así que cambiar
  `SITE.description` NO cambia la meta de la home (solo el footer visible de las subpáginas
  y el default de BaseLayout).
- **`DIFERENCIALES` y `HOURS` no se importan en ningún archivo** (grep confirmado): borrar
  `DIFERENCIALES` es seguro; corregir `HOURS` no rompe nada.
- **`AMENITIES` solo lo importa `el-lugar.astro`** (grep confirmado).
- **`PRECIO_HORA` es una const local por página** (no vive en site.ts). Con el nuevo
  `ESPACIOS` el precio canónico vive en `espacio.precioHora`; las consts locales de
  `precios.astro` y `alquiler-consultorio-montevideo.astro` pueden quedar (=350, coherente).

---

## 1. Datos canónicos (ninguna página puede contradecirlos)

| Dato | Valor canónico (fuente de verdad) |
|---|---|
| Precio | **$350/h** todos los consultorios y salas · **Sala Arcos $700/h** |
| Descuentos | 20 h o más/mes → 10% · 40 h o más → 20%, automáticos, sobre el total del mes |
| Horario | **"todos los días, de 7 a 24 h"** en subpáginas (nunca "24/7") |
| Cancelación | gratis con **más de 24 h** · entre 24 h y 1 h: **50%** · menos de 1 h: no se cancela |
| Fijas | cancelaciones gratis con tope mensual **20% de las horas fijas (1 de cada 5)** |
| Pago | a mes vencido, liquidación el día 1, **10 días** para pagar, transferencia o depósito Abitab/RedPagos, sin tarjeta |
| Oferta | pre-registro → **primera hora gratis, válida durante 2026** (cupón BIENVENIDA1010) |
| Conteo de espacios | en subpáginas **NUNCA un total** ("12 espacios" prohibido): "consultorios y salas" o espacios concretos. La home (dice 12) no se toca — discrepancia abierta con Rafa |
| Reservas | bloques de 1 h, hasta 8 seguidas, hasta 150 días, "Una vez" o "Todas las semanas" |
| Comedor | "comedor (y sala de estar) del primer piso, exclusivo para profesionales, sin cargo" — nunca "cowork" ni "sala de espera" |
| Wifi | **"wifi en todo el edificio"** — sin "de fibra" (no respaldado; ver conflicto C3) |
| Música ambiente | **no se publica** hasta confirmación de Rafa (ver conflicto C4) |

Verificado: las 9 specs cumplen estos valores salvo los conflictos C1–C8 resueltos abajo.

---

## 2. Estructura final de ESPACIOS (formato único)

**Se adopta tal cual la de `spec-espacios.md` (Cambio 1a)**: 8 espacios públicos
(7 activos + Sala Arcos), ids/slugs nuevos:

`espacio-01 · espacio-02 · espacio-03 · espacio-11 · espacio-12 · espacio-13 · espacio-14 · sala-arcos`

Interfaz `Espacio` con: `id, nombre, piso, tipo ('amueblado'|'multiuso'), grupo
('individual'|'infancias'|'camilla'|'grupos'), resumen, capacidad, capacidadBreve, metros,
precioHora, reservaPorApp (false solo Sala Arcos), ideal[], foto?, fotoAlt?, destacado?`.
Espacios 04 y 15 (inactivos en DB) quedan FUERA. Código exacto en la sección
"Archivos compartidos" (site.ts completo).

**Slugs viejos → redirects 301** (en vercel.json, abajo): los 12 ids ficticios viejos
mapean 1:1 cuando hay equivalente claro y a `/los-espacios` cuando no.

**Consumidores que deben usar este formato:** `los-espacios/index.astro`,
`los-espacios/[slug].astro`, `EspacioCard.astro`, `para/[slug].astro` (vía
`espaciosRecomendados`), `og/[slug].ts`. `alquiler-consultorio-montevideo.astro` usa su
array local de 3 destacados (decisión de spec-seo-consultorio, aceptada: sus cards linkean
al índice; cuando existan las fichas reales puede migrar a `ESPACIOS.filter(destacado)`).

---

## 3. Política única de CTAs (verificada en las 9 specs)

1. **Primario en TODAS las páginas:** `/#registro` con mensaje de primera hora gratis
   (label de referencia: "Quiero mi primera hora gratis").
2. **Secundario:** WhatsApp vía `CONTACT.whatsappLink('…mensaje contextual…')` con
   `target="_blank"`.
3. **Sala Arcos** (ficha, bloque en /precios, nicho talleres-grupos): primario WhatsApp;
   `/#registro` puede ir como secundario.
4. **Prohibido `SITE.agendaUrl` como CTA** en cualquier página mientras dure el
   pre-lanzamiento (saltea el cupón). Tras aplicar todas las specs + el cambio de Nav de
   este doc, `agendaUrl` queda solo definido en site.ts (sin consumidores) — se conserva
   para el post-apertura.

Estado: las 9 specs ya cumplen 1–3. El único agujero era **Nav.astro** ("Reservar →" →
`agendaUrl` en desktop y mobile, presente en TODAS las subpáginas) que ninguna spec tocaba
→ resuelto en "Archivos compartidos".

---

## 4. Matriz mínima de internal linking (cada spec ya la respeta)

| Desde | Debe linkear a |
|---|---|
| Nav (todas las subpáginas) | /los-espacios, /el-lugar, /como-funciona, /precios, /contacto + CTA /#registro |
| Footer (todas las subpáginas) | NAV + 6 nichos `/para/*` + **/alquiler-consultorio-montevideo** (cambio 11 de spec-seo-consultorio — única edición a Footer.astro de la noche) |
| /como-funciona | /preguntas-frecuentes ("Ver todas las preguntas") + /#registro + WhatsApp |
| /precios | /preguntas-frecuentes (nota cancelación) + /los-espacios (bloque Sala Arcos) + /#registro + WhatsApp |
| /el-lugar | /los-espacios (link nuevo del Cambio 5) + /#registro + WhatsApp |
| /los-espacios | 8 fichas + /#registro + WhatsApp; fichas → índice + 3 "otros espacios" |
| /alquiler-consultorio-montevideo | /los-espacios (cards + botón) + /#registro |
| /para/[slug] | /los-espacios + /#registro (+ WhatsApp en talleres-grupos) |
| /preguntas-frecuentes | /#registro + WhatsApp |
| /404 | /#registro + / + chips (NAV + nichos) |

Backlog (NO esta noche, ya flaggeado por spec-seo-consultorio): links contextuales hacia
/alquiler-consultorio-montevideo desde /precios y /los-espacios; links internos dentro de
las respuestas de la FAQ.

---

## 5. CONFLICTOS ENTRE SPECS — resoluciones (mandan sobre las specs)

### C1. `og/[slug].ts` — entrada `alquiler-consultorio-montevideo` (spec-espacios vs spec-seo-consultorio)
- spec-espacios (Cambio 6b) reintroduce `'Consultorios y salas en Parque Rodó · A 5 cuadras de 18 de Julio'`;
  spec-seo-consultorio (Cambio 10) la fija en `'Consultorios y salas por hora · Palermo / Parque Rodó · Desde $350'`
  y PROHÍBE "5 cuadras" (claim no verificable que esa misma spec eliminó de la página).
- **Resolución: gana spec-seo-consultorio** (dueña de la página; el claim eliminado no puede
  volver por la ventana del OG). El Cambio 6b de spec-espacios queda ANULADO. Ver og final abajo.

### C2. `src/lib/nichos.ts` — `espaciosRecomendados` (spec-espacios vs spec-nichos)
- spec-espacios (Cambio 2): psicologos `['espacio-01','espacio-11','espacio-12']`,
  psicopedagogos `['espacio-02','espacio-03']`. spec-nichos (Cambio 2): psicologos
  `['espacio-01','espacio-12','espacio-11','espacio-02']`, psicopedagogos
  `['espacio-02','espacio-03','espacio-01']` (las otras 4 coinciden).
- **Resolución: gana spec-nichos** (es la spec de contenido del nicho y reemplaza
  `NICHOS_CONTENT` completo; el Cambio 2 de spec-espacios era solo "lo mínimo para no romper
  el build"). El Cambio 2 de spec-espacios queda ANULADO — spec-nichos se aplica en el mismo
  commit (su "DEPENDENCIA DURA" se cumple; el fallback de spec-nichos NO se usa).

### C3. Wifi "de fibra" (spec-faq vs spec-el-lugar / spec-espacios / spec-nichos / spec-precios)
- spec-faq publica "Sí, wifi **de fibra** en todo el edificio"; las otras 4 specs eliminaron
  "fibra" por falta de respaldo (quedó "wifi en todo el edificio").
- **Resolución: sin "fibra" en todo el sitio.** Ajuste a spec-faq en §7. Si Rafa confirma
  fibra, se repone en una pasada (flag F6).

### C4. Música ambiente (spec-faq vs spec-el-lugar / spec-nichos)
- spec-faq afirma "hay música ambiente suave en las circulaciones" (respuesta de privacidad);
  spec-el-lugar la ELIMINÓ de AMENITIES y spec-nichos de todos los claims, ambas por
  "sin respaldo en app/DB".
- **Resolución: no se publica en ninguna página** hasta confirmación de Rafa. Ajuste a
  spec-faq en §7 (flag F7).

### C5. Wifi ausente en "Qué incluye" de /precios (spec-precios vs resto)
- spec-precios eliminó el wifi de su lista de 4 ítems mientras /el-lugar (AMENITIES),
  las fichas de espacios y la FAQ lo afirman. No es contradicción dura (omisión vs claim)
  pero rompe la coherencia "qué incluye el precio".
- **Resolución:** agregar 5º ítem a la lista del Cambio 11 de spec-precios:
  `Wifi en todo el edificio` (ajuste en §7).

### C6. Entradas OG huérfanas (`como-funciona`, `precios`, `el-lugar`) — ninguna spec las tocaba
- El OG de /como-funciona sigue diciendo "**Cuatro** pasos" y "accedés **24/7**" (la página
  pasa a 5 pasos y 7–24); el de /precios dice "Hora suelta · **Pack** · Fija mensual ·
  **Tarifa Fundadores**" (Pack y Fundadores se eliminan esta noche); el de /el-lugar dice
  "Parque Rodó" a secas.
- **Resolución:** este doc asume `og/[slug].ts` completo (abajo) y corrige las tres.

### C7. `schema.ts` huérfano — todas las specs lo flaggearon, ninguna lo asumió completo
- `openingHoursSpecification` 00:00–23:59 (falso, la app dice 7–24) y `hoursAvailable.description`
  con "visitas **guiadas**" (término que spec-contacto eliminó del resto del sitio) quedaban sin dueño;
  `paymentAccepted` y `sameAs` los tomaba spec-contacto (Cambios 6 y 7).
- **Resolución:** este doc asume TODOS los cambios de `schema.ts` (consolidados abajo, una
  sola edición): horario 07:00–23:59, "visitas" sin "guiadas", `paymentAccepted: 'Cash, Bank
  Transfer'`, `sameAs: [SOCIAL.instagram]`. Los Cambios 6 y 7 de spec-contacto quedan
  ABSORBIDOS (no aplicarlos dos veces). Es corrección de dato falso → la fuente de verdad
  gana; la home seguirá diciendo "24/7" en su copy (no se toca) → flag F3.

### C8. Nav.astro — CTA "Reservar →" a `agendaUrl` en todas las subpáginas
- Violaba la política de CTAs y ninguna spec lo tocaba. La home NO usa Nav.astro (usa
  LandingLayout), así que el cambio no la afecta.
- **Resolución:** cambio exacto en "Archivos compartidos" (botón → `/#registro`,
  label "Primera hora gratis"). Flag F8 para que Rafa lo valide (decisión nueva del árbitro).

### Coordinación de ediciones múltiples al mismo archivo (sin conflicto, pero atención)
- **`site.ts`**: spec-espacios (ESPACIOS/SITE/HOURS/DIFERENCIALES) + spec-el-lugar
  (AMENITIES) → consolidado en el archivo completo de abajo. Usar SOLO esta versión.
- **`og/[slug].ts`**: spec-espacios + spec-contacto + spec-seo-consultorio → consolidado abajo.
- **`Footer.astro`**: solo spec-seo-consultorio (Cambio 11). Sin conflicto.
- **`LandingLayout.astro`**: solo spec-misc (Cambio 9, info@→hola@). Sin conflicto.
- **`ContactForm.tsx`, `nichos.ts` (contenido), páginas individuales**: una sola spec cada uno. Sin conflicto.

---

## 6. ARCHIVOS COMPARTIDOS — contenido exacto

### 6.1 `src/lib/site.ts` — archivo COMPLETO nuevo (reemplazar entero)

Consolida: spec-espacios Cambios 1a–1d + spec-el-lugar Cambio 3 (AMENITIES). ADDRESS,
CONTACT, SOCIAL, NICHOS y NAV quedan idénticos a hoy (los flags de coordenadas/CP siguen
abiertos para Rafa).

```ts
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
    'Consultorios y salas por hora para profesionales de la salud y el bienestar. Edificio centenario reciclado a nuevo entre Palermo y Parque Rodó, Montevideo. Reservás online y entrás con tu código, todos los días de 7 a 24.',
  locale: 'es_UY',
  // Subdominio operativo de la PWA de reservas. NO usarlo como CTA durante el
  // pre-lanzamiento: el CTA primario de todas las páginas es /#registro (cupón).
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
  // Horario reservable real de la app: 07:00 a 24:00, todos los días
  // (el cierre es la hora a la que termina la última reserva).
  openingHours: 'Todos los días, de 7 a 24 h',
  humanSupport: 'Lunes a sábado, 9 a 20 hs',
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
 * Solo datos con respaldo en la fuente de verdad (música ambiente, sala de espera,
 * "cowork" y "fibra" se quitaron — flaggeados a Rafa para reincorporar si los confirma).
 */
export const AMENITIES = [
  { icon: 'wifi', label: 'Wifi en todo el edificio' },
  { icon: 'air-conditioner', label: 'Aire acondicionado en cada espacio' },
  { icon: 'led', label: 'Iluminación LED regulable' },
  { icon: 'lock', label: 'Acceso con código personal, todos los días de 7 a 24 h' },
  { icon: 'coffee', label: 'Comedor y sala de estar para profesionales, sin cargo' },
  { icon: 'parking', label: 'Estacionamiento no tarifado en la zona' },
  { icon: 'bus', label: 'A 2 cuadras de líneas troncales' },
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
```

Notas de la consolidación:
- `DIFERENCIALES` eliminado (código muerto con "12 espacios", "24/7", "cowork" — grep
  confirma cero imports).
- `destacado` final: **espacio-01, espacio-13 y espacio-14** (los 3 que muestra
  /alquiler-consultorio-montevideo como array local). Sala Arcos NO lleva `destacado`
  (spec-espacios la marcaba pero la página geo no la usa y ya tiene su sección propia
  en /los-espacios); si algún día se quiere, agregarlo es trivial.

### 6.2 `vercel.json` — bloque `"redirects"` completo (lo demás del archivo no cambia)

```json
  "redirects": [
    { "source": "/home", "destination": "/", "permanent": true },
    { "source": "/espacios", "destination": "/los-espacios", "permanent": true },
    { "source": "/faq", "destination": "/preguntas-frecuentes", "permanent": true },
    { "source": "/contact", "destination": "/contacto", "permanent": true },
    { "source": "/los-espacios/sala-subsuelo", "destination": "/los-espacios/sala-arcos", "permanent": true },
    { "source": "/los-espacios/salon-cobre", "destination": "/los-espacios/espacio-03", "permanent": true },
    { "source": "/los-espacios/salon-roble", "destination": "/los-espacios/espacio-14", "permanent": true },
    { "source": "/los-espacios/estudio-norte", "destination": "/los-espacios/espacio-01", "permanent": true },
    { "source": "/los-espacios/estudio-sur", "destination": "/los-espacios/espacio-12", "permanent": true },
    { "source": "/los-espacios/consulta-1", "destination": "/los-espacios", "permanent": true },
    { "source": "/los-espacios/consulta-2", "destination": "/los-espacios", "permanent": true },
    { "source": "/los-espacios/consulta-3", "destination": "/los-espacios", "permanent": true },
    { "source": "/los-espacios/consulta-4", "destination": "/los-espacios", "permanent": true },
    { "source": "/los-espacios/consulta-5", "destination": "/los-espacios", "permanent": true },
    { "source": "/los-espacios/consulta-6", "destination": "/los-espacios", "permanent": true },
    { "source": "/los-espacios/consulta-7", "destination": "/los-espacios", "permanent": true }
  ]
```

(Idéntico a spec-espacios Cambio 7 — cubre los 12 slugs viejos: 5 con equivalente 1:1,
7 "consultas" inventadas al índice.)

### 6.3 `src/lib/schema.ts` — cambios consolidados (ABSORBE los Cambios 6 y 7 de spec-contacto)

a) Línea 6 — import:

```ts
import { SITE, ADDRESS, CONTACT, SOCIAL } from './site';
```

b) Línea 47:

```ts
    paymentAccepted: 'Cash, Bank Transfer',
```

c) Doc-comment de la función (líneas 25–30) y comentario de la línea 61 — reflejar la verdad:

```ts
/**
 * LocalBusiness refinado con OpeningHoursSpecification dual:
 *   - Horario reservable real: todos los días de 07:00 a 24:00 (auto-acceso con código)
 *   - La atención humana tiene horario comercial
 * Google entiende ambos y muestra el correcto según el query.
 */
```

y en la línea 61: `// Horario reservable real (auto-acceso con código): 7 a 24, todos los días.`

d) Líneas 62–69 — horario real (07:00–23:59; Schema.org no acepta "24:00", 23:59 es la
convención para "hasta medianoche"):

```ts
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '07:00',
        closes: '23:59',
      },
    ],
```

e) Línea 76 — sin "guiadas" (coherente con spec-contacto):

```ts
      description: 'Atención humana por WhatsApp y visitas',
```

f) Líneas 79–81:

```ts
    sameAs: [SOCIAL.instagram],
```

### 6.4 `src/pages/og/[slug].ts` — record `pages` completo (ABSORBE spec-espacios C6, spec-contacto C8, spec-seo-consultorio C10)

Reemplazar el objeto `pages` entero por (el resto del archivo — imports, `OGImageRoute`,
fuentes — no cambia):

```ts
const pages: Record<string, OgPage> = {
  // Landing principal
  home: {
    title: 'Tu consultorio,\nsin complicaciones.',
    description: 'Espacios cuidados por hora para profesionales · Parque Rodó, Montevideo',
  },
  // Páginas core
  'los-espacios': {
    title: 'Consultorios y salas.\nUna sola filosofía.',
    description: 'Conocé los espacios de Espacio 1010',
  },
  'el-lugar': {
    title: 'Cien años de historia,\nreciclados a nuevo.',
    description: 'Gaboto 1010 · entre Palermo y Parque Rodó · Montevideo',
  },
  'como-funciona': {
    title: 'Cinco pasos.\nEl resto es atender.',
    description: 'Reservás online y entrás con tu código, todos los días de 7 a 24',
  },
  precios: {
    title: 'Sin letra chica.\nSin sorpresas.',
    description: 'Hora suelta o fija semanal · $350/h · Tu primera hora gratis',
  },
  contacto: {
    title: 'Hablamos\ncuando querés.',
    description: 'WhatsApp · Email · Visita',
  },
  'preguntas-frecuentes': {
    title: 'Preguntas\nfrecuentes.',
    description: 'Todo lo que te queda por preguntar',
  },
  'alquiler-consultorio-montevideo': {
    title: 'Alquiler de consultorio\npor hora en Montevideo.',
    description: 'Consultorios y salas por hora · Palermo / Parque Rodó · Desde $350',
  },

  // Auto-generadas para cada espacio (key = id del espacio, ver los-espacios/[slug].astro)
  ...Object.fromEntries(
    ESPACIOS.map((e) => [
      e.id,
      {
        title: e.nombre,
        description: `${e.resumen} · ${e.capacidad} · ${e.metros} m² · $${e.precioHora}/h`,
      } satisfies OgPage,
    ])
  ),

  // Auto-generadas para cada nicho
  ...Object.fromEntries(
    NICHOS.map((n) => {
      const content = NICHOS_CONTENT[n.slug];
      return [
        `nicho-${n.slug}`,
        {
          title: content?.label ?? n.label,
          description: 'Espacio 1010 · Parque Rodó · Montevideo',
        } satisfies OgPage,
      ];
    })
  ),
};
```

(Las keys de espacios pasan de `espacio-${e.id}` a `e.id` — requiere que
`los-espacios/[slug].astro` use `ogSlug={espacio.id}`, como ya indica spec-espacios.)

### 6.5 `src/components/Nav.astro` — CTA al pre-registro (cambio NUEVO del árbitro, C8)

a) Línea 33 (desktop):

```astro
      <Button href="/#registro" variant="primary" size="sm">Primera hora gratis</Button>
```

b) Líneas 69–76 (drawer mobile), el `<a>` del CTA:

```astro
      <li class="pt-3">
        <a
          href="/#registro"
          class="block w-full rounded-full bg-terracota px-6 py-3 text-center text-base font-medium text-white"
        >
          Primera hora gratis
        </a>
      </li>
```

c) Si `SITE` queda sin uso en el frontmatter, dejar el import solo con `NAV`:
`import { NAV } from '../lib/site';`

(No afecta la home: usa LandingLayout. Flag F8 a Rafa.)

### 6.6 `src/components/Footer.astro` — un solo cambio (de spec-seo-consultorio C11)

En la columna "Para profesionales", dentro del `<ul>`, DESPUÉS del cierre del map de
`NICHOS` (entre las líneas 54 y 55):

```astro
          <li>
            <a
              href="/alquiler-consultorio-montevideo"
              class="text-crema/80 transition-colors hover:text-terracota-light"
            >
              Alquiler de consultorio en Montevideo
            </a>
          </li>
```

### 6.7 `src/layouts/LandingLayout.astro` — sin cambios desde acá

El único cambio (línea 131, `info@` → `{CONTACT.email}`) lo aplica spec-misc Cambio 9.
No duplicar.

---

## 7. AJUSTES POR PÁGINA (correcciones puntuales a cada spec)

### spec-espacios.md
- **ANULADO el Cambio 2** (nichos.ts) — lo cubre spec-nichos (C2). Aplicar spec-nichos en
  el MISMO commit (la dependencia dura se cumple por construcción).
- **ANULADO el Cambio 6b** (OG de alquiler-consultorio-montevideo) — gana spec-seo (C1).
- Cambios 1a–1d, 6a, 6c y 7 quedan ABSORBIDOS por §6.1, §6.4 y §6.2 (aplicar las versiones
  de este doc, no las de la spec — son idénticas salvo `destacado` de Sala Arcos y el OG).
- Cambios 3, 4 y 5 (páginas índice/ficha/EspacioCard): aplicar tal cual. `Button` acepta
  `target` (verificado §0): no hace falta el fallback `<a>`.

### spec-nichos.md
- Aplicar tal cual, junto con el site.ts nuevo (mismo commit). El **fallback** del bloque
  "DEPENDENCIA DURA" NO se usa. Sus `espaciosRecomendados` son los canónicos (C2).

### spec-el-lugar.md
- El Cambio 3 (AMENITIES) queda ABSORBIDO por §6.1 (idéntico). El resto, tal cual.
- Su import del Cambio 1 (`ADDRESS, AMENITIES, CONTACT`) sigue válido.

### spec-faq.md
- **C3** — En "¿Hay wifi en todo el edificio?", la respuesta pasa a:
  `Sí, hay wifi en todo el edificio, incluidos los espacios y el comedor del primer piso.`
  (sin "de fibra").
- **C4** — En "¿Cómo es la privacidad entre espacios?", la respuesta pasa a:
  `La cuidamos entre todos: las pautas de la casa piden cuidar el volumen y evitar conversaciones sensibles en zonas comunes. Si tu práctica incluye música o movimiento, contanos y te recomendamos el espacio que mejor convive con eso.`
  (sin "música ambiente suave en las circulaciones" hasta confirmación de Rafa).
- El resto, tal cual. ("Heladera, café" del comedor se mantiene: spec-faq lo verificó
  contra Ayuda.jsx — flag F9 por la asimetría con /precios.)

### spec-precios.md
- **C5** — Cambio 11: la lista "Qué incluye" pasa a 5 ítems, agregando al final:
  `Wifi en todo el edificio`.
- Cambios 2 y 10: mantener "transferencia bancaria o depósito en Abitab o RedPagos"
  (fuente de verdad; el detalle BROU no se publica — coherente con su contradicción 2).
- El resto, tal cual.

### spec-como-funciona.md
- Aplicar tal cual. Su OG queda corregido por §6.4 (no lo tenía cubierto — C6).
- Nota: mantiene "¿Cómo accede mi paciente?" en su FAQ — permitido (la regla es "no
  siempre pacientes", no "nunca"); la página de FAQ usa la otra fórmula, conviven bien.

### spec-contacto.md
- **Cambios 6 y 7 (schema.ts) ABSORBIDOS** por §6.3 — no aplicarlos desde la spec (C7).
- Cambio 8 (OG contacto) ABSORBIDO por §6.4.
- Cambios 1–5: aplicar tal cual.

### spec-seo-consultorio.md
- Cambio 10 (OG) ABSORBIDO por §6.4 y Cambio 11 (Footer) por §6.6 — misma letra, una sola
  aplicación.
- Cambios 1–9: aplicar tal cual. Sus 3 `destacados` locales (Espacio 01, 13, 14) coinciden
  con los `destacado: true` del site.ts nuevo.

### spec-misc.md
- Aplicar tal cual (privacidad, 404, LandingLayout email). El "schema.ts huérfano" que
  flaggeaba queda resuelto por §6.3.

---

## 8. Orden de implementación recomendado (el sitio está en producción)

1. **Commit 1 (atómico, build-breaking si se parte):** `site.ts` completo (§6.1) +
   `nichos.ts` (spec-nichos) + `los-espacios/index.astro` + `los-espacios/[slug].astro` +
   `EspacioCard.astro` (spec-espacios 3–5) + `para/[slug].astro` (spec-nichos parte 2) +
   `og/[slug].ts` (§6.4) + `alquiler-consultorio-montevideo.astro` (spec-seo 1–9) +
   `vercel.json` (§6.2). Verificar: `npm run build` sin errores; fichas
   `/los-espacios/espacio-01…sala-arcos` en dist; OGs `dist/og/espacio-01.png…`.
2. **Commit 2:** `schema.ts` (§6.3) + `Nav.astro` (§6.5) + `Footer.astro` (§6.6) +
   `LandingLayout.astro` (spec-misc 9).
3. **Commits siguientes (independientes entre sí):** como-funciona, precios, faq (con los
   ajustes de §7), el-lugar, contacto (+ContactForm), privacidad/404.
4. Grep global final sobre `src/` (excluyendo `index.astro`): cero ocurrencias de
   `12 espacios`, `24/7`, `cowork`, `sala de espera`, `boutique`, `insonoriz`, `Cordón`,
   `sin permanencia`, `de fibra`, `música ambiente`, `Fundadores`, `visita guiada`,
   `Homeopatía`, `estudio-norte|salon-cobre|consulta-\d|sala-subsuelo`.
   `SITE.agendaUrl` solo puede quedar en su definición en `site.ts`.

---

## 9. Contradicciones / pendientes consolidados para el informe a Rafa

- **F1 — Incidente de orquestación:** el veredicto del panel de 3 lentes llegó VACÍO
  (placeholder `${JSON}` sin sustituir) a las 9 specs. Ninguna incorpora objeciones del
  panel; si el panel corrió y dejó output en otro lado, cotejarlo contra las specs.
- **F2 — 9 vs 12 espacios (abierta):** la home sigue diciendo "12" (meta description y
  copy); las subpáginas pasan a 7 activos + Sala Arcos sin totales. Decidir el número
  canónico y de paso actualizar la home.
- **F3 — "24/7" de la home vs 7–24 real:** las subpáginas y el JSON-LD (schema.ts §6.3)
  pasan a 7–24; la home conserva "24/7" en su copy (prohibido tocarla). Coherencia pendiente.
- **F4 — `SITE.description` nuevo cambia el footer visible de TODAS las subpáginas**
  ("…todos los días de 7 a 24"). NO cambia la home (LandingLayout pasa description propia
  y tiene footer propio). Validar el texto.
- **F5 — Nav "Reservar →" pasó a "Primera hora gratis" → `/#registro`** (decisión del
  árbitro, C8): el botón viejo mandaba a la PWA salteando el cupón en todas las subpáginas.
  Validar label y que el cambio quede hasta la apertura.
- **F6 — Wifi "de fibra":** eliminado de todo el sitio (queda "wifi en todo el edificio").
  Si Rafa confirma fibra, reponer en FAQ/el-lugar/nichos.
- **F7 — Música ambiente:** eliminada de AMENITIES, nichos Y de la FAQ (C4). Si es real,
  reincorporar con redacción precisa.
- **F8 — Claims eliminados por falta de respaldo** (reponer solo si Rafa confirma):
  sala de espera compartida, limpieza profunda diaria, café/té/agua incluidos, domótica,
  "5 cuadras de 18 de Julio", líneas "101/103/CA1", facultad de medicina/hospitales,
  "baño accesible en PB"/"2 escalones", SLA "aprobamos el mismo día", confirmación por
  mail, armario para fijos, "visita guiada" (queda "visita").
- **F9 — Comedor con "heladera, café" en la FAQ** (respaldado por Ayuda.jsx) mientras
  /precios eliminó "café/té/agua" de "qué incluye": asimetría menor, confirmar qué hay
  realmente en el comedor.
- **F10 — Espacios 04 y 15 OMITIDOS** del sitio (inactivos en DB). ¿Se quieren como
  "próximamente"?
- **F11 — Cupón BIENVENIDA1010 con `cupo_reservas_por_usuario = null`:** verificar en la
  app que el 100% aplique a UNA sola reserva — todo el sitio promete "una hora gratis".
- **F12 — Coordenadas `lat/lng` y `postalCode` de site.ts sin verificar** (salen en el
  JSON-LD sitewide). Copiar los reales de Google Maps.
- **F13 — `ADDRESS.neighborhood = 'Parque Rodó'`** vs posicionamiento "entre Palermo y
  Parque Rodó": unificar criterio para schema/OG (hoy los OG dicen "Parque Rodó" a secas
  en el tag de marca).
- **F14 — info@ vs hola@espacio1010.uy** (spec-misc cambia el footer de la landing a
  hola@): confirmar si info@ existe/redirige y si llegaron correos ahí.
- **F15 — Visitas en pre-apertura:** confirmar que se siguen coordinando (la opción
  "Visita al lugar" del form y varios CTAs lo prometen).
- **F16 — Nombres utilitarios ("Espacio 01"):** la web replica los nombres reales de la
  app. Si se quieren nombres con marca, cambiar primero en la app (la app manda).
- **F17 — Tres schemas FAQPage** (preguntas-frecuentes, precios, alquiler-consultorio)
  con preguntas de precio parecidas: válido por página para Google, pero se puede
  diferenciar más el wording si se quiere afinar.
- **F18 — Medios de pago, detalle fino:** Ayuda.jsx dice "transferencia o depósito BROU";
  la fuente de verdad dice "transferencia BROU o depósito Abitab/RedPagos". El sitio sigue
  a la fuente de verdad; confirmar el detalle exacto.
- **F19 — Sala Arcos con Offer `InStock`** en el schema de su ficha aunque se venda por
  WhatsApp: se mantuvo (precio real, página real). Cambiar si molesta.
- **F20 — "Entra justo a la hora de tu reserva":** la fuente no explicita dónde espera
  la persona atendida si llega antes (no hay sala de espera publicada). Validar que el
  copy no genere fricción en puerta.
