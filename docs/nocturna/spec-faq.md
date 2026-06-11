# SPEC FINAL — /preguntas-frecuentes

> Sesión nocturna 2026-06-10/11. Sintetizador: FAQ.
> Archivo a modificar: `src/pages/preguntas-frecuentes.astro` (ÚNICO archivo a tocar).
> Insumos: `docs/nocturna/audit-faq.md` + `docs/VERDAD_APP_2026_06_10.md` + `espacio1010/src/pages/cliente/Ayuda.jsx` (verificado).
>
> ⚠️ **NOTA DE PROCESO:** el veredicto del panel de 3 lentes NO llegó al sintetizador
> (el placeholder JSON vino vacío y no existe archivo de panel en `docs/nocturna/`).
> Esta spec se resolvió con auditor + fuente de verdad únicamente. Si el panel
> objetó algo, revisar mañana contra este documento.

El schema.org FAQPage se genera del mismo array `faqs` (líneas 110-120), así que
**corregir el array corrige el schema automáticamente**. No tocar el bloque del schema.

---

## CAMBIO 1 — Frontmatter: imports

**Archivo:** `src/pages/preguntas-frecuentes.astro` (línea 5)

- Reemplazar `import { SITE } from '../lib/site';` por `import { CONTACT } from '../lib/site';`
  (`SITE` queda sin uso tras el Cambio 4; `CONTACT.whatsappLink()` se necesita para el CTA secundario).

## CAMBIO 2 — Reemplazo COMPLETO del array `faqs`

**Archivo:** `src/pages/preguntas-frecuentes.astro` (líneas 7-108)

Reemplazar el array entero por este contenido EXACTO (5 categorías; la nueva
"Pre-apertura" va PRIMERA porque es la realidad del negocio hoy):

