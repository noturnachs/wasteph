import React, { useEffect, useState } from "react";

const LoadingScreen = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Block scrolling
    document.body.style.overflow = "hidden";

    // Simulate loading progress
    const duration = 1000; // 1 second
    const steps = 60;
    const increment = 100 / steps;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      setProgress(Math.min(currentStep * increment, 100));

      if (currentStep >= steps) {
        clearInterval(interval);
        // Start exit animation
        setTimeout(() => {
          setIsExiting(true);
          // Call completion callback after fade completes
          setTimeout(() => {
            document.body.style.overflow = "unset";
            if (onLoadingComplete) onLoadingComplete();
          }, 800);
        }, 200);
      }
    }, stepDuration);

    return () => {
      clearInterval(interval);
      document.body.style.overflow = "unset";
    };
  }, [onLoadingComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-700 ${
        isExiting ? "opacity-0" : "opacity-100"
      }`}
      style={{
        background: "linear-gradient(135deg, #0a1f0f 0%, #051008 100%)",
      }}
    >
      <div className="flex flex-col items-center gap-8">
        {/* Brand Logo Area */}
        <div className="relative">
          {/* Subtle glow effect */}
          <div className="absolute inset-0 animate-pulse-glow rounded-full bg-[#15803d]/20 blur-[60px]" />

          {/* Main logo/icon - Simple circle loader */}
          <div className="relative flex h-24 w-24 items-center justify-center">
            {/* Animated progress circle */}
            <svg className="h-24 w-24 -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="rgba(21, 128, 61, 0.1)"
                strokeWidth="3"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#15803d"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress / 100)}`}
                style={{
                  transition: "stroke-dashoffset 0.3s ease-out",
                  filter: "drop-shadow(0 0 8px rgba(21, 128, 61, 0.5))",
                }}
              />
            </svg>

            {/* Center icon - Leaf */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="h-10 w-10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#15803d"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
              </svg>
            </div>
          </div>
        </div>

        {/* Company Name */}
        <div className="flex flex-col items-center gap-3">
          <h1 className="text-4xl font-black uppercase tracking-[0.2em] text-white">
            Waste<span className="text-[#15803d]">PH</span>
          </h1>
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-white/40">
            Responsible Waste Management
          </p>
        </div>

        {/* Minimal Progress Bar */}
        <div className="w-64">
          <div className="h-0.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#15803d] to-[#16a34a] transition-all duration-300 ease-out"
              style={{
                width: `${progress}%`,
                boxShadow: "0 0 10px rgba(21, 128, 61, 0.5)",
              }}
            />
          </div>
          <p className="mt-2 text-center text-xs font-semibold tabular-nums text-[#15803d]">
            {Math.round(progress)}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
