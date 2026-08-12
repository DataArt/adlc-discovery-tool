# Patch 0009 — challenges-and-full-loop

## Summary

Merges `docs/Context/02 Problem Statement.md` and `03 Solution.md` into a single
`02 Challenges.md`: 10 challenges, each pairing the problem with "How to address this" in one
place instead of two parallel 150+ line documents. Each of the first 5 (general to any codebase —
Drift, Uneven Depth, Inconsistent Topology, No Feedback Loop, Session Amnesia) is tagged
**the harness (Project Context)**. The next 5 (Legacy Systems Meet AI Barriers, Architecture Is
Fragmenting, Governance Written for the Wrong Threat, Spend Without Attribution, Betting on One
Vendor) were originally drafted from external vertical-specific material and have been fully
reworded and generalized — no industry-specific framing remains. Three of those five are tagged
**wiring Context Topology** or **session observability and dashboards** rather than the harness,
since governance, estate-wide coherence, and spend attribution genuinely sit above a single
project's scope (spend attribution specifically points at instrumentation — e.g. an
engineering-analytics dashboard — not context wiring). Five of the ten diagrams (The Drift,
Session Amnesia, Architecture Is Fragmenting, Legacy Systems Meet AI Barriers, Foundation
Survives — Wiring Fails) were swapped from inline Mermaid to designed PNGs.

Adds `03 The Full Loop.md` (marked draft) — not about any one engagement, the picture of what
"ADLC fully adopted" looks like: every generic SDLC phase (Analyse → Design → Plan → Implement →
Test → Deploy → Operate) AI-supported and feeding back into itself, sitting on a four-layer
knowledge base (Business, Operational, Technical/Product, Tech/Project) that's actually wired
together rather than siloed.

`Context/index.md` and `docs/README.md` updated to describe the new page set.

## Added

- `docs/Context/02 Challenges.md`
- `docs/Context/03 The Full Loop.md`
- `docs/public/images/context/Architecture Is Fragmenting.png`
- `docs/public/images/context/Foundation Survives, Wiring Fails.png`
- `docs/public/images/context/Legacy Systems Meet AI Barriers.png`
- `docs/public/images/context/Session Amnesia.png`
- `docs/public/images/context/The Drift.png`

## Deleted

- `docs/Context/02 Problem Statement.md` (superseded by `02 Challenges.md`)
- `docs/Context/03 Solution.md` (superseded by `02 Challenges.md`)

## Updated

- `docs/Context/index.md`
- `docs/README.md`

## Ordering note

Depends on patch `0001` (`docs-context-restructure`) already being applied — assumes the
`docs/Context/` section and `docs/public/images/context/` folder already exist.
