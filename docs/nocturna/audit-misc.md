# Auditoría nocturna — /privacidad + /404

> Sesión nocturna 2026-06-10/11. Auditor: misc (privacidad + 404).
> Fuente de verdad: `docs/VERDAD_APP_2026_06_10.md`. La home (`src/pages/index.astro`) es referencia de tono y NO se toca.
> Archivos auditados: `src/pages/privacidad.astro`, `src/pages/404.astro` (+ lo que estas páginas heredan de `LandingLayout.astro`, `BaseLayout.astro`, `src/lib/schema.ts`, `src/lib/site.ts`).

---

## A. /privacidad (`src/pages/privacidad.astro`)

### 1. [CRÍTICO] "Nada más" es falso: el form guarda más datos que nombre/apellido/WhatsApp

- **Dónde:** `src/pages/privacidad.astro:26` — «te pedimos **nombre, apellido y número de WhatsApp**. Nada más.»
- **Realidad verificada:** el form de pre-registro (`src/pages/index.astro:671-683`) inserta en Supabase `pre_registros`: `nombre, apellido, telefono, origen: 'landing', utm_source, utm_medium, utm_campaign`. Además reenvía las UTMs a la PWA (`index.astro:654-658`).
- **Problema:** la política de privacidad —el documento legal de transparencia exigido por la ley 18.331— afirma explícitamente algo que el código contradice. Es el peor lugar del sitio para tener un dato falso.
- **Propuesta (reemplazar el bloque "Qué datos recogemos", línea 24-27):**

  > **Qué datos recogemos**
  > Cuando te pre-registrás en este sitio te pedimos **nombre, apellido y número de WhatsApp**. Junto con eso guardamos, si existen, los parámetros de campaña con los que llegaste (por ejemplo, si viniste desde un anuncio), para saber qué canales funcionan. Nada más.

### 2. [CRÍTICO] No se menciona la medición con cookies (GA4, Clarity, Meta Pixel vía GTM, Plausible)

- **Dónde:** falta una sección entera en `src/pages/privacidad.astro` (entre líneas 27 y 44 no hay nada sobre cookies/analítica).
- **Realidad verificada:** ambos layouts cargan `Analytics.astro`, que inyecta **GTM** (desde donde la agencia activa **GA4, Microsoft Clarity y Meta Pixel** — Clarity confirmado instalado en commit `2595c7a`) y **Plausible**. Decisión firme y documentada: **sin cookie banner** (`Analytics.astro:13-15`, memoria del proyecto). Esta auditoría NO sugiere banner — pero justamente por no haber banner, la política de privacidad es el único lugar donde se informa, y hoy no informa nada.
- **Problema:** transparencia incompleta bajo la ley 18.331 + incoherencia: la política dice "nombre, apellido, WhatsApp y nada más" mientras el sitio corre tres herramientas de medición con cookies.
- **Propuesta (sección nueva después de "Por cuánto tiempo"):**

  > **Cookies y medición**
  > Para entender cómo se usa el sitio y medir nuestras campañas usamos herramientas de analítica de terceros (Google Analytics, Microsoft Clarity y Meta) que pueden instalar cookies en tu navegador, y Plausible, que no usa cookies. Estos datos son estadísticos y de navegación: no incluyen lo que escribís en el formulario salvo el hecho de que lo enviaste. Si preferís evitarlas, podés bloquear las cookies de terceros desde la configuración de tu navegador y el sitio va a seguir funcionando igual.

### 3. [ALTO] El responsable del tratamiento no es "Espacio 1010": es Excalibur SAS

- **Dónde:** `src/pages/privacidad.astro:41-43` — «**Responsable** — Espacio 1010 — Gaboto 1010, entre Palermo y Parque Rodó, Montevideo, Uruguay.»
- **Realidad:** "Espacio 1010" es nombre comercial; la razón social (persona jurídica responsable ante la ley 18.331) es **Excalibur SAS** (RUT 218933620018). El propio footer de la página ya dice «© 2026 Espacio 1010 · Excalibur SAS» (`LandingLayout.astro:132`) — la política queda incoherente hasta con su propio footer.
- **Propuesta (reemplazar línea 42):**

  > El responsable del tratamiento de tus datos es **Excalibur SAS** (Espacio 1010). Punto de contacto: Gaboto 1010, entre Palermo y Parque Rodó, Montevideo, Uruguay.

  (No publicar el domicilio fiscal Emilio Reus 2446 — no es la dirección del local; con la razón social + punto de contacto alcanza.)

### 4. [MEDIO] "No vendemos ni cedemos tus datos a terceros" es impreciso: hay encargados de tratamiento

