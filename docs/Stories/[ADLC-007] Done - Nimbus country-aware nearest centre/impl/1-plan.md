# ADLC-007: Nimbus country-aware nearest centre

| Field   | Value              |
| ------- | ------------------ |
| Ticket  | ADLC-007           |
| Branch  | `feature/ADLC-007` |
| Created | 2026-09-30         |

## Context

A customer reported that enquiries raised from Vigo (Spain) land with the Braga (Portugal) centre.
Spanish leads must be handled in Spain; when Vigo has no centre of its own the enquiry should go to
another Galician centre (La Coruña was the example given), not across the border.

The cause is that `SearchNearestLocationByCoordinates`
(`Meridian.Web.Nimbus/Business/Services/LocationSearchService.cs:93`) is a pure expanding-radius
geographic search with no notion of country. Across a land border the nearest centre in kilometres is
frequently in the wrong country, so every surface that derives a "closest centre" from a geo inherits
the defect.

This is the **Nimbus clone of ADLC-150**, which made the identical change on Meridian Prime and is already
merged (`83b3f1205`, PR 4821) and in UAT. That commit is the reference implementation and the target
shape for this one; `docs/System Architecture (LLD)/Backend/Nearest Centre Resolution.md` documents
its behaviour. The Nimbus code is a structural clone of the pre-change Meridian Prime code — same service,
same constants (50 km / 1000 km), same collaborator (`IContentfulContentLocationService`), same three
call sites, same controller endpoint. Nothing about this change needs to be re-derived.

A second, latent defect sits in the exact fallback path this change starts exercising. In the radius
loop's give-up branch (`LocationSearchService.cs:106`), once `currentSearchRadius` passes the 1000 km
threshold the code orders `locationsInRadius` — necessarily empty at that point, since an empty result
is what drove the loop there — instead of `allLocationsValue`. It therefore always yields `null`, so any
geo with no centre within roughly 800 km returns no centre at all. Adding country preference makes a
country-with-no-centres geo land on precisely that branch, so the two must ship together. The sibling
`GeoSearchService.SearchGeoByCoordinatesInCountryWithLocations` (`GeoSearchService.cs:122`) implements
the same loop correctly against `allGeosValue`, which is the shape this fix restores.

**Intended outcome:** a Nimbus geo in a country that has centres always resolves to a centre in that
same country; a geo in a country with no centres keeps the existing nearest-overall behaviour and
returns a centre rather than `null`.

## Scope

**In scope:** `Meridian.Web.Nimbus` only — the brand-local `Business/Services` layer, its two content
resolvers, and the `GetUserNearestCenterId` endpoint. HLD container **Backend**.

**Out of scope:**

- **Meridian Core, Apex HQ (`ContentLocationApex`) and DropDesk**, which carry a near-identical copy of this
  service and the same defect. Each has its own ticket with its own QA sub-task chain — ADLC-151,
  ADLC-152, ADLC-153. Confirmed with the developer at Context sign-off. Meridian Prime is already done
  under ADLC-150.
- Location cards and location pages — they keep current behaviour, per the ticket.
- The LLD doc update (`09. Nearest Centre Resolution.md` Brand scope table) — in scope for the ticket
  but handled by the **Document** stage, not a numbered implementation step.
- `appsettings.Development.json` / `appsettings.Nimbus.json`, which hold local-only developer
  credentials in the working tree and must never be committed.

## Acceptance Criteria

- [ ] `AC-1` — A Nimbus geo in a country that has at least one centre resolves to a centre in that same
      country, nearest first, even when a centre across the border is closer. Verified by unit test over
      a mocked location set (ES + PT centres, ES geo nearest to the PT one).
- [ ] `AC-2` — A geo in a country with no centres at all falls through to the existing nearest-overall
      search and returns a centre. Verified by unit test (ISO2 matching no centre still returns the
      globally nearest).
- [ ] `AC-3` — A geo with no centre within ~800 km returns the globally nearest centre rather than
      `null`. Verified by unit test placing the only centre ~2000 km away; asserts non-null. This is the
      `LocationSearchService.cs:106` fix and fails on `develop`.
- [ ] `AC-4` — Existing callers are unchanged in behaviour. Verified by the existing
      `Meridian.Web.Nimbus.Tests` suite passing unmodified, and by a unit test asserting a null/blank
      `countryIso2Code` produces exactly the pre-change result.
- [ ] `AC-5` — Geo cards at country level and POI at city level carry a `locationNumber` in the same
      country as their own geo. Verified by unit test on the service plus a page load of a Spanish
      country geo page and a city geo page.
