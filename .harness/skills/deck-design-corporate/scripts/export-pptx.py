#!/usr/bin/env python3
"""
export-pptx.py — Hybrid HTML→PPTX exporter for the DataArt Slides kit.

For each `slide-NN-*.html` file in <deck-dir>:
  1. Render at 1920×1080 via headless Chromium (Playwright).
  2. Capture a PNG screenshot.
  3. Extract every visible text node's text + position + font metrics
     from the DOM.
The deck is assembled on the DataArt branded base template
(`<kit>/pptx/dataart-corporate-template.pptx`, built by build-master-template.py)
so it carries the DataArt slide master + reusable grid layouts; baked slides sit
on the empty "Export Carrier (Blank)" layout. Each slide has:
  - the PNG as a full-bleed background image (decorations / illustrations /
    mixed-font headlines baked in);
  - a native editable TextBox over each single-font text block;
  - a NATIVE, editable PowerPoint TABLE for every `.sheet` (Part 50) — the
    table grid/text is hidden before the screenshot so it does NOT bake into
    the PNG; the native table reproduces the kit's column widths, per-cell
    fills, Arial typography, and 1px black grid (crisp vector, fully editable).

See `agent/skills/deck-design-corporate/references/pptx-export.md` for the
full design rationale.

Usage:
    python3 export-pptx.py <deck-dir> [--output PATH] [--server-url URL]

Exit codes:
    0  success
    1  missing dependency (caller should print install hint)
    2  bad arguments
    3  no slide HTML files found in deck-dir
    4  rendering / extraction error
    5  pptx assembly error
"""

from __future__ import annotations

import argparse
import os
import re
import shutil
import sys
import tempfile
from pathlib import Path

# --- Dependency probe with a friendly error ---------------------------------
try:
    from pptx import Presentation
    from pptx.util import Emu, Pt
    from pptx.dml.color import RGBColor
    from pptx.enum.text import MSO_ANCHOR, PP_ALIGN
    from pptx.enum.shapes import MSO_SHAPE
    from pptx.oxml.ns import qn
except ImportError as e:  # pragma: no cover — install-time path
    sys.stderr.write(
        "export-pptx.py: missing Python dependency: %s\n"
        "Install with:  pip install python-pptx pillow playwright\n"
        % e
    )
    sys.exit(1)

try:
    from playwright.sync_api import sync_playwright
except ImportError as e:  # pragma: no cover
    sys.stderr.write(
        "export-pptx.py: missing playwright: %s\n"
        "Install with:  pip install playwright && playwright install chromium\n"
        % e
    )
    sys.exit(1)


# --- Constants matching the kit's canvas ------------------------------------
# Corporate kit canvas = 1920 × 1080 (Figma-native 16:9, matches the Figma source 1:1).
CANVAS_W_PX = 1920
CANVAS_H_PX = 1080
# Standard PowerPoint widescreen 16:9 slide:  13.333" × 7.5".
# 1 inch = 914 400 EMU → slide is 12 192 000 × 6 858 000 EMU. The slide size in
# EMU is unchanged (still 16:9); only the px→EMU ratio scales with the canvas.
# 1920 CSS px → 12 192 000 EMU, i.e. 6350 EMU per CSS px (auto-computed).
SLIDE_W_EMU = 12192000
SLIDE_H_EMU = 6858000
EMU_PER_PX = SLIDE_W_EMU / CANVAS_W_PX  # = 6350 EMU/px at 1920

# CSS px → PowerPoint points for FONT SIZE only. At slide-fits-screen zoom,
# 1920 CSS px maps to 13.333 in = 960 pt of slide width. So 1 CSS px maps to
# 960 / 1920 = 0.5 pt of slide. Use that ratio for font size so glyphs land
# the same physical size as in the browser preview.
PX_TO_PT = 960 / CANVAS_W_PX  # = 0.5 pt/px at 1920

# Kit content safe zone: symmetric 153.333 px L/R margins (shared/layouts.css).
# No text box may cross the right edge — guards against off-slide overflow.
SAFE_MARGIN_PX = 153.333
SAFE_RIGHT_PX = CANVAS_W_PX - SAFE_MARGIN_PX  # 1766.667


# --- Slide discovery --------------------------------------------------------
SLIDE_RE = re.compile(r"^slide-(\d{2})-.+\.html$", re.IGNORECASE)


def discover_slides(deck_dir: Path) -> list[Path]:
    files = sorted(
        p for p in deck_dir.iterdir()
        if p.is_file() and SLIDE_RE.match(p.name)
    )
    return files


