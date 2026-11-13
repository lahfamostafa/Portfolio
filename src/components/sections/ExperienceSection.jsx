import { ArrowUpRight } from "lucide-react";
import { timeline } from "../../data/experience";
import { personal } from "../../data/personal";
import Heading from "../ui/Heading";
import { TechChip } from "../tech/TechProvider";

const work = timeline.filter((t) => t.type === "work");

function Laurel({ flip = false }) {
  return (
    <svg viewBox="0 0 40 80" className={`h-20 w-10 text-accent ${flip ? "-scale-x-100" : ""}`} aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <ellipse key={i} cx={24 - i * 2.4} cy={14 + i * 13} rx="5" ry="9.5" fill="currentColor" transform={`rotate(${-38 + i * 6} ${24 - i * 2.4} ${14 + i * 13})`} />
      ))}
      <path d="M30 6 Q 10 40 26 78" fill="none" stroke="currentColor" strokeWidth="2.2" />
    </svg>
  );
}

/** "The code. The experience." — internships with big red years. */
export default function ExperienceSection() {
  return (
    <section id="experience" data-block="experience" aria-labelledby="exp-title" className="relative py-28 sm:py-36">
      <div className="container-x grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div data-b="box" data-tag="card / internships" className="noise relative overflow-hidden rounded-lg border border-accent/25 bg-gradient-to-br from-accent-deep/60 via-ink-850 to-ink-900 p-8 sm:p-10">
            <div aria-hidden="true" className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/25 blur-[90px]" />
            <Heading id="exp-title" index="02" kicker="Experience" lines={["The code.", "The experience."]} size="md" />
            <div className="relative mt-10 flex items-center gap-3">
              <Laurel />
              <p className="heading text-[clamp(5rem,9vw,7.5rem)] leading-none text-bone">
                {String(work.length).padStart(2, "0")}
                <span className="text-accent">.</span>
              </p>
              <Laurel flip />
            </div>
            <p className="kicker mt-3 text-bone/80">Internships completed</p>
            <p className="pretty mt-6 max-w-sm text-[15px] leading-relaxed text-mute">
              Real teams, real users: from internal tools at an insurer to a university-wide OCR diploma system.
            </p>
            {personal.cvUrl && (
              <a
                href={personal.cvUrl}
                download
                className="kicker mt-8 inline-flex items-center gap-2 text-bone transition-colors hover:text-accent"
              >
                Full CV <ArrowUpRight size={14} />
              </a>
            )}
          </div>
        </div>

        <ol className="lg:col-span-7">
          {work.map((w) => (
            <li key={w.title + w.org} data-block={`exp-${w.org}`} className="relative border-b border-line py-9 first:pt-0">
              <div className="grid gap-6 sm:grid-cols-12">
                <div className="sm:col-span-9">
                  <p data-b="fade" className="kicker text-accent">
                    {w.period}
                  </p>
                  <h3 className="heading mt-3 text-[clamp(1.9rem,3vw,2.6rem)] text-bone">
                    <span data-b="type" className="glitch">
                      {w.org}
                    </span>
                  </h3>
                  <p data-b="fade" className="mt-1 text-[15px] text-bone/80">
                    {w.title} · {w.place}
                  </p>
                  <p className="pretty mt-4 text-[15px] leading-relaxed text-mute">
                    <span data-b="type">{w.description}</span>
                  </p>
                  <ul data-b="dup" className="mt-5 flex flex-wrap gap-1.5">
                    {w.tags.map((t) => (
                      <li data-dup key={t}>
                        <TechChip label={t} className="rounded-sm border border-white/10 px-2 py-1 font-mono text-[10.5px] text-bone/70" />
                      </li>
                    ))}
                  </ul>
                </div>
                <p data-b="pop" className="stroke-hover heading text-[clamp(3rem,5vw,4.5rem)] text-accent sm:col-span-3 sm:text-right">
                  {w.period.match(/\d{4}/)?.[0]}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
