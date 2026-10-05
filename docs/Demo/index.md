---
aside: false
outline: [2, 3]
---

# ADLC Discovery — presentation materials

A 60-minute introduction to the tool’s **capabilities, evidence chain, and collaboration**, with firsthand feedback from two nontechnical contributors and a five-minute Collinson example near the end.

This index contains the complete session narrative and links to the illustrated section pages. Each section page combines audience takeaways, repository visuals, speaker narration, live navigation cues, and a transition.

## Presentation focus

The main subject is **the ADLC Discovery Tool: its capabilities, its evidence chain, and how people collaborate through it**. Demonstrate these in the workspace throughout the presentation. Two colleagues share firsthand feedback from nontechnical contributor roles. A short real-world example brings these ideas together at the end, before discussion.

Three questions organize the presentation:

1. **Capabilities:** What can the team do with the tool, and what does each capability produce?
2. **Evidence chain:** How can someone trace a conclusion to its source, inspect the reasoning, and see what still needs validation?
3. **Collaboration:** How do people contribute, use AI assistance, review changes, and track progress together?

The narrative is: **why we need the tool → what it provides → how the engagement works → how people contribute → how to start → a concrete example**.

By the end, participants should be able to identify the main capabilities, follow the evidence chain, and explain how they would contribute. Methodology and setup provide the context for using the tool. The real case illustrates those ideas in the final five minutes of presentation content.

## Run of show

| Time        | Section page                                                      | Main visual                                                     |
| ----------- | ----------------------------------------------------------------- | --------------------------------------------------------------- |
| 00:00–05:00 | [The discovery challenge](<01 The Discovery Challenge.md>)        | Existing handoff and governed-context illustrations             |
| 05:00–15:00 | [Tool capabilities](<02 Tool Capabilities.md>)                    | Process model and capability tour                               |
| 15:00–20:00 | [Engagement flow](<03 Engagement Flow.md>)                        | Three phases, four gates; investigation flow                    |
| 20:00–23:00 | [Evidence chain](<04 Evidence Chain.md>)                          | Evidence chain; review and correction flow                      |
| 23:00–38:00 | [Collaboration and contributor experience](<05 Collaboration.md>) | Collaboration flow, desktop screenshots, two contributor voices |
| 38:00–45:00 | [Starting an engagement](<06 Starting an Engagement.md>)          | Initiation flow, bootstrap stages, contributor entry point      |
| 45:00–50:00 | [Collinson: a real-world example](<07 Collinson Example.md>)      | Collinson evidence thread and unresolved pilot boundary         |
| 50:00–60:00 | [Discussion and next steps](<08 Discussion and Next Steps.md>)    | Discussion board and action table                               |

The engagement-flow and evidence-chain pages share the original eight-minute methodology slot. The two contributors each retain four minutes within the collaboration section.

The source engagement flow gives indicative phase durations: Investigate 1–3 weeks, Solution 1–2 weeks, and Roadmap 1 week. These are methodology estimates, not a committed client schedule; duration labels are omitted from the section-page diagram.

## How to use the pages

- **Audience takeaway and main visual:** suitable as the basis for a slide or a page shown during the session.
- **Speaker script:** phrasing to rehearse and adapt, rather than text to place on a slide in full.
- **Supporting visuals:** optional depth for questions; do not present every diagram at the same pace.
- **Navigation cues:** the repository page or actual client artifact to open during a tool walkthrough.

Mermaid diagrams remain editable and render in the repository’s VitePress setup. Images use the existing repository assets through relative links so they can also be read in a Markdown viewer. No new product screens or testimonials are invented.

## 1. The problem we’re solving

**Time:** 5 minutes. **On screen:** scattered context, broken handoffs, and uncertainty about where AI can help.

### Presenter narrative

> Today I want to introduce the ADLC Discovery Tool: what it is, how we use it to run discovery, and how different people can contribute. We’ll also hear directly from two colleagues about their experience using it. At the end, I’ll show a short example from a real engagement.
>
> The starting problem is familiar: understanding is spread across conversations, meeting notes, tickets, and documents. Different people hold different parts of the picture. When work changes hands, the next person often needs to reconstruct why a decision was made.
>
> When we add the question “Where could AI help?”, we need to understand the existing workflow, the actual problems, and the outcomes the organization wants. Otherwise, it is difficult to explain why a particular intervention is worth trying.
>
> ADLC Discovery gives the team a shared structure for gathering that context, reviewing it, and developing a solution and delivery plan.

