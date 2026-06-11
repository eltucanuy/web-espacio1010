# Auditoría nocturna — `/precios` (src/pages/precios.astro)

**Fecha:** 2026-06-10 (sesión nocturna)
**Auditor:** subagente `/precios`
**Fuente de verdad:** `docs/VERDAD_APP_2026_06_10.md` (DB de producción + app PWA)
**Referencia de tono:** `src/pages/index.astro` (home — NO modificar)

## Veredicto general

La página es un sobreviviente del sprint viejo de placeholders: el precio base ($350/h y Sala Arcos $700/h) está bien, pero **el modelo comercial que describe es ficticio** ("Pack de horas", "Tarifa Fundadores", "tramos que coordinás al crear tu cuenta") y **todos los CTAs violan la estrategia de pre-registro**. Además repite claims prohibidos/falsos ("24/7", "sala de cowork", "hasta 30 personas") y omite los dos argumentos de confianza más fuertes que la app sí tiene: el pago a mes vencido sin tarjeta y la política de cancelación completa. Necesita reescritura profunda, no retoques.

---

## Hallazgos

### CRÍTICOS

**1. "Tarifa Fundadores" 100% inventada, con escasez falsa — `src/pages/precios.astro:116-138`**
- Gravedad: **crítico**
- "Tarifa Fundadores — las primeras 50 cuentas", "Tarifa congelada por 6 meses + primer mes de fija sin cargo", "Quedan 41 cupos": **nada de esto existe** en la app ni en la DB. Es scarcity falsa en producción — riesgo serio de confianza (y de reclamo de un cliente que la pida).
- La promo real y verificada en DB es el cupón **BIENVENIDA1010: primera hora gratis, válida hasta fin de 2026**.
- **Propuesta:** reemplazar el banner completo por la promo real, con CTA al pre-registro:
  - Kicker: `Pre-lanzamiento · abrimos en junio`
  - Título: `Tu primera hora, gratis.`
  - Bajada: `Pre-registrate hoy y te guardamos una hora sin cargo para usarla cuando quieras durante 2026, en el espacio que elijas.`
  - Botón: `Quiero mi primera hora gratis` → `href="/#registro"`

**2. Plan "Pack de horas" no existe (y arrastra el "tres modalidades") — `src/pages/precios.astro:27-40`, también `:66` (schema), `:91` (meta description), `:109` ("Tres formas de usar el espacio")**
- Gravedad: **crítico**
- La app tiene exactamente **dos** formas de reservar: **"Una vez"** (hora suelta) y **"Todas las semanas"** (fija semanal). No hay packs prepagos, no hay "horas que no se vencen", no hay "prioridad sobre la hora suelta" (la prioridad de la fija es de hecho real solo en el sentido de que el horario queda tomado — pero el copy del pack es ficción completa).
- **Propuesta:** pasar de 3 cards a **2 cards** reales:
  - **Hora suelta** — "Reservás cuando la necesitás." Incluye: `Cualquier espacio disponible` / `Desde 1 hora, sin compromiso` / `Cancelás gratis hasta 24 h antes` / `Reservás hasta con 150 días de anticipación`. CTA: `Quiero mi primera hora gratis` → `/#registro`.
  - **Fija semanal** — "Tu día, tu hora y tu espacio, todas las semanas." Incluye: `Mismo espacio, día y hora cada semana` / `La cortás cuando quieras, sin trámite ni penalización` / `Cancelaciones gratis todos los meses (hasta el 20% de tus horas fijas)` / `Suma para tu descuento por volumen`. CTA: `Quiero empezar con mi hora gratis` → `/#registro`.
- Ajustar en el mismo cambio el hero (`Tres formas` → `Dos formas`), la meta description y el schema FAQ (ver hallazgo 14).

**3. Todos los CTAs apuntan a `agenda.espacio1010.uy` en vez del pre-registro — `src/pages/precios.astro:132`, `:179`, `:287`**
- Gravedad: **crítico**
- Viola la estrategia decidida: durante el pre-lanzamiento el CTA primario de TODAS las páginas es `/#registro` (primera hora gratis); secundario WhatsApp; Sala Arcos por WhatsApp. Hoy la página manda al usuario a una PWA sin contexto de cupón y se pierde el lead (y la atribución del form de la home).
- Además el CTA final (`:277-292`, "Mirá la agenda real antes de comprometerte") asume negocio abierto — estamos en pre-apertura, la agenda está vacía: mensaje contraproducente.
- **Propuesta:** todos los `Button href={SITE.agendaUrl}` → `href="/#registro"`. CTA final propuesto:
  - Título: `Pre-registrarte es gratis. Reservar, cuando abramos.`
  - Bajada: `Dejá tu nombre y WhatsApp, te guardamos tu primera hora gratis y te avisamos apenas abrimos las puertas. Sin tarjeta, sin compromiso.`
  - Botón: `Quiero mi primera hora gratis` → `/#registro`. Link secundario WhatsApp (`CONTACT.whatsappLink(...)`).

