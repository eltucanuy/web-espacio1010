# Fuente de verdad — datos de la app (PWA) al 2026-06-10/11

> Compilado en la sesión nocturna del 2026-06-10 consultando **la base de datos real de
> producción** (Supabase, proyecto `espacio1010`) y el código/docs del repo
> `C:\Users\rafac\proyectos\espacio1010`. Este documento manda sobre cualquier dato que
> diga el sitio. Regla de la sesión (confirmada por Rafa): **la app manda** en datos
> duros; toda contradicción se lista en el informe nocturno para revisión.

## Identidad y contacto

- Nombre comercial: **Espacio 1010**. Razón social: Excalibur SAS (RUT 218933620018, domicilio fiscal Emilio Reus 2446 — NO es la dirección del local).
- **Dirección física real: Gaboto 1010, entre Isla de Flores y San Salvador**, límite Palermo / Parque Rodó, Montevideo. (Confirmado en `espacio1010/src/lib/share.js`.) La web ya la tiene bien.
- WhatsApp atención (humano): **+598 99 001 303** (`wa.me/59899001303`). Soporte humano según app/config.
- WhatsApp notificaciones (bot): 099 210 0964 — NO publicar en la web.
- Email: hola@espacio1010.uy. Instagram: @espacio1010.uy.
- App de reservas (PWA): https://agenda.espacio1010.uy — registro: `/c/BIENVENIDA1010` (cupón).

## Estado del negocio (junio 2026)

- **Pre-apertura**: el local abre en junio 2026; la home (`/`) es una landing de conversión a **pre-registro** (primera hora gratis, cupón BIENVENIDA1010, form → Supabase `pre_registros` → redirige a la PWA).
- Cupón BIENVENIDA1010 (verificado en DB): descuento **100%**, descripción pública "**Primera hora gratis · válida hasta fin de 2026**", vence 2026-12-31, activo.
- Fotos: hay fotos reales de áreas comunes (galería en la home); **todavía no hay fotos de los consultorios decorados** ("Fotos reales de cada espacio, muy pronto" sigue válido).

## Espacios (tabla `consultorios` en DB de producción — la verdad)

| Nombre real | Piso | Tipo | Capacidad | Medidas (m) | ~m² | $/h | Activo | Descripción (DB, resumida) |
|---|---|---|---|---|---|---|---|---|
| Espacio 01 | PB | amueblado | 4 sentados | 3.6×3.6 | 13 | 350 | ✅ | A la calle, cálido. Sillón de 3 cuerpos + butaca individual. Sesiones individuales, entrevistas, consultas. |
| Espacio 02 | PB | amueblado | 2 | 3.6×4.1 | 15 | 350 | ✅ | Versátil: 2 butacas + **rincón infantil** (mobiliario y materiales para niños) + escritorio. |
| Espacio 03 | PB | multiuso | 8 sentados / 6 libre | 4.2×4.5 | 19 | 350 | ✅ | Flexible: movimiento, meditación, grupos pequeños. Almohadones y mats/colchonetas. |
| Espacio 04 | PB | multiuso | 2 | 3.9×4.4 | 17 | 350 | ❌ inactivo | "Consultorio amplio" (placeholder, sin terminar). |
| Espacio 11 | P1 | amueblado | 2 | 3.8×2.5 | 9.5 | 350 | ✅ | A la calle, compacto y luminoso. 2 butacas individuales. Sesiones individuales / entrevistas breves. |
| Espacio 12 | P1 | amueblado | 3 | 3.8×3.6 | 14 | 350 | ✅ | Luminoso, **con balcón a la calle**. Sillón 2 cuerpos + butaca + escritorio. |
| Espacio 13 | P1 | amueblado | 2 | 3.6×3 | 11 | 350 | ✅ | **Con camilla**: masajes, reflexología, tratamientos corporales, abordajes integrales. + escritorio. |
| Espacio 14 | P1 | multiuso | 8 sentados / 6 libre | 4×4 | 16 | 350 | ✅ | Amplio y despejado: movimiento, meditación, grupos pequeños. Almohadones y mats. Equip.: apto movimiento / grupos pequeños. |
| Espacio 15 | P1 | multiuso | 2 | 3.5×3 | 10.5 | 350 | ❌ inactivo | "Consultorio amplio" (placeholder). |
| **Sala Arcos** | Subsuelo | multiuso | **25 sentados** | 10×4 | 40 | **700** | ❌ (se vende por WhatsApp, fuera del flujo público) | Gran escala: talleres, encuentros, movimiento, grupales. Sillas y mesas, **proyector, parlante, kitchenette y baño independiente**, colchonetas, almohadones. |

**Consecuencias para la web:**
- Los 12 espacios actuales de `src/lib/site.ts` (Estudio Norte/Sur, Consulta I–VII, Salón Cobre/Roble) son **FICTICIOS** (placeholders de un sprint viejo) → reemplazar por los reales.
- Espacios públicos hoy: **7 activos + Sala Arcos** (por WhatsApp). 04 y 15 existen pero están inactivos/incompletos → no publicarlos (o mencionarlos sin detalle); decidirlo está flaggeado en el informe.
- "9 vs 12 espacios" es una discrepancia histórica conocida (BACKLOG) y **sigue abierta con Rafa** → en las subpáginas EVITAR totales absolutos ("12 espacios") cuando sea posible; la home dice "12" y NO se toca esta noche (flag en informe).
- La agrupación por uso de la home es real y verificable: Atención individual (01, 11, 12) / Para infancias (02) / Con camilla (13) / Grupos, movimiento y talleres (03, 14, Sala Arcos).

