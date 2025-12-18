import React from "react";
import SectionShell from "../common/SectionShell";
import RevealOnScroll from "../common/RevealOnScroll";
import {
  SlideShow,
  SlideShowText,
  SlideShowImageWrap,
  SlideShowImage,
  useSlideShowContext,
} from "../common/AnimatedSlideshow";
import oct10Image from "../../assets/showcase/oct10.png";
import sept26Image from "../../assets/showcase/sept26.png";
import sept10Image from "../../assets/showcase/sept10.png";
import sept5Image from "../../assets/showcase/sept5.png";
import aug13Image from "../../assets/showcase/aug13.png";
import june6Image from "../../assets/showcase/june6.png";

const showcaseEvents = [
  {
    id: 1,
    title: "Flood-Free Cebu Event",
    date: "October 10, 2025",
    tagline: "Flood-free starts with waste-free.",
    description:
      "Our Waste PH team joined the Flood-Free Cebu event to share how proper waste management plays a vital role in preventing flooding. We truly appreciate everyone who stopped by our booth to learn more about what we do!",
    callToAction:
      "Together, let's build a cleaner, safer, and more resilient Cebu.",
    image: oct10Image,
  },
  {
    id: 2,
    title: "VisMin Hospitality Summit",
    date: "September 26, 2025",
    tagline: "Engaging the hospitality industry.",
    description:
      "Our heartfelt appreciation goes out to all who dropped by our booth at the 2nd Philippine VisMin Hospitality Summit in Nustar Fili Hotel. Thank you for engaging with us, playing our mini game about segregation, and taking home some Waste PH giveaways!",
    callToAction:
      "Building partnerships for sustainable waste management in the hospitality sector.",
    image: sept26Image,
  },
  {
    id: 3,
    title: "BPO/Mall Waste Clearing",
    date: "September 10, 2025",
    tagline: "Piled-Up Garbage? Cleared by Waste PH.",
    description:
      "Our waste management crew successfully cleared the accumulated waste at a well-known BPO/mall right in the city center.",
    callToAction:
      "Efficient waste removal services for commercial and business establishments.",
    image: sept10Image,
  },
  {
    id: 4,
    title: "Barangay Luz Partnership",
    date: "September 5, 2025",
    tagline: "Sealing the deal and sharing our mission!",
    description:
      "After a successful 2 months pilot program in reducing waste to landfill with Barangay Luz, Waste PH has been awarded their official Waste Management partner for their Recyclables. To mark this milestone, Barangay Luz conducted an orientation that emphasized our contributions and progress so far.",
    callToAction:
      "Proud to serve our community and lead the way in sustainable waste management.",
    image: sept5Image,
  },
  {
    id: 5,
    title: "Medellin Mayor Meeting",
    date: "August 13, 2025",
    tagline: "Waste PH is thankful to talk proper waste management.",
    description:
      "Waste PH is thankful to talk proper waste management and sustainability practices with the new mayor & team of Medellin, Cebu. Looking forward to a cleaner future!",
    callToAction:
      "Partnering with local government for sustainable waste solutions.",
    image: aug13Image,
  },
  {
    id: 6,
    title: "World Environment Day",
    date: "June 6, 2025",
    tagline: "Plaza Independencia celebrates with Waste PH.",
    description:
      "We're grateful to have been part of the World Environment Day event at Plaza Independencia! Thank you to the public for showing support, to those who visited our booth, and for properly disposing of their trash in our garbage compactor. Special thanks to Mayor Archival for stopping by and taking a photo with our team!",
    callToAction: "Your support means a lot for a cleaner and greener Cebu!",
    image: june6Image,
  },
];

// Date Badge Component that shows active event date
const DateBadge = () => {
  const { activeSlide } = useSlideShowContext();
  const activeEvent = showcaseEvents[activeSlide];

  return (
    <div className="pointer-events-none absolute bottom-0 left-0 right-0 p-2 sm:p-3">
      <div className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/60 px-2 py-0.5 backdrop-blur-xl sm:gap-1.5 sm:px-2.5 sm:py-1">
        <div className="relative h-1.5 w-1.5 rounded-full bg-[#15803d]">
          <div className="absolute h-1.5 w-1.5 animate-ping rounded-full bg-[#15803d]" />
        </div>
        <span className="text-[8px] font-bold uppercase tracking-wider text-white sm:text-[9px]">
          {activeEvent?.date}
        </span>
      </div>
    </div>
  );
};

