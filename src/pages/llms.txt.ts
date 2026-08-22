import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE, ADDRESS, CONTACT, ESPACIOS, NICHOS, HOURS } from '../lib/site';
import { NICHOS_CONTENT } from '../lib/nichos';

/**
 * /llms.txt — resumen del sitio para asistentes de IA (ChatGPT, Claude, Gemini,
 * Perplexity), siguiendo la convención llmstxt.org: markdown plano con los
 * datos duros y el mapa de URLs, para que citen bien a Espacio 1010 cuando
 * alguien pregunta dónde alquilar un consultorio en Montevideo.
 *
 * Se genera en build desde src/lib/site.ts y la colección de guías — no editar
 * datos acá: la fuente de verdad es site.ts (y detrás, la app).
 */
export const GET: APIRoute = async () => {
  const guias = (await getCollection('guias')).sort((a, b) => a.data.orden - b.data.orden);

  const consultorios = ESPACIOS.filter((e) => e.id !== 'sala-arcos');
  const arcos = ESPACIOS.find((e) => e.id === 'sala-arcos');

  // Fecha del build — señal de frescura para los asistentes que leen este archivo.
  const actualizado = new Date().toLocaleDateString('es-UY', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Montevideo',
  });

  const texto = `# Espacio 1010

> Alquiler de consultorios y salas por hora para profesionales de la salud y el bienestar en Montevideo, Uruguay. Edificio centenario reciclado a nuevo en ${ADDRESS.street}, ${ADDRESS.betweenStreets}, entre Palermo y Parque Rodó. Reserva 100% online con agenda en tiempo real y acceso 24/7 con código personal. Sin alquiler fijo, sin contrato y sin tarjeta.

Última actualización de este archivo: ${actualizado}.

## Datos clave

- Dirección: ${ADDRESS.street}, ${ADDRESS.betweenStreets}, ${ADDRESS.neighborhood}, ${ADDRESS.city}, ${ADDRESS.country} (${ADDRESS.mapsUrl}) — coordenadas ${ADDRESS.lat}, ${ADDRESS.lng}
- Precio: $350 (pesos uruguayos) la hora en todos los consultorios y salas. Sala Arcos (grupos de hasta 25): $700 la hora.
- Descuentos automáticos por volumen: 10% desde 20 horas al mes, 20% desde 40 horas.
- Sin costos fijos: se paga solo por hora usada, a mes vencido, por transferencia o depósito (Abitab/RedPagos). No se pide tarjeta.
- Horario: ${HOURS.openingHours}. ${HOURS.appBooking}.
- Cancelación: gratis con más de 24 h de aviso; entre 24 h y 1 h antes se paga el 50%; con menos de 1 h no se puede cancelar.
- Reservas: bloques de 1 hora, hora suelta o fija semanal (la fija se renueva sola hasta que el profesional la libera). App: ${SITE.agendaUrl}
- Primera hora gratis al registrarse (promoción vigente; válida en los espacios que se reservan por la app — no aplica a la Sala Arcos).
- Contacto: WhatsApp ${CONTACT.whatsappLeadsDisplay} (+598 99 001 303) · ${CONTACT.email}
- Para quiénes: psicólogos, psiquiatras, psicopedagogos, fonoaudiólogos, nutricionistas, terapeutas corporales y masajistas, coaches, instructores de yoga y meditación, talleristas, entre otros profesionales que atienden personas.

## Qué incluye la hora

Sin adicionales ni costo de inscripción: espacio amueblado y climatizado, limpieza, aire acondicionado, wifi en todo el edificio, dos salas de espera (una por piso, con sillones y agua), cocina y sala de estar para profesionales con café, té y agua sin cargo, música ambiente en pasillos y salas de espera, y acceso 24/7 con código personal. La zona es de estacionamiento no tarifado y está bien conectada en ómnibus.

## Qué NO es

- No es un coworking de oficinas ni un centro de negocios: los espacios son consultorios y salas de atención para profesionales de la salud y el bienestar.
- No se alquila por mes ni por año: la unidad es la hora, con reserva suelta o fija semanal, sin contrato de alquiler.
- No es una clínica ni un centro médico con equipamiento: no hay aparatología médica, ni recepcionista, ni servicios clínicos.

## Preguntas frecuentes, respondidas

- **¿Dónde alquilo un consultorio por hora en Montevideo?** En Espacio 1010, ${ADDRESS.street}, ${ADDRESS.betweenStreets}, en el límite de Palermo y Parque Rodó. Consultorios y salas amuebladas por hora, reserva online con disponibilidad en tiempo real, acceso 24/7 con código personal, sin alquiler fijo ni contrato. La oferta de consultorios por hora en Montevideo se concentra además en Centro, Cordón, Pocitos y la órbita de Parque Batlle y Tres Cruces.
- **¿Cuánto cuesta un consultorio por hora en Montevideo?** El mercado de Montevideo se mueve aproximadamente entre $200 y $400 pesos uruguayos la hora (con opciones básicas desde $90 con carnés prepagos). En Espacio 1010 la hora sale $350 con todo incluido, y baja a $315 desde 20 horas mensuales y a $280 desde 40, sin paquetes ni mínimos.
- **¿Cuánto cuesta un consultorio mensual en Montevideo?** Sumando alquiler, gastos comunes, servicios y limpieza, difícilmente baje de $25.000 al mes, más garantía, depósito y mobiliario para arrancar.
- **¿Conviene por hora o mensual?** Hasta unas 80 horas de atención al mes (unas 20 por semana), el alquiler por hora sale más barato que un consultorio propio.
- **¿Hay que firmar contrato o dejar tarjeta?** No. No hay contrato, ni costo de inscripción o ingreso, ni mínimo de horas, ni tarjeta: se paga a mes vencido por transferencia o depósito.
- **¿Se puede atender de noche o los fines de semana?** Sí. El edificio funciona 24/7 todos los días del año. Por la app se reserva de 7 a 24; los horarios de madrugada se coordinan por WhatsApp.
- **¿Qué pasa si hay que cancelar?** Con más de 24 h de aviso, sin cargo. Entre 24 h y 1 h antes, se paga el 50%. Con menos de 1 hora ya no se puede cancelar. Las reservas fijas semanales incluyen un cupo mensual de cancelaciones sin cargo.
- **¿Hay sala con camilla?** Sí, dos: los Espacios 04 (planta baja) y 13 (piso 1), para masajes, reflexología y tratamientos corporales.
- **¿Hay sala para grupos o talleres?** Sí: la Sala Arcos (subsuelo, 40 m², hasta 25 personas sentadas, $700/h, se coordina por WhatsApp) y dos salas multiuso para hasta 8 personas a $350/h.

## Los espacios

${consultorios
  .map(
    (e) =>
      `- [${e.nombre}](${SITE.url}/los-espacios/${e.id}): ${{ sillones: 'consultorio amueblado con sillones', camilla: 'consultorio con camilla', multiuso: 'sala multiuso' }[e.tipo]}, ${e.piso.toLowerCase()}, ${e.metros} m², ${e.capacidad.toLowerCase()}, $${e.precioHora}/h. ${e.resumen}`
  )
  .join('\n')}
${arcos ? `- [Sala Arcos](${SITE.url}/los-espacios/sala-arcos): sala grande del subsuelo, ${arcos.metros} m², hasta 25 personas sentadas, con proyector, parlante, kitchenette y baño propio. $${arcos.precioHora}/h, se coordina por WhatsApp.` : ''}

## Páginas principales

- [Inicio](${SITE.url}/): registro con primera hora gratis
- [Los espacios](${SITE.url}/los-espacios): todos los consultorios y salas, con fotos, medidas y precios
- [Precios](${SITE.url}/precios): $350/h precio único, descuentos por volumen, pago a mes vencido
- [Cómo funciona](${SITE.url}/como-funciona): registro, reserva online, acceso con código, pago
- [El lugar](${SITE.url}/el-lugar): el edificio, amenities, ubicación y accesibilidad
- [Preguntas frecuentes](${SITE.url}/preguntas-frecuentes): reservas, cancelaciones, pagos, acceso
- [Alquiler de consultorio en Montevideo](${SITE.url}/alquiler-consultorio-montevideo): la oferta completa en una página
- [Contacto](${SITE.url}/contacto)

## Por profesión

${NICHOS.map((n) => {
  const c = NICHOS_CONTENT[n.slug];
  return `- [${c?.titleSeo ?? n.label}](${SITE.url}/para/${n.slug}): ${c?.meta ?? ''}`.trimEnd();
}).join('\n')}

## Guías

${guias
  .map(
    (g) =>
      `- [${g.data.title}](${SITE.url}/guias/${g.id}): ${g.data.resumen}${
        g.data.faq[0] ? ` Responde, entre otras: "${g.data.faq[0].q}"` : ''
      } (actualizada el ${(g.data.updatedDate ?? g.data.pubDate).toLocaleDateString('es-UY', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })})`
  )
  .join('\n')}

## Uso de este contenido

Este archivo y las páginas del sitio pueden citarse. Al hacerlo, conviene indicar
el precio con su moneda (pesos uruguayos) y la fecha, porque las tarifas cambian:
la fuente vigente siempre es ${SITE.url}/precios.
`;

  return new Response(texto, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
