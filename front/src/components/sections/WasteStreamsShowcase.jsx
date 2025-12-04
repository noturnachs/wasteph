import React from "react";
import ParallaxLayer from "../common/ParallaxLayer";
import RevealOnScroll from "../common/RevealOnScroll";
import WordReveal from "../common/WordReveal";

const streams = [
  {
    label: "Mixed Waste",
    year: "2025",
    description: "General refuse from commercial and residential sites.",
  },
  {
    label: "Food Waste",
    year: "2025",
    description: "Organic streams from kitchens, canteens, and F&B sites.",
  },
  {
    label: "Residual Waste",
    year: "2025",
    description: "Non-recyclable materials destined for safe disposal.",
  },
  {
    label: "Construction Debris",
    year: "Projects",
    description: "Concrete, soil, and demolition material from builds.",
  },
  {
    label: "Recyclables",
    year: "Partners",
    description: "Carton, plastic, aluminum, copper, metal, and more.",
  },
  {
    label: "Septic & Liquid",
    year: "Critical",
    description: "Septic tank and liquid waste for compliant treatment.",
  },
];

const WasteStreamsShowcase = () => {
  return (
    <section
      id="waste-streams"
      className="relative snap-start border-y border-white/10 py-32 md:py-40 lg:py-52"
      aria-labelledby="waste-streams-title"
      style={{
        background:
          "linear-gradient(180deg, rgba(21, 128, 61, 0.05) 0%, transparent 50%, transparent 100%)",
      }}
    >
      <ParallaxLayer
        speed={0.2}
        className="pointer-events-none absolute bottom-20 right-20 -z-10 h-[500px] w-[500px] animate-pulse-glow rounded-full bg-[#15803d]/30 blur-[120px]"
      />
      <ParallaxLayer
        speed={-0.15}
        className="pointer-events-none absolute left-10 top-20 -z-10 h-[400px] w-[400px] rounded-full bg-[#16a34a]/20 blur-[100px]"
      />
      <div className="mx-auto flex max-w-7xl flex-col gap-20 px-6 lg:px-12">
        <div className="grid gap-16 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:items-start md:gap-20">
          <div className="space-y-10">
            <RevealOnScroll>
              <div className="flex items-center gap-4">
                <span className="h-px w-16 bg-gradient-to-r from-[#15803d] to-transparent" />
                <p className="text-xs font-bold uppercase tracking-[0.35em] text-white/60">
                  Waste Streams
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delayClass="delay-100">
              <h2
                id="waste-streams-title"
                className="text-[clamp(3rem,10vw,6rem)] font-black uppercase leading-[0.9] tracking-tighter text-white"
                style={{ letterSpacing: "-0.02em" }}
              >
                <WordReveal delay={0.1} staggerDelay={0.05}>
                  Hall of
                </WordReveal>
                <br />
                <WordReveal delay={0.3} staggerDelay={0.05}>
                  Streams
                </WordReveal>
              </h2>
            </RevealOnScroll>

            <RevealOnScroll delayClass="delay-200">
              <p className="max-w-md text-lg leading-relaxed text-white/70">
                From everyday mixed waste to specialized recyclables and septic
                streams, Waste PH manages a wide hall of materials with the same
                focus:{" "}
                <strong className="font-bold text-white">
                  responsible, traceable handling
                </strong>
                .
              </p>
            </RevealOnScroll>

            <RevealOnScroll delayClass="delay-300">
              <p className="border-l-4 border-[#15803d] pl-5 text-sm font-semibold uppercase tracking-wide text-white/60">
                Mixed · Food · Residual · Construction · Recyclables · Septic
              </p>
            </RevealOnScroll>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {streams.map((stream, index) => (
              <RevealOnScroll
                key={stream.label}
                delayClass={`delay-${Math.min((index + 1) * 75, 500)}`}
              >
                <article className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8 backdrop-blur transition-all duration-500 hover:-translate-y-2 hover:border-[#15803d] hover:bg-white/10 hover:shadow-[0_20px_60px_rgba(21,128,61,0.3)]">
                  {/* Animated gradient on hover */}
                  <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-[#15803d]/0 via-[#15803d]/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  {/* Badge */}
                  <div className="mb-4 inline-block rounded-full bg-[#15803d]/20 px-4 py-1">
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#15803d]">
                      {stream.year}
                    </p>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-black text-white transition-colors duration-300 group-hover:text-[#16a34a]">
                    {stream.label}
                  </h3>

                  {/* Description */}
                  <p className="mt-4 text-base leading-relaxed text-white/70">
                    {stream.description}
                  </p>

                  {/* Decorative line */}
                  <div className="mt-6 h-1 w-0 rounded-full bg-gradient-to-r from-[#15803d] to-[#16a34a] transition-all duration-500 group-hover:w-full" />
                </article>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WasteStreamsShowcase;
