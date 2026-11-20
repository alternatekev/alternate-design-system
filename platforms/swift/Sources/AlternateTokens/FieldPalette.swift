// The field's palette: a port of timeOfDay(), schemeAt() and fieldPalette() in tokens/color.ts,
// reading the same tokens. The field has no color of its own: everything here comes from the
// clock, from where the app is on its own line, and from its mood. A native screen that can't run
// the field itself can still take its ground and its light from here and sit in the same world.
// The tests hold this to what the TypeScript returns (PaletteGolden.generated.swift).

/// Which of the four color schemes: on the site, the edge the nav is docked to.
public enum FieldEdge: String, Sendable, CaseIterable { case top, right, bottom, left }

public enum FieldPalette {
    public struct Stop: Sendable, Equatable { public let bg: Oklch, tint: Oklch }
    public struct Palette: Sendable, Equatable { public let bg: Oklch, light: Oklch, dark: Oklch, crack: Oklch }

    static func smooth(_ t: Double) -> Double { t * t * (3 - 2 * t) }

    /// The hour's light: background and tint, blended between the stops.
    public static func timeOfDay(_ hour: Double) -> Stop {
        let stops = Tokens.Color.Field.timeOfDay
        let h = (hour.truncatingRemainder(dividingBy: 24) + 24).truncatingRemainder(dividingBy: 24)
        for i in 0..<(stops.count - 1) {
            let a = stops[i], b = stops[i + 1]
            if h >= a.hour && h <= b.hour {
                let t = smooth((h - a.hour) / max(1e-6, b.hour - a.hour))
                return Stop(bg: a.bg.mix(b.bg, t), tint: a.tint.mix(b.tint, t))
            }
        }
        return Stop(bg: stops[0].bg, tint: stops[0].tint)
    }

    static func scheme(_ edge: FieldEdge) -> [Tokens.Color.Schemes.SchemesItem] {
        let by = Tokens.Color.SchemeByEdge.self
        let name: String
        switch edge { case .top: name = by.top; case .right: name = by.right; case .bottom: name = by.bottom; case .left: name = by.left }
        let s = Tokens.Color.Schemes.self
        switch name { case "archive": return s.archive; case "hueWheel": return s.hueWheel; case "warmCool": return s.warmCool; default: return s.compass }
    }

    /// A scheme's background and tint at a point on its line, 0...1.
    public static func schemeAt(_ edge: FieldEdge, _ year: Double) -> Stop {
        let stops = scheme(edge)
        let f = min(1, max(0, year)) * Double(stops.count - 1)
        let i = min(stops.count - 2, Int(f.rounded(.down)))
        let t = f - Double(i)
        return Stop(bg: stops[i].bg.mix(stops[i + 1].bg, t), tint: stops[i].tint.mix(stops[i + 1].tint, t))
    }

    /// The palette for an hour, a mood and a place.
    ///   valence -1...1: warm when bright, cool when dark · arousal 0...1: more chroma, more light
    public static func palette(hour: Double, valence: Double, arousal: Double, edge: FieldEdge = .top, year: Double = 0) -> Palette {
        let m = Tokens.Color.Field.Mood.self
        let tod = timeOfDay(hour), sch = schemeAt(edge, year), w = Tokens.Color.Matrix.schemeIntoHour
        let bgBase = tod.bg.mix(sch.bg, w), tint = tod.tint.mix(sch.tint, w)
        let hue = tint.h
        let c = (m.Chroma.base + m.Chroma.valence * abs(valence) + m.Chroma.arousal * arousal) * (tint.c / 0.1)
        let light = Oklch(m.shardLight, c, hue).mix(tint, m.tintIntoLight)
        let darkTint = Oklch(tint.l * 0.3, tint.c * 0.3, tint.h)
        let dark = Oklch(m.shardDark + 0.05 * arousal, c * 0.8, hue + 16).mix(darkTint, m.tintIntoDark)
        let crack = Oklch(m.crackLight + 0.08 * arousal, min(0.37, c + m.crackChroma), hue - 6)
        let bg = bgBase.mix(dark, m.moodIntoBg)
        return Palette(bg: bg, light: light, dark: dark, crack: crack)
    }
}
