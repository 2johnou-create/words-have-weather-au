#!/usr/bin/env python3
"""Build the six landscape education PDFs, fixed-layout EPUB 3 masters and KDP cover files."""

from __future__ import annotations

import html
import json
import shutil
import subprocess
import tempfile
import textwrap
import uuid
import zipfile
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import landscape
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph


ROOT = Path(__file__).resolve().parents[1]
NODE = Path("/Users/johnou/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node")
PDF_DIR = ROOT / "protected-resources" / "ebook-downloads"
AMAZON_DIR = ROOT / "publishing" / "amazon"
PAGE_SIZE = landscape((553, 737))
PAGE_W, PAGE_H = PAGE_SIZE

INK = HexColor("#24332d")
INK_SOFT = HexColor("#52605a")
PAPER = HexColor("#fbf8f0")
WHITE = HexColor("#fffefa")
SAGE = HexColor("#6f8a73")
SAGE_DARK = HexColor("#3f5d4b")
SAGE_PALE = HexColor("#dce8db")
TERRACOTTA = HexColor("#c87355")
TERRACOTTA_PALE = HexColor("#f2d9cc")
SUN = HexColor("#edc96a")
SKY = HexColor("#dcecf0")

GEORGIA = "/System/Library/Fonts/Supplemental/Georgia.ttf"
GEORGIA_BOLD = "/System/Library/Fonts/Supplemental/Georgia Bold.ttf"
ARIAL = "/System/Library/Fonts/Supplemental/Arial.ttf"
ARIAL_BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"


def load_books() -> list[dict]:
    script = "import('./data/ebooks.ts').then(m=>process.stdout.write(JSON.stringify(m.ebooks)))"
    output = subprocess.check_output(
        [str(NODE), "--experimental-strip-types", "-e", script], cwd=ROOT, text=True
    )
    return json.loads(output)


def register_fonts() -> None:
    pdfmetrics.registerFont(TTFont("Georgia", GEORGIA))
    pdfmetrics.registerFont(TTFont("Georgia-Bold", GEORGIA_BOLD))
    pdfmetrics.registerFont(TTFont("Arial", ARIAL))
    pdfmetrics.registerFont(TTFont("Arial-Bold", ARIAL_BOLD))


def local_asset(web_path: str) -> Path:
    return ROOT / "public" / web_path.lstrip("/")


def draw_image_cover(c: canvas.Canvas, image_path: Path, x: float, y: float, width: float, height: float) -> None:
    with Image.open(image_path) as source:
        image = source.convert("RGB")
        src_ratio = image.width / image.height
        dst_ratio = width / height
        if src_ratio > dst_ratio:
            crop_w = round(image.height * dst_ratio)
            left = (image.width - crop_w) // 2
            image = image.crop((left, 0, left + crop_w, image.height))
        else:
            crop_h = round(image.width / dst_ratio)
            top = (image.height - crop_h) // 2
            image = image.crop((0, top, image.width, top + crop_h))
        c.drawImage(ImageReader(image), x, y, width=width, height=height, preserveAspectRatio=False, mask="auto")


def paragraph(c: canvas.Canvas, text: str, x: float, y_top: float, width: float, height: float, *, font: str, size: float, leading: float, colour, alignment=TA_LEFT) -> float:
    style = ParagraphStyle(
        "ebook",
        fontName=font,
        fontSize=size,
        leading=leading,
        textColor=colour,
        alignment=alignment,
        allowWidows=0,
        allowOrphans=0,
        spaceAfter=0,
    )
    flowable = Paragraph(html.escape(text).replace("\n", "<br/>"), style)
    _, used_h = flowable.wrap(width, height)
    if used_h > height:
        raise ValueError(f"Text overflow ({used_h:.1f} > {height:.1f}): {text[:80]}")
    flowable.drawOn(c, x, y_top - used_h)
    return used_h


