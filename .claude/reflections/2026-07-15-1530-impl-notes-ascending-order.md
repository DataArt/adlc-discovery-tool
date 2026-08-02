---
date: 2026-07-15 15:30
author: Anton Merkulov
ticket: ADLC-001
task: Write implementation notes in ascending step order in 2-report.md
status: pending-triage
skill_candidate: yes
skill_hint: Enforce that implementation notes are always appended at the bottom of the section so they stay in ascending step order (Step 1 → Step 2 → Step 3), never prepended
---

## What went well

Nothing noted.

## What went wrong

Implementation notes in `2-report.md` were written in reverse order — Step 6 at the top, then Step 5, Step 4, etc. — because each new step note was inserted _above_ the previous one rather than appended _below_ it. The dev-implement skill explicitly requires ascending order (1 → 2 → 3) and says "always add at the bottom", but the pattern was violated in practice.

## Insight

When building up a section incrementally across multiple tool calls, the natural temptation is to find a landmark (the previous step heading) and insert before it. Instead, the correct anchor for each new step note is the _bottom_ of the `## Implementation Notes` section — after all existing step entries. A reliable way to enforce this: always match against the last step heading already present and insert _after_ it, never before.
