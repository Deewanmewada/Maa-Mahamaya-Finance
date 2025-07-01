import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function MobileSidebar({ isOpen, onClose, navigate, user, logout }) {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      ></div>
      <aside className="fixed top-0 left-0 bottom-0 w-64 bg-slate-900 text-white z-50 p-6 flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Menu</h2>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="text-white hover:text-gray-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="flex flex-col space-y-4">
          <button onClick={() => { navigate('/'); onClose(); }} className="text-gray-300 hover:text-white text-left">HOME</button>
          <button className="text-gray-300 hover:text-white text-left">PAGES</button>
          <button onClick={() => { navigate('/services'); onClose(); }} className="text-gray-300 hover:text-white text-left">SERVICES</button>
          <button className="text-gray-300 hover:text-white text-left">PROJECT</button>
          <button onClick={() => { navigate('/testimonials'); onClose(); }} className="text-gray-300 hover:text-white text-left">TESTIMONIALS</button>
          <button className="text-gray-300 hover:text-white text-left">CONTACT US</button>
          {user ? (
            <>
              <button
                onClick={() => {
                  if (user.role === 'employee') {
                    navigate('/employee-dashboard');
                  } else if (user.role === 'admin') {
                    navigate('/admin-dashboard');
                  } else if (user.role === 'customer') {
                    navigate('/customer-dashboard');
                  } else if (user.role === 'business') {
                    navigate('/business-dashboard');
                  } else {
                    navigate('/');
                  }
                  onClose();
                }}
                className="text-white font-semibold hover:underline text-left"
              >
                Hello, {user.name}
              </button>
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                  onClose();
                }}
                className="btn-secondary text-white px-4 py-2 rounded-full font-medium text-left"
              >
                Logout
              </button>
            </>
          ) : (
            <button onClick={() => { navigate('/login'); onClose(); }} className="btn-primary text-white px-6 py-2 rounded-full font-medium text-left">
              SIGN IN
            </button>
          )}
        </nav>
      </aside>
    </>
  );
}