# --- JS payload — per-block extraction with font-uniformity (Part 25) ------
# Returns an array of single-font block objects shaped:
#   { text, x, y, w, h, fontSize, fontFamily, fontWeight, color, extractId }
#
# Strategy (Part 25 rewrite):
# - Walk block-level elements (<p>, <li>, <h1>-<h6>) — not text nodes.
# - For each block, gather all descendant text nodes.
# - Compute font signature per text node: (family, size, weight, color, td).
# - If ALL signatures match → SINGLE-FONT block → extract one textbox with
#   the concatenated text and the block's bounding rect. Tag the block with
#   data-extract-id for later HIDE_BLOCKS_JS.
# - If signatures differ → MIXED-FONT block → SKIP. Leave the block visible
#   in the screenshot so it bakes into the PNG (Chromium renders it
#   perfectly; no PowerPoint font-fallback drift).
#
# This eliminates the overlap class of bugs from Part 23: mixed-weight
# headlines like `<p>A team of <span class="hl-bold">enthusiastic</span>
# specialists</p>` no longer become 3 separate textboxes that drift when
# PowerPoint metrics differ from Chromium. They stay in the PNG.
EXTRACT_JS = r"""
() => {
  // Part 55 — ALL text is extracted as NATIVE, editable runs. A block is no
  // longer skipped (baked into the PNG) when its text mixes weight/colour:
  // instead each text node becomes a RUN inside a single textbox, carrying its
  // own size/weight/colour/italic/underline. PowerPoint flows the runs inline
  // within the one textbox, so there is no per-node positioning drift (the
  // Part 23 overlap regression came from emitting one textbox PER node — we do
  // not do that). The ONLY thing still left in the PNG is text painted with an
  // unreproducible fill (gradient / background-clip:text), detected per run.
  const BLOCK_SELECTOR = 'p, li, h1, h2, h3, h4, h5, h6, ul, ol';
  const NESTED_GUARD_SELECTOR = 'p, li, h1, h2, h3, h4, h5, h6';
  const blocks = [...document.querySelectorAll(BLOCK_SELECTOR)];
  const out = [];
  let idCounter = 0;

  function isVisible(el) {
    for (let e = el; e; e = e.parentElement) {
      const cs = window.getComputedStyle(e);
      if (cs.display === 'none') return false;
      if (cs.visibility === 'hidden') return false;
      if (parseFloat(cs.opacity || '1') === 0) return false;
    }
    return true;
  }

  // A run is unreproducible if its text is painted by a gradient / image via
  // background-clip:text (transparent fill over a clipped background). Those
  // stay baked in the PNG.
  function isGradientText(el) {
    const cs = window.getComputedStyle(el);
    const clip = (cs.webkitBackgroundClip || cs.backgroundClip || '');
    const fill = (cs.webkitTextFillColor || '');
    return clip.indexOf('text') !== -1 &&
           (fill === 'rgba(0, 0, 0, 0)' || fill === 'transparent');
  }

  function gatherTextNodes(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(n) {
        if (!n.nodeValue || !n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        const p = n.parentElement;
        if (!p) return NodeFilter.FILTER_REJECT;
        const tag = p.tagName;
        if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT') {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    const nodes = [];
    let n;
    while ((n = walker.nextNode())) nodes.push(n);
    return nodes;
  }

  // Build inline runs from a set of text nodes. Returns null if ANY run is
  // gradient/clip text (→ bake the whole block). Whitespace is collapsed and
  // boundary-deduplicated so runs concatenate cleanly.
  function runsFromNodes(nodes) {
    const runs = [];
    for (const tn of nodes) {
      const p = tn.parentElement;
      if (!p) continue;
      if (isGradientText(p)) return null;
      const cs = window.getComputedStyle(p);
      const t = tn.nodeValue.replace(/\s+/g, ' ');
      if (!t) continue;
      const td = (cs.textDecorationLine || cs.textDecoration || '');
      runs.push({
        text: t,
        sizePx: parseFloat(cs.fontSize) || 16,
        weight: parseInt(cs.fontWeight) || 400,
        color: cs.color || 'rgb(0, 0, 0)',
        italic: cs.fontStyle === 'italic',
        underline: td.indexOf('underline') !== -1,
      });
    }
    for (let i = 0; i < runs.length; i++) {
      if (i === 0) runs[i].text = runs[i].text.replace(/^\s+/, '');
      if (i === runs.length - 1) runs[i].text = runs[i].text.replace(/\s+$/, '');
      if (i > 0 && /\s$/.test(runs[i - 1].text) && /^\s/.test(runs[i].text)) {
        runs[i].text = runs[i].text.replace(/^\s+/, '');
      }
    }
    return runs.filter(r => r.text.length);
  }

  // Split a block's text into the VISUAL LINES Chromium actually laid out, so
  // the PPTX can reproduce them with hard breaks (word_wrap off) instead of
  // letting PowerPoint re-wrap with its wider Arial metrics — the root cause of
  // text overflowing its box / a word clipping / a label jumping to 2 lines.
  // Each word is measured with a Range; words sharing a top are one line. Within
  // a line, adjacent words of the same style merge into one run (space-joined).
  // Returns [[{text,sizePx,weight,color,italic,underline}, …], …] or null if the
  // block has gradient/clip text (stays baked) or measures empty (caller falls
  // back to the single-paragraph runs path).
  function sameStyleRun(a, b) {
    return a.sizePx === b.sizePx && a.weight === b.weight && a.color === b.color
        && a.italic === b.italic && a.underline === b.underline;
  }
  function linesFromNodes(nodes) {
    const byLine = [];   // [{top, bottom, words:[{text, style}]}]
    // Group fragments into visual lines by vertical OVERLAP, not an exact top
    // match. A big label + small text sharing ONE baseline (e.g. "Why this
    // matters" 24px next to an 18.667px list) have different rect tops, so a
    // top-only match wrongly splits them onto two lines — and the 2nd line then
    // collides with the rule below it. A fragment joins a line when its vertical
    // centre falls inside that line's span.
    function lineFor(top, bottom) {
      const mid = (top + bottom) / 2;
      for (const L of byLine) {
        if (mid >= L.top - 2 && mid <= L.bottom + 2) {
          if (top < L.top) L.top = top;
          if (bottom > L.bottom) L.bottom = bottom;
          return L;
        }
      }
      const L = { top, bottom, words: [] }; byLine.push(L); return L;
    }
    for (const tn of nodes) {
      const p = tn.parentElement;
      if (!p) continue;
      if (isGradientText(p)) return null;
      const cs = window.getComputedStyle(p);
      const td = (cs.textDecorationLine || cs.textDecoration || '');
      const style = {
        sizePx: parseFloat(cs.fontSize) || 16,
        weight: parseInt(cs.fontWeight) || 400,
        color: cs.color || 'rgb(0, 0, 0)',
        italic: cs.fontStyle === 'italic',
        underline: td.indexOf('underline') !== -1,
      };
      const text = tn.nodeValue;
      const re = /[^\s]+/g;   // words; whitespace runs are the join points
      let m;
      while ((m = re.exec(text)) !== null) {
        const wStart = m.index, wEnd = m.index + m[0].length;
        const range = document.createRange();
        range.setStart(tn, wStart);
        range.setEnd(tn, wEnd);
        const rects = range.getClientRects();
        if (!rects.length) continue;
        if (rects.length === 1) {
          lineFor(Math.round(rects[0].top), Math.round(rects[0].bottom)).words.push({ text: m[0], style });
          continue;
        }
        // Word wrapped across visual lines (hyphens:auto, or a break at an
        // existing hyphen e.g. "over-permissive"). Splitting at the line
        // boundary is REQUIRED: word_wrap is off in the PPTX, so baking the
        // whole word onto rects[0]'s line makes that line overrun the column
        // and collide with the next one (the Part-XX 4-column overflow). Walk
        // the word character-by-character, group chars by their line top, and
        // emit one fragment per line. A soft-hyphenated fragment gets its
        // visible "-" re-appended; a fragment that already ends in a real
        // hyphen ("over-") is left as-is so we don't double it.
        let curTop = null, curBottom = null, frag = '';
        const flush = (isLast) => {
          if (!frag) return;
          let t = frag;
          if (!isLast && !/[-‐‑–]$/.test(t)) t += '-';
          lineFor(Math.round(curTop), Math.round(curBottom)).words.push({ text: t, style });
          frag = '';
        };
        for (let ci = wStart; ci < wEnd; ci++) {
          const cr = document.createRange();
          cr.setStart(tn, ci);
          cr.setEnd(tn, ci + 1);
          const rs = cr.getClientRects();
          if (!rs.length) { frag += text[ci]; continue; }
          const top = Math.round(rs[0].top);
          if (curTop === null) { curTop = top; curBottom = Math.round(rs[0].bottom); }
          else if (Math.abs(top - curTop) > 4) { flush(false); curTop = top; curBottom = Math.round(rs[0].bottom); }
          frag += text[ci];
        }
        flush(true);
      }
    }
    if (!byLine.length) return null;
    byLine.sort((a, b) => a.top - b.top);
    return byLine.map(L => {
      const out = [];
      L.words.forEach((w, i) => {
        const text = (i === 0 ? '' : ' ') + w.text;
        const last = out[out.length - 1];
        if (last && sameStyleRun(last, w.style)) last.text += text;
        else out.push({ text, sizePx: w.style.sizePx, weight: w.style.weight,
                        color: w.style.color, italic: w.style.italic,
                        underline: w.style.underline });
      });
      return out;
    });
  }

  function layerMaxWFor(block, rect) {
    let maxRight = Infinity;
    const layer = block.closest('.layer');
    if (layer && layer !== block) {
      const lr = layer.getBoundingClientRect();
      const padR = parseFloat(window.getComputedStyle(layer).paddingRight) || 0;
      // A layer that HUGS a centred block (e.g. a centred .flow-step shrink-
      // wrapped around its label) is not a real width constraint: the text is
      // centred with empty room on both sides of its column, so clamping to the
      // tight layer edge strips the metric-drift slop and PowerPoint wraps/clips
      // the label ("Design" -> "Desig"; a 2-line title overrunning its icon).
      // Only clamp to a layer that is genuinely WIDER than the text.
      const centered = window.getComputedStyle(block).textAlign === 'center';
      if (!(centered && lr.width - rect.width <= 8)) {
        maxRight = Math.min(maxRight, lr.left + lr.width - padR);
      }
    }
    const grid = block.closest('.cols, .compare, .pipeline, .steps, .box-grid, .milestone-tl');
    if (grid) {
      let cell = block;
      while (cell && cell.parentElement !== grid) cell = cell.parentElement;
      if (cell && cell.parentElement === grid) {
        const cr = cell.getBoundingClientRect();
        const padR = parseFloat(window.getComputedStyle(cell).paddingRight) || 0;
        maxRight = Math.min(maxRight, cr.left + cr.width - padR);
      }
    }
    if (!isFinite(maxRight)) return null;
    return Math.max(0, maxRight - rect.x);
  }

  function lineRatio(el, sizePx) {
    const cs = window.getComputedStyle(el);
    const lh = cs.lineHeight === 'normal'
      ? sizePx * 1.2
      : (parseFloat(cs.lineHeight) || sizePx * 1.2);
    return lh / sizePx;
  }

  for (const block of blocks) {
    if (!isVisible(block)) continue;
    if (block.closest('.sheet')) continue;   // tables → native PPTX tables

    const tag = block.tagName;
    const isList = tag === 'UL' || tag === 'OL';

    if (isList) {
      const items = [...block.children].filter(c => c.tagName === 'LI');
      if (items.length === 0) continue;
      const isOrdered = tag === 'OL';
      const hasIcons = block.classList.contains('has-icons');

      const paragraphs = [];
      let bake = false;
      items.forEach((li, i) => {
        const nodes = gatherTextNodes(li);
        if (nodes.length === 0) return;
        const runs = runsFromNodes(nodes);
        if (runs === null) { bake = true; return; }
        if (runs.length === 0) return;
        // ::marker is not a text node; substitute an explicit prefix. For
        // .has-icons the SVG bullet is emitted as a NATIVE picture
        // (ICON extraction below), so no text prefix.
        const prefix = hasIcons ? '' : (isOrdered ? (i + 1) + '. ' : '•  ');
        // The inter-item gap is the LI's OWN css margin-bottom — reproduced in
        // the PPTX so the baked list height matches the HTML (a `.steps-list`
        // with margin:0 gets NO gap, so it fits the coloured panel it sits in).
        const gapAfter = parseFloat(window.getComputedStyle(li).marginBottom) || 0;
        paragraphs.push({ prefix, runs, lines: linesFromNodes(nodes), gapAfter });
      });
      if (bake || paragraphs.length === 0) continue;  // gradient list → bake

      const rect = block.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) continue;

      let iconOffsetPx = 0;
      if (hasIcons) {
        iconOffsetPx = parseFloat(window.getComputedStyle(items[0]).paddingLeft) || 0;
      }
      const firstSize = paragraphs[0].runs[0].sizePx;
      const extractId = 'pptx-extract-' + (++idCounter);
      block.setAttribute('data-extract-id', extractId);

      out.push({
        x: rect.x + iconOffsetPx, y: rect.y,
        w: Math.max(rect.width - iconOffsetPx, 1), h: rect.height,
        fontSize: firstSize,
        lineHeightRatio: lineRatio(items[0], firstSize),
        isList: true, hasIcons, iconOffsetPx, extractId,
        paragraphs,
        layerMaxW: (() => {
          const raw = layerMaxWFor(block, rect);
          return raw === null ? null : Math.max(0, raw - iconOffsetPx);
        })(),
      });
      continue;
    }

    const listAncestor = block.closest('ul, ol');
    if (listAncestor && listAncestor.hasAttribute('data-extract-id')) continue;
    if (tag === 'LI') continue;
    if (block.querySelector(NESTED_GUARD_SELECTOR)) continue;

    const nodes = gatherTextNodes(block);
    if (nodes.length === 0) continue;
    const runs = runsFromNodes(nodes);
    if (runs === null || runs.length === 0) continue;  // gradient text → bake

    const rect = block.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) continue;
    const padL = parseFloat(window.getComputedStyle(block).paddingLeft) || 0;
    const firstSize = runs[0].sizePx;
    const extractId = 'pptx-extract-' + (++idCounter);
    block.setAttribute('data-extract-id', extractId);

    // Bake the EXACT visual lines Chromium laid out (word-wrap stays off so
    // PowerPoint can't re-wrap with its wider Arial). The hyphenation/word split
    // in linesFromNodes already prevents an over-wide line overrunning the
    // column; the natural lines never cross their boundary at PowerPoint's ~5%
    // metric drift (measured). Do NOT pre-narrow here — tightening the wrap to
    // buy drift headroom pushes a borderline word onto its own line (orphan
    // "way") for no real benefit.
    const lines = linesFromNodes(nodes);

    out.push({
      x: rect.x + padL, y: rect.y,
      w: Math.max(rect.width - padL, 1), h: rect.height,
      fontSize: firstSize,
      lineHeightRatio: lineRatio(block, firstSize),
      isList: false, extractId,
      paragraphs: [{ prefix: '', runs, lines }],
      layerMaxW: (() => {
        const raw = layerMaxWFor(block, rect);
        return raw === null ? null : Math.max(0, raw - padL);
      })(),
    });
  }
  return out;
}
"""

