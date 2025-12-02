import React from "react";
import SectionShell from "../common/SectionShell";
import RevealOnScroll from "../common/RevealOnScroll";
import TextHighlight from "../common/TextHighlight";

const MessageSection = () => {
  return (
    <SectionShell
      id="message"
      label="Our Story"
      headline="Redefining Waste Management"
      subheadline="Reducing landfill, maximizing recyclables, and keeping communities clean with transparent, compliant waste handling."
      variant="muted"
    >
      <RevealOnScroll delayClass="delay-300">
        <div className="grid gap-16 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] md:gap-20">
          <div className="space-y-6 text-base leading-relaxed text-white/80 sm:text-lg">
            <p>
              Since our first truck rolled out,{" "}
              <strong className="font-bold text-white">
                <TextHighlight delay={0.3} duration={0.8} direction="left">
                  Waste PH
                </TextHighlight>
              </strong>{" "}
              has focused on one mission:{" "}
              <strong className="font-bold text-white">
                <TextHighlight delay={0.6} duration={1.0} direction="left">
                  move waste the right way
                </TextHighlight>
              </strong>
              . From dense city streets to large construction sites, we design
              hauling solutions that keep your operations clean, safe, and
              compliant.
            </p>
            <p>
              Whether it&apos;s{" "}
              <strong className="font-bold text-white">
                mixed, food, residual, or construction waste
              </strong>
              , we handle the heavy lifting so your teams can stay focused on
              the work that matters most.
            </p>
            <blockquote className="border-l-4 border-[#15803d] bg-white/5 p-6 text-base">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/60">
                A different way to treat waste
              </p>
              <p className="mt-3 text-white">
                It doesn&apos;t matter where your waste starts. What matters is
                where we take it from there—
                <strong className="font-bold">
                  <TextHighlight delay={0.9} duration={1.2} direction="left">
                    diverted, recycled, and disposed of with care
                  </TextHighlight>
                </strong>
                .
              </p>
            </blockquote>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-white/20 bg-white/5 p-6 backdrop-blur">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/70">
                Service Footprint
              </p>
              <ul className="mt-4 space-y-2 text-sm text-white/80">
                <li>Mixed · Food · Residual · Construction waste hauling</li>
                <li>
                  Purchasing of recyclables: carton, plastic, aluminum, copper,
                  metal, and more
                </li>
                <li>Septic tank siphoning and liquid waste management</li>
              </ul>
            </div>

            <div className="grid gap-4">
              <div className="rounded-xl border border-[#15803d]/40 bg-[#15803d]/10 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/80">
                  Mixed Streams
                </p>
                <p className="mt-2 text-sm text-white/70">
                  Tailored hauling for mixed, food, residual, and construction
                  waste.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/80">
                  Recyclables
                </p>
                <p className="mt-2 text-sm text-white/70">
                  Structured purchasing programs for recurring recyclable
                  volumes.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/80">
                  Septic
                </p>
                <p className="mt-2 text-sm text-white/70">
                  Fast-response, compliant septic tank siphoning and treatment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </RevealOnScroll>
    </SectionShell>
  );
};

export default MessageSection;
