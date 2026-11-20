// An application's field: the engine, handed the app's data and the application profile.
// mountField() is the whole of it for a page: it makes the canvas, waits until the browser is idle
// and the device can afford it, starts the field and fades it in. The page is complete without it.
import { application } from "../../tokens/profiles";
import { dataSource, type DataSource } from "./data";
import { createField, type FieldHandle } from "./engine";
import type { FieldTokens } from "./source";

export { dataSource, type DataSource, type DataState } from "./data";
export { application, applicationDials, presentational, turnDown } from "../../tokens/profiles";
export { createField, type FieldHandle } from "./engine";
export type { FieldSource, FieldTokens } from "./source";

/** whether this device and this reader should get a field at all: the site's own test (app/air.tsx) */
export function fieldAllowed(): boolean {
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (conn?.saveData || matchMedia("(prefers-reduced-data: reduce)").matches) return false;
  const fine = matchMedia("(pointer: fine)").matches, wide = matchMedia("(min-width: 768px)").matches;
  const cores = navigator.hardwareConcurrency ?? 4, memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
  return fine && wide ? true : cores >= 4 && memory >= 3;
}

export type Mounted = { source: DataSource; readonly field: FieldHandle | null; destroy(): void };

/**
 * Puts the field behind a page. The canvas is fixed, behind everything, and never takes a pointer.
 * The source is returned at once, so the page can report its data before the field has started.
 */
export function mountField(opts: { tokens?: FieldTokens; source?: DataSource; seed?: number; parent?: HTMLElement } = {}): Mounted {
  const tokens = opts.tokens ?? application, source = opts.source ?? dataSource({ signals: tokens.motion.signals });
  let field: FieldHandle | null = null, canvas: HTMLCanvasElement | null = null, cancelled = false;
  const start = () => {
    if (cancelled || !fieldAllowed()) return;
    canvas = document.createElement("canvas");
    canvas.className = "air"; canvas.setAttribute("aria-hidden", "true");
    canvas.style.transitionDuration = `${tokens.motion.fieldFadeInMs}ms`;
    (opts.parent ?? document.body).prepend(canvas);
    field = createField(canvas, { tokens, source, seed: opts.seed });
    if (!field) { canvas.remove(); canvas = null; return; }
    // panels become glass once there is a field behind them (css/app.css, html[data-field])
    document.documentElement.dataset.field = "";
    // on the next frame, so the fade has an opacity to start from
    requestAnimationFrame(() => { if (canvas) canvas.dataset.on = ""; });
  };
  const idle = "requestIdleCallback" in window ? requestIdleCallback(start, { timeout: 2000 }) : (setTimeout(start, 800) as unknown as number);
  return {
    source,
    get field() { return field; },
    destroy() {
      cancelled = true;
      if ("cancelIdleCallback" in window) cancelIdleCallback(idle); else clearTimeout(idle);
      if (field) delete document.documentElement.dataset.field;
      field?.destroy(); canvas?.remove(); field = null; canvas = null;
    },
  };
}
