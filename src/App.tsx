import React, { useState, useEffect } from "react";
import { io } from 'socket.io-client';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Dashboard from "./pages/Dashboard";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import CreateBoardPage from "./pages/CreateBoardPage";

// Connect to the Socket.IO server with appropriate options
const socket = io("http://localhost:5173", {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
});

const App: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!user);

  useEffect(() => {
    // Check authentication status when user state changes
    if (user) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [user]);

  useEffect(() => {
    // Listen for updates
    socket.on('taskUpdated', (data) => {
      console.log('Task update received:', data);
    });

    // socket.on('connect_error', (error) => {
    //   console.error("Socket connection error:", error);
    // });

    return () => {
      // Cleanup socket connection on unmount
      socket.disconnect();
    };
  }, []);

  // Protected Route Component to restrict unauthenticated access
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    return isAuthenticated ? children : <Navigate to="/" replace />;
  };

  // Public Route Component to prevent authenticated users from accessing '/'
  const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    return isAuthenticated ? <Navigate to="/createBoard" replace /> : children;
  };

  return (
    <Router>
      <Routes>
        {/* Public Route - Redirect authenticated users to dashboard */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <Homepage />
            </PublicRoute>
          }
        />

        {/* Protected Route - Redirect unauthenticated users to homepage */}
        <Route
          path="/createBoard"
          element={
            <ProtectedRoute>
              <CreateBoardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/boards/:boardId"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Redirect any unknown route to homepage */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
