import baseTheme from "./arirang-base.js";
import yoongiBultaoreune from "./yoongi-bultaoreune.js";

export const themes = [baseTheme, yoongiBultaoreune];

export function getThemeById(id) {
  return themes.find((theme) => theme.id === id) || themes[0];
}
