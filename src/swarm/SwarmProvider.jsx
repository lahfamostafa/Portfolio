import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Pause, Play, RotateCcw, SkipForward, Volume2, VolumeX } from "lucide-react";
import SwarmEngine from "./SwarmEngine";
import TourController from "./tour";
import { AGENT_COLORS } from "./agents";
import { useSmoothScroll } from "../hooks/useSmoothScroll";
import IntroMusic from "./music";
import { personal } from "../data/personal";

const SwarmContext = createContext({ enabled: false, phase: "done", replay: () => {}, pause: () => {} });
export const useSwarm = () => useContext(SwarmContext);

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const html = () => document.documentElement;

/**
 * Owns the canvas, the overlay layer and the guided build tour.
 * With prefers-reduced-motion nothing is hidden, no agent renders and there is no tour.
 */
export function SwarmProvider({ children }) {
  const [enabled] = useState(() => !prefersReducedMotion());
  const [state, setState] = useState({ phase: enabled ? "tour" : "done", touring: enabled, seconds: 0 });
  const [agentCount, setAgentCount] = useState(0);
  const [gate, setGate] = useState(false); // entry screen (only when a soundtrack exists)
  const [hasMusic, setHasMusic] = useState(false);
  const [muted, setMuted] = useState(false);
  const musicRef = useRef(null);
  const { stop, start } = useSmoothScroll();

  const canvasRef = useRef(null);
  const progressRef = useRef(null);
  const layersRef = useRef(null);
  const tourRef = useRef(null);

  // Lenis controls may change identity; the controller always calls the latest ones.
  const lenisRef = useRef({ stop, start });
  lenisRef.current = { stop, start };

  useLayoutEffect(() => {
    if (!enabled) {
      html().classList.remove("swarm-tour", "swarm-locked");
      return undefined;
    }
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";

    const count = window.innerWidth < 768 ? 12 : 24;
    const engine = new SwarmEngine(canvasRef.current, { count });
    engine.start();
    setAgentCount(count);

    const layer = document.createElement("div");
    layer.className = "swarm-layer";
    layer.setAttribute("aria-hidden", "true");
    document.body.appendChild(layer);

    const tour = new TourController({
      engine,
      layer,
      lenis: { stop: () => lenisRef.current.stop(), start: () => lenisRef.current.start() },
      onState: setState,
      ui: {
        get progress() {
          return progressRef.current;
        },
        get layers() {
          return layersRef.current;
        },
      },
    });
    tourRef.current = tour;
    tour.prime(); // hide buildable content before the first paint

    const music = new IntroMusic(personal.intro?.music ?? {});
    musicRef.current = music;

    // Wait (briefly) for fonts so every measurement is final. With a soundtrack, show the entry
    // screen first: browsers only allow audio after a click.
    let cancelled = false;
    const fonts = document.fonts?.ready ?? Promise.resolve();
    Promise.all([Promise.race([fonts, new Promise((r) => setTimeout(r, 1200))]), music.isAvailable()]).then(
      ([, available]) => {
        if (cancelled) return;
        setHasMusic(available);
        if (available) setGate(true);
        else tour.start();
      }
    );

    return () => {
      cancelled = true;
      music.destroy();
      tour.destroy();
      engine.destroy();
      layer.remove();
      tourRef.current = null;
    };
  }, [enabled]);

  const enter = useCallback((withSound) => {
    setGate(false);
    setMuted(!withSound);
    const music = musicRef.current;
    if (music) {
      music.muted = !withSound;
      if (withSound) music.play();
    }
    tourRef.current?.start();
  }, []);

  const replay = useCallback(() => {
    const music = musicRef.current;
    if (music && hasMusic && !music.muted) music.play();
    tourRef.current?.replay();
  }, [hasMusic]);
  const pause = useCallback(() => tourRef.current?.pause(), []);
  const toggleSound = useCallback(() => {
    const music = musicRef.current;
    if (!music) return;
    const next = !music.muted;
    music.setMuted(next);
    if (!next && !music.playing && state.phase !== "done") music.play();
    setMuted(next);
  }, [state.phase]);

  // The soundtrack follows the build: it fades out once the swarm is done (or skipped).
  useEffect(() => {
    if (state.phase === "done") musicRef.current?.stop(3500);
  }, [state.phase]);
  const value = useMemo(() => ({ enabled, phase: state.phase, replay, pause }), [enabled, state.phase, replay, pause]);

  return (
    <SwarmContext.Provider value={value}>
      {enabled && (
        <Toolbar
          state={state}
          agents={agentCount}
          progressRef={progressRef}
          layersRef={layersRef}
          onPause={() => tourRef.current?.pause()}
          onResume={() => tourRef.current?.resume()}
          onSkip={() => tourRef.current?.skip()}
          onReplay={replay}
          sound={hasMusic ? { muted, toggle: toggleSound } : null}
        />
      )}
      <AnimatePresence>{enabled && gate && <EntryGate onEnter={enter} agents={agentCount} />}</AnimatePresence>
      {children}
      {enabled && <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[90]" />}
    </SwarmContext.Provider>
  );
}

function Toolbar({ state, agents, progressRef, layersRef, onPause, onResume, onSkip, onReplay, sound }) {
  const { phase, touring, seconds } = state;
  const live = phase === "tour" || phase === "finale";
  const btn =
    "inline-flex h-8 items-center gap-1.5 rounded-full px-3 font-mono text-[10.5px] uppercase tracking-[0.1em] transition-colors";

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[95] flex justify-center px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <div
        role="toolbar"
        aria-label="Live build controls"
        className="pointer-events-auto flex max-w-full items-center gap-2 overflow-hidden rounded-full border border-white/10 bg-ink-900/85 p-1.5 pl-3 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl"
      >
        <span className="hidden items-center -space-x-1 sm:flex" aria-hidden="true">
          {AGENT_COLORS.slice(0, 6).map((c) => (
            <span key={c} className="h-3 w-3 rounded-full ring-2 ring-ink-900" style={{ background: c }} />
          ))}
        </span>

        <p className="whitespace-nowrap font-mono text-[10.5px] uppercase tracking-[0.08em] text-mute" role="status" aria-live="polite">
          {live ? (
            <>
              <span className="text-bone">{agents} agents</span>
              <span className="mx-1.5 hidden text-dim sm:inline">·</span>
              <span className="hidden sm:inline">
                <span ref={layersRef}>0 / 0</span> layers
              </span>
            </>
          ) : (
            <>
              <span className="hidden sm:inline">Built by </span>
              <span className="text-bone">{agents} agents</span>
              <span className="hidden sm:inline"> in {seconds}s</span>
            </>
          )}
        </p>

        <div className="relative h-1 w-16 overflow-hidden rounded-full bg-white/10 sm:w-28" aria-hidden="true">
          <div ref={progressRef} className="absolute inset-0 origin-left scale-x-0 bg-accent" />
        </div>

        {sound && (
          <button
            type="button"
            onClick={sound.toggle}
            aria-pressed={!sound.muted}
            aria-label={sound.muted ? "Turn sound on" : "Mute sound"}
            className={`${btn} bg-white/[0.06] text-bone hover:bg-white/10`}
          >
            {sound.muted ? <VolumeX size={12} /> : <SoundBars />}
          </button>
        )}

        {live ? (
          <>
            <button
              type="button"
              onClick={touring ? onPause : onResume}
              className={`${btn} ${touring ? "bg-accent/15 text-accent-soft" : "bg-white/[0.06] text-bone hover:bg-white/10"}`}
              aria-pressed={touring}
              aria-label={touring ? "Pause the guided tour" : "Resume the guided tour"}
            >
              {touring ? <Pause size={11} /> : <Play size={11} />}
              <span className="hidden sm:inline">{touring ? "Touring" : "Resume tour"}</span>
            </button>
            <button type="button" onClick={onSkip} className={`${btn} bg-bone text-ink-950 hover:bg-white`}>
              <SkipForward size={11} /> Skip
            </button>
          </>
        ) : (
          <button type="button" onClick={onReplay} className={`${btn} bg-bone text-ink-950 hover:bg-white`}>
            <RotateCcw size={11} /> Replay
          </button>
        )}
      </div>
    </div>
  );
}

