# Auditoría — /preguntas-frecuentes

> Sesión nocturna 2026-06-10/11. Auditor: FAQ.
> Archivo auditado: `src/pages/preguntas-frecuentes.astro`.
> Contrastado contra: `docs/VERDAD_APP_2026_06_10.md` (fuente de verdad),
> `espacio1010/src/pages/cliente/Ayuda.jsx` (Ayuda real de la app),
> `src/pages/index.astro` (home — FAQ corta, NO se toca), `src/lib/site.ts`, `src/layouts/BaseLayout.astro`.

Nota técnica importante: el schema.org FAQPage **ya existe** (líneas 110-129) y se genera del
mismo array `faqs` que se renderiza. Eso es bueno: **corregir el copy corrige el schema
automáticamente** — pero también significa que hoy Google está indexando respuestas con
datos falsos como datos estructurados.

---

## CRÍTICOS

### 1. "Armario reservado" para materiales — NO EXISTE
- **Dónde:** `src/pages/preguntas-frecuentes.astro:71`
- **Gravedad:** crítico (servicio inventado, promesa que el negocio no puede cumplir)
- **Hoy dice:** "En consultas amobladas con uso fijo, hay opción de armario reservado — consultá por WhatsApp."
- **La app dice** (Ayuda.jsx, "El comedor común" + pauta 7): los materiales personales van en una **caja rotulada con tu nombre** en los muebles habilitados del **comedor del primer piso**; los muebles son comunes y **no tienen llave**; Espacio 1010 no se hace cargo de pérdidas.
- **Propuesta de copy:**
  > **¿Puedo dejar materiales en el lugar?**
  > Dentro de los espacios no — son compartidos. Para tus materiales (caja de juegos, material de trabajo) hay muebles habilitados en el comedor del primer piso: van en una caja rotulada con tu nombre. Los muebles son comunes y no tienen llave, así que lo importante llevalo con vos.

### 2. Privacidad acústica: "es muy difícil escuchar de un espacio a otro" — contradice a la app
- **Dónde:** `src/pages/preguntas-frecuentes.astro:104`
- **Gravedad:** crítico (la app dice literalmente lo contrario; además roza el "insonorizado" prohibido)
- **Hoy dice:** "Trabajamos especialmente la privacidad acústica. Además, hay música ambiente suave en pasillos para sumar enmascaramiento — es muy difícil escuchar de un espacio a otro."
- **La app dice** (Ayuda.jsx, "Durante el encuentro"): "Cuidá el volumen de voz dentro del espacio — **los espacios contiguos pueden oír**." Y pide considerar los espacios contiguos si la práctica genera sonido.
- **Propuesta de copy** (honesta, sin matar la venta — la música ambiente sí está confirmada en `site.ts` AMENITIES):
  > **¿Cómo es la privacidad entre espacios?**
  > La cuidamos entre todos: hay música ambiente suave en las circulaciones que ayuda a enmascarar, y las pautas de la casa piden cuidar el volumen y evitar conversaciones sensibles en zonas comunes. Si tu práctica incluye música o movimiento, contanos y te recomendamos el espacio que mejor convive con eso.

### 3. CTAs del cierre violan la estrategia de pre-registro
- **Dónde:** `src/pages/preguntas-frecuentes.astro:186-191`
- **Gravedad:** crítico (conversión — es la única página del flujo cuyo CTA esquiva la primera hora gratis)
- **Hoy:** botón primario "Escribirnos" → `/contacto`; botón ghost "Crear cuenta" → `SITE.agendaUrl` (la PWA directa, **sin cupón** BIENVENIDA1010 y sin pasar por el pre-registro).
- **Regla de la sesión:** CTA primario en TODAS las páginas = `/#registro` con primera hora gratis; secundario = WhatsApp.
- **Propuesta:**
  - Primario: `<Button href="/#registro" variant="primary">Quiero mi primera hora gratis</Button>`
  - Secundario: `<Button href={CONTACT.whatsappLink('Hola! Tengo una pregunta que no está en la FAQ de Espacio 1010.')} variant="ghost">Preguntar por WhatsApp</Button>` (importar `CONTACT` de `../lib/site`).
  - Copy del bloque: "**¿Te quedó alguna duda?** Escribinos por WhatsApp y te respondemos enseguida. Y si ya está todo claro, asegurá tu primera hora gratis — es sin tarjeta y sin compromiso."

---

## ALTOS

