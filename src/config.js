import { themes, getThemeById } from "../themes/index.js";

const params = new URLSearchParams(window.location.search);
const requestedTheme = params.get("theme") || localStorage.getItem("arirang-merge-theme") || themes[0].id;
const theme = getThemeById(requestedTheme);

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

export function mountThemeSelector(select) {
  select.innerHTML = "";
  themes.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = item.title;
    option.selected = item.id === theme.id;
    select.appendChild(option);
  });

  select.addEventListener("change", () => {
    localStorage.setItem("arirang-merge-theme", select.value);
    const url = new URL(window.location.href);
    url.searchParams.set("theme", select.value);
    window.location.href = url.toString();
  });
}

export function getMergeEffect(level) {
  return theme.mergeEffects[level] || theme.mergeEffects.default;
}

export default theme;
