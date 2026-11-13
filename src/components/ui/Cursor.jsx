import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { useMediaQuery } from "../../hooks/useMediaQuery";

const TARGETS = "a, button, [data-cursor], label, select, summary";
const PAD = 7;
const IDLE = 30;

/**
 * "Selection" cursor — a red dot inside four corner brackets, echoing the boxes the swarm draws.
 * Over anything interactive the brackets snap around the element (like selecting a layer)
 * and show a small label. Desktop + fine pointer only; native cursor in text fields.
 */
export default function Cursor() {
  const fine = useMediaQuery("(pointer: fine) and (hover: hover)");
  const reduce = useReducedMotion();
  const enabled = fine && !reduce;

  const dotRef = useRef(null);
  const frameRef = useRef(null);
  const [label, setLabel] = useState("");

  useEffect(() => {
    if (!enabled) return undefined;
    const html = document.documentElement;
    html.classList.add("has-cursor");

    const m = { x: -100, y: -100, on: false, down: false };
    const f = { x: -100, y: -100, w: IDLE, h: IDLE, r: 2 };
    let target = null;
    let text = false;
    let lastLabel = "";
    let raf;

    const onMove = (e) => {
      m.x = e.clientX;
      m.y = e.clientY;
      m.on = true;
      text = Boolean(e.target.closest?.("input, textarea, [contenteditable='true']"));
      target = text ? null : e.target.closest?.(TARGETS) ?? null;
      const next = target
        ? target.getAttribute("data-cursor") ?? (target.tagName === "A" && target.target === "_blank" ? "Open ↗" : "")
        : "";
      if (next !== lastLabel) {
        lastLabel = next;
        setLabel(next);
      }
    };
    const onLeave = () => (m.on = false);
    const onDown = () => (m.down = true);
    const onUp = () => (m.down = false);

    const loop = () => {
      let tx;
      let ty;
      let tw;
      let th;
      if (target && target.isConnected) {
        const r = target.getBoundingClientRect();
        // Huge targets (full cards) keep a snug frame but stay readable.
        tx = r.left - PAD;
        ty = r.top - PAD;
        tw = r.width + PAD * 2;
        th = r.height + PAD * 2;
      } else {
        const s = m.down ? IDLE * 0.7 : IDLE;
        tx = m.x - s / 2;
        ty = m.y - s / 2;
        tw = s;
        th = s;
      }
      const k = target ? 0.24 : 0.2;
      f.x += (tx - f.x) * k;
      f.y += (ty - f.y) * k;
      f.w += (tw - f.w) * k;
      f.h += (th - f.h) * k;

      const frame = frameRef.current;
      const dot = dotRef.current;
      if (frame && dot) {
        const visible = m.on && !text;
        frame.style.opacity = visible ? "1" : "0";
        frame.style.transform = `translate3d(${f.x}px, ${f.y}px, 0)`;
        frame.style.width = `${f.w}px`;
        frame.style.height = `${f.h}px`;
        frame.dataset.active = target ? "true" : "false";
        dot.style.opacity = visible ? "1" : "0";
        dot.style.transform = `translate3d(${m.x}px, ${m.y}px, 0) translate(-50%, -50%) scale(${m.down ? 0.6 : target ? 0.5 : 1})`;
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      html.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100]">
      <div ref={frameRef} className="sel-cursor" data-active="false">
        <i />
        <i />
        <i />
        <i />
        {label && (
          <span className="sel-cursor__label">
            {label}
          </span>
        )}
      </div>
      <div ref={dotRef} className="sel-cursor__dot" />
    </div>
  );
}
