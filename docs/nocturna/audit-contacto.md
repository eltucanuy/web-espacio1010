# Auditoría nocturna — /contacto (2026-06-10)

**Archivos auditados:** `src/pages/contacto.astro`, `src/components/ContactForm.tsx` (+ dependencias compartidas que afectan la página: `src/lib/site.ts`, `src/lib/schema.ts`, `src/layouts/BaseLayout.astro`).

**Fuente de verdad:** `docs/VERDAD_APP_2026_06_10.md`. Referencia de tono: home (`src/pages/index.astro`, no se toca).

---

## Verificación del foco pedido (lo que está BIEN — no tocar)

- **WhatsApp**: el form arma `https://wa.me/59899001303?text=...` (`contacto.astro:8` deriva de `CONTACT.whatsappLeads = '+59899001303'` en `site.ts:35`; `ContactForm.tsx:70` lo usa). Display "099 001 303" (`site.ts:36`) correcto. Es el número de atención humana de la fuente de verdad. **El número del bot (099 210 0964) NO aparece en ningún lado del sitio** — verificado con grep. ✅
- **Email**: `hola@espacio1010.uy` (`site.ts:38`, card en `contacto.astro:71-82`). Coincide con la app. ✅
- **Instagram**: `https://www.instagram.com/espacio1010.uy/` / `@espacio1010.uy` (`site.ts:44-47`, card en `contacto.astro:104-117`). Coincide. ✅
- **A dónde manda el form**: no tiene backend; arma el mensaje y abre WhatsApp al 099 001 303 con `window.open` (`ContactForm.tsx:63-73`). El microcopy "No guardamos tus datos hasta que vos los mandes" (`ContactForm.tsx:170`) es honesto y correcto. ✅
- **Dirección**: Gaboto 1010, entre Isla de Flores y San Salvador, Parque Rodó (`site.ts:20-31`) — coincide con la fuente de verdad. ✅

---

## Hallazgos

### 1. [CRÍTICO] La página no tiene NINGÚN CTA de pre-registro

- **Dónde:** `src/pages/contacto.astro` (toda la página: hero líneas 16-31, form 33-48, aside 51-119).
- **Qué pasa:** la estrategia de CTAs (VERDAD §"Estrategia de CTAs") exige que el CTA primario de TODAS las páginas sea el pre-registro (`/#registro`) con primera hora gratis mientras dure el pre-lanzamiento. /contacto es la única puerta de salida del funnel que no menciona ni una vez la primera hora gratis ni el pre-registro: quien cae acá desde el nav o desde Google solo puede irse a WhatsApp/email. Se pierde la conversión principal.
- **Propuesta concreta:** agregar un banner de pre-registro arriba del aside (o como primera card del aside sticky), con este copy:

  > **¿Todavía no te pre-registraste?**
  > Es gratis, sin tarjeta y sin compromiso: te guardamos tu primera hora gratis para usarla cuando quieras durante 2026.
  > [Quiero mi primera hora gratis] → `/#registro`

  Botón con el mismo estilo terracota de la home (`bg-terracota rounded-full`). Mantener WhatsApp como secundario (ya está bien resuelto con el form).

### 2. [ALTO] Horario de atención humana: incoherente en la meta y ausente en la página

- **Dónde:** `src/pages/contacto.astro:13` (description), `contacto.astro:26-28` (intro), `src/lib/site.ts:53` (`humanSupport: 'Lunes a sábado, 9 a 20 hs'`), `src/lib/schema.ts:71-77` (`hoursAvailable` lunes a sábado 09–20).
- **Qué pasa:** la meta description dice "Te respondemos por WhatsApp **todos los días** en horario comercial", pero el dato canónico del sitio (HOURS + schema que emite esta misma página vía BaseLayout) es **lunes a sábado, 9 a 20 h**. Además, el cuerpo de la página dice dos veces "en horario comercial" sin decir nunca cuál es — justo en la página de contacto, donde el usuario quiere saber cuándo le van a responder.
- **Propuesta concreta:**
  - Description (`contacto.astro:13`): `"Coordiná visita, resolvé dudas o pedí info sobre precios y disponibilidad. Te respondemos por WhatsApp de lunes a sábado, de 9 a 20 h."`
  - Intro (`contacto.astro:26-28`): `"WhatsApp es nuestro canal principal — respondemos rápido, de lunes a sábado de 9 a 20 h. Si preferís mail, también va. La visita se coordina sin compromiso."`
  - Card "WhatsApp directo" (`contacto.astro:55-57`): agregar debajo: `"Atendemos de lunes a sábado, de 9 a 20 h. Fuera de ese horario, dejá tu mensaje y te respondemos al día siguiente."`
  - Idealmente leer el dato de `HOURS.humanSupport` en vez de hardcodearlo, para que no vuelva a divergir.