**Audience prompt:** “Where do you most often have to reconstruct context in your work?”

Take one or two responses. Keep this focused on the general challenge; save the detailed client story for section 6.

### Transition

> Let me show you what the tool brings together and how its workspace is organized.

## 2. What ADLC Discovery is

**Time:** 10 minutes. **On screen:** overview slide, then the tool’s documentation site.

### Definition — 2 minutes

> ADLC Discovery combines an engagement methodology, workshop materials, shared documentation, and AI-assisted workflows. It provides a structure for understanding a client’s development lifecycle and deciding where changes, including AI adoption, could help.
>
> The methodology organizes the work. Workshops capture evidence and stakeholder perspectives. Documentation keeps the team’s understanding and decisions available. AI workflows help process that material and prepare it for review.

### Guided workspace tour — 6 minutes

Use the tool’s structure to explain where people go and what they do. Show representative pages or templates; there is no need to introduce a client narrative here. Identify templates as templates.

Frame each stop as a capability and show the corresponding artifact. Let the audience see what they can do, alongside where the material lives.

| Capability                               | Visible demonstration                                                                                |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Organize discovery                       | Open the engagement process and workshop agenda structure                                            |
| Capture and structure evidence           | Show the relationship between a transcript, notes, and outcomes                                      |
| Develop and inspect findings             | Show current-state, domain, and problem structures and their source references                       |
| Connect findings to intended outcomes    | Show where solution goals link to problems and strategic intent                                      |
| Structure solution and delivery planning | Show target-state, pilot, and roadmap artifacts, explaining current automation limits                |
| Assist contributors with AI              | Show a rehearsed prompt and its source-linked response during section 4                              |
| Review work and track progress           | Show contribution guidance, a review example where available, and the phase tracker during section 4 |

| Area           | What to show                                               | Presenter wording                                                                                       |
| -------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Engagement     | Process and “Where We Are” pages                           | “This is where we orient ourselves: how the engagement works, its current phase, and what is next.”     |
| Capture        | Workshop agenda, transcript, notes, and outcomes structure | “This is where we keep what we heard and learned, with the source material available for later review.” |
| Problem Space  | Domain pages and problems registry                         | “Here we organize observations and develop supported diagnoses of the problems.”                        |
| Goals          | Strategic intent and solution goals                        | “Here we connect what leadership wants to achieve with the improvements justified by the findings.”     |
| Solution Space | Target state, pilot, scale, and evolve structure           | “This organizes the proposed approach and how we intend to test and develop it.”                        |
| Roadmap        | Milestones, work breakdown, and timeline                   | “This turns the agreed solution into work that can be sequenced, staffed, and planned.”                 |

After the tour:

> The site gives people a way to read and navigate this shared material. The documents and workflows sit in the repository, where contributions can be changed and reviewed. We’ll look at that contribution experience shortly.

### What connects the areas — 2 minutes

> These sections are connected. A problem should point back to evidence. A solution goal should address a diagnosed problem and be assessed against strategic intent. A proposed solution should explain which goals it covers.
>
> Those connections let a colleague check the reasoning, question an interpretation, or understand the effect of a change without relying entirely on the person who wrote the document.

### Transition

> That is the workspace. Now let’s look at how the team moves through it during an engagement.

## 3. How an engagement runs

**Time:** 8 minutes. **On screen:** phases and gates, then the evidence-chain diagram.

### Phases and review decisions — 5 minutes

| Phase       | Main question                                                             | Closing decision                                                                 |
| ----------- | ------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Investigate | What is happening, which problems are evidenced, and what should improve? | Gate 1: agree on findings and prioritized solution goals                         |
| Solution    | What approach addresses those problems and goals?                         | Gate 2: approve target-state and pilot designs, plus scale design where included |
| Roadmap     | What will delivery require, and in what sequence?                         | Gate 3: sign off milestones, work breakdown, team composition, and timeline      |

