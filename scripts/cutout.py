"""Remove the background from the portrait using rembg (U2-Net) and save a
trimmed transparent PNG into assets."""
import numpy as np
from PIL import Image
from rembg import remove, new_session

SRC = "IMG-20260603-WA0005.jpg"
OUT = "src/assets/portrait.png"

session = new_session("u2net")  # good general human/object matting
im = Image.open(SRC)
cut = remove(im, session=session, alpha_matting=True,
             alpha_matting_foreground_threshold=240,
             alpha_matting_background_threshold=15,
             alpha_matting_erode_size=8).convert("RGBA")

# trim to subject bounding box with small padding
alpha = np.asarray(cut)[..., 3]
bbox = Image.fromarray(alpha).getbbox()
if bbox:
    pad = 10
    l, t, r, b = bbox
    w, h = cut.size
    cut = cut.crop((max(0, l - pad), max(0, t - pad), min(w, r + pad), min(h, b + pad)))

cut.save(OUT)
print(f"saved {OUT}  size={cut.size}")

# ── optimize for web: downscale to display size + export WebP (keeps alpha) ──
TARGET_W = 820  # ~2x the on-screen width for retina sharpness
if cut.width > TARGET_W:
    ratio = TARGET_W / cut.width
    small = cut.resize((TARGET_W, round(cut.height * ratio)), Image.LANCZOS)
else:
    small = cut

webp_out = "src/assets/portrait.webp"
small.save(webp_out, "WEBP", quality=88, method=6)

import os
print(f"saved {webp_out}  size={small.size}  "
      f"{os.path.getsize(webp_out) // 1024} KB "
      f"(png was {os.path.getsize(OUT) // 1024} KB)")
