# PDF comercial para WhatsApp — definitivo 2026-07-16

## Qué es

PDF de 4 páginas A4 (~510 KB) con toda la info esencial de Espacio 1010, para
enviar a quien consulta por WhatsApp. Aprobado como **definitivo** por Belén el
2026-07-16 tras tres rondas de feedback.

- **Archivo:** `public/espacio-1010-info.pdf`
- **URL pública (producción):** https://www.espacio1010.uy/espacio-1010-info.pdf
- **Generador:** `scripts/gen_pdf_info.py` (Python 3 + `reportlab` + `svglib` + `Pillow`)

## Cómo regenerarlo

```bash
pip install reportlab svglib pillow   # una sola vez
python scripts/gen_pdf_info.py       # escribe public/espacio-1010-info.pdf
```

Después: commit + push a `main` → Vercel lo publica en la misma URL.
El script toma el logo de `public/logo.svg` y las fotos de `public/fotos/`
(recorte tipo *cover* con foco vertical ajustable por foto, `focus_y`).

## Contenido (4 páginas)

1. **Portada** — logo grande, título "Alquilá tu espacio por hora, sin
   complicaciones", foto del Espacio 12, caja de precio ($350/h + descuentos
   del 10%/20% debajo; Sala Arcos "grupos grandes" $700/h) y 4 diferenciales
   (24/7, reserva online, mes vencido, primera hora gratis).
2. **Los espacios** — tarjeta con foto por tipo: atención individual (01/11/12),
   infancias (02), camilla (13), grupos y movimiento (03/14, foto con la ronda
   de sillas armada), Sala Arcos ancha (foto con sillas frente al muro de piedra).
3. **Cómo funciona** — 4 pasos con la captura de la app; franja "abierto 24/7,
   todos los días del año"; **Cancelaciones** con subtítulos "Horas de una vez"
   y "Horas fijas semanales"; tarjeta "Para tener en cuenta" (incluye respetar
   tiempos de entrada/salida).
4. **Dónde estamos** — dirección, 4 fotos (fachada, sala de espera, escalera de
   mármol, baños), "El edificio incluye" (6 ítems), banda BIENVENIDA1010 y
   contacto grande.

## Criterios de diseño/copy (Belén — mantener en futuras versiones)

- **Autocontenido**: asumir que el destinatario NO vio la web ("casi nadie mira la web").
- Esquemático: poco texto, letra grande (se lee en el celular), sin frases de relleno.
- Sin sección "Pensado para" (chips de profesiones) ni índice de páginas.
- Descuentos en líneas limpias, abajo del precio, en formato "descuento del 10%".
- "Sala Arcos (grupos grandes)" — nunca "(hasta 25)" sin contexto.
- Fotos de multiuso y Sala Arcos **armadas con sillas**.
- Sin: "150 días de anticipación", "8 horas seguidas / dos espacios" (confunden).
- "dispensadores de agua" (no "agua"); "videovigilancia en entrada y áreas comunes".
- Recorte de fotos: fachada y sala de espera con foco bajo (`focus_y=0.72`).
- Estética = paleta de la web: terracota `#9e4e42`, tinta `#1a1518`, crema.
- Copy con voseo y reglas de siempre ("sin compromiso", "estacionamiento no
  tarifado"); datos duros según `docs/VERDAD_APP_2026_06_10.md`.

## Fotos agregadas al repo en esta tanda

Convertidas desde el Drive (`H:\Mi unidad\Espacio 1010\...\Fotos consultorios`):

- `public/fotos/espacios/espacio-14-3.webp` ← `20260627_140513.jpg` (multiuso con ronda de sillas)
- `public/fotos/espacios/sala-arcos-4.webp` ← `20260629_122632.jpg` (Sala Arcos con sillas)

Quedan disponibles también para los carruseles de la web si se quieren sumar.

## Referencia de la competencia (contexto de la decisión)

Se analizaron los PDFs de PsicoEquipo (7 págs) y Adecuar (13 págs). Ambos tienen
horarios de sede limitados, cierran feriados y cobran por adelantado — por eso el
PDF enfatiza 24/7 los 365 días, reserva por app sin coordinar y pago a mes vencido.
