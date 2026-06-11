# Informe nocturno · 2026-06-10 → 06-11 · Actualización de todas las páginas (salvo la home)

> Sesión autónoma pedida por Rafa antes de dormir: actualizar todas las páginas del sitio
> excepto `/` (ya revisada), con foco en consistencia vs la home y vs la app real
> (`proyectos/espacio1010` + su DB de producción). Decisiones confirmadas por Rafa:
> **directo a main** (deploy) y **la app manda** en datos duros, con listado de
> contradicciones para revisar. Se usaron ~93 agentes en 2 rondas (auditoría → panel de
> 3 lentes → síntesis → árbitro global → implementación → consenso sobre lo implementado
> → verificación global). Detalle por página en [`docs/nocturna/`](./nocturna/) y datos
> de referencia en [`VERDAD_APP_2026_06_10.md`](./VERDAD_APP_2026_06_10.md).

## ⚠️ LO MÁS IMPORTANTE — corrección en la BASE DE PRODUCCIÓN de la app

**El cupón BIENVENIDA1010 estaba mal configurado: `cupo_reservas_por_usuario = NULL` (= sin límite).**
Con el RPC `calcular_descuento_cupon` verificado en producción, eso significaba que un usuario
registrado podía reservar **TODAS las horas que quisiera gratis hasta el 31/12/2026** (descuento
100% sin tope). El cierre de sesión de la app del 2026-06-02 documenta que la intención era `1`.
- Verifiqué que **nadie lo había usado aún en reservas** (0 reservas con cupón).
- **Lo corregí en producción**: `UPDATE cupones SET cupo_reservas_por_usuario = 1 WHERE codigo='BIENVENIDA1010'`.
- Rollback si lo querías así: volver el campo a `NULL` desde `/admin` o SQL.

## Qué cambió en el sitio (resumen)

**El cambio estructural: los espacios ahora son los REALES.** Los 12 de `site.ts` eran
placeholders ficticios de un sprint viejo (Estudio Norte/Sur, Consulta I–VII, Salón
Cobre/Roble). Ahora `ESPACIOS` refleja la tabla `consultorios` de producción: **7 activos
(Espacio 01, 02, 03, 11, 12, 13, 14) + Sala Arcos** ($700/h, CTA por WhatsApp, fuera del
flujo de la app), con capacidades, m², pisos, equipamiento y descripciones fieles a la DB.
Slugs nuevos (`/los-espacios/espacio-01` … `/los-espacios/sala-arcos`) con **redirects 301**
de los slugs viejos en `vercel.json`. Espacios 04 y 15 (inactivos, sin descripción real) se
omitieron.

Por página:
- **/como-funciona** — 5 pasos reales (antes 4): pre-registro c/hora gratis → tipos "Una vez"/"Todas las semanas" (8 h máx, 150 días) → precios → código personal + videoportero → **pago a mes vencido** (liquidación día 1, 10 días, descuentos por volumen). Cancelaciones alineadas a producción. FAQ reescrita sin inventos.
- **/precios** — Se eliminó la "Tarifa Fundadores" (scarcity falsa) → promo real (primera hora gratis). 2 modalidades reales (hora suelta / fija semanal), **descuentos por volumen publicados: 20 h+ → 10% ($315) · 40 h+ → 20% ($280)** (antes decía "los coordinás al crear tu cuenta", falso). Sección de pago a mes vencido. Sala Arcos corregida (25 sentados, 40 m², foto real).
- **/preguntas-frecuentes** — Categoría nueva "Pre-apertura" primero; corregidos 6 datos falsos (armario→caja rotulada, apertura "remota"→videoportero, sala de cowork→cocina y sala de estar de profesionales, etc.); política de cancelación exacta (gratis >24 h, 50% hasta 1 h, imposible <1 h, tope 20% fijas); horarios y descuentos agregados.
- **/el-lugar** — Ahora usa las **7 fotos reales** (antes una sola foto de la fachada EN OBRA con cartel). Schema con horario real.
- **/contacto** — Title/description SEO, schema ContactPage, fix del form (popup bloqueado en webviews ya no pierde el lead), copy de respuesta honesto.
- **/alquiler-consultorio-montevideo** — Destacados derivados de `ESPACIOS` reales (fuente única), links profundos a fichas, FAQ sin duplicar el FAQPage de /preguntas-frecuentes.
- **/para/[slug]** (6 nichos) — `nichos.ts` purgado de espacios ficticios y claims inventados (escritorios donde no hay, "pisos aptos", políticas de comida); recomienda espacios reales por DB; metas SEO ajustadas.
- **/privacidad + /404** — Dirección exacta, CTA consistente con la home, `robots.txt` corregido (el noindex de /privacidad necesitaba crawl).
- **Transversal** — Horario real "**todos los días, de 7 a 24 h**" en vez de "24/7" en todas las subpáginas + Schema.org (`HOURS`); CTAs unificados al pre-registro `/#registro` (antes varias páginas mandaban a la PWA salteando el cupón); términos prohibidos barridos; sitemap y OG regenerados con los slugs nuevos.
- **Footer compartido (afecta el render de la home)** — `info@espacio1010.uy` (no existe) → `hola@espacio1010.uy` en `LandingLayout.astro`. Único cambio que toca algo que la home muestra; el archivo `index.astro` no se modificó.

