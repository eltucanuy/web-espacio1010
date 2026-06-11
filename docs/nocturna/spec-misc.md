# SPEC FINAL — /privacidad + /404 (sesión nocturna 2026-06-10/11)

> Sintetizador: misc. Insumo: `docs/nocturna/audit-misc.md` verificado contra el código real
> y `docs/VERDAD_APP_2026_06_10.md`.
> ⚠️ **Incidente de proceso:** el JSON con los veredictos del panel de 3 lentes nunca llegó al
> sintetizador (el placeholder vino sin sustituir). Esta spec se resolvió con el informe del
> auditor + verificación directa de cada hallazgo en el código. Todos los hallazgos citados
> fueron re-verificados línea por línea antes de aceptarlos.
>
> Archivos a tocar: `src/pages/privacidad.astro`, `src/pages/404.astro`,
> `src/layouts/LandingLayout.astro` (solo footer). **NO tocar** `src/pages/index.astro` ni
> `src/lib/schema.ts` (este último es de la spec de layouts/home).

---

## Cambios ordenados (aplicar en este orden)

### Cambio 1 — /privacidad: declarar UTMs y origen en "Qué datos recogemos" [CRÍTICO]

**Archivo:** `src/pages/privacidad.astro` (línea 26).
**Por qué:** el form de la home guarda en Supabase `pre_registros` también `origen` y
`utm_source/medium/campaign`; el «Nada más.» actual es falso en el documento legal de
transparencia (ley 18.331).

Reemplazar el `<p>` de la línea 26 por (texto EXACTO):

```html
<p class="mt-2">Cuando te pre-registrás en este sitio te pedimos <strong>nombre, apellido y número de WhatsApp</strong>. Junto con eso guardamos, si existen, los parámetros de campaña con los que llegaste (por ejemplo, si viniste desde un anuncio), para saber qué canales funcionan. Nada más.</p>
```

### Cambio 2 — /privacidad: matizar "no cedemos a terceros" con encargados [MEDIO]

**Archivo:** `src/pages/privacidad.astro` (línea 30, sección "Para qué los usamos").
**Por qué:** los datos viven en Supabase y la medición pasa por terceros; la frase absoluta
actual es imprecisa. Sin banner de cookies, la política tiene que decirlo bien.

Reemplazar el `<p>` de la línea 30 por (texto EXACTO):

```html
<p class="mt-2">Únicamente para contactarte respecto de tu pre-registro en Espacio 1010, ayudarte a completar tu cuenta y coordinar el beneficio de tu primera hora gratis. No vendemos tus datos ni los compartimos con terceros para sus propios fines; solo usamos proveedores tecnológicos que los procesan por cuenta nuestra (por ejemplo, donde se aloja la base de datos).</p>
```

### Cambio 3 — /privacidad: sección nueva "Cookies y medición" [CRÍTICO]

**Archivo:** `src/pages/privacidad.astro` — insertar un `<div>` nuevo **después** del bloque
"Por cuánto tiempo" (después de la línea 35) y **antes** de "Tus derechos".
**Por qué:** el sitio corre GTM (GA4 + Clarity confirmado + Meta Pixel previsto por la
agencia) y Plausible; por decisión firme NO hay cookie banner, así que la política es el
único lugar donde se informa. Hoy no dice nada. NO sugerir banner.

Insertar (contenido EXACTO, mismo patrón de markup que las otras secciones):

```html
<div>
  <h2 class="text-xl text-ink">Cookies y medición</h2>
  <p class="mt-2">Para entender cómo se usa el sitio y medir nuestras campañas usamos herramientas de analítica de terceros (Google Analytics, Microsoft Clarity y Meta) que pueden instalar cookies en tu navegador, y Plausible, que no usa cookies. Estos datos son estadísticos y de navegación: no incluyen lo que escribís en el formulario salvo el hecho de que lo enviaste. Si preferís evitarlas, podés bloquear las cookies de terceros desde la configuración de tu navegador y el sitio va a seguir funcionando igual.</p>
</div>
```

