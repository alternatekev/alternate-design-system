// Parity with the site. The token files here were moved from alternate-viewsource, not rewritten.
// These tests hold that true: every family, the stylesheet's custom properties and the field's
// palette must equal what the site's own files (frozen in reference/) produce. When the site moves
// onto this package, this is the proof that nothing it shows can have changed.
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import * as ours from "../tokens";
import { matrix, schemeAt, schemeByEdge, schemeEdgeFor, schemes } from "../tokens/color";
import * as oursColor from "../src/color";
// @ts-ignore: "@/" is the frozen site, by the paths in tsconfig.test.json
import * as site from "@/tokens";
// @ts-ignore
import * as siteColorTokens from "@/tokens/color";
// @ts-ignore
import * as siteColor from "@/lib/color";

const families = ["color", "motion", "shatter", "dock", "sound", "chart"] as const;

describe("tokens equal the site's at e2fe890", () => {
  for (const f of families) it(f, () => assert.deepStrictEqual(ours[f], site[f]));
  it("exports the same names", () => assert.deepStrictEqual(Object.keys(ours).sort(), Object.keys(site).sort()));
  it("the color matrix", () => {
    assert.deepStrictEqual(schemes, siteColorTokens.schemes);
    assert.deepStrictEqual(schemeByEdge, siteColorTokens.schemeByEdge);
    assert.deepStrictEqual(matrix, siteColorTokens.matrix);
  });
});

describe("what the tokens produce", () => {
  it("cssVariables() is the same string, byte for byte", () => assert.equal(ours.cssVariables(), site.cssVariables()));

  it("fieldPalette agrees across hours, moods, edges and years", () => {
    let n = 0;
    for (const edge of ["top", "right", "bottom", "left"] as const)
      for (let year = 0; year <= 1.0001; year += 0.125)
        for (let h = 0; h < 24; h += 0.75)
          for (let v = -1; v <= 1; v += 0.5)
            for (let a = 0; a <= 1; a += 0.25) {
              assert.deepStrictEqual(ours.fieldPalette(h, v, a, { edge, year }), site.fieldPalette(h, v, a, { edge, year }));
              n++;
            }
    assert.ok(n > 20000);
  });

  it("timeOfDay, schemeAt and schemeEdgeFor agree", () => {
    for (let h = -3; h < 30; h += 0.37) assert.deepStrictEqual(ours.timeOfDay(h), site.timeOfDay(h));
    for (const edge of ["top", "right", "bottom", "left"] as const) {
      for (let y = -0.2; y <= 1.2; y += 0.05) assert.deepStrictEqual(schemeAt(edge, y), siteColorTokens.schemeAt(edge, y));
      for (const spot of ["left", "center", "right"] as const) assert.equal(schemeEdgeFor(edge, spot), siteColorTokens.schemeEdgeFor(edge, spot));
    }
  });

  it("the color math agrees", () => {
    const samples: [number, number, number][] = [[0, 0, 0], [1, 0, 0], [0.135, 0.012, 265], [0.93, 0.008, 85], [0.63, 0.25, 29], [0.86, 0.09, 205], [0.5, 0.37, 359.9]];
    for (const c of samples) {
      for (const fn of ["oklchToOklab", "toLinear", "toSrgb", "luminance"] as const) assert.deepStrictEqual((oursColor as any)[fn](c), siteColor[fn](c));
      for (const alpha of [1, 0.94, 0.6, 0]) assert.equal(oursColor.toCss(c, alpha), siteColor.toCss(c, alpha));
      for (const d of samples) for (const t of [0, 0.25, 0.5, 1]) {
        assert.deepStrictEqual(oursColor.mix(c, d, t), siteColor.mix(c, d, t));
        assert.deepStrictEqual(oursColor.mixLab(c, d, t), siteColor.mixLab(c, d, t));
      }
    }
  });
});
