# SPEC FINAL — /los-espacios + /los-espacios/[slug] (sesión nocturna 2026-06-10)

> Sintetizador nocturno. Insumos: `docs/nocturna/audit-espacios.md` + `docs/VERDAD_APP_2026_06_10.md`.
> ⚠️ **El veredicto del panel de 3 lentes NO llegó al sintetizador** (el orquestador pasó el
> placeholder `${JSON}` sin sustituir — mismo problema que en spec-el-lugar y spec-misc).
> Esta spec se resolvió con auditoría + fuente de verdad + criterio propio (usuario real > SEO >
> estética; la fuente de verdad SIEMPRE gana en datos). Si el panel objetó algo, revisarlo mañana
> contra esta spec.

**Archivos a tocar (en este orden, UN solo commit/deploy):**

1. `src/lib/site.ts`
2. `src/lib/nichos.ts` (solo `espaciosRecomendados` — lo mínimo para no romper el build)
3. `src/pages/los-espacios/index.astro`
4. `src/pages/los-espacios/[slug].astro`
5. `src/components/EspacioCard.astro`
6. `src/pages/og/[slug].ts`
7. `vercel.json`

**NO tocar:** `src/pages/index.astro` (home, prohibida), `AMENITIES` en `site.ts` (lo reescribe
`spec-el-lugar.md` — no duplicar), copy de `nichos.ts` más allá de los IDs (es de la spec de
nichos), copy de `alquiler-consultorio-montevideo.astro` (es de la spec de seo-consultorio; acá
solo su entrada OG).

**Validación obligatoria antes de pushear:** `npm run build` (el cambio de `EspacioId` es
build-breaking si queda algún ID viejo colgado; el sitio está en producción).

---

## Cambio 1 — `src/lib/site.ts`: ESPACIOS reales + tipos + helpers (CRÍTICO)

### 1a. Reemplazar el bloque completo de espacios (líneas 56–202: comentario, `EspacioId`, `Espacio` y `ESPACIOS`) por:

```ts
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
    destacado: true,
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
```

### 1b. `SITE.description` (línea 13-14) — sacar el "24/7"

Reemplazar por:

```ts
  description:
    'Consultorios y salas por hora para profesionales de la salud y el bienestar. Edificio centenario reciclado a nuevo entre Palermo y Parque Rodó, Montevideo. Reservás online y entrás con tu código, todos los días de 7 a 24.',
```

⚠️ Este texto se renderiza VISIBLE en el footer de TODAS las páginas (incluida la home, vía
`Footer.astro:14`) y es la meta description default. No toca el archivo `index.astro`, pero sí
cambia el footer de la home → queda flaggeado en contradicciones para que Rafa lo vea mañana.
El dato actual ("24/7") es falso, así que la verdad gana.

### 1c. `HOURS` (líneas 49–54) — corregir el dato muerto

```ts
export const HOURS = {
  // Horario reservable real de la app: 07:00 a 24:00, todos los días
  // (el cierre es la hora a la que termina la última reserva).
  openingHours: 'Todos los días, de 7 a 24 h',
  humanSupport: 'Lunes a sábado, 9 a 20 hs',
} as const;
```

(Hoy nada importa `HOURS` — verificado con grep — pero el dato falso no puede quedar esperando
a que alguien lo use. `schema.ts` hardcodea su propio 00:00–23:59: fuera de alcance, va a
contradicciones.)

### 1d. Eliminar `DIFERENCIALES` completo (líneas 221–250)

Es código muerto (ningún archivo lo importa — verificado con grep) y contiene "los 12
espacios", "Acceso 24/7", "Cowork incluido sin cargo" y "privacidad acústica", todos falsos.
Borrar el array y su comentario.

### 1e. `AMENITIES` — NO TOCAR

Lo reescribe `spec-el-lugar.md` (Cambio 3). Si ambas specs se aplican, no hay conflicto: esta
spec no toca esas líneas.

---

## Cambio 2 — `src/lib/nichos.ts`: remapear `espaciosRecomendados` (CRÍTICO, build-breaking)

Solo estas 6 líneas (el resto del copy de nichos lo cubre su propia spec):

- Línea 57 (psicologos): `espaciosRecomendados: ['espacio-01', 'espacio-11', 'espacio-12'],`
- Línea 107 (psiquiatras): `espaciosRecomendados: ['espacio-11', 'espacio-12', 'espacio-01'],`
- Línea 152 (psicopedagogos): `espaciosRecomendados: ['espacio-02', 'espacio-03'],`
- Línea 197 (nutricionistas): `espaciosRecomendados: ['espacio-12', 'espacio-11', 'espacio-01'],`
- Línea 238 (meditacion-yoga): `espaciosRecomendados: ['espacio-03', 'espacio-14', 'sala-arcos'],`
- Línea 284 (talleres-grupos): `espaciosRecomendados: ['sala-arcos', 'espacio-03', 'espacio-14'],`

