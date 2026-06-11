# SPEC FINAL — /el-lugar (sesión nocturna 2026-06-10)

> Sintetizador nocturno. Insumos: `docs/nocturna/audit-el-lugar.md` + `docs/VERDAD_APP_2026_06_10.md`.
> ⚠️ **El veredicto del panel de 3 lentes NO llegó al sintetizador** (el orquestador pasó el placeholder `${JSON}` sin sustituir). Esta spec se resolvió con auditoría + fuente de verdad + criterio propio (usuario real > SEO > estética; la fuente de verdad gana en datos). Si el panel objetó algo, revisar mañana contra esta spec.

Archivos a tocar: `src/pages/el-lugar.astro` y `src/lib/site.ts` (solo el array `AMENITIES`, que **únicamente** importa esta página — verificado con grep: ningún otro archivo lo usa, la home no se toca).

Convención: los números de línea refieren al archivo ANTES de aplicar cambios. Aplicar en el orden listado (los primeros no corren las líneas de los siguientes salvo el cambio 6, que inserta una sección).

---

## Cambio 1 — CTA final: pre-registro + WhatsApp (crítico, conversión) — `src/pages/el-lugar.astro:202-221`

Reemplazar la sección `<!-- CTA -->` completa (líneas 202-221) por:

```astro
  <!-- CTA -->
  <section class="bg-white py-20 sm:py-28">
    <Container>
      <div class="rounded-[var(--radius-xl)] bg-ink p-12 text-center text-white sm:p-20">
        <h2 class="text-balance text-white">Venite a conocerlo.</h2>
        <p class="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/80">
          Pre-registrate gratis y asegurá tu primera hora sin cargo, para usarla
          durante 2026. ¿Querés verlo antes? Coordinamos una visita por WhatsApp.
        </p>
        <div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button href="/#registro" variant="primary" size="lg" class="bg-white text-terracota hover:bg-white/90">
            Quiero mi primera hora gratis
          </Button>
          <Button href={CONTACT.whatsappLink('Hola! Quiero coordinar una visita a Espacio 1010.')} variant="ghost" size="lg" class="text-white hover:bg-white/10" target="_blank">
            Coordinar visita por WhatsApp
          </Button>
        </div>
      </div>
    </Container>
  </section>
```

Y actualizar el import de la línea 5:

```astro
import { ADDRESS, AMENITIES, CONTACT } from '../lib/site';
```

(`SITE` deja de usarse en la página; `CONTACT` se suma.)

## Cambio 2 — Foto principal: fachada editada en vez de la foto en obra (crítico) — `src/pages/el-lugar.astro:38-39`

En la sección "Visual del edificio", reemplazar solo `src` y `alt` del `<img>`:

```astro
          src="/fotos/fachada-final.webp"
          alt="Fachada reciclada del edificio de Espacio 1010, iluminada de noche, entre Palermo y Parque Rodó"
```

El resto del markup de la sección queda igual.

## Cambio 3 — AMENITIES sin datos falsos (crítico, verdad) — `src/lib/site.ts:208-219`

Reemplazar el array completo por:

```ts
export const AMENITIES = [
  { icon: 'wifi', label: 'Wifi en todo el edificio' },
  { icon: 'air-conditioner', label: 'Aire acondicionado en cada espacio' },
  { icon: 'led', label: 'Iluminación LED regulable' },
  { icon: 'lock', label: 'Acceso con código personal, todos los días de 7 a 24 h' },
  { icon: 'coffee', label: 'Comedor y sala de estar para profesionales, sin cargo' },
  { icon: 'parking', label: 'Estacionamiento no tarifado en la zona' },
  { icon: 'bus', label: 'A 2 cuadras de líneas troncales' },
] as const;
```

