import { createAgents, registerAgents } from "./agents";

/**
 * SwarmEngine — renders every agent cursor on ONE canvas (the visitor cursor is a separate DOM component).
 *
 * Positions live in document coordinates, so agents stay attached to content while the page
 * scrolls. Motion is a damped spring integrated each frame: timelines only set targets.
 *
 * Agent modes:
 *  - "roam": idle — wanders inside the current viewport (follows the scroll, like a crowd)
 *  - "task": working — flies to a target or follows a moving point
 *  - "park": off duty — fades out at the right edge
 */

const ARROW = new Path2D("M0 0 L0 17 L4.6 12.9 L7.6 19.6 L10.5 18.3 L7.6 11.8 L13.4 11.6 Z");
const TRAIL = 12;
const rand = (a, b) => a + Math.random() * (b - a);

export default class SwarmEngine {
  constructor(canvas, { count = 24 } = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.ripples = [];
    this.running = false;
    this.lastT = 0;

    const list = createAgents(count);
    registerAgents(list);
    this.agents = new Map(
      list.map((a, i) => [
        a.id,
        {
          ...a,
          index: i,
          lead: Boolean(a.label),
          scale: a.label ? 1 : 0.72,
          x: -100,
          y: -100,
          vx: 0,
          vy: 0,
          tx: -100,
          ty: -100,
          follow: null,
          mode: "park",
          reserved: false,
          lastUsed: 0,
          alpha: 0,
          labelAlpha: 0,
          press: 0,
          trail: [],
          roam: { rx: 0.5, ry: 0.5, until: 0 },
          k: 120 + (i % 6) * 18,
          damp: 0.74 + (i % 4) * 0.06,
        },
      ])
    );

    this.mode = "build";

    this.onResize = this.onResize.bind(this);
    this.tick = this.tick.bind(this);
    this.onVisibility = () => (document.hidden ? this.stop() : this.start());

    this.onResize();
    window.addEventListener("resize", this.onResize);
    document.addEventListener("visibilitychange", this.onVisibility);
  }

  /* ——— lifecycle ——— */
  start() {
    if (this.running) return;
    this.running = true;
    this.lastT = performance.now();
    this.frame = requestAnimationFrame(this.tick);
  }
  stop() {
    this.running = false;
    cancelAnimationFrame(this.frame);
  }
  destroy() {
    this.stop();
    window.removeEventListener("resize", this.onResize);
    document.removeEventListener("visibilitychange", this.onVisibility);
  }
  onResize() {
    const { innerWidth: w, innerHeight: h } = window;
    this.w = w;
    this.h = h;
    this.canvas.width = Math.round(w * this.dpr);
    this.canvas.height = Math.round(h * this.dpr);
    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;
    this.small = w < 768;
  }
  /* ——— swarm control ——— */
  get(id) {
    return this.agents.get(id);
  }
  ids() {
    return [...this.agents.keys()];
  }
  /** Bring every agent in from the edges of the screen, then let them roam. */
  spawn() {
    const sx = window.scrollX;
    const sy = window.scrollY;
    this.agents.forEach((a, _, map) => {
      const side = a.index % 4;
      const p = (a.index * 0.618) % 1;
      const x = side === 0 ? -40 : side === 1 ? this.w + 40 : p * this.w;
      const y = side === 2 ? -40 : side === 3 ? this.h + 40 : p * this.h;
      Object.assign(a, { x: sx + x, y: sy + y, vx: 0, vy: 0, trail: [], follow: null, reserved: false });
      a.mode = "roam";
      a.roam.until = 0;
      a.alpha = 0;
      void map;
    });
  }
  roamAll() {
    this.agents.forEach((a) => {
      a.mode = "roam";
      a.follow = null;
      a.reserved = false;
      a.roam.until = 0;
    });
  }
  parkAll() {
    this.agents.forEach((a) => {
      a.mode = "park";
      a.follow = null;
      a.reserved = false;
    });
  }
  /** Reserve a free agent for a task. `lead` prefers the labelled agents. */
  acquire(lead = false) {
    const all = [...this.agents.values()];
    const free = all.filter((a) => !a.reserved && (lead ? a.lead : true));
    const pool = free.length ? free : all.filter((a) => !a.reserved);
    const pick = pool.length
      ? pool.sort((a, b) => a.lastUsed - b.lastUsed)[0]
      : all.sort((a, b) => a.lastUsed - b.lastUsed)[0];
    pick.reserved = true;
    pick.lastUsed = performance.now();
    return pick.id;
  }
  release(id) {
    const a = this.get(id);
    if (!a) return;
    a.reserved = false;
    a.follow = null;
    if (a.mode === "task") {
      a.mode = "roam";
      a.roam.until = 0;
    }
  }
  /** Teleport (used for spawning). */
  place(id, x, y) {
    Object.assign(this.get(id), { x, y, tx: x, ty: y, vx: 0, vy: 0, trail: [] });
  }
  go(id, x, y) {
    const a = this.get(id);
    a.follow = null;
    a.mode = "task";
    a.tx = x;
    a.ty = y;
  }
  follow(id, fn) {
    const a = this.get(id);
    a.mode = "task";
    a.follow = fn;
  }
  click(id) {
    const a = this.get(id);
    a.press = 1;
    this.ripples.push({ x: a.x, y: a.y, color: a.color, t: 0 });
  }
  /** Gather everyone around a point (document coords) — used for the finale. */
  gather(cx, cy, r = 120) {
    let i = 0;
    const n = this.agents.size;
    this.agents.forEach((a) => {
      const ang = (i / n) * Math.PI * 2;
      const rr = r * (0.55 + ((i * 0.37) % 0.45));
      a.follow = null;
      a.mode = "task";
      a.tx = cx + Math.cos(ang) * rr;
      a.ty = cy + Math.sin(ang) * rr;
      i += 1;
    });
  }
  setMode(mode) {
    this.mode = mode;
  }

