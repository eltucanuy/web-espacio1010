# Medición SEO/AEO — 50 días después de la tanda vs Pisama

> Corrida automática del 2026-08-22 (tarea programada `medir-seo-vs-pisama`).
> Tanda original: 2026-07-03 → 07-05. Plan: [`PLAN_SEO_2026_07_03.md`](./PLAN_SEO_2026_07_03.md).
> Lo que sigue es lo verificable sin accesos de Rafa. Search Console queda pendiente de él.

## 1. Test de IAs / buscadores (2026-08-22)

Cuatro consultas con búsqueda web real:

| Consulta | ¿Cita a Espacio 1010? | ¿Cita a Pisama? |
|---|---|---|
| "dónde alquilo un consultorio por hora en Montevideo" | ❌ no aparece | ❌ tampoco (ganan MercadoLibre, Evisos, PlanetaUruguay, Escritorios Maiant) |
| "cuánto cuesta un consultorio por hora en Montevideo" | ❌ no aparece | ✅ sí — `/soluciones/psicologos`, citado con el precio "$200" |
| "espacio 1010 alquiler consultorios por hora Montevideo" (marca propia) | ❌ **no aparece ni con su propio nombre** | ✅ sí (home + /soluciones/psicologos) |
| "espacio1010.uy" (dominio exacto) | ❌ sin resultados del dominio | — |

**Lectura:** a 50 días, el objetivo AEO no se cumplió. Pisama sigue siendo la
única fuente uruguaya que las IAs citan para el precio por hora, y E1010 no
entra ni en la búsqueda de marca. Las SERPs transaccionales genéricas las
siguen acaparando los clasificados (MercadoLibre/Evisos), igual que en julio.

## 2. Indexación real (DuckDuckGo/Bing, `site:espacio1010.uy`)

9 URLs indexadas de 34 del sitemap:

- ✅ `/`, `/como-funciona`, `/contacto`, `/el-lugar`, `/precios`, `/preguntas-frecuentes`, `/los-espacios`, `/guias` (índice), `/para/meditacion-yoga`
- ❌ **las 6 guías pilar** (solo el índice `/guias`)
- ❌ **9 de las 10 landings `/para/`** (incluidas fonoaudiólogos, terapias-corporales, terapeutas-holísticos y coaches — las cuatro nuevas)
- ❌ las 9 fichas `/los-espacios/*` y `/alquiler-consultorio-montevideo`

O sea: lo que se escribió en julio para ser citado es justamente lo que no está
indexado. (Bing ≠ Google, pero es la señal disponible sin Search Console.)

## 3. Causa técnica probable — conflicto de trailing slash 🔴

Encontrado verificando el sitio en producción:

- El **sitemap** declara las URLs **con** barra final: `…/guias/cuanto-cuesta-…/`
- Vercel (`vercel.json` → `"trailingSlash": false`) responde a esas URLs con
  **308 Permanent Redirect** hacia la versión **sin** barra.
- La página sin barra devuelve 200 pero su **`<link rel="canonical">` apunta a
  la versión con barra** — es decir, a una URL que redirige de vuelta a ella.

Verificado con `curl` como Googlebot:

```
GET /guias/cuanto-cuesta-alquilar-un-consultorio-en-montevideo/  → 308 → /guias/cuanto-cuesta-…
GET /guias/cuanto-cuesta-alquilar-un-consultorio-en-montevideo   → 200, canonical = …/ (con barra)
GET /para/fonoaudiologos/                                        → 308 → /para/fonoaudiologos
GET /para/fonoaudiologos                                         → 200, canonical = …/ (con barra)
```

Las **33 URLs no-home del sitemap redirigen**. En Search Console eso se ve como
"Página con redirección" en vez de "Indexada", y el canónico contradictorio es
una señal en conflicto que atrasa o bloquea la indexación. La home no sufre el
problema (por eso es lo único bien indexado, junto con las páginas más viejas y
enlazadas).

