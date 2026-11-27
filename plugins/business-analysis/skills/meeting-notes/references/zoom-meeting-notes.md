# Zoom meeting notes

Use this procedure for hourly Outlook calendar checks and manual requests for notes from Zoom recordings. It specifies the evidence, draft format and Outlook handoff for this workflow. Use the [publication procedure](meeting-job.md) for revision-specific approval, Confluence checks and recovery from uncertain writes.

## Set up the project and sources

On `Start setup`, offer manual drafting, the full workflow, or both. Ask for one group of missing settings at a time and confirm shared defaults. Collect settings for the selected modes. For the full workflow, confirm the BA or PM reviewer, private review chat, Outlook calendar and draft mailbox, timezone and event filters, Zoom account, and Confluence site, space and parent. Confirm the destination for cross-project calls.

Store approved project terminology, business purpose and scope in the approved corporate environment. Keep reusable instructions and templates in GitHub. Keep credentials, real recordings and transcripts, and account-specific settings outside the repository.

Dry-run the selected workflow on one completed meeting. Check whether the scheduled identity can retrieve and inspect the matching Zoom audio and transcript. Check whether the interactive host can publish to the agreed Confluence destination and save a formatted reply draft on the original Outlook invitation. Respect the approval gate for live writes. Summarize verified capabilities and blockers. Activate the schedule only after verification and at the user's request.

## Collect and verify evidence

- Every hour, apply the configured event filter. An occurrence first qualifies when its scheduled end time plus 15 minutes falls at or before the check. Cover the interval since the last successful check, including meetings still awaiting assets. Persist discovery, review revision, publication and Outlook draft status per occurrence in the configured workspace. Reconcile existing outputs before resuming. If already processed, report the existing status. If prior state cannot be determined, resolve the possible duplicate with the reviewer.
- Read the title, date, start time, timezone, original invitees and Zoom link from the event. Match the exact occurrence using the Zoom details and occurrence time. Notify the reviewer immediately if the link is missing. Ask which link to use if there are multiple candidates. Leave recurring calls with a shared Zoom link unresolved until the matching rule is confirmed. Treat any Outlook Mail fallback for Zoom notifications as unverified until tested. Verify the call has ended. Listen to the recording and correct only words, figures or speakers supported by the audio. A recording URL alone does not establish that audio was checked.
- For calendar access failures, unavailable meetings or pending Zoom assets, use up to three retries at 15, 30 and 45 minutes when the host supports retry scheduling. Report the missing capability or exhausted retries in the review chat. For partial recordings or transcripts, notify the reviewer immediately, identify what is missing and wait for explicit direction to draft from available material or stop.
- For a manual request, start from the supplied link, recording or transcript. An Outlook event is optional. Ask for missing details or usable material as needed. Transcribe a recording when supported. With only a transcript, ask whether to proceed using it as supplied. Disclose the evidence actually used.

## Prepare one draft for the occurrence

Write concise business English regardless of call language. Preserve official names and identifiers. Identify the call in chat by title, date, start time and timezone, and include verified direct resource links where available.

Use the header fields **Meeting title**, **Participants invited** (original Outlook invitation), **Actual participants** (confirmed attendance), **Meeting date** (with start time and timezone), **Notes by**, and **Sources**. Include **Meeting files** as a two-column table with columns **File** and **Link or access details**. Include shareable recording links and a recording password only if it was provided for sharing with the intended audience.

Group **Topics Discussed** by topic, identifying the project where useful. Capture stated business needs, expected system behavior, scope, constraints and dependencies. Distinguish proposals, confirmed decisions and open questions. Follow with **Decisions made** and their conditions, **Open questions**, and **Follow-ups/Action points** with agreed next steps, owners and deadlines. Preserve relative deadlines as stated. Use “Not specified” for missing fields and “None recorded” for empty sections. Keep all projects discussed in the same set of notes.

Below the proposed page body, show **Uncertainties to clarify** in a separate private reviewer block. Explain each ambiguity and ask a specific question about unclear decisions, owners, deadlines, conflicting prior notes or evidence gaps. Apply confirmed answers to the draft and present the revised version. If uncertainty remains, ask whether the reviewer wants to finalize with those points unresolved. Keep unconfirmed outcomes out of decisions.

## Publish, then prepare the reply

Show the BA or PM the exact revision, page title (`YYYY-MM-DD - Meeting title`), destination and proposed follow-up. Use the calendar title or, without an event, the confirmed date and title. Resolve ambiguous approval by confirming the revision or wording before publication. On explicit approval in chat, publish only the approved notes and verify the page. Keep reviewer questions and private discussion out of both outputs.

After verified publication, save a reply draft on the original Outlook invitation, addressed to its original invitees. Preserve the reply subject. Insert a brief greeting, thanks and the approved notes above the existing thread. Use HTML where supported to preserve headings, bold text, spacing, lists, tables and links. Verify the saved format when possible. For plain text, use readable headings, bullets and labeled table rows, and report the fallback in chat. The BA or PM sends the email.

Return the Confluence link and the Outlook draft status or link. Report confirmed differences between invitees and attendees in chat. For a manual call without an invitation, finish with the page link. If reply draft creation fails, is unsupported or its save is uncertain, report the specific issue alongside the published page link and check for an existing draft before retrying. Resume at the unfinished handoff when the page is already verified.