Qué cambió y por qué:
- `'Acceso 24/7 con código personal'` → horario real 7–24 (fuente de verdad).
- `'Cocina y sala de estar para tus pacientes'` → el comedor es EXCLUSIVO de profesionales (Ayuda.jsx); "para tus pacientes" era falso y grave.
- `'Sala de cowork incluida sin cargo'` → ELIMINADO: "cowork" no existe en la app; era el mismo comedor, duplicado.
- `'Sala de espera compartida'` → ELIMINADO: la app dice que las personas atendidas ingresan recién a la hora de la reserva; sin respaldo (flag a Rafa).
- `'Música ambiente para mayor privacidad'` → ELIMINADO: sin respaldo en app/DB (flag a Rafa; si es real, se reincorpora).
- `'Wifi de fibra...'` → `'Wifi en todo el edificio'`: "fibra" no está respaldado; el wifi sí.
- Se mantienen LED regulable, AA, estacionamiento (cumple "no tarifado") y líneas troncales.

La grilla de la página (3 columnas) queda con 7 ítems — sin cambio de markup.

## Cambio 4 — Meta description y title (alto, SEO + regla "12 espacios") — `src/pages/el-lugar.astro:9-10`

Reemplazar:

```astro
  title="El lugar: Gaboto 1010, entre Palermo y Parque Rodó"
  description="Edificio centenario en Gaboto 1010, entre Palermo y Parque Rodó, Montevideo, reciclado a nuevo para consultorios y salas por hora. Conocé la historia, los amenities y cómo llegar a Espacio 1010."
```

(Elimina el "12 espacios" prohibido en subpáginas y suma keywords de ubicación; el layout agrega "— Espacio 1010".)

## Cambio 5 — Historia: 3er párrafo seguro + "la persona que vas a atender" (medio) — `src/pages/el-lugar.astro:66-71`

Reemplazar el tercer `<p>` (el de "Adentro, la tecnología es invisible...") por:

```astro
        <p>
          Adentro, la tecnología no se nota: wifi en todo el edificio, aire
          acondicionado en cada espacio y acceso con tu código personal. La idea
          es que cuando entres, lo único en lo que pienses sea la persona que
          vas a atender.
        </p>
```

(Saca "domótica", "fibra repartida por planta" y "música ambiente" — sin respaldo — y resuelve H6 con "la persona que vas a atender". Los párrafos 1 y 2 quedan como están, con flag a Rafa.)

Además, agregar al final del `div` de párrafos (después del tercer `<p>`, antes de cerrar el `</div>` de la línea 72) el link interno:

```astro
        <p>
          ¿Querés ver los consultorios y salas?
          <a href="/los-espacios" class="font-semibold text-terracota underline-offset-4 hover:underline">Conocé los espacios</a>.
        </p>
```

## Cambio 6 — Galería de fotos reales (alto, "la página del lugar tiene que mostrar el lugar") — `src/pages/el-lugar.astro`, insertar entre la sección "Historia + filosofía" (cierra en línea 74) y "Amenities" (abre en línea 76)

Insertar esta sección nueva (patrón adaptado de `index.astro:277-304`, ajustado a fondo blanco: bordes `border-hairline`, hint de scroll en `text-ink-soft`). Usa 6 de las 7 fotos de la home — se omite `lugar-fachada.webp` porque la fachada ya abre la página (Cambio 2) y se duplicaría:

