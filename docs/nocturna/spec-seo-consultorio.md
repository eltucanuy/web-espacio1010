# SPEC FINAL — /alquiler-consultorio-montevideo

**Fecha:** 2026-06-10 (sesión nocturna) · **Sintetizador:** subagente `seo-consultorio`
**Insumos:** `docs/nocturna/audit-seo-consultorio.md` + `docs/VERDAD_APP_2026_06_10.md`, verificados contra el código real.
**⚠️ Nota de proceso:** el JSON con los veredictos del panel de 3 lentes llegó VACÍO (placeholder `${JSON}` sin sustituir en el prompt del orquestador — mismo incidente que en spec-precios y spec-misc). Esta spec se sintetizó con el informe del auditor re-verificado línea por línea contra el código y la fuente de verdad. Si el panel objetó algo, NO está incorporado — revisar mañana.

**Criterio aplicado:** usuario real > SEO > estética; la fuente de verdad gana siempre en datos. Español rioplatense (vos), sin "boutique/insonorizado/Cordón", "sin compromiso" (no "sin permanencia"), CTA primario `/#registro` con primera hora gratis, sin "12 espacios" ni "24/7" en subpáginas.

**Archivos a tocar:** `src/pages/alquiler-consultorio-montevideo.astro` (cambios 1–9), `src/pages/og/[slug].ts` (cambio 10), `src/components/Footer.astro` (cambio 11). **NO tocar** `src/pages/index.astro` ni `src/lib/site.ts` ni `src/lib/schema.ts`.

---

## Cambio 1 — Frontmatter: fuera ESPACIOS ficticios, schema Service real, FAQ nueva [CRÍTICO]

**Archivo:** `src/pages/alquiler-consultorio-montevideo.astro` (líneas 1–33).

1a. Línea 5 — quitar `ESPACIOS` del import (queda):

```astro
import { NICHOS, SITE, ADDRESS } from '../lib/site';
```

1b. Línea 10 — reemplazar `const destacados = ESPACIOS.filter((e) => e.destacado);` por el array local con espacios REALES de la DB (Estudio Norte, Salón Cobre y la Sala Arcos de 60 m² del filter actual son ficticios):

```ts
// Espacios reales (DB de producción, VERDAD_APP_2026_06_10).
// Linkean al índice porque las fichas reales por espacio todavía no existen.
const destacados = [
  {
    nombre: 'Espacio 01 · planta baja',
    resumen: 'A la calle, cálido. Sillón de 3 cuerpos y butaca individual, ideal para sesiones uno a uno.',
    capacidad: 'Hasta 4 personas',
    metros: 13,
    tag: 'Amueblado',
  },
  {
    nombre: 'Espacio 13 · con camilla',
    resumen: 'Equipado con camilla para masajes, reflexología y tratamientos corporales. Con escritorio.',
    capacidad: '2 personas',
    metros: 11,
    tag: 'Con camilla',
  },
  {
    nombre: 'Espacio 14 · multiuso',
    resumen: 'Amplio y despejado, con almohadones y colchonetas. Para movimiento, meditación y grupos chicos.',
    capacidad: 'Hasta 8 personas',
    metros: 16,
    tag: 'Multiuso',
  },
];
```

1c. Líneas 17–32 — reemplazar TODO el `schemaService` por (conecta al LocalBusiness `#business` que ya emite BaseLayout vía `schema.ts:35`, suma `offers` y saca "12 espacios premium… 24/7"):

