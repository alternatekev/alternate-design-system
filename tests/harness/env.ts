// A browser, as far as the field can tell: a page of beats that scrolls, docks, a clock, frames on
// demand, and a WebGL context that draws nothing and writes down every call it is given.
//
// Two fields given the same page, the same clock and the same events must make the same GL calls
// with the same numbers. If they do, they draw the same pixels: the shaders are among the calls.
// That is how tests/field.parity.test.ts holds the engine here to the site's own field.

export type Call = string;
type Listener = (e: any) => void;

const fnv = (bytes: Uint8Array) => { let h = 0x811c9dc5; for (let i = 0; i < bytes.length; i++) { h ^= bytes[i]; h = Math.imul(h, 0x01000193); } return (h >>> 0).toString(16); };

export type PageSpec = {
  width: number; height: number; dpr: number;
  coarse?: boolean; reducedMotion?: boolean;
  /** local time the field wakes up to */
  clock: string;
  beats: { key?: string; welcome?: boolean; valence: number; arousal: number; x?: number; y?: number; top: number; height: number }[];
  docks: { id: string; edge?: string; p?: string; left: number; top: number; width: number; height: number }[];
  order?: "newest-first" | "oldest-first";
};

class Target {
  listeners = new Map<string, Set<Listener>>();
  addEventListener = (t: string, fn: Listener) => { (this.listeners.get(t) ?? this.listeners.set(t, new Set()).get(t)!).add(fn); };
  removeEventListener = (t: string, fn: Listener) => { this.listeners.get(t)?.delete(fn); };
  dispatch(t: string, e: any = {}) { for (const fn of [...(this.listeners.get(t) ?? [])]) fn(e); }
  count() { let n = 0; for (const s of this.listeners.values()) n += s.size; return n; }
}

// listeners outlive a page on purpose: the site's lib/time.ts wires its scroll listener once per
// module, as it does in a browser tab, and each field under test has its own copy of that module
const win = new Target(), doc = new Target();
const RealDate = Date;

