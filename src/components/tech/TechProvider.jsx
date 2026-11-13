import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, BookOpen, X } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { TECH, techKey } from "../../data/tech";
import { useSmoothScroll } from "../../hooks/useSmoothScroll";
import { useSwarm } from "../../swarm/SwarmProvider";
import TechIcon, { techMap } from "../ui/TechIcon";

const TechContext = createContext({ open: () => {} });
export const useTech = () => useContext(TechContext);

/** Holds the "which technology is open" state and renders the details popup. */
export function TechProvider({ children }) {
  const [key, setKey] = useState(null);
  const { pause } = useSwarm();
  const open = useCallback(
    (label) => {
      const k = techKey(label);
      if (!k) return;
      pause();
      setKey(k);
    },
    [pause]
  );
  const close = useCallback(() => setKey(null), []);

  return (
    <TechContext.Provider value={{ open }}>
      {children}
      <AnimatePresence>{key && <TechModal key={key} tech={TECH[key]} onClose={close} />}</AnimatePresence>
    </TechContext.Provider>
  );
}

/**
 * A technology label that opens its details. Renders a plain span when the label is unknown.
 * `as="span"` keeps it a span (with role=button) for places where a <button> can't be nested.
 */
export function TechChip({ label, children, className = "", showIcon = false, iconSize = 13 }) {
  const { open } = useTech();
  const k = techKey(label);
  if (!k) return <span className={className}>{children ?? label}</span>;
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        open(label);
      }}
      data-cursor="Details"
      aria-haspopup="dialog"
      aria-label={`${TECH[k].name} — show details`}
      className={`tech-chip ${className}`}
    >
      {showIcon && <TechIcon name={TECH[k].icon} size={iconSize} />}
      {children ?? label}
    </button>
  );
}

function TechModal({ tech, onClose }) {
  const { stop, start } = useSmoothScroll();
  const panelRef = useRef(null);
  const firstRef = useRef(null);
  const color = techMap[tech.icon]?.color ?? "#E5252A";
  const [main, ...others] = tech.repos;

  useEffect(() => {
    const prev = document.activeElement;
    stop();
    firstRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !panelRef.current) return;
      const f = panelRef.current.querySelectorAll("a[href], button");
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (!document.querySelector('[role="dialog"][data-modal="project"]')) start();
      prev?.focus?.({ preventScroll: true });
    };
  }, [onClose, stop, start]);

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-end justify-center p-3 sm:items-center sm:p-6">
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tech-title"
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 320, damping: 30 }}
        className="noise relative w-full max-w-md overflow-hidden rounded-xl border border-white/10 bg-ink-900 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)]"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full opacity-30 blur-[80px]"
          style={{ background: color }}
        />
        {/* Selection-style corners, like the swarm's boxes */}
        <span aria-hidden="true" className="absolute left-2 top-2 h-3 w-3 border-l-2 border-t-2 border-accent" />
        <span aria-hidden="true" className="absolute bottom-2 right-2 h-3 w-3 border-b-2 border-r-2 border-accent" />

        <div className="relative p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <motion.span
                initial={{ rotate: -20, scale: 0.6 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.05 }}
                className="flex h-14 w-14 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]"
                style={{ color, boxShadow: `0 0 30px -6px ${color}` }}
              >
                <TechIcon name={tech.icon} size={28} />
              </motion.span>
              <div>
                <p className="kicker !text-[10px] text-accent">{tech.category}</p>
                <h2 id="tech-title" className="heading mt-1 text-[2.1rem] leading-none text-bone">
                  {tech.name}
                </h2>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-mute transition-colors hover:border-accent hover:text-bone"
            >
              <X size={16} />
            </button>
          </div>

          <p className="mt-5 text-[14.5px] leading-relaxed text-bone/75">{tech.text}</p>

          {tech.repos.length > 0 ? (
            <div className="mt-5">
              <p className="kicker !text-[10px] text-mute">Used in</p>
              <ul className="mt-2 divide-y divide-white/[0.06] rounded-md border border-line">
                {tech.repos.map((r) => (
                  <li key={r.url}>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-center justify-between gap-3 px-3.5 py-2.5 text-[13.5px] transition-colors hover:bg-white/[0.03]"
                    >
                      <span className="flex min-w-0 items-center gap-2.5">
                        <SiGithub size={13} className="shrink-0 text-mute group-hover:text-bone" />
                        <span className="truncate text-bone">{r.label}</span>
                        <span className="hidden truncate font-mono text-[10.5px] text-dim sm:inline">{r.note}</span>
                      </span>
                      <ArrowUpRight size={14} className="shrink-0 text-mute transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="mt-5 rounded-md border border-dashed border-line px-3.5 py-2.5 font-mono text-[11px] text-dim">
              Part of my daily toolkit — no dedicated public repository yet.
            </p>
          )}

          <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
            <a
              ref={firstRef}
              href={tech.docs}
              target="_blank"
              rel="noreferrer"
              data-cursor="Docs"
              className="btn-sweep inline-flex h-11 items-center justify-center gap-2 rounded-md bg-bone px-4 text-[12px] font-semibold uppercase tracking-[0.08em] text-ink-950 transition-colors hover:bg-white"
            >
              <BookOpen size={15} /> Official docs
            </a>
            {main ? (
              <a
                href={main.url}
                target="_blank"
                rel="noreferrer"
                data-cursor="GitHub"
                className="btn-sweep inline-flex h-11 items-center justify-center gap-2 rounded-md bg-accent px-4 text-[12px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-accent-soft"
              >
                <SiGithub size={15} /> GitHub project
              </a>
            ) : (
              <a
                href="https://github.com/lahfamostafa"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-white/15 px-4 text-[12px] font-semibold uppercase tracking-[0.08em] text-bone transition-colors hover:border-white/40"
              >
                <SiGithub size={15} /> My GitHub
              </a>
            )}
          </div>
          {others.length > 0 && main && (
            <p className="mt-3 text-center font-mono text-[10.5px] text-dim">
              GitHub project opens <span className="text-mute">{main.label}</span> · {others.length} more above
            </p>
          )}
        </div>
      </motion.div>
    </div>,
    document.body
  );
}