### Cambio 4 — /privacidad: vía de reclamo URCDP en "Tus derechos" [MEDIO]

**Archivo:** `src/pages/privacidad.astro` (línea 38).
**Por qué:** estándar de la ley 18.331; señal de política local seria, no copiada.

Agregar al FINAL del `<p>` de "Tus derechos" (después de «…Protección de Datos Personales
de Uruguay.»), dentro del mismo párrafo, el texto EXACTO:

```
 Si entendés que no respondimos bien, también podés reclamar ante la Unidad Reguladora y de Control de Datos Personales (URCDP) de Uruguay.
```

### Cambio 5 — /privacidad: responsable = Excalibur SAS [ALTO]

**Archivo:** `src/pages/privacidad.astro` (línea 42, sección "Responsable").
**Por qué:** el responsable ante la ley 18.331 es la persona jurídica (Excalibur SAS), no el
nombre comercial; el propio footer ya dice «Excalibur SAS». NO publicar el domicilio fiscal
(Emilio Reus 2446): no es la dirección del local.

Reemplazar el `<p>` de la línea 42 por (texto EXACTO; conserva las variables de `site.ts`):

```astro
<p class="mt-2">El responsable del tratamiento de tus datos es <strong>Excalibur SAS</strong> (Espacio 1010). Punto de contacto: {ADDRESS.street}, entre Palermo y {ADDRESS.neighborhood}, {ADDRESS.city}, {ADDRESS.country}.</p>
```

### Cambio 6 — /404: sacar "12 espacios" de description y body [ALTO]

**Archivo:** `src/pages/404.astro`.
**Por qué:** discrepancia 9/12 abierta; regla de la sesión: en subpáginas EVITAR el total.

6a. Línea 10 — reemplazar el valor de `description` por (texto EXACTO):

```
La página que buscás no está, pero tu primera hora gratis sí. Volvé al inicio de Espacio 1010 o explorá los consultorios y salas.
```

6b. Líneas 26-29 — reemplazar el contenido del `<p>` del body por (texto EXACTO):

```
La página que buscás se mudó, cambió de nombre o nunca existió.
Los consultorios y salas de Gaboto 1010, en cambio, siguen donde siempre.
```

### Cambio 7 — /404: CTA primario al pre-registro y quitar "Ver los espacios" [ALTO]

**Archivo:** `src/pages/404.astro` (líneas 31-38).
**Por qué:** estrategia vigente: CTA primario de TODAS las páginas = pre-registro con
primera hora gratis. Además «Ver los espacios» hoy deriva a `/los-espacios`, que lista los
12 espacios FICTICIOS de `site.ts`.

Reemplazar el bloque de botones por (código EXACTO):

```astro
<div class="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
  <Button href="/#registro" variant="primary" size="lg">
    Reservá tu primera hora gratis
  </Button>
  <Button href="/" variant="ghost" size="lg">
    Volver al inicio
  </Button>
</div>
```

Nota: re-agregar «Ver los espacios» recién cuando `/los-espacios` tenga los espacios reales
(spec hermana).

### Cambio 8 — /404: chip de pre-registro primero en "Quizás buscabas" [MEDIO]

**Archivo:** `src/pages/404.astro` (línea 47).
**Por qué:** que el primer chip convierta; el mecanismo NAV/NICHOS se mantiene porque se
autoactualiza y los links resuelven.

Reemplazar la expresión del array por (código EXACTO, se mantiene el `slice(0, 8)` y el
resto del markup igual):

```astro
[
  { href: '/#registro', label: 'Pre-registro · 1.ª hora gratis' },
  ...NAV,
  ...NICHOS.map((n) => ({ href: `/para/${n.slug}`, label: n.label })),
].slice(0, 8).map((item) => (
```

(Resultado: chip de registro + 5 de NAV + 2 nichos. Quedan fuera psicopedagogos,
nutricionistas, meditación y talleres — aceptable, el slice ya recortaba antes.)

