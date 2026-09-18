# Technical Design: ClaimFinder MVP

## Starting point
Greenfield project — no existing stack to inspect. Design picks the smallest
architecture that satisfies the PRD's constraints (no accounts, manually
curated data, quick/days timeline, no PII persisted beyond what's needed for
the current interaction).

## Key architectural decision: no backend for MVP
The PRD's own constraints point at a static, client-only app:
- No accounts → nothing to authenticate.
- Session-based, not persisted → answers only need to exist for the current
  page load, not survive a server restart or be queryable later.
- Curated (not scraped) settlement data → the "database" is just files
  maintained in the repo, not a live store.
- Never auto-submits → there is no outbound write to any third-party claims
  API to broker.

**Decision:** ship ClaimFinder as a static single-page app with no server
component. Settlement data ships as JSON bundled at build time. The
eligibility questionnaire, field mapping, and filled-claim preview all run
in the browser. This is not a shortcut — it's the strongest way to satisfy
the PRD's PII constraints: data that never leaves the browser can't be
logged, breached from a server, or persisted anywhere by the app.

**Tradeoff accepted:** no cross-device continuity, no email notification of
matches (both already out of MVP scope per the PRD), and adding a backend
later (e.g. for scraping-based discovery or saved profiles) is a deliberate
post-MVP migration, not a toggle.

## Stack
- **Frontend:** React + TypeScript, built with Vite. Single-page app, client
  routing only for `/`, `/settlements/:id`, `/settlements/:id/claim`.
- **Backend:** none. No server, no API routes.
- **Database:** none. Settlement records live as JSON files in
  `src/data/settlements/*.json`, imported at build time. Updating the
  curated list means editing/adding a JSON file and redeploying — matches
  the "manually curated" decision directly.
- **Auth:** none.
- **Styling:** Tailwind CSS (fast to build a clean, disclaimer-forward UI in
  a days-scale MVP; no design system dependency).
- **Deployment:** static hosting (e.g. Vercel/Netlify static build, or any
  static file host) serving the Vite build output over HTTPS. Any of these
  hosts provides HTTPS by default, which satisfies the PRD's HTTPS
  requirement with zero extra infra.

## Data model
Each settlement is one JSON file, shape:
```json
{
  "id": "example-settlement-2026",
  "name": "Example Co. Data Breach Settlement",
  "administratorUrl": "https://official-settlement-site.example.com",
  "deadline": "2026-12-31",
  "summary": "One or two sentence plain-language description.",
  "eligibilityQuestions": [
    { "id": "purchased", "text": "Did you purchase Product X between Jan 2023 and Jun 2024?", "required": true }
  ],
  "claimFields": [
    { "id": "fullName", "label": "Full legal name", "type": "text" },
    { "id": "address", "label": "Mailing address", "type": "text" },
    { "id": "orderNumber", "label": "Order number (if known)", "type": "text", "optional": true }
  ]
}
```
A settlement is filtered out of the active list at render time when
`deadline < today` (client clock) — satisfies the "closed settlements don't
appear" acceptance criterion without any server-side job.

## Core flow (component boundaries)
1. `SettlementList` — reads bundled JSON, filters out past-deadline entries,
   renders name/deadline/summary. No network calls.
2. `EligibilityQuestionnaire` — renders `eligibilityQuestions` for the
   selected settlement; local component state only. If any `required`
   question is answered "no," the flow stops in-place with a plain message
   and no route to the claim form (enforces the PRD's ineligibility gate).
3. `ClaimForm` — renders `claimFields` as inputs; values held in local
   component state (React state), never sent anywhere and never written to
   `localStorage`/cookies, so nothing persists past the page session.
4. `ClaimPreview` — pure function mapping `{claimFields, values}` to a
   read-only preview list mirroring the official form's fields, plus the
   disclaimer text and a link to `administratorUrl` for the user to submit
   there themselves. No submit action exists in this app.
5. `Disclaimer` — shared component rendered on `SettlementList`,
   `EligibilityQuestionnaire`, and `ClaimPreview` (matches the PRD's
   "visible on all three" acceptance criterion).

## PII / logging stance
Because there is no backend, there is no server access log or database to
leak claim data from. The only residual surface is the static host's own
HTTP access logs (URLs/status codes, standard for any static host) — these
never contain form field values, since form data is never sent in a URL or
request body. No analytics or error-reporting SDK is added in MVP to avoid
accidentally capturing form field values in breadcrumbs; if one is added
post-MVP, it must be configured to scrub `ClaimForm`/`ClaimPreview` input
values first.

## Failure behavior
- Malformed/missing field in a settlement JSON file → build-time TypeScript
  type check on the settlement schema catches it before deploy, not a
  runtime error for users.
- User's browser JS disabled → out of scope for MVP (static React SPA
  assumes JS; acceptable given days-scale timeline).
- Settlement's official site is down when the user clicks through from
  `ClaimPreview` → outside this app's control; the preview screen still
  displays correctly since it never depended on that site being reachable.

## Commands / verification
- `npm install` — setup
- `npm run dev` — local dev server (Vite)
- `npm run build` — production static build
- `npm run typecheck` — `tsc --noEmit`, catches malformed settlement JSON via
  typed import
- `npm run lint` — ESLint
- `npm test` — component tests (Vitest + React Testing Library) covering the
  ineligibility gate, deadline filtering, and preview field mapping — the
  three behaviors the PRD's acceptance criteria depend on most
- No production writes, no external sends, no deployment performed as part
  of this design or its verification; `npm run build` output is local only
  until a deploy step is explicitly run.

## Handoff Context
- **App:** ClaimFinder
- **User level:** individual consumers
- **Platform:** web (static SPA)
- **Budget:** unspecified
- **Timeline:** quick MVP (days)
- **Mode:** Quick
- **Constraints:** no accounts; no backend/database; settlement data is
  hand-curated JSON in-repo; no data persisted beyond the browser session;
  no auto-submission; disclaimer required on list/questionnaire/preview;
  HTTPS via static host default; no PII in logs (structurally guaranteed by
  having no backend)
- **Decisions:** React + Vite + TypeScript + Tailwind, static hosting, no
  backend/database for MVP; settlement schema as typed JSON files
- **Source files:** `app/docs/research-ClaimFinder.md`,
  `app/docs/PRD-ClaimFinder-MVP.md`, `app/docs/TechDesign-ClaimFinder-MVP.md`
- **Open questions:** which static host to actually deploy to; how many
  settlements to seed at launch and their real field/eligibility data;
  whether a future backend is ever justified (e.g. if scraping-based
  discovery is added)

---

```json
{
  "schemaVersion": 1,
  "documentType": "techdesign",
  "appName": "ClaimFinder",
  "stack": {
    "frontend": "React + TypeScript (Vite)",
    "backend": "none (static SPA)",
    "database": "none (curated JSON files in-repo)",
    "auth": "none",
    "styling": "Tailwind CSS",
    "deployment": "static host (Vercel/Netlify-style static build)"
  },
  "commands": {
    "setup": "npm install",
    "dev": "npm run dev",
    "test": "npm test",
    "typecheck": "npm run typecheck",
    "lint": "npm run lint",
    "build": "npm run build"
  },
  "aiScope": "none"
}
```
