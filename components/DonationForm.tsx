'use client';

import { useState, useEffect } from 'react';

export default function DonationForm() {
  const [formData, setFormData] = useState({
    amount: '',
    name: '',
    email: '',
    country: '',
    paymentMethod: 'card',
    message: '',
    isMonthly: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).AOS) {
      (window as any).AOS.init();
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));

    alert('Thank you for your donation! This is a demo form.');
    setIsSubmitting(false);
  };

  return (
    <section id="donation-form" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            data-aos="fade-up"
          >
            Complete Your Donation
          </h2>
          <p
            className="text-xl text-gray-600"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Your secure donation will directly support children in Rwanda.
            All information is encrypted and protected.
          </p>
        </div>

        <div
          className="bg-gray-50 rounded-2xl p-8 shadow-lg"
          data-aos="fade-up"
          data-aos-delay="400"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Donation Amount */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-2">
                Donation Amount ($)
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
                placeholder="Enter amount"
                min="1"
                required
              />
            </div>

            {/* Monthly Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isMonthly"
                checked={formData.isMonthly}
                onChange={handleInputChange}
                className="w-4 h-4 text-yellow-600 focus:ring-yellow-600 border-gray-300 rounded"
              />
              <label className="ml-2 text-gray-700">
                Make this a monthly donation
              </label>
            </div>

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
                  placeholder="Your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            {/* Country */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-2">
                Country
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
                required
              >
                <option value="">Select your country</option>
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="GB">United Kingdom</option>
                <option value="RW">Rwanda</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                Payment Method
              </label>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-yellow-600 focus:ring-yellow-600 border-gray-300"
                  />
                  <span className="ml-2 text-gray-700">Credit/Debit Card (Stripe)</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="mobile"
                    checked={formData.paymentMethod === 'mobile'}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-yellow-600 focus:ring-yellow-600 border-gray-300"
                  />
                  <span className="ml-2 text-gray-700">Mobile Money (MTN/Airtel)</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="flutterwave"
                    checked={formData.paymentMethod === 'flutterwave'}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-yellow-600 focus:ring-yellow-600 border-gray-300"
                  />
                  <span className="ml-2 text-gray-700">Other Payment Methods (Flutterwave)</span>
                </label>
              </div>
            </div>

            {/* Optional Message */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-2">
                Message (Optional)
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
                placeholder="Leave a message of encouragement..."
                rows={3}
              />
            </div>

            {/* Security Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="text-blue-600 text-xl mr-3">🔒</div>
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">Secure Donation</h4>
                  <p className="text-blue-700 text-sm">
                    Your payment information is encrypted and processed securely.
                    We never store your card details.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-12 py-4 rounded-lg font-semibold text-lg transition-all duration-300 ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[#f9d20a] hover:bg-[#e6b800] hover:scale-105 shadow-lg'
                } text-white`}
              >
                {isSubmitting ? 'Processing...' : `Donate $${formData.amount || '0'}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}