```ts
// Schema Service específico para esta página geo, colgado del LocalBusiness global.
const schemaService = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Alquiler de consultorio por hora',
  provider: { '@id': `${SITE.url}/#business` },
  areaServed: [
    { '@type': 'City', name: 'Montevideo' },
    { '@type': 'Place', name: 'Parque Rodó' },
    { '@type': 'Place', name: 'Palermo' },
  ],
  offers: {
    '@type': 'Offer',
    price: PRECIO_HORA,
    priceCurrency: 'UYU',
    description: 'Por hora, sin compromiso. Descuentos por volumen mensual.',
  },
  description:
    'Alquiler de consultorios y salas por hora en Montevideo, entre Palermo y Parque Rodó. Reserva online, acceso con código todos los días de 7 a 24 h, sin alquiler fijo.',
  url: `${SITE.url}/alquiler-consultorio-montevideo`,
};
```

1d. Después del `schemaService` — agregar las FAQ y su schema (se usan en el cambio 7):

```ts
// Mini-FAQ long-tail (reemplaza la lista pelada de keywords). Datos: VERDAD_APP.
const faqs = [
  {
    q: '¿Cuánto cuesta alquilar un consultorio por hora en Montevideo?',
    a: 'En Espacio 1010, $350 la hora en todos los consultorios y salas, sin matrícula ni gastos fijos. Si sumás 20 horas o más en el mes tenés 10% de descuento; con 40 o más, 20%. La Sala Arcos, para grupos y talleres, sale $700 la hora.',
  },
  {
    q: '¿Puedo alquilar por hora suelta, sin contrato?',
    a: 'Sí. Reservás desde 1 hora, solo cuando la necesitás, sin compromiso. Y si preferís un horario fijo semanal —mismo espacio, mismo día y hora—, también podés.',
  },
  {
    q: '¿En qué horarios puedo atender?',
    a: 'Todos los días, de 7 a 24 h. Reservás online y entrás con tu código personal, sin depender de nadie.',
  },
  {
    q: '¿Qué pasa si tengo que cancelar?',
    a: 'Avisando con más de 24 horas no pagás nada. Entre 24 y 1 hora antes, pagás la mitad. Con menos de 1 hora ya no se puede cancelar.',
  },
  {
    q: '¿Para qué profesionales sirve?',
    a: 'Psicología, psiquiatría, nutrición, terapias corporales (hay un espacio con camilla), psicopedagogía, fonoaudiología, coaching, talleres y grupos, entre otros. Si atendés personas, hay un espacio para vos.',
  },
];

const schemaFaq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};
```

## Cambio 2 — Meta description sin "12" ni "24/7" (línea 37) [MEDIO]

Reemplazar el valor de `description` del `<BaseLayout>` por (texto EXACTO, ~146 caracteres; el `title` de la línea 36 NO se toca):

```
Alquilá consultorio por hora en Montevideo desde $350, entre Palermo y Parque Rodó. Sin alquiler fijo. Pre-registrate: tu primera hora es gratis.
```

## Cambio 3 — Head: emitir el schema FAQ (líneas 40–43)

Dentro del `<Fragment slot="head">`, agregar una tercera línea junto a las dos existentes:

```astro
<script is:inline type="application/ld+json" set:html={JSON.stringify(schemaFaq)} />
```

## Cambio 4 — Hero: badge de pre-lanzamiento, copy real y CTA al pre-registro (líneas 46–72) [CRÍTICO]

4a. Insertar el badge de pre-lanzamiento INMEDIATAMENTE ANTES del eyebrow de la línea 48 (mismo patrón visual que la home, adaptado a fondo claro; el eyebrow se mantiene tal cual):

```astro
<p class="mb-5 inline-flex items-center gap-2 rounded-full border border-terracota/25 bg-terracota-tint px-4 py-2 text-xs font-medium text-terracota">
  <span class="relative flex h-2 w-2">
    <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-terracota opacity-50"></span>
    <span class="relative inline-flex h-2 w-2 rounded-full bg-terracota"></span>
  </span>
  Pre-lanzamiento · ¡muy pronto!
