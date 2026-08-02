---
name: design
description: >
  Full design lifecycle orchestrator (/design {ticket}): Frame → Research → Elaborate → Solution → Publish.
  Trigger: "design ADLC-XX", "run the design for ADLC-XX".
  Do NOT invoke for a single phase — use /design-frame, /design-research, etc. directly.
---

The developer wants to run the full design workflow for a ticket. Here is their input:

---

## $ARGUMENTS

---

This command orchestrates the full design flow: **Frame → Research → Elaborate → Solution → Publish**.
Guide the developer through all phases in a single session, stopping at each boundary for confirmation.

> ⚠️ Follow every step in order. Do not skip, summarize, or improvise. If you are unsure, ask before deviating.

> 🗂 **Two-track design** — this project uses two design modes, determined at Frame (Step 3). **Track A** (AI SDLC content) sources context from `docs/AI SDLC/` and lands output there. **Track B** (project architecture) sources context from HLD/LLD and lands output in standard doc tiers. The active track is recorded in `design/Report.md`.

---

## Resume Detection (run first, every time)

**Step 1 — Locate the design folder**

Glob for `docs/Stories/*{TICKET}*/**` using a `*{TICKET}*` wildcard (never `[{TICKET}]*` — square brackets are glob metacharacters). The `/**` suffix is required because Glob matches files, not directories.

- No files found → fresh start; go to Phase 1.
- Files found → derive folder path from the first matched file.

**Step 2 — Read Report.md**

If `design/Report.md` exists, read it. Its phase tracker row is the authoritative resume point. Also verify artifacts on disk:

| Artifact on disk              | Phase done      |
| ----------------------------- | --------------- |
| `design/00 Frame.md`          | Frame ✅        |
| `design/01 Research.md`       | Research ✅     |
| `design/02 Elaborate.md`      | Elaborate ✅    |
| `solution/Efforts.md`         | Solution ✅     |
| Report.md Gate — Draft MR set | Publish gate ✅ |

**Step 3 — Present status and confirm**

> "Found existing design for `{TICKET}`:
>
> `📋 Frame [status] · 🔍 Research [status] · 🏗 Elaborate [status] · 📦 Solution [status] · 📤 Publish [status]`
>
> Resuming from **Phase N — {Name}**. Type **yes** to continue, or name a specific phase and step to jump to (e.g. 'Elaborate, Step 4')."

Wait for confirmation before proceeding. If the developer names a specific phase or phase+step, jump directly to it — do not re-run earlier steps.

---

## Phase tracker

Display this banner at every phase transition:

```
📋 Frame [status] · 🔍 Research [status] · 🏗 Elaborate [status] · 📦 Solution [status] · 📤 Publish [status]
```

Where `[status]` is: `🔄` (active) · `✅` (done) · `⏳` (pending)

---

## Phase 1 — Frame

> Skip if Report.md phase tracker shows Frame ✅.

Follow the `/design-frame` skill exactly.

Once commit is confirmed:

1. **Announce** — **STOP** and emit a progress announcement (`.claude/skills/design/pattern-announce-progress.md`): `"📋 Remaining: Research → Elaborate → Solution → Publish"`
2. **Compact** — apply compact-between-phases pattern (`.claude/skills/design/pattern-compact-between-phases.md`); **STOP** and wait
3. **Resume** — `"Ready to move into Research? Type **yes** to continue, or **no** to stop and resume later with /design-research {TICKET}."`

---

## Phase 2 — Research

> Skip if Report.md phase tracker shows Research ✅.

Follow the `/design-research` skill exactly.

Once commit is confirmed:

1. **Announce** — **STOP** and emit a progress announcement (`.claude/skills/design/pattern-announce-progress.md`): `"📋 Remaining: Elaborate → Solution → Publish"`
2. **Compact** — apply compact-between-phases pattern (`.claude/skills/design/pattern-compact-between-phases.md`); **STOP** and wait
3. **Resume** — `"Ready to move into Elaborate? Type **yes** to continue, or **no** to stop and resume later with /design-elaborate {TICKET}."`

---

## Phase 3 — Elaborate

> Skip if Report.md phase tracker shows Elaborate ✅.

Follow the `/design-elaborate` skill exactly.

Once commit is confirmed:

1. **Announce** — **STOP** and emit a progress announcement (`.claude/skills/design/pattern-announce-progress.md`): `"📋 Remaining: Solution → Publish"`
2. **Compact** — apply compact-between-phases pattern (`.claude/skills/design/pattern-compact-between-phases.md`); **STOP** and wait
3. **Resume** — `"Ready to build the Solution? Type **yes** to continue, or **no** to stop and resume later with /design-solution {TICKET}."`

---

## Phase 4 — Solution

> Skip if Report.md phase tracker shows Solution ✅.

Follow the `/design-solution` skill exactly.

Once commit is confirmed:

1. **Announce** — **STOP** and emit a progress announcement (`.claude/skills/design/pattern-announce-progress.md`): `"📋 Remaining: Publish"`
2. **Compact** — apply compact-between-phases pattern (`.claude/skills/design/pattern-compact-between-phases.md`); **STOP** and wait
3. **Resume** — `"Ready to Publish (open draft MR)? Type **yes** to continue, or **no** to stop and resume later with /design-publish {TICKET}."`

---

## Phase 5 — Publish

Follow the `/design-publish` skill exactly.

Once the draft MR is open, the session ends. Publish resumes after out-of-band human approval.
