# Settlement data

Each file here is one settlement, hand-curated per the Tech Design (no
scraping in MVP). Add a settlement by adding a new JSON file matching the
`Settlement` shape in `src/types/settlement.ts` — `src/data/settlements/index.ts`
imports every file and the TypeScript build fails if one doesn't match the
schema.

## Current data (sourced 2026-09-18)

These four are **real, currently-tracked settlements**, not fictional
placeholders — verified against multiple independent news/aggregator
sources (ClassAction.org, TopClassActions, OpenClassActions, ClaimDepot)
that agree on the name, official administrator site, deadline, and
eligibility basics:

- `landsend-data-breach-settlement-2026.json` — open, deadline 2026-10-22.
- `situsamc-data-incident-settlement-2026.json` — open, deadline 2026-11-06.
- `deere-repair-settlement-2026.json` — open, deadline 2026-12-31.
- `comcast-xfinity-data-breach-settlement-2026.json` — **closed** (deadline
  2026-09-14 already passed). Kept deliberately so the app's
  expired-settlement filtering has a real example to filter, instead of a
  fabricated one.

**Important limitation:** this environment's network policy blocks
fetching the settlement administrators' own sites directly (egress is
restricted to an allowlist), so the exact wording of each `claimFields`
entry was inferred from secondary sources (news coverage, aggregator
summaries), not read verbatim off the official claim form. The `deadline`,
`administratorUrl`, and the substance of `eligibilityQuestions` (who's
covered, what incident, what date range) are corroborated across multiple
independent sources and are the parts this app depends on for correctness
(expiry filtering, the ineligibility gate). Before this data is shown to
real users, a human should open each `administratorUrl` directly and
confirm the live form still matches — settlement deadlines and terms can
change after a claims-administration order.

Add a new settlement the same way: find its official administrator site
(never guess a domain — search-engine snippets have gotten this wrong
before), confirm the deadline and eligibility from at least two independent
sources, and only then write the JSON file.