```astro
  <!-- Galería — fotos reales de las áreas comunes -->
  <section class="bg-white pb-16 sm:pb-20">
    <Container size="wide">
      <p class="flex items-center justify-end gap-1.5 text-xs text-ink-soft/70 lg:hidden">
        Deslizá para ver más
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </p>
      <div class="mt-3 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 lg:mt-0 lg:block lg:columns-3 lg:gap-4 lg:overflow-visible lg:pb-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {
          [
            { src: '/fotos/lugar-pasillo.webp', lg: 'lg:aspect-[3/4]', cap: 'Pasillo · ladrillo a la vista', alt: 'Pasillo de Espacio 1010 con muro de ladrillo original a la vista, lámparas circulares y claraboya' },
            { src: '/fotos/lugar-subsuelo.webp', lg: 'lg:aspect-[3/2]', cap: 'Subsuelo · piedra y arco originales', alt: 'Subsuelo de Espacio 1010 con muro de piedra y arco original iluminado, piso de madera' },
            { src: '/fotos/lugar-herreria.webp', lg: 'lg:aspect-[3/4]', cap: 'Herrería original recuperada', alt: 'Detalle de la herrería original de la baranda, con roseta de bronce, sobre muro de ladrillo' },
            { src: '/fotos/lugar-marmol.webp', lg: 'lg:aspect-[3/4]', cap: 'Escalera de mármol original', alt: 'Escalera de mármol original de Espacio 1010 junto a un muro de ladrillo a la vista' },
            { src: '/fotos/lugar-sala-subsuelo.webp', lg: 'lg:aspect-[3/2]', cap: 'Sala del subsuelo', alt: 'Sala amplia del subsuelo de Espacio 1010 con muro de piedra, piso de madera y escalera metálica' },
            { src: '/fotos/lugar-circulacion.webp', lg: 'lg:aspect-[3/4]', cap: 'Circulación con luz natural', alt: 'Circulación de Espacio 1010 con lámparas circulares colgantes y luz natural al fondo' },
          ].map((f) => (
            <figure class="group w-[80%] shrink-0 snap-start overflow-hidden rounded-[var(--radius-xl)] border border-hairline shadow-[var(--shadow-md)] sm:w-[46%] lg:mb-4 lg:w-full lg:break-inside-avoid">
              <div class={`relative aspect-[3/4] overflow-hidden ${f.lg}`}>
                <img
                  src={f.src}
                  alt={f.alt}
                  loading="lazy"
                  decoding="async"
                  class="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-105"
                />
                <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 via-ink/30 to-transparent p-4 pt-12">
                  <p class="text-sm font-medium text-white">{f.cap}</p>
                </div>
              </div>
            </figure>
          ))
        }
      </div>
      <p class="mt-6 text-center text-sm text-ink-soft">
        Fotos reales de las áreas comunes. Fotos de cada espacio, muy pronto.
      </p>
    </Container>
  </section>
```

(Los `cap`/`alt` son los ya aprobados de la home, textuales.)

## Cambio 7 — Ubicación: H2 sin "En pleno Parque Rodó" + bullet (medio) — `src/pages/el-lugar.astro:115-117` y `:130`

Reemplazar el H2 (que hoy interpola `{ADDRESS.neighborhood}`) por texto hardcodeado:

```astro
          <h2 class="text-3xl text-ink sm:text-4xl">
            Entre Palermo y Parque Rodó, a un paso de todo.
          </h2>
```

Y como el H2 ya nombra los barrios, cambiar el texto del primer bullet (línea 130) por:

```
              A pocas cuadras de 18 de Julio y del Parque Rodó
```

NO tocar `ADDRESS.neighborhood` en `site.ts` (lo usan schema y otras páginas — flag aparte).

## Cambio 8 — Mapa: Google Maps embed en vez de OSM con coordenadas dudosas (medio) — `src/pages/el-lugar.astro:161-167`

Reemplazar el `<iframe>` por el mismo embed de la home (no depende de `ADDRESS.lat/lng`, marcadas como aproximadas):

```astro
            <iframe
              title="Mapa de Espacio 1010 en Gaboto 1010, Montevideo"
              src="https://www.google.com/maps?q=Gaboto%201010%20Montevideo%20Uruguay&output=embed"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              class="h-full w-full"
              style="border: 0;"
            ></iframe>
```

También se puede borrar el comentario `<!-- Placeholder de mapa... -->` de la línea 159 (ya no es placeholder).

---

## Lo que NO se toca (a propósito)

- H1 y hero (líneas 13-31): aprobados por el auditor (H12), no "mejorar".
- Párrafos 1 y 2 de Historia ("abandonada durante años", "pisos calcáreos", etc.): requieren confirmación de Rafa; riesgo bajo mientras tanto.
- Sección Accesibilidad (174-200): copy intacto; los 3 datos duros van a contradicciones para Rafa.
- `src/lib/schema.ts` y `HOURS.openingHours` ('24/7'): archivos/datos compartidos con otras páginas — van al informe general, no a esta spec.

## Propuestas DESCARTADAS y por qué (1 línea c/u)

