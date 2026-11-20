# The plan

Started 2026-11-20. Kevin: the design system is tied to the site's codebase; take it out into a public repository as the first step toward using it in many other projects, internal apps in particular, a dashboard app first. The site's system is presentational (small type that zooms, the shatter art), so applications need toned-down versions, but the backgrounds must still feel alive, part of the same system, and responsive to data. iOS, tvOS and macOS components are part of the system, so the tokens must export to each; Windows and Linux later. Prototype in a copy of the dashboard app. The website moves onto this only when it is complete, with zero defects or visual regressions.

## What was found

- The site (`alternate-viewsource`, public, at commit e2fe890) already keeps its system as data. Six token families in TypeScript, authored in OKLCH, each with a schema and build-time checks. The field moves by one rule: every quantity is `base + Σ coefficient × signal`, with the signals measured from how the page is read. So the system was most of the way to being portable; what tied it to the site was where the files lived and what the field read for itself.
- The field (`lib/air/field.ts`, 858 lines) read five things directly from the site's page: the reader's signals, where in time the page is, the nav's edge, the docks' boxes, and Hello. Everything else in it is mechanism.
- The first application is server-rendered HTML with no JavaScript framework and no build step. So an application cannot be assumed to have Node, React or a bundler. It needs files it can take as they are.
- The same dashboards are also shown by a native app, in SwiftUI, with a palette of its own. It cannot show web pages, so the system has to reach it as Swift.
- Type is the one family the site has no tokens for (its own audit says so), and the site has one dark world and no light tier.

## The shape

```
tokens/  ──►  scripts/build.ts  ──►  dist/css/tokens.css      the site's custom properties
(the source                          dist/css/app.css         the application register
 of truth)                           dist/tokens.json         Design Tokens format: any platform
                                     dist/field.js            the field, for a page with no build
                                     platforms/swift/         Swift: iOS, tvOS, macOS

src/field/engine.ts  ◄── FieldSource   what moves the field:  reader.ts (the site) · data.ts (an app)
                     ◄── FieldTokens   how far:               presentational (the site) · application (dials)
```

Three decisions carry it.

1. **Tokens are data, and every platform is a generator.** The token files are the site's own. `scripts/gen/tree.ts` walks each family with its schema, so a generator knows a color from three numbers, and each target (CSS, the Design Tokens JSON, Swift) is one small file. Windows and Linux are further generators reading the same tree, or any standard tool reading `tokens.json`. Outputs are committed so a consumer needs no build.
2. **Registers, not themes.** The application register adds no colors. It names the site's own values for the jobs an application has: the panel is the charts' card, a state is the charts' data ink, words are set as the site sets its controls. What it adds is structure: sizes for type read at one size, components for dense data.
3. **One field, handed what moves it.** The engine takes a source and a profile. The site hands it the reader and its own tokens and gets the field it had. An application hands it its data and the same tokens turned down by dials. The six signals keep their meanings, so the same field answers in the same way: a change landing is what opening a piece is on the site; what waits on someone is tension; a quiet system settles the way a reader who looked away does.

## Stages

Each stage ends at a gate. Nothing moves to the next on a promise.

### Stage 0. Out of the site, proven equal. Done 2026-11-20

- This repository, with the site's token files, color math and field moved in.
- **Gate, met:** the tokens equal the site's; `cssVariables()` returns the same string byte for byte; the palette agrees at 28,800 points; and the extracted field makes the same WebGL calls with the same numbers as the site's own, frame for frame, across three scripted visits (126,916 calls in the longest). A one-in-ten-million nudge to one constant fails it.
- CSS, Design Tokens JSON and Swift exports. The Swift port of the palette agrees with TypeScript to 1e-12.
- A first sketch of the application register and the application field profile, and a data source.
- A copy of the dashboard app running in the register with the field behind it, moved by its data and refreshed in place.

### Stage 1. The application register, by eye

