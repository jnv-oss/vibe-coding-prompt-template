# Memory

Update this after major decisions, completed phases, or bugs that future agents need to know about. Keep it short.

## Current State

- Current task: ClaimFinder MVP is built, seeded with real settlement data, and live on GitHub Pages.
- Current phase: Deployed. PR #1 merged to `main`; a human enabled Settings > Pages > Source: "GitHub Actions"; the deploy workflow ran automatically on merge (build + deploy jobs both succeeded) and the human confirmed the live site at https://jnv-oss.github.io/vibe-coding-prompt-template/ loads and renders correctly. Remaining: a human should still spot-check each seeded settlement's official site against this app's data (see `src/data/settlements/README.md`) before treating it as production-accurate.
- Next step: any further `app/**` push to `main` redeploys automatically; no other deploy action needed.
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

- Settlement data is real (7 currently-tracked settlements, sourced 2026-09-18 — see `src/data/settlements/README.md`), but `claimFields` wording was inferred from secondary sources (news/aggregator coverage), not read verbatim from each administrator's live claim form, because this environment's network egress is allowlisted and blocks fetching arbitrary settlement-administrator sites directly (confirmed repeatedly — this is an organization policy decision per `/root/.ccr/README.md`, not a transient failure, so don't keep retrying it). Deadlines, administrator URLs, and eligibility substance are corroborated across multiple independent secondary sources with no discrepancies found on a fresh re-check; the product owner reviewed this limitation and explicitly accepted secondary-source verification as sufficient to proceed. Primary-source confirmation is still the better bar if this environment's egress policy ever changes.
- 7 settlements are seeded (1 deliberately expired, to test filtering with real rather than fabricated data) — this is not a comprehensive database, matching the PRD's "days-scale MVP" scope. Categories now span data breach (Lands' End, SitusAMC, Comcast), antitrust (Deere repair monopoly, Visa/Mastercard ATM surcharge), and healthcare/privacy + auto defect (Fairchild pixel tracking, Hyundai/Kia airbag) for variety.
- `npm audit` still reports moderate advisories in `vite`/`vitest`/`esbuild` (dev-server only, not in the shipped build) — see AI/Tooling Decisions above.
- The claim-page eligibility guard uses React Router navigation `state`, which (correctly) persists across a same-tab refresh once a user has legitimately passed eligibility, but (also correctly) redirects a genuinely fresh visit (new tab, pasted link) back to the questionnaire. Verified both cases manually; this is intended behavior, not a bug, since there's no backend to enforce anything more strictly.

## Completed

- [x] Initial scaffold (AGENTS.md, agent_docs/, vibe.project.json via `npx vibeworkflow`)
- [x] Core data model (settlement JSON schema + 7 real seed settlements, typed + runtime-validated in `src/data/settlements/index.ts`)
- [x] Auth — not applicable (no accounts in MVP)
- [x] Core MVP flow (list -> questionnaire -> claim form -> preview), verified with typecheck, unit/component tests, lint, build, and a Playwright walkthrough of the golden path, the ineligibility gate, expired-settlement filtering, and the fresh-visit eligibility guard
- [x] Deployment: `.github/workflows/deploy-claimfinder.yml` builds and deploys to GitHub Pages; base path (`/vibe-coding-prompt-template/`) and router `basename` verified locally via `vite preview` and confirmed live in production by a human at https://jnv-oss.github.io/vibe-coding-prompt-template/
- [x] Settlement data verification — primary-source access is blocked by this environment's network policy; secondary-source cross-verification done and accepted by the product owner as sufficient for now (see Known Issues)
