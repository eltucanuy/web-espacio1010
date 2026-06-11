# SPEC FINAL — /contacto (sesión nocturna 2026-06-10)

**Sintetiza:** `docs/nocturna/audit-contacto.md` + veredicto del panel de 3 lentes.
**Criterio de desempate aplicado:** usuario real > SEO > preferencias estéticas; la fuente de verdad (`docs/VERDAD_APP_2026_06_10.md`) gana siempre en datos.

> ⚠️ **Nota de proceso:** el JSON con los veredictos del panel llegó vacío al sintetizador
> (placeholder sin sustituir). Esta spec resuelve los hallazgos del auditor aplicando los
> criterios de desempate acordados. Si el panel dejó objeciones en otro archivo, revisarlas
> contra esta spec antes de implementar.

**Archivos a tocar:** `src/pages/contacto.astro`, `src/components/ContactForm.tsx`, `src/lib/schema.ts` (compartido — afecta a todo el sitio, cambios solo de datos), `src/pages/og/[slug].ts` (1 línea).
**Archivos que NO se tocan:** `src/pages/index.astro` (prohibido), `src/lib/site.ts` (solo deudas anotadas para Rafa).

---

## Cambios (en orden de implementación)

### 1. [CRÍTICO] CTA de pre-registro como primera card del aside

**Archivo:** `src/pages/contacto.astro` — insertar como PRIMERA card dentro del `div.sticky` del aside (antes de "WhatsApp directo", línea ~53).

Card destacada (única del aside con acento terracota) con este contenido EXACTO:

```html
<div class="rounded-2xl border border-terracota/30 bg-terracota/[0.06] p-7">
  <h3 class="font-display text-xl text-ink">¿Todavía no te pre-registraste?</h3>
  <p class="mt-2 text-sm leading-relaxed text-ink-soft">
    Es gratis, sin tarjeta y sin compromiso: te guardamos tu primera hora
    gratis para usarla cuando quieras durante 2026.
  </p>
  <a
    href="/#registro"
    class="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-terracota px-6 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-terracota-dark hover:shadow-[0_12px_32px_-8px_rgba(158,78,66,0.45)]"
  >
    Quiero mi primera hora gratis
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M5 12h14M12 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </a>
</div>
```

Razón: estrategia de CTAs de la fuente de verdad — el CTA primario de TODAS las páginas es el pre-registro. WhatsApp (form) queda como secundario, que en esta página sigue siendo el protagonista del lado izquierdo.

### 2. [ALTO] Horario de atención humana: coherente y visible

**2a. Meta description** — `src/pages/contacto.astro:13`, reemplazar por:

```
Coordiná visita, resolvé dudas o pedí info sobre precios y disponibilidad. Te respondemos por WhatsApp de lunes a sábado, de 9 a 20 h.
```

(También elimina "visita guiada" y "todos los días" — ver cambio 8.)

**2b. Intro del hero** — `src/pages/contacto.astro:25-29`, reemplazar el `<p>` por:

```html
<p class="mt-7 max-w-2xl text-lg leading-relaxed text-ink-soft text-pretty">
  WhatsApp es nuestro canal principal — respondemos rápido, de lunes a
  sábado de 9 a 20 h. Si preferís mail, también va. La visita se coordina
  sin compromiso.
</p>
```

**2c. Card "WhatsApp directo"** — `src/pages/contacto.astro`, agregar debajo del `<p>` existente (línea ~57), antes del link:

```html
<p class="mt-2 text-sm text-ink-soft">
  Atendemos de lunes a sábado, de 9 a 20 h. Fuera de ese horario, dejá tu
  mensaje y te respondemos al día siguiente.
</p>
```

Dato canónico: `HOURS.humanSupport` ("Lunes a sábado, 9 a 20 hs") + `schema.ts hoursAvailable` (Mon–Sat 09–20). No hay dato en la app que lo contradiga.

### 3. [ALTO] Select "Profesión": sacar "Homeopatía", sumar profesiones reales de la app

**Archivo:** `src/components/ContactForm.tsx:15-27` — reemplazar el array `PROFESIONES` completo por:

