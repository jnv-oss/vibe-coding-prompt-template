# Product Requirements

Use this as the short build-facing version of the PRD. Do not paste the entire PRD unless the project is complex.

## Users

- Primary user: Individual consumers checking eligibility for class action settlement payouts. No legal or technical background assumed.
- Main problem: Consumers don't know a settlement exists, don't know if they qualify, and find official claim forms tedious to fill out.

## Must-Have Features

- Curated list of open settlements (name, deadline, eligibility summary) - visible with no login; expired settlements never appear.
- Per-settlement eligibility questionnaire - a "no" on any required question stops the flow before the claim form, with a clear message.
- Auto-fill claim preview - maps questionnaire + form answers to the settlement's official field layout; read-only, links to the official site; never submits.
- Non-legal-advice disclaimer - visible on the settlement list, questionnaire, and preview screens.
- Session-based, no accounts - nothing persisted server-side beyond the current page; no raw PII in logs (there is no backend to log to).
- Closing-soon deadline reminder - a badge on the list/detail pages when a settlement's deadline is within 14 days; fully client-side (`src/lib/deadline.ts`), no accounts/email/backend.
- Saved profile (opt-in, local only) - a "remember my info" checkbox saves fullName/email/mailingAddress to the browser's `localStorage` (`src/lib/savedProfile.ts`), off by default, clearable anytime; never saves settlement-specific fields (VINs, notice IDs, etc.).
- Category filter and search - each settlement is tagged with a category (data breach, antitrust, healthcare privacy, product liability); filter pills plus a text search over name/summary (`src/lib/filterSettlements.ts`), fully client-side.

## Nice-To-Have Features

- Email notification for newly matching settlements (distinct from the closing-soon badge above - needs a backend/database/email service, not yet built).
- Full accounts with login and server-side, cross-device profile storage (distinct from the local-only saved profile above - needs a backend, not yet built).
- Automated settlement discovery (scraping) to replace the curated list.

## Out Of Scope

- Auto-submission or acting as the user's legal agent (unauthorized-practice-of-law boundary — see `docs/research-ClaimFinder.md`).
- Legal advice, eligibility guarantees, or payout estimates presented as fact.
- Payments, subscriptions, or take-a-cut-of-payout monetization.
- Notarized or e-signature flows.

## Success Signals

- A visitor can complete discovery -> eligibility -> filled preview for a seeded settlement without errors.
- Ineligible users are correctly blocked before reaching auto-fill.
- No raw PII ever appears in a log (structural, not just observed).