## Precios y pagos (config DB de producción)

- Precio único: **$350/hora** (pesos uruguayos) en todos los espacios públicos. **Sala Arcos: $700/hora**.
- Sin matrícula, sin permanencia mínima, desde 1 hora.
- **Descuentos por volumen** (sobre el total del mes, aplicados en la liquidación): **20 h o más: 10% · 40 h o más: 20%** (tercera franja desactivada). Stacking con cupón: multiplicativo.
- **Pago a mes vencido**: liquidación se genera el día 1 con el detalle del mes anterior; **vence a los 10 días**. Sin tarjeta, sin adelantos, sin cobros automáticos.
- Formas de pago: **transferencia a BROU (titular Excalibur SAS)** o **depósito en Abitab / RedPagos**. Pagos parciales permitidos. (No publicar números de cuenta en la web; se ven dentro de la app.)
- Si hay liquidación vencida sin pagar, no se pueden hacer nuevas reservas.

## Horarios (config DB de producción)

- Horario reservable: **07:00 a 24:00, todos los días** (`horario_apertura=07:00`, `horario_cierre=24:00`; el cierre es la hora a la que termina la última reserva).
- ⚠️ La web dice "24/7" / "cualquier hora" en varios lados (incl. la home y `HOURS.openingHours`). **Para subpáginas usar "todos los días, de 7 a 24 h"**. La home no se toca → flag en informe.
- Atención humana (WhatsApp): el sitio decía "Lunes a sábado, 9 a 20 hs" — no hay dato en la app que lo contradiga; mantener salvo mejor criterio.
- Acceso con **código personal** + videoportero (sistema con contraseña + código + OK). Cámaras SOLO en entrada y zonas comunes, nunca en espacios de atención.

## Reservas y cancelaciones (config + RPCs de producción)

- Reserva en bloques de **1 hora** (hasta 8 horas seguidas). Anticipación máxima: **150 días**.
- Dos tipos: **"Una vez"** (eventual) y **"Todas las semanas"** (fija — mismo día/hora/espacio cada semana hasta que el cliente la libere; se generan ~6 meses adelante).
- Cancelación (config real): **gratis con más de 24 h** de aviso; **entre 24 h y 1 h antes: se cobra 50%**; con **menos de 1 h: ya no se puede cancelar**.
- Reservas fijas: las cancelaciones gratis (>24 h) tienen **tope mensual del 20%** de las horas fijas del mes ("1 de cada 5", fórmula proporcional confirmada por Rafa). Las eventuales no tienen tope.
- "Liberar" un horario fijo (dejar de reservarlo) no cuenta para el tope.
- Doble reserva (2 espacios, mismo horario): permitida.
- El horario reservado incluye ingreso, sesión y cierre (recomiendan sesiones de ~50 min). Comedor/sala de estar en el piso 1, exclusivo profesionales, sin cargo (la web lo llama "cocina y sala de estar" / "sala de cowork" — unificar como cocina/sala de estar para profesionales; "cowork" no existe como concepto en la app).

## Público objetivo (lista `profesiones_lista` de la app)

Psicólogo/a, Psiquiatra, Psicopedagogo/a, Fonoaudiólogo/a, Psicomotricista, Terapeuta ocupacional, Nutricionista, Kinesiólogo/a-Fisioterapeuta, Osteópata, Masajista/Terapeuta corporal, Acupunturista, Digitopunturista, Constelaciones familiares, Terapeuta holístico/a, Terapeuta, Coach, Consultor/a organizacional/RRHH, Sexólogo/a, Arteterapeuta, Musicoterapeuta, Docente/Tallerista, Consultor/a profesional, Otro.

## Reglas de copy ya decididas (handoffs de la web — respetar)

- NO usar: "boutique", "insonorizado", "sin permanencia" (usar "sin compromiso"), "Cordón" (usar "entre Palermo y Parque Rodó").
- SÍ usar: "estacionamiento NO tarifado", "las personas que atendés" (no siempre "pacientes"), tono cálido rioplatense (vos), confianza profesional ("Confiamos en vos", pago a mes vencido).
- Tipografía/diseño: sistema actual Inter + terracota; mobile-first.
- Testimonios de la home: reales y aprobados — se pueden referenciar, no inventar nuevos.
- Decisión firme: sin cookie banner. No sugerirlo.

## Estrategia de CTAs (decisión de esta sesión, alineada a la home)

- Mientras dure el pre-lanzamiento, el CTA primario de TODAS las páginas debe llevar al
  **pre-registro** (`/#registro`) con el mensaje de primera hora gratis, no a
  `agenda.espacio1010.uy` directo. CTA secundario: WhatsApp.
- Sala Arcos: CTA por WhatsApp (no se reserva por la app).

## Abierto / para el informe (NO resolver unilateralmente)

1. 9 vs 12 espacios (la home dice 12; DB tiene 10 con 7 activos + Sala Arcos).
2. Claims "24/7" de la home vs horario real 7–24.
3. Espacios 04 y 15: ¿se publican como "próximamente" o se omiten?
4. Cupón BIENVENIDA1010 con `cupo_reservas_por_usuario = null` — verificar en la app que el 100% aplique a UNA sola reserva.
5. Nombres reales de los espacios son utilitarios ("Espacio 01") — ¿Rafa quiere nombres con marca más adelante?
