import { timeline } from "../../data/experience";
import { personal } from "../../data/personal";
import Heading from "../ui/Heading";

/** "Keep building. Keep learning." — red-rail timeline + small wins. */
export default function Journey() {
  return (
    <section id="journey" data-block="journey" aria-labelledby="journey-title" className="relative py-28 sm:py-36">
      <div className="container-x grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Heading id="journey-title" index="04" kicker="The journey" lines={["Keep building.", "Keep learning."]} size="md" />
          <ol data-block="journey-rail" className="relative mt-14 pl-8">
            <span data-b="line" data-axis="y" aria-hidden="true" className="absolute bottom-2 left-[5px] top-2 w-[2px] bg-gradient-to-b from-accent via-accent to-accent/10" />
            {timeline.map((t) => (
              <li key={t.title + t.period} className="group relative pb-10 last:pb-0">
                <span
                  data-b="pop"
                  aria-hidden="true"
                  className={`absolute -left-[31px] top-1.5 h-3 w-3 rounded-full border-2 border-ink-950 ${
                    t.current ? "bg-accent shadow-[0_0_0_5px_rgba(229,37,42,0.25)]" : "bg-white/40"
                  }`}
                />
                <div className="grid gap-2 sm:grid-cols-[9rem_1fr] sm:gap-6">
                  <p data-b="fade" className="kicker pt-1 !text-[10.5px] text-accent">
                    {t.period}
                  </p>
                  <div>
                    <h3 className="heading text-[1.7rem] leading-tight text-bone transition-all duration-500 group-hover:translate-x-2 group-hover:text-accent">
                      <span data-b="type">{t.title}</span>
                    </h3>
                    <p data-b="fade" className="mt-1 text-[14px] text-bone/75">
                      {t.org} · {t.place} · {t.type === "work" ? "Internship" : "Education"}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <aside data-block="journey-wins" className="lg:col-span-5 lg:pt-4">
          <p data-b="fade" className="kicker text-mute">
            <span className="text-accent">Off the clock</span>
          </p>
          <h3 className="heading mt-5 text-[clamp(2.4rem,4.6vw,4rem)]">
            <span className="block text-bone">
              <span data-b="type">Small wins.</span>
            </span>
            <span className="block text-accent">
              <span data-b="type">Big lessons.</span>
            </span>
          </h3>
          <ul className="mt-10">
            {personal.interests.map((it, i) => (
              <li data-b="fade" key={it.title} className="group grid grid-cols-[2.5rem_1fr] gap-3 border-t border-line py-5 transition-colors duration-500 hover:border-accent/50">
                <span className="font-mono text-[11px] text-accent transition-transform duration-500 group-hover:translate-x-1">0{i + 1}</span>
                <div>
                  <p className="text-[15.5px] font-semibold text-bone">{it.title}</p>
                  <p className="mt-1 text-[14px] leading-relaxed text-mute">{it.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}
