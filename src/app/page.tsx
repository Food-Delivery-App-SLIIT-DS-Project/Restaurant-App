'use client';

import React, { useState } from 'react';
import { signIn, signUp } from './api/authApi';
import Cookies from 'js-cookie';
import { CheckCircle } from 'lucide-react';

type AuthResponse = {
  success: boolean;
  message?: string;
  accessToken?: string;
  refreshToken?: string;
  userId?: string;
};

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [signupFullName, setSignupFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhoneNumber, setSignupPhoneNumber] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [showToast, setShowToast] = useState(false);

  const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const triggerToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  /*const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      triggerToast('Please enter both email and password.', 'error');
      return;
    }
    if (!isValidEmail(loginEmail)) {
      triggerToast('Please enter a valid email address.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const response = (await signIn({ email: loginEmail, password: loginPassword })) as AuthResponse;

      if (response.success) {
        if (response.accessToken && response.refreshToken && response.userId) {
          Cookies.set('accessToken', response.accessToken);
          Cookies.set('refreshToken', response.refreshToken);
          Cookies.set('userId', response.userId);
        }

        console.log('✅ Login success:', response);
        console.log('Access Token:', Cookies.get('accessToken'));
        console.log('Refresh Token:', Cookies.get('refreshToken'));
        console.log('User ID:', Cookies.get('userId'));

        triggerToast('Login successful!', 'success');

        // Keep the modal open for 1000ms before closing
        setTimeout(() => {
          setShowLogin(false);
        }, 1000);
      } else {
        triggerToast(response.message || 'Login failed. Please check credentials.', 'error');
      }
    } catch (error: any) {
      console.error('Login error:', error.message);
      triggerToast(error.message || 'Login failed. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };*/

  const handleLogin = async () => {
    // Simulate login without validation or API
    setIsLoading(true);
    try {
      // Simulated tokens
      const dummyAccessToken = 'dummy-access-token';
      const dummyRefreshToken = 'dummy-refresh-token';
      const dummyUserId = 'user123456';

      Cookies.set('accessToken', dummyAccessToken);
      Cookies.set('refreshToken', dummyRefreshToken);
      Cookies.set('userId', dummyUserId);

      console.log('✅ Dummy login success');
      console.log('Access Token:', Cookies.get('accessToken'));
      console.log('Refresh Token:', Cookies.get('refreshToken'));
      console.log('User ID:', Cookies.get('userId'));

      triggerToast('Login successful!', 'success');

      // Close modal after short delay
      setTimeout(() => {
        setShowLogin(false);
        window.location.reload();
      }, 1000);
    } catch (error: any) {
      console.error('Dummy login error:', error.message);
      triggerToast('Login failed. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };


  const handleSignup = async () => {
    if (!signupFullName || !signupEmail || !signupPhoneNumber || !signupPassword) {
      triggerToast('Please fill in all signup fields.', 'error');
      return;
    }
    if (!isValidEmail(signupEmail)) {
      triggerToast('Please enter a valid email address.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const response = (await signUp({
        fullName: signupFullName,
        email: signupEmail,
        phoneNumber: signupPhoneNumber,
        password: signupPassword,
        role: 'restaurant',
      })) as AuthResponse;

      if (response.success) {
        triggerToast('Signup successful! Please log in.', 'success');
        setShowSignup(false);
        setShowLogin(true);
      } else {
        triggerToast(response.message || 'Signup failed. Please try again.', 'error');
      }
    } catch (error: any) {
      console.error('Signup error:', error.message);
      triggerToast(error.message || 'Signup failed. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <img src="/images/bg.jpg" alt="Background" className="absolute inset-0 w-full h-full object-cover" />

      {/* Black overlay */}
      <div className="absolute inset-0 flex flex-col items-center text-white px-4">
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-6xl font-bold mb-4 animate-fadeIn">Welcome to Quick GRUBS..!</h1>
          <p className="text-ms mb-6 animate-fadeIn delay-200 bg-black/25 rounded-full px-4 py-2">
            Grow your restaurant business effortlessly 🚀
          </p>

          <div className="space-x-4 animate-fadeIn delay-300">
            <button onClick={() => setShowLogin(true)} className="bg-blue-600 hover:bg-blue-700 px-8 py-2 rounded text-lg">
              Login
            </button>
            <button onClick={() => setShowSignup(true)} className="bg-green-600 hover:bg-green-700 px-8 py-2 rounded text-lg">
              Signup
            </button>
          </div>

          <p className="text-sm text-amber-50 mt-6 animate-fadeIn delay-500 bg-black/50 rounded-full px-4 py-2">
            Trusted by 100+ Restaurants
          </p>

          {/* Advantages Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 px-4 w-full max-w-6xl">
            {advantages.map((adv, idx) => (
              <div
                key={idx}
                className={`bg-white/10 backdrop-blur-md rounded-xl p-6 flex flex-col items-center text-center text-white animate-fadeIn ${
                  idx === 0 ? 'delay-200' : idx === 1 ? 'delay-300' : 'delay-500'
                }`}
              >
                <CheckCircle className="text-green-400 mb-2" size={40} />
                <h3 className="text-xl font-semibold mb-2">{adv.title}</h3>
                <p className="text-sm text-gray-300">{adv.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {showLogin && (
        <Modal title="Login" onClose={() => setShowLogin(false)}>
          <input
            className="w-full border p-2 rounded mb-4"
            placeholder="Email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
          />
          <input
            className="w-full border p-2 rounded mb-4"
            type="password"
            placeholder="Password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
          />
          <button onClick={handleLogin} disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded">
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
          <p className="text-sm text-gray-600 mt-4">
            Don't have an account?{' '}
            <button
              onClick={() => {
                setShowLogin(false);
                setShowSignup(true);
              }}
              className="text-blue-600 hover:underline"
            >
              Sign up
            </button>
          </p>
        </Modal>
      )}

      {/* Signup Modal */}
      {showSignup && (
        <Modal title="Sign Up" onClose={() => setShowSignup(false)}>
          <input
            className="w-full border p-2 rounded mb-4"
            placeholder="Full Name"
            value={signupFullName}
            onChange={(e) => setSignupFullName(e.target.value)}
          />
          <input
            className="w-full border p-2 rounded mb-4"
            placeholder="Email"
            value={signupEmail}
            onChange={(e) => setSignupEmail(e.target.value)}
          />
          <input
            className="w-full border p-2 rounded mb-4"
            placeholder="Phone No."
            value={signupPhoneNumber}
            onChange={(e) => setSignupPhoneNumber(e.target.value)}
          />
          <input
            className="w-full border p-2 rounded mb-4"
            type="password"
            placeholder="Password"
            value={signupPassword}
            onChange={(e) => setSignupPassword(e.target.value)}
          />
          <button onClick={handleSignup} disabled={isLoading} className="w-full bg-green-600 hover:bg-green-700 text-white p-2 rounded">
            {isLoading ? 'Signing up...' : 'Signup'}
          </button>
          <p className="text-sm text-gray-600 mt-4">
            Already have an account?{' '}
            <button
              onClick={() => {
                setShowSignup(false);
                setShowLogin(true);
              }}
              className="text-green-600 hover:underline"
            >
              Log In
            </button>
          </p>
        </Modal>
      )}

      {/* Toast */}
      {showToast && (
        <div
          className={`fixed bottom-5 right-5 bg-${toastType === 'success' ? 'green' : 'red'}-500 text-white px-4 py-2 rounded shadow-lg animate-fadeIn`}
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
}

const Modal = ({ children, title, onClose }: { children: React.ReactNode; title: string; onClose: () => void }) => (
  <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/40">
    <div className="bg-amber-100 text-black rounded-xl p-8 w-full max-w-sm relative animate-fadeIn">
      <button onClick={onClose} className="absolute top-2 right-3 text-gray-600 text-2xl">
        &times;
      </button>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      {children}
    </div>
  </div>
);

const advantages = [
  {
    title: 'Increase Your Reach',
    description: 'Get discovered by thousands of hungry customers nearby.',
  },
  {
    title: 'Easy Order Management',
    description: 'Handle orders, deliveries, and payments from one simple dashboard.',
  },
  {
    title: 'Boost Sales',
    description: 'Our platform drives more orders to maximize your revenue!',
  },
];
