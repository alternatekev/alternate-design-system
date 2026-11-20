// The tokens as a tree a generator can walk: groups, lists, and leaves that know what they are.
// A triple of numbers is a color only where the schema says so (dock.stops is three numbers and
// is not one), so the tree is built from each family's value and its zod schema together.
import type { ZodType } from "zod";
import type { Oklch as OklchValue } from "../../src/color";
import { application, applicationDials } from "../../tokens/profiles";
import { app } from "../../tokens/app";
import { chart, color, dock, motion, shatter, sound } from "../../tokens";
import { matrix, schemeByEdge, schemes } from "../../tokens/color";
import { ChartTokens, ColorTokens, DockTokens, MotionTokens, Oklch, ShatterTokens, SoundTokens } from "../../tokens/schema";
import { AppTokens, FieldDials, TypeTokens } from "../../tokens/schema.app";
import { type } from "../../tokens/type";

export type Node =
  | { k: "group"; children: Record<string, Node> }
  | { k: "list"; items: Node[] }
  | { k: "color"; v: OklchValue }
  | { k: "number"; v: number }
  | { k: "string"; v: string }
  | { k: "bool"; v: boolean };

const def = (s: any) => s?._zod?.def ?? s?.def;

export function walk(value: unknown, schema: ZodType | undefined, at: string): Node {
  if (schema === Oklch) return { k: "color", v: value as OklchValue };
  const d = def(schema);
  if (d && (d.type === "default" || d.type === "optional" || d.type === "nullable")) return walk(value, d.innerType, at);
  if (Array.isArray(value)) {
    const item = (i: number) => (d?.type === "tuple" ? d.items[i] : d?.type === "array" ? d.element : undefined);
    return { k: "list", items: value.map((v, i) => walk(v, item(i), `${at}[${i}]`)) };
  }
  if (value && typeof value === "object") {
    const child = (key: string) => (d?.type === "object" ? d.shape[key] : d?.type === "record" ? d.valueType : undefined);
    const children: Record<string, Node> = {};
    for (const [key, v] of Object.entries(value)) if (v !== undefined) children[key] = walk(v, child(key), `${at}.${key}`);
    return { k: "group", children };
  }
  if (typeof value === "number") return { k: "number", v: value };
  if (typeof value === "string") return { k: "string", v: value };
  if (typeof value === "boolean") return { k: "bool", v: value };
  throw new Error(`tokens: ${at} is ${value === null ? "null" : typeof value}, which no platform can carry`);
}

const scheme = (stops: readonly { bg: OklchValue; tint: OklchValue }[]): Node => ({ k: "list", items: stops.map((s) => ({ k: "group", children: { bg: { k: "color", v: s.bg }, tint: { k: "color", v: s.tint } } })) });

/** every family, in the order the files read. `field.application` is the application profile worked
 *  out (tokens/profiles.ts), so a platform that draws the field needs no copy of the dials' arithmetic. */
export function tokenTree(): Node {
  const g = (children: Record<string, Node>): Node => ({ k: "group", children });
  const colorTree = walk(color, ColorTokens, "color") as Extract<Node, { k: "group" }>;
  // the color matrix sits beside `color` in tokens/color.ts, outside its schema: the four schemes,
  // which edge picks which, and how far a scheme outweighs the hour
  colorTree.children.schemes = g(Object.fromEntries(Object.entries(schemes).map(([name, stops]) => [name, scheme(stops)])));
  colorTree.children.schemeByEdge = g(Object.fromEntries(Object.entries(schemeByEdge).map(([edge, name]) => [edge, { k: "string", v: name } as Node])));
  colorTree.children.matrix = g(Object.fromEntries(Object.entries(matrix).map(([k, v]) => [k, { k: "number", v } as Node])));
  return g({
    color: colorTree,
    motion: walk(motion, MotionTokens, "motion"),
    shatter: walk(shatter, ShatterTokens, "shatter"),
    dock: walk(dock, DockTokens, "dock"),
    sound: walk(sound, SoundTokens, "sound"),
    chart: walk(chart, ChartTokens, "chart"),
    type: walk(type, TypeTokens, "type"),
    app: walk(app, AppTokens, "app"),
    field: g({ application: g({ dials: walk(applicationDials, FieldDials, "field.application.dials"), shatter: walk(application.shatter, ShatterTokens, "field.application.shatter") }) }),
  });
}
