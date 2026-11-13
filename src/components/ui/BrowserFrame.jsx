import { Lock } from "lucide-react";

/** Minimal browser chrome that wraps a screenshot or illustrated preview. */
export default function BrowserFrame({ url, children, className = "" }) {
  return (
    <div
      className={`overflow-hidden rounded-[14px] border border-white/10 bg-ink-800 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)] ${className}`}
    >
      <div className="flex h-9 items-center gap-3 border-b border-white/[0.06] bg-ink-700/80 px-3.5">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]/80" />
        </div>
        {url && (
          <div className="mx-auto flex h-[22px] min-w-0 max-w-[60%] items-center gap-1.5 rounded-md bg-white/[0.05] px-3 font-mono text-[10.5px] text-dim">
            <Lock size={9} aria-hidden="true" />
            <span className="truncate">{url}</span>
          </div>
        )}
        <div className="w-[42px]" aria-hidden="true" />
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}
