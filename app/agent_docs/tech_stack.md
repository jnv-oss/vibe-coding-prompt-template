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
| Deployment | GitHub Pages, via `.github/workflows/deploy-claimfinder.yml` | Free, HTTPS by default, no new third-party account. Requires a one-time manual step: repo Settings > Pages > Source: "GitHub Actions". Served at `/vibe-coding-prompt-template/` (GitHub Pages project-site path), so `vite.config.ts` sets `base` and `App.tsx` sets the router `basename` from `import.meta.env.BASE_URL` only when `GITHUB_PAGES=true` is set (the CI build sets it; local dev/build don't). |

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
- State management: local React component state only (`useState`); the one exception is `src/lib/savedProfile.ts`, which persists only `fullName`/`email`/`mailingAddress` to `localStorage`, and only when the user opts in via the "remember my info" checkbox in `ClaimForm` (see `AGENTS.md` Gotchas). Nothing else uses `localStorage`, cookies, or global stores.
- Forms/validation: controlled inputs bound to component state; required eligibility questions block progression before any submit-shaped action.
- Error handling: malformed settlement JSON is caught by the TypeScript typecheck at build time, plus a runtime check in `src/data/settlements/index.ts` for `claimFields[].type` and `category` (JSON imports widen literal unions to `string`, so the typecheck alone can't catch a typo'd enum value — that check throws at import time instead).
- Logging/monitoring: none in MVP — no analytics/error-reporting SDK, specifically to avoid capturing form field values in breadcrumbs.
