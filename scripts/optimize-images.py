#!/usr/bin/env python3
"""
Optimize blog images: resize to max 1500 px wide and convert to WebP.

Run from the project root:
    python3 scripts/optimize-images.py [--dry-run]

Options:
    --dry-run   Show what would change without writing files.
    --no-delete Keep original PNG/JPG files alongside the new WebP files.
"""

import argparse
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("Error: Pillow not installed.  Run: pip install Pillow")
    sys.exit(1)

# ── Config ───────────────────────────────────────────────────────────────────
IMAGES_DIR   = Path("public/images/blog")
MAX_WIDTH    = 1500          # px — 2× the ~750 px display width
WEBP_QUALITY = 82            # 0–100; 80-85 is visually lossless for photos
EXTENSIONS   = {".png", ".jpg", ".jpeg", ".gif"}


def human(n: int) -> str:
    """Return a human-readable byte size."""
    for unit in ("B", "KB", "MB"):
        if abs(n) < 1024:
            return f"{n:,.0f} {unit}"
        n //= 1024
    return f"{n:,.0f} GB"


def optimize(src: Path, dry_run: bool, keep_original: bool) -> tuple[int, int]:
    """
    Convert *src* to WebP next to the original.
    Returns (original_bytes, new_bytes).  new_bytes=0 on dry-run.
    """
    dst = src.with_suffix(".webp")
    orig_size = src.stat().st_size

    if dry_run:
        with Image.open(src) as img:
            w, h = img.size
            new_w = min(w, MAX_WIDTH)
            new_h = int(h * new_w / w)
        print(f"  [dry] {src.relative_to('.')}  {w}×{h} → {new_w}×{new_h}  ({human(orig_size)})")
        return orig_size, 0

    with Image.open(src) as img:
        w, h = img.size
        if w > MAX_WIDTH:
            new_h = int(h * MAX_WIDTH / w)
            img = img.resize((MAX_WIDTH, new_h), Image.LANCZOS)

        # Preserve EXIF if present, drop RGBA alpha for JPEG safety
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGBA")
        else:
            img = img.convert("RGB")

        img.save(dst, "WEBP", quality=WEBP_QUALITY, method=6)

    new_size = dst.stat().st_size
    saved = orig_size - new_size
    pct = 100 * saved / orig_size if orig_size else 0
    print(f"  ✓ {dst.relative_to('.')}  {human(orig_size)} → {human(new_size)}  (−{pct:.0f}%)")

    if not keep_original:
        src.unlink()

    return orig_size, new_size


def patch_mdx(dry_run: bool) -> None:
    """Update image paths in MDX/Astro files from .png/.jpg/.jpeg to .webp."""
    import re
    roots = [Path("src/data/blog"), Path("src/data/pages")]
    exts  = {".mdx", ".md", ".astro"}
    count = 0

    for root in roots:
        if not root.exists():
            continue
        for path in root.rglob("*"):
            if path.suffix not in exts:
                continue
            text = path.read_text(encoding="utf-8")
            new_text = text
            for ext in (".png", ".jpg", ".jpeg"):
                new_text = re.sub(
                    rf'(/images/blog/[^"\'\s]+){re.escape(ext)}',
                    r"\1.webp",
                    new_text,
                )
            if new_text != text:
                count += 1
                if dry_run:
                    print(f"  [dry] patch {path.relative_to('.')}")
                else:
                    path.write_text(new_text, encoding="utf-8")
                    print(f"  ✓ patched {path.relative_to('.')}")

    if count == 0:
        print("  (no MDX paths needed updating)")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--dry-run",     action="store_true", help="Preview changes without writing files")
    parser.add_argument("--no-delete",   action="store_true", help="Keep original files alongside WebP output")
    args = parser.parse_args()

    if not IMAGES_DIR.exists():
        print(f"Error: {IMAGES_DIR} not found. Run from the project root.")
        sys.exit(1)

    sources = sorted(
        p for p in IMAGES_DIR.rglob("*")
        if p.suffix.lower() in EXTENSIONS and p.with_suffix(".webp") != p
    )

    if not sources:
        print("No images found to optimise.")
        return

    label = "DRY RUN — " if args.dry_run else ""
    print(f"\n{label}Optimising {len(sources)} image(s) in {IMAGES_DIR}/\n")

    total_before = total_after = 0
    for src in sources:
        before, after = optimize(src, dry_run=args.dry_run, keep_original=args.no_delete)
        total_before += before
        total_after  += after

    print(f"\n── Patching MDX/Astro image paths ──────────────────────────────────")
    patch_mdx(dry_run=args.dry_run)

    if not args.dry_run and total_before:
        saved = total_before - total_after
        pct   = 100 * saved / total_before
        print(f"\n{'─'*60}")
        print(f"Total before : {human(total_before)}")
        print(f"Total after  : {human(total_after)}")
        print(f"Saved        : {human(saved)}  (−{pct:.0f}%)")
    elif args.dry_run:
        print(f"\nTotal before : {human(total_before)}")
        print("Run without --dry-run to apply changes.")


if __name__ == "__main__":
    main()