</p>
```

4b. Reemplazar el `<p>` de la bajada (líneas 56–61) por (texto EXACTO; saca "12 espacios premium", "a pasos de 18 de Julio" y "24/7"):

```astro
<p class="mt-7 max-w-2xl text-lg leading-relaxed text-ink-soft text-pretty">
  Consultorios y salas en {ADDRESS.street}, {ADDRESS.betweenStreets}, en el límite
  de Palermo y Parque Rodó. Desde ${PRECIO_HORA} la hora. Reservás online, entrás
  con tu código personal todos los días de 7 a 24 h y cancelás gratis hasta 24 horas
  antes. Para profesionales de la salud, el bienestar y la educación.
</p>
```

4c. Reemplazar el bloque de CTAs (líneas 63–70) por (CTA primario → `/#registro`, fuera `SITE.agendaUrl`; más línea de oferta debajo):

```astro
<div data-reveal data-reveal-delay="200" class="mt-10 flex flex-col gap-3 sm:flex-row">
  <Button href="/#registro" variant="primary" size="lg" class="btn-primary-glow">
    Quiero mi primera hora gratis
  </Button>
  <Button href="/los-espacios" variant="ghost" size="lg">
    Ver consultorios y salas
  </Button>
</div>
<p class="mt-4 text-sm text-ink-muted">
  Abrimos en junio 2026 · Pre-registrate hoy y tu primera hora queda gratis para usarla durante 2026.
</p>
```

## Cambio 5 — Ubicación: claims verificables y foto real (líneas 85–129) [ALTO]

5a. Reemplazar el `<p>` de las líneas 85–90 por (saca "facultad de medicina" —no queda en esta zona—, "hospitales privados" no verificable y "Tus pacientes"):

```astro
<p class="mt-5 text-lg leading-relaxed text-ink-soft text-pretty">
  La zona entre Palermo y Parque Rodó es de las más cómodas de Montevideo para
  atender: cerca del Centro, del Parque Rodó y de la rambla, con calles tranquilas
  y llegada fácil en bus, en auto o caminando. Las personas que atendés llegan sin vueltas.
</p>
```

5b. En la lista de bullets (líneas 92–117), cambiar SOLO el texto de los dos primeros `<li>` (el resto del markup y los bullets 3 y 4 quedan igual):

- `A 5 cuadras de 18 de Julio` → `A minutos del Centro y de 18 de Julio`
- `A 2 cuadras de líneas troncales (101, 103, CA1)` → `Bien conectado en bus desde toda la ciudad`

5c. Reemplazar el `div` placeholder del "mapa" (líneas 120–129) por la foto real (suma imagen indexable con alt geo-relevante):

```astro
<figure class="relative aspect-[5/6] overflow-hidden rounded-2xl shadow-[var(--shadow-md)]">
  <img
    src="/fotos/lugar-fachada.webp"
    alt="Fachada reciclada del edificio de Espacio 1010 en Gaboto 1010, entre Palermo y Parque Rodó, Montevideo"
    loading="lazy"
    decoding="async"
    class="h-full w-full object-cover"
  />
  <figcaption class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 to-transparent p-5 text-sm text-white">
    Gaboto 1010 · entre Isla de Flores y San Salvador
  </figcaption>
</figure>
```

## Cambio 6 — Espacios destacados: sin prueba social inventada, cards reales (líneas 134–174) [CRÍTICO]

6a. Línea 137 — `<h2 class="text-3xl text-ink">Espacios más elegidos en Montevideo.</h2>` → (nada fue "elegido" todavía: el local no abrió):

```astro
<h2 class="text-3xl text-ink">Espacios para cada forma de atender.</h2>
```

La bajada (líneas 138–140) se mantiene tal cual.

6b. Reemplazar el render de cards (líneas 143–166) por (consume el array nuevo del cambio 1b; `href` al índice, tag directo en vez del ternario de `amueblado`):

