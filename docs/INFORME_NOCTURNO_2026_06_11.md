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
2. **Espacios 04 y 15** — inactivos en DB con descripción placeholder. Los omití. ¿Van como "próximamente"?
3. **Nombres "Espacio 01/02/…"** — son los reales de la app y eso publiqué. Si querés nombres con marca, se cambian en `site.ts` + DB a la vez.
4. **Amenities/claims eliminados por no verificables** (decí cuáles son reales y los reincorporo): wifi de fibra "en todo el edificio", limpieza diaria, música ambiente, sala de espera para pacientes, café/té, iluminación LED regulable, "a 2 cuadras de líneas troncales", "aprobamos cuentas el mismo día", confirmación por mail, "casi siempre hay lugar para estacionar".
5. **¿Dónde espera un paciente que llega antes?** El flujo documentado es timbre/videoportero y la espera no está definida — puede generar fricción real en puerta.
6. **¿El código personal abre solo la puerta de calle o también cada espacio?** La web ahora solo afirma la puerta de calle.
7. **Atención humana por WhatsApp "L–S 9–20"** — quedó como estaba (no hay dato en la app que lo contradiga). Confirmalo.
8. **Publicamos los % de descuento por volumen (10/20%)** — antes el sitio no los decía. Si preferís solo "descuentos por volumen", se saca en `/precios` y FAQ.
9. **SEO de URLs**: los slugs viejos (`estudio-norte`, etc.) tienen 301 al espacio real más parecido o al índice. Si Google ya indexó fichas viejas, se va a reacomodar solo.

## Verificación
- `npm run build` ✅ (24 páginas, sitemap y OG regenerados).
- Verificador global: links internos OK, números consistentes entre páginas, redirects sin loops, sin términos prohibidos fuera de la home.
- Push a `main` → deploy automático de Vercel (revisá producción a la mañana).
