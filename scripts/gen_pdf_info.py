# -*- coding: utf-8 -*-
"""PDF comercial de Espacio 1010 (4 páginas) para enviar por WhatsApp.
v3 — feedback Belén 2026-07-08: más esquemático, menos texto, letra más grande,
foto del Espacio 12 en portada, descuentos abajo del precio, sin chips,
sin info repetida, 'Dónde estamos' en vez de 'El lugar'."""
import os
from PIL import Image, ImageOps
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, white
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle
from svglib.svglib import svg2rlg
from reportlab.graphics import renderPDF

TERRACOTA = HexColor('#9e4e42')
TINT = HexColor('#f3e6e3')
INK = HexColor('#1a1518')
INK_SOFT = HexColor('#565153')
INK_MUTED = HexColor('#8a8487')
HAIRLINE = HexColor('#e5e1dc')
CREMA_WARM = HexColor('#f8f9fa')

W, H = A4
M = 46
CW = W - 2 * M

ROOT = r'C:\Users\rafac\proyectos\web_espacio1010'
FOTOS = os.path.join(ROOT, 'public', 'fotos')
# Se publica en el sitio: https://www.espacio1010.uy/espacio-1010-info.pdf
OUT = os.path.join(ROOT, 'public', 'espacio-1010-info.pdf')
TMP = os.path.dirname(os.path.abspath(__file__))

c = canvas.Canvas(OUT, pagesize=A4)
c.setTitle('Espacio 1010 — Consultorios y salas por hora en Montevideo')
c.setAuthor('Espacio 1010')

S_CARD = ParagraphStyle('card', fontName='Helvetica', fontSize=9.8,
                        leading=13.8, textColor=INK_SOFT)

_imgcache = {}
def img_cover(rel, w_pt, h_pt, focus_y=0.5):
    """focus_y: 0 = recorte arriba, 0.5 = centrado, 1 = abajo."""
    key = (rel, round(w_pt), round(h_pt), focus_y)
    if key in _imgcache:
        return _imgcache[key]
    im = ImageOps.exif_transpose(Image.open(os.path.join(FOTOS, rel))).convert('RGB')
    target = w_pt / h_pt
    cur = im.width / im.height
    if cur > target:
        nw = int(im.height * target)
        L = (im.width - nw) // 2
        im = im.crop((L, 0, L + nw, im.height))
    else:
        nh = int(im.width / target)
        T = int((im.height - nh) * focus_y)
        im = im.crop((0, T, im.width, T + nh))
    im = im.resize((int(w_pt * 2.2), int(h_pt * 2.2)))
    out = os.path.join(TMP, 'img_%s_%dx%d_f%s.jpg' % (rel.replace('/', '_').replace('\\', '_'), key[1], key[2], focus_y))
    im.save(out, quality=82)
    _imgcache[key] = out
    return out

def draw_photo(rel, x, y, w_pt, h_pt, radius=8, focus_y=0.5):
    c.saveState()
    p = c.beginPath()
    p.roundRect(x, y, w_pt, h_pt, radius)
    c.clipPath(p, stroke=0, fill=0)
    c.drawImage(img_cover(rel, w_pt, h_pt, focus_y), x, y, w_pt, h_pt)
    c.restoreState()

def para(text, x, y_top, width, st=S_CARD):
    p = Paragraph(text, st)
    w, h = p.wrap(width, 1000)
    p.drawOn(c, x, y_top - h)
    return h

def top_bar():
    c.setFillColor(TERRACOTA)
    c.rect(0, H - 6, W, 6, stroke=0, fill=1)

def page_footer():
    c.setStrokeColor(HAIRLINE)
    c.setLineWidth(1)
    c.line(M, 40, W - M, 40)
    c.setFont('Helvetica', 8.3)
    c.setFillColor(INK_MUTED)
    c.drawString(M, 27, 'Espacio 1010 · Gaboto 1010, Montevideo')
    c.drawRightString(W - M, 27, 'WhatsApp 099 001 303  ·  www.espacio1010.uy')

def draw_logo(width, y_top_offset):
    logo = svg2rlg(os.path.join(ROOT, 'public', 'logo.svg'))
    sc = width / logo.width
    lh = logo.height * sc
    logo.scale(sc, sc)
    ly = H - y_top_offset - lh
    renderPDF.draw(logo, c, M, ly)
    return ly

