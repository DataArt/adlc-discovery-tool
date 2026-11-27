# Confluence meeting notes

## Page title

Use `YYYY-MM-DD - Meeting title from calendar`. Take the meeting date and title from the original Outlook calendar event. For a manual request without a calendar event, use the same format with the confirmed date and title. Ask the reviewer for either value if it is missing before publication.

Example: `2026-11-24 - Payment Export Refinement`.

## Page body

Build the Confluence page body from the approved meeting details, meeting files, and meeting notes only. Use business English and follow the [meeting notes instructions](zoom-meeting-notes.md#prepare-one-draft-for-the-occurrence) for each field.

```markdown
**Meeting title:** [Original Outlook event title or confirmed meeting title]
**Participants invited:** [Invitees from the original Outlook calendar event]
**Actual participants:** [Confirmed call attendees]
**Meeting date:** [Meeting date] at [Start time] [Time zone]
**Notes by:** [Notes author]
**Sources:** [Shareable links to source material]

## Meeting files

| File | Link / details |
| --- | --- |
| Video / recording | [Open Zoom recording] |
| Recording password | [Password provided for sharing] |

## Meeting notes

**Topics Discussed**

- [Main topic and relevant context]

**Decisions made**

- [Agreed decision and any stated conditions]

**Open questions**

- [Question left unresolved during the meeting and any stated dependency]

**Follow-ups/Action points**

- [Agreed action, owner, and deadline when stated]
```

Include recording links and passwords when available for sharing with the page audience. Use “Not specified” for missing details and “None recorded” for empty notes sections. Exclude **Uncertainties to clarify**, its questions, and the reviewer conversation from the published page.

## Publication

After the BA or PM approves the final notes in chat, resolve the configured Confluence space and parent page and publish the approved page. Return the page link after successful publication. Handle destination, permission, existing-page, and publication issues according to the [edge case rules](zoom-meeting-notes.md#edge-cases).

## Corporate setup

Define the connector, permitted operations, default space and parent page, and any corporate page template.
