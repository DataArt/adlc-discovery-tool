#!/usr/bin/env python3
"""
check-copy-budget.py  —  PRE-WRITE content-budget gate.

Run it on the drafted copy BEFORE materializing/writing slides. It flags any
string that exceeds the kit-map § 7 content budget for its slot, so over-long
copy is trimmed up front instead of caught later via verify → fix → re-verify.
Same budgets the rendered slide would break on; this just catches them earlier.

Input: a JSON array on stdin (or a file path arg), each item:
    {"slide": "03", "kind": "<budget-key>", "text": "..."}
`slide` is just a label. Unknown `kind` → reported, not failed.

    echo '[{"slide":"03","kind":"nc-title","text":"Protect the Supply Chain"}]' \
      | python3 scripts/check-copy-budget.py

Budget keys (max characters):
  heading / heading-1line  50   slide heading, one line
  heading-2line           100   slide heading wrapping to two lines
  cover-heading            70   cover H0
  divider-heading          55   section-divider H1
  statement-heading        80   statement H0 (1003px block)
  nc-title                 18   numbered-card title (40px) — keep ≤2 words
  nc-body                 140   numbered-card body
  cols3-title              24   40px card title at cols-3 (382px)
  cols5-title              16   40px card title at cols-5 (217px)
  ib-title                 30   icon-block title (28px)
  ib-text                 160   icon-block / stacked-list description (21px)
  compare-head             30   comparison column head (28px)
  compare-item-head        40   comparison item sub-head (18px bold)
  compare-item-text       140   comparison item body (16px)
  pipe-step                12   pipeline step label at ≥6 steps (one short word)
  pipe-step-wide           22   pipeline step label at ≤4 steps
  caption                 110   two-column summary caption (589px @21px)
  ff-label                 24   fast-fact label (20px, e.g. "NSP Score in 2025")

Exit: 0 all within budget · 1 bad input · 2 one or more over budget.
"""
from __future__ import annotations
import json
import sys

# Char limits are for the 1920-native ×4/3 type scale (boxes unchanged, fonts
# grew ×4/3, so ~0.75× the old base-mode char counts fit per box).
BUDGET = {
    "heading": 37, "heading-1line": 37, "heading-2line": 75,
    "cover-heading": 52, "divider-heading": 41, "statement-heading": 60,
    "nc-title": 13, "nc-body": 105,
    "cols3-title": 18, "cols5-title": 12,
    "ib-title": 22, "ib-text": 120,
    "compare-head": 22, "compare-item-head": 30, "compare-item-text": 105,
    "pipe-step": 9, "pipe-step-wide": 16,
    "caption": 82, "ff-label": 18,
}


def main() -> int:
    raw = (open(sys.argv[1], encoding="utf-8").read() if len(sys.argv) > 1
           else sys.stdin.read())
    try:
        items = json.loads(raw)
        assert isinstance(items, list)
    except Exception as e:
        sys.stderr.write(f"check-copy-budget: bad JSON input ({e}). "
                         "Expected a JSON array of {slide,kind,text}.\n")
        return 1

    over, unknown, ok = [], [], 0
    for it in items:
        kind = str(it.get("kind", "")).strip()
        text = str(it.get("text", ""))
        slide = str(it.get("slide", "?"))
        n = len(text.strip())
        if kind not in BUDGET:
            unknown.append((slide, kind))
            continue
        limit = BUDGET[kind]
        if n > limit:
            over.append((slide, kind, n, limit, text.strip()[:60]))
        else:
            ok += 1

    for s, k in unknown:
        print(f"  ?  slide {s}: unknown budget key '{k}' (skipped)")
    if over:
        print(f"OVER BUDGET — {len(over)} field(s) need trimming "
              f"({ok} within budget):")
        for s, k, n, lim, snip in over:
            print(f"  ✗ slide {s}  {k}: {n} chars > {lim}  «{snip}…»")
        print("Trim these (or move to a wider layout / fewer columns) BEFORE "
              "materializing — see kit-map § 7.")
        return 2
    print(f"check-copy-budget: all {ok} field(s) within budget ✓")
    return 0


if __name__ == "__main__":
    sys.exit(main())
