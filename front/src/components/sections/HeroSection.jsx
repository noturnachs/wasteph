import React, { useState, useEffect, useRef } from "react";
import ParallaxLayer from "../common/ParallaxLayer";
import RevealOnScroll from "../common/RevealOnScroll";
import { scrollToSection } from "../../utils/scrollToSection";

const HeroSection = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!heroRef.current) return;

      const rect = heroRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;

      setMousePosition({ x, y });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const heroElement = heroRef.current;
    if (heroElement) {
      heroElement.addEventListener("mousemove", handleMouseMove);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      if (heroElement) {
        heroElement.removeEventListener("mousemove", handleMouseMove);
      }
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handlePrimaryClick = () => {
    scrollToSection("contact");
  };

  const handleSecondaryClick = () => {
    scrollToSection("services");
  };

  const handlePrimaryKeyDown = (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    scrollToSection("contact");
  };

  const handleSecondaryKeyDown = (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    scrollToSection("services");
  };

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative flex snap-start items-center overflow-visible pb-32 pt-24 md:min-h-screen md:pb-24 md:pt-32 lg:pb-20"
      aria-labelledby="hero-title"
    >
      {/* Premium ambient lighting */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <ParallaxLayer speed={0.15}>
          <div
            className="absolute left-1/4 top-0 h-[800px] w-[800px] animate-pulse-glow rounded-full bg-[#15803d]/8 blur-[140px] transition-transform duration-1000 ease-out"
            style={{
              transform: `translate(${mousePosition.x * 20}px, ${
                mousePosition.y * 20
              }px)`,
            }}
          />
        </ParallaxLayer>
        <ParallaxLayer speed={-0.12}>
          <div
            className="absolute right-1/4 top-1/3 h-[600px] w-[600px] animate-pulse-glow rounded-full bg-[#16a34a]/6 blur-[120px] transition-transform duration-1200 ease-out"
            style={{
              transform: `translate(${mousePosition.x * -15}px, ${
                mousePosition.y * -15
              }px)`,
            }}
          />
        </ParallaxLayer>
      </div>

      <div
        className="relative z-10 mx-auto w-full max-w-[1800px] px-6 lg:px-16 xl:px-24"
        style={{
          transform: `translateY(${scrollY * 0.12}px)`,
          opacity: Math.max(0, 1 - Math.max(0, scrollY - 800) / 2000),
          transition: "transform 0.1s ease-out, opacity 0.1s ease-out",
        }}
      >
        {/* Main Hero Grid */}
        <div className="grid gap-20 lg:grid-cols-[1.3fr_0.7fr] lg:gap-24 xl:gap-32">
          {/* Left: Content */}
          <div className="flex flex-col justify-center space-y-12">
            {/* Badge */}
            <RevealOnScroll>
              <div className="inline-flex w-fit items-center gap-3 rounded-full border border-white/10 bg-gradient-to-r from-white/5 to-white/[0.02] px-4 py-2 backdrop-blur-xl">
                <div className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#15803d] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#15803d]" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-white/80">
                  Philippines • Waste Management
                </span>
              </div>
            </RevealOnScroll>

            {/* Hero Title */}
            <RevealOnScroll delayClass="delay-100">
              <h1 id="hero-title" className="overflow-hidden">
                <div className="flex items-baseline gap-4 overflow-hidden">
                  <span className="block text-[clamp(4rem,14vw,11rem)] font-black uppercase leading-[0.85] tracking-[-0.05em] text-white">
                    Waste
                  </span>
                  <span className="relative">
                    <span className="block bg-gradient-to-br from-[#15803d] via-[#16a34a] to-[#22c55e] bg-clip-text text-[clamp(4rem,14vw,11rem)] font-black uppercase leading-[0.85] tracking-[-0.05em] text-transparent">
                      PH
                    </span>
                    {/* Subtle underline accent */}
                    <div className="absolute -bottom-4 left-0 h-1.5 w-full bg-gradient-to-r from-[#15803d] to-transparent" />
                  </span>
                </div>
              </h1>
            </RevealOnScroll>

            {/* Description */}
            <RevealOnScroll delayClass="delay-200">
              <p className="max-w-2xl text-lg font-medium leading-relaxed text-white/70 md:text-xl lg:text-2xl">
                Elevating environmental responsibility through{" "}
                <span className="font-semibold text-white">
                  precision logistics
                </span>
                ,{" "}
                <span className="font-semibold text-white">
                  sustainable practices
                </span>
                , and unwavering commitment to the Filipino community.
              </p>
            </RevealOnScroll>

            {/* CTA Buttons */}
            <RevealOnScroll delayClass="delay-300">
              <div className="flex flex-wrap items-center gap-4">
                {/* Primary CTA */}
                <div
                  role="button"
                  tabIndex={0}
                  aria-label="Scroll to contact section"
                  className="group relative inline-flex cursor-pointer items-center gap-3 overflow-hidden rounded-full bg-white px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-black shadow-[0_20px_60px_rgba(255,255,255,0.15)] transition-all duration-500 hover:scale-105 hover:shadow-[0_25px_80px_rgba(255,255,255,0.25)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/30"
                  onClick={handlePrimaryClick}
                  onKeyDown={handlePrimaryKeyDown}
                >
                  <span className="relative z-10">Start Your Service</span>
                  <svg
                    className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                </div>

                {/* Secondary CTA */}
                <div
                  role="button"
                  tabIndex={0}
                  aria-label="Scroll to services section"
                  className="group inline-flex cursor-pointer items-center gap-3 rounded-full border border-white/20 bg-white/5 px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white backdrop-blur-xl transition-all duration-300 hover:border-white/40 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/30"
                  onClick={handleSecondaryClick}
                  onKeyDown={handleSecondaryKeyDown}
                >
                  <span>Explore Services</span>
                  <svg
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </div>
              </div>
            </RevealOnScroll>

            {/* Service Pills */}
            <RevealOnScroll delayClass="delay-[400ms]">
              <div className="flex flex-wrap gap-3">
                {[
                  "Mixed Waste",
                  "Food Waste",
                  "Recyclables",
                  "Construction",
                  "Septic Tank",
                ].map((item, index) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-medium tracking-wide text-white/70 backdrop-blur-sm transition-all duration-300 hover:border-[#15803d]/50 hover:bg-[#15803d]/10 hover:text-white"
                    style={{ animationDelay: `${index * 60}ms` }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </RevealOnScroll>
          </div>

          {/* Right: Premium Visual Block */}
          <div className="relative">
            <RevealOnScroll delayClass="delay-200">
              {/* Main Feature Card */}
              <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-2xl">
                {/* Image Container */}
                <div className="relative aspect-[4/5] overflow-hidden">
                  <ParallaxLayer speed={-0.05}>
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-all duration-[1500ms] group-hover:scale-110"
                      style={{
                        backgroundImage:
                          "url('https://images.unsplash.com/photo-1549989476-69a92fa57c36?auto=format&fit=crop&w=900&q=80')",
                      }}
                    />
                  </ParallaxLayer>

                  {/* Premium gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90" />

                  {/* Subtle noise texture */}
                  <div
                    className="absolute inset-0 opacity-[0.015] mix-blend-overlay"
                    style={{
                      backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E\")",
                    }}
                  />
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-between p-8">
                  {/* Top: Status Badge */}
                  <div className="flex justify-end">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3 py-1.5 backdrop-blur-xl">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#15803d]">
                        <div className="absolute h-1.5 w-1.5 animate-ping rounded-full bg-[#15803d]" />
                      </div>
                      <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/90">
                        Active Fleet
                      </span>
                    </div>
                  </div>

                  {/* Bottom: Info */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-3xl font-black leading-tight text-white lg:text-4xl">
                        City-Wide
                        <br />
                        <span className="bg-gradient-to-r from-[#15803d] to-[#22c55e] bg-clip-text text-transparent">
                          Coverage
                        </span>
                      </h3>
                      <p className="text-sm leading-relaxed text-white/80">
                        Precision routing for businesses and communities across
                        Metro Manila and beyond.
                      </p>
                    </div>

                    {/* Mini stats */}
                    <div className="flex gap-6">
                      <div>
                        <p className="text-2xl font-black text-white">24/7</p>
                        <p className="text-[10px] font-medium uppercase tracking-wider text-white/60">
                          Available
                        </p>
                      </div>
                      <div className="h-12 w-px bg-white/10" />
                      <div>
                        <p className="text-2xl font-black text-white">100%</p>
                        <p className="text-[10px] font-medium uppercase tracking-wider text-white/60">
                          Compliant
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative corner accent */}
                <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-[#15803d]/20 blur-3xl transition-all duration-1000 group-hover:scale-150" />
              </div>
            </RevealOnScroll>

            {/* Floating secondary stat card */}
            <RevealOnScroll delayClass="delay-300">
              <div className="absolute -bottom-6 -left-6 w-48 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.03] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.4)] backdrop-blur-2xl">
                <div className="mb-2 flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#15803d] to-[#16a34a] p-1.5">
                    <svg
                      className="h-full w-full text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-white/60">
                      Quick Response
                    </p>
                  </div>
                </div>
                <p className="text-3xl font-black text-white">
                  &lt;2<span className="text-xl">hrs</span>
                </p>
                <p className="mt-1 text-xs text-white/70">
                  Average pickup time
                </p>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