### Presenter narrative

> We begin with Gate 0, the kickoff. We capture and review strategic intent and an early direction. That gives discovery a starting point, while keeping early ideas open to validation.
>
> Investigate establishes the current state, diagnoses problems, and develops solution goals. Workshops help us fill gaps and test interpretations. We may need several passes before the findings are ready for review.
>
> Solution develops the target approach and pilot design. Roadmap establishes the sequence of work, dependencies, and team needed to deliver it.
>
> The gates make the decisions explicit. We move forward when the required material has been reviewed and the closing criteria are met. The calendar helps us plan, but the evidence and agreement determine readiness.

### Evidence and revision — 3 minutes

Show: strategic intent + workshop evidence → current state and domain findings → problems → solution goals → solution → roadmap.

Demonstrate how the links work in the workspace: open a problem’s evidence reference, show the source it points to, then show where a goal references the problem. Use prepared representative material with its status clearly labeled. Save the real client’s context and results for section 6. If a template has no populated links, explain the expected connection without presenting it as an existing trace.

> Strategic intent tells us what the organization wants. Workshop evidence helps us understand the situation. The goals bring those threads together, and the solution and roadmap build on them.
>
> If new evidence changes a diagnosis, we revisit the dependent goals and solution choices. We preserve the original workshop record and record the later correction, so the team can understand why the interpretation changed.
>
> This describes the engagement method. The degree of AI assistance depends on the workflow currently available and the review needed at that step.

**Presenter note:** The repository currently labels `/discovery-solution` and `/discovery-roadmap` as stubs. Explain the complete methodology without claiming that every phase is already automated end to end.

### Transition

> The next question is how people actually participate in this structure. This is also where I’d like to bring in two colleagues’ experience.

## 4. How the team uses it

**Time:** 15 minutes. **On screen:** contribution flow, speaker names and roles, then a progress page.

### Host: collaboration and AI assistance — 4 minutes

Show the contribution flow: capture → AI-assisted processing → human review → publication → progress update.

> People contribute their knowledge through workshops, source material, corrections, and reviews. The person running a workshop captures the discussion. Contributors use the workspace and an AI assistant to help organize that material and prepare updates. The team reviews the changes before treating them as shared conclusions.
>
> AI can help us navigate the context, prepare drafts, and identify gaps or inconsistencies. We still need people to check whether an interpretation is accurate and whether a decision is justified.
>
> Changes are reviewed through the repository contribution process. For contributors, the practical questions are: what am I trying to update, what supports that update, who needs to review it, and how do I know it has been accepted?

Show where contribution guidance lives. Briefly explain branches and pull requests as a proposed set of changes and its review; adjust the level of technical detail to the audience.

An optional short AI interaction can use this read-only prompt:

> Explain the engagement structure and where a workshop contributor should begin. Cite the relevant guidance and identify which steps need review. Do not modify files.

Use a saved interaction if a live response would interrupt the pacing.

### Getting started case — 4 minutes

**Case introduction:**

> This case explores the first contribution: the task, the starting material, the support needed, and what helped the contributor get started.

Questions to explore:

- What were you trying to do with the tool?
- What could you do yourself, and where did you need support?
- How did you interact with the AI assistant and review its output?
- What felt unfamiliar or confusing?
- What advice would you give someone in a similar role?

Case outline, completed from actual contributor feedback:

> Task: [TASK]. Starting point: [INPUT OR GUIDANCE]. Workflow and reviewed output: [WORKFLOW / OUTPUT]. Friction: [FRICTION]. Helpful support: [SUPPORT]. Advice for a new contributor: [ADVICE].

A brief view of the contribution can illustrate the case. Keep the focus on using the tool rather than the surrounding client history.

### Day-to-day collaboration case — 4 minutes

**Case introduction:**

> This case explores day-to-day collaboration: finding context, sharing a contribution, reviewing it with others, and identifying what could work better.

Questions to explore:

- How did you find the context you needed?
- How did you share a contribution or ask for a correction?
- How did you know what was ready and what still needed review?
- Where did the AI assistant help, and where did you need a person’s judgment?
- What would make the tool easier for you to use?

