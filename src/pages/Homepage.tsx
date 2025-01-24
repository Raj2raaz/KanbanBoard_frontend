import React, { useState } from "react";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";
import Navbar from "../components/Navbar";
import { FaSignInAlt, FaUserPlus } from "react-icons/fa";

const Homepage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-700 flex flex-col text-gray-900 dark:text-gray-200 transition-all duration-300">
      <Navbar/>
      <div className="flex-1 flex flex-col justify-center items-center px-6">
        {/* Toggle Button */}
        <div className="flex items-center justify-center mb-10">
          <div className="relative w-52 h-14 bg-gray-300 dark:bg-gray-700 rounded-full shadow-inner">
            {/* Sliding Toggle */}
            <div
              className={`absolute top-1 left-2 w-24 h-12 bg-blue-600 dark:bg-blue-500 rounded-full shadow-md transform transition-transform duration-300 ${isLogin ? "translate-x-0" : "translate-x-full"
                }`}
            ></div>
            <div className="absolute inset-0 flex justify-between items-center px-4">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex items-center gap-2 text-sm font-medium ${isLogin ? "text-white" : "text-gray-500 dark:text-gray-300"
                  }`}
              >
                <FaSignInAlt /> Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex items-center gap-2 text-sm font-medium ${!isLogin ? "text-white" : "text-gray-500 dark:text-gray-300"
                  }`}
              >
                <FaUserPlus /> Sign Up
              </button>
            </div>
          </div>
        </div>

        {/* Render Form */}
        <div className="w-full max-w-sm p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          {isLogin ? <LoginForm /> : <SignupForm />}
        </div>
      </div>
    </div>
  );
};

export default Homepage;
