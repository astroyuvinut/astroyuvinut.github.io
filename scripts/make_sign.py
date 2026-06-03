"""Turn the signature JPG (lime ink on white) into a clean transparent WebP,
recolored to the exact theme accent, cropped to the ink."""
import numpy as np
from PIL import Image

SRC = "Untitled design.jpg"
OUT = "src/assets/signature.webp"
ACCENT = (210, 255, 0)  # #d2ff00

im = Image.open(SRC).convert("RGB")
arr = np.asarray(im).astype(float)

# alpha from distance-to-white: white -> 0, colored ink -> opaque (feathered)
mn = arr.min(axis=-1)               # near 255 on white, low on ink
alpha = np.clip((255 - mn) * 1.7, 0, 255).astype(np.uint8)

rgb = np.zeros_like(arr, dtype=np.uint8)
rgb[..., 0], rgb[..., 1], rgb[..., 2] = ACCENT
out = np.dstack([rgb, alpha])

# crop to the ink
bbox = Image.fromarray(alpha).getbbox()
img = Image.fromarray(out, "RGBA")
if bbox:
    pad = 16
    l, t, r, b = bbox
    img = img.crop((max(0, l - pad), max(0, t - pad),
                    min(im.width, r + pad), min(im.height, b + pad)))

img.save(OUT, "WEBP", quality=90, method=6)
import os
print(f"saved {OUT}  size={img.size}  {os.path.getsize(OUT)//1024} KB")
