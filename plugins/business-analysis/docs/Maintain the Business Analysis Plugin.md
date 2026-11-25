# Maintain the Business Analysis plugin

## Decide where the change belongs

Start with who should see the change. If one team wants a different reviewer, schedule or destination, rerun the relevant part of onboarding in that workspace. If every future installation should behave differently, edit the packaged definition. The [architecture guide](How%20the%20Business%20Analysis%20Plugin%20Works.md) explains the responsibilities of each part.

| Request                                                      | First place to look                                                                                                                          |
| ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| “Run our review on Tuesday.”                                 | Ask onboarding to update this project's registered job. Check its saved cadence and timezone.                                                |
| “Every new weekly review should default to Tuesday.”         | Change the weekly job template and the default shown in the setup guide. Existing schedules need a separate update.                          |
| “Notes keep presenting suggestions as decisions.”            | Review the meeting-notes result contract and drafting instructions. Test with a transcript that contains both a suggestion and an agreement. |
| “Our specialist misses ambiguous deadlines.”                 | Inspect the relevant agent definition, try it on a known ambiguity, then compare the updated role with the installed project copy.           |
| “The job sees the invitation but cannot summarize the call.” | Run the environment check for the scheduled identity. Verify that it can read actual meeting evidence for the same occurrence.               |

## Maintain an existing installation

| When something changes                                | What to do                                                                                                                                                                                            |
| ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A project moves or access expires                     | Ask to recheck the named source. Reauthorize if prompted, then verify a read against the new project, space or channel.                                                                               |
| The reviewer, destination or reporting window changes | Ask to rerun setup for the named job. Identify the existing task by project and owner, preview the revised settings, and approve the update. Read back the registered task and check its next result. |
| A scheduled result is empty or incomplete             | Check the reported time window and source coverage. Dry-run against a known occurrence or requirement. Compare the interactive and scheduled identities if their results differ.                      |
| A specialist role changes                             | Rerun agent setup for that role. Compare the packaged and installed definitions, review any local customizations, and verify discovery after applying the selected change.                            |

## Maintain the plugin source

Keep client names, project glossaries, meeting filters and destination IDs in the workspace configuration. Use generic examples in repository files and keep original client documents and archives outside the checkout.

Edit the files in `plugins/business-analysis/` directly. The package is self-contained and has no build or shared-file synchronization step.

| Change                                 | Files to update together                                                                                                                                                                                                                                    |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Skill behavior                         | Edit its `SKILL.md` and relevant references. Update its `Overview.md` when the reader-facing flow or integrations change. For a new skill, add it to the [catalog](../skills/onboarding/references/skill-guide.md) and [README](../README.md).              |
| Connector dependency                   | Use the verified app ID in the [app manifest](../.app.json). Align the [connection procedure](../skills/onboarding/references/connections.md), [readiness checks](../skills/onboarding/references/environment-check.md), and any affected job dependencies. |
| Specialist role or job template        | Edit the TOML in [agents](../agents/) or the JSON in [jobs](../jobs/) and update its onboarding reference. Reconcile installed role copies and registered schedules through setup so project-specific changes are reviewed.                                 |
| Plugin name, icon or setup entry point | Edit the [plugin manifest](../plugin.json). For a source move or plugin identifier change, also update the entry in the repository’s `.agents/plugins/marketplace.json`.                                                                                    |

After editing, parse the affected JSON, TOML or skill frontmatter and resolve local links from the file that contains them. Confirm that each changed job names a packaged skill and declared connectors. Load the updated package in the intended host and exercise the changed path. For example, give meeting notes a transcript containing a tentative deadline and check that the draft preserves the uncertainty. For a scheduler change, inspect the saved task and its first result under the scheduled identity. [Meeting-notes result criteria](../skills/meeting-notes/references/result-contract.md)

## Test a change before sharing it

For a small evaluation, write down a sample input and the result you expect, then compare it with the result you observe. Use invented project details. For a change to how decisions are recorded, try this in a private chat with the updated plugin:

> Use Meeting notes on this excerpt. Maya said, “I'll send the estimate. Friday could work for launch if QA signs off.” Lee confirmed, “We decided the pilot will cover one team.”

Check the draft for three things. Maya owns sending the estimate and has no stated due date. Friday remains conditional on QA. The pilot scope is recorded as one team, linked to Lee's statement. If the draft turns Friday into a commitment, revise the drafting instruction or result contract and repeat the same example. Compare the output with the [meeting-notes criteria](../skills/meeting-notes/references/result-contract.md).

For a job change, also preview its exact prompt, schedule, identity and destination. A dry run shows what that invocation can produce. Inspect the saved task and its first scheduled result to verify the recurring path. For a connector change, test one known resource in the intended project. Record what you checked and any capability you still need to verify when sharing the update.
