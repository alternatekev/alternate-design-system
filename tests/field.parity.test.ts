// The engine here against the site's own field (reference/site-e2fe890/lib/air/field.ts), on the
// same page, the same clock and the same visit. Every WebGL call each makes is written down, with
// its numbers; the two lists must be the same list. Shaders, uniforms, every shard's place in
// every frame: if a refactor moves any of it by one bit, this fails and says where.
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createField as oursCreate } from "../src/field/site";
import * as oursFlight from "../src/field/flight";
import { installPage, type Page, type PageSpec } from "./harness/env";
// @ts-ignore: "@/" is the frozen site, by the paths in tsconfig.test.json
import { createField as siteCreate } from "@/lib/air/field";
// @ts-ignore
import * as siteFlight from "@/lib/flight";

type Handle = NonNullable<ReturnType<typeof oursCreate>>;
type Flight = typeof oursFlight;
type Script = (at: number, page: Page, field: Handle, flight: Flight) => void;
type Scenario = { name: string; page: PageSpec; opts: { seed: number; simulateMusic?: boolean; paused?: boolean }; frames: number; script: Script };

const home: PageSpec["beats"] = [
  { welcome: true, valence: 0.5, arousal: 0.3, x: 0.1, y: -0.05, top: 0, height: 900 },
  { key: "dialup", valence: 0.6, arousal: 0.55, x: -0.2, y: 0.1, top: 900, height: 1400 },
  { key: "broadband", valence: -0.4, arousal: 0.8, x: 0.25, y: 0.15, top: 2300, height: 1100 },
  { key: "apps", valence: 0.2, arousal: 0.4, top: 3400, height: 1600 },
  { key: "components", valence: -0.7, arousal: 0.2, x: -0.1, y: -0.2, top: 5000, height: 900 },
  { key: "agents", valence: 0.9, arousal: 0.95, x: 0, y: 0, top: 5900, height: 2000 },
];
const docks: PageSpec["docks"] = [
  { id: "nav", edge: "bottom", p: "1", left: 8, top: 844, width: 560, height: 48 },
  { id: "timeline", edge: "top", left: 8, top: 8, width: 1424, height: 48 },
];

const scenarios: Scenario[] = [
  {
    name: "a laptop reads the home page: scrolls, opens, selects, moves the nav, travels, rests",
    page: { width: 1440, height: 900, dpr: 2, clock: "2026-10-23T16:40:00", beats: home, docks },
    opts: { seed: 4242 }, frames: 460,
    script(at, page, field, flight) {
      if (at === 20) { const img = page.images[0]; img.naturalWidth = 800; img.naturalHeight = 1000; img.onload(); }
      if (at >= 60 && at < 180) page.scrollTo(page.state.scrollY + 38);
      if (at === 100) { const d = new page.HTMLDetailsElement(); d.box = { top: 300, left: 500, width: 400, height: 60, bottom: 360, right: 900 }; page.beats[2].open = true; page.toggle(d); }
      if (at === 130) page.fire("pointermove");
      if (at === 150) page.select("the web was a place you dialed into, and it answered slowly, and that was most of its charm");
      if (at === 190) page.select("");
      if (at === 200) { page.docks[0].dataset.edge = "top"; page.docks[0].dataset.p = "0.1"; page.docks[1].hover = true; }
      if (at === 215) page.docks[1].hover = false;
      if (at === 220) field.setTimeOfDay(19.25);
      if (at === 240) field.setMusic(0.2, -0.1, 0.8);
      if (at === 260) { flight.setShape(true); flight.crossYear(2); }
      if (at >= 262 && at < 300) page.scrollTo(page.state.scrollY - 55);
      if (at === 300) { flight.setGather(0.8); flight.setPush(0.7); }
      if (at === 320) { flight.setGather(0); flight.setPush(0); flight.setShape(false); }
      if (at === 330) field.pause();
      if (at === 340) field.play();
      if (at === 350) page.resize(1280, 720);
      if (at === 360) page.hide(true);
      if (at === 365) page.hide(false);
      if (at === 380) page.advance(9000); // the reader looks away: stillness
      if (at === 400) page.advance(12000);
      if (at === 420) field.setTimeOfDay(null);
    },
  },
  {
    name: "a phone, newest first, asking for less motion",
    page: { width: 390, height: 844, dpr: 3, coarse: true, reducedMotion: true, clock: "2026-10-23T06:10:00", order: "newest-first", beats: home.map((b) => ({ ...b, height: b.height * 1.6, top: b.top * 1.6 })), docks: [{ id: "nav", edge: "bottom", p: "0.5", left: 8, top: 780, width: 374, height: 56 }] },
    opts: { seed: 77, simulateMusic: false }, frames: 300,
    script(at, page, field, flight) {
      if (at >= 10 && at < 120) page.scrollTo(page.state.scrollY + 90);
      if (at === 60) page.fire("touchstart");
      if (at === 140) { flight.crossYear(4); flight.setPush(1); }
      if (at === 150) page.resize(844, 390);
      if (at >= 160 && at < 200) page.scrollTo(Math.max(0, page.state.scrollY - 200));
      if (at === 210) field.setMusic(-0.4, 0.3, 0.2);
      if (at === 250) flight.setPush(0);
    },
  },
  {
    name: "a field made still, played later, on a page with nothing to read",
    page: { width: 1920, height: 1080, dpr: 1, clock: "2026-10-23T23:55:00", beats: [], docks: [] },
    opts: { seed: 99990, paused: true }, frames: 200,
    script(at, page, field) {
      if (at === 30) field.play();
      if (at === 90) field.pause();
      if (at === 100) page.resize(1600, 900);
      if (at === 120) field.play();
    },
  },
];

