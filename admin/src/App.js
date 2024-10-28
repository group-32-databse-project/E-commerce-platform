// src/App.jsx

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Import Components and Pages
import Layout from "./components/Layout";
import Categories from "./pages/Categories";
import Products from "./pages/Products";
import SalesReport from "./pages/SalesReport";
import SignIn from "./pages/SignIn";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp"; // Ensure you have a SignUp component
import ForgotPassword from "./pages/ForgotPassword"; // Ensure you have a ForgotPassword component

import { useAuth } from "./context/AuthContext"; // Import useAuth hook

function App() {
  const auth = useAuth();

  // Component to protect routes
  const ProtectedRoute = ({ children }) => {
    if (!auth.isAuthenticated) {
      return <Navigate to="/signin" replace />;
    }
    return children;
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Routes Wrapped with Layout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* Nested Routes */}
          <Route path="home" element={<Home />} />
          <Route path="categories" element={<Categories />} />
          <Route path="products" element={<Products />} />
          <Route path="sales-report" element={<SalesReport />} />

          {/* Redirect root to home */}
          <Route index element={<Navigate to="home" replace />} />
        </Route>

        {/* Catch-All Route */}
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    </Router>
  );
}

export default App;