Case outline, completed from actual contributor feedback:

> Task: [TASK]. Context source: [LOCATION]. Contribution and review: [CONTRIBUTION / REVIEW ROLE]. Useful aspects: [OBSERVATION]. Difficulties: [OBSERVATION]. Suggested improvement: [IMPROVEMENT].

Introduce both colleagues by their actual roles. Invite honest feedback about usefulness, onboarding, friction, and limitations. Their accounts should reflect their experience, without a scripted endorsement or invented benefit.

### Host: reflection and progress tracking — 3 minutes

Ask one follow-up grounded in what the speakers said, such as: “What support would make the next person in your role comfortable contributing?”

Then show the “Where We Are” page and a phase tracker. If using the starter workspace, explicitly identify unfilled status fields.

> These pages are where we track the engagement’s current position, open items, and next actions. Progress depends on the work and reviews actually completed. The presence of a document alone does not mean that its contents are approved.

Connect the speakers’ observations to the relevant guidance or workflow. Avoid promising that a difficulty is resolved unless that has been verified.

### Transition

> With that view of how people use the tool, let’s look at what it takes to start a new engagement.

## 5. Starting a new client engagement

**Time:** 7 minutes. **On screen:** setup inputs and a prepared bootstrap result.

### Presenter narrative — 3 minutes

> We start by preparing a client workspace and collecting the context that gives the engagement direction: who the client is, why the engagement exists, who is sponsoring it, the known constraints, and the people involved.
>
> The bootstrap flow covers repository and environment preparation, client personalization, infrastructure and deployment, and the publishing pipeline. The technical owner handles the technical setup. The engagement team supplies and reviews the client context and responsibilities.
>
> Once the workspace is ready, we review strategic intent and early direction at kickoff and plan the first evidence-gathering activities.

how tailor it to your account

### Tool walkthrough — 4 minutes

1. Show the required engagement inputs: identity, sponsor intent, team roles, constraints, and initial source material.
2. Introduce `/bootstrap-client` as the guided setup workflow.
3. Show a prepared result: client context, team responsibilities, and the workshop structure.
4. Explain what is ready to use and which engagement content still needs to be captured or reviewed.
5. Identify the technical setup contact and engagement lead: [NAMES OR ROLES].

Show the setup flow and its result within this segment; reserve full installation and deployment for separate onboarding.

### Transition

> We’ve covered the tool, its method, how people contribute, and how to get started. I’ll finish with a short real example so you can see those pieces together.

## 6. A real case in practice

**Time:** 5 minutes. **On screen:** two or three selected artifacts from the actual engagement.

The purpose is to bring the three main ideas together in a real setting: a capability used, the evidence behind a finding, and the people who contributed or reviewed it. Choose one clear thread and rehearse direct navigation. Avoid a full client history or a second explanation of the methodology.

| Time      | Show                                                | Presenter narrative                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| --------- | --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 minute  | Case overview and actual status                     | “This is the Collinson Route-to-Live engagement. It aims to find where AI can remove the hand-off and context losses that keep pre-code work slow, starting with a Phase 1 pilot squad, and is currently in Solution — Gate 1 closed by engagement-lead direction on 1 October 2026, Gate 2 not yet scheduled. I’ll show one finding: hand-offs lose information at stage boundaries, the engagement’s most corroborated problem.”                                                                                                                   |
| 2 minutes | Source evidence and its linked interpretation       | “This came from WS08, a workshop with Akshay Shrivastav. We recorded that a pre-announced API change wasn’t implemented by the downstream squad, causing a full production revert the week before the session, and connected it to P-02 — Hand-offs Lose Information Between Stages — confirmed across five SDLC domains and corroborated by over a dozen workshops. Here is the supporting link, and here is what remains uncertain: P-02 grounds Solution Goal SG-02, still 🔄 Shaped — evidenced, not yet confirmed goal-by-goal with Collinson.” |
| 2 minutes | Furthest actual downstream artifact and next action | “That feeds the Pilot draft’s own open boundary: UI design is scoped as conditional, ‘when relevant,’ rather than settled — the live trace of Gate 1’s unresolved pilot-candidate disagreement between the CTO’s API/back-end-only proposal and the VP of Software Development’s UI-inclusive counter-proposal. Its review status is Draft — scope not yet agreed. The next action is resolving that disagreement ahead of WS05, jointly owned by Collinson and DataArt.”                                                                            |