```astro
{destacados.map((e) => (
  <a
    href="/los-espacios"
    class="group flex flex-col rounded-2xl border border-hairline bg-white p-6 transition-all duration-500 hover:-translate-y-1 hover:border-terracota/30 hover:shadow-[var(--shadow-md)]"
  >
    <div class="flex items-center justify-between">
      <span class="text-4xl font-bold text-terracota/20">{e.metros}m²</span>
      <span class="inline-flex items-center rounded-full bg-[#f8f9fa] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
        {e.tag}
      </span>
    </div>
    <h3 class="mt-5 text-lg text-ink">{e.nombre}</h3>
    <p class="mt-2 text-sm leading-relaxed text-ink-soft">{e.resumen}</p>
    <div class="mt-auto flex items-center justify-between pt-6 text-xs text-ink-muted">
      <span>{e.capacidad}</span>
      <span class="inline-flex items-center gap-1 font-medium text-terracota transition-transform duration-300 group-hover:translate-x-0.5">
        Ver los espacios
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M5 12h14M12 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </span>
    </div>
  </a>
))}
```

6c. Línea 171 — texto del botón `Ver los 12 espacios` → `Conocé todos los espacios` (href `/los-espacios` se mantiene).

## Cambio 7 — "También buscan por" → mini-FAQ útil (líneas 203–233) [MEDIO]

Reemplazar la sección COMPLETA (las 10 pills de keywords son señal de stuffing y contenido cero) por:

```astro
<!-- Preguntas frecuentes long-tail -->
<section class="py-16">
  <Container size="narrow">
    <p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-terracota">
      Preguntas frecuentes
    </p>
    <h2 class="mt-3 text-2xl text-ink">
      Lo que se preguntan antes de reservar.
    </h2>
    <div class="mt-8 space-y-8">
      {faqs.map((f) => (
        <div>
          <h3 class="text-lg text-ink">{f.q}</h3>
          <p class="mt-2 leading-relaxed text-ink-soft">{f.a}</p>
        </div>
      ))}
    </div>
  </Container>
</section>
```

## Cambio 8 — CTA final → pre-registro (líneas 235–250) [CRÍTICO]

Dentro del bloque oscuro, reemplazar bajada y botón (el H2 `¿Probamos?` se mantiene; saca "la agenda real de Montevideo" —frase sin sentido y la agenda está vacía en pre-apertura— y el link a `SITE.agendaUrl`):

```astro
<h2 class="text-balance text-crema">¿Probamos?</h2>
<p class="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-crema/85">
  Pre-registrarte es gratis y sin compromiso: te guardamos tu primera hora gratis
  para usarla cuando quieras durante 2026.
</p>
<div class="mt-8">
  <Button href="/#registro" variant="primary" size="lg" class="bg-white text-terracota hover:bg-white/90">
    Quiero mi primera hora gratis
  </Button>
</div>
```

## Cambio 9 — Limpieza final de la página

Verificar que en `alquiler-consultorio-montevideo.astro` no quede NINGUNA ocurrencia de: `SITE.agendaUrl`, `12 espacios`, `24/7`, `premium`, `Tus pacientes`, `más elegidos`, `5 cuadras`, `101, 103, CA1`, `facultad de medicina`, `ESPACIOS`.

## Cambio 10 — OG image: descripción sin datos viejos [MEDIO]

**Archivo:** `src/pages/og/[slug].ts` (línea 51). Reemplazar la `description` de la entrada `'alquiler-consultorio-montevideo'` por (el `title` se mantiene):

```
Consultorios y salas por hora · Palermo / Parque Rodó · Desde $350
```

## Cambio 11 — Des-huérfana: link desde el Footer [ALTO]

**Archivo:** `src/components/Footer.astro`. En la columna "Para profesionales", agregar DESPUÉS del cierre del map de `NICHOS` (entre las líneas 54 y 55, dentro del mismo `<ul>`):

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

(El Footer es compartido por todas las páginas vía BaseLayout — un solo cambio des-huérfana la página en todo el sitio. Ninguna otra spec de esta noche toca `Footer.astro`; verificado contra spec-precios, spec-misc y spec-el-lugar.)

