import gsap from "gsap";
import { createKit } from "./buildKit";

/**
 * Declarative builds.
 *
 * A section opts in with `data-block`. Inside it, elements declare HOW they get built:
 *   data-b="frame"   wireframe box drawn over the element (element stays visible)
 *   data-b="box"     selection box dragged out, then the element fades in
 *   data-b="type"    text typed character by character (inline element, plain text)
 *   data-b="line"    rule drawn from its origin (data-axis="y" for vertical)
 *   data-b="reveal"  wiped in left → right (images, previews)
 *   data-b="pop"     agent clicks, element pops in
 *   data-b="fade"    agent hovers, element fades up
 *   data-b="dup"     container: its [data-dup] children are alt-dragged out of the first one
 * Optional: data-tag (box label), data-gap (seconds before the next step), data-cps (typing speed).
 */

const DEFAULT_GAP = { frame: 0.12, box: 0.28, type: 0.3, line: 0.12, reveal: 0.3, pop: 0.16, fade: 0.1, dup: 0.3 };

/** A block's own steps (steps inside a nested block belong to that block). */
export const blockSteps = (block) =>
  [...block.querySelectorAll("[data-b]")].filter((el) => el.closest("[data-block]") === block);

/** Everything a block hides until it is built: its steps plus duplicated children. */
const pendingOf = (block) =>
  blockSteps(block).flatMap((el) => {
    if (el.dataset.b === "frame") return [];
    if (el.dataset.b === "dup") return [...el.querySelectorAll("[data-dup]")];
    return [el];
  });
const reveal = (block) => pendingOf(block).forEach((el) => el.classList.remove("b-pending"));

export function buildBlock(tl, kit, sw, block, onLayer) {
  let t = 0.05;
  blockSteps(block).forEach((el) => {
    const kind = el.dataset.b;
    const agent = sw.acquire(kind === "type" || kind === "box" || kind === "frame");
    const tag = el.dataset.tag;
    let end = t;
    switch (kind) {
      case "frame":
        end = kit.box(tl, t, agent, el, { tag, dur: 0.5, hold: 0.25, lead: 0.3 });
        break;
      case "box":
        end = kit.box(tl, t, agent, el, { tag, reveal: true, dur: 0.55, hold: 0.2, lead: 0.32 });
        break;
      case "type": {
        const len = (el.textContent || "").length;
        const cps = Number(el.dataset.cps) || (len <= 24 ? 20 : len <= 80 ? 55 : 130);
        end = kit.type(tl, t, agent, el, { cps, lead: 0.3 });
        break;
      }
      case "line":
        end = kit.line(tl, t, agent, el, { axis: el.dataset.axis || "x", dur: 0.6, lead: 0.3 });
        break;
      case "reveal":
        end = kit.reveal(tl, t, agent, el, { dur: 0.85, lead: 0.32 });
        break;
      case "pop":
        end = kit.pop(tl, t, agent, el, { lead: 0.32 });
        break;
      case "dup":
        end = kit.dup(tl, t, agent, [...el.querySelectorAll("[data-dup]")], { gap: 0.07, lead: 0.3 });
        break;
      default:
        end = kit.fade(tl, t, agent, el, { lead: 0.25 });
    }
    tl.call(() => {
      sw.release(agent);
      onLayer();
    }, null, Math.max(end, t + 0.05));
    t += Number(el.dataset.gap ?? DEFAULT_GAP[kind] ?? 0.2);
  });
}

