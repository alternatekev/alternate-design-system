// The reader: the site's source. How the page is being read, measured as data: the mood of the
// content nearest the middle of the screen, scroll speed and place, opening content, selecting
// text, pausing, and a tension that builds with activity and lets go in stillness.
//
// This is the "reader signals" block of the site's lib/air/field.ts, with the four other places
// that file read the page for itself (where in time, the nav's edge, the docks' boxes, Hello).
// Moved, not rewritten: tests/field.parity.test.ts runs it beside the original.
//
// Reader signals are read from elements carrying data-valence and data-arousal (and optionally
// data-x, data-y), which the content's mood frontmatter writes.
import { schemeEdgeFor, type DockEdge } from "../../tokens/color";
import { motion } from "../../tokens/motion";
import type { MotionTokens } from "../../tokens/schema";
import { drain, flight } from "./flight";
import type { FieldSource, FieldView } from "./source";
import { timePlace } from "./time";

type P = [number, number];
const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const sstep = (a: number, b: number, x: number) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };

export function readerSource(sm: MotionTokens["signals"] = motion.signals): FieldSource {
  // linger is as the site has it at e2fe890: measured per beat (mood().lin, below) and not yet
  // written here, so it reads 0. Left alone on purpose; see docs/migration.md, finding 1.
  const sig = { scrollSpeed: 0, linger: 0, opened: 0, select: 0, pause: 0, tension: 0 };
  let beats: HTMLElement[] = [];
  const dwell = new WeakMap<HTMLElement, number>();
  const refreshBeats = () => { beats = [...document.querySelectorAll<HTMLElement>("[data-valence]")]; };
  let mo: MutationObserver | null = null;
  let view: () => FieldView = () => ({ cssW: 1, cssH: 1, halfW: 1, halfH: 1 });

  let lastActivity = 0, openPoint: P | null = null, scrollPrev = 0, scrollDelta = 0, selectRaw = 0;
  const touch = () => { lastActivity = performance.now(); };
  const onScroll = () => { scrollDelta += scrollY - scrollPrev; scrollPrev = scrollY; touch(); };
  const onSelect = () => { const s = getSelection(); const txt = s ? String(s) : ""; selectRaw = txt.trim() ? clamp(txt.length / 140, 0.15, 1) : 0; touch(); };
  const onToggle = (e: Event) => {
    const d = e.target as HTMLDetailsElement;
    if (!(d instanceof HTMLDetailsElement)) return;
    touch();
    const r = d.getBoundingClientRect();
    const { cssW, cssH, halfW, halfH } = view();
    openPoint = [((r.left + r.width / 2) / cssW * 2 - 1) * halfW, (1 - ((r.top + r.height / 2) / cssH) * 2) * halfH];
    sig.opened = Math.min(1.6, sig.opened + (d.open ? 1 : 0.35));
  };
  const activity = ["pointermove", "pointerdown", "keydown", "wheel", "touchstart"] as const;

  const num = (el: HTMLElement, k: string, d = 0) => { const v = el.dataset[k]; return v == null ? d : +v; };
  function readerMood() {
    let wsum = 0, v = 0, a = 0, x = 0, y = 0, lin = 0;
    const mid = innerHeight / 2;
    for (const b of beats) {
      const r = b.getBoundingClientRect();
      const d = (r.top + r.height / 2 - mid) / innerHeight;
      let w = Math.exp(-(d * d) / 0.12);
      if (b.querySelector("details[open]")) w *= 2.5;
      wsum += w; v += w * num(b, "valence"); a += w * num(b, "arousal"); x += w * num(b, "x"); y += w * num(b, "y");
      lin += w * (1 - Math.exp(-(dwell.get(b) ?? 0) / sm.lingerSec));
    }
    if (wsum < 1e-4) return { v: 0.3, a: 0.2, x: 0, y: 0, lin: 0 };
    return { v: v / wsum, a: a / wsum, x: x / wsum, y: y / wsum, lin: lin / wsum };
  }
  function updateSignals(dt: number, now: number) {
    const speed = dt > 0 ? Math.abs(scrollDelta) / dt : 0;
    sig.scrollSpeed = lerp(sig.scrollSpeed, clamp(speed / 1400, 0, 1.6), Math.min(1, dt * sm.scrollFollowPerSec));
    const mid = innerHeight / 2;
    for (const b of beats) {
      const r = b.getBoundingClientRect();
      const centered = Math.abs(r.top + r.height / 2 - mid) < innerHeight * 0.28;
      const t = dwell.get(b) ?? 0;
      dwell.set(b, centered && sig.scrollSpeed < 0.15 && !document.hidden ? t + dt : Math.max(0, t - dt * 0.6));
    }
    sig.opened *= Math.exp(-dt / sm.openedDecaySec);
    sig.select = lerp(sig.select, selectRaw, Math.min(1, dt * sm.selectFollowPerSec));
    sig.pause = sstep(sm.pauseRampSec[0], sm.pauseRampSec[1], (now - lastActivity) / 1000);
    sig.tension = clamp(sig.tension + (sig.scrollSpeed * 0.35 + sig.opened * 0.12) * dt - (0.03 + 0.1 * sig.pause) * dt, 0, 1);
  }

  return {
    start(v) {
      view = v;
      refreshBeats();
      mo = new MutationObserver(refreshBeats);
      mo.observe(document.body, { childList: true, subtree: true });
      lastActivity = performance.now(); scrollPrev = scrollY;
      addEventListener("scroll", onScroll, { passive: true });
      activity.forEach((t) => addEventListener(t, touch, { passive: true }));
      document.addEventListener("selectionchange", onSelect);
      document.addEventListener("toggle", onToggle, true);
    },
    stop() {
      mo?.disconnect(); mo = null;
      removeEventListener("scroll", onScroll); activity.forEach((t) => removeEventListener(t, touch));
      document.removeEventListener("selectionchange", onSelect); document.removeEventListener("toggle", onToggle, true);
    },
    update: updateSignals,
    signals: sig,
    takeScroll() { const d = scrollDelta; scrollDelta = 0; return d; },
    mood: readerMood,
    // where in time: scrolling, or the timeline
    place: timePlace,
    // the nav's edge picks the scheme when centered; its corners pick the side schemes.
    // Until the timeline scrubs, scrolling down through the phases stands in for the year.
    edge() {
      const navEl = document.querySelector<HTMLElement>('.dock[data-dock="nav"]');
      const navEdge = (navEl?.dataset.edge ?? "top") as DockEdge;
      const along = navEl?.dataset.p ? +navEl.dataset.p % 1 : 0.5; // t, clockwise: on the bottom it runs right to left
      const leftward = navEdge === "bottom" || navEdge === "left" ? along > 0.75 : along < 0.25;
      const rightward = navEdge === "bottom" || navEdge === "left" ? along < 0.25 : along > 0.75;
      return schemeEdgeFor(navEdge, leftward ? "left" : rightward ? "right" : "center");
    },
    openPoint: () => openPoint,
    flight,
    drain,
    // how much Hello is in view: 1 when it fills the screen, 0 a screen away
    hello() {
      const el = document.querySelector<HTMLElement>(".beat.welcome");
      let want = 0;
      if (el) { const r = el.getBoundingClientRect(); want = Math.max(0, 1 - Math.abs(r.top) / Math.max(1, innerHeight)); }
      return want;
    },
    panes() {
      const docks = document.querySelectorAll<HTMLElement>(".dock");
      return [...docks].map((el) => ({ id: el.dataset.dock ?? "", rect: el.getBoundingClientRect(), hover: el.hasAttribute("data-hover") }));
    },
  };
}
