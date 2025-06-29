import React from 'react';

import { useNavigate } from 'react-router-dom';

function Services() {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-screen-xl mx-auto px-6 sm:px-10 py-20 bg-white min-h-screen">
      <button
        onClick={() => navigate('/')}
        className="mb-8 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Go to Home
      </button>
      <h1 className="text-4xl font-bold mb-6 text-gray-900 border-b-4 border-blue-600 pb-2">Our Services</h1>
      <p className="text-xl font-semibold text-gray-800 mb-8">
        SIMPLIFIED FINANCIAL SOLUTIONS OFFERING WIDE RANGE OF FINANCIAL PRODUCTS AND SERVICES
      </p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="p-6 bg-blue-50 rounded-lg shadow hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-semibold mb-2 text-blue-700">Personal Finance</h2>
          <p className="text-gray-700">
            Tailored financial planning and investment solutions to help you achieve your personal goals.
          </p>
        </div>
        <div className="p-6 bg-green-50 rounded-lg shadow hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-semibold mb-2 text-green-700">Business Finance</h2>
          <p className="text-gray-700">
            Comprehensive services for businesses including loans, payroll, and financial reporting.
          </p>
        </div>
        <div className="p-6 bg-purple-50 rounded-lg shadow hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-semibold mb-2 text-purple-700">Investment Advisory</h2>
          <p className="text-gray-700">
            Expert advice on investment opportunities to maximize your returns and minimize risks.
          </p>
        </div>
        <div className="p-6 bg-yellow-50 rounded-lg shadow hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-semibold mb-2 text-yellow-700">Loan Services</h2>
          <p className="text-gray-700">
            Flexible loan options with competitive rates to support your financial needs.
          </p>
        </div>
        <div className="p-6 bg-red-50 rounded-lg shadow hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-semibold mb-2 text-red-700">Insurance</h2>
          <p className="text-gray-700">
            Protect your assets and loved ones with our comprehensive insurance plans.
          </p>
        </div>
        <div className="p-6 bg-teal-50 rounded-lg shadow hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-semibold mb-2 text-teal-700">Retirement Planning</h2>
          <p className="text-gray-700">
            Plan your retirement with confidence through our personalized strategies.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Services;