### 4. Política de cancelación incompleta y desalineada con app y home
- **Dónde:** `src/pages/preguntas-frecuentes.astro:38` (y `:42`)
- **Gravedad:** alto (es EL diferencial comercial; hoy está mal contado)
- **Problemas:**
  a) Falta el corte real: con **menos de 1 hora ya no se puede cancelar** (config de producción; el hero de la home dice "o pagás solo el 50% hasta 1 h antes").
  b) "dentro de las 24 horas te bonificamos el 50%" omite ese límite de 1 h.
  c) "En reservas fijas podés cancelar 1 de cada 5 sin cargo" sugiere que el 1-de-5 es gratis *siempre*; en realidad el gratis de las fijas también exige **+24 h de aviso** y el tope es **20% de tus horas fijas del mes** (1 de cada 5 es el ejemplo, fórmula proporcional).
- **Propuesta de copy:**
  > **¿Cuál es la política de cancelaciones?**
  > Cancelás gratis avisando con más de 24 horas. Entre 24 horas y 1 hora antes, pagás solo la mitad (te bonificamos el 50%). Con menos de 1 hora ya no se puede cancelar. Todo directo desde la app.
  >
  > **¿Las reservas fijas también tienen cancelaciones gratis?**
  > Sí. Avisando con más de 24 horas, cada mes podés cancelar sin cargo hasta el 20% de tus horas fijas — 1 de cada 5. La app te muestra cuántas gratis te quedan al momento de cancelar, y el tope se reinicia el día 1. Si lo que querés es dejar el horario para siempre, eso es "liberar" el horario y no cuenta para el tope.

### 5. "Le abrís remoto desde la app" + "sala de espera común" — no respaldados
- **Dónde:** `src/pages/preguntas-frecuentes.astro:67`
- **Gravedad:** alto
- **Problemas:** la app dice que las personas que atendés **tocan timbre y vos abrís desde el videoportero** (físico, en la zona común del piso) — no "remoto desde la app". Y la "sala de espera común cómoda y privada" no existe en la app: el comedor es **exclusivo de profesionales**; los consultantes ingresan recién a la hora de la reserva.
- **Propuesta de copy:**
  > **¿Cómo entran las personas que atendés?**
  > Tocan timbre y vos les abrís desde el videoportero. Desde el botón "Puerta" de la app podés mandarles por WhatsApp las instrucciones de ingreso ya armadas. Ingresan a la hora de tu reserva y quedan bajo tu responsabilidad mientras están en el edificio.

### 6. Código de entrada: "abre el espacio que reservaste, dentro de tu franja horaria" — no respaldado
- **Dónde:** `src/pages/preguntas-frecuentes.astro:63` (y derivado en `:29`)
- **Gravedad:** alto (describe un sistema de cerraduras por espacio/franja que la app no menciona en ningún lado)
- **La app dice:** el código es **personal e intransferible**, se ve en el botón "Puerta", se ingresa en el panel de la **entrada**; cada ingreso queda registrado a tu nombre. Nada de aperturas por espacio ni vencimiento por franja.
- **Propuesta de copy:**
  > **¿Cómo accedo al edificio?**
  > Con tu código personal, que ves en cualquier momento desde la app. Lo ingresás en el panel de la entrada y listo. Es personal e intransferible: cada ingreso queda registrado a tu nombre.
- **Y para `:29` (llegar tarde):** quitar "tu código sigue funcionando hasta el final de la hora reservada". Propuesta:
  > **¿Qué pasa si llego tarde a mi reserva?**
  > Tu reserva sigue siendo tuya hasta el final del horario — entrás con tu código cuando llegues. Eso sí: el horario no se corre, e incluye ingreso, sesión y cierre. Si necesitás extender, depende de que el siguiente turno esté libre.

### 7. "Se ventilan y revisan entre uso y uso" — servicio no confirmado, contradice el modelo autónomo
- **Dónde:** `src/pages/preguntas-frecuentes.astro:75`
- **Gravedad:** alto (promete personal entre cada reserva; la app pide que cada profesional deje el espacio como lo encontró — el modelo es autónomo)
- **Propuesta de copy** (sin inventar frecuencia de limpieza, que no está en la fuente de verdad):
  > **¿Cómo se mantiene la limpieza de los espacios?**
  > Con limpieza regular del lugar y una regla simple entre colegas: cada uno deja el espacio como lo encontró. Si algo no está en condiciones, lo reportás desde la app o por WhatsApp y lo resolvemos.
  > *(Si Rafa confirma limpieza profunda diaria, se puede reponer ese dato — hoy no está en la app ni en la fuente de verdad.)*

