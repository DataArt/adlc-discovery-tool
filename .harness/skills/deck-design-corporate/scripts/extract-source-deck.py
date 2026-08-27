#!/usr/bin/env python3
"""
extract-source-deck.py  —  ingest a source .pptx for MIGRATION / re-skin.

When the job is "take this existing deck and put it into our Corporate template"
(see references/deck-migration.md), run this FIRST. It reads the source .pptx
and lays out everything the re-skin needs, so you preserve the source's content,
slide count, and order instead of rebuilding from scratch.

    python3 scripts/extract-source-deck.py <source.pptx> <out-dir>
    # e.g. python3 scripts/extract-source-deck.py ~/Downloads/foo.pptx \
    #        tmp/decks/foo/_source

Writes into <out-dir>/:
  source.json   per-slide structured profile (read this to build the slide plan)
  SUMMARY.md    compact, human-scannable index (one line per slide)
  img/          every embedded picture, saved as slide<NN>-img<k>.<ext>
  montage.png   thumbnail grid of img/ so you can eyeball which images are real
                diagrams/screenshots to carry over vs decorative chrome to drop

source.json schema (per slide):
  { "index": 1,
    "layout": "Title and Content",
    "title": "…" | null,
    "subtitle": "…" | null,
    "body_blocks": [ {"text": "…", "level": 0} , … ],   # bullet hierarchy
    "tables": [ [ ["r1c1","r1c2"], ["r2c1","r2c2"] ], … ],
    "notes": "…" | null,
    "images": [ {"file":"img/slide01-img0.png","w":1280,"h":720,
                 "emu":[cx,cy],"kind_guess":"diagram_or_photo"} , … ],
    "shape_summary": "1 title · 5 bullets · 1 image · 1 table" }

kind_guess (a HINT — confirm visually via montage.png):
  full_bleed_background  covers most of the slide → usually drop (we set our bg)
  banner                 full-width, short → often source chrome → usually drop
  logo                   small, top/corner → drop (we use the DataArt logo)
  small_icon             tiny → usually re-draw with a kit library icon
  diagram_or_photo       everything else → the real content to carry over

Notes:
- This is .pptx-only (python-pptx). For PDF / image sources, read the rendered
  pages with vision and hand-author source.json in the same schema (the rest of
  the migration flow is identical). pypdf can pull PDF text if needed.
- Text is read verbatim (no truncation) — fidelity is the whole point. Trimming
  to layout budgets happens later, per slide, in the build step.
"""
from __future__ import annotations
import json
import sys
from pathlib import Path

try:
    from pptx import Presentation
    from pptx.util import Emu
    from pptx.enum.shapes import MSO_SHAPE_TYPE
except Exception:  # pragma: no cover
    sys.stderr.write("extract-source-deck: python-pptx not available. "
                     "Install it, or for PDF/image sources hand-author "
                     "source.json per references/deck-migration.md.\n")
    sys.exit(1)

EMU_PER_PX = 9525  # 96 dpi


def _px(emu) -> int:
    try:
        return round(int(emu) / EMU_PER_PX)
    except Exception:
        return 0


def classify_image(w_px, h_px, left_px, top_px, slide_w, slide_h):
    """Best-effort hint so the agent knows what to keep. Confirm via montage."""
    if not (w_px and h_px):
        return "diagram_or_photo"
    area = (w_px * h_px) / (slide_w * slide_h) if slide_w and slide_h else 0
    wide = w_px >= 0.85 * slide_w
    if area >= 0.6:
        return "full_bleed_background"
    if wide and h_px <= 0.25 * slide_h:
        return "banner"
    if w_px <= 96 and h_px <= 96:
        return "small_icon"
    if max(w_px, h_px) <= 200 and (top_px <= 0.18 * slide_h or top_px >= 0.82 * slide_h):
        return "logo"
    return "diagram_or_photo"