- **Dónde:** `src/pages/privacidad.astro:30`.
- **Problema:** los datos del lead viven en Supabase y la medición pasa por Google/Microsoft/Meta. No es "cesión" en sentido legal (son proveedores/encargados), pero la frase absoluta queda débil si alguien pregunta dónde se alojan los datos. Mejor decirlo bien una vez.
- **Propuesta (reemplazar el final del párrafo de la línea 30):**

  > Únicamente para contactarte respecto de tu pre-registro en Espacio 1010, ayudarte a completar tu cuenta y coordinar el beneficio de tu primera hora gratis. No vendemos tus datos ni los compartimos con terceros para sus propios fines; solo usamos proveedores tecnológicos que los procesan por cuenta nuestra (por ejemplo, donde se aloja la base de datos).

### 5. [MEDIO] Falta mencionar a la URCDP como vía de reclamo

- **Dónde:** `src/pages/privacidad.astro:37-39` (sección "Tus derechos").
- **Problema:** la ley 18.331 prevé el reclamo ante la Unidad Reguladora y de Control de Datos Personales. Mencionarla es estándar en políticas uruguayas y suma seriedad/confianza (señal de que no es un texto copiado de otro país).
- **Propuesta (agregar al final del párrafo de la línea 38):**

  > Si entendés que no respondimos bien, también podés reclamar ante la Unidad Reguladora y de Control de Datos Personales (URCDP) de Uruguay.

### 6. [BAJO] Email del footer visible en /privacidad: `info@espacio1010.uy` vs el real `hola@espacio1010.uy`

- **Dónde:** `src/layouts/LandingLayout.astro:131` (footer que renderiza /privacidad y la home).
- **Realidad:** la fuente de verdad y `CONTACT.email` dicen **hola@espacio1010.uy**. El footer hardcodea `mailto:info@espacio1010.uy`. En la página donde se invita a escribir "por email a hola@..." (línea 38 de privacidad), el footer de la misma pantalla muestra otro email. Si `info@` no existe, se pierden correos.
- **Propuesta:** en `LandingLayout.astro:131` usar `CONTACT.email` (texto y mailto): `hola@espacio1010.uy`. (Toca la home solo en el footer compartido — si se considera "tocar la home", dejarlo flaggeado para Rafa en vez de aplicarlo.)

### 7. [BAJO] Schema LocalBusiness con datos falsos se inyecta también en /privacidad

- **Dónde:** `src/lib/schema.ts:47` (`paymentAccepted: 'Cash, Credit Card, Bank Transfer'` — **no se acepta tarjeta**: transferencia BROU o Abitab/RedPagos) y `schema.ts:62-69` (horario 00:00–23:59 vs real 07–24). También `SITE.description` ("24/7") como meta description por defecto.
- **Nota:** el fix es en archivos compartidos (lo cubre el auditor de layouts/home si existe); lo dejo registrado porque /privacidad y /404 lo emiten. Al ser ambas `noindex`, el impacto SEO acá es menor — pero el dato falso de "Credit Card" conviene corregirlo donde vive: `paymentAccepted: 'Cash, Bank Transfer'`.

### 8. [BAJO] `noindex` en /privacidad: aceptable, dejar como está

- **Dónde:** `src/pages/privacidad.astro:15`.
- **Evaluación:** correcto para una página legal en pre-lanzamiento; no compite por ninguna keyword y evita que Google la muestre como resultado de marca. No cambiar. (Si algún día se quiere indexar por confianza, basta quitar el flag.)

---

## B. /404 (`src/pages/404.astro`)

### 9. [ALTO] "12 espacios" dos veces — dato en discrepancia abierta, prohibido en subpáginas

- **Dónde:** `src/pages/404.astro:10` (meta description: «Pero hay 12 espacios esperándote») y `404.astro:28` («Pero hay 12 espacios esperándote a la vuelta de la esquina»).
- **Realidad:** DB de producción: 7 espacios activos + Sala Arcos (discrepancia 9/12 abierta con Rafa). Regla de la sesión: en subpáginas EVITAR el total.
- **Propuesta:**
  - Línea 10 (description): «La página que buscás no está, pero tu primera hora gratis sí. Volvé al inicio de Espacio 1010 o explorá los consultorios y salas.»
  - Línea 27-29 (body): «La página que buscás se mudó, cambió de nombre o nunca existió. Los consultorios y salas de Gaboto 1010, en cambio, siguen donde siempre.»

### 10. [ALTO] El CTA primario del 404 no es el pre-registro

- **Dónde:** `src/pages/404.astro:31-38` — botones «Volver al inicio» (primario) y «Ver los espacios» → `/los-espacios` (ghost).
- **Problema:** la estrategia vigente dice que el CTA primario de TODAS las páginas es el pre-registro (`/#registro`) con primera hora gratis. Peor: «Ver los espacios» manda tráfico a `/los-espacios`, que hoy lista los 12 espacios FICTICIOS de `site.ts` (Estudio Norte/Sur, Consulta I–VII, Salón Cobre/Roble) — una página 404 derivando a contenido inventado.
- **Propuesta (reemplazar el bloque de botones):**

  ```astro
  <Button href="/#registro" variant="primary" size="lg">
    Reservá tu primera hora gratis
  </Button>
  <Button href="/" variant="ghost" size="lg">
    Volver al inicio
  </Button>
  ```

  Mantener «Ver los espacios» solo cuando `/los-espacios` tenga los espacios reales (auditoría aparte).

