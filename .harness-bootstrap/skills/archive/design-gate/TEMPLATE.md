The developer wants to run the Review gate of a design session. Here is their input:

---

## $ARGUMENTS

---

> ⚠️ This phase is a human gate. Do not advance to Publish until explicit approval is confirmed.

## Step 1 — Find the design folder

The argument is a ticket number (e.g. `{{PROJECT_KEY}}-042`) or a direct folder path.

- Look for `docs/Stories/*<TICKET>*/design/03 Specify.md` (use `*<TICKET>*` wildcard — never `[<TICKET>]*`, square brackets are glob metacharacters)
- If not found: tell the developer Specify must be completed first and stop
- Read `00 Brief.md`, `02 Decide.md`, `03 Specify.md`, `design/Report.md`, and all files in `solution/` in full

## Step 2 — Advance phase

Update `design/Report.md` Phase row:

```
🔍 Explore ✅ · 🏗 Decide ✅ · 📝 Specify ✅ · 👁 Review 🔄 · 📤 Publish ⏳
```

## Step 3 — Request approver

Ask the developer:

> "Who should review this design? Please provide the approver's email address."

**Stop and wait.**

Record the approver email in `design/Report.md` → **👁 Review** → Approver field.

## Step 4 — Instruct draft MR creation

Tell the developer:

> "Please create a **draft MR** with the full design folder (`docs/Stories/[<TICKET>]/`) and share it with `<approver email>`.
>
> The MR title should be:
>
> ```
> design(<ticket-lowercase>): <short title>
> ```
>
> The MR includes both `design/` (process) and `solution/` (outcome) — approvers should review both.
>
> Once the MR is open, share the URL here and I'll record it."

**Stop and wait** for the MR URL.

Record the URL in `design/Report.md` → **👁 Review** → Draft MR field.

## Step 5 — Wait for approval

Tell the developer:

> "Design review is now pending approval from `<approver>`.
>
> When the MR is approved, run `/design-publish <TICKET>` to continue."

In the **👁 Review** section of `design/Report.md`:

- Set Approver to the email recorded in Step 3
- Set Draft MR to the URL recorded in Step 4
- Set Requested to today's date
- Leave Approved and Outcome as `—` (pending)

Update Phase row — leave 👁 Review as `🔄` (in progress, awaiting approval).

Update **Efforts Spent** table.

**This skill ends here. Do not proceed to Publish.**