**4. Descuentos por volumen ocultados y descriptos con un dato falso — `src/pages/precios.astro:203-241`, en especial `:238-239`**
- Gravedad: **crítico**
- "Los tramos exactos y el ahorro por hora los coordinás al crear tu cuenta" es **falso**: no se coordina nada, los tramos son fijos, automáticos y públicos en la app: **20 h o más al mes: 10% · 40 h o más: 20%**, aplicados sobre el total del mes en la liquidación. Esconder los números en una página que promete "Sin letra chica" es exactamente letra chica.
- **Propuesta:** reemplazar las 3 cards vagas ("Empezando / Práctica estable / Práctica intensiva") por los tramos reales:
  - Card 1 — `Hasta 20 h al mes` / `$350 la hora` / `La tarifa estándar, sin mínimos ni costos fijos.`
  - Card 2 — `20 h o más al mes` / `10% de descuento` / `Queda en $315 la hora promedio. Se aplica solo sobre el total del mes.`
  - Card 3 (destacada) — `40 h o más al mes` / `20% de descuento` / `Queda en $280 la hora promedio. La mejor tarifa del esquema.`
  - Nota al pie: `El descuento se calcula solo, sobre todas tus horas del mes, y lo ves en tu liquidación el día 1. No hay que pedirlo ni hacer ningún trámite.`

**5. "Acceso 24/7" — falso, el horario real es 7 a 24 — `src/pages/precios.astro:82` (schema) y `:259` (lista de incluidos)**
- Gravedad: **crítico**
- Config de producción: reservable de **07:00 a 24:00, todos los días**. La regla de la sesión para subpáginas es decir "todos los días, de 7 a 24 h" (el "24/7" de la home queda flaggeado aparte, no se replica acá).
- **Propuesta:** en la lista (`:259`): `Acceso con código personal, todos los días de 7 a 24 h`. En el schema, mismo ajuste (ver hallazgo 14).

### ALTOS

**6. Card "Fija mensual" con beneficios inventados o mal contados — `src/pages/precios.astro:41-54`**
- Gravedad: **alto**
- "tarifa fija" / "La mejor tarifa por volumen mensual": la fija **no tiene tarifa propia** — es $350/h y el descuento es por volumen total, igual que la suelta. "Bonificación si cancelás con tiempo": no existe ninguna bonificación. "Cancelaciones flexibles dentro del tope mensual" es lo único rescatable pero está dicho al revés (el tope es de **cancelaciones gratis: 20% de las horas fijas del mes**).
- **Propuesta:** usar la card "Fija semanal" del hallazgo 2 (ya redactada con los datos reales).

**7. Sala Arcos: capacidad inflada, claim no verificable y sin su CTA de WhatsApp — `src/pages/precios.astro:66` y `:188-194`**
- Gravedad: **alto**
- DB: **25 sentados** (10×4 m, ~40 m²). La página dice "hasta 30 personas" dos veces. "Sin columnas" no está en la DB ni en la fuente de verdad (viene del placeholder de `site.ts`) — no afirmarlo. Y la Sala Arcos se vende **por WhatsApp**, pero el bloque no tiene CTA.
- **Propuesta** para el bloque (`:188-194`):
  - `$700/h · Sala Arcos — la gran sala del subsuelo: 40 m² para hasta 25 personas sentadas, con proyector, parlante, kitchenette y baño propio.`
  - Agregar link: `Consultala por WhatsApp` → `CONTACT.whatsappLink('Hola! Quiero consultar por la Sala Arcos.')`.
  - En el schema FAQ, mismo ajuste de capacidad.

**8. Falta TODO el bloque de pago — el argumento de confianza más fuerte no está — `src/pages/precios.astro` (omisión, sugerido después de `:241`)**
- Gravedad: **alto**
- Una página de precios que no dice **cómo ni cuándo se paga** deja la duda más importante sin responder. Los datos reales (DB + Ayuda de la app): pago **a mes vencido** (liquidación el día 1 con el detalle del mes anterior, **vence a los 10 días**), **sin tarjeta**, sin adelantos ni cobros automáticos, por **transferencia BROU o depósito en Abitab / RedPagos**, con pagos parciales permitidos. Es además el mensaje "Confiamos en vos" que la home ya instala.
- **Propuesta:** sección nueva "¿Y cómo se paga? Después de usar." con 3 puntos:
  - `A mes vencido` — `Usás el espacio todo el mes y recién el día 1 recibís el detalle de tus horas, con los descuentos ya aplicados. Tenés 10 días para pagarlo.`
  - `Sin tarjeta` — `No te pedimos tarjeta nunca: ni para registrarte, ni para reservar. Nada de cobros automáticos ni adelantos.`
  - `Como te quede cómodo` — `Pagás por transferencia bancaria o depósito en Abitab o RedPagos. Si lo necesitás, podés ir pagando en partes.`

