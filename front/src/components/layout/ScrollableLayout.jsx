import React from "react";

const ScrollableLayout = ({ children }) => {
  return (
    <div className="min-h-screen w-full overflow-x-hidden text-white">
      <div className="relative min-h-screen scroll-smooth">{children}</div>
    </div>
  );
};

export default ScrollableLayout;
