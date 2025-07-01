import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

function Register() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);

  const requestOtp = async () => {
    if (!email) {
      alert('Please enter your email to receive OTP');
      return;
    }
    setOtpLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        setOtpSent(true);
        setOtpError('');
        alert('OTP sent to your email');
      } else {
        setOtpError(data.message || 'Failed to send OTP');
      }
    } catch (error) {
      setOtpError('Error sending OTP');
    } finally {
      setOtpLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) {
      setOtpError('Please enter the OTP');
      return;
    }
    setOtpLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await response.json();
      if (response.ok) {
        setOtpVerified(true);
        setOtpError('');
        alert('OTP verified successfully');
      } else {
        setOtpError(data.message || 'Invalid OTP');
      }
    } catch (error) {
      setOtpError('Error verifying OTP');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otpVerified) {
      alert('Please verify OTP before registering');
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role, address, pincode, mobileNumber, otp }),
      });
      const data = await response.json();
      if (data.token) {
        login({ ...data.user, token: data.token });
        navigate(`/${data.user.role}-dashboard`);
      } else {
        alert('Registration failed');
      }
    } catch (error) {
      alert('Error during registration');
    }
  };

  return (
    <div id="register-page" className="min-h-screen pt-16 bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
      <div className="w-full max-w-md mx-6 sm:mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <img src="/MMF_logo.png" alt="Maa Mahamaya Finance" className="h-10 w-auto mr-2" />
              <span className="text-2xl font-bold text-gray-900">Maa Mahamaya Finance</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
            <p className="text-gray-600">Join thousands of satisfied customers</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-600">*</span>
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setOtpSent(false);
                    setOtpVerified(false);
                    setOtp('');
                    setOtpError('');
                  }}
                  required
                  className="flex-grow px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={requestOtp}
                  disabled={otpLoading || otpSent}
                  className={`px-4 py-3 rounded-lg font-semibold text-white transition-colors ${
                    otpSent ? 'bg-green-600 cursor-default' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {otpLoading ? 'Sending...' : otpSent ? 'OTP Sent' : 'Send OTP'}
                </button>
              </div>
              {otpError && <p className="mt-1 text-xs text-red-600">{otpError}</p>}
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password <span className="text-red-600">*</span>
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 3C5 3 1.73 7.11 1 10c.73 2.89 4 7 9 7s8.27-4.11 9-7c-.73-2.89-4-7-9-7zM10 15a5 5 0 110-10 5 5 0 010 10z" />
                    <path d="M10 7a3 3 0 100 6 3 3 0 000-6z" />
                  </svg>
                )}
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number <span className="text-red-600">*</span>
              </label>
              <PhoneInput
                country={'in'}
                value={mobileNumber}
                onChange={setMobileNumber}
                inputProps={{
                  name: 'mobile',
                  required: true,
                  className:
                    'w-full px-4 py-3 pl-16 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-400 focus:border-blue-600 transition duration-300 ease-in-out',
                }}
                containerClass="w-full rounded-lg border border-gray-300 shadow-sm focus-within:ring-4 focus-within:ring-blue-400 focus-within:border-blue-600 transition duration-300 ease-in-out"
                inputClass="w-full bg-white"
                buttonClass="bg-white border-r border-gray-300 rounded-l-lg shadow-sm hover:bg-blue-50 transition duration-300 ease-in-out"
              />
              <p className="mt-1 text-xs text-gray-500">Enter your mobile number with country code.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pincode <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Type <span className="text-red-600">*</span>
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Account Type</option>
                <option value="customer">Personal Customer</option>
                <option value="business">Business Account</option>
                <option value="employee">Employee Access</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold text-lg transition-colors">
              Create Account
            </button>
          </form>

          {otpSent && !otpVerified && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter OTP <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {otpError && <p className="mt-1 text-xs text-red-600">{otpError}</p>}
              <button
                type="button"
                onClick={verifyOtp}
                disabled={otpLoading}
                className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold text-lg transition-colors"
              >
                {otpLoading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <button onClick={() => navigate('/login')} className="text-blue-600 hover:text-blue-700 font-medium">
                Sign In
              </button>
            </p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 w-full bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-lg font-semibold transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
