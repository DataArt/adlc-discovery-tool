# Patch Registry

Tracks patch bundles moving between sibling projects instantiated from this starter kit. Each row is one bundle folder under `.patch/`.

In the repo where a bundle was **prepared**, its row's Status is `prepared`. In a repo where a bundle was **applied**, its row's Status is `applied`. The same bundle can appear with different statuses in different repos — this file is local to each repo, it does not sync itself.

| ID   | Date       | Slug                       | Base Ref | Head Ref    | Summary                                                                                                                                                                                                        | Status   |
| ---- | ---------- | -------------------------- | -------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 0001 | 2026-08-11 | docs-context-restructure   | bbd6e34  | uncommitted | New top-level Context section + nav, docs/public restructured into images/<section>/, 04 AI Workflow renamed to 04 AI Coding Tool Compatibility, Documentation Principles wiring/destination sections          | prepared |
| 0002 | 2026-08-11 | ws6-pilot-selection        | 0d47688  | uncommitted | New WS6 capstone synthesis workshop (pilot selection matrix), WS5 closing-note updates, Solution Space cross-reference                                                                                         | prepared |
| 0003 | 2026-08-11 | ai-sdlc-folder-renumbering | ea94059  | uncommitted | Connect Framework renamed to 01 Process, Vision/Problem Space/Solution Space/Milestones numbered 02-05 (Milestones renamed to Roadmap), all cross-links updated, HLD/LLD sidebar wiring + HLD_VERSION constant | prepared |
