import React from "react";
import flickrLogo from "../../assets/clients/flickr.svg";
import metaLogo from "../../assets/clients/meta.svg";
import tiktokLogo from "../../assets/clients/tiktok.svg";
import youtubeLogo from "../../assets/clients/youtube.svg";

// Client data with imported SVG logos
const clients = [
  { name: "Flickr", logo: flickrLogo },
  { name: "Meta", logo: metaLogo },
  { name: "TikTok", logo: tiktokLogo },
  { name: "YouTube", logo: youtubeLogo },
];

const ClientsSection = () => {
  // Duplicate the array for seamless infinite scroll
  const duplicatedClients = [...clients, ...clients, ...clients];

  return (
    <section className="relative overflow-hidden border-y border-white/5 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Section title */}
        <div className="mb-12 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-white/40">
            Trusted By Leading Organizations
          </p>
        </div>

        {/* Infinite scroll container */}
        <div className="relative">
          {/* Gradient fade edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-[#0a1f0f] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-[#0a1f0f] to-transparent" />

          {/* Scrolling track */}
          <div className="flex overflow-hidden">
            <div className="flex animate-scroll-infinite gap-12">
              {duplicatedClients.map((client, index) => (
                <div
                  key={`${client.name}-${index}`}
                  className="group flex min-w-[200px] items-center justify-center rounded-2xl border border-white/5 bg-white/[0.02] px-8 py-6 backdrop-blur-sm transition-all duration-300 hover:border-[#15803d]/30 hover:bg-white/5"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex h-12 items-center justify-center transition-all duration-300 group-hover:scale-110">
                      <img
                        src={client.logo}
                        alt={`${client.name} logo`}
                        className="h-8 w-auto opacity-50 brightness-0 invert transition-all duration-300 group-hover:opacity-80"
                      />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/50 transition-colors duration-300 group-hover:text-white/80">
                      {client.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientsSection;
