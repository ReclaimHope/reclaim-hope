'use client';

import { useEffect } from 'react';

export default function ImpactTransparency() {
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).AOS) {
      (window as any).AOS.init();
    }
  }, []);

  const fundUsage = [
    { category: 'Education Programs', percentage: 45, amount: '$45,000' },
    { category: 'Nutrition & Meals', percentage: 25, amount: '$25,000' },
    { category: 'Mentorship & Support', percentage: 15, amount: '$15,000' },
    { category: 'School Supplies', percentage: 10, amount: '$10,000' },
    { category: 'Administration', percentage: 5, amount: '$5,000' }
  ];

  return (
    <section id="impact" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            data-aos="fade-up"
          >
            Your Money at Work
          </h2>
          <p
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            We believe in complete transparency. Here's exactly how your donations
            are used to create lasting change in children's lives.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Fund Usage Breakdown */}
          <div data-aos="fade-right" data-aos-delay="400">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              How Your Donations Are Used
            </h3>
            <div className="space-y-4">
              {fundUsage.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-900">
                        {item.category}
                      </span>
                      <span className="text-[#f9d20a] font-bold">
                        {item.percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-[#f9d20a] h-3 rounded-full transition-all duration-1000"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transparency Stats */}
          <div data-aos="fade-left" data-aos-delay="400">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Our Commitment to Transparency
            </h3>
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center mb-3">
                  <div className="text-green-600 text-2xl mr-3">✓</div>
                  <h4 className="font-bold text-green-900">100% Direct Impact</h4>
                </div>
                <p className="text-green-700">
                  Every dollar donated goes directly to child-focused programs
                  and community initiatives. No exceptions.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center mb-3">
                  <div className="text-blue-600 text-2xl mr-3">📊</div>
                  <h4 className="font-bold text-blue-900">Regular Reporting</h4>
                </div>
                <p className="text-blue-700">
                  We provide quarterly impact reports and annual financial
                  statements to all donors.
                </p>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <div className="flex items-center mb-3">
                  <div className="text-purple-600 text-2xl mr-3">🏛️</div>
                  <h4 className="font-bold text-purple-900">Registered NGO</h4>
                </div>
                <p className="text-purple-700">
                  Officially registered as a non-profit organization in Rwanda
                  with full legal compliance and accountability.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Accountability Statement */}
        <div
          className="bg-gray-900 text-white rounded-2xl p-8 text-center"
          data-aos="fade-up"
          data-aos-delay="600"
        >
          <h3 className="text-3xl font-bold mb-6">
            Our Accountability Promise
          </h3>
          <p className="text-xl mb-8 opacity-90 max-w-4xl mx-auto">
            We are committed to the highest standards of financial transparency and ethical practices.
            Your trust is our most valuable asset, and we honor it with complete openness about
            how we use every contribution to create positive change.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-yellow-400 mb-2">98%</div>
              <div className="text-gray-300">Program Efficiency</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-400 mb-2">100%</div>
              <div className="text-gray-300">Financial Transparency</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-400 mb-2">24/7</div>
              <div className="text-gray-300">Donor Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}