- [ ] `AC-6` — `GetUserNearestCenterId` returns a centre in the user's IP-geolocated country when that
      country has centres, and the globally nearest otherwise.
- [ ] `AC-7` — Location cards and location pages are untouched: no diff under
      `Meridian.Web.Nimbus/ContentResolvers/` other than `Pages/GeoPageContentResolverBase.cs` and
      `Components/CardModule/CardModuleContentResolver.cs`.
- [ ] `AC-8` — `dotnet build Meridian.Web.Nimbus/Meridian.Web.Nimbus.csproj` succeeds with zero warnings.
      `WarningsAsErrors=Nullable` is set on this project (`Meridian.Web.Nimbus.csproj:7`), so no `!`
      suppression is introduced.
- [ ] `AC-9` — The final Nimbus code is behaviourally equivalent to the merged Meridian Prime reference.
      Verified by diffing the two services and confirming the only differences are namespace/brand.

## Test strategy

The risk in this change is entirely in the selection logic of one service, and that service has exactly
one collaborator (`IContentfulContentLocationService`), which Moq can stand in for. So the new tests are
**unit tests on `LocationSearchService`**, in the existing `Meridian.Web.Nimbus.Tests` project
(xUnit + Moq + Shouldly).

**Location and namespace follow the Nimbus project's own convention, not Meridian Prime's.** Nimbus flattens
`Business/` in its test tree — `Web.Nimbus/Services/GeoSearchServiceTest.cs` has namespace
`Meridian.Web.UnitTests.Nimbus.Services` and tests `Business.Services.GeoSearchService`. So the new file
is `Meridian.Web.Nimbus.Tests/Web.Nimbus/Services/LocationSearchServiceTest.cs`, namespace
`Meridian.Web.UnitTests.Nimbus.Services`, sitting next to its sibling. (Meridian Prime used
`Web.Meridian Prime/Business/Services/` — copying that path here would be inconsistent with Nimbus.)

Steps 3 and 4 get no new unit tests: the resolvers and the controller are thin wiring over the service,
and covering them would mean constructing `SiteRequestContext` and the controller's full dependency
graph for no additional signal about the logic under change. They are verified by build plus a live page
and endpoint check, which is what actually proves the wiring. The existing `NimbusApiControllerTest`,
`NimbusPageDataControllerTest` and `GeoPageContentResolverTest` use loose `new Mock<ILocationSearchService>()`,
so the signature change does not break them — which is itself the AC-4 evidence.

Step 1's test is written to fail on `develop` first, so the bug it fixes is demonstrated rather than
asserted.

## Environment note (applies to every step)

This machine has **no .NET 7 SDK** (`dotnet --list-sdks` → 6.0.428, 8.0.425, 9.0.304, 9.0.315, 10.0.301,
10.0.303) and `DOTNET_ROLL_FORWARD` is unset. `dotnet build` works regardless; `dotnet test` starts a
`net7.0` host and aborts with `You must install or update .NET to run this application` unless prefixed:

```bash
DOTNET_ROLL_FORWARD=LatestMajor dotnet test ...     # bash
$env:DOTNET_ROLL_FORWARD = 'LatestMajor'            # PowerShell, current session
```

See `backend/CLAUDE.md`. If MSBuild reports `CS2012`, rebuild with `-m:1 -nodeReuse:false`.

Unlike Prime/Meridian Prime, Nimbus has unique local ports (`https://localhost:7172` / `http://localhost:5041`),
so there is no ambiguity about which project is listening.

## Steps

### Step 1 — Nimbus service: fix the give-up branch so a distant geo returns a centre

A bug fix, landing as its own commit (`fix[BE]`), separate from the feature work in Step 2.

**Changes:**

- `Meridian.Web.Nimbus/Business/Services/LocationSearchService.cs:106` — in the
  `currentSearchRadius > SearchLocationsByCoordinatesRadiusThresholdKm` branch, order `allLocationsValue`
  instead of `locationsInRadius`. `locationsInRadius` is empty whenever control reaches that branch, so
  the branch can only ever have returned `null`. Matches the working equivalent in
  `GeoSearchService.cs:122` and the merged Meridian Prime fix.
- `Meridian.Web.Nimbus.Tests/Web.Nimbus/Services/LocationSearchServiceTest.cs` — **new file.** Mocks
  `IContentfulContentLocationService.GetAllLocations` to return a single centre roughly 2000 km from the
  queried coordinates, and asserts the result is that centre, not `null`.

**Verification:**