def make_pdf(book: dict) -> Path:
    output = PDF_DIR / f"{book['slug']}-education-edition.pdf"
    c = canvas.Canvas(str(output), pagesize=PAGE_SIZE, pageCompression=1)
    c.setTitle(book["title"])
    c.setAuthor("Words Have Weather")
    c.setSubject(f"Illustrated {book['category']} shared-reading story with adult notes")
    art_w = PAGE_W * 0.57

    for page in book["pages"]:
        kind = page["kind"]
        c.setFillColor(PAPER)
        c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
        draw_image_cover(c, local_asset(page["image"]), 0, 0, art_w, PAGE_H)

        panel_colour = SAGE_DARK if kind == "cover" else TERRACOTTA_PALE if kind == "adult-notes" else WHITE
        c.setFillColor(panel_colour)
        c.rect(art_w, 0, PAGE_W - art_w, PAGE_H, fill=1, stroke=0)

        margin = 35
        x = art_w + margin
        width = PAGE_W - art_w - margin * 2
        top = PAGE_H - 58
        text_colour = WHITE if kind == "cover" else INK
        soft_colour = HexColor("#e7eee4") if kind == "cover" else INK_SOFT
        kicker_colour = SUN if kind == "cover" else TERRACOTTA

        c.setFillColor(kicker_colour)
        c.setFont("Arial-Bold", 8.3)
        c.drawString(x, top, (page.get("kicker") or book["category"]).upper())
        top -= 28

        title_size = 33 if kind == "cover" else 28
        if len(page["title"]) > 34:
            title_size -= 4
        used = paragraph(c, page["title"], x, top, width, 165, font="Georgia-Bold", size=title_size, leading=title_size * 1.07, colour=text_colour)
        top -= used + 25

        body_size = 14.2
        if len(page["text"]) > 470:
            body_size = 11.8
        elif len(page["text"]) > 340:
            body_size = 12.8
        paragraph(c, page["text"], x, top, width, top - 56, font="Arial", size=body_size, leading=body_size * 1.52, colour=soft_colour)

        c.setFillColor(soft_colour)
        c.setFont("Arial-Bold", 7.6)
        c.drawRightString(PAGE_W - 28, 23, f"{page['pageNumber']} / {len(book['pages'])}")
        c.setFont("Arial", 7.2)
        c.drawString(art_w + 25, 23, "WORDS HAVE WEATHER · EDUCATION EDITION")
        c.showPage()

    c.save()
    return output


def fit_text(draw: ImageDraw.ImageDraw, text: str, font_path: str, max_size: int, min_size: int, max_width: int, max_lines: int) -> tuple[ImageFont.FreeTypeFont, list[str]]:
    for size in range(max_size, min_size - 1, -2):
        font = ImageFont.truetype(font_path, size)
        words = text.split()
        lines: list[str] = []
        current = ""
        for word in words:
            candidate = f"{current} {word}".strip()
            if draw.textbbox((0, 0), candidate, font=font)[2] <= max_width:
                current = candidate
            else:
                if current:
                    lines.append(current)
                current = word
        if current:
            lines.append(current)
        if len(lines) <= max_lines:
            return font, lines
    return ImageFont.truetype(font_path, min_size), textwrap.wrap(text, 18)[:max_lines]


def make_amazon_cover(book: dict) -> Path:
    book_dir = AMAZON_DIR / book["slug"]
    book_dir.mkdir(parents=True, exist_ok=True)
    output = book_dir / f"{book['slug']}-cover.jpg"
    width, height = 1600, 2560
    image = Image.new("RGB", (width, height), "#3f5d4b")
    with Image.open(local_asset(book["pages"][0]["image"])) as scene:
        scene = ImageOps.fit(scene.convert("RGB"), (width, 1420), method=Image.Resampling.LANCZOS, centering=(0.5, 0.5))
        image.paste(scene, (0, 0))
    draw = ImageDraw.Draw(image)
    draw.rectangle((0, 1370, width, height), fill="#3f5d4b")
    draw.rectangle((104, 1320, 475, 1410), fill="#edc96a")
    category_font = ImageFont.truetype(ARIAL_BOLD, 42)
    draw.text((137, 1338), f"{book['category'].upper()} · AGES {book['ages']}", font=category_font, fill="#24332d")
    title_font, title_lines = fit_text(draw, book["title"], GEORGIA_BOLD, 126, 84, 1370, 4)
    y = 1515
    line_height = round(title_font.size * 1.12)
    for line in title_lines:
        draw.text((112, y), line, font=title_font, fill="#fffefa")
        y += line_height
    subtitle_font, subtitle_lines = fit_text(draw, book["subtitle"], ARIAL, 54, 38, 1340, 3)
    y += 40
    for line in subtitle_lines:
        draw.text((116, y), line, font=subtitle_font, fill="#e2eadf")
        y += round(subtitle_font.size * 1.35)
    brand_font = ImageFont.truetype(ARIAL_BOLD, 38)
    draw.text((116, 2440), "WORDS HAVE WEATHER", font=brand_font, fill="#edc96a")
    image.save(output, "JPEG", quality=94, optimize=True, progressive=True, dpi=(300, 300))
    return output


