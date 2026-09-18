# Code Patterns

Use this only for project-specific conventions. If a section is unknown, inspect the existing code before filling it in.

## Architecture

- Primary pattern: feature-based — `SettlementList`, `EligibilityQuestionnaire`, `ClaimForm`, `ClaimPreview`, `Disclaimer` are separate components per the Tech Design's core-flow boundaries.
- Keep domain logic separate from UI/transport code.
- Reuse existing modules before creating new abstractions.

## Data And State

- Data fetching: none — settlement JSON is statically imported, not fetched at runtime.
- Server state: none — there is no server.
- Client state: local component state (`useState`) only; nothing written to `localStorage`/cookies.
- Forms: controlled inputs; the eligibility gate must run before the claim form is reachable.

## Errors And Validation

- Validate external inputs at boundaries.
- Return user-safe errors to the UI.
- Log developer context server-side.
- Do not swallow errors silently.
- Settlement JSON shape is validated by the TypeScript type system at build time, not at runtime — a malformed file should fail `npm run typecheck`, not surface as a user-facing error.

## Naming

- Files: PascalCase for component files (`ClaimForm.tsx`), kebab-case for settlement data files matching their `id` (`example-settlement-2026.json`).
- Components/classes: PascalCase
- Functions/variables: camelCase
- Env vars/constants: UPPER_SNAKE_CASE

## AI Tool Patterns

Not applicable — this product has no AI tools or actions.