```ts
const PROFESIONES = [
  'Psicología',
  'Psiquiatría',
  'Psicopedagogía',
  'Fonoaudiología',
  'Psicomotricidad',
  'Terapia ocupacional',
  'Nutrición',
  'Kinesiología / Fisioterapia',
  'Masajes / terapias corporales',
  'Coaching',
  'Constelaciones familiares',
  'Terapias holísticas',
  'Sexología',
  'Arteterapia / Musicoterapia',
  'Docente / Tallerista',
  'Meditación / yoga',
  'Otra',
];
```

- "Homeopatía" NO está en `profesiones_lista` de la app → fuera (cae en "Terapias holísticas" u "Otra").
- "Taller o grupo" sale del select de profesión (no es profesión; el uso grupal ya está en "Tipo de consulta" y la profesión en "Docente / Tallerista").
- Las profesiones de la app que no entraron (Osteópata, Acupunturista, Digitopunturista, Consultor/a organizacional/RRHH, etc.) quedan cubiertas por "Terapias holísticas" / "Otra" para que el select no sea eterno.

### 4. [ALTO→BAJO] Opción del select "Tipo de consulta": "Visita guiada al lugar" → "Visita al lugar"

**Archivo:** `src/components/ContactForm.tsx:33` — reemplazar:

```ts
{ value: 'visita', label: 'Visita al lugar' },
```

Razón: "visita guiada" no tiene respaldo en la fuente de verdad; "visita" a secas es verdadero (los testimonios de la home visitaron) y no promete un formato. La opción se MANTIENE (no se elimina) — pendiente confirmar con Rafa (ver contradicciones).

### 5. [MEDIO+BAJO] Card "Visitanos": aviso de pre-apertura + mapa embebido + línea de estacionamiento

**Archivo:** `src/pages/contacto.astro`, card "Visitanos" (líneas ~84-102). Queda así (orden: título → aviso pre-apertura → dirección → mapa → estacionamiento → link):

1. Debajo del `<h3>Visitanos</h3>`, ANTES del `<address>`, agregar:

```html
<p class="mt-2 text-sm text-ink-soft">
  Estamos en pre-apertura: escribinos por WhatsApp y coordinamos tu visita
  sin compromiso.
</p>
```

2. Debajo del `<address>`, agregar el mismo embed de la home (patrón ya aprobado, no usa coordenadas):

```html
<div class="mt-4 overflow-hidden rounded-xl border border-hairline">
  <iframe
    title="Mapa de Espacio 1010 — Gaboto 1010, Montevideo"
    src="https://www.google.com/maps?q=Gaboto%201010%20Montevideo%20Uruguay&output=embed"
    width="100%"
    height="220"
    loading="lazy"
    referrerpolicy="no-referrer-when-downgrade"
    style="border:0; display:block;"
  ></iframe>
</div>
<p class="mt-3 text-xs text-ink-muted">
  Zona con estacionamiento NO tarifado · bien conectada en bus.
</p>
```

3. El link "Ver en mapa" existente se mantiene tal cual debajo (útil para abrir la app de Maps en mobile).

### 6. [MEDIO] Schema: `paymentAccepted` sin tarjeta

**Archivo:** `src/lib/schema.ts:47` — reemplazar:

```ts
paymentAccepted: 'Cash, Bank Transfer',
```

La app NO acepta tarjeta (transferencia BROU o depósito Abitab/RedPagos; "sin tarjeta" es argumento de venta). "Cash" cubre el depósito en redes de cobranza. Cambio global (sale en todas las páginas) pero es corrección de dato falso → la fuente de verdad gana.

### 7. [MEDIO] Schema: `sameAs` con el Instagram real

**Archivo:** `src/lib/schema.ts` — agregar `SOCIAL` al import de la línea 6:

```ts
import { SITE, ADDRESS, CONTACT, SOCIAL } from './site';
```

y reemplazar las líneas 79-81 por:

```ts
sameAs: [SOCIAL.instagram],
```

### 8. [BAJO] OG de /contacto: "Visita guiada" → "Visita"

