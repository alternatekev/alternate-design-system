// swift-tools-version: 5.9
// alternate-design-system for Swift: the tokens, the color math and the field's palette, for iOS,
// tvOS and macOS. Plain Swift apart from one SwiftUI extension, so it builds on Linux and Windows
// too. The Swift under platforms/swift is generated from tokens/ (npm run build) and committed.
import PackageDescription

let package = Package(
    name: "alternate-design-system",
    platforms: [.iOS(.v15), .tvOS(.v15), .macOS(.v12), .watchOS(.v8)],
    products: [.library(name: "AlternateTokens", targets: ["AlternateTokens"])],
    targets: [
        .target(name: "AlternateTokens", path: "platforms/swift/Sources/AlternateTokens"),
        .testTarget(name: "AlternateTokensTests", dependencies: ["AlternateTokens"], path: "platforms/swift/Tests/AlternateTokensTests"),
    ]
)
