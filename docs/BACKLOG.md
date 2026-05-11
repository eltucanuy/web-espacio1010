# Backlog post-launch — web_espacio1010

Mejoras propuestas durante el sprint inicial (2026-05-10) que **no** entraron en v1. Ordenadas por categoría. La idea es ir comiéndolas en sprints cortos después del soft launch, no apurarlas antes de tener tráfico real.

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
