# Tech Stack

Last verified: 2026-09

## Stack

| Area | Choice | Notes |
|------|--------|-------|
| Frontend | React + TypeScript (Vite) | Fast to build a days-scale MVP; no SSR needed since there's no backend. |
| Backend | none (static SPA) | All matching/auto-fill logic runs client-side so PII never reaches a server to log or breach. |
| Database | none (curated JSON files in-repo) | `src/data/settlements/*.json`, hand-maintained; update = edit/add a file and redeploy. |
| Auth | none | No accounts in MVP; nothing to authenticate. |
| Styling | Tailwind CSS | Fast to build a clean, disclaimer-forward UI without a design-system dependency. |
| Deployment | static host (Vercel/Netlify-style static build) | Any static host gives HTTPS by default with zero extra infra. |

## Commands

- Setup: `npm install`
- Dev: `npm run dev`
- Test: `npm test`
- Typecheck: `npm run typecheck`
- Lint/format: `npm run lint`
- Build: `npm run build`
- Browser/device check: manual — run `npm run dev` and walk the settlement list -> questionnaire -> preview flow in a browser.

## AI Runtime

Not applicable — `aiScope: none`. This product has no AI features.

## Important Patterns

- Data fetching: none — settlement data is statically imported from `src/data/settlements/*.json` at build time, no runtime fetch.
- State management: local React component state only (`useState`); nothing in `localStorage`, cookies, or global stores.
- Forms/validation: controlled inputs bound to component state; required eligibility questions block progression before any submit-shaped action.
- Error handling: malformed settlement JSON is caught by the TypeScript typecheck at build time, not at runtime.
- Logging/monitoring: none in MVP — no analytics/error-reporting SDK, specifically to avoid capturing form field values in breadcrumbs.
