# Team Collaboration

_How the engagement team actually works in this repo — who touches what, with which tool, and how it lands. Not dev-environment setup (→ [Engineering Guide — Getting Started](/Engineering%20Guide/05%20Getting%20Started.md)) or commit-format mechanics (→ [Engineering Guide — Conventions](/Engineering%20Guide/01%20Conventions.md)) — those are covered once, there._

```mermaid
flowchart LR
    subgraph Capture["Capture — outside the repo"]
        direction TB
        WS["Workshop\n(online / offline)"]
        TR["Transcript / written answers"]
        WS --> TR
    end

    subgraph Process["Process — AI-assisted"]
        direction TB
        CD["Claude Desktop / Codex Desktop\n(non-technical team members)"]
        CC["Claude Code + IDE\n(engineers)"]
    end

    subgraph Land["Land — in the repo"]
        direction TB
        BR["Branch\ntype/short-description"]
        CM["Commit\ntype(scope): what changed"]
        PR["Pull Request\nreview"]
        BR --> CM --> PR
    end

    TR --> Process --> Land

    classDef capture fill:#F59E0B,stroke:#B45309,color:#000
    classDef process fill:#8B5CF6,stroke:#5B21B6,color:#fff
    classDef land fill:#3B82F6,stroke:#1D4ED8,color:#fff

    class WS,TR capture
    class CD,CC process
    class BR,CM,PR land

    style Capture fill:#FFFBEB,stroke:#F59E0B,color:#B45309
    style Process fill:#F5F3FF,stroke:#8B5CF6,color:#5B21B6
    style Land fill:#EFF6FF,stroke:#3B82F6,color:#1D4ED8
```

## Who uses what

| Role                                                    | Tool                           | Does                                                                                                                                                   |
| ------------------------------------------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Engineers doing repo work (docs, skills, agents, infra) | Claude Code + IDE              | Runs the `/dev`, `/design`, `/discovery`-agent workflows directly against this repo; owns the actual commits.                                          |
| Non-technical team members processing workshop output   | Claude Desktop / Codex Desktop | Turns a raw transcript or written-answer set into a draft Notes/Outcomes write-up _before_ it enters the repo — no repo access required for this step. |
| Whoever runs the workshop                               | Any note-taking tool           | Captures the transcript itself; the tool doesn't matter, only that it lands as `transcript/Transcript.md` for the workshop folder to process.          |

> [!WARNING] Populated During Bootstrap
> The exact desktop-app roles above are illustrative — confirm which tools the [[CLIENT_NAME]] engagement team actually has access to (Claude Desktop, Codex Desktop, or neither) during `/bootstrap-client`, and replace this table with what's real for this engagement.

## Landing content in the repo

Whatever produced the draft — a desktop app outside the repo, or Claude Code directly inside it — the same rule applies before it's published: it goes through [Workflows](./06%20Workflows/01%20Initiation.md)'s review → publish → wire-traceability pattern, not straight from draft to merged.

1. **Branch** — `<type>/short-description`, per [Engineering Guide — Conventions](/Engineering%20Guide/01%20Conventions.md).
2. **Commit** — `<type>(<scope>): <what changed>`, Conventional Commits. Scope is the AI SDLC section (`process`, `vision`, `problem-space`, `goals`, `solution-space`, `roadmap`) or the workshop ID (`ws1`, `ws2`, …).
3. **Pull Request** — opened against `main`; reviewed by `@workshop` for a change inside a `02 Vision/WS N (…)` folder, `@discovery` for everything else under `docs/AI SDLC/` (see the agent table in `CLAUDE.md`) — before merge. A PR that adds a workshop's Notes/Outcomes should also show the Changelog rows it triggered downstream (Current State, SDLC Domain, Solution Goals) — see [04 Evidence Chain](./04%20Evidence%20Chain.md).

Guarded commands (`git push`, `cdk deploy`, `yarn nx run infra:provision`) are never run directly — they're presented as instructions for the developer to run themselves, same as everywhere else in this repo.
