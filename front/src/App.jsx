import React, { useState, useEffect, lazy, Suspense } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollableLayout from "./components/layout/ScrollableLayout";
import HeroSection from "./components/sections/HeroSection";
import LoadingScreen from "./components/common/LoadingScreen";
import TopographicCanvas from "./components/common/TopographicCanvas";

// Lazy load sections that are below the fold for faster initial load
const ClientsSection = lazy(() =>
  import("./components/sections/ClientsSection")
);
const MessageSection = lazy(() =>
  import("./components/sections/MessageSection")
);
const ServicesSection = lazy(() =>
  import("./components/sections/ServicesSection")
);
const WasteStreamsShowcase = lazy(() =>
  import("./components/sections/WasteStreamsShowcase")
);
const ProcessSection = lazy(() =>
  import("./components/sections/ProcessSection")
);
const ServicesSlideshow = lazy(() =>
  import("./components/sections/ServicesSlideshow")
);
const CTASection = lazy(() => import("./components/sections/CTASection"));

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  // Prevent scroll while loading
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isLoading]);

  return (
    <>
      {isLoading && <LoadingScreen onLoadingComplete={handleLoadingComplete} />}

      <div className="relative">
        {/* Global topographic background - receives all mouse events */}
        <div className="fixed inset-0" style={{ zIndex: 0 }}>
          <TopographicCanvas />
        </div>

        {/* Content layer - pointer-events-none except for interactive elements */}
        <div className="pointer-events-none relative" style={{ zIndex: 1 }}>
          <ScrollableLayout>
            <Header />
            <main className="pt-20">
              <HeroSection />
              <Suspense fallback={<div className="min-h-screen" />}>
                <MessageSection />
                <ServicesSection />
                <WasteStreamsShowcase />
                <ProcessSection />
                <ServicesSlideshow />
                <CTASection />
                <ClientsSection />
              </Suspense>
            </main>
            <Footer />
          </ScrollableLayout>
        </div>
      </div>
    </>
  );
};

export default App;
