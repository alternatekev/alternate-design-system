// What the field is handed. The engine (./engine.ts) is mechanism: fracture, simulation, light,
// the GL plumbing. It owns no opinion about what moves it or how strongly. Those arrive here:
//
//   FieldSource  what the field is moved by, measured as data. The site's is the reader
//                (./reader.ts): how the page is being read. An application's is its own data
//                (./data.ts): what is working, what waits, what just changed.
//   FieldTokens  every number the field is tuned by. The site's are tokens/ as they stand; an
//                application's are the same set turned down (tokens/profiles.ts).
//
// The contract the motion skill sets holds for every source: a source changes targets and rates,
// never positions. Nothing a source reports can make the field jump, because every value the
// field shows chases its target on a spring.
import type { Oklch } from "../color";
import type { DockEdge } from "../../tokens/color";
import type { DockTokens, MotionTokens, ShatterTokens } from "../../tokens/schema";

/** the six measured signals; each 0..1, except scrollSpeed and opened, which can pass 1 briefly */
export type FieldSignals = { scrollSpeed: number; linger: number; opened: number; select: number; pause: number; tension: number };
/** valence -1..1, arousal 0..1, and where the shatter point leans, -0.5..0.5 of the view each way */
export type FieldMood = { v: number; a: number; x: number; y: number };
/** the field's size: CSS pixels, and half the view in world units at the focal plane */
export type FieldView = { cssW: number; cssH: number; halfW: number; halfH: number };
/** a pane of glass laid over the field (the site's docks), in CSS pixels from the top left */
export type FieldPane = { id: string; rect: { left: number; top: number; bottom: number; width: number; height: number }; hover: boolean };
/** the work page's travel: outline (0 rectangle, 1 circle), rush, pull, and how gathered */
export type FieldFlight = { shape: number; surge: number; push: number; gather: number };

export interface FieldSource {
  /** begin measuring; view() is the field's size now, whenever asked */
  start(view: () => FieldView): void;
  /** stop measuring and let go of everything start() took */
  stop(): void;
  /** once a frame, before anything is read: move the signals on by dt seconds */
  update(dt: number, now: number): void;
  readonly signals: FieldSignals;
  /** how far the page scrolled since last asked, in px; carries the shards as parallax */
  takeScroll(): number;
  mood(): FieldMood;
  /** where on the source's one line, 0..1: on the site, where in time */
  place(): number;
  /** which of the four color schemes */
  edge(): DockEdge;
  /** a point the shatter point leans toward while `opened` lasts, in world units, or null */
  openPoint(): [number, number] | null;
  readonly flight: FieldFlight;
  /** once a frame: the rush drains */
  drain(dt: number): void;
  /** how much the portrait is wanted, 0..1; the field eases toward it */
  hello(): number;
  panes(): FieldPane[];
}

export type FieldPalette = (hour: number, valence: number, arousal: number, place?: { edge: DockEdge; year: number }) => { bg: Oklch; light: Oklch; dark: Oklch; crack: Oklch };

export type FieldTokens = {
  // the authored shape, with the three the schema defaults filled in
  shatter: ShatterTokens & Required<Pick<ShatterTokens, "glow" | "portrait" | "windowMask">>;
  motion: MotionTokens;
  color: { maskOutside: Oklch };
  dock: { refraction: DockTokens["refraction"] };
  fieldPalette: FieldPalette;
};

export type FieldOptions = {
  tokens: FieldTokens;
  source: FieldSource;
  seed?: number;
  simulateMusic?: boolean;
  paused?: boolean;
};
