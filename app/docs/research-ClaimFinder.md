```json
{"app":"ClaimFinder","mode":"quick","platform":"web","userLevel":"individual consumers","budget":"unspecified","timeline":"days (quick MVP)"}
```

# Research: ClaimFinder (class action settlement claim aggregator)

## Decision this research informs
Whether a "discovery + auto-fill" claim aggregator is a viable, low-risk MVP to
build in days, and what boundaries keep it out of legal trouble while still
being useful.

## Idea as stated
A platform that scans active/open class action settlements, matches a user
against them based on info they provide, and auto-fills the official claim
form so the user just reviews and submits it themselves (chosen scope:
**Discovery + auto-fill**, not auto-submit).

## Competitive landscape (evidence)
Several apps already operate in this exact space, confirming demand and a
workable legal posture:

- **Payout** ("Claim Class Actions") — iOS/Android app, settlement discovery +
  guided filing. Explicitly states it is "a settlement-discovery app, not a
  law firm," does not give legal advice, and does not guarantee eligibility or
  payout. — [App Store](https://apps.apple.com/us/app/payout-claim-class-actions/id6748968935), [trypayout.app](https://trypayout.app/blog/best-class-action-settlement-apps)
- **Settle**, **Catch** — similar consumer discovery/filing apps. — [Google Play](https://play.google.com/store/apps/details?id=com.compensation.claim&hl=en_US), [Catch](https://www.choosecatch.com/)
- **ClaimDepot** — browse/search/filter open settlements, file claims. —
  [claimdepot.com](https://www.claimdepot.com/settlements)
- **ClassAction.org**, **TopClassActions**, **Consumer Action** — long-running
  manually curated directories of open lawsuits/settlements (no auto-fill). —
  [classaction.org](https://www.classaction.org/list-of-lawsuits), [topclassactions.com](https://topclassactions.com/), [consumer-action.org](https://www.consumer-action.org/lawsuits/by-status/open)
- **DoNotPay** — cautionary case. Marketed itself as replacing a lawyer and
  was sued in 2023 under California's Unfair Competition Law for allegedly
  "practicing law without a license" and misrepresenting its product. —
  [Wikipedia: DoNotPay](https://en.wikipedia.org/wiki/DoNotPay)

## Legal/compliance boundary (key uncertainty, resolved for MVP scope)
- Unauthorized-practice-of-law (UPL) risk comes from **acting as the user's
  legal agent** (submitting on their behalf, guaranteeing outcomes, giving
  legal advice) — that's what got DoNotPay sued.
- Apps that stay in **discovery + self-service filing** (surface eligible
  settlements, pre-fill the form, user reviews and clicks submit themselves)
  operate in the same space as Payout/Catch/ClaimDepot without that exposure.
- **Decision:** MVP must keep the user as the one who submits the claim
  (matches the "Discovery + auto-fill" scope already chosen). Never submit on
  the user's behalf, never state or imply eligibility/payout is guaranteed,
  and add a visible disclaimer ("not a law firm, not legal advice") on every
  match result — mirrors how existing players message this.
- Open question deferred past MVP: some claims require **proof of purchase**
  or a **notarized signature**; "no-proof" claims carry a real perjury risk if
  a user falsely claims eligibility — the UI should not encourage guessing.

## Data sourcing (resolved: manual/curated list for MVP)
- Automated scraping of settlement administrator sites / PACER carries ToS
  and data-freshness risk that's disproportionate to a days-scale MVP.
  Confirmed viable pattern: ClassAction.org/TopClassActions/Consumer Action
  all run as manually curated, editorially maintained lists.
- **Decision:** MVP ships with a small hand-curated JSON/DB list of current
  open settlements (name, administrator URL, eligibility criteria, deadline,
  claim form fields). Aggregation/scraping is a clear post-MVP upgrade path,
  not a blocker.

## Sensitive-data handling (flagged, not deferrable)
Auto-filling a claim form means collecting name, address, and sometimes
email/order numbers — enough to require: HTTPS everywhere, encryption at
rest for stored profile data, no logging of raw form field values, and a
clear "why we need this" note per field. This is a security-boundary
requirement for the MVP, not a nice-to-have, per the size of the risk if this
kind of data leaks.

## Recommendation
Proceed with the MVP as scoped: **Discovery + auto-fill, individual
consumers, manual curated settlement list, quick (days) timeline.** It matches
a proven, non-UPL pattern already operating in market. Main MVP constraints
to carry into the PRD: (1) user always submits the final claim themselves,
(2) visible non-legal-advice disclaimer, (3) curated settlement list is
data, not scraped, (4) basic PII hygiene (HTTPS, encryption at rest, minimal
logging) is in scope even for a quick MVP.

## Handoff Context
- **App:** ClaimFinder (provisional name — confirm/rename during PRD)
- **User level:** individual consumers, no accounts required to browse; a
  profile is needed to auto-fill (details TBD in PRD)
- **Platform:** web (assumed; not yet confirmed)
- **Budget:** unspecified
- **Timeline:** quick MVP (days)
- **Mode:** Quick
- **Constraints:** user submits claims themselves (no auto-submit / no acting
  as legal agent); visible "not legal advice" disclaimer; curated settlement
  data (no scraping in MVP); PII handled with HTTPS + encryption at rest +
  minimal logging
- **Decisions:** Discovery + auto-fill scope; manual curated data source;
  individual consumers as primary user
- **Source files:** this file (`app/docs/research-ClaimFinder.md`)
- **Open questions:** exact platform (web vs. mobile), whether user accounts
  are required, how many settlements to seed the curated list with, whether
  e-signature/notarization flows are in scope for any seed settlement
