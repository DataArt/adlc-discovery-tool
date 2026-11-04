# ADLC-007: Nimbus country-aware nearest centre — Report

| Field  | Value                                                                                       |
| ------ | ------------------------------------------------------------------------------------------- |
| Ticket | [ADLC-007](https://meridianworkspaces.atlassian.net/browse/ADLC-007)                        |
| Branch | `feature/ADLC-007`                                                                          |
| PR     | —                                                                                           |
| Author | `UNIVERSE\nsmolyansky`                                                                      |
| Status | ✅ Dev lifecycle complete — not yet pushed, PR not raised, QA pending                       |
| Phase  | 🎯 Context ✅ · 🚀 Ceremony ✅ · 📋 Plan ✅ · 🔨 Implement ✅ · 🧪 Test ✅ · 📝 Document ✅ |

## Progress

| #   | Step                                                            | Status  | Notes                                                                                           | Test | Docs |
| --- | --------------------------------------------------------------- | ------- | ----------------------------------------------------------------------------------------------- | ---- | ---- |
| 1   | Nimbus service: fix the give-up branch                          | ✅ Done | One-token fix at `LocationSearchService.cs:106`; new test file, red→green proven                | ✅   | ✅   |
| 2   | Nimbus service: add country preference                          | ✅ Done | Required `string? countryIso2Code`; call sites pass `null` for now; 8 tests, suite 107/107      | ✅   | ✅   |
| 3   | Nimbus resolvers: pass geo country at 3 call sites              | ✅ Done | 3 arguments flipped to the geo's `Iso2Code`; AC-7 holds. AC-5 live page check still outstanding | ⚠️   | ✅   |
| 4   | Nimbus controller: match IP country in `GetUserNearestCenterId` | ✅ Done | `takeLocations` 1→null + ISO-3 country match. AC-9 parity verified. AC-6 live check outstanding | ⚠️   | ✅   |

<!--
Status values : ⏳ Pending · 🔄 Active · ✅ Done · ⚠️ Blocked · ⏭️ Skipped
Test / Docs   : ✅ done · — not applicable · (empty) = not yet run
-->

## Delivery Summary

Nimbus now resolves a geo's nearest centre to one in the geo's **own country** whenever that country has
any centre at all, instead of picking purely by distance. A Vigo (Spain) geo no longer attributes its
enquiries to Braga (Portugal); it resolves to the nearest Spanish centre. The same country preference now
applies to the geo contact form, POI cards at city level, child-geo cards at country level, and — via a
separate ISO-3 path keyed on IP geolocation — the browser's `usernearestcenterid` call. Where a country
has no centres at all, the previous nearest-overall behaviour is unchanged.

Shipped alongside it, because the new fallback path runs straight into it: a latent bug where the
radius search's give-up branch re-ordered an already-empty collection and so always returned `null`. Any
Nimbus geo with no centre within roughly 800 km previously resolved to no centre at all.

Location cards and location pages are deliberately untouched. Scope is the Nimbus brand only — Meridian Core,
Apex HQ and DropDesk carry the same defect under their own tickets (ADLC-151, ADLC-152, ADLC-153), and
Meridian Prime was done under ADLC-150, whose implementation this one mirrors exactly.

## Stage Metrics

<!-- dev-metrics-stage:start -->

Source: [stat.json](stat.json). **Elapsed** = wall-clock time from the stage's first start to its completion (includes any wait). **Work** = summed observed work intervals (active effort) within that span. **Wait** = summed observed wait intervals (blocked on developer input, approval, or an external dependency) within that span. Work + Wait can read less than Elapsed when time went unclassified, or more after a retry reopened the stage. Durations are shown as `Xh Ym Zs`, rounded to the nearest second; open intervals are excluded from Elapsed/Work/Wait. **Flags** surfaces non-initial attempt triggers (🔁 retried/rework, 🔀 scope change, 🔓 reopened) and any failed check (⚠️), derived from recorded data — never a new judgment call — so a reader can scan for problem stages without parsing every row. Token subtotals have unavailable coverage; ticket usage is not allocated to individual units.

Observed work: 1h 3m 53s · Wait: 24m 34s · Unclassified: 6m 46s

| Stage     | Started (UTC)            | Completed (UTC)          | Elapsed | Work    | Wait    | Input tokens | Output tokens | Coverage            | Attempts | Failed checks | Flags |
| --------- | ------------------------ | ------------------------ | ------- | ------- | ------- | ------------ | ------------- | ------------------- | -------- | ------------- | ----- |
| context   | 2026-09-30T07:46:20.153Z | 2026-09-30T07:46:20.332Z | 0s      | 0s      | 0s      | unavailable  | unavailable   | from_tracking_start | 1        | 0             | —     |
| ceremony  | 2026-09-30T07:46:50.376Z | 2026-09-30T07:47:11.171Z | 21s     | 21s     | 0s      | unavailable  | unavailable   | from_tracking_start | 1        | 0             | —     |
| plan      | 2026-09-30T07:47:11.247Z | 2026-09-30T07:54:44.499Z | 7m 33s  | 6m 22s  | 1m 12s  | unavailable  | unavailable   | from_tracking_start | 1        | 0             | —     |
| implement | 2026-09-30T07:55:05.840Z | 2026-09-30T08:41:41.609Z | 46m 36s | 17m 44s | 23m 22s | unavailable  | unavailable   | from_tracking_start | 1        | 0             | —     |
| test      | 2026-09-30T08:41:41.704Z | 2026-09-30T09:03:18.638Z | 21m 37s | 21m 37s | 0s      | unavailable  | unavailable   | from_tracking_start | 1        | 0             | —     |
| document  | 2026-09-30T09:03:27.012Z | 2026-09-30T09:21:16.640Z | 17m 50s | 17m 50s | 0s      | unavailable  | unavailable   | from_tracking_start | 1        | 0             | —     |

Quality (recorded inventory): findings 5 · open 0 · PR findings 5 · critical 0 · debt 3 · tests written unavailable · latest failed cases unavailable · failed test runs 0. Counts describe recorded coverage, not a quality score; kind/severity/resolution breakdowns are in [stat.json](stat.json).
<!-- dev-metrics-stage:end -->

## Step Metrics

<!-- dev-metrics-step:start -->

Source: [stat.json](stat.json). **Elapsed** = wall-clock time from the step's first start to its completion (includes any wait). **Work** = summed observed work intervals (active effort) within that span. **Wait** = summed observed wait intervals (blocked on developer input, approval, or an external dependency) within that span. Work + Wait can read less than Elapsed when time went unclassified, or more after a retry reopened the step. Durations are shown as `Xh Ym Zs`, rounded to the nearest second; open intervals are excluded from Elapsed/Work/Wait. **Flags** surfaces non-initial attempt triggers (🔁 retried/rework, 🔀 scope change, 🔓 reopened) and any failed check (⚠️), derived from recorded data — never a new judgment call — so a reader can scan for problem steps without parsing every row. Token subtotals have unavailable coverage; ticket usage is not allocated to individual units.

Observed work: 1h 3m 53s · Wait: 24m 34s · Unclassified: 6m 46s

| Step                                                                   | Started (UTC)            | Completed (UTC)          | Elapsed | Work   | Wait   | Input tokens | Output tokens | Coverage            | Attempts | Failed checks | Flags |
| ---------------------------------------------------------------------- | ------------------------ | ------------------------ | ------- | ------ | ------ | ------------ | ------------- | ------------------- | -------- | ------------- | ----- |
| step-01: Nimbus service: fix the give-up branch                        | 2026-09-30T08:01:52.961Z | 2026-09-30T08:08:15.767Z | 6m 23s  | 3m 49s | 2m 34s | unavailable  | unavailable   | from_tracking_start | 1        | 0             | —     |
| step-02: Nimbus service: add country preference                        | 2026-09-30T08:10:22.614Z | 2026-09-30T08:23:51.748Z | 13m 29s | 4m 53s | 8m 37s | unavailable  | unavailable   | from_tracking_start | 1        | 0             | —     |
| step-03: Nimbus resolvers: pass geo country at 3 call sites            | 2026-09-30T08:25:19.473Z | 2026-09-30T08:32:50.030Z | 7m 31s  | 3m 36s | 3m 55s | unavailable  | unavailable   | from_tracking_start | 1        | 0             | —     |
| step-04: Nimbus controller: match IP country in GetUserNearestCenterId | 2026-09-30T08:33:48.853Z | 2026-09-30T08:40:45.449Z | 6m 57s  | 4m 50s | 2m 6s  | unavailable  | unavailable   | from_tracking_start | 1        | 0             | —     |

<!-- dev-metrics-step:end -->

## Review Findings

| ID     | Stage | Origin               | Kind        | Deviation type | Severity | Classification | Finding                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Evidence                                                                                                                                                 | Resolution | TD   | Decision                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ------ | ----- | -------------------- | ----------- | -------------- | -------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| RF-001 | test  | pr-review            | improve     | —              | medium   | introduced     | The `!string.IsNullOrWhiteSpace(countryIso2Code)` guard is untested. Both "no preference" tests still pass if it is deleted, because their fixtures only hold centres with real ISO codes. Uncovered: a centre with a **null** `Country` plus a **null** `countryIso2Code` — without the guard `string.Equals(null, null)` is true, so that centre matches and is returned regardless of distance                                                                                                                                                                                                                          | `LocationSearchService.cs:102`; tests at `LocationSearchServiceTest.cs:229` and `:253`                                                                   | fixed      | —    | Added `…WhenNoCountryIsSuppliedAndACentreHasNoCountry_ReturnsTheNearestCentreOverall`. Pin verified empirically: with the guard neutralised the suite reports **1 failed / 8 passed**, the failure being exactly this new test; restored, 108/108. See Test Results                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| RF-002 | test  | pr-review            | improve     | —              | low      | introduced     | New `!` suppression on the country-matched branch. `backend/CLAUDE.md` states the rule without exception: "Fix them; never silence with `!`". Avoidable at zero cost — the ternary's other arm already yields `int?`, so `DataLocation?.LocationNumber` type-checks identically                                                                                                                                                                                                                                                                                                                                            | `NimbusApiController.cs:852` (the `!` on `:853` is pre-existing)                                                                                         | tech-debt  | TD-1 | Deferred by the developer ("not the issues, proceed", 2026-09-30), keeping exact AC-9 parity in this PR. To be fixed across Nimbus and Meridian Prime together                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| RF-003 | test  | pr-review            | design      | —              | low      | introduced     | The ISO-3 country match reads `x.Location.Location.DataLocation?.Country?.Iso3Code` — the **culture-specific** entry. `.LocationEnglish` is the locale-invariant one. A centre whose `fr-fr` entry has incomplete `dataCountry` while `en` is complete would give a French user the globally-nearest centre while an English user gets the country match — a locale-dependent discrepancy in lead attribution, the exact bug class this ticket exists to fix                                                                                                                                                               | `NimbusApiController.cs:846`; `GetGeoResultsV2ItemLocation.cs:22-24`; `ContentfulSearchServiceV2025.cs:130`                                              | tech-debt  | TD-2 | Deferred by the developer ("not the issues, proceed", 2026-09-30), keeping exact AC-9 parity. Reference-inherited and low likelihood, but genuine — flagged for a paired fix before the remaining brand clones land                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| RF-004 | test  | pr-review; hld-audit | performance | —              | low      | introduced     | Widening `takeLocations` 1→null skips the `Skip`/`Take` guard entirely, so the projection allocates a `GetGeoResultsV2Item` + `GetGeoResultsV2ItemLocation` and does a dictionary lookup per centre instead of once. `GetGeoResultsV2` has no caching interceptor, so this runs on every `usernearestcenterid` call, which the frontend fires on page load. **HLD audit adds:** the query sets no `ShowOnlyOwnBrand`, so the set is the full cross-brand estate, not Nimbus-only; and **PERF-3** requires `LoadTests/` evidence that a request-path change does not degrade responsiveness — none exists for this endpoint | `NimbusApiController.cs:834`; `ContentfulSearchServiceV2025.cs:118-136`; registration `ServicesModule.cs:299-301`; `05 Performance Efficiency.md` PERF-3 | accepted   | —    | Accepted as non-blocking on two grounds the audit established independently: the widening is **required for correctness** (the nearest in-country centre need not be the globally nearest, so `Take(1)` cannot work), and the O(n) distance calculation plus O(n log n) sort over the same unfiltered set **already ran before this change** — only the projection widens, adding no I/O and not changing the dominant asymptotic cost. Verdict **go**. Residual gap is procedural, not behavioural: no PERF-3 measurement. A bounded `Take(50)` was an available alternative and was not taken. Estate size is unquantified — `System Sizing.md` states no location count — so the marginal cost cannot be sized from repo evidence either way. Logged as TD-3 to close before the pattern replicates to three more brands (PERF-7: per-brand capacity cost compounds) |
| RF-005 | test  | pr-review            | improve     | —              | info     | pre-existing   | The give-up branch does `OrderBy(...).ToArray()` over the whole estate then reads only `[0]` — O(n log n) plus a full array allocation to answer a single-element question. `MinBy` would be O(n) with no allocation                                                                                                                                                                                                                                                                                                                                                                                                       | `LocationSearchService.cs:125-130`, and the identical code in all five brand copies                                                                      | accepted   | —    | Pre-existing shape, not introduced here. Changing it would break AC-9 parity for no functional gain. Worth a shared follow-up across all five brand copies, not this ticket                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |

<!-- One row per underlying issue; see patterns/review-gate.md. Empty means no recorded findings, not proof of review. -->

**PR review coverage (Test stage).** `@backend` reviewed all six changed files against `develop`, with a
brief to challenge six specific areas rather than to confirm the work. Verdict: **go**, with **no BUG-class
findings**. Areas returned explicitly clean: correctness of the country-preferred block (including the
null-`Country` estate shape and the null/empty-input path), the give-up branch fix and its interaction with
the country fallback, loop termination, nullable correctness at all three call sites, and brand conventions
(brand sourced from the request not `SiteConfig.SiteBrand`, no new cache keys, hexagonal boundaries intact,
commit format correct). Tie-breaking at equal distance was considered and dismissed — LINQ `OrderBy` is
stable over a cached array, so it is deterministic.

The reviewer independently verified the AC-9 parity claim by direct file comparison, and separately
confirmed the RF-004 performance reading at source rather than accepting the plan's wording.

No `@architect` audit was run in this stage. The criteria in `references/05-test.md` Step 5 are not met:
no infrastructure topology or boundary change, no new cross-layer integration (the `usernearestcenterid`
endpoint already existed and its contract is unchanged), and no flow spanning more than one container. The
change is single-layer within one brand project. No `architecture-notes.md` either — nothing structural
changed.

Because every finding is `improve`/`design`/`performance` and none represents a repeatable convention gap
of the `bug`/`security`/`deviation` kind, no `/evolve reflect` prompt is warranted.

**HLD deviation audit (Document stage).** `@architect` audited the implementation against HLD v1
`Containers/Backend.md` and the Non-Functional Concerns docs. Verdict: **go** — no documented HLD invariant
contradicted. Clean on container boundaries (the change adds a parameter to an existing brand-local service
and never reaches around `Meridian.Web.Services.Ports`), on "brand comes from the request", on reliability
NFR-3/REL-10 (the interface is brand-local, so the change cannot reach the other brands' request paths even
in principle), and on omissions generally. Cache-key and Hangfire invariants are inapplicable — no
`ICacheStorage` call and no job is touched.

It produced one finding, folded into RF-004 rather than opened separately since it concerns the same change
at the same line: a **PERF-3 omission** — no load-test evidence for a request-path change. It also corrected
two things in the orchestrator's own framing, in the ticket's favour: the widening is **required for
correctness** rather than incidental (the nearest in-country centre need not be the globally nearest, so
`Take(1)` cannot satisfy the feature), and the expensive parts — the O(n) distance calculation and O(n log n)
sort — already ran unconditionally before this change, so only the projection widens. It also noted the
query carries no `ShowOnlyOwnBrand`, making the set the full cross-brand estate rather than Nimbus-only.

**Duplication across brands — recorded, not a finding.** The audit was asked directly whether five
hand-duplicated copies of this logic contradict the root `CLAUDE.md` rationale that common behaviour is
built once. Its answer: a pre-existing structural observation, not a finding against this ticket. The
per-brand `ILocationSearchService` pattern dates to 2025-02-11 and was already forked across five brands
before this ticket, which followed the established convention rather than inventing it. REL-10 bounds blast
radius from _shared_-layer changes; hoisting this into the shared layer would touch all ten brands and is
exactly the kind of change REL-10 counsels care over. Worth a separate architecture discussion once the
fifth clone lands — not grounds to block or rework this one.

**One correction to the review itself.** The PR review stated that `string.Empty` would expose the
unguarded behaviour. It does not: `string.Equals(null, "", OrdinalIgnoreCase)` is **false** — `null` is
equal only to `null`, not to the empty string — so an empty code matches no centre, falls through to the
radius search, and returns the same answer with or without the guard. Only a genuine `null` pins it. The
worker implementing RF-001 caught this and covered both inputs in one test rather than shipping the
`string.Empty`-only case it was briefed with, which would have passed against unguarded code and been
worthless as a regression guard. The orchestrator then verified the pin empirically rather than reasoning
about it: neutralising the guard produced 1 failed / 8 passed, the single failure being the new test.

The practical consequence for the shipped code is nil — the guard is correct either way, and `string.Empty`
(the real `global-region` input) is safe with or without it. The consequence for the test suite was real:
following the review literally would have produced a test that could not fail.

## Implementation Notes

**Tracker in use:** no native `TaskCreate`/`TaskUpdate`/`TaskList` and no `TodoWrite` are exposed in this
session, so this report is the sole progress tracker — the Phase row for stages, the Progress table for
implementation steps.

**Context Gathering.** Ticket carries no acceptance criteria and no Confluence links. The merged
ADLC-150 (`83b3f1205`, PR 4821) is the reference implementation and
`docs/System Architecture (LLD)/Backend/Nearest Centre Resolution.md` documents its target behaviour;
both are treated as the spec in place of ACs. Brand scope was the one open question and was resolved
against Jira before sign-off: Meridian Core, Apex HQ and DropDesk have their own tickets (ADLC-151, ADLC-152,
ADLC-153), so this ticket is Nimbus only. Developer signed off on that scope, all six items included.

_Metrics caveat:_ `stat.json` could only be initialized once the impl directory existed, which is at the
end of Context Gathering. The Context stage's recorded Work is therefore ~0s and does not reflect the
real investigation time; from Ceremony onward the timings are observed normally.

**Ceremony.** No-op — both steps were already satisfied on entry. ADLC-007 was already `In Progress` and
already assigned to the authenticated user, so no `@scrum-master` transition was requested. The worktree
was already on `feature/ADLC-007`, clean and level with `develop` at `86359876a`, so the branch-checkout
sign-off gate did not fire.

**Plan.** Approved in Plan Mode and persisted to `1-plan.md` (285 lines, 4 steps, 9 ACs), verified
byte-identical to the approved draft. The **architecture audit (Plan Step 4) was skipped**, deliberately:
the plan stays inside one HLD container (Backend) and one brand project (`Meridian.Web.Nimbus`), adds no
cross-container data flow, no infrastructure or IAM, and no new module boundary — the `ILocationSearchService`
signature change is internal to a single brand project. The identical change was already audited and
merged on Meridian Prime under ADLC-150. No deviations recorded.

One design point worth flagging for review: the reference makes `countryIso2Code` a **required**
parameter ahead of `CancellationToken`, which C# will not let be optional (`CS1737`). Rather than
diverge from Meridian Prime by moving it after the token, Step 2 updates the three call sites to pass `null`
and Step 3 flips them to the real ISO code. That preserves independent verification of the service layer
and the wiring layer separately, at the cost of touching three lines twice within the PR. Final state is
equivalent to Meridian Prime either way.

### Step 1 — Nimbus service: fix the give-up branch

Went as planned. `LocationSearchService.cs:106` `locationsInRadius?` → `allLocationsValue?`, one token,
matching `GeoSearchService.cs:122` and the merged Meridian Prime fix. New test file
`Meridian.Web.Nimbus.Tests/Web.Nimbus/Services/LocationSearchServiceTest.cs` with one case
(`…WhenOnlyCentreIsBeyondTheSearchRadius_ReturnsThatCentre`) plus the `SetupAllLocations` /
`CreateContentLocation` fixture helpers, which already thread ISO2/ISO3 so Step 2 can extend them
without touching the fixture.

Red-first proven rather than asserted: with the token reverted the test failed on
`result.Value should not be null but was`; with the fix restored it passed. Full Nimbus suite 100/100.
Brand build 0 warnings / 0 errors.

Two deliberate departures from a literal reading of the plan, both benign:

- The test file sits at `Web.Nimbus/Services/`, not `Web.Nimbus/Business/Services/`. This is what the
  plan's Test strategy section called for — Nimbus flattens `Business/` in its test tree — but it does
  differ from the Meridian Prime reference path.
- **No satellite review was run for this step.** `@backend` has no agent-dispatch tool so it could not
  call `@architect` itself, and a one-token fix mirroring an already-merged and already-audited change
  did not warrant the orchestrator running one separately. Recorded here rather than left implicit.

Worth knowing for later steps: on a from-scratch compile `Meridian.Web.Nimbus` emits a pre-existing
`CS8509` (non-exhaustive switch) at `ContentResolvers/Components/LocationGeo/LocationGeoContentResolver.cs:145`.
It predates this ticket and is not a `Nullable` warning, so `WarningsAsErrors=Nullable` does not trip on
it — but it means AC-8 must be read as "no _new_ warnings", not a literal zero on a cold build.

### Step 2 — Nimbus service: add country preference

Went as planned. `ILocationSearchService.cs` and `LocationSearchService.cs:93` take `string? countryIso2Code`
immediately before `CancellationToken`; the country-preferred block sits after `locationPrecalculated` and
before the `while` loop, and is a literal port of the Meridian Prime reference including its Vigo/Braga comment,
the `is { } dataLocation` null guard, and the immediate `ServiceResult.Create` return. Interface XML doc
copied verbatim. Test file extended to 8 cases covering the seven reference scenarios.

As the plan specified, the three resolver call sites pass `null` in this step — behaviour is byte-identical
to before it, which is exactly what makes the full-suite pass meaningful as AC-4 evidence. Step 3 flips them.

Evidence: brand build 0 warnings / 0 errors, with a cold-compile grep confirming **no warnings in any of the
five changed files**. `LocationSearchServiceTest` 8/8. Full Nimbus suite 107/107, up from 100/100 at Step 1 —
the delta is exactly the seven new cases, with every pre-existing test unmodified and still green.

Deliberate divergences from the reference, both cosmetic: the test constants keep Nimbus' own
`Culture = "en-gb"` / `BrandName = "Nimbus"` rather than the reference's `"en"` / `Brand = "Prime"` (renaming
`BrandName` would churn the Step 1 file for nothing, and `Brand` reads badly beside the `Brand` enum), and
the file stays at the Nimbus test path established in Step 1. Service and interface changes are literal ports.