  /* ——— frame loop ——— */
  tick(now) {
    if (!this.running) return;
    const dt = Math.min(0.033, (now - this.lastT) / 1000);
    this.lastT = now;
    const sx = window.scrollX;
    const sy = window.scrollY;
    this.agents.forEach((a) => this.step(a, dt, sx, sy, now));
    this.ripples = this.ripples.filter((r) => (r.t += dt) < 0.6);
    this.draw(sx, sy);
    this.frame = requestAnimationFrame(this.tick);
  }

  step(a, dt, sx, sy, now) {
    let tx = a.tx;
    let ty = a.ty;
    if (a.mode === "task" && a.follow) {
      const p = a.follow();
      if (p) {
        tx = p.x;
        ty = p.y;
      }
    } else if (a.mode === "roam") {
      if (now > a.roam.until) {
        a.roam.rx = rand(0.08, 0.92);
        a.roam.ry = rand(0.12, 0.82);
        a.roam.until = now + rand(1400, 3600);
      }
      tx = sx + a.roam.rx * this.w;
      ty = sy + a.roam.ry * this.h;
    } else if (a.mode === "park") {
      tx = sx + this.w + 50;
      ty = sy + this.h * (0.2 + (a.index % 8) * 0.08);
    }

    const k = a.mode === "roam" ? a.k * 0.18 : a.k;
    const c = 2 * Math.sqrt(k) * (a.mode === "roam" ? 0.95 : a.damp);
    for (let i = 0; i < 2; i++) {
      const h = dt / 2;
      a.vx += (k * (tx - a.x) - c * a.vx) * h;
      a.vy += (k * (ty - a.y) - c * a.vy) * h;
      a.x += a.vx * h;
      a.y += a.vy * h;
    }

    const want = a.mode === "park" ? 0 : a.lead ? 1 : 0.92;
    a.alpha += (want - a.alpha) * Math.min(1, dt * 5);
    const wantLabel = a.lead && a.mode !== "park" && !this.small ? (a.mode === "task" ? 1 : 0.75) : 0;
    a.labelAlpha += (wantLabel - a.labelAlpha) * Math.min(1, dt * 6);
    a.press = Math.max(0, a.press - dt * 5);

    a.trail.push(a.x - sx, a.y - sy);
    if (a.trail.length > TRAIL * 2) a.trail.splice(0, 2);
  }

  draw(sx, sy) {
    const { ctx, dpr } = this;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, this.w, this.h);

    for (const r of this.ripples) {
      const p = r.t / 0.6;
      ctx.globalAlpha = 1 - p;
      ctx.strokeStyle = r.color;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(r.x - sx, r.y - sy, 5 + p * 22, 0, Math.PI * 2);
      ctx.stroke();
    }

    this.agents.forEach((a) => {
      if (a.alpha < 0.01) return;
      const t = a.trail;
      if (t.length > 4) {
        ctx.lineCap = "round";
        ctx.strokeStyle = a.color;
        for (let i = 2; i < t.length; i += 2) {
          const f = i / t.length;
          ctx.globalAlpha = a.alpha * f * (a.lead ? 0.3 : 0.18);
          ctx.lineWidth = (1 + f * 1.4) * a.scale;
          ctx.beginPath();
          ctx.moveTo(t[i - 2], t[i - 1]);
          ctx.lineTo(t[i], t[i + 1]);
          ctx.stroke();
        }
      }
      this.drawCursor(a, a.x - sx, a.y - sy);
    });

    ctx.globalAlpha = 1;
  }

  drawCursor(a, x, y) {
    const { ctx } = this;
    if (x < -60 || y < -60 || x > this.w + 60 || y > this.h + 60) return;
    const s = a.scale * (this.small ? 0.85 : 1) * (1 - a.press * 0.2);
    ctx.save();
    ctx.globalAlpha = a.alpha;
    ctx.translate(x, y);
    ctx.scale(s, s);
    ctx.shadowColor = "rgba(0,0,0,0.55)";
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 2;
    ctx.fillStyle = a.color;
    ctx.fill(ARROW);
    ctx.shadowColor = "transparent";
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = a.color === "#F2F2F2" || a.color === "#C9C9CF" ? "#070708" : "rgba(255,255,255,0.85)";
    ctx.stroke(ARROW);

    if (a.labelAlpha > 0.02) {
      ctx.globalAlpha = a.alpha * a.labelAlpha;
      ctx.font = '500 10px "IBM Plex Mono", ui-monospace, monospace';
      const text = `AGENT / ${a.label}`;
      const w = ctx.measureText(text).width + 12;
      ctx.fillStyle = a.color;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(14, 19, w, 18, 4);
      else ctx.rect(14, 19, w, 18);
      ctx.fill();
      ctx.fillStyle = a.ink;
      ctx.textBaseline = "middle";
      ctx.fillText(text, 20, 28.5);
    }
    ctx.restore();
  }
}
