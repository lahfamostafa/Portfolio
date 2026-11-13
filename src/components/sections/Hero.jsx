import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowDownRight, Download } from "lucide-react";
import { personal, stats } from "../../data/personal";
import { useSmoothScroll } from "../../hooks/useSmoothScroll";
import { ReplayButton } from "../../swarm/SwarmProvider";
import TechIcon from "../ui/TechIcon";
import { TechChip } from "../tech/TechProvider";
import Magnetic from "../ui/Magnetic";

const heroStack = [
  { icon: "java", label: "Java / Spring Boot" },
  { icon: "react", label: "React / Next.js" },
  { icon: "laravel", label: "Laravel" },
  { icon: "postgres", label: "PostgreSQL / MySQL" },
];

export default function Hero() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollTo } = useSmoothScroll();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const wordY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 160]);
  const photoY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 60]);

  // Mouse parallax: the portrait tilts toward the pointer, PORTFOLIO drifts the other way.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 70, damping: 18 });
  const smy = useSpring(my, { stiffness: 70, damping: 18 });
  const tiltY = useTransform(smx, [-0.5, 0.5], [-7, 7]);
  const tiltX = useTransform(smy, [-0.5, 0.5], [5, -5]);
  const photoX = useTransform(smx, [-0.5, 0.5], [-14, 14]);
  const wordX = useTransform(smx, [-0.5, 0.5], [34, -34]);
  const glowX = useTransform(smx, [-0.5, 0.5], ["35%", "65%"]);
  const glowY = useTransform(smy, [-0.5, 0.5], ["30%", "60%"]);
  const onMove = (e) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <section
      id="home"
      ref={ref}
      data-block="hero"
      aria-label="Introduction"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="group/hero relative isolate overflow-hidden pb-24 pt-24 lg:flex lg:min-h-[max(100svh,760px)] lg:flex-col lg:pb-16 lg:pt-24"
    >
      {/* ——— Atmosphere ——— */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20">
        <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_35%,rgba(229,37,42,0.16),transparent_70%)]" />
        <div className="grid-bg absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,#000,transparent_80%)]" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-b from-transparent to-ink-950" />
      </div>
      <div aria-hidden="true" data-b="fade" className="neon-bar absolute left-3 top-[18%] -z-10 hidden h-[58%] w-[3px] rounded-full lg:block" />
      <div aria-hidden="true" data-b="fade" className="neon-bar absolute right-3 top-[26%] -z-10 hidden h-[46%] w-[3px] rounded-full lg:block" />

      {/* Wireframes the agents sketch first */}
      <div className="container-x relative flex flex-1 flex-col">
        {/* Top line */}
        <div className="flex items-center justify-between gap-6">
          <p data-b="fade" className="kicker flex items-center gap-4 text-accent">
            {personal.hero.eyebrow}
            <span className="hidden h-px w-40 bg-gradient-to-r from-accent to-transparent sm:block" />
          </p>
          <p data-b="fade" className="kicker hidden items-center gap-3 text-mute md:flex">
            {personal.hero.motto.map((m, i) => (
              <span key={m} className="flex items-center gap-3">
                {i > 0 && <span className="h-1 w-1 rounded-full bg-accent" />}
                {m}
              </span>
            ))}
          </p>
        </div>

        {/* PORTFOLIO + portrait */}
        <div className="relative mt-6 lg:absolute lg:inset-x-0 lg:bottom-0 lg:top-14 lg:mt-0">
          <motion.p
            aria-hidden="true"
            style={{ y: wordY, x: wordX }}
            className="relative z-0 text-center lg:absolute lg:inset-x-0 lg:top-[6%]"
          >
            <span data-b="reveal" className="text-portfolio inline-block text-[clamp(5.2rem,21.5vw,20.5rem)]">
              Portfolio
            </span>
          </motion.p>
          <div className="relative z-10 mx-auto -mt-[14vw] h-[min(118vw,560px)] w-full max-w-[560px] lg:absolute lg:inset-x-0 lg:bottom-0 lg:mt-0 lg:flex lg:h-[88%] lg:max-w-none lg:justify-center">
            <motion.div
              aria-hidden="true"
              style={{ left: glowX, top: glowY }}
              className="pointer-events-none absolute h-[60%] w-[46%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/30 opacity-60 blur-[90px] transition-opacity duration-700 group-hover/hero:opacity-100"
            />
            <motion.div
              style={{ y: photoY, x: photoX, rotateY: tiltY, rotateX: tiltX, transformPerspective: 1200 }}
              className="relative h-full"
            >
            <img
              data-b="reveal"
              src="/images/portrait-cutout.webp"
              alt={`${personal.name}, Full Stack Developer`}
              width="1155"
              height="1300"
              fetchpriority="high"
              className="mx-auto h-full w-auto object-contain object-bottom transition-[filter] duration-700 [mask-image:linear-gradient(to_bottom,#000_72%,transparent_98%)] group-hover/hero:brightness-110 group-hover/hero:drop-shadow-[0_0_40px_rgba(229,37,42,0.35)]"
              />
            </motion.div>
          </div>
        </div>

        {/* Columns */}
        <div className="pointer-events-none relative z-20 mt-2 grid flex-1 gap-12 lg:mt-0 lg:grid-cols-12 lg:items-end lg:pt-[30vh] [&>*]:pointer-events-auto">
          {/* Left */}
          <div data-b="frame" data-tag="hero / intro" className="lg:col-span-4">
            <p data-b="fade" className="font-script text-[2.6rem] leading-none text-bone/90">
              Hello, I&apos;m
            </p>
            <h1 className="heading mt-1 text-[clamp(3.2rem,5.2vw,4.6rem)] text-bone">
              <span className="block">
                <span data-b="type" className="glitch">
                  {personal.firstName}
                </span>
              </span>
              <span className="block">
                <span data-b="type" className="glitch">
                  {personal.lastName}
                </span>
                <span className="text-accent">.</span>
              </span>
            </h1>
            <p className="kicker mt-4 text-accent">
              <span data-b="type">Full Stack · Java &amp; Spring Boot</span>
            </p>
            <p className="pretty mt-3 max-w-sm text-[14.5px] leading-relaxed text-mute">
              <span data-b="type">{personal.hero.intro}</span>
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span data-b="pop" className="inline-block">
                <Magnetic strength={0.25}>
                  <a
                    href="#projects"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollTo("projects");
                    }}
                    className="btn-sweep group inline-flex h-12 items-center gap-2.5 rounded-md bg-accent px-6 text-[13px] font-semibold uppercase tracking-[0.08em] text-white shadow-[0_14px_40px_-12px_rgba(229,37,42,0.9)] transition-colors hover:bg-accent-soft"
                  >
                    View my work
                    <ArrowDownRight size={16} className="transition-transform duration-300 group-hover:rotate-[-45deg]" />
                  </a>
                </Magnetic>
              </span>
              {personal.cvUrl && (
                <a
                  data-b="pop"
                  href={personal.cvUrl}
                  download
                  className="inline-flex h-12 items-center gap-2 rounded-md border border-white/15 px-5 text-[13px] font-semibold uppercase tracking-[0.08em] text-bone transition-colors hover:border-white/40"
                >
                  <Download size={15} /> CV
                </a>
              )}
            </div>
            <ul data-b="dup" className="mt-6 flex max-w-md flex-wrap gap-x-5 gap-y-2.5">
              {heroStack.map((s) => (
                <li data-dup key={s.label}>
                  <TechChip label={s.label.split(" /")[0]} className="group/tech gap-2 rounded-md text-[13px] text-bone/85 hover:!bg-transparent">
                    <span className="flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-white/[0.03] text-accent transition-all duration-300 group-hover/tech:-translate-y-0.5 group-hover/tech:border-accent group-hover/tech:shadow-[0_0_14px_rgba(229,37,42,0.5)]">
                      <TechIcon name={s.icon} size={13} />
                    </span>
                    {s.label}
                  </TechChip>
                </li>
              ))}
            </ul>
          </div>

          <div className="hidden lg:col-span-4 lg:block" />

          {/* Right */}
          <div data-b="frame" data-tag="hero / signature" className="flex flex-col lg:col-span-4 lg:items-end lg:text-right">
            <ul data-b="dup" className="grid grid-cols-3 gap-4 lg:grid-cols-1 lg:gap-3">
              {stats.map((s) => (
                <li data-dup key={s.label} className="lg:flex lg:items-baseline lg:justify-end lg:gap-4">
                  <span className="kicker hidden max-w-[11rem] text-right !tracking-[0.14em] text-mute lg:block">
                    {s.label}
                  </span>
                  <span className="stroke-hover heading block text-[clamp(2.6rem,3.4vw,3rem)] text-bone">
                    {s.value}
                    <span className="text-accent">.</span>
                  </span>
                  <span className="kicker mt-1 block !text-[9.5px] !tracking-[0.12em] text-mute lg:hidden">{s.label}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 lg:mt-8">
              <p data-b="reveal" className="font-script text-[clamp(3rem,4.4vw,4rem)] leading-none text-bone">
                {personal.name}
              </p>
              <svg data-b="line" viewBox="0 0 260 14" className="mt-1 h-3.5 w-60 lg:ml-auto" aria-hidden="true">
                <path d="M2 11 C 70 2, 170 2, 258 6" fill="none" stroke="#E5252A" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              <p data-b="fade" className="kicker mt-3 !tracking-[0.3em] text-bone/80">
                Software Developer
              </p>
              <p data-b="pop" className="mt-5 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-bone">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full bg-accent" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
                </span>
                {personal.availability}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          data-b="fade"
          className="relative z-20 mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-line bg-ink-950/40 pt-5 backdrop-blur-sm lg:mt-8"
        >
          <ReplayButton />
          <span className="kicker hidden text-dim sm:inline">Scroll to explore</span>
          <span className="kicker text-dim">Oujda · Morocco</span>
        </div>
      </div>
    </section>
  );
}
