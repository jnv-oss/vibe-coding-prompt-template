# Settlement data

Each file here is one settlement, hand-curated per the Tech Design (no
scraping in MVP). Add a settlement by adding a new JSON file matching the
`Settlement` shape in `src/types/settlement.ts` — `src/data/settlements/index.ts`
imports every file and the TypeScript build fails if one doesn't match the
schema.

**The three `example-*` settlements shipped with this scaffold are
fictional placeholder data**, not verified real settlements. Before this
app is used with real users, replace them with settlements verified against
their official administrator site, per the PRD's data-sourcing decision —
never invent or guess real settlement details.
