# Autoridad externa de Espacio 1010 — diagnóstico y plan de acción

> Investigación del 2026-08-22 (agente de autoridad/entidad, sin tocar el repo).
> Complementa `MEDICION_SEO_2026_08_22.md`. Diagnóstico de SERP hecho sobre
> Bing/DuckDuckGo (Google bloqueado desde el entorno).

## Resumen

El sitio **no tiene un problema de contenido ni de schema** — el marcado es mejor
que el de Pisama (que solo tiene LocalBusiness + PostalAddress + GeoCoordinates).
Tiene un problema de **entidad**: dominio de 3 meses, cero backlinks de terceros,
cero presencia en clasificados/directorios, y la única propiedad externa que
existía (MercadoLibre) está vencida. Al buscar la marca, Bing solo devuelve
propiedades propias.

Dato que lo confirma: en Bing, para "alquiler consultorio por hora montevideo",
**espacio1010.uy rankea #3–4** (después de MercadoLibre y pisama.uy). Bing indexa
y rankea bien. El agujero es Google (trailing slash, ya arreglado) + autoridad.

## 1. Inventario de presencia externa (verificado 2026-08-22)

| Activo | Estado |
|---|---|
| Google Business Profile | ✅ Vivo. **13 reseñas, 5,0** (eran 7 el 2026-07-05). FID `/g/11npqrm88r` |
| Instagram @espacio1010.uy | ✅ 708 seguidores, 15 posts, último 2026-08-11 |
| agenda.espacio1010.uy | ✅ Indexado en Bing |
| GitHub (repo público) | ✅ Aparece en SERP de marca — creado 2026-05-11 |
| **MercadoLibre** | ⚠️ `MLU-1448101880` **vencida** ("Publicación finalizada"). Publicada ~1/7 como particular por "María Belén". No linkea al sitio |
| Evisos | ❌ Ninguna (29 avisos activos en la categoría, ninguno de Gaboto) |
| Facebook / YouTube / LinkedIn | ❌ No existen (LinkedIn → 404) |
| OpenStreetMap | ❌ Nodo `Gaboto 1010,1012` existe **sin nombre** |
| Yelu.uy, PlanetaUruguay, Gallito, InfoCasas | ❌ Sin ficha |
| Prensa / comunidades profesionales | ❌ Cero menciones |

**Conflicto de entidad en la dirección:** el local pack de Bing para "Gaboto 1010"
devuelve **Happy Hostel / Palermo Art Hostel** (TripAdvisor, ZenHotels). La
dirección ya tiene otra entidad en los agregadores de viajes.

**Inconsistencia NAP:** GBP, MercadoLibre y OSM dicen **Palermo**; el sitio dice
**Parque Rodó**. Elegir uno como canónico. Además `schema.ts` usa
`addressRegion: 'Parque Rodó'` — en Schema.org es el departamento, debería ser
`Montevideo`.

**Host duplicado:** `web-espacio1010.vercel.app` responde 200 y es crawleable
(canónico apunta bien al dominio real; riesgo bajo).

## 2. Por qué Pisama sí es citado

No por schema (el suyo es mínimo). Por **antigüedad y huella externa**:

| Señal | Pisama | Espacio 1010 |
|---|---|---|
| Antigüedad online | Instagram desde ago-2022 (~4 años) | ~3 meses |
| **YouTube** | Canal @espacioPISAMA con recorridas que rankean en 1ª página | Ninguno |
| MercadoLibre | 2 avisos keyword-rich (hoy 404 pero siguen en índice de Bing) | 1 vencido, sin link |
| Marketplace tercero | Ficha en Latinafy (backlink real) | Ninguna |
| Instagram | 245 seguidores | **708** ✅ |
| Blog | 4 posts, estancado desde nov-2025 | 6 guías mejores — recién indexables desde hoy |

Hace tres cosas que E1010 no: existe hace 4 años, tiene video en YouTube, y
sembró fichas en marketplaces de terceros.

## 3. De dónde sacan los LLMs los datos de negocios uruguayos

Leen las primeras 5-10 URLs de la búsqueda. Para estas consultas son: páginas
de **categoría** de MercadoLibre y Evisos (ganan por autoridad de dominio aunque
los avisos estén vencidos), PlanetaUruguay, el sitio propio si tiene el precio en
texto plano e indexado, YouTube, y el local pack para intención "dónde".
**ChatGPT no usa Google Business Profile** para local: usa Bing Places y
Foursquare.

## 4. Checklist Google Business Profile (Rafa, 10 min en business.google.com)

