# Working in this repository

This repository is public. It holds the design system and the plan for it, and nothing else.

## What never goes in

- Credentials of any kind: tokens, secrets, keys, `.env` values. Not in code, docs, commit messages or history.
- Anything private. No home-network names, addresses, machine names or paths. No employer internals. Applications that use this system are described by what they are ("a dashboard app"), not by what they hold. Screenshots of a private app do not go in.
- Fonts. The faces are named in `tokens/type.ts`; their files are licensed to Kevin and stay with his kit.

If you are unsure whether something is public, it is not. Leave it out and say so.

## Who decides what

Kevin art-directs every step. Propose and sketch; do not add what he did not ask for. A color, a size, a face, a timing, a dial: each is his call. When this repository needs a value he has not set, take one the site already has and say so in a comment beside it, with "first sketch" or "proposal". Never invent one. When a request is ambiguous, ask one question instead of guessing in code.

## The rules that hold the system together

- **Tokens are the system.** Tuning lives in `tokens/`: every color, size, face, duration and coefficient. Code holds mechanism (geometry, math, plumbing). A stylesheet holds no color, face or size of its own; `tests/app.test.ts` checks.
- **Colors are OKLCH**, authored as `[l, c, h]`, so a blend halfway looks halfway. Each platform converts at the edge.
- **One field.** A profile other than the site's is dials on the site's numbers (`tokens/profiles.ts`), never numbers of its own. A profile only ever turns the field down.
- **A source changes targets and rates, never positions.** Whatever moves the field (a reader, an app's data) reports where things stand and what just changed; the field takes seconds to get there. Nothing jumps. `.claude/skills/ambient-field-motion` in the site's repository is the full direction: atmosphere, not interface; slow, deliberate, data-informed; nothing in the field is clickable; `prefers-reduced-motion` keeps mood changes and drops drift.
- **Words sit on a panel**, never straight on the field, and hold 4.5:1 there. The validator checks every tone.
- **Leave it alone by default.** Nothing animates on hover, focus or press. The one transition is type in, type out; do not invent a second.
- **Reuse before adding.** Two things that share a look or a behavior share the code.

## The site must not change

`tokens/` (but for `type`, `app`, `profiles` and `schema.app`), `src/color.ts` and `src/field/` came from alternate.org's repository and will be what the site runs. Until then they must stay what the site has.

- `reference/site-e2fe890/` is the site's own files, frozen. Never edit it. `tests/tokens.parity.test.ts` and `tests/field.parity.test.ts` hold this repository to it: same tokens, the same CSS string, and for the field the same WebGL calls with the same numbers, frame for frame.
- A change that makes a parity test fail is a change to the site. Do not make it here. If the site should change, it changes in the site first, and the reference is taken again (`docs/migration.md`).
- Keep the moved files close to the originals. A refactor that does not serve a second consumer is a diff the migration will have to explain.
- To add something for applications, add beside, not into: a new token family, a new source, a new profile.

## Generated files

`dist/` and `platforms/swift/**/*.generated.swift` are written by `npm run build` and committed, because some consumers have no build step. Never edit them by hand. Change the tokens or the generator, build, and commit both. `npm run fresh` fails a change that forgot.

## Before calling a change done

`npm run check`, and `swift test` if anything under `tokens/`, `scripts/gen/` or `platforms/` changed. Say plainly what ran and what did not.

## Commits

Small, in plain language, saying what changed and why. Agents add `Co-Authored-By` for themselves. Never rewrite published history.
