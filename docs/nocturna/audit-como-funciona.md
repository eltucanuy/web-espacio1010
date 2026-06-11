# Auditoría — /como-funciona (`src/pages/como-funciona.astro`)

> Sesión nocturna 2026-06-10/11. Fuente de verdad: `docs/VERDAD_APP_2026_06_10.md`
> (la app manda). Referencias: home `src/pages/index.astro` (NO tocar) y
> `espacio1010/src/pages/cliente/Ayuda.jsx` (la PWA real).
>
> Diagnóstico general: la página es de un sprint viejo, anterior a la fuente de
> verdad. Describe un negocio **ya operativo** con datos en buena parte
> **inventados** (código que cambia por reserva, sala de espera común, "sala de
> cowork", pack mensual con armario, apertura remota desde la app) y **omite por
> completo** los tres ejes del flujo real que se pidieron reflejar: tipos de
> reserva con sus nombres reales ("Una vez" / "Todas las semanas"), la
> **liquidación a mes vencido** y el corte de **1 hora** en cancelaciones.
> Además el CTA final viola la estrategia de pre-registro. Necesita reescritura
> de contenido (la estructura de 4 pasos + cancelación + FAQ + CTA es buena y
> se puede conservar).

---

## Hallazgos

### CRÍTICOS

**1. [critico] CTA final manda a crear cuenta en la PWA, no al pre-registro** — `como-funciona.astro:249-264`
El bloque final "¿Probamos?" tiene como CTA primario `Crear mi cuenta` → `SITE.agendaUrl` (agenda.espacio1010.uy directo). La estrategia vigente (fuente de verdad, sección "Estrategia de CTAs") es: CTA primario = pre-registro `/#registro` con primera hora gratis; secundario = WhatsApp. Además el copy no menciona la primera hora gratis ni el pre-lanzamiento.
**Propuesta** (reemplazar todo el bloque CTA):
- H2: `¿Empezamos?`
- Párrafo: `Pre-registrate gratis en 30 segundos y tu primera hora queda guardada a tu nombre, para usarla cuando quieras durante 2026.`
- Botón primario: `Quiero mi primera hora gratis` → `/#registro`
- Botón secundario: `Escribinos por WhatsApp` → `CONTACT.whatsappLink('Hola! Quiero saber más sobre cómo funciona Espacio 1010.')` (o dejar `Ver precios` como terciario).

**2. [critico] "Código personal que cambia con cada reserva" es FALSO** — `como-funciona.astro:51`
En la app el código de entrada es **personal, fijo e intransferible**, visible siempre en el botón "Puerta" del menú de la app (Ayuda.jsx, pregunta "Tu código de entrada"). No cambia por reserva. También es dudoso `Tu código abre la puerta de calle y el espacio que reservaste` (línea 49): lo documentado es código de entrada al edificio + videoportero; no hay evidencia de que abra cada espacio.
**Propuesta** bullets del paso 04: `Código personal e intransferible — lo ves siempre en la app` / `Videoportero para abrirles a las personas que atendés` / `Comedor del primer piso sin cargo, exclusivo para profesionales`. Detalle: `Tu código personal abre la puerta de calle y lo tenés siempre a mano en la app. Si llegás antes, esperás en el comedor del primer piso, exclusivo para profesionales y sin cargo.`

**3. [critico] Política de cancelación incompleta y distinta a la real (y a la home)** — `como-funciona.astro:153-190`
- La card "Dentro de las 24 h" (177-183) dice que cancelando con menos de 24 h `bonificamos el 50%`, **sin el corte real de 1 hora**: la config de producción es gratis >24 h · 50% entre 24 h y 1 h antes · **con menos de 1 h ya no se puede cancelar**. Tal como está, promete cancelar al 50% diez minutos antes.
- La card "Reservas fijas" (153-158) presenta el "1 de cada 5" como si fuera independiente del aviso de 24 h. La regla real: las fijas también requieren >24 h de aviso, y además tienen tope mensual del 20% de las horas fijas del mes ("1 de cada 5").
- La home (index.astro:65-68, 217) lo comunica bien: `Hasta 24 h antes → cancelás gratis` / `Hasta 1 h antes → pagás solo el 50%` + nota de cancelaciones sin cargo mensuales para fijas. Esta página la contradice.
**Propuesta** (3 cards alineadas a la home):
1. `Hasta 24 h antes` — `Cancelás gratis. No pagás nada y tu hora vuelve a quedar disponible.`
2. `Hasta 1 h antes` — `Pagás solo el 50%. La otra mitad queda bonificada.`
3. `Reservas fijas` — `Tus reservas de todas las semanas incluyen un cupo de cancelaciones gratis cada mes: hasta el 20% de tus horas fijas (1 de cada 5).`
Nota al pie (reemplaza la de 186-190): `Con menos de 1 hora de anticipación ya no se puede cancelar. El detalle exacto lo ves en la app al momento de cancelar.`

**4. [critico] No existe el "pack mensual con armario reservado"** — `como-funciona.astro:223`
La FAQ "¿Puedo dejar materiales en el espacio?" promete `pack mensual con armario reservado` en "estudios y consultas amobladas" (nombres de los espacios ficticios viejos). En la app lo real es: materiales personales en **caja rotulada con tu nombre en los muebles del comedor**, muebles comunes **sin llave**, Espacio 1010 no se responsabiliza por pérdidas.
**Propuesta**: `Los espacios son compartidos, así que no quedan cosas dentro de ellos. Podés dejar tus materiales en una caja rotulada con tu nombre en los muebles del comedor de profesionales. Son muebles comunes, sin llave — lo importante llevalo con vos.`

**5. [critico] Falta por completo la liquidación a mes vencido (foco del flujo real)** — toda la página
El pago a mes vencido es uno de los diferenciales más fuertes (la home lo destaca: "Confiamos en vos desde el día 1") y parte del flujo real de la PWA, y esta página —que se llama "Cómo funciona"— no lo menciona en ningún lado. Tampoco los descuentos por volumen.
**Propuesta**: agregar un 5º paso (o un bloque entre los pasos y la cancelación) `Pagás a mes vencido`:
- Bajada: `Primero usás, después pagás. Sin tarjeta.`
- Detalle: `El día 1 de cada mes te llega la liquidación con el detalle de lo que usaste el mes anterior, y tenés 10 días para pagarla por transferencia o depósito. Sin tarjeta, sin adelantos, sin cobros automáticos. Si reservás mucho, mejor: con 20 horas o más en el mes se aplica un 10% de descuento automático, y con 40 o más, un 20%.`
- Bullets: `Liquidación el día 1, con 10 días para pagar` / `Transferencia o depósito — también en pagos parciales` / `Descuento por volumen automático: 20 h+ → 10% · 40 h+ → 20%`.
(Si se agrega como paso, actualizar el H1 "Cuatro pasos" → `Cinco pasos. El resto es atender.` y el schema HowTo se actualiza solo porque se genera de `pasos`.)

### ALTOS

**6. [alto] "los 12 espacios" ×2 — total prohibido en subpáginas** — `como-funciona.astro:23` y `:203`
La discrepancia 9/12 sigue abierta; regla de la sesión: en subpáginas evitar el total.
**Propuesta**: línea 23 → `Ves los consultorios y salas con sus horarios libres en tiempo real.` Línea 203 (FAQ visita) → `Te mostramos los consultorios y las salas y respondemos cualquier duda.`

**7. [alto] "24/7" en bajada del paso 04 y en la meta description** — `como-funciona.astro:47` y `:75`
Horario real reservable: **7 a 24 h, todos los días**. Regla: en subpáginas usar "todos los días, de 7 a 24 h".
**Propuesta**: línea 47 → `Todos los días, de 7 a 24 h, con tu código personal. Sin coordinar con nadie.` Línea 75 (description) → `Cómo reservar consultorio por hora en Espacio 1010: registrate, mirá la disponibilidad real, reservá desde el celular y entrá con tu código todos los días, de 7 a 24 h.`

**8. [alto] "Sala de cowork" ×2 — concepto que no existe en la app** — `como-funciona.astro:49` y `:52`
Lo real es el **comedor / sala de estar del primer piso, exclusivo para profesionales, sin cargo**. "Cowork" no existe como concepto en la app (fuente de verdad, sección Reservas).
**Propuesta**: reemplazar por `comedor del primer piso (exclusivo para profesionales, sin cargo)` — ver copy del hallazgo 2.

**9. [alto] "Tus pacientes esperan en la sala de espera común" — no documentada** — `como-funciona.astro:49` y `:53`
Ni la fuente de verdad ni la Ayuda de la app mencionan una sala de espera común. Lo documentado: la persona toca el timbre/portero, el profesional abre por videoportero, y **entra recién a la hora de la reserva** (el horario incluye ingreso, sesión y cierre).
**Propuesta** bullet: `Las personas que atendés tocan timbre y vos les abrís por el videoportero` (y eliminar las dos menciones a la sala de espera).

**10. [alto] FAQ "¿Cómo accede mi paciente?" — apertura "remoto desde la app" + sala de espera** — `como-funciona.astro:215`
La app documenta videoportero, no apertura remota desde la app; y de nuevo la sala de espera inexistente.
**Propuesta**: `Toca el timbre y vos le abrís por el videoportero. Entra recién a la hora de tu reserva — tu horario incluye ingreso, sesión y cierre, así nadie se superpone con nadie.`

**11. [alto] Paso 01: "recibís el código de acceso por mail" + proceso de aprobación no documentado** — `como-funciona.astro:10-18`
El código **no llega por mail**: se ve en el botón "Puerta" de la app. Y todo el relato de "cuenta en revisión, la aprobamos el mismo día, validamos cédula y matrícula" no está en la fuente de verdad (regla: no inventar datos). Además contradice al paso 03 que presume "cero idas y vueltas con humanos".
**Propuesta** (paso 01, versión pre-apertura): bajada `En 30 segundos, desde el celular.` Detalle: `Te pre-registrás hoy con tu nombre y WhatsApp, y tu primera hora queda gratis, guardada a tu nombre para usarla cuando quieras durante 2026. Completás tu cuenta en la app y listo.` Bullets: `Sin tarjeta y sin compromiso` / `Tu primera hora gratis queda reservada a tu nombre` / `Tu código de entrada lo ves directo en la app`. (Si Rafa confirma que existe la revisión manual de cuentas, se puede re-agregar — hoy no hay respaldo.)

**12. [alto] Paso 02: "Filtros por capacidad, mobiliario y profesional" — no existen** — `como-funciona.astro:29`
En la app el buscador es por día y rango horario ("De… a…"); no hay constancia de filtros por mobiliario ni "por profesional". Además conviene usar los nombres reales de los tipos de reserva de la app.
**Propuesta** bullets paso 02: `Reserva "Una vez": una fecha y hora concretas` / `Reserva "Todas las semanas": tu horario fijo — mismo día, hora y espacio` / `Hasta 8 horas seguidas y hasta 150 días hacia adelante`.

**13. [alto] La página habla en presente operativo sin mencionar el pre-lanzamiento** — toda la página (hero `:88-96`, FAQ `:203`)
El negocio abre en junio 2026; la home entera está armada alrededor del pre-registro y esta página ni lo nombra (cero menciones a "primera hora gratis"). Quien aterriza acá desde Google pierde la oferta.
**Propuesta**: (a) ajustar el paso 01 al pre-registro (hallazgo 11); (b) CTA final al pre-registro (hallazgo 1); (c) opcional: pill arriba del H1 como en la home: `Pre-lanzamiento · ¡muy pronto!`. En la FAQ de visita, agregar matiz honesto: `Sí. Estamos en pre-apertura — coordinamos una visita por WhatsApp y te mostramos los consultorios y las salas.`

### MEDIOS

**14. [medio] Claim "La más favorable del mercado" no verificable** — `como-funciona.astro:141`
Superlativo absoluto sin respaldo (la home no lo usa; usa "A vos también te cancelan. Acá no lo pagás.").
**Propuesta** H2: `Cancelar no te sale caro.` o reutilizar el de la home: `A vos también te cancelan. Acá no lo pagás.`

**15. [medio] Terminología de tipos de reserva distinta a la app** — `como-funciona.astro:27-28,37,153,165`
La página usa "eventual" / "fija"; la app usa **"Una vez"** y **"Todas las semanas"** (es lo primero que ve el usuario al reservar y una de las 5 preguntas más frecuentes de la Ayuda). Para que la web prepare al usuario para la app, conviene nombrarlos igual al menos una vez.
**Propuesta**: en el paso 02, presentar ambos con su nombre de la app (ver hallazgo 12) y en cancelaciones usar `reservas de "Una vez"` / `reservas de "Todas las semanas"` (o "fijas" entre paréntesis).

**16. [medio] FAQ "series fijas son mes a mes" — impreciso** — `como-funciona.astro:207`
La fija queda activa **hasta que el cliente la libera** ("Dejar de reservar este horario"), no es un ciclo mensual.
**Propuesta**: `No. Reservás por hora, las veces que quieras, sin contrato. Y si tenés un horario fijo todas las semanas, lo liberás cuando quieras desde la app, sin penalización.`

**17. [medio] FAQ "¿Qué pasa si llego tarde?" — extensión de turno no documentada** — `como-funciona.astro:219`
"Si necesitás extender, depende de la disponibilidad del siguiente turno" no es una función documentada de la app (cambiar horario = cancelar y volver a reservar). Además falta el concepto real: el horario incluye ingreso, sesión y cierre.
**Propuesta**: `La reserva es tuya hasta que termina la hora — tu horario incluye ingreso, sesión y cierre. Si vas a necesitar más tiempo, reservá una hora más desde la app (podés reservar hasta 8 seguidas).`

**18. [medio] FAQ precios: oportunidad de sumar el descuento por volumen** — `como-funciona.astro:211`
La respuesta de `¿Cuánto cuesta la hora?` es correcta ($350 / $700 Sala Arcos) pero pierde la chance de mencionar el descuento por volumen real (20 h+ → 10% · 40 h+ → 20%).
**Propuesta**: agregar al final: `Y si reservás 20 horas o más en el mes, se aplica un descuento automático del 10% (20% con 40 o más).`

**19. [medio] Sala Arcos sin su canal correcto** — `como-funciona.astro:37,41,211`
Se nombra la Sala Arcos con su precio (bien) pero sin aclarar que se coordina por WhatsApp (no entra al flujo público de la app).
**Propuesta**: en la FAQ de precios, cerrar con: `La Sala Arcos se coordina directo por WhatsApp.`

### BAJOS

**20. [bajo] Title SEO mejorable** — `como-funciona.astro:74`
`Cómo funciona — Espacio 1010` es correcto pero no aporta keyword.
**Propuesta**: `title="Cómo funciona: reservá tu consultorio por hora"` (el layout le suma "— Espacio 1010").

**21. [bajo] Sin fotos reales ni captura de la app** — toda la página
La página es 100% tipográfica. La home muestra la captura real de la PWA (`/fotos/app-captura.png`) justo en su sección "Cómo funciona" — acá, que es LA página del flujo, no está. También hay 7 fotos `lugar-*.webp` disponibles.
**Propuesta**: insertar la captura (mismo markup de marco de teléfono de index.astro:347-359) junto a los pasos 02-03, y opcionalmente `lugar-pasillo.webp` o `lugar-circulacion.webp` cerca del paso 04 (acceso/edificio).

**22. [bajo] Tensión interna paso 01 vs paso 03** — `como-funciona.astro:13` y `:35`
Paso 01 enfatiza aprobación humana ("siempre por una persona, no un bot") y paso 03 vende "Cero idas y vueltas con humanos". Se resuelve solo con el rewrite del paso 01 (hallazgo 11), pero si se conserva la idea de comunidad curada, suavizar: la aprobación es una vez; las reservas son instantáneas.

**23. [bajo] Schema HowTo: correcto de diseño, contaminado de contenido** — `como-funciona.astro:58-70`
El JSON-LD se genera desde `pasos`, así que hoy le sirve a Google los datos falsos (código por mail, 24/7, cowork). Se corrige solo al corregir los pasos — sin acción extra. Canonical e internal links (`/preguntas-frecuentes`, `/precios`) están OK.

---

## Resumen de verificaciones OK (no tocar)

- Precios $350/h y $700/h Sala Arcos — correctos (líneas 37, 41, 211).
- "Sin compromiso" usado correctamente en FAQ de visita (línea 203); no aparece "boutique", "insonorizado", "Cordón" ni "sin permanencia".
- Links internos `/preguntas-frecuentes` y `/precios` existen.
- Canonical automático vía BaseLayout, og/twitter OK, `ogSlug="como-funciona"`.
- Estructura HowTo schema bien resuelta (se autoactualiza con los pasos).
