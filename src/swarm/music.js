/**
 * Intro soundtrack: starts at a given second with a fade-in, fades out when the build ends.
 * The audio file is optional — `isAvailable()` checks it exists before the entry screen is shown.
 */
export default class IntroMusic {
  constructor({ src, startAt = 0, volume = 0.6 }) {
    this.src = src;
    this.startAt = startAt;
    this.volume = volume;
    this.muted = false;
    this.audio = null;
    this.fadeRaf = 0;
  }

  /** True when the file is served as real audio (dev servers answer unknown paths with HTML). */
  async isAvailable() {
    if (!this.src) return false;
    try {
      const res = await fetch(this.src, { method: "HEAD" });
      const type = res.headers.get("content-type") || "";
      return res.ok && /audio|octet-stream/.test(type);
    } catch {
      return false;
    }
  }

  ensure() {
    if (this.audio) return this.audio;
    const a = new Audio();
    a.preload = "auto";
    // Media fragment = start position, works before metadata is loaded.
    a.src = `${this.src}#t=${this.startAt}`;
    a.volume = 0;
    a.addEventListener("loadedmetadata", () => {
      if (a.currentTime < this.startAt - 1) a.currentTime = this.startAt;
    });
    this.audio = a;
    return a;
  }

  /** Must be called from a user gesture (click) — browsers block audible autoplay otherwise. */
  play() {
    const a = this.ensure();
    try {
      if (a.readyState >= 1) a.currentTime = this.startAt;
    } catch {
      /* ignore */
    }
    a.volume = 0;
    const p = a.play();
    if (p?.catch) p.catch(() => {});
    this.fadeTo(this.muted ? 0 : this.volume, 2500);
  }

  fadeTo(target, ms, done) {
    const a = this.audio;
    if (!a) return;
    cancelAnimationFrame(this.fadeRaf);
    const from = a.volume;
    const t0 = performance.now();
    const step = (now) => {
      const k = Math.min(1, (now - t0) / ms);
      a.volume = Math.max(0, Math.min(1, from + (target - from) * k));
      if (k < 1) this.fadeRaf = requestAnimationFrame(step);
      else done?.();
    };
    this.fadeRaf = requestAnimationFrame(step);
  }

  stop(ms = 3000) {
    if (!this.audio || this.audio.paused) return;
    this.fadeTo(0, ms, () => this.audio?.pause());
  }

  setMuted(m) {
    this.muted = m;
    if (this.audio && !this.audio.paused) this.fadeTo(m ? 0 : this.volume, 400);
  }

  get playing() {
    return Boolean(this.audio && !this.audio.paused);
  }

  destroy() {
    cancelAnimationFrame(this.fadeRaf);
    if (this.audio) {
      this.audio.pause();
      this.audio.src = "";
    }
    this.audio = null;
  }
}
