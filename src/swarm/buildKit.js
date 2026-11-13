import gsap from "gsap";
import { agentColor, agentInk } from "./agents";

/**
 * Build primitives used by the swarm timelines.
 *
 * Every helper takes an absolute time `at` (seconds) on a GSAP timeline and returns the time at
 * which it finishes, so orchestration reads like a score: parallel agents simply share times.
 * Elements touched by a helper are hidden immediately (inline styles) and fully restored by
 * `finalize()` — whether the timeline completes, is skipped or is killed.
 */

export function docRect(el) {
  const r = el.getBoundingClientRect();
  return { x: r.left + window.scrollX, y: r.top + window.scrollY, w: r.width, h: r.height };
}

export const isShown = (el) => Boolean(el) && el.getClientRects().length > 0 && el.getBoundingClientRect().width > 0;

const center = (el) => {
  const r = docRect(el);
  return { x: r.x + r.w / 2, y: r.y + r.h / 2 };
};

export function createKit(sw, layer) {
  const nodes = new Set();
  const touched = new Set();
  const texts = new Map();

  const mk = (cls, agent) => {
    const d = document.createElement("div");
    d.className = cls;
    d.style.setProperty("--c", agentColor(agent));
    d.style.setProperty("--t", agentInk(agent));
    layer.appendChild(d);
    nodes.add(d);
    return d;
  };
  const drop = (d, fade = true) => {
    if (!d) return;
    nodes.delete(d);
    if (!fade) return d.remove();
    gsap.to(d, { opacity: 0, duration: 0.3, onComplete: () => d.remove() });
  };

  /** Hide elements right now (before paint) and remember them for restoration. */
  function hide(els) {
    [].concat(els).forEach((el) => {
      if (!el) return;
      touched.add(el);
      gsap.set(el, { opacity: 0 });
    });
  }

  /** Selection box dragged from top-left to bottom-right with a live W × H readout. */
  function box(tl, at, agent, el, { dur = 0.7, lead = 0.45, hold = 0.35, tag, reveal = false } = {}) {
    if (!isShown(el)) return at;
    if (reveal) hide(el);
    const st = { p: 0 };
    let d;
    let dim;
    let r;
    tl.call(() => {
      r = docRect(el);
      sw.go(agent, r.x, r.y);
    }, null, at);
    tl.call(() => {
      r = docRect(el);
      d = mk("swarm-box", agent);
      d.innerHTML = `${tag ? '<span class="swarm-box__tag"></span>' : ""}<span class="swarm-box__dim"></span><i></i><i></i><i></i><i></i>`;
      if (tag) d.querySelector(".swarm-box__tag").textContent = tag;
      dim = d.querySelector(".swarm-box__dim");
      Object.assign(d.style, { left: `${r.x}px`, top: `${r.y}px`, width: "0px", height: "0px" });
      sw.click(agent);
    }, null, at + lead);
    tl.to(
      st,
      {
        p: 1,
        duration: dur,
        ease: "power2.inOut",
        onUpdate() {
          if (!d) return;
          const w = r.w * st.p;
          const h = r.h * st.p;
          d.style.width = `${w}px`;
          d.style.height = `${h}px`;
          dim.textContent = `${Math.round(w)} × ${Math.round(h)}`;
          sw.go(agent, r.x + w, r.y + h);
        },
      },
      at + lead
    );
    if (reveal) tl.to(el, { opacity: 1, duration: 0.45, ease: "power2.out" }, at + lead + dur * 0.75);
    const end = at + lead + dur + hold;
    tl.call(() => drop(d), null, end);
    return end;
  }

  /** Types the text content of an inline element, with a caret the agent rides on. */
  function type(tl, at, agent, el, { cps = 18, lead = 0.4 } = {}) {
    if (!isShown(el)) return at;
    const full = texts.get(el) ?? el.textContent;
    texts.set(el, full);
    hide(el);
    // Reserve the final height so surrounding layout doesn't shift while text is typed.
    const host = el.parentElement;
    if (host) {
      touched.add(host);
      gsap.set(host, { minHeight: host.getBoundingClientRect().height });
    }
    const n = { v: 0 };
    let caret;
    const fontSize = parseFloat(getComputedStyle(el).fontSize) || 16;

    const caretPoint = () => {
      const tn = el.firstChild;
      let r;
      if (tn && tn.nodeType === 3 && tn.length > 0) {
        const range = document.createRange();
        range.setStart(tn, tn.length - 1);
        range.setEnd(tn, tn.length);
        const rects = range.getClientRects();
        const last = rects[rects.length - 1] ?? range.getBoundingClientRect();
        r = { left: last.right, top: last.top, height: last.height };
      } else {
        const b = el.getBoundingClientRect();
        r = { left: b.left, top: b.top, height: b.height || fontSize };
      }
      return { x: r.left + window.scrollX, y: r.top + window.scrollY, h: r.height };
    };
    const placeCaret = () => {
      if (!caret) return;
      const p = caretPoint();
      const h = p.h * 0.78;
      Object.assign(caret.style, {
        left: `${p.x + Math.max(1, fontSize * 0.03)}px`,
        top: `${p.y + (p.h - h) / 2}px`,
        height: `${h}px`,
        width: `${Math.max(2, fontSize * 0.05)}px`,
      });
    };

    tl.call(() => {
      const r = docRect(el);
      sw.go(agent, r.x, r.y + r.h * 0.8);
    }, null, at);
    tl.call(() => {
      el.textContent = "";
      gsap.set(el, { opacity: 1 });
      caret = mk("swarm-box", agent);
      caret.style.border = "0";
      caret.style.background = agentColor(agent);
      placeCaret();
      sw.follow(agent, () => {
        const p = caretPoint();
        return { x: p.x + Math.max(3, fontSize * 0.06), y: p.y + p.h * 0.9 };
      });
      sw.click(agent);
    }, null, at + lead);
    const dur = full.length / cps;
    tl.to(
      n,
      {
        v: full.length,
        duration: dur,
        ease: "none",
        onUpdate() {
          const next = full.slice(0, Math.round(n.v));
          if (el.textContent !== next) el.textContent = next;
          placeCaret();
        },
      },
      at + lead
    );
    const end = at + lead + dur + 0.2;
    tl.call(() => {
      el.textContent = full;
      drop(caret, false);
      caret = null;
      const p = caretPoint();
      sw.go(agent, p.x + 8, p.y + p.h);
    }, null, end);
    return end;
  }

  /** Draws a rule/border by scaling it from its origin while the agent rides the tip. */
  function line(tl, at, agent, el, { axis = "x", dur = 0.7, lead = 0.4 } = {}) {
    if (!isShown(el)) return at;
    hide(el);
    const prop = axis === "x" ? "scaleX" : "scaleY";
    const st = { p: 0 };
    let r;
    tl.call(() => {
      r = docRect(el);
      sw.go(agent, r.x, r.y);
    }, null, at);
    tl.call(() => {
      r = docRect(el);
      gsap.set(el, { opacity: 1, [prop]: 0, transformOrigin: axis === "x" ? "0% 50%" : "50% 0%" });
    }, null, at + lead);
    tl.to(
      st,
      {
        p: 1,
        duration: dur,
        ease: "power2.inOut",
        onUpdate() {
          gsap.set(el, { [prop]: st.p });
          if (r) sw.go(agent, axis === "x" ? r.x + r.w * st.p : r.x, axis === "x" ? r.y : r.y + r.h * st.p);
        },
      },
      at + lead
    );
    return at + lead + dur;
  }

  /** Places the first element, then "alt-drags" duplicates out of it into their own slots. */
  function dup(tl, at, agent, list, { gap = 0.14, lead = 0.4 } = {}) {
    const els = list.filter(isShown);
    if (!els.length) return at;
    hide(els);
    const [first] = els;
    tl.call(() => {
      const c = center(first);
      sw.go(agent, c.x, c.y);
    }, null, at);
    tl.call(() => sw.click(agent), null, at + lead);
    tl.fromTo(first, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(2)" }, at + lead);
    let t = at + lead + 0.25;
    els.slice(1).forEach((el) => {
      const from = () => {
        const a = first.getBoundingClientRect();
        const b = el.getBoundingClientRect();
        return { x: a.left - b.left, y: a.top - b.top };
      };
      tl.call(() => sw.follow(agent, () => center(el)), null, t);
      tl.fromTo(
        el,
        { x: () => from().x, y: () => from().y, opacity: 0.4 },
        { x: 0, y: 0, opacity: 1, duration: 0.5, ease: "power3.inOut", immediateRender: false },
        t
      );
      t += gap;
    });
    const end = t + 0.5;
    tl.call(() => {
      const c = center(els[els.length - 1]);
      sw.go(agent, c.x, c.y + 14);
    }, null, end);
    return end;
  }

  /** Wipes an element in from left to right with the agent dragging the edge. */
  function reveal(tl, at, agent, el, { dur = 0.9, lead = 0.4 } = {}) {
    if (!isShown(el)) return at;
    hide(el);
    const st = { p: 0 };
    let r;
    tl.call(() => {
      r = docRect(el);
      sw.go(agent, r.x, r.y + r.h / 2);
    }, null, at);
    tl.call(() => {
      r = docRect(el);
      gsap.set(el, { opacity: 1, clipPath: "inset(0% 100% 0% 0%)" });
      sw.click(agent);
    }, null, at + lead);
    tl.to(
      st,
      {
        p: 1,
        duration: dur,
        ease: "power3.inOut",
        onUpdate() {
          el.style.clipPath = `inset(0% ${(1 - st.p) * 100}% 0% 0%)`;
          if (r) sw.go(agent, r.x + r.w * st.p, r.y + r.h / 2);
        },
      },
      at + lead
    );
    return at + lead + dur;
  }

  /** Agent clicks, element pops into place. */
  function pop(tl, at, agent, el, { lead = 0.45 } = {}) {
    if (!isShown(el)) return at;
    hide(el);
    tl.call(() => {
      const c = center(el);
      sw.go(agent, c.x, c.y);
    }, null, at);
    tl.call(() => sw.click(agent), null, at + lead);
    tl.fromTo(el, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.8)" }, at + lead);
    return at + lead + 0.5;
  }

  /** Snap guides: dashed lines flash along an element's edges, like smart guides in a design tool. */
  function guides(tl, at, agent, el, { hold = 0.8 } = {}) {
    if (!isShown(el)) return at;
    const made = [];
    tl.call(() => {
      const r = docRect(el);
      const W = document.documentElement.clientWidth;
      const specs = [
        { cls: "swarm-guide", s: { left: "0px", top: `${r.y}px`, width: `${W}px` } },
        { cls: "swarm-guide", s: { left: "0px", top: `${r.y + r.h}px`, width: `${W}px` } },
        { cls: "swarm-guide swarm-guide--v", s: { left: `${r.x}px`, top: `${r.y - 120}px`, height: `${r.h + 240}px` } },
      ];
      specs.forEach(({ cls, s }) => {
        const g = mk(cls, agent);
        Object.assign(g.style, s);
        gsap.fromTo(g, { opacity: 0 }, { opacity: 0.7, duration: 0.2 });
        made.push(g);
      });
    }, null, at);
    tl.call(() => made.splice(0).forEach((g) => drop(g)), null, at + hold);
    return at + hold;
  }

  /** Agent hovers the element and it fades up into place. */
  function fade(tl, at, agent, el, { lead = 0.35 } = {}) {
    if (!isShown(el)) return at;
    hide(el);
    tl.call(() => {
      const r = docRect(el);
      sw.go(agent, r.x + Math.min(r.w, 40), r.y + Math.min(r.h, 30));
    }, null, at);
    tl.fromTo(el, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" }, at + lead);
    return at + lead + 0.55;
  }

  /** Restore everything: text, inline styles, overlay nodes. Safe to call many times. */
  function finalize() {
    texts.forEach((full, el) => {
      el.textContent = full;
    });
    touched.forEach((el) => {
      gsap.killTweensOf(el);
      gsap.set(el, { clearProps: "opacity,transform,clipPath,transformOrigin,minHeight" });
    });
    nodes.forEach((d) => d.remove());
    nodes.clear();
    touched.clear();
    texts.clear();
  }

  return { hide, box, type, line, dup, reveal, pop, guides, fade, finalize };
}
