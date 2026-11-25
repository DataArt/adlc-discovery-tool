---
name: setup-connections
description: Guide a user through connecting and verifying Flow Check's workplace apps one at a time. Use for initial setup, resuming setup, or checking connection status.
---

# Set up connections

Guide the user through the following apps in order, starting with the first that needs attention. Follow the user's preferred order if given. The bundled `../../.app.json` contains the required app IDs.

| Step | ChatGPT listing                                                                           | Services to verify         |
| ---- | ----------------------------------------------------------------------------------------- | -------------------------- |
| 1    | [Atlassian](https://chatgpt.com/plugins/plugin_asdk_app_6a83901dde988191b3f3cefdcc19acfa) | Jira and Confluence        |
| 2    | [Zoom](https://chatgpt.com/plugins/plugin_asdk_app_69373a13116c819189d046aea1278836)      | Zoom                       |
| 3    | [Teams](https://chatgpt.com/plugins/teams)                                                | Microsoft Teams            |
| 4    | [Outlook Email](https://chatgpt.com/plugins/outlook-email)                                | Microsoft Outlook mail     |
| 5    | [Outlook Calendar](https://chatgpt.com/plugins/outlook-calendar)                          | Microsoft Outlook calendar |

**Find the next step.** Use available connection metadata and the current conversation to resume. Resolve declared dependencies using Plugin Management when available. If needed, search for the current listing, resolve its dependency metadata, and match its app ID to the manifest. Use the returned canonical plugin ID for installation suggestions. Track installation separately from authorization. If an app already has usable tools, verify it immediately.

**Give one action at a time.** For a missing plugin, use the native installation suggestion for this connector when eligible. For an installed app awaiting authorization, use the host's connection action if available. Always include the current connector's clickable listing as a fallback. Name the next button the user should look for: Install for a new plugin, Connect for an installed app awaiting sign-in. Sign-in and consent take place in the provider UI. Only say a dialog opened when the host confirms it.

Keep the first message as short as this example, adapting it to the observed state:

> **Step 1 of 5 · Atlassian**
> One sign-in covers Jira and Confluence. [Open Atlassian](https://chatgpt.com/plugins/plugin_asdk_app_6a83901dde988191b3f3cefdcc19acfa), choose **Install** if shown, then **Connect** and sign in with your work account.
> When you return, reply **Done** and I’ll check both connections. You can also say **Skip**.

**Verify before advancing.** On a connection event or a reply such as Done, refresh available tools and check the current connector. Use the smallest read-only account or service metadata request available. Check Jira and Confluence separately. If only content reads are available, ask for a single sample the user chooses and report only whether it was accessible. A user reply, directory listing, or installed flag alone does not verify access.

Show the result in one line, for example “Jira ✓ Verified · Confluence ✓ Verified · 2 of 6 services verified.” Then present the next connector that needs attention in the same reply. If a check fails, say exactly what happened and give one recovery action with the relevant link. Distinguish a sign-in request, explicit admin restriction, and unavailable verification tool. Let the user retry or skip. Remember skipped services for the current run and revisit them on request. If the user returns in a new chat, reconstruct progress from available evidence.

On completion, pause, or an explicit status request, show the verified count and any outstanding services with their next actions. Reserve the full status list for those occasions. Report completion only after all six services pass.
