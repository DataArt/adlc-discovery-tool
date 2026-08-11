# Patch 0008 — sidebar-scansection-simplify

## Summary

Simplifies `apps/docs-web/.vitepress/config.ts`'s sidebar config: the `02 Vision/`,
`Target Architecture (HLD)/`, `System Architecture (LLD)/`, and `Engineering Guide/` entries now
pass `scanSection(...)` directly as the sidebar array, instead of wrapping it in a single
`[{ text: '...', items: scanSection(...) }]` group. This drops the redundant top-level group
label for those four sections (VitePress renders the scanned items as a flat list rather than
nested one level under a repeated section name) while `Context/`, `03 Problem Space/`,
`04 Solution Space/`, and `05 Roadmap/` keep the wrapped form.

## Updated

- `apps/docs-web/.vitepress/config.ts`

## Ordering note

Depends on patch `0003` (`ai-sdlc-folder-renumbering`) already being applied — this file
references the numbered `docs/AI SDLC/` paths.
