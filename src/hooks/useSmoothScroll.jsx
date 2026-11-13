import { createContext, useCallback, useContext, useEffect, useRef } from "react";
import Lenis from "lenis";
import { useReducedMotion } from "framer-motion";

const ScrollContext = createContext({ scrollTo: () => {}, stop: () => {}, start: () => {} });

const NAV_OFFSET = -24;

/** Provides Lenis smooth scrolling (disabled when the user prefers reduced motion). */
export function SmoothScrollProvider({ children }) {
  const lenisRef = useRef(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return undefined;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;
    // The swarm intro may already have locked scrolling before Lenis was created.
    if (document.documentElement.classList.contains("swarm-locked")) lenis.stop();

    let frame;
    const raf = (time) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reduceMotion]);

  const scrollTo = useCallback((target) => {
    const el = typeof target === "string" ? document.getElementById(target.replace("#", "")) : target;
    if (!el) return;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(el, { offset: NAV_OFFSET });
    } else {
      const top = el.getBoundingClientRect().top + window.scrollY + NAV_OFFSET;
      window.scrollTo({ top, behavior: "auto" });
    }
  }, []);

  const stop = useCallback(() => lenisRef.current?.stop(), []);
  const start = useCallback(() => lenisRef.current?.start(), []);

  return <ScrollContext.Provider value={{ scrollTo, stop, start }}>{children}</ScrollContext.Provider>;
}

export const useSmoothScroll = () => useContext(ScrollContext);
