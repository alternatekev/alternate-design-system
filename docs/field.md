# The field

The shattered source art, fractured anew on every load, filling the background, already in motion on the first frame and moved only by data. The direction for it is the site's `ambient-field-motion` skill and `docs/air.md` there; this page is how the code is laid out now that more than the site uses it.

## Three parts

| Part | File | What it is |
| --- | --- | --- |
| The engine | `src/field/engine.ts` | Mechanism: the Voronoi fracture, the simulation, the springs, the camera, the light, the GL. It has no opinion about what moves it or how far. |
| A source | `src/field/source.ts` (the contract), `reader.ts`, `data.ts` | What the field is moved by, measured as data. |
| A profile | `tokens/profiles.ts` | Every number the field is tuned by. |

```ts
createField(canvas, { tokens: presentational, source: readerSource() })   // the site's field
createField(canvas, { tokens: application,    source: dataSource() })     // an application's
```

`src/field/site.ts` wraps the first as `createField(canvas, opts)`, the signature the site calls today. `src/field/app.ts` wraps the second as `mountField()`, which also makes the canvas, waits for idle, checks the device can afford it, and fades it in.

## The signals

Every moving quantity in the field is `base + Σ coefficient × signal` (`tokens/shatter.ts`). There are six measured signals, and a source supplies them.

| Signal | The reader (the site) | The data (an application) |
| --- | --- | --- |
| mood: valence, arousal | the chapter nearest the middle of the screen | `set({ valence, arousal })`: how it is going, how much is moving |
| `opened` | opening a piece; decays over seconds | `pulse()`: something just changed |
| `tension` | builds with scrolling and opening, lets go in stillness | `set({ tension })`: what waits on someone; held until answered |
| `pause` | the reader has stopped | nothing has changed for a while |
| `scrollSpeed` | scrolling | off, unless asked for |
| `select`, `linger` | selecting text, dwelling | not used |
| place, edge | where in time; the nav's edge | `set({ place, edge })`: where on the app's own line; which scheme |

The contract is the same for every source: it changes targets and rates, never positions. `set()` is where things stand and may be called as often as the data moves. `pulse()` is a nudge that fades. Each value the field shows chases its target on a critically damped spring, so no source can make it jump. `tests/app.test.ts` checks that: after the largest possible change of state, no value moves more than a few percent of the way in a frame.

What an app's data means is the app's to say, since only it knows. A dashboard might take the share of work under way as arousal, things gone stale as falling valence, and whatever waits on a person as tension. That mapping lives in the app.

## Profiles

`presentational` is the site's tokens as they stand. Any other profile is that one turned down by dials (`turnDown`), so there is one field to tune and nothing can drift into a different-looking thing.

| Dial | Turns |
| --- | --- |
| `shards` | how many pieces |
| `speed` | travel outward, spin, swirl and sink |
| `camera` | how far the signals move the camera and the focus |
| `light` | how far the signals move the key light, the highlights and the exposure |
| `presence` | opacity, rim light, and the glow spilled into the dark |
| `portrait` | the site's own picture behind the glass (0 anywhere else) |
| `refraction` | the docks' fractured panes (off where there are no docks) |

`application` is the first sketch: `{ shards: 0.45, speed: 0.5, camera: 0.25, light: 0.6, presence: 0.7, portrait: 0, refraction: false }`. Nothing in it has been tuned by eye yet.

## Tiers

A page must be complete without the field. Three levels, least first:

1. **None.** No JavaScript, a reader saving data, or a device too slight. Panels are solid; the page is the paper.
2. **Still.** A platform that can't run the field takes its ground and light from the palette alone (`fieldPalette`, or `FieldPalette` in Swift): the hour and the mood, as color.
3. **The field.** `mountField()`.

## Proving the engine

`tests/field.parity.test.ts` runs the engine and the site's own field (`reference/`) on the same page, the same clock and the same visit, inside a fake browser (`tests/harness/env.ts`) whose WebGL context draws nothing and writes down every call. The two lists must be identical: shaders, uniforms, and a hash of every buffer. Three visits: a laptop that scrolls, opens, selects, moves the nav, travels the work page and rests; a phone, newest first, asking for less motion; and a field made still and played later on an empty page.
