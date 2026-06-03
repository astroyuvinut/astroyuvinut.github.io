"""Create a treated (lime duotone) version of the cutout that gets revealed
under the cursor on hover — the landonorris.com-style overlay image."""
import numpy as np
from PIL import Image

SRC = "src/assets/portrait.webp"
OUT = "src/assets/portrait-fx.webp"

# duotone endpoints: shadows -> near-black, highlights -> neon lime
SHADOW = np.array([13, 15, 8], dtype=float)      # ~#0d0f08
HIGHLIGHT = np.array([210, 255, 0], dtype=float)  # #d2ff00 accent

im = Image.open(SRC).convert("RGBA")
arr = np.asarray(im).astype(float)
rgb, alpha = arr[..., :3], arr[..., 3:]

# luminance -> normalized 0..1, with a little contrast boost
lum = (0.299 * rgb[..., 0] + 0.587 * rgb[..., 1] + 0.114 * rgb[..., 2]) / 255.0
lum = np.clip((lum - 0.08) / 0.84, 0, 1)          # stretch
lum = np.power(lum, 0.85)[..., None]               # lift midtones

duo = SHADOW * (1 - lum) + HIGHLIGHT * lum
out = np.concatenate([np.clip(duo, 0, 255), alpha], axis=-1).astype(np.uint8)
Image.fromarray(out, "RGBA").save(OUT, "WEBP", quality=88, method=6)

import os
print(f"saved {OUT}  {os.path.getsize(OUT) // 1024} KB")
