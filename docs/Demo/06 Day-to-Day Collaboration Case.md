---
aside: false
outline: false
---

# 4b. Day-to-day: from an outdated plan to a shared update

::: tip &#8203;
The assistant checks and updates the files. The PM supplies context, makes decisions, and reviews the result.
:::

**Collinson ADLC initiative · Plan update · 5 October 2026**

The delivery plan was eleven days out of date. Work had moved forward in the repository, while plan rows still read “Planned” or “In progress.” The PM used the assistant to compare the two, resolve missing information, update the Excel plan, and publish a reviewed copy to the team’s site.

This case follows the supplied screenshots and the supplied account of that session. Dates and statuses describe the 5 October snapshot.

| Starting point                     | Contribution                                | Result                                                              |
| ---------------------------------- | ------------------------------------------- | ------------------------------------------------------------------- |
| A plan last synced on 24 September | Repository evidence plus the PM’s decisions | Updated Excel plan, synced site page, and a merged, deployed change |

## 1. The same starting point

“Update the repository. What came in?” brings the latest changes into view. The assistant summarises new solution work, workshop processing, and gate records, then identifies that the execution plan still reflects 24 September.

The PM and the assistant work from the same repository context.

<div class="day2day-screenshot">

[![Repository update summarising new commits and the outdated execution plan](./day2day/01%20%E2%80%94%20Update%20the%20repository.png)](./day2day/01%20%E2%80%94%20Update%20the%20repository.png)

</div>

_The repository has moved forward; the plan needs another check._

## 2. Evidence first, questions second

The assistant compares plan rows with the work recorded in the repository. It identifies completed or changed artifacts and separates these from questions only the PM can answer: client confirmation of Gate 2, staffing, and the proposal’s timing.

A document’s presence does not settle every decision. Missing context becomes a question for its owner.

<div class="day2day-screenshot">

[![Plan comparison followed by questions about gates, staffing, and unresolved dates](./day2day/02-03%20%E2%80%94%20Plan%20check%20and%20questions%20only%20the%20PM%20can%20answer.png)](./day2day/02-03%20%E2%80%94%20Plan%20check%20and%20questions%20only%20the%20PM%20can%20answer.png)

</div>

_Repository evidence establishes some updates; decisions made on calls need the PM’s input._

## 3. The PM decides; the assistant flags the risk

The PM answers in plain language. The assistant translates those decisions into proposed status and date changes, then flags a staffing gap: the remaining work has no named owners behind it.

The first proposal uses 20 October for Gate 3. The PM subsequently places it two weeks after Gate 2, on 27 October. That remains an internal planning date, not a client commitment.

<div class="day2day-screenshot">

[![PM answers, proposed dates, and a warning about unassigned work](./day2day/04-05%20%E2%80%94%20PM%20answers%20and%20the%20staffing%20risk.png)](./day2day/04-05%20%E2%80%94%20PM%20answers%20and%20the%20staffing%20risk.png)

</div>

_The assistant identifies the scheduling risk; the PM owns the decision._

## 4. The Excel plan is updated

In this engagement, the Excel file is the source of truth for the execution plan. Following the PM’s decision, the assistant updates it, reports a backup and an opening check, and summarises the changes: nine rows closed, two added, revised dates, and explicit risks.

The update still leaves work unassigned. Recording a new date does not resolve the staffing gap.

<div class="day2day-screenshot">

[![Updated Excel plan with a 5 October sync date and revised milestone statuses](./day2day/06a%20%E2%80%94%20Excel%20plan%20after%20the%20update.png)](./day2day/06a%20%E2%80%94%20Excel%20plan%20after%20the%20update.png)

</div>

_The maintained plan remains in Excel._

<div class="day2day-screenshot">

[![Summary of Excel changes, backup and integrity checks, and remaining staffing risk](./day2day/06b%20%E2%80%94%20What%20changed%20in%20the%20Excel%20plan.png)](./day2day/06b%20%E2%80%94%20What%20changed%20in%20the%20Excel%20plan.png)

</div>

_The change summary makes completed work, new commitments, and open risks visible._

::: info Human review still matters
The supplied account describes corrections to an incorrect gate status and an outdated plan location. The assistant reduces the mechanics of comparison and editing; its output still needs a person’s review.
:::

