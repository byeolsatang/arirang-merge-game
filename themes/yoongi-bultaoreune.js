export default {
  id: "yoongi-bultaoreune",
  title: "YOONGI 불타오르네",
  kicker: "ARIRANG WORLD TOUR",
  description: "ユンギの「불타오르네🔥」な瞬間を育ててLEGENDへ。",
  colors: {
    background: "#0c0a0f",
    panel: "#17121c",
    panel2: "#25172b",
    text: "#fff8ff",
    muted: "#c4b5c9",
    accent: "#ff6b8f"
  },

  levels: [
    { label: "spark", emoji: "🐱", asset: "", radius: 18, score: 1 },
    { label: "hmm", emoji: "😼", asset: "", radius: 23, score: 3 },
    { label: "heat", emoji: "🔥", asset: "", radius: 29, score: 6 },
    { label: "mic", emoji: "🎤", asset: "", radius: 36, score: 10 },
    { label: "look", emoji: "😎", asset: "", radius: 44, score: 15 },
    { label: "stage", emoji: "🖤", asset: "", radius: 53, score: 21 },
    { label: "burn", emoji: "🔥", asset: "", radius: 63, score: 28 },
    { label: "agustd", emoji: "⚡", asset: "", radius: 75, score: 36 },
    { label: "crowd", emoji: "💥", asset: "", radius: 88, score: 45 },
    { label: "iconic", emoji: "👑", asset: "", radius: 102, score: 55 },
    { label: "legend", emoji: "🏆", asset: "", radius: 118, score: 100 }
  ],

  spawn: { minLevel: 0, maxLevel: 4 },

  mergeEffects: {
    default: { text: "🔥", particles: 14, particleEmoji: "🔥", flash: false, shake: 0, sound: "" },
    2: { text: "불타!", particles: 18, particleEmoji: "🔥", flash: false, shake: 0, sound: "" },
    3: { text: "오르네!", particles: 22, particleEmoji: "✨", flash: false, shake: 0, sound: "" },
    4: { text: "YOONGI!", particles: 26, particleEmoji: "💜", flash: true, shake: 1, sound: "" },
    5: { text: "HOTTER", particles: 30, particleEmoji: "🔥", flash: true, shake: 1, sound: "" },
    6: { text: "🔥🔥🔥", particles: 34, particleEmoji: "🔥", flash: true, shake: 1, sound: "" },
    7: { text: "AGUST D", particles: 40, particleEmoji: "⚡", flash: true, shake: 2, sound: "" },
    8: { text: "NO WAY", particles: 46, particleEmoji: "💥", flash: true, shake: 2, sound: "" },
    9: { text: "ICONIC", particles: 54, particleEmoji: "✨", flash: true, shake: 3, sound: "" },
    10:{ text: "LEGENDARY", particles: 70, particleEmoji: "🔥", flash: true, shake: 3, sound: "" }
  },

  audio: { enabled: true, drop: "", mergeDefault: "", gameOver: "" }
};