> Run: `git stash && DOTNET_ROLL_FORWARD=LatestMajor dotnet test Meridian.Web.Nimbus.Tests/Meridian.Web.Nimbus.Tests.csproj --filter "FullyQualifiedName~LocationSearchServiceTest"`
> Expected: the new test **fails** — demonstrating the bug on `develop`. Then `git stash pop`.
>
> Run: `DOTNET_ROLL_FORWARD=LatestMajor dotnet test Meridian.Web.Nimbus.Tests/Meridian.Web.Nimbus.Tests.csproj --filter "FullyQualifiedName~LocationSearchServiceTest"`
> Expected: the test passes. → **AC-3**

### Step 2 — Nimbus service: add country preference to the nearest-centre search

Depends on Step 1 — the country-with-no-centres fallback relies on the branch fixed there.

**On the signature and why the call sites move in two stages.** The reference implementation makes
`countryIso2Code` a **required** parameter sitting before `CancellationToken`. It cannot be optional:
C# forbids an optional parameter ahead of a required one (`CS1737`), and moving it after
`CancellationToken` would diverge from Meridian Prime for no gain. A required parameter means the three call
sites must compile against the new signature in this step. So **this step updates them to pass `null`
explicitly** — provably no behaviour change, and the step stays independently verifiable — and **Step 3
flips them to the real ISO code**. That keeps the service logic and the resolver wiring as separate,
separately-verified units, at the cost of touching three lines twice within the same PR. The final state
is byte-equivalent to Meridian Prime either way.

**Changes:**

- `Meridian.Web.Nimbus/Business/Services/ILocationSearchService.cs:16` — add `string? countryIso2Code`
  before `CancellationToken cancellationToken`, with the same XML doc comment the reference carries.
- `Meridian.Web.Nimbus/Business/Services/LocationSearchService.cs:93` — same signature change. When
  `countryIso2Code` is non-blank, first select the subset of `allLocationsValue` whose
  `DataLocation.Country.Iso2Code` matches under `StringComparison.OrdinalIgnoreCase`; if that subset is
  non-empty, order it by distance using the existing `GeocodingHelper.Point1Precalculated` (already
  constructed at `:99`) and return the first, skipping the radius loop entirely. Only when the subset is
  empty does control fall through to the existing loop, unchanged. No added cost: the radius loop's
  bounds check already scans every location on each iteration, so a single ordered pass over a country
  subset is strictly cheaper. `DataCountry.Iso2Code` is nullable, so a centre with no country never
  matches.
- The three call sites pass `null` for now — `ContentResolvers/Pages/GeoPageContentResolverBase.cs:32`,
  `ContentResolvers/Components/CardModule/CardModuleContentResolver.cs:204` and `:263`.
- `Meridian.Web.Nimbus.Tests/Web.Nimbus/Services/LocationSearchServiceTest.cs` — add the remaining seven
  cases from the reference suite: in-country centre wins over a nearer cross-border one (the Vigo/Braga
  shape); ISO2 matching is case-insensitive; a country with several centres returns its nearest; an ISO2
  with no centres falls back to the globally nearest; that fallback still works when the only centre is
  beyond the radius; a null `countryIso2Code` returns the nearest regardless of country; an empty-string
  `countryIso2Code` does the same.

**Verification:**

> Run: `DOTNET_ROLL_FORWARD=LatestMajor dotnet test Meridian.Web.Nimbus.Tests/Meridian.Web.Nimbus.Tests.csproj`
> Expected: all tests pass — the 8 new ones plus every pre-existing controller, resolver and middleware
> test, unmodified. → **AC-1, AC-2, AC-4**
>
> Run: `dotnet build Meridian.Web.Nimbus/Meridian.Web.Nimbus.csproj`
> Expected: `Build succeeded. 0 Warning(s) 0 Error(s)`. → **AC-8**

### Step 3 — Nimbus resolvers: pass the geo's country to the three geo-derived call sites

Depends on Step 2. `DataGeo` already exposes `Iso2Code` directly
(`Meridian.Web.Models/Contentful2025/ContentGeos/DataGeo.cs:140`) — a non-nullable `string`, `string.Empty`
for `global-region` geos, which fails the blank guard and correctly means "no country preference". It is
available on `context.ContentGeo.GeoData` with no extra service call and no new dependency.

**Changes:**

- `Meridian.Web.Nimbus/ContentResolvers/Pages/GeoPageContentResolverBase.cs:32` — `null` →
  `context.ContentGeo.GeoData.Iso2Code`. This is the contact-form data on geo pages and on
  home/marketing pages carrying a contact form.
- `Meridian.Web.Nimbus/ContentResolvers/Components/CardModule/CardModuleContentResolver.cs:204` — same,
  for the POI-at-city-level branch.