### 3. [ALTO] El select "Profesión" del form incluye "Homeopatía" (no existe en la app) y omite profesiones reales

- **Dónde:** `src/components/ContactForm.tsx:15-27` (array `PROFESIONES`).
- **Qué pasa:** "Homeopatía" **no está** en la `profesiones_lista` de la app (VERDAD §"Público objetivo") — es un dato no respaldado por la fuente de verdad. A la vez faltan profesiones reales del público objetivo con buen volumen: fonoaudiología, psicomotricidad, terapia ocupacional, kinesiología, sexología, arteterapia, etc. La lista del form es la primera "promesa" de a quién recibe el espacio.
- **Propuesta concreta** (reemplazar el array, alineado a la app pero agrupado para que el select no sea eterno):

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

  Notar que se elimina "Homeopatía" (quien la ejerza cae en "Terapias holísticas" u "Otra"). "Taller o grupo" ya está cubierto por el select "Tipo de consulta", pero "Docente / Tallerista" es una profesión real de la lista de la app y conviene mantenerla.

### 4. [MEDIO] Schema LocalBusiness (emitido también por esta página) declara `paymentAccepted: 'Cash, Credit Card, Bank Transfer'` — la tarjeta es FALSA

- **Dónde:** `src/lib/schema.ts:47` (sale en el `<head>` de /contacto vía `BaseLayout.astro:48,89`).
- **Qué pasa:** la app NO acepta tarjeta (VERDAD §"Precios y pagos": transferencia BROU o depósito Abitab/RedPagos; "Sin tarjeta" es además un argumento de venta de la home). Google puede mostrar "acepta tarjeta de crédito" en el panel del negocio.
- **Propuesta concreta:** `paymentAccepted: 'Cash, Bank Transfer'` (la transferencia y el depósito en redes de cobranza quedan razonablemente cubiertos; no inventar un valor no estándar).

### 5. [MEDIO] Schema: `sameAs` vacío teniendo Instagram real, y `openingHoursSpecification` 24/7 vs horario real 7–24

- **Dónde:** `src/lib/schema.ts:62-69` (00:00–23:59 todos los días) y `schema.ts:79-81` (`sameAs: []` con comentario "Cuando exista IG real, agregarlo").
- **Qué pasa:** (a) el IG real existe (`SOCIAL.instagram`) y la propia página /contacto lo publica — el `sameAs` vacío es una oportunidad SEO regalada; (b) el 24/7 del schema contradice el horario reservable real (7 a 24 h). El claim "24/7" de la home está flaggeado como tema abierto y la home no se toca, pero el schema es global y se puede corregir sin tocar la home.
- **Propuesta concreta:** `sameAs: [SOCIAL.instagram]` (import desde `site.ts`). Para el horario, cambiar `opens: '07:00', closes: '24:00'` en `openingHoursSpecification` — **decisión que conviene confirmar con Rafa** porque interactúa con el tema abierto "24/7 de la home" (VERDAD §"Abierto" punto 2). Como mínimo, dejarlo listado en el informe.

### 6. [MEDIO] No hay mapa embebido de Gaboto 1010 (la home sí lo tiene)

- **Dónde:** `src/pages/contacto.astro:84-102` (card "Visitanos": solo dirección en texto + link "Ver en mapa").
- **Qué pasa:** la página de contacto es donde más se espera un mapa, y solo ofrece un link saliente. La home ya resolvió el patrón con un iframe embed (`index.astro:433-443`). El link `mapsUrl` con query textual (`site.ts:30`) funciona bien y no depende de coordenadas.
- **Propuesta concreta:** debajo del grid (o al pie de la card "Visitanos"), reutilizar el mismo embed de la home:

  ```html
  <iframe
    title="Mapa de Espacio 1010 — Gaboto 1010, Montevideo"
    src="https://www.google.com/maps?q=Gaboto%201010%20Montevideo%20Uruguay&output=embed"
    width="100%" height="280" loading="lazy"
    referrerpolicy="no-referrer-when-downgrade" style="border:0; display:block;"
  ></iframe>
  ```

  Acompañado de: `"Zona con estacionamiento NO tarifado · bien conectada en bus."` (mismo copy de la home, refuerza un diferencial real).

### 7. [MEDIO] Coordenadas `geo` del schema siguen marcadas como "aproximadas — verificar"

