import React, { useEffect, useState, useRef } from "react";
import { scrollToSection } from "../utils/scrollToSection";

const navItems = [
  { label: "Services", targetId: "services" },
  { label: "Waste Streams", targetId: "waste-streams" },
  { label: "Process", targetId: "process" },
  { label: "Contact", targetId: "contact" },
];

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const navRefs = useRef({});

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const sections = ["services", "waste-streams", "process", "contact"];
      const current = sections.find((section) => {
        const element = document.getElementById(section);
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return rect.top <= 150 && rect.bottom >= 150;
      });

      setActiveSection(current || "");
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (activeSection && navRefs.current[activeSection]) {
      const button = navRefs.current[activeSection];
      const container = button.parentElement;
      const containerRect = container.getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();

      setIndicatorStyle({
        left: buttonRect.left - containerRect.left,
        width: buttonRect.width,
      });
    }
  }, [activeSection]);
  const handleNavClick = (targetId) => {
    scrollToSection(targetId);
  };

  const handleNavKeyDown = (event, targetId) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    scrollToSection(targetId);
  };

  const handleLogoClick = () => {
    scrollToSection("hero");
  };

  const handleLogoKeyDown = (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    scrollToSection("hero");
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-white/10 bg-black/60 py-3 shadow-[0_10px_40px_rgba(0,0,0,0.8)]"
          : "border-b border-white/5 bg-black/40 py-5"
      } backdrop-blur-xl`}
    >
      <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-8 px-6 lg:px-12">
        {/* Animated gradient line */}
        <div className="absolute bottom-0 left-1/2 h-px w-0 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#15803d] to-transparent transition-all duration-700 group-hover:w-full" />

        {/* Logo with 3D effect */}
        <div
          className="group relative flex cursor-pointer items-center gap-4 transition-transform duration-300 hover:scale-105"
          role="button"
          tabIndex={0}
          aria-label="Scroll to Waste PH hero section"
          onClick={handleLogoClick}
          onKeyDown={handleLogoKeyDown}
          style={{ perspective: "1000px" }}
        >
          {/* Glow effect behind logo */}
          <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-[#15803d]/20 to-[#16a34a]/20 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />

          <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#15803d] to-[#16a34a] shadow-[0_0_40px_rgba(21,128,61,0.5),inset_0_1px_0_rgba(255,255,255,0.2)] transition-all duration-500 group-hover:shadow-[0_0_60px_rgba(21,128,61,0.8),0_0_100px_rgba(22,163,74,0.4),inset_0_1px_0_rgba(255,255,255,0.3)]">
            {/* Animated shine effect */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />

            <svg
              aria-hidden="true"
              className="relative z-10 h-8 w-8 text-white drop-shadow-lg transition-transform duration-500 group-hover:scale-110"
              viewBox="0 0 24 24"
              fill="none"
            >
              <rect
                x="3"
                y="9"
                width="11"
                height="7"
                rx="1.5"
                className="fill-white"
              />
              <path
                d="M14 10h4.2c.3 0 .57.13.76.36l1.8 2.2c.15.19.24.43.24.68V16H14v-6Z"
                className="fill-white"
              />
              <circle cx="7.5" cy="17" r="1.8" className="fill-white" />
              <circle cx="17" cy="17" r="1.8" className="fill-white" />
            </svg>
          </div>

          <div className="hidden flex-col leading-tight sm:flex">
            <span className="text-xl font-black uppercase tracking-[0.35em] text-white transition-all duration-300 group-hover:tracking-[0.4em]">
              Waste PH
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/70">
              Waste Management
            </span>
          </div>
        </div>

        {/* Futuristic nav with animated background */}
        <nav className="hidden items-center gap-2 lg:flex">
          <div className="relative flex items-center rounded-full border border-white/10 bg-white/5 p-2 backdrop-blur-xl">
            {/* Sliding active indicator - only show when section is active */}
            {activeSection && indicatorStyle.width && (
              <div
                className="pointer-events-none absolute rounded-full bg-gradient-to-r from-[#15803d] to-[#16a34a] shadow-[0_0_20px_rgba(21,128,61,0.6)] transition-all duration-500 ease-out"
                style={{
                  left: `${indicatorStyle.left}px`,
                  width: `${indicatorStyle.width}px`,
                  height: "calc(100% - 16px)",
                  top: "8px",
                }}
              />
            )}

            {navItems.map((item) => {
              const isActive = activeSection === item.targetId;
              return (
                <button
                  key={item.targetId}
                  ref={(el) => (navRefs.current[item.targetId] = el)}
                  type="button"
                  className={`relative z-10 flex items-center justify-center whitespace-nowrap rounded-full px-6 py-3 text-xs font-bold uppercase tracking-[0.25em] transition-all duration-300 focus-visible:outline-none ${
                    isActive
                      ? "text-white"
                      : "text-white/60 hover:text-white/90"
                  }`}
                  onClick={() => handleNavClick(item.targetId)}
                  onKeyDown={(event) => handleNavKeyDown(event, item.targetId)}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </nav>

        {/* 3D CTA button */}
        <button
          type="button"
          className="group relative overflow-hidden rounded-full bg-gradient-to-r from-[#15803d] to-[#16a34a] px-8 py-4 text-xs font-black uppercase tracking-[0.35em] text-white shadow-[0_0_40px_rgba(21,128,61,0.5),0_4px_20px_rgba(0,0,0,0.3)] transition-all duration-300 hover:scale-[1.08] hover:shadow-[0_0_60px_rgba(21,128,61,0.8),0_0_100px_rgba(22,163,74,0.4),0_6px_30px_rgba(0,0,0,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          onClick={() => handleNavClick("contact")}
          onKeyDown={(event) => handleNavKeyDown(event, "contact")}
          style={{ transform: "translateZ(0)" }}
        >
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

          {/* Inner glow */}
          <div className="absolute inset-[1px] rounded-full bg-gradient-to-b from-white/10 to-transparent opacity-50" />

          <span className="relative z-10 flex items-center gap-3">
            Contact Us
            <svg
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </span>
        </button>
      </div>
    </header>
  );
};

export default Header;
