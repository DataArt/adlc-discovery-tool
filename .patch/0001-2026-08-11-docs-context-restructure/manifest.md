# Patch 0001 — docs-context-restructure

## Summary

Introduces a new "Context" section (the platform's why/story/landscape/problem/solution) as a
top-level docs area — not nested under AI SDLC — with its own VitePress nav entry. Restructures
`docs/public/` from a flat file list into `images/<section>/` subfolders and rewires every image
reference to the new paths. Renames `Engineering Guide/04 AI Workflow.md` to
`04 AI Coding Tool Compatibility.md` and scopes its intro explicitly to coding-agent tools (not
LLM providers), adding a Mermaid diagram to satisfy this repo's own doc standard. Adds a
"Documentation destination" and "Wiring Principle" section (with diagrams) to
`07 Documentation Principles.md`, and an illustrative image to `03 Engineer Role.md`. Reorders the
top nav to Vision · Problem · Solution · Milestones · Connect · Context · Harness. All narrative
content uses the `[[CLIENT_NAME]]` placeholder convention — replace on apply per `/patch-apply`
Step 4.

## Added

- `docs/Context/00 The Story.md`
- `docs/Context/01 Landscape.md`
- `docs/Context/02 Problem Statement.md`
- `docs/Context/03 Solution.md`
- `docs/Context/index.md`
- `docs/public/images/context/but-sth-wrong.png`
- `docs/public/images/context/code-roulette-2.jpg`
- `docs/public/images/context/context-landscape.svg`
- `docs/public/images/context/map-01-strategic.png`
- `docs/public/images/context/map-02-tactical.png`
- `docs/public/images/context/map-03-operational.png`
- `docs/public/images/context/the-fix.png`
- `docs/public/images/context/the-wheel-works.png`
- `docs/public/images/context/three-tiers-maturity.svg`
- `docs/public/images/engineering-guide/docs-principles-placement.png`
- `docs/public/images/engineering-guide/docs-wiring-discovery.png`
- `docs/public/images/engineering-guide/engineer-role.png`
- `docs/Engineering Guide/04 AI Coding Tool Compatibility.md` (renamed from `04 AI Workflow.md`)

## Updated

- `.claude/agents/onboarding.md`
- `CLAUDE.md`
- `CONTRIBUTING.md`
- `apps/docs-web/.vitepress/config.ts`
- `docs/Engineering Guide/01 Conventions.md`
- `docs/Engineering Guide/03 Engineer Role.md`
- `docs/Engineering Guide/05 Getting Started.md`
- `docs/Engineering Guide/06 MCP Setup.md`
- `docs/Engineering Guide/07 Documentation Principles.md`
- `docs/Engineering Guide/index.md`
- `docs/README.md`

## Deleted

- `docs/Engineering Guide/04 AI Workflow.md` (superseded by the rename above)
