import { personal, process, softSkills } from "../../data/personal";
import { timeline } from "../../data/experience";
import Heading from "../ui/Heading";

const education = timeline.filter((t) => t.type === "education");

/** "Not just code. But how it's built." */
export default function AboutSection() {
  return (
    <section id="about" data-block="about" aria-labelledby="about-title" className="relative py-28 sm:py-36">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <Heading
            id="about-title"
            className="lg:col-span-7"
            index="03"
            kicker="Behind the code"
            lines={["Not just code.", "But how it's built."]}
          />
          <div className="space-y-4 lg:col-span-5">
            {personal.about.paragraphs.map((p) => (
              <p key={p.slice(0, 20)} className="pretty text-[15px] leading-relaxed text-mute">
                <span data-b="type">{p}</span>
              </p>
            ))}
          </div>
        </div>

        <div data-block="about-grid" className="mt-16 grid gap-6 lg:grid-cols-12">
          {/* Education & skills */}
          <div data-b="frame" data-tag="education" className="rounded-lg border border-line bg-ink-900/60 p-7 lg:col-span-4">
            <p className="kicker text-bone">Education &amp; skills</p>
            <ul className="mt-6 space-y-5">
              {education.map((e) => (
                <li data-b="fade" key={e.title}>
                  <p className="kicker !text-[10px] text-accent">{e.period}</p>
                  <p className="mt-1 text-[15px] font-medium text-bone">{e.title}</p>
                  <p className="text-[13.5px] text-mute">
                    {e.org} · {e.place}
                  </p>
                </li>
              ))}
            </ul>
            <p className="kicker mt-8 text-bone">Soft skills</p>
            <ul data-b="dup" className="mt-4 flex flex-wrap gap-1.5">
              {softSkills.map((s) => (
                <li data-dup key={s} className="rounded-sm border border-white/10 px-2 py-1 text-[12px] text-bone/75">
                  {s}
                </li>
              ))}
            </ul>
            <p className="kicker mt-8 text-bone">Languages</p>
            <p data-b="fade" className="mt-3 text-[14px] text-mute">
              Arabic (native) · French (intermediate) · English (intermediate)
            </p>
          </div>

          {/* Process */}
          <div className="lg:col-span-5">
            <p data-b="fade" className="kicker text-bone">
              From idea to deploy
            </p>
            <ol className="mt-6">
              {process.map((step, i) => (
                <li key={step.title} className="group grid grid-cols-[3.2rem_1fr] gap-4 border-t border-line py-5 transition-colors duration-300 hover:border-accent/60">
                  <span data-b="pop" className="heading text-3xl text-accent transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
                    0{i + 1}
                  </span>
                  <div>
                    <p className="heading text-xl text-bone">
                      <span data-b="type">{step.title}</span>
                    </p>
                    <p data-b="fade" className="mt-1 text-[14px] leading-relaxed text-mute">
                      {step.text}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Quote card */}
          <figure
            data-b="box"
            data-tag="quote.card"
            className="noise relative flex flex-col justify-between overflow-hidden rounded-lg bg-gradient-to-br from-accent via-accent to-accent-deep p-8 transition-all duration-500 hover:-translate-y-1 hover:rotate-[-0.6deg] hover:shadow-[0_30px_80px_-30px_rgba(229,37,42,0.8)] lg:col-span-3"
          >
            <span aria-hidden="true" className="heading text-7xl leading-none text-white/40">
              “
            </span>
            <blockquote className="heading mt-6 text-[clamp(1.9rem,2.6vw,2.4rem)] leading-[1.02] text-white">
              {personal.about.pullQuote}
            </blockquote>
            <figcaption className="mt-10">
              <span className="font-script text-5xl leading-none text-white">{personal.firstName}</span>
              <span className="kicker mt-3 block !text-[10px] text-white/75">Full Stack Developer</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