Everything in the register is a first sketch from values the site already has. This stage is Kevin's: looking at the prototype and turning things.

- The dials (`tokens/profiles.ts`): how many pieces, pace, camera, light, presence. And what the app's data means to the field (the mapping lives in the app, since only it knows its data).
- The glass on a dense page. A page of panels covers most of the field, so it shows as light through frost and as sharp pieces in the gutters. Whether that is alive enough, or panels want more air, less frost, or the field brought forward.
- Type: the four sizes, which face sets what, and whether an application wants a text face at all.
- Tones: the charts' data ink standing for work, needs, ok, bad and quiet.
- Move the prototype's markup onto the register's components and delete its stopgap skin. Grow the components from what the app really needs (tables, forms, an empty state, a question with answers), each art-directed.
- Bring the one transition here (`lib/type.ts`: type in, type out), so a change arriving on a page arrives the way everything on the site does, instead of being swapped in.
- A second app, to find what the first one hid.
- **Gate:** Kevin says the prototype is the system. The validator holds contrast for everything it shows.

### Stage 2. Native

- The native app reads `AlternateTokens` in place of its own palette, and its panels become the register's.
- The field on native, in two steps: first the ground and light from `FieldPalette` (the hour, the app's mood), which every platform can do today; then the field itself in Metal, reading the same dynamics from `Tokens.Field.Application.Shatter`, held to the web engine by the same trace test (the simulation is plain arithmetic; only the drawing differs).
- The faces on native. They come from an Adobe Fonts kit, which a web page can link and an app cannot; this needs an answer before a native screen can look right.
- SwiftUI components to match the web ones, once Stage 1 has settled what they are.
- **Gate:** the native screen and the web page of the same dashboard read as one thing.

### Stage 3. The rest of the site's system

The docks, the type transition, the charts, the surface (the zoom) and the instrument are still only in the site. Each moves the way the field did: copied whole, its site-specific reads cut out behind a seam, and a harness that runs it beside the original before anything else changes.

- **Gate, per piece:** its parity test.

### Stage 4. The site moves onto it

Only when the stages above are done.

- The site depends on this package and deletes its own copies. For the field the change is the import path: `src/field/site.ts` keeps `createField`'s signature.
- **Gate:** the parity tests here pass against the site's tree at that moment (not only e2fe890); the site's own end-to-end suite passes untouched; its budgets hold (first-load JavaScript, no WebGL before first paint); and pixel comparisons of every route at every size in its test matrix show no difference, with the field held still on a fixed seed and hour. Zero means zero: a difference is fixed here, not accepted there.
- `docs/migration.md` has the swap list and what was found on the way.

### Later

Windows and Linux: generators for whatever those apps are built in (XAML, GTK or Qt styles), reading the same tree. The Swift package is already plain Swift outside one SwiftUI extension.

## What keeps it honest

- The site's files are frozen in `reference/` and every change is tested against them.
- If the site's tokens change before Stage 4, the reference is taken again and the same change is made here in the same commit (`docs/migration.md`). Until Stage 4 the site is the original and this is the copy.
- A profile is dials, so there is one field to tune.
- Built files are committed and checked for freshness.
- The validator fails a token change that breaks contrast, a loop, a ceiling or a ratio.

## Open, Kevin's calls

1. **The name.** `alternate-design-system` is a working name, for the repository and the package.
2. **A license.** There is none yet. Public with no license means others may read it and not reuse it.
3. **Every value in the application register**, as Stage 1 says.
4. **A light tier.** The dashboard app has a light theme today; the system has one dark world. The prototype is dark only.
5. **The faces in applications and on native.** The prototype links the same Adobe Fonts kit the site does. Whether the kit should serve apps that are not on the public web, and what native apps do.
6. **How apps take it.** Today: a copy of the built files, with the commit written beside them. A package registry can come when there is a second consumer who wants one.
7. **The field on native**, and how much of Stage 2 is wanted before Stage 3.
