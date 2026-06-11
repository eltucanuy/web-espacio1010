# SPEC FINAL — `/precios` (src/pages/precios.astro)

**Fecha:** 2026-06-10 (sesión nocturna) · **Sintetizador:** subagente `/precios`
**Insumos:** `docs/nocturna/audit-precios.md` + `docs/VERDAD_APP_2026_06_10.md`.
**⚠️ Nota de proceso:** el JSON con los veredictos del panel de 3 lentes llegó VACÍO
(placeholder `${JSON}` sin sustituir en el prompt del orquestador). Esta spec se
sintetizó solo con el informe del auditor contrastado contra la fuente de verdad.
Si el panel objetó algo, esas objeciones NO están incorporadas — revisar mañana.

**Criterio aplicado:** usuario real > SEO > estética; la fuente de verdad gana siempre
en datos. Español rioplatense (vos), sin "boutique/insonorizado/Cordón", "sin
compromiso" (no "sin permanencia"), CTA primario `/#registro`, Sala Arcos por WhatsApp.

Todos los cambios son en **`src/pages/precios.astro`** salvo indicación.

---

## Cambio 1 — Frontmatter: imports y datos

- Quitar `import { SITE } from '../lib/site';` (deja de usarse `SITE.agendaUrl`) y
  agregar `import { CONTACT } from '../lib/site';` (se usa en cambios 5 y 9).
- Reemplazar TODO el array `planes` (líneas 12–55) por exactamente 2 planes:

```ts
const planes = [
  {
    nombre: 'Hora suelta',
    bajada: 'Reservás cuando la necesitás.',
    precio: `$${PRECIO_HORA}`,
    unidad: 'por hora',
    destacado: false,
    incluye: [
      'Cualquier espacio disponible',
      'Desde 1 hora, sin compromiso ni contrato',
      'Cancelás gratis hasta 24 h antes (50% hasta 1 h antes)',
      'Reservás hasta con 150 días de anticipación',
    ],
    cta: { label: 'Quiero mi primera hora gratis', variant: 'outline' as const },
  },
  {
    nombre: 'Fija semanal',
    bajada: 'Tu día, tu hora y tu espacio, todas las semanas.',
    precio: `$${PRECIO_HORA}`,
    unidad: 'por hora',
    destacado: true,
    incluye: [
      'Mismo espacio, día y hora cada semana',
      'La cortás cuando quieras, sin trámite ni penalización',
      'Cancelaciones gratis todos los meses (hasta el 20% de tus horas fijas)',
      'Suma para tu descuento por volumen',
    ],
    cta: { label: 'Quiero empezar con mi hora gratis', variant: 'primary' as const },
  },
];
```

- En el grid de cards (línea 143): `lg:grid-cols-3` → `sm:grid-cols-2` y agregar
  `class="mx-auto max-w-3xl"` (o equivalente) para que 2 cards no queden gigantes.
  El badge "Más elegido" queda en Fija semanal (destacado: true).

## Cambio 2 — Schema FAQPage corregido + Q4 de pago (líneas 57–86)

Reemplazar los `text` así (names sin cambios salvo la Q4 nueva):

- Q1 (`¿Cuánto cuesta alquilar consultorio por hora en Espacio 1010?`):
  `Los consultorios y salas cuestan $350 por hora, precio único. La Sala Arcos (subsuelo, hasta 25 personas sentadas) cuesta $700 por hora. Podés reservar hora suelta o un horario fijo semanal, y con 20 horas al mes tenés 10% de descuento; con 40 o más, 20%.`
- Q2 (`¿Hay contrato anual?`): mantener tal cual.
- Q3 (`¿Qué incluye el precio?`):
  `Acceso al espacio amoblado y climatizado, cocina y sala de estar para profesionales, y entrada con código personal todos los días de 7 a 24 h. Sin cargos extra ni costos de gestión.`
- Q4 NUEVA — name: `¿Cómo se paga?` / text:
  `A mes vencido: el día 1 recibís el detalle de tus horas del mes anterior, con los descuentos ya aplicados, y tenés 10 días para pagarlo. Sin tarjeta ni cobros automáticos: pagás por transferencia bancaria o depósito en Abitab o RedPagos.`

## Cambio 3 — SEO: title y description (líneas 90–91)

- `title="Precios: consultorio por hora a $350"`
- `description="Alquilá consultorio por hora en Montevideo a $350, precio único y todo incluido. Descuentos por volumen de hasta 20%, pago a mes vencido sin tarjeta y cancelación gratis con 24 h. Tu primera hora es gratis."`

## Cambio 4 — Hero: bajada nueva (líneas 108–112). H1 NO se toca.

Reemplazar el `<p>` de la bajada por:

