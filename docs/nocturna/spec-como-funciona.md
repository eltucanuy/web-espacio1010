# SPEC FINAL — /como-funciona (`src/pages/como-funciona.astro`)

> Sesión nocturna 2026-06-10/11. Sintetizada desde `docs/nocturna/audit-como-funciona.md`
> + `docs/VERDAD_APP_2026_06_10.md` (la app manda) + referencia de tono `src/pages/index.astro`.
>
> ⚠️ **NOTA DE PROCESO**: el veredicto del panel de 3 lentes llegó VACÍO al sintetizador
> (placeholder `${JSON}` sin sustituir; tampoco hay archivo del panel en `docs/nocturna/`).
> Esta spec resuelve solo con auditoría + fuente de verdad, con criterio
> usuario real > SEO > estética. Si el panel existió, sus objeciones NO están reflejadas acá.
>
> Único archivo a tocar: `src/pages/como-funciona.astro`. No tocar `index.astro` ni la PWA.
> Todo el copy de abajo es FINAL — copiar tal cual.

---

## Cambios ordenados

### 1. Frontmatter: imports (línea 5)

Reemplazar:

```astro
import { SITE } from '../lib/site';
```

por:

```astro
import { CONTACT } from '../lib/site';
```

(`SITE.agendaUrl` deja de usarse con el cambio 10; `CONTACT.whatsappLink` pasa a usarse. Si Astro/ESLint
acusa import sin uso, verificar que no quede ninguna referencia a `SITE`.)

### 2. Reescribir el array `pasos` completo (líneas 7–56) — ahora son CINCO pasos

Reemplazar todo el array por:

```js
const pasos = [
  {
    n: '01',
    titulo: 'Te pre-registrás',
    bajada: 'En 30 segundos, desde el celular.',
    detalle:
      'Te pre-registrás hoy con tu nombre y WhatsApp, y tu primera hora queda gratis, guardada a tu nombre para usarla cuando quieras durante 2026. Después completás tu cuenta en la app y listo.',
    bullets: [
      'Sin tarjeta y sin compromiso',
      'Tu primera hora gratis queda reservada a tu nombre',
      'Tu código de entrada lo ves directo en la app',
    ],
  },
  {
    n: '02',
    titulo: 'Buscás disponibilidad',
    bajada: 'Ves los consultorios y salas con sus horarios libres en tiempo real.',
    detalle:
      'La agenda muestra exactamente lo que está libre cuando vos entrás: elegís el día y el rango horario, y listo. Y si querés un horario fijo, lo dejás reservado todas las semanas.',
    bullets: [
      'Reserva "Una vez": una fecha y hora concretas',
      'Reserva "Todas las semanas": tu horario fijo — mismo día, hora y espacio',
      'Hasta 8 horas seguidas y hasta 150 días hacia adelante',
    ],
  },
  {
    n: '03',
    titulo: 'Reservás en un click',
    bajada: 'Confirmás y listo. Sin esperar a nadie.',
    detalle:
      'No hay aprobación intermedia, no hay "te confirmo mañana". Apenas hacés click la reserva queda firme y la ves en tu agenda de la app. $350 la hora en todos los consultorios y salas; la Sala Arcos del subsuelo ($700 la hora) se coordina directo por WhatsApp.',
    bullets: [
      'Confirmación al instante, sin esperar a nadie',
      '$350/h en todos los consultorios y salas',
      'Sala Arcos ($700/h): se coordina por WhatsApp',
    ],
  },
  {
    n: '04',
    titulo: 'Entrás con tu código',
    bajada: 'Todos los días, de 7 a 24 h. Sin coordinar con nadie.',
    detalle:
      'Tu código personal abre la puerta de calle y lo tenés siempre a mano en la app. Las personas que atendés tocan timbre y vos les abrís por el videoportero. Si llegás antes, esperás en el comedor del primer piso, exclusivo para profesionales y sin cargo.',
    bullets: [
      'Código personal e intransferible — lo ves siempre en la app',
      'Videoportero para abrirles a las personas que atendés',
      'Comedor del primer piso sin cargo, exclusivo para profesionales',
    ],
  },
  {
    n: '05',
    titulo: 'Pagás a mes vencido',
    bajada: 'Primero usás, después pagás. Sin tarjeta.',
    detalle:
      'El día 1 de cada mes te llega la liquidación con el detalle de lo que usaste el mes anterior, y tenés 10 días para pagarla por transferencia o depósito. Sin tarjeta, sin adelantos, sin cobros automáticos. Y si reservás mucho, mejor: con 20 horas o más en el mes se aplica un 10% de descuento automático; con 40 o más, un 20%.',
    bullets: [
      'Liquidación el día 1, con 10 días para pagar',
      'Transferencia o depósito — también en pagos parciales',
      'Descuento automático: 20 h o más → 10% · 40 h o más → 20%',
    ],
  },
];
```

