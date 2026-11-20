import { chart } from "./chart";
import { dock } from "./dock";
import type { AppTokens } from "./schema.app";

// The application register: the same system, set for working in rather than reading through.
//
// The site is presentational. Its text is small until you dive into it, its field fills the
// view, its one transition is type itself. An application is read at one size, all at once,
// all day. So this register takes what the site already settled for its densest material and
// uses it for everything: the panel is the charts' card, which is the racing HUD's (Kevin,
// Oct 18); words are set as the site sets its controls and everything you have dived into, in the
// pixel face; numbers in the HUD's condensed numerals; and over a running field a panel is the
// docks' frosted glass (Kevin, Oct 16), so the field still glows through.
//
// Nothing here is a new color. Every value is one the site has, or a size the site already sets
// type at, named for the job it does in an application. Each is a first proposal and Kevin's call.
export const app = {
  // the card: the charts' panel, as it is
  panel: { bg: chart.panel.bg, border: chart.panel.border, radius: chart.panel.radius, gutter: chart.panel.gutter, pad: chart.panel.pad },
  // over a running field the card is a pane of the docks' glass
  glass: { blur: dock.glass.blur, saturate: dock.glass.saturate, tintAlpha: dock.glass.tintAlpha },
  // what a thing's state is, in the charts' data ink: the normal series for work under way, the
  // headline yellow for what waits on you, the two deltas for what went right and wrong, and the
  // label's quiet for what is at rest
  tone: { work: chart.series, needs: chart.headline, ok: chart.better, bad: chart.worse, quiet: chart.label },
  // which face sets what: labels and words in the pixel face, as the docks and every dived-into
  // piece are; titles in the display face; numbers in the numerals
  face: { label: "pixel", body: "pixel", title: "display", numeral: "numeral" },
  // px. Each is a size the site sets type at today: the charts' label, the docks' words, the work
  // page's heads, the work page's titles (1.5rem), and the charts' numerals as a [min, max] clamp
  size: { label: chart.size.label, ui: 13, body: 15, title: 24, numeral: chart.size.numeral },
  leading: { ui: 1.5, body: 1.55, title: 1.15 },
  // em: the charts' label tracking, and the pixel face's everywhere else
  letterSpacing: { label: chart.letterSpacing.label, ui: 0.02 },
  // px: the widest a page of panels runs, and its padding, block then inline
  page: { measure: 1180, pad: [20, 16] },
  // the least a tiled card is wide before the row wraps, px
  cardMin: 300,
} satisfies AppTokens;