---

## Propuestas DESCARTADAS (y por qué)

1. **Breadcrumb visible o quitar el BreadcrumbList (hallazgo 14):** se deja todo como está — riesgo SEO casi nulo según el propio auditor, y un breadcrumb visible agrega ruido en una landing de conversión.
2. **Conservar la pill list de keywords "reducida como texto de cierre" (opción del hallazgo 10):** keyword stuffing residual sin valor para el usuario; la FAQ ya cubre las mismas queries con contenido genuino.
3. **Links contextuales hacia esta página desde `/precios` y `/los-espacios` (parte del hallazgo 7):** esas páginas tienen spec propia esta noche; editarlas desde dos specs genera conflictos. El Footer alcanza para des-huérfanarla; el resto pasa a coordinación (contradicción 5).
4. **Fix de `site.ts`/`schema.ts` (hallazgo 16):** transversal, explícitamente fuera de alcance del propio auditor. Esta spec elimina la dependencia de `ESPACIOS`; el resto queda flaggeado (contradicción 4).
5. **Alt de la foto con "iluminada de noche" (hallazgo 11, copy del auditor):** no consta que `lugar-fachada.webp` sea la toma nocturna (la nocturna es `fachada-final.webp`, que es el hero de la home) — el alt va sin hora del día.
6. **WhatsApp como botón secundario en los CTAs:** ya existe el botón flotante global (FloatingWhatsApp); duplicarlo compite con el CTA primario (criterio del auditor, compartido).
7. **"cancelás gratis avisando con 24 horas" (copy del hero del auditor):** ambiguo — se usa "cancelás gratis hasta 24 horas antes", la fórmula exacta que ya usa la home.
8. **Veredictos del panel:** no se pudo aceptar ni descartar ninguno — el JSON llegó vacío (contradicción 1).

---

## Contradicciones / pendientes para Rafa (revisar mañana, NO bloquean la spec)

1. **El JSON del panel de 3 lentes llegó sin sustituir (`${JSON}` literal) al sintetizador** — tercer caso confirmado esta noche (también en spec-precios y spec-misc). Revisar el orquestador; si el panel objetó algo material, segunda pasada sobre esta spec.
2. **Claims de ubicación eliminados por no verificables:** "a 5 cuadras de 18 de Julio", "líneas 101, 103, CA1" y "comparte zona con clínicas, hospitales privados y la facultad de medicina" (la Facultad de Medicina no queda en esta zona). Si Rafa confirma distancias o líneas de bus reales, pueden volver con números exactos.
3. **Cards destacadas linkean al índice `/los-espacios`:** las fichas reales por espacio no existen todavía (las actuales `/los-espacios/{id}` son ficticias). Cuando la spec de `/los-espacios` cree fichas reales, actualizar los `href` a las fichas de Espacio 01, 13 y 14.
4. **`site.ts`/`schema.ts` siguen emitiendo datos falsos en todo el sitio** (ESPACIOS ficticios, `openingHours '24/7'`, `paymentAccepted` con tarjeta que la app no acepta, "los 12 espacios" en DIFERENCIALES, "Sala de cowork"). Esta página deja de consumir `ESPACIOS`, pero el fix único transversal sigue pendiente — asegurarse de que alguna spec lo tome (ya flaggeado también por spec-misc).
5. **Coordinar links contextuales** hacia `/alquiler-consultorio-montevideo` desde `/precios` y `/los-espacios` cuando esas páginas estén corregidas (no incluidos acá para evitar conflictos entre specs).
6. **FAQPage duplicada a nivel de sitio:** `/precios` también emite schema FAQPage con una pregunta de precio parecida. El wording difiere y Google lo admite por página, pero si se quiere afinar, diferenciar más las preguntas.
7. **Discrepancia 9/12 espacios sigue abierta** (home y OG de `/los-espacios` dicen "12"): esta spec solo la esquiva, no la resuelve.
