// The stylesheets the tokens become. The site's own custom properties are cssVariables() in
// tokens/index.ts, as the site has it. What is here is added for the application register.
import { cssVariables } from "../tokens";
import { app } from "../tokens/app";
import { color } from "../tokens/color";
import { faceStack, type, type Face } from "../tokens/type";
import { toCss } from "./color";

const px = (n: number) => `${n}px`;
const block = (vars: Record<string, string>) => `:root{${Object.entries(vars).map(([k, v]) => `${k}:${v}`).join(";")}}`;

/** the faces, as the site's stylesheet declares them: --face-pixel, --face-display, --face-text, --face-numeral */
export function faceVariables(): Record<string, string> {
  return Object.fromEntries((Object.keys(type.faces) as Face[]).map((f) => [`--face-${f}`, faceStack(f)]));
}

/** the application register's custom properties, beside the site's (which it also needs) */
export function appCssVariables(): string {
  const A = app, vars: Record<string, string> = {
    ...faceVariables(),
    "--panel": toCss(A.panel.bg),
    "--panel-border": toCss(A.panel.border),
    "--panel-radius": px(A.panel.radius),
    "--panel-gutter": px(A.panel.gutter),
    "--panel-pad": `${px(A.panel.pad[0])} ${px(A.panel.pad[1])}`,
    "--glass": toCss(color.ui.paper, A.glass.tintAlpha),
    "--glass-filter": `blur(${A.glass.blur}px) saturate(${A.glass.saturate})`,
  };
  for (const [k, v] of Object.entries(A.tone)) vars[`--tone-${k}`] = toCss(v);
  Object.assign(vars, {
    "--app-face-label": `var(--face-${A.face.label})`,
    "--app-face-body": `var(--face-${A.face.body})`,
    "--app-face-title": `var(--face-${A.face.title})`,
    "--app-face-numeral": `var(--face-${A.face.numeral})`,
    "--app-size-label": px(A.size.label),
    "--app-size-ui": px(A.size.ui),
    "--app-size-body": px(A.size.body),
    "--app-size-title": px(A.size.title),
    "--app-size-numeral": `clamp(${px(A.size.numeral[0])}, 2.4vw, ${px(A.size.numeral[1])})`,
    "--app-leading-ui": String(A.leading.ui),
    "--app-leading-body": String(A.leading.body),
    "--app-leading-title": String(A.leading.title),
    "--app-spacing-label": `${A.letterSpacing.label}em`,
    "--app-spacing-ui": `${A.letterSpacing.ui}em`,
    "--app-measure": px(A.page.measure),
    "--app-page-pad": `${px(A.page.pad[0])} ${px(A.page.pad[1])}`,
    "--app-card-min": px(A.cardMin),
  });
  return block(vars);
}

/** one stylesheet for an application: the site's properties, the register's, then the components */
export function appStylesheet(components: string): string {
  return `/* alternate-design-system: the application register. Generated from tokens/ by scripts/build.ts; edit css/app.css or the tokens, never this file. */\n${cssVariables()}\n${appCssVariables()}\n${components}`;
}
