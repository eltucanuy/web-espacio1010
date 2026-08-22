#!/usr/bin/env node
/**
 * IndexNow — avisa a Bing (y por rebote a DuckDuckGo, Yahoo y Ecosia, que se
 * sirven del índice de Bing) que las URLs del sitio cambiaron, sin esperar a
 * que pasen a rastrear solos. Yandex, Seznam y Naver también lo consumen.
 * Google NO participa del protocolo: para Google sigue mandando el sitemap y
 * Search Console.
 *
 * Contexto (2026-08-22): de las 34 URLs del sitemap solo 9 estaban indexadas
 * en Bing. Esto es el empujón para que redescubra el resto después de un
 * deploy, sobre todo tras el fix de trailing slash.
 *
 * ── Cómo se usa ────────────────────────────────────────────────────────────
 *
 *   node scripts/indexnow.mjs              # lee el sitemap de producción y envía todo
 *   node scripts/indexnow.mjs --dry-run    # muestra qué enviaría, sin enviar
 *   node scripts/indexnow.mjs --from-dist  # lee dist/sitemap-0.xml en vez de producción
 *   node scripts/indexnow.mjs /precios /guias/como-elegir-un-consultorio-por-hora
 *                                          # envía solo esas rutas
 *
 * DISPARARLO DESPUÉS DE CADA DEPLOY, no antes: IndexNow le pide a los
 * buscadores que vayan a buscar la URL en ese momento. Si la mandás antes de
 * que Vercel termine de publicar, el crawler ve la versión vieja.
 *
 *   vercel deploy --prod --yes && node scripts/indexnow.mjs
 *
 * ── La key ─────────────────────────────────────────────────────────────────
 *
 * Vive en public/<key>.txt y se publica como https://www.espacio1010.uy/<key>.txt
 * con el propio valor de la key adentro (sin salto de línea). Ese archivo es la
 * prueba de que quien envía controla el dominio. Si se rota la key hay que
 * cambiar el .txt y la constante de acá — y volver a deployar ANTES de enviar,
 * o la API responde 403.
 *
 * No hace falta registrarse en ningún lado ni pasar por Bing Webmaster Tools:
 * la key puede ser cualquier hex/uuid propio de 8 a 128 caracteres.
 */

import { readFile } from 'node:fs/promises';

const HOST = 'www.espacio1010.uy';
const SITE = `https://${HOST}`;
const KEY = 'd722ef15ab30e860b999e5186de4ef8d';
const KEY_LOCATION = `${SITE}/${KEY}.txt`;

// Endpoint genérico: recibe el aviso y lo replica a todos los buscadores que
// participan del protocolo. Alternativas equivalentes: www.bing.com/indexnow,
// yandex.com/indexnow, search.seznam.cz/indexnow.
const ENDPOINT = 'https://api.indexnow.org/indexnow';

// El protocolo admite hasta 10.000 URLs por request; el sitio tiene 34, así que
// va en un solo POST. El lote queda por si algún día crece.
const BATCH = 10000;

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const fromDist = args.includes('--from-dist');
const rutas = args.filter((a) => !a.startsWith('--'));

/** Saca los <loc> de un sitemap XML. */
const parseLocs = (xml) =>
  [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);

async function urlsDelSitemap() {
  if (fromDist) {
    const xml = await readFile(new URL('../dist/sitemap-0.xml', import.meta.url), 'utf8');
    return parseLocs(xml);
  }
  const res = await fetch(`${SITE}/sitemap-index.xml`);
  if (!res.ok) throw new Error(`sitemap-index.xml devolvió ${res.status}`);
  const indices = parseLocs(await res.text());
  const urls = [];
  for (const idx of indices) {
    const r = await fetch(idx);
    if (!r.ok) throw new Error(`${idx} devolvió ${r.status}`);
    urls.push(...parseLocs(await r.text()));
  }
  return urls;
}

/** La key tiene que estar publicada y devolver exactamente su propio valor. */
async function verificarKey() {
  const res = await fetch(KEY_LOCATION);
  if (!res.ok) {
    throw new Error(
      `${KEY_LOCATION} devolvió ${res.status}. Deployá antes de enviar: sin el ` +
        `archivo de key publicado, IndexNow responde 403.`
    );
  }
  const body = (await res.text()).trim();
  if (body !== KEY) {
    throw new Error(`${KEY_LOCATION} contiene "${body}" y debería contener "${KEY}".`);
  }
}

function explicar(status) {
  return (
    {
      200: 'OK — URLs aceptadas.',
      202: 'Aceptado, pendiente de validar la key.',
      400: 'Formato inválido (revisá el JSON del body).',
      403: 'Key rechazada: no está publicada en keyLocation o no coincide.',
      422: 'Alguna URL no pertenece al host declarado, o la key no corresponde.',
      429: 'Demasiados envíos — esperá y reintentá más tarde.',
    }[status] ?? 'Respuesta inesperada.'
  );
}

async function main() {
  const urls = rutas.length
    ? rutas.map((r) => new URL(r, SITE).toString())
    : await urlsDelSitemap();

  const propias = urls.filter((u) => {
    const ok = u.startsWith(`${SITE}/`) || u === SITE;
    if (!ok) console.warn(`  ! descartada (otro host): ${u}`);
    return ok;
  });

  if (!propias.length) {
    console.error('No hay URLs para enviar.');
    process.exitCode = 1;
    return;
  }

  console.log(`IndexNow → ${ENDPOINT}`);
  console.log(`host=${HOST}  key=${KEY}  urls=${propias.length}`);
  for (const u of propias) console.log(`  · ${u}`);

  if (dryRun) {
    console.log('\n--dry-run: no se envió nada.');
    return;
  }

  await verificarKey();

  for (let i = 0; i < propias.length; i += BATCH) {
    const lote = propias.slice(i, i + BATCH);
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Host: HOST,
      },
      body: JSON.stringify({
        host: HOST,
        key: KEY,
        keyLocation: KEY_LOCATION,
        urlList: lote,
      }),
    });
    const cuerpo = (await res.text()).trim();
    console.log(`\nHTTP ${res.status} — ${explicar(res.status)}${cuerpo ? `\n${cuerpo}` : ''}`);
    if (!res.ok && res.status !== 202) process.exitCode = 1;
  }
}

main().catch((e) => {
  console.error(`\nIndexNow falló: ${e.message}`);
  process.exitCode = 1;
});