El schema HowTo (líneas 58–70) se genera de `pasos`: se actualiza solo, sin tocarlo.
(Corrige hallazgos 2, 5, 7, 8, 9, 11, 12, 15, 22 y 23 de la auditoría.)

### 3. Meta title + description (líneas 74–75)

Reemplazar:

```astro
  title="Cómo funciona"
  description="Cómo reservar consultorio en Espacio 1010 en 4 pasos: registrate, buscá disponibilidad real, reservá online y entrá 24/7 con tu código personal."
```

por:

```astro
  title="Cómo funciona: reservá tu consultorio por hora"
  description="Cómo reservar consultorio por hora en Espacio 1010: pre-registrate, mirá la disponibilidad real, reservá desde el celular y entrá con tu código todos los días, de 7 a 24 h."
```

(Hallazgos 7 y 20.)

### 4. Hero: pill de pre-lanzamiento + H1 a cinco pasos (líneas 85–91)

a) Entre el kicker `Cómo funciona` (cierra en línea 87) y el `<h1>` (línea 88), insertar:

```astro
      <p class="mb-5 inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-terracota/25 bg-terracota-tint px-4 py-2 text-xs font-medium text-terracota">
        <span class="relative flex h-2 w-2">
          <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-terracota opacity-50"></span>
          <span class="relative inline-flex h-2 w-2 rounded-full bg-terracota"></span>
        </span>
        Pre-lanzamiento · ¡muy pronto!
      </p>
```

b) En el H1, cambiar `Cuatro pasos.` por `Cinco pasos.` (el span `El resto es atender.` queda igual).

c) El párrafo del hero (92–96) queda como está.

(Hallazgo 13; mismo mensaje de pill que la home, adaptado a fondo blanco.)

### 5. Captura real de la app dentro de la sección de pasos (sección que arranca en línea 101)

Dentro de `<Container>` y ANTES del `<ol class="space-y-4">` (línea 103), insertar el mismo
marco de teléfono de la home (index.astro:347–359), tal cual:

```astro
      <div class="mx-auto mb-12 w-full max-w-[240px]">
        <div class="relative overflow-hidden rounded-[2.2rem] border-[7px] border-[#0f0c0e] bg-[#0f0c0e] shadow-[var(--shadow-md)]">
          <img
            src="/fotos/app-captura.png"
            alt="Pantalla de la app de Espacio 1010: elegís espacio, día y hora y reservás desde el celular"
            width="460"
            height="912"
            loading="lazy"
            decoding="async"
            class="block w-full"
          />
        </div>
      </div>
```

(Hallazgo 21, parte aceptada. Nota: `mt-10` de la home se vuelve `mb-12` acá.)

### 6. Sección cancelaciones: H2 + intro (líneas 140–146)

Reemplazar el H2 y el párrafo por:

```astro
      <h2 class="text-3xl text-ink sm:text-4xl">
        A vos también te cancelan. Acá no lo pagás.
      </h2>
      <p class="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft text-pretty">
        Cancelás con la misma flexibilidad que vos les das a las personas que
        atendés. Sin letra chica.
      </p>
```

El kicker `Política de cancelaciones` queda igual. (Hallazgo 14: se reusa la frase ya validada de la home.)

### 7. Cancelaciones: las 3 cards, en este orden (líneas 148–184)

Mantener el markup de card (icono + h3 + p). Contenido final:

**Card 1** (icono reloj — el actual de "Eventuales con 24 h"):
- h3: `Hasta 24 h antes`
- p: `Cancelás <strong class="text-ink">gratis</strong>. No pagás nada y tu hora vuelve a quedar disponible.`

