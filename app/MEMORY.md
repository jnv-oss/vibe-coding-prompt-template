# Memory

Update this after major decisions, completed phases, or bugs that future agents need to know about. Keep it short.

## Current State

- Current task: ClaimFinder MVP core flow (settlement list -> eligibility questionnaire -> claim preview) is built and verified end-to-end.
- Current phase: Core MVP flow complete. Only 4 fictional example settlements are seeded — real curated data is still needed before any real deployment.
- Next step: Source and add real, verified settlement data (see `src/data/settlements/README.md`); decide on and wire up an actual static host for deployment.
- Blocked by: none.

## Decisions

- 2026-09-18 No backend/database for MVP — all matching and auto-fill logic runs client-side so PII never reaches a server (see `docs/TechDesign-ClaimFinder-MVP.md`).
- 2026-09-18 Discovery + auto-fill scope only, never auto-submit — user always submits the claim themselves on the official site (unauthorized-practice-of-law boundary, see `docs/research-ClaimFinder.md`).
- 2026-09-18 Session-based, no accounts — nothing persisted beyond the current page load; no `localStorage`/cookies used for form data.
- 2026-09-18 Bumped `react-router-dom` to ^7.18.4 (from the originally planned ^6.26) to pick up a fix for an open-redirect CVE in `Link`/`useNavigate` — the API used (`BrowserRouter`, `Routes`, `Route`, `Link`, `useNavigate`, `useLocation`, `useParams`, `Navigate`) is unchanged between v6 and v7 in this declarative-mode usage.
- 2026-09-18 Left `vite`/`vitest`/`esbuild` on their originally planned versions despite moderate dev-server-only advisories (arbitrary requests / path traversal against the local dev server) — not shipped in the production build; upgrading to the fixed majors (vite 8, vitest 5) is a larger jump than this pass justified. Revisit if this project graduates past MVP.

## AI / Tooling Decisions

- 2026-09-18 No AI features in this product (`aiScope: none`); no AI-related tooling decisions apply.

## Known Issues

- Only 4 seed settlements exist and 3 are explicitly fictional/placeholder (`src/data/settlements/example-*.json`) — do not present this data as real to any actual user.
- `npm audit` still reports moderate advisories in `vite`/`vitest`/`esbuild` (dev-server only, not in the shipped build) — see AI/Tooling Decisions above.
- The claim-page eligibility guard uses React Router navigation `state`, which (correctly) persists across a same-tab refresh once a user has legitimately passed eligibility, but (also correctly) redirects a genuinely fresh visit (new tab, pasted link) back to the questionnaire. Verified both cases manually; this is intended behavior, not a bug, since there's no backend to enforce anything more strictly.

## Completed

- [x] Initial scaffold (AGENTS.md, agent_docs/, vibe.project.json via `npx vibeworkflow`)
- [x] Core data model (settlement JSON schema + 4 seed settlements, typed + runtime-validated in `src/data/settlements/index.ts`)
- [x] Auth — not applicable (no accounts in MVP)
- [x] Core MVP flow (list -> questionnaire -> claim form -> preview), verified with typecheck, unit/component tests, lint, build, and a Playwright walkthrough of the golden path, the ineligibility gate, expired-settlement filtering, and the fresh-visit eligibility guard
- [ ] Launch checks — no real settlement data or deployment target yet