```js
const faqs = [
  {
    categoria: 'Pre-apertura',
    items: [
      {
        q: '¿Cuándo abre Espacio 1010?',
        a: 'En junio 2026. Mientras tanto podés pre-registrarte gratis: te guardamos tu primera hora gratis y te avisamos por WhatsApp cuando abrimos.',
      },
      {
        q: '¿Pre-registrarme me compromete a algo?',
        a: 'No. Es gratis, sin tarjeta y sin compromiso: te guardamos tu primera hora gratis y te avisamos por WhatsApp cuando abrimos. Nada más.',
      },
      {
        q: '¿Cómo funciona la primera hora gratis?',
        a: 'Al completar tu registro queda cargada a tu nombre, lista para usarla cuando quieras durante 2026, en el espacio que elijas.',
      },
    ],
  },
  {
    categoria: 'Reservas y agenda',
    items: [
      {
        q: '¿Necesito registrarme antes de reservar?',
        a: 'Sí. Es gratis y toma menos de un minuto desde el celular. Una persona del equipo (no un bot) revisa y activa tu cuenta — te avisamos por WhatsApp en cuanto está lista. Si te registrás ahora, además, tu primera hora queda gratis.',
      },
      {
        q: '¿Puedo reservar para hoy mismo?',
        a: 'Sí, siempre que haya disponibilidad. La agenda se actualiza en tiempo real: lo que ves libre, lo podés reservar, incluso para dentro de un rato.',
      },
      {
        q: '¿En qué horarios puedo atender?',
        a: 'Todos los días, de 7 a 24 h — también sábados, domingos y feriados. Reservás en bloques de 1 hora (hasta 8 seguidas) y podés agendar con hasta 150 días de anticipación.',
      },
      {
        q: '¿Hay un mínimo de horas?',
        a: 'No. Reservás desde 1 hora suelta. Si querés algo recurrente, podés armar una serie fija con día y hora garantizados.',
      },
      {
        q: '¿Puedo cambiar de espacio entre sesiones?',
        a: 'Sí. Cada reserva es independiente. Si en la próxima necesitás un espacio más grande o con otro mobiliario, lo elegís sin trámite.',
      },
      {
        q: '¿Qué pasa si llego tarde a mi reserva?',
        a: 'Tu reserva sigue siendo tuya hasta el final del horario — entrás con tu código cuando llegues. Eso sí: el horario no se corre, e incluye ingreso, sesión y cierre. Si necesitás extender, depende de que el siguiente turno esté libre.',
      },
    ],
  },
  {
    categoria: 'Cancelaciones y pagos',
    items: [
      {
        q: '¿Cuál es la política de cancelaciones?',
        a: 'Cancelás gratis avisando con más de 24 horas. Entre 24 horas y 1 hora antes, pagás solo la mitad (te bonificamos el 50%). Con menos de 1 hora ya no se puede cancelar. Todo directo desde la app.',
      },
      {
        q: '¿Las reservas fijas también tienen cancelaciones gratis?',
        a: 'Sí. Avisando con más de 24 horas, cada mes podés cancelar sin cargo hasta el 20% de tus horas fijas — 1 de cada 5. La app te muestra cuántas gratis te quedan al momento de cancelar, y el tope se reinicia el día 1. Si lo que querés es dejar el horario para siempre, eso es "liberar" el horario y no cuenta para el tope.',
      },
      {
        q: '¿Cuánto cuesta la hora?',
        a: '$350 la hora en todos los consultorios y salas. La Sala Arcos, la gran sala del subsuelo para grupos y talleres (hasta 25 personas, con proyector, parlante y kitchenette), sale $700 la hora y se coordina directo por WhatsApp. Sin costos de gestión escondidos.',
      },
      {
        q: '¿Hay descuentos si reservo muchas horas?',
        a: 'Sí, automáticos: con 20 horas o más en el mes, 10% de descuento; con 40 o más, 20%. Se aplican solos en tu liquidación, sin trámite.',
      },
      {
        q: '¿Cómo pago las reservas?',
        a: 'A mes vencido: el día 1 te generamos la liquidación con el detalle de lo que usaste el mes anterior y tenés 10 días para pagarla. Pagás por transferencia bancaria o depósito en Abitab/RedPagos, y podés hacerlo en pagos parciales. Sin tarjeta, sin adelantos, sin cobros automáticos.',
      },
      {
        q: '¿Qué pasa si no pago a tiempo?',
        a: 'Si la liquidación vence sin pagar, queda "vencida" y se suspende la posibilidad de hacer reservas nuevas hasta regularizar.',
      },
    ],
  },
  {
    categoria: 'Acceso y uso del lugar',
    items: [
      {
        q: '¿Cómo accedo al edificio?',
        a: 'Con tu código personal, que ves en cualquier momento desde la app. Lo ingresás en el panel de la entrada y listo. Es personal e intransferible: cada ingreso queda registrado a tu nombre.',
      },
      {
        q: '¿Cómo entran las personas que atendés?',
        a: 'Tocan timbre y vos les abrís desde el videoportero. Desde el botón "Puerta" de la app podés mandarles por WhatsApp las instrucciones de ingreso ya armadas. Ingresan a la hora de tu reserva y quedan bajo tu responsabilidad mientras están en el edificio.',
      },
      {
        q: '¿Puedo dejar materiales en el lugar?',
        a: 'Dentro de los espacios no — son compartidos. Para tus materiales (caja de juegos, material de trabajo) hay muebles habilitados en el comedor del primer piso: van en una caja rotulada con tu nombre. Los muebles son comunes y no tienen llave, así que lo importante llevalo con vos.',
      },
      {
        q: '¿Cómo se mantiene la limpieza de los espacios?',
        a: 'Con limpieza regular del lugar y una regla simple entre colegas: cada uno deja el espacio como lo encontró. Si algo no está en condiciones, lo reportás desde la app o por WhatsApp y lo resolvemos.',
      },
      {
        q: '¿Puedo usar el comedor y la sala de estar sin reservar un espacio?',
        a: 'El comedor del primer piso es exclusivo y sin cargo para profesionales registrados: para llegar antes, quedarte después, almorzar o trabajar entre sesiones, sin límite de tiempo mientras haya lugar. Tiene heladera, café y elementos de uso común.',
      },
    ],
  },
  {
    categoria: 'El edificio',
    items: [
      {
        q: '¿Dónde está ubicado?',
        a: 'Gaboto 1010, entre Isla de Flores y San Salvador, entre Palermo y Parque Rodó, Montevideo.',
      },
      {
        q: '¿Hay estacionamiento?',
        a: 'No tenemos cochera propia, pero la zona no es tarifada y casi siempre hay lugar en la calle. Las cuadras alrededor son tranquilas.',
      },
      {
        q: '¿Es accesible para personas con movilidad reducida?',
        a: 'Depende de lo que necesites — escribinos por WhatsApp y lo vemos juntos antes de tu primera reserva, así te recibimos como corresponde.',
      },
      {
        q: '¿Hay wifi en todo el edificio?',
        a: 'Sí, wifi de fibra en todo el edificio, incluidos los espacios y el comedor del primer piso.',
      },
      {
        q: '¿Cómo es la privacidad entre espacios?',
        a: 'La cuidamos entre todos: hay música ambiente suave en las circulaciones que ayuda a enmascarar, y las pautas de la casa piden cuidar el volumen y evitar conversaciones sensibles en zonas comunes. Si tu práctica incluye música o movimiento, contanos y te recomendamos el espacio que mejor convive con eso.',
      },
    ],
  },
];
```

