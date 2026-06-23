"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const slides = [
  "/Home 1.JPG",
  // "/Impact .jpg",
  "/Home 3.jpg",
  "/Home 4.jpg",
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Slideshow */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={slide}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={slide}
              alt="Children in Rwanda receiving education and support from Reclaim Hope"
              fill
              priority={index === 0}
              quality={85}
              sizes="100vw"
              className="object-cover scale-105"
            />
          </div>
        ))}
      </div>

      {/* Dark Overlay */}
      {/* <div className="absolute inset-0 bg-black/60 z-[1]" /> */}

      {/* Content */}
      <div className="relative z-10 flex h-full items-center justify-center px-6">
        <div className="max-w-2xl text-center text-white">
          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-bold leading-tight animate-fade-up">
            Reclaim Hope Rwanda
          </h1>

          {/* Subtitle */}
          <p className="mt-4 text-lg md:text-xl text-slate-200 animate-fade-up-delay-2">
            Empowering children, transforming lives, and building a brighter
            future through education and care.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center animate-fade-up-delay-3">
            <a
              href="/donate"
              className="px-6 py-3 bg-[#f9d20a] hover:bg-yellow-500 transition rounded-lg font-semibold"
            >
              Donate Now
            </a>

            <a
              href="/sponsor"
              className="px-6 py-3 bg-green-600 hover:bg-green-500 transition rounded-lg font-semibold"
            >
              Sponsor a Child
            </a>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-3 w-3 rounded-full transition ${
              index === currentSlide
                ? "bg-white"
                : "bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
}