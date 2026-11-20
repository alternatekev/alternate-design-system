import type { TypeTokens } from "./schema.app";

// The faces. On the site these are four custom properties at the top of app/globals.css; they are
// the same four here, as data, so a platform with no stylesheet can read them. The site's audit
// (Oct 16) found type to be the one family with no tokens. This is the start of it: the faces
// only. The site's own sizes stay in its stylesheet until Kevin sets a scale.
// Argent Pixel CF and Le Monde Livre Classic are Kevin's choices; Trade Gothic Next Condensed is
// the racing HUD's condensed face, for numerals (Kevin, Oct 18). All three come from his Adobe
// Fonts kit, which each app links for itself; where a face cannot load, the fallbacks stand in.
export const type = {
  faces: {
    pixel: { family: "argent-pixel-cf", fallback: ["ui-sans-serif", "system-ui", "sans-serif"] },
    display: { family: "le-monde-livre-classic-byol", fallback: ["ui-serif", "Georgia", "serif"] },
    text: { family: "le-monde-livre-classic-byol", fallback: ["ui-serif", "Georgia", "serif"] },
    numeral: { family: "trade-gothic-next-condensed", fallback: ["Arial Narrow", "ui-sans-serif", "system-ui", "sans-serif"] },
  },
} satisfies TypeTokens;

export type Face = keyof typeof type.faces;

/** a face as a CSS font-family list: the value of the site's --face-* custom property */
export function faceStack(face: Face): string {
  const f = type.faces[face], q = (n: string) => (/[\s]/.test(n) || n === f.family ? `"${n}"` : n);
  return [f.family, ...f.fallback].map(q).join(", ");
}