const NAV_KEYS = new Set(["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " ", "Spacebar"]);

/**
 * TourController — the live build session.
 * Auto-scrolls the page from top to bottom while agents build each block as it enters the
 * viewport. Scroll speed adapts to how busy the swarm is, so content is always readable.
 * Any manual scroll pauses the tour; building continues on whatever the visitor looks at.
 */
export default class TourController {
  constructor({ engine, layer, lenis, onState, ui }) {
    this.engine = engine;
    this.layer = layer;
    this.lenis = lenis;
    this.onState = onState;
    this.ui = ui; // { progress: el, layers: el }
    this.tasks = new Set();
    this.built = new Set();
    this.blocks = [];
    this.layersDone = 0;
    this.layersTotal = 0;
    this.phase = "idle";
    this.touring = false;
    this.speed = 0;
    this.loop = this.loop.bind(this);
    this.onInterrupt = this.onInterrupt.bind(this);
  }

  emit() {
    this.onState({ phase: this.phase, touring: this.touring, seconds: this.seconds ?? 0 });
  }
  html() {
    return document.documentElement;
  }

  /** Synchronously hide every buildable element (call before the first paint). */
  prime() {
    this.blocks = [...document.querySelectorAll("[data-block]")];
    this.blocks.forEach((b) => {
      b.classList.remove("is-built");
      pendingOf(b).forEach((el) => el.classList.add("b-pending"));
    });
    this.html().classList.add("swarm-tour", "swarm-locked");
  }

  /* ——— session ——— */
  start() {
    this.cleanupTasks();
    this.prime();
    this.built.clear();
    this.layersDone = 0;
    this.layersTotal = this.blocks.reduce((n, b) => n + blockSteps(b).length, 0);
    this.updateLayers();

    this.html().classList.add("swarm-tour", "swarm-locked");
    this.lenis.stop();
    window.scrollTo(0, 0);
    this.y = 0;
    this.speed = 0;
    this.holdUntil = performance.now() + 9000; // released early once the hero is built
    this.startedAt = performance.now();
    this.seconds = 0;

    this.engine.spawn();
    this.engine.setMode("crosshair");
    this.phase = "tour";
    this.touring = true;
    this.emit();

    this.io?.disconnect();
    this.io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && this.runBlock(e.target)),
      { rootMargin: "0px 0px -18% 0px", threshold: 0 }
    );
    // Give the agents a beat to fly in before the first wireframes are drawn.
    clearTimeout(this.startTimer);
    this.startTimer = setTimeout(() => this.blocks.forEach((b) => this.io.observe(b)), 700);

    this.addListeners();
    cancelAnimationFrame(this.raf);
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.loop);
  }

  runBlock(block) {
    if (this.phase !== "tour" || this.built.has(block)) return;
    this.built.add(block);
    const kit = createKit(this.engine, this.layer);
    const task = { block, kit };
    task.tl = gsap.timeline({
      paused: true,
      onComplete: () => {
        kit.finalize();
        this.tasks.delete(task);
        if (block.dataset.block === "hero") this.holdUntil = performance.now() + 600;
        this.checkDone();
      },
    });
    buildBlock(task.tl, kit, this.engine, block, () => {
      this.layersDone += 1;
      this.updateLayers();
    });
    block.classList.add("is-built");
    reveal(block);
    this.tasks.add(task);
    task.tl.play();
  }

  /** Blocks the visitor scrolled past without seeing get shown instantly (never left hidden). */
  sweepPassed() {
    this.blocks.forEach((b) => {
      if (this.built.has(b)) return;
      const r = b.getBoundingClientRect();
      if (r.bottom < 0) {
        this.built.add(b);
        b.classList.add("is-built");
        reveal(b);
        this.layersDone += blockSteps(b).length;
        this.updateLayers();
      }
    });
  }

  loop(now) {
    const dt = Math.min(0.05, (now - this.last) / 1000);
    this.last = now;
    const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

    if (this.phase === "tour") {
      this.seconds = Math.round((now - this.startedAt) / 1000);
      if (this.touring && now > this.holdUntil) {
        const busy = this.tasks.size;
        const small = window.innerWidth < 768;
        const target = (busy === 0 ? 300 : busy === 1 ? 120 : 60) * (small ? 1.35 : 1);
        this.speed += (target - this.speed) * Math.min(1, dt * 2.5);
        this.y = Math.min(max, this.y + this.speed * dt);
        window.scrollTo(0, Math.round(this.y));
        if (this.y >= max - 1) {
          this.touring = false;
          this.emit();
        }
      }
      this.sweepPassed();
    }

    if (this.ui.progress) {
      const p = max ? window.scrollY / max : 0;
      this.ui.progress.style.transform = `scaleX(${p.toFixed(4)})`;
    }
    this.raf = requestAnimationFrame(this.loop);
  }

  updateLayers() {
    if (this.ui.layers) this.ui.layers.textContent = `${this.layersDone} / ${this.layersTotal}`;
  }

  checkDone() {
    if (this.phase !== "tour") return;
    if (this.built.size < this.blocks.length || this.tasks.size) return;
    this.phase = "finale";
    this.touring = false;
    this.emit();
    // Everyone converges on the closing card, then the swarm leaves.
    const target = document.querySelector("[data-finale]");
    const r = target?.getBoundingClientRect();
    const cx = r ? r.left + r.width / 2 + window.scrollX : window.scrollX + window.innerWidth / 2;
    const cy = r ? r.top + r.height / 2 + window.scrollY : window.scrollY + window.innerHeight / 2;
    this.engine.gather(cx, cy, r ? Math.min(r.width, r.height) * 0.6 : 140);
    clearTimeout(this.finaleTimer);
    this.finaleTimer = setTimeout(() => this.finish(), 1800);
  }

  finish() {
    this.removeListeners();
    this.io?.disconnect();
    this.engine.parkAll();
    this.engine.setMode("pointer");
    this.html().classList.remove("swarm-tour", "swarm-locked");
    this.lenis.start();
    this.phase = "done";
    this.touring = false;
    this.emit();
  }

  /* ——— controls ——— */
  pause() {
    if (!this.touring) return;
    this.touring = false;
    this.html().classList.remove("swarm-locked");
    this.lenis.start();
    this.emit();
  }
  resume() {
    if (this.phase !== "tour") return;
    this.y = window.scrollY;
    this.speed = 0;
    this.holdUntil = Math.min(this.holdUntil, performance.now());
    this.touring = true;
    this.html().classList.add("swarm-locked");
    this.lenis.stop();
    this.emit();
  }
  skip() {
    if (this.phase !== "tour" && this.phase !== "finale") return;
    clearTimeout(this.startTimer);
    clearTimeout(this.finaleTimer);
    this.cleanupTasks();
    this.blocks.forEach((b) => {
      b.classList.add("is-built");
      reveal(b);
      this.built.add(b);
    });
    this.layersDone = this.layersTotal;
    this.updateLayers();
    this.finish();
  }
  replay() {
    clearTimeout(this.finaleTimer);
    this.start();
  }

  onInterrupt(e) {
    if (!this.touring) return;
    if (e.type === "keydown" && !NAV_KEYS.has(e.key)) return;
    this.pause();
  }
  addListeners() {
    this.removeListeners();
    window.addEventListener("wheel", this.onInterrupt, { passive: true });
    window.addEventListener("touchstart", this.onInterrupt, { passive: true });
    window.addEventListener("keydown", this.onInterrupt);
  }
  removeListeners() {
    window.removeEventListener("wheel", this.onInterrupt);
    window.removeEventListener("touchstart", this.onInterrupt);
    window.removeEventListener("keydown", this.onInterrupt);
  }

  cleanupTasks() {
    this.tasks.forEach((t) => {
      t.tl.kill();
      t.kit.finalize();
    });
    this.tasks.clear();
  }

  destroy() {
    clearTimeout(this.startTimer);
    clearTimeout(this.finaleTimer);
    cancelAnimationFrame(this.raf);
    this.removeListeners();
    this.io?.disconnect();
    this.cleanupTasks();
    this.blocks.forEach(reveal);
    this.html().classList.remove("swarm-tour", "swarm-locked");
  }
}