**9. Política de cancelación incompleta (y prometida de más en el plan suelto) — `src/pages/precios.astro:22` y `:50-51`**
- Gravedad: **alto**
- Solo aparece "Cancelás con 24 hs, no pagás". Falta la mitad de la política real: **entre 24 h y 1 h antes pagás 50%**, con **menos de 1 h ya no se puede cancelar**, y en fijas las cancelaciones gratis tienen **tope mensual del 20%**. La home ya muestra el esquema completo — acá quedaría inconsistente y, peor, genera expectativa de "cancelo cuando sea, gratis".
- **Propuesta:** bullet de la card suelta: `Cancelás gratis hasta 24 h antes (50% hasta 1 h antes)`. Y un párrafo corto debajo de las cards: `Cancelación simple: gratis avisando con más de 24 h; hasta 1 h antes pagás solo la mitad. En las fijas, las cancelaciones gratis tienen un tope del 20% de tus horas del mes.`

**10. "Sala de cowork" — concepto que no existe en la app — `src/pages/precios.astro:23`, `:82` y `:258`**
- Gravedad: **alto**
- Decisión de la fuente de verdad: unificar como **cocina / sala de estar para profesionales** ("cowork" no existe como concepto en la app; la home ya dice "Cocina y sala sin cargo").
- **Propuesta:** `:23` → `Cocina y sala de estar sin cargo`; `:258` → `Cocina y sala de estar para profesionales, sin cargo`; quitar "sala de cowork" del schema (hallazgo 14).

**11. La primera hora gratis y el contexto de pre-apertura no existen en la página**
- Gravedad: **alto** (conversión)
- Gancho comercial número 1 del sitio (cupón BIENVENIDA1010, válido todo 2026) ausente justo en la página donde el visitante está evaluando el costo. Y nada indica que el local abre en junio 2026 — la página habla como negocio operativo.
- **Propuesta:** lo resuelven los hallazgos 1 y 3 (banner + CTAs). Sumar al pie de las cards de precio: `Tu primera hora es gratis: pre-registrate y queda guardada a tu nombre para usarla durante 2026.`

### MEDIOS

**12. Hero: "cambiás de plan sin penalización" — no hay planes — `src/pages/precios.astro:108-112`**
- Gravedad: **medio**
- No existen "planes" que cambiar; el concepto confunde y suena a telco.
- **Propuesta:** `Un solo precio: $350 la hora, en cualquier espacio. Reservás suelto o con horario fijo semanal, y cuanto más usás en el mes, menos pagás. Sin matrícula, sin mínimos, sin letra chica.` (de paso mete el precio y la keyword arriba de todo).

**13. Lista "Qué incluye" con ítems no verificables en la fuente de verdad — `src/pages/precios.astro:253-261`**
- Gravedad: **medio**
- No están confirmados ni en la DB ni en la fuente de verdad: `Música ambiente para privacidad`, `Mantenimiento y limpieza diaria`, `Cocina común con café, té y agua` (el café/té/agua), `Sala de espera para tus pacientes` (lo confirmado es comedor/sala de estar en el piso 1, exclusivo profesionales) y `Wifi de fibra` (plausible pero sin respaldo en la verdad). Regla dura: no prometer servicios inexistentes.
- **Propuesta:** dejar solo lo respaldado y marcar el resto para confirmación de Rafa antes de re-publicarlo: `Espacios amoblados y climatizados` / `Cocina y sala de estar para profesionales, sin cargo` / `Acceso con código personal, todos los días de 7 a 24 h` / `Videoportero y cámaras en accesos y zonas comunes (nunca en los espacios de atención)`. **Pregunta abierta para Rafa:** ¿confirmás wifi, limpieza diaria, música ambiente, sala de espera y café/té/agua como prestaciones reales?

**14. Schema FAQPage con los mismos datos falsos — `src/pages/precios.astro:57-86`**
- Gravedad: **medio** (es lo que Google puede mostrar como rich result — datos falsos indexados)
- Tres errores heredados: "pack de horas y serie fija mensual" (Q1), "hasta 30 personas" (Q1), "sala de cowork + acceso 24/7" (Q3).
- **Propuesta de textos corregidos:**
  - Q1: `Los consultorios y salas cuestan $350 por hora, precio único. La Sala Arcos (subsuelo, hasta 25 personas sentadas) cuesta $700 por hora. Podés reservar hora suelta o un horario fijo semanal, y con 20 horas al mes tenés 10% de descuento; con 40 o más, 20%.`
  - Q2 (sin cambios de fondo, está bien): mantener.
  - Q3: `Acceso al espacio amoblado y climatizado, cocina y sala de estar para profesionales, y entrada con código personal todos los días de 7 a 24 h. Sin cargos extra ni costos de gestión.`
  - Oportunidad extra: agregar una Q4 sobre pago (`¿Cómo se paga?` → mes vencido / sin tarjeta / transferencia, Abitab o RedPagos) — keyword de intención alta.

