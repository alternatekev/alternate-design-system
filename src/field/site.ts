// The site's field: the engine, handed the reader and the site's own tokens. This is the module
// alternate.org imports in place of its lib/air/field.ts; createField keeps that file's signature,
// so the swap is the import path and nothing else.
import { motion } from "../../tokens/motion";
import { presentational } from "../../tokens/profiles";
import { createField as createEngine, type FieldHandle } from "./engine";
import { readerSource } from "./reader";

export type { FieldHandle } from "./engine";
export { presentational };

export function createField(canvas: HTMLCanvasElement, opts: { seed?: number; simulateMusic?: boolean; paused?: boolean } = {}): FieldHandle | null {
  return createEngine(canvas, { ...opts, tokens: presentational, source: readerSource(motion.signals) });
}
