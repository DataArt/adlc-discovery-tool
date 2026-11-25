# How the Business Analysis Plugin Works

Suppose your team wants workshop notes every afternoon. Three choices belong to different people or files. The **meeting-notes skill** defines what good notes contain. A **job** tells the scheduler when to run that skill and where to deliver the draft. The **project team** chooses which meetings count and who can approve publication. Moving one team's review from 18:00 to 16:00 is a schedule change. Improving how every team records a decision is a skill change.

## What each part owns

| Part      | Responsibility                                                                                                               | Example in Business Analysis                                                                                                                                                                            |
| --------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Monorepo  | Source of truth for reusable definitions. A monorepo is one version-controlled repository that can contain several packages. | Maintainers edit the files under `plugins/business-analysis/` and review the changes together.                                                                                                          |
| Plugin    | Distribution. It packages those definitions for installation.                                                                | Team Skills lists Business Analysis. Its [manifest](../plugin.json) names the onboarding entry point and app dependencies.                                                                              |
| Project   | Context. It supplies the details that vary by team.                                                                          | The team selects its Jira project, Confluence space, glossary, calendars and reviewer during setup. Keep real project details in the workspace.                                                         |
| Skill     | Process. It specifies inputs, steps and the result a person should receive.                                                  | Meeting notes extracts decisions and actions. Story generation turns reviewed requirements into candidate stories with acceptance criteria.                                                             |
| Agent     | Competency. A role gives a specialist a question to focus on and a standard for reporting findings.                          | A requirements reviewer checks whether someone could test each acceptance criterion.                                                                                                                    |
| Job       | Trigger and execution policy. A template describes when to start, which skill to run, what it can read and where results go. | The weekly review reads the selected Jira and Confluence sources and returns findings. Onboarding registers a schedule after approval.                                                                  |
| Connector | Integration. It supplies operations the host can perform using an authorized account.                                        | Outlook Calendar can identify an event. Zoom can supply the recording and transcript when that account has access.                                                                                      |
| Eval      | Quality assurance. Give the skill a known input and compare its actual result with a stated expectation.                     | A tentative launch date should remain an open question. Today a maintainer can run this check in chat using the [meeting-notes result criteria](../skills/meeting-notes/references/result-contract.md). |
| Human     | Intent, judgment and authority. A person sets the goal, resolves uncertainty and approves consequential actions.             | The designated reviewer approves a specific notes revision and Confluence destination. For the hourly Zoom workflow, the reviewer sends the resulting Outlook draft.                                    |

## How work moves through the plugin

**Orchestration** means choosing the next procedure, passing along the relevant inputs, and returning the result to the person responsible. Onboarding does this during setup. Once setup is complete, a user can ask for any skill directly. A registered job can also start its named skill on schedule.

1. **Onboarding** connects apps one at a time, offers specialists and jobs, then checks what the workspace can actually run. “Recheck Jira” goes straight to that part of setup. [Onboarding overview](../skills/onboarding/Overview.md)
2. **Meeting notes** takes a transcript, notes or configured meeting sources and produces a private draft. For “Friday could work if QA signs off,” the reviewer should see a possible date and its condition. [Meeting notes overview](../skills/meeting-notes/Overview.md)
3. **Requirements analysis** can take reviewed workshop decisions and a stakeholder objective, identify gaps, and return clarification questions. A person resolves scope questions before using the baseline for planning. [Requirements analysis overview](../skills/requirements-analysis/Overview.md)
4. **Story generation** can take that baseline and produce candidate stories with traceability and testable acceptance criteria. A team with an existing baseline can start here by pasting it into chat. [Story generation overview](../skills/story-generation/Overview.md)

The last three steps illustrate one possible handoff. Each produces an output the user can review and choose to carry forward. The three bundled jobs have narrower assignments: daily discovery drafts meeting notes from calendar and messenger evidence, hourly Zoom review checks transcripts against recordings, and weekly requirements review looks for gaps and contradictions. All three scheduled runs are read-only. The separate interactive publication step checks the reviewer's approval. [Job templates and setup](../skills/onboarding/references/jobs.md)

## How specialist delegation works

**Delegation** means asking a specialist to examine part of the current task and return findings to the main conversation. In requirements analysis, the business analyst might read “users can export reports” and ask **which users and which reports**. The requirements reviewer might ask **what observable result counts as a successful export**. The main skill reconciles both findings against the brief, identifies the missing decisions and gives the user one review.

| Specialist               | Question to give it                                                              |
| ------------------------ | -------------------------------------------------------------------------------- |
| Business analyst         | Which actors, outcomes, constraints or business rules are missing?               |
| Requirements reviewer    | Can each requirement be traced to a source and tested?                           |
| Researcher               | Which approved sources support this claim, and where does evidence run out?      |
| Reviewer                 | Does the deliverable meet the stated criteria, and which issues matter most?     |
| Documentation specialist | Where would inconsistent terminology or an unclear statement mislead the reader? |

Requirements analysis explicitly describes optional delegation to the first two roles. The other roles are available for suitable assignments. Give each specialist a bounded question, approved sources and an expected result. Ask it to return evidence, impact, uncertainty and a recommendation. The main session owns the combined answer, and the human owns the decision. A role inherits the access its host provides. If delegation is unavailable, the main session can apply the role instructions in sequence and describe how the review ran. [Specialist definitions and setup](../skills/onboarding/references/agents.md)

For decisions about which file or workspace setting to change, use the [maintenance guide](Maintain%20the%20Business%20Analysis%20Plugin.md).
