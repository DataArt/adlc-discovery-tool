# ADLC Harness — a PM's day-to-day

**For:** Anton Merkulov's talk, the "day-to-day use" part
**Speaker:** Olga Arifulina, Project Manager, Collinson ADLC initiative
**Example:** a real plan update from 5 Oct 2026, from start to finish
**Screenshots:** the folder `ADLC Harness talk — screenshots`, file names start with the step number

---

## 1. Start of the day: get the latest version

**Screenshot:** `01 — Update the repository.png`

Every time I sit down to work, I start by updating my local copy of the repository. I don't search for context. I ask the assistant, and it already knows where the plan, the repository and the workshop notes live, and which copy is the real one. Everything I read is in the repository, so the assistant and I look at the same source.

## 2. Is the plan still true?

**Screenshot:** `02-03 — Plan check and questions only the PM can answer.png` (top half: the table)

This is the most useful step. The assistant compares the plan with what the team actually committed that week. On 5 Oct, every row dated up to 2 Oct still said "Planned" or "In progress", although much of that work was already in the repository. The assistant also found a page that still showed statuses from August. Nobody had noticed.

## 3. What only I know

**Screenshot:** `02-03 — Plan check and questions only the PM can answer.png` (bottom half: the questions)

The assistant does not guess. If something is not in the repository, it asks me. Here it was things decided on calls: is Gate 2 confirmed, who stays on the team, what happens to the commercial proposal.

## 4. I answer in plain words

**Screenshot:** `04-05 — PM answers and the staffing risk.png` (top: my answers)

My contribution is decisions, not files. I answer the way I would answer a colleague. No forms, no templates.

In our setup this is fine. I am the only project manager on the initiative, and I own the dates. With two people splitting the stakeholders, we would first need to agree how each person's updates reach the plan. That is a working agreement for the team, not something the tool has to solve on its own.

## 5. The assistant raises what I would miss

**Screenshot:** `04-05 — PM answers and the staffing risk.png` (bottom: re-dated rows and the warning)

The assistant did not just move the dates. It saw that the new dates had no people behind them and raised it as a risk. That is a judgment call. The assistant raised it, and I made the decision.

## 6. The assistant edits the Excel plan

**Screenshot:** `06a — Excel plan after the update.png` and `06b — What changed in the Excel plan.png`

The Excel file is the source of truth for the plan. The assistant edited it in Excel itself, made a backup first and checked that the file opens without errors. All the mechanics are on the assistant's side: comparing, editing, checking.

It is not perfect. Once it said a gate was still open when it was already closed. It also used an old location for the plan. I corrected both. A person still has to read what it writes.

## 7. One request, and the team sees the change

**Screenshot:** `07a — Site page synced and committed.png` and `07b — Pull request.png`

The assistant updates the site page from the Excel file and opens a pull request. The description says what changed and what is still open on purpose. I read it and merge.

## 8. Ready means merged

**Screenshot:** `08a — Pull request merged and deployed.png`, `08b — Site page, synced as of 5 Oct.png` and `08c — Site page, plan table.png`

How do I know what is ready? Every row in the plan has a status, the page shows the date of the last sync, and a merged pull request means the change is live. The team and the delivery manager see the current plan on the site, and nobody sends files around.

## 9. What would make it easier

**Screenshot:** none.

- **One place that shows what is ready.** Today it is spread across the plan, the status pages and the commits.
- **Updates from more than one person.** Today plan changes come from my calls, and that works because I am the only PM. With two people splitting stakeholders, we would first need to agree how our updates reach the plan.
