/**
 * Cinematic section heading: mono kicker + condensed uppercase lines.
 * The line at `accent` index renders in red. Each line is typed by the swarm.
 */
export default function Heading({ id, index, kicker, lines, accent = 1, size = "lg", className = "" }) {
  const sizes = {
    lg: "text-[clamp(2.9rem,7.4vw,7rem)]",
    md: "text-[clamp(2.4rem,5.4vw,5rem)]",
  };
  return (
    <div className={className}>
      <p data-b="fade" className="kicker mb-5 flex items-center gap-3 text-mute">
        <span className="text-accent">{index}</span>
        <span className="h-px w-8 bg-white/20" />
        {kicker}
      </p>
      <h2 id={id} className={`heading ${sizes[size]}`}>
        {lines.map((line, i) => (
          <span key={line} className={`block ${i === accent ? "text-accent" : "text-bone"}`}>
            <span data-b="type" className="glitch">
              {line}
            </span>
          </span>
        ))}
      </h2>
    </div>
  );
}
