// Everything the tokens become, written to dist/ and platforms/. The outputs are committed, so a
// consumer with no build step (a Python app, Swift Package Manager) can take them as they are, and
// `npm run fresh` fails a change whose outputs were not rebuilt.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";
import { appStylesheet } from "../src/css";
import { luminance, toSrgb, type Oklch } from "../src/color";
import { app } from "../tokens/app";
import { chart, color, cssVariables, fieldPalette } from "../tokens";
import { dtcg } from "./gen/dtcg";
import { swift, swiftGolden } from "./gen/swift";
import { tokenTree } from "./gen/tree";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const { version } = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8")) as { version: string };
const write = (path: string, text: string) => { const p = resolve(root, path); mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, text); console.log(`  ${path}  ${(Buffer.byteLength(text) / 1000).toFixed(1)} KB`); };

const tree = tokenTree();

// the web
write("dist/css/tokens.css", `/* alternate-design-system ${version}: the site's custom properties, as tokens/index.ts cssVariables() returns them. Generated; edit the tokens. */\n${cssVariables()}\n`);
write("dist/css/app.css", appStylesheet(readFileSync(resolve(root, "css/app.css"), "utf8")));

// every platform's tooling
write("dist/tokens.json", dtcg(tree, { version }));

// Swift
write("platforms/swift/Sources/AlternateTokens/Tokens.generated.swift", swift(tree, { version }));
const samples = [];
for (const edge of ["top", "right", "bottom", "left"] as const)
  for (const [hour, valence, arousal, year] of [[0, 0, 0, 0], [6.4, 0.6, 0.55, 0.2], [12, -0.4, 0.8, 0.5], [17.75, 0.9, 0.95, 0.77], [23.9, -1, 1, 1], [9.3, 0.3, 0.2, 0.33]])
    samples.push({ hour, valence, arousal, edge, year, out: fieldPalette(hour, valence, arousal, { edge, year }) });
const colors = ([...Object.values(color.phases), color.ui.paper, color.ui.ink, color.ui.quiet, color.ui.rule, color.ui.accent, ...Object.values(app.tone), chart.exception, [1, 0, 0], [0, 0, 0], [0.7, 0.37, 140]] as Oklch[])
  .map((c) => ({ oklch: c, srgb: toSrgb(c), luminance: luminance(c) }));
write("platforms/swift/Tests/AlternateTokensTests/PaletteGolden.generated.swift", swiftGolden(samples, colors));

// the field, bundled for a page with no build step of its own: <script type="module"> and mountField()
const out = await build({ entryPoints: [resolve(root, "src/field/app.ts")], bundle: true, format: "esm", target: "es2020", minify: true, write: false, legalComments: "none",
  banner: { js: `/* alternate-design-system ${version}: the field for applications (src/field/app.ts). Generated; edit the source. */` } });
write("dist/field.js", out.outputFiles[0].text);
