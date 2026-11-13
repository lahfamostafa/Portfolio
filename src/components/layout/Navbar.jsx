import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { navLinks, personal, socials } from "../../data/personal";
import { useActiveSection } from "../../hooks/useActiveSection";
import { useSmoothScroll } from "../../hooks/useSmoothScroll";
import { ease } from "../../animations/variants";
import Magnetic from "../ui/Magnetic";
import SocialIcon from "../ui/SocialIcon";

const ids = navLinks.map((l) => l.id);

export default function Navbar() {
  const active = useActiveSection(ids);
  const { scrollTo, stop, start } = useSmoothScroll();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 40);
    setHidden(y > 600 && y > prev + 4 && !open);
    if (y < prev - 4) setHidden(false);
  });

  // Lock scroll while the mobile menu is open; close it on Escape.
  useEffect(() => {
    if (open) stop();
    else start();
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, stop, start]);

  const go = (e, id) => {
    e.preventDefault();
    setOpen(false);
    // Wait a frame so the scroll lock is released before scrolling.
    requestAnimationFrame(() => scrollTo(id));
    history.replaceState(null, "", id === "home" ? " " : `#${id}`);
  };

  return (
    <>
      <motion.header
        initial={false}
        animate={{ y: hidden ? -100 : 0, opacity: 1 }}
        transition={{ duration: 0.6, ease }}
        className={`fixed inset-x-0 top-0 z-50 pb-3 pt-3 transition-colors duration-500 sm:pt-4 ${scrolled ? "bg-gradient-to-b from-ink-950 via-ink-950/85 to-transparent" : ""}`}
      >
        <nav
          aria-label="Primary"
          className={`container-x flex items-center justify-between transition-all duration-500`}
        >
          <a
            href="#home"
            onClick={(e) => go(e, "home")}
            className="group relative flex items-center gap-3"
            aria-label={`${personal.name} — back to top`}
          >
            <span className="heading text-[1.55rem] leading-none tracking-[0.01em] text-bone">
              {personal.name}
              <span className="text-accent">.</span>
            </span>
          </a>

          {/* Desktop pill */}
          <div
            className={`absolute left-1/2 hidden -translate-x-1/2 items-center rounded-full p-1.5 transition-all duration-500 lg:flex ${
              scrolled ? "glass shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)]" : "border border-transparent"
            }`}
          >
            {navLinks.map((link) => {
              const isActive = active === link.id;
              return (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => go(e, link.id)}
                  aria-current={isActive ? "true" : undefined}
                  className={`relative rounded-full px-4 py-2 text-[13px] transition-colors duration-300 after:absolute after:inset-x-4 after:bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 hover:after:scale-x-100 ${
                    isActive ? "text-bone" : "text-mute hover:text-bone"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 -z-10 rounded-full bg-white/[0.08] ring-1 ring-white/10"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  {link.label}
                </a>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <Magnetic strength={0.2} className="hidden sm:inline-block">
              <a
                href="#contact"
                onClick={(e) => go(e, "contact")}
                className="btn-sweep group inline-flex h-10 items-center gap-2 rounded-md bg-accent pl-5 pr-4 text-[12px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-accent-soft"
              >
                Let&apos;s Talk
                <ArrowUpRight
                  size={15}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            </Magnetic>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-ink-900/80 backdrop-blur-md lg:hidden"
            >
              <span className="relative block h-3 w-4">
                <span
                  className={`absolute left-0 top-0 h-[1.5px] w-4 bg-bone transition-all duration-500 ${
                    open ? "top-[5px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`absolute bottom-0 left-0 h-[1.5px] w-4 bg-bone transition-all duration-500 ${
                    open ? "bottom-[5px] -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
            className="fixed inset-0 z-40 flex flex-col bg-ink-950/95 backdrop-blur-xl lg:hidden"
            initial={{ clipPath: "circle(0% at calc(100% - 40px) 36px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 40px) 36px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 40px) 36px)" }}
            transition={{ duration: 0.7, ease }}
          >
            <div className="grid-bg mask-radial pointer-events-none absolute inset-0 opacity-50" />
            <div className="container-x relative flex flex-1 flex-col justify-center pt-20">
              <p className="label mb-6">Menu</p>
              <ul className="space-y-1">
                {navLinks.map((link, i) => (
                  <li key={link.id} className="overflow-hidden">
                    <motion.a
                      href={`#${link.id}`}
                      onClick={(e) => go(e, link.id)}
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      transition={{ duration: 0.7, ease, delay: 0.15 + i * 0.05 }}
                      className={`flex items-baseline gap-4 py-1 text-[clamp(2.4rem,11vw,4rem)] font-medium leading-[1.05] tracking-tightest ${
                        active === link.id ? "text-bone" : "text-white/40"
                      }`}
                    >
                      <span className="font-mono text-xs text-accent-soft">0{i + 1}</span>
                      {link.label}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="container-x relative flex items-center justify-between border-t border-line py-6"
            >
              <a href={`mailto:${personal.email}`} className="truncate text-sm text-mute">
                {personal.email}
              </a>
              <div className="flex gap-2">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-mute"
                  >
                    <SocialIcon name={s.icon} />
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
