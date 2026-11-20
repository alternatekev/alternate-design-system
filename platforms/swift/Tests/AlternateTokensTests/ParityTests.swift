// Swift against TypeScript: the same tokens must give the same colors on every platform.
import XCTest
@testable import AlternateTokens

final class ParityTests: XCTestCase {
    func testThePaletteIsTheOneTypeScriptMakes() {
        XCTAssertGreaterThan(paletteGolden.count, 20)
        for s in paletteGolden {
            let p = FieldPalette.palette(hour: s.hour, valence: s.valence, arousal: s.arousal, edge: s.edge, year: s.year)
            for (name, ours, theirs) in [("bg", p.bg, s.bg), ("light", p.light, s.light), ("dark", p.dark, s.dark), ("crack", p.crack, s.crack)] {
                let at = "\(name) at hour \(s.hour), valence \(s.valence), arousal \(s.arousal), \(s.edge), year \(s.year)"
                XCTAssertEqual(ours.l, theirs[0], accuracy: 1e-12, at)
                XCTAssertEqual(ours.c, theirs[1], accuracy: 1e-12, at)
                XCTAssertEqual(ours.h, theirs[2], accuracy: 1e-9, at)
            }
        }
    }

    func testAColorIsTheSameColor() {
        XCTAssertGreaterThan(colorGolden.count, 10)
        for s in colorGolden {
            let v = s.oklch.srgb
            XCTAssertEqual(v.r, s.srgb[0], accuracy: 1e-12); XCTAssertEqual(v.g, s.srgb[1], accuracy: 1e-12); XCTAssertEqual(v.b, s.srgb[2], accuracy: 1e-12)
            XCTAssertEqual(s.oklch.luminance, s.luminance, accuracy: 1e-12)
        }
    }

    func testTheTokensArrived() {
        XCTAssertEqual(Tokens.Color.Ui.paper, Oklch(0.135, 0.012, 265))
        XCTAssertEqual(Tokens.Motion.Springs.tidal, 5)
        XCTAssertEqual(Tokens.App.Tone.needs, Tokens.Chart.headline)
        XCTAssertFalse(Tokens.Field.Application.Dials.refraction)
        XCTAssertLessThan(Tokens.Field.Application.Shatter.shardsPerUnit, Tokens.Shatter.shardsPerUnit)
    }
}
