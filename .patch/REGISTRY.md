# Patch Registry

Tracks patch bundles moving between sibling projects instantiated from this starter kit. Each row is one bundle folder under `.patch/`.

In the repo where a bundle was **prepared**, its row's Status is `prepared`. In a repo where a bundle was **applied**, its row's Status is `applied`. The same bundle can appear with different statuses in different repos — this file is local to each repo, it does not sync itself.

| ID   | Date       | Slug                     | Base Ref | Head Ref    | Summary                                                                                                                                                                                               | Status   |
| ---- | ---------- | ------------------------ | -------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 0001 | 2026-08-11 | docs-context-restructure | bbd6e34  | uncommitted | New top-level Context section + nav, docs/public restructured into images/<section>/, 04 AI Workflow renamed to 04 AI Coding Tool Compatibility, Documentation Principles wiring/destination sections | prepared |
