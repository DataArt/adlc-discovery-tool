# Guided setup

Run this setup when a user types `Start setup`. Work through the steps in order, one short group of questions at a time. Reuse shared defaults where available and ask the user to confirm them. Keep account-specific answers in the private setup chat and save confirmed configuration only in the approved corporate workspace. Keep credentials, real recordings and transcripts, and account-specific settings outside GitHub. Store reusable instructions and templates in GitHub. Ask for account identifiers and resource links as needed. Use the integration's sign-in flow for authentication.

## Step 1. Choose the setup scope

> Let’s set up Generate Meeting Notes. Would you like to start with manual drafting from a transcript or recording, configure the full Outlook, Zoom, and Confluence workflow, or set up both?

Confirm who will review drafts and whether the shared project context applies to their meetings. Ask for missing project names, business purpose, scope or terminology. For manual drafting only, proceed directly to Step 5.

## Step 2. Outlook Calendar and Mail

Confirm the calendar and mailbox to use, time zone, and which events to process. Ask for one representative test event. Check whether the available integration can read the event details, Zoom link, and invitee list. For email, verify during the test that it can save a formatted reply draft against the original event in the intended mailbox. The BA or PM sends the email.

## Step 3. Zoom

Confirm which connected Zoom account will be used and who typically hosts the meetings. Use the test event to check access to the specific recording, transcript, and available attendance data. Verify that the recording audio can be used to refine the transcript. If the calendar link can match more than one occurrence, ask the user to identify the exact test meeting.

## Step 4. Confluence

Ask for the Confluence site and the space or parent page link. Confirm where to publish when a meeting covers multiple projects, if applicable. Check available permissions. Confirm a test destination before any test publication.

## Step 5. Run a test and summarize

Request a transcript, recording, or link if the test materials are missing. Offer to start with a draft-only test in chat. For a full test, use the standard review workflow and publish to the confirmed test destination only after the user explicitly approves the test notes. After successful publication, save an Outlook reply draft if the original event is available.

Summarize the selected setup mode, confirmed settings, tested capabilities, and remaining blockers in chat. Provide a copyable configuration summary for the user's approved workspace. Mark capabilities as verified only after a successful test.

For the full workflow, confirm the chat for reviewer notifications and readiness to run hourly. Follow the [hourly schedule and retry rules](zoom-meeting-notes.md#collect-and-verify-evidence). Check for an existing schedule and use the [onboarding job procedure](../../onboarding/references/jobs.md) to activate or update it. Create or enable the schedule only if the user requests activation and the required capabilities have been verified. If a connection, permission, or scheduling feature is unavailable, state the blocker and identify the manual workflow the user can run.