function visit(sc: Scenario, create: typeof oursCreate, flight: Flight) {
  const page = installPage(sc.page);
  try {
    page.scrollTo(0); // any reader module left over from an earlier visit starts from the top
    const before = page.listeners();
    const field = create(page.canvas, sc.opts);
    assert.ok(field, "the field started");
    for (let at = 0; at < sc.frames; at++) { sc.script(at, page, field, flight); page.frame(); }
    const numbers = JSON.stringify(field.numbers), made = { seed: field.seed, pattern: field.pattern };
    field.destroy();
    // what the visit left listening: nothing on the document; on the window only the reader's own
    // scroll listener for where in time, which lib/time.ts wires once and keeps (as in a tab)
    const after = page.listeners();
    return { log: page.log, numbers, made, listeners: { window: after.window - before.window, document: after.document - before.document } };
  } finally {
    flight.setShape(false); flight.setPush(0); flight.setGather(0); flight.flight.surge = 0;
    page.restore();
  }
}

describe("the engine draws what the site's field draws", () => {
  for (const sc of scenarios) {
    it(sc.name, () => {
      const site = visit(sc, siteCreate, siteFlight), ours = visit(sc, oursCreate, oursFlight);
      // the visit has to have been a real one, or agreeing means nothing
      assert.ok(site.log.length > 5000, `only ${site.log.length} GL calls recorded`);
      assert.ok(site.log.some((c) => c.startsWith("shaderSource(")) && site.log.some((c) => c.startsWith("drawElements(")));
      assert.ok(new Set(site.log.filter((c) => c.startsWith("bufferSubData("))).size > sc.frames / 4, "the shards moved");
      const first = site.log.findIndex((c, i) => c !== ours.log[i]);
      if (first >= 0 || site.log.length !== ours.log.length)
        assert.fail(`GL call ${first} of ${site.log.length} (ours: ${ours.log.length}) differs\n  site: ${site.log[first]?.slice(0, 300)}\n  ours: ${ours.log[first]?.slice(0, 300)}`);
      assert.equal(ours.numbers, site.numbers);
      assert.deepStrictEqual(ours.made, site.made);
      assert.deepStrictEqual(ours.listeners, site.listeners);
      assert.equal(ours.listeners.document, 0, "destroy() let go of every document listener");
      assert.ok(ours.listeners.window <= 1, "and of every window listener but the one that keeps time");
    });
  }
});
