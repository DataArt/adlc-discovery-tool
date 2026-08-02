The developer wants to run the Specify phase of a design session. Here is their input:

---

## $ARGUMENTS

---

> ⚠️ Follow every step in order. Do not skip, summarize, or improvise. If you are unsure, ask before deviating.

## Step 1 — Find the design folder

The argument is a ticket number (e.g. `{{PROJECT_KEY}}-042`) or a direct folder path.

- Look for `docs/Stories/*<TICKET>*/design/02 Decide.md` (use `*<TICKET>*` wildcard — never `[<TICKET>]*`, square brackets are glob metacharacters)
- If not found: tell the developer Decide must be completed first and stop
- Read `00 Brief.md`, `01 Explore.md`, `02 Decide.md`, and `design/Report.md` in full

## Step 2 — Advance phase

Update `design/Report.md` Phase row:

```
🔍 Explore ✅ · 🏗 Decide ✅ · 📝 Specify 🔄 · 👁 Review ⏳ · 📤 Publish ⏳
```

## Step 3 — Create design/03 Specify.md

Create `design/03 Specify.md` from `.claude/skills/design/specify-template.md`.

Tell the developer:

> "I've opened `03 Specify.md` as your working space. We'll go through each section together — add as much or as little as you want, in any order. You can always come back and extend any section.
>
> Let's start with **Integration**. What systems, APIs, events, or data stores does this solution touch?"

**Stop and wait.** Fill the Integration section from the discussion. Then ask:

> "Anything else on integration before we move to Security?"

**Stop and wait.** Repeat this pattern for each section in order:

- Security
- Performance
- Non-Functional Requirements
- Environment & Deployment

For each section: present the section heading, ask an open question to prompt thinking, fill from discussion, then ask "Anything else here?" before moving on.

After all sections:

> "We've covered all sections. Do you have anything to add to **Designer Notes** — edge cases, risks, open questions, or anything that doesn't fit elsewhere?"

**Stop and wait.**

## Step 4 — Architecture impact

Read `docs/Target Architecture (HLD)/README.md` to find the active version, then read the relevant container and cross-cutting docs to identify which are affected by the decision and specification.

Present findings:

> "Based on the decision and specification, these architecture areas are affected:
>
> - `docs/Target Architecture (HLD)/<VERSION>/<path>` — `<what changes>`
>
> Does this look complete? Anything to add or remove?"

**Stop and wait.** Fill the **Architecture Impact** table in `03 Specify.md`.

## Step 5 — Produce solution/ files

Create the `solution/` subfolder and populate all four files using the templates in `.claude/skills/design/`:

- `solution/Architecture.md` — Mermaid system context, component design, and data flow diagrams based on `02 Decide.md` and `03 Specify.md`
- `solution/Design.md` — implementation approach, integration points, security controls, error handling, observability, testing strategy
- `solution/Stack.md` — tech stack derived from the decision and specification
- `solution/Efforts.md` — proposed ticket breakdown (one ticket per layer or deployable concern) with sequencing diagram and effort estimates

> ⚠️ **Certainty principle** — `solution/` files are the bridge to LLD. Write them as settled, single-direction statements. Do not carry over open questions, rejected alternatives, comparative arguments, or rationale from `03 Specify.md` or `02 Decide.md`. Those stay in `design/`. `solution/` contains only what will be built and how.

Present the draft solution/ files to the developer:

> "Here is the proposed solution package. Please review each file — does this accurately reflect what we've designed?"

**Stop and wait for confirmation.** Revise until approved.

## Step 6 — Update design/Report.md

In the **📝 Specify** section:

- Set Completed to today's date

Update Phase row: `🔍 Explore ✅ · 🏗 Decide ✅ · 📝 Specify ✅ · 👁 Review 🔄 · 📤 Publish ⏳`

Update **Efforts Spent** table.

> Full specification, integration points, security decisions, NFR targets, and proposed tickets live in `design/03 Specify.md` and `solution/` — do not duplicate them in the report.

## Step 7 — Report back

> "Specify complete. `design/03 Specify.md` and `solution/` saved.
>
> Ready to open the Review gate? Type **yes** to continue, or **no** to stop here and resume later with `/design-review <TICKET>`."

**Stop and wait.**