function Home() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const partnerLogos = [
    "/icc.png",
    "/HDFC.png",
    "/yes bank.png",
    "/induslnd bank.png",
    "/indian bank.png",
    "/canra bank.png",
    "/Allied bank.jpg",
    "/pnb bank.png",
    "/union bank.png",
    "/idfc.png",
    "/citi bank.png",
    "/public.png",
    "/sbi.png",
    "/Kotak.jpg",
    "/Axis.png",
    "/BOI.png",
    "/U.png",
    "/airtle.png"
  ];

  return (
    <div>
      {/* Navigation */}
      <nav className="bg-slate-900 shadow-lg fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <img src="/MMF_logo.png" alt="Maa Mahamaya Finance" className="h-8 w-auto mr-2" />
                <span className="text-white text-xl font-bold">Maa Mahamaya Finance</span>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-8" role="menu" aria-label="Main menu">
              <button onClick={() => navigate('/')} className="text-gray-300 hover:text-white transition-colors" role="menuitem">HOME</button>
              <button className="text-gray-300 hover:text-white transition-colors" role="menuitem">PAGES</button>
              <button onClick={() => navigate('/services')} className="text-gray-300 hover:text-white transition-colors" role="menuitem">SERVICES</button>
              <button className="text-gray-300 hover:text-white transition-colors" role="menuitem">PROJECT</button>
              <button className="text-gray-300 hover:text-white transition-colors" onClick={() => navigate('/testimonials')} role="menuitem">TESTIMONIALS</button>
              <button className="text-gray-300 hover:text-white transition-colors" role="menuitem">CONTACT US</button>
              {user ? (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => {
                      if (user.role === 'employee') {
                        navigate('/employee-dashboard');
                      } else if (user.role === 'admin') {
                        navigate('/admin-dashboard');
                      } else if (user.role === 'customer') {
                        navigate('/customer-dashboard');
                      } else if (user.role === 'business') {
                        navigate('/business-dashboard');
                      } else {
                        navigate('/');
                      }
                    }}
                    className="text-white font-semibold hover:underline focus:outline-none"
                    role="menuitem"
                  >
                    Hello, {user.name}
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      navigate('/');
                    }}
                    className="btn-secondary text-white px-4 py-2 rounded-full font-medium"
                    role="menuitem"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button onClick={() => navigate('/login')} className="btn-primary text-white px-6 py-2 rounded-full font-medium" role="menuitem">
                  SIGN IN
                </button>
              )}
            </div>
            <div className="md:hidden flex items-center">
              <button
                id="mobile-menu-btn"
                className="text-gray-300 hover:text-white"
                aria-label="Toggle menu"
                aria-expanded={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <MobileSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navigate={navigate}
        user={user}
        logout={logout}
      />

      {/* Hero Section */}
      <section className="hero-gradient min-h-screen flex items-center pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-white space-y-8">
            <div className="inline-block bg-blue-600 bg-opacity-80 text-white px-6 py-3 rounded-full text-lg font-semibold shadow-lg max-w-max mx-auto">
              PLAN FOR SECURE FUTURE
            </div>
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                LEADING
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">FINANCIAL</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-lg">
                True relationships developing the futures. Comprehensive financial solutions for individuals and businesses.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => navigate('/register')} className="btn-primary text-white px-8 py-4 rounded-full font-semibold text-lg flex items-center justify-center">
                Get Started
                <i className="fas fa-arrow-right ml-2"></i>
              </button>
              <button onClick={() => navigate('/login')} className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-slate-900 transition-colors">
                Sign In
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="bg-white rounded-2xl p-8 shadow-2xl">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto">
                  <i className="fas fa-user text-white"></i>
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-800">Professional Finance</h3>
                  <p className="text-gray-600">Trusted by 50,000+ clients</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Portfolio Growth</span>
                  <span className="text-green-600 font-semibold">+24.5%</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Monthly Savings</span>
                  <span className="text-blue-600 font-semibold">$2,480</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Investment Return</span>
                  <span className="text-green-600 font-semibold">+18.7%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Maa Mahamaya Finance?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide comprehensive financial solutions tailored to your needs
            </p>
          </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="card-hover text-center p-8 bg-gray-50 rounded-xl">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-shield-alt text-white text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Secure & Safe</h3>
                <p className="text-gray-600">Bank-level security with 256-bit encryption</p>
              </div>
              <div className="card-hover text-center p-8 bg-gray-50 rounded-xl">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-chart-line text-white text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Smart Analytics</h3>
                <p className="text-gray-600">AI-powered insights for better decisions</p>
              </div>
              <div className="card-hover text-center p-8 bg-gray-50 rounded-xl">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-users text-white text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Expert Support</h3>
                <p className="text-gray-600">24/7 support from certified professionals</p>
              </div>
              <div className="card-hover text-center p-8 bg-gray-50 rounded-xl">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-mobile-alt text-white text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Mobile First</h3>
                <p className="text-gray-600">Access your finances anywhere, anytime</p>
              </div>
            </div>
        </div>
      </section>

      {/* Partner Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Trusted Partners</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We proudly collaborate with these trusted financial institutions.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 items-center">
            {partnerLogos.map((logo, index) => (
              <div key={index} className="flex justify-center items-center p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                <img src={logo} alt={`Partner logo ${index + 1}`} className="max-h-16 object-contain" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-slate-900 text-gray-300 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white text-xl font-bold mb-4">Maa Mahamaya Finance</h3>
            <p className="text-gray-400 max-w-sm">
              Providing trusted financial solutions for individuals and businesses. Secure your future with us.
            </p>
          </div>
          <div>
            <h3 className="text-white text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><button onClick={() => navigate('/')} className="hover:text-white transition-colors">Home</button></li>
              <li><button onClick={() => navigate('/services')} className="hover:text-white transition-colors">Services</button></li>
              <li><button onClick={() => navigate('/register')} className="hover:text-white transition-colors">Sign Up</button></li>
              <li><button onClick={() => navigate('/login')} className="hover:text-white transition-colors">Sign In</button></li>
              <li><button className="hover:text-white transition-colors">Contact Us</button></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white text-xl font-bold mb-4">Contact Us</h3>
            <p>123 Finance Street</p>
            <p>City, State, 12345</p>
            <p>Email: support@maamahamayafinance.com</p>
            <p>Phone: (123) 456-7890</p>
            <div className="flex space-x-4 mt-4">
              <a href="#" aria-label="Facebook" className="hover:text-white"><i className="fab fa-facebook-f"></i></a>
              <a href="#" aria-label="Twitter" className="hover:text-white"><i className="fab fa-twitter"></i></a>
              <a href="https://www.linkedin.com/company/maa-mahamaya-finance/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-white"><i className="fab fa-linkedin-in"></i></a>
              <a href="#" aria-label="Instagram" className="hover:text-white"><i className="fab fa-instagram"></i></a>
            </div>
          </div>
        </div>
        <div className="text-center text-gray-500 mt-8">
          &copy; {new Date().getFullYear()} Maa Mahamaya Finance. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default Home;
