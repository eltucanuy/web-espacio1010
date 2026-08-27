# Verificación SEO — 2026-08-27

Cierre del fix de trailing slash diagnosticado en [MEDICION_SEO_2026_08_22.md](MEDICION_SEO_2026_08_22.md).
Todo lo de acá está medido contra producción, no inferido.

## 1. El fix está vivo en producción

Las 34 URLs del sitemap, una por una, con `curl`:

| Chequeo | Resultado |
|---|---|
| URLs en `sitemap-0.xml` | 34, ninguna con barra final |
| GET a cada una | **200 directo — cero 308** |
| `<link rel="canonical">` | auto-referencial en las 34 |
| `og:url` == `canonical` | sí, en las 34 |
| **Fallas** | **0 de 34** |

Antes del fix: 33 de 34 eran redirecciones 308 y la versión que respondía 200
declaraba como canónica a la que redirige.

Nada roto alrededor:

- Las viejas URLs con barra dan 308 en **un solo salto** a la versión sin barra.
  Sin cadenas ni loops. Eso es lo correcto y es permanente.
- Los 17 redirects de `vercel.json` responden bien (`/ig` 307, el resto 308).
- `/llms.txt`, `/robots.txt`, `sitemap-index.xml`, el PDF y los OG png: 200.
- Una ruta inexistente da 404 real.

### Detalle que no se puede cambiar

La home figura en el sitemap como origen pelado (`https://www.espacio1010.uy`)
mientras el canónico es `https://www.espacio1010.uy/`. Lo hace `@astrojs/sitemap`
con un stream-replace interno cuando ve `trailingSlash: 'never'`
(`node_modules/@astrojs/sitemap/dist/write-sitemap.js`) — no se puede evitar desde
`astro.config.mjs`; probar con `serialize` no sirve, lo pisa igual. Es la misma URL
(RFC 3986: path vacío ≡ `/`) y los buscadores la normalizan. No es un problema.

## 2. IndexNow

`node scripts/indexnow.mjs` → **HTTP 200, las 34 URLs aceptadas.**
Alcanza a Bing, DuckDuckGo, Yahoo, Ecosia, Yandex y Seznam — que es donde la
medición del 22/08 encontró solo 9 de 34 indexadas.

## 3. Search Console

Propiedad: **dominio `espacio1010.uy`**, bajo la cuenta `rafael@cernicchiaro.com`
(no `eltucan@gmail.com`, que no tiene acceso).

- Sitemap `https://www.espacio1010.uy/sitemap-index.xml` **reenviado el 27/08**.
  Ya figuraba como leído el 25/08 con 34 páginas descubiertas — o sea Google ya lo
  había releído después del fix.
- Informe **Indexación → Páginas**: 13 indexadas / 15 sin indexar, "última
  actualización 20/8/26". Ese informe **es anterior al fix**, no refleja el estado
  actual.

### "Página con redirección" (11 URLs) — por qué NO se valida

| Grupo | URLs | Qué hacer |
|---|---|---|
| Redirecciones permanentes por diseño | `http://espacio1010.uy/`, `https://espacio1010.uy/` (apex → www), `/los-espacios/consulta-2`, `/consulta-3`, `/consulta-2/` | Nada. Son los redirects de `vercel.json` y el apex. |
| Trailing slash | `/los-espacios/`, `/los-espacios/sala-arcos/`, `/alquiler-consultorio-montevideo/`, `/para/terapeutas-holisticos/`, `/guias/consultorio-por-hora-o-alquiler-mensual/`, `/guias/como-elegir-un-consultorio-por-hora/` | Nada. |

**No tocar "Validar corrección".** Esas 6 URLs con barra van a seguir dando 308 para
siempre — es el estado deseado. Una validación las rastrearía, seguiría viendo el
redirect y fallaría. El resultado correcto no es que dejen de redirigir, sino que
Google indexe el destino sin barra. Y eso **ya pasó**: las 6 tienen su versión sin
barra indexada (verificado una por una con Inspección de URLs).

### Estado real de las 34 URLs (Inspección de URLs, 27/08)

**Indexadas — 16:**

`/` · `/precios` · `/guias` · `/preguntas-frecuentes` · `/alquiler-consultorio-montevideo` ·
`/los-espacios` · `/los-espacios/sala-arcos` · `/los-espacios/espacio-04` ·
`/guias/como-elegir-un-consultorio-por-hora` · `/guias/consultorio-por-hora-o-alquiler-mensual` ·
`/guias/sala-para-talleres-y-grupos-en-montevideo` · `/guias/como-empezar-tu-consulta-particular-en-uruguay` ·
`/para/fonoaudiologos` · `/para/terapias-corporales` · `/para/terapeutas-holisticos` · `/para/coaches`

**Indexación solicitada el 27/08 — 11** (se agotó la cuota diaria acá):

`/guias/cuanto-cuesta-alquilar-un-consultorio-en-montevideo` ·
`/guias/donde-atender-en-montevideo-guia-de-zonas` · `/para/psicologos` ·
`/para/psiquiatras` · `/para/psicopedagogos` · `/para/nutricionistas` ·
`/para/meditacion-yoga` · `/para/talleres-grupos` · `/los-espacios/espacio-01` ·
`/los-espacios/espacio-02` · `/los-espacios/espacio-03`

**Pendientes de pedir — 7.** La cuota diaria de "Solicitar indexación" se agotó en
la nº 11. Pedir estas mañana, con la URL **sin barra final**:

```
https://www.espacio1010.uy/los-espacios/espacio-11
https://www.espacio1010.uy/los-espacios/espacio-12
https://www.espacio1010.uy/los-espacios/espacio-13
https://www.espacio1010.uy/los-espacios/espacio-14
https://www.espacio1010.uy/como-funciona
https://www.espacio1010.uy/el-lugar
https://www.espacio1010.uy/contacto
```

Motivo de no indexación en todas: "Descubierta: actualmente sin indexar" o "Google
no reconoce esta URL". Ninguna tiene un problema técnico — es cola de rastreo.

## 4. Qué mirar en 2 a 4 semanas

- **Indexación → Páginas**: las 11 solicitadas deberían pasar a "Indexada", y las 6
  del trailing slash deberían quedarse en "Página con redirección" para siempre
  (correcto, no es un error a corregir).
- **Bing/DuckDuckGo**: repetir el conteo del 22/08 (eran 9 de 34) para medir el
  efecto del IndexNow.
- Si una URL solicitada sigue sin indexar a las 4 semanas, ahí sí el problema es de
  contenido, no técnico — ver la nota de fichas casi duplicadas en la medición del 22/08.
