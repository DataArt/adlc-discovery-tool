# Domains

This is the SDLC Domains part of `01 Engagement/05 Workflows/03 Investigate/02 Problem - SDLC Domains.md`. Optional — only runs once Current State gives a domain something to diagnose against.

---

Apply [the evidence interface](../interfaces/evidence.md) to evidence artifacts touched below.

## Step 1 — Identify the domain(s)

Resolve the domain from the request and source evidence against the existing domain
pages. Ask only if the target is ambiguous.

Read the source Current State page(s) this evidence comes from, and the target `docs/AI SDLC/03 Problem Space/03 SDLC Domains/0N {Name}.md` page's current content.

---

## Step 2 — Generate / update the domain page

Draft or update the SDLC Domain page, traced explicitly to the Current State page(s) and workshop it derives from — not a generic "per discovery" citation. Reiterate while still green: if this is not the first pass on this domain and the picture hasn't changed since the last validation, say so rather than re-writing filler.

Apply `.claude/skills/discovery/patterns/write-confirm.md`.

---

## Step 3 — Satellite review

Apply `.claude/skills/discovery/patterns/satellite-review.md`.

---

## Step 4 — Do → Report → Commit

Apply `.claude/skills/discovery/patterns/do-report-commit.md`:

- Changelog row on the SDLC Domain page
- `01 Engagement/04 Where We Are/02 Investigate.md`: this domain's row in the Problems table moves past `⏳ Not diagnosed` (Status, Last Updated — "Problems Diagnosed" count is Diagnose's job, not this stage's)
- `05 Report Log.md`: one row citing the Current State evidence/workshop that triggered it
- Commit: `docs(problem-space): <what changed>`

Return to the caller after the reporting pattern completes.

→ `discovery diagnose` for how this evidence gets synthesized into a Problem, once a root cause is emerging.
