#!/usr/bin/env python3
"""Create one branded, episode-specific hero image for all 120 stories."""

from __future__ import annotations

import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
CATALOG = ROOT / "data" / "episode-catalog.json"
SOURCE_DIR = ROOT / "assets" / "episode-art-sources"
OUTPUT_DIR = ROOT / "public" / "episodes"
WIDTH, HEIGHT = 900, 600

CATEGORY_STYLE = {
    "Sprout": {"accent": "#718773", "wash": "#DCE5DC", "shift": -12},
    "All Ages": {"accent": "#597F89", "wash": "#DAE4E9", "shift": 0},
    "Trail": {"accent": "#C97855", "wash": "#F0D5C6", "shift": 12},
}


def font(size: int, *, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = [
        Path("/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf"),
        Path("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"),
    ]
    for candidate in candidates:
        if candidate.exists():
            return ImageFont.truetype(str(candidate), size=size)
    return ImageFont.load_default()


def panel_crop(sheet: Image.Image, moment_index: int, shift: int) -> Image.Image:
    col = moment_index % 2
    row = moment_index // 2
    cell_left = round(col * sheet.width / 2)
    cell_right = round((col + 1) * sheet.width / 2)
    cell_top = round(row * sheet.height / 3)
    cell_bottom = round((row + 1) * sheet.height / 3)
    cell_width = cell_right - cell_left
    cell_height = cell_bottom - cell_top

    # The generated source places every action in the middle two-thirds. A
    # category-specific horizontal shift gives each pathway a distinct view of
    # the same learning moment without losing the central action.
    crop_width = min(cell_width - 24, round((cell_height - 14) * 1.5))
    crop_height = round(crop_width / 1.5)
    centre_x = (cell_left + cell_right) // 2 + shift
    centre_y = (cell_top + cell_bottom) // 2
    left = max(cell_left + 8, min(centre_x - crop_width // 2, cell_right - crop_width - 8))
    top = max(cell_top + 7, min(centre_y - crop_height // 2, cell_bottom - crop_height - 7))
    return sheet.crop((left, top, left + crop_width, top + crop_height))


def add_soft_wash(image: Image.Image, colour: str) -> Image.Image:
    wash = Image.new("RGB", image.size, colour)
    return Image.blend(ImageEnhance.Color(image).enhance(0.96), wash, 0.07)


def make_hero(row: dict[str, object], sheet: Image.Image) -> Image.Image:
    category = str(row["category"])
    style = CATEGORY_STYLE[category]
    position_in_stage = (int(row["id"]) - 1) % 15
    moment_index = position_in_stage % 5
    scene = panel_crop(sheet, moment_index, int(style["shift"]))
    scene = scene.resize((WIDTH, HEIGHT), Image.Resampling.LANCZOS)
    scene = add_soft_wash(scene, str(style["wash"]))

    overlay = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    accent = str(style["accent"])

    # A subtle lower veil protects small labels on every crop while leaving the
    # illustration dominant on both web cards and A4 workbook covers.
    for y in range(HEIGHT - 150, HEIGHT):
        alpha = round(12 + 92 * ((y - (HEIGHT - 150)) / 150))
        draw.line((0, y, WIDTH, y), fill=(35, 47, 42, alpha))

    draw.rounded_rectangle((28, 28, 198, 70), radius=21, fill="#FFF9EDED", outline="#FFFFFFAA", width=2)
    draw.text((49, 39), f"EPISODE {row['code']}", font=font(21, bold=True), fill="#29312E")

    category_label = category.upper()
    category_bbox = draw.textbbox((0, 0), category_label, font=font(19, bold=True))
    category_width = category_bbox[2] - category_bbox[0] + 34
    draw.rounded_rectangle((WIDTH - category_width - 28, 28, WIDTH - 28, 70), radius=21, fill=accent + "EE")
    draw.text((WIDTH - category_width - 11, 40), category_label, font=font(19, bold=True), fill="#FFFDF8")

    stage_label = f"STAGE {row['stage']}  •  {str(row['stageTitle']).upper()}"
    draw.text((34, HEIGHT - 55), stage_label, font=font(20, bold=True), fill="#FFFDF8")

    # Different weather seeds make the three category variants visibly unique
    # even when they share the same underlying situation.
    seed = int(row["id"])
    for index in range(3):
        radius = 5 + ((seed + index * 3) % 5)
        x = WIDTH - 48 - index * 25
        y = HEIGHT - 43 + ((seed + index) % 3 - 1) * 3
        draw.ellipse((x - radius, y - radius, x + radius, y + radius), fill="#FFFDF8CC")

    overlay = overlay.filter(ImageFilter.GaussianBlur(0.15))
    return Image.alpha_composite(scene.convert("RGBA"), overlay).convert("RGB")


def main() -> None:
    rows = json.loads(CATALOG.read_text(encoding="utf-8"))
    if len(rows) != 120:
        raise ValueError(f"Expected 120 episodes, found {len(rows)}")
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    sheets = {
        stage: Image.open(SOURCE_DIR / f"stage-{stage:02d}-storyboard.png").convert("RGB")
        for stage in range(1, 9)
    }
    try:
        for row in rows:
            hero = make_hero(row, sheets[int(row["stage"])])
            target = OUTPUT_DIR / f"episode-{row['code']}-hero.webp"
            hero.save(target, "WEBP", quality=84, method=6)
            hero.close()
    finally:
        for sheet in sheets.values():
            sheet.close()

    outputs = sorted(OUTPUT_DIR.glob("episode-???-hero.webp"))
    if len(outputs) != 120:
        raise ValueError(f"Expected 120 hero images, generated {len(outputs)}")
    print(f"Generated {len(outputs)} episode heroes in {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
