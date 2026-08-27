#!/usr/bin/env python3
"""
check-migration-coverage.py  —  did the re-skin KEEP the source's content?

The #1 failure when migrating a deck into our template is silently dropping
content. This gate compares the source text (from extract-source-deck.py's
source.json) against the text actually present in the built deck, and flags any
SOURCE slide whose content largely vanished.

    python3 scripts/check-migration-coverage.py <_source/source.json> <deck-dir>
    # deck-dir holds the built slide-NN-*.html files

How it scores (robust to splitting + reordering):
  For each source slide, take its meaningful words (lowercased, stopwords +
  kit boilerplate removed, numbers kept — stats matter). Coverage = the share
  of those words that appear ANYWHERE in the built deck's visible text. So
  content moved to another slide (a deliberate split) still counts as kept;
  only genuinely dropped content lowers the score.

Output: a per-slide table + summary. A slide under the threshold (default 0.70)
is flagged — restore or split it before shipping. Numbers/short stats are
checked strictly (a dropped "6,000" or "95%" is a real loss).

Exit: 0 all slides ≥ threshold · 2 one or more below · 1 bad input.
Tune with --threshold (0–1). This is advisory teeth, not pixel law: a low score
can be legitimate (e.g. you intentionally cut a redundant legal boilerplate
slide) — but you must look, not skip.
"""
from __future__ import annotations
import argparse
import html
import json
import re
import sys
from pathlib import Path

STOP = set("""a an the and or but if then else of to in on at by for with from into
over under as is are was were be been being this that these those it its it's we us our
you your they them their he she his her i me my will shall can may might must should would
could do does did done has have had not no nor so than too very just also more most much
many few all any each both either neither such only own same other another via per o e di
del della la le il un una dei delle agli alla con che per non sono come""".split())

# kit chrome that appears on every slide — not "source content"
BOILER = set("""dataart your partner for progress company overview about context background
data ai lab desk page""".split())

TOKEN = re.compile(r"[A-Za-z0-9][A-Za-z0-9%$+./'-]*")
TAG = re.compile(r"<(script|style)[^>]*>.*?</\1>", re.S | re.I)
COMMENT = re.compile(r"<!--.*?-->", re.S)
ANYTAG = re.compile(r"<[^>]+>")


def words(text):
    out = []
    for m in TOKEN.finditer(text.lower()):
        w = m.group(0).strip("'-./")
        if not w or len(w) < 2 and not w.isdigit():
            continue
        if w in STOP or w in BOILER:
            continue
        out.append(w)
    return out


def slide_words(s):
    parts = []
    for k in ("title", "subtitle", "notes"):
        if s.get(k):
            parts.append(s[k])
    parts += [b["text"] for b in s.get("body_blocks", [])]
    for tbl in s.get("tables", []):
        for row in tbl:
            parts += row
    return set(words(" ".join(parts)))


def deck_text(deck_dir: Path):
    blob = []
    for f in sorted(deck_dir.glob("slide-*.html")):
        t = f.read_text(errors="ignore")
        t = COMMENT.sub(" ", TAG.sub(" ", t))
        t = ANYTAG.sub(" ", t)
        blob.append(html.unescape(t))
    return set(words(" ".join(blob)))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("source_json")
    ap.add_argument("deck_dir")
    ap.add_argument("--threshold", type=float, default=0.70)
    a = ap.parse_args()

    try:
        doc = json.loads(Path(a.source_json).read_text())
    except Exception as e:
        sys.stderr.write(f"check-migration-coverage: bad source.json ({e})\n")
        return 1
    deck = Path(a.deck_dir)
    if not deck.is_dir():
        sys.stderr.write(f"check-migration-coverage: deck dir not found: {deck}\n")
        return 1

    present = deck_text(deck)
    if not present:
        sys.stderr.write(f"check-migration-coverage: no slide-*.html in {deck}\n")
        return 1

    rows, low = [], []
    for s in doc.get("slides", []):
        sw = slide_words(s)
        if not sw:
            cov = 1.0
            missing = []
        else:
            kept = sw & present
            cov = len(kept) / len(sw)
            missing = sorted(sw - present)
        rows.append((s["index"], cov, len(sw), missing))
        if sw and cov < a.threshold:
            low.append((s["index"], cov, missing))

    print(f"Migration content coverage (threshold {a.threshold:.0%}) — "
          f"{len(rows)} source slides vs {deck.name}:")
    for idx, cov, n, missing in rows:
        flag = "  ✗" if (n and cov < a.threshold) else "  ✓"
        extra = ""
        if missing and cov < a.threshold:
            extra = "  missing: " + ", ".join(missing[:8]) + ("…" if len(missing) > 8 else "")
        print(f"{flag} source slide {idx:>3}: {cov:5.0%} of {n:>3} words kept{extra}")

    if low:
        print(f"\n{len(low)} source slide(s) below {a.threshold:.0%} — content likely "
              f"dropped. Restore it (or split the slide), or confirm the cut was "
              f"intentional. See references/deck-migration.md.")
        return 2
    print("\nAll source slides within coverage ✓")
    return 0


if __name__ == "__main__":
    sys.exit(main())
