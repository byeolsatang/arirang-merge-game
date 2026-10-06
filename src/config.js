import theme from "../themes/arirang-base.js";

export function applyThemeToDocument() {
  document.title = theme.title;
  document.getElementById("theme-title").textContent = theme.title;
  document.getElementById("theme-kicker").textContent = theme.kicker;
  document.getElementById("theme-description").textContent = theme.description;

  const root = document.documentElement;
  const c = theme.colors;
  root.style.setProperty("--bg", c.background);
  root.style.setProperty("--panel", c.panel);
  root.style.setProperty("--panel-2", c.panel2);
  root.style.setProperty("--text", c.text);
  root.style.setProperty("--muted", c.muted);
  root.style.setProperty("--accent", c.accent);
}

export function getMergeEffect(level) {
  return theme.mergeEffects[level] || theme.mergeEffects.default;
}

export default theme;
