# Auditoría — /alquiler-consultorio-montevideo

> Sesión nocturna 2026-06-10. Auditor: página SEO long-tail.
> Archivo auditado: `src/pages/alquiler-consultorio-montevideo.astro` (252 líneas).
> Fuente de verdad: `docs/VERDAD_APP_2026_06_10.md`. Referencia de tono: `src/pages/index.astro` (NO se toca).
> Convención de gravedad: **critico** (dato falso en producción o conversión rota) · **alto** · **medio** · **bajo**.

## Resumen ejecutivo

La página tiene buena estructura SEO de base (un solo H1 correcto, canonical vía BaseLayout, OG dedicada, breadcrumb + Service schema, buen mallado hacia `/para/*` y `/los-espacios`), pero está construida sobre los **datos viejos/ficticios de `site.ts`**: muestra espacios que no existen (Estudio Norte, Salón Cobre, Sala Arcos con 60 m²), repite "12 espacios" cinco veces y "24/7" tres veces, y sus dos CTAs principales mandan directo a `agenda.espacio1010.uy` en vez del pre-registro con primera hora gratis, violando la estrategia de CTAs vigente. Además es una **página huérfana** (ningún link interno del sitio apunta a ella) y no menciona en ningún lado que el local está en pre-apertura, lo cual genera una expectativa falsa ("reservás ya") y desaprovecha la oferta de conversión.

---

## Hallazgos

### 1. [CRITICO] CTAs primarios van directo a la PWA, no al pre-registro

- `alquiler-consultorio-montevideo.astro:64` — `<Button href={SITE.agendaUrl} ...>Reservá tu primera hora</Button>`
- `alquiler-consultorio-montevideo.astro:244` — `<Button href={SITE.agendaUrl} ...>Crear mi cuenta</Button>`

La estrategia de CTAs (VERDAD_APP, sección "Estrategia de CTAs") dice: mientras dure el pre-lanzamiento, el CTA primario de TODAS las páginas lleva a `/#registro` con el mensaje de primera hora gratis. Acá los dos CTAs fuertes saltean el form de la landing (se pierde el lead en `pre_registros`, el evento GTM `lead_preregistro` y la atribución UTM).

**Propuesta** (hero, línea 63-70):

```astro
<div data-reveal data-reveal-delay="200" class="mt-10 flex flex-col gap-3 sm:flex-row">
  <Button href="/#registro" variant="primary" size="lg" class="btn-primary-glow">
    Quiero mi primera hora gratis
  </Button>
  <Button href="/los-espacios" variant="ghost" size="lg">
    Ver consultorios y salas
  </Button>
</div>
```

CTA final (líneas 238-248):

```astro
<h2 class="text-balance text-crema">¿Probamos?</h2>
<p class="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-crema/85">
  Pre-registrarte es gratis y sin compromiso: te guardamos tu primera hora
  gratis para usarla cuando quieras durante 2026.
</p>
<div class="mt-8">
  <Button href="/#registro" variant="primary" size="lg" class="bg-white text-terracota hover:bg-white/90">
    Quiero mi primera hora gratis
  </Button>
</div>
```

(El secundario WhatsApp ya existe como botón flotante global — alcanza.)

### 2. [CRITICO] Cards de "Espacios destacados" muestran espacios FICTICIOS

- `alquiler-consultorio-montevideo.astro:10` — `const destacados = ESPACIOS.filter((e) => e.destacado);`
- `alquiler-consultorio-montevideo.astro:142-167` — render de las cards con link a `/los-espacios/${e.id}`

`ESPACIOS` en `src/lib/site.ts:88-202` son placeholders de un sprint viejo (el propio archivo lo admite en el comentario de la línea 89). Los `destacado: true` que se renderizan acá son: **Estudio Norte** (no existe), **Salón Cobre** (no existe) y **Sala Arcos con 60 m² y "20 a 30 personas"** (real: 40 m², 25 sentados, $700/h, se vende por WhatsApp). Es dato falso publicado en producción, con links a fichas también ficticias.

**Propuesta**: hasta que se reescriba `site.ts` con los espacios reales (tarea transversal, ver hallazgo 16), reemplazar el `filter` por un array local con espacios reales de la DB:

```astro
const destacados = [
  { href: '/los-espacios', nombre: 'Espacio 01 · planta baja', resumen: 'A la calle, cálido. Sillón de 3 cuerpos y butaca individual, ideal para sesiones uno a uno.', capacidad: 'Hasta 4 personas', metros: 13, tag: 'Amueblado' },
  { href: '/los-espacios', nombre: 'Espacio 13 · con camilla', resumen: 'Equipado con camilla para masajes, reflexología y tratamientos corporales. Con escritorio.', capacidad: '2 personas', metros: 11, tag: 'Con camilla' },
  { href: '/los-espacios', nombre: 'Espacio 14 · multiuso', resumen: 'Amplio y despejado, con almohadones y colchonetas. Para movimiento, meditación y grupos chicos.', capacidad: 'Hasta 8 personas', metros: 16, tag: 'Multiuso' },
];
```

(Si la ficha real por espacio todavía no existe, linkear al índice `/los-espacios`. NO inventar fichas.)

### 3. [CRITICO] "12 espacios" y "24/7" repetidos — contradicen la fuente de verdad

Ocurrencias de "12":
- `:30` (schema Service description), `:37` (meta description), `:57` ("12 espacios premium en…"), `:68` ("Ver los 12 espacios"), `:171` ("Ver los 12 espacios").

Ocurrencias de "24/7":
- `:30` ("autogestión 24/7"), `:37` ("Reservás online 24/7"), `:58` ("accedés 24/7 con código personal").

Regla de la sesión: en subpáginas EVITAR el total "12 espacios" (discrepancia abierta: DB tiene 7 activos + Sala Arcos) y usar "todos los días, de 7 a 24 h" en vez de 24/7 (horario real de la app: 07:00–24:00).

**Propuesta de copy** (hero, líneas 56-61):

```
Consultorios y salas en Gaboto 1010, entre Isla de Flores y San Salvador,
en el límite de Palermo y Parque Rodó. Desde $350 la hora. Reservás online,
entrás con tu código personal todos los días de 7 a 24 h, y cancelás gratis
avisando con 24 horas. Para profesionales de la salud, el bienestar y la educación.
```

Botones (`:68` y `:171`): "Ver consultorios y salas" / "Conocé todos los espacios".

### 4. [ALTO] Claims de ubicación no verificables o falsos

- `:87-89` — "Comparte zona con clínicas, hospitales privados y la facultad de medicina": la Facultad de Medicina NO está en Palermo/Parque Rodó (queda en otra zona de Montevideo). Dato inventado, no figura en ninguna fuente.
- `:97` y `:37/:58` — "A 5 cuadras de 18 de Julio": no está en la fuente de verdad y desde Gaboto e Isla de Flores son más de 5 cuadras reales. También aparece en la OG (`src/pages/og/[slug].ts:51`).
- `:103` — "A 2 cuadras de líneas troncales (101, 103, CA1)": las líneas concretas no figuran en ninguna fuente del proyecto (`site.ts:218` dice solo "A 2 cuadras de líneas troncales", sin números). La home dice apenas "bien conectado en bus".

**Propuesta** (párrafo `:85-90`):

```
La zona entre Palermo y Parque Rodó es de las más cómodas de Montevideo para
atender: cerca del Centro, del Parque Rodó y de la rambla, con calles tranquilas
y llegada fácil en bus, en auto o caminando. Las personas que atendés llegan sin vueltas.
```

Lista de bullets (`:92-117`): reemplazar "A 5 cuadras de 18 de Julio" por "A minutos del Centro y de 18 de Julio" y "A 2 cuadras de líneas troncales (101, 103, CA1)" por "Bien conectado en bus desde toda la ciudad" (o confirmar las líneas reales con Rafa antes de publicar números). Mantener "Estacionamiento fácil (zona NO tarifada)" y "Cuadra tranquila…", que están bien.

### 5. [ALTO] "Espacios más elegidos en Montevideo" — falso en pre-apertura

- `:137` — `<h2>Espacios más elegidos en Montevideo.</h2>`

El local no abrió: nada fue "elegido" todavía. Es un claim de prueba social inventado.

**Propuesta**: `<h2>Espacios para cada forma de atender.</h2>` con bajada actual (`:138-140`) que sí está bien.

### 6. [ALTO] La página no menciona pre-apertura ni la primera hora gratis