# --- JS payload — native TABLE extraction (Part 50) ------------------------
# The kit's `.sheet` table is a flex grid of `.sheet-row` > `.sheet-cell`
# (divs, so EXTRACT_JS never sees them — they used to bake into the PNG as
# raster text). This extractor reads the grid structure so assemble_pptx can
# emit a NATIVE, editable PowerPoint table with crisp vector text and the
# kit's exact column widths, fills, fonts, and 1px black grid.
#
# Returns one object per `.sheet`:
#   { x, y, w, h, ncols, colWidths[], isPlan, extractId,
#     rows: [ { height, isHeader, cells: [ {text, bg, color, fontSize,
#               bold, align, padTop, padLeft} ] } ] }
EXTRACT_TABLES_JS = r"""
() => {
  const out = [];
  let tid = 0;

  // Walk up to the first ancestor with a non-transparent background so a
  // cell that is itself transparent (e.g. .sheet--plan cells, where the
  // ROW carries the fill) reports the colour a viewer actually sees.
  function effectiveBg(el) {
    for (let e = el; e; e = e.parentElement) {
      const c = window.getComputedStyle(e).backgroundColor;
      if (c && c !== 'rgba(0, 0, 0, 0)' && c !== 'transparent') return c;
      if (e.classList && e.classList.contains('slide')) break;
    }
    return 'rgb(255, 255, 255)';
  }

  for (const sheet of document.querySelectorAll('.slide .sheet')) {
    const rect = sheet.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) continue;
    const rowEls = [...sheet.children].filter(c => c.classList.contains('sheet-row'));
    if (rowEls.length === 0) continue;

    // Column template = the row with the most cells (kit rows are regular,
    // but be defensive). Column widths come from that row's cell rects.
    let colCells = [];
    for (const r of rowEls) {
      const cells = [...r.children].filter(c => c.classList.contains('sheet-cell'));
      if (cells.length > colCells.length) colCells = cells;
    }
    const ncols = colCells.length;
    if (ncols === 0) continue;
    const colWidths = colCells.map(c => c.getBoundingClientRect().width);

    const rows = rowEls.map(r => {
      const rr = r.getBoundingClientRect();
      const cells = [...r.children].filter(c => c.classList.contains('sheet-cell'));
      return {
        height: rr.height,
        isHeader: r.classList.contains('sheet-row--header'),
        cells: cells.map(cell => {
          const cs = window.getComputedStyle(cell);
          return {
            text: (cell.innerText || '').replace(/\s+/g, ' ').trim(),
            bg: effectiveBg(cell),
            color: cs.color || 'rgb(0, 0, 0)',
            fontSize: parseFloat(cs.fontSize) || 21,
            bold: (parseInt(cs.fontWeight) || 400) >= 600,
            align: cs.textAlign || 'left',
            padTop: parseFloat(cs.paddingTop) || 0,
            padLeft: parseFloat(cs.paddingLeft) || 0,
          };
        }),
      };
    });

    const extractId = 'tbl-' + (++tid);
    sheet.setAttribute('data-table-extract', extractId);
    out.push({
      x: rect.x, y: rect.y, w: rect.width, h: rect.height,
      ncols, colWidths,
      isPlan: sheet.classList.contains('sheet--plan'),
      extractId, rows,
    });
  }
  return out;
}
"""

