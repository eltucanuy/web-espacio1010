# Auditoría — /el-lugar (sesión nocturna 2026-06-10)

> Auditor: subagente nocturno. Fuente de verdad: `docs/VERDAD_APP_2026_06_10.md` (la app manda).
> Archivo auditado: `src/pages/el-lugar.astro` (+ datos compartidos que renderiza: `src/lib/site.ts` AMENITIES/ADDRESS/SITE, `src/lib/schema.ts`, `src/pages/og/[slug].ts`).
> Referencia de tono: home (`src/pages/index.astro`) — NO se toca, solo referencia.

## Resumen ejecutivo

La página tiene buena estructura editorial y un diferencial honesto (sección de accesibilidad), pero hoy **rema en contra de la conversión y de la verdad**:

1. La única foto es `fachada.jpg` (fachada EN OBRA, con cartel y marca de agua de IA) cuando la home ya tiene 8 fotos reales lindas (`lugar-*.webp` + `fachada-final.webp`).
2. El CTA final manda a `agenda.espacio1010.uy` con "Crear cuenta" — viola la estrategia vigente (CTA primario = pre-registro `/#registro` con primera hora gratis).
3. Renderiza el array `AMENITIES` de `site.ts`, que contiene **3 datos falsos** contra la app: "Acceso 24/7", "Cocina y sala de estar para tus pacientes" (el comedor es EXCLUSIVO de profesionales) y "Sala de cowork incluida" (concepto inexistente en la app).
4. La meta description usa el total "12 espacios", prohibido en subpáginas por la discrepancia abierta.

---

## Hallazgos

### H1 — Foto hero: fachada en obra, con cartel y marca de agua de IA — `src/pages/el-lugar.astro:38`
**Gravedad: critico** (foco específico del encargo)

La sección "Visual del edificio" usa `/fotos/fachada.jpg`: la foto vieja en obra, con cartel, que el resto del sitio ya abandonó (la home usa `fachada-final.webp` editada, sin marca de agua "Contenido generado por IA"). Es la peor foto disponible en la página que justamente vende "el lugar".

**Propuesta:**
- Reemplazar el `<img>` de la línea 38 por `/fotos/fachada-final.webp` (misma fachada, nocturna, editada) con alt: `"Fachada reciclada del edificio de Espacio 1010, iluminada de noche, entre Palermo y Parque Rodó"`.
- Mejor aún (ver H2): convertir esa sección en una galería con las fotos reales.
- Evaluar borrar `public/fotos/fachada.jpg` del repo cuando ninguna página la use (también la referencia implícita en OG si la hubiera — hoy el OG de la página es generado, no usa esta foto).

### H2 — La página de "el lugar" no muestra el lugar: hay 7 fotos reales sin usar — `src/pages/el-lugar.astro:33-46` y `:49-74`
**Gravedad: alto** (oportunidad concreta, foco del encargo)

La home tiene una galería de 7 fotos reales (`lugar-fachada.webp`, `lugar-pasillo.webp`, `lugar-subsuelo.webp`, `lugar-herreria.webp`, `lugar-marmol.webp`, `lugar-sala-subsuelo.webp`, `lugar-circulacion.webp`, ver `index.astro:277-305` con captions y alts ya escritos y aprobados). En /el-lugar — la página cuyo único trabajo es mostrar el edificio — no aparece ninguna.

**Propuesta:** agregar una galería (grid masonry desktop / carrusel snap mobile, se puede adaptar el patrón exacto de `index.astro:277-305` reutilizando los mismos `src`, `cap` y `alt`) entre la sección "Historia + filosofía" y "Amenities". Las fotos ilustran literalmente el copy de la historia (mármol, herrería, ladrillo, claraboya). Cerrar la galería con la línea honesta ya validada en la home: *"Fotos reales de cada espacio, muy pronto."*

### H3 — CTA final viola la estrategia de pre-registro — `src/pages/el-lugar.astro:202-221`
**Gravedad: critico**

El bloque final dice "Venite a conocerlo… **creá tu cuenta y empezá a reservar online**" con botón primario `Crear cuenta` → `SITE.agendaUrl` (la PWA directa, sin cupón). La regla de la sesión es: CTA primario de TODAS las páginas = `/#registro` con primera hora gratis; secundario = WhatsApp. Además "empezá a reservar online" es falso en pre-apertura (abre en junio 2026).

