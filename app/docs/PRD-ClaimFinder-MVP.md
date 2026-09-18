# PRD: ClaimFinder MVP

## Problem
Consumers are frequently eligible for money from class action settlements
(data breaches, defective products, price-fixing, etc.) but don't know a
settlement exists, don't know if they qualify, and find official claim forms
tedious to fill out. Existing directories (ClassAction.org, TopClassActions)
list settlements but leave matching and form-filling entirely to the user.

## Target user
Individual consumers checking whether they're owed money from any currently
open class action settlement. No legal or technical background assumed. No
account required to use the MVP.

## Core journey
1. User lands on the site and sees a list of currently open settlements
   (name, short description, deadline, rough eligibility criteria).
2. User picks a settlement and answers a short set of eligibility questions
   for it (e.g. "did you purchase X between date A and date B?").
3. If eligible, the user fills in the info the official claim form needs
   (name, address, email, any claim-specific fields like order number).
4. ClaimFinder pre-fills the settlement's official claim form (or generates a
   filled PDF/summary matching that form) from the info entered.
5. User reviews the pre-filled result and **submits it themselves** on the
   settlement administrator's official site (or downloads/prints it) —
   ClaimFinder never submits on the user's behalf.

## MVP scope (must-have)
- Curated list of open settlements, manually maintained (name, administrator
  URL, deadline, eligibility criteria, required claim-form fields). No live
  scraping in MVP.
- Per-settlement eligibility questionnaire (simple yes/no + basic fields).
- Auto-fill: map questionnaire answers into the settlement's claim-form
  field layout and present a filled preview for the user to review.
- Visible, persistent disclaimer on every page showing settlement info or a
  filled claim: "ClaimFinder is not a law firm and does not provide legal
  advice. We do not guarantee eligibility or payout. You are responsible for
  submitting your own claim."
- Session-based flow: no accounts, no login. Entered data lives only for the
  active session (not persisted server-side beyond what's needed to render
  the current session), consistent with the "no accounts" decision.
- HTTPS everywhere; if any data is persisted (e.g. temporary session store),
  it's encrypted at rest; no logging of raw form field values (name,
  address, order numbers, etc.).
- Closing-soon deadline reminder: settlements within 14 days of their claim
  deadline are visibly flagged on the list and detail pages. Fully
  client-side (computed from today's date vs. the settlement's deadline) —
  no accounts, no email, no backend, consistent with the "no backend"
  constraint below. Added post-launch (2026-09-18) as the first bounded
  post-MVP feature; the original "email notification for matching
  settlements" nice-to-have is a distinct, larger feature (needs a way to
  store an email address and something to send from) and remains
  unimplemented.
- Saved profile (opt-in, local only): a "remember my info" checkbox in
  the claim form saves `fullName`/`email`/`mailingAddress` to the user's
  own browser (`localStorage`), pre-filling those fields on any future
  settlement's claim form on that same device. Off by default, explained
  in-line ("don't check this on a public or shared computer"), and
  clearable at any time. Deliberately narrower than the "saved profiles /
  accounts" nice-to-have below: no login, no server, no cross-device
  sync, and never includes settlement-specific identifiers (notice IDs,
  VINs, etc.) — those still require a fresh entry per settlement. Added
  post-launch (2026-09-18) as the second bounded post-MVP feature.
- Category filter and search: each settlement is tagged with a category
  (data breach, antitrust, healthcare privacy, product liability); the
  settlement list has category filter pills plus a text search over
  name/summary. Fully client-side (`src/lib/filterSettlements.ts`).
  Added post-launch (2026-09-18) as the third bounded post-MVP feature,
  ahead of "automated settlement discovery" below — filtering matters
  more once there's more than a handful of curated settlements to
  scroll through.
- Downloadable claim summary: a "Download claim summary" button on the
  claim preview screen saves a plain-text (`.txt`) copy of the filled
  summary — same fields, same never-submitted disclaimer, plus the
  official site link — via a native `Blob` + `<a download>`, no PDF
  library added just for this. Added post-launch (2026-09-18) as the
  fourth bounded post-MVP feature.

## Nice-to-have (not blocking MVP)
- Email/notification when a new settlement matching a user's past answers
  appears.
- Direct submission integration with a settlement administrator's API
  (none currently offer this publicly — deferred indefinitely, not just
  post-MVP).
- Automated settlement discovery (scraping court records / administrator
  sites) to replace the manually curated list.
- Full accounts with login and server-side profile storage, so profile
  data follows a user across devices (the local-only, opt-in version is
  now implemented — see MVP scope above; this entry is only the
  cross-device/account version, which needs a backend).

