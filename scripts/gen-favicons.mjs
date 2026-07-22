// Regenera el set de favicons desde cero: caja terracota redondeada + "1010" centrado.
// Motivo (2026-07-22): el favicon.ico histórico tenía el texto pegado abajo y cortado
// (métricas de Georgia distintas en librsvg vs navegador) y Google mostraba el globo
// genérico en resultados. Acá el texto se renderiza aparte, se recorta al contenido
// (trim) y se compone centrado sobre el fondo — el resultado no depende de la fuente.
//
// Uso: node scripts/gen-favicons.mjs
// Genera: public/favicon.ico (16/32/48/96) + public/favicon-96.png

import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';

const BASE = 512;
const TERRACOTA = '#9e4e42';
const CREMA = '#f8f7f5';

const bgSvg = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${BASE}" height="${BASE}"><rect width="${BASE}" height="${BASE}" rx="96" fill="${TERRACOTA}"/></svg>`
);

// Texto gigante sobre lienzo holgado; después se recorta al bbox real.
const textSvg = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${BASE * 2}" height="${BASE * 2}"><text x="${BASE}" y="${BASE}" font-family="Georgia, serif" font-size="300" font-weight="600" fill="${CREMA}" text-anchor="middle">1010</text></svg>`
);

async function base512() {
  const digits = await sharp(textSvg, { density: 96 }).png().toBuffer();
  const trimmed = await sharp(digits).trim().png().toBuffer();
  // Ancho objetivo: 78% de la caja, con centrado exacto por metadata.
  const target = Math.round(BASE * 0.78);
  const scaled = await sharp(trimmed).resize({ width: target }).png().toBuffer();
  const meta = await sharp(scaled).metadata();
  return sharp(bgSvg)
    .composite([
      {
        input: scaled,
        left: Math.round((BASE - meta.width) / 2),
        top: Math.round((BASE - meta.height) / 2),
      },
    ])
    .png()
    .toBuffer();
}

function buildIco(layers) {
  // ICO con entradas PNG (formato Vista+): header 6 bytes + dir 16 bytes/entrada + blobs.
  const count = layers.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2); // tipo icon
  header.writeUInt16LE(count, 4);
  const dir = Buffer.alloc(16 * count);
  let offset = 6 + 16 * count;
  layers.forEach(({ size, buf }, i) => {
    const o = i * 16;
    dir[o] = size === 256 ? 0 : size;
    dir[o + 1] = size === 256 ? 0 : size;
    dir.writeUInt16LE(1, o + 4); // planes
    dir.writeUInt16LE(32, o + 6); // bpp
    dir.writeUInt32LE(buf.length, o + 8);
    dir.writeUInt32LE(offset, o + 12);
    offset += buf.length;
  });
  return Buffer.concat([header, dir, ...layers.map((l) => l.buf)]);
}

const master = await base512();
const sizes = [16, 32, 48, 96];
const layers = [];
for (const size of sizes) {
  const buf = await sharp(master).resize(size, size).png().toBuffer();
  layers.push({ size, buf });
}

await writeFile('public/favicon.ico', buildIco(layers));
await writeFile('public/favicon-96.png', layers.find((l) => l.size === 96).buf);
console.log('OK: public/favicon.ico (16/32/48/96) + public/favicon-96.png');
