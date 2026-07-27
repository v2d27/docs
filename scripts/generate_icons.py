#!/usr/bin/env python3
"""Generate favicon and social-share assets from a source image.

Reads a single square source image and produces the files nimbus-docs
auto-detects in `public/` (see NimbusHead.astro): a multi-resolution
favicon.ico, a favicon.png fallback, and an opengraph.png used as the
default social-share (OG/Twitter) card for every page.

The OG card is rendered twice — once on a white background (light theme)
and once on gray (dark theme, matching the border tone in
src/pages/og/_og-card-config.ts) — as opengraph-light.png and
opengraph-dark.png. Since social crawlers always fetch a single static
opengraph.png with no theme context, the light variant is copied there
as the default.

Usage:
    python scripts/generate_icons.py [source_image] [--out-dir public]

Requires Pillow: pip install pillow
"""

import argparse
import sys
from pathlib import Path

from PIL import Image

FAVICON_ICO_SIZES = [16, 32, 48, 64, 128, 256]
FAVICON_PNG_SIZE = 512
OG_SIZE = (1200, 630)
OG_PADDING = 80
# Light-theme card background: white.
OG_BACKGROUND_LIGHT = (255, 255, 255, 255)
# Dark-theme card background: matches the border tone in
# src/pages/og/_og-card-config.ts (zinc-800), not the near-black bgGradient,
# so the letterboxing reads as gray rather than another shade of black.
OG_BACKGROUND_DARK = (39, 39, 42, 255)


def load_source(path: Path) -> Image.Image:
    if not path.exists():
        sys.exit(f"error: source image not found: {path}")
    return Image.open(path).convert("RGBA")


def make_favicon_ico(src: Image.Image, dest: Path) -> None:
    src.save(dest, format="ICO", sizes=[(s, s) for s in FAVICON_ICO_SIZES])


def make_favicon_png(src: Image.Image, dest: Path) -> None:
    resized = src.resize((FAVICON_PNG_SIZE, FAVICON_PNG_SIZE), Image.LANCZOS)
    resized.save(dest, format="PNG")


def make_opengraph_png(src: Image.Image, dest: Path, background: tuple) -> None:
    canvas = Image.new("RGBA", OG_SIZE, background)
    max_w, max_h = OG_SIZE[0] - OG_PADDING * 2, OG_SIZE[1] - OG_PADDING * 2
    scale = min(max_w / src.width, max_h / src.height)
    fitted = src.resize(
        (round(src.width * scale), round(src.height * scale)), Image.LANCZOS
    )
    pos = ((OG_SIZE[0] - fitted.width) // 2, (OG_SIZE[1] - fitted.height) // 2)
    canvas.paste(fitted, pos, fitted)
    canvas.convert("RGB").save(dest, format="PNG")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "source",
        nargs="?",
        default="squirrel-reading-books.png",
        type=Path,
        help="Source image (default: squirrel-reading-books.png)",
    )
    parser.add_argument(
        "--out-dir", default="public", type=Path, help="Output directory (default: public)"
    )
    args = parser.parse_args()

    src = load_source(args.source)
    args.out_dir.mkdir(parents=True, exist_ok=True)

    ico_path = args.out_dir / "favicon.ico"
    png_path = args.out_dir / "favicon.png"
    og_light_path = args.out_dir / "opengraph-light.png"
    og_dark_path = args.out_dir / "opengraph-dark.png"
    og_default_path = args.out_dir / "opengraph.png"

    make_favicon_ico(src, ico_path)
    make_favicon_png(src, png_path)
    make_opengraph_png(src, og_light_path, OG_BACKGROUND_LIGHT)
    make_opengraph_png(src, og_dark_path, OG_BACKGROUND_DARK)
    # nimbus-docs auto-detects a single public/opengraph.png with no theme
    # context (crawlers don't run CSS), so the light variant is the default.
    og_default_path.write_bytes(og_light_path.read_bytes())

    sizes = ", ".join(f"{s}x{s}" for s in FAVICON_ICO_SIZES)
    print(f"wrote {ico_path} ({sizes})")
    print(f"wrote {png_path} ({FAVICON_PNG_SIZE}x{FAVICON_PNG_SIZE})")
    print(f"wrote {og_light_path} ({OG_SIZE[0]}x{OG_SIZE[1]})")
    print(f"wrote {og_dark_path} ({OG_SIZE[0]}x{OG_SIZE[1]})")
    print(f"wrote {og_default_path} (copy of opengraph-light.png, used by default)")


if __name__ == "__main__":
    main()
