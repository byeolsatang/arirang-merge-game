let enabled = true;
const cache = new Map();

export function setAudioEnabled(value) {
  enabled = Boolean(value);
}

export function isAudioEnabled() {
  return enabled;
}

export function playSound(url, volume = 0.8) {
  if (!enabled || !url) return;

  let audio = cache.get(url);
  if (!audio) {
    audio = new Audio(url);
    audio.preload = "auto";
    cache.set(url, audio);
  }

  const instance = audio.cloneNode();
  instance.volume = volume;
  instance.play().catch(() => {
    // Mobile browsers may block audio until the first user interaction.
  });
}
