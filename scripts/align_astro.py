"""Composite the astronaut suit onto a portrait-sized canvas so the visor
covers the face. Outputs the aligned overlay used by the site + a debug preview."""
import numpy as np
from PIL import Image

PORTRAIT = "src/assets/portrait.webp"
SRC = "src/assets/portrait-astro-src.webp"   # native suit cutout
OUT = "src/assets/portrait-astro.webp"
DEBUG = "scripts/astro-align.png"

# face/head landmarks measured in portrait space
FACE_CX, FACE_CY, HEAD_W, HEAD_TOP = 380, 227, 376, 0

portrait = Image.open(PORTRAIT).convert("RGBA")
W, H = portrait.size
astro = Image.open(SRC).convert("RGBA")
a = np.asarray(astro)
alpha = a[..., 3]

# helmet width + horizontal center: top 35% band of the suit
ys, xs = np.where(alpha > 30)
ah = astro.height
band = ys < ys.min() + 0.35 * ah
helm_w = xs[band].max() - xs[band].min()
helm_cx = xs[band].mean()

# visor centroid = dark glass (low luminance, opaque)
lum = 0.299 * a[..., 0] + 0.587 * a[..., 1] + 0.114 * a[..., 2]
vmask = (alpha > 60) & (lum < 65)
vy, vx = np.where(vmask)
visor_cx, visor_cy = vx.mean(), vy.mean()

# scale so the helmet fully covers the head (visor over the whole face)
s = (HEAD_W * 1.18) / helm_w
astro_s = astro.resize((round(astro.width * s), round(astro.height * s)), Image.LANCZOS)

paste_x = round(FACE_CX - helm_cx * s)        # center helmet on the head
paste_y = round(FACE_CY - visor_cy * s + 48)  # drop so the visor covers the face

canvas = Image.new("RGBA", (W, H), (0, 0, 0, 0))
canvas.alpha_composite(astro_s, (paste_x, paste_y))
canvas.save(OUT, "WEBP", quality=88, method=6)

# debug overlay
dbg = Image.new("RGBA", (W, H), (17, 17, 18, 255))
dbg.alpha_composite(portrait)
faded = canvas.copy()
faded.putalpha(faded.getchannel("A").point(lambda v: int(v * 0.8)))
dbg.alpha_composite(faded)
dbg.convert("RGB").save(DEBUG)

import os
print(f"helm_w={helm_w} visor=({visor_cx:.0f},{visor_cy:.0f}) scale={s:.2f} "
      f"paste=({paste_x},{paste_y}) | {OUT} {os.path.getsize(OUT)//1024}KB")