**Origen:** `astro.config.mjs` no fija `trailingSlash`, así que Astro construye
en formato directorio (`/x/index.html`) y tanto `@astrojs/sitemap` como el
canónico de `BaseLayout.astro:45` / `LandingLayout.astro:49`
(`new URL(Astro.url.pathname, SITE.url)`) emiten la barra — mientras Vercel
sirve sin barra.

**Fix propuesto (1 línea + build + reenvío del sitemap):** agregar
`trailingSlash: 'never'` (y `build: { format: 'file' }` si hace falta) en
`astro.config.mjs`, verificar que sitemap y canónicos queden sin barra, deploy y
reenviar el sitemap en Search Console. No tocado en esta corrida: es un cambio
de infraestructura de indexación y merece su propia sesión con verificación.

**Robots/llms:** correctos. `robots.txt` 200 con `Allow: /`, sitemap declarado,
nota a crawlers de IA; `/llms.txt` 200 con datos actualizados.

## 4. Pisama — sitemap re-fetcheado (2026-08-22)

Sin novedades: **27 URLs, las mismas 27** documentadas en el plan de julio.

- Estáticas: `lastmod` 2026-05-27 (fecha de build, anterior a nuestra tanda).
- Blog: 4 posts, el último del **2025-11-26**. No publicaron nada en 9 meses.
- Siguen 7 landings `/soluciones/*` (nosotros 10) y la guía de uso.

**No se movieron.** La ventaja de contenido de E1010 sigue siendo real; el
problema es que Google/Bing no la ven.

## 5. Pendiente de Rafa — Search Console

1. Rendimiento → Consultas, últimos 3 meses, comparar julio vs agosto:
   `alquiler consultorio montevideo`, `consultorio por hora montevideo`,
   `cuánto cuesta alquilar un consultorio`. Anotar posición media e impresiones.
2. Rendimiento → Páginas, filtrar por `/guias/` y por `/para/`: ¿alguna
   impresión desde el 5 de julio?
3. **Indexación → Páginas**: buscar el conteo de "Página con redirección" y
   "Rastreada, actualmente sin indexar". Ahí se confirma o se descarta el
   diagnóstico del punto 3.
4. Sitemaps: ver si `sitemap-index.xml` reporta URLs descubiertas vs indexadas.

## 6. Recomendación

**Prioridad 1 (bloqueante):** arreglar el trailing slash. Refrescar guías o
escribir contenido nuevo no sirve de nada mientras las páginas no se indexen.

**Prioridad 2:** cuando la indexación se confirme, recién ahí refrescar
`updatedDate` de las 6 guías (hoy 2026-07-03/04) y sumar contenido del backlog.

**Prioridad 3 (fuera del repo, ya en el plan):** Google Business Profile con
fotos, publicaciones y Q&A, y seguir juntando reseñas. Para "dónde alquilo un
consultorio en Montevideo" el resultado local pesa más que cualquier landing.

**No hacer todavía:** contenido nuevo. El cuello de botella no es la cantidad.

## 7. Actualización — mismo día, tarde

**Trailing slash arreglado y en producción** (merge `84b4529`, commit
`2775604`: `trailingSlash: 'never'` + helper `canonicalFor()` en `site.ts`).
Verificado con curl como Googlebot post-deploy:

- Sitemap: 34 URLs, **0 con barra final**.
- Guía, `/para/`, ficha de espacio, `/precios`, home: **200 directo**, canónico
  y `og:url` idénticos a la URL servida (autorreferenciales).
- La forma vieja con barra sigue redirigiendo 308 a la nueva (correcto: lo que
  Google tenga cacheado con barra consolida al canónico).

**Crawlers de IA**: probados 9 user agents (Googlebot, bingbot, GPTBot,
ClaudeBot, PerplexityBot, OAI-SearchBot, Google-Extended, Amazonbot,
meta-externalagent) contra `/`, una guía y `/llms.txt` → todos 200, sin
`cf-mitigated`. Cloudflare no bloquea nada. Descartado como causa.

**Pendiente de Rafa (ahora sí tiene sentido):** Search Console → Sitemaps →
reenviar `sitemap-index.xml`; Inspección de URL → "Solicitar indexación" para
las 6 guías y las 4 landings nuevas (10 pedidos, ~1 min cada uno).
