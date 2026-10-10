"""Cut the original Tree of LIF logo out of its black background.

Inside the medallion everything is kept, including its own night sky.
Outside it (vines and lettering) black is turned into transparency with
colour recovery, so anti-aliased edges stay smooth on any background.
Requires Pillow. Run from the site folder: python prepare-logo.py
"""
from math import hypot
from pathlib import Path
from PIL import Image

SOURCE = Path('../ngo images/ngo logo.jpeg')
OUT = Path('dist/assets')
CX, CY, R = 512, 439, 275  # medallion centre and outer radius in the 1024px source
RING_END, FADE = 545, 30   # the gold ring stops here; below, the medallion fades into black
KNOT_END = 646              # lettering starts just below this
FLOOR = 6                  # JPEG noise level of the black background

src = Image.open(SOURCE).convert('RGB')
w, h = src.size
pixels = list(src.get_flattened_data()) if hasattr(src, 'get_flattened_data') else list(src.getdata())
out, ring = [], []
for i, (r, g, b) in enumerate(pixels):
    x, y = i % w, i // w
    circle = min(1.0, max(0.0, R - hypot(x - CX, y - CY) + 0.5))
    ring.append(round(circle * 255) if y < KNOT_END else 0)  # medallion stops under the knot
    inside = circle * min(1.0, max(0.0, (RING_END + FADE - y) / FADE))
    if inside >= 1:
        out.append((r, g, b, 255))
        continue
    # Colour to alpha against black: alpha follows the brightest channel and
    # the colour is un-premultiplied, so it composites like the original.
    peak = max(r, g, b)
    a = max(0.0, (peak - FLOOR) / (255 - FLOOR))
    if a <= 0 and inside <= 0:
        out.append((0, 0, 0, 0))
        continue
    a = min(1.0, a ** 0.85 * 1.6)  # keeps lettering and vines solid
    scale = 255 / max(peak, 1)
    k = min(scale, 1 / max(a, 1e-3))
    c = tuple(min(255, round(v * k)) for v in (r, g, b))
    alpha = max(a, inside)
    if inside > 0:  # blend the soft circle edge toward the original colour
        c = tuple(round(cv * (1 - inside) + ov * inside) for cv, ov in zip(c, (r, g, b)))
    out.append((*c, round(alpha * 255)))

full = Image.new('RGBA', (w, h))
full.putdata(out)

# Full lockup, trimmed to the artwork.
box = full.getchannel('A').point(lambda v: 255 if v > 8 else 0).getbbox()
lockup = full.crop(box)
lockup.save(OUT / 'logo-original.png', optimize=True)
lockup.save(OUT / 'logo-original.webp', 'WEBP', quality=90, method=6)
small = lockup.copy()
small.thumbnail((520, 520), Image.LANCZOS)
small.save(OUT / 'logo-original-520.webp', 'WEBP', quality=90, method=6)
print('lockup', lockup.size, '->', small.size)

# The medallion alone, for the header and icons: strictly the circle.
mask = Image.new('L', (w, h))
mask.putdata(ring)
medallion = full.copy()
medallion.putalpha(Image.composite(full.getchannel('A'), Image.new('L', (w, h)), mask))
medallion = medallion.crop((CX - R - 1, CY - R - 1, CX + R + 1, KNOT_END))
for height in (104, 208):
    size = (round(medallion.width * height / medallion.height), height)
    medallion.resize(size, Image.LANCZOS).save(OUT / f'medallion-{height}.webp', 'WEBP', quality=92, method=6)
# Square icon source: the medallion centred on a transparent square.
square = Image.new('RGBA', (medallion.width, medallion.width))
square.alpha_composite(medallion, (0, (medallion.width - medallion.height) // 2))
square.resize((512, 512), Image.LANCZOS).save(OUT / 'medallion-512.png', optimize=True)
print('medallion', medallion.size)

# Browser and home-screen icons. Phones fill transparency with black, so the
# home-screen icons sit on the site's night green.
for size, name, ground in ((32, 'favicon-32.png', None), (192, 'favicon-192.png', None), (180, 'apple-touch-icon.png', (16, 45, 39, 255)), (512, 'icon-512.png', (16, 45, 39, 255))):
    icon = Image.new('RGBA', (size, size), ground or (0, 0, 0, 0))
    inner = round(size * (0.86 if ground else 1))
    art = square.resize((inner, inner), Image.LANCZOS)
    icon.alpha_composite(art, ((size - inner) // 2, (size - inner) // 2))
    icon.save(Path('dist') / name, optimize=True)
print('icons written')