def extract(pptx_path: Path, out_dir: Path):
    prs = Presentation(str(pptx_path))
    slide_w, slide_h = _px(prs.slide_width), _px(prs.slide_height)
    img_dir = out_dir / "img"
    img_dir.mkdir(parents=True, exist_ok=True)

    slides = []
    saved_imgs = []
    for si, slide in enumerate(prs.slides, start=1):
        title = subtitle = None
        body_blocks = []
        tables = []
        images = []
        n_title = n_bullets = n_imgs = n_tables = 0

        # title via the title placeholder when present
        try:
            if slide.shapes.title and slide.shapes.title.has_text_frame:
                t = slide.shapes.title.text_frame.text.strip()
                if t:
                    title = t
                    n_title = 1
        except Exception:
            pass

        for sh in slide.shapes:
            # tables
            if getattr(sh, "has_table", False) and sh.has_table:
                rows = []
                for r in sh.table.rows:
                    rows.append([c.text.strip() for c in r.cells])
                if rows:
                    tables.append(rows)
                    n_tables += 1
                continue
            # pictures
            if sh.shape_type == MSO_SHAPE_TYPE.PICTURE:
                try:
                    img = sh.image
                    ext = (img.ext or "png").lower()
                    fn = f"slide{si:02d}-img{len(images)}.{ext}"
                    (img_dir / fn).write_bytes(img.blob)
                    pw, ph = (img.size if img.size else (0, 0))
                    kind = classify_image(_px(sh.width), _px(sh.height),
                                          _px(sh.left), _px(sh.top), slide_w, slide_h)
                    rec = {"file": f"img/{fn}", "w": pw, "h": ph,
                           "box_px": [_px(sh.width), _px(sh.height)],
                           "kind_guess": kind}
                    images.append(rec)
                    saved_imgs.append(img_dir / fn)
                    n_imgs += 1
                except Exception as e:
                    images.append({"file": None, "error": str(e), "kind_guess": "unknown"})
                continue
            # text (skip the title shape we already captured)
            if getattr(sh, "has_text_frame", False) and sh.has_text_frame:
                if slide.shapes.title is not None and sh == slide.shapes.title:
                    continue
                paras = [p for p in sh.text_frame.paragraphs]
                texts = [("".join(r.text for r in p.runs) or p.text).strip() for p in paras]
                texts_levels = [(t, getattr(p, "level", 0) or 0)
                                for t, p in zip(texts, paras) if t]
                if not texts_levels:
                    continue
                # heuristic: a single short line that isn't the title = subtitle
                if subtitle is None and title and len(texts_levels) == 1 \
                        and len(texts_levels[0][0]) <= 80:
                    subtitle = texts_levels[0][0]
                    continue
                for txt, lvl in texts_levels:
                    body_blocks.append({"text": txt, "level": lvl})
                    n_bullets += 1

        notes = None
        try:
            if slide.has_notes_slide:
                nt = slide.notes_slide.notes_text_frame.text.strip()
                notes = nt or None
        except Exception:
            pass

        layout = ""
        try:
            layout = slide.slide_layout.name or ""
        except Exception:
            pass

        parts = []
        if n_title:
            parts.append(f"{n_title} title")
        if n_bullets:
            parts.append(f"{n_bullets} bullets")
        if n_imgs:
            parts.append(f"{n_imgs} image" + ("s" if n_imgs != 1 else ""))
        if n_tables:
            parts.append(f"{n_tables} table" + ("s" if n_tables != 1 else ""))
        shape_summary = " · ".join(parts) or "empty"

        slides.append({
            "index": si, "layout": layout,
            "title": title, "subtitle": subtitle,
            "body_blocks": body_blocks, "tables": tables, "notes": notes,
            "images": images, "shape_summary": shape_summary,
        })

    doc = {"source": str(pptx_path), "slide_count": len(slides),
           "canvas_px": [slide_w, slide_h], "slides": slides}
    (out_dir / "source.json").write_text(json.dumps(doc, ensure_ascii=False, indent=2))

    # SUMMARY.md
    lines = [f"# Source deck: {pptx_path.name}",
             f"{len(slides)} slides · canvas {slide_w}×{slide_h}px", ""]
    for s in slides:
        ttl = (s["title"] or "(no title)").replace("\n", " ")
        lines.append(f"{s['index']:>3}. {ttl[:70]}  —  {s['shape_summary']}")
    (out_dir / "SUMMARY.md").write_text("\n".join(lines) + "\n")

    make_montage(saved_imgs, out_dir / "montage.png")
    return doc, len(saved_imgs)


def make_montage(paths, dst: Path, cols=5, thumb=240, pad=8):
    if not paths:
        return
    try:
        from PIL import Image, ImageDraw
    except Exception:
        return
    thumbs = []
    for p in paths:
        try:
            im = Image.open(p).convert("RGB")
            im.thumbnail((thumb, thumb))
            thumbs.append((p.name, im))
        except Exception:
            continue
    if not thumbs:
        return
    rows = (len(thumbs) + cols - 1) // cols
    cell = thumb + pad * 2
    W, H = cols * cell, rows * (cell + 16)
    canvas = Image.new("RGB", (W, H), (245, 247, 248))
    d = ImageDraw.Draw(canvas)
    for i, (name, im) in enumerate(thumbs):
        r, c = divmod(i, cols)
        x = c * cell + pad + (thumb - im.width) // 2
        y = r * (cell + 16) + pad
        canvas.paste(im, (x, y))
        d.text((c * cell + pad, r * (cell + 16) + thumb + pad), name[:34], fill=(40, 40, 40))
    canvas.save(dst)


def main():
    if len(sys.argv) != 3:
        sys.stderr.write(__doc__)
        return 2
    src = Path(sys.argv[1]).expanduser()
    out = Path(sys.argv[2]).expanduser()
    if not src.exists():
        sys.stderr.write(f"extract-source-deck: source not found: {src}\n")
        return 1
    out.mkdir(parents=True, exist_ok=True)
    doc, nimg = extract(src, out)
    print(f"extracted {doc['slide_count']} slides + {nimg} image(s) → {out}")
    print(f"  read {out/'SUMMARY.md'} and {out/'source.json'}; "
          f"eyeball {out/'montage.png'} to pick which images to carry over.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
