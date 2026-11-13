import { SiGithub } from "react-icons/si";
import { FaLinkedinIn } from "react-icons/fa";
import { Mail } from "lucide-react";

const icons = { github: SiGithub, linkedin: FaLinkedinIn, email: Mail };

export default function SocialIcon({ name, size = 16, className = "" }) {
  const Icon = icons[name];
  return Icon ? <Icon size={size} className={className} aria-hidden="true" /> : null;
}