**Card 2** (icono escudo — el actual de "Dentro de las 24 h"):
- h3: `Hasta 1 h antes`
- p: `Pagás <strong class="text-ink">solo el 50%</strong>. La otra mitad queda bonificada.`

**Card 3** (icono calendario — el actual de "Reservas fijas"):
- h3: `Reservas fijas`
- p: `Tus reservas de "Todas las semanas" incluyen un <strong class="text-ink">cupo de cancelaciones gratis</strong> cada mes: hasta el 20% de tus horas fijas (1 de cada 5).`

(Hallazgos 3 y 15. Mismos números y orden que la home: gratis → 50% → cupo fijas.)

### 8. Cancelaciones: nota al pie (líneas 186–190)

Reemplazar el párrafo "Resumen: …" por:

```astro
      <p class="mt-8 text-sm text-ink-muted">
        Con menos de 1 hora de anticipación ya no se puede cancelar. El detalle
        exacto lo ves en la app al momento de cancelar.
      </p>
```

(Hallazgo 3: el corte real de 1 hora, hoy ausente.)

### 9. FAQ: las 6 respuestas (líneas 200–224)

Mismas 6 preguntas, respuestas finales:

```js
        {[
          {
            q: '¿Puedo probar el espacio antes de reservar?',
            a: 'Sí. Estamos en pre-apertura — coordinamos una visita sin compromiso por WhatsApp y te mostramos los consultorios y las salas.',
          },
          {
            q: '¿Tengo que firmar contrato anual?',
            a: 'No. Reservás por hora, las veces que quieras, sin contrato. Y si tenés un horario fijo todas las semanas, lo liberás cuando quieras desde la app, sin penalización.',
          },
          {
            q: '¿Cuánto cuesta la hora?',
            a: '$350 la hora en todos los consultorios, sin costos de gestión escondidos. La Sala Arcos, la gran sala del subsuelo para grupos y talleres, sale $700 la hora y se coordina directo por WhatsApp. Y si reservás 20 horas o más en el mes, tenés un descuento automático del 10% (20% con 40 o más).',
          },
          {
            q: '¿Cómo accede mi paciente?',
            a: 'Toca el timbre y vos le abrís por el videoportero. Entra justo a la hora de tu reserva — tu horario incluye ingreso, sesión y cierre, así nadie se superpone con nadie.',
          },
          {
            q: '¿Qué pasa si llego tarde?',
            a: 'La reserva es tuya hasta que termina la hora — tu horario incluye ingreso, sesión y cierre. Si vas a necesitar más tiempo, reservá una hora más desde la app (podés reservar hasta 8 seguidas).',
          },
          {
            q: '¿Puedo dejar materiales en el espacio?',
            a: 'Los espacios son compartidos, así que no quedan cosas dentro de ellos. Podés dejar tus materiales en una caja rotulada con tu nombre en los muebles del comedor de profesionales. Son muebles comunes, sin llave — lo importante llevalo con vos.',
          },
        ].map((item) => (
```

(Hallazgos 4, 6, 10, 13, 16, 17, 18, 19. El botón "Ver todas las preguntas" → `/preguntas-frecuentes` queda igual.)

### 10. CTA final al pre-registro (líneas 248–267)

Reemplazar el contenido del bloque terracota por:

```astro
      <div class="rounded-[var(--radius-xl)] bg-terracota p-12 text-center text-white sm:p-20">
        <h2 class="text-balance text-white">¿Empezamos?</h2>
        <p class="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/85">
          Pre-registrate gratis en 30 segundos y tu primera hora queda guardada
          a tu nombre, para usarla cuando quieras durante 2026.
        </p>
        <div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button href="/#registro" variant="primary" size="lg" class="bg-white text-terracota hover:bg-white/90">
            Quiero mi primera hora gratis
          </Button>
          <Button
            href={CONTACT.whatsappLink('Hola! Quiero saber más sobre cómo funciona Espacio 1010.')}
            target="_blank"
            rel="noopener noreferrer"
            variant="ghost"
            size="lg"
            class="text-white hover:bg-white/10"
          >
            Escribinos por WhatsApp
          </Button>
        </div>
        <p class="mt-5 text-xs text-white/70">Sin tarjeta · sin compromiso · no pagás nada hasta reservar</p>
      </div>
```

