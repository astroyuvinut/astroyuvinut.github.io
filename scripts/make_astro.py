"""Cut the gray background off the astronaut image and save a trimmed,
optimized transparent WebP to use as the hover-reveal overlay."""
import numpy as np
from PIL import Image
from rembg import remove, new_session

SRC = "image.png"
OUT = "src/assets/portrait-astro-src.webp"

session = new_session("u2net")
im = Image.open(SRC)
cut = remove(im, session=session, alpha_matting=True,
             alpha_matting_foreground_threshold=240,
             alpha_matting_background_threshold=20,
             alpha_matting_erode_size=6).convert("RGBA")

# trim to subject
alpha = np.asarray(cut)[..., 3]
bbox = Image.fromarray(alpha).getbbox()
if bbox:
    cut = cut.crop(bbox)

cut.save(OUT, "WEBP", quality=88, method=6)
import os
print(f"saved {OUT}  size={cut.size}  {os.path.getsize(OUT)//1024} KB")