**15. SEO: title genérico y description con dato falso — `src/pages/precios.astro:90-91`**
- Gravedad: **medio**
- `title="Precios"` desperdicia la keyword (queda "Precios — Espacio 1010"); la description vende el "pack de horas" inexistente y no menciona el precio (que en una SERP de "alquiler consultorio por hora montevideo precio" es el mejor CTR posible).
- **Propuesta:**
  - title: `Precios: consultorio por hora a $350`
  - description: `Alquilá consultorio por hora en Montevideo a $350, precio único y todo incluido. Descuentos por volumen de hasta 20%, pago a mes vencido sin tarjeta y cancelación gratis con 24 h. Tu primera hora es gratis.`

**16. Cero links internos en el cuerpo de la página**
- Gravedad: **medio**
- Fuera del Nav/Footer, la página no enlaza a `/los-espacios`, `/como-funciona` ni `/preguntas-frecuentes`. Mala distribución de autoridad interna y pierde al visitante que quiere ver QUÉ está pagando.
- **Propuesta:** en el bloque de $700 de Sala Arcos y en el pie de las cards, sumar: `Conocé los consultorios y salas →` (`/los-espacios`) y, junto a la política de cancelación, `Más detalles en las preguntas frecuentes →` (`/preguntas-frecuentes`).

### BAJOS

**17. Página 100% tipográfica: no usa ninguna foto real — oportunidad**
- Gravedad: **bajo**
- Hay 7 fotos reales en `public/fotos/lugar-*.webp`. En particular `lugar-sala-subsuelo.webp` y `lugar-subsuelo.webp` **son la Sala Arcos real** (sala del subsuelo con piedra y arcos) — ponerle la foto al bloque de $700 vuelve tangible el precio premium. La home ya define el patrón visual (figure con caption en gradiente).
- **Propuesta:** convertir el bloque Sala Arcos en una card horizontal con `lugar-sala-subsuelo.webp` + el copy del hallazgo 7.

**18. H1 sin keyword — `src/pages/precios.astro:104-107`**
- Gravedad: **bajo**
- "Sin letra chica. Sin sorpresas." es buen tono pero no dice qué se vende. Si se aplica el hallazgo 12 (precio en la bajada), alcanza; alternativa de H1 que conserva la actitud: `$350 la hora. Sin letra chica, sin sorpresas.`

**19. "Prioridad sobre la hora suelta" y "Las horas no se vencen" — `src/pages/precios.astro:36-37`**
- Gravedad: **bajo** (queda absorbido por el hallazgo 2 al eliminar la card del pack; se lista para que no se recicle ese copy en otra página)

---

## Resumen de verificación del foco pedido

| Dato | En la página | Estado |
|---|---|---|
| $350/h | Sí (`:9`, `:197`, schema) | ✅ correcto |
| Sala Arcos $700 | Sí (`:10`, `:190`) | ✅ precio ok, ❌ capacidad ("30" vs 25) y sin CTA WhatsApp |
| Descuentos 20h+ 10% / 40h+ 20% | No — se ocultan y se dice que "se coordinan" | ❌ falso/omitido (crítico) |
| Pago mes vencido, día 1 / vence a 10 días | Ausente | ❌ omitido (alto) |
| Sin tarjeta · transferencia/Abitab/RedPagos | Ausente | ❌ omitido (alto) |
| Cancelación 24 h gratis / 50% hasta 1 h / tope 20% fijas | Solo "24 hs no pagás" | ⚠️ incompleta (alto) |
| Primera hora gratis 2026 | Ausente (hay una promo falsa en su lugar) | ❌ (crítico) |
| CTA primario → /#registro | No — todo va a agenda.espacio1010.uy | ❌ (crítico) |

## Preguntas abiertas para Rafa (no resolver unilateralmente)

1. ¿Confirma wifi, limpieza diaria, música ambiente, sala de espera y café/té/agua como prestaciones reales publicables? (hallazgo 13)
2. ¿Publicar los porcentajes exactos de descuento (10%/20%) o solo los umbrales? (la recomendación de esta auditoría es publicarlos: coherente con "sin letra chica")
3. La Ayuda de la app dice "transferencia o depósito BROU" mientras la fuente de verdad dice "transferencia BROU o depósito Abitab/RedPagos" — confirmar el detalle exacto de medios antes de publicar la sección de pagos.