- [ ] Verificado y reclamado por cuenta de Rafa
- [ ] Categoría principal: "Oficinas compartidas y coworking" o "Alquiler de oficinas"; secundarias: "Centro de salud mental", "Sala de conferencias"
- [ ] Barrio canónico (Palermo vs Parque Rodó) igual en GBP, sitio y avisos
- [ ] Horario: abierto 24 h todos los días
- [ ] Teléfono 099 001 303 mismo formato que el sitio; web `https://www.espacio1010.uy`; campo "Reservar" → `https://agenda.espacio1010.uy`
- [ ] Atributos: wifi, aire, accesible, baños
- [ ] **Fotos: mínimo 20** (3-5 por semana, no todas de golpe). Material en Drive H:
- [ ] **Publicaciones**: una por semana (primera hora sin costo, Sala Arcos, descuentos desde 20 h)
- [ ] **Q&A sembrado** desde cuenta personal, respondido desde el negocio (práctica legítima): precio, mínimo de horas, cómo entro, sala de espera, de noche, sala para grupos
- [ ] **Productos/Servicios con precio**: "Consultorio por hora — $350", "Sala Arcos — $700/h"
- [ ] **Responder las 13 reseñas**

## 5. Plan priorizado

### P1 — esta semana, todo gratis
1. **Republicar MercadoLibre** (https://www.mercadolibre.com.uy/publicaciones/inmuebles → Inmuebles › Oficinas › Alquiler › Montevideo). Título largo con keywords: *"Alquiler de consultorio por hora en Palermo - Parque Rodó para psicólogos, terapeutas y profesionales — Agenda online, sin contrato"*. $350. En la descripción, `www.espacio1010.uy` y `agenda.espacio1010.uy` en texto plano. Recordatorio de renovación a 55 días. Evaluar publicar como negocio, no como particular.
2. **Evisos** — alta https://safe.evisos.com/signup, publicar en https://post.evisos.com.uy/ads/add (gratis). **Dos avisos**: consultorio por hora ($350) y Sala Arcos ($700).
3. **GBP** — checklist §4. Si hay que elegir tres: categorías, 20 fotos, responder las 13 reseñas.
4. **Sitio**: `addressRegion` → `Montevideo`; snapshot de `ResenasGoogle.astro` (7 → 13); `sameAs` desde una sola fuente en `site.ts` (§6).

### P2 — 2-4 semanas
1. **YouTube @espacio1010** — recorrida de 60-90 s por espacio (slideshow de fotos alcanza), link al sitio en la primera línea, precio en texto. Es la señal más clara que tiene Pisama y nosotros no.
2. **OpenStreetMap** — nombrar el nodo: `name=Espacio 1010`, `office=coworking`, `website`, `phone=+598 99 001 303`, `opening_hours=24/7`. Alimenta Apple Maps, Bing Maps y datasets de entrenamiento.
3. **Facebook Page** — conectada al Instagram; habilita Marketplace y suma `sameAs`.
4. **Apple Business Connect** — https://business.apple.com
5. **Yelu.uy** — alta gratis https://www.yelu.uy/create-business-listing (plan `basic`; no pagar premium).

### P3 — verificar a mano antes de invertir
- **Gallito** — mayor autoridad inmobiliaria de Uruguay; bloquea scraping, flujo de alta sin verificar. Si es gratis/barato, sube a P1.
- **PlanetaUruguay** — aparece en las SERPs ganadoras; 403 anti-bot, no se pudo confirmar el alta.
- InfoCasas (encaje dudoso), Latinafy (no recomendado). `paginasamarillas.com.uy` no existe.

**No hacer:** comparativas nombrando a Pisama, `AggregateRating` propio, reseñas incentivadas, perfiles a nombre de terceros.

## 6. `sameAs` propuesto

Solo entra lo que exista y responda 200. Mover a `SOCIAL.perfiles` en
`src/lib/site.ts` y que `schema.ts` haga `sameAs: Object.values(SOCIAL.perfiles)`:

```ts
perfiles: {
  instagram: 'https://www.instagram.com/espacio1010.uy/',
  google: 'https://www.google.com/maps/place/?q=place_id:<PLACE_ID>', // places.id ya viene en la respuesta de api/resenas.js
  // sumar a medida que se creen: facebook, youtube, linkedin, openstreetmap, yelu
},
```

MercadoLibre y Evisos **no** van en `sameAs` (son avisos, vencen).

## 7. Sin verificar
Google Maps/google.com bloqueados (todo sobre Bing/DDG); PlanetaUruguay, Gallito
y cybo con 403; perfil de backlinks de Pisama sin herramienta de pago; antigüedad
de dominios (`rdap.nic.uy` no responde, Wayback 429).
