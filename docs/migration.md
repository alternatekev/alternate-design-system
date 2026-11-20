# Moving the site onto this

The site moves last (the plan, stage 4), and nothing it shows may change. This page is what that move consists of, how it is proven, and what was found in the site's code on the way here.

## What moved, and what it replaces

| Here | Replaces, in the site | Changed in the move |
| --- | --- | --- |
| `tokens/{schema,color,motion,shatter,dock,sound,chart,index}.ts` | `tokens/` | one import path |
| `src/color.ts` | `lib/color.ts` | nothing |
| `src/field/engine.ts` | `lib/air/field.ts` | what it read from the page is handed to it (`docs/field.md`) |
| `src/field/reader.ts` | the same file's reader signals, and its four other reads of the page | moved, not rewritten |
| `src/field/site.ts` | the `createField` the site imports | same signature |
| `src/field/flight.ts`, `time.ts`, `column.ts` | `lib/flight.ts`, `lib/time.ts`, `lib/column.ts` | import paths |
| `scripts/validate-tokens.ts` | `scripts/validate-tokens.ts` | the site's checks, then the new families' |

Still only in the site: the docks, the type transition, the charts' components, the surface, the instrument, the content model.

## The swap, when it comes

1. The site adds this package and changes its imports: `@/tokens` to `alternate-design-system/tokens`, `@/lib/color` to `alternate-design-system/color`, `@/lib/air/field` to `alternate-design-system/field/site`, and the three small modules likewise. `lib/time.ts` and `lib/flight.ts` hold state, so every importer in the site must take them from here, or there would be two copies of where in time the page is.
2. It deletes its own copies.
3. Nothing else changes in that commit.

## The proof

- Here: the parity tests, run against the site's tree as it is that day.
- There: `npm run check`, the whole end-to-end suite untouched, and the budgets. The field arrives as its own chunk after idle today and must still.
- Pixels: every route at every size in the site's test matrix, before and after, with the field held still on a fixed seed and hour (`createField(canvas, { seed, paused: true })`, `setTimeOfDay`). No difference is accepted.

## Keeping the reference current

Until the swap, the site is the original and this is the copy. When the site's tokens or field change:

```sh
scripts/take-reference.sh /path/to/alternate-viewsource
npm test
```

That copies the site's files over `reference/` and records the commit. Whatever then fails is the change to make here, in the same commit, by the same edit the site made.

## Found on the way

Left as they are, since fixing them here would change the site. Each is Kevin's call.

1. **The linger signal is never written.** `lib/air/field.ts` measures how long the reader has dwelt on each beat and blends it in `readerMood()` as `lin`, but nothing copies it to `sig.linger`, which stays 0. So the four dynamics with a linger coefficient (`dolly`, `focusOffset`, `depthOfField`, `vignette`) and the `stillness.linger` term never act. The field as shipped does not push in or pull focus when you dwell. Wiring it would be one line; it would also change how the site looks, so it wants looking at, not a quiet fix.
2. **The contrast check for glass assumes the blur.** Words on the docks are checked against the field's brightest background, on the reasoning that the frost spreads a highlight out. That holds at the docks' 20px. The application register inherits both the glass and the assumption; if the glass is thinned for dense pages, the check has to change with it.
3. **Type has no tokens** (the site's own audit, Oct 16). `tokens/type.ts` here starts with the four faces, and a test holds them to the stylesheet's `--face-*` values. The site's sizes are still in its stylesheet.