En toda la página no aparece ni "pre-lanzamiento" ni la oferta del cupón. Quien llega por Google asume que ya puede atender mañana, y la página no usa el gancho de conversión que justifica todo el sitio hoy.

**Propuesta**: en el hero, debajo del eyebrow (`:48-50`), agregar el badge de pre-lanzamiento (mismo patrón que la home) y una línea de oferta bajo los CTAs:

```astro
<p class="mt-3 text-sm text-ink-muted">
  Abrimos en junio 2026 · Pre-registrate hoy y tu primera hora queda gratis para usarla durante 2026.
</p>
```

### 7. [ALTO] Página huérfana: ningún link interno apunta a ella

`grep "alquiler-consultorio"` en `src/` solo devuelve auto-referencias (breadcrumb, schema, ogSlug) y la entrada OG. Ni Nav, ni Footer, ni `/precios`, ni los nichos la linkean. Para una página cuyo único propósito es rankear "alquiler consultorio Montevideo", estar solo en el sitemap es muy débil (sin internal links, Google le asigna poca autoridad).

**Propuesta** (sin tocar la home):
- Footer (`src/components/Footer.astro`, columna "Para profesionales", después del map de NICHOS, ~línea 53): agregar `<li><a href="/alquiler-consultorio-montevideo" class="text-crema/80 transition-colors hover:text-terracota-light">Alquiler de consultorio en Montevideo</a></li>`.
- Desde `/precios` y `/los-espacios`: un link contextual en el cuerpo ("¿Buscás alquiler de consultorio por hora en Montevideo? Conocé la zona y los espacios").

### 8. [MEDIO] Schema Service con datos falsos y sin conexión al LocalBusiness

- `:18-32` — `schemaService.description` repite "12 espacios premium… autogestión 24/7, sin contrato anual". Además `provider` es un LocalBusiness "suelto" (solo `name`), cuando BaseLayout ya emite el LocalBusiness con `@id: ${SITE.url}/#business` (`src/lib/schema.ts:36`). Falta `offers` con el precio, que es el dato más rico para esta query.

**Propuesta**:

```js
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

### 9. [MEDIO] Meta description y OG con los mismos datos viejos

- `:37` — meta description: "12 espacios… Reservás online 24/7".
- `src/pages/og/[slug].ts:49-52` — OG: "12 espacios en Parque Rodó · A 5 cuadras de 18 de Julio".

**Propuesta** meta description (mantener <160 caracteres):

```
Alquilá consultorio por hora en Montevideo desde $350, entre Palermo y Parque Rodó. Sin alquiler fijo, cancelás gratis con 24 h. Pre-registrate: primera hora gratis.
```

OG description: `Consultorios y salas por hora · Palermo / Parque Rodó · Desde $350`.

### 10. [MEDIO] Sección "También buscan por" = lista de keywords pelada (señal de stuffing / thin content)

- `:203-233` — diez pills con variantes de keyword sin contenido alguno. Eso era SEO de 2015; hoy es una señal negativa (texto sin valor para el usuario) y desperdicia la mejor oportunidad de la página: responder de verdad las preguntas long-tail.

**Propuesta**: reemplazar la sección por una mini-FAQ útil (4-5 preguntas) con schema FAQPage (mismo patrón que `/precios`), que ataca las mismas queries con contenido genuino:

- "¿Cuánto cuesta alquilar un consultorio por hora en Montevideo?" → "En Espacio 1010, $350 la hora en todos los consultorios, sin matrícula ni gastos fijos. Con descuentos si sumás 20 o más horas en el mes. La Sala Arcos, para grupos y talleres, sale $700 la hora."
- "¿Puedo alquilar por hora suelta, sin contrato?" → "Sí. Reservás desde 1 hora, solo cuando la necesitás, sin compromiso. Y si querés un horario fijo semanal, también podés."
- "¿En qué horarios puedo atender?" → "Todos los días, de 7 a 24 h. Entrás con tu código personal, sin depender de nadie."
- "¿Qué pasa si tengo que cancelar?" → "Avisando con más de 24 horas no pagás nada. Entre 24 y 1 hora antes, pagás la mitad."
- "¿Para qué profesionales sirve?" → "Psicología, psiquiatría, nutrición, terapias corporales (hay espacio con camilla), psicopedagogía, talleres y grupos, entre otros."

Todos los datos salen de la DB/fuente de verdad. La pill list se puede conservar reducida como texto de cierre de una sola línea si se quiere, pero la FAQ rinde más.

### 11. [MEDIO] Placeholder gráfico en vez de foto real

- `:120-129` — el bloque de "imagen" de Ubicación es un gradiente con texto decorativo, habiendo 7 fotos reales en `public/fotos/`.

**Propuesta**:

```astro
<figure class="relative aspect-[5/6] overflow-hidden rounded-2xl shadow-[var(--shadow-md)]">
  <img
    src="/fotos/lugar-fachada.webp"
    alt="Fachada reciclada del edificio de Espacio 1010 en Gaboto 1010, iluminada de noche, entre Palermo y Parque Rodó"
    loading="lazy" decoding="async"
    class="h-full w-full object-cover"
  />
  <figcaption class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 to-transparent p-5 text-sm text-white">
    Gaboto 1010 · entre Isla de Flores y San Salvador
  </figcaption>
