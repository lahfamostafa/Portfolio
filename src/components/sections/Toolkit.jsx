import { concepts, skillGroups } from "../../data/skills";
import TechIcon from "../ui/TechIcon";
import { TechChip } from "../tech/TechProvider";

/** Dev toolkit: grouped skills, no percentages. */
export default function Toolkit() {
  return (
    <section data-block="toolkit" aria-labelledby="toolkit-title" className="relative border-y border-line bg-ink-900/50 py-24">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 id="toolkit-title" className="heading text-[clamp(2.4rem,5vw,4.4rem)] text-bone">
            <span data-b="type">Dev toolkit</span>
            <span className="text-accent">.</span>
          </h2>
          <p data-b="fade" className="kicker max-w-sm text-mute">
            Grouped by how I use them — the projects show the depth.
          </p>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-line bg-white/[0.08] sm:grid-cols-2 lg:grid-cols-4">
          {skillGroups.map((g) => (
            <div key={g.id} className="group relative bg-ink-950 p-7 transition-colors duration-500 hover:bg-ink-900">
              <span aria-hidden="true" className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-accent transition-transform duration-500 group-hover:scale-x-100" />
              <p data-b="fade" className="flex items-baseline justify-between">
                <span className="heading text-2xl text-bone">{g.title}</span>
                <span className="font-mono text-[11px] text-accent">{g.index}</span>
              </p>
              <ul data-b="dup" className="mt-6 space-y-1.5">
                {g.skills.map((s) => (
                  <li data-dup key={s.name}>
                    <TechChip
                      label={s.name}
                      className="group/item -mx-2 gap-3 rounded-md px-2 py-1 text-[14px] text-bone/80 hover:translate-x-1"
                    >
                      <TechIcon name={s.icon} size={15} className="text-mute transition-colors group-hover/item:text-accent" />
                      {s.name}
                    </TechChip>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <ul data-b="dup" className="mt-8 flex flex-wrap gap-2">
          {concepts.map((c) => (
            <li
              data-dup
              key={c}
              className="rounded-sm border border-white/10 px-3 py-1.5 font-mono text-[11.5px] text-bone/75 transition-colors hover:border-accent hover:text-bone"
            >
              {c}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
