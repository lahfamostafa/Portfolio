import { motion } from "framer-motion";
import BrowserFrame from "../../ui/BrowserFrame";
import ModulesMockup from "./ModulesMockup";

/** The visual for a project: screenshot in a browser frame, or an illustrated mockup. */
export default function ProjectPreview({ project, imgStyle, imgClassName = "", eager = false }) {
  return (
    <BrowserFrame url={project.url}>
      {project.image ? (
        <div className="media-hover aspect-[16/10] bg-ink-800">
          <motion.img
            src={project.image}
            alt={`${project.title} — application screenshot`}
            loading={eager ? "eager" : "lazy"}
            decoding="async"
            width="1600"
            height="1000"
            style={imgStyle}
            className={`h-full w-full object-cover object-top ${imgClassName}`}
          />
        </div>
      ) : (
        <div>
          <div className="media-hover">
          <div className="media">
            <ModulesMockup accent={project.accent} />
          </div>
        </div>
        </div>
      )}
    </BrowserFrame>
  );
}
