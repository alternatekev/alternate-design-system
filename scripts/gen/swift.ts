// Tokens.generated.swift: every token as Swift, for iOS, tvOS and macOS (and, being plain Swift
// with no Apple framework in it, Linux and Windows). Groups become nested enums of static lets; a
// list of groups becomes an array of a struct made for it. Colors stay OKLCH (Oklch.swift turns
// them into what a platform draws with), so a blend on a native platform is the blend the site makes.
import type { Node } from "./tree";

const RESERVED = new Set(["in", "is", "as", "do", "if", "for", "let", "var", "nil", "try", "case", "else", "enum", "func", "init", "self", "true", "false", "break", "catch", "class", "defer", "guard", "inout", "super", "throw", "where", "while", "import", "public", "repeat", "return", "static", "struct", "switch", "default", "private", "operator", "protocol", "subscript", "extension", "internal", "continue", "Type", "Self", "Protocol"]);
const ident = (key: string) => { const s = /^[A-Za-z_][A-Za-z0-9_]*$/.test(key) ? key : "_" + key.replace(/[^A-Za-z0-9_]/g, "_"); return RESERVED.has(s) ? `\`${s}\`` : s; };
// a few names Swift keeps for itself as type names (`Tokens.Type` would be the metatype)
const TYPE_NAMES: Record<string, string> = { Type: "Typography", Self: "Itself", Protocol: "Protocols" };
const Upper = (key: string) => { const s = ident(key).replace(/`/g, ""), T = s[0].toUpperCase() + s.slice(1); return TYPE_NAMES[T] ?? T; };
const num = (v: number) => (Number.isInteger(v) ? `${v}` : `${v}`);
const str = (v: string) => JSON.stringify(v);

type Ctx = { structs: string[]; pad: string };

/** the Swift type of a node; a list's element struct is declared into ctx.structs under `name` */
function typeOf(node: Node, name: string, ctx: Ctx): string {
  switch (node.k) {
    case "color": return "Oklch";
    case "number": return "Double";
    case "string": return "String";
    case "bool": return "Bool";
    case "list": {
      if (!node.items.length) throw new Error(`tokens: ${name} is an empty list; Swift cannot tell what it holds`);
      const types = node.items.map((n) => typeOf(n, name, { structs: [], pad: ctx.pad }));
      if (new Set(types).size > 1) throw new Error(`tokens: ${name} mixes ${[...new Set(types)].join(" and ")}; give it one kind`);
      return `[${typeOf(node.items[0], name, ctx)}]`;
    }
    case "group": {
      const T = `${Upper(name)}Item`;
      if (!ctx.structs.some((s) => s.includes(`struct ${T}:`))) {
        // a struct inside a struct is declared beside it, not within, so both are in scope by name
        const fields = Object.entries(node.children).map(([k, n]) => `${ctx.pad}    public let ${ident(k)}: ${typeOf(n, k, ctx)}`);
        ctx.structs.push([`${ctx.pad}public struct ${T}: Sendable, Equatable {`, ...fields, `${ctx.pad}}`].join("\n"));
      }
      return T;
    }
  }
}
/** a node as a Swift expression */
function value(node: Node, name: string): string {
  switch (node.k) {
    case "color": return `Oklch(${node.v.map(num).join(", ")})`;
    case "number": return num(node.v);
    case "string": return str(node.v);
    case "bool": return String(node.v);
    case "list": return `[${node.items.map((n) => value(n, name)).join(", ")}]`;
    case "group": return `${Upper(name)}Item(${Object.entries(node.children).map(([k, n]) => `${ident(k).replace(/`/g, "")}: ${value(n, k)}`).join(", ")})`;
  }
}
// a list of groups must agree on its keys, or the one struct cannot hold them all
function uniform(node: Node, at: string) {
  if (node.k === "list" && node.items[0]?.k === "group") {
    const keys = (n: Node) => (n.k === "group" ? Object.keys(n.children).join(",") : "");
    for (const n of node.items) if (keys(n) !== keys(node.items[0])) throw new Error(`tokens: the items of ${at} do not all have the same keys`);
  }
  if (node.k === "group") for (const [k, n] of Object.entries(node.children)) uniform(n, `${at}.${k}`);
  if (node.k === "list") node.items.forEach((n, i) => uniform(n, `${at}[${i}]`));
}

// the shape of a list's items, when they are groups: lists that share it share a struct
const shape = (n: Node): string | null => (n.k === "list" && n.items[0]?.k === "group" ? JSON.stringify(Object.entries(n.items[0].children).map(([k, c]) => [k, c.k])) : null);

function group(name: string, node: Extract<Node, { k: "group" }>, pad: string): string {
  const ctx: Ctx = { structs: [], pad: pad + "    " }, lines: string[] = [];
  const shapes = Object.values(node.children).map(shape).filter(Boolean);
  for (const [k, n] of Object.entries(node.children)) {
    // sibling lists of the same shape (the four color schemes) are one type, named for the group
    const seed = shape(n) && shapes.filter((s) => s === shape(n)).length > 1 ? name : k;
    if (n.k === "group") lines.push(group(k, n, pad + "    "));
    else lines.push(`${pad}    public static let ${ident(k)}: ${typeOf(n, seed, ctx)} = ${value(n, seed)}`);
  }
  return [`${pad}public enum ${Upper(name)} {`, ...ctx.structs, ...lines, `${pad}}`].join("\n");
}

export function swift(tree: Node, meta: { version: string }): string {
  if (tree.k !== "group") throw new Error("tokens: the tree's root is a group");
  uniform(tree, "tokens");
  const families = Object.entries(tree.children).map(([k, n]) => { if (n.k !== "group") throw new Error(`tokens: ${k} is not a group`); return group(k, n, "    "); });
  return `// alternate-design-system ${meta.version}. Generated from tokens/ by scripts/build.ts.
// Edit the tokens, never this file.

/// Every token, as the site and every other platform has it. Colors are OKLCH; see Oklch.swift.
public enum Tokens {
    public static let version = ${str(meta.version)}
${families.join("\n")}
}
`;
}

/** a few of the field's palettes worked out here, for the Swift port of the palette to be held to */
export function swiftGolden(samples: { hour: number; valence: number; arousal: number; edge: string; year: number; out: Record<"bg" | "light" | "dark" | "crack", readonly number[]> }[], colors: { oklch: readonly number[]; srgb: readonly number[]; luminance: number }[]): string {
  const row = (s: (typeof samples)[number]) => `    .init(hour: ${num(s.hour)}, valence: ${num(s.valence)}, arousal: ${num(s.arousal)}, edge: .${s.edge}, year: ${num(s.year)}, bg: [${s.out.bg.join(", ")}], light: [${s.out.light.join(", ")}], dark: [${s.out.dark.join(", ")}], crack: [${s.out.crack.join(", ")}]),`;
  return `// Generated from tokens/ by scripts/build.ts: what fieldPalette() returns in TypeScript, for
// FieldPalette.swift to be held to. Edit the tokens, never this file.
@testable import AlternateTokens

struct PaletteSample { let hour, valence, arousal: Double; let edge: FieldEdge; let year: Double; let bg, light, dark, crack: [Double] }
let paletteGolden: [PaletteSample] = [
${samples.map(row).join("\n")}
]

// what the color math returns in TypeScript for the same colors: gamma-encoded sRGB, and luminance
struct ColorSample { let oklch: Oklch; let srgb: [Double]; let luminance: Double }
let colorGolden: [ColorSample] = [
${colors.map((c) => `    .init(oklch: Oklch(${c.oklch.join(", ")}), srgb: [${c.srgb.join(", ")}], luminance: ${c.luminance}),`).join("\n")}
]
`;
}
