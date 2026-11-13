/**
 * Illustrated preview for projects without a screenshot (AffiliateLink):
 * an IDE-like view of a Spring Modulith layout next to a module map.
 */
const modules = [
  { name: "offers", desc: "Offer catalogue" },
  { name: "campaigns", desc: "Campaign mgmt" },
  { name: "publishers", desc: "Discovery & promo" },
  { name: "advertisers", desc: "Accounts" },
];

const code = [
  ["@ApplicationModule", "text-ember"],
  ["package com.affiliatelink.offers;", "text-white/50"],
  ["", ""],
  ["@RestController", "text-ember"],
  ['@RequestMapping("/api/offers")', "text-ember"],
  ["class OfferController {", "text-bone"],
  ["  private final OfferService service;", "text-white/60"],
  ["", ""],
  ["  @PostMapping", "text-ember"],
  ["  ResponseEntity<OfferDto> create(", "text-bone"],
  ["      @Valid @RequestBody OfferRequest req) {", "text-white/85"],
  ["    return ResponseEntity.status(CREATED)", "text-white/70"],
  ["        .body(service.create(req));", "text-white/70"],
  ["  }", "text-bone"],
  ["}", "text-bone"],
];

export default function ModulesMockup({ accent = "#8B7CFF" }) {
  return (
    <div className="relative grid aspect-[16/10] grid-cols-12 overflow-hidden bg-[#0E0E11] font-mono text-[9px] leading-[1.7] sm:text-[11px] lg:aspect-[2.1/1] lg:text-[12.5px]">
      <div
        aria-hidden="true"
        className="absolute -right-24 -top-24 h-64 w-64 rounded-full opacity-[0.12] blur-[90px]"
        style={{ background: accent }}
      />
      {/* File tree */}
      <div className="col-span-3 hidden border-r border-white/[0.06] p-4 text-white/45 sm:block">
        <p className="mb-2 text-[9px] uppercase tracking-widest text-white/30">Explorer</p>
        <p>▾ affiliatelink</p>
        {modules.map((m, i) => (
          <p key={m.name} className={`pl-3 ${i === 0 ? "text-bone" : ""}`}>
            ▸ {m.name}
          </p>
        ))}
        <p className="pl-3">▸ shared</p>
        <p className="mt-2">docker-compose.yml</p>
        <p>pom.xml</p>
      </div>

      {/* Code */}
      <div className="col-span-12 p-4 sm:col-span-6 sm:p-5">
        <div className="mb-3 flex gap-4 text-[9px] text-white/40">
          <span className="border-b border-white/40 pb-1 text-bone">OfferController.java</span>
          <span className="hidden sm:inline">OfferService.java</span>
        </div>
        {code.map(([line, cls], i) => (
          <div key={i} className="flex gap-3 whitespace-pre">
            <span className="w-4 text-right text-white/20">{i + 1}</span>
            <span className={cls}>{line}</span>
          </div>
        ))}
      </div>

      {/* Module map */}
      <div className="relative col-span-3 hidden flex-col justify-center gap-2 border-l border-white/[0.06] p-4 sm:flex">
        <p className="mb-1 text-[9px] uppercase tracking-widest text-white/30">Modules</p>
        {modules.map((m) => (
          <div key={m.name} className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-2">
            <p className="text-bone">{m.name}</p>
            <p className="text-[8.5px] text-white/40">{m.desc}</p>
          </div>
        ))}
        <div className="mt-1 flex items-center gap-1.5 text-[9px] text-emerald-400/80">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> verify() — OK
        </div>
      </div>
    </div>
  );
}
