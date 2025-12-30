import React from "react";
import SectionShell from "../common/SectionShell";
import RevealOnScroll from "../common/RevealOnScroll";
import TextHighlight from "../common/TextHighlight";

const servicesData = [
  {
    id: "mixed-food-residual-construction",
    title: "Mixed, Food, Residual & Construction",
    description:
      "End-to-end hauling for businesses and communities handling everyday and project-based waste.",
    bullets: [
      "Scheduled or on-call collections",
      "Mixed, food, residual & construction",
      "Fleet for tight access & bulk loads",
    ],
    category: "Waste Hauling",
  },
  {
    id: "purchasing-recyclables",
    title: "Recycling",
    description:
      "We buy carton, plastic, aluminum, copper, metal with transparent weights and fair pricing.",
    bullets: [
      "Carton, plastic, aluminum, copper, metal",
      "Recurring volume programs",
      "Documented weights & clear payouts",
    ],
    category: "Recyclables",
  },
  {
    id: "septic-tank-siphoning",
    title: "Septic Tank Siphoning",
    description:
      "Safe and compliant septic siphoning to keep facilities operating smoothly.",
    bullets: [
      "Quick-response scheduling",
      "Secure transport & treatment",
      "Preventative maintenance",
    ],
    category: "Septic",
  },
];

const ServicesSection = () => {
  return (
    <SectionShell
      id="services"
      label="Our Services"
      headline="Built for Real Operations."
      subheadline="Mixed waste to recyclables. Keeping your sites moving."
      variant="default"
    >
      <div className="grid gap-3 md:grid-cols-3 lg:gap-4">
        {servicesData.map((service, index) => (
          <RevealOnScroll
            key={service.id}
            delayClass={`delay-[${(index + 1) * 100}ms]`}
          >
            <article className="group flex h-full flex-col justify-between rounded-xl border border-white/20 bg-black/40 p-4 backdrop-blur transition-all duration-500 hover:-translate-y-1 hover:border-[#15803d] hover:bg-black/60 hover:shadow-[0_15px_40px_rgba(21,128,61,0.3)] sm:p-5 lg:p-6">
              <div>
                <div className="mb-2 flex items-center gap-2 sm:mb-3">
                  <span className="h-0.5 w-5 bg-[#15803d] sm:w-6" />
                  <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/60 sm:text-[10px]">
                    {service.category}
                  </p>
                </div>
                <h3 className="mb-2 text-sm font-bold leading-tight text-white sm:mb-3 sm:text-base lg:text-lg">
                  <TextHighlight
                    delay={(index + 1) * 0.3}
                    duration={1.0}
                    direction="left"
                  >
                    {service.title}
                  </TextHighlight>
                </h3>
                <p className="text-xs leading-snug text-white/70 sm:text-sm sm:leading-relaxed">
                  {service.description}
                </p>
              </div>

              <ul className="mt-3 space-y-1.5 text-[11px] text-white/60 sm:mt-4 sm:space-y-2 sm:text-xs lg:text-sm">
                {service.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2">
                    <span className="mt-1 h-0.5 w-0.5 flex-shrink-0 rounded-full bg-[#15803d] sm:h-1 sm:w-1" />
                    <span className="leading-snug sm:leading-relaxed">
                      {bullet}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          </RevealOnScroll>
        ))}
      </div>
    </SectionShell>
  );
};

export default ServicesSection;
