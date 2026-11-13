import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Check, X } from "lucide-react";
import { ease } from "../../../animations/variants";
import { useSmoothScroll } from "../../../hooks/useSmoothScroll";
import Button from "../../ui/Button";
import BrowserFrame from "../../ui/BrowserFrame";
import { TechChip } from "../../tech/TechProvider";
import ProjectPreview from "./ProjectPreview";

/** Full-height project detail sheet with focus trap, Escape to close and scroll lock. */
export default function ProjectModal({ project, onClose }) {
  const { stop, start } = useSmoothScroll();
  const panelRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    stop();
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e) => {
      if (e.key === "Escape" && !document.querySelector("#tech-title")) onClose();
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
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
      document.body.style.overflow = "";
      start();
      previouslyFocused?.focus?.({ preventScroll: true });
    };
  }, [onClose, stop, start]);

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6">
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        onClick={onClose}
      />
      <motion.div
        ref={panelRef}
        role="dialog"
        data-modal="project"
        aria-modal="true"
        aria-labelledby={`modal-title-${project.id}`}
        initial={{ y: "100%", opacity: 0.6 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0.6 }}
        transition={{ duration: 0.7, ease }}
        data-lenis-prevent
        className="scroll-thin relative max-h-[92svh] w-full max-w-5xl overflow-y-auto overscroll-contain rounded-t-[28px] border border-line bg-ink-900 sm:rounded-[28px]"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-80 opacity-40"
          style={{ background: `radial-gradient(60% 100% at 50% 0%, ${project.accent}55, transparent)` }}
        />

        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-ink-900/80 px-6 py-4 backdrop-blur-xl sm:px-10">
          <span className="label">
            {project.number} — {project.category}
          </span>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close project details"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-mute transition-colors hover:border-white/30 hover:text-bone"
          >
            <X size={18} />
          </button>
        </div>

        <div className="relative px-6 pb-12 pt-10 sm:px-10">
          <h2
            id={`modal-title-${project.id}`}
            className="balance text-[clamp(2.2rem,5vw,4rem)] font-medium leading-[1] tracking-tightest"
          >
            {project.title}
          </h2>
          <p className="mt-3 font-display text-xl text-bone/70">{project.tagline}</p>

          <div className="mt-10">
            <ProjectPreview project={project} eager />
          </div>

          <div className="mt-12 grid gap-12 md:grid-cols-12">
            <div className="md:col-span-7">
              <p className="label mb-4">Overview</p>
              <p className="pretty text-[17px] leading-relaxed text-bone/85">{project.description}</p>

              <p className="label mb-4 mt-10">Key features</p>
              <ul className="space-y-3">
                {project.highlights.map((h) => (
                  <li key={h} className="flex gap-3 text-[15.5px] leading-relaxed text-mute">
                    <span
                      className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                      style={{ background: `${project.accent}26`, color: project.accent }}
                    >
                      <Check size={12} strokeWidth={3} />
                    </span>
                    {h}
                  </li>
                ))}
              </ul>
            </div>

            <aside className="md:col-span-5">
              <dl className="divide-y divide-white/[0.08] rounded-2xl border border-line">
                <div className="flex justify-between gap-4 p-5">
                  <dt className="label">Year</dt>
                  <dd className="text-[14px]">{project.year}</dd>
                </div>
                <div className="flex justify-between gap-4 p-5">
                  <dt className="label">Type</dt>
                  <dd className="text-right text-[14px]">{project.category}</dd>
                </div>
                <div className="p-5">
                  <dt className="label mb-3">Stack</dt>
                  <dd className="flex flex-wrap gap-1.5">
                    {project.stack.map((t) => (
                      <TechChip
                        key={t}
                        label={t}
                        showIcon
                        iconSize={11}
                        className="rounded-full border border-transparent bg-white/[0.05] px-2.5 py-1 font-mono text-[11px] text-bone/80"
                      />
                    ))}
                  </dd>
                </div>
              </dl>

              {(project.github || project.demo) && (
                <div className="mt-5 flex flex-wrap gap-3">
                  {project.github && (
                    <Button size="sm" href={project.github} target="_blank" rel="noreferrer" icon={ArrowUpRight} magnetic={false}>
                      View on GitHub
                    </Button>
                  )}
                  {project.demo && (
                    <Button
                      size="sm"
                      variant="ghost"
                      href={project.demo}
                      target="_blank"
                      rel="noreferrer"
                      icon={ArrowUpRight}
                      magnetic={false}
                    >
                      Live Demo
                    </Button>
                  )}
                </div>
              )}
            </aside>
          </div>

          {project.gallery?.length > 0 && (
            <div className="mt-14">
              <p className="label mb-5">Gallery</p>
              <div className="space-y-6">
                {project.gallery.map((g) => (
                  <BrowserFrame key={g.src} url={project.url}>
                    <div className={g.tall ? "scroll-thin max-h-[70svh] overflow-y-auto" : ""} data-lenis-prevent>
                      <img src={g.src} alt={g.alt} loading="lazy" decoding="async" className="block w-full" />
                    </div>
                  </BrowserFrame>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>,
    document.body
  );
}
