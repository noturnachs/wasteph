import React from "react";
import ParallaxLayer from "../common/ParallaxLayer";
import RevealOnScroll from "../common/RevealOnScroll";
import SectionShell from "../common/SectionShell";

const streams = [
  {
    label: "Mixed Waste",
    description: "General refuse from commercial and residential sites.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 6h18" />
        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      </svg>
    ),
  },
  {
    label: "Food Waste",
    description: "Organic streams from kitchens, canteens, and F&B sites.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
        <line x1="6" y1="1" x2="6" y2="4" />
        <line x1="10" y1="1" x2="10" y2="4" />
        <line x1="14" y1="1" x2="14" y2="4" />
      </svg>
    ),
  },
  {
    label: "Residual Waste",
    description: "Non-recyclable materials destined for safe disposal.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <line x1="10" y1="11" x2="10" y2="17" />
        <line x1="14" y1="11" x2="14" y2="17" />
      </svg>
    ),
  },
  {
    label: "Construction Debris",
    description: "Concrete, soil, and demolition material from builds.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
  },
  {
    label: "Recyclables",
    description: "Carton, plastic, aluminum, copper, metal, and more.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 1l4 4-4 4" />
        <path d="M3 11V9a4 4 0 0 1 4-4h14" />
        <path d="M7 23l-4-4 4-4" />
        <path d="M21 13v2a4 4 0 0 1-4 4H3" />
      </svg>
    ),
  },
  {
    label: "Septic & Liquid",
    description: "Septic tank and liquid waste for compliant treatment.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
      </svg>
    ),
  },
];

const WasteStreamsShowcase = () => {
  return (
    <SectionShell
      id="waste-streams"
      label="Waste Streams"
      headline="Hall of Streams"
      subheadline="Every type of waste we collect, haul, and process."
      variant="accent"
      fullHeight
    >
      <ParallaxLayer
        speed={0.2}
        className="pointer-events-none absolute bottom-20 right-20 -z-10 h-[500px] w-[500px] animate-pulse-glow rounded-full bg-[#15803d]/30 blur-[120px]"
      />
      <ParallaxLayer
        speed={-0.15}
        className="pointer-events-none absolute left-10 top-20 -z-10 h-[400px] w-[400px] rounded-full bg-[#16a34a]/20 blur-[100px]"
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
        {streams.map((stream, index) => (
          <RevealOnScroll
            key={stream.label}
            delayClass={`delay-${Math.min((index + 1) * 75, 500)}`}
          >
            <article className="group relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur transition-all duration-500 hover:border-[#15803d]/50 hover:shadow-[0_15px_40px_rgba(21,128,61,0.25)]">
              {/* Icon & Title Section with Background */}
              <div className="relative border-b border-white/10 bg-gradient-to-br from-[#15803d]/10 to-transparent p-4 transition-colors duration-500 group-hover:from-[#15803d]/20">
                {/* Corner accent */}
                <div className="absolute right-0 top-0 h-16 w-16 bg-gradient-to-br from-[#15803d]/20 to-transparent blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative flex items-center gap-3">
                  {/* Icon */}
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#15803d] to-[#16a34a] text-white shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(21,128,61,0.5)]">
                    <div className="h-5 w-5">{stream.icon}</div>
                  </div>

                  {/* Title */}
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-black uppercase tracking-tight text-white transition-colors duration-300 group-hover:text-[#16a34a] sm:text-lg">
                      {stream.label}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Description Section */}
              <div className="p-4">
                <p className="text-xs leading-relaxed text-white/70 sm:text-sm">
                  {stream.description}
                </p>
              </div>
            </article>
          </RevealOnScroll>
        ))}
      </div>

      <RevealOnScroll delayClass="delay-300">
        <p className="mt-6 border-l-2 border-[#15803d] pl-3 text-[10px] font-semibold uppercase tracking-wide text-white/60 sm:border-l-4 sm:pl-5 sm:text-xs md:mt-8 lg:mt-10">
          Mixed · Food · Residual · Construction · Recyclables · Septic
        </p>
      </RevealOnScroll>
    </SectionShell>
  );
};

export default WasteStreamsShowcase;
