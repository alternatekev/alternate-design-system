# Platforms

The tokens are data. Each platform gets them from a generator, and `npm run build` runs them all.

| Platform | What it gets | From |
| --- | --- | --- |
| The web, with a build | the TypeScript itself: `tokens/`, `src/color.ts`, `src/field/` | imports |
| The web, without one | `dist/css/tokens.css`, `dist/css/app.css`, `dist/field.js` | `src/css.ts`, `css/app.css`, esbuild |
| iOS, tvOS, macOS | the `AlternateTokens` Swift package | `scripts/gen/swift.ts` |
| Windows, Linux, anything else | `dist/tokens.json` | `scripts/gen/dtcg.ts` |

## How a generator works

`scripts/gen/tree.ts` turns every family into one tree of groups, lists and leaves. It walks each value beside its zod schema, because a schema knows what a value is: `dock.stops` is three numbers and so is a color, and only the schema can tell them apart. A generator is a function from that tree to text. To add a platform, add a file beside `swift.ts` and a line to `scripts/build.ts`.

## Swift

`Tokens` mirrors the token files: `Tokens.Color.Ui.paper`, `Tokens.Motion.Springs.tidal`, `Tokens.App.Tone.needs`. Groups are enums of static lets; a list of groups is an array of a struct made for it. Three hand-written files sit beside the generated one:

- `Oklch.swift`: the color math, a port of `src/color.ts`. Colors stay OKLCH until the edge, so a blend on a native platform is the blend the site makes. `.color` gives a SwiftUI `Color`.
- `FieldPalette.swift`: the field's palette for an hour, a mood and a place, a port of `tokens/color.ts`.
- The tests hold both to numbers `npm run build` writes from the TypeScript, to 1e-12.

The package is plain Swift apart from the one SwiftUI extension, which is behind `canImport`. It builds and passes on macOS. Linux is in CI and has not been run anywhere else.

`Tokens.Field.Application.Shatter` is the application profile worked out, so a native field needs no copy of the dials' arithmetic.

## The Design Tokens file

`dist/tokens.json` follows the Design Tokens Community Group format. Colors are OKLCH components with a gamma-encoded sRGB hex beside them (`$extensions["org.alternate"].srgb`) for tools that only take hex. Keys ending `Ms` or `Sec` are durations. A list is a group keyed `0`, `1`, `2`. Strings and booleans carry `"$type": "string"` and `"boolean"`, which the format does not define.

## What does not export

- **The rules that move things.** `fieldPalette`, the dynamics' evaluation, the springs: these are small functions, and each platform that needs one ports it and is tested against the TypeScript, as Swift's palette is. The numbers they read all export.
- **The components.** CSS components are for the web. Native components are written natively from the same tokens (the plan, stage 2).
- **The faces.** `tokens/type.ts` names them. Their files are licensed and stay with the kit.
