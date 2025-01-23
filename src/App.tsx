import React, { useState, useEffect } from "react";
import { io } from 'socket.io-client'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Navbar from "../../client/src/components/Navbar";
import Layout from "../../client/src/components/Layout";
import Dashboard from "./pages/Dashboard";

const socket = io("http://localhost:5173"); // Replace with your server URL
const App: React.FC = () => {
  useEffect(() => {
    // Listen for updates
    socket.on('taskUpdated', (data) => {
      console.log('Task update received:', data);
    });

    return () => {
      // Cleanup
      socket.disconnect();
    };
  }, []);

  // const updateTask = (task: any) => {
  //   // Emit a taskUpdated event
  //   socket.emit('taskUpdated', task);
  // };
  // State to track authentication status
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Simulate a login function (Replace with real logic)
  // const handleLogin = () => setIsAuthenticated(true);
  // const handleLogout = () => setIsAuthenticated(false);

  // Protected Route Component
  // const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  //   return isAuthenticated ? (
  //     <>{children}</>
  //   ) : (
  //     <Navigate to="/" replace />
  //   );
  // };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Homepage />} />
        {/* Protected Routes (with Layout) */}
        <Route
          path="/dashboard"
          element={
            // <ProtectedRoute>
            <Dashboard />
            // </ProtectedRoute>
          }
        />
        {/* <Route
          path="/shared-boards"
          element={
            <ProtectedRoute>
              <Layout>
                <SharedBoards />
              </Layout>
            </ProtectedRoute>
          }
        /> */}
        {/* <Route
          path="/create-board"
          element={
            <ProtectedRoute>
              <Layout>
                <CreateBoard />
              </Layout>
            </ProtectedRoute>
          }
        /> */}
      </Routes>
    </Router>
  );
};

export default App;
