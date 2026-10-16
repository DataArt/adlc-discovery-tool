# WEB-42354: Spaces country-aware nearest centre — Intent

| Field   | Value      |
| ------- | ---------- |
| Ticket  | WEB-42354  |
| Created | 2026-09-30 |

## Problem

On Spaces, a geo page for Vigo (Spain) resolves its nearest centre to Braga (Portugal), so enquiries
raised from Spanish geo pages are attributed to a Portuguese centre and land with the wrong country's
sales team. The business asks that Spanish leads stay in Spain: if Vigo has no centre of its own, the
enquiry should go to another Galician or Spanish centre (La Coruña, for example) rather than across the
border. The cause is that `SearchNearestLocationByCoordinates` in `IWG.Ark.Web.Spaces` picks purely by
great-circle distance and never considers which country the geo is in.

This is the Spaces clone of WEB-42341, which made the same change on Regus2025 and is already merged
(commit `83b3f1205`, PR 183166) and in UAT. That change is the reference implementation for this one.

## Proposed outcome

A geo page or geo card on Spaces resolves its nearest centre to a centre in the geo's **own country**
whenever that country has any centre at all, even when a centre across the border is physically closer.
Only when the geo's country has no centres does the existing distance-only search apply. The browser's
"my nearest centre" API call behaves the same way, keyed on the IP geolocation's country.

Location cards and location pages are unchanged — the ticket is explicit that those stay as they are.

## Affected users and systems

- **Container:** Backend only — `IWG.Ark.Web.Spaces`. No Edge, Frontend, DataSync, Data or Delivery change.
- **Who feels it:** Spaces visitors on geo pages and home/marketing pages carrying a contact form, and the
  sales teams receiving the resulting enquiries.
- **Surfaces:** the geo contact-form payload's `locationNumber`, the `locationNumber` on POI and child-geo
  cards, and the `NearestCenterId` returned by the Spaces `usernearestcenterid` API.

Six changes were agreed in scope:

1. `Business/Services/ILocationSearchService.cs` and `LocationSearchService.cs:93` — an optional
   `string? countryIso2Code` with a country-preferred branch ahead of the radius loop.
2. The geo's `Iso2Code` passed at the three call sites: `ContentResolvers/Pages/GeoPageContentResolverBase.cs:32`,
   `ContentResolvers/Components/CardModule/CardModuleContentResolver.cs:204` and `:263`.
3. `Controllers/SpacesApiController.cs:815` `GetUserNearestCenterId` — `takeLocations` `1` → `null`, then
   prefer the result whose `Iso3Code` matches the IP geolocation country, guarded against a null country.
4. The give-up branch at `LocationSearchService.cs:106` orders `locationsInRadius` — necessarily empty at
   that point — instead of `allLocationsValue`, so it always yields null. The new country-has-no-centres
   fallback lands directly on that branch, so it is fixed here.
5. The reference's eight unit tests ported into `IWG.Ark.Web.Spaces.Tests`.
6. The Brand scope table in `docs/System Architecture (LLD)/Backend/09. Nearest Centre Resolution.md`
   updated to reflect Spaces.

## Constraints

- **Spaces brand only.** IWG2026, HQ and StopAndWork carry near-identical copies of this service but have
  their own tickets (WEB-42359, WEB-42364, WEB-42368), each with its own QA sub-task chain. Do not fold
  them in. Regus2025 is already done under WEB-42341.
- The new parameter is **optional**, so no existing caller outside these three sites changes.
- The country-preferred path must not be more expensive than today: it skips the radius loop entirely and
  orders only the country subset by distance.
- Behaviour when the geo has no country, or its country has no centres, must be exactly what it is today
  (modulo the give-up bug fix).
- Nullable warnings are build errors on brand projects — no `!` silencing.
- `DataGeo.Iso2Code` is a non-nullable `string` that is `string.Empty` for `global-region` geos, so the
  blank guard is what makes "no country preference" work.

## Open questions

None. Brand scope was the one open question and it was resolved before sign-off: per-brand sibling tickets
exist, so this ticket is Spaces only.
