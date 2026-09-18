# Testing

## Required Before Completion

- [ ] Relevant tests pass.
- [ ] Typecheck/build passes.
- [ ] User-visible changes are checked in a browser or device when applicable.
- [ ] No tests were skipped or weakened without human approval.
- [ ] Evidence is reported in the final response.

## Commands

- All tests: `npm test`
- Single test: `npm test`
- Typecheck: `npm run typecheck`
- Lint/format: `npm run lint`
- Build: `npm run build`
- Browser/device check: manual — `npm run dev`, then walk the settlement list -> questionnaire -> preview flow, including an ineligible answer and a past-deadline settlement.

## What To Test

| Change type | Minimum check |
|-------------|---------------|
| Pure logic | Unit test |
| API/data flow | N/A — no backend or API in this project |
| UI behavior | Browser/device check |
| Auth, billing, migrations, deployment | N/A — no auth, billing, migrations, or deploy pipeline exist in this project |
| AI/tool behavior | N/A — no AI features (`aiScope: none`) |

Priority unit/component tests (per the Tech Design): the ineligibility gate
blocks progression to the claim form, past-deadline settlements are filtered
out of the active list, and the claim preview correctly maps form values to
the settlement's official field layout.

## AI Checks

Not applicable — this product has no AI features.