### 11. [MEDIO] Los chips "Quizás buscabas" apuntan a subpáginas con datos viejos/ficticios

- **Dónde:** `src/pages/404.astro:45-58` — `[...NAV, ...NICHOS].slice(0, 8)` genera links a `/los-espacios`, `/el-lugar`, `/como-funciona`, `/precios`, `/contacto`, `/para/psicologos`, `/para/psiquiatras`, `/para/psicopedagogos`.
- **Evaluación:** los links son a páginas reales (existen y resuelven) — eso está bien y es lo que un 404 debe hacer. El problema es de secuencia: mientras la estrategia de pre-lanzamiento mantiene la landing como única página promocionada (footer de LandingLayout sin links internos), el 404 es una puerta de entrada al sitio interno con espacios ficticios y claims "24/7". No hay que tocar el mecanismo (está bien hecho y se autoactualiza con NAV/NICHOS): hay que priorizar la corrección de esas subpáginas (auditorías hermanas). Si alguna subpágina quedara para después, sacar su entrada del slice.
- **Propuesta menor de orden:** anteponer un chip directo al registro para que el primer chip convierta: `[{ href: '/#registro', label: 'Pre-registro · 1.ª hora gratis' }, ...NAV, ...]` y mantener `slice(0, 8)`.

### 12. [MEDIO] El 404 usa BaseLayout (nav completo) — inconsistencia consciente con la estrategia de landing

- **Dónde:** `src/pages/404.astro:2,8`.
- **Evaluación:** quien tipea mal una URL viniendo de un anuncio de la landing ve, por primera vez, el menú completo (Nav de BaseLayout, `BaseLayout.astro:109`). No es un bug — las subpáginas existen y son públicas — pero amplifica el hallazgo 11: el 404 expone el sitio interno antes de que esté alineado con la verdad. **No cambiar el layout** (un 404 con navegación es mejor UX); resolverlo corrigiendo las subpáginas. Registrado para que la decisión sea consciente.

### 13. [BAJO] Title y noindex del 404: correctos

- **Dónde:** `src/pages/404.astro:9,11`.
- **Evaluación:** `title="Página no encontrada"`, `noindex={true}`: correcto. H1 con tono de marca («Esta puerta no abre») — alineado al tono de la home, conservar. Vercel sirve `404.astro` de Astro con status 404 real: OK. El canonical autogenerado apunta a la URL inexistente, pero con `noindex` es irrelevante en la práctica — no tocar.

### 14. [BAJO] Oportunidad: foto real en el 404

- **Dónde:** `src/pages/404.astro:16-18` (el "404" gigante tipográfico).
- **Evaluación/propuesta:** hay 7 fotos reales de áreas comunes en `public/fotos/lugar-*.webp` y `fachada-final.webp` (nocturna). Una foto chica de la fachada nocturna bajo el texto («Esta puerta sí abre — Gaboto 1010») reforzaría que el lugar es real y haría el 404 memorable. Opcional, prioridad baja; el 404 actual es sobrio y funciona.

---

## Resumen de prioridades

| # | Página | Gravedad | Hallazgo |
|---|--------|----------|----------|
| 1 | /privacidad | crítico | "Nada más" falso: también se guardan UTMs + origen |
| 2 | /privacidad | crítico | No declara GA4/Clarity/Meta Pixel/Plausible (y sin banner, es el único lugar donde declararlo) |
| 3 | /privacidad | alto | Responsable debe ser Excalibur SAS, no "Espacio 1010" |
| 9 | /404 | alto | "12 espacios" ×2 (description + body) |
| 10 | /404 | alto | CTA primario no es el pre-registro; "Ver los espacios" deriva a espacios ficticios |
| 4 | /privacidad | medio | "No cedemos a terceros" sin matiz de encargados (Supabase, etc.) |
| 5 | /privacidad | medio | Falta vía de reclamo URCDP |
| 11 | /404 | medio | Chips derivan a subpáginas aún no corregidas; sumar chip de registro |
| 12 | /404 | medio | BaseLayout expone el nav completo (decisión consciente, no tocar) |
| 6 | /privacidad | bajo | Footer compartido: info@ vs hola@espacio1010.uy |
| 7 | /privacidad | bajo | Schema compartido: paymentAccepted "Credit Card" falso, horario 24/7 |
| 8 | /privacidad | bajo | noindex correcto, no tocar |
| 13 | /404 | bajo | Title/noindex/H1 correctos, no tocar |
| 14 | /404 | bajo | Oportunidad: fachada nocturna real en el 404 |