## Explicitly out of scope
- Acting as the user's legal agent: ClaimFinder never submits a claim,
  signs anything, or represents the user in any capacity. This boundary is
  load-bearing for the product, not a phase-2 relaxation — see research
  (DoNotPay precedent).
- Legal advice of any kind, including eligibility guarantees or payout
  estimates presented as fact.
- Payments, subscriptions, or take-a-cut-of-payout monetization models.
- Notarized or e-signature flows for settlements that require them (user is
  told the settlement requires this and directed to the official form).

## Failure states to handle
- Settlement's official claim deadline has passed → show "closed," remove
  from active matching, don't let a user fill a dead claim.
- User's answers indicate they're not eligible → say so plainly, don't let
  them proceed to auto-fill (guards against the "no-proof claim = possible
  perjury" risk raised in research).
- Curated data is stale/wrong (deadline or field changed on the
  administrator's site) → each settlement entry links directly to the
  official source so the user can verify before submitting.
- Auto-fill can't map an answer to a required field → show the field as
  blank/flagged in the preview rather than guessing or submitting incomplete
  data.

## Constraints
- Web app (browser-based), no native mobile app in MVP.
- No user accounts; session-based only.
- Settlement data is manually curated, not scraped, in MVP.
- Timeline: quick MVP, days-scale build — a handful of seeded settlements is
  sufficient, not a comprehensive database.
- User must always be the one who submits the final claim.

## Acceptance criteria (observable)
- [ ] A visitor can view a list of at least 3 seeded open settlements with
      name, deadline, and short eligibility summary, with no login required.
- [ ] Selecting a settlement shows its eligibility questionnaire; answering
      "not eligible" for any gating question stops the flow with a clear
      message and does not offer auto-fill.
- [ ] Answering eligible on all gating questions leads to a form that
      collects exactly the fields that settlement's official claim form
      requires.
- [ ] Submitting the ClaimFinder form produces a filled preview (matching
      the official form's fields) that the user can review; no network call
      submits anything to the settlement administrator on the user's behalf.
- [ ] The non-legal-advice disclaimer is visible on the settlement list,
      the questionnaire, and the filled-preview screen.
- [ ] A settlement past its deadline does not appear in the active list and
      cannot be reached to start a new claim.
- [ ] The app is served over HTTPS in any deployed environment; no raw form
      field values (name, address, order number, etc.) appear in server
      logs.

## Handoff Context
- **App:** ClaimFinder
- **User level:** individual consumers, no technical/legal background
- **Platform:** web app
- **Budget:** unspecified
- **Timeline:** quick MVP (days)
- **Mode:** Quick
- **Constraints:** no accounts (session-based); manually curated settlement
  data (no scraping); user always submits their own claim (no auto-submit,
  no legal representation); visible non-legal-advice disclaimer required;
  HTTPS + encryption at rest for any persisted data + no logging of raw PII
- **Decisions:** discovery + auto-fill scope (not full end-to-end filing);
  web over mobile for MVP speed; session-based over accounts for MVP speed
  and lower PII-storage risk
- **Source files:** `app/docs/research-ClaimFinder.md`,
  `app/docs/PRD-ClaimFinder-MVP.md`
- **Open questions:** which specific settlements to seed the curated list
  with at launch; exact tech stack (deferred to Technical Design); whether
  any seeded settlement requires a field type not yet designed for (e.g.
  file upload for proof of purchase)

---

```json
{
  "schemaVersion": 1,
  "documentType": "prd",
  "appName": "ClaimFinder",
  "oneLiner": "A web app that helps consumers discover open class action settlements they qualify for and pre-fills the official claim form for them to review and submit themselves.",
  "targetUsers": "Individual consumers checking eligibility for class action settlement payouts",
  "phase": "Foundation",
  "mustHave": ["curated settlement list", "eligibility questionnaire", "auto-fill claim preview", "non-legal-advice disclaimer", "session-based no-account flow", "HTTPS + encrypted-at-rest + no raw-PII logging", "closing-soon deadline reminder", "opt-in local saved profile", "category filter and search", "downloadable claim summary"],
  "niceToHave": ["email notifications for matching settlements", "full accounts with cross-device profile sync", "automated settlement discovery"],
  "notInMvp": ["auto-submission on user's behalf", "legal representation or advice", "payments/monetization", "notarized/e-signature flows"],
  "successMetrics": ["visitor can complete discovery-to-filled-preview flow for a seeded settlement without errors", "ineligible users are correctly blocked before auto-fill", "no raw PII appears in logs"]
}
```
