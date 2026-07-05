import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE, ADDRESS, CONTACT, ESPACIOS, NICHOS, HOURS } from '../lib/site';

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

  const texto = `# Espacio 1010

> Alquiler de consultorios y salas por hora para profesionales de la salud y el bienestar en Montevideo, Uruguay. Edificio centenario reciclado a nuevo en ${ADDRESS.street}, ${ADDRESS.betweenStreets}, entre Palermo y Parque Rodó. Reserva 100% online con agenda en tiempo real y acceso 24/7 con código personal. Sin alquiler fijo, sin contrato y sin tarjeta.

## Datos clave

- Dirección: ${ADDRESS.street}, ${ADDRESS.betweenStreets}, ${ADDRESS.neighborhood}, ${ADDRESS.city}, ${ADDRESS.country} (${ADDRESS.mapsUrl})
- Precio: $350 (pesos uruguayos) la hora en todos los consultorios y salas. Sala Arcos (grupos de hasta 25): $700 la hora.
- Descuentos automáticos por volumen: 10% desde 20 horas al mes, 20% desde 40 horas.
- Sin costos fijos: se paga solo por hora usada, a mes vencido, por transferencia o depósito (Abitab/RedPagos). No se pide tarjeta.
- Horario: ${HOURS.openingHours}. ${HOURS.appBooking}.
- Cancelación: gratis con más de 24 h de aviso; entre 24 h y 1 h antes se paga el 50%; con menos de 1 h no se puede cancelar.
- Reservas: bloques de 1 hora, hora suelta o fija semanal (la fija se renueva sola hasta que el profesional la libera). App: ${SITE.agendaUrl}
- Primera hora gratis al registrarse (promoción vigente).
- Contacto: WhatsApp ${CONTACT.whatsappLeadsDisplay} (+598 99 001 303) · ${CONTACT.email}
- Para quiénes: psicólogos, psiquiatras, psicopedagogos, fonoaudiólogos, nutricionistas, terapeutas corporales y masajistas, coaches, instructores de yoga y meditación, talleristas, entre otros profesionales que atienden personas.

## Los espacios

${consultorios
  .map(
    (e) =>
      `- [${e.nombre}](${SITE.url}/los-espacios/${e.id}): ${e.tipo === 'amueblado' ? 'consultorio amueblado' : 'sala multiuso'}, ${e.piso.toLowerCase()}, ${e.metros} m², ${e.capacidad.toLowerCase()}, $${e.precioHora}/h. ${e.resumen}`
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

${NICHOS.map((n) => `- [${n.label}](${SITE.url}/para/${n.slug})`).join('\n')}

## Guías

${guias.map((g) => `- [${g.data.title}](${SITE.url}/guias/${g.id}): ${g.data.resumen}`).join('\n')}
`;

  return new Response(texto, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