// Event Card Component that triggers slide change on hover/click
const EventCard = ({ event, index, activeIndex, onToggle }) => {
  const { changeSlide } = useSlideShowContext();
  const isExpanded = activeIndex === index;
  const [isMobile, setIsMobile] = React.useState(false);

  // Detect if device is mobile
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleMouseEnter = () => {
    changeSlide(index);
  };

  const handleClick = () => {
    // Only handle clicks on mobile devices
    if (isMobile) {
      changeSlide(index);
      onToggle(index);
    }
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      className={`group relative cursor-pointer overflow-hidden rounded-lg border border-white/10 bg-black/20 backdrop-blur-sm transition-all duration-300 hover:border-[#15803d]/50 hover:bg-black/40 ${
        isExpanded ? "border-[#15803d]/50 bg-black/40" : ""
      }`}
    >
      {/* Collapsed View - Always Visible */}
      <div className="flex items-center justify-between gap-2 p-2.5 sm:gap-3 sm:p-3 md:p-3.5 lg:p-4">
        {/* Number & Title */}
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#15803d]/20 text-[10px] font-black text-[#15803d] transition-all group-hover:bg-[#15803d] group-hover:text-white sm:h-7 sm:w-7 sm:text-xs md:h-8 md:w-8 md:text-sm">
            {index + 1}
          </span>
          <h3 className="flex min-w-0 flex-1 items-center text-sm font-bold leading-tight text-white sm:text-base md:text-lg lg:text-xl">
            <SlideShowText text={event.title} index={index} />
          </h3>
        </div>

        {/* Expand Icon */}
        <svg
          className={`h-3.5 w-3.5 flex-shrink-0 text-[#15803d]/70 transition-transform duration-300 group-hover:rotate-90 group-hover:text-[#15803d] sm:h-4 sm:w-4 md:h-5 md:w-5 ${
            isExpanded ? "rotate-90 text-[#15803d]" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>

      {/* Expanded Details - Show on Hover/Click */}
      <div
        className={`grid transition-all duration-300 ${
          isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        } group-hover:grid-rows-[1fr]`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-white/10 px-2.5 pb-2.5 pt-1.5 sm:px-3 sm:pb-3 sm:pt-2 md:px-3.5 md:pb-3.5 lg:px-4 lg:pb-4">
            {/* Date */}
            <p className="mb-1.5 text-[9px] font-bold uppercase tracking-wider text-white/40 sm:mb-2 sm:text-[10px] md:text-xs">
              {event.date}
            </p>

            {/* Tagline */}
            <p className="mb-1.5 text-[11px] font-semibold italic text-[#15803d] sm:mb-2 sm:text-xs md:text-sm">
              {event.tagline}
            </p>

            {/* Description */}
            <p className="mb-1.5 text-[11px] leading-relaxed text-white/70 sm:mb-2 sm:text-xs md:text-sm">
              {event.description}
            </p>

            {/* Call to Action */}
            <div className="rounded-md border border-[#15803d]/20 bg-[#15803d]/5 p-1.5 sm:rounded-lg sm:p-2 md:p-2.5">
              <p className="text-[11px] font-semibold leading-relaxed text-white/90 sm:text-xs md:text-sm">
                {event.callToAction}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ServicesSlideshow = () => {
  const [activeCardIndex, setActiveCardIndex] = React.useState(null);

  const handleCardToggle = (index) => {
    // If clicking the same card, close it; otherwise open the new one
    setActiveCardIndex(activeCardIndex === index ? null : index);
  };

  // Preload all images for better performance
  React.useEffect(() => {
    showcaseEvents.forEach((event) => {
      const img = new Image();
      img.src = event.image;
    });
  }, []);

  return (
    <SectionShell
      id="community-showcase"
      label="Community Impact"
      headline="Building a Resilient Cebu"
      variant="default"
      fullHeight
    >
      <style>{`
        #community-showcase > div {
          gap: 0.75rem !important;
        }
        #community-showcase .flex.flex-col > div {
          max-width: 100% !important;
        }
      `}</style>
      <div className="flex h-full items-center py-2 md:py-3 lg:py-0">
        <SlideShow
          defaultSlide={0}
          className="grid w-full gap-3 md:gap-4 lg:grid-cols-[1fr_1fr] lg:gap-6"
        >
          {/* Left Side - Event List */}
          <div className="order-2 flex h-full flex-col justify-center gap-1.5 md:gap-2 lg:order-1 lg:gap-2">
            {showcaseEvents.map((event, index) => (
              <RevealOnScroll
                key={event.id}
                delayClass={`delay-[${(index + 1) * 100}ms]`}
                variant="fade-right"
              >
                <EventCard
                  event={event}
                  index={index}
                  activeIndex={activeCardIndex}
                  onToggle={handleCardToggle}
                />
              </RevealOnScroll>
            ))}
          </div>

          {/* Right Side - Image Display */}
          <RevealOnScroll delayClass="delay-100" variant="fade-left">
            <div className="order-1 flex items-center lg:order-2">
              <div className="relative w-full overflow-hidden rounded-lg border border-white/20 bg-black/40 backdrop-blur-xl sm:rounded-xl lg:max-h-[85%]">
                <SlideShowImageWrap className="aspect-[4/3] h-auto sm:aspect-[3/2] lg:aspect-auto lg:h-full">
                  {showcaseEvents.map((event, index) => (
                    <SlideShowImage
                      key={event.id}
                      index={index}
                      imageUrl={event.image}
                      alt={event.title}
                      className="object-cover"
                    />
                  ))}
                </SlideShowImageWrap>

                {/* Gradient Overlay */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Active Event Date Badge */}
                <DateBadge />
              </div>
            </div>
          </RevealOnScroll>
        </SlideShow>
      </div>
    </SectionShell>
  );
};

export default ServicesSlideshow;
