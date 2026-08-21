#!/usr/bin/env python3
"""
verify-deck-headless.py <deck-dir> [--no-shots]

Batch slide verifier for the DataArt Corporate kit. Replaces the per-slide
"paste a 28 KB JS snippet into preview_eval + one screenshot each" loop with a
SINGLE headless Playwright run over the whole deck:

  * loads every slide-NN-*.html once (one reused browser page),
  * injects scripts/lib/slide-checks.js (the SAME checks as verify-slide.sh —
    single source of truth) and collects each slide's report,
  * captures real console errors via Playwright (not the preview sink),
  * renders a full screenshot per slide and assembles CONTACT SHEETS
    (≈6 slides/sheet) for the human eyeball review,
  * prints ONE compact PASS/FAIL summary and writes a JSON report.

Why: for a ~35-slide deck this turns ~210 preview round-trips + ~970 KB of JS
+ 35 images into one bash call (~30-60 s) + a few KB of report + ~6 sheets,
with identical checks and no quality loss. (No-bash / Cowork environments keep
using verify-slide.sh via Claude Preview — see references/cowork-adaptations.md.)

Exit codes: 0 all slides pass · 1 bad args / no slides · 2 one or more slides
FAIL a blocking gate · 3 rendering/runtime error · 1 missing dependency.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

try:
    from playwright.sync_api import sync_playwright
except ImportError as e:  # pragma: no cover
    sys.stderr.write(
        "verify-deck-headless: missing playwright: %s\n"
        "Install:  pip install playwright && playwright install chromium\n" % e
    )
    sys.exit(1)

try:
    from PIL import Image, ImageDraw, ImageFont
    _HAVE_PIL = True
except ImportError:  # contact sheets optional
    _HAVE_PIL = False

CANVAS_W, CANVAS_H = 1920, 1080
SLIDE_RE = re.compile(r"^slide-(\d{2,3})-.+\.html$", re.IGNORECASE)
SCRIPT_DIR = Path(__file__).resolve().parent
CHECKS_JS = SCRIPT_DIR / "lib" / "slide-checks.js"

# Contact-sheet layout
THUMB_W, THUMB_H = 660, 371   # 1920×1080 ÷ ~2.91 (16:9 thumbnail)
COLS, ROWS = 2, 3             # 6 slides per sheet
LABEL_H = 26
PAD = 12


def discover(deck_dir: Path) -> list[Path]:
    return sorted(p for p in deck_dir.iterdir()
                  if p.is_file() and SLIDE_RE.match(p.name))


def make_contact_sheets(shots: list[tuple[str, bool, Path]], deck_dir: Path) -> list[Path]:
    """shots: list of (label, passed, png_path). Returns sheet file paths."""
    if not _HAVE_PIL or not shots:
        return []
    try:
        font = ImageFont.load_default()
    except Exception:
        font = None
    sheet_w = COLS * THUMB_W + (COLS + 1) * PAD
    cell_h = THUMB_H + LABEL_H
    sheet_h = ROWS * cell_h + (ROWS + 1) * PAD
    per_sheet = COLS * ROWS
    sheets: list[Path] = []
    for s in range(0, len(shots), per_sheet):
        chunk = shots[s:s + per_sheet]
        sheet = Image.new("RGB", (sheet_w, sheet_h), (235, 235, 235))
        draw = ImageDraw.Draw(sheet)
        for i, (label, passed, png) in enumerate(chunk):
            r, c = divmod(i, COLS)
            x = PAD + c * (THUMB_W + PAD)
            y = PAD + r * (cell_h + PAD)
            bar = (40, 160, 90) if passed else (200, 60, 60)
            draw.rectangle([x, y, x + THUMB_W, y + LABEL_H], fill=bar)
            tag = ("PASS  " if passed else "FAIL  ") + label
            if font:
                draw.text((x + 6, y + 7), tag, fill=(255, 255, 255), font=font)
            try:
                im = Image.open(png).convert("RGB").resize((THUMB_W, THUMB_H))
                sheet.paste(im, (x, y + LABEL_H))
            except Exception:
                draw.rectangle([x, y + LABEL_H, x + THUMB_W, y + LABEL_H + THUMB_H],
                               fill=(255, 255, 255))
        out = deck_dir / f"_verify-sheet-{s // per_sheet + 1:02d}.png"
        sheet.save(out)
        sheets.append(out)
    return sheets


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("deck_dir", type=Path)
    ap.add_argument("--no-shots", action="store_true",
                    help="skip screenshots / contact sheets (checks only)")
    args = ap.parse_args()

    deck_dir: Path = args.deck_dir.resolve()
    if not deck_dir.is_dir():
        sys.stderr.write(f"verify-deck-headless: not a directory: {deck_dir}\n")
        return 1
    if not CHECKS_JS.is_file():
        sys.stderr.write(f"verify-deck-headless: missing {CHECKS_JS}\n")
        return 1
    slides = discover(deck_dir)
    if not slides:
        sys.stderr.write(f"verify-deck-headless: no slide-NN-*.html in {deck_dir}\n")
        return 1
    checks_js = CHECKS_JS.read_text(encoding="utf-8")

    reports: list[dict] = []
    shots: list[tuple[str, bool, Path]] = []
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch()
            ctx = browser.new_context(
                viewport={"width": CANVAS_W, "height": CANVAS_H},
                device_scale_factor=1.0,
            )
            page = ctx.new_page()
            console_msgs: list[str] = []
            failed_assets: list[str] = []
            page.on("console", lambda m: console_msgs.append(f"{m.type}: {m.text}")
                    if m.type in ("error", "warning") else None)
            # Catch assets that fail to load — CRITICAL for the kit's CSS
            # `background-image: url(../assets/backgrounds/*.jpg)`. A missing
            # background is NOT an <img> (so the DOM image check can't see it);
            # it surfaces only as a failed network request. A self-contained kit
            # copy that omitted assets/ (Cowork) silently dropped every bg until
            # this gate caught it.
            def _req_failed(req):
                u = req.url
                if "favicon" not in u:
                    failed_assets.append(u)
            page.on("requestfailed", _req_failed)
            page.on("response", lambda r: failed_assets.append(r.url)
                    if (r.status >= 400 and "favicon" not in r.url) else None)

            for sf in slides:
                console_msgs.clear()
                failed_assets.clear()
                # `load` waits for all sub-resources (CSS, background/icon
                # images) — exactly what the rect/asset checks need — without
                # networkidle's mandatory ~500 ms idle wait per slide. Fonts are
                # awaited explicitly so glyph metrics are stable before checks.
                page.goto(f"file://{sf.resolve()}", wait_until="load")
                try:
                    page.evaluate("() => (document.fonts && document.fonts.ready) || null")
                except Exception:
                    pass
                page.evaluate(
                    "() => { const s=document.querySelector('.slide');"
                    " if (s) s.style.setProperty('--slide-scale','1'); }"
                )
                page.add_script_tag(content=checks_js)
                rep = page.evaluate("(p) => window.__runSlideChecks(p)", str(sf.resolve()))
                # merge real console errors captured by Playwright
                errs = [m for m in console_msgs if m.startswith("error")]
                if errs:
                    rep.setdefault("console_errors", [])
                    rep["console_errors"] = list(rep["console_errors"]) + errs
                    rep["passed"] = rep.get("passed", True) and len(errs) == 0
                # asset 404s (missing backgrounds / icons / logos) → BLOCKING
                bad = sorted(set(failed_assets))
                if bad:
                    rep.setdefault("composition_contrast", []).append({
                        "name": "asset_404",
                        "expected": "all CSS/img assets load (backgrounds, icons, logos)",
                        "actual": f"{len(bad)} asset(s) failed: " +
                                  ", ".join(u.split('/')[-1] for u in bad[:6]),
                        "passed": False,
                    })
                    rep["passed"] = False
                rep["_name"] = sf.name
                reports.append(rep)

                if not args.no_shots and _HAVE_PIL:
                    png = deck_dir / f"_shot-{sf.stem}.png"
                    page.screenshot(path=str(png),
                                    clip={"x": 0, "y": 0, "width": CANVAS_W, "height": CANVAS_H})
                    shots.append((sf.name, bool(rep.get("passed")), png))
            browser.close()
    except Exception as e:
        sys.stderr.write(f"verify-deck-headless: render error: {e}\n")
        return 3

    sheets = make_contact_sheets(shots, deck_dir) if not args.no_shots else []

    # ---- compact summary ----
    n_pass = sum(1 for r in reports if r.get("passed"))
    print(f"verify-deck-headless: {n_pass}/{len(reports)} slides PASS  ({deck_dir.name})")
    for r in reports:
        failed = [c["name"] for c in r.get("rect_checks", []) if not c.get("passed")]
        failed += [c["name"] for c in r.get("composition_contrast", []) if not c.get("passed")]
        cramp = len(r.get("cramp_warnings", []))
        cerr = len(r.get("console_errors", []))
        if r.get("passed") and not cramp:
            print(f"  PASS  {r['_name']}")
        else:
            bits = []
            if failed:
                bits.append("fails=" + ",".join(failed))
            if cramp:
                bits.append(f"cramp={cramp}")
            if cerr:
                bits.append(f"console_err={cerr}")
            print(f"  {'PASS' if r.get('passed') else 'FAIL'}  {r['_name']}  " + " ".join(bits))
    if sheets:
        print("contact sheets: " + ", ".join(s.name for s in sheets))
        print("  (open them to eyeball layout; zoom any flagged slide with _shot-*.png)")

    report_path = deck_dir / "_verify-report.json"
    report_path.write_text(json.dumps(reports, indent=1), encoding="utf-8")
    print(f"full report: {report_path.name}")

    return 0 if n_pass == len(reports) else 2


if __name__ == "__main__":
    sys.exit(main())
