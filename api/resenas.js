/**
 * GET /api/resenas — rating y cantidad de reseñas del perfil de Google de
 * Espacio 1010, en vivo vía Places API (New). La home lo consume para que el
 * "5,0 de 5 · N reseñas" se actualice solo (los TEXTOS de las reseñas se
 * curan a mano en index.astro — decisión Rafa 2026-07-05, opción híbrida).
 *
 * Config (Vercel → Settings → Environment Variables):
 *   GOOGLE_PLACES_API_KEY — API key con "Places API (New)" habilitada.
 *
 * Cache: CDN 24 h (+7 días stale-while-revalidate) → ~1 llamada real por día,
 * costo despreciable. Sin la key responde 503 y la home mantiene el valor
 * hardcodeado como respaldo — nunca rompe.
 */
export default async function handler(req, res) {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) {
    res.status(503).json({ error: 'GOOGLE_PLACES_API_KEY sin configurar' });
    return;
  }

  try {
    const r = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': key,
        // Solo rating y cantidad: mantiene la llamada en el SKU más barato.
        'X-Goog-FieldMask': 'places.id,places.displayName,places.rating,places.userRatingCount',
      },
      body: JSON.stringify({
        textQuery: 'Espacio 1010, Gaboto 1010, Montevideo, Uruguay',
        languageCode: 'es',
      }),
    });

    if (!r.ok) {
      res.status(502).json({ error: `Places API ${r.status}` });
      return;
    }

    const data = await r.json();
    // Elegimos el resultado que matchea el nombre, por si el text search trae vecinos.
    const lugar =
      (data.places || []).find((p) => /espacio\s*1010/i.test(p.displayName?.text || '')) ||
      (data.places || [])[0];

    if (!lugar || typeof lugar.rating !== 'number') {
      res.status(404).json({ error: 'lugar sin rating' });
      return;
    }

    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=604800');
    res.status(200).json({
      // "5,0" — formato rioplatense listo para mostrar.
      rating: lugar.rating.toFixed(1).replace('.', ','),
      cantidad: lugar.userRatingCount ?? null,
    });
  } catch (err) {
    res.status(500).json({ error: 'fetch failed' });
  }
}
