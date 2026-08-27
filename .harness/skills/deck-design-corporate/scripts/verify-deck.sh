#!/usr/bin/env bash
# verify-deck.sh <deck-dir>
#
# Cross-slide gate for the Corporate kit (companion to per-slide verify-slide.sh).
#
# Parses every `slide-NN-*.html` in <deck-dir> and reports a per-slide background
# inventory + the cross-slide invariants that still apply in the Corporate kit.
#
# THE ONE HARD GATE = stylesheet links. Every slide MUST link all three shared
# stylesheets (tokens.css + layouts.css + components.css). Linking only tokens.css
# collapses `.slide` to default block flow at runtime (the "Onepark" regression) —
# this is the violation that escalates (exit 2).
#
# Background model NOTE (Corporate kit, kit-map § 4): backgrounds are chosen by
# ROLE, NOT for slide-to-slide variety. The kit deliberately reuses ONE
# `bg-content-*` per section across all its content slides, and draws title
# backgrounds from fixed pools (bg-title-03/04/05 = cover, 03/05 = final [04
# forbidden on final] · 01/02/06 = section dividers). So consecutive
# same-background runs are EXPECTED and correct
# here — the legacy "anti-streak / palette-diversity / L1↔column" checks do NOT
# apply. They are still computed below but reported as INFORMATIONAL only (never
# escalate), so this gate never false-fails a correctly-composed Corporate deck.
#
# LAYOUT-VARIETY report (also INFORMATIONAL): backgrounds stay constant per
# section, but the LAYOUT should rotate so a section doesn't read as the same
# grid N times. We classify each slide's layout family from its component classes
# and report a streak when one CONTENT template repeats > 2 slides in a row. This
# never escalates — it is a prompt to vary the rendering (kit-map § 7), not a gate.
#
# Exit codes:
#   0  passed (stylesheet links complete on every slide)
#   1  bad arguments / no slides found
#   2  stylesheet-link violation (a slide is missing a required shared stylesheet)
#
# Usage:
#   scripts/verify-deck.sh tmp/decks/<deck-name>/

set -euo pipefail