1. Borrar `public/fotos/fachada.jpg` del repo (H1): fuera de alcance de la página; verificar antes que ninguna otra página/OG la use — no bloquea.
2. Incluir `lugar-fachada.webp` en la galería (H2): duplicaría la fachada que ya abre la página tras el Cambio 2.
3. Cerrar la galería con la línea exacta de la home "Fotos reales de cada espacio, muy pronto." a secas: ajustada a "Fotos reales de las áreas comunes. Fotos de cada espacio, muy pronto." porque estas fotos SÍ son reales y la línea original sola podría leerse como que lo mostrado no lo es.
4. CTA secundario a `/contacto` (estado actual): reemplazado por WhatsApp directo — es la estrategia definida (primario pre-registro, secundario WhatsApp).
5. Cambiar `ADDRESS.neighborhood` en `site.ts` (H7): lo consumen schema y otras páginas; se hardcodea el H2 y se flaggea la unificación.
6. Editar `schema.ts` (`opens/closes` 24/7) desde esta spec (H11): archivo compartido entre páginas; va al informe general para coordinar.
7. Title largo `"El lugar — casa centenaria reciclada en Gaboto 1010"` (H11, opción A): con el sufijo del layout supera ~70 caracteres; se usa la alternativa corta con keywords de ubicación.
8. Mantener "Música ambiente" y "Sala de espera compartida" en AMENITIES (H4): sin respaldo en app/DB; regla "no inventar/no prometer" gana — se eliminan y se flaggean para reincorporar si Rafa confirma.
9. Reescribir los párrafos 1-2 de Historia (H9, versión completa): los claims necesitan confirmación de Rafa, no reescritura especulativa.
10. Tocar el copy de Accesibilidad (H10): el tono es correcto; solo falta verificación de datos, no edición.

## Contradicciones / pendientes para Rafa (revisar mañana)

1. **El veredicto del panel nunca llegó**: el orquestador pasó `${JSON}` literal sin sustituir — esta spec no incorpora objeciones del panel; revisar el output del panel contra esta spec si existe.
2. **Accesibilidad** (`el-lugar.astro:174-200`): confirmar "dos escalones" en el acceso, "baño totalmente accesible" en PB y pasillos aptos para silla de ruedas — si algo es inexacto, el daño es alto porque la sección promete honestidad.
3. **Historia** (`el-lugar.astro:53-65`): confirmar "abandonada durante años", "faltaba estructura y sobraba humedad", "pisos calcáreos". Quedaron publicados.
4. **Amenities eliminados por falta de respaldo**: "Música ambiente para mayor privacidad" y "Sala de espera compartida" — si son reales, reincorporarlos a `AMENITIES` con redacción precisa (la sala de espera, ¿para quién y desde cuándo puede entrar la persona atendida?).
5. **"Wifi de fibra"**: se publicaba "fibra" sin respaldo; quedó "Wifi en todo el edificio". Si es fibra confirmada, se puede reponer el detalle.
6. **Datos compartidos con claims 24/7**: `src/lib/schema.ts` (LocalBusiness opens 00:00–23:59) y `site.ts` `HOURS.openingHours='24/7'` + `DIFERENCIALES` ("Acceso 24/7", "Cowork incluido sin cargo", "los 12 espacios") contradicen la fuente de verdad (7–24, sin cowork) — son consumidos por otras páginas/la home; decidir el fix global.
7. **`ADDRESS.neighborhood = 'Parque Rodó'`** vs posicionamiento "entre Palermo y Parque Rodó": unificar criterio para schema y demás páginas.
8. **`ADDRESS.lat/lng` aproximadas** (`site.ts:27-29`): tras esta spec el mapa de /el-lugar ya no las usa, pero siguen en `site.ts` para schema/otros usos — verificar coordenadas reales antes del launch.
9. **`ESPACIOS` ficticios en `site.ts`** (Estudio Norte/Sur, Consulta I-VII...): no los renderiza /el-lugar, pero siguen siendo la "fuente" de otras páginas; reemplazar por los reales de la DB (ya flaggeado en la fuente de verdad).
