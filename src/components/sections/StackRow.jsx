import TechIcon, { techMap } from "../ui/TechIcon";
import { TechChip } from "../tech/TechProvider";

const row = [
  { icon: "java", label: "Java" },
  { icon: "springboot", label: "Spring Boot" },
  { icon: "react", label: "React" },
  { icon: "laravel", label: "Laravel" },
  { icon: "postgres", label: "PostgreSQL" },
  { icon: "mysql", label: "MySQL" },
  { icon: "docker", label: "Docker" },
  { icon: "tailwind", label: "Tailwind" },
  { icon: "git", label: "Git" },
  { icon: "postman", label: "Postman" },
];

/** "Been part of the stack" — logos duplicated into place by an agent. */
export default function StackRow() {
  return (
    <section data-block="stack" aria-label="Main technologies" className="relative border-y border-line bg-ink-900/50 py-12">
      <div className="container-x">
        <div className="mb-8 flex items-end justify-between gap-6">
          <p data-b="fade" className="kicker text-mute">
            <span className="text-accent">00</span> &nbsp;The stack I build with
          </p>
          <p data-b="fade" className="kicker hidden text-dim sm:block">
            Java ecosystem first
          </p>
        </div>
        <ul data-b="dup" className="grid grid-cols-5 gap-y-8 lg:grid-cols-10">
          {row.map((t) => (
            <li data-dup key={t.label} style={{ "--brand": techMap[t.icon]?.color }}>
              <TechChip
                label={t.label}
                className="group w-full flex-col !gap-3 rounded-md py-2 text-white/45 hover:!bg-white/[0.03]"
              >
                <TechIcon
                  name={t.icon}
                  size={34}
                  className="transition-all duration-300 group-hover:-translate-y-1.5 group-hover:scale-110 group-hover:text-[var(--brand)] group-hover:drop-shadow-[0_0_14px_var(--brand)]"
                />
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-dim transition-colors group-hover:text-bone">
                  {t.label}
                </span>
              </TechChip>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
