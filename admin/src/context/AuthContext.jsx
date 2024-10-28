// src/context/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from "react";

// Create the AuthContext with default values
const AuthContext = createContext({
  isAuthenticated: false,
  userName: null,
  customerId: null,
  signin: () => {},
  signout: () => {},
});

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

// AuthProvider component that wraps around the children components
export const AuthProvider = ({ children }) => {
  // Initialize state based on localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem("token");
  });

  const [userName, setUserName] = useState(() => {
    return localStorage.getItem("Name") || null;
  });

  const [customerId, setCustomerId] = useState(() => {
    return localStorage.getItem("customerId") || null;
  });

  // Function to handle sign-in
  const signin = (token, name, custId) => {
    localStorage.setItem("token", token);
    localStorage.setItem("Name", name);
    localStorage.setItem("customerId", custId);

    setIsAuthenticated(true);
    setUserName(name);
    setCustomerId(custId);
  };

  // Function to handle sign-out
  const signout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("Name");
    localStorage.removeItem("customerId");

    setIsAuthenticated(false);
    setUserName(null);
    setCustomerId(null);
  };

  // Effect to synchronize state with localStorage changes (optional)
  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem("token"));
      setUserName(localStorage.getItem("Name") || null);
      setCustomerId(localStorage.getItem("customerId") || null);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Context value that will be supplied to any descendants of this component.
  const value = {
    isAuthenticated,
    userName,
    customerId,
    signin,
    signout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};