**Propuesta de copy (rioplatense):**
- H2: `Venite a conocerlo.` (se mantiene)
- Párrafo: `Pre-registrate gratis y asegurá tu primera hora sin cargo para usarla durante 2026. ¿Querés verlo antes? Coordinamos una visita por WhatsApp.`
- Botón primario: `Quiero mi primera hora gratis` → `href="/#registro"`
- Botón secundario: `Coordinar visita por WhatsApp` → `CONTACT.whatsappLink('Hola! Quiero coordinar una visita a Espacio 1010.')` (importar `CONTACT` de `../lib/site`; hoy el secundario va a `/contacto`, aceptable pero el WhatsApp directo es la estrategia definida).

### H4 — Amenities con datos FALSOS vs la app — `src/pages/el-lugar.astro:90-103` (datos en `src/lib/site.ts:208-219`)
**Gravedad: critico** (el dato falso; el fix en site.ts impacta otras páginas — coordinar)

La página renderiza `AMENITIES` completo. Contra la fuente de verdad y `espacio1010/src/pages/cliente/Ayuda.jsx`:

1. `'Acceso 24/7 con código personal'` (site.ts:212) — **FALSO**: horario reservable 07:00–24:00 todos los días. Propuesta: `'Acceso con código personal, todos los días de 7 a 24 h'`.
2. `'Cocina y sala de estar para tus pacientes'` (site.ts:214) — **FALSO y grave**: el comedor del primer piso es *exclusivo de profesionales registrados*; las personas atendidas no entran (Ayuda.jsx:499-502). Propuesta: `'Comedor y sala de estar para profesionales, sin cargo'`.
3. `'Sala de cowork incluida sin cargo'` (site.ts:216) — "cowork" no existe como concepto en la app; es el mismo comedor/sala de estar. Propuesta: **eliminar el ítem** (queda cubierto por el anterior) — además hoy duplica el beneficio.
4. `'Sala de espera compartida'` (site.ts:215) — **dudoso**: la app dice que las personas que atendés "ingresan recién a la hora de tu reserva" (Ayuda.jsx:499); no hay evidencia de sala de espera para pacientes. Propuesta: eliminar o verificar con Rafa antes de mantener.
5. `'Música ambiente para mayor privacidad'` (site.ts:213) — sin respaldo explícito en app/DB (la home no lo menciona). Verificar con Rafa; si es real, mantener.

Nota: tocar `site.ts` afecta también a la home **(la home está PROHIBIDA)** — verificar antes de editar: la home (`index.astro`) NO importa `AMENITIES` (usa sus propios arrays `nivel2/nivel3`), así que el fix en site.ts es seguro para la home; sí impacta otras subpáginas que lo importen (coordinar con los otros auditores).

### H5 — Meta description con "12 espacios" (discrepancia abierta) + claim "totalmente reciclado para alojar 12 espacios" — `src/pages/el-lugar.astro:10`
**Gravedad: alto**

La regla de la sesión: en subpáginas EVITAR el total "12 espacios". Además la description actual es larga y poco orientada a búsqueda.

**Propuesta de description:**
`"Edificio centenario en Gaboto 1010, entre Palermo y Parque Rodó, Montevideo, reciclado a nuevo para consultorios y salas por hora. Conocé la historia, los amenities y cómo llegar a Espacio 1010."`

### H6 — "lo único en lo que pienses sea tu paciente" — `src/pages/el-lugar.astro:70`
**Gravedad: medio**

Regla de copy: usar "las personas que atendés" (no siempre "pacientes") — el público incluye coaches, talleristas, consteladoras, etc.

**Propuesta:** `"La idea es que cuando entres, lo único en lo que pienses sea la persona que vas a atender."`

### H7 — "En pleno Parque Rodó" contradice el posicionamiento "entre Palermo y Parque Rodó" — `src/pages/el-lugar.astro:115-117` (dato en `src/lib/site.ts:23`)
**Gravedad: medio**

`ADDRESS.neighborhood = 'Parque Rodó'` hace que el H2 diga "En pleno Parque Rodó" — pero la dirección real es *límite Palermo / Parque Rodó* y toda la web (incl. home y hero de esta misma página, línea 26) dice "entre Palermo y Parque Rodó". "En pleno" es directamente inexacto.

**Propuesta:** H2 hardcodeado en la página: `Entre Palermo y Parque Rodó, a un paso de todo.` (sin tocar `ADDRESS.neighborhood`, que usan el schema y otros lados — flag aparte si se quiere unificar). De paso, el bullet de la línea 130 repite "Entre Palermo y Parque Rodó" — si el H2 lo dice, cambiar el bullet por algo que sume, p.ej.: `A pocas cuadras de 18 de Julio y del Parque Rodó`.