# =====================================================================
# PÁGINA 1 — Portada
# =====================================================================
top_bar()
logo_y = draw_logo(170.0, 38)

y = logo_y - 44
c.setFont('Helvetica-Bold', 26)
c.setFillColor(INK)
c.drawString(M, y, 'Alquilá tu espacio por hora,')
y -= 30
c.drawString(M, y, 'sin complicaciones')
y -= 24
c.setFont('Helvetica', 11.4)
c.setFillColor(INK_SOFT)
c.drawString(M, y, 'Consultorios y salas para profesionales de la salud y el bienestar,')
y -= 16
c.drawString(M, y, 'en un edificio centenario reciclado a nuevo — Palermo / Parque Rodó, Montevideo.')

# foto hero: Espacio 12
hero_h = 214
hero_top = y - 22
draw_photo('espacios/espacio-12-1.webp', M, hero_top - hero_h, CW, hero_h, 10)

# caja de precio — descuentos abajo del 350
box_h = 116
box_top = hero_top - hero_h - 18
box_y = box_top - box_h
c.setFillColor(TINT)
c.roundRect(M, box_y, CW, box_h, 10, stroke=0, fill=1)

px = M + 24
c.setFillColor(TERRACOTA)
c.setFont('Helvetica-Bold', 46)
c.drawString(px, box_y + box_h - 58, '$350')
pw = c.stringWidth('$350', 'Helvetica-Bold', 46)
c.setFont('Helvetica-Bold', 16)
c.drawString(px + pw + 8, box_y + box_h - 58, '/ hora')
c.setFillColor(INK)
c.setFont('Helvetica', 10.4)
c.drawString(px, box_y + box_h - 81, 'Más de 20 horas al mes: descuento del 10%')
c.drawString(px, box_y + box_h - 97, 'Más de 40 horas al mes: descuento del 20%')

div_x = M + CW * 0.52
c.setStrokeColor(HexColor('#e0c8c2'))
c.setLineWidth(1)
c.line(div_x, box_y + 18, div_x, box_y + box_h - 18)

dx = div_x + 22
dy = box_y + box_h - 32
c.setFillColor(INK)
c.setFont('Helvetica-Bold', 11)
c.drawString(dx, dy, 'Sala Arcos (grupos grandes): $700/hora')
dy -= 21
c.setFillColor(INK_SOFT)
c.setFont('Helvetica', 10.2)
c.drawString(dx, dy, 'Sin matrícula · sin compromiso')
dy -= 18
c.drawString(dx, dy, 'Desde 1 hora, cuando lo necesites')

