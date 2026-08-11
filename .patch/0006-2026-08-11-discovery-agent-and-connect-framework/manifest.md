# Patch 0006 — discovery-agent-and-connect-framework

## Summary

Adds a new `@discovery` agent — the discovery engagement lead, owning all of `docs/AI SDLC/`
(Process, Vision, Problem Space, Solution Space, Roadmap), aware of where the engagement stands
and what's next, delegating workshop mechanics to `@workshop` and polished doc-writing to
`@docs-writer`. Narrows `@workshop`'s scope accordingly: it now owns only the `WS N (Title)`
folders and `00 Overview.md` within `02 Vision/`, not the section's `index.md` or overall framing.

Restructures `01 Process/` to close a naming gap: "Connect Framework" (Goals → Problem Space →
Solution Space → Milestones) is DataArt's branded methodology, but this engagement's actual
process is Vision → Goals → Problems → Solution (Pilot → Scale → Evolve) → Roadmap — similar but
not identical. Concretely:

- New `06 Connect Framework.md` — dedicated page for the original methodology: the full "How the
  Lists Connect" diagram, Key Principles, and all four list cards (Goals/Problem Space/Solution
  Space/Milestones, each with its key question and Examples) carried over from the old branded
  Overview page, plus a link to
  https://transform.artisyn.dataart.com/catalog/frameworks#connect and an explanation of exactly
  how this engagement's process adapts it.
- `01 Overview.md` rewritten to describe the actual 5-stage process, with a new diagram: a Vision
  subgraph (Goals → Problems inside), a Solution subgraph (Pilot → Scale → Evolve inside, with the
  feed-learnings-back loop), and a standalone Roadmap node — each subgraph and node carries its
  key-question description, matching the style already used in `04 Solution Space/01 Overview.md`.
- New `07 Status.md` (numbered last, not first) — the engagement's landing view: current stage
  (5-stage Mermaid diagram, pending/complete styling), a per-stage Status/Last-Updated table for
  quick scanning, what's next, blockers. Kept current by `@discovery`.
- `04 Solution Space.md` (the Process-internal summary page) gained its own `## Pilot → Scale →
Evolve` section with the closed-loop diagram, matching colors with the top-level Solution Space
  overview.
- `index.md` and `CLAUDE.md` updated to reflect the new page and the `@discovery`/`@workshop`
  agent table entries.

Also removes the header social-link icon that pointed at the Connect Framework catalog page
(`transform.artisyn.dataart.com/catalog/frameworks#connect`) — now redundant since
`06 Connect Framework.md` links to the same URL from inside the docs. The `artisyn-favicon.png`
asset itself is left in `docs/public/` untouched even though nothing references it anymore.

## Added

- `.claude/agents/discovery.md`
- `docs/AI SDLC/01 Process/06 Connect Framework.md`
- `docs/AI SDLC/01 Process/07 Status.md`

## Updated

- `.claude/agents/workshop.md`
- `CLAUDE.md`
- `docs/AI SDLC/01 Process/01 Overview.md`
- `docs/AI SDLC/01 Process/04 Solution Space.md`
- `docs/AI SDLC/01 Process/index.md`
- `apps/docs-web/.vitepress/config.ts`

## Ordering note

Depends on patch `0003` (`ai-sdlc-folder-renumbering`) already being applied — assumes the
numbered `docs/AI SDLC/01 Process/` … `05 Roadmap/` paths already exist.