Notas de implementación del Cambio 2:
- "¿Cómo accede mi paciente?" pasa a "¿Cómo entran las personas que atendés?" (regla de copy: no siempre "pacientes").
- Las preguntas 2 y 3 de "Pre-apertura" son copy TEXTUAL de la FAQ corta de la home (`index.astro:28-33`) — no parafrasear, consistencia garantizada.
- El item del precio incluye el canal de la Sala Arcos (WhatsApp) — cumple la regla "Sala Arcos: CTA WhatsApp".
- Comedor: SIEMPRE "comedor del primer piso" — desaparecen "sala de cowork" y "sala de espera" de toda la página.

## CAMBIO 3 — Title SEO + intro del hero

**Archivo:** `src/pages/preguntas-frecuentes.astro`

a) Línea 124: `title="Preguntas frecuentes"` → `title="Preguntas frecuentes · Consultorios por hora en Montevideo"`. La `description` (línea 125) queda como está. El H1 NO se toca.

b) Líneas 142-143, el párrafo intro pasa a (quita la promesa "en minutos"):

> Si tu pregunta no está acá, escribinos por WhatsApp y te respondemos
> enseguida. Vamos sumando más preguntas a medida que llegan.

## CAMBIO 4 — Bloque de cierre: copy + CTAs según estrategia de pre-registro

**Archivo:** `src/pages/preguntas-frecuentes.astro` (líneas 180-192)

a) El `<p>` bajo "¿Te quedó alguna duda?" pasa a:

> Escribinos por WhatsApp y te respondemos enseguida. Y si ya está todo
> claro, asegurá tu primera hora gratis — es sin tarjeta y sin compromiso.

b) Los dos botones pasan a:

```astro
<Button href="/#registro" variant="primary" size="md">
  Quiero mi primera hora gratis
</Button>
<Button
  href={CONTACT.whatsappLink('Hola! Tengo una pregunta que no está en la FAQ de Espacio 1010.')}
  variant="ghost"
  size="md"
>
  Preguntar por WhatsApp
</Button>
```

(Desaparecen el link a `/contacto` como primario y `SITE.agendaUrl` — la PWA directa
saltea el pre-registro y el cupón BIENVENIDA1010.)

## CAMBIO 5 — Foto real antes del cierre

**Archivo:** `src/pages/preguntas-frecuentes.astro` (sección de cierre, línea 177+)

Dentro del `<Container size="narrow">` del cierre, ANTES del `<div class="rounded-...">`,
insertar:

