#!/usr/bin/env python3
"""
Generate favicon.ico (16x16 + 32x32) and apple-touch-icon.png (180x180).
Run from the project root: python3 scripts/generate-icons.py
"""

import sys
from pathlib import Path

try:
    from PIL import Image, ImageDraw
except ImportError:
    print("Error: Pillow not installed. Run: pip install Pillow")
    sys.exit(1)

ACCENT = (124, 92, 255)   # #7c5cff
WHITE  = (255, 255, 255)


def draw_icon(size: int) -> Image.Image:
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    radius = size // 4
    draw.rounded_rectangle([0, 0, size - 1, size - 1], radius=radius, fill=ACCENT)

    pad  = size // 5
    lx   = pad
    lw1  = int(size * 0.55)
    lw2  = int(size * 0.37)
    lw3  = int(size * 0.45)
    lh   = max(2, size // 10)
    lr   = max(1, lh // 2)
    gap  = int(size * 0.18)
    ly   = pad + size // 8

    draw.rounded_rectangle([lx, ly, lx + lw1, ly + lh], radius=lr, fill=WHITE)
    ly += gap
    draw.rounded_rectangle([lx, ly, lx + lw2, ly + lh], radius=lr, fill=(220, 220, 240))
    ly += gap
    draw.rounded_rectangle([lx, ly, lx + lw3, ly + lh], radius=lr, fill=(220, 220, 240))

    return img


# apple-touch-icon.png — 180×180
apple = draw_icon(180)
apple = apple.convert("RGB")
out_apple = Path("public/apple-touch-icon.png")
apple.save(str(out_apple), "PNG", optimize=True)
print(f"✓ Saved {out_apple}  (180×180)")

# favicon.ico — contains 16x16 and 32x32 layers
ico_16 = draw_icon(16)
ico_32 = draw_icon(32)
out_ico = Path("public/favicon.ico")
ico_32.save(str(out_ico), format="ICO", sizes=[(16, 16), (32, 32)])
print(f"✓ Saved {out_ico}  (16×16 + 32×32)")