export function installPage(spec: PageSpec) {
  const g = globalThis as any;
  const log: Call[] = [];
  let now = 1000, rafId = 0, objects = 0;
  const frames = new Map<number, (t: number) => void>();
  const state = { scrollY: 0, selection: "", hidden: false, width: spec.width, height: spec.height };
  const images: any[] = [];

  // ----- the GL context: records, returns just enough to keep the field going -----
  const tag = (kind: string) => ({ __gl: `${kind}#${++objects}` });
  const show = (a: any): string => {
    if (a == null) return String(a);
    if (typeof a === "number") return Object.is(a, -0) ? "-0" : String(a);
    if (typeof a === "string" || typeof a === "boolean") return JSON.stringify(a);
    if (ArrayBuffer.isView(a)) return `${a.constructor.name}(${(a as any).length})@${fnv(new Uint8Array(a.buffer, a.byteOffset, a.byteLength))}`;
    if (Array.isArray(a)) return `[${a.map(show).join(",")}]`;
    if (a.__gl) return a.__gl;
    if (a.__canvas2d) return "canvas2d";
    if (a.__image) return `image(${a.src})`;
    return "{…}";
  };
  const attribs = new Map<any, Map<string, number>>();
  const gl: any = new Proxy({}, {
    get(_t, name: string) {
      if (typeof name !== "string") return undefined;
      if (/^[A-Z][A-Z0-9_]*$/.test(name)) return `gl.${name}`; // a constant: its name stands for its value
      return (...args: any[]) => {
        log.push(`${name}(${args.map(show).join(", ")})`);
        switch (name) {
          case "createShader": case "createProgram": case "createBuffer": case "createTexture": case "createFramebuffer": return tag(name.slice(6));
          case "getShaderParameter": case "getProgramParameter": return true;
          case "getShaderInfoLog": case "getProgramInfoLog": return "";
          case "getUniformLocation": return { __gl: `uniform:${args[1]}@${args[0].__gl}` };
          case "getAttribLocation": { const m = attribs.get(args[0]) ?? attribs.set(args[0], new Map()).get(args[0])!; if (!m.has(args[1])) m.set(args[1], m.size); return m.get(args[1]); }
          case "getExtension": return args[0] === "WEBGL_lose_context" ? { loseContext() { log.push("loseContext()"); } } : {};
          default: return undefined;
        }
      };
    },
  });

  // ----- the page -----
  const rectOf = (top: number, left: number, width: number, height: number) => ({ top, left, width, height, bottom: top + height, right: left + width });
  class HTMLDetailsElement { open = true; box = rectOf(0, 0, 0, 0); getBoundingClientRect() { return this.box; } }
  const beats = spec.beats.map((b) => ({
    dataset: { valence: String(b.valence), arousal: String(b.arousal), ...(b.x == null ? {} : { x: String(b.x) }), ...(b.y == null ? {} : { y: String(b.y) }), ...(b.key ? { key: b.key } : {}) } as Record<string, string>,
    welcome: !!b.welcome, offsetTop: b.top, offsetHeight: b.height, open: false,
    getBoundingClientRect() { return rectOf(b.top - state.scrollY, 0, state.width, b.height); },
    querySelector(sel: string) { if (sel !== "details[open]") throw new Error(`beat.querySelector(${sel})`); return this.open ? {} : null; },
  }));
  const docks = spec.docks.map((d) => ({
    dataset: { dock: d.id, ...(d.edge ? { edge: d.edge } : {}), ...(d.p ? { p: d.p } : {}) } as Record<string, string>,
    hover: false, box: rectOf(d.top, d.left, d.width, d.height),
    getBoundingClientRect() { return this.box; },
    hasAttribute(n: string) { if (n !== "data-hover") throw new Error(`dock.hasAttribute(${n})`); return this.hover; },
  }));
  const queries: Record<string, () => any[]> = {
    "[data-valence]": () => beats,
    ".beat[data-key], .stop[data-key]": () => beats.filter((b) => b.dataset.key),
    ".beats, .stops": () => [{ getAttribute: (n: string) => (n === "data-order" ? spec.order ?? "oldest-first" : null) }],
    '.dock[data-dock="nav"]': () => docks.filter((d) => d.dataset.dock === "nav"),
    ".dock": () => docks,
    ".beat.welcome": () => beats.filter((b) => b.welcome),
  };
  const all = (sel: string) => { const q = queries[sel]; if (!q) throw new Error(`the page was asked for ${sel}, which the harness does not know`); return q(); };

  const canvas: any = {
    width: 0, height: 0, dataset: {},
    get clientWidth() { return state.width; }, get clientHeight() { return state.height; },
    getContext(kind: string) { if (kind !== "webgl") throw new Error(`getContext(${kind})`); return gl; },
  };
  const canvas2d = () => ({
    __canvas2d: true, width: 0, height: 0,
    getContext: () => new Proxy({}, { get: (_t, n) => (n === "createLinearGradient" ? () => ({ addColorStop() {} }) : () => undefined), set: () => true }),
  });

  g.document = {
    addEventListener: doc.addEventListener, removeEventListener: doc.removeEventListener,
    get hidden() { return state.hidden; }, body: {},
    documentElement: { get clientWidth() { return state.width; }, get clientHeight() { return state.height; } },
    createElement(tagName: string) { if (tagName !== "canvas") throw new Error(`createElement(${tagName})`); return canvas2d(); },
    querySelectorAll: all, querySelector: (sel: string) => all(sel)[0] ?? null,
  };
  g.window = g;
  g.addEventListener = win.addEventListener; g.removeEventListener = win.removeEventListener;
  Object.defineProperty(g, "scrollY", { get: () => state.scrollY, configurable: true });
  Object.defineProperty(g, "innerHeight", { get: () => state.height, configurable: true });
  Object.defineProperty(g, "innerWidth", { get: () => state.width, configurable: true });
  g.devicePixelRatio = spec.dpr;
  g.matchMedia = (q: string) => {
    if (q === "(prefers-reduced-motion: reduce)") return { matches: !!spec.reducedMotion };
    if (q === "(pointer: coarse)") return { matches: !!spec.coarse };
    if (q === "(pointer: coarse) and (max-width: 767px)") return { matches: !!spec.coarse && state.width <= 767 };
    throw new Error(`matchMedia(${q})`);
  };
  g.getSelection = () => ({ toString: () => state.selection });
  g.MutationObserver = class { observe() {} disconnect() {} };
  g.HTMLDetailsElement = HTMLDetailsElement;
  g.Image = class { __image = true; src = ""; decoding = ""; onload: null | (() => void) = null; naturalWidth = 0; naturalHeight = 0; constructor() { images.push(this); } };
  g.requestAnimationFrame = (fn: (t: number) => void) => { frames.set(++rafId, fn); return rafId; };
  g.cancelAnimationFrame = (id: number) => { frames.delete(id); };
  Object.defineProperty(g, "performance", { value: { now: () => now }, configurable: true, writable: true });
  const wake = new RealDate(spec.clock).getTime(), t0 = now;
  g.Date = class extends RealDate { constructor(...a: any[]) { if (a.length) super(...(a as [any])); else super(wake + (now - t0)); } static now() { return wake + (now - t0); } };

  return {
    canvas, log, state, beats, docks, images, HTMLDetailsElement,
    /** one frame, `ms` later: every callback waiting on requestAnimationFrame runs once */
    frame(ms = 1000 / 60) { now += ms; const due = [...frames.values()]; frames.clear(); for (const fn of due) fn(now); },
    advance(ms: number) { now += ms; },
    scrollTo(y: number) { state.scrollY = y; win.dispatch("scroll"); },
    fire(type: string) { win.dispatch(type); },
    select(text: string) { state.selection = text; doc.dispatch("selectionchange"); },
    toggle(d: InstanceType<typeof HTMLDetailsElement>) { doc.dispatch("toggle", { target: d }); },
    resize(width: number, height: number) { state.width = width; state.height = height; win.dispatch("resize"); },
    hide(hidden: boolean) { state.hidden = hidden; doc.dispatch("visibilitychange"); },
    listeners: () => ({ window: win.count(), document: doc.count() }),
    restore() { g.Date = RealDate; },
  };
}
export type Page = ReturnType<typeof installPage>;