- `Meridian.Web.Nimbus/ContentResolvers/Components/CardModule/CardModuleContentResolver.cs:263` — pass
  `geo.GeoData.Iso2Code`, the **loop's own** geo, not `context.ContentGeo`, for the
  geo-cards-at-country-level branch. Each card is a different child geo, so the country must come from
  `geo`. The preceding `geo.GeoData!` deref in the same expression satisfies nullable flow analysis, so
  no extra `!` is needed.

No other resolver is touched, which is what keeps location cards and location pages unchanged.

**Verification:**

> Run: `dotnet build Meridian.Web.Nimbus/Meridian.Web.Nimbus.csproj`
> Expected: `Build succeeded. 0 Warning(s) 0 Error(s)`.
>
> Run: `git diff --stat -- Meridian.Web.Nimbus/ContentResolvers/`
> Expected: exactly two files — `Pages/GeoPageContentResolverBase.cs` and
> `Components/CardModule/CardModuleContentResolver.cs`. → **AC-7**
>
> Run the brand locally (`dotnet watch run --urls "http://localhost:8080"` from `Meridian.Web.Nimbus`)
> and open the Vigo geo page. Confirm the contact-form payload's `locationNumber` is a Spanish centre
> and **not** a Portuguese one. Then open a Spanish country-level geo page and confirm the geo cards'
> `locationNumber` values are Spanish centres. → **AC-5**
> This needs the developer's eyes on live Contentful data, so it is presented for confirmation rather
> than self-certified.

### Step 4 — Nimbus controller: match the IP-geolocation country in `GetUserNearestCenterId`

Independent of Steps 1–3 — a separate code path that does not call `SearchNearestLocationByCoordinates`.
It matches on **ISO-3**, because IP geolocation supplies `CountryIsoCode3`, unlike the geo path's ISO-2.

**Changes:**

- `Meridian.Web.Nimbus/Controllers/NimbusApiController.cs:815-847` — mirror the merged Meridian Prime change:
  - `GetGeoResultsV2Query`'s `takeLocations` `1` → `null`, so the result set is not truncated to one
    before the country filter runs.
  - Prefer the first result whose `Location.Location.DataLocation?.Country?.Iso3Code` matches the IP
    geolocation's `CountryIsoCode3` under `InvariantCultureIgnoreCase`, falling back to
    `FirstOrDefault()`.
  - Guard the match with `string.IsNullOrEmpty(geolocationValue.CountryIsoCode3)` first — carry the
    reference's comment explaining why: `string.Equals(null, null)` is true, so an unresolved IP country
    would otherwise match the first centre carrying no country data.

Performance note, verified rather than assumed: in
`Meridian.Web.Services/Contentful2025/Search/ContentfulSearchServiceV2025.cs:119-125` the `Take` is applied
_after_ the locations are searched, distance-sorted and amenity-counted, and `totalGeoResults` is
computed before it. Widening it therefore adds no search cost — only a projection over all centres
instead of one. Accepted as the correct-by-construction option.

**Verification:**

> Run: `dotnet build Meridian.Web.Nimbus/Meridian.Web.Nimbus.csproj`
> Expected: `Build succeeded. 0 Warning(s) 0 Error(s)`.
>
> Run: `DOTNET_ROLL_FORWARD=LatestMajor dotnet test Meridian.Web.Nimbus.Tests/Meridian.Web.Nimbus.Tests.csproj`
> Expected: all tests pass, including the existing `NimbusApiControllerTest`.
>
> With the brand running, call the `usernearestcenterid` endpoint and confirm a `NearestCenterId` in the
> IP-geolocated country is returned. This needs the developer's judgement on which IP/geolocation the
> local environment actually resolves to, so it is presented for confirmation rather than
> self-certified. → **AC-6**
>
> Run: `git diff Meridian.Web.Nimbus/Business/Services/LocationSearchService.cs` against the Meridian Prime
> equivalent and confirm the only differences are namespace and brand. → **AC-9**
>
> Run `git status` before each commit and confirm `appsettings.Development.json` and
> `appsettings.Nimbus.json` are **not** staged — they carry local-only credentials.

## Commit plan

One commit per step, following `docs/Engineering Guide/08 Delivery Workflow.md`. The bracketed `[BE]` is
mandatory — `scripts/generateChangelog.js` parses it and a bare `BE:` silently lands the entry under
"Other".

1. `ADLC-007 fix[BE](nimbus): return nearest centre when none is within the search radius`
2. `ADLC-007 feat[BE](nimbus): prefer a same-country centre in nearest-centre search`
3. `ADLC-007 feat[BE](nimbus): pass geo country to nearest-centre lookups`
4. `ADLC-007 feat[BE](nimbus): match user country in GetUserNearestCenterId`
