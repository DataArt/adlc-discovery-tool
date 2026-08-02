---
name: design-frame
description: Frame phase of the design lifecycle (/design-frame or /design orchestrator). Fetches Jira context, proposes ACs, produces design/00 Frame.md.
---

The developer wants to run the Frame phase of a design session. Here is their input:

---

## $ARGUMENTS

---

> ⚠️ Follow every step in order. Do not skip, summarize, or improvise. If you are unsure, ask before deviating.

> 🔁 **Session continuity** (`.claude/skills/design/pattern-session-continuity.md`): If resuming after context compaction, re-read this full SKILL.md before doing anything. When this phase is complete, re-read `.claude/skills/design/SKILL.md` and resume the orchestrator from the next phase.

Frame is Phase 1 of the design lifecycle. It frames the problem, frames the requirements (evaluation criteria for Elaborate), and frames the boundaries — before any research begins. Output: `design/00 Frame.md`.

---

## Step 1 — Find or create the design folder

The argument is a ticket number (e.g. `{{PROJECT_KEY}}-042`) or a direct folder path.

- If a ticket number: glob for `docs/Stories/*{TICKET}*/**` — use `*{TICKET}*` wildcard (never `[{TICKET}]*`). On a fresh start no files exist yet, so the glob will return nothing — proceed directly to creating the folder.
- If not found: create the folder:
  ```
  docs/Stories/[{TICKET}] {name}/
      design/
  ```
  Where `{name}` is derived from the Jira ticket summary (fetched in Step 2).
- If `design/Report.md` exists, read it to restore session context.

---

## Step 1b — Feature branch check

Before writing any files, confirm the developer is on the correct feature branch:

> "You're currently on branch `{current-branch}`. Should I help you create a feature branch first (e.g. `feat/{ticket-lowercase}-{slug}`)? (**yes** / **skip**)"

**Stop and wait for confirmation.** Do not write any files until the developer confirms or skips.

---

## Step 2 — Jira setup

Present to the developer:

> "I'll assign {TICKET} to you and move it to **In Progress**. Confirm? (**yes** / **skip**)"

**Stop and wait.**

If confirmed:

Invoke `@scrum-master`:

> "Start {TICKET}: assign to the authenticated user and transition to In Progress."

Once `@scrum-master` confirms, invoke `@scrum-master` again:

> "Fetch {TICKET}: return summary, description, acceptance criteria, linked {{PROJECT_KEY}} tickets, and any Confluence page URLs."

Then fetch each linked Confluence page directly and extract relevant content.

---

## Step 3 — Write 00 Frame.md

Using `.claude/skills/design/frame-template.md`, write `design/00 Frame.md`:

**Problem** — one paragraph from the ticket description: what is broken or missing, and why it matters now.

**Requirements** — two sub-sections:

- _Known_ — acceptance criteria and requirements stated in the ticket (verbatim, cleaned up)
- _Proposed_ — requirements the developer didn't think of. Look for gaps: missing edge cases, non-functional requirements (performance, security, GDPR), operational concerns (observability, rollback), and future-proofing constraints implied by the architecture. Propose 2–4 additions. Label each `[proposed]` so the developer can accept or reject.

These requirements become the evaluation criteria rows in the Requirements × Options matrix during Elaborate.

**Boundaries**

- _In scope_ — what this design covers
- _Out of scope_ — what is explicitly excluded (derive from ticket; add obvious exclusions if missing)

**Constraints** — known deadlines, linked issues, Confluence pages, regulatory requirements, architectural constraints from the HLD that directly bound this decision.

**Sizing** _(optional — include only when the ticket warrants capacity planning)_

- Expected users / MAU
- Request volume
- Data volume
- Relevant NFR targets (from the active version of `docs/Target Architecture (HLD)/{ACTIVE_VERSION}/Non-Functional Concerns/Requirements.md` — read `docs/Target Architecture (HLD)/README.md` first to find the active version)

**Links**

- Jira: `<TICKET URL>`
- Related issues: `<linked Jira tickets>`
- Confluence: `<linked pages>`

Write `design/00 Frame.md` to disk.

Apply the write-confirm pattern (`.claude/skills/design/pattern-write-confirm.md`): say "File saved at `design/00 Frame.md`. Proposed requirements are marked `[proposed]` — review in your IDE, accept/reject/edit any of them, then confirm."

**Stop and wait.** Apply any edits the developer requests and re-save. Iterate until the developer confirms.

---

## Step 4 — Reiterate paths

If the developer raises a concern:

- Source data wrong (ticket summary, linked issues, Confluence) → "Reiterate from Step 2 — re-fetch Jira with corrected scope."
- Problem framing wrong → "Reiterate from Step 3 — re-draft the Problem and Boundaries sections."

`00 Frame.md` is the single source of ticket context for all subsequent phases. It is not modified again unless the developer explicitly requests a correction.

---

## Step 5 — (no-op)

`00 Frame.md` was written and confirmed in Steps 3–4. Proceed to Step 6.

---

## Step 6 — Do → Report → Commit

Apply the do→report→commit pattern (`.claude/skills/design/pattern-do-report-commit.md`):

**Report** — update `design/Report.md`:

- If it does not exist, create it using `.claude/skills/design/report-template.md`. Fill in: Ticket, Status (`🔄 In Progress`).
- Phase tracker: `📋 Frame ✅ · 🔍 Research 🔄 · 🏗 Elaborate ⏳ · 📦 Solution ⏳ · 📤 Publish ⏳`
- Append to Efforts table: `| {YYYY-MM-DD} | Frame | Fetched {TICKET}, {N} known requirements, {M} proposed requirements accepted |`

**Commit** — suggest:

> `docs({TICKET}): frame — <short title from Jira summary>`

**Stop and wait** for the developer to confirm the commit.

🔁 Re-read `.claude/skills/design/SKILL.md` and resume the orchestrator from the next phase.
