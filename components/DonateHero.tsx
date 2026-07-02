'use client';

import { useEffect } from 'react';

export default function DonateHero() {
  useEffect(() => {
    // Initialize AOS if available
    if (typeof window !== 'undefined' && (window as any).AOS) {
      (window as any).AOS.init();
    }
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/donate.JPG')",
        }}
      >
      </div>
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/10"></div>
      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <div
          className="animate-fade-up"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Your Support Changes Lives
          </h1>

          <p className="text-xl md:text-2xl mb-8 leading-relaxed opacity-90">
            Every contribution helps provide education, nutrition, mentorship, and hope to underserved children across Rwanda.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="#donation-form"
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Donate Now
            </a>

            <a
              href="#impact"
              className="bg-[#001f3f] backdrop-blur-md border border-white/30 hover:bg-[#003366] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105"
            >
              See Our Impact
            </a>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}