---

## Cambio 3 — `src/pages/los-espacios/index.astro`: reescritura completa (CRÍTICO)

Reemplazar el archivo entero por:

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import Container from '../../components/Container.astro';
import Button from '../../components/Button.astro';
import { ESPACIOS, CONTACT, ADDRESS, TIPO_LABEL, TIPO_DESC, ICONOS_GRUPO } from '../../lib/site';
import { breadcrumbSchema } from '../../lib/schema';

// Agrupación real por uso — la misma que la home (verificada contra la DB de la app).
const individuales = ESPACIOS.filter((e) => e.grupo === 'individual');
const infancias = ESPACIOS.filter((e) => e.grupo === 'infancias');
const camilla = ESPACIOS.filter((e) => e.grupo === 'camilla');
const grupos = ESPACIOS.filter((e) => e.grupo === 'grupos' && e.id !== 'sala-arcos');
const arcos = ESPACIOS.find((e) => e.id === 'sala-arcos');

const schemaBreadcrumb = breadcrumbSchema([
  { name: 'Inicio', url: '/' },
  { name: 'Los espacios', url: '/los-espacios' },
]);
---

<BaseLayout
  title="Consultorios y salas por hora"
  description="Conocé los consultorios y salas por hora de Espacio 1010: espacios amueblados para atención individual, un espacio con camilla, salas para movimiento y grupos, y la Sala Arcos para hasta 25 personas. Entre Palermo y Parque Rodó, Montevideo."
  ogSlug="los-espacios"
