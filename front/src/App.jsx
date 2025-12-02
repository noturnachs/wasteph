import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollableLayout from "./components/layout/ScrollableLayout";
import HeroSection from "./components/sections/HeroSection";
import MessageSection from "./components/sections/MessageSection";
import ServicesSection from "./components/sections/ServicesSection";
import WasteStreamsShowcase from "./components/sections/WasteStreamsShowcase";
import ProcessSection from "./components/sections/ProcessSection";
import CTASection from "./components/sections/CTASection";
import LoadingScreen from "./components/common/LoadingScreen";
import TopographicCanvas from "./components/common/TopographicCanvas";

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

      {/* Global topographic background - receives all mouse events */}
      <div className="fixed inset-0" style={{ zIndex: 1 }}>
        <TopographicCanvas />
      </div>

      {/* Content layer - pointer-events-none except for interactive elements */}
      <div className="pointer-events-none relative" style={{ zIndex: 10 }}>
        <ScrollableLayout>
          <Header />
          <main className="pt-20">
            <HeroSection />
            <MessageSection />
            <ServicesSection />
            <WasteStreamsShowcase />
            <ProcessSection />
            <CTASection />
          </main>
          <Footer />
        </ScrollableLayout>
      </div>
    </>
  );
};

export default App;