- **Dónde:** `src/lib/site.ts:27-29` (`lat: -34.9094, lng: -56.1834`, comentario "verificar con Google Maps real antes del launch") + `site.ts:26` (postalCode '11200' "confirmar con Rafa"). Salen en el JSON-LD de /contacto.
- **Qué pasa:** deuda señalada en el propio código que nunca se saldó; si las coords están corridas, Google puede ubicar el pin en otra cuadra. No se puede resolver esta noche sin verificación externa.
- **Propuesta concreta:** tarea para Rafa/agencia: abrir Google Maps en Gaboto 1010, copiar lat/lng exactas y el CP real, y actualizar `site.ts`. Mientras tanto el embed por query textual (hallazgo 6) es seguro porque no usa las coordenadas.

### 8. [BAJO] "Visitanos" en pre-apertura puede generar visitas espontáneas a un local cerrado

- **Dónde:** `src/pages/contacto.astro:85-90` (card "Visitanos").
- **Qué pasa:** el negocio abre en junio 2026 y todavía está en pre-apertura; la card invita a "visitar" sin aclarar que la visita se coordina antes (el hero sí lo dice, pero lejos). Riesgo menor de que alguien se aparezca y encuentre cerrado.
- **Propuesta concreta:** agregar una línea en la card: `"Estamos en pre-apertura: escribinos por WhatsApp y coordinamos tu visita sin compromiso."`

### 9. [BAJO] Cero fotos reales en la página — oportunidad de confianza gratis

- **Dónde:** `src/pages/contacto.astro` (no hay ninguna imagen en toda la página).
- **Qué pasa:** hay 7 fotos reales de áreas comunes en `public/fotos/lugar-*.webp` ya optimizadas y con buen alt en la home. Contacto es una página de confianza ("quiénes son, dónde están") y hoy es 100% texto.
- **Propuesta concreta:** agregar una foto en la card "Visitanos" (arriba de la dirección), p.ej. `/fotos/lugar-fachada.webp` con `alt="Fachada de Espacio 1010 en Gaboto 1010, de noche"` y `loading="lazy"`. Alternativa: `lugar-pasillo.webp` si se prefiere interior.

### 10. [BAJO] La description menciona "visita guiada" — concepto no documentado en la fuente de verdad

- **Dónde:** `contacto.astro:13` y `:27-28`, `ContactForm.tsx:33` (opción "Visita guiada al lugar"), `og/[slug].ts:43`.
- **Qué pasa:** la fuente de verdad no menciona visitas guiadas (la app tampoco); sí hay evidencia indirecta de que se hacen (testimonios de la home visitaron el lugar, y el schema la describe). No parece falso, pero es el único "servicio" prometido en la página que no tiene respaldo documental.
- **Propuesta concreta:** confirmar con Rafa que las visitas coordinadas siguen ofreciéndose en pre-apertura. Si sí, no cambiar nada (o suavizar a "visita" a secas, como en la propuesta del hallazgo 2). Si no, quitar la opción del select y de la meta.

---

## Notas globales que afectan a /contacto pero se resuelven en componentes compartidos

- `SITE.description` (footer de esta página + schema) dice "24/7" — parte del tema abierto #2 de la fuente de verdad; no tocar unilateralmente.
- El Floating WhatsApp y el footer usan el número correcto (`CONTACT.whatsappLink()` → 59899001303). Sin hallazgos.

## Resumen de prioridades

| # | Gravedad | Hallazgo |
|---|----------|----------|
| 1 | Crítico | Sin CTA de pre-registro (primera hora gratis) en toda la página |
| 2 | Alto | Horario de atención humana incoherente (meta "todos los días" vs lun–sáb 9–20) y ausente del cuerpo |
| 3 | Alto | "Homeopatía" en el select de profesiones (no existe en la app) + faltan profesiones reales |
| 4 | Medio | Schema declara que se acepta tarjeta de crédito (falso) |
| 5 | Medio | `sameAs` vacío con IG real existente; schema 24/7 vs 7–24 |
| 6 | Medio | Falta mapa embebido de Gaboto 1010 (la home ya tiene el patrón) |
| 7 | Medio | Coordenadas geo del schema sin verificar (deuda marcada en código) |
| 8 | Bajo | "Visitanos" sin aclarar pre-apertura/coordinación previa |
| 9 | Bajo | Página sin fotos reales (hay 7 disponibles) |
| 10 | Bajo | "Visita guiada" sin respaldo en fuente de verdad (confirmar con Rafa) |