### H8 — Mapa con OpenStreetMap y coordenadas "aproximadas" vs Google Maps embed de la home — `src/pages/el-lugar.astro:160-168`
**Gravedad: medio**

El iframe usa OSM con `ADDRESS.lat/lng`, que en `site.ts:27-29` están marcadas como "aproximadas — verificar antes del launch". La home ya resolvió esto con un embed de Google Maps por query (`index.astro:434-442`), que no depende de coordenadas dudosas y es visualmente consistente.

**Propuesta:** reemplazar el iframe OSM por el mismo embed de la home:
`src="https://www.google.com/maps?q=Gaboto%201010%20Montevideo%20Uruguay&output=embed"` (mismo `title`, `loading="lazy"`, `referrerpolicy="no-referrer-when-downgrade"`).

### H9 — Claims de historia/obra sin respaldo en la fuente de verdad — `src/pages/el-lugar.astro:53-71`
**Gravedad: medio**

Storytelling con datos concretos no verificables en app/DB ni docs: "abandonada durante años", "faltaba estructura y sobraba humedad", "pisos calcáreos", "domótica para climatización y luces", "wifi de fibra repartido por planta", "música ambiente". Las fotos reales respaldan mármol/herrería/ladrillo/claraboya, no lo demás. Regla: no inventar datos.

**Propuesta:** pedir a Rafa confirmación punto por punto (es probable que mucho sea cierto — él conoce la obra). Mientras tanto, versión segura del 3er párrafo apoyada solo en lo confirmado (wifi y AA están en la app): `"Adentro, la tecnología no se nota: wifi en todo el edificio, aire acondicionado en cada espacio y acceso con tu código personal. La idea es que cuando entres, lo único en lo que pienses sea la persona que vas a atender."`

### H10 — Sección Accesibilidad: datos no verificables ("dos escalones", "baño totalmente accesible") — `src/pages/el-lugar.astro:174-200`
**Gravedad: medio**

La sección es excelente como diferencial de honestidad y conviene CONSERVARLA, pero los datos duros (dos escalones en el acceso, baño accesible en PB, pasillos aptos silla de ruedas) no están en la fuente de verdad ni en la app. Si son inexactos, el daño reputacional es alto justamente porque la sección promete honestidad.

**Propuesta:** confirmar con Rafa los 3 datos antes del próximo deploy. No reescribir copy (el tono está bien y respeta "coordinamos por WhatsApp").

### H11 — SEO on-page: title genérico y sin schema específico — `src/pages/el-lugar.astro:9` y `BaseLayout`
**Gravedad: bajo**

- `title="El lugar"` → renderiza "El lugar — Espacio 1010". Correcto pero desaprovecha keywords. Propuesta: `title="El lugar — casa centenaria reciclada en Gaboto 1010"` (queda "… — Espacio 1010" por el layout; verificar que no quede demasiado largo, alternativa: `"El lugar: Gaboto 1010, entre Palermo y Parque Rodó"`).
- Canonical y OG: bien resueltos por `BaseLayout` + `ogSlug="el-lugar"` (OG generado dice "Cien años de historia, reciclados a nuevo" — coherente, OK).
- El schema global `LocalBusiness` (`src/lib/schema.ts:62-69`) declara apertura 00:00–23:59 (24/7) — contradice el horario real 7–24. Es archivo compartido: flag para el informe general, no exclusivo de esta página. Propuesta: `opens: '07:00'`, `closes: '23:59'` (o '24:00').
- Internal linking: la página no enlaza a `/los-espacios` ni a `/precios`. Propuesta: en el cierre de la sección Historia o antes del CTA final, una línea: `"¿Querés ver los consultorios y salas? Conocé los espacios."` con link a `/los-espacios`.

### H12 — H1 y hero: OK (sin cambios)
**Gravedad: —**

El H1 "Una casa con 100 años, puesta a punto para los próximos 100" es bueno, único, coherente con el OG. El párrafo del hero respeta "entre Palermo y Parque Rodó". El bullet de estacionamiento (línea 144) cumple la regla "no tarifado". Se deja constancia para que nadie lo "mejore" sin necesidad.

---

## Prioridad sugerida de ejecución

1. H3 (CTA pre-registro) — conversión, crítico.
2. H1 + H2 (fotos reales) — confianza, crítico/alto.
3. H4 (amenities falsos en site.ts) — verdad, crítico (coordinar con otros auditores por archivo compartido).
4. H5 (meta description sin "12 espacios") — alto.
5. H6, H7, H8 — medios, baratos de aplicar.
6. H9, H10 — requieren confirmación de Rafa (no resolver unilateralmente).
7. H11 — bajo, oportunista.