# Hide extracted tables (whole `.sheet`) so neither their text nor their grid
# bakes into the PNG — the native PPTX table replaces them. `visibility:hidden`
# keeps layout intact (nothing else shifts).
HIDE_TABLES_JS = r"""
() => {
  let n = 0;
  for (const el of document.querySelectorAll('[data-table-extract]')) {
    el.style.setProperty('visibility', 'hidden', 'important');
    n++;
  }
  return n;
}
"""

# --- JS payload to hide EVERY extracted block before the screenshot --------
# Part 55: all text blocks are extracted as native runs, so all of them must be
# gassed out of the PNG. Setting `color:transparent` on the block alone is NOT
# enough — child <span>s with an explicit colour (the mixed-colour case the user
# wants native) keep their own colour and would still bake. So we gas the block
# AND every descendant element. The PNG then carries only decorations /
# illustrations / logos / gradient-clip text (the narrow bake-only case).
HIDE_BLOCKS_JS = r"""
() => {
  const blocks = document.querySelectorAll('[data-extract-id]');
  let hidden = 0;
  const gas = (el) => {
    el.style.setProperty('color', 'transparent', 'important');
    el.style.setProperty('text-shadow', 'none', 'important');
    el.style.setProperty('-webkit-text-fill-color', 'transparent', 'important');
    el.style.setProperty('text-decoration-color', 'transparent', 'important');
  };
  for (const el of blocks) {
    gas(el);
    for (const child of el.querySelectorAll('*')) gas(child);
    hidden++;
  }
  return hidden;
}
"""

# --- JS payload — native IMAGE extraction (Part 56) ------------------------
# Every <img> (icons, logos, partner logos, illustrations) is emitted as a
# NATIVE, editable PowerPoint picture at its exact rect — not baked into the
# PNG. The picture lands on the same getBoundingClientRect coordinates as the
# now-native text, so an icon sitting beside a heading stays aligned with it.
# (Full-bleed slide backgrounds are CSS `background-image` on a div, not <img>,
# so they are NOT picked up here — they stay in the PNG as intended.)
EXTRACT_IMAGES_JS = r"""
() => {
  const out = [];
  let id = 0;
  for (const img of document.querySelectorAll('img')) {
    let vis = true;
    for (let e = img; e; e = e.parentElement) {
      const cs = window.getComputedStyle(e);
      if (cs.display === 'none' || cs.visibility === 'hidden' ||
          parseFloat(cs.opacity || '1') === 0) { vis = false; break; }
    }
    if (!vis) continue;
    const r = img.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) continue;
    const eid = 'pptx-img-' + (++id);
    img.setAttribute('data-img-extract', eid);
    out.push({ id: eid, src: img.currentSrc || img.src || '',
               x: r.x, y: r.y, w: r.width, h: r.height });
  }
  return out;
}
"""

HIDE_IMAGES_JS = r"""
() => {
  let n = 0;
  for (const el of document.querySelectorAll('[data-img-extract]')) {
    el.style.setProperty('visibility', 'hidden', 'important');
    n++;
  }
  return n;
}
"""

# --- JS payload — native PLACEHOLDER SHAPE extraction ----------------------
# A client-logo placeholder (the dashed box on the two-logo cover) must be a
# NATIVE, selectable/deletable shape — NOT baked into the PNG. Baked, the small
# real logo can't cleanly cover the much larger dashed box + hint text. We emit
# each empty placeholder as a native rectangle (dashed outline, no fill, centred
# hint text) and hide the source div from the screenshot. If the placeholder
# already holds a client <img>, we skip it — the image pipeline handles it.
EXTRACT_SHAPES_JS = r"""
() => {
  const out = [];
  let id = 0;
  const sel = '.cover2-clientlogo, [data-pptx-placeholder]';
  for (const el of document.querySelectorAll(sel)) {
    let vis = true;
    for (let e = el; e; e = e.parentElement) {
      const cs = window.getComputedStyle(e);
      if (cs.display === 'none' || cs.visibility === 'hidden' ||
          parseFloat(cs.opacity || '1') === 0) { vis = false; break; }
    }
    if (!vis) continue;
    if (el.querySelector('img')) continue;   // real logo supplied → image pipeline
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) continue;
    const cs = window.getComputedStyle(el);
    const eid = 'pptx-shape-' + (++id);
    el.setAttribute('data-shape-extract', eid);
    out.push({ id: eid, x: r.x, y: r.y, w: r.width, h: r.height,
               text: (el.textContent || '').trim(),
               borderColor: cs.borderTopColor || 'rgb(112, 116, 119)',
               borderWidthPx: parseFloat(cs.borderTopWidth) || 1,
               dashed: cs.borderTopStyle === 'dashed',
               fontSize: parseFloat(cs.fontSize) || 18.667,
               color: cs.color || 'rgb(112, 116, 119)' });
  }
  return out;
}
"""

HIDE_SHAPES_JS = r"""
() => {
  let n = 0;
  for (const el of document.querySelectorAll('[data-shape-extract]')) {
    el.style.setProperty('visibility', 'hidden', 'important');
    n++;
  }
  return n;
}
"""


def _downscale_raster(path: Path, out_dir: Path, stem: str) -> str:
    """Cap a raster at the 1920px canvas edge; re-encode (JPEG q90 if opaque,
    else PNG). Kit content photos ship at 2880px (1.5× the canvas) — pointless
    weight for a 1920 slide. Returns the ORIGINAL path when already within cap."""
    try:
        from PIL import Image as _PILImage
        im = _PILImage.open(path)
        w, h = im.size
        if max(w, h) <= CANVAS_W_PX:
            im.close()
            return str(path)
        scale = CANVAS_W_PX / max(w, h)
        im = im.resize((max(1, round(w * scale)), max(1, round(h * scale))),
                       _PILImage.LANCZOS)
        alpha = im.mode in ("RGBA", "LA") and im.getchannel("A").getextrema()[0] < 250
        if alpha:
            out = out_dir / f"{stem}-dsc.png"
            im.save(out, format="PNG", optimize=True)
        else:
            out = out_dir / f"{stem}-dsc.jpg"
            im.convert("RGB").save(out, format="JPEG", quality=90, optimize=True)
        im.close()
        return str(out)
    except Exception as e:
        sys.stderr.write(f"export-pptx.py: raster downscale skipped for {path.name}: {e}\n")
        return str(path)


