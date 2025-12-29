import React, { useEffect, useRef, useState } from "react";

const RevealOnScroll = ({
  children,
  delayClass = "",
  className = "",
  variant = "fade-up",
}) => {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const handleEntries = (entries) => {
      entries.forEach((entry) => {
        // Only trigger once when entering viewport, never hide again
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      });
    };

    const observer = new IntersectionObserver(handleEntries, {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px",
    });

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [isVisible]);

  const baseClasses =
    "transform-gpu transition-all duration-[1200ms] will-change-transform will-change-opacity";

  // Different animation variants
  const variants = {
    "fade-up": {
      hidden: "opacity-0 translate-y-20 scale-[0.97]",
      shown: "opacity-100 translate-y-0 scale-100",
    },
    "fade-down": {
      hidden: "opacity-0 -translate-y-20 scale-[0.97]",
      shown: "opacity-100 translate-y-0 scale-100",
    },
    "fade-left": {
      hidden: "opacity-0 translate-x-20 scale-[0.97]",
      shown: "opacity-100 translate-x-0 scale-100",
    },
    "fade-right": {
      hidden: "opacity-0 -translate-x-20 scale-[0.97]",
      shown: "opacity-100 translate-x-0 scale-100",
    },
    scale: {
      hidden: "opacity-0 scale-90",
      shown: "opacity-100 scale-100",
    },
  };

  const currentVariant = variants[variant] || variants["fade-up"];
  const transitionTiming = "cubic-bezier(0.16, 1, 0.3, 1)"; // Smooth easing like landonorris.com

  const resolvedClasses = `${baseClasses} ${
    isVisible ? currentVariant.shown : currentVariant.hidden
  } ${delayClass} ${className}`;

  return (
    <div
      ref={containerRef}
      className={resolvedClasses}
      style={{
        transitionTimingFunction: transitionTiming,
        backfaceVisibility: "hidden",
      }}
    >
      {children}
    </div>
  );
};

export default RevealOnScroll;
