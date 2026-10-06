import theme, { applyThemeToDocument, mountThemeSelector } from "./config.js";
import { playMergeEffect } from "./effects.js";
import { playSound, setAudioEnabled, isAudioEnabled } from "./audio.js";

const { Engine, Bodies, Body, Composite, Events } = Matter;

const canvas = document.getElementById("game-canvas");
const shell = document.getElementById("game-shell");
const effectLayer = document.getElementById("effect-layer");
const scoreEl = document.getElementById("score");
const nextPreview = document.getElementById("next-preview");
const gameoverEl = document.getElementById("gameover");
const finalScoreEl = document.getElementById("final-score");
const restartBtn = document.getElementById("restart");
const soundToggle = document.getElementById("sound-toggle");
const themeSelect = document.getElementById("theme-select");

applyThemeToDocument();
mountThemeSelector(themeSelect);

let engine;
let ctx;
let width;
let height;
let dpr;
let score = 0;
let nextLevel = 0;
let canDrop = true;
let gameOver = false;
let pointerX = 0;
let imageCache = new Map();
let mergingBodies = new Set();

function resizeCanvas() {
  const rect = shell.getBoundingClientRect();
  dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
  width = rect.width;
  height = rect.height;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  pointerX = width / 2;
}

function randomSpawnLevel() {
  const { minLevel, maxLevel } = theme.spawn;
  return minLevel + Math.floor(Math.random() * (maxLevel - minLevel + 1));
}

function levelDef(level) {
  return theme.levels[Math.min(level, theme.levels.length - 1)];
}

function preloadImages() {
  theme.levels.forEach((item) => {
    if (!item.asset) return;
    const img = new Image();
    img.src = item.asset;
    imageCache.set(item.asset, img);
  });
}

function initPhysics() {
  engine = Engine.create({ gravity: { x: 0, y: 1.05 } });

  const wall = 24;
  const floor = 24;
  const walls = [
    Bodies.rectangle(-wall / 2, height / 2, wall, height * 2, { isStatic: true, label: "wall" }),
    Bodies.rectangle(width + wall / 2, height / 2, wall, height * 2, { isStatic: true, label: "wall" }),
    Bodies.rectangle(width / 2, height + floor / 2, width + 60, floor, { isStatic: true, label: "floor" })
  ];
  Composite.add(engine.world, walls);

  Events.on(engine, "collisionStart", ({ pairs }) => {
    for (const pair of pairs) {
      const a = pair.bodyA;
      const b = pair.bodyB;
      if (a.plugin?.level == null || b.plugin?.level == null) continue;
      if (a.plugin.level !== b.plugin.level) continue;
      if (mergingBodies.has(a.id) || mergingBodies.has(b.id)) continue;

      mergeBodies(a, b);
    }
  });
}

function createPiece(level, x, y, velocity = null) {
  const def = levelDef(level);
  const body = Bodies.circle(x, y, def.radius, {
    restitution: 0.16,
    friction: 0.02,
    frictionAir: 0.002,
    density: 0.0015 + level * 0.00008,
    label: "piece"
  });
  body.plugin.level = level;
  body.plugin.createdAt = performance.now();
  if (velocity) Body.setVelocity(body, velocity);
  Composite.add(engine.world, body);
  return body;
}

function mergeBodies(a, b) {
  const level = a.plugin.level;
  const next = level + 1;
  if (next >= theme.levels.length) return;

  mergingBodies.add(a.id);
  mergingBodies.add(b.id);

  const x = (a.position.x + b.position.x) / 2;
  const y = (a.position.y + b.position.y) / 2;
  const vx = (a.velocity.x + b.velocity.x) / 2;
  const vy = (a.velocity.y + b.velocity.y) / 2;

  Composite.remove(engine.world, a);
  Composite.remove(engine.world, b);

  const newBody = createPiece(next, x, y, { x: vx, y: vy - 1.2 });
  Body.setAngularVelocity(newBody, (Math.random() - 0.5) * 0.08);

  const gained = levelDef(next).score;
  score += gained;
  scoreEl.textContent = score;

  playMergeEffect(effectLayer, shell, x, y, next);
  playSound(theme.audio.mergeDefault, 0.75);

  setTimeout(() => {
    mergingBodies.delete(a.id);
    mergingBodies.delete(b.id);
  }, 80);
}