## 🔴 Contradicciones / decisiones para que revises

1. ✅ **RESUELTO (Rafa, 2026-06-11 de mañana)**: la comunicación oficial es **"12 espacios"** (los totales a futuro) y **"24/7"** (la app reserva de 7 a 24; la madrugada se coordina por WhatsApp, no es de libre reserva). Las subpáginas se realinearon a ese criterio el mismo día: "12 espacios" reinstalado en descripciones y pasos, `/los-espacios` presenta los 8 publicados como "los primeros que abren", y el horario se comunica como "El edificio funciona 24/7: por la app reservás de 7 a 24, la madrugada por WhatsApp" (Schema.org de vuelta a 24/7). La home quedó tal cual estaba — ya era consistente con este criterio.
2. ✅ **RESUELTO (Rafa, 2026-06-11)**: espacios 04 y 15 no se listan; alcanza con la línea "De los 12 espacios del edificio, estos son los primeros que abren".
3. ✅ **RESUELTO (Rafa, 2026-06-11)**: los nombres quedan como en la app ("Espacio 01"… "Sala Arcos"). Tema cerrado.
4. ✅ **RESUELTO (Rafa, 2026-06-11), repasado punto por punto**:
   - **Salas de espera: SÍ existen — son 2, una por piso**, cómodas, con sillones, agua, wifi, aire y música ambiente. El profesional le abre al paciente (en persona o por videoportero) y este espera en la que le quede cómoda. Incorporado a /como-funciona, FAQ, /precios, fichas y amenities. ⚠️ **Pendiente en la APP**: la Ayuda (`/app/ayuda`) no menciona las salas de espera (empuja "entrá en hora" sin alternativa) — actualizarla.
   - **Música ambiente**: real, en pasillos y salas de espera → amenities + FAQ de privacidad.
   - **Café/té/agua sin cargo**: real, en la cocina de profesionales (agua también en salas de espera) → amenities, fichas, /como-funciona.
   - **Aprobación de cuentas**: a mano, se comunica "**en pocas horas**" → /como-funciona paso 01.
   - **Quedan AFUERA por decisión**: "fibra" (todo Uruguay tiene fibra, no aporta), limpieza (no mencionarla), LED regulable, "2 cuadras de líneas troncales", confirmación por mail (la app solo comunica por WhatsApp).
5. ✅ **RESUELTO**: ver salas de espera en el punto 4.
6. ✅ **RESUELTO (Rafa, 2026-06-11)**: el código abre **solo la puerta de calle** — la web ya estaba correcta.
7. ✅ **RESUELTO (Rafa, 2026-06-11)**: **no se publica horario de atención** (es atención familiar, responden cuando pueden). Eliminado el "L–S 9–20" de /contacto, Schema.org y site.ts.
8. ✅ **RESUELTO (Rafa, 2026-06-11)**: los % de descuento quedan publicados con números (20 h+ → 10% · 40 h+ → 20%).
9. **SEO de URLs** (informativo, sin acción): los slugs viejos (`estudio-norte`, etc.) tienen 301 al espacio real más parecido o al índice. Si Google ya indexó fichas viejas, se reacomoda solo.

## Adenda — repaso final con Rafa (2026-06-11, antes de archivar la sesión)

- **FAQ corta de la home: queda SIN link a /preguntas-frecuentes** (decisión de Rafa, aunque la página ya está al día). No restaurarlo sin preguntarle.
- **Coordenadas exactas aplicadas**: pin oficial "Espacio 1010" en Google Maps (-34.9111051, -56.1769524, maps.app.goo.gl/fn3y6k5ujuxt56jn7) → `ADDRESS` en site.ts y Schema.org. El pin viejo estaba corrido ~600 m.
- **Favicons: resueltos** — los de `public/` ya son idénticos a los de la app (verificado por hash); era solo un comentario viejo.
- **Fotos de espacios decorados: sigue PENDIENTE** (confirmado por Rafa) — fichas, OG con foto, sacar "muy pronto", repoblar `consultorios.fotos`.
- **Espacios 04/15**: cuando se activen en la app, avisará para sumarlos a la web.
- **Tags GA4/Ads en GTM**: la agencia ya está trabajando en eso.
- Pendientes de la app (logo, T&C formal, cron liquidaciones) quedan en su propio repo.

## Verificación
- `npm run build` ✅ (24 páginas, sitemap y OG regenerados).
- Verificador global: links internos OK, números consistentes entre páginas, redirects sin loops, sin términos prohibidos fuera de la home.
- Push a `main` → deploy automático de Vercel (revisá producción a la mañana).
