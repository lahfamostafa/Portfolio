import { MotionConfig } from "framer-motion";
import { SmoothScrollProvider } from "./hooks/useSmoothScroll";
import { SwarmProvider } from "./swarm/SwarmProvider";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ScrollProgress from "./components/layout/ScrollProgress";
import Cursor from "./components/ui/Cursor";
import { TechProvider } from "./components/tech/TechProvider";
import Hero from "./components/sections/Hero";
import StackRow from "./components/sections/StackRow";
import Work from "./components/sections/Work";
import ExperienceSection from "./components/sections/ExperienceSection";
import Showcase from "./components/sections/Showcase";
import AboutSection from "./components/sections/AboutSection";
import Toolkit from "./components/sections/Toolkit";
import Journey from "./components/sections/Journey";
import Contact from "./components/sections/Contact";

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScrollProvider>
        <SwarmProvider>
          <TechProvider>
          <a
            href="#main"
            className="sr-only z-[80] rounded-md bg-bone px-4 py-2 text-ink-950 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
          >
            Skip to content
          </a>
          <ScrollProgress />
          <Cursor />
          <Navbar />
          <main id="main" className="overflow-x-clip">
            <Hero />
            <StackRow />
            <Work />
            <ExperienceSection />
            <Showcase />
            <AboutSection />
            <Toolkit />
            <Journey />
            <Contact />
          </main>
          <Footer />
          </TechProvider>
        </SwarmProvider>
      </SmoothScrollProvider>
    </MotionConfig>
  );
}