**No satellite review for this step either.** `@backend` flagged it as non-trivial — it is the step where the
interface signature actually changes — but it has no agent-dispatch tool. The orchestrator judged the merged,
already-audited Meridian Prime precedent (`83b3f1205`) sufficient and put the choice to the developer, who elected
to proceed. Recorded rather than left implicit.

Useful confirmation from the grep sweep: the three resolver call sites are the **only** Nimbus callers of
this method. `NimbusApiController` does not call it at all, so Step 4 is genuinely independent. Meridian Core,
DropDesk and Apex HQ declare their own separate `ILocationSearchService` and are untouched by this change —
consistent with those brands having their own tickets.

### Step 3 — Nimbus resolvers: pass geo country at 3 call sites

Went as planned. The three `null` arguments became `context.ContentGeo.GeoData.Iso2Code` (page contact form,
`GeoPageContentResolverBase.cs:34`), `context.ContentGeo.GeoData.Iso2Code` (POI branch,
`CardModuleContentResolver.cs:204`) and `geo.GeoData.Iso2Code` (child-geo loop, `:263` — the loop's own geo,
not the page's). All three match the Meridian Prime reference verbatim. No `!` added: the early-return guard at
`GeoPageContentResolverBase.cs:27` and the preceding `geo.GeoData!` deref in the same expression already
establish non-null flow.

Evidence: brand build 0 warnings / 0 errors, filtered by project on a cold compile so the pre-existing
`CS0162`/`CS8509` in other files could not mask a new one. Full Nimbus suite 107/107.
`git diff --stat -- ContentResolvers/` shows exactly two files, 3 insertions / 3 deletions — **AC-7 satisfied**.

One reference difference investigated and dismissed: Meridian Prime's `GeoPageContentResolverBase` also carries
`placeId` and `geoCountryIso2Code` fields in its anonymous return object, which Nimbus lacks. Verified with
`git show 83b3f1205 --numstat` that ADLC-150 changed exactly **1 line** in that file, so those fields come
from unrelated work and are correctly out of scope here. Not a gap in the port.

**AC-5 is not yet verified.** This is the step where behaviour actually changes, and the only proof is a live
Vigo geo page and a Spanish country-level geo page against real Contentful data. The developer signed the
step off without stating whether they ran that check, so it is recorded as outstanding and carried into the
Test stage rather than presumed done. Unit tests prove the selection logic; they cannot prove the wiring
passes the right geo's country.

No satellite review: three argument substitutions match none of the satellite-review triggers.

### Step 4 — Nimbus controller: match IP country in `GetUserNearestCenterId`

Went as planned. `NimbusApiController.cs` only, `GetUserNearestCenterId` only: `takeLocations` `1` → `null`
so the result set is not truncated before the country filter; the `nearestByUserCountry` lookup matching
`DataLocation?.Country?.Iso3Code` against the IP geolocation's `CountryIsoCode3` under
`InvariantCultureIgnoreCase`, guarded by `string.IsNullOrEmpty`; and `NearestCenterId` preferring that match
with the original expression as fallback. The reference's comment explaining the guard
(`string.Equals(null, null)` is true) is carried over verbatim.

The `takeLocations` position was confirmed independently rather than assumed: `GetGeoResultsV2Query`'s
constructor is `…, culture, skipLocations, takeLocations, amenitiesIds`
(`Meridian.Web.Models/Contentful2025/Search/GetGeoResultsV2Query.cs:9-20`), so the literal `1` was the 10th
argument and the correct one; its neighbours were already `null`. `GetThreeNearestCenters` and its separate
`GetGeoResultsV2Query` are untouched.

Evidence: **forced** full rebuild (`--no-incremental`, so nothing could be masked by caching) — 0 errors,
and the Nimbus project owns exactly one warning, the pre-existing `CS8509` in `LocationGeoContentResolver.cs:145`.
Nothing in `NimbusApiController.cs`; the target-typed conditional that was flagged as the nullable risk
compiled clean. Full Nimbus suite 107/107.

**AC-9 verified by direct comparison.** With the brand token normalised, all three surfaces are identical to
the merged Meridian Prime reference:

| Surface                     | Result                              |
| --------------------------- | ----------------------------------- |
| `LocationSearchService.cs`  | identical after brand normalisation |
| `ILocationSearchService.cs` | identical                           |
| `GetUserNearestCenterId`    | identical, line for line            |

The only substantive difference anywhere in the port is `nameof(Brand.Nimbus)` vs `nameof(Brand.Prime)`.

**AC-6 is not yet verified.** This endpoint has no unit coverage by design — the plan excluded controller
tests as thin wiring — so a live call against a real IP geolocation is its only evidence. The developer
signed the step off without stating whether they ran it, so it is recorded as outstanding.

No satellite review: single-brand controller method, no new port/adapter, no cache key, no migration, no
shared-layer edit, mirroring an already-reviewed merged reference.

## Tech Debt

| #    | Description                                                                                                                                                                                                                                                                                                                                  | Type        | Tracker | Finding | Owner               | Next action                                                                                                                                                                                                                                                                                                                                                                                         |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ------- | ------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TD-1 | `!` suppression on the country-matched branch of `GetUserNearestCenterId`, against `backend/CLAUDE.md`'s "never silence with `!`". Present identically in Meridian Prime                                                                                                                                                                     | cleanup     | —       | RF-002  | the ticket assignee | Change `DataLocation!.LocationNumber` → `DataLocation?.LocationNumber` in **both** `Meridian.Web.Nimbus/Controllers/NimbusApiController.cs:852` and `Meridian.Web.Prime/Controllers/PrimeApiController.cs:754`. The other ternary arm already yields `int?`, so the type is unchanged. Do it before ADLC-151/152/153 clone the same line                                                            |
| TD-2 | The IP-country match reads the culture-specific `.Location` instead of the locale-invariant `.LocationEnglish`, so a centre with incomplete country data in one locale gives that locale's users a cross-border centre. Present identically in Meridian Prime                                                                                | cleanup     | —       | RF-003  | the ticket assignee | Assess whether `dataCountry` can differ per locale in Contentful; if so, switch the match to `.LocationEnglish` in both `NimbusApiController.cs:846` and `PrimeApiController.cs:747`. Same window — before the three remaining brand clones inherit it                                                                                                                                              |
| TD-3 | No PERF-3 measurement for the widened `takeLocations` on `GetUserNearestCenterId`. The endpoint is on the request path, uncached, and fired on page load; `05 Performance Efficiency.md` PERF-3 requires `LoadTests/` evidence that such a change does not degrade responsiveness. Meridian Prime shipped the same pattern to UAT without it | performance | —       | RF-004  | the ticket assignee | Add a `LoadTests/` scenario for `GET api/v3/usernearestcenterid` measuring the widened projection against the previous `Take(1)` shape, on Nimbus and Meridian Prime. If it regresses, bound the query (e.g. `takeLocations: 50`) rather than reverting — the widening is required for correctness. Close before ADLC-151/152/153 replicate it, since PERF-7 says per-brand capacity cost compounds |

<!--
Type values: blocker · dependency · cleanup · security · performance · ux
Tracker: fill in once a task is created (e.g. WEB-XX), otherwise —
Rows are added here by the Implement stage (references/04-implement.md Step 5) as debt is discovered.
-->

## Acceptance Criteria Validation

Against the checklist in [`1-plan.md`](1-plan.md). Seven of nine pass on recorded evidence; two require a
running brand and live Contentful/geolocation data and were **not verified**.

> ⚠️ **Read this before treating the ticket as proven.** AC-5 and AC-6 are the only two criteria that
> demonstrate the fix works for an actual user — that a Vigo page now shows a Spanish centre. Neither was
> observed running, by the agent or the developer. Everything green below this line is unit tests, builds
> and diffs: strong evidence the logic and wiring are right, but not the same as having seen it work.
> The developer chose to proceed on that basis on 2026-09-30; ADLC-154 (QA: Execution) is where it lands.

| AC                                                             | Verdict                              | Evidence                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| -------------------------------------------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| AC-1 — in-country centre wins over a nearer cross-border one   | ✅ pass                              | `…WhenCountryIsSuppliedAndHasACentre…` (Vigo/Braga/Coruña shape), plus `…WhenCountryIsSuppliedInLowerCase…` and `…WhenCountryHasSeveralCentres…`. All in the 108/108 run                                                                                                                                                                                                                                                                   |
| AC-2 — country with no centres falls back to nearest overall   | ✅ pass                              | `…WhenCountryHasNoCentres_ReturnsTheNearestCentreOverall`                                                                                                                                                                                                                                                                                                                                                                                  |
| AC-3 — geo with no centre within ~800 km returns non-null      | ✅ pass                              | `…WhenOnlyCentreIsBeyondTheSearchRadius…` and `…WhenCountryHasNoCentresAndTheOnlyCentreIsBeyondTheSearchRadius…`. Proven red-first: failed on unfixed code with `result.Value should not be null but was`, passed after                                                                                                                                                                                                                    |
| AC-4 — existing callers unchanged                              | ✅ pass                              | Full Nimbus suite green at every step with pre-existing tests unmodified (100→107→108 as cases were added). `…WhenCountryIsNotSupplied…` and `…WhenCountryIsAnEmptyString…` assert the pre-change result directly. Step 2 deliberately left the call sites passing `null`, so that run isolated the service change                                                                                                                         |
| AC-5 — geo cards and POI carry a same-country `locationNumber` | ⚠️ **not verified — handed to QA**   | Service-level behaviour covered by unit tests, but the wiring proof — a Vigo geo page and a Spanish country-level geo page showing Spanish `locationNumber`s — needs a running brand and live Contentful data. **Not performed by anyone in this flow.** Developer elected to proceed without it (2026-09-30); ADLC-154 (QA: Execution) is the sub-task that covers it                                                                     |
| AC-6 — `GetUserNearestCenterId` matches the IP country         | ⚠️ **not verified — handed to QA**   | No unit coverage by design (the plan excluded controller tests as thin wiring), so a live call is the only evidence. Needs a real IP geolocation. **Not performed.** Developer elected to proceed without it (2026-09-30); covered by ADLC-154                                                                                                                                                                                             |
| AC-7 — location cards and pages untouched                      | ✅ pass                              | `git diff --stat -- Meridian.Web.Nimbus/ContentResolvers/` → exactly `Pages/GeoPageContentResolverBase.cs` and `Components/CardModule/CardModuleContentResolver.cs`, 3 insertions / 3 deletions. Confirmed again by the PR review: all three `SearchNearestLocationByCoordinates` call sites in the brand were updated and no other resolver touched                                                                                       |
| AC-8 — build succeeds with no new warnings, no `!` suppression | ⚠️ **pass, with two qualifications** | Forced `--no-incremental` rebuild → 0 errors; the Nimbus project owns only the pre-existing `CS8509`. **(a)** The AC's literal "zero warnings" was unachievable — that `CS8509` exists on `develop` — so it is read as "no _new_ warnings", recorded at Step 1. **(b)** The "no `!`" half is **not** strictly met: `NimbusApiController.cs:852` adds one, inherited verbatim from the reference. Tracked as RF-002 and awaiting a decision |
| AC-9 — behavioural parity with the Meridian Prime reference    | ✅ pass                              | Service, interface and `GetUserNearestCenterId` each diff clean against Meridian Prime after normalising the brand token — the only difference anywhere is `nameof(Brand.Nimbus)`. Corroborated independently: the branch's code diff vs `develop` is line-for-line identical to ADLC-150's (339/10/23/4/2/14). Reviewer verified the claim separately                                                                                     |

## Test Results

| Project                                         | Build | Tests | Typecheck | Lint | Written | Passed | Failed | Skipped | Evidence                                                                                                                                                                                                                                  |
| ----------------------------------------------- | ----- | ----- | --------- | ---- | ------- | ------ | ------ | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Meridian.Web.sln` (full solution, 60 projects) | ✅    | —     | ✅        | —    | —       | —      | —      | —       | `dotnet build Meridian.Web.sln -m:1 -nodeReuse:false` → `0 Error(s)`, 58 warnings, all pre-existing and none in a changed file. Typecheck is the build for C#                                                                             |
| `Meridian.Web.Nimbus` (brand project)           | ✅    | —     | ✅        | —    | —       | —      | —      | —       | Forced rebuild `--no-incremental` → `0 Error(s)`; the project owns exactly one warning, the pre-existing `CS8509` at `LocationGeoContentResolver.cs:145`, untouched by this ticket. `WarningsAsErrors=Nullable` not tripped               |
| `Meridian.Web.Nimbus.Tests`                     | ✅    | ✅    | ✅        | —    | 9       | 108    | 0      | 0       | `dotnet test` → `Passed! - Failed: 0, Passed: 108, Skipped: 0, Total: 108`. Written = the 9 `[Fact]`s in the new `Web.Nimbus/Services/LocationSearchServiceTest.cs` (8 from Steps 1–2, 1 from RF-001); baseline was 99 before this branch |
| `Meridian.Web.UnitTests` (brand-agnostic)       | ✅    | ✅    | ✅        | —    | 0       | 1037   | 0      | 0       | `dotnet test` → `Passed! - Failed: 0, Passed: 1037`. Unchanged by this branch; run to confirm the interface change did not reach the shared layer                                                                                         |
| `Meridian.UnitTests` (brand-agnostic)           | ✅    | ✅    | ✅        | —    | 0       | 210    | 0      | 0       | `dotnet test` → `Passed! - Failed: 0, Passed: 210`. Unchanged by this branch                                                                                                                                                              |

No lint step exists for this repo's C# projects (no `dotnet format` gate in the build or CI definitions
inspected), so Lint is `—` throughout rather than a passed/failed claim. Other brand test projects were
not run: each references only its own brand's web project, and this change is confined to
`Meridian.Web.Nimbus`, which no other brand project references. The full-solution build covers their
compilation.

<!-- One row per non-overlapping project/suite scope, updated to its latest run.
Written = new test cases in this change, not files/assertions. Passed/Failed/Skipped
= latest runner case counts. Use unavailable when unknown, never infer counts from
exit status. Explicit 0 requires evidence; — is not measured. Evidence links runner
output and the diff supporting Written. Historical failed runs remain in stat.checks.
-->

## Efforts Spent

| Date       | Phase                                  | Human time  | AI tokens   | Notes                                                                        |
| ---------- | -------------------------------------- | ----------- | ----------- | ---------------------------------------------------------------------------- |
| 2026-09-30 | Implement — [Step 1](1-plan.md#step-1) | unavailable | unavailable | 3m 49s observed work, 2m 34s wait. Red→green proven; 100/100 suite pass      |
| 2026-09-30 | Implement — [Step 2](1-plan.md#step-2) | unavailable | unavailable | 4m 52s observed work. 8 new-file tests, suite 107/107, no new warnings       |
| 2026-09-30 | Implement — [Step 3](1-plan.md#step-3) | unavailable | unavailable | 3 arguments wired; AC-7 verified by diff scope; AC-5 deferred to Test        |
| 2026-09-30 | Implement — [Step 4](1-plan.md#step-4) | unavailable | unavailable | Controller ISO-3 match; AC-9 parity confirmed by diff; AC-6 deferred to Test |
| 2026-09-30 | Implement — all steps                  | unavailable | unavailable | 4/4 steps first-pass, no retries, no rework, no tech debt raised             |

## Documentation

_Date: 2026-09-30_

| Item                                                                  | Action                                                                                                                                         |
| --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `docs/System Architecture (LLD)/Backend/Nearest Centre Resolution.md` | **Updated** — reworked from a Meridian Prime narrative into a brand-agnostic mechanism description with Nimbus folded in                       |
| `docs/System Architecture (LLD)/Backend/00. Overview.md`              | No change needed — references the doc by title only, unchanged                                                                                 |
| `docs/System Architecture (LLD)/README.md`                            | No change needed — Backend row still reads 10 docs and lists "Nearest Centre Resolution"; no doc added, renamed or removed                     |
| `docs/README.md`                                                      | No change needed — does not index individual LLD Backend topic docs                                                                            |
| `docs/Target Architecture (HLD)/**`                                   | No change needed — HLD audit found no settled decision changed; the HLD describes the container generically and stays high-level               |
| `backend/Meridian.Web.Nimbus/README.md`                               | No change needed — no new build target, env var, endpoint or deployment step. The endpoint's contract is unchanged; only which centre it picks |
| `backend/docs/architecture/*.md`                                      | No change needed — no port, adapter, cache key or background job added or changed                                                              |
| `.claude/skills/`                                                     | No change needed — no new repeatable pattern; this ticket followed the existing ADLC-150 reference                                             |

### Notes

Two passages in `09. Nearest Centre Resolution.md` were **actively false** rather than merely stale once
this change landed, which is why this was the one doc that had to change: the Brand scope table stated
Nimbus had "no country parameter", and the closing paragraph named `Nimbus/…/LocationSearchService.cs:106`
as still carrying the give-up bug. A reader could have relied on either as a positive claim about current
behaviour.

The doc was reshaped rather than patched. It described the mechanism as a Meridian Prime story with a brand table
appended; with two brands now sharing identical code and three more ticketed to follow, the durable shape is
to describe the mechanism once and let a single table carry which brands have it. That keeps each future
brand conversion a one-row edit. Held at **119 lines** against the 120-line LLD budget, which required
tightening elsewhere — one Meridian Prime-only POI-link citation and the "Supporting facts:" label were dropped.

`@docs-writer` also corrected two **pre-existing** citation drifts it found while working, outside the brief:
`ContentfulContentGeoAdapter.cs:181-183` → `:186-188` and `:110-112` → `:114-115`. Both verified against
current source. It also replaced the `takeLocations` citation with the constructor range, since the query is
built positionally and there is no named-argument line to point at.

**Consistency review was performed by the orchestrator, not delegated to `@architect`.** Every factual claim
in the updated doc was verified against current source — the Nimbus line numbers, the three unconverted
brands' give-up lines, and both corrected drifts — plus the structural checks the principles require: 2
Mermaid blocks with 6 `classDef` colour declarations, inbound links from `00. Overview.md` and the LLD
README intact, the README's Backend doc count of 10 still matching the directory, and no Meridian Prime-only
framing left behind. `@architect` had already audited this same change against the HLD minutes earlier and
returned **go**; a second delegated pass over a single-file edit whose every claim had been source-verified
would not have added signal. Recorded as a deliberate deviation from `references/06-document.md` Step 3
rather than left implicit.

## Completion

_Date: 2026-09-30_

The developer declined all three external actions at the completion gate. Nothing was pushed, published or
transitioned; everything below is the state as left.

| Action                 | Decision                         | State as left                                                                                                                                                                                           |
| ---------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Push branch / open PR  | **Declined** — leave local       | `feature/ADLC-007` has 7 commits and **no upstream**. PR title and description were prepared and are reproduced below for reuse                                                                         |
| Jira transition        | **Declined** — leave In Progress | ADLC-007 remains `In Progress`, assigned to the ticket assignee. No `@scrum-master` transition was requested. Matches the ADLC-150 precedent, which sat in UAT rather than Done at the equivalent point |
| Raise TD-1/2/3 in Jira | **Declined** — local ledger only | The three rows in the Tech Debt table above are the durable record, each with an owner and a concrete next action. No tracker key exists for any of them                                                |

The archived folder name reads "✅ Done" because that is this harness's fixed archive convention
(`references/06-document.md` Step 6), not a claim that the ticket is delivered. Delivery state is the Status
row: the dev lifecycle finished, the change is unpushed, and two acceptance criteria were never observed
running.

### Prepared PR description

Held here so it does not have to be rewritten when the branch is pushed.

```markdown
Nimbus geo pages attributed enquiries to the nearest centre by distance alone, so
Vigo (Spain) resolved to Braga (Portugal) and Spanish leads landed with a Portuguese
centre. The nearest-centre search now prefers a centre in the geo's own country,
falling back to the existing distance-only search only when that country has no
centres at all.

Clone of ADLC-150 (Meridian Prime, merged in 83b3f1205, currently UAT). The service,
interface and controller method are character-identical to that reference apart
from the brand token.

## What changed

- `LocationSearchService` takes `string? countryIso2Code`; when supplied and the
  country has a centre, the nearest one there wins and the radius loop is skipped.
- The geo contact form, POI cards and child-geo cards pass their geo's own ISO2.
- `GetUserNearestCenterId` widens its query and prefers the IP-geolocated country
  by ISO-3, guarded against an unresolved country.
- Fixes a latent bug: the radius search's give-up branch re-ordered an already-empty
  collection and so always returned null, meaning any geo with no centre within
  ~800 km resolved to no centre at all.

## Verification

- Nimbus suite 108/108 · Meridian.Web.UnitTests 1037/1037 · Meridian.UnitTests 210/210
- Full solution build: 0 errors, no new warnings
- 9 new unit tests. The bug fix was proven red-first; the country guard's regression
  test was verified by neutralising the guard (1 failed / 8 passed).

## Not verified

AC-5 (Vigo geo page shows a Spanish centre) and AC-6 (usernearestcenterid) need a
running brand and live data. Neither was observed. ADLC-154 (QA: Execution) covers them.

## Follow-ups (see the archived story's report)

- TD-1 — `!` suppression at NimbusApiController.cs:852, against CLAUDE.md's rule
- TD-2 — ISO-3 match reads the culture-specific entry, not `.LocationEnglish`
- TD-3 — no PERF-3 load-test evidence for the widened query

All three exist identically in Meridian Prime and are best fixed as a pair before
ADLC-151 / ADLC-152 / ADLC-153 clone them.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

### Commits on the branch

| Commit      | Subject                                                                                        |
| ----------- | ---------------------------------------------------------------------------------------------- |
| `fe57f2dda` | `ADLC-007 docs[BE](nimbus): add implementation plan for country-aware nearest centre`          |
| `d8bb93ba2` | `ADLC-007 fix[BE](nimbus): return nearest centre when none is inside the widest search radius` |
| `21ae300e5` | `ADLC-007 feat[BE](nimbus): prefer a same-country centre in nearest-centre search`             |
| `60924d3bb` | `ADLC-007 feat[BE](nimbus): pass geo country to nearest-centre lookups`                        |
| `8e70d0037` | `ADLC-007 feat[BE](nimbus): match user country in GetUserNearestCenterId`                      |
| `2068625f6` | `ADLC-007 test[BE](nimbus): pin the country guard against centres with no country`             |
| `43ca953bd` | `ADLC-007 docs[BE](nimbus): record country-aware nearest centre and archive story`             |

`backend/Meridian.Web.Nimbus/appsettings.Development.json` and `appsettings.Nimbus.json` were modified in the
working tree before this ticket began and carry local developer credentials. They were deliberately excluded
from every commit — each one staged explicit paths, never `git add -A` over `backend/`. They remain modified
and uncommitted.
