---
aside: false
outline: false
---

# 4b. Day-to-day: from an outdated plan to a shared update

::: tip &#8203;
The assistant checks and updates the files. The PM supplies context, makes decisions, and reviews the result.
:::

**Delivery initiative · Plan update · 5 October 2026**

The delivery plan was eleven days out of date. Work had moved forward in the repository, while plan rows still read “Planned” or “In progress.” The PM used the assistant to compare the two, resolve missing information, update the Excel plan, and publish a reviewed copy to the team’s site.

This anonymized case follows the account of that session. Dates and statuses describe the 5 October snapshot.

| Starting point                     | Contribution                                | Result                                                              |
| ---------------------------------- | ------------------------------------------- | ------------------------------------------------------------------- |
| A plan last synced on 24 September | Repository evidence plus the PM’s decisions | Updated Excel plan, synced site page, and a merged, deployed change |

## 1. The same starting point

“Update the repository. What came in?” brings the latest changes into view. The assistant summarises new solution work, workshop processing, and gate records, then identifies that the execution plan still reflects 24 September.

The PM and the assistant work from the same repository context.

## 2. Evidence first, questions second

The assistant compares plan rows with the work recorded in the repository. It identifies completed or changed artifacts and separates these from questions only the PM can answer: client confirmation of Gate 2, staffing, and the proposal’s timing.

A document’s presence does not settle every decision. Missing context becomes a question for its owner.

## 3. The PM decides; the assistant flags the risk

The PM answers in plain language. The assistant translates those decisions into proposed status and date changes, then flags a staffing gap: the remaining work has no named owners behind it.

The first proposal uses 20 October for Gate 3. The PM subsequently places it two weeks after Gate 2, on 27 October. That remains an internal planning date, not a client commitment.

## 4. The Excel plan is updated

In this engagement, the Excel file is the source of truth for the execution plan. Following the PM’s decision, the assistant updates it, reports a backup and an opening check, and summarises the changes: nine rows closed, two added, revised dates, and explicit risks.

The update still leaves work unassigned. Recording a new date does not resolve the staffing gap.

::: info Human review still matters
The supplied account describes corrections to an incorrect gate status and an outdated plan location. The assistant reduces the mechanics of comparison and editing; its output still needs a person’s review.
:::

## 5. The change becomes reviewable

The assistant syncs the site page from the spreadsheet and commits both files on a branch. The pull request explains why the update was needed, what changed, and which items remain open or at risk.

The spreadsheet and the published page have distinct roles: one maintains the plan; the other gives the team a shared view.

## 6. The team sees the updated plan

The PM reviews and merges the change. The supplied record shows both a successful merge and deployment. The site displays “Synced as of 5 Oct 2026,” identifies Excel as the source, and retains the distinction between confirmed dates and internal planning assumptions.

## What this case teaches

| The assistant contributes                      | The PM remains responsible for                       |
| ---------------------------------------------- | ---------------------------------------------------- |
| Comparing the plan with repository evidence    | Decisions and context from stakeholder conversations |
| Identifying inconsistencies and staffing risks | Dates, ownership, and acceptable tradeoffs           |
| Updating Excel and syncing the site page       | Correcting errors and reviewing the proposed change  |
| Preparing the commit and pull request          | Approval to share the updated plan                   |

The case highlights two improvements: **one place to see what is ready**, and **an agreed way for several contributors to update the plan**. This session worked with one PM owning the dates; a larger team needs a shared agreement on how decisions reach the plan.

## Related references

- [Team Collaboration](<../AI SDLC/01 Engagement/07 Contribution/01 Team Collaboration.md>) — contribution and review workflow

---

[Presentation](index.md) · [Previous](<05 Getting Started Case.md>) · [Next](<07 Launching a New Client Engagement.md>)
