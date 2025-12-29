import React, { useEffect, useRef, useState } from "react";

/**
 * ScrollAnimation component - smooth scroll-triggered animations
 * Variants: fade-up, fade-down, fade-left, fade-right, scale, rotate
 */
const ScrollAnimation = ({
  children,
  variant = "fade-up",
  delay = 0,
  duration = 1000,
  className = "",
}) => {
  const elementRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Only trigger once when entering viewport, never hide again
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px",
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [isVisible]);

  // Variant styles
  const getVariantStyle = () => {
    const baseTransition = `transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, opacity ${duration}ms ease-out ${delay}ms`;

    const variants = {
      "fade-up": {
        transform: isVisible
          ? "translateY(0) scale(1)"
          : "translateY(60px) scale(0.95)",
        opacity: isVisible ? 1 : 0,
      },
      "fade-down": {
        transform: isVisible
          ? "translateY(0) scale(1)"
          : "translateY(-60px) scale(0.95)",
        opacity: isVisible ? 1 : 0,
      },
      "fade-left": {
        transform: isVisible
          ? "translateX(0) scale(1)"
          : "translateX(60px) scale(0.95)",
        opacity: isVisible ? 1 : 0,
      },
      "fade-right": {
        transform: isVisible
          ? "translateX(0) scale(1)"
          : "translateX(-60px) scale(0.95)",
        opacity: isVisible ? 1 : 0,
      },
      scale: {
        transform: isVisible ? "scale(1)" : "scale(0.8)",
        opacity: isVisible ? 1 : 0,
      },
      rotate: {
        transform: isVisible
          ? "rotate(0deg) scale(1)"
          : "rotate(-5deg) scale(0.9)",
        opacity: isVisible ? 1 : 0,
      },
      parallax: {
        transform: `translateY(${(1 - scrollProgress) * 100}px)`,
        opacity: scrollProgress,
      },
    };

    return {
      ...variants[variant],
      transition: baseTransition,
      willChange: "transform, opacity",
    };
  };

  return (
    <div ref={elementRef} className={className} style={getVariantStyle()}>
      {children}
    </div>
  );
};

export default ScrollAnimation;
