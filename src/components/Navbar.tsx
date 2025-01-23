import React, { useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi"; // Import icons

const Navbar: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  };

  return (
    <nav className="bg-blue-600 dark:bg-gray-800 p-4 transition-all duration-300">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white dark:text-gray-200 text-xl font-bold">
          Kanban App
        </h1>
        <button
          onClick={toggleTheme}
          className="relative w-14 h-8 flex items-center bg-white dark:bg-gray-700 rounded-full p-1 shadow transition-all duration-300"
        >
          {/* Toggle Circle */}
          <span
            className={`absolute w-6 h-6 bg-blue-600 dark:bg-gray-200 rounded-full transition-transform duration-300 ${
              isDarkMode ? "translate-x-6" : "translate-x-0"
            }`}
          ></span>
          {/* Sun and Moon Icons */}
          <FiSun
            className={`absolute left-2 text-yellow-500 transition-opacity duration-300 ${
              isDarkMode ? "opacity-0" : "opacity-100"
            }`}
            size={16}
          />
          <FiMoon
            className={`absolute right-2 text-gray-300 transition-opacity duration-300 ${
              isDarkMode ? "opacity-100" : "opacity-0"
            }`}
            size={16}
          />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
