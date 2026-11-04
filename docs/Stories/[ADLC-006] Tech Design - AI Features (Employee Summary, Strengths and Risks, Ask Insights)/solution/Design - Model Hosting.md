# Design — Model Hosting Adapter (Decision 4)

The Model Hosting Adapter is a single in-house module inside Synthetic AI's own codebase. Every model call from Decisions 1, 2, and 3 goes through it; no caller ever holds a provider SDK. See `solution/Architecture.md`'s Decision 4 and "Provider independence" section for the decision this design implements — this doc does not restate or extend that scope.

## Placement

The adapter lives at `apps/synthetic-ai/src/adapter/` (or equivalent path inside the Synthetic AI app), not in `libs/`. Synthetic AI is the adapter's only caller — the Employee Summary Generator, the Strengths & Risks Generator, and Ask Insights's capability nodes all run inside the same container (see Architecture.md's component view). A shared `libs/` package exists to serve more than one app; this adapter serves one, so it stays local to that app.

## Component view

```mermaid
flowchart TD
    subgraph Container["Synthetic AI Container App"]
        PS["Employee Summary Generator"]
        SR["Strengths & Risks Generator"]
        Cap["Ask Insights Capability Nodes"]
        subgraph Adapter["Model Hosting Adapter"]
            Iface["generate() contract"]
            Queue["Bounded request queue\n+ exponential-backoff retry"]
            Guard["Rate limiting, logging, redaction"]
            Config["Provider + endpoint config\n(env / App Configuration)"]
        end
        Provider["Provider SDK\n(swappable internals)"]
    end
    KV[("Key Vault")]

    PS --> Iface
    SR --> Iface
    Cap --> Iface
    Iface --> Guard --> Queue --> Provider
    Config -.->|"read at startup"| Adapter
    Adapter -->|"resolve API key"| KV

    classDef required fill:#dbeafe,stroke:#1d4ed8,color:#172554
    classDef context fill:#e2e8f0,stroke:#475569,color:#0f172a
    style Container fill:#f8fafc,stroke:#1d4ed8,color:#172554
    style Adapter fill:#eff6ff,stroke:#1d4ed8,color:#172554

    class PS,SR,Cap,Iface,Queue,Guard,Config,Provider required
    class KV context
```

## Contract

Every caller uses one function signature, regardless of which provider is configured:

```
generate(prompt, context, options) -> Result<Output, AdapterError>
```

| Part      | Content                                                                           |
| --------- | --------------------------------------------------------------------------------- |
| `prompt`  | The instruction text for this call                                                |
| `context` | Caller-supplied data: employee features, conversation history, retrieved evidence |
| `options` | Call-level parameters: model name, temperature, max tokens                        |
| `Result`  | Either the provider's generated `Output`, or a typed `AdapterError`               |

The contract is identical for Decision 1's cache-miss generation, Decision 2's on-demand generation, and Decision 3's capability-node calls. None of them construct a provider-specific request shape.

## Responsibilities centralized in the adapter

| Responsibility         | What it means                                                                                                                                                                         |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Provider abstraction   | The adapter is the only code that imports a provider SDK. Swapping providers changes the adapter's internals, not any caller                                                          |
| Secrets                | The provider API key is resolved from Key Vault at call time, following the platform's existing two-Key-Vault pattern. The adapter holds no API key in code or config                 |
| Rate limiting          | Enforced once, inside the adapter, for every caller                                                                                                                                   |
| Logging                | Every call and its outcome is logged once, inside the adapter                                                                                                                         |
| Redaction              | Applied once, inside the adapter, if a provider or compliance requirement calls for it                                                                                                |
| Backpressure and retry | An internal bounded request queue with exponential-backoff retry absorbs peak on-demand request volume across all three features without exceeding the provider's rate or token quota |

The queue's concurrency limit is an implementation-time tuning parameter, confirmed once a provider is selected. The queue and retry mechanism themselves are settled; only the numeric limit is pending provider selection.

## Error handling

```mermaid
sequenceDiagram
    autonumber
    participant Caller as Caller (PS / SR / Capability Node)
    participant Adapter
    participant Provider

    Caller->>Adapter: generate(prompt, context, options)
    Adapter->>Provider: Call

    alt Non-retryable failure (invalid input, content-policy rejection)
        Provider--)Adapter: Error
        Adapter--)Caller: Typed error, surfaced immediately
    else Retryable failure (rate limit, timeout)
        Provider--)Adapter: Error
        Note over Adapter: Internal retry with exponential backoff
        Adapter->>Provider: Retry
        alt Retry succeeds
            Provider--)Adapter: Result
            Adapter--)Caller: Result
        else Retries exhausted
            Provider--)Adapter: Error
            Adapter--)Caller: Typed error, surfaced after internal retries
        end
    end
```

| Failure class | Examples                                | Adapter behavior                                             |
| ------------- | --------------------------------------- | ------------------------------------------------------------ |
| Retryable     | Rate limit, timeout                     | Retried internally with exponential backoff before surfacing |
| Non-retryable | Invalid input, content-policy rejection | Surfaced to the caller immediately, no retry                 |

Every caller receives the same typed `AdapterError`, distinguishing which class occurred, regardless of which provider produced it.

## Configuration

Provider selection and endpoint config come from environment variables and App Configuration, not hardcoded values. The adapter reads this configuration once, at startup, and resolves the API key from Key Vault using that configuration.