### 8. "Sala de cowork" — concepto que no existe + condición inventada
- **Dónde:** `src/pages/preguntas-frecuentes.astro:78-80`
- **Gravedad:** alto
- **Problemas:** la fuente de verdad es explícita: "cowork no existe como concepto en la app"; unificar como **comedor / sala de estar del primer piso, exclusivo profesionales, sin cargo**. Además "mientras tengas al menos una reserva ese día" es una condición inventada — la app dice "sin límite de tiempo, mientras haya lugar", para esperar, hacer una pausa o trabajar entre sesiones.
- **Propuesta de copy:**
  > **¿Puedo usar el comedor y la sala de estar sin reservar un espacio?**
  > El comedor del primer piso es exclusivo y sin cargo para profesionales registrados: para llegar antes, quedarte después, almorzar o trabajar entre sesiones, sin límite de tiempo mientras haya lugar. Tiene heladera, café y elementos de uso común.

### 9. No hay NINGUNA pregunta sobre el pre-registro ni la primera hora gratis
- **Dónde:** todo el array `faqs` (`src/pages/preguntas-frecuentes.astro:7-108`)
- **Gravedad:** alto (conversión — el negocio está en pre-apertura y la página habla como si ya estuviera operando)
- **Propuesta:** agregar una categoría inicial "Pre-apertura" (3 items, alineados a la FAQ corta de la home `index.astro:26-51` para no contradecirla):
  > **¿Cuándo abre Espacio 1010?**
  > En junio 2026. Mientras tanto podés pre-registrarte gratis: te guardamos tu primera hora gratis y te avisamos por WhatsApp cuando abrimos.
  >
  > **¿Pre-registrarme me compromete a algo?**
  > No. Es gratis, sin tarjeta y sin compromiso: te guardamos tu primera hora gratis y te avisamos por WhatsApp cuando abrimos. Nada más.
  >
  > **¿Cómo funciona la primera hora gratis?**
  > Al completar tu registro queda cargada a tu nombre, lista para usarla cuando quieras durante 2026, en el espacio que elijas.
  *(Las dos últimas son copy textual de la home — consistencia garantizada.)*

---

## MEDIOS

### 10. Accesibilidad: "baño accesible" y "2 escalones" — datos no verificados
- **Dónde:** `src/pages/preguntas-frecuentes.astro:96`
- **Gravedad:** medio (si es verdad, perfecto; pero no está ni en la app ni en la fuente de verdad, y la accesibilidad es un claim sensible para errar)
- **Propuesta:** confirmar con Rafa. Mientras tanto, versión segura:
  > **¿Es accesible para personas con movilidad reducida?**
  > Depende de lo que necesites — escribinos por WhatsApp y lo vemos juntos antes de tu primera reserva, así te recibimos como corresponde.

### 11. "Aprobamos cuentas el mismo día — siempre revisado por una persona" — no verificado
- **Dónde:** `src/pages/preguntas-frecuentes.astro:13`
- **Gravedad:** medio (compromiso de SLA que no figura en la app)
- **Propuesta:**
  > **¿Necesito registrarme antes de reservar?**
  > Sí. Es gratis y toma menos de un minuto desde el celular. Una persona del equipo (no un bot) revisa y activa tu cuenta — te avisamos por WhatsApp en cuanto está lista. Si te registrás ahora, además, tu primera hora queda gratis.

### 12. "Reservas hasta minutos antes del horario" — no verificado
- **Dónde:** `src/pages/preguntas-frecuentes.astro:17`
- **Gravedad:** medio (la config de producción no define anticipación mínima; mejor no comprometer "minutos")
- **Propuesta:**
  > **¿Puedo reservar para hoy mismo?**
  > Sí, siempre que haya disponibilidad. La agenda se actualiza en tiempo real: lo que ves libre, lo podés reservar, incluso para dentro de un rato.

### 13. Pago: faltan las formas de pago reales y los pagos parciales; precisión del vencimiento
- **Dónde:** `src/pages/preguntas-frecuentes.astro:50`
- **Gravedad:** medio
- **Detalles:** la verdad es "vence **a los 10 días**" (no exactamente "el día 10"); formas: **transferencia a BROU o depósito en Abitab/RedPagos**; **pagos parciales permitidos** (buen argumento de confianza que hoy se desperdicia).
- **Propuesta:**
  > **¿Cómo pago las reservas?**
  > A mes vencido: el día 1 te generamos la liquidación con el detalle de lo que usaste el mes anterior y tenés 10 días para pagarla. Pagás por transferencia bancaria o depósito en Abitab/RedPagos, y podés hacerlo en pagos parciales. Sin tarjeta, sin adelantos, sin cobros automáticos.

### 14. Wifi: "repetidores por planta" y "sala de espera" — detalles no verificados
- **Dónde:** `src/pages/preguntas-frecuentes.astro:99-100`
- **Gravedad:** medio (el wifi de fibra sí está en AMENITIES; el resto es decorado inventado y vuelve a nombrar la "sala de espera")
- **Propuesta:**
  > **¿Hay wifi en todo el edificio?**
  > Sí, wifi de fibra en todo el edificio, incluidos los espacios y el comedor del primer piso.