def _resolve_img_png(src: str, w_px: float, h_px: float, out_dir: Path,
                     stem: str, context) -> str | None:
    """Resolve an <img> source to a path for embedding.

    - raster (png/jpg/jpeg/webp/gif): use the source file, downscaled to the
      1920px canvas edge (re-encoded) when it is larger.
    - svg: rasterise the file ALONE on a transparent page at the displayed size
      ×1.5 (so the icon never picks up the slide background behind it). Rendered in
      a NEW page of the SAME browser `context` — never a nested sync_playwright.
    Returns a filesystem path, or None if it can't be resolved.
    """
    if src.startswith("file://"):
        from urllib.parse import unquote, urlparse
        path = Path(unquote(urlparse(src).path))
    elif src.startswith("data:"):
        return None  # inline data URIs are rare in the kit; skip → stays baked
    else:
        path = Path(src)
    if not path.is_file():
        return None
    if path.suffix.lower() != ".svg":
        return _downscale_raster(path, out_dir, stem)  # cap ≤1920px longest edge
    try:
        W, H = max(int(round(w_px * 1.5)), 2), max(int(round(h_px * 1.5)), 2)
        svg = path.read_text(encoding="utf-8")
        out = out_dir / f"{stem}.png"
        pg = context.new_page()
        try:
            pg.set_viewport_size({"width": W, "height": H})
            pg.set_content(
                f'<!doctype html><html><body style="margin:0;background:transparent">'
                f'<div style="width:{W}px;height:{H}px">{svg}</div></body></html>'
            )
            pg.evaluate(
                "([w,h])=>{const s=document.querySelector('svg');"
                "if(s){s.setAttribute('width',w);s.setAttribute('height',h);}}",
                [W, H],
            )
            pg.screenshot(path=str(out), omit_background=True,
                          clip={"x": 0, "y": 0, "width": W, "height": H})
        finally:
            pg.close()
        return str(out)
    except Exception as e:
        sys.stderr.write(f"export-pptx.py: svg raster failed for {path.name}: {e}\n")
        return None


def render_slide(page, slide_file: Path, png_path: Path):
    """Open a slide HTML, extract native text runs + tables + images, hide them
    all, and screenshot the remaining decorations.

    Part 55/56: ALL text blocks are extracted as native multi-run textboxes and
    ALL <img>s as native pictures; both are hidden before the screenshot, so the
    PNG carries only decorations / gradients / full-bleed backgrounds. Returns
    (text_nodes, tables, images).
    """
    url = f"file://{slide_file.resolve()}"
    # `load` waits for every sub-resource (CSS, background/icon images) so the
    # screenshot and getBoundingClientRect() see the finished layout — without
    # networkidle's mandatory ~500 ms idle wait per slide. Fonts awaited
    # explicitly so text-node metrics match the rendered glyphs.
    page.goto(url, wait_until="load")
    try:
        page.evaluate("() => (document.fonts && document.fonts.ready) || null")
    except Exception:
        pass
    # Force native scale = 1 so getBoundingClientRect() returns 1920×1080 px.
    page.evaluate(
        "() => { const s = document.querySelector('.slide'); "
        "if (s) s.style.setProperty('--slide-scale', '1'); }"
    )
    page.set_viewport_size({"width": CANVAS_W_PX, "height": CANVAS_H_PX})

    # 1. Extract native text runs (Part 55) + tables (Part 50) + images (Part 56)
    #    + placeholder shapes (native dashed boxes).
    nodes = page.evaluate(EXTRACT_JS)
    tables = page.evaluate(EXTRACT_TABLES_JS)
    images_meta = page.evaluate(EXTRACT_IMAGES_JS)
    shapes = page.evaluate(EXTRACT_SHAPES_JS)

    # 1b. Resolve each <img> to an embeddable PNG (raster as-is; svg rasterised).
    images: list[dict] = []
    for im in images_meta:
        png = _resolve_img_png(
            im.get("src", ""), im["w"], im["h"],
            png_path.parent, png_path.stem + "-" + im["id"], page.context,
        )
        if png:
            images.append({**im, "png": png})

    # 2. Hide everything we extracted so it does NOT bake into the PNG.
    page.evaluate(HIDE_BLOCKS_JS)
    page.evaluate(HIDE_TABLES_JS)
    page.evaluate(HIDE_IMAGES_JS)
    page.evaluate(HIDE_SHAPES_JS)

    # 3. Screenshot: only decorations / backgrounds remain.
    page.screenshot(
        path=str(png_path),
        clip={"x": 0, "y": 0, "width": CANVAS_W_PX, "height": CANVAS_H_PX},
        full_page=False,
    )

    # Optimize the background/decoration layer. It bakes the full-bleed
    # (photographic / gradient) CSS background, so lossless PNG is ~10× heavier
    # than JPEG. When the capture is fully opaque (a full-bleed bg is present, the
    # common case) re-encode as JPEG q92 — visually lossless, ~10× smaller. Keep
    # PNG only when it carries real transparency. python-pptx picks the format
    # from the header, so writing JPEG bytes into the .png path is fine.
    try:
        from PIL import Image as _PILImage
        im = _PILImage.open(png_path)
        opaque = im.mode != "RGBA" or im.getchannel("A").getextrema()[0] >= 250
        if opaque:
            im.convert("RGB").save(png_path, format="JPEG", quality=92, optimize=True)
        im.close()
    except Exception as e:
        sys.stderr.write(f"export-pptx.py: bg optimize skipped ({e})\n")

    return nodes, tables, images, shapes


# --- PPTX assembly ----------------------------------------------------------
# Part 23 colour parser — extracts RGB from CSS rgb() / rgba() strings and
# returns a python-pptx RGBColor. Used to render native text shapes with
# kit-correct colour, replacing the Part 17 alpha=0 invisible-overlay hack.
_RGB_RE = re.compile(r"rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)")


def parse_color(s: str | None) -> RGBColor:
    """Parse a CSS colour ('rgb(r, g, b)' / 'rgba(r, g, b, a)') to RGBColor.

    Falls back to white if parsing fails. Alpha channel is ignored (PPTX
    text alpha layering creates edit-time surprises; opacity belongs on
    the textbox / shape, not the run).
    """
    if not s:
        return RGBColor(0xFF, 0xFF, 0xFF)
    m = _RGB_RE.match(s)
    if not m:
        return RGBColor(0xFF, 0xFF, 0xFF)
    r, g, b = (int(float(x)) for x in m.groups())
    return RGBColor(r, g, b)


def px_to_emu(px: float) -> int:
    return int(round(px * EMU_PER_PX))


# --- Native table helpers (Part 50) -----------------------------------------
# "No Style, No Grid" built-in table style — strips PowerPoint's default
# banding / header fills / borders so the kit's explicit per-cell fills and
# 1px black grid render exactly, with no blue default theming fighting them.
_NO_STYLE_NO_GRID = "{2D5ABB26-0587-4C30-8999-92F81FD0307C}"
# Kit grid is 1px black. A faithful 1px → 0.667pt, but PowerPoint renders
# sub-point borders as an unreliable hairline that often reads as "missing"
# (user report). Use 1pt (12700 EMU) — a crisp, clearly-visible thin divider
# that still matches the kit's light internal-grid look.
_BORDER_W_EMU = 12700  # 1.0pt