def make_amazon_metadata(book: dict) -> Path:
    book_dir = AMAZON_DIR / book["slug"]
    book_dir.mkdir(parents=True, exist_ok=True)
    output = book_dir / "metadata.json"
    description = f"{book['hook']} {book['blurb']} The final page gives parents, carers and educators a key message and practical ideas for shared discussion and rehearsal."
    metadata = {
        "series": "Words Have Weather Story eBooks",
        "seriesNumber": int(book["id"].split("-")[-1]),
        "title": book["title"],
        "subtitle": book["subtitle"],
        "language": "English (Australia)",
        "ageRange": book["ages"],
        "description": description,
        "keywords": ["communication skills for children", "parent child communication", "classroom communication", book["category"], *book["learningFocus"]],
        "suggestedCategories": ["Children's eBooks / Social Skills", "Education / Social & Emotional Learning"],
        "manuscriptFile": f"{book['slug']}.epub",
        "coverFile": f"{book['slug']}-cover.jpg",
        "territory": "Worldwide, subject to final rights review",
        "contentDisclosure": {"aiGeneratedText": True, "aiGeneratedImages": True, "humanReviewRequired": True},
        "kdpSelect": "Do not enrol while the free education edition remains available outside Amazon.",
        "status": "Pre-publication master - run Kindle Previewer and complete human editorial, accessibility, safeguarding and rights review before upload.",
    }
    output.write_text(json.dumps(metadata, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return output


def epub_css() -> str:
    return """
@page { margin: 0; }
html, body { width: 1200px; height: 800px; margin: 0; padding: 0; overflow: hidden; }
body { font-family: Arial, sans-serif; color: #24332d; background: #fffefa; }
.page { width: 1200px; height: 800px; display: flex; }
.art { width: 690px; height: 800px; object-fit: cover; }
.copy { width: 510px; height: 800px; box-sizing: border-box; padding: 82px 62px 58px; position: relative; background: #fffefa; }
.cover .copy { color: #fffefa; background: #3f5d4b; }
.adult-notes .copy { background: #f2d9cc; }
.kicker { margin: 0 0 34px; color: #c87355; font-size: 17px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; }
.cover .kicker { color: #edc96a; }
h1 { margin: 0 0 30px; font-family: Georgia, serif; font-size: 58px; line-height: 1.06; }
p.story { margin: 0; color: #52605a; font-size: 27px; line-height: 1.55; }
.cover p.story { color: #e2eadf; }
.adult-notes p.story { font-size: 23px; line-height: 1.52; }
.number { position: absolute; right: 45px; bottom: 36px; color: #52605a; font-size: 14px; font-weight: bold; }
.cover .number { color: #e2eadf; }
""".strip()


def make_epub(book: dict, cover_path: Path) -> Path:
    output = PDF_DIR / f"{book['slug']}.epub"
    amazon_output = AMAZON_DIR / book["slug"] / f"{book['slug']}.epub"
    with tempfile.TemporaryDirectory(prefix=f"whw-{book['slug']}-") as raw_temp:
        temp = Path(raw_temp)
        meta_inf = temp / "META-INF"
        oebps = temp / "OEBPS"
        images = oebps / "images"
        pages_dir = oebps / "pages"
        meta_inf.mkdir(parents=True)
        images.mkdir(parents=True)
        pages_dir.mkdir(parents=True)
        (temp / "mimetype").write_text("application/epub+zip", encoding="ascii")
        (meta_inf / "container.xml").write_text(
            '<?xml version="1.0" encoding="UTF-8"?>\n<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>',
            encoding="utf-8",
        )
        (oebps / "styles.css").write_text(epub_css(), encoding="utf-8")

        cover_name = "cover.jpg"
        shutil.copy2(cover_path, images / cover_name)
        unique_images: dict[str, str] = {}
        for page in book["pages"]:
            source = local_asset(page["image"])
            key = str(source)
            if key not in unique_images:
                name = f"image-{len(unique_images) + 1:02d}.jpg"
                with Image.open(source) as item:
                    prepared = ImageOps.fit(item.convert("RGB"), (2070, 2400), method=Image.Resampling.LANCZOS, centering=(0.5, 0.5))
                    prepared.save(images / name, "JPEG", quality=91, optimize=True, progressive=True)
                unique_images[key] = name

        for index, page in enumerate(book["pages"], start=1):
            page_class = "cover" if page["kind"] == "cover" else "adult-notes" if page["kind"] == "adult-notes" else "story-page"
            image_name = unique_images[str(local_asset(page["image"]))]
            xhtml = f'''<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="en-AU">
<head><meta charset="utf-8"/><meta name="viewport" content="width=1200, height=800"/><title>{html.escape(page['title'])}</title><link rel="stylesheet" type="text/css" href="../styles.css"/></head>
<body><main class="page {page_class}"><img class="art" src="../images/{image_name}" alt="{html.escape(page['imageAlt'], quote=True)}"/><section class="copy"><p class="kicker">{html.escape(page.get('kicker') or book['category'])}</p><h1>{html.escape(page['title'])}</h1><p class="story">{html.escape(page['text'])}</p><span class="number">{index} / {len(book['pages'])}</span></section></main></body>
</html>'''
            (pages_dir / f"page-{index:02d}.xhtml").write_text(xhtml, encoding="utf-8")

        nav_items = "".join(f'<li><a href="pages/page-{i:02d}.xhtml">{html.escape(page["title"])}</a></li>' for i, page in enumerate(book["pages"], start=1))
        (oebps / "nav.xhtml").write_text(
            f'''<?xml version="1.0" encoding="UTF-8"?><html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="en-AU"><head><title>Contents</title></head><body><nav epub:type="toc"><h1>Contents</h1><ol>{nav_items}</ol></nav></body></html>''',
            encoding="utf-8",
        )

        uid = uuid.uuid5(uuid.NAMESPACE_URL, f"https://wordshaveweather.com.au/ebooks/{book['slug']}")
        manifest_images = [f'<item id="img-{i}" href="images/{name}" media-type="image/jpeg"/>' for i, name in enumerate(unique_images.values(), start=1)]
        manifest_pages = [f'<item id="page-{i}" href="pages/page-{i:02d}.xhtml" media-type="application/xhtml+xml"/>' for i in range(1, len(book["pages"]) + 1)]
        spine = "".join(f'<itemref idref="page-{i}"/>' for i in range(1, len(book["pages"]) + 1))
        opf = f'''<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="book-id" version="3.0" prefix="rendition: http://www.idpf.org/vocab/rendition/#">
<metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
<dc:identifier id="book-id">urn:uuid:{uid}</dc:identifier><dc:title>{html.escape(book['title'])}</dc:title><dc:language>en-AU</dc:language><dc:creator>Words Have Weather</dc:creator><dc:publisher>Words Have Weather</dc:publisher><dc:description>{html.escape(book['blurb'])}</dc:description><dc:subject>Education</dc:subject><dc:subject>Children's picture book</dc:subject>
<meta property="dcterms:modified">2026-08-25T00:00:00Z</meta><meta property="rendition:layout">pre-paginated</meta><meta property="rendition:orientation">landscape</meta><meta property="rendition:spread">none</meta><meta name="fixed-layout" content="true"/><meta name="original-resolution" content="1200x800"/><meta name="book-type" content="children"/><meta name="cover" content="cover-image"/>
</metadata>
<manifest><item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/><item id="css" href="styles.css" media-type="text/css"/><item id="cover-image" href="images/{cover_name}" media-type="image/jpeg" properties="cover-image"/>{''.join(manifest_images)}{''.join(manifest_pages)}</manifest>
<spine page-progression-direction="ltr">{spine}</spine>
</package>'''
        (oebps / "content.opf").write_text(opf, encoding="utf-8")

        with zipfile.ZipFile(output, "w") as archive:
            archive.write(temp / "mimetype", "mimetype", compress_type=zipfile.ZIP_STORED)
            for path in sorted(temp.rglob("*")):
                if path.is_file() and path.name != "mimetype":
                    archive.write(path, path.relative_to(temp), compress_type=zipfile.ZIP_DEFLATED)
        shutil.copy2(output, amazon_output)
    return output


def main() -> None:
    PDF_DIR.mkdir(parents=True, exist_ok=True)
    AMAZON_DIR.mkdir(parents=True, exist_ok=True)
    register_fonts()
    books = load_books()
    outputs = []
    for book in books:
        pdf = make_pdf(book)
        cover = make_amazon_cover(book)
        epub = make_epub(book, cover)
        metadata = make_amazon_metadata(book)
        outputs.append({"slug": book["slug"], "pdf": str(pdf), "epub": str(epub), "cover": str(cover), "metadata": str(metadata)})
    print(json.dumps(outputs, indent=2))


if __name__ == "__main__":
    main()
