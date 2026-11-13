import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Plus } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { otherProjects, projects } from "../../data/projects";
import { useSwarm } from "../../swarm/SwarmProvider";
import { TechChip } from "../tech/TechProvider";
import Heading from "../ui/Heading";
import ProjectPreview from "./projects/ProjectPreview";
import ProjectModal from "./projects/ProjectModal";

const filters = [
  { id: "all", label: "All", test: () => true },
  { id: "java", label: "Java / Spring", test: (p) => /java|spring/i.test(p.category + p.stack.join(" ")) },
  { id: "laravel", label: "Laravel / PHP", test: (p) => /laravel/i.test(p.stack.join(" ")) },
  { id: "automation", label: "Automation", test: (p) => /automation|ocr/i.test(p.category + p.title) },
];

/** Full-card click target that sits under the content (so tech chips stay clickable). */
function CardLink({ project, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(project)}
      data-cursor="Open"
      aria-label={`Open ${project.title} details`}
      className="absolute inset-0 z-0 rounded-[inherit]"
    />
  );
}

/** AffiliateLink — the featured, wider and different-looking card. */
function FeaturedCard({ project, onOpen }) {
  return (
    <article data-block={`card-${project.id}`} className="md:col-span-2 lg:col-span-3">
      <div
        data-b="frame"
        data-tag="featured / affiliatelink"
        className="group noise relative overflow-hidden rounded-xl border border-accent/25 bg-[linear-gradient(120deg,rgba(142,14,18,0.55),#0d0d0f_45%,#0d0d0f)] transition-colors duration-500 hover:border-accent/60"
      >
        <CardLink project={project} onOpen={onOpen} />
        <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-accent" />
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-30 [mask-image:linear-gradient(to_right,#000,transparent_70%)]" />

        <div className="pointer-events-none relative grid items-center gap-10 p-6 sm:p-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p data-b="fade" className="kicker flex flex-wrap items-center gap-3 text-accent">
              <span className="rounded-sm bg-accent px-2 py-1 !text-[9.5px] font-semibold text-white">Featured</span>
              {project.category}
            </p>
            <h3 className="heading mt-6 whitespace-nowrap text-[clamp(2.6rem,5.4vw,5.2rem)] leading-[0.86] text-bone">
              <span data-b="type" className="glitch">
                {project.title}
              </span>
              <span className="text-accent">.</span>
            </h3>
            <p data-b="fade" className="mt-5 max-w-md text-[17px] leading-snug text-bone/85">
              {project.tagline}
            </p>
            <p data-b="fade" className="mt-3 max-w-md text-[14.5px] leading-relaxed text-mute">
              Modular monolith · REST APIs · tested domain modules.
            </p>

            <ul data-b="dup" className="pointer-events-auto relative z-10 mt-7 flex flex-wrap gap-2">
              {["Java 17", "Spring Boot", "Spring Modulith", "PostgreSQL", "Docker"].map((t) => (
                <li data-dup key={t}>
                  <TechChip
                    label={t}
                    showIcon
                    className="rounded-sm border border-white/15 bg-ink-950/60 px-2.5 py-1.5 font-mono text-[11px] text-bone/85"
                  />
                </li>
              ))}
            </ul>

            <div className="pointer-events-auto relative z-10 mt-8 flex flex-wrap items-center gap-3">
              <button
                data-b="pop"
                type="button"
                onClick={() => onOpen(project)}
                className="btn-sweep inline-flex h-11 items-center gap-2 rounded-md bg-accent px-5 text-[12px] font-semibold uppercase tracking-[0.08em] text-white hover:bg-accent-soft"
              >
                Case study <Plus size={15} />
              </button>
              {project.github && (
                <a
                  data-b="pop"
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-11 items-center gap-2 rounded-md border border-white/15 px-5 text-[12px] font-semibold uppercase tracking-[0.08em] text-bone transition-colors hover:border-white/40"
                >
                  <SiGithub size={14} /> Source
                </a>
              )}
            </div>
          </div>

          <div className="relative lg:col-span-7 [perspective:1400px]">
            <span
              aria-hidden="true"
              className="heading absolute -right-2 -top-16 hidden select-none text-[11rem] leading-none text-transparent [-webkit-text-stroke:1.5px_rgba(229,37,42,0.35)] lg:block"
            >
              {project.number}
            </span>
            <div
              data-b="reveal"
              className="relative transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] lg:[transform:rotateY(-8deg)_rotateX(3deg)] lg:group-hover:[transform:rotateY(0deg)_rotateX(0deg)_translateY(-6px)]"
            >
              <ProjectPreview project={project} />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

/** Uniform card: image, number, title, one light line. Details live in the popup. */
function Card({ project, onOpen }) {
  return (
    <article data-block={`card-${project.id}`} className="h-full">
      <div
        data-b="frame"
        data-tag={`${project.id}.tsx`}
        className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-white/10 bg-ink-850 transition-all duration-500 hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_30px_70px_-35px_rgba(229,37,42,0.6)]"
      >
        <CardLink project={project} onOpen={onOpen} />
        <div data-b="reveal" className="pointer-events-none relative">
          <ProjectPreview project={project} />
        </div>
        <div className="pointer-events-none relative flex flex-1 flex-col p-5">
          <p className="flex items-baseline justify-between gap-3">
            <span className="heading text-[1.9rem] leading-none text-accent transition-transform duration-500 group-hover:-translate-y-1">
              {project.number}
            </span>
            <span className="kicker !text-[9.5px] !tracking-[0.14em] text-dim">{project.year}</span>
          </p>
          <h3 className="heading mt-3 min-h-[2em] text-[1.65rem] leading-[1] text-bone">
            <span data-b="type">{project.title}</span>
          </h3>
          <p data-b="fade" className="mt-3 line-clamp-2 text-[14px] leading-relaxed text-mute">
            {project.tagline}
          </p>
          <div className="mt-auto flex items-center justify-between gap-4 border-t border-line pt-4">
            <span className="kicker !text-[9.5px] !tracking-[0.12em] text-dim">{project.category}</span>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 text-bone transition-all duration-500 group-hover:rotate-45 group-hover:border-accent group-hover:bg-accent">
              <Plus size={15} />
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Work() {
  const [filter, setFilter] = useState("all");
  const [active, setActive] = useState(null);
  const { pause } = useSwarm();
  const close = useCallback(() => setActive(null), []);
  const openProject = useCallback(
    (p) => {
      pause();
      setActive(p);
    },
    [pause]
  );
  const test = filters.find((f) => f.id === filter).test;
  const [featured, ...rest] = projects;
  const visibleRest = useMemo(() => rest.filter(test), [rest, test]);

  return (
    <section id="projects" data-block="work" aria-labelledby="work-title" className="relative py-28 sm:py-36">
      <div className="container-x">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <Heading id="work-title" index="01" kicker="Selected work" lines={["Projects", "that ship."]} />
          <div data-b="fade" role="tablist" aria-label="Filter projects" className="flex flex-wrap gap-1 border-b border-line">
            {filters.map((f) => (
              <button
                key={f.id}
                role="tab"
                type="button"
                aria-selected={filter === f.id}
                onClick={() => setFilter(f.id)}
                className={`relative px-3 pb-3 pt-1 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors ${
                  filter === f.id ? "text-bone" : "text-dim hover:text-bone"
                }`}
              >
                {f.label}
                {filter === f.id && <motion.span layoutId="work-tab" className="absolute inset-x-2 -bottom-px h-0.5 bg-accent" />}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {test(featured) && <FeaturedCard project={featured} onOpen={openProject} />}
          {visibleRest.map((p) => (
            <Card key={p.id} project={p} onOpen={openProject} />
          ))}
        </div>

        {otherProjects.length > 0 && (
          <ul className="mt-10 border-t border-line">
            {otherProjects.map((p) => (
              <li key={p.title}>
                <a
                  data-b="fade"
                  href={p.github}
                  target="_blank"
                  rel="noreferrer"
                  className="group grid gap-2 border-b border-line py-6 sm:grid-cols-12 sm:items-center"
                >
                  <span className="heading text-2xl text-bone transition-transform duration-500 group-hover:translate-x-2 sm:col-span-3">
                    {p.title}
                  </span>
                  <span className="text-[14.5px] text-mute sm:col-span-6">{p.description}</span>
                  <span className="flex items-center justify-between gap-4 sm:col-span-3 sm:justify-end">
                    <span className="font-mono text-[11px] text-dim">{p.stack.join(" · ")}</span>
                    <ArrowUpRight
                      size={18}
                      className="shrink-0 text-mute transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent"
                    />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      <AnimatePresence>{active && <ProjectModal key={active.id} project={active} onClose={close} />}</AnimatePresence>
    </section>
  );
}