def _strip_table_style(table) -> None:
    """Apply 'No Style, No Grid' and disable first-row / banding theming."""
    try:
        table.first_row = False
        table.last_row = False
        table.horz_banding = False
        table.vert_banding = False
    except Exception:
        pass
    tblPr = table._tbl.tblPr
    for el in tblPr.findall(qn("a:tableStyleId")):
        tblPr.remove(el)
    sid = tblPr.makeelement(qn("a:tableStyleId"), {})
    sid.text = _NO_STYLE_NO_GRID
    tblPr.append(sid)


def _set_cell_borders(cell, edges: set[str]) -> None:
    """Draw a 1px black line on each edge in `edges` (subset of L/R/T/B);
    every other edge is explicitly noFill. Lines are inserted at the front of
    <a:tcPr> in schema order (lnL, lnR, lnT, lnB) so they precede the fill."""
    tcPr = cell._tc.get_or_add_tcPr()
    # Remove any existing line elements first.
    for tag in ("a:lnL", "a:lnR", "a:lnT", "a:lnB"):
        for el in tcPr.findall(qn(tag)):
            tcPr.remove(el)
    # Build B, T, R, L and insert each at index 0 → final order L, R, T, B.
    for tag, key in (("a:lnB", "B"), ("a:lnT", "T"),
                     ("a:lnR", "R"), ("a:lnL", "L")):
        ln = tcPr.makeelement(qn(tag), {
            "w": str(_BORDER_W_EMU), "cap": "flat", "cmpd": "sng", "algn": "ctr",
        })
        if key in edges:
            sf = ln.makeelement(qn("a:solidFill"), {})
            clr = sf.makeelement(qn("a:srgbClr"), {"val": "000000"})
            sf.append(clr)
            ln.append(sf)
            dash = ln.makeelement(qn("a:prstDash"), {"val": "solid"})
            ln.append(dash)
        else:
            ln.append(ln.makeelement(qn("a:noFill"), {}))
        tcPr.insert(0, ln)


_ALIGN_MAP = {"center": PP_ALIGN.CENTER, "right": PP_ALIGN.RIGHT,
              "justify": PP_ALIGN.JUSTIFY, "left": PP_ALIGN.LEFT}


def add_native_table(slide, t: dict) -> None:
    """Emit one kit `.sheet` as a native, editable PPTX table."""
    nrows = len(t["rows"])
    ncols = int(t["ncols"])
    if nrows == 0 or ncols == 0:
        return
    gf = slide.shapes.add_table(
        nrows, ncols,
        left=px_to_emu(t["x"]), top=px_to_emu(t["y"]),
        width=px_to_emu(t["w"]), height=px_to_emu(t["h"]),
    )
    table = gf.table
    _strip_table_style(table)

    # Column widths from the measured grid.
    col_widths = t.get("colWidths") or []
    for ci in range(ncols):
        if ci < len(col_widths) and col_widths[ci] > 0:
            table.columns[ci].width = px_to_emu(col_widths[ci])

    is_plan = bool(t.get("isPlan"))
    for ri, row in enumerate(t["rows"]):
        if row.get("height", 0) > 0:
            table.rows[ri].height = px_to_emu(row["height"])
        cells = row.get("cells", [])
        for ci in range(ncols):
            cell = table.cell(ri, ci)
            data = cells[ci] if ci < len(cells) else None

            # Fill (solid). Empty/missing cell → white.
            cell.fill.solid()
            cell.fill.fore_color.rgb = parse_color(
                data["bg"] if data else "rgb(255,255,255)"
            )

            # 1px black grid. CRITICAL: a PowerPoint table gridline is SHARED
            # between two cells; if one side is noFill the line is suppressed
            # even when the neighbour's side is solid (the "invisible border"
            # bug). So we set BOTH sides of every internal edge: a cell gets a
            # solid border on each side that touches a NON-perimeter edge
            # (left if ci>0, right if ci<last, top if ri>0, bottom if ri<last).
            # That paints both adjacent cells of each internal line → it always
            # renders, with no outer border (matches the kit's internal grid).
            # `.sheet--plan` additionally wants the outer border → full grid.
            edges: set[str] = set()
            if ci > 0:
                edges.add("L")
            if ci < ncols - 1:
                edges.add("R")
            if ri > 0:
                edges.add("T")
            if ri < nrows - 1:
                edges.add("B")
            if is_plan:
                edges = {"L", "R", "T", "B"}  # full grid incl. outer border
            _set_cell_borders(cell, edges)

            # Text + typography. Match the kit: top-anchored, padding as
            # cell margins, Arial, exact size/colour/weight/alignment.
            tf = cell.text_frame
            tf.word_wrap = True
            cell.vertical_anchor = MSO_ANCHOR.TOP
            pad_top = (data.get("padTop", 18) if data else 18)
            pad_left = (data.get("padLeft", 10) if data else 10)
            cell.margin_top = px_to_emu(pad_top)
            cell.margin_bottom = px_to_emu(max(pad_top - 8, 4))
            cell.margin_left = px_to_emu(pad_left)
            cell.margin_right = px_to_emu(pad_left)

            para = tf.paragraphs[0]
            para.alignment = _ALIGN_MAP.get(
                (data.get("align") if data else "left"), PP_ALIGN.LEFT
            )
            run = para.add_run()
            run.text = data["text"] if data else ""
            run.font.name = "Arial"
            fs = (data.get("fontSize", 21) if data else 21)
            run.font.size = Pt(fs * PX_TO_PT)
            run.font.bold = bool(data.get("bold")) if data else False
            run.font.color.rgb = parse_color(
                data["color"] if data else "rgb(0,0,0)"
            )


# --- Branded base template (DataArt slide master + grid layouts) ------------
# The exporter loads `<kit>/pptx/dataart-corporate-template.pptx` as its base so
# every deck carries the DataArt slide master + reusable grid layouts (Cover,
# Section, Content 1/2/3/4-col, …) in PowerPoint's Layout menu — built once by
# `build-master-template.py`. Baked slides go on the empty "Export Carrier
# (Blank)" layout so the rich layouts' placeholders never bleed under the PNG.
# If the template can't be resolved we fall back to the stock python-pptx
# template (graceful — same behaviour as before this feature).
CARRIER_LAYOUT_NAME = "DataArt — Export Carrier (Blank)"


def resolve_template() -> Path | None:
    """Locate the branded template via DECK_KIT_ROOT / find-kit.sh / ancestor walk."""
    import subprocess

    script_dir = Path(__file__).resolve().parent
    rel = Path("pptx") / "dataart-corporate-template.pptx"

    env = os.environ.get("DECK_KIT_ROOT")
    if env and (Path(env) / rel).is_file():
        return Path(env) / rel

    find = script_dir / "find-kit.sh"
    if find.is_file():
        try:
            out = subprocess.run(
                ["bash", str(find)], capture_output=True, text=True, timeout=20
            )
            if out.returncode == 0 and out.stdout.strip():
                cand = Path(out.stdout.strip()) / rel
                if cand.is_file():
                    return cand
        except Exception:
            pass

    for parent in [script_dir, *script_dir.parents]:
        cand = parent / "kit-corporate" / rel
        if cand.is_file():
            return cand
    return None


