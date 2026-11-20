// The application register: what it adds must stay tied to what the site has, and an application's
// field must keep the motion rules the site's does.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { appCssVariables, appStylesheet, faceVariables } from "../src/css";
import { createField } from "../src/field/engine";
import { dataSource } from "../src/field/data";
import { cssVariables } from "../tokens";
import { application, presentational } from "../tokens/profiles";
import { installPage } from "./harness/env";

const root = new URL("..", import.meta.url);
const read = (p: string) => readFileSync(new URL(p, root), "utf8");

describe("the application register reads the site's system", () => {
  it("the faces are the four the site's stylesheet declares, to the letter", () => {
    const css = read("reference/site-e2fe890/app/globals.css");
    for (const [name, stack] of Object.entries(faceVariables())) {
      const m = css.match(new RegExp(`${name}: ([^;]+);`));
      assert.ok(m, `the site declares ${name}`);
      assert.equal(stack, m[1]);
    }
  });

  it("every custom property the stylesheet reads is one it defines", () => {
    const css = appStylesheet(read("css/app.css"));
    const defined = new Set([...css.matchAll(/(--[a-z0-9-]+)\s*:/g)].map((m) => m[1]));
    const read_ = new Set([...css.matchAll(/var\((--[a-z0-9-]+)/g)].map((m) => m[1]));
    const missing = [...read_].filter((v) => !defined.has(v));
    assert.deepStrictEqual(missing, []);
  });

  it("the components set no color, face or size of their own", () => {
    const css = read("css/app.css").replace(/\/\*[\s\S]*?\*\//g, "");
    assert.deepStrictEqual(css.match(/#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(|oklch\(/gi) ?? [], [], "a color written into the stylesheet");
    const fonts = [...css.matchAll(/font(?:-family)?:\s*([^;}]+)/g)].map((m) => m[1]).filter((v) => !/var\(--|inherit/.test(v));
    assert.deepStrictEqual(fonts, [], "a face written into the stylesheet");
    assert.deepStrictEqual(css.match(/transition(?!-)|animation|@keyframes|:hover/g) ?? [], [], "nothing animates or answers a hover");
  });

  it("the built stylesheet carries the site's properties unchanged, then its own", () => {
    const built = read("dist/css/app.css");
    assert.ok(built.includes(cssVariables()) && built.includes(appCssVariables()));
    assert.equal(read("dist/css/tokens.css").split("\n")[1], cssVariables());
  });
});

describe("the data source", () => {
  it("a pulse fades over seconds, what waits is held, and quiet settles", () => {
    const page = installPage({ width: 1440, height: 900, dpr: 1, clock: "2026-11-20T12:00:00", beats: [], docks: [] });
    try {
      const s = dataSource();
      s.start(() => ({ cssW: 1440, cssH: 900, halfW: 3, halfH: 2 }));
      s.pulse(1, { x: 1440, y: 0 });
      assert.equal(s.signals.opened, 1);
      assert.deepStrictEqual(s.openPoint(), [3, 2]);
      s.set({ tension: 0.8, valence: -2, arousal: 5 });
      assert.deepStrictEqual([s.state.valence, s.state.arousal], [-1, 1], "a state is clamped to its range");
      let t = 1000;
      for (let i = 0; i < 60 * 7; i++) { t += 1000 / 60; page.advance(1000 / 60); s.update(1 / 60, t); }
      assert.ok(Math.abs(s.signals.opened - Math.exp(-1)) < 0.01, `after its decay time a pulse is at 1/e, not ${s.signals.opened}`);
      assert.ok(s.signals.tension > 0.79, "what waits is held");
      assert.ok(s.signals.pause > 0 && s.signals.pause < 1, "seven seconds of quiet is part way to still");
      for (let i = 0; i < 60 * 12; i++) { t += 1000 / 60; page.advance(1000 / 60); s.update(1 / 60, t); }
      assert.equal(s.signals.pause, 1, "and then it is still");
      s.pulse();
      s.update(1 / 60, t + 17);
      assert.equal(s.signals.pause, 0, "until something changes");
    } finally { page.restore(); }
  });
});

describe("an application's field", () => {
  const run = (script: (at: number, s: ReturnType<typeof dataSource>) => void, frames = 600) => {
    const page = installPage({ width: 1440, height: 900, dpr: 1, clock: "2026-11-20T12:00:00", beats: [], docks: [] });
    try {
      const source = dataSource(), field = createField(page.canvas, { tokens: application, source, seed: 7 });
      assert.ok(field);
      const trail: Record<string, any>[] = [];
      for (let at = 0; at < frames; at++) { script(at, source); page.frame(); trail.push(field.numbers as Record<string, any>); }
      field.destroy();
      return { trail, log: page.log, listeners: page.listeners() };
    } finally { page.restore(); }
  };

  it("has fewer pieces than the site's, and no panes or portrait", () => {
    assert.ok(application.shatter.shardRange[1] < presentational.shatter.shardRange[1]);
    const { log } = run(() => {}, 30);
    assert.ok(!log.some((c) => c.startsWith("copyTexSubImage2D(")), "no dock panes are refracted");
  });

  it("answers its data, and never jumps: a change of state arrives over seconds", () => {
    const at = 240;
    const { trail } = run((i, s) => { if (i === at) { s.set({ valence: -1, arousal: 1, tension: 1 }); s.pulse(1.5); } });
    const calm = run(() => {}).trail;
    for (const key of ["expand", "opacity", "keyI", "exposure"]) {
      const before = trail[at - 1][key] as number, after = trail.at(-1)![key] as number, total = Math.abs(after - before);
      assert.ok(total > 1e-4, `${key} answered the data (${before} to ${after})`);
      assert.notEqual(after, calm.at(-1)![key], `${key} differs from a field nothing happened to`);
      const firstStep = Math.abs((trail[at][key] as number) - before);
      assert.ok(firstStep < total * 0.02, `${key} moved ${((firstStep / total) * 100).toFixed(1)}% of the way in the first frame`);
      let biggest = 0; for (let i = at; i < trail.length; i++) biggest = Math.max(biggest, Math.abs((trail[i][key] as number) - (trail[i - 1][key] as number)));
      assert.ok(biggest < total * 0.05, `${key} never moved more than 5% of the way in one frame`);
    }
    // color too: the background glides
    const bg0 = trail[at - 1].bg as number[], bg1 = trail[at].bg as number[], bgN = trail.at(-1)!.bg as number[];
    const dist = (a: number[], b: number[]) => Math.hypot(...a.map((x, i) => x - b[i]));
    assert.ok(dist(bg0, bg1) <= dist(bg0, bgN) * 0.02 + 1e-6);
  });

  it("leaves nothing listening when it is destroyed", () => {
    const { listeners } = run(() => {}, 10);
    assert.equal(listeners.document, 0);
  });
});
