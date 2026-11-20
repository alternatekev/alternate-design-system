// Data: an application's source. Where the site's field is moved by how a page is read, an
// application's is moved by what its data is doing: how much is under way, how it is going, what
// waits on someone, and each change as it lands.
//
// It speaks the same six signals as the reader, with the same meanings, so the same field answers
// in the same way:
//
//   the reader                       the data
//   the mood of the chapter in view  set({ valence, arousal }): how it is going, how much is moving
//   opening a piece                  pulse(): something just changed; decays over seconds
//   scrolling and opening builds     set({ tension }): what waits on someone. It holds while
//     tension; stillness releases it   they wait and lets go as they are answered
//   the reader pausing               no change for a while: the field settles, as it does for a
//                                      reader who has looked away
//   where in time                    set({ place }): where on the app's own line, 0..1
//
// The rules are the motion skill's. A source changes targets and rates, never positions. set() is
// where things stand, and the field takes seconds to get there; pulse() is a nudge that fades.
// Call either as often as the data moves. Nothing here can make the field jump.
import type { DockEdge } from "../../tokens/color";
import { motion } from "../../tokens/motion";
import type { MotionTokens } from "../../tokens/schema";
import type { FieldSource, FieldView } from "./source";

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const sstep = (a: number, b: number, x: number) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };

export type DataState = {
  /** how it is going, -1 (badly) .. 1 (well): warm when well, cool when not */
  valence?: number;
  /** how much is moving, 0 (at rest) .. 1 (everything at once): more pieces, more light, more pace */
  arousal?: number;
  /** what waits on someone, 0 .. 1: sharper light, a little more pace, until it is answered */
  tension?: number;
  /** where on the app's own line, 0 .. 1: picks the color inside the scheme */
  place?: number;
  /** which of the four color schemes */
  edge?: DockEdge;
  /** where the shatter point leans, each -0.5 .. 0.5 of the view */
  point?: [x: number, y: number];
};

export interface DataSource extends FieldSource {
  /** where things stand. Only the keys given change. */
  set(state: DataState): void;
  /** something just changed. strength 1 is one ordinary change; `at`, in CSS px from the top left
   *  of the view, leans the shatter point toward where on the screen it happened */
  pulse(strength?: number, at?: { x: number; y: number }): void;
  readonly state: Required<DataState>;
}

export function dataSource(opts: { signals?: MotionTokens["signals"]; /** let page scroll carry the shards, as the site does */ scroll?: boolean } = {}): DataSource {
  const sm = opts.signals ?? motion.signals;
  const sig = { scrollSpeed: 0, linger: 0, opened: 0, select: 0, pause: 0, tension: 0 };
  const state: Required<DataState> = { valence: 0.3, arousal: 0.2, tension: 0, place: 0, edge: "top", point: [0, 0] }; // at rest: the reader's own resting mood
  let view: () => FieldView = () => ({ cssW: 1, cssH: 1, halfW: 1, halfH: 1 });
  let lastChange = 0, openPoint: [number, number] | null = null, scrollPrev = 0, scrollDelta = 0, started = false;
  const onScroll = () => { scrollDelta += scrollY - scrollPrev; scrollPrev = scrollY; };

  return {
    start(v) {
      view = v; started = true; lastChange = performance.now();
      if (opts.scroll) { scrollPrev = scrollY; addEventListener("scroll", onScroll, { passive: true }); }
    },
    stop() { started = false; if (opts.scroll) removeEventListener("scroll", onScroll); },
    update(dt, now) {
      if (opts.scroll) { const speed = dt > 0 ? Math.abs(scrollDelta) / dt : 0; sig.scrollSpeed = lerp(sig.scrollSpeed, clamp(speed / 1400, 0, 1.6), Math.min(1, dt * sm.scrollFollowPerSec)); }
      sig.opened *= Math.exp(-dt / sm.openedDecaySec);
      // stillness: nothing has changed for a while
      sig.pause = sstep(sm.pauseRampSec[0], sm.pauseRampSec[1], (now - lastChange) / 1000);
      // tension follows what waits, at the pace a selection is followed; it is held, not spent
      sig.tension = lerp(sig.tension, state.tension, Math.min(1, dt * sm.selectFollowPerSec));
    },
    signals: sig,
    takeScroll() { const d = scrollDelta; scrollDelta = 0; return d; },
    mood: () => ({ v: state.valence, a: state.arousal, x: state.point[0], y: state.point[1] }),
    place: () => state.place,
    edge: () => state.edge,
    openPoint: () => openPoint,
    flight: { shape: 0, surge: 0, push: 0, gather: 0 },
    drain() {},
    hello: () => 0,
    panes: () => [],

    set(next) {
      if (next.valence != null) state.valence = clamp(next.valence, -1, 1);
      if (next.arousal != null) state.arousal = clamp(next.arousal, 0, 1);
      if (next.tension != null) state.tension = clamp(next.tension, 0, 1);
      if (next.place != null) state.place = clamp(next.place, 0, 1);
      if (next.edge != null) state.edge = next.edge;
      if (next.point != null) state.point = [clamp(next.point[0], -0.5, 0.5), clamp(next.point[1], -0.5, 0.5)];
    },
    pulse(strength = 1, at) {
      if (started) lastChange = performance.now();
      sig.opened = Math.min(1.6, sig.opened + Math.max(0, strength));
      if (at) { const { cssW, cssH, halfW, halfH } = view(); openPoint = [(at.x / cssW * 2 - 1) * halfW, (1 - (at.y / cssH) * 2) * halfH]; }
    },
    state,
  };
}