def _base_presentation():
    """Return (presentation, carrier_layout) — branded template if available,
    else the stock template's Blank layout."""
    tmpl = resolve_template()
    if tmpl is not None:
        prs = Presentation(str(tmpl))
        prs.slide_width = SLIDE_W_EMU
        prs.slide_height = SLIDE_H_EMU
        for lay in prs.slide_masters[0].slide_layouts:
            if lay.name == CARRIER_LAYOUT_NAME:
                sys.stdout.write(f"  base: branded template ({tmpl.name})\n")
                return prs, lay
        sys.stderr.write(
            "export-pptx.py: branded template found but carrier layout missing; "
            "using its Blank layout\n"
        )
        return prs, prs.slide_layouts[6]

    sys.stdout.write("  base: stock template (branded template not found)\n")
    prs = Presentation()
    prs.slide_width = SLIDE_W_EMU
    prs.slide_height = SLIDE_H_EMU
    return prs, prs.slide_layouts[6]


def assemble_pptx(
    slide_pngs: list[tuple[Path, list[dict], list[dict], list[dict], list[dict]]],
    output_path: Path,
) -> None:
    prs, carrier_layout = _base_presentation()

    for png_path, text_nodes, tables, images, shapes in slide_pngs:
        slide = prs.slides.add_slide(carrier_layout)
        # Full-bleed text-less, image-less background (Part 55/56: text + <img>s
        # were hidden via DOM mutation before the screenshot, so the PNG carries
        # only decorations / gradients / full-bleed backgrounds).
        slide.shapes.add_picture(
            str(png_path),
            left=0,
            top=0,
            width=SLIDE_W_EMU,
            height=SLIDE_H_EMU,
        )
        # Native placeholder shapes (e.g. the client-logo box on the two-logo
        # cover): a dashed, no-fill rectangle with centred hint text — selectable
        # and deletable so a much smaller real logo can replace it cleanly,
        # instead of trying to cover a baked-in PNG box.
        for sh in (shapes or []):
            try:
                rect = slide.shapes.add_shape(
                    MSO_SHAPE.RECTANGLE,
                    px_to_emu(sh["x"]), px_to_emu(sh["y"]),
                    px_to_emu(sh["w"]), px_to_emu(sh["h"]),
                )
                rect.fill.background()                 # transparent — no fill
                try:
                    rect.shadow.inherit = False
                except Exception:
                    pass
                ln = rect.line
                ln.color.rgb = parse_color(sh.get("borderColor"))
                ln.width = Pt(max(sh.get("borderWidthPx", 1), 1) * PX_TO_PT)
                if sh.get("dashed"):
                    lnEl = ln._get_or_add_ln()
                    for d in lnEl.findall(qn("a:prstDash")):
                        lnEl.remove(d)
                    lnEl.append(lnEl.makeelement(qn("a:prstDash"), {"val": "dash"}))
                tf = rect.text_frame
                tf.word_wrap = True
                tf.margin_left = tf.margin_right = Emu(0)
                tf.margin_top = tf.margin_bottom = Emu(0)
                try:
                    tf.vertical_anchor = MSO_ANCHOR.MIDDLE
                except Exception:
                    pass
                para = tf.paragraphs[0]
                para.alignment = PP_ALIGN.CENTER
                run = para.add_run()
                run.text = sh.get("text") or ""
                run.font.name = "Arial"
                run.font.size = Pt(sh.get("fontSize", 18.667) * PX_TO_PT)
                run.font.color.rgb = parse_color(sh.get("color"))
            except Exception as e:
                sys.stderr.write(
                    f"export-pptx.py: dropped placeholder shape: {e}\n"
                )
        # Native editable pictures (Part 56) — icons / logos / illustrations at
        # their exact rect, under the text so an icon stays aligned beside the
        # heading it accompanies.
        for im in (images or []):
            try:
                slide.shapes.add_picture(
                    im["png"],
                    left=px_to_emu(im["x"]), top=px_to_emu(im["y"]),
                    width=px_to_emu(im["w"]), height=px_to_emu(im["h"]),
                )
            except Exception as e:
                sys.stderr.write(
                    f"export-pptx.py: dropped image {im.get('id')}: {e}\n"
                )
        # Native editable text shapes — visible text with kit-correct
        # typography on top of the text-less PNG. Edits in PowerPoint /
        # Keynote work immediately (no invisible-overlay trick).
        #
        # Part 30 width + height buffers: extracted rect dimensions come
        # from Chromium's Arial metrics. PowerPoint Arial glyphs measure
        # slightly wider (~3-5%) → titles like "Consistent" that fit at
        # 372px in Chromium need ~390px in PowerPoint → text wraps last
        # letter onto new line → wrapped letter clips below the original
        # single-line textbox height. Add 10% width slop (prevents most
        # wraps caused by metric drift) AND 1.5× height slop (catches
        # one-line wrap-to-two-lines cases without visual overlap into
        # next slot — slack is invisible whitespace at top of textbox).
        WIDTH_SLOP = 1.10
        HEIGHT_SLOP = 1.50
        for node in text_nodes:
            tb = None
            try:
                # Part 26: clamp width to the nearest sized `.layer`
                # ancestor's right edge. The 10% WIDTH_SLOP is meant to
                # absorb Chromium-vs-PowerPoint Arial metric drift, but
                # for blocks inside adjacent columns (info-block triplets
                # on slides 7/8/10, etc.) the slop pushes a textbox past
                # the column boundary and into the next column. The
                # clamp prevents that — PowerPoint wraps long text
                # inside the column instead.
                target_w_px = node["w"] * WIDTH_SLOP
                layer_max = node.get("layerMaxW")
                if layer_max is not None and layer_max > 0:
                    target_w_px = min(target_w_px, layer_max)
                # Part 57 — hard safe-zone clamp. WIDTH_SLOP (and the absence of a
                # `.layer` clamp for a block that IS its own full-width layer)
                # could push the textbox right edge past the kit's right margin
                # and even off the slide ("decades." touching the edge). Never
                # let any textbox cross the content safe zone's right edge.
                room_to_safe = SAFE_RIGHT_PX - node["x"]
                if room_to_safe > 0:
                    target_w_px = min(target_w_px, room_to_safe)

                tb = slide.shapes.add_textbox(
                    left=px_to_emu(node["x"]),
                    top=px_to_emu(node["y"]),
                    width=max(px_to_emu(target_w_px), Emu(1)),
                    height=max(px_to_emu(node["h"] * HEIGHT_SLOP), Emu(1)),
                )
                tf = tb.text_frame
                tf.margin_left = tf.margin_right = Emu(0)
                tf.margin_top = tf.margin_bottom = Emu(0)
                # Part 26/55/60 — reproduce Chromium's EXACT line breaks. When
                # every paragraph carries measured visual `lines`, emit ONE PPTX
                # paragraph per line with word-wrap OFF, so PowerPoint's wider
                # Arial metrics cannot re-wrap the text — the root cause of a box
                # overflowing, a word clipping ("Design" -> "Desig"), or a label
                # jumping to 2 lines onto its icon. Fallback (no measured lines):
                # the original single-paragraph runs path with word_wrap on.
                # Each inline run keeps its own size/weight/colour/italic/underline,
                # so mixed-weight/colour text stays native + editable.
                paragraphs = node.get("paragraphs") or []
                is_list = bool(node.get("isList"))

                # Line-height as absolute Pt (Part 37): PowerPoint's float
                # line_spacing is a font-metric multiple that inflates leading;
                # absolute Pt matches CSS pixel-for-pixel.
                line_height_ratio = node.get("lineHeightRatio", 1.2)
                base_spacing = Pt(node["fontSize"] * PX_TO_PT * line_height_ratio)

                use_lines = bool(paragraphs) and all(pp.get("lines") for pp in paragraphs)
                tf.word_wrap = not use_lines
                if use_lines:
                    from pptx.enum.text import MSO_AUTO_SIZE
                    try:
                        tf.auto_size = MSO_AUTO_SIZE.NONE
                    except Exception:
                        pass

                def _emit_line(p, line_runs, prefix):
                    if prefix and line_runs:
                        pr = p.add_run()
                        pr.text = prefix
                        pr.font.name = "Arial"
                        pr.font.size = Pt(line_runs[0]["sizePx"] * PX_TO_PT)
                        pr.font.color.rgb = parse_color(line_runs[0].get("color"))
                    for r in line_runs:
                        run = p.add_run()
                        run.text = r["text"]
                        # Force Arial — the kit's only typeface; the browser
                        # font stack ('Arial, "Helvetica Neue", …') makes
                        # PowerPoint fall back to Calibri and drift.
                        run.font.name = "Arial"
                        run.font.size = Pt(r["sizePx"] * PX_TO_PT)
                        run.font.bold = bool(int(r.get("weight", 400)) >= 600)
                        run.font.italic = bool(r.get("italic"))
                        run.font.underline = bool(r.get("underline"))
                        run.font.color.rgb = parse_color(r.get("color"))

                _first = True
                for pi, para in enumerate(paragraphs):
                    prefix = para.get("prefix") or ""
                    seq = para["lines"] if use_lines else [para.get("runs") or []]
                    last_para = pi == len(paragraphs) - 1
                    for li, line_runs in enumerate(seq):
                        p = tf.paragraphs[0] if _first else tf.add_paragraph()
                        _first = False
                        p.line_spacing = base_spacing
                        # Inter-item gap AFTER the LI's last visual line = the LI's
                        # ACTUAL css margin-bottom (px→pt), not a hardcoded value. A
                        # zero-margin list (`.steps-list`) gets no gap, so its baked
                        # height matches the HTML and never overruns its panel.
                        if is_list and not last_para and li == len(seq) - 1:
                            gap_px = para.get("gapAfter") or 0
                            if gap_px > 0:
                                p.space_after = Pt(gap_px * PX_TO_PT)
                        _emit_line(p, line_runs, prefix if li == 0 else "")
            except Exception as e:
                # Per-node failure should not kill the whole export — remove the
                # half-built textbox so no orphan empty shape ships.
                if tb is not None:
                    try:
                        slide.shapes._spTree.remove(tb._element)
                    except Exception:
                        pass
                _preview = ""
                try:
                    _preview = node["paragraphs"][0]["runs"][0]["text"][:30]
                except Exception:
                    pass
                sys.stderr.write(
                    f"export-pptx.py: dropped textbox for {_preview!r}: {e}\n"
                )
                continue

        # Native editable tables (Part 50) — emitted on top of the PNG, in
        # the area where the `.sheet` was hidden before the screenshot.
        for tbl in (tables or []):
            try:
                add_native_table(slide, tbl)
            except Exception as e:
                sys.stderr.write(
                    f"export-pptx.py: dropped table {tbl.get('extractId')}: {e}\n"
                )
                continue

    prs.save(str(output_path))


