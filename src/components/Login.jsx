/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import Cookies from 'js-cookie'; // Import js-cookie

const Login = () => {
  const { login } = useAuth();

  useEffect(() => {
    // Simulate login after OAuth redirection
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      login(JSON.parse(storedUser));
    }
  }, [login]);

  const handleLogin = () => {
    window.location.href = 'http://localhost:8000/auth/google';
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Login box */}
      <div className="relative bg-gray-900 shadow-lg rounded-lg p-6 sm:p-8 md:p-10 lg:p-12 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl w-full z-10 shadow-blue-500/50 animate-slide-up">
        <style>
          {`
            @keyframes slide-up {
              0% {
                transform: translateY(50%);
                opacity: 0;
              }
              100% {
                transform: translateY(0);
                opacity: 1;
              }
            }
            .animate-slide-up {
              animation: slide-up 0.6s ease-out;
            }
          `}
        </style>
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-center text-sky-400">
          Please login to access the dashboard
        </h2>
        <button
          onClick={handleLogin}
          className="w-full flex items-center justify-center px-3 py-2 sm:px-4 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition duration-200 transform hover:scale-105 shadow-lg"
        >
          Login with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
