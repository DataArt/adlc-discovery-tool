# Connect one app at a time

For full onboarding, follow manifest order unless the user chooses another. Resume with the first outstanding service in scope. A Jira-only request needs only the Jira check. Use the manifest's required flags to distinguish required from optional checks. Atlassian has one install and sign-in step with two independent service checks.

| App and listing fallback                                                                  | Why connect it                                                   | Smallest useful read in the intended workspace                                                     |
| ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| [Atlassian](https://chatgpt.com/plugins/plugin_asdk_app_6a83901dde988191b3f3cefdcc19acfa) | Jira supplies backlog context and Confluence holds requirements. | Read the selected Jira project's metadata and the selected Confluence space's metadata separately. |
| [Zoom](https://chatgpt.com/plugins/plugin_asdk_app_69373a13116c819189d046aea1278836)      | Locate source meetings for meeting notes.                        | Read metadata for one user-selected meeting in the work account.                                   |
| [Teams](https://chatgpt.com/plugins/teams)                                                | Locate stakeholder discussions.                                  | Read metadata for one selected team or channel.                                                    |
| [Outlook Email](https://chatgpt.com/plugins/outlook-email)                                | Locate requirements or decisions shared by email.                | Check work mailbox metadata, or access one user-selected message.                                  |
| [Outlook Calendar](https://chatgpt.com/plugins/outlook-calendar)                          | Identify meeting context for discovery work.                     | Read the intended calendar's metadata, or access one selected event.                               |

**Resolve the current app.** Check the tools and connection state the host exposes. If read tools are usable, go straight to verification. Where Plugin Management is available, use its dependency lookup for the Business Analysis plugin. If necessary, search for the connector listing and match its dependency app ID against the packaged ID. Use the returned canonical plugin ID for the installation suggestion.

**Present one action in chat.** For a missing app, invoke the host's native installation suggestion (such as Plugin Management's suggest_plugins) for this app alone when eligible. For an installed app needing authorization, invoke its native connection action when available. Include the clickable listing for the current app as a fallback. Describe a dialog as open only if the host confirms it. If the host lacks a dialog, direct the user to the listing. Sign-in and consent happen in the provider UI. Never ask for passwords, tokens or codes in chat.

Example for full onboarding when Atlassian needs sign-in (adapt the step count to the selected apps):

> **Step 1 of 5 · Atlassian**  
> Connect Atlassian to read your Jira backlog and Confluence requirements. Choose **Connect** in [Atlassian](https://chatgpt.com/plugins/plugin_asdk_app_6a83901dde988191b3f3cefdcc19acfa). Reply **Done** when signed in, or **Skip** to move on.

**Verify and advance.** Wait for the connection event or reply. On Done, refresh the tools and make the smallest supported read from the table. If only content reads are available, use one sample chosen by the user. Keep external resources unchanged and report only access and scope. Account access alone leaves a requested project or resource unverified. A successful metadata read verifies only the capability exercised.

Give the result in one line, then present the next unresolved connector in the same reply. On failure, identify the observed issue (sign-in required, permission denied, target unavailable, or no verification tool), give one recovery action and allow retry or skip. Preserve successful checks, including a single successful Atlassian service. Leave skipped services outstanding and continue. When resuming in a new chat, reconstruct progress from current evidence and recheck as needed.
