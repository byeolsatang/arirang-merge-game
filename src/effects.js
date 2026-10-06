import { getMergeEffect } from "./config.js";
import { playSound } from "./audio.js";

export function playMergeEffect(layer, shell, x, y, level) {
  const effect = getMergeEffect(level);
  if (!effect) return;

  if (effect.text) {
    const label = document.createElement("div");
    label.className = "merge-text";
    label.textContent = effect.text;
    label.style.left = x + "px";
    label.style.top = y + "px";
    layer.appendChild(label);
    setTimeout(() => label.remove(), 900);
  }

  const count = effect.particles || 0;
  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    p.textContent = effect.particleEmoji || "•";
    p.style.left = x + "px";
    p.style.top = y + "px";
    p.style.width = "auto";
    p.style.height = "auto";
    p.style.fontSize = (10 + Math.random() * 12) + "px";

    const angle = Math.random() * Math.PI * 2;
    const distance = 35 + Math.random() * (45 + level * 7);
    p.style.setProperty("--dx", Math.cos(angle) * distance + "px");
    p.style.setProperty("--dy", Math.sin(angle) * distance + "px");
    layer.appendChild(p);
    setTimeout(() => p.remove(), 800);
  }

  if (effect.flash) {
    const flash = document.createElement("div");
    flash.className = "flash";
    layer.appendChild(flash);
    setTimeout(() => flash.remove(), 350);
  }

  if (effect.shake) {
    shell.classList.remove("shake");
    void shell.offsetWidth;
    shell.classList.add("shake");
    setTimeout(() => shell.classList.remove("shake"), 300);
  }

  playSound(effect.sound, 0.9);
}
