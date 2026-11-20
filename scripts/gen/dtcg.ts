// tokens.json: every token in the Design Tokens Community Group format, the neutral file any
// platform's tooling can read (Style Dictionary and its kin). This is the way in for the platforms
// that have no generator here yet: Windows, Linux, anything else.
//
// Colors are written as authored, in OKLCH, with a gamma-encoded sRGB hex beside them for tools that
// only take hex. A key ending in Ms or Sec is a duration. A list becomes a group keyed 0, 1, 2…,
// since the format has no arrays of tokens. Strings and booleans use "$type": "string" / "boolean",
// which the format does not define; a tool that minds can skip them.
import { toSrgb } from "../../src/color";
import type { Node } from "./tree";

const hex = (c: readonly [number, number, number]) => "#" + toSrgb(c).map((x) => Math.round(x * 255).toString(16).padStart(2, "0")).join("");

function emit(node: Node, key: string): unknown {
  switch (node.k) {
    case "group": return Object.fromEntries(Object.entries(node.children).map(([k, n]) => [k, emit(n, k)]));
    case "list": return Object.fromEntries(node.items.map((n, i) => [String(i), emit(n, key)]));
    case "color": return { $type: "color", $value: { colorSpace: "oklch", components: [...node.v] }, $extensions: { "org.alternate": { srgb: hex(node.v) } } };
    case "number":
      if (/Ms$/.test(key)) return { $type: "duration", $value: { value: node.v, unit: "ms" } };
      if (/Sec$/.test(key)) return { $type: "duration", $value: { value: node.v, unit: "s" } };
      return { $type: "number", $value: node.v };
    case "string": return { $type: "string", $value: node.v };
    case "bool": return { $type: "boolean", $value: node.v };
  }
}

export function dtcg(tree: Node, meta: { version: string }): string {
  const out = { $description: `alternate-design-system ${meta.version}. Generated from tokens/ by scripts/build.ts; edit the tokens, never this file.`, ...(emit(tree, "") as object) };
  return JSON.stringify(out, null, 2) + "\n";
}
