# Design — @architect Review Protocol

After `solution/Architecture.md` is confirmed by the developer, offer to delegate to `@architect` for a read-only architecture review before beginning `Design.md`. This is the natural gate: Architecture is the highest-level artifact and the hardest to correct once Design and Stack are built on top of it.

## Rules

1. **When to offer** — after Architecture.md is confirmed by the developer, before proceeding to Design.md.
2. **Scope the prompt correctly** — the HLD docs are NOT yet updated during the Solution phase (that happens in Publish). Do not ask `@architect` to compare against HLD docs for currency. Evaluate only:
   - Structural completeness (components, data flows, integration points)
   - Security and reliability fit with the existing platform as currently implemented
   - Consistency with the existing HLD container boundaries and NFRs
   - Missing integration points or failure modes
3. **Explicitly exclude** — tell `@architect`: "The HLD docs are not yet updated — that happens in Publish. Do not flag HLD documentation gaps as findings."
4. **Max 2 iterations** — if `@architect` returns findings, address them and re-delegate once. If still unresolved after 2 passes, escalate to the developer.

## Prompt template

> "Read `solution/Architecture.md` and the relevant HLD container docs for the areas this design touches. Evaluate the architecture solution itself: structural completeness, security, reliability, and fit with the existing platform as currently implemented. Do **not** flag HLD documentation gaps — those docs are intentionally not yet updated (Publish phase handles that). Return: **OK** or a specific list of gaps (one finding per line)."

## Why

Moving directly from Architecture.md confirmation to Design.md without an @architect gate means that when a structural gap is later found (e.g. via /design-review after Design and Stack are already written), corrections cascade across multiple files. An earlier gate catches structural issues cheaply before Design.md locks in the details.

A related pitfall: if the @architect prompt does not explicitly exclude HLD documentation gaps from scope, it will flag intentionally deferred documentation as P1 findings — noise that confuses the solution/publish phase boundary.
