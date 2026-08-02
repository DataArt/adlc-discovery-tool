The developer wants to run the Explore phase of a design session. Here is their input:

---

## $ARGUMENTS

---

> ⚠️ Follow every step in order. Do not skip, summarize, or improvise. If you are unsure, ask before deviating.

## Step 1 — Find or create the design folder

The argument is a ticket number (e.g. `{{PROJECT_KEY}}-042`) or a direct folder path.

- If a ticket number: look for `docs/Stories/*<TICKET>*/` — use a `*<TICKET>*` wildcard (do **not** write `[<TICKET>]*`; square brackets are glob metacharacters and will never match the literal `[` in the folder name)
- If not found: create the folder:
  ```
  docs/Stories/[<TICKET>] 🎨 Design — <name>/
      design/
  ```
  Where `<name>` is derived from the Jira ticket summary (fetched in Step 2).
- Read `design/Report.md` if it exists to restore context from a previous session.

## Step 2 — Jira setup

Present to the developer:

> "I'll assign {{PROJECT_KEY}}-XX to you and move it to **In Progress**. Confirm? (**yes** / **skip**)"

**Stop and wait for confirmation.**

If confirmed:

- Assign the issue to the authenticated user
- Transition to "In Progress" (transition ID `{{JIRA_TRANSITION_START_PROGRESS}}`)

Then fetch the full Jira issue:

- Summary, description, acceptance criteria, linked issues
- Check for linked Confluence pages — fetch and extract relevant content if found

## Step 3 — Create 00 Brief.md

Using `.claude/skills/design/brief-template.md`, populate `design/00 Brief.md` from the fetched Jira data:

- **Problem** — from the ticket description
- **Goal** — from acceptance criteria or description
- **Scope** — in/out derived from the ticket
- **Constraints** — linked issues, Confluence pages, any stated deadlines
- **Links** — Jira URL, linked issues, Confluence pages

Save to `docs/Stories/[<TICKET>] 🎨 Design — <name>/design/00 Brief.md`.

This file is the single source of ticket context for all subsequent phases. It is written once and not modified.

## Step 4 — Create design/Report.md (if it doesn't exist)

Use `.claude/skills/design/report-template.md`. Fill in:

- Ticket, Status (`🔄 In Progress`), Phase (`🔍 Explore 🔄 · 🏗 Decide ⏳ · 📝 Specify ⏳ · 👁 Review ⏳ · 📤 Publish ⏳`)

## Step 5 — Read Target Architecture

Before presenting context to the developer, read the relevant architecture docs:

1. Read `docs/Target Architecture (HLD)/README.md` to find the active version and the container index.
2. Identify which container(s) this ticket touches (e.g. BFF, Web, Infrastructure).
3. Read the relevant container doc(s) from the active version's `Containers/` folder.
4. Read any Non-Functional Concern docs that apply — for example:
   - CI/CD tickets → Operational Excellence doc
   - Auth/secrets tickets → Security doc
   - Data flow tickets → relevant data flow or container doc

Use this to enrich the context presented to the developer in the next step. Do **not** pre-empt `@architect` — this read is for context validation only, not full research.

## Step 6 — Context validation

Present the combined context to the developer:

> "Here's what I'm working from:
>
> - **Ticket**: `<summary>`
> - **Confluence**: `<pages found or 'none'>`
> - **Architecture context**: `<one-line summary of relevant HLD layers and any key constraints or design decisions already made>`
> - **Developer input**: `<problem or 'none'>`
>
> Anything missing, incorrect, or out of scope before I begin research?"

**Stop and wait for confirmation.**

## Step 7 — Research via `@architect` (bounded, output only)

Delegate to `@architect` for **research only**. The architect must **not write any files** — it returns its findings as text to the main agent.

Instruct `@architect` to:

- Read relevant architecture docs (`docs/Target Architecture (HLD)/`) for the affected layers — read `docs/Target Architecture (HLD)/README.md` first to find the active version
- Read relevant code paths to understand the current state
- Research the domain: options, trade-offs, security implications, external constraints, industry patterns
- Return a structured **options analysis** using the sections from `.claude/skills/design/explore-template.md` (Context, Scope, Options A/B/C…, Evaluation Criteria, Recommendation)
- Be exhaustive — this is the foundation for the decision
- **Do not write or edit any files. Return output only.**

Once the architect returns, **present its output directly in the console** for the developer to read.

**Stop and wait.** Ask the developer:

> "Here's what `@architect` found. Does this cover all the options you want evaluated? Any gaps, missing options, or corrections before I draft `01 Explore.md`?"

If the developer requests more research or additional options, re-delegate to `@architect` with the specific gap to fill. Iterate until the developer is satisfied.

Only once the developer approves the research: write `design/01 Explore.md` using `.claude/skills/design/explore-template.md`, populated with the approved findings.

## Step 8 — Update design/Report.md

In the **🔍 Explore** section:

- Set Completed to today's date
- Set Context confirmed by engineer to what the engineer confirmed or corrected in Step 6

Update Phase row: `🔍 Explore ✅ · 🏗 Decide 🔄 · 📝 Specify ⏳ · 👁 Review ⏳ · 📤 Publish ⏳`

Update **Efforts Spent** table.

> The full options analysis, constraints, and open questions live in `design/01 Explore.md` — do not duplicate them in the report.

## Step 9 — Report back

Tell the developer:

> "Explore complete. `design/01 Explore.md` saved.
>
> Ready to move into the Decide phase? Type **yes** to continue, or **no** to stop here and resume later with `/design-decide <TICKET>`."

**Stop and wait.**