(Hallazgo 1 — el crítico de estrategia. Si el componente `Button` no acepta `target`/`rel`,
usar un `<a>` con las mismas clases del Button ghost, como hace la home en su FAQ.)

### 11. Verificación post-cambio

- `npm run build` sin errores; el JSON-LD HowTo debe salir con 5 steps.
- Grep en el archivo final: no deben quedar `12 espacios`, `24/7`, `cowork`, `sala de espera`,
  `armario`, `por mail`, `agendaUrl`, `eventual` (salvo si se decide aclarar "(eventual)" entre paréntesis — la spec no lo usa).
- Las palabras prohibidas (`boutique`, `insonorizado`, `Cordón`, `sin permanencia`) no aparecen hoy ni deben aparecer.

---

## Propuestas DESCARTADAS (y por qué)

- **"Ver precios" como botón terciario del CTA final** (auditor, hallazgo 1, opción): descartado — la estrategia define primario pre-registro + secundario WhatsApp, y /precios ya está en la nav; un tercer botón diluye la conversión.
- **Foto `lugar-pasillo.webp` / `lugar-circulacion.webp` junto al paso 04** (hallazgo 21, parte opcional): descartada — alarga una página de flujo sin sumar información; la captura de la app alcanza y la galería de fotos vive en la home y /el-lugar.
- **H2 "Cancelar no te sale caro."** (hallazgo 14, opción A): descartado en favor de "A vos también te cancelan. Acá no lo pagás." — frase ya validada en la home revisada; consistencia > novedad.
- **Re-agregar el relato de aprobación manual de cuentas** (hallazgo 11, condicional): descartado — sin respaldo en la fuente de verdad; queda flaggeado para Rafa (ver contradicciones).
- **Bloque intermedio "mes vencido" en vez de 5º paso** (hallazgo 5, opción B): descartado — como 5º paso entra gratis al schema HowTo y a la narrativa "Cinco pasos".
- **Bullet "Podés tener dos espacios en el mismo horario"** (dato real de la DB, considerado por el sintetizador): descartado — caso de nicho que complica el paso 03; vive mejor en /preguntas-frecuentes.

---

## Contradicciones / pendientes para Rafa (NO resueltas acá)

1. **El veredicto del panel de 3 lentes nunca llegó al sintetizador** (placeholder `${JSON}` vacío y sin archivo en docs/nocturna/). Esta spec es auditor + fuente de verdad solamente — revisar si el panel corrió y dejó objeciones en otro lado.
2. **¿Existe la revisión/aprobación manual de cuentas?** La página vieja la afirmaba ("la aprobamos el mismo día, validamos cédula y matrícula"); no hay respaldo en app/DB. Se quitó. Si es real y querida, reincorporar con copy suave.
3. **¿El código abre solo la puerta de calle?** La página decía que abría también "el espacio que reservaste". Documentado: puerta de calle + videoportero. La spec dice solo puerta de calle.
4. **¿Existe físicamente una sala de espera común?** La página la prometía; no está documentada. La spec la elimina y manda al flujo timbre/videoportero + "entra justo a la hora de la reserva". Si la sala existe, hay copy mejor disponible.
5. **Confirmación de reserva por mail**: la página la afirmaba; no documentada. Se cambió a "confirmación al instante" (en la app). Confirmar si la app manda mails.
6. **9 vs 12 espacios** sigue abierta (la home dice 12; esta página deja de dar totales).
7. **`src/lib/site.ts` contradice la fuente de verdad** y alimenta OTRAS páginas: `ESPACIOS` ficticios (Estudio Norte/Sur, Consulta I–VII...), `AMENITIES` con "Sala de espera compartida" y "Sala de cowork incluida sin cargo", `DIFERENCIALES` con "12 espacios" y "Acceso 24/7", `HOURS.openingHours = '24/7'` (entra a Schema.org). Fuera del alcance de esta spec, pero es la raíz de varios datos falsos.
8. **"Entra justo a la hora de tu reserva"**: la fuente dice que el horario incluye ingreso/sesión/cierre, pero no explicita dónde espera el paciente si llega 10 minutos antes (¿en la calle?). Validar con Rafa que el copy no genere fricción real en puerta.
