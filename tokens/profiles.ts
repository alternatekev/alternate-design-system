import { color, fieldPalette } from "./color";
import { dock } from "./dock";
import { motion } from "./motion";
import { shatter } from "./shatter";
import type { Linear, ShatterTokens } from "./schema";
import type { FieldDials } from "./schema.app";
import type { FieldTokens } from "../src/field/source";

// Field profiles. A profile is everything the field is tuned by (FieldTokens). There is one field,
// the site's; an application's is that same field turned down, not a second design. So a profile
// other than the site's is written as dials on the site's numbers, never as numbers of its own:
// retune the site and every profile follows, and nothing can drift into a different-looking thing.

/** the site's own: tokens/ as they stand. The field alternate.org runs. */
export const presentational: FieldTokens = { shatter, motion, color: { maskOutside: color.maskOutside }, dock: { refraction: dock.refraction }, fieldPalette };

const SIGNAL_KEYS = (lin: Linear) => Object.keys(lin).filter((k) => k !== "base" && k !== "slowed") as (keyof Linear)[];
/** every coefficient of a dynamic, its base too */
const whole = (lin: Linear, by: number): Linear => { const o: Record<string, unknown> = { ...lin }; if (lin.base != null) o.base = lin.base * by; for (const k of SIGNAL_KEYS(lin)) o[k] = (lin[k] as number) * by; return o as Linear; };
/** only how far the signals move it; where it rests stays */
const swing = (lin: Linear, by: number): Linear => { const o: Record<string, unknown> = { ...lin }; for (const k of SIGNAL_KEYS(lin)) o[k] = (lin[k] as number) * by; return o as Linear; };

/** a profile turned down from another by dials (tokens/schema.app.ts says what each one turns) */
export function turnDown(from: FieldTokens, d: FieldDials): FieldTokens {
  const s = from.shatter, D = s.dynamics as ShatterTokens["dynamics"];
  return {
    ...from,
    shatter: {
      ...s,
      shardsPerUnit: s.shardsPerUnit * d.shards,
      shardRange: [Math.round(s.shardRange[0] * d.shards), Math.round(s.shardRange[1] * d.shards)],
      dynamics: {
        ...D,
        expand: whole(D.expand, d.speed), spin: whole(D.spin, d.speed), swirl: whole(D.swirl, d.speed), sink: whole(D.sink, d.speed),
        dolly: swing(D.dolly, d.camera), pitch: swing(D.pitch, d.camera), yaw: whole(D.yaw, d.camera), focusOffset: whole(D.focusOffset, d.camera),
        keyLight: swing(D.keyLight, d.light), specular: swing(D.specular, d.light), exposure: swing(D.exposure, d.light),
        opacity: whole(D.opacity, d.presence), rim: whole(D.rim, d.presence),
      },
      glow: { ...s.glow, amount: s.glow.amount * d.presence },
      portrait: { ...s.portrait, amount: s.portrait.amount * d.portrait },
    },
    dock: { refraction: { ...from.dock.refraction, on: from.dock.refraction.on && d.refraction } },
  };
}

// The application's field: fewer pieces, moving at half the pace, a camera that barely answers,
// light that rises less when something happens, the whole of it sitting further back. No portrait
// (that is the site's own) and no fractured panes (an application has no docks). First sketch,
// every dial Kevin's to turn; nothing has been tuned by eye yet.
export const applicationDials = { shards: 0.45, speed: 0.5, camera: 0.25, light: 0.6, presence: 0.7, portrait: 0, refraction: false } satisfies FieldDials;
export const application: FieldTokens = turnDown(presentational, applicationDials);
