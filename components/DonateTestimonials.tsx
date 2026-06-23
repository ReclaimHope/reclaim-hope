'use client';

import { useEffect } from 'react';

export default function DonateTestimonials() {
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).AOS) {
      (window as any).AOS.init();
    }
  }, []);

  const testimonials = [
    {
      type: 'donor',
      name: 'Sarah Johnson',
      location: 'Canada',
      image: '👩',
      quote: "Seeing the difference my monthly donation makes in these children's lives is incredibly rewarding. The photos and stories I receive keep me motivated to continue supporting.",
      impact: 'Monthly donor for 2 years'
    },
    {
      type: 'child',
      name: 'Jean-Paul',
      location: 'Rwanda',
      image: '👦',
      quote: "Because of donors like you, I can go to school every day and have enough to eat. I dream of becoming a doctor to help my community.",
      impact: 'Age 12, sponsored for education'
    },
    {
      type: 'sponsor',
      name: 'Michael Chen',
      location: 'United States',
      image: '👨',
      quote: "Being a sponsor has connected me personally with the amazing work being done. The letters from 'my' child fill me with hope for the future.",
      impact: 'Child sponsor since 2022'
    },
    {
      type: 'donor',
      name: 'Emma Thompson',
      location: 'United Kingdom',
      image: '👩',
      quote: "I started with a small donation and now I give monthly. The transparency and impact reporting make me confident my money is well-used.",
      impact: 'First-time donor turned monthly supporter'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            data-aos="fade-up"
          >
            Stories of Impact
          </h2>
          <p
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Real voices from our donors, sponsored children, and community members
            who have experienced the transformative power of your generosity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
              data-aos="fade-up"
              data-aos-delay={index * 100 + 400}
            >
              <div className="flex items-start mb-6">
                <div className="text-4xl mr-4">{testimonial.image}</div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">
                    {testimonial.name}
                  </h3>
                  <p className="text-gray-600">{testimonial.location}</p>
                  <p className="text-yellow-600 font-semibold text-sm mt-1">
                    {testimonial.impact}
                  </p>
                </div>
              </div>

              <blockquote className="text-gray-700 italic text-lg leading-relaxed">
                "{testimonial.quote}"
              </blockquote>

              <div className="mt-6 flex items-center">
                <div className="flex text-[#f9d20a]">
                  {'★'.repeat(5)}
                </div>
                <span className="ml-2 text-gray-600 text-sm">
                  Verified {testimonial.type === 'donor' ? 'donor' :
                           testimonial.type === 'child' ? 'beneficiary' : 'sponsor'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div
          className="text-center mt-16"
          data-aos="fade-up"
          data-aos-delay="800"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Join These Stories of Hope
            </h3>
            <p className="text-gray-600 mb-6">
              Your donation can create similar stories of transformation.
              Every child deserves the chance to dream big and achieve their potential.
            </p>
            <a
              href="#donation-form"
              className="bg-[#f9d20a] hover:bg-[#e6b800] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg inline-block"
            >
              Start Your Story Today
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}