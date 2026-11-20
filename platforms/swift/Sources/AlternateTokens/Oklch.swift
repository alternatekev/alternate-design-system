// OKLCH, the space the tokens are authored in, and the conversions out of it. A port of
// src/color.ts, line for line, so a color and a blend here are the ones the site makes.
// OKLCH is perceptually even: a blend halfway between two colors looks halfway, with no muddy or
// over-bright middle. Math: Björn Ottosson, "A perceptual color space for image processing" (2020).
#if canImport(Foundation)
import Foundation
#endif

public struct Oklch: Sendable, Equatable, Hashable {
    public let l: Double, c: Double, h: Double
    public init(_ l: Double, _ c: Double, _ h: Double) { self.l = l; self.c = c; self.h = h }

    /// Linear-light sRGB, each 0...1: what a shader lights in.
    public var linear: (r: Double, g: Double, b: Double) {
        let rad = h * Double.pi / 180
        let a = c * cos(rad), b = c * sin(rad)
        let l3 = pow(l + 0.3963377774 * a + 0.2158037573 * b, 3)
        let m3 = pow(l - 0.1055613458 * a - 0.0638541728 * b, 3)
        let s3 = pow(l - 0.0894841775 * a - 1.291485548 * b, 3)
        let clamp = { (x: Double) in min(1, max(0, x)) }
        return (clamp(4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3),
                clamp(-1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3),
                clamp(-0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3))
    }

    /// Gamma-encoded sRGB, each 0...1: what a screen is handed.
    public var srgb: (r: Double, g: Double, b: Double) {
        let encode = { (x: Double) in x <= 0.0031308 ? 12.92 * x : 1.055 * pow(x, 1 / 2.4) - 0.055 }
        let v = linear
        return (encode(v.r), encode(v.g), encode(v.b))
    }

    /// Relative luminance (WCAG).
    public var luminance: Double { let v = linear; return 0.2126 * v.r + 0.7152 * v.g + 0.0722 * v.b }

    /// WCAG contrast between two luminances.
    public static func contrast(_ y1: Double, _ y2: Double) -> Double { (max(y1, y2) + 0.05) / (min(y1, y2) + 0.05) }

    /// Blend toward another color, hue along the shorter arc. An achromatic end takes the other's hue.
    public func mix(_ other: Oklch, _ t: Double) -> Oklch {
        var ha = h, hb = other.h
        if c < 0.002 { ha = hb }
        if other.c < 0.002 { hb = ha }
        let dh = (hb - ha + 540).truncatingRemainder(dividingBy: 360) - 180
        return Oklch(l + (other.l - l) * t, c + (other.c - c) * t, (ha + dh * t + 360).truncatingRemainder(dividingBy: 360))
    }
}

#if canImport(SwiftUI)
import SwiftUI

@available(iOS 13, tvOS 13, macOS 10.15, watchOS 6, *)
public extension Oklch {
    /// The color, for SwiftUI.
    var color: Color { color(opacity: 1) }
    func color(opacity: Double) -> Color { let v = srgb; return Color(.sRGB, red: v.r, green: v.g, blue: v.b, opacity: opacity) }
}
#endif
