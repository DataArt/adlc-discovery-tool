# Harness Generator

Regenerates Claude Code's and Codex's configuration files from the canonical `.harness/` harness, so both tools can run this repo's `/dev`, `/design`, `/discovery`, etc. workflows independently. `.harness/manifest.json` maps canonical paths to each provider's output paths.

```mermaid
flowchart LR
    classDef entry fill:#3B82F6,stroke:#1D4ED8,color:#fff
    classDef lib fill:#8B5CF6,stroke:#6D28D9,color:#fff
    classDef provider fill:#10B981,stroke:#047857,color:#fff

    CLI["generate.mts (CLI entry / orchestrator)"]
    subgraph LIB["lib/"]
        COMMON["common.mts — manifest load, YAML/text utils, validation"]
        TYPES["types.mts — shared types"]
        WRITER["writer.mts — Writer (all filesystem mutation)"]
        BASE["harness-provider.mts — HarnessProvider (Template Method base)"]
    end
    style LIB fill:#f5f0ff,stroke:#6D28D9,color:#000
    subgraph PROV["providers/"]
        CLAUDE["claude.mts"]
        CODEX["codex.mts"]
    end
    style PROV fill:#eafff2,stroke:#047857,color:#000

    CLI --> COMMON
    CLI --> CLAUDE
    CLI --> CODEX
    CLAUDE --> BASE
    CODEX --> BASE
    BASE --> WRITER
    BASE --> COMMON
    CLI --> WRITER

    class CLI entry
    class COMMON,TYPES,WRITER,BASE lib
    class CLAUDE,CODEX provider
```

## How to run locally

```bash
yarn harness:generate                    # regenerate all providers
yarn harness:check                       # CI-safe: writes nothing, nonzero exit on drift
yarn harness:generate --provider claude  # scope to one provider (repeatable)
yarn harness:generate --provider codex
```

Never hand-edit `CLAUDE.md`, `AGENTS.md`, `.claude/`, `.agents/`, or `.codex/` — edit `.harness/`, then regenerate.

Adding a third provider: add its paths to `.harness/manifest.json`, add a `HarnessProvider` subclass under `providers/`, and register the constructor in `PROVIDER_CLASSES` in `generate.mts`.

## Links

- `docs/Engineering Guide/09 Harness Generation.md` — full rationale, architecture, and safety-property writeup
- `docs/Engineering Guide/04 AI Coding Tool Compatibility.md` — cross-tool primitive mapping
