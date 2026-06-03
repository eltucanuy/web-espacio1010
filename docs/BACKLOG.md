# Backlog post-launch — web_espacio1010

> ## 🔄 Actualización 2026-06-03 — sesión CRO (leer primero)
> Sesión de optimización de conversión de la home — ver [`HANDOFF_2026_06_03.md`](./HANDOFF_2026_06_03.md). Se ejecutaron ~10 palancas de conversión + extras, todo en producción.
>
> **Resuelto esta sesión (de la lista "diferenciales fuertes sin comunicar" de abajo y del backlog):**
> - ✅ **Cuenta corriente "te fiamos"** → ahora es un diferencial humanizado ("Confiamos en vos desde el día 1") en "Pensado para que digas que sí".
> - ✅ **Cancelación de fijas** → bloque protagonista con hook empático ("A vos también te cancelan…") + escalera visual (gratis +24h / 50% hasta 1h) + tope mensual en positivo. **Nota:** se comunica el tope de forma genérica ("cancelaciones sin cargo todos los meses"), sin el número "1 de cada 5"; Rafa confirmó que la fórmula real es 1 de 5.
> - ✅ **Testimoniales reales** (#8) → 4 profesionales que pre-reservaron, aprobados, con framing de pre-apertura.
> - ✅ **Floating WhatsApp** (ya estaba) + **barra CTA sticky mobile** nueva.
> - ✅ Hero, jerarquía visual, seguridad, validación de tel UY, pantalla de éxito full-screen, reenvío de UTMs a la PWA, title/OG alineados.
>
> **Sigue pendiente:** fotos reales de los espacios (desbloquean OG con foto + re-OK de testimonios), medición `cuenta_creada` en GTM/Ads (agencia), confirmar 9 vs 12 espacios. Detalle en el handoff §8.
>
> ---

> ## 🔄 Actualización 2026-06-02 — leer primero
> El sitio cambió fuerte esta sesión (ver [`HANDOFF_2026_06_02.md`](./HANDOFF_2026_06_02.md)). La home es ahora una **landing de conversión** con form que guarda leads en Supabase y manda al registro de la PWA con el cupón `BIENVENIDA1010`.
>
> **Ya resuelto (no estaba en v1):**
> - ✅ Precios reales ($350/h · $700 Sala Arcos) en todo el sitio.
> - ✅ WhatsApp real (099 001 303) e Instagram real (`@espacio1010.uy`).
> - ✅ Form → backend: la home postea leads a Supabase (`pre_registros`).
> - ✅ Design system migrado a Inter + blanco/gris (se cerró el tema Belgiano/Cormorant).
> - ✅ Barrio corregido: "Cordón" → "entre Palermo y Parque Rodó".
> - ✅ Los dos diferenciales fuertes ya aparecen en el sitio (cuenta corriente / "1 de cada 5 fijas") — queda explotarlos más en la home (ver abajo).
>
> **Pendiente real ahora:** tags dentro de GTM (Meta Pixel + Google Ads sobre `lead_preregistro`), fotos profesionales de los espacios, confirmar 9 vs 12 espacios, coordenadas/postal exactos. Detalle en el handoff §7.
>
> Lo de abajo es el backlog histórico del sprint inicial (2026-05-10), se mantiene como contexto.

---

Mejoras propuestas durante el sprint inicial (2026-05-10) que **no** entraron en v1. Ordenadas por categoría. La idea es ir comiéndolas en sprints cortos después del soft launch, no apurarlas antes de tener tráfico real.

---

## 🔥 Para charlar próxima sesión — diferenciales fuertes sin comunicar

Rafa los mencionó después del sprint A+B+C. No están en ninguna parte del sitio actual y son ENORMES como argumento de venta. Hay que discutir cómo incorporarlos para que respiren con el posicionamiento premium + confianza.

### 1. Cuenta corriente desde el primer día — "te fiamos, confiamos en vos"

**Lo que es**:
- Pagás a mes vencido (no por adelantado, no pedimos tarjeta)
- Liquidación mensual generada día 1, vence día 10
- Esto **ya existe** en la PWA (tablas `liquidaciones` + `pagos_liquidacion` en Supabase) pero el sitio no lo cuenta como diferencial

**Por qué es enorme**:
- La competencia típicamente cobra por adelantado, retiene tarjeta o exige seña.
- "Te fiamos desde día 1" es un statement de confianza inusual en B2B y carga la marca de premium + comunidad.
- Encaja perfecto con "Tarifa Fundadores" — refuerza el mensaje "elegimos a las personas, no a su tarjeta".

**Cómo encajarlo (ideas a discutir)**:
- **Diferencial dedicado** en la sección Diferenciales de la landing: "Cuenta corriente desde el día uno". Hoy son 5, sería el 6º o reemplazar uno.
- **Microcopy en `/precios`**: arriba de la grilla de planes, banner tipo "Pagás a mes vencido. Sin tarjeta. Sin adelanto. Te fiamos porque confiamos en vos."
- **Sección propia** en `/como-funciona` después del paso 4: "Y al final de mes te liquidamos lo usado. Pagás cuando podés cobrar."
- **Microcopy en `/contacto`** y formularios: refuerzo que no se pide info de pago en el registro.

**Cuidado / refutación posible**:
- Si abusamos del mensaje "te fiamos" suena a regalo. Mejor enmarcarlo como **"confianza profesional mutua"**, no como "regalo".
- Sugerencia de copy: "Profesionales serios. Reglas serias. Sin trámites de tarjeta para empezar."

### 2. Política de cancelación de fijas — "1 de cada 5, gratis. Como hacés vos."

**Lo que es**:
- 20% de tope mensual de cancelaciones gratis en reservas fijas (existe en config `tope_cancelaciones_fijas_pct = 20`).
- Es decir: si tenés serie fija de 4 reservas/mes, cancelás 1 sin cargo. Si tenés 10, cancelás 2. Si tenés 20, cancelás 4.

**El insight que lo hace memorable** (Rafa lo bajó):
> "Es **lo mismo que tus pacientes te hacen a vos**: cancelan a último momento y vos no les cobrás todas las veces. Acá te devolvemos esa flexibilidad."

Este framing es ORO. Reframes una métrica fría (20% tope) en un emocional ("entendemos cómo funciona tu profesión").

**Cómo encajarlo (ideas a discutir)**:
- **En la sección Diferenciales**: reemplazar o complementar "Cancelaciones flexibles" con copy específico:
  > "**1 de cada 5 fijas, gratis.** Tus pacientes te cancelan a último momento. Nosotros tampoco te cobramos la primera de cada cinco."
- **En `/como-funciona`**, sección política de cancelaciones: agregar el bloque comparativo "para fijas".
- **En `/precios`**, plan "Fija mensual": destacar como bullet visible "1 de cada 5 sesiones cancelable sin cargo".
- **Posible micropieza copy en hero**: "Te cancelan los pacientes. A vos también te dejamos cancelar."

**Cuidado / refutación posible**:
- Verificar que el tope sea realmente **proporcional 1-de-cada-5** y no un cap absoluto (ej: máximo 4 cancelaciones gratis al mes sin importar el volumen). Si es cap fijo, el copy "1 de cada 5" puede ser engañoso para quien tiene más fijas.
- **Acción pendiente**: confirmar con Rafa la fórmula exacta antes de publicar.

---

## Síntesis: por qué estos dos diferenciales cambian el juego

El posicionamiento actual del sitio gira en **autogestión + ubicación + diseño**. Sumar estos dos sube el eje a **confianza + entender al profesional**:

| Eje | Mensaje actual | Mensaje con los nuevos |
|---|---|---|
| Funcional | "Reservás online, 24/7" | (igual) |
| Económico | "Cancelás 24h sin cargo" | "Y además 1 de cada 5 fijas. Y pagás a mes vencido." |
| Emocional | "Pensado para profesionales" | "Confiamos en vos. Sabemos cómo funciona tu profesión." |

Hay que discutirlo antes de meterlo en código porque toca el balance del messaging — si lo metemos sin cuidado se sobrecarga el hero. Lo ideal: redistribuir mensajes existentes para hacerle lugar a estos dos sin diluir lo que ya funciona.

---

## A · Polish visual "alucinante" (sin necesitar fotos)

- [ ] **Motion + scroll animations** — fade-in con stagger en grids, parallax sutil en hero, números que se animan al entrar viewport, reveal por sección con IntersectionObserver. Eleva la sensación premium fuerte sin tocar contenido.
- [ ] **Lenis smooth scroll** — el scroll "manteca" tipo agencia top. ~5 líneas.
- [ ] **View Transitions API** — navegación entre páginas tipo app, manteniendo SEO estático. Astro lo soporta nativo (`ClientRouter`).
- [ ] **Placeholders editoriales más ricos** — hoy son gradientes simples. Componer mood-boards tipográficos (textura papel + número grande + cita + acento terracota) que parezcan "intencionalmente sin foto" en vez de "esperando foto".
- [ ] **Cursor decorativo + hover effects** sutiles en cards de espacios (magnetic hover, glow terracota).

**Estimación**: 2-3 hs.

---

## B · Conversion boosters

- [ ] **Mini-buscador demo embebido en landing** — mockup visual del buscador real con horarios fake plausibles ("Sala Subsuelo · Sábado 14 hs · disponible"). CTA "Crear cuenta para reservar". Sin backend todavía. Pre-vende la experiencia. **Killer feature** según mi opinión.
- [ ] **Floating WhatsApp button mobile** — sticky bottom-right siempre visible. Convierte muchísimo en Uruguay.
- [ ] **Quiz "Qué espacio te conviene"** — 3 preguntas (profesión, capacidad, recurrencia) → recomienda 1-2 espacios + CTA reservar. Convierte alto en sitios B2B-ish con catálogo.
- [ ] **Sección "Antes / Después" del edificio** — narrativa storytelling timeline ("1925: construcción", "2018: abandono", "2026: reapertura"). Sin foto, sólo tipografía + dates + cita. Hook editorial fuerte.
- [ ] **Form "Avisame cuando abran"** — captura leads pre-launch. Aunque haya WhatsApp form, este captura a los que no quieren hablar todavía. Útil ahora (pre-apertura).

**Estimación**: 3-4 hs.

---

## C · SEO profundo

- [ ] **Generación automática de OG image por página** con `astro-og-canvas` o similar. Cada URL tiene su OG personalizada con título + acento marca.
- [ ] **Schema.org BreadcrumbList** en todas las páginas con breadcrumbs visibles (espacios/[slug], para/[slug]).
- [ ] **Long-tail expansion en `/para/[nicho]`** — sub-pages tipo `/para/psicologos/cordón`, `/para/psicoanalistas` con keywords específicas.
- [ ] **Página geo `/cordón-sur`** o `/montevideo/alquiler-consultorio` — captura "alquiler consultorio Cordón", "espacio terapia Montevideo".
- [ ] **404 custom** SEO-friendly con redirects sugeridos a las páginas más relevantes.
- [ ] **Performance audit profundo**: preload de fonts críticas (subset latin-ext), critical CSS inlined, lazy-load explícito de SVGs grandes.
- [ ] **Schema OpeningHours** más preciso si separamos "edificio 24/7" vs "atención humana lun-sáb 9-20".

**Estimación**: 3 hs.

---

## D · Coverage / scaffolding extra

- [ ] **`/campanas/[slug]` template** — base de landings de ads. Ya está noindex en sitemap. Crear el layout para que la agencia copie-pegue.
- [ ] **`/blog` stub** con 1 post de ejemplo + sistema de tags + Content Collections. Listo para fase 2 sin armar infra después.
- [ ] **CMS visual** (Decap CMS) — interfaz markdown editable sin código. Útil si delegás contenido.
- [ ] **Página `/sobre-nosotros`** — quién está atrás (Rafa, el equipo). E-E-A-T para Google + confianza para profesionales sensibles (psiquiatras).
- [ ] **Política de privacidad + términos de uso** stubs — requeridos legalmente. Plausible los necesita aunque no use cookies.
- [ ] **Página `/visita`** — landing dedicada para coordinar visita guiada. Útil para Ads de "Conocé el lugar".

**Estimación**: 2-3 hs.

---

## E · Backend / integraciones (cuando haya endpoint disponible)

- [ ] **Mini-buscador con datos reales** — embeber lectura de disponibilidad de la PWA. Requiere endpoint público read-only de Supabase. Coordinar con repo `espacio1010`.
- [ ] **Form de contacto → Supabase** — persistir leads en tabla aunque no terminen el envío WhatsApp.
- [ ] **Email transaccional** post-form (Resend) — confirmación al usuario + alerta interna.
- [ ] **Newsletter / Mailchimp signup** — para los que se anotaron pre-launch.

**Estimación**: depende de qué se conecta.

---

## Pendientes bloqueantes para producción (ya estaban en README)

- [ ] Confirmar 9 vs 12 espacios — la PWA dice 9, el sitio dice 12.
- [ ] Precios reales reemplazando los `TBD` visibles.
- [ ] Números reales de WhatsApp (las dos líneas).
- [ ] @instagram real de Espacio 1010.
- [ ] Fotos profesionales del edificio.
- [ ] Testimoniales reales.
- [ ] OG image PNG 1200×630 (exportar el SVG existente).
- [ ] Decisión: licenciar Belgiano Serif o quedarnos con Cormorant Garamond.
- [ ] Coordenadas exactas en `ADDRESS.lat/lng`.
- [ ] Código postal exacto del Cordón sur.

---

## Mi recomendación de orden post-launch

Una vez que el sitio esté vivo con tráfico real:

1. **Semana 1 post-launch**: meter A (polish visual) + B #7 (floating WhatsApp) + D #21 (privacidad/términos legal).
2. **Semana 2-3 post-launch**: B #6 (mini-buscador demo) + métricas reales para validar conversión.
3. **Mes 1**: C (SEO depth) si el tráfico orgánico empieza a importar.
4. **Cuando haya fotos**: regenerar visuales + foto-narrativa real, descartar placeholders editoriales.

No tocar D #18 (blog) hasta que haya tracción y caso claro de qué postear.
