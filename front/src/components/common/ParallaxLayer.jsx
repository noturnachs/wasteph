import React, { useEffect, useState, useRef } from "react";

/**
 * Optimized ParallaxLayer with requestAnimationFrame
 * Performance improvements:
 * - Uses RAF for smooth 60fps animations
 * - Throttles calculations to prevent excessive re-renders
 * - GPU accelerated transforms
 */
const ParallaxLayer = ({ speed = 0.3, className = "", children }) => {
  const [offsetY, setOffsetY] = useState(0);
  const rafRef = useRef(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      lastScrollY.current = window.scrollY;

      if (!ticking) {
        rafRef.current = requestAnimationFrame(() => {
          const nextOffset = lastScrollY.current * speed;
          setOffsetY(nextOffset);
          ticking = false;
        });
        ticking = true;
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [speed]);

  const style = {
    transform: `translate3d(0, ${offsetY}px, 0)`,
    willChange: offsetY !== 0 ? "transform" : "auto",
    backfaceVisibility: "hidden",
  };

  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
};

export default ParallaxLayer;