### Cambio 9 — Footer compartido: info@ → hola@espacio1010.uy [BAJO pero es dato falso]

**Archivo:** `src/layouts/LandingLayout.astro` (línea 131).
**Por qué:** la fuente de verdad y `CONTACT.email` dicen `hola@espacio1010.uy`; el footer
hardcodea `info@`. En /privacidad conviven los dos emails en la misma pantalla. Si `info@`
no existe, se pierden correos. La fuente de verdad gana en datos. (Afecta visualmente a la
home porque el footer es compartido, pero NO se toca `index.astro`; queda flaggeado abajo
para que Rafa lo valide mañana.)

Reemplazar la línea 131 por (código EXACTO — `CONTACT` ya está importado en el layout):

```astro
<a href={`mailto:${CONTACT.email}`} class="text-ink-muted hover:text-ink hover:underline">{CONTACT.email}</a>
```

---

## Propuestas DESCARTADAS (y por qué)

- **Hallazgo 7 (schema.ts: `paymentAccepted: 'Credit Card'` falso + horario 24 h):** fuera de
  alcance de esta spec — vive en archivo compartido que cubre la spec de layouts/home; editarlo
  desde dos specs genera conflictos. Queda en contradicciones para asegurar que no se caiga.
- **Hallazgo 12 (404 usa BaseLayout con nav completo):** se mantiene como está — un 404 con
  navegación es mejor UX; se resuelve corrigiendo las subpáginas, no escondiéndolas.
- **Hallazgo 14 (foto de fachada nocturna en el 404):** descartado — opcional y de prioridad
  baja en una página noindex de poco tráfico; el 404 sobrio actual funciona y suma peso cero.
- **Hallazgos 8 y 13 (noindex/title/H1 de ambas páginas):** sin cambios — el auditor mismo los
  valida como correctos.
- **Publicar domicilio fiscal (Emilio Reus 2446) como parte del responsable:** descartado —
  no es la dirección del local; razón social + punto de contacto alcanza (criterio del auditor,
  compartido).

## Contradicciones / pendientes para Rafa (revisar mañana)

1. **El JSON del panel de 3 lentes nunca llegó al sintetizador** (placeholder sin sustituir en
   la orquestación). Esta spec se basa solo en el informe del auditor verificado contra código
   y fuente de verdad. Si el panel objetó algo, hay que re-pasarlo contra esta spec.
2. **info@ vs hola@espacio1010.uy:** la spec cambia el footer a `hola@` (fuente de verdad).
   Confirmar si `info@` existe o redirige — y si llegaron correos ahí hasta hoy.
3. **`/los-espacios` sigue publicando 12 espacios ficticios** (Estudio Norte/Sur, Consulta
   I–VII, Salón Cobre/Roble en `site.ts`): el 404 deja de empujar ahí como botón, pero los
   chips de NAV siguen linkeándola hasta que la spec hermana la corrija. Prioridad alta.
4. **`schema.ts` emite datos falsos en TODAS las páginas** (incl. /privacidad y /404):
   `paymentAccepted: 'Cash, Credit Card, Bank Transfer'` (no se acepta tarjeta — solo
   transferencia BROU o Abitab/RedPagos) y horario 00:00–23:59 vs real 07–24. También
   `SITE.description` dice "24/7". Corregirlo en la spec de layouts/home; si ninguna lo cubre,
   queda huérfano.
5. **Mención de "Meta" en la nueva sección de cookies:** el Pixel está previsto vía GTM por la
   agencia (comentario en `Analytics.astro`) y Clarity confirmado; GA4 a confirmar activación.
   Listar las tres es transparencia previsora, pero validar con la agencia qué está realmente
   activo en el container.
6. **Discrepancia 9/12 espacios** sigue abierta (ya estaba en backlog) — esta spec solo la
   esquiva en /404, no la resuelve.