**Archivo:** `src/pages/og/[slug].ts:43` — reemplazar la description del slug `contacto` por:

```ts
description: 'WhatsApp · Email · Visita',
```

Coherente con los cambios 2a y 4.

---

## Propuestas DESCARTADAS (y por qué)

| Propuesta | Origen | Por qué se descarta |
|---|---|---|
| Cambiar `openingHoursSpecification` del schema de 24/7 a 07:00–24:00 | Auditor, hallazgo 5b | Interactúa con el tema abierto #2 de la fuente de verdad ("24/7" de la home + `SITE.description` + `HOURS.openingHours`); el propio auditor pidió confirmarlo con Rafa — va a contradicciones, no se cambia unilateralmente esta noche. |
| Leer el horario humano desde `HOURS.humanSupport` en vez de texto en la página | Auditor, hallazgo 2 (idealmente) | El string de `site.ts` ("Lunes a sábado, 9 a 20 hs") no calza gramaticalmente en las 3 frases; refactor de datos compartidos no justifica el riesgo esta noche — queda anotado como mejora. |
| Foto real (`lugar-fachada.webp`) en la card "Visitanos" | Auditor, hallazgo 9 | El mapa embebido (cambio 5) ya aporta el elemento visual de confianza en esa misma card; foto + aviso + dirección + mapa + link la sobrecargan y alargan el aside sticky. |
| Corregir coordenadas `geo` y `postalCode` en `site.ts` | Auditor, hallazgo 7 | Requiere verificación externa en Google Maps que no se puede hacer con certeza esta noche — pasa a tareas de Rafa (el embed por query textual no depende de las coords). |
| Eliminar la opción "visita" del select | Auditor, hallazgo 10 (rama "si no se ofrecen") | Hay evidencia indirecta de que las visitas se hacen (testimonios reales de la home); se suaviza a "Visita al lugar" (cambio 4) en vez de eliminar. |

---

## Contradicciones / pendientes para Rafa (revisar mañana — NO resolver unilateralmente)

1. **Schema 24/7 vs horario real 7–24** (`schema.ts:62-69` dice 00:00–23:59 todos los días; la DB dice reservable 07:00–24:00). Ligado al claim "24/7" de la home y de `SITE.description`/`HOURS.openingHours` (`site.ts:14,52`) — tema abierto #2 de la fuente de verdad. Decidir si el schema pasa a 07:00–24:00 (recomendado: sí, es dato y la fuente de verdad gana) y qué se hace con la home.
2. **Coordenadas geo aproximadas** (`site.ts:28-29`, lat -34.9094 / lng -56.1834) y **postalCode '11200' sin confirmar** (`site.ts:26`): abrir Google Maps en Gaboto 1010, copiar lat/lng exactas y CP real, actualizar `site.ts`. Hoy salen en el JSON-LD de todo el sitio.
3. **"Visita" en pre-apertura**: confirmar que las visitas coordinadas se siguen ofreciendo hoy. Si NO, quitar la opción "visita" del select del form y la mención en meta/intro/og.
4. **Veredicto del panel no recibido**: el JSON del panel de 3 lentes llegó vacío al sintetizador; si el panel objetó algo distinto a lo resuelto acá, cotejar antes de implementar.
5. (Ya conocidos, solo recordatorio porque tocan archivos compartidos con esta página) `ESPACIOS` ficticios en `site.ts:88-202` y "12 espacios" en `DIFERENCIALES`/og — fuera del alcance de /contacto, ya flaggeados en sus propias auditorías.

## Verificación post-implementación

- `npm run build` sin errores; /contacto renderiza.
- El form sigue abriendo `wa.me/59899001303` con el texto armado (no tocar `onSubmit`).
- El JSON-LD de cualquier página muestra `paymentAccepted: 'Cash, Bank Transfer'` y `sameAs` con el IG.
- Grep: cero ocurrencias de "Homeopatía" y "visita guiada" en `src/pages/contacto.astro`, `src/components/ContactForm.tsx`, `src/pages/og/[slug].ts`.
