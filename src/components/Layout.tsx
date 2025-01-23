import React, { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

interface LayoutProps {
  children: ReactNode; // Properly typing the children prop
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-800 dark:text-gray-200 flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1">
        {/* Navbar */}
        <Navbar />
        
        {/* Dynamic Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
