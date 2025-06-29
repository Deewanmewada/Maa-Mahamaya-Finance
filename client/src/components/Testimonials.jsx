import React from 'react';
import { useNavigate } from 'react-router-dom';

function Testimonials() {
  const navigate = useNavigate();

  const testimonials = [
    {
      quote: "Maa Mahamaya Finance helped me secure my future with their expert advice and personalized service.",
      name: "John Doe",
      role: "Entrepreneur",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700"
    },
    {
      quote: "The team at Maa Mahamaya Finance is professional and trustworthy. Highly recommended!",
      name: "Jane Smith",
      role: "Small Business Owner",
      bgColor: "bg-green-50",
      textColor: "text-green-700"
    },
    {
      quote: "Excellent customer service and financial solutions tailored to my needs.",
      name: "Michael Johnson",
      role: "Freelancer",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700"
    },
    {
      quote: "Their financial planning helped me achieve my goals efficiently.",
      name: "Emily Davis",
      role: "Investor",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-700"
    },
    {
      quote: "Reliable and transparent service with great support.",
      name: "Robert Brown",
      role: "Business Owner",
      bgColor: "bg-red-50",
      textColor: "text-red-700"
    },
    {
      quote: "I highly recommend Maa Mahamaya Finance for all your financial needs.",
      name: "Linda Wilson",
      role: "Consultant",
      bgColor: "bg-teal-50",
      textColor: "text-teal-700"
    }
  ];

  return (
    <div className="w-full max-w-screen-xl mx-auto px-6 sm:px-10 py-20 bg-white min-h-screen">
      <button
        onClick={() => navigate('/')}
        className="mb-8 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Go to Home
      </button>
      <h1 className="text-4xl font-bold mb-6 text-gray-900 border-b-4 border-blue-600 pb-2">Testimonials</h1>
      <p className="text-xl font-semibold text-gray-800 mb-8">
        Hear what our customers have to say about us.
      </p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map(({ quote, name, role, bgColor, textColor }, index) => (
          <div key={index} className={`${bgColor} p-6 rounded-lg shadow hover:shadow-lg transition-shadow`}>
            <p className="text-gray-700 mb-6">"{quote}"</p>
            <h2 className={`text-2xl font-semibold mb-2 ${textColor}`}>{name}</h2>
            <p className="text-gray-700">{role}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Testimonials;
