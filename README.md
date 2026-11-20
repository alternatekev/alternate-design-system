# alternate-design-system

The design system behind [alternate.org](https://alternate.org), taken out of the site's repository so that other things can be built in it: applications first, then other platforms.

It is one system in two registers.

- **Presentational** is the site: small type you dive into, the shattered field filling the view, one transition, sound. It is here exactly as the site has it, and tests hold it to the site's own files.
- **Application** is the same system set for working in: read at one size, all at once, all day. Panels, labels, numerals and states, over a field turned down and moved by the app's data instead of by a reader.

There is one field and one set of tokens. The application register is the site's own values named for the jobs they do in an application, and its field is the site's field with dials turned down, never a second design.

## What's here

| Path | What it is |
| --- | --- |
| `tokens/` | The source of truth. `color`, `motion`, `shatter`, `dock`, `sound`, `chart` and their `schema` are the site's files, moved, not rewritten. `type`, `app` and `profiles` are new here. |
| `src/color.ts` | OKLCH and the conversions out of it. The site's `lib/color.ts`. |
| `src/field/` | The ambient field. `engine.ts` is the site's `lib/air/field.ts` with what it read for itself handed to it instead: a source (what moves it) and tokens (how far). `reader.ts` is the site's source, `data.ts` an application's. |
| `src/css.ts`, `css/app.css` | The application register's custom properties and components. |
| `scripts/` | `build.ts` writes everything below; `validate-tokens.ts` is the site's validator plus the checks the new families need. |
| `dist/` | Built and committed: `css/tokens.css` (the site's custom properties), `css/app.css` (the application register), `tokens.json` (every token, in the Design Tokens format), `field.js` (the field for a page with no build step). |
| `platforms/swift/`, `Package.swift` | Built and committed: a Swift package, `AlternateTokens`, for iOS, tvOS and macOS. |
| `reference/site-e2fe890/` | The site's own files at that commit, frozen. Only the tests read them. |
| `tests/` | Parity with the site (tokens, CSS, and the field call for call), and the application register's own rules. |
| `docs/` | `plan.md` is where this is going and in what order. `field.md`, `platforms.md`, `migration.md`. |

## Using it

```sh
npm install        # Node 22
npm run check      # typecheck, validate the tokens, run the tests, confirm dist/ is current
npm run build      # rewrite dist/ and platforms/ from tokens/
swift test         # the Swift package, held to the same numbers
```

**A web app with a build step** imports the source: `alternate-design-system/tokens`, `alternate-design-system/field/app`.

**A page with no build step** takes two files from `dist/`:

```html
<link rel="stylesheet" href="app.css">
<script type="module">
  import { mountField } from "./field.js";
  const air = mountField();                      // the field, behind the page
  air.source.set({ arousal: 0.4, valence: 0.6 }); // where things stand
  air.source.pulse();                             // something just changed
</script>
```

**A Swift app** adds this repository as a package and reads `Tokens`:

```swift
import AlternateTokens
Text("Needs you").foregroundStyle(Tokens.App.Tone.needs.color)
let ground = FieldPalette.palette(hour: 17.5, valence: 0.6, arousal: 0.3).bg.color
```

**Anything else** reads `dist/tokens.json`.

## The rules

They are the site's, and `CLAUDE.md` has them in full. The short of it: Kevin art-directs. Tuning lives in tokens, never in code or a stylesheet. Nothing jumps. The field is atmosphere, not interface, and nothing in it is clickable. And nothing that the site shows may change because it moved here: the parity tests are the proof, and they run on every change.