# diferenciales 2×2, grandes
quick = [
    ('Acceso 24/7', 'Todos los días del año, con tu código personal.'),
    ('Reservás online', 'Por la app, en segundos, sin coordinar por mensajes.'),
    ('Pagás a mes vencido', 'Sin adelantos ni tarjeta. Confiamos en vos.'),
    ('Primera hora gratis', 'Con el cupón BIENVENIDA1010.'),
]
qw = (CW - 18) / 2
q_top = box_y - 30
for i, (t, b) in enumerate(quick):
    qx = M + (i % 2) * (qw + 18)
    qy = q_top - (i // 2) * 52
    c.setFillColor(TERRACOTA)
    c.circle(qx + 3.6, qy - 3.6, 3.6, stroke=0, fill=1)
    c.setFillColor(INK)
    c.setFont('Helvetica-Bold', 12)
    c.drawString(qx + 15, qy - 8, t)
    c.setFillColor(INK_SOFT)
    c.setFont('Helvetica', 10)
    c.drawString(qx + 15, qy - 24, b)

page_footer()
c.showPage()

# =====================================================================
# PÁGINA 2 — Los espacios
# =====================================================================
top_bar()
c.setFont('Helvetica-Bold', 21)
c.setFillColor(INK)
c.drawString(M, H - 66, 'Los espacios')

gap = 13
cw2 = (CW - gap) / 2
ch2 = 216
PHOTO_H = 136

def espacio_card(x, y_top, foto, titulo, sub, body, precio):
    y0 = y_top - ch2
    c.setFillColor(white)
    c.setStrokeColor(HAIRLINE)
    c.setLineWidth(1)
    c.roundRect(x, y0, cw2, ch2, 8, stroke=1, fill=1)
    draw_photo(foto, x + 8, y_top - 8 - PHOTO_H, cw2 - 16, PHOTO_H, 6)
    c.setFillColor(TERRACOTA)
    c.setFont('Helvetica-Bold', 12.2)
    c.drawString(x + 14, y_top - PHOTO_H - 29, titulo)
    c.setFillColor(INK)
    c.setFont('Helvetica-Bold', 10.2)
    c.drawRightString(x + cw2 - 14, y_top - PHOTO_H - 29, precio)
    c.setFillColor(INK_MUTED)
    c.setFont('Helvetica', 8.8)
    c.drawString(x + 14, y_top - PHOTO_H - 43, sub)
    para(body, x + 14, y_top - PHOTO_H - 50, cw2 - 28)

row1_top = H - 102
espacio_card(M, row1_top, 'espacios/espacio-01-1.webp',
             'Atención individual', 'Espacios 01, 11 y 12 · 9,5 a 14 m²',
             'Amueblados: sillón, butacas y escritorio. Para 2 a 4 personas.',
             '$350/hora')
espacio_card(M + cw2 + gap, row1_top, 'espacios/espacio-02-2.webp',
             'Para infancias', 'Espacio 02 · 15 m²',
             'Con rincón infantil: mobiliario y materiales para niños y familias.',
             '$350/hora')
row2_top = row1_top - ch2 - gap
espacio_card(M, row2_top, 'espacios/espacio-13-1.webp',
             'Con camilla', 'Espacio 13 · 11 m²',
             'Para masajes, reflexología y tratamientos corporales.',
             '$350/hora')
espacio_card(M + cw2 + gap, row2_top, 'espacios/espacio-14-3.webp',
             'Grupos y movimiento', 'Espacios 03 y 14 · 16 a 19 m²',
             'Despejados, con colchonetas y almohadones. Hasta 8 personas.',
             '$350/hora')

# Sala Arcos — tarjeta ancha
arcos_top = row2_top - ch2 - gap
arcos_h = 150
y0 = arcos_top - arcos_h
c.setFillColor(white)
c.setStrokeColor(HAIRLINE)
c.roundRect(M, y0, CW, arcos_h, 8, stroke=1, fill=1)
draw_photo('espacios/sala-arcos-4.webp', M + 8, y0 + 8, 224, arcos_h - 16, 6)
tx = M + 250
c.setFillColor(TERRACOTA)
c.setFont('Helvetica-Bold', 13)
c.drawString(tx, arcos_top - 32, 'Sala Arcos')
c.setFillColor(INK)
c.setFont('Helvetica-Bold', 10.4)
c.drawRightString(M + CW - 14, arcos_top - 32, '$700/hora')
c.setFillColor(INK_MUTED)
c.setFont('Helvetica', 8.8)
c.drawString(tx, arcos_top - 46, 'Subsuelo · 40 m² · hasta 25 personas')
para('Para talleres, formaciones y encuentros. Con proyector, parlante, '
     'kitchenette y baño propio. Se coordina por WhatsApp.',
     tx, arcos_top - 54, CW - 250 - 14)

# nota única
c.setFillColor(INK_SOFT)
c.setFont('Helvetica', 9.8)
c.drawString(M, y0 - 24, 'Todos con aire acondicionado y wifi. Más fotos de cada espacio en www.espacio1010.uy')

page_footer()
c.showPage()

# =====================================================================
# PÁGINA 3 — Cómo funciona
# =====================================================================
top_bar()
c.setFont('Helvetica-Bold', 21)
c.setFillColor(INK)
c.drawString(M, H - 66, 'Cómo funciona')

steps = [
    ('Te registrás una sola vez', 'Gratis, en agenda.espacio1010.uy.'),
    ('Reservás online', 'Bloques de 1 hora: puntual o fija semanal (tu horario de siempre).'),
    ('Entrás con tu código personal', 'Videoportero y código de acceso — sin llaves ni esperas.'),
    ('Pagás a mes vencido', 'Por transferencia, Abitab o RedPagos.'),
]
steps_top = H - 106
step_w = CW * 0.58
sy = steps_top
for i, (t, b) in enumerate(steps, 1):
    c.setFillColor(TERRACOTA)
    c.circle(M + 12, sy - 8, 12, stroke=0, fill=1)
    c.setFillColor(white)
    c.setFont('Helvetica-Bold', 12)
    c.drawCentredString(M + 12, sy - 12.2, str(i))
    c.setFillColor(INK)
    c.setFont('Helvetica-Bold', 12.4)
    c.drawString(M + 34, sy - 12.5, t)
    used = para(b, M + 34, sy - 22,  step_w - 34,
                ParagraphStyle('st', fontName='Helvetica', fontSize=10.4, leading=14.4, textColor=INK_SOFT))
    sy -= 22 + used + 24

# captura de la app a la derecha
app_img = os.path.join(FOTOS, 'app-captura.png')
im = Image.open(app_img)
app_h = steps_top - sy + 10
app_w = app_h * im.width / im.height
if app_w > CW * 0.36:
    app_w = CW * 0.36
    app_h = app_w * im.height / im.width
app_x = M + CW - app_w - 6
app_y = steps_top - app_h
c.saveState()
p = c.beginPath()
p.roundRect(app_x, app_y, app_w, app_h, 10)
c.clipPath(p, stroke=0, fill=0)
c.drawImage(app_img, app_x, app_y, app_w, app_h)
c.restoreState()
c.setStrokeColor(HAIRLINE)
c.setLineWidth(1)
c.roundRect(app_x, app_y, app_w, app_h, 10, stroke=1, fill=0)
c.setFillColor(INK_MUTED)
c.setFont('Helvetica', 8.6)
c.drawCentredString(app_x + app_w / 2, app_y - 14, 'La app de reservas, desde tu celular')

# franja 24/7
hr_top = min(sy - 4, app_y - 34)
hr_h = 62
c.setFillColor(TINT)
c.roundRect(M, hr_top - hr_h, CW, hr_h, 8, stroke=0, fill=1)
c.setFillColor(INK)
c.setFont('Helvetica-Bold', 12)
c.drawString(M + 18, hr_top - 24, 'Abierto 24/7, todos los días del año')
c.setFillColor(INK_SOFT)
c.setFont('Helvetica', 10.2)
c.drawString(M + 18, hr_top - 43, 'Reservás de 7 a 24 por la app; la madrugada se coordina por WhatsApp.')

# tarjetas: cancelaciones y para tener en cuenta
cards_top = hr_top - hr_h - 18
ch3 = 184
cw3 = (CW - gap) / 2

def info_card(x, y_top, title, items):
    """items: strings = bullets; ('sub', texto) = subtítulo."""
    y0c = y_top - ch3
    c.setFillColor(CREMA_WARM)
    c.setStrokeColor(HAIRLINE)
    c.setLineWidth(1)
    c.roundRect(x, y0c, cw3, ch3, 8, stroke=1, fill=1)
    c.setFillColor(TERRACOTA)
    c.setFont('Helvetica-Bold', 12)
    c.drawString(x + 16, y_top - 27, title)
    yy = y_top - 40
    for it in items:
        if isinstance(it, tuple):
            yy -= 4
            c.setFillColor(INK)
            c.setFont('Helvetica-Bold', 10)
            c.drawString(x + 16, yy - 9, it[1])
            yy -= 22
        else:
            c.setFillColor(TERRACOTA)
            c.circle(x + 19, yy - 8.6, 2.4, stroke=0, fill=1)
            used = para(it, x + 28, yy, cw3 - 44)
            yy -= used + 6

info_card(M, cards_top, 'Cancelaciones', [
    ('sub', 'Horas de una vez'),
    '<b>Gratis</b> con más de 24 horas de aviso.',
    'Con menos de 24 h se cobra la mitad; con menos de 1 h, la hora completa.',
    ('sub', 'Horas fijas semanales'),
    'Mismas condiciones, con un límite: hasta 1 de cada 5 horas del mes gratis.',
])
info_card(M + cw3 + gap, cards_top, 'Para tener en cuenta', [
    'Tu hora incluye ingreso, sesión y cierre.',
    'Es fundamental respetar los tiempos de entrada y salida, por respeto a quienes usan el espacio después.',
    'Cocina y sala de estar para profesionales, sin cargo.',
])

page_footer()
c.showPage()

# =====================================================================
# PÁGINA 4 — Dónde estamos + contacto
# =====================================================================
top_bar()
c.setFont('Helvetica-Bold', 21)
c.setFillColor(INK)
c.drawString(M, H - 66, 'Dónde estamos')
c.setFont('Helvetica-Bold', 11.4)
c.setFillColor(INK_SOFT)
c.drawString(M, H - 87, 'Gaboto 1010, entre Isla de Flores y San Salvador — Palermo / Parque Rodó, Montevideo.')
c.setFont('Helvetica', 10.2)
c.setFillColor(INK_MUTED)
c.drawString(M, H - 103, 'Estacionamiento no tarifado en la zona y bien conectado en bus.')

sw = (CW - 12) / 2
strip_h = 142
def photo_strip(items, top):
    for i, (f, lab, focus) in enumerate(items):
        x = M + i * (sw + 12)
        draw_photo(f, x, top - strip_h, sw, strip_h, 8, focus_y=focus)
        c.setFillColor(INK_MUTED)
        c.setFont('Helvetica', 8.8)
        c.drawCentredString(x + sw / 2, top - strip_h - 14, lab)
    return top - strip_h - 28

t = photo_strip([('lugar-fachada.webp', 'La fachada, de noche', 0.72),
                 ('lugar-espera.webp', 'Salas de espera (una por piso)', 0.72)], H - 124)
t = photo_strip([('lugar-marmol.webp', 'Escalera de mármol restaurada y paredes de ladrillo originales', 0.5),
                 ('lugar-bano.webp', 'Baños renovados', 0.5)], t)

# qué incluye (solo lo que no se dijo antes)
inc_title_y = t - 14
c.setFillColor(INK)
c.setFont('Helvetica-Bold', 13.5)
c.drawString(M, inc_title_y, 'El edificio incluye')
incluye = [
    'Dos salas de espera con sillones y dispensadores de agua',
    'Cocina y sala de estar con café y té sin cargo',
    'Wifi en todo el edificio',
    'Aire acondicionado en cada espacio',
    'Música ambiente en zonas comunes',
    'Videovigilancia en entrada y áreas comunes',
]
dy = inc_title_y - 24
for i, d in enumerate(incluye):
    yy = dy - i * 19
    c.setFillColor(TERRACOTA)
    c.circle(M + 3, yy + 3.2, 2.8, stroke=0, fill=1)
    c.setFillColor(INK_SOFT)
    c.setFont('Helvetica', 10.2)
    c.drawString(M + 13, yy, d)

# banda promo + contacto, anclados abajo
promo_h = 58
promo_y = 164
c.setFillColor(TERRACOTA)
c.roundRect(M, promo_y, CW, promo_h, 10, stroke=0, fill=1)
c.setFillColor(white)
c.setFont('Helvetica-Bold', 13.5)
c.drawCentredString(W / 2, promo_y + promo_h - 23, 'Primera hora GRATIS con el cupón BIENVENIDA1010')
c.setFont('Helvetica', 10)
c.drawCentredString(W / 2, promo_y + 13, 'Registrate en www.espacio1010.uy · válido hasta fin de 2026')

c.setFillColor(INK)
c.setFont('Helvetica-Bold', 14.5)
c.drawCentredString(W / 2, 122, 'Coordiná una visita o consultanos lo que necesites')
c.setFont('Helvetica-Bold', 13.5)
c.setFillColor(TERRACOTA)
c.drawCentredString(W / 2, 99, 'WhatsApp 099 001 303')
c.setFillColor(INK_SOFT)
c.setFont('Helvetica', 10)
c.drawCentredString(W / 2, 80, 'hola@espacio1010.uy  ·  Instagram @espacio1010.uy  ·  www.espacio1010.uy')
c.setFillColor(INK_MUTED)
c.drawCentredString(W / 2, 63, 'Gaboto 1010 · Palermo / Parque Rodó · Montevideo')

c.save()
print('OK ->', OUT, os.path.getsize(OUT) // 1024, 'KB')
