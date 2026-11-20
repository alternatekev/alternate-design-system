import { z } from "zod";
import { Oklch } from "./schema";

// Schemas for the families that are new here: they are not on the site (yet), so they sit beside
// tokens/schema.ts, which stays as the site has it.

// ---------- type ----------
const FaceDef = z.object({ family: z.string().min(1), fallback: z.array(z.string().min(1)).min(1) });
export const TypeTokens = z.object({
  faces: z.object({ pixel: FaceDef, display: FaceDef, text: FaceDef, numeral: FaceDef }),
});
export type TypeTokens = z.input<typeof TypeTokens>;
const FaceName = z.enum(["pixel", "display", "text", "numeral"]);

// ---------- the application register ----------
export const AppTokens = z.object({
  panel: z.object({ bg: Oklch, border: Oklch, radius: z.number().min(0), gutter: z.number().min(0), pad: z.tuple([z.number().min(0), z.number().min(0)]) }),
  glass: z.object({ blur: z.number().min(4).max(40), saturate: z.number().min(1).max(2), tintAlpha: z.number().min(0).max(1) }),
  tone: z.object({ work: Oklch, needs: Oklch, ok: Oklch, bad: Oklch, quiet: Oklch }),
  face: z.object({ label: FaceName, body: FaceName, title: FaceName, numeral: FaceName }),
  size: z.object({ label: z.number().min(11), ui: z.number().min(11), body: z.number().min(11), title: z.number().min(11), numeral: z.tuple([z.number().positive(), z.number().positive()]) }), // px; nothing under 11, as the site's tests hold
  leading: z.object({ ui: z.number().min(1), body: z.number().min(1), title: z.number().min(0.9) }),
  letterSpacing: z.object({ label: z.number().min(0), ui: z.number().min(0) }), // em
  page: z.object({ measure: z.number().positive(), pad: z.tuple([z.number().min(0), z.number().min(0)]) }),
  cardMin: z.number().positive(),
});
export type AppTokens = z.input<typeof AppTokens>;

// ---------- field profiles ----------
// How far each part of the field is turned down from the site's, 0..1. 1 is the site.
export const FieldDials = z.object({
  shards: z.number().min(0.05).max(1), // how many pieces
  speed: z.number().min(0).max(1), // travel outward, spin, swirl and sink
  camera: z.number().min(0).max(1), // how far the signals move the camera and the focus
  light: z.number().min(0).max(1), // how far the signals move the key light, the highlights and the exposure
  presence: z.number().min(0).max(1), // opacity, rim light and the glow spilled into the dark
  portrait: z.number().min(0).max(1), // the site's own picture behind the glass
  refraction: z.boolean(), // the docks' fractured panes
});
export type FieldDials = z.input<typeof FieldDials>;