# --- Verification (lightweight) ---------------------------------------------
def verify_pptx(path: Path, expected_slide_count: int) -> None:
    import zipfile

    if not zipfile.is_zipfile(str(path)):
        raise RuntimeError(f"{path} is not a valid zip / PPTX")
    with zipfile.ZipFile(str(path)) as zf:
        media = [n for n in zf.namelist() if n.startswith("ppt/media/")]
        if len(media) < expected_slide_count:
            raise RuntimeError(
                f"{path}: expected ≥ {expected_slide_count} media entries, "
                f"got {len(media)}"
            )
    # Re-parse — catches XML corruption.
    Presentation(str(path))


# --- Driver -----------------------------------------------------------------
def main() -> int:
    ap = argparse.ArgumentParser(description="Hybrid HTML→PPTX exporter")
    ap.add_argument("deck_dir", type=Path)
    ap.add_argument("--output", type=Path, default=None)
    ap.add_argument(
        "--server-url",
        default=None,
        help="(unused — we open file:// URLs directly; reserved)",
    )
    args = ap.parse_args()

    deck_dir: Path = args.deck_dir.resolve()
    if not deck_dir.is_dir():
        sys.stderr.write(f"export-pptx.py: {deck_dir} is not a directory\n")
        return 2

    slides = discover_slides(deck_dir)
    if not slides:
        sys.stderr.write(
            f"export-pptx.py: no slide-NN-*.html files in {deck_dir}\n"
        )
        return 3

    output: Path = args.output or (deck_dir / f"{deck_dir.name}.pptx")

    tmp_dir = Path(tempfile.mkdtemp(prefix="export-pptx-"))
    try:
        slide_pngs: list[tuple[Path, list[dict], list[dict], list[dict], list[dict]]] = []
        with sync_playwright() as p:
            try:
                browser = p.chromium.launch()
            except Exception as e:
                sys.stderr.write(
                    "export-pptx.py: cannot launch chromium. "
                    "Run:  playwright install chromium\n"
                    f"Underlying error: {e}\n"
                )
                return 1
            context = browser.new_context(
                viewport={"width": CANVAS_W_PX, "height": CANVAS_H_PX},
                device_scale_factor=1.0,
            )
            page = context.new_page()
            for slide_file in slides:
                png_path = tmp_dir / (slide_file.stem + ".png")
                try:
                    nodes, tables, images, shapes = render_slide(page, slide_file, png_path)
                except Exception as e:
                    sys.stderr.write(
                        f"export-pptx.py: failed to render {slide_file.name}: {e}\n"
                    )
                    browser.close()
                    return 4
                slide_pngs.append((png_path, nodes, tables, images, shapes))
                sys.stdout.write(
                    f"  rendered {slide_file.name} → "
                    f"{len(nodes)} text nodes, {len(tables)} table(s), "
                    f"{len(images)} image(s), {len(shapes)} shape(s)\n"
                )
            browser.close()

        try:
            assemble_pptx(slide_pngs, output)
        except Exception as e:
            sys.stderr.write(f"export-pptx.py: assembly failed: {e}\n")
            return 5

        try:
            verify_pptx(output, expected_slide_count=len(slides))
        except Exception as e:
            sys.stderr.write(f"export-pptx.py: verify failed: {e}\n")
            return 5

        size_kb = output.stat().st_size // 1024
        sys.stdout.write(
            f"\nexport-pptx: wrote {output} ({size_kb} KB, "
            f"{len(slides)} slide{'s' if len(slides) != 1 else ''})\n"
        )
        return 0
    finally:
        shutil.rmtree(tmp_dir, ignore_errors=True)


if __name__ == "__main__":
    sys.exit(main())