```astro
<img
  src="/fotos/lugar-pasillo.webp"
  alt="Pasillo de Espacio 1010 con muro de ladrillo original a la vista, lámparas circulares y claraboya"
  loading="lazy"
  class="mb-10 aspect-[5/2] w-full rounded-[var(--radius-lg)] object-cover shadow-[var(--shadow-md)]"
/>
```

(Foto existente en `public/fotos/`; alt textual del usado en la home `index.astro:281`.)

## Verificación post-implementación

- `npm run build` sin errores; el JSON-LD FAQPage se regenera solo del array.
- Grep de la página: no deben aparecer "cowork", "sala de espera", "armario",
  "insonoriz", "boutique", "Cordón", "sin permanencia", "24/7", "12 espacios", "paciente".
- Los 2 CTAs del cierre: primario `/#registro`, secundario `wa.me/59899001303`.

---

## Propuestas DESCARTADAS (y por qué)

| # auditor | Propuesta | Motivo del descarte |
|---|---|---|
| 20 | Internal links a /precios, /como-funciona, /el-lugar dentro de las respuestas | Requiere bifurcar render (`set:html`) vs schema (texto plano) en una página en producción — riesgo/beneficio no cierra esta noche; segunda pasada. |
| 7 (parcial) | Reponer "limpieza profunda diaria" | Dato no presente en app ni fuente de verdad; queda flaggeado para que Rafa confirme antes de publicarlo. |
| 10 (parcial) | Mantener "baño accesible en PB" y "2 escalones" | Claim sensible no verificado; va la versión segura por WhatsApp hasta confirmación de Rafa. |
| 11 (parcial) | Mantener "aprobamos el mismo día" | SLA no respaldado por la app; el copy nuevo conserva el argumento humano sin prometer plazo. |

Todo el resto del informe del auditor (hallazgos 1-19) se ACEPTA y queda reflejado
en los cambios 1-5.

---

## CONTRADICCIONES / PENDIENTES para Rafa (revisar mañana — NO bloquean esta spec)

1. **No llegó el veredicto del panel de 3 lentes** (placeholder vacío, sin archivo en el repo). Esta spec se resolvió solo con auditor + fuente de verdad; si hubo objeciones del panel, contrastarlas contra este doc.
2. **Privacidad acústica:** la FAQ ahora es honesta ("los contiguos pueden oír", según la app), pero la home y `site.ts` (`DIFERENCIALES`: "privacidad acústica", Consulta II "foco en privacidad acústica") siguen vendiéndola como diferencial. Decidir el mensaje global (la home no se toca esta noche).
3. **`src/lib/site.ts` sigue con datos ficticios** que alimentan otras páginas/schema: `AMENITIES` ("Sala de espera compartida", "Sala de cowork incluida sin cargo", "Cocina y sala de estar para tus pacientes"), `HOURS.openingHours: '24/7'`, los 12 espacios placeholder. Fuera del scope FAQ, pero contradice lo que esta página ahora dice bien.
4. **Accesibilidad:** ¿es verdad "baño accesible en PB" + "2 escalones en el acceso"? Si Rafa confirma, restituir el copy específico (es mejor que el genérico).
5. **Limpieza:** ¿hay limpieza profunda diaria / ventilación entre usos? Si se confirma, reponer el dato.
6. **Armario reservado para uso fijo:** ¿existe o existió como idea? La app solo conoce caja rotulada en el comedor; se eliminó de la web.
7. **SLA de cuentas ("mismo día") y reservas "hasta minutos antes":** no respaldados por config; se suavizaron. Si Rafa los confirma, se pueden endurecer de nuevo.
8. **Wifi "repetidores por planta":** detalle no verificado; se quitó.
9. **"¿Qué pasa si no pago a tiempo?"** decía "Después del día 10"; la verdad es "vence a los 10 días de generada (día 1)". Se corrigió a fórmula sin fecha fija; confirmar si el vencimiento cae siempre el día 11.
