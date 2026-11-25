---
name: setup-connections
description: Set up or check the Flow Check pilot's Jira, Confluence, Zoom, Microsoft Teams, Outlook Email, and Outlook Calendar connections when the user runs plugin setup or asks to connect these services.
---

# Set up connections

Check readiness of the six services declared in the plugin's bundled `../../.app.json`. ChatGPT manages the declared app dependencies and their connection UI. Treat Outlook as Microsoft work email and Microsoft Calendar as Outlook Calendar. Use these mappings:

| Services                | Plugin to find   |
| ----------------------- | ---------------- |
| Jira and Confluence     | Atlassian        |
| Zoom                    | Zoom             |
| Microsoft Teams         | Teams            |
| Microsoft Outlook email | Outlook Email    |
| Microsoft calendar      | Outlook Calendar |

Inspect the current tools and connection evidence first. Use Plugin Management to resolve this plugin's dependency metadata when that capability is available. Check each declared app's connection using its verified ID. If a plugin is already installed, check whether its tools and account connection are usable. Installation alone is insufficient evidence of authorization.

Direct the user to the required app's connection flow in Flow Check's plugin settings when authorization is pending. Let the user complete provider sign-in and consent in the supported connection UI. Resume from confirmed connection state after they return and preserve progress across reruns. If dependency resolution is unavailable, use the bundled app IDs and report any missing tools as unverified. If a required app is unavailable to the workspace, report it as blocked and identify the needed administrator action when known.

Verify each authorized connection with the smallest available read-only account, resource, or metadata request. For Atlassian, verify Jira and Confluence access separately. Prefer account or accessible-resource metadata. If verification requires reading actual content, ask for a sample issue, page, meeting, channel, message, or calendar to check and limit the read to that sample. Report verification status without reproducing private content. A successful empty response can verify an API connection, but leaves access to a particular resource unverified.

Keep setup limited to connection checks. Ask the user to resolve account ambiguity or provider-required admin approval in the supported UI. Handle secrets through that UI. Treat permission errors, missing tools, and pending authorization as distinct blockers.

Finish with a six-row table showing service, selected plugin, verification status, and any next action. Use statuses such as Verified, Awaiting authorization, Installed but unverified, Requires admin approval, or Unavailable in this session. Confirm complete setup only when all six services have successful verification evidence. Offer the existing Flow Check skill as the next pilot test.
