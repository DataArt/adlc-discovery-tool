---
name: design-frame
description: Frame phase of the design lifecycle (/design-frame or /design orchestrator). Detects design track (AI SDLC vs project architecture), proposes ACs, produces design/00 Frame.md.
---

The developer wants to run the Frame phase of a design session. Here is their input:

---

## $ARGUMENTS

---

> ⚠️ Follow every step in order. Do not skip, summarize, or improvise. If you are unsure, ask before deviating.

> 🔁 **Session continuity** (`.claude/skills/design/pattern-session-continuity.md`): If resuming after context compaction, re-read this full SKILL.md before doing anything. When this phase is complete, re-read `.claude/skills/design/SKILL.md` and resume the orchestrator from the next phase.

Frame is Phase 1 of the design lifecycle. It frames the problem, frames the requirements (evaluation criteria for Elaborate), frames the boundaries — and sets the design track (A or B) before any research begins. Output: `design/00 Frame.md`.

---

## Step 1 — Find or create the design folder

The argument is a ticket number (e.g. `ADLC-042`) or a direct folder path.

- If a ticket number: glob for `docs/Stories/*{TICKET}*/**` — use `*{TICKET}*` wildcard (never `[{TICKET}]*`). On a fresh start no files exist yet, so the glob will return nothing — proceed directly to creating the folder.
- If not found: ask the developer for a short title, then create the folder:

  ```
  docs/Stories/[{TICKET}] {name}/
      design/
  ```

  > "What is the short title for this design ticket? (e.g. 'Workshop Framing', 'Auth Lambda Setup')"

  **Stop and wait.** Use the provided title as `{name}`.

- If `design/Report.md` exists, read it to restore session context (including the Track setting if already set).

---

## Step 2 — Feature branch check

Before writing any files, confirm the developer is on the correct feature branch:

> "You're currently on branch `{current-branch}`. Should I help you create a feature branch first (e.g. `docs/{ticket-lowercase}-{slug}`)? (**yes** / **skip**)"

**Stop and wait for confirmation.** Do not write any files until the developer confirms or skips.

---

## Step 3 — Track Detection

Determine which design track this session follows:

> "Is this design for **AI SDLC engagement content** (workshops, problem-space analysis, solution recommendations for Collinson — output lands in `docs/AI SDLC/`) or for **project/app architecture** (VitePress site, Lambda@Edge auth, CDK infrastructure — output lands in HLD/LLD)?
>
> **A — AI SDLC content** · **B — Project architecture**"

**Stop and wait.**

Record the track in `design/Report.md` (create the file using `.claude/skills/design/report-template.md` if it does not exist):

- Track A: add a `Track: A — AI SDLC` row to the metadata table; note target subfolder (`Problem Space` for discovery/analysis, `Solution Space` for recommendations/designs)
- Track B: add a `Track: B — Project Architecture` row to the metadata table

**Track A — context sources for Step 4 and all subsequent phases:**

- Read relevant docs under `docs/AI SDLC/Problem Space/` (discovery, current-state analysis, workshop findings)
- Read relevant docs under `docs/AI SDLC/Solution Space/` (existing recommendations or prior designs in this area)
- Do NOT read HLD docs — they describe the infrastructure, not the engagement content

**Track B — context sources for Step 4 and all subsequent phases:**

- Read `docs/Target Architecture (HLD)/README.md` to identify the active version
- Read the relevant container and NFR docs for the areas this ticket touches

---

## Step 4 — Write 00 Frame.md

Using `.claude/skills/design/frame-template.md`, write `design/00 Frame.md`. Pull context from the sources identified in Step 3 (Track A or Track B).

**Problem** — one paragraph from the ticket description (or `$ARGUMENTS`): what is broken or missing, and why it matters now.

**Requirements** — two sub-sections:

- _Known_ — acceptance criteria and requirements stated in the ticket (verbatim, cleaned up)
- _Proposed_ — requirements the developer didn't think of. Look for gaps: missing edge cases, non-functional requirements (performance, security, GDPR), operational concerns (observability, rollback), and future-proofing constraints implied by the architecture or engagement context. Propose 2–4 additions. Label each `[proposed]` so the developer can accept or reject.

These requirements become the evaluation criteria rows in the Requirements × Options matrix during Elaborate.

**Boundaries**

- _In scope_ — what this design covers
- _Out of scope_ — what is explicitly excluded (derive from ticket; add obvious exclusions if missing)

**Constraints** — known deadlines, linked tickets, regulatory requirements, architectural or engagement constraints that directly bound this decision.

**Sizing** _(optional — include only when the ticket warrants capacity planning)_

- Expected users / MAU
- Request volume
- Data volume
- Relevant NFR targets (Track B: from the active version of `docs/Target Architecture (HLD)/{ACTIVE_VERSION}/Non-Functional Concerns/Requirements.md` — read `docs/Target Architecture (HLD)/README.md` first to find the active version; Track A: from the engagement scope)

**Links**

- Ticket: `ADLC-{number}` (internal — no issue tracker URL)
- Related tickets: `<any linked ADLC tickets if any>`
- Reference docs: `<any docs/AI SDLC or HLD docs referenced>`

Write `design/00 Frame.md` to disk.

Apply the write-confirm pattern (`.claude/skills/design/pattern-write-confirm.md`): say "File saved at `design/00 Frame.md`. Proposed requirements are marked `[proposed]` — review in your IDE, accept/reject/edit any of them, then confirm."

**Stop and wait.** Apply any edits the developer requests and re-save. Iterate until the developer confirms.

---

## Step 5 — Reiterate paths

If the developer raises a concern:

- Source data wrong (problem description, linked docs) → "Reiterate from Step 4 — re-draft the Problem and Boundaries sections."
- Problem framing wrong → "Reiterate from Step 4 — re-draft the Problem and Boundaries sections."
- Track wrong → "Reiterate from Step 3 — re-set the Track and re-prime context."

`00 Frame.md` is the single source of ticket context for all subsequent phases. It is not modified again unless the developer explicitly requests a correction.

---

## Step 6 — Do → Report → Commit

Apply the do→report→commit pattern (`.claude/skills/design/pattern-do-report-commit.md`):

**Report** — update `design/Report.md`:

- Phase tracker: `📋 Frame ✅ · 🔍 Research 🔄 · 🏗 Elaborate ⏳ · 📦 Solution ⏳ · 📤 Publish ⏳`
- Append to Efforts table: `| {YYYY-MM-DD} | Frame | Track {A/B} set; {N} known requirements, {M} proposed requirements accepted |`

**Commit** — suggest:

> `docs({TICKET}): frame — <short title>`

**Stop and wait** for the developer to confirm the commit.

🔁 Re-read `.claude/skills/design/SKILL.md` and resume the orchestrator from the next phase.
