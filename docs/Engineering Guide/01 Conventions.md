# Conventions

_Portable conventions that apply regardless of which AI tool is used._

---

## Root context file — `.agent/instructions.md` is canonical

`.agent/instructions.md` is the single authoritative root context source, loaded on every session — project instructions, rules, pointers. `CLAUDE.md` and `AGENTS.md` are deterministic generated projections of it, rendered by `yarn harness:generate`; neither is hand-edited directly. → See `09 Harness Generation.md` for how generation works.

Structure of `.agent/instructions.md`: WHY (2–3 sentences) → WHAT (rules + pointers) → HOW (commands / agents). Length: 60–130 lines. → See `07 Documentation Principles.md` for length budgets per doc type.

Do not auto-generate the canonical file from scratch — edit `.agent/instructions.md` by hand for precision, then regenerate its projections. Auto-generated root context is generic; hand-edited root context is precise.

---

## Skill authoring

- **One concept per file** — if a skill covers two unrelated conventions, split it
- **Lead with the rule** — state the convention in the first sentence; put the reasoning after
- **Include Why and How to apply** — the context lets future readers apply judgment in edge cases rather than follow the rule blindly
- **No duplicates** — check existing skills before creating; update the existing file if the concept is already covered
- **Length**: convention skills under 40 lines; orchestrator skills under 60 lines

For skill file locations per tool → see `04 AI Coding Tool Compatibility.md`.

---

## File naming inside `docs/`

Format: `NN Title Case.md` — two-digit prefix, space, Title Case, `.md`.

Pick the next available number within the folder. Update README references when adding or renaming.

Numbers 04 onward in `Engineering Guide/` are project-specific articles (Getting Started, MCP Setup, Harness Generation, etc.) added by the team over time — no fixed upper bound.

---

## Commit messages

`<type>(<scope>): <what changed>` — types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`. Scope is the app or layer. Message explains the _why_, not the _what_.