### 15. Faltan dos preguntas de alto valor que la app sí responde: horarios y descuentos
- **Dónde:** array `faqs` (categorías "Reservas y agenda" y "Cancelaciones y pagos")
- **Gravedad:** medio (oportunidad SEO + conversión; cuidado: usar "7 a 24", NUNCA "24/7" en subpáginas)
- **Propuesta — agregar:**
  > **¿En qué horarios puedo atender?**
  > Todos los días, de 7 a 24 h — también sábados, domingos y feriados. Reservás en bloques de 1 hora (hasta 8 seguidas) y podés agendar con hasta 150 días de anticipación.
  >
  > **¿Hay descuentos si reservo muchas horas?**
  > Sí, automáticos: con 20 horas o más en el mes, 10% de descuento; con 40 o más, 20%. Se aplican solos en tu liquidación, sin trámite.

### 16. Sala Arcos: falta el canal correcto (WhatsApp)
- **Dónde:** `src/pages/preguntas-frecuentes.astro:46`
- **Gravedad:** medio (la Sala Arcos no se reserva por la app; su CTA es WhatsApp)
- **Propuesta** (mismo texto actual + cierre):
  > $350 la hora en todos los consultorios y salas. La Sala Arcos, la gran sala del subsuelo para grupos y talleres (hasta 25 personas, con proyector, parlante y kitchenette), sale $700 la hora y se coordina directo por WhatsApp. Sin costos de gestión escondidos.

---

## BAJOS

### 17. Title SEO genérico
- **Dónde:** `src/pages/preguntas-frecuentes.astro:124` (BaseLayout arma "Preguntas frecuentes — Espacio 1010")
- **Propuesta:** `title="Preguntas frecuentes · Consultorios por hora en Montevideo"` → queda "Preguntas frecuentes · Consultorios por hora en Montevideo — Espacio 1010". H1 puede quedar como está (es marca y tono); el title hace el trabajo SEO.

### 18. "Te respondemos en minutos" (x2) — compromiso de SLA no confirmado
- **Dónde:** `src/pages/preguntas-frecuentes.astro:142-143` (intro) y la description (`:125`)
- **Propuesta:** "escribinos por WhatsApp y te respondemos enseguida" (sin prometer minutos).

### 19. Página 100% tipográfica: oportunidad de usar 1 foto real
- **Dónde:** sección de cierre (`:177-195`)
- **Propuesta:** sumar una foto real (`/fotos/lugar-pasillo.webp` o `/fotos/lugar-circulacion.webp`, ya optimizadas y con alt escritos en `index.astro:280-286`) como banda visual arriba del bloque "¿Te quedó alguna duda?". Refuerza confianza justo antes del CTA sin tocar la estructura.

### 20. Sin internal links en las respuestas
- **Dónde:** array `faqs` completo
- **Propuesta:** enlazar desde las respuestas a `/precios` (pregunta de precio), `/como-funciona` (registro/acceso) y `/el-lugar` (edificio/ubicación). Hoy la página es un callejón sin salida salvo los 2 botones del cierre. Ojo: los links van en el render, no en el texto del schema (o se aceptan como HTML simple, que Google tolera en FAQPage con `<a>`).

---

## Verificaciones que dieron OK (sin hallazgo)

- Schema.org **FAQPage presente y bien formado** (`:110-129`), generado del mismo array que el render (consistencia render/schema garantizada).
- Canonical correcto vía BaseLayout (`https://www.espacio1010.uy/preguntas-frecuentes`).
- Dirección (`:88`): exacta a la fuente de verdad, sin "Cordón".
- Estacionamiento (`:92`): respeta "zona no tarifada"; sin "boutique" ni "insonorizado" ni "sin permanencia" en toda la página.
- Precio (`:46`): $350 / Sala Arcos $700 — coincide con DB y con la FAQ corta de la home (casi textual).
- Mínimo de horas (`:21`), cambio de espacio (`:25`), suspensión por liquidación vencida (`:54`): alineados con la app.
- No usa el total "12 espacios" en ningún lado (cumple la regla de subpáginas).

## Resumen de prioridades de implementación

1. Reescribir las 5 respuestas con datos falsos/inventados: armario (#1), acústica (#2), apertura remota + sala de espera (#5), código por espacio (#6), limpieza entre usos (#7), cowork (#8).
2. Corregir la política de cancelación (#4) — alinear con home y app.
3. Cambiar los CTAs del cierre a /#registro + WhatsApp (#3) y agregar la categoría "Pre-apertura" (#9).
4. El resto (medios/bajos) en una segunda pasada.