function drawPiece(body) {
  const level = body.plugin.level;
  const def = levelDef(level);
  const { x, y } = body.position;
  const r = def.radius;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(body.angle);

  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.clip();

  const img = def.asset ? imageCache.get(def.asset) : null;
  if (img?.complete && img.naturalWidth) {
    ctx.drawImage(img, -r, -r, r * 2, r * 2);
  } else {
    const hue = (268 + level * 19) % 360;
    ctx.fillStyle = `hsl(${hue} 68% ${48 + Math.min(level, 6) * 4}%)`;
    ctx.fillRect(-r, -r, r * 2, r * 2);

    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `${Math.max(13, r * 0.72)}px system-ui, sans-serif`;
    ctx.fillText(def.emoji || def.label, 0, 1);
  }

  ctx.restore();

  ctx.beginPath();
  ctx.arc(x, y, r - 0.5, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(255,255,255,.28)";
  ctx.lineWidth = 1;
  ctx.stroke();
}

function drawDropGuide() {
  if (!canDrop || gameOver) return;
  const def = levelDef(nextLevel);
  ctx.save();
  ctx.globalAlpha = 0.65;
  ctx.beginPath();
  ctx.arc(pointerX, Math.max(def.radius + 8, 38), def.radius, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(255,255,255,.7)";
  ctx.setLineDash([4, 4]);
  ctx.stroke();
  ctx.restore();
}

function render() {
  ctx.clearRect(0, 0, width, height);
  for (const body of Composite.allBodies(engine.world)) {
    if (body.plugin?.level == null) continue;
    drawPiece(body);
  }
  drawDropGuide();
  requestAnimationFrame(render);
}

function updateNextPreview() {
  const def = levelDef(nextLevel);
  nextPreview.innerHTML = "";
  if (def.asset) {
    const img = document.createElement("img");
    img.src = def.asset;
    img.alt = def.label;
    nextPreview.appendChild(img);
  } else {
    nextPreview.textContent = def.emoji || def.label;
  }
}

function dropAt(x) {
  if (!canDrop || gameOver) return;
  const def = levelDef(nextLevel);
  const safeX = Math.max(def.radius + 4, Math.min(width - def.radius - 4, x));
  createPiece(nextLevel, safeX, def.radius + 8);
  playSound(theme.audio.drop, 0.6);

  canDrop = false;
  nextLevel = randomSpawnLevel();
  updateNextPreview();
  setTimeout(() => { canDrop = true; }, 420);
}

function pointerPosition(event) {
  const rect = shell.getBoundingClientRect();
  const clientX = event.touches?.[0]?.clientX ?? event.clientX;
  return Math.max(0, Math.min(width, clientX - rect.left));
}

function checkGameOver() {
  if (gameOver) return;
  const dangerY = height * 0.2;

  const offenders = Composite.allBodies(engine.world).filter((body) =>
    body.plugin?.level != null &&
    performance.now() - body.plugin.createdAt > 1200 &&
    body.position.y - levelDef(body.plugin.level).radius < dangerY
  );

  if (offenders.length === 0) return;

  gameOver = true;
  canDrop = false;
  finalScoreEl.textContent = score;
  gameoverEl.hidden = false;
  playSound(theme.audio.gameOver, 0.85);
}

function resetGame() {
  score = 0;
  scoreEl.textContent = "0";
  gameOver = false;
  canDrop = true;
  gameoverEl.hidden = true;
  nextLevel = randomSpawnLevel();

  Composite.clear(engine.world, false, true);
  Events.off(engine);

  initPhysics();
  updateNextPreview();
}

function bindEvents() {
  shell.addEventListener("pointermove", (e) => { pointerX = pointerPosition(e); });
  shell.addEventListener("pointerdown", (e) => {
    pointerX = pointerPosition(e);
    dropAt(pointerX);
  });

  restartBtn.addEventListener("click", resetGame);

  soundToggle.addEventListener("click", () => {
    const next = !isAudioEnabled();
    setAudioEnabled(next);
    soundToggle.textContent = next ? "🔊" : "🔇";
  });

  window.addEventListener("resize", () => {
    resizeCanvas();
    resetGame();
  });
}

function tick() {
  Engine.update(engine, 1000 / 60);
  checkGameOver();
  requestAnimationFrame(tick);
}

function start() {
  preloadImages();
  resizeCanvas();
  initPhysics();
  bindEvents();
  nextLevel = randomSpawnLevel();
  updateNextPreview();
  render();
  tick();
}

start();
