import Magnetic from "./Magnetic";

const styles = {
  primary:
    "bg-bone text-ink-950 hover:bg-white shadow-[0_0_0_1px_rgba(255,255,255,0.2),0_10px_40px_-10px_rgba(255,59,48,0.6)]",
  ghost: "border border-line-strong bg-white/[0.02] text-bone hover:border-white/30 hover:bg-white/[0.06]",
  accent:
    "bg-accent text-white hover:bg-accent-deep shadow-[0_10px_40px_-12px_rgba(255,59,48,0.9)]",
};

/**
 * Pill button rendered as <a> when `href` is provided, otherwise <button>.
 * The label slides up on hover and an optional icon nudges to the right.
 */
export default function Button({
  href,
  children,
  icon: Icon,
  variant = "primary",
  magnetic = true,
  className = "",
  size = "md",
  ...rest
}) {
  const Tag = href ? "a" : "button";
  const sizing = size === "sm" ? "h-10 px-5 text-[13px]" : "h-12 px-6 text-[14px] sm:h-[52px] sm:px-7";

  const el = (
    <Tag
      href={href}
      className={`group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full font-medium tracking-tight transition-[background,border,color,box-shadow] duration-300 ${sizing} ${styles[variant]} ${className}`}
      {...rest}
    >
      <span className="relative block overflow-hidden">
        <span className="block transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:-translate-y-full">
          {children}
        </span>
        <span
          aria-hidden="true"
          className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-y-0"
        >
          {children}
        </span>
      </span>
      {Icon && (
        <Icon
          size={16}
          strokeWidth={2}
          className="transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-x-0.5 group-hover:-rotate-12"
        />
      )}
    </Tag>
  );

  return magnetic ? <Magnetic strength={0.25}>{el}</Magnetic> : el;
}
