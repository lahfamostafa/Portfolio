import { ArrowUp } from "lucide-react";
import { navLinks, personal, socials } from "../../data/personal";
import { useSmoothScroll } from "../../hooks/useSmoothScroll";
import { ReplayButton } from "../../swarm/SwarmProvider";
import SocialIcon from "../ui/SocialIcon";

export default function Footer() {
  const { scrollTo } = useSmoothScroll();
  const year = new Date().getFullYear();

  return (
    <footer data-block="footer" className="relative overflow-hidden border-t border-line pb-28 pt-16">
      <div className="container-x">
        <div className="grid gap-10 md:grid-cols-12 md:items-end">
          <div data-finale className="md:col-span-6">
            <p className="heading text-[clamp(3rem,8vw,7rem)] leading-[0.85] text-bone">
              <span data-b="type" className="glitch">
                {personal.name}
              </span>
              <span className="text-accent">.</span>
            </p>
            <p data-b="fade" className="kicker mt-4 text-mute">
              {personal.title} · Java &amp; Spring Boot · {personal.country}
            </p>
          </div>
          <nav aria-label="Footer" className="md:col-span-3">
            <ul data-b="dup" className="grid grid-cols-2 gap-x-6 gap-y-2">
              {navLinks.map((l) => (
                <li data-dup key={l.id}>
                  <a
                    href={`#${l.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollTo(l.id);
                    }}
                    className="kicker !tracking-[0.14em] text-mute transition-colors hover:text-bone"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div data-b="fade" className="flex items-center gap-2 md:col-span-3 md:justify-end">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`${s.label} profile`}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-mute transition-colors hover:border-accent hover:text-bone"
              >
                <SocialIcon name={s.icon} />
              </a>
            ))}
            <a
              href={`mailto:${personal.email}`}
              aria-label="Send an email"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-mute transition-colors hover:border-accent hover:text-bone"
            >
              <SocialIcon name="email" />
            </a>
            <button
              type="button"
              onClick={() => scrollTo("home")}
              aria-label="Back to top"
              className="ml-1 flex h-11 w-11 items-center justify-center rounded-full bg-accent text-white transition-colors hover:bg-accent-soft"
            >
              <ArrowUp size={16} />
            </button>
          </div>
        </div>

        <div data-b="fade" className="mt-12 flex flex-col gap-3 border-t border-line pt-6 text-[13px] text-dim sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {personal.name}. All rights reserved.</p>
          <ReplayButton />
          <p>
            Designed &amp; Built with <span className="text-accent">passion</span> — by one developer and a swarm of agents.
          </p>
        </div>
      </div>
    </footer>
  );
}