/** Small animated equaliser shown while the soundtrack plays. */
function SoundBars() {
  return (
    <span className="flex h-3 items-end gap-[2px]" aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <span key={i} className="eq-bar w-[2px] rounded-full bg-accent" style={{ animationDelay: `${i * 0.15}s` }} />
      ))}
    </span>
  );
}

/** Entry screen — needed because browsers only start audio after a click. */
function EntryGate({ onEnter, agents }) {
  const btnRef = useRef(null);
  useEffect(() => {
    btnRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Enter") onEnter(true);
      if (e.key === "Escape") onEnter(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onEnter]);
  const track = personal.intro?.music?.title;

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="gate-title"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.65, 0, 0.35, 1] } }}
      className="fixed inset-0 z-[99] flex flex-col items-center justify-center overflow-hidden bg-ink-950 px-6 text-center"
    >
      <div aria-hidden="true" className="grid-bg absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000,transparent)]" />
      <div aria-hidden="true" className="absolute left-1/2 top-1/2 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/15 blur-[140px]" />
      <span aria-hidden="true" className="neon-bar absolute left-6 top-1/4 h-1/2 w-[3px] rounded-full" />
      <span aria-hidden="true" className="neon-bar absolute right-6 top-1/4 h-1/2 w-[3px] rounded-full" />

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="kicker relative text-accent"
      >
        [ System ready · {agents} agents standing by ]
      </motion.p>
      <motion.h1
        id="gate-title"
        initial={{ opacity: 0, y: 30, letterSpacing: "0.2em" }}
        animate={{ opacity: 1, y: 0, letterSpacing: "0.01em" }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        className="heading relative mt-6 text-[clamp(3.6rem,13vw,10rem)] leading-[0.85] text-bone"
      >
        Mostafa <span className="text-portfolio">Lahfa</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="relative mt-6 max-w-md text-[15px] leading-relaxed text-mute"
      >
        This portfolio builds itself live. Turn your sound on and watch the swarm assemble it.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="relative mt-10 flex flex-col items-center gap-4 sm:flex-row"
      >
        <button
          ref={btnRef}
          type="button"
          onClick={() => onEnter(true)}
          data-cursor="Enter"
          className="btn-sweep group relative inline-flex h-14 items-center gap-3 rounded-md bg-accent px-8 text-[13px] font-semibold uppercase tracking-[0.12em] text-white shadow-[0_0_0_8px_rgba(229,37,42,0.15),0_20px_60px_-15px_rgba(229,37,42,0.9)] hover:bg-accent-soft"
        >
          <span className="absolute inset-0 -z-10 animate-ping rounded-md bg-accent/30 [animation-duration:2s]" />
          <Volume2 size={18} /> Enter with sound
        </button>
        <button
          type="button"
          onClick={() => onEnter(false)}
          className="inline-flex h-14 items-center gap-2 rounded-md border border-white/15 px-6 text-[12px] font-semibold uppercase tracking-[0.12em] text-bone transition-colors hover:border-white/40"
        >
          <VolumeX size={16} /> Enter silently
        </button>
      </motion.div>

      {track && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="relative mt-10 flex items-center gap-3 font-mono text-[10.5px] uppercase tracking-[0.16em] text-dim"
        >
          <SoundBars /> Now playing · {track}
        </motion.p>
      )}
    </motion.div>
  );
}

/** "↻ Watch the swarm build" — replays the whole build tour from the top. */
export function ReplayButton({ className = "" }) {
  const { enabled, replay, phase } = useSwarm();
  if (!enabled) return null;
  return (
    <button
      type="button"
      onClick={replay}
      disabled={phase !== "done"}
      data-cursor="Replay"
      className={`group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-mute transition-colors hover:text-bone disabled:opacity-40 ${className}`}
    >
      <RotateCcw size={13} className="transition-transform duration-700 group-hover:-rotate-[360deg]" />
      Watch the swarm build
    </button>
  );
}
