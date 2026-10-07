# ADLC Harness — a PM's day-to-day: slide text

**For:** Anton Merkulov's deck, the "day-to-day use" part
**Speaker:** Olga Arifulina, Project Manager, Collinson ADLC initiative
**Screenshots:** the folder `ADLC Harness talk — screenshots`

Seven slides. Each slide has a title, the text for the slide, the screenshots to place, and speaker notes. The example is a real plan update from 5 Oct 2026.

---

## Slide 1 — A PM's day with the harness

**On the slide**

- A real example: updating the delivery plan on 5 Oct
- From "is the plan still true?" to a merged change in one session
- The assistant does the mechanics; the PM makes the decisions

**Screenshots:** none

**Speaker notes**
I am the project manager on the Collinson ADLC initiative. I will show one real piece of work from 5 Oct: our delivery plan was eleven days old, and I brought it up to date with the assistant.

---

## Slide 2 — Start of the day: get the latest version

**On the slide**

- One prompt: "Update the repository. What came in?"
- The assistant knows where the plan, the repository and the notes live
- The PM and the assistant read the same source

**Screenshots:** `01 — Update the repository.png`

**Speaker notes**
Every time I sit down to work, I start by updating my copy of the repository. I don't search for context. The assistant already knows where everything lives and which copy is the real one.

---

## Slide 3 — Is the plan still true?

**On the slide**

- The assistant checks the plan against what the team committed
- Done in the repository, still "Planned" in the plan
- What is not in the repository, it asks the PM

**Screenshots:** `02-03 — Plan check and questions only the PM can answer.png`

**Speaker notes**
This is the most useful step. Every row dated up to 2 Oct still said "Planned" or "In progress", although much of that work was already in the repository. The assistant also found a page that still showed statuses from August, and nobody had noticed it. It does not guess. Things decided on calls are not in the repository, so it asks me: is Gate 2 confirmed, who stays on the team, what happens to the proposal.

---

## Slide 4 — The PM decides, the assistant raises risks

**On the slide**

- The PM answers in plain words: no forms, no templates
- The assistant re-dates the plan
- …and flags what does not hold: "nobody is named for this work"

**Screenshots:** `04-05 — PM answers and the staffing risk.png`

**Speaker notes**
My contribution is decisions, not files. I answer the way I would answer a colleague. The assistant did not just move the dates. It saw that the new dates had no people behind them and raised it as a risk. It raised the question; I made the decision.

This works because I am the only PM and I own the dates. With two people splitting the stakeholders, we would first agree how each person's updates reach the plan.

---

## Slide 5 — The assistant edits the Excel plan

**On the slide**

- The Excel file is the source of truth for the plan
- The assistant edits it in Excel, with a backup and an integrity check
- A person still reads what it writes

**Screenshots:** `06a — Excel plan after the update.png`, `06b — What changed in the Excel plan.png`

**Speaker notes**
All the mechanics are on the assistant's side: comparing, editing, checking. It is not perfect. Once it said a gate was still open when it was already closed, and once it used an old location for the plan. I corrected both.

---

## Slide 6 — One request, and the team sees the change

**On the slide**

- The site page is synced from the Excel file
- A pull request says what changed and what is still open
- Merged = live: the team sees the current plan on the site

**Screenshots:** `07a — Site page synced and committed.png`, `07b — Pull request.png`, `08a — Pull request merged and deployed.png`, `08b — Site page, synced as of 5 Oct.png`, `08c — Site page, plan table.png`

**Speaker notes**
The assistant syncs the site page and opens a pull request. I read it and merge. How do I know what is ready? Every row has a status, the page shows the date of the last sync, and a merged pull request means the change is live. Nobody sends files around.

If the slide is too full, use `07b` and `08b` only.

---

## Slide 7 — What would make it easier

**On the slide**

- One place that shows what is ready
- An agreed way for several people to update the plan

**Screenshots:** none

**Speaker notes**
Today "what is ready" is spread across the plan, the status pages and the commits. And today plan changes come from my calls, which works because I am the only PM. With more people, the team first needs to agree how updates reach the plan. That is a working agreement, not something the tool has to solve on its own.

---

## Where the five questions are answered

| Question                                                                     | Slide |
| ---------------------------------------------------------------------------- | ----- |
| How did you find the context you needed?                                     | 2, 3  |
| How did you share a contribution or ask for a correction?                    | 4, 6  |
| How did you know what was ready and what still needed review?                | 3, 6  |
| Where did the AI assistant help, and where did you need a person's judgment? | 4, 5  |
| What would make the tool easier for you to use?                              | 7     |
