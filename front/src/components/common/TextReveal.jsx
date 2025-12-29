import React, { useEffect, useRef, useState } from "react";

/**
 * TextReveal component - Text unveils with a sweep/curtain effect on scroll
 * Creates a masked overlay that slides away to reveal text underneath
 */
const TextReveal = ({
  children,
  delay = 0,
  duration = 1.2,
  direction = "left", // left, right, top, bottom
  className = "",
}) => {
  const elementRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

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
        threshold: 0.2,
        rootMargin: "0px 0px -100px 0px",
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [isVisible]);

  // Direction-based transform - using translate3d for GPU acceleration
  const getTransform = () => {
    switch (direction) {
      case "left":
        return "translate3d(-101%, 0, 0)";
      case "right":
        return "translate3d(101%, 0, 0)";
      case "top":
        return "translate3d(0, -101%, 0)";
      case "bottom":
        return "translate3d(0, 101%, 0)";
      default:
        return "translate3d(-101%, 0, 0)";
    }
  };

  return (
    <span
      ref={elementRef}
      className={`relative inline-block overflow-hidden ${className}`}
      style={{
        willChange: isVisible ? "auto" : "transform",
      }}
    >
      {/* The actual text */}
      <span className="relative z-10">{children}</span>

      {/* Animated overlay/curtain that slides away - GPU accelerated */}
      <span
        className="absolute inset-0 z-20 bg-linear-to-r from-[#15803d] to-[#16a34a]"
        style={{
          transform: isVisible ? getTransform() : "translate3d(0, 0, 0)",
          transition: `transform ${duration}s cubic-bezier(0.77, 0, 0.175, 1) ${delay}s`,
          willChange: isVisible ? "auto" : "transform",
        }}
      />
    </span>
  );
};

export default TextReveal;
