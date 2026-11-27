# Chat messages for meeting notes

Use clear business English. Identify a specific call as **[Meeting title] on [Meeting date] at [Start time] [Time zone]**, using the original Outlook event or confirmed details for a manual request. Include direct links to the relevant Outlook event, Zoom meeting or recording, Confluence destination or published page, and Outlook draft when available and appropriate for the recipient.

## Manual request

> I can prepare meeting notes for this call. Please share the Zoom recording, transcript, or a link to the meeting materials. If the files do not show the meeting title or date, please provide those details too.

Follow [the project instructions](zoom-meeting-notes.md) for note content and approval. The [edge case rules](zoom-meeting-notes.md#edge-cases) determine when to send each notification. The examples below illustrate the wording. See the [Confluence interface](confluence-page.md) and [email interface](outlook-reply.md) for destination-specific formatting.

## Draft ready for review

> I processed **Payment Export Refinement** on **24 November 2026 at 10:00 EET (UTC+02:00)**. The draft meeting notes are ready for your review.
>
> **Meeting title:** Payment Export Refinement\
> **Participants invited:** Alex Morgan, Sam Chen, Jordan Lee\
> **Actual participants:** Alex Morgan, Sam Chen, Priya Patel\
> **Meeting date:** 24 November 2026 at 10:00 EET (UTC+02:00)\
> **Notes by:** [Notes author]\
> **Sources:** [Zoom transcript]
>
> ### Meeting files
>
> | File | Link / details |
> | --- | --- |
> | Video / recording | [Open Zoom recording] |
>
> ### Meeting notes
>
> **Topics Discussed**\
> The team discussed which payment details Finance needs in the export for month-end reconciliation.
>
> **Decisions made**\
> The first release will include the payment reference, settlement date, and amount.
>
> **Open questions**\
> Does Finance need a separate currency column? Finance will confirm after reviewing the sample export.
>
> **Follow-ups/Action points**\
> Sam will create a ticket for the agreed export fields. Due date: Not specified.
>

Show outstanding clarification questions below the draft in a separate block in the BA or PM chat. The divider and reviewer-only label mark the boundary of the shareable notes.

---

### Uncertainties to clarify · Reviewer only

> The team discussed excluding failed payments, and I could not confirm a final agreement from the recording. Did the team agree to exclude failed payments?
>
> Please confirm this point and let me know if the draft needs changes. If the notes are ready, please approve this version.

## Review and delivery messages

In the examples below, **[Call]** stands for the full meeting title, date, start time, and time zone. Link labels in brackets are placeholders for direct links.

| When | Example message |
| --- | --- |
| The draft was revised | I updated the draft for **[Call]** with the confirmed export rule and action deadline. Please review and approve the revised notes below, or let me know what else needs to change. |
| Clarifications remain unanswered | One clarification is still open for **[Call]**. I could not confirm whether the team agreed to exclude failed payments. May I finalize the notes with that point left unconfirmed? |
| The approved version is unclear | I have two versions of the notes for **[Call]**. One marks the export decision as TBD and the other records an agreed outcome. Which wording should I use? |
| Notes were published and the draft was saved | I published the approved notes for **[Call]** and saved an Outlook reply draft addressed to everyone on the original invitation. The draft is ready for you to review and send. [Open published notes] · [Open Outlook draft] |
| Attendance differed from the invitation | Attendance for **[Call]** differed from the Outlook invitation. Jordan Lee was invited and did not attend. Priya Patel attended and was not on the invitation. The draft is addressed to the original invitees. [Open Outlook event] · [Open Outlook draft] |

## Workflow issues

| When | Example message |
| --- | --- |
| Calendar access failed after three retries | I couldn’t access your Outlook calendar after three retries. Please check the calendar connection or access permissions. |
| The Zoom call still cannot be processed after three retries | I checked Zoom three more times for **[Call]**. The call still appears to be in progress, so I couldn’t retrieve its materials. [Open Zoom meeting] |
| No Zoom link in the calendar event | I couldn’t generate notes for **[Call]** because the Outlook event has no Zoom link. [Open Outlook event] |
| Multiple possible Zoom links | I found multiple Zoom links for **[Call]**. Which link belongs to this call? [Open Outlook event] · [Zoom link 1] · [Zoom link 2] |
| The same call was found again | The calendar check found **[Call]** again. Its draft notes are already awaiting your review. [Open Outlook event] |
| Zoom material is missing or inaccessible after three retries | I found the recording for **[Call]**, but I still couldn’t access the transcript after three retries. [Open Zoom meeting] · [Open recording] |
| Zoom material covers only part of the call | The Zoom transcript for **[Call]** covers only part of the call. Would you like me to draft notes from the available material or stop processing this call? [Open Zoom meeting] · [Open transcript] |
| Confluence publication failed or could not be confirmed | I couldn’t confirm that the notes for **[Call]** were published. Confluence did not return a confirmation. Could you help verify the result or tell me how to proceed? [Open Confluence destination] |
| Outlook could not create, link, or confirm the draft | I published the notes for **[Call]**, but Outlook did not confirm that the reply draft was saved. [Open published notes] · [Open Outlook event] |
