export default {
  id: "arirang-base",
  title: "ARIRANG Merge Game",
  kicker: "ARIRANG WORLD TOUR",
  description: "画像・音・文字・合成演出をテーマごとに差し替えるためのベース。",
  colors: {
    background: "#0e0b12",
    panel: "#17111f",
    panel2: "#22182c",
    text: "#f8f4ff",
    muted: "#b8adbf",
    accent: "#caa8ff"
  },

  // asset に画像URLを入れると、その画像を円形に描画します。
  // 空なら emoji / label を表示するので、素材がまだなくてもゲームを試せます。
  levels: [
    { label: "01", emoji: "✨", asset: "", radius: 18, score: 1 },
    { label: "02", emoji: "💜", asset: "", radius: 23, score: 3 },
    { label: "03", emoji: "🎤", asset: "", radius: 29, score: 6 },
    { label: "04", emoji: "🔥", asset: "", radius: 36, score: 10 },
    { label: "05", emoji: "😹", asset: "", radius: 44, score: 15 },
    { label: "06", emoji: "🕺", asset: "", radius: 53, score: 21 },
    { label: "07", emoji: "🎹", asset: "", radius: 63, score: 28 },
    { label: "08", emoji: "💥", asset: "", radius: 75, score: 36 },
    { label: "09", emoji: "👑", asset: "", radius: 88, score: 45 },
    { label: "10", emoji: "🌟", asset: "", radius: 102, score: 55 },
    { label: "LEGEND", emoji: "🏆", asset: "", radius: 118, score: 100 }
  ],

  spawn: {
    minLevel: 0,
    maxLevel: 4
  },

  // level は「合成後のレベル」。あとでテーマごとに好きな言葉・派手さへ変更できます。
  mergeEffects: {
    default: {
      text: "MERGE!",
      particles: 12,
      particleEmoji: "💜",
      flash: false,
      shake: 0,
      sound: ""
    },
    3: { text: "ㅋㅋㅋ", particles: 16, particleEmoji: "✨", flash: false, shake: 0, sound: "" },
    5: { text: "WHAT?!", particles: 22, particleEmoji: "💜", flash: true, shake: 1, sound: "" },
    7: { text: "ICONIC", particles: 30, particleEmoji: "🔥", flash: true, shake: 1, sound: "" },
    9: { text: "LEGEND", particles: 42, particleEmoji: "🌟", flash: true, shake: 2, sound: "" },
    10:{ text: "LEGENDARY", particles: 60, particleEmoji: "💜", flash: true, shake: 3, sound: "" }
  },

  audio: {
    enabled: true,
    drop: "",
    mergeDefault: "",
    gameOver: ""
  }
};
