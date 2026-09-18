# AGENTS.md — ClaimFinder

> **How to fill this in:** write only what an agent could NOT work out by
> reading the repo. Skip the directory tree (`ls` shows it), the dependency list
> (the manifest shows it), and generic advice like "write clean code" or "handle
> errors" — a capable model already does those, and every line here is loaded
> into context on every single session. If you find yourself describing the
> code, delete it. If you find yourself describing something that once cost
> someone an afternoon, keep it.

## Project

- **What this is:** A web app that helps consumers discover open class action settlements they qualify for and pre-fills the official claim form for them to review and submit themselves.
- **Who it is for:** Individual consumers checking eligibility for class action settlement payouts

## Read first — when relevant

- Product scope or acceptance criteria: `docs/PRD-*.md`.
- Architecture or integration choices: `docs/TechDesign-*.md`.
- Non-obvious product constraints: `agent_docs/project_brief.md`.
- Stack-specific setup: `agent_docs/tech_stack.md`.
- Choosing or troubleshooting checks: `agent_docs/testing.md`.

Read only the documents needed for the task. During initial setup, fill relevant
placeholders from agreed decisions; do not invent missing facts or block an
unrelated small fix on completing every document. Current progress belongs in
`MEMORY.md`.

## Gotchas

**The highest-value section in this file.** Things that look safe and aren't;
conventions that differ from the framework default, so the surrounding code
would teach the wrong pattern; failures that took real time to diagnose.

- There is **no backend and no database by design**, not as a temporary gap.
  Settlement matching, form field mapping, and the claim preview all run in
  the browser. Do not add an API route or a server-side store to "fix" this —
  it's the mechanism that keeps PII off any server, per the PRD's constraints.
- The app **never submits a claim**. `ClaimPreview` only renders a read-only
  summary and links out to the settlement's official `administratorUrl`.
  Adding a submit action would cross the unauthorized-practice-of-law
  boundary called out in `docs/research-ClaimFinder.md` — treat that as a
  hard constraint, not a missing feature.
- Settlement data is hand-curated JSON under `src/data/settlements/*.json`,
  not scraped or fetched. Adding a new settlement means adding a JSON file
  that matches the typed schema in `agent_docs/tech_stack.md`, not writing a
  scraper.
- If a required eligibility question is answered "no," the flow must stop
  there with a plain message — never let the user reach the claim form or
  preview after a disqualifying answer (a no-proof false claim is a real
  perjury risk for the user, not just a UX nicety).
- Form values live only in React component state, with **one narrow,
  deliberate exception**: `src/lib/savedProfile.ts` may persist exactly
  `fullName`, `email`, and `mailingAddress` to `localStorage`, and only when
  the user explicitly checks "remember my info" in `ClaimForm` — never
  silently, never any other field. Settlement-specific identifiers (notice
  IDs, VINs, class member IDs, PINs, etc.) must never be added to
  `SAVED_PROFILE_FIELDS`; they belong to one settlement's notice, not to a
  reusable profile. Do not widen this list. The checkbox starts unchecked
  the first time (no saved profile yet) and reflects whether a profile is
  currently saved on return visits — this app is used on shared/public
  computers by people claiming money after a data breach, which is
  exactly why opting in is explicit rather than assumed. Everything else
  (settlement-specific fields, analytics, error-reporting SDKs) still
  follows the original rule: never
  written anywhere but component state.

## Protected areas

Keep secrets, credentials, private logs, and production data out of commits and
unapproved transmissions. Preserve unrelated working-tree changes.

Within the requested scope, continue through local implementation, affected
checks, and fixes without repeated approval. Changing auth, billing,
infrastructure, or migration source is distinct from applying it to a live
system. Before an external send, deployment, charge, production migration,
destructive data operation, or access change, confirm that the action and target
are covered by the user's authorization. Ask only for missing authorization or a
consequential decision; a multi-file edit alone is not an approval boundary.

There are no auth, billing, or migration systems in this project. The
settlement JSON fixtures under `src/data/settlements/` are disposable sample
data — safe to edit or replace freely. No command in this project reaches
production; `npm run build` only produces a local static bundle, and nothing
in the repo deploys it.

## Done means

Complete the requested behavior, run checks appropriate to the changed area,
and fix failures caused by the change. For runtime work, exercise the relevant
user journey when the environment permits it. Reuse still-valid results; repeat
checks when code changes or new evidence justifies it.

Report the outcome, actual checks and limitations, and rollback notes when
relevant. If completion is blocked, identify the concrete blocker and remaining
work rather than presenting an unchecked implementation as finished.

---

**When this file gets long, that is the signal to split it.** Move task-specific
procedures (deploy steps, release checklists, API references) into
`.claude/skills/<name>/SKILL.md`, where only the one-line description stays in
context and the body loads when it is actually needed. Move
directory-specific conventions into `<subdir>/AGENTS.md` (or the selected
client’s supported equivalent), scoped to work in that directory. Keep universal constraints and safety prohibitions
here — never move a "never do X" rule somewhere it might not be loaded.