>
  <Fragment slot="head">
    <script is:inline type="application/ld+json" set:html={JSON.stringify(schemaBreadcrumb)} />
  </Fragment>

  <!-- ════════════════════ HEADER ════════════════════ -->
  <section class="bg-white pt-16 pb-12 sm:pt-24 sm:pb-16">
    <Container>
      <nav aria-label="Migas de pan" class="mb-8 text-sm text-ink-muted">
        <a href="/" class="hover:text-terracota">Inicio</a>
        <span class="mx-2">/</span>
        <span class="text-ink">Los espacios</span>
      </nav>

      <p class="mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-terracota">
        Los espacios
      </p>
      <h1 class="text-balance text-ink">
        Consultorios y salas, <span class="text-terracota">una sola filosofía</span>.
      </h1>
      <p class="mt-7 max-w-2xl text-lg leading-relaxed text-ink-soft text-pretty">
        Espacios amueblados para atender uno a uno, un espacio con camilla y salas
        despejadas para grupos y movimiento — todos a $350 la hora. Y la Sala Arcos,
        la más grande, a $700, para encuentros de mayor escala. Entre Palermo y
        {ADDRESS.neighborhood}, Montevideo.
      </p>

      <!-- Leyenda de tipos (los 2 reales de la app) -->
      <div class="mt-10 flex flex-wrap gap-x-8 gap-y-4 border-t border-hairline pt-6 text-sm text-ink-soft">
        <span class="inline-flex items-center gap-2">
          <span class="h-2.5 w-2.5 rounded-full bg-terracota"></span>
          <strong class="font-semibold text-ink">{TIPO_LABEL.amueblado}</strong> — {TIPO_DESC.amueblado}
        </span>
        <span class="inline-flex items-center gap-2">
          <span class="h-2.5 w-2.5 rounded-full bg-ink-soft"></span>
          <strong class="font-semibold text-ink">{TIPO_LABEL.multiuso}</strong> — {TIPO_DESC.multiuso}
        </span>
      </div>
      <p class="mt-6 text-sm text-ink-muted">Fotos reales de cada espacio, muy pronto.</p>
    </Container>
  </section>

  <!-- ════════════════════ SALA ARCOS (destacada, con foto real) ════════════════════ -->
  {arcos && (
    <section class="bg-[#f8f9fa] py-12 sm:py-16">
      <Container>
        <p class="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-terracota">La gran sala</p>
        <div class="grid gap-6 lg:grid-cols-12">
          <a
            href={`/los-espacios/${arcos.id}`}
            class="group flex flex-col overflow-hidden rounded-2xl border border-hairline bg-white transition-all duration-500 hover:-translate-y-1 hover:border-terracota/30 hover:shadow-[var(--shadow-md)] lg:col-span-5"
          >
            <img
              src={arcos.foto}
              alt={arcos.fotoAlt}
              class="aspect-[4/3] w-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <div class="flex flex-1 flex-col p-7">
              <h2 class="text-2xl text-ink">{arcos.nombre}</h2>
              <p class="mt-2 text-sm leading-relaxed text-ink-soft">{arcos.resumen}</p>
              <div class="mt-auto flex items-center justify-between border-t border-hairline pt-4 text-xs text-ink-muted">
                <span>{arcos.capacidad} · {arcos.metros} m²</span>
                <span class="text-sm font-semibold text-terracota">${arcos.precioHora} <span class="font-normal text-ink-muted">/ h</span></span>
              </div>
            </div>
          </a>

          <div class="flex flex-col justify-center rounded-2xl border border-hairline bg-white p-8 sm:p-10 lg:col-span-7">
            <h3 class="text-2xl text-ink text-balance">Para cuando 25 personas se juntan a aprender, moverse o trabajar en grupo.</h3>
            <p class="mt-4 text-base leading-relaxed text-ink-soft text-pretty">
              40 m² en el subsuelo, con proyector, parlante, kitchenette y baño
              propio. Ideal para talleres, formaciones, prácticas grupales o
              encuentros. Se coordina directo con nosotros: escribinos por WhatsApp
              y la armamos juntos. $700 la hora.
            </p>
            <div class="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button
                href={CONTACT.whatsappLink('Hola! Quiero consultar por la Sala Arcos para un taller/encuentro.')}
                variant="outline"
                size="md"
                target="_blank"
              >
                Consultar por WhatsApp
              </Button>
              <Button href={`/los-espacios/${arcos.id}`} variant="ghost" size="md">
                Ver la Sala Arcos
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )}

  <!-- ════════════════════ ATENCIÓN INDIVIDUAL ════════════════════ -->
  <section class="bg-white py-12 sm:py-16">
    <Container size="wide">
      <h2 class="mb-2 text-2xl text-ink sm:text-3xl">Atención individual</h2>
      <p class="mb-8 text-ink-soft">Para sesiones uno a uno, entrevistas, orientación o consulta clínica.</p>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {individuales.map((e) => (
          <a
            href={`/los-espacios/${e.id}`}
            class="group flex flex-col rounded-2xl border border-hairline bg-[#f8f9fa] p-6 transition-all duration-500 hover:-translate-y-1 hover:border-terracota/30 hover:shadow-[var(--shadow-md)]"
          >
            <div class="flex items-start justify-between">
              <span class="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-terracota-tint text-terracota">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" set:html={ICONOS_GRUPO[e.grupo]} />
              </span>
              <span class="rounded-full bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-soft">{TIPO_LABEL[e.tipo]}</span>
            </div>
            <h3 class="mt-5 text-lg text-ink">{e.nombre}</h3>
            <p class="mt-1.5 text-sm leading-relaxed text-ink-soft">{e.resumen}</p>
            <div class="mt-auto flex items-center justify-between border-t border-hairline pt-4 text-xs text-ink-muted">
              <span>{e.capacidadBreve} · {e.metros} m²</span>
              <span class="text-sm font-semibold text-terracota">${e.precioHora} <span class="font-normal text-ink-muted">/ h</span></span>
            </div>
          </a>
        ))}
      </div>
    </Container>
  </section>

  <!-- ════════════════════ INFANCIAS + CAMILLA (comparten fila) ════════════════════ -->
  <section class="bg-[#f8f9fa] py-12 sm:py-16">
    <Container size="wide">
      <div class="grid gap-12 lg:grid-cols-2 lg:gap-8">
        <div>
          <h2 class="mb-2 text-2xl text-ink sm:text-3xl">Para infancias</h2>
          <p class="mb-8 text-ink-soft">Con rincón infantil y butacas, para trabajar con niños y familias.</p>
          <div class="grid gap-4">
            {infancias.map((e) => (
              <a
                href={`/los-espacios/${e.id}`}
                class="group flex flex-col rounded-2xl border border-hairline bg-white p-6 transition-all duration-500 hover:-translate-y-1 hover:border-terracota/30 hover:shadow-[var(--shadow-md)]"
              >
                <div class="flex items-start justify-between">
                  <span class="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-terracota-tint text-terracota">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" set:html={ICONOS_GRUPO[e.grupo]} />
                  </span>
                  <span class="rounded-full bg-[#f8f9fa] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-soft">{TIPO_LABEL[e.tipo]}</span>
                </div>
                <h3 class="mt-5 text-lg text-ink">{e.nombre}</h3>
                <p class="mt-1.5 text-sm leading-relaxed text-ink-soft">{e.resumen}</p>
                <div class="mt-auto flex items-center justify-between border-t border-hairline pt-4 text-xs text-ink-muted">
                  <span>{e.capacidadBreve} · {e.metros} m²</span>
                  <span class="text-sm font-semibold text-terracota">${e.precioHora} <span class="font-normal text-ink-muted">/ h</span></span>
                </div>
              </a>
            ))}
          </div>
        </div>
        <div>
          <h2 class="mb-2 text-2xl text-ink sm:text-3xl">Con camilla</h2>
          <p class="mb-8 text-ink-soft">Para masajes, reflexología y terapias corporales.</p>
          <div class="grid gap-4">
            {camilla.map((e) => (
              <a
                href={`/los-espacios/${e.id}`}
                class="group flex flex-col rounded-2xl border border-hairline bg-white p-6 transition-all duration-500 hover:-translate-y-1 hover:border-terracota/30 hover:shadow-[var(--shadow-md)]"
              >
                <div class="flex items-start justify-between">
                  <span class="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-terracota-tint text-terracota">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" set:html={ICONOS_GRUPO[e.grupo]} />
                  </span>
                  <span class="rounded-full bg-[#f8f9fa] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-soft">{TIPO_LABEL[e.tipo]}</span>
                </div>
                <h3 class="mt-5 text-lg text-ink">{e.nombre}</h3>
                <p class="mt-1.5 text-sm leading-relaxed text-ink-soft">{e.resumen}</p>
                <div class="mt-auto flex items-center justify-between border-t border-hairline pt-4 text-xs text-ink-muted">
                  <span>{e.capacidadBreve} · {e.metros} m²</span>
                  <span class="text-sm font-semibold text-terracota">${e.precioHora} <span class="font-normal text-ink-muted">/ h</span></span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </Container>
  </section>

  <!-- ════════════════════ GRUPOS, MOVIMIENTO Y TALLERES ════════════════════ -->
  <section class="bg-white py-12 sm:py-16">
    <Container size="wide">
      <h2 class="mb-2 text-2xl text-ink sm:text-3xl">Grupos, movimiento y talleres</h2>
      <p class="mb-8 text-ink-soft">Despejados y con colchonetas, para grupos chicos, meditación o movimiento.</p>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {grupos.map((e) => (
          <a
            href={`/los-espacios/${e.id}`}
            class="group flex flex-col rounded-2xl border border-hairline bg-[#f8f9fa] p-6 transition-all duration-500 hover:-translate-y-1 hover:border-terracota/30 hover:shadow-[var(--shadow-md)]"
          >
            <div class="flex items-start justify-between">
              <span class="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-terracota-tint text-terracota">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" set:html={ICONOS_GRUPO[e.grupo]} />
              </span>
              <span class="rounded-full bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-soft">{TIPO_LABEL[e.tipo]}</span>
            </div>
            <h3 class="mt-5 text-lg text-ink">{e.nombre}</h3>
            <p class="mt-1.5 text-sm leading-relaxed text-ink-soft">{e.resumen}</p>
            <div class="mt-auto flex items-center justify-between border-t border-hairline pt-4 text-xs text-ink-muted">
              <span>{e.capacidadBreve} · {e.metros} m²</span>
              <span class="text-sm font-semibold text-terracota">${e.precioHora} <span class="font-normal text-ink-muted">/ h</span></span>
            </div>
          </a>
        ))}
      </div>
      <p class="mt-8 text-sm text-ink-soft">
        ¿Necesitás más lugar? La <a href="/los-espacios/sala-arcos" class="font-semibold text-terracota underline-offset-4 hover:underline">Sala Arcos</a> recibe hasta 25 personas.
      </p>
    </Container>
  </section>

  <!-- ════════════════════ CTA ════════════════════ -->
  <section class="bg-[#f8f9fa] py-20 sm:py-28">
    <Container>
      <div class="rounded-[var(--radius-xl)] border border-hairline bg-white p-12 text-center shadow-[var(--shadow-md)] sm:p-16">
        <h2 class="text-balance text-ink">Tu primera hora acá adentro es gratis.</h2>
        <p class="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-ink-soft text-pretty">
          Pre-registrate hoy y te guardamos una hora gratis para usarla cuando
          quieras durante 2026, en el espacio que elijas.
        </p>
        <div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button href="/#registro" variant="primary" size="lg">
            Quiero mi primera hora gratis
          </Button>
          <Button href={CONTACT.whatsappLink('Hola! Quiero saber más sobre los espacios de Espacio 1010.')} variant="ghost" size="lg" target="_blank">
            Escribinos por WhatsApp
          </Button>
        </div>
      </div>
    </Container>
  </section>
</BaseLayout>
```

Notas de implementación:
- Si el componente `Button` no soporta `target`, pasar el atributo igual (Astro lo propaga si
  el componente hace spread de `Astro.props`/`...rest`; verificar — si no lo propaga, usar un
  `<a>` con las clases equivalentes, como ya hace la home).
- El card de espacio se repite 4 veces a propósito (misma decisión visual que el archivo
  actual); NO refactorizar a `EspacioCard` esta noche (ver Descartes).

---

## Cambio 4 — `src/pages/los-espacios/[slug].astro`: reescritura completa (CRÍTICO)

Reemplazar el archivo entero por:

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import Container from '../../components/Container.astro';
import Button from '../../components/Button.astro';
import { ESPACIOS, CONTACT, TIPO_LABEL, ICONOS_GRUPO } from '../../lib/site';
import { breadcrumbSchema } from '../../lib/schema';

export async function getStaticPaths() {
  return ESPACIOS.map((espacio) => ({
    params: { slug: espacio.id },
    props: { espacio },
  }));
}

const { espacio } = Astro.props;

// Sugerir primero los del mismo grupo de uso, completar con el resto.
const otros = [
  ...ESPACIOS.filter((e) => e.id !== espacio.id && e.grupo === espacio.grupo),
  ...ESPACIOS.filter((e) => e.id !== espacio.id && e.grupo !== espacio.grupo),
].slice(0, 3);

const esArcos = espacio.id === 'sala-arcos';

const schemaBreadcrumb = breadcrumbSchema([
  { name: 'Inicio', url: '/' },
  { name: 'Los espacios', url: '/los-espacios' },
  { name: espacio.nombre, url: `/los-espacios/${espacio.id}` },
]);

// Schema.org Product para que Google entienda cada espacio como una "oferta".
const schemaProduct = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: `${espacio.nombre} — Espacio 1010`,
  description: espacio.resumen,
  brand: { '@type': 'Brand', name: 'Espacio 1010' },
  category: 'Alquiler de consultorio por hora',
  offers: {
    '@type': 'Offer',
    availability: 'https://schema.org/InStock',
    url: `https://www.espacio1010.uy/los-espacios/${espacio.id}`,
    priceCurrency: 'UYU',
    price: String(espacio.precioHora),
    // TODO: revisar antes de 2027 — si el precio sigue, correr la fecha.
    priceValidUntil: '2026-12-31',
  },
};

const metaDescription = esArcos
  ? `Sala Arcos en Espacio 1010 — ${espacio.resumen} Capacidad: hasta 25 personas sentadas. Se coordina directo por WhatsApp. En Gaboto 1010, entre Palermo y Parque Rodó, Montevideo.`
  : `${espacio.nombre} en Espacio 1010 — ${espacio.resumen} Capacidad: ${espacio.capacidad}. Reservá por hora desde la app, todos los días de 7 a 24, en Gaboto 1010, entre Palermo y Parque Rodó, Montevideo.`;

const incluye = [
  { titulo: 'Wifi en todo el edificio', desc: 'Conexión estable para trabajar tranquilo.' },
  { titulo: 'Aire acondicionado', desc: 'Frío y calor, individual en cada espacio.' },
  { titulo: 'Comedor y sala de estar', desc: 'En el piso 1, exclusivo para profesionales, sin cargo.' },
  { titulo: 'Acceso con código personal', desc: 'Todos los días, de 7 a 24 h — sin coordinar con nadie.' },
  { titulo: 'Reservas desde 1 hora', desc: 'Sin mínimo ni compromiso: reservás solo lo que usás.' },
  { titulo: 'Estacionamiento NO tarifado', desc: 'En la zona — y bien conectado en bus.' },
];
---

<BaseLayout
  title={espacio.nombre}
  description={metaDescription}
  ogSlug={espacio.id}
>
  <Fragment slot="head">
    <script is:inline type="application/ld+json" set:html={JSON.stringify(schemaProduct)} />
    <script is:inline type="application/ld+json" set:html={JSON.stringify(schemaBreadcrumb)} />
  </Fragment>

  <!-- ════════════════════ HERO DEL ESPACIO ════════════════════ -->
  <section class="bg-white pt-12 pb-12 sm:pt-16 sm:pb-16">
    <Container size="wide">
      <nav aria-label="Migas de pan" class="mb-8 text-sm text-ink-muted">
        <a href="/" class="hover:text-terracota">Inicio</a>
        <span class="mx-2">/</span>
        <a href="/los-espacios" class="hover:text-terracota">Los espacios</a>
        <span class="mx-2">/</span>
        <span class="text-ink">{espacio.nombre}</span>
      </nav>

      <div class="grid gap-10 md:grid-cols-12 md:items-center lg:gap-12">
        <!-- Visual: foto real si existe, tratamiento tipográfico si no -->
        <div class="md:col-span-6">
          {espacio.foto ? (
            <div class="relative overflow-hidden rounded-[var(--radius-xl)] border border-hairline">
              <img
                src={espacio.foto}
                alt={espacio.fotoAlt}
                class="aspect-[4/3] w-full object-cover"
                fetchpriority="high"
                decoding="async"
              />
              <span class="absolute left-5 top-5 inline-flex w-fit items-center rounded-full bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
                {TIPO_LABEL[espacio.tipo]}
              </span>
            </div>
          ) : (
            <div class="relative flex aspect-[4/3] flex-col items-center justify-center overflow-hidden rounded-[var(--radius-xl)] border border-hairline bg-[#f8f9fa]">
              <span class="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-terracota-tint text-terracota">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" set:html={ICONOS_GRUPO[espacio.grupo]} />
              </span>
              <span class="mt-6 font-display text-7xl font-bold leading-none text-ink">
                {espacio.metros}<span class="ml-1 align-top text-2xl font-medium text-ink-muted">m²</span>
              </span>
              <span class="mt-3 text-[11px] uppercase tracking-[0.28em] text-ink-muted">{espacio.nombre}</span>

              <span class="absolute left-5 top-5 inline-flex w-fit items-center rounded-full bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
                {TIPO_LABEL[espacio.tipo]}
              </span>
            </div>
          )}
          {!espacio.foto && (
            <p class="mt-3 text-center text-sm text-ink-muted">Fotos reales de este espacio, muy pronto.</p>
          )}
        </div>

        <!-- Info -->
        <div class="md:col-span-6">
          <p class="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-terracota">
            {TIPO_LABEL[espacio.tipo]} · {espacio.piso}
          </p>
          <h1 class="text-balance text-ink">{espacio.nombre}</h1>
          <p class="mt-5 text-lg leading-relaxed text-ink-soft text-pretty">
            {espacio.resumen}
          </p>

          <dl class="mt-8 grid grid-cols-3 gap-6 border-y border-hairline py-6">
            <div>
              <dt class="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
                Capacidad
              </dt>
              <dd class="mt-1.5 text-xl font-semibold text-ink">{espacio.capacidad}</dd>
            </div>
            <div>
              <dt class="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
                Superficie
              </dt>
              <dd class="mt-1.5 text-xl font-semibold text-ink">{espacio.metros} m²</dd>
            </div>
            <div>
              <dt class="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
                Precio
              </dt>
              <dd class="mt-1.5 text-xl font-semibold text-terracota">${espacio.precioHora}<span class="text-sm font-normal text-ink-muted"> / h</span></dd>
            </div>
          </dl>

          <div class="mt-8">
            <h2 class="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
              Ideal para
            </h2>
            <ul class="mt-3 flex flex-wrap gap-2">
              {espacio.ideal.map((i) => (
                <li class="rounded-full border border-terracota/20 bg-terracota-tint/60 px-3 py-1 text-xs font-medium text-terracota-dark">
                  {i}
                </li>
              ))}
            </ul>
          </div>

          <div class="mt-10 flex flex-col gap-3 sm:flex-row">
            {esArcos ? (
              <Button
                href={CONTACT.whatsappLink('Hola! Quiero consultar por la Sala Arcos para un taller/encuentro.')}
                variant="primary"
                size="lg"
                target="_blank"
              >
                Consultar por WhatsApp
              </Button>
            ) : (
              <Button href="/#registro" variant="primary" size="lg">
                Quiero mi primera hora gratis
              </Button>
            )}
            <Button href="/los-espacios" variant="ghost" size="lg">
              Ver los otros espacios
            </Button>
          </div>
          {esArcos && (
            <p class="mt-3 text-sm text-ink-muted">
              La Sala Arcos no se reserva por la app: la coordinamos directo con vos.
            </p>
          )}
        </div>
      </div>
    </Container>
  </section>

  <!-- ════════════════════ QUÉ INCLUYE ════════════════════ -->
  <section class="bg-[#f8f9fa] py-16 sm:py-24">
    <Container>
      <h2 class="text-2xl text-ink sm:text-3xl">Qué viene incluido</h2>
      <p class="mt-3 max-w-xl text-ink-soft">
        Cada reserva en {espacio.nombre} incluye sin costo extra los siguientes
        servicios y comodidades del edificio.
      </p>

      <div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {incluye.map((item) => (
          <div class="rounded-2xl border border-hairline bg-white p-6">
            <span class="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-terracota-tint text-terracota">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12l5 5L20 7" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
            <h3 class="text-lg text-ink">{item.titulo}</h3>
            <p class="mt-1.5 text-sm leading-relaxed text-ink-soft">{item.desc}</p>
          </div>
        ))}
      </div>
    </Container>
  </section>

  <!-- ════════════════════ OTROS ESPACIOS ════════════════════ -->
  <section class="bg-white py-16 sm:py-24">
    <Container size="wide">
      <h2 class="text-2xl text-ink sm:text-3xl">Otros espacios que podrían servirte</h2>
      <div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {otros.map((e) => (
          <a
            href={`/los-espacios/${e.id}`}
            class="group flex flex-col rounded-2xl border border-hairline bg-[#f8f9fa] p-6 transition-all duration-500 hover:-translate-y-1 hover:border-terracota/30 hover:shadow-[var(--shadow-md)]"
          >
            <div class="flex items-start justify-between">
              <span class="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-terracota-tint text-terracota">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" set:html={ICONOS_GRUPO[e.grupo]} />
              </span>
              <span class="rounded-full bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-soft">{e.metros} m²</span>
            </div>
            <h3 class="mt-5 text-lg text-ink">{e.nombre}</h3>
            <p class="mt-1.5 text-sm leading-relaxed text-ink-soft">{e.resumen}</p>
            <div class="mt-auto flex items-center justify-between border-t border-hairline pt-4 text-xs text-ink-muted">
              <span>{e.capacidadBreve}</span>
              <span class="text-sm font-semibold text-terracota">${e.precioHora} <span class="font-normal text-ink-muted">/ h</span></span>
            </div>
          </a>
        ))}
      </div>
    </Container>
  </section>
</BaseLayout>
```

Notas:
- `ogSlug={espacio.id}` (sin prefijo): elimina el doble `espacio-espacio-01` — requiere el
  Cambio 6 en `og/[slug].ts` (keys = `e.id`). Los ids (`espacio-01`…`sala-arcos`) no chocan con
  ninguna key de página.
- El badge "Destacado" del hero actual se elimina (era marketing interno sin significado para
  el usuario; `destacado` queda solo como filtro de /alquiler-consultorio-montevideo).
- La nota bajo el visual («Fotos reales de este espacio, muy pronto.») solo aparece cuando NO
  hay foto (todos menos Sala Arcos).

---

## Cambio 5 — `src/components/EspacioCard.astro` (lo usa /para/[slug])

Reemplazar el frontmatter (líneas 1–19) por:

```astro
---
import type { Espacio } from '../lib/site';
import { TIPO_LABEL } from '../lib/site';

interface Props {
  espacio: Espacio;
  /** Si true, resalta la card (borde terracota). */
  featured?: boolean;
}

const { espacio, featured = false } = Astro.props;
---
```

Y en el markup:
- Línea 30: `{amuebladoLabel}` → `{TIPO_LABEL[espacio.tipo]}`
- Línea 38: `{espacio.capacidad} · <span ...>${precio}/h</span>` →
  `{espacio.capacidadBreve} · <span class="font-semibold text-terracota">${espacio.precioHora}/h</span>`

El resto del componente queda igual.

---

## Cambio 6 — `src/pages/og/[slug].ts`: keys nuevas + sin "12 espacios"

### 6a. Entrada `'los-espacios'` (líneas 25–28):

```ts
  'los-espacios': {
    title: 'Consultorios y salas.\nUna sola filosofía.',
    description: 'Conocé los espacios de Espacio 1010',
  },
```

### 6b. Entrada `'alquiler-consultorio-montevideo'` (líneas 49–52):

```ts
  'alquiler-consultorio-montevideo': {
    title: 'Alquiler de consultorio\npor hora en Montevideo.',
    description: 'Consultorios y salas en Parque Rodó · A 5 cuadras de 18 de Julio',
  },
```

### 6c. Bloque auto-generado de espacios (líneas 54–63):

```ts
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
```

---

## Cambio 7 — `vercel.json`: redirects 301 para los 12 slugs viejos (CRÍTICO, SEO)

Las URLs viejas ya están indexables (sitemap en producción). Reemplazar el array `"redirects"`
por:

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

Criterio: 1:1 cuando hay equivalente real claro (sala-subsuelo ES la Sala Arcos; los "salones"
eran los multiuso; los "estudios" mapean a los amueblados más parecidos); al índice cuando no
lo hay (las 7 "consultas" inventadas). El sitemap se regenera solo desde `getStaticPaths`.

---

## Verificación (antes de pushear)

1. `npm run build` — TypeScript va a atrapar cualquier `EspacioId` viejo que quede colgado
   (revisar especialmente `nichos.ts` y `para/[slug].astro`).
2. Confirmar en `dist/` que existen `/los-espacios/espacio-01/index.html` …
   `/los-espacios/sala-arcos/index.html` y que NO existen los slugs viejos.
3. Confirmar que se generan los OG: `dist/og/espacio-01.png` … `dist/og/sala-arcos.png`.
4. Vista rápida de /los-espacios, /los-espacios/sala-arcos (foto) y /para/psicologos (cards).

---

## Propuestas del auditor DESCARTADAS (y por qué)

- **#4 ítem "Limpieza y mantenimiento" en "Qué viene incluido"**: descartado por esta noche — el
  propio auditor lo marca como no confirmado; se usa su reemplazo seguro («Reservas desde
  1 hora») y queda flag a Rafa para reincorporarlo si es real.
- **"Wifi de fibra"** (audit #4 y OG): descartado el "de fibra" — sin respaldo en la fuente de
  verdad; coherente con la misma decisión de spec-el-lugar. Queda «Wifi en todo el edificio».
- **#21 variante de intro sin mencionar los $700 de la Sala Arcos**: descartada — el usuario
  real merece el precio completo arriba; se usa la variante con ambos precios.
- **#26 refactor del índice para usar `EspacioCard` y des-duplicar markup**: descartado — riesgo
  de regresión visual en producción de madrugada sin valor para el usuario; queda como mejora
  futura.
- **Badge "Destacado" en el hero de la ficha**: eliminado en vez de migrarlo — no comunica nada
  al usuario; `destacado` queda solo como dato para /alquiler-consultorio-montevideo.
- **#17 "centralizar el mapa de íconos en un helper"**: aceptado pero resuelto en `site.ts`
  (`ICONOS_GRUPO`) y no en un archivo nuevo — menos piezas.
- **Cambiar copy/meta de `nichos.ts` y `alquiler-consultorio-montevideo.astro`** más allá de los
  IDs y la OG: fuera de alcance — pertenecen a las specs de nichos y seo-consultorio (se flaggea
  abajo lo que queda inconsistente).
- **Corregir `schema.ts` (LocalBusiness 00:00–23:59, paymentAccepted con tarjeta)**: fuera de
  alcance de esta spec (archivo compartido sitewide, también flaggeado por spec-misc) — va a
  contradicciones.

---

## Contradicciones / pendientes para Rafa (revisar mañana)

1. **El JSON del panel de 3 lentes nunca llegó al sintetizador** (placeholder `${JSON}` sin
   sustituir en la orquestación — tercer caso de la noche). Esta spec se basa en auditoría +
   fuente de verdad + criterio; re-pasar las objeciones del panel contra esta spec si existen.
2. **9 vs 12 espacios sigue abierta**: la home dice "12" y NO se tocó; esta spec publica
   8 fichas (7 activos + Sala Arcos). Mientras conviva, la home y /los-espacios cuentan
   distinto — decidir el número canónico.
3. **`SITE.description` cambia el footer visible de TODAS las páginas, incluida la home**
   (Footer.astro la renderiza). No se tocó `index.astro`, pero el footer de la home va a decir
   "todos los días de 7 a 24" en vez de "24/7". El dato viejo era falso; confirmar que está OK.
4. **`schema.ts` sigue emitiendo datos falsos sitewide**: LocalBusiness con horario 00:00–23:59
   y `paymentAccepted: 'Cash, Credit Card, Bank Transfer'` (no se acepta tarjeta; es
   transferencia BROU o Abitab/RedPagos). Huérfano también según spec-misc — asignarlo.
5. **¿La limpieza está incluida?** Si Rafa confirma, agregar a `incluye` de la ficha el ítem
   «Limpieza y mantenimiento — el espacio listo cuando llegás».
6. **Espacios 04 y 15 quedan OMITIDOS** del sitio (inactivos/placeholder en DB). Confirmar que
   no se quieren como "próximamente"; sumarlos al array cuando estén terminados.
7. **Nombres utilitarios** ("Espacio 01"): la web ahora replica los nombres reales de la app.
   Si Rafa quiere nombres con marca, se cambia en la app primero (la app manda) y la web copia.
8. **`nichos.ts` sigue con copy ficticio** (divan, música ambiente, "60 m²", "30 personas",
   "12 espacios premium" en metas, reserva "por día completo", armarios reservados, recepción
   de grupos por personal del edificio): esta spec solo remapeó los IDs para no romper el
   build. Verificar que la spec de nichos lo cubra; si no, es la página con más promesas falsas
   que queda viva.
9. **`alquiler-consultorio-montevideo.astro` dice "12 espacios" y "24/7"** en schema, meta y
   hero: fuera de alcance acá (solo se corrigió su imagen OG). Verificar que la spec de
   seo-consultorio lo cubra.
10. **Sala Arcos con Offer `InStock` en Schema.org** apuntando a su URL pública aunque se vende
    por WhatsApp: se mantuvo (el precio $700 es real y la página existe). Si molesta, cambiar a
    contacto.
11. **Coordinación con spec-el-lugar**: ambas tocan `src/lib/site.ts` (esta: ESPACIOS, SITE,
    HOURS, DIFERENCIALES; aquella: AMENITIES). No se pisan, pero aplicarlas con cuidado en el
    mismo archivo.
12. **Cupón BIENVENIDA1010 con `cupo_reservas_por_usuario = null`** (heredado de la fuente de
    verdad): verificar en la app que el 100% aplique a UNA sola reserva antes de seguir
    prometiendo "primera hora gratis" en todos los CTAs.
