import React, { useEffect, useRef, useState } from "react";

/**
 * TextHighlight component - Highlights text with a sweep effect on scroll
 * Uses background gradient animation for better text alignment
 */
const TextHighlight = ({
  children,
  delay = 0,
  duration = 1.2,
  direction = "left",
  className = "",
}) => {
  const elementRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasSwept, setHasSwept] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);

          // Mark as swept when it enters viewport
          if (entry.isIntersecting && !hasSwept) {
            setHasSwept(true);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [hasSwept]);

  // Create gradient animation based on visibility
  const getBackgroundAnimation = () => {
    const baseStyle = {
      backgroundImage:
        "linear-gradient(90deg, rgba(21, 128, 61, 0.5) 0%, rgba(22, 163, 74, 0.5) 100%)",
      backgroundPosition: direction === "right" ? "right" : "left",
      backgroundRepeat: "no-repeat",
    };

    if (!hasSwept) {
      // First time - no highlight
      return {
        ...baseStyle,
        backgroundSize: "0% 100%",
      };
    }

    if (isVisible) {
      // In viewport - sweep and stay highlighted
      return {
        ...baseStyle,
        backgroundSize: "100% 100%",
        transition: `background-size ${duration}s cubic-bezier(0.77, 0, 0.175, 1) ${delay}s`,
      };
    }

    // Out of viewport - remove highlight
    return {
      ...baseStyle,
      backgroundSize: "0% 100%",
      transition: "background-size 0.5s ease-out",
    };
  };

  return (
    <span
      ref={elementRef}
      className={`inline ${className}`}
      style={{
        ...getBackgroundAnimation(),
        paddingLeft: "2px",
        paddingRight: "2px",
      }}
    >
      {children}
    </span>
  );
};

export default TextHighlight;
