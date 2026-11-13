import {
  SiAlpinedotjs,
  SiApachemaven,
  SiBootstrap,
  SiCss,
  SiDocker,
  SiFigma,
  SiGit,
  SiGithub,
  SiHibernate,
  SiHtml5,
  SiIntellijidea,
  SiJavascript,
  SiJunit5,
  SiLaravel,
  SiLinux,
  SiMysql,
  SiNextdotjs,
  SiPhp,
  SiPostgresql,
  SiPostman,
  SiReact,
  SiSpring,
  SiSpringboot,
  SiTailwindcss,
  SiTypescript,
  SiVite,
} from "react-icons/si";
import { FaJava } from "react-icons/fa";
import { VscVscode } from "react-icons/vsc";
import { Database, Webhook } from "lucide-react";

/** Logo + brand colour for each technology key used in src/data/skills.js. */
export const techMap = {
  java: { Icon: FaJava, color: "#E76F00" },
  springboot: { Icon: SiSpringboot, color: "#6DB33F" },
  spring: { Icon: SiSpring, color: "#6DB33F" },
  hibernate: { Icon: SiHibernate, color: "#BCAE79" },
  api: { Icon: Webhook, color: "#B7ADFF" },
  maven: { Icon: SiApachemaven, color: "#E0457B" },
  php: { Icon: SiPhp, color: "#8892BF" },
  laravel: { Icon: SiLaravel, color: "#FF2D20" },
  html: { Icon: SiHtml5, color: "#E34F26" },
  css: { Icon: SiCss, color: "#2F7BF6" },
  js: { Icon: SiJavascript, color: "#F7DF1E" },
  ts: { Icon: SiTypescript, color: "#3178C6" },
  react: { Icon: SiReact, color: "#61DAFB" },
  next: { Icon: SiNextdotjs, color: "#FFFFFF" },
  tailwind: { Icon: SiTailwindcss, color: "#38BDF8" },
  bootstrap: { Icon: SiBootstrap, color: "#8B5CF6" },
  alpine: { Icon: SiAlpinedotjs, color: "#77C1D2" },
  postgres: { Icon: SiPostgresql, color: "#6A9FD8" },
  mysql: { Icon: SiMysql, color: "#4E9CC4" },
  sql: { Icon: Database, color: "#E8A87C" },
  git: { Icon: SiGit, color: "#F05032" },
  github: { Icon: SiGithub, color: "#FFFFFF" },
  docker: { Icon: SiDocker, color: "#2496ED" },
  postman: { Icon: SiPostman, color: "#FF6C37" },
  intellij: { Icon: SiIntellijidea, color: "#FE315D" },
  vscode: { Icon: VscVscode, color: "#3EA6F0" },
  figma: { Icon: SiFigma, color: "#A259FF" },
  linux: { Icon: SiLinux, color: "#FCC624" },
  junit: { Icon: SiJunit5, color: "#25A162" },
  vite: { Icon: SiVite, color: "#A78BFA" },
};

export default function TechIcon({ name, size = 18, colored = false, className = "" }) {
  const entry = techMap[name];
  if (!entry) return null;
  const { Icon, color } = entry;
  return <Icon size={size} className={className} style={colored ? { color } : undefined} aria-hidden="true" />;
}