`Un solo precio: $350 la hora, en cualquier espacio. Reservás suelto o con horario fijo semanal, y cuanto más usás en el mes, menos pagás. Sin matrícula, sin mínimos, sin letra chica.`

## Cambio 5 — Banner "Tarifa Fundadores" → promo real (líneas 116–138)

Reemplazar el contenido del banner (misma estructura visual):

- Kicker: `Pre-lanzamiento · abrimos en junio`
- H2: `Tu primera hora, gratis.`
- Bajada: `Pre-registrate hoy y te guardamos una hora sin cargo para usarla cuando quieras durante 2026, en el espacio que elijas.`
- Botón: `<Button href="/#registro" variant="primary" size="md">Quiero mi primera hora gratis</Button>`

PROHIBIDO conservar: "Fundadores", "50 cuentas", "Quedan 41 cupos", "tarifa
congelada", "primer mes de fija sin cargo" — nada de eso existe.

## Cambio 6 — CTAs de las cards (línea 179)

`<Button href={SITE.agendaUrl} ...>` → `<Button href="/#registro" ...>` (labels ya
definidos en el cambio 1).

## Cambio 7 — Debajo de las cards: cancelación completa + gancho + links internos

Después del grid de cards (entre líneas 186 y 188), agregar dos párrafos:

- `Cancelación simple: gratis avisando con más de 24 h; hasta 1 h antes pagás solo la mitad. En las fijas, las cancelaciones gratis tienen un tope del 20% de tus horas del mes. <a href="/preguntas-frecuentes">Más detalles en las preguntas frecuentes →</a>`
- `Tu primera hora es gratis: <a href="/#registro">pre-registrate</a> y queda guardada a tu nombre para usarla durante 2026.`

(Estilo: `text-sm text-ink-soft`, centrados, coherentes con la nota de la línea 196.)

## Cambio 8 — Bloque Sala Arcos con datos reales, foto y CTA WhatsApp (líneas 188–194)

Convertir el `div` de la línea 188 en una card horizontal con la foto real
`/fotos/lugar-sala-subsuelo.webp` (alt: `Sala Arcos, la gran sala del subsuelo con paredes de piedra y arcos`) a un lado y este copy al otro:

- `$700/h · Sala Arcos` ` — la gran sala del subsuelo: 40 m² para hasta 25 personas sentadas, con proyector, parlante, kitchenette y baño propio.`
- Link/botón: `Consultala por WhatsApp` → `CONTACT.whatsappLink('Hola! Quiero consultar por la Sala Arcos.')` con `target="_blank"`.
- Link secundario: `Conocé los consultorios y salas →` → `/los-espacios`.

PROHIBIDO: "hasta 30 personas" y "sin columnas" (no verificables; DB dice 25 sentados).

## Cambio 9 — Descuentos por volumen: números reales (líneas 203–241)

H2 y párrafo intro se mantienen, PERO reemplazar la última frase del intro
("Sin trámites ni promociones que tenés que pedir." se mantiene; el resto igual).
Reemplazar las 3 cards vagas por los tramos reales:

- Card 1 — kicker `Hasta 20 h al mes` / h3 `$350 la hora` / texto `La tarifa estándar, sin mínimos ni costos fijos.`
- Card 2 — kicker `20 h o más al mes` / h3 `10% de descuento` / texto `Queda en $315 la hora promedio. Se aplica solo sobre el total del mes.`
- Card 3 (destacada, border-terracota) — kicker `40 h o más al mes` / h3 `20% de descuento` / texto `Queda en $280 la hora promedio. La mejor tarifa del esquema.`

Reemplazar la nota al pie (líneas 238–240) por:

`El descuento se calcula solo, sobre todas tus horas del mes, y lo ves en tu liquidación el día 1. No hay que pedirlo ni hacer ningún trámite.`

PROHIBIDO: "los tramos exactos los coordinás al crear tu cuenta" (falso — son fijos,
automáticos y públicos en la app).

## Cambio 10 — Sección NUEVA "¿Y cómo se paga? Después de usar." (después del bloque de descuentos, antes de "Qué incluye")

Sección con H2 `¿Y cómo se paga? Después de usar.` y 3 puntos (mismo patrón visual
de 3 cards o lista destacada):

- **A mes vencido** — `Usás el espacio todo el mes y recién el día 1 recibís el detalle de tus horas, con los descuentos ya aplicados. Tenés 10 días para pagarlo.`
- **Sin tarjeta** — `No te pedimos tarjeta nunca: ni para registrarte, ni para reservar. Nada de cobros automáticos ni adelantos.`
- **Como te quede cómodo** — `Pagás por transferencia bancaria o depósito en Abitab o RedPagos. Si lo necesitás, podés ir pagando en partes.`

