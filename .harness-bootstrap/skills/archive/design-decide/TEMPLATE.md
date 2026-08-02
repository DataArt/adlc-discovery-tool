The developer wants to run the Decide phase of a design session. Here is their input:

---

## $ARGUMENTS

---

> ⚠️ Follow every step in order. Do not skip, summarize, or improvise. If you are unsure, ask before deviating.

## Step 1 — Find the design folder

The argument is a ticket number (e.g. `{{PROJECT_KEY}}-042`) or a direct folder path.

- Look for `docs/Stories/*<TICKET>*/design/01 Explore.md` (use `*<TICKET>*` wildcard — never `[<TICKET>]*`, square brackets are glob metacharacters)
- If not found: tell the developer Explore must be completed first and stop
- Read `00 Brief.md`, `01 Explore.md`, and `design/Report.md` in full

## Step 2 — Advance phase

Update `design/Report.md` Phase row:

```
🔍 Explore ✅ · 🏗 Decide 🔄 · 📝 Specify ⏳ · 👁 Review ⏳ · 📤 Publish ⏳
```

## Step 3 — Present options and recommendation

Summarise the options from `01 Explore.md` and `@architect`'s recommendation. Ask:

> "Based on the Explore phase, the recommended approach is **Option X — <Name>**.
>
> Options:
>
> - **A** — <one-line summary>
> - **B** — <one-line summary>
>
> Which option do you want to go with? You can also ask to explore a specific aspect further before deciding."

**Stop and wait for the developer's decision.** If they want more exploration on a specific point, delegate back to `@architect` with the specific question before continuing.

## Step 4 — Resolve open questions

List any open questions from `01 Explore.md`. For each:

> "Open question: `<question>`
> What is your decision or preference here?"

**Stop after each question** until resolved. Record resolutions in the **Open Questions Resolved** section of `02 Decide.md`.

## Step 5 — Produce `design/02 Decide.md`

Using `.claude/skills/design/decide-template.md`, populate:

- **Decision** — the chosen option and one-paragraph rationale
- **Rationale** — key reasons as bullet points
- **Rejected Alternatives** — one-line reason per rejected option
- **Architecture** — Mermaid diagram showing the proposed solution at component/interaction level
- **Constraints and Assumptions** — anything that, if wrong, invalidates the decision
- **Open Questions Resolved** — from Step 4

Present the draft to the developer:

> "Here is `02 Decide.md`. Please review — does this accurately capture the decision and architecture?"

**Stop and wait for confirmation.** Revise and re-present until approved.

## Step 6 — Update design/Report.md

In the **🏗 Decide** section:

- Set Completed to today's date
- Set Decision to the chosen option name (one line)

Update Phase row: `🔍 Explore ✅ · 🏗 Decide ✅ · 📝 Specify 🔄 · 👁 Review ⏳ · 📤 Publish ⏳`

Update **Efforts Spent** table.

> Full rationale, rejected alternatives, and resolved questions live in `design/02 Decide.md` — do not duplicate them in the report.

## Step 7 — Report back

> "Decide complete. `design/02 Decide.md` saved.
>
> Ready to move into Specify? Type **yes** to continue, or **no** to stop here and resume later with `/design-specify <TICKET>`."

**Stop and wait.**