Within this walkthrough, identify who contributed and reviewed the material: “Akshay Shrivastav surfaced the hand-off failure at WS08; the DataArt discovery team synthesised it into P-02 and Solution Goal SG-02; Collinson and DataArt jointly own resolving the pilot-candidate decision it feeds into.” Use the actual division of work in the case.

**Reference trail for this thread:** WS08 → P-02 — Hand-offs Lose Information Between Stages → SG-02 — Make hand-offs lossless → Pilot Overview → Gate 1 Outcomes (03 September 2026). Open these in the Collinson workspace; see the [case page’s artifact locators](<07 Collinson Example.md#open-these-in-the-collinson-workspace>).

Where the case has reached a pilot or roadmap, show the relevant connection briefly. If it has not, end at the current stage and state what is needed next. A proposed pilot is not an executed pilot; a target is not a measured result.

### Transition

> That is one concrete application of the structure we’ve discussed. Let’s turn to your questions and where you could see this fitting into your work.

## 7. Discussion and next steps

**Time:** 10 minutes. **On screen:** discussion prompts and a short action table.

**usage areas**

### Discussion — 7 minutes

Start with audience questions. Use these prompts if needed:

- Which part of the tool would be most useful in your role?
- What remains unclear about contributing or reviewing work?
- What support would you need to get started?
- Where could we apply this approach next?

Invite both colleagues to answer questions about their own experience. Capture detailed technical setup questions for follow-up when necessary.

### Next steps and closing — 3 minutes

> Let’s agree on the next useful step: who wants to explore the tool, which engagement could use it, and what support is needed.

| Action                                                     | Owner   | Timing |
| ---------------------------------------------------------- | ------- | ------ |
| Share tool access and contribution guidance                | [OWNER] | [DATE] |
| Identify a candidate engagement or onboarding session      | [OWNER] | [DATE] |
| Follow up on unanswered questions and contributor feedback | [OWNER] | [DATE] |

Fill in only actions the group agrees to.

> We’ve looked at how ADLC Discovery organizes the work, how people contribute, and what starting an engagement involves. Thank you to [PERSON 1] and [PERSON 2] for sharing their experience. Our agreed next step is [ACTION], with [OWNER] taking it forward by [DATE].

## Slide outline

| Slide                          | Content                                                                |
| ------------------------------ | ---------------------------------------------------------------------- |
| 1. ADLC Discovery Tool         | Session purpose and agenda                                             |
| 2. The discovery challenge     | Scattered context, broken handoffs, and choosing where AI can help     |
| 3. What the tool provides      | Methodology, workshops, shared documentation, and AI workflows         |
| 4. Workspace structure         | Engagement, Capture, Problem Space, Goals, Solution Space, and Roadmap |
| 5. Engagement phases and gates | Investigate → Solution → Roadmap and review decisions                  |
| 6. Evidence and decisions      | Source links, derived artifacts, and handling corrections              |
| 7. Working together            | Contribution flow, AI assistance, human review, and progress tracking  |
| 8. Contributor experience      | Two colleagues’ names, roles, and feedback themes                      |
| 9. Starting an engagement      | Inputs, setup responsibilities, and bootstrap result                   |
| 10. Real case example          | One brief evidence-to-decision thread with its actual status           |
| 11. Discussion and next steps  | Questions and agreed actions                                           |

Switch into the workspace where useful during the tool overview, collaboration, and setup sections. These walkthroughs explain the tool itself; the dedicated client example remains in section 6.

## Preparation and rehearsal

- Replace speaker names, roles, setup contacts, and closing action placeholders before presenting where known.
- Brief both colleagues on their distinct focus and rehearse four-minute contributions. They may reference small examples without turning their slots into case presentations.
- Prepare representative tool pages, one AI interaction or saved response, and a setup result. Clearly distinguish templates from populated engagement content.
- For the final example, prepare the approved case label, one source excerpt, its linked finding, actual review status, and next action. Use only case details supported by the engagement material.
- Prepare screenshots as a fallback for workspace or AI delays.
- Rehearse the case to five minutes. If time is tight, simplify navigation and preserve both contributor voices and the discussion.

## Repository references

- [How the Engagement Runs](<../AI SDLC/01 Engagement/03 Process/03 How the Engagement Runs.md>) — phases and gate criteria.
- [Evidence Chain](<../AI SDLC/01 Engagement/03 Process/04 Evidence Chain.md>) — connections between intent, evidence, and derived artifacts.
- [Team Collaboration](<../AI SDLC/01 Engagement/07 Contribution/01 Team Collaboration.md>) — contribution and review workflow.
- [Quick Walkthrough](<../AI SDLC/01 Engagement/07 Contribution/06 Quick Walkthrough.md>) — tool navigation, status, and evidence prompts.
- [Initiation](<../AI SDLC/01 Engagement/05 Workflows/01 Initiation.md>) — strategic intent, early direction, and kickoff preparation.
- [Engagement Status](<../AI SDLC/01 Engagement/04 Where We Are/01 Engagement.md>) — the status-page template.

## Visual provenance

| Material                                   | Source                                                                                                             | Treatment                          |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------- |
| Handoff and governed-context illustrations | [01 From Broken Handoffs to Governed AI](<../The Story/01 From Broken Handoffs to Governed AI.md>)                 | Existing visual reused             |
| Process model                              | [01 Overview](<../AI SDLC/01 Engagement/03 Process/01 Overview.md>)                                                | Existing visual reused             |
| Engagement gates                           | [03 How the Engagement Runs](<../AI SDLC/01 Engagement/03 Process/03 How the Engagement Runs.md>)                  | Duration labels omitted            |
| Investigation flow                         | [00 Orchestration](<../AI SDLC/01 Engagement/05 Workflows/03 Investigate/00 Orchestration.md>)                     | Existing visual reused             |
| Evidence chain                             | [04 Evidence Chain](<../AI SDLC/01 Engagement/03 Process/04 Evidence Chain.md>)                                    | Existing visual reused             |
| Gate review                                | [02 Gate Review](<../AI SDLC/01 Engagement/05 Workflows/02 Gate Review.md>)                                        | Existing visual reused             |
| Collaboration flow                         | [01 Team Collaboration](<../AI SDLC/01 Engagement/07 Contribution/01 Team Collaboration.md>)                       | Existing visual reused             |
| Workshop processing                        | [01 Capture - Current State](<../AI SDLC/01 Engagement/05 Workflows/03 Investigate/01 Capture - Current State.md>) | Existing visual reused             |
| Initiation flow                            | [01 Initiation](<../AI SDLC/01 Engagement/05 Workflows/01 Initiation.md>)                                          | Existing visual reused             |
| Contributor interface screenshots          | [03 Codex Desktop Setup](<../AI SDLC/01 Engagement/07 Contribution/03 Codex Desktop Setup.md>)                     | Existing visual reused             |
| Review interface screenshot                | [02 Claude Desktop Setup](<../AI SDLC/01 Engagement/07 Contribution/02 Claude Desktop Setup.md>)                   | Existing visual reused             |
| Collinson case diagram                     | [User-populated narrative](#_6-a-real-case-in-practice) and the repository evidence-chain model                    | Adapted; pending statuses retained |

## Rehearsal checklist

- Confirm the two speaker names and roles; send the prompts from the collaboration page.
- Open the capability, evidence, collaboration, and setup pages in presentation order.
- Prepare one short AI interaction, with a saved response as fallback.
- Open the actual Collinson workspace and verify the source records and latest statuses. Its populated evidence is not present in this checkout.
- Keep the real case to five minutes and preserve time for contributor feedback and discussion.
- Use the source references to explain a detail rather than adding more diagrams to the main sequence.

## Source and maintenance

This index consolidates the session narrative, including the Collinson material supplied by the user. The linked section pages provide the illustrated presentation material. Copied diagrams are snapshots of the linked repository sources; refresh them if those flows change. Keep the index narrative and the corresponding section page aligned when editing the presentation.
