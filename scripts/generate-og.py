#!/usr/bin/env python3
"""
Generate the default OG image (public/og-default.png).
Run from the project root: python3 scripts/generate-og.py
"""

import os
import sys
import platform
from pathlib import Path

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    print("Error: Pillow not installed. Run: pip install Pillow")
    sys.exit(1)

# ── Config ──────────────────────────────────────────────────────────────────
SITE_TITLE       = "My Blog"
SITE_DESCRIPTION = "Thoughts, essays, and experiments on building software."
OUT_PATH         = Path("public/og-default.png")
W, H             = 1200, 630

# Colours
BG      = (9,   9,  11)    # #09090b
SURFACE = (18,  18,  21)   # #121215
ACCENT  = (124, 92, 255)   # #7c5cff
WHITE   = (250, 250, 250)  # #fafafa
MUTED   = (113, 113, 122)  # #71717a
BORDER  = (39,  39,  42)   # #27272a

# ── Font loading (macOS / Linux fallbacks) ───────────────────────────────────
def load_font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    candidates: list[str] = []
    system = platform.system()
    if system == "Darwin":
        candidates = [
            "/System/Library/Fonts/SFNS.ttf",
            "/System/Library/Fonts/SFNSDisplay.ttf",
            "/System/Library/Fonts/Helvetica.ttc",
            "/System/Library/Fonts/Arial.ttf",
        ]
    elif system == "Linux":
        candidates = [
            "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else
            "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
            "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
        ]
    for path in candidates:
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except Exception:
                continue
    return ImageFont.load_default()

# ── Drawing helpers ──────────────────────────────────────────────────────────
def draw_logo_mark(draw: ImageDraw.ImageDraw, x: int, y: int, size: int) -> None:
    """Draw the blog logo mark (rounded rect + three text lines)."""
    radius = size // 4
    draw.rounded_rectangle([x, y, x + size, y + size], radius=radius, fill=ACCENT)

    pad  = size // 5
    lx   = x + pad
    lw1  = int(size * 0.55)
    lw2  = int(size * 0.37)
    lw3  = int(size * 0.45)
    lh   = max(3, size // 13)
    lr   = lh // 2
    gap  = int(size * 0.175)
    ly   = y + pad + size // 10

    draw.rounded_rectangle([lx, ly, lx + lw1, ly + lh], radius=lr, fill=WHITE)
    ly += gap
    draw.rounded_rectangle([lx, ly, lx + lw2, ly + lh], radius=lr, fill=(220, 220, 240))
    ly += gap
    draw.rounded_rectangle([lx, ly, lx + lw3, ly + lh], radius=lr, fill=(220, 220, 240))

# ── Build image ──────────────────────────────────────────────────────────────
img  = Image.new("RGB", (W, H), BG)
draw = ImageDraw.Draw(img)

# Subtle top gradient (accent tint fading down)
for i in range(250):
    t = 1 - (i / 250) ** 1.5
    r = int(BG[0] + (ACCENT[0] - BG[0]) * t * 0.18)
    g = int(BG[1] + (ACCENT[1] - BG[1]) * t * 0.18)
    b = int(BG[2] + (ACCENT[2] - BG[2]) * t * 0.18)
    draw.line([(0, i), (W, i)], fill=(r, g, b))

# Right-side decorative block
block_w = 340
draw.rectangle([W - block_w, 0, W, H], fill=SURFACE)
draw.line([(W - block_w, 0), (W - block_w, H)], fill=BORDER, width=1)

# Decorative rows of "code lines" in the right block (suggests a code/post editor)
lx0 = W - block_w + 28
for row_y, row_w, opacity in [
    (60,  180, 200), (80,  120, 140), (100, 160, 160),
    (130, 140, 140), (150, 200, 200), (170, 90,  120),
    (200, 170, 180), (220, 110, 130), (240, 150, 160),
    (270, 130, 140), (290, 180, 180), (310, 100, 120),
]:
    draw.rounded_rectangle(
        [lx0, row_y, lx0 + row_w, row_y + 8],
        radius=4,
        fill=(39, 39, 42 + opacity // 8),
    )

# Accent dot top-right
draw.ellipse([W - 48, 20, W - 20, 48], fill=ACCENT)

# ── Logo mark ────────────────────────────────────────────────────────────────
LOGO = 72
MARGIN_X, MARGIN_Y = 80, 80
draw_logo_mark(draw, MARGIN_X, MARGIN_Y, LOGO)

# ── Title ────────────────────────────────────────────────────────────────────
font_title = load_font(72, bold=True)
font_desc  = load_font(28)
font_small = load_font(22)

title_x = MARGIN_X
title_y = MARGIN_Y + LOGO + 36
draw.text((title_x, title_y), SITE_TITLE, fill=WHITE, font=font_title)

# ── Description ──────────────────────────────────────────────────────────────
# Word-wrap to fit left column
MAX_CHARS = 42
words = SITE_DESCRIPTION.split()
lines: list[str] = []
current = ""
for w in words:
    test = (current + " " + w).strip()
    if len(test) <= MAX_CHARS:
        current = test
    else:
        if current:
            lines.append(current)
        current = w
if current:
    lines.append(current)

desc_y = title_y + 90
for line in lines[:3]:
    draw.text((title_x, desc_y), line, fill=MUTED, font=font_desc)
    desc_y += 40

# ── Bottom accent bar ────────────────────────────────────────────────────────
draw.rectangle([0, H - 5, W - block_w, H], fill=ACCENT)

# ── Save ─────────────────────────────────────────────────────────────────────
OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
img.save(str(OUT_PATH), "PNG", optimize=True)
print(f"✓ Saved {OUT_PATH}  ({W}×{H}px)")
