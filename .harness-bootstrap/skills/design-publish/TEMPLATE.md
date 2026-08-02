---
name: design-publish
description: Publish phase of the design lifecycle (/design-publish or /design orchestrator). Pre-gate opens draft MR; post-approval updates HLD, archives folder, creates tickets.
---

The developer wants to run the Publish phase of a design session. Here is their input:

---

## $ARGUMENTS

---

> ⚠️ Follow every step in order. Do not skip, summarize, or improvise. If you are unsure, ask before deviating.

> 🔁 **Session continuity** (`.claude/skills/design/pattern-session-continuity.md`): If resuming after context compaction, re-read this full SKILL.md before doing anything. When this phase is complete, the design lifecycle is closed — no orchestrator handoff needed.

Publish is Phase 5. It has two entry points: **pre-gate** (Steps 1–3, open draft MR) and **post-approval** (Steps 4–12, run after the MR is approved out-of-band). The session always ends at Step 3. Step 4 begins on the next `/design-publish {TICKET}` invocation.

---

## Step 1 — Verify prerequisites

Find the design folder by globbing `docs/Stories/*{TICKET}*/**`.

Verify all of the following exist:

- `design/00 Frame.md`
- `design/01 Research.md`
- `design/02 Elaborate.md`
- `solution/Architecture.md`
- `solution/Design.md`
- `solution/Stack.md`
- `solution/Efforts.md`

If any is missing, tell the developer which phase to complete first and stop.

Read `design/Report.md`. If the Gate section already has a Draft MR URL recorded, **the gate has been opened** — skip directly to Step 4 (post-approval flow).

---

## Step 2 — Suggest draft MR

Compose and display:

**Suggested MR title:**

```
Design: {TICKET} — <short title from Jira summary>
```

**Suggested MR body:**

```
## Design: {TICKET} — <short title>

Design artifacts for {TICKET}. See `design/` and `solution/` folders.

### Summary
- Recommended option: <option name from 02 Elaborate.md>
- Key WAF findings: <1–2 lines from Report.md WAF section>

### Approver
@<approver handle>
```

Ask:

> "Who should be the approver? (name or @handle)"

**Stop and wait for the approver name.**

Then say:

> "Open a draft MR using the title and body above and paste the resulting PR URL here."

**Stop and wait for the PR URL.**

---

## Step 3 — Record gate and end session

Write to `design/Report.md` Gate section:

```markdown
## Gate

- Approver: {name}
- Draft MR: {URL}
- Approved: pending
```

Update phase tracker: `📋 Frame ✅ · 🔍 Research ✅ · 🏗 Elaborate ✅ · 📦 Solution ✅ · 📤 Publish 🔄`

Tell the developer:

> "Design is pending approval from `{approver}`. Come back and run `/design-publish {TICKET}` once the MR is approved."

**Stop. Session ends here. Do not proceed to Step 4 automatically.**

---

## Step 4 — Post-approval: confirm outcome

Ask:

> "Has the MR been approved? (**yes** / **concerns**)"

**Stop and wait.**

- If **yes** → proceed to Step 5.
- If **concerns** → ask the developer to describe the concern. Identify which phase/step it traces to and suggest a named reiterate path:

  | Concern type                 | Reiterate suggestion                                          |
  | ---------------------------- | ------------------------------------------------------------- |
  | Architectural approach wrong | Reiterate from Solution, Step 2 — rewrite Architecture        |
  | Recommendation wrong         | Reiterate from Elaborate, Step 4 — revisit recommendation     |
  | Missing option               | Reiterate from Research, Step 3 — re-delegate to `@architect` |
  | Scope wrong                  | Reiterate from Frame, Step 3 — re-draft Boundaries            |

  Confirm the reiterate with the developer, then stop — do not continue Publish until the reiteration is complete and the MR is re-approved.

---

## Step 5 — HLD impact identification (via `@architect`)

Delegate to `@architect` (read-only — no file writes):

- Read `solution/Architecture.md`, `solution/Design.md`, `solution/Stack.md`
- Read `design/Report.md` WAF section (P1 items)
- Read `docs/Target Architecture (HLD)/README.md` to find the active version
- Read the relevant HLD container and NFR docs for the areas this design touches
- Return: a list of specific HLD docs that need updating, with the exact section and what settled decision to add or change — no rationale, no rejected options, no open questions (Certainty principle)
- **Do not write or edit any files — return output only**

Present `@architect`'s findings to the developer:

> "Here's what needs updating in the HLD:
>
> - `{path}` → `{section}`: <what to add or change>
>
> Confirm to proceed with updates? (**yes** / **no changes needed**)"

**Stop and wait.**

---

## Step 6 — Apply HLD updates

Delegate to `@docs-writer` with the full classified list from Step 5. Brief:

> "You are writing permanent documentation for design ticket {TICKET}. Read `{{DOC_PRINCIPLES_ARTICLE}}` before writing anything — it contains the destination rules, diagram standards, coloring requirements, and format priority that govern all permanent docs in this repo.
>
> **Docs to create/update:**
> {list from @architect — path · section · diagrams_to_port · text_to_add}
>
> For each doc:
>
> 1. Read the current file if it exists
> 2. Port every mapped diagram from `solution/Architecture.md` — diagrams before any prose
> 3. Every doc MUST have at least one Mermaid high-level diagram; add drill-down diagrams for complex sections
> 4. All Mermaid diagrams MUST be colored (classDef + style directives)
> 5. Apply only settled decisions — no rationale, rejected options, or open questions
> 6. If a new file is created or renamed, update `docs/README.md`
>
> Return a one-line summary per doc written."

Once `@docs-writer` completes, present the summary to the developer:

> "Permanent doc updates applied:
>
> - `{path}` → `{section}`: <what was added>
>
> Ready for `@architect` to review? (**yes** / **undo and revise**)"

**Stop and wait.**

---

## Step 7 — `@architect` reviews HLD changes

Apply the satellite review pattern (`.claude/skills/design/pattern-satellite-review.md`). Delegate to `@architect` to review the HLD changes just made:

- Read the updated HLD doc(s)
- Verify the changes are accurate, consistent with the rest of the HLD, and don't introduce contradictions or gaps
- **Do not write or edit any files — return output only**
- Return: **OK** or a specific list of corrections needed

If **OK** → proceed to Step 8.

If **corrections needed** → apply the corrections, then show the developer what was changed (one line per edit) before re-delegating for one more review pass.

If still not OK after 2 iterations → report to the developer and stop:

> "`@architect` found unresolved issues with the HLD update after 2 passes:
> <list of outstanding issues>
> Please review and resolve manually before continuing Publish."

---

## Step 8 — Update Report.md

Record the approver and date in `design/Report.md` Gate section:

- `Approved: <today's date>`

Update phase tracker: `📋 Frame ✅ · 🔍 Research ✅ · 🏗 Elaborate ✅ · 📦 Solution ✅ · 📤 Publish ✅`

Set Status to `✅ Complete`.

Append to the Efforts table:

| Date         | Phase   | Notes                                               |
| ------------ | ------- | --------------------------------------------------- |
| {YYYY-MM-DD} | Publish | MR approved by {approver}; HLD docs updated: {list} |

---

## Step 9 — Hand-off question

Ask:

> "How do you want to proceed?
>
> **A** — Wrap up: archive the design folder and create implementation tickets
> **B** — Start `/dev` now (archive and tickets on return)"

**Stop and wait.**

---

## Step 10 — Archive (option A only)

If option **A**: run the archive directly (do not present as a user instruction):

```bash
git mv "docs/Stories/[{TICKET}] {name}" "docs/Stories/archive/[{TICKET}] {name}"
```

Report to the developer: "Design folder archived to `docs/Stories/archive/[{TICKET}] {name}`."

If option **B**: skip this step.

---

## Step 11 — Suggest commit

Suggest the developer commit with:

- If option **A**: `docs({TICKET}): publish — update HLD, archive design folder`
- If option **B**: `docs({TICKET}): publish — update HLD`

---

## Step 12 — Hand-off

**If option A:**

Invoke `@scrum-master`:

> "Create implementation tickets from Efforts.md at `{path}/solution/Efforts.md` for design ticket {TICKET}."

`@scrum-master` reads Efforts.md, creates each ticket in {{PROJECT_KEY}} with label `implementation`, and links them to {TICKET} as "is implemented by". It returns the created issue keys.

Append an `## Implementation Tickets` section to `design/Report.md`:

```markdown
## Implementation Tickets

| Ticket | Summary | Jira          |
| ------ | ------- | ------------- |
| {key}  | {title} | [{key}](link) |
```

Then say: "Done. Implementation tickets created: {list}. Run `/dev {first-ticket-key}` when ready to begin."

**If option B:**

Invoke `/dev` with the first implementation ticket key from `solution/Efforts.md`. The dev flow handles archive and ticket creation.
