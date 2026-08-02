---
date: 2026-07-21 15:30
author: Anton Merkulov
task: Restructured workshop agenda around Connect framework and created dedicated G-P-S-M section in docs
status: pending-triage
skill_candidate: yes
skill_hint: When adding a new top-level doc section, always establish its purpose boundary (per-engagement vs workdir vs framework) before writing content — prevents renaming/reorganising mid-flight
---

## What went well

- The Connect Framework (Goals → Problem → Solution → Milestones) mapped cleanly onto the existing workshop structure without forcing content rewrites — the sessions already followed this arc implicitly
- Placeholder pages with a consistent structure (question, purpose, "to be populated" note, bullet scaffold) were fast to produce and immediately useful as navigation stubs
- `scanSection` auto-scan meant no sidebar config changes were needed when adding new files — just drop a file in the right folder
- Separating Connect Framework (per-engagement, validated content) from Problem Space (workdir, provisional hypotheses) gave each section a clear, defensible purpose

## What went wrong

- Connect Framework was initially created as a top-level `docs/` section, then moved into `docs/AI SDLC/` after user redirect — the purpose boundary ("overall engagement" vs "inside AI SDLC") wasn't confirmed before writing files
- Agenda file was renamed `01 → 02` in anticipation of the Connect Framework living in Workshops, then reverted when the section moved — two unnecessary file operations
- The user had to explicitly redirect three times (DevOps priority → KB session → Teams/Integration) before the full scope of the agenda changes was clear; scope could have been confirmed upfront with one question

## Insight

When building a new doc section, the location and purpose boundary should be pinned before any files are written. "Where does this live?" and "What is this section responsible for — and what does it hand off to other sections?" are prerequisite questions, not mid-task discoveries. In this session, answering them reactively caused the Connect Framework to be moved and the agenda file to be renamed twice. A one-question confirm ("should this live inside AI SDLC or at the top level?") before writing would have saved both operations.
