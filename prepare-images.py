"""Crop, grade and export the Easter 2026 photographs for the website.

Crops remove the burned-in "JOUR" titles and the two watermark logos, and keep
patients' dignity: no cash, no sick child, no one lying unclothed.
Requires Pillow. Run from the site folder: python prepare-images.py
"""
from pathlib import Path
from PIL import Image, ImageEnhance, ImageOps

source = Path('../ngo images')
out = Path('dist/assets')
out.mkdir(parents=True, exist_ok=True)

# prefix, output name, crop box (left, top, right, bottom), max size
PHOTOS = [
    ('1320100d', 'team', (0, 130, 1600, 940), (1600, 1100)),
    ('bf93fc12', 'arrival', (270, 110, 1600, 930), (1600, 1100)),
    ('bf93fc12', 'arrival-square', (430, 110, 1255, 935), (960, 960)),
    ('6083aa56', 'handshake', (0, 110, 1600, 935), (1600, 1100)),
    ('d80f2d2f', 'bedside', (40, 120, 1420, 800), (1600, 1100)),
    ('7996f465', 'prayer', (90, 200, 1560, 930), (1600, 1100)),
    ('69a9fe7f', 'singing', (0, 120, 1600, 935), (1600, 1100)),
    ('8b79076b', 'shirt', (90, 150, 700, 935), (900, 1200)),
]


def neutralize(image):
    """Remove the lavender cast from the white and grey shirts.

    Uses the brightest low-saturation pixels as a white reference and scales
    each channel toward neutral, at 80% strength so skin keeps its warmth.
    """
    small = image.copy()
    small.thumbnail((400, 400))
    samples = []
    for r, g, b in small.getdata():
        hi, lo = max(r, g, b), min(r, g, b)
        if hi > 170 and hi - lo < 45:
            samples.append((r, g, b))
    if len(samples) < 50:
        return image
    avg = [sum(c[i] for c in samples) / len(samples) for i in range(3)]
    grey = sum(avg) / 3
    gains = [1 + 0.8 * (grey / a - 1) for a in avg]
    channels = [ch.point(lambda v, k=k: min(255, round(v * k))) for ch, k in zip(image.split(), gains)]
    return Image.merge('RGB', channels)


def grade(image):
    image = neutralize(image)
    image = ImageOps.autocontrast(image, cutoff=0.4)
    image = ImageEnhance.Color(image).enhance(0.9)
    image = ImageEnhance.Contrast(image).enhance(1.04)
    # A slight, shared warmth so the set reads as one sequence.
    r, g, b = image.split()
    r = r.point(lambda v: min(255, round(v * 1.015 + 2)))
    b = b.point(lambda v: round(v * 0.975))
    return Image.merge('RGB', (r, g, b))


for prefix, name, box, size in PHOTOS:
    image = Image.open(next(source.glob(prefix + '*'))).convert('RGB').crop(box)
    image = grade(image)
    image.thumbnail(size, Image.LANCZOS)
    image.save(out / (name + '.webp'), 'WEBP', quality=80, method=6)
    small = image.copy()
    small.thumbnail((800, 800), Image.LANCZOS)
    small.save(out / (name + '-800.webp'), 'WEBP', quality=78, method=6)
    print(name, image.size)
