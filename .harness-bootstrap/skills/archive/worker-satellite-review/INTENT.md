---
skill: worker-satellite-review
output: .claude/skills/worker-satellite-review.md
---

## Purpose

Defines the worker+satellite review pattern: after completing a non-trivial step, the worker agent invokes `@architect` as a satellite reviewer for a go/reiterate verdict. Prevents best-practice violations from surfacing only at PR review time. Referenced by all worker agent bodies.

## Substitutions

| Placeholder         | Source                          | Notes                                                                                                                                                                         |
| ------------------- | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `{{HLD_NFRS_PATH}}` | Stage 1b — detected HLD NFR doc | Path to the NFR document. Glob `docs/Target Architecture (HLD)/*/Non-Functional*` to detect. e.g. `docs/Target Architecture (HLD)/v1/Non-Functional Concerns/Requirements.md` |

## Conditionals

- If no Target Architecture (HLD) folder exists: replace `{{HLD_NFRS_PATH}}` with "the project's NFR documentation" and note in INTENT that the developer should specify the path
- Adjust layer-specific best-practice examples in the review prompt to match the project's actual stack (remove references to layers that don't exist)

## Verify checklist

- [ ] Worker-invokes-@architect (not orchestrator-invokes) is stated explicitly
- [ ] Maximum 3 iterations cap is stated explicitly
- [ ] Escalation path (escalate to developer with stalemate summary after 3 iterations) is stated
- [ ] "Skip for mechanical steps" list is present
- [ ] `{{HLD_NFRS_PATH}}` is resolved to an actual file path — not left as a placeholder