if [ $# -lt 1 ]; then
  echo "usage: verify-deck.sh <deck-dir>" >&2
  exit 1
fi

deck_dir="$1"
if [ ! -d "$deck_dir" ]; then
  echo "verify-deck.sh: not a directory: $deck_dir" >&2
  exit 1
fi

# Collect slide files in numeric order. Use bash 3.2-compatible loop
# (macOS default shell has no `mapfile`).
slides=()
while IFS= read -r f; do
  slides+=("$f")
done < <(find "$deck_dir" -maxdepth 1 -type f -name 'slide-[0-9][0-9]-*.html' | sort)

if [ "${#slides[@]}" -eq 0 ]; then
  echo "verify-deck.sh: no slide-NN-*.html files in $deck_dir" >&2
  exit 1
fi

# Extract L1 class from each slide. The L1 element is the FIRST
# `<div class="layer bg-...` in the document; we take its bg-* class.
python3 - "$deck_dir" "${slides[@]}" <<'PY'
import json
import re
import sys
from pathlib import Path

deck_dir = sys.argv[1]
slide_paths = [Path(p) for p in sys.argv[2:]]

# Match the first <div class="..."> whose class list contains a `bg-*`
# token AND the `layer` token. Captures the bg-* token.
LAYER_RE = re.compile(
    r'<div\s+class="([^"]*\blayer\b[^"]*)"',
    re.IGNORECASE,
)
BG_RE = re.compile(r'\bbg-[a-z0-9-]+\b')

# Column-count check: validate L1 ↔ column-count consistency.
# We just check whether a .col-table exists on the slide and then count
# `<div class="col">` siblings anywhere (the kit only uses that class
# inside .col-table). Avoiding a balanced-tag regex keeps this robust
# against nested <div> markup inside each .col (the previous lazy
# `</div>\s*</div>` regex was undercounting on slides where each col
# contains additional <div> children — bug fix per Part 22).
COL_TABLE_OPEN_RE = re.compile(
    r'<div[^>]*class="[^"]*\bcol-table\b[^"]*"',
    re.IGNORECASE,
)
COL_DIV_RE = re.compile(
    r'<div\s+class="(?:[^"]*\s)?col(?:\s[^"]*)?"',
    re.IGNORECASE,
)

# INFORMATIONAL ONLY (never escalates — see header). Corporate kit reuses one
# content background per section, so same-background runs are expected.
GENERAL_CAP = 99          # effectively disabled (informational streak report)
NARRATIVE_BODY_CAP = 99
NARRATIVE_BODY_L1S = set()

# L1 ↔ column-count consistency does not apply (the Corporate kit has no
# fixed-panel backgrounds; columns are `.cols-N`, which carry their own width).
L1_EXPECTED_COLS = {}

# Background "family" for the informational inventory: title pool vs content
# pool vs cover-light. (Corporate kit, kit-map § 4.)
L1_FAMILY = {
    **{f"bg-title-{n:02d}":   "title"   for n in range(1, 7)},
    **{f"bg-content-{n:02d}": "content" for n in range(1, 9)},
    "bg-cover-light": "cover-light",
    "<none>":         "none",      # plain-white slides (pipeline / next-steps)
}

# Layout-family signature (INFORMATIONAL layout-variety report). A coarse
# classifier from distinctive component classes; order matters (most specific
# first). Its job is to make a repeated visual treatment VISIBLE during
# self-check, not to gate.
LAYOUT_SIGNATURES = [
    ("media",          re.compile(r'\bmedia-frame\b', re.I)),
    ("comparison",     re.compile(r'\bcompare(?:-col|-items)?\b', re.I)),
    ("table",          re.compile(r'\bsheet-row\b', re.I)),
    ("pipeline",       re.compile(r'\bpipe-step\b|\bpipeline\b', re.I)),
    ("timeline",       re.compile(r'\btl-bar\b|\btimeline\b', re.I)),
    ("split",          re.compile(r'\bsplit-(?:left|right)\b', re.I)),
    ("numbered-cards", re.compile(r'\bnumbered-card\b', re.I)),
    ("stats",          re.compile(r'\bfast-fact\b|\bff-number\b', re.I)),
    ("quote",          re.compile(r'\bquote-text\b', re.I)),
    ("icon-grid",      re.compile(r'\bicon-grid\b', re.I)),
    ("icon-list",      re.compile(r'\bicon-block\b', re.I)),
]
# Families that represent a CONTENT layout — a repeat of these is what we report
# (title / divider / free-form slides land in "other" and are not flagged).
CONTENT_LAYOUTS = {"media", "comparison", "table", "pipeline", "timeline",
                   "split", "numbered-cards", "stats", "icon-grid", "icon-list"}
LAYOUT_STREAK_CAP = 2     # report a run of > 2 consecutive identical content layouts


def classify_layout(html):
    for name, rx in LAYOUT_SIGNATURES:
        if rx.search(html):
            return name
    return "other"


# Part 28: stylesheet-link gate. Every slide MUST link all three shared
# stylesheets (tokens + layouts + components). Linking only tokens.css
# (the Onepark deck regression) collapses the slide to default block
# flow at runtime.
LINK_RE = re.compile(r'<link\s+rel="stylesheet"\s+href="([^"]+)"', re.IGNORECASE)
REQUIRED_SHEETS = ("tokens.css", "layouts.css", "components.css")

slides = []
for p in slide_paths:
    html = p.read_text(encoding="utf-8", errors="replace")
    bg_class = None
    for m in LAYER_RE.finditer(html):
        bg_match = BG_RE.search(m.group(1))
        if bg_match:
            bg_class = bg_match.group(0)
            break

    # If the slide has a .col-table, count `<div class="col">` siblings
    # across the whole HTML (the kit only uses that exact class inside
    # .col-table).
    col_count = None
    if COL_TABLE_OPEN_RE.search(html):
        col_count = len(COL_DIV_RE.findall(html))

    # Stylesheet-link gate (Part 28).
    hrefs = LINK_RE.findall(html)
    missing_sheets = [
        s for s in REQUIRED_SHEETS
        if not any(s in h for h in hrefs)
    ]

    slides.append({
        "file": p.name,
        "l1": bg_class or "<none>",
        "layout": classify_layout(html),
        "col_count": col_count,
        "linked_stylesheets": hrefs,
        "missing_stylesheets": missing_sheets,
    })

# Streak check (anti-flat-line).
streak_violations = []
i = 0
while i < len(slides):
    j = i
    while j < len(slides) and slides[j]["l1"] == slides[i]["l1"]:
        j += 1
    run_len = j - i
    l1 = slides[i]["l1"]
    cap = NARRATIVE_BODY_CAP if l1 in NARRATIVE_BODY_L1S else GENERAL_CAP
    if run_len > cap:
        streak_violations.append({
            "l1": l1,
            "run_length": run_len,
            "cap": cap,
            "kind": "narrative_body" if l1 in NARRATIVE_BODY_L1S else "general",
            "slides": [slides[k]["file"] for k in range(i, j)],
        })
    i = j

# Layout-variety streak (INFORMATIONAL — never escalates). Longest run of the
# same CONTENT layout family; report runs longer than the cap so the model can
# rotate the rendering (kit-map § 7) before shipping.
layout_streaks = []
i = 0
while i < len(slides):
    j = i
    while j < len(slides) and slides[j]["layout"] == slides[i]["layout"]:
        j += 1
    run_len = j - i
    fam = slides[i]["layout"]
    if fam in CONTENT_LAYOUTS and run_len > LAYOUT_STREAK_CAP:
        layout_streaks.append({
            "layout": fam,
            "run_length": run_len,
            "slides": [slides[k]["file"] for k in range(i, j)],
        })
    i = j
layout_variety_passed = len(layout_streaks) == 0   # informational only

# Diversity check (Part 20 hard floor: ≥ 3 distinct families for decks ≥ 6).
families_used = sorted({L1_FAMILY.get(s["l1"], "unknown") for s in slides
                        if s["l1"] != "<none>"})
diversity_passed = True
if len(slides) >= 6 and len(families_used) < 3:
    diversity_passed = False

# Column-count consistency (Part 20 § 0.12).
column_mismatches = []
for s in slides:
    expected = L1_EXPECTED_COLS.get(s["l1"])
    if expected is None or s["col_count"] is None:
        continue
    if s["col_count"] not in expected:
        column_mismatches.append({
            "file": s["file"],
            "l1": s["l1"],
            "cols": s["col_count"],
            "expected_cols": sorted(expected),
        })

# Part 28: aggregate stylesheet-link violations.
stylesheet_violations = [
    {"file": s["file"], "missing": s["missing_stylesheets"]}
    for s in slides
    if s["missing_stylesheets"]
]

# Aggregate result. Corporate kit: ONLY the stylesheet-link gate escalates.
# Streak / diversity / column results are INFORMATIONAL (the kit reuses one
# background per section by design — see header note), so they never fail.
escalation = []
if stylesheet_violations:
    escalation.append("stylesheet_links_incomplete")

passed = not escalation

fix_hints = []
if stylesheet_violations:
    fix_hints.append(
        "Every slide MUST link all three shared stylesheets in <head>: "
        "tokens.css + layouts.css + components.css (in that order). "
        "Linking only tokens.css collapses the slide to default block "
        "flow (Onepark regression, Part 28)."
    )
if layout_streaks:
    fix_hints.append(
        "Layout variety (INFORMATIONAL — never blocks): a content layout repeats "
        "> 2 slides in a row. Rotate the rendering within the section — swap a "
        "middle slide for content-comparison / content-stacked-list / "
        "content-text-media (add an image) / content-stats-map / "
        "content-numbered-icon-cards / quote — so the section does not read as the "
        "same grid N times (kit-map § 7). Backgrounds stay one-per-section; only "
        "the layout rotates."
    )

report = {
    "deck_dir": deck_dir,
    "slide_count": len(slides),
    "slides": slides,
    "unique_l1_families": families_used,
    "unique_l1_count": len(families_used),
    "streak_violations": streak_violations,
    "layout_streaks": layout_streaks,
    "layout_variety_passed": layout_variety_passed,
    "l1_diversity_passed": diversity_passed,
    "column_mismatches": column_mismatches,
    "l1_column_consistency_passed": len(column_mismatches) == 0,
    "stylesheet_violations": stylesheet_violations,
    "stylesheet_links_passed": len(stylesheet_violations) == 0,
    "passed": passed,
    "escalation_flags": escalation,
    "fix_hints": fix_hints,
}
print(json.dumps(report, indent=2))
sys.exit(0 if passed else 2)
PY
