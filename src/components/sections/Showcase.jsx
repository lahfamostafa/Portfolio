import { ArrowUpRight } from "lucide-react";
import { projects } from "../../data/projects";
import BrowserFrame from "../ui/BrowserFrame";
import ModulesMockup from "./projects/ModulesMockup";
import { TechChip } from "../tech/TechProvider";

const featured = projects.find((p) => p.id === "affiliatelink") ?? projects[0];

/** "From idea. To production." — a look under the hood of the Java project. */
export default function Showcase() {
  return (
    <section data-block="showcase" aria-labelledby="showcase-title" className="relative overflow-hidden py-28 sm:py-36">
      <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-1/3 h-[30rem] w-[30rem] rounded-full bg-accent/10 blur-[140px]" />
      <div className="container-x grid items-center gap-14 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p data-b="fade" className="kicker text-mute">
            <span className="text-accent">A look</span> under the hood
          </p>
          <h2 id="showcase-title" className="heading mt-5 text-[clamp(3rem,6.4vw,6rem)]">
            <span className="block text-bone">
              <span data-b="type">From idea.</span>
            </span>
            <span className="block text-accent">
              <span data-b="type">To production.</span>
            </span>
          </h2>
          <p className="pretty mt-6 text-[15.5px] leading-relaxed text-mute">
            <span data-b="type">
              AffiliateLink is a modular monolith: each business domain — offers, campaigns, publishers, advertisers — lives
              in its own Spring Modulith module with explicit boundaries, validated REST endpoints and tests.
            </span>
          </p>
          <ul data-b="dup" className="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-line bg-white/[0.08]">
            {["Java 17", "Spring Modulith", "PostgreSQL", "JUnit / Mockito"].map((t) => (
              <li data-dup key={t} className="bg-ink-950">
                <TechChip label={t} showIcon className="w-full px-4 py-3 font-mono text-[11.5px] text-bone/85" />
              </li>
            ))}
          </ul>
          {featured.github && (
            <a
              data-b="pop"
              href={featured.github}
              target="_blank"
              rel="noreferrer"
              className="kicker mt-8 inline-flex items-center gap-2 text-bone transition-colors hover:text-accent"
            >
              Read the source <ArrowUpRight size={14} />
            </a>
          )}
        </div>

        <div className="lg:col-span-8">
          <div data-b="box" data-tag="affiliatelink / modules">
            <BrowserFrame url={featured.url} className="shadow-[0_40px_140px_-40px_rgba(229,37,42,0.45)]">
              <div data-b="reveal">
                <ModulesMockup accent={featured.accent} />
              </div>
            </BrowserFrame>
          </div>
          <p data-b="fade" className="kicker mt-4 flex justify-between text-dim">
            <span>Fig. 01 — module map</span>
            <span>Spring Modulith · verify()</span>
          </p>
        </div>
      </div>
    </section>
  );
}