(NO publicar números de cuenta. Ver contradicción 2 sobre medios de pago.)

## Cambio 11 — Lista "Qué incluye" solo con lo verificado (líneas 252–270)

Reemplazar los 8 ítems por estos 4 (grid puede pasar a `sm:grid-cols-2` igual):

- `Espacios amoblados y climatizados`
- `Cocina y sala de estar para profesionales, sin cargo`
- `Acceso con código personal, todos los días de 7 a 24 h`
- `Videoportero y cámaras en accesos y zonas comunes (nunca en los espacios de atención)`

ELIMINADOS hasta confirmación de Rafa (ver contradicción 1): wifi de fibra, sala de
espera, café/té/agua, "sala de cowork", "acceso 24/7", música ambiente, limpieza diaria.

## Cambio 12 — CTA final → pre-registro (líneas 274–293)

Reemplazar el contenido del bloque oscuro:

- H2: `Pre-registrarte es gratis. <span class="text-terracota">Reservar, cuando abramos.</span>`
- Bajada: `Dejá tu nombre y WhatsApp, te guardamos tu primera hora gratis y te avisamos apenas abrimos las puertas. Sin tarjeta, sin compromiso.`
- Botón primario: `Quiero mi primera hora gratis` → `href="/#registro"` (mantener estilos actuales del botón blanco).
- Link secundario debajo del botón: `o escribinos por WhatsApp` → `CONTACT.whatsappLink('Hola! Tengo una consulta sobre los precios de Espacio 1010.')`, `target="_blank"`, estilo link claro (`text-crema/70 underline` o similar).

PROHIBIDO: "Mirá la agenda real antes de comprometerte" (la agenda está vacía en
pre-apertura) y cualquier `href={SITE.agendaUrl}`.

## Cambio 13 — Limpieza final

- Verificar que no quede NINGUNA ocurrencia de: `SITE.agendaUrl`, `24/7`, `cowork`,
  `pack`, `Fundadores`, `30 personas`, `sin columnas`, `Tres formas`, `cambiás de plan`.
- Actualizar el comentario del frontmatter (líneas 7–8) si hace falta para reflejar
  el modelo real (hora suelta / fija semanal, descuentos 10%/20%).

---

## Propuestas DESCARTADAS (y por qué)

1. **H1 alternativo `$350 la hora. Sin letra chica, sin sorpresas.` (hallazgo 18):** descartado — el propio auditor dice que con el precio en la bajada (cambio 4) alcanza; el H1 actual conserva el tono de la home y un H1 que abre con un número es más débil emocionalmente.
2. **"Pregunta abierta" como bloque visible en la página sobre wifi/limpieza/café (hallazgo 13):** no se publica nada condicional — los ítems dudosos se quitan y la confirmación va al informe para Rafa, no al sitio.
3. **Mantener 3 cards de "modalidades" maquilladas:** descartado de plano — la app tiene exactamente 2 formas de reservar; cualquier tercera card es ficción.
4. **Veredictos del panel:** no se pudo aceptar ni descartar ninguno — el JSON llegó vacío (ver contradicción 4).

(Único hallazgo "bajo" aceptado: la foto real de la Sala Arcos — cambio 8 — porque
vuelve tangible el único precio premium de la página y la foto existe y es del lugar.)

---

## Contradicciones / pendientes para Rafa (revisar mañana, NO bloquean la spec)

1. **Prestaciones sin respaldo en la fuente de verdad:** wifi de fibra, limpieza diaria, música ambiente, sala de espera para pacientes y café/té/agua. Se QUITARON de "Qué incluye". Si Rafa confirma que son reales, re-agregarlas (el copy viejo está en git).
2. **Medios de pago:** la Ayuda de la app dice "transferencia o depósito BROU"; la fuente de verdad dice "transferencia BROU o depósito en Abitab/RedPagos". La spec sigue a la fuente de verdad (cambios 2 y 10) — confirmar el detalle exacto antes de considerar cerrado.
3. **Descuentos publicados con porcentajes exactos (10%/20%):** decisión de esta spec (coherente con "sin letra chica" y con que la app los muestra). Si Rafa prefiere solo umbrales, ajustar cambios 2 y 9.
4. **El JSON del panel de 3 lentes llegó sin sustituir (`${JSON}` literal) al sintetizador.** Las objeciones del panel NO están reflejadas. Revisar el orquestador y, si el panel objetó algo material, pasar una segunda pasada sobre esta spec.
5. **Cupón BIENVENIDA1010 con `cupo_reservas_por_usuario = null`:** la página promete "una hora sin cargo" — verificar en la app que el 100% aplique a UNA sola reserva (ya flaggeado en la fuente de verdad, abierto #4).