</figure>
```

(Suma además una imagen indexable para Google Imágenes con alt geo-relevante — gratis para una página SEO.)

### 12. [BAJO] "Tus pacientes ya saben dónde es"

- `:89` — la regla de copy pide "las personas que atendés" (no siempre "pacientes"), sobre todo en páginas que también apuntan a coaches, talleristas, yoga. Cubierto por la reescritura del hallazgo 4; si se mantiene el párrafo, cambiar "Tus pacientes" por "Las personas que atendés".

### 13. [BAJO] "premium" desentona con el tono del sitio

- `:57` ("12 espacios premium") y `:222` (pill "consultorio premium Montevideo"). No es palabra prohibida, pero la home nunca la usa: habla de "espacios cuidados". Cubierto por las reescrituras de los hallazgos 3 y 10; preferir "espacios cuidados".

### 14. [BAJO] Breadcrumb schema sin breadcrumb visible

- `:12-15` — se emite BreadcrumbList pero la página no muestra breadcrumbs. Google recomienda que el markup refleje contenido visible. Riesgo bajo (no suele penalizar), pero si se quiere cerrar: agregar un breadcrumb visible chiquito arriba del eyebrow del hero (`Inicio › Alquiler de consultorio en Montevideo`) o quitar el schema.

### 15. [BAJO] Copy del cierre confuso

- `:241` — "Después ves la agenda real de Montevideo": frase rara ("la agenda de Montevideo" no significa nada). Cubierto por la propuesta del hallazgo 1.

### 16. [TRANSVERSAL — no resolver solo acá] `src/lib/site.ts` sigue siendo la raíz del problema

`ESPACIOS` ficticios (`site.ts:88-202`), `HOURS.openingHours: '24/7'` (`site.ts:52`), "los 12 espacios" en `DIFERENCIALES` (`site.ts:228`), "Sala de cowork" (`site.ts:216` — concepto que no existe en la app), y `paymentAccepted: 'Cash, Credit Card, Bank Transfer'` en `schema.ts:47` (la app NO acepta tarjeta: transferencia BROU o Abitab/RedPagos). Toda página que consuma estos datos hereda los errores. Coordinar con los auditores de `/los-espacios` y `/precios` para un fix único en `site.ts`/`schema.ts` en vez de parches por página.

---

## Lo que está bien (no tocar)

- Un solo H1, correcto y con la keyword exacta (`:51-55`).
- Title y estructura H2 coherentes; canonical automático vía BaseLayout.
- OG dedicada vía `ogSlug` (existe la entrada en `og/[slug].ts`).
- Buen mallado interno SALIENTE hacia `/para/*` (6 nichos, `:185-199`) y `/los-espacios`.
- Precio $350 correcto y centralizado en `PRECIO_HORA`.
- "Estacionamiento fácil (zona no tarifada)" y "cancelás con 24 hs sin pagar": correctos.

## Orden sugerido de ejecución

1. Hallazgos 1, 2, 3 (críticos: conversión + datos falsos) — un solo commit.
2. Hallazgos 4, 5, 6, 7 (altos: claims y huérfana).
3. Hallazgos 8-11 (schema, meta, FAQ, foto).
4. Hallazgo 16: coordinar fix de `site.ts` con los otros auditores.
