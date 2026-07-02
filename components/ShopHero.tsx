'use client';

import { useEffect } from 'react';

export default function ShopHero() {
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).AOS) {
      (window as any).AOS.init();
    }
  }, []);

  return (
    <section
      className="relative min-h-[110vh] flex items-center justify-center overflow-hidden bg-fill bg-center text-white py-20"
      style={{ backgroundImage: "url('/Shop hero.JPG')" }}
    >
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Shop to Support</h1>
        <p className="text-lg md:text-xl opacity-90">
          Purchase unique products made by parents of our sponsored children. Income supports both the child and their family.
        </p>
      </div>
    </section>
  );
}