## 5. The change becomes reviewable

The assistant syncs the site page from the spreadsheet and commits both files on a branch. The pull request explains why the update was needed, what changed, and which items remain open or at risk.

The spreadsheet and the published page have distinct roles: one maintains the plan; the other gives the team a shared view.

<div class="day2day-screenshot">

[![Assistant summary of the synced site page and committed spreadsheet changes](./day2day/07a%20%E2%80%94%20Site%20page%20synced%20and%20committed.png)](./day2day/07a%20%E2%80%94%20Site%20page%20synced%20and%20committed.png)

</div>

_The sync includes a dated summary, updated rows, risk notes, and a changelog entry._

<div class="day2day-screenshot">

[![Pull request describing the plan update and showing its merged status](./day2day/07b%20%E2%80%94%20Pull%20request.png)](./day2day/07b%20%E2%80%94%20Pull%20request.png)

</div>

_The pull request records the reason for the change and the scope reviewed by the PM._

## 6. The team sees the updated plan

The PM reviews and merges the change. The supplied record shows both a successful merge and deployment. The site displays “Synced as of 5 Oct 2026,” identifies Excel as the source, and retains the distinction between confirmed dates and internal planning assumptions.

<div class="day2day-screenshot">

[![GitHub confirmation of a merged pull request and successful deployment](./day2day/08a%20%E2%80%94%20Pull%20request%20merged%20and%20deployed.png)](./day2day/08a%20%E2%80%94%20Pull%20request%20merged%20and%20deployed.png)

</div>

_The record shows the reviewed change reached the deployed site._

<div class="day2day-screenshot">

[![Published execution-plan page with sync date, source-of-truth note, and planning caveats](./day2day/08b%20%E2%80%94%20Site%20page%2C%20synced%20as%20of%205%20Oct.png)](./day2day/08b%20%E2%80%94%20Site%20page%2C%20synced%20as%20of%205%20Oct.png)

</div>

_The team can see when the page was synced and which commitments remain unsettled._

<div class="day2day-screenshot">

[![Published plan table showing dates, statuses, milestones, goals, and outcomes](./day2day/08c%20%E2%80%94%20Site%20page%2C%20plan%20table.png)](./day2day/08c%20%E2%80%94%20Site%20page%2C%20plan%20table.png)

</div>

_The shared page exposes the plan’s status and purpose row by row._

## What this case teaches

| The assistant contributes                      | The PM remains responsible for                       |
| ---------------------------------------------- | ---------------------------------------------------- |
| Comparing the plan with repository evidence    | Decisions and context from stakeholder conversations |
| Identifying inconsistencies and staffing risks | Dates, ownership, and acceptable tradeoffs           |
| Updating Excel and syncing the site page       | Correcting errors and reviewing the proposed change  |
| Preparing the commit and pull request          | Approval to share the updated plan                   |

The case highlights two improvements: **one place to see what is ready**, and **an agreed way for several contributors to update the plan**. This session worked with one PM owning the dates; a larger team needs a shared agreement on how decisions reach the plan.

## Supporting materials

The additional progress screenshot is retained below. All screenshots above link to their full-size image.

::: details Additional screenshot — sync in progress

<div class="day2day-screenshot">

[![Assistant working on repository author identity and committing during the sync](./day2day/extra%20%E2%80%94%20sync%20in%20progress%20%28not%20needed%29.png)](./day2day/extra%20%E2%80%94%20sync%20in%20progress%20%28not%20needed%29.png)

</div>

_An intermediate progress capture, retained with the complete source material._

:::

## Related references

- [Team Collaboration](<../AI SDLC/01 Engagement/07 Contribution/01 Team Collaboration.md>) — contribution and review workflow
- [Collinson workspace](https://d39lj4dq6ly541.cloudfront.net/) — the client engagement featured in this case

---

[Presentation](index.md) · [Previous](<05 Getting Started Case.md>) · [Next](<07 Launching a New Client Engagement.md>)

<style>
.day2day-screenshot img {
  display: block;
  max-width: 100%;
  max-height: 420px;
  width: auto;
  margin: 0 auto;
}
</style>
