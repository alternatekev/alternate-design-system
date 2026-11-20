// alternate-design-system 0.1.0. Generated from tokens/ by scripts/build.ts.
// Edit the tokens, never this file.

/// Every token, as the site and every other platform has it. Colors are OKLCH; see Oklch.swift.
public enum Tokens {
    public static let version = "0.1.0"
    public enum Color {
        public enum Ui {
            public static let paper: Oklch = Oklch(0.135, 0.012, 265)
            public static let ink: Oklch = Oklch(0.93, 0.008, 85)
            public static let quiet: Oklch = Oklch(0.8, 0.012, 260)
            public static let rule: Oklch = Oklch(0.3, 0.012, 260)
            public static let accent: Oklch = Oklch(0.86, 0.09, 205)
            public static let scrimAlpha: Double = 0.94
        }
        public static let maskOutside: Oklch = Oklch(0, 0, 0)
        public enum Phases {
            public static let dialup: Oklch = Oklch(0.66, 0.09, 252)
            public static let broadband: Oklch = Oklch(0.63, 0.25, 29)
            public static let apps: Oklch = Oklch(0.78, 0.15, 75)
            public static let components: Oklch = Oklch(0.66, 0.11, 180)
            public static let agents: Oklch = Oklch(0.6, 0.2, 290)
        }
        public enum Field {
            public struct TimeOfDayItem: Sendable, Equatable {
                public let hour: Double
                public let bg: Oklch
                public let tint: Oklch
            }
            public static let timeOfDay: [TimeOfDayItem] = [TimeOfDayItem(hour: 0, bg: Oklch(0.118, 0.017, 274), tint: Oklch(0.609, 0.114, 272)), TimeOfDayItem(hour: 5.5, bg: Oklch(0.131, 0.018, 293), tint: Oklch(0.606, 0.14, 302)), TimeOfDayItem(hour: 7.5, bg: Oklch(0.159, 0.017, 339), tint: Oklch(0.646, 0.128, 350)), TimeOfDayItem(hour: 12, bg: Oklch(0.18, 0.009, 258), tint: Oklch(0.685, 0.08, 240)), TimeOfDayItem(hour: 17.5, bg: Oklch(0.161, 0.016, 49), tint: Oklch(0.71, 0.083, 62)), TimeOfDayItem(hour: 20, bg: Oklch(0.134, 0.016, 313), tint: Oklch(0.638, 0.151, 317)), TimeOfDayItem(hour: 24, bg: Oklch(0.118, 0.017, 274), tint: Oklch(0.609, 0.114, 272))]
            public enum Mood {
                public static let warmHue: Double = 62
                public static let coolHue: Double = 250
                public enum Chroma {
                    public static let base: Double = 0.012
                    public static let valence: Double = 0.085
                    public static let arousal: Double = 0.03
                }
                public static let shardLight: Double = 0.76
                public static let shardDark: Double = 0.3
                public static let crackLight: Double = 0.8
                public static let crackChroma: Double = 0.13
                public static let tintIntoLight: Double = 0.18
                public static let tintIntoDark: Double = 0.25
                public static let moodIntoBg: Double = 0.12
            }
        }
        public enum Schemes {
            public struct SchemesItem: Sendable, Equatable {
                public let bg: Oklch
                public let tint: Oklch
            }
            public static let compass: [SchemesItem] = [SchemesItem(bg: Oklch(0.14, 0.012, 258), tint: Oklch(0.68, 0.08, 240)), SchemesItem(bg: Oklch(0.155, 0.018, 40), tint: Oklch(0.7, 0.1, 55)), SchemesItem(bg: Oklch(0.115, 0.016, 290), tint: Oklch(0.6, 0.13, 300)), SchemesItem(bg: Oklch(0.145, 0.018, 335), tint: Oklch(0.64, 0.13, 345))]
            public static let archive: [SchemesItem] = [SchemesItem(bg: Oklch(0.135, 0.016, 252), tint: Oklch(0.66, 0.09, 252)), SchemesItem(bg: Oklch(0.14, 0.02, 29), tint: Oklch(0.63, 0.18, 29)), SchemesItem(bg: Oklch(0.14, 0.016, 75), tint: Oklch(0.74, 0.13, 75)), SchemesItem(bg: Oklch(0.13, 0.016, 235), tint: Oklch(0.63, 0.13, 235))]
            public static let hueWheel: [SchemesItem] = [SchemesItem(bg: Oklch(0.135, 0.02, 0), tint: Oklch(0.66, 0.1, 0)), SchemesItem(bg: Oklch(0.135, 0.02, 90), tint: Oklch(0.66, 0.1, 90)), SchemesItem(bg: Oklch(0.135, 0.02, 180), tint: Oklch(0.66, 0.1, 180)), SchemesItem(bg: Oklch(0.135, 0.02, 270), tint: Oklch(0.66, 0.1, 270))]
            public static let warmCool: [SchemesItem] = [SchemesItem(bg: Oklch(0.135, 0.014, 250), tint: Oklch(0.66, 0.09, 250)), SchemesItem(bg: Oklch(0.138, 0.014, 156), tint: Oklch(0.68, 0.07, 156)), SchemesItem(bg: Oklch(0.14, 0.016, 62), tint: Oklch(0.72, 0.1, 62)), SchemesItem(bg: Oklch(0.138, 0.014, 156), tint: Oklch(0.68, 0.07, 156))]
        }
        public enum SchemeByEdge {
            public static let top: String = "compass"
            public static let right: String = "archive"
            public static let bottom: String = "hueWheel"
            public static let left: String = "warmCool"
        }
        public enum Matrix {
            public static let schemeIntoHour: Double = 0.75
        }
    }
    public enum Motion {
        public enum Springs {
            public static let quick: Double = 1.6
            public static let deliberate: Double = 2.6
            public static let slow: Double = 3.5
            public static let tidal: Double = 5
        }
        public enum Follow {
            public static let expand: String = "quick"
            public static let spin: String = "quick"
            public static let point: String = "slow"
            public static let count: String = "slow"
            public static let color: String = "slow"
            public static let dolly: String = "tidal"
            public static let pitch: String = "tidal"
            public static let yaw: String = "tidal"
            public static let camera: String = "tidal"
            public static let light: String = "tidal"
            public static let focus: String = "deliberate"
            public static let depthOfField: String = "deliberate"
            public static let keyLight: String = "deliberate"
            public static let specular: String = "deliberate"
            public static let exposure: String = "slow"
            public static let vignette: String = "slow"
        }
        public static let dockSnapMs: Double = 250
        public enum Zoom {
            public static let ms: Double = 1400
            public static let fill: Double = 0.72
            public static let read: Double = 0.3
            public static let near: Double = 0.16
            public static let close: Double = 0.22
            public static let edge: Double = 0.14
            public static let edgeSpeed: Double = 1100
        }
        public static let beginDropMs: Double = 900
        public static let crossfadeMs: Double = 2400
        public static let fieldFadeInMs: Double = 2500
        public enum Signals {
            public static let scrollFollowPerSec: Double = 4
            public static let selectFollowPerSec: Double = 1.5
            public static let openedDecaySec: Double = 7
            public static let lingerSec: Double = 14
            public static let pauseRampSec: [Double] = [4, 16]
        }
        public enum Reduced {
            public static let expand: Double = 0.15
            public static let spin: Double = 0
            public static let swirl: Double = 0
            public static let camera: Double = 0
            public static let parallax: Double = 0
        }
        public static let changingShareMax: Double = 0.34
        public enum Flight {
            public static let shapeSec: Double = 2.4
            public static let gatherSec: Double = 4
            public static let surgePerYear: Double = 0.35
            public static let surgeMax: Double = 2.6
            public static let surgeDecaySec: Double = 1.7
            public static let surgeSpeed: Double = 1.1
            public static let surgeSpin: Double = 0.8
            public static let pushSpeed: Double = 3.2
            public static let gatherScale: Double = 0.62
            public static let diveMs: Double = 2600
            public static let settleMs: Double = 260
            public static let yearScreens: Double = 1
            public static let depthPx: Double = 1100
        }
    }
    public enum Shatter {
        public static let patterns: [String] = ["impact", "glass", "splinter"]
        public static let shardsPerUnit: Double = 14
        public static let shardRange: [Double] = [260, 820]
        public enum Camera {
            public static let distance: Double = 5
            public static let fov: Double = 0.72
            public static let overscan: Double = 1.25
        }
        public static let preShatterDepth: [Double] = [-4.5, 1.5]
        public enum Source {
            public static let shape: String = "rectangle"
            public static let stops: [[Double]] = [[0, 0.95], [0.42, 0.55], [0.5, 0.23], [0.58, 0.6], [1, 0.91]]
        }
        public enum MoodShift {
            public static let tension: Double = 0.25
            public static let openedCapped: Double = 0.15
            public static let pause: Double = -0.25
        }
        public enum Stillness {
            public static let linger: Double = 0.35
            public static let select: Double = 0.6
            public static let pause: Double = 0.5
        }
        public enum Dynamics {
            public enum Expand {
                public static let base: Double = 0.012
                public static let arousal: Double = 0.07
                public static let energy: Double = 0.0042
                public static let energyArousal: Double = 0.0245
                public static let scroll: Double = 0.16
                public static let opened: Double = 0.05
                public static let tension: Double = 0.03
                public static let slowed: Bool = true
            }
            public enum Spin {
                public static let base: Double = 0.04
                public static let arousal2: Double = 0.45
                public static let scroll: Double = 0.9
                public static let opened: Double = 0.2
                public static let slowed: Bool = true
            }
            public enum Depth {
                public static let base: Double = 0.3
                public static let arousal: Double = 1.3
                public static let scrollFrac: Double = 0.4
            }
            public enum Swirl {
                public static let base: Double = 0.02
                public static let negative: Double = 0.22
                public static let arousal: Double = 0.05
                public static let slowed: Bool = true
            }
            public enum Sink {
                public static let negative: Double = 0.04
            }
            public enum Count {
                public static let base: Double = 0.42
                public static let arousal: Double = 0.58
            }
            public enum Gap {
                public static let base: Double = 0.01
                public static let arousal: Double = 0.06
            }
            public enum Rim {
                public static let base: Double = 0.3
                public static let arousal: Double = 0.5
                public static let select: Double = 0.35
            }
            public enum Opacity {
                public static let base: Double = 0.4
                public static let arousal: Double = 0.5
            }
            public enum OpacityVariance {
                public static let base: Double = 0.25
                public static let calm: Double = 0.6
            }
            public enum Dolly {
                public static let base: Double = 5
                public static let linger: Double = -0.9
                public static let select: Double = -0.45
                public static let pause: Double = 0.35
                public static let scrollFrac: Double = -0.25
            }
            public enum Pitch {
                public static let base: Double = -0.04
                public static let scrollFrac: Double = 0.08
                public static let tension: Double = 0.02
            }
            public enum Yaw {
                public static let valence: Double = 0.03
            }
            public enum FocusOffset {
                public static let linger: Double = -1.4
                public static let select: Double = -1.9
                public static let pause: Double = 0.6
            }
            public enum DepthOfField {
                public static let base: Double = 0.06
                public static let calm: Double = 0.16
                public static let linger: Double = 0.2
                public static let select: Double = 0.3
            }
            public enum KeyLight {
                public static let base: Double = 0.65
                public static let arousal: Double = 0.35
                public static let openedCapped: Double = 0.4
            }
            public enum Specular {
                public static let base: Double = 0.6
                public static let tension: Double = 0.5
                public static let openedCapped: Double = 0.6
            }
            public enum Exposure {
                public static let base: Double = 0.88
                public static let arousal: Double = 0.22
                public static let pause: Double = -0.18
                public static let openedCapped: Double = 0.08
            }
            public enum Vignette {
                public static let base: Double = 0.45
                public static let linger: Double = 0.35
                public static let pause: Double = 0.25
                public static let select: Double = 0.2
            }
        }
        public static let windowMask: Bool = true
        public enum Glow {
            public static let amount: Double = 0.22
            public static let blur: Double = 4.5
        }
        public enum Portrait {
            public static let src: String = "/hello/portrait.webp"
            public static let amount: Double = 0.75
            public static let height: Double = 0.86
            public static let right: Double = 0.06
            public static let easeSec: Double = 0.8
            public static let soft: Double = 6
            public static let keep: Double = 0.08
            public static let fracture: Double = 0.3
            public static let `catch`: Double = 0.85
        }
        public static let tiers: [String] = ["read", "inhabit"]
    }
    public enum Dock {
        public static let thickness: Double = 48
        public static let thicknessCoarse: Double = 56
        public static let inset: Double = 8
        public static let gap: Double = 16
        public static let reach: Double = 120
        public static let stub: Double = 150
        public enum NavStart {
            public static let edge: String = "bottom"
            public static let t: Double = 1
        }
        public static let navMaxLength: Double = 560
        public static let navEdges: [String] = ["top", "bottom"]
        public static let visualizerReach: Double = 0.12
        public static let helloSpan: Double = 2
        public static let timelineScrollMs: Double = 1600
        public static let stops: [Double] = [0, 0.5, 1]
        public static let keyStep: Double = 0.05
        public static let dragStartPx: Double = 4
        public static let followSec: Double = 0.06
        public enum Grip {
            public static let hit: Double = 40
            public static let lines: [Double] = [9, 12]
            public static let lineSpacing: Double = 4
            public static let lineWidth: Double = 1
        }
        public enum Refraction {
            public static let on: Bool = true
            public static let cell: Double = 24
            public static let shift: [Double] = [3, 10]
            public static let hoverGain: Double = 1.2
            public static let hoverFloor: Double = 0.03
            public static let hoverSec: Double = 0.35
        }
        public enum Typing {
            public static let charMs: Double = 60
            public static let eraseMs: Double = 25
            public static let holdMs: Double = 3200
            public static let gapMs: Double = 900
            public static let pauseMs: Double = 8000
            public static let blinkMs: Double = 1060
            public static let revealSteps: Double = 16
            public static let popoverPace: Double = 0.35
            public static let longChars: Double = 24
        }
        public enum Glass {
            public static let blur: Double = 20
            public static let saturate: Double = 1.4
            public static let tintAlpha: Double = 0.6
        }
        public enum Look {
            public static let lineAlpha: Double = 0.45
            public static let gripAlpha: Double = 0.5
            public static let ghostAlpha: Double = 0.35
            public static let liftedOpacity: Double = 0.5
            public static let ghostFadeMs: Double = 120
            public static let borderWidth: Double = 1
        }
    }
    public enum Sound {
        public struct VoicingsItem: Sendable, Equatable {
            public let name: String
            public let steps: [Double]
        }
        public struct JetsItem: Sendable, Equatable {
            public let voice: String
            public let oct: Double
            public let shape: String
            public let envMode: String
            public let trigger: String
            public let capture: Double
        }
        public struct BoardsItem: Sendable, Equatable {
            public let name: String
            public let fl: Double
            public let cc: Double
            public let jt: Double
            public let size: Double
            public let tone: Double
            public let ccMix: Double
            public let jtMix: Double
            public let sonar: Double
            public let pre: Double
            public let dim: Double
            public let jets: JetsItem
        }
        public static let bpm: Double = 48
        public enum Modes {
            public static let lydian: [Double] = [0, 2, 4, 6, 7, 9, 11]
            public static let ionian: [Double] = [0, 2, 4, 5, 7, 9, 11]
            public static let mixolydian: [Double] = [0, 2, 4, 5, 7, 9, 10]
        }
        public enum ModeWeights {
            public static let lydian: Double = 0.45
            public static let ionian: Double = 0.3
            public static let mixolydian: Double = 0.25
        }
        public static let voicings: [VoicingsItem] = [VoicingsItem(name: "add9", steps: [4, 8, 9]), VoicingsItem(name: "6/9", steps: [5, 8, 11]), VoicingsItem(name: "maj7", steps: [4, 6, 9]), VoicingsItem(name: "sus2", steps: [1, 4, 8])]
        public enum Register {
            public static let lowestRoot: Double = 29
            public static let highestRoot: Double = 40
        }
        public static let boards: [BoardsItem] = [BoardsItem(name: "low", fl: 1, cc: 0.5, jt: 0.5, size: 0.75, tone: 0.6, ccMix: 0.6, jtMix: 0.8, sonar: 0.55, pre: 0.6, dim: 0.35, jets: JetsItem(voice: "blur", oct: 0, shape: "sine", envMode: "repeat", trigger: "poly", capture: 0.22)), BoardsItem(name: "mid", fl: 1.5, cc: 1, jt: 1, size: 0.9, tone: 1, ccMix: 1, jtMix: 1, sonar: 0.75, pre: 0.8, dim: 0.5, jets: JetsItem(voice: "swell", oct: 0, shape: "rampUp", envMode: "repeat", trigger: "poly", capture: 0.18)), BoardsItem(name: "air", fl: 2, cc: 1.5, jt: 2, size: 1, tone: 1.6, ccMix: 1, jtMix: 1, sonar: 1, pre: 1, dim: 0.45, jets: JetsItem(voice: "blur", oct: 1, shape: "triangle", envMode: "repeat", trigger: "poly", capture: 0.25))]
        public enum Phases {
            public enum Dialup {
                public static let fathom: String = "lofi"
                public enum Voice {
                    public static let wave: String = "square"
                    public static let loud: Double = 0.2
                    public static let drive: Double = 0.25
                }
                public enum Pedals {
                    public static let flMix: Double = 0.8
                    public static let flRate: Double = 0.5
                    public static let flDepth: Double = 0.004
                    public static let flFb: Double = 0.6
                    public static let ccMix: Double = 0.5
                    public static let ccTime: Double = 0.12
                    public static let ccFb: Double = 0.35
                    public static let ccMod: Double = 0.0005
                    public static let jtMix: Double = 0
                    public static let jtRate: Double = 4
                    public static let jtDepth: Double = 0.6
                    public static let faMix: Double = 0.72
                    public static let faTone: Double = 2025
                    public static let faSize: Double = 0.35
                    public static let cut: Double = 1015
                }
            }
            public enum Broadband {
                public static let fathom: String = "plate"
                public enum Voice {
                    public static let wave: String = "square"
                    public static let loud: Double = 0.2
                    public static let drive: Double = 0.25
                }
                public enum Pedals {
                    public static let flMix: Double = 0.55
                    public static let flRate: Double = 0.35
                    public static let flDepth: Double = 0.003
                    public static let flFb: Double = 0.48
                    public static let ccMix: Double = 0.55
                    public static let ccTime: Double = 0.21
                    public static let ccFb: Double = 0.42
                    public static let ccMod: Double = 0.001
                    public static let jtMix: Double = 0
                    public static let jtRate: Double = 3
                    public static let jtDepth: Double = 0.55
                    public static let faMix: Double = 0.8
                    public static let faTone: Double = 2565
                    public static let faSize: Double = 0.5
                    public static let cut: Double = 1450
                }
            }
            public enum Apps {
                public static let fathom: String = "plate"
                public enum Voice {
                    public static let wave: String = "triangle"
                    public static let loud: Double = 1
                    public static let drive: Double = 0
                }
                public enum Pedals {
                    public static let flMix: Double = 0.3
                    public static let flRate: Double = 0.2
                    public static let flDepth: Double = 0.0025
                    public static let flFb: Double = 0.35
                    public static let ccMix: Double = 0.6
                    public static let ccTime: Double = 0.3
                    public static let ccFb: Double = 0.5
                    public static let ccMod: Double = 0.0015
                    public static let jtMix: Double = 0
                    public static let jtRate: Double = 2
                    public static let jtDepth: Double = 0.5
                    public static let faMix: Double = 0.88
                    public static let faTone: Double = 3105
                    public static let faSize: Double = 0.65
                    public static let cut: Double = 1885
                }
            }
            public enum Components {
                public static let fathom: String = "hall"
                public enum Voice {
                    public static let wave: String = "sawtooth"
                    public static let loud: Double = 0.26
                    public static let drive: Double = 0
                }
                public enum Pedals {
                    public static let flMix: Double = 0.15
                    public static let flRate: Double = 0.1
                    public static let flDepth: Double = 0.002
                    public static let flFb: Double = 0.25
                    public static let ccMix: Double = 0.5
                    public static let ccTime: Double = 0.35
                    public static let ccFb: Double = 0.55
                    public static let ccMod: Double = 0.002
                    public static let jtMix: Double = 0.6
                    public static let jtRate: Double = 4
                    public static let jtDepth: Double = 0.75
                    public static let faMix: Double = 0.88
                    public static let faTone: Double = 2700
                    public static let faSize: Double = 0.7
                    public static let cut: Double = 1450
                }
            }
            public enum Agents {
                public static let fathom: String = "sonar"
                public enum Voice {
                    public static let wave: String = "sine"
                    public static let loud: Double = 1
                    public static let drive: Double = 0
                }
                public enum Pedals {
                    public static let flMix: Double = 0.2
                    public static let flRate: Double = 0.07
                    public static let flDepth: Double = 0.003
                    public static let flFb: Double = 0.4
                    public static let ccMix: Double = 0.55
                    public static let ccTime: Double = 0.4
                    public static let ccFb: Double = 0.62
                    public static let ccMod: Double = 0.0025
                    public static let jtMix: Double = 0.3
                    public static let jtRate: Double = 0.5
                    public static let jtDepth: Double = 0.5
                    public static let faMix: Double = 1
                    public static let faTone: Double = 4590
                    public static let faSize: Double = 1
                    public static let cut: Double = 2610
                }
            }
        }
        public enum Drone {
            public static let breathBeats: Double = 32
            public static let level: Double = 0.03
            public static let surgeLevel: Double = 0.01
        }
        public enum Swells {
            public static let everySec: [Double] = [16, 36]
            public static let bloomSec: Double = 4
            public static let level: Double = 0.022
        }
        public enum Drift {
            public static let everyChords: [Double] = [5, 8]
            public static let dissonance: Double = 0.15
        }
        public enum Surge {
            public static let decadeIsFull: Double = 8
            public static let decaySec: Double = 3
            public static let keyChangeYears: Double = 6
            public static let feedback: Double = 0.15
            public static let reverb: Double = 0.1
            public static let brightness: Double = 1500
            public static let freezeAt: Double = 0.85
            public static let duck: Double = 0.5
            public static let attackFloor: Double = 1.5
            public static let quicken: Double = 0.4
        }
        public enum Leveler {
            public static let thresholdDb: Double = -30
            public static let kneeDb: Double = 12
            public static let ratio: Double = 8
            public static let attackSec: Double = 0.05
            public static let releaseSec: Double = 0.6
        }
        public static let calmAtRest: Double = 0.5
        public static let masterLevel: Double = 0.04
    }
    public enum Chart {
        public enum Panel {
            public static let bg: Oklch = Oklch(0.17625000000000002, 0.012, 263.75)
            public static let border: Oklch = Oklch(0.3, 0.012, 260)
            public static let radius: Double = 4
            public static let gutter: Double = 6
            public static let pad: [Double] = [12, 14]
        }
        public static let series: Oklch = Oklch(0.92, 0.07, 198)
        public static let exception: Oklch = Oklch(0.8, 0.11, 24)
        public static let better: Oklch = Oklch(0.8, 0.17, 155)
        public static let worse: Oklch = Oklch(0.64, 0.2, 24)
        public static let headline: Oklch = Oklch(0.88, 0.17, 95)
        public static let label: Oklch = Oklch(0.68, 0.012, 260)
        public static let numeral: Oklch = Oklch(0.93, 0.008, 85)
        public enum Hairline {
            public static let color: Oklch = Oklch(0.3, 0.012, 260)
            public static let width: Double = 1
        }
        public enum Face {
            public static let label: String = "pixel"
            public static let numeral: String = "numeral"
        }
        public enum Size {
            public static let label: Double = 11
            public static let numeral: [Double] = [22, 30]
            public static let ends: Double = 11
        }
        public enum LetterSpacing {
            public static let label: Double = 0.08
            public static let numeral: Double = 0
        }
        public enum Bar {
            public static let width: Double = 2
            public static let step: Double = 4
        }
        public enum Strip {
            public static let height: Double = 48
            public static let tall: Double = 96
        }
    }
    public enum Typography {
        public enum Faces {
            public enum Pixel {
                public static let family: String = "argent-pixel-cf"
                public static let fallback: [String] = ["ui-sans-serif", "system-ui", "sans-serif"]
            }
            public enum Display {
                public static let family: String = "le-monde-livre-classic-byol"
                public static let fallback: [String] = ["ui-serif", "Georgia", "serif"]
            }
            public enum Text {
                public static let family: String = "le-monde-livre-classic-byol"
                public static let fallback: [String] = ["ui-serif", "Georgia", "serif"]
            }
            public enum Numeral {
                public static let family: String = "trade-gothic-next-condensed"
                public static let fallback: [String] = ["Arial Narrow", "ui-sans-serif", "system-ui", "sans-serif"]
            }
        }
    }
    public enum App {
        public enum Panel {
            public static let bg: Oklch = Oklch(0.17625000000000002, 0.012, 263.75)
            public static let border: Oklch = Oklch(0.3, 0.012, 260)
            public static let radius: Double = 4
            public static let gutter: Double = 6
            public static let pad: [Double] = [12, 14]
        }
        public enum Glass {
            public static let blur: Double = 20
            public static let saturate: Double = 1.4
            public static let tintAlpha: Double = 0.6
        }
        public enum Tone {
            public static let work: Oklch = Oklch(0.92, 0.07, 198)
            public static let needs: Oklch = Oklch(0.88, 0.17, 95)
            public static let ok: Oklch = Oklch(0.8, 0.17, 155)
            public static let bad: Oklch = Oklch(0.64, 0.2, 24)
            public static let quiet: Oklch = Oklch(0.68, 0.012, 260)
        }
        public enum Face {
            public static let label: String = "pixel"
            public static let body: String = "pixel"
            public static let title: String = "display"
            public static let numeral: String = "numeral"
        }
        public enum Size {
            public static let label: Double = 11
            public static let ui: Double = 13
            public static let body: Double = 15
            public static let title: Double = 24
            public static let numeral: [Double] = [22, 30]
        }
        public enum Leading {
            public static let ui: Double = 1.5
            public static let body: Double = 1.55
            public static let title: Double = 1.15
        }
        public enum LetterSpacing {
            public static let label: Double = 0.08
            public static let ui: Double = 0.02
        }
        public enum Page {
            public static let measure: Double = 1180
            public static let pad: [Double] = [20, 16]
        }
        public static let cardMin: Double = 300
    }
    public enum Field {
        public enum Application {
            public enum Dials {
                public static let shards: Double = 0.45
                public static let speed: Double = 0.5
                public static let camera: Double = 0.25
                public static let light: Double = 0.6
                public static let presence: Double = 0.7
                public static let portrait: Double = 0
                public static let refraction: Bool = false
            }
            public enum Shatter {
                public static let patterns: [String] = ["impact", "glass", "splinter"]
                public static let shardsPerUnit: Double = 6.3
                public static let shardRange: [Double] = [117, 369]
                public enum Camera {
                    public static let distance: Double = 5
                    public static let fov: Double = 0.72
                    public static let overscan: Double = 1.25
                }
                public static let preShatterDepth: [Double] = [-4.5, 1.5]
                public enum Source {
                    public static let shape: String = "rectangle"
                    public static let stops: [[Double]] = [[0, 0.95], [0.42, 0.55], [0.5, 0.23], [0.58, 0.6], [1, 0.91]]
                }
                public enum MoodShift {
                    public static let tension: Double = 0.25
                    public static let openedCapped: Double = 0.15
                    public static let pause: Double = -0.25
                }
                public enum Stillness {
                    public static let linger: Double = 0.35
                    public static let select: Double = 0.6
                    public static let pause: Double = 0.5
                }
                public enum Dynamics {
                    public enum Expand {
                        public static let base: Double = 0.006
                        public static let arousal: Double = 0.035
                        public static let energy: Double = 0.0021
                        public static let energyArousal: Double = 0.01225
                        public static let scroll: Double = 0.08
                        public static let opened: Double = 0.025
                        public static let tension: Double = 0.015
                        public static let slowed: Bool = true
                    }
                    public enum Spin {
                        public static let base: Double = 0.02
                        public static let arousal2: Double = 0.225
                        public static let scroll: Double = 0.45
                        public static let opened: Double = 0.1
                        public static let slowed: Bool = true
                    }
                    public enum Depth {
                        public static let base: Double = 0.3
                        public static let arousal: Double = 1.3
                        public static let scrollFrac: Double = 0.4
                    }
                    public enum Swirl {
                        public static let base: Double = 0.01
                        public static let negative: Double = 0.11
                        public static let arousal: Double = 0.025
                        public static let slowed: Bool = true
                    }
                    public enum Sink {
                        public static let negative: Double = 0.02
                    }
                    public enum Count {
                        public static let base: Double = 0.42
                        public static let arousal: Double = 0.58
                    }
                    public enum Gap {
                        public static let base: Double = 0.01
                        public static let arousal: Double = 0.06
                    }
                    public enum Rim {
                        public static let base: Double = 0.21
                        public static let arousal: Double = 0.35
                        public static let select: Double = 0.24499999999999997
                    }
                    public enum Opacity {
                        public static let base: Double = 0.27999999999999997
                        public static let arousal: Double = 0.35
                    }
                    public enum OpacityVariance {
                        public static let base: Double = 0.25
                        public static let calm: Double = 0.6
                    }
                    public enum Dolly {
                        public static let base: Double = 5
                        public static let linger: Double = -0.225
                        public static let select: Double = -0.1125
                        public static let pause: Double = 0.0875
                        public static let scrollFrac: Double = -0.0625
                    }
                    public enum Pitch {
                        public static let base: Double = -0.04
                        public static let scrollFrac: Double = 0.02
                        public static let tension: Double = 0.005
                    }
                    public enum Yaw {
                        public static let valence: Double = 0.0075
                    }
                    public enum FocusOffset {
                        public static let linger: Double = -0.35
                        public static let select: Double = -0.475
                        public static let pause: Double = 0.15
                    }
                    public enum DepthOfField {
                        public static let base: Double = 0.06
                        public static let calm: Double = 0.16
                        public static let linger: Double = 0.2
                        public static let select: Double = 0.3
                    }
                    public enum KeyLight {
                        public static let base: Double = 0.65
                        public static let arousal: Double = 0.21
                        public static let openedCapped: Double = 0.24
                    }
                    public enum Specular {
                        public static let base: Double = 0.6
                        public static let tension: Double = 0.3
                        public static let openedCapped: Double = 0.36
                    }
                    public enum Exposure {
                        public static let base: Double = 0.88
                        public static let arousal: Double = 0.132
                        public static let pause: Double = -0.108
                        public static let openedCapped: Double = 0.048
                    }
                    public enum Vignette {
                        public static let base: Double = 0.45
                        public static let linger: Double = 0.35
                        public static let pause: Double = 0.25
                        public static let select: Double = 0.2
                    }
                }
                public static let windowMask: Bool = true
                public enum Glow {
                    public static let amount: Double = 0.154
                    public static let blur: Double = 4.5
                }
                public enum Portrait {
                    public static let src: String = "/hello/portrait.webp"
                    public static let amount: Double = 0
                    public static let height: Double = 0.86
                    public static let right: Double = 0.06
                    public static let easeSec: Double = 0.8
                    public static let soft: Double = 6
                    public static let keep: Double = 0.08
                    public static let fracture: Double = 0.3
                    public static let `catch`: Double = 0.85
                }
                public static let tiers: [String] = ["read", "inhabit"]
            }
        }
    }
}
