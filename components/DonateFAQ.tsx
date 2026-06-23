'use client';

import { useState, useEffect } from 'react';
import StillHaveQuestion from './stillHaveQuestion';

export default function DonateFAQ() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).AOS) {
      (window as any).AOS.init();
    }
  }, []);

  const faqs = [
    {
      question: "Can I donate internationally?",
      answer: "Yes! We accept donations from anywhere in the world. International donors can use credit/debit cards, PayPal, or local payment methods through our partners. All international donations are tax-deductible where applicable."
    },
    {
      question: "Will I receive confirmation of my donation?",
      answer: "Yes, immediately after your donation, you'll receive an email confirmation with your receipt and tax-deductible documentation. Monthly donors receive quarterly impact updates and annual summaries."
    },
    {
      question: "Can I change or cancel my monthly donation?",
      answer: "Of course! You can modify your monthly donation amount, change payment methods, or cancel at any time through your donor dashboard or by contacting us. No questions asked."
    },
    {
      question: "How are donations used?",
      answer: "100% of donations directly support our programs. We provide detailed breakdowns of fund usage in our quarterly reports. Currently, 45% goes to education, 25% to nutrition, 15% to mentorship, 10% to supplies, and 5% to administration."
    },
    {
      question: "Is my donation tax-deductible?",
      answer: "For US donors, yes - we are a 501(c)(3) registered nonprofit. International donors should consult their local tax authorities. We provide all necessary documentation for tax purposes."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept credit/debit cards (Visa, Mastercard, American Express), PayPal, bank transfers, and mobile money options popular in Africa (MTN Mobile Money, Airtel Money). For larger donations, we can arrange wire transfers."
    },
    {
      question: "Can I sponsor a specific child?",
      answer: "Yes! Our child sponsorship program allows you to directly support a specific child. Sponsors receive photos, letters, and progress updates from their sponsored child. Contact us to learn more about available sponsorship opportunities."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            data-aos="fade-up"
          >
            Frequently Asked Questions
          </h2>
          <p
            className="text-xl text-gray-600"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Everything you need to know about donating to Reclaim Hope.
            Can't find what you're looking for? Contact us anytime.
          </p>
        </div>

        <div className="space-y-4" data-aos="fade-up" data-aos-delay="400">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-100 transition-colors duration-200"
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  {faq.question}
                </h3>
                <div className={`transform transition-transform duration-200 ${openFAQ === index ? 'rotate-180' : ''
                  }`}>
                  <svg
                    className="w-6 h-6 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>

              {openFAQ === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-700 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Still have questions */}
       <StillHaveQuestion/>
      </div>
    </section>
  );
}