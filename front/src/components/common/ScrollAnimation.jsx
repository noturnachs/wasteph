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

    const handleScroll = () => {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate scroll progress (0 to 1)
      const elementTop = rect.top;
      const elementHeight = rect.height;
      const progress = Math.max(
        0,
        Math.min(
          1,
          (windowHeight - elementTop) / (windowHeight + elementHeight)
        )
      );

      setScrollProgress(progress);

      // Trigger visibility
      if (elementTop < windowHeight * 0.85 && elementTop > -elementHeight) {
        setIsVisible(true);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -15% 0px",
      }
    );

    observer.observe